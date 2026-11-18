// The new lesson blocks (check, predict, decide, visual, points, break), the three flows that use
// them, the F setting and the responses store. Fixture courses are written to temp folders; nothing
// under courses/ is read or changed except by the real-course build tests elsewhere.

import { beforeEach, describe, expect, it } from 'vitest';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { parseCourses } from '../src/build/parse-courses';
import { buildScreens, classicBlocks, screenItemIds, splitProse, hasNewBlocks, asFlow, FLOWS, type Flow } from '../src/flows';
import { computeSchedules, courseProgress, dueItems } from '../src/scheduler';
import { buildExport } from '../src/export';
import { parseExportFile, restoreExport } from '../src/restore';
import { activeWhole, currentFlow, setFlow } from '../src/variants';
import {
  addResponse, getAssignments, getAttempts, getResponses, getSessions, getSettings, getStoredSettings, saveSettings,
  type Attempt, type Mark, type Response,
} from '../src/store';
import { barScale, barsSvg, dotGridSvg, dotLayout, spansSvg, wrap } from '../src/visuals';
import type { Block, Course, Visual } from '../src/types';

class MemoryStorage {
  private m = new Map<string, string>();
  getItem(k: string) { return this.m.get(k) ?? null; }
  setItem(k: string, v: string) { this.m.set(k, String(v)); }
  removeItem(k: string) { this.m.delete(k); }
  clear() { this.m.clear(); }
}
const storage = new MemoryStorage();
Object.defineProperty(globalThis, 'localStorage', { value: storage, configurable: true });
beforeEach(() => storage.clear());

// ---- fixtures ----

const CHECK = 'id: t/a/c1\nprompt: "Which is right?"\noptions:\n  - text: "First."\n    correct: true\n    why: "Because of the paper."\n  - text: "Second."\n    why: "That is the lure."';
const PREDICT = 'id: t/a/p1\nprompt: "How high?"\nunit: "%"\nmin: 0\nmax: 50\nstep: 1\nanswer: 6.9\nanswer_text: "6.9% higher."\nreveal: "A relative lift, from the paper."\ncovers: t/a/r1\nvisual: t/a/v1';
const DECIDE = 'id: t/a/d1\nprompt: "What do you do?"\noptions:\n  - text: "Option one."\n    outcome: "This happens."\n    best: true\n  - text: "Option two."\n    outcome: "That happens."';
const BARS = 'id: t/a/v1\nkind: bars\ntitle: "Bars"\ntext: "Two bars."\nunit: "%"\nrows:\n  - { label: "A", value: 6.9, low: 2, high: 11, note: "not significant" }\n  - { label: "B", value: -3 }';
const POINTS = 'for: t/a/why\npoints:\n  - "One."\n  - "Two."';

const fence = (kind: string, body: string) => '```' + kind + '\n' + body + '\n```\n';
const details = (id: string, type: string, extra = '') =>
  `### ${id} · ${type}\n\nPrompt for ${id}.\n\n<details>\n<summary>Model answer</summary>\nAnswer for ${id}.\n</details>\n${extra}`;

/** A full lesson. `withBlocks` false leaves out every new block and every break marker, nothing else. */
function lessonBody(withBlocks: boolean): string {
  const nb = (s: string) => (withBlocks ? s : '');
  return [
    '## Opening question\n\nLead-in text.\n\n',
    details('t/a/open', 'open'),
    nb('\n' + fence('predict', PREDICT) + '\n' + fence('decide', DECIDE)),
    '\n## The idea\n\nParagraph one.\n\n',
    nb('<!-- break -->\n\n'),
    'Paragraph two.\n\n',
    nb(fence('visual', BARS) + '\n' + fence('check', CHECK) + '\n'),
    'Paragraph three.\n\n',
    '## Why\n\n',
    details('t/a/why', 'why', nb('\n' + fence('points', POINTS))),
    '\n## Scenario\n\n',
    details('t/a/sc', 'scenario'),
    '\n## Recall\n\n',
    details('t/a/r1', 'recall'),
    '\n',
    details('t/a/r2', 'recall'),
    '\n## Sources and grades\n\nSources.\n',
  ].join('');
}

