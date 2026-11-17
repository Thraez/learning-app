// Visuals: the "```visual" block in a lesson, the L15 setting that shows it, and the picture's geometry.

import { describe, expect, it } from 'vitest';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { parseCourses } from '../src/build/parse-courses';
import { activeWhole, experimentById, visualsOn } from '../src/variants';
import { gapTimelinePoints, gapTimelineSentence, gapTimelineSvg } from '../src/visuals';
import type { Block } from '../src/types';

const data = parseCourses(resolve(import.meta.dirname, '../courses'));
const spacing = data.courses.find((c) => c.id === 'learn')!.lessons.find((l) => l.id === 'learn/spacing')!;

const block = (yaml: string) => '```visual\n' + yaml + '\n```\n';
const GOOD = 'id: t/a/v1\nkind: gap-timeline\ntitle: T\ntext: What it shows.\nrows:\n  - { delay: 7, gap: 1, share: 14 }';
function build(body: string) {
  const root = mkdtempSync(join(tmpdir(), 'courses-'));
  mkdirSync(join(root, 't', 'lessons'), { recursive: true });
  writeFileSync(join(root, 't', 'course.md'), '---\nid: t\ntitle: T\nversion: 0.1.0\nstatus: draft\n---\nHi\n');
  writeFileSync(join(root, 't', 'lessons', '01-a.md'), `---\nid: t/a\ncourse: t\ntitle: A\norder: 1\n---\n${body}`);
  return () => parseCourses(root);
}

describe('the spacing lesson', () => {
  const visual = spacing.blocks.flatMap((b) => (b.kind === 'visual' ? [b.visual] : []))[0];

  it('has one visual with a stable id and the four tested pairs', () => {
    expect(spacing.visualIds).toEqual(['learn/spacing/v1']);
    expect(visual.rows).toEqual([
      { delay: 7, gap: 1, share: 14 },
      { delay: 35, gap: 11, share: 31 },
      { delay: 70, gap: 21, share: 30 },
      { delay: 350, gap: 21, share: 6 },
    ]);
  });

  it('states each share as the gap over the delay, rounded', () => {
    for (const r of visual.rows) expect(r.share).toBe(Math.round((100 * r.gap) / r.delay));
  });

  it('reads exactly as before with the visual left out', () => {
    // With L15 off the app skips visual blocks. What is left must hold no trace of the block:
    // no code block in the prose, and the same sections and items as the lesson has without it.
    const rest: Block[] = spacing.blocks.filter((b) => b.kind !== 'visual');
    const html = rest.flatMap((b) => (b.kind === 'prose' ? [b.html] : [])).join('');
    expect(html).not.toMatch(/<pre|<code|gap-timeline|learn\/spacing\/v1/);
    expect(rest.filter((b) => b.kind === 'section').length).toBe(6);
    expect(spacing.itemIds).toEqual(['learn/spacing/open', 'learn/spacing/why', 'learn/spacing/scenario', 'learn/spacing/r1', 'learn/spacing/r2', 'learn/spacing/r3']);
    expect(spacing.itemIds).not.toContain('learn/spacing/v1');
  });
});

describe('visual blocks in a lesson file', () => {
  it('parses into its own block between the prose around it', () => {
    const l = build('## The idea\n\nBefore.\n\n' + block(GOOD) + '\nAfter.\n')().courses[0].lessons[0];
    expect(l.blocks.map((b) => b.kind)).toEqual(['section', 'prose', 'visual', 'prose']);
    expect(l.visualIds).toEqual(['t/a/v1']);
  });
  it('still treats an ordinary code block as prose', () => {
    const l = build('Text.\n\n```\nid: t/a/v1\n```\n')().courses[0].lessons[0];
    expect(l.blocks.map((b) => b.kind)).toEqual(['prose']);
    expect(l.visualIds).toEqual([]);
  });
  it('rejects an unknown kind', () => {
    expect(build(block(GOOD.replace('gap-timeline', 'pie')))).toThrow(/unknown kind/);
  });
  it('rejects an id outside its lesson, and a missing id', () => {
    expect(build(block(GOOD.replace('t/a/v1', 't/b/v1')))).toThrow(/does not start/);
    expect(build(block(GOOD.replace('id: t/a/v1\n', '')))).toThrow(/no "id"/);
  });
  it('rejects a missing title, text or rows, and a row that is not numbers', () => {
    expect(build(block(GOOD.replace('title: T\n', '')))).toThrow(/no "title"/);
    expect(build(block(GOOD.replace('text: What it shows.\n', '')))).toThrow(/no "text"/);
    expect(build(block(GOOD.split('rows:')[0].trimEnd()))).toThrow(/no "rows"/);
    expect(build(block(GOOD.replace('gap: 1', 'gap: one')))).toThrow(/must be numbers/);
    expect(build(block(GOOD.replace('delay: 7', 'delay: 0')))).toThrow(/must be numbers/);
  });
  it('rejects a block that is never closed, and an id used twice', () => {
    expect(build('```visual\n' + GOOD + '\n')).toThrow(/never closed/);
    expect(build(block(GOOD) + '\n' + block(GOOD))).toThrow(/duplicate/);
  });
});

describe('L15, interactive visuals', () => {
  const now = new Date(2026, 10, 20, 12);
  const s = (value: string, until: string | null = null) => ({ experiments: {}, whole: { L15: { value, since: 'x', until } } });

  it('is off on a phone with no stored settings, and is not an on-by-default experiment', () => {
    expect(visualsOn({ experiments: {}, whole: {} }, now)).toBe(false);
    expect(activeWhole({ experiments: {}, whole: {} }, now)).toEqual({});
    expect(experimentById('L15')).toBeUndefined();
  });
  it('is on only with a stored "on" that has not passed its last day', () => {
    expect(visualsOn(s('on'), now)).toBe(true);
    expect(activeWhole(s('on'), now)).toEqual({ L15: 'on' });
    expect(visualsOn(s('off'), now)).toBe(false);
    expect(visualsOn(s('on', '2026-11-19'), now)).toBe(false);
  });
});

describe('gap timeline picture', () => {
  it('puts the review between study and test, to scale', () => {
    const p = gapTimelinePoints({ delay: 7, gap: 1, share: 14 });
    expect((p.review - p.study) / (p.test - p.study)).toBeCloseTo(1 / 8, 5);
    const year = gapTimelinePoints({ delay: 350, gap: 21, share: 6 });
    expect((year.review - year.study) / (year.test - year.study)).toBeCloseTo(21 / 371, 5);
  });
  it('says only what the row holds', () => {
    expect(gapTimelineSentence({ delay: 7, gap: 1, share: 14 })).toBe('Test 7 days after the review: the best gap tested for recall was 1 day, about 14% of the delay.');
    expect(gapTimelineSvg({ delay: 35, gap: 11, share: 31 })).toContain('gap: 11 days');
  });
});
