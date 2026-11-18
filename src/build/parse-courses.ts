// Build-time parser: turns courses/<folder>/{course.md, placement-quiz.md, lessons/*.md}
// into CourseData. Runs in Node (Vite plugin and tests), never in the browser.
//
// The format is set by AGENTS.md. The parser fails loudly on anything that would lose an
// answer or an ID (broken item heading, missing <details>, duplicate ID), because a silent
// skip would drop items from the app and from the export without anyone noticing.

import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, basename } from 'node:path';
import { Marked } from 'marked';
import { parse as parseYaml } from 'yaml';
import type { Block, Course, CourseData, Item, ItemType, Lesson, Placement, Source } from '../types';
import { parseCheck, parseDecide, parsePoints, parsePredict, parseVisual } from './parse-blocks.ts';

const ITEM_TYPES: ItemType[] = ['open', 'why', 'scenario', 'recall'];
// "### gd-econ/endowment/r2 · recall" (the separator is U+00B7, middle dot)
const ITEM_HEADING = /^###\s+(\S+)\s+·\s+(\S+)\s*$/;

export class CourseFormatError extends Error {}

function fail(file: string, msg: string): never {
  throw new CourseFormatError(`${file}: ${msg}`);
}

export function splitFrontMatter(text: string, file: string): { data: Record<string, unknown>; body: string } {
  const src = text.replace(/\r\n?/g, '\n').replace(/^﻿/, '');
  const m = /^---\n([\s\S]*?)\n---\n?/.exec(src);
  if (!m) fail(file, 'no front matter (the file must start with a --- block)');
  const data = parseYaml(m[1]) as Record<string, unknown>;
  if (!data || typeof data !== 'object') fail(file, 'front matter is not a mapping');
  return { data, body: src.slice(m[0].length) };
}

function str(data: Record<string, unknown>, key: string, file: string, required = true): string {
  const v = data[key];
  if (v === undefined || v === null || v === '') {
    if (required) fail(file, `front matter is missing "${key}"`);
    return '';
  }
  return String(v);
}

/** Rewrites links to sibling Markdown files into app routes. */
type LinkMap = Map<string, string>; // file basename -> app hash route

function rewriteLinks(md: string, links: LinkMap): string {
  return md.replace(/\]\(([^)\s]+\.md)(#[^)\s]*)?\)/g, (whole, target: string) => {
    const route = links.get(basename(target));
    return route ? `](${route})` : whole;
  });
}

function makeMarked(links: LinkMap) {
  const marked = new Marked({ gfm: true, async: false });
  return (md: string) => marked.parse(rewriteLinks(md, links)) as string;
}

interface ParsedBody {
  blocks: Block[];
  items: Item[];
}

/**
 * Splits a lesson or quiz body into sections, prose and items.
 * An item runs from its "### id · type" heading to the next heading of level 1 to 3.
 */