function makeRoot(body: string, placement?: string) {
  const root = mkdtempSync(join(tmpdir(), 'flows-'));
  mkdirSync(join(root, 't', 'lessons'), { recursive: true });
  writeFileSync(join(root, 't', 'course.md'), '---\nid: t\ntitle: T\nversion: 0.1.0\nstatus: draft\n---\nHi\n');
  writeFileSync(join(root, 't', 'lessons', '01-a.md'), `---\nid: t/a\ncourse: t\ntitle: A\norder: 1\n---\n${body}`);
  if (placement) writeFileSync(join(root, 't', 'placement-quiz.md'), `---\nid: t/placement\ntitle: P\nstatus: draft\n---\n${placement}`);
  return root;
}
const build = (body: string, placement?: string) => () => parseCourses(makeRoot(body, placement));
const courseOf = (body: string): Course => parseCourses(makeRoot(body)).courses[0];

const withB = courseOf(lessonBody(true));
const without = courseOf(lessonBody(false));
const lessonWith = withB.lessons[0];
const lessonWithout = without.lessons[0];
const ITEM_IDS = ['t/a/open', 't/a/why', 't/a/sc', 't/a/r1', 't/a/r2'];

// ---- parsing ----

describe('new blocks parse as their own kinds', () => {
  const kinds = lessonWith.blocks.map((b) => b.kind);
  it('puts each block in file order and none of them is an item', () => {
    expect(kinds).toEqual([
      'section', 'prose', 'item', 'predict', 'decide',
      'section', 'prose', 'break', 'prose', 'visual', 'check', 'prose',
      'section', 'item', 'points',
      'section', 'item', 'section', 'item', 'item', 'section', 'prose',
    ]);
    expect(lessonWith.itemIds).toEqual(ITEM_IDS);
  });
  it('reads every field', () => {
    const find = <K extends Block['kind']>(k: K) => lessonWith.blocks.find((b) => b.kind === k) as Extract<Block, { kind: K }>;
    const p = find('predict').predict;
    expect(p).toMatchObject({ id: 't/a/p1', unit: '%', min: 0, max: 50, step: 1, answer: 6.9, answerText: '6.9% higher.', covers: 't/a/r1', visual: 't/a/v1' });
    const d = find('decide').decide;
    expect(d.options.map((o) => o.best)).toEqual([true, false]);
    const c = find('check').check;
    expect(c.options.map((o) => o.correct)).toEqual([true, false]);
    expect(c.options[1].why).toBe('That is the lure.');
    const v = find('visual').visual;
    expect(v.kind).toBe('bars');
    expect(find('points').points).toEqual({ for: 't/a/why', points: ['One.', 'Two.'] });
  });
});

