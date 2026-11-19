// The pictures: the gap timeline's geometry and wording, and every visual block in the real courses.
// The other kinds (bars, dot-grid, spans) and the block parser are tested in flows.test.ts.

import { describe, expect, it } from 'vitest';
import { resolve } from 'node:path';
import { parseCourses } from '../src/build/parse-courses';
import { gapTimelinePoints, gapTimelineSentence, gapTimelineSvg, visualSvg } from '../src/visuals';
import type { Visual } from '../src/types';

const data = parseCourses(resolve(import.meta.dirname, '../courses'));
const lessons = data.courses.flatMap((c) => c.lessons);
const visuals: Visual[] = lessons.flatMap((l) => l.blocks.flatMap((b) => (b.kind === 'visual' ? [b.visual] : [])));

describe('gap timeline picture', () => {
  it('puts the review between study and test, to scale', () => {
    const p = gapTimelinePoints({ delay: 7, gap: 1, share: 14 });
    expect((p.review - p.study) / (p.test - p.study)).toBeCloseTo(1 / 8, 5);
    const year = gapTimelinePoints({ delay: 350, gap: 21, share: 6 });
    expect((year.review - year.study) / (year.test - year.study)).toBeCloseTo(21 / 371, 5);
  });
  it('keeps study at the left edge and test at the right for any row', () => {
    const a = gapTimelinePoints({ delay: 7, gap: 1, share: 14 });
    const b = gapTimelinePoints({ delay: 350, gap: 21, share: 6 });
    expect([a.study, a.test]).toEqual([b.study, b.test]);
    expect(a.study).toBeGreaterThanOrEqual(0);
    expect(a.test).toBeLessThanOrEqual(320);
  });
  it('says only what the row holds, with "day" for one', () => {
    expect(gapTimelineSentence({ delay: 7, gap: 1, share: 14 })).toBe('Test 7 days after the review: the best gap tested for recall was 1 day, about 14% of the delay.');
    expect(gapTimelineSentence({ delay: 1, gap: 2, share: 200 })).toContain('Test 1 day after');
  });
  it('labels the gap and the delay, and describes itself with the sentence', () => {
    const row = { delay: 35, gap: 11, share: 31 };
    const svg = gapTimelineSvg(row);
    expect(svg).toContain('gap: 11 days');
    expect(svg).toContain('delay: 35 days');
    expect(svg).toContain(`aria-label="${gapTimelineSentence(row)}"`);
  });
});

describe('the spacing lesson', () => {
  const spacing = lessons.find((l) => l.id === 'learn/spacing')!;
  const visual = spacing.blocks.flatMap((b) => (b.kind === 'visual' && b.visual.kind === 'gap-timeline' ? [b.visual] : []))[0];

  it('has its timeline under a stable id, with the four tested pairs', () => {
    expect(visual.id).toBe('learn/spacing/v1');
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
  it('keeps the visual out of the items the scheduler reads', () => {
    expect(spacing.itemIds).not.toContain('learn/spacing/v1');
  });
});

describe('every visual in the courses', () => {
  it('there are some, each with an id inside its lesson', () => {
    expect(visuals.length).toBeGreaterThan(3);
    for (const l of lessons) for (const b of l.blocks) if (b.kind === 'visual') expect(b.visual.id.startsWith(l.id + '/')).toBe(true);
  });
  it('draws as one SVG, 320 wide, with a description', () => {
    for (const v of visuals) {
      const svg = visualSvg(v);
      expect(svg.startsWith('<svg viewBox="0 0 320 ')).toBe(true);
      expect(svg.endsWith('</svg>')).toBe(true);
      expect(svg).toMatch(/role="img" aria-label="[^"]+"/);
      expect(svg).not.toMatch(/NaN|undefined|Infinity/);
    }
  });
  it('keeps every drawn x inside the picture', () => {
    for (const v of visuals) {
      const xs = [...visualSvg(v).matchAll(/\b(?:x|x1|x2|cx)="(-?[\d.]+)"/g)].map((m) => Number(m[1]));
      expect(xs.length).toBeGreaterThan(0);
      for (const x of xs) { expect(x, `${v.id}: x=${x}`).toBeGreaterThanOrEqual(0); expect(x, `${v.id}: x=${x}`).toBeLessThanOrEqual(320); }
    }
  });
});