function parseBody(body: string, file: string, parentId: string, render: (md: string) => string, allowBlocks: boolean): ParsedBody {
  const lines = body.split('\n');
  const failHere = (msg: string): never => fail(file, msg);
  const where = allowBlocks ? '' : ' (a placement quiz holds items only)';
  const blocks: Block[] = [];
  const items: Item[] = [];
  let prose: string[] = [];
  let inFence = false;

  const flushProse = () => {
    const md = prose.join('\n').trim();
    prose = [];
    if (!md) return;
    if (/<details>|<\/details>/i.test(md)) fail(file, 'a <details> answer block sits outside an item (no "### <id> · <type>" heading above it)');
    blocks.push({ kind: 'prose', html: render(md) });
  };

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    // Fenced blocks that are not items: check, predict, decide, visual. Each becomes its own block, never prose.
    const fence = inFence ? null : FENCE_START.exec(line);
    if (fence) {
      const kind = fence[1];
      if (!allowBlocks) fail(file, `a "\`\`\`${kind}" block is not allowed here${where}`);
      if (kind === 'points') fail(file, 'a "```points" block must sit directly after an item\'s </details>');
      flushProse();
      const { yaml, next } = readFence(lines, i, kind, file);
      i = next;
      if (kind === 'check') blocks.push({ kind: 'check', check: parseCheck(yaml, parentId, failHere) });
      else if (kind === 'predict') blocks.push({ kind: 'predict', predict: parsePredict(yaml, parentId, failHere) });
      else if (kind === 'decide') blocks.push({ kind: 'decide', decide: parseDecide(yaml, parentId, failHere) });
      else blocks.push({ kind: 'visual', visual: parseVisual(yaml, parentId, failHere) });
      continue;
    }
    // The chunk break marker: its own line, a blank line either side. Splits prose for the one-screen flows.
    if (!inFence && line.trim() === '<!-- break -->') {
      if (!allowBlocks) fail(file, `a chunk break marker is not allowed here${where}`);
      if ((i > 0 && lines[i - 1].trim() !== '') || (i + 1 < lines.length && lines[i + 1].trim() !== '')) {
        fail(file, 'a "<!-- break -->" marker needs a blank line before it and after it');
      }
      flushProse();
      blocks.push({ kind: 'break' });
      i++;
      continue;
    }
    if (/^\s*(```|~~~)/.test(line)) inFence = !inFence;
    if (inFence) { prose.push(line); i++; continue; }

    if (/^# /.test(line)) { i++; continue; } // page title; the front matter title is used instead
    if (/^## /.test(line)) {
      flushProse();
      blocks.push({ kind: 'section', title: line.replace(/^##\s+/, '').trim() });
      i++;
      continue;
    }
    if (/^### /.test(line) && line.includes('·')) {
      flushProse();
      const m = ITEM_HEADING.exec(line);
      if (!m) fail(file, `bad item heading "${line}" (expected "### <id> · <type>")`);
      const [, id, type] = m;
      if (!ITEM_TYPES.includes(type as ItemType)) fail(file, `item ${id} has unknown type "${type}" (allowed: ${ITEM_TYPES.join(', ')})`);
      if (!id.startsWith(parentId + '/')) fail(file, `item ${id} does not start with "${parentId}/"`);
      const rest = id.slice(parentId.length + 1);
      if (!rest || rest.includes('/')) fail(file, `item ${id} must have exactly one part after "${parentId}/"`);

      // Collect the item's lines up to the next heading of level 1 to 3.
      const itemLines: string[] = [];
      i++;
      while (i < lines.length && !/^#{1,3} /.test(lines[i])) { itemLines.push(lines[i]); i++; }
      const text = itemLines.join('\n');
      const open = text.search(/<details>/i);
      const close = text.search(/<\/details>/i);
      if (open < 0 || close < 0 || close < open) fail(file, `item ${id} has no complete <details> answer block`);
      const promptMd = text.slice(0, open).trim();
      if (!promptMd) fail(file, `item ${id} has no prompt text`);
      const inner = text.slice(open + '<details>'.length, close);
      // What follows </details>: only blank lines and fenced blocks may. The rest is read by this loop again.
      const afterMsg = `item ${id} has text after its </details>; move it into the answer or below a new heading`;
      const closeLine = text.slice(0, close).split('\n').length - 1;
      if (text.slice(close + '</details>'.length).split('\n')[0].trim()) fail(file, afterMsg);
      const itemEnd = i;
      i -= itemLines.length - (closeLine + 1);
      const sm = /<summary>([\s\S]*?)<\/summary>/i.exec(inner);
      const answerLabel = sm ? sm[1].trim() : 'Answer';
      const answerMd = (sm ? inner.replace(sm[0], '') : inner).trim();
      if (!answerMd) fail(file, `item ${id} has an empty answer`);

      const item: Item = {
        id,
        type: type as ItemType,
        parentId,
        promptHtml: render(promptMd),
        answerHtml: render(answerMd),
        answerLabel,
      };
      const lm = /Lesson (\d+)\.?\s*$/.exec(answerMd);
      if (lm) item.targetLessonOrder = Number(lm[1]);
      items.push(item);
      blocks.push({ kind: 'item', item });

      // A points block sits directly after the item's </details>, and only there.
      let j = i;
      while (j < itemEnd && lines[j].trim() === '') j++;
      if (j < itemEnd && /^```points\s*$/.test(lines[j])) {
        if (!allowBlocks) fail(file, `a "\`\`\`points" block is not allowed here${where}`);
        const { yaml, next } = readFence(lines, j, 'points', file);
        const points = parsePoints(yaml, failHere);
        if (points.for !== id) fail(file, `points for ${points.for}: it sits after item ${id}, so "for" must name that item`);
        if (type !== 'why' && type !== 'scenario') fail(file, `points for ${id}: "for" must name a why or scenario item, not ${type}`);
        blocks.push({ kind: 'points', points });
        i = next;
      }
      // Anything else left before the next heading must be a block fence; stray text is an error.
      for (let k = i; k < itemEnd; k++) {
        const t = lines[k];
        if (t.trim() === '') continue;
        const f = FENCE_START.exec(t);
        if (!f) fail(file, afterMsg);
        if (!allowBlocks) fail(file, `a "\`\`\`${f[1]}" block is not allowed here${where}`);
        k = readFence(lines, k, f[1], file).next - 1;
      }
      continue;
    }
    prose.push(line);
    i++;
  }
  flushProse();
  checkBlockLinks(blocks, items, file);
  return { blocks, items };
}