describe('validation fails the build with the file and the reason', () => {
  const inIdea = (f: string) => build('## The idea\n\n' + f);
  const tweak = (src: string, from: string, to: string) => { expect(src).toContain(from); return src.replace(from, to); };

  it('check: option counts, exactly one correct, why on each option', () => {
    const one = 'id: t/a/c1\nprompt: P\noptions:\n  - text: A\n    correct: true\n    why: w';
    expect(inIdea(fence('check', one))).toThrow(/needs two or three options \(found 1\)/);
    const four = CHECK + '\n  - text: "Third."\n    why: w\n  - text: "Fourth."\n    why: w';
    expect(inIdea(fence('check', four))).toThrow(/needs two or three options \(found 4\)/);
    expect(inIdea(fence('check', tweak(CHECK, '    correct: true\n', '')))).toThrow(/exactly one option with "correct: true" \(found 0\)/);
    expect(inIdea(fence('check', tweak(CHECK, '  - text: "Second."', '  - text: "Second."\n    correct: true')))).toThrow(/exactly one option with "correct: true" \(found 2\)/);
    expect(inIdea(fence('check', tweak(CHECK, '    why: "That is the lure."', '')))).toThrow(/option 2 has no "why"/);
    expect(inIdea(fence('check', tweak(CHECK, 'prompt: "Which is right?"\n', '')))).toThrow(/has no "prompt"/);
  });
  it('check, predict, decide, visual: id prefix and part', () => {
    expect(inIdea(fence('check', tweak(CHECK, 't/a/c1', 't/b/c1')))).toThrow(/does not start with "t\/a\/"/);
    expect(inIdea(fence('check', tweak(CHECK, 't/a/c1', 't/a/x1')))).toThrow(/letter and a number, like "c1"/);
    expect(inIdea(fence('check', tweak(CHECK, 't/a/c1', 't/a/c1/z')))).toThrow(/exactly one part/);
    expect(inIdea(fence('decide', tweak(DECIDE, 't/a/d1', 't/a/c1')))).toThrow(/like "d1"/);
  });
  it('predict: number ranges, required text, covers and visual links', () => {
    const ok = (f: string) => build(details('t/a/r1', 'recall') + '\n' + fence('visual', BARS) + '\n' + fence('predict', f));
    expect(ok(PREDICT)).not.toThrow();
    expect(ok(tweak(PREDICT, 'answer: 6.9', 'answer: 60'))).toThrow(/"answer" \(60\) must lie between/);
    expect(ok(tweak(PREDICT, 'answer: 6.9', 'answer: -1'))).toThrow(/must lie between/);
    expect(ok(tweak(PREDICT, 'max: 50', 'max: 0'))).toThrow(/"min" \(0\) must be below "max" \(0\)/);
    expect(ok(tweak(PREDICT, 'step: 1', 'step: 0'))).toThrow(/"step" must be above 0/);
    expect(ok(tweak(PREDICT, 'step: 1', 'step: big'))).toThrow(/"step" must be a number/);
    expect(ok(tweak(PREDICT, 'answer_text: "6.9% higher."\n', ''))).toThrow(/no "answer_text"/);
    expect(ok(tweak(PREDICT, 'reveal: "A relative lift, from the paper."\n', ''))).toThrow(/no "reveal"/);
    expect(ok(tweak(PREDICT, 'covers: t/a/r1\n', ''))).toThrow(/no "covers"/);
    expect(ok(tweak(PREDICT, 'covers: t/a/r1', 'covers: t/a/r9'))).toThrow(/"covers" names "t\/a\/r9", which is not an item/);
    expect(build(details('t/a/why', 'why') + '\n' + fence('predict', tweak(PREDICT, 'covers: t/a/r1', 'covers: t/a/why')))).toThrow(/must name a recall item/);
    expect(ok(tweak(PREDICT, 'visual: t/a/v1', 'visual: t/a/v9'))).toThrow(/"visual" names "t\/a\/v9", which is not a visual block/);
  });
  it('decide: option counts, outcome on each option, at most one best', () => {
    expect(inIdea(fence('decide', 'id: t/a/d1\nprompt: P\noptions:\n  - { text: A, outcome: o }'))).toThrow(/needs two or three options/);
    expect(inIdea(fence('decide', tweak(DECIDE, '    outcome: "That happens."', '')))).toThrow(/option 2 has no "outcome"/);
    expect(inIdea(fence('decide', tweak(DECIDE, '    outcome: "That happens."', '    outcome: "x"\n    best: true')))).toThrow(/more than one option/);
    expect(inIdea(fence('decide', tweak(DECIDE, '    best: true\n', '')))).not.toThrow();
  });
  it('visual: unknown kind, missing fields, bad numbers', () => {
    expect(inIdea(fence('visual', tweak(BARS, 'kind: bars', 'kind: pie')))).toThrow(/unknown kind "pie"/);
    expect(inIdea(fence('visual', tweak(BARS, 'text: "Two bars."\n', '')))).toThrow(/no "text"/);
    expect(inIdea(fence('visual', tweak(BARS, 'value: 6.9', 'value: lots')))).toThrow(/"value" must be a number/);
    expect(inIdea(fence('visual', tweak(BARS, 'low: 2', 'low: 9')))).toThrow(/low <= value <= high/);
    const grid = 'id: t/a/v1\nkind: dot-grid\ntitle: T\ntext: X\ntotal: 10\nmarked: 12\nmarked_label: m\nrest_label: r';
    expect(inIdea(fence('visual', grid))).toThrow(/"marked" must be a whole number from 0 to "total" \(10\)/);
    const spans = 'id: t/a/v1\nkind: spans\ntitle: T\ntext: X\naxis: days\nmax: 60\nrows:\n  - { label: A, from: 5, to: 70 }';
    expect(inIdea(fence('visual', spans))).toThrow(/0 <= from <= to <= max \(60\)/);
    expect(inIdea(fence('visual', spans.replace('to: 70', 'to: 30, open: true')))).not.toThrow();
  });
  it('a block that is never closed, or is not YAML, or has an unknown field', () => {
    expect(inIdea('```check\n' + CHECK + '\n')).toThrow(/never closed/);
    expect(inIdea(fence('check', 'id: [unclosed'))).toThrow(/not valid YAML/);
    expect(inIdea(fence('check', CHECK + '\nsource: x'))).toThrow(/unknown field "source"/);
  });
  it('duplicate ids across items and blocks, in one file and across files', () => {
    expect(inIdea(fence('check', CHECK) + '\n' + fence('check', CHECK))).toThrow(/duplicate id "t\/a\/c1"/);
    expect(build(details('t/a/c1', 'recall') + '\n' + fence('check', CHECK))).toThrow(/duplicate id "t\/a\/c1"/);
    expect(inIdea(fence('check', CHECK) + '\n' + fence('visual', tweak(BARS, 't/a/v1', 't/a/c1')))).toThrow(/like "v1"|duplicate/);
  });
  it('points: directly after the item, for a why or scenario item, two to four points', () => {
    const why = (after: string) => build('## Why\n\n' + details('t/a/why', 'why', after));
    expect(why(fence('points', POINTS))).not.toThrow();
    expect(why('\n' + fence('points', POINTS))).not.toThrow();
    expect(why(fence('points', tweak(POINTS, 't/a/why', 't/a/r1')))).toThrow(/"for" must name that item/);
    expect(build(details('t/a/r1', 'recall', fence('points', tweak(POINTS, 't/a/why', 't/a/r1'))))).toThrow(/must name a why or scenario item, not recall/);
    expect(why(fence('points', 'for: t/a/why\npoints:\n  - "One."'))).toThrow(/needs two to four points \(found 1\)/);
    expect(why(fence('points', 'for: t/a/why\npoints: ["a", "b", "c", "d", "e"]'))).toThrow(/needs two to four points \(found 5\)/);
    expect(build('## Why\n\n' + fence('points', POINTS))).toThrow(/must sit directly after an item/);
    expect(build('## Why\n\n' + details('t/a/why', 'why') + '\nSome text.\n\n' + fence('points', POINTS))).toThrow(/has text after its <\/details>/);
  });
  it('text after </details> still fails; a block fence after it is fine', () => {
    expect(build(details('t/a/r1', 'recall', '\nStray text.\n'))).toThrow(/has text after its <\/details>/);
    expect(build(details('t/a/r1', 'recall', '\n' + fence('check', CHECK)))).not.toThrow();
  });
  it('every new block and a break marker may follow </details>, in order; prose after it still fails', () => {
    const tail = '\n' + fence('predict', PREDICT) + '\n<!-- break -->\n\n' + fence('decide', DECIDE) + '\n' + fence('check', CHECK) + '\n' + fence('visual', BARS);
    const c = parseCourses(makeRoot(details('t/a/r1', 'recall') + tail)).courses[0];
    expect(c.lessons[0].blocks.map((b) => b.kind)).toEqual(['item', 'predict', 'break', 'decide', 'check', 'visual']);
    expect(c.lessons[0].itemIds).toEqual(['t/a/r1']);
    expect(build(details('t/a/r1', 'recall', '\nProse.\n\n' + fence('check', CHECK)))).toThrow(/has text after its <\/details>/);
    expect(build(details('t/a/r1', 'recall', '\n' + fence('check', CHECK) + '\nProse.\n'))).toThrow(/has text after its <\/details>/);
  });
  it('a chunk break needs a blank line either side', () => {
    expect(build('## The idea\n\nOne.\n<!-- break -->\n\nTwo.\n')).toThrow(/blank line before it and after it/);
    expect(build('## The idea\n\nOne.\n\n<!-- break -->\nTwo.\n')).toThrow(/blank line before it and after it/);
    expect(build('## The idea\n\nOne.\n\n<!-- break -->\n\nTwo.\n')).not.toThrow();
  });
  it('a placement quiz holds items only', () => {
    const item = details('t/placement/p01', 'why').replace('Answer for t/placement/p01.', 'Answer. Lesson 1.');
    const lesson = '## Why\n\n' + details('t/a/why', 'why');
    expect(build(lesson, item + '\n' + fence('check', CHECK.replace('t/a/c1', 't/placement/c1')))).toThrow(/not allowed here/);
    expect(build(lesson, 'Intro.\n\n<!-- break -->\n\n' + item)).toThrow(/not allowed here/);
    expect(build(lesson, item)).not.toThrow();
  });
});

