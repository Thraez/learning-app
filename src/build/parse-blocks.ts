// Build-time parsing and validation of the fenced blocks a lesson can hold besides items:
// check, predict, decide, visual and points. The syntax is fixed by the block spec; every rule
// here fails the build with the file and the reason, because a block that loads half-wrong would
// teach something wrong. Pure functions: the caller supplies `fail`, which throws.

import { parse as parseYaml } from 'yaml';
import type { BarRow, Check, Decide, GapRow, Points, Predict, SpanRow, Visual } from '../types';

export type Fail = (msg: string) => never;

export const BLOCK_FENCES = ['check', 'predict', 'decide', 'visual', 'points'] as const;
export type BlockFence = (typeof BLOCK_FENCES)[number];
export const VISUAL_KINDS = ['gap-timeline', 'bars', 'dot-grid', 'spans'];

type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => !!v && typeof v === 'object' && !Array.isArray(v);
const isNum = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);
const isCount = (v: unknown): v is number => isNum(v) && v >= 0;
const text = (v: unknown) => (typeof v === 'string' ? v.trim() : '');

function read(yamlText: string, kind: string, fail: Fail): Obj {
  let data: unknown;
  try { data = parseYaml(yamlText); } catch (e) { fail(`a ${kind} block is not valid YAML (${(e as Error).message})`); }
  if (!isObj(data)) fail(`a ${kind} block must be a YAML mapping`);
  return data;
}

function onlyKeys(o: Obj, allowed: string[], what: string, fail: Fail) {
  for (const k of Object.keys(o)) if (!allowed.includes(k)) fail(`${what} has an unknown field "${k}" (allowed: ${allowed.join(', ')})`);
}

const PART: Record<string, { re: RegExp; example: string }> = {
  check: { re: /^c\d+$/, example: 'c1' },
  predict: { re: /^p\d+$/, example: 'p1' },
  decide: { re: /^d\d+$/, example: 'd1' },
  visual: { re: /^v\d+$/, example: 'v1' },
};

/** Checks the id of a block against the lesson: prefix, one part after it, and the part's letter for the kind. */
function blockId(o: Obj, kind: string, parentId: string, fail: Fail): string {
  const id = text(o.id);
  if (!id) fail(`a ${kind} block has no "id"`);
  if (!id.startsWith(parentId + '/')) fail(`${kind} ${id} does not start with "${parentId}/"`);
  const rest = id.slice(parentId.length + 1);
  if (!rest || rest.includes('/')) fail(`${kind} ${id} must have exactly one part after "${parentId}/"`);
  if (!PART[kind].re.test(rest)) fail(`${kind} ${id}: the part after the lesson must be a letter and a number, like "${PART[kind].example}"`);
  return id;
}

function requireText(o: Obj, key: string, what: string, fail: Fail): string {
  const v = text(o[key]);
  if (!v) fail(`${what} has no "${key}"`);
  return v;
}

export function parseCheck(yamlText: string, parentId: string, fail: Fail): Check {
  const o = read(yamlText, 'check', fail);
  const id = blockId(o, 'check', parentId, fail);
  const what = `check ${id}`;
  onlyKeys(o, ['id', 'prompt', 'options'], what, fail);
  const prompt = requireText(o, 'prompt', what, fail);
  if (!Array.isArray(o.options) || o.options.length < 2 || o.options.length > 3) fail(`${what} needs two or three options (found ${Array.isArray(o.options) ? o.options.length : 'none'})`);
  const options = o.options.map((r, n) => {
    const at = `${what}, option ${n + 1}`;
    if (!isObj(r)) fail(`${at} must be a mapping with text, why and optionally correct`);
    onlyKeys(r, ['text', 'correct', 'why'], at, fail);
    if (r.correct !== undefined && typeof r.correct !== 'boolean') fail(`${at}: "correct" must be true or left out`);
    return { text: requireText(r, 'text', at, fail), correct: r.correct === true, why: requireText(r, 'why', at, fail) };
  });
  const right = options.filter((x) => x.correct).length;
  if (right !== 1) fail(`${what} must have exactly one option with "correct: true" (found ${right})`);
  return { id, prompt, options };
}