const FENCE_START = /^```(check|predict|decide|visual|points)\s*$/;

/** Reads a fenced block from its opening line; returns its text and the index of the line after the closing fence. */
function readFence(lines: string[], start: number, kind: string, file: string): { yaml: string; next: number } {
  const inner: string[] = [];
  let k = start + 1;
  while (k < lines.length && !/^```\s*$/.test(lines[k])) { inner.push(lines[k]); k++; }
  if (k >= lines.length) fail(file, `a "\`\`\`${kind}" block is never closed`);
  return { yaml: inner.join('\n'), next: k + 1 };
}

/** The rules that look across blocks of one file: duplicate ids, `covers` and `visual` links. */
function checkBlockLinks(blocks: Block[], items: Item[], file: string) {
  const seen = new Set(items.map((it) => it.id));
  const itemById = new Map(items.map((it) => [it.id, it]));
  const visualIds = new Set<string>();
  for (const b of blocks) {
    const id = b.kind === 'check' ? b.check.id : b.kind === 'predict' ? b.predict.id : b.kind === 'decide' ? b.decide.id : b.kind === 'visual' ? b.visual.id : '';
    if (!id) continue;
    if (seen.has(id)) fail(file, `duplicate id "${id}" (used twice in this file)`);
    seen.add(id);
    if (b.kind === 'visual') visualIds.add(id);
  }
  for (const b of blocks) {
    if (b.kind !== 'predict') continue;
    const cov = itemById.get(b.predict.covers);
    if (!cov) fail(file, `predict ${b.predict.id}: "covers" names "${b.predict.covers}", which is not an item in this lesson`);
    if (cov.type !== 'recall') fail(file, `predict ${b.predict.id}: "covers" must name a recall item, but ${cov.id} is a ${cov.type} item`);
    if (b.predict.visual !== undefined && !visualIds.has(b.predict.visual)) fail(file, `predict ${b.predict.id}: "visual" names "${b.predict.visual}", which is not a visual block in this lesson`);
  }
}

function parseSources(raw: unknown, file: string): Source[] {
  if (raw === undefined || raw === null) return [];
  if (!Array.isArray(raw)) fail(file, '"sources" must be a list');
  return raw.map((s, n) => {
    if (!s || typeof s !== 'object' || !('cite' in s)) fail(file, `source ${n + 1} has no "cite"`);
    const o = s as Record<string, unknown>;
    // Credibility tier (AGENTS.md rule 4): 1 peer-reviewed, 2 preprint or report, 3 studio's own data.
    const tier = Number(o.tier);
    if (tier !== 1 && tier !== 2 && tier !== 3) fail(file, `source ${n + 1} needs "tier: 1", "tier: 2" or "tier: 3" (got ${o.tier === undefined ? 'nothing' : JSON.stringify(o.tier)})`);
    // Every source links to the paper itself (AGENTS.md rule 4), so a reader can open it from the lesson.
    const url = o.url === undefined || o.url === null ? '' : String(o.url).trim();
    if (!/^https:\/\/\S+$/.test(url)) fail(file, `source ${n + 1} needs an https link in "url" (got ${url ? JSON.stringify(url) : 'nothing'})`);
    return {
      cite: String(o.cite),
      url,
      grade: o.grade ? String(o.grade) : undefined,
      tier: tier as 1 | 2 | 3,
      note: o.note ? String(o.note) : undefined,
      read: o.read ? String(o.read) : undefined,
      caveat: o.caveat ? String(o.caveat) : undefined,
    };
  });
}