// ---- Classic is unchanged by the new blocks ----

const DAY = 86_400_000;
const T0 = new Date('2026-11-01T08:00:00Z');
function attempt(n: number, itemId: string, days: number, mark: Mark, mode: Attempt['mode'] = 'lesson'): Attempt {
  const at = new Date(T0.getTime() + days * DAY).toISOString();
  return {
    attemptId: `a${n}`, itemId, itemType: 'recall', courseId: 't', courseVersion: '0.1.0', parentId: 't/a', sessionId: 's1', mode,
    shownAt: at, revealedAt: at, markedAt: at, text: 'x', confidence: 'sure', mark, variant: 'default', appBuild: 'test',
  };
}
const LOG: Attempt[] = [
  attempt(1, 't/a/r1', 0, 'right'), attempt(2, 't/a/r2', 0, 'wrong'), attempt(3, 't/a/why', 0, 'partly'),
  attempt(4, 't/a/r1', 15, 'right', 'review'), attempt(5, 't/a/sc', 0, 'right'), attempt(6, 't/a/open', 0, 'wrong'),
];

describe('the new blocks change nothing Classic, the scheduler or Progress reads', () => {
  it('give the same items and the same Classic block sequence', () => {
    expect(lessonWith.itemIds).toEqual(lessonWithout.itemIds);
    expect(classicBlocks(lessonWith.blocks)).toEqual(classicBlocks(lessonWithout.blocks));
    expect(classicBlocks(lessonWith.blocks)).toEqual(lessonWithout.blocks);
    expect(classicBlocks(lessonWith.blocks).every((b) => ['section', 'prose', 'item'].includes(b.kind))).toBe(true);
    expect(hasNewBlocks(lessonWith.blocks)).toBe(true);
    expect(hasNewBlocks(lessonWithout.blocks)).toBe(false);
  });
  it('give the same due list and the same Progress for one attempt log', () => {
    const later = new Date(T0.getTime() + 60 * DAY);
    for (const now of [new Date(T0.getTime() + 2 * DAY), later]) {
      const a = dueItems(withB, computeSchedules(LOG), now);
      const b = dueItems(without, computeSchedules(LOG), now);
      expect(a).toEqual(b);
      expect(courseProgress(withB, LOG, new Set(['t/a']), now)).toEqual(courseProgress(without, LOG, new Set(['t/a']), now));
    }
    expect(dueItems(withB, computeSchedules(LOG), later).length).toBeGreaterThan(0);
  });
});