export function parseDecide(yamlText: string, parentId: string, fail: Fail): Decide {
  const o = read(yamlText, 'decide', fail);
  const id = blockId(o, 'decide', parentId, fail);
  const what = `decide ${id}`;
  onlyKeys(o, ['id', 'prompt', 'options'], what, fail);
  const prompt = requireText(o, 'prompt', what, fail);
  if (!Array.isArray(o.options) || o.options.length < 2 || o.options.length > 3) fail(`${what} needs two or three options (found ${Array.isArray(o.options) ? o.options.length : 'none'})`);
  const options = o.options.map((r, n) => {
    const at = `${what}, option ${n + 1}`;
    if (!isObj(r)) fail(`${at} must be a mapping with text, outcome and optionally best`);
    onlyKeys(r, ['text', 'outcome', 'best'], at, fail);
    if (r.best !== undefined && typeof r.best !== 'boolean') fail(`${at}: "best" must be true or left out`);
    return { text: requireText(r, 'text', at, fail), outcome: requireText(r, 'outcome', at, fail), best: r.best === true };
  });
  if (options.filter((x) => x.best).length > 1) fail(`${what} has "best: true" on more than one option`);
  return { id, prompt, options };
}

export function parsePredict(yamlText: string, parentId: string, fail: Fail): Predict {
  const o = read(yamlText, 'predict', fail);
  const id = blockId(o, 'predict', parentId, fail);
  const what = `predict ${id}`;
  onlyKeys(o, ['id', 'prompt', 'unit', 'min', 'max', 'step', 'answer', 'answer_text', 'reveal', 'covers', 'visual'], what, fail);
  const prompt = requireText(o, 'prompt', what, fail);
  for (const k of ['min', 'max', 'step', 'answer']) if (!isNum(o[k])) fail(`${what}: "${k}" must be a number`);
  const [min, max, step, answer] = [o.min as number, o.max as number, o.step as number, o.answer as number];
  if (min >= max) fail(`${what}: "min" (${min}) must be below "max" (${max})`);
  if (step <= 0) fail(`${what}: "step" must be above 0`);
  if (answer < min || answer > max) fail(`${what}: "answer" (${answer}) must lie between "min" (${min}) and "max" (${max})`);
  if (o.unit !== undefined && typeof o.unit !== 'string') fail(`${what}: "unit" must be text`);
  const out: Predict = {
    id, prompt, unit: typeof o.unit === 'string' ? o.unit : '', min, max, step, answer,
    answerText: requireText(o, 'answer_text', what, fail),
    reveal: requireText(o, 'reveal', what, fail),
    covers: requireText(o, 'covers', what, fail),
  };
  if (o.visual !== undefined) {
    const v = text(o.visual);
    if (!v) fail(`${what}: "visual" must name a visual block id`);
    out.visual = v;
  }
  return out;
}

export function parsePoints(yamlText: string, fail: Fail): Points {
  const o = read(yamlText, 'points', fail);
  onlyKeys(o, ['for', 'points'], 'a points block', fail);
  const target = text(o.for);
  if (!target) fail('a points block has no "for"');
  const what = `points for ${target}`;
  if (!Array.isArray(o.points) || o.points.length < 2 || o.points.length > 4) fail(`${what} needs two to four points (found ${Array.isArray(o.points) ? o.points.length : 'none'})`);
  const points = o.points.map((p, n) => {
    if (typeof p !== 'string' || !p.trim()) fail(`${what}, point ${n + 1} must be non-empty text`);
    return p.trim();
  });
  return { for: target, points };
}