/** The date of the last passed source check, as YYYY-MM-DD, or undefined when the lesson is unchecked. */
function checkedDate(data: Record<string, unknown>, file: string): string | undefined {
  const v = data.checked;
  if (v === undefined || v === null || v === '') return undefined;
  const s = v instanceof Date ? v.toISOString().slice(0, 10) : String(v);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s) || Number.isNaN(Date.parse(s))) fail(file, `"checked" must be a date as YYYY-MM-DD (got ${JSON.stringify(s)})`);
  return s;
}

/** "lessons_planned" from course.md: a whole number of lessons, or undefined when the course does not declare one. */
function plannedCount(data: Record<string, unknown>, file: string): number | undefined {
  const v = data.lessons_planned;
  if (v === undefined || v === null || v === '') return undefined;
  if (typeof v !== 'number' || !Number.isInteger(v) || v < 1) fail(file, `"lessons_planned" must be a whole number of 1 or more (got ${JSON.stringify(v)})`);
  return v;
}

export function parseCourseFolder(dir: string): Course {
  const folder = basename(dir);
  const courseFile = join(dir, 'course.md');
  const cfm = splitFrontMatter(readFileSync(courseFile, 'utf8'), courseFile);
  const courseId = str(cfm.data, 'id', courseFile);
  if (courseId.includes('/')) fail(courseFile, `course id "${courseId}" must not contain "/"`);

  // First pass over lesson files: front matter only, to build the link map.
  const lessonDir = join(dir, 'lessons');
  const lessonFiles = existsSync(lessonDir)
    ? readdirSync(lessonDir).filter((f) => f.endsWith('.md')).sort()
    : [];
  const heads = lessonFiles.map((f) => {
    const path = join(lessonDir, f);
    const { data, body } = splitFrontMatter(readFileSync(path, 'utf8'), path);
    return { f, path, data, body };
  });

  const links: LinkMap = new Map();
  const placementFile = join(dir, 'placement-quiz.md');
  const placementId = `${courseId}/placement`;
  if (existsSync(placementFile)) links.set('placement-quiz.md', `#/placement/${encodeURIComponent(placementId)}`);
  links.set('course.md', `#/course/${encodeURIComponent(courseId)}`);
  for (const h of heads) {
    const id = str(h.data, 'id', h.path);
    links.set(h.f, `#/lesson/${encodeURIComponent(id)}`);
  }
  const render = makeMarked(links);

  const lessons: Lesson[] = heads.map(({ f, path, data, body }) => {
    const id = str(data, 'id', path);
    const course = str(data, 'course', path);
    if (course !== courseId) fail(path, `"course: ${course}" does not match the course id "${courseId}"`);
    if (!id.startsWith(courseId + '/')) fail(path, `lesson id "${id}" must start with "${courseId}/"`);
    const slug = id.slice(courseId.length + 1);
    if (!slug || slug.includes('/')) fail(path, `lesson id "${id}" must be "<course-id>/<lesson-slug>"`);
    const order = Number(str(data, 'order', path));
    if (!Number.isFinite(order)) fail(path, '"order" must be a number');
    const { blocks, items } = parseBody(body, path, id, render, true);
    return {
      id,
      slug,
      file: `lessons/${f}`,
      title: str(data, 'title', path),
      order,
      status: str(data, 'status', path, false) || 'draft',
      checked: checkedDate(data, path),
      ledgerUrl: existsSync(join(dir, 'ledgers', f))
        ? `https://github.com/Thraez/learning-app/blob/main/courses/${folder}/ledgers/${f}`
        : undefined,
      sources: parseSources(data.sources, path),
      blocks,
      itemIds: items.map((it) => it.id),
    };
  });
  lessons.sort((a, b) => a.order - b.order || a.id.localeCompare(b.id));

  const lessonsPlanned = plannedCount(cfm.data, courseFile);
  const orders = new Set(lessons.map((l) => l.order));
  if (lessonsPlanned !== undefined) {
    for (const l of lessons) {
      if (l.order > lessonsPlanned) fail(courseFile, `"lessons_planned: ${lessonsPlanned}" is below lesson ${l.order} (${l.file})`);
    }
  }

  let placement: Placement | undefined;
  if (existsSync(placementFile)) {
    const { data, body } = splitFrontMatter(readFileSync(placementFile, 'utf8'), placementFile);
    const id = str(data, 'id', placementFile);
    if (id !== placementId) fail(placementFile, `placement id must be "${placementId}", found "${id}"`);
    const { blocks, items } = parseBody(body, placementFile, id, render, false);
    // Each placement answer ends with "Lesson N." so the app can map the item to a lesson. N must be
    // a lesson that exists, or a number up to "lessons_planned" when the course page declares one.
    for (const it of items) {
      const n = it.targetLessonOrder;
      if (n === undefined) fail(placementFile, `item ${it.id}: the answer must end with "Lesson N."`);
      const planned = lessonsPlanned !== undefined && n >= 1 && n <= lessonsPlanned;
      if (!orders.has(n) && !planned) {
        fail(placementFile, lessonsPlanned === undefined
          ? `item ${it.id} points at lesson ${n}, which has no lesson file (add "lessons_planned" to course.md to allow planned lessons)`
          : `item ${it.id} points at lesson ${n}, above "lessons_planned: ${lessonsPlanned}" in course.md`);
      }
    }
    placement = {
      id,
      file: 'placement-quiz.md',
      title: str(data, 'title', placementFile, false) || 'Placement quiz',
      status: str(data, 'status', placementFile, false) || 'draft',
      blocks,
      itemIds: items.map((it) => it.id),
    };
  }

  return {
    id: courseId,
    folder,
    title: str(cfm.data, 'title', courseFile),
    version: str(cfm.data, 'version', courseFile),
    status: str(cfm.data, 'status', courseFile),
    html: render(cfm.body),
    lessons,
    lessonsPlanned,
    placement,
  };
}

