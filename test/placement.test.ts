// Placement result: which lessons the summary lists, which it calls planned, and where it says to start.

import { describe, expect, it } from 'vitest';
import { placementResult } from '../src/placement';
import type { Course, Item, Lesson, Placement } from '../src/types';
import type { Attempt } from '../src/store';

const lesson = (order: number): Lesson => ({
  id: `t/l${order}`, slug: `l${order}`, file: `lessons/0${order}.md`, title: `L${order}`, order, status: 'draft', sources: [], blocks: [], itemIds: [], visualIds: [],
});
const item = (n: number, type: Item['type'], target: number): Item => ({
  id: `t/placement/p${n}`, type, parentId: 't/placement', promptHtml: 'Q', answerHtml: 'A', answerLabel: 'Answer', targetLessonOrder: target,
});
const items = [item(1, 'scenario', 1), item(2, 'recall', 1), item(3, 'why', 2), item(4, 'scenario', 2), item(5, 'why', 4)];
const placement: Placement = {
  id: 't/placement', file: 'placement-quiz.md', title: 'Placement quiz', status: 'draft',
  blocks: items.map((it) => ({ kind: 'item' as const, item: it })), itemIds: items.map((it) => it.id),
};
const course: Course = {
  id: 't', folder: 't', title: 'T', version: '0.1.0', status: 'draft', html: '', lessons: [lesson(1), lesson(2), lesson(3)], lessonsPlanned: 5, placement,
};
const answer = (n: number, mark: 'right' | 'wrong', confidence: 'sure' | 'unsure' | null, l11?: string) =>
  [`t/placement/p${n}`, { mark, confidence, variants: l11 ? { L11: l11 } : undefined } as unknown as Attempt] as const;

describe('placementResult', () => {
  it('lists a planned lesson without a file and never starts there', () => {
    const r = placementResult(course, placement, new Map([answer(1, 'right', 'sure'), answer(3, 'right', 'sure'), answer(4, 'right', 'sure')]));
    expect(r.rows.map((x) => [x.order, x.lesson?.id, x.solid])).toEqual([[1, 't/l1', true], [2, 't/l2', true], [4, undefined, false]]);
    expect(r.start).toBeUndefined();
  });
  it('starts at the earliest written lesson that was missed', () => {
    const r = placementResult(course, placement, new Map([answer(1, 'right', 'sure'), answer(3, 'right', 'sure'), answer(4, 'wrong', 'sure')]));
    expect(r.start?.id).toBe('t/l2');
    expect(placementResult(course, placement, new Map()).start?.id).toBe('t/l1');
  });
  it('needs right and sure, ignores recall items, and takes right alone when confidence was not asked', () => {
    expect(placementResult(course, placement, new Map([answer(1, 'right', 'unsure')])).rows[0].solid).toBe(false);
    expect(placementResult(course, placement, new Map([answer(1, 'right', null, 'none'), answer(2, 'wrong', 'sure')])).rows[0].solid).toBe(true);
  });
  it('has no start for a quiz that only points at planned lessons', () => {
    const r = placementResult({ ...course, lessons: [] }, placement, new Map());
    expect(r.rows.length).toBe(3);
    expect(r.rows.every((x) => !x.lesson)).toBe(true);
    expect(r.start).toBeUndefined();
  });
});