describe('responses are not attempts', () => {
  it('recording responses to a check, a prediction and a decision changes neither the due list nor Progress', () => {
    storage.setItem('learning-app:v1:attempts', JSON.stringify(LOG));
    const now = new Date(T0.getTime() + 60 * DAY);
    const snapshot = () => ({
      due: dueItems(withB, computeSchedules(getAttempts()), now),
      progress: courseProgress(withB, getAttempts(), new Set(['t/a']), now),
      attempts: getAttempts().length,
    });
    const before = snapshot();
    addResponse({ id: 't/a/c1', at: '2026-11-02T00:00:00Z', session: 's9', value: 1 });
    addResponse({ id: 't/a/p1', at: '2026-11-02T00:01:00Z', session: 's9', value: 12.5 });
    addResponse({ id: 't/a/d1', at: '2026-11-02T00:02:00Z', session: 's9', value: 0 });
    expect(snapshot()).toEqual(before);
    expect(getResponses()).toHaveLength(3);
    expect(getAttempts()).toHaveLength(LOG.length);
    expect(storage.getItem('learning-app:v1:responses')).toContain('t/a/p1');
  });
});

// ---- flows ----

describe('screens for each flow', () => {
  const flows: Flow[] = ['stepped', 'predict', 'case'];
  for (const flow of flows) {
    it(`${flow}: every item exactly once`, () => {
      const ids = screenItemIds(buildScreens(lessonWith, flow));
      expect([...ids].sort()).toEqual([...ITEM_IDS].sort());
    });
  }
  it('classic has no screens of its own', () => {
    expect(buildScreens(lessonWith, 'classic')).toEqual([]);
  });
  it('stepped: file order, checks and visuals in place, predict and decide left out', () => {
    const s = buildScreens(lessonWith, 'stepped');
    expect(s.map((x) => x.kind)).toEqual(['chunk', 'item', 'chunk', 'chunk', 'check', 'chunk', 'item', 'item', 'item', 'item', 'chunk']);
    // Paragraph two ends at the visual, which sits on its screen; the check comes next.
    const two = s[3];
    expect(two.kind === 'chunk' && two.html).toContain('Paragraph two.');
    expect(two.kind === 'chunk' && two.visuals.map((v) => v.id)).toEqual(['t/a/v1']);
    expect(s.some((x) => x.kind === 'predict' || x.kind === 'decide')).toBe(false);
    const why = s.find((x) => x.kind === 'item' && x.item.id === 't/a/why');
    expect(why && why.kind === 'item' && why.points).toEqual(['One.', 'Two.']);
  });
  it('predict: the prediction first, with its visual, then stepped', () => {
    const s = buildScreens(lessonWith, 'predict');
    expect(s[0].kind).toBe('predict');
    expect(s[0].kind === 'predict' && s[0].visual?.id).toBe('t/a/v1');
    expect(s.slice(1)).toEqual(buildScreens(lessonWith, 'stepped'));
    expect(s.some((x) => x.kind === 'decide')).toBe(false);
  });
  it('case: the decision first, then the opening question, the idea, the scenario, then the rest', () => {
    const s = buildScreens(lessonWith, 'case');
    expect(s[0].kind).toBe('decide');
    const afterDecide = s.slice(1).map((x) => (x.kind === 'item' ? x.item.id : `${x.kind}:${x.section}`));
    const idea = afterDecide.indexOf('chunk:The idea');
    expect(afterDecide.slice(0, idea).every((x) => x === 't/a/open' || x.endsWith(':Opening question'))).toBe(true);
    expect(afterDecide.slice(0, idea)).toContain('t/a/open');
    expect(afterDecide.slice(idea, idea + 4)).toEqual(['chunk:The idea', 'chunk:The idea', 'check:The idea', 'chunk:The idea']);
    expect(afterDecide[idea + 4]).toBe('t/a/sc');
    expect(afterDecide.slice(idea + 5).filter((x) => x.startsWith('t/a/'))).toEqual(['t/a/why', 't/a/r1', 't/a/r2']);
  });
  it('a lesson with none of the new blocks runs as stepped with long prose split at paragraphs', () => {
    const long = Array.from({ length: 6 }, (_, k) => `Paragraph ${k + 1} ${'word '.repeat(40)}`).join('\n\n');
    const c = courseOf('## The idea\n\n' + long + '\n\n' + details('t/a/r1', 'recall'));
    for (const flow of flows) {
      const s = buildScreens(c.lessons[0], flow);
      expect(screenItemIds(s)).toEqual(['t/a/r1']);
      const chunks = s.filter((x) => x.kind === 'chunk');
      expect(chunks.length).toBeGreaterThan(1);
      expect(chunks.map((x) => (x.kind === 'chunk' ? x.html : '')).join('\n')).toBe(c.lessons[0].blocks.filter((b) => b.kind === 'prose').map((b) => (b.kind === 'prose' ? b.html : '')).join('').trim().replace(/<\/p>\n<p>/g, '</p>\n<p>'));
    }
    expect(buildScreens(lessonWithout, 'stepped').length).toBeGreaterThan(0);
  });
  it('splitProse never cuts an element and leaves short prose whole', () => {
    expect(splitProse('<p>Short.</p>')).toEqual(['<p>Short.</p>']);
    const html = ['<p>' + 'a '.repeat(200) + '</p>', '<ul><li>one<ul><li>nested</li></ul></li></ul>', '<p>' + 'b '.repeat(200) + '</p>'].join('\n');
    const parts = splitProse(html, 300);
    expect(parts).toHaveLength(3);
    expect(parts[1]).toBe('<ul><li>one<ul><li>nested</li></ul></li></ul>');
  });
});