/** Parses every courses/<folder>/course.md under root and checks IDs across all courses. */
export function parseCourses(coursesRoot: string): CourseData {
  const folders = existsSync(coursesRoot)
    ? readdirSync(coursesRoot, { withFileTypes: true })
        .filter((d) => d.isDirectory() && existsSync(join(coursesRoot, d.name, 'course.md')))
        .map((d) => d.name)
        .sort()
    : [];
  const courses = folders.map((f) => parseCourseFolder(join(coursesRoot, f)));

  const seen = new Map<string, string>();
  const claim = (id: string, where: string) => {
    const prev = seen.get(id);
    if (prev) throw new CourseFormatError(`duplicate id "${id}" in ${where} and ${prev}`);
    seen.set(id, where);
  };
  for (const c of courses) {
    claim(c.id, `${c.folder}/course.md`);
    for (const l of c.lessons) {
      claim(l.id, `${c.folder}/${l.file}`);
      for (const it of l.itemIds) claim(it, `${c.folder}/${l.file}`);
      for (const b of l.blocks) {
        const bid = b.kind === 'check' ? b.check.id : b.kind === 'predict' ? b.predict.id : b.kind === 'decide' ? b.decide.id : b.kind === 'visual' ? b.visual.id : '';
        if (bid) claim(bid, `${c.folder}/${l.file}`);
      }
    }
    if (c.placement) {
      claim(c.placement.id, `${c.folder}/placement-quiz.md`);
      for (const it of c.placement.itemIds) claim(it, `${c.folder}/placement-quiz.md`);
    }
  }
  return { builtAt: new Date().toISOString(), courses };
}