export function parseVisual(yamlText: string, parentId: string, fail: Fail): Visual {
  const o = read(yamlText, 'visual', fail);
  const id = blockId(o, 'visual', parentId, fail);
  const what = `visual ${id}`;
  const kind = String(o.kind ?? '');
  if (!VISUAL_KINDS.includes(kind)) fail(`${what} has unknown kind "${kind}" (allowed: ${VISUAL_KINDS.join(', ')})`);
  const base = { id, parentId, title: requireText(o, 'title', what, fail), text: requireText(o, 'text', what, fail) };
  const common = ['id', 'kind', 'title', 'text'];
  const rowsOf = (): unknown[] => {
    if (!Array.isArray(o.rows) || o.rows.length === 0) fail(`${what} has no "rows"`);
    return o.rows;
  };

  if (kind === 'gap-timeline') {
    onlyKeys(o, [...common, 'rows'], what, fail);
    const rows: GapRow[] = rowsOf().map((r, n) => {
      const row = isObj(r) ? r : {};
      if (!isCount(row.delay) || !isCount(row.gap) || !isCount(row.share) || row.delay === 0) {
        fail(`${what}, row ${n + 1}: "delay", "gap" and "share" must be numbers, and the delay above 0`);
      }
      return { delay: row.delay, gap: row.gap, share: row.share };
    });
    return { ...base, kind, rows };
  }

  if (kind === 'bars') {
    onlyKeys(o, [...common, 'unit', 'zero', 'rows'], what, fail);
    if (typeof o.unit !== 'string') fail(`${what} needs "unit" as text (use "" for none)`);
    if (o.zero !== undefined && typeof o.zero !== 'boolean') fail(`${what}: "zero" must be true or false`);
    const rows: BarRow[] = rowsOf().map((r, n) => {
      const at = `${what}, row ${n + 1}`;
      if (!isObj(r)) fail(`${at} must be a mapping with label and value`);
      onlyKeys(r, ['label', 'value', 'low', 'high', 'note'], at, fail);
      const label = requireText(r, 'label', at, fail);
      if (!isNum(r.value)) fail(`${at}: "value" must be a number`);
      for (const k of ['low', 'high']) if (r[k] !== undefined && !isNum(r[k])) fail(`${at}: "${k}" must be a number`);
      if (r.note !== undefined && typeof r.note !== 'string') fail(`${at}: "note" must be text`);
      const low = r.low as number | undefined;
      const high = r.high as number | undefined;
      if ((low !== undefined && low > r.value) || (high !== undefined && high < r.value) || (low !== undefined && high !== undefined && low > high)) {
        fail(`${at}: the interval must satisfy low <= value <= high`);
      }
      const row: BarRow = { label, value: r.value };
      if (low !== undefined) row.low = low;
      if (high !== undefined) row.high = high;
      if (typeof r.note === 'string' && r.note.trim()) row.note = r.note.trim();
      return row;
    });
    return { ...base, kind, unit: o.unit, zero: o.zero === true, rows };
  }

  if (kind === 'dot-grid') {
    onlyKeys(o, [...common, 'total', 'marked', 'marked_label', 'rest_label'], what, fail);
    const whole = (v: unknown): v is number => isNum(v) && Number.isInteger(v);
    if (!whole(o.total) || o.total < 1) fail(`${what}: "total" must be a whole number of 1 or more`);
    if (!whole(o.marked) || o.marked < 0 || o.marked > o.total) fail(`${what}: "marked" must be a whole number from 0 to "total" (${o.total})`);
    return { ...base, kind, total: o.total, marked: o.marked, markedLabel: requireText(o, 'marked_label', what, fail), restLabel: requireText(o, 'rest_label', what, fail) };
  }

  // spans
  onlyKeys(o, [...common, 'axis', 'max', 'rows'], what, fail);
  const axis = requireText(o, 'axis', what, fail);
  if (!isNum(o.max) || o.max <= 0) fail(`${what}: "max" must be a number above 0`);
  const max = o.max;
  const rows: SpanRow[] = rowsOf().map((r, n) => {
    const at = `${what}, row ${n + 1}`;
    if (!isObj(r)) fail(`${at} must be a mapping with label, from and to`);
    onlyKeys(r, ['label', 'from', 'to', 'open', 'note'], at, fail);
    const label = requireText(r, 'label', at, fail);
    if (!isNum(r.from) || !isNum(r.to)) fail(`${at}: "from" and "to" must be numbers`);
    if (r.from < 0 || r.to > max || r.from > r.to) fail(`${at}: need 0 <= from <= to <= max (${max}); got from ${r.from}, to ${r.to}`);
    if (r.open !== undefined && typeof r.open !== 'boolean') fail(`${at}: "open" must be true or false`);
    if (r.note !== undefined && typeof r.note !== 'string') fail(`${at}: "note" must be text`);
    const row: SpanRow = { label, from: r.from, to: r.to, open: r.open === true };
    if (typeof r.note === 'string' && r.note.trim()) row.note = r.note.trim();
    return row;
  });
  return { ...base, kind: 'spans', axis, max, rows };
}