// ---- the "How sure is this?" tap ----

describe('a sure block', () => {
  const SURE = 'The paper gives p = 0.054, so [not significant](https://example.org/paper).';
  const body = '## The idea\n\nParagraph one.\n\n' + fence('sure', SURE) + '\n<!-- break -->\n\nParagraph two.\n\n## Recall\n\n' + details('t/a/r1', 'recall');
  const lessonOf = (text: string) => parseCourses(makeRoot(text)).courses[0].lessons[0];

  it('is parsed as Markdown, so its links survive, and has no id', () => {
    const sure = lessonOf(body).blocks.filter((b) => b.kind === 'sure');
    expect(sure).toHaveLength(1);
    expect(sure[0].kind === 'sure' && sure[0].html).toContain('<a href="https://example.org/paper">not significant</a>');
  });
  it('fails the build when empty, when it holds its own <details>, or in a placement quiz', () => {
    expect(build('## The idea\n\nOne.\n\n```sure\n\n```\n')).toThrow(/"```sure" block is empty/);
    expect(build('## The idea\n\nOne.\n\n' + fence('sure', '<details>\nA\n</details>'))).toThrow(/plain Markdown/);
    const item = details('t/placement/p01', 'why').replace('Answer for t/placement/p01.', 'Answer. Lesson 1.');
    expect(build('## Why\n\n' + details('t/a/why', 'why'), item + '\n' + fence('sure', SURE))).toThrow(/not allowed here/);
  });
  it('shows in Classic as a closed <details> inside the prose it follows', () => {
    const classic = classicBlocks(lessonOf(body).blocks);
    expect(classic.every((b) => ['section', 'prose', 'item'].includes(b.kind))).toBe(true);
    const prose = classic.flatMap((b) => (b.kind === 'prose' ? [b.html] : [])).join('');
    expect(prose).toMatch(/Paragraph one\.<\/p>\s*<details class="sure"><summary>How sure is this\?<\/summary>/);
    expect(prose).not.toContain('<details open');
  });
  it('sits on the screen of the chunk it follows in Stepped, Predict first and Case first, never on its own screen', () => {
    for (const flow of ['stepped', 'predict', 'case'] as Flow[]) {
      const screens = buildScreens(lessonOf(body), flow);
      const chunks = screens.flatMap((s) => (s.kind === 'chunk' ? [s] : []));
      expect(chunks).toHaveLength(2);
      expect(chunks[0].html).toContain('Paragraph one.');
      expect(chunks[0].sure).toHaveLength(1);
      expect(chunks[0].sure[0]).toContain('p = 0.054');
      expect(chunks[1].sure).toEqual([]);
      expect(screenItemIds(screens)).toEqual(['t/a/r1']);
    }
  });
});

// ---- the F setting ----

describe('F, the lesson flow setting', () => {
  it('is Stepped when absent, unknown or expired; a stored choice wins; only Classic leaves no F on the session', () => {
    expect(getStoredSettings()?.whole?.F).toBeUndefined();
    expect(currentFlow(getSettings())).toBe('stepped');
    expect(activeWhole(getSettings())).toEqual({ F: 'stepped' });
    setFlow('case');
    expect(currentFlow(getSettings())).toBe('case');
    expect(activeWhole(getSettings())).toEqual({ F: 'case' });
    setFlow('classic');
    expect(currentFlow(getSettings())).toBe('classic');
    expect(activeWhole(getSettings())).toEqual({});
    const s = getSettings();
    s.whole.F = { value: 'sideways', since: 'x', until: null };
    saveSettings(s);
    expect(currentFlow(getSettings())).toBe('stepped');
    expect(activeWhole(getSettings())).toEqual({ F: 'stepped' });
    s.whole.F = { value: 'case', since: 'x', until: '2000-01-01' };
    saveSettings(s);
    expect(currentFlow(getSettings())).toBe('stepped');
    expect(asFlow('sideways')).toBe('stepped');
    expect(Object.keys(FLOWS)).toEqual(['classic', 'stepped', 'predict', 'case']);
  });
  it('sits beside E6 without changing it', () => {
    const s = getSettings();
    s.whole.E6 = { value: 'short', since: 'x', until: null };
    saveSettings(s);
    setFlow('stepped');
    expect(activeWhole(getSettings())).toEqual({ E6: 'short', F: 'stepped' });
  });
});

// ---- export and restore ----

const exportNow = (responses: readonly Response[] = getResponses()) =>
  JSON.parse(JSON.stringify(buildExport({ builtAt: 'x', courses: [withB] }, getAttempts(), getSessions(), 'test', new Date('2026-12-01T00:00:00Z'), getAssignments(), getStoredSettings(), responses)));

describe('export and restore of responses', () => {
  it('an export from before the flows (no responses, no F) still restores', () => {
    storage.setItem('learning-app:v1:attempts', JSON.stringify(LOG));
    const old = exportNow();
    delete old.responses;
    storage.clear();
    const parsed = parseExportFile(JSON.stringify(old));
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;
    const r = restoreExport(parsed.file);
    expect(r).toMatchObject({ attempts: LOG.length, responses: 0, skipped: 0 });
    expect(getResponses()).toEqual([]);
  });
  it('a round trip adds each response once, and a second restore adds none', () => {
    const rs: Response[] = [
      { id: 't/a/c1', at: '2026-11-02T00:00:00Z', session: 's9', value: 1 },
      { id: 't/a/p1', at: '2026-11-02T00:01:00Z', session: 's9', value: 12.5 },
      { id: 't/a/d1', at: '2026-11-02T00:02:00Z', session: 's9', value: 0 },
    ];
    for (const r of rs) addResponse(r);
    setFlow('predict');
    const before = exportNow();
    expect(before.responses).toEqual(rs);
    expect(before.schemaVersion).toBe(2);
    storage.clear();
    const parsed = parseExportFile(JSON.stringify(before));
    if (!parsed.ok) throw new Error(parsed.error);
    expect(restoreExport(parsed.file).responses).toBe(3);
    expect(getResponses()).toEqual(rs);
    expect(restoreExport(parsed.file).responses).toBe(0);
    expect(getResponses()).toHaveLength(3);
    // Settings, F included, come back on a phone that had none.
    expect(currentFlow(getSettings())).toBe('predict');
    expect(exportNow()).toEqual(before);
  });
  it('skips a response that is not usable', () => {
    storage.setItem('learning-app:v1:attempts', JSON.stringify(LOG));
    const f = exportNow();
    f.responses = [{ id: 't/a/c1', at: '2026-11-02T00:00:00Z', session: 's9', value: 'one' }, { id: 't/a/c1' }];
    storage.clear();
    const parsed = parseExportFile(JSON.stringify(f));
    if (!parsed.ok) throw new Error(parsed.error);
    expect(restoreExport(parsed.file)).toMatchObject({ responses: 0, skipped: 2 });
  });
});

// ---- visuals ----

describe('visual pictures', () => {
  const vis = (extra: object): Visual => ({ id: 't/a/v1', parentId: 't/a', title: 'T', text: 'A "quoted" <text>.', ...extra }) as Visual;
  it('bars: a zero line only when needed, an interval whisker, the description escaped', () => {
    const plain = barsSvg(vis({ kind: 'bars', unit: '%', zero: false, rows: [{ label: 'A', value: 5 }, { label: 'B', value: 2 }] }) as never);
    expect(plain).not.toContain('vis-zero');
    expect(plain).toContain('aria-label="A &quot;quoted&quot; &lt;text&gt;."');
    const neg = barsSvg(vis({ kind: 'bars', unit: '%', zero: false, rows: [{ label: 'A', value: 6.9, low: 2, high: 11, note: 'n' }, { label: 'B', value: -3 }] }) as never);
    expect(neg).toContain('vis-zero');
    expect(neg).toContain('vis-whisker');
    expect(neg).toContain('vis-neg');
    expect(neg).toContain('>6.9%<');
    expect(barsSvg(vis({ kind: 'bars', unit: '%', zero: true, rows: [{ label: 'A', value: 5 }] }) as never)).toContain('vis-zero');
    const x = barScale([{ label: 'a', value: -3 }, { label: 'b', value: 7 }]);
    expect(x(0)).toBeGreaterThan(x(-3));
    expect(x(7)).toBeLessThanOrEqual(226);
  });
  it('dot-grid: one dot per unit, the marked ones filled, labels in the legend', () => {
    const svg = dotGridSvg(vis({ kind: 'dot-grid', total: 134, marked: 104, markedLabel: 'under 1% of races each', restLabel: 'the other 30' }) as never);
    expect((svg.match(/class="vis-dot"/g) ?? []).length).toBe(104 + 1);
    expect((svg.match(/class="vis-dot-off"/g) ?? []).length).toBe(30 + 1);
    expect(svg).toContain('104 under 1% of races each');
    expect(svg).toContain('the other 30');
    expect(dotLayout(134).cols * dotLayout(134).gap).toBeLessThanOrEqual(320);
    expect(dotLayout(1000).cols * dotLayout(1000).gap).toBeLessThanOrEqual(320);
  });
  it('spans: an arrow for an open row, a stop mark for a closed one', () => {
    const svg = spansSvg(vis({ kind: 'spans', axis: 'days since install', max: 60, rows: [{ label: 'Open', from: 0, to: 30, open: true }, { label: 'Closed', from: 5, to: 20, open: false, note: 'left' }] }) as never);
    expect(svg).toContain('vis-arrow');
    expect(svg).toContain('vis-stop');
    expect(svg).toContain('days since install');
    expect(svg).toContain('>60<');
  });
  it('wraps long labels without cutting a word', () => {
    expect(wrap('one two three', 7)).toEqual(['one two', 'three']);
    expect(wrap('extraordinarily', 5)).toEqual(['extraordinarily']);
  });
});
