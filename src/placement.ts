// Turns placement answers into a per-lesson result. Kept apart from the screens so it can be tested.

import type { Course, Lesson, Placement } from './types';
import type { Attempt } from './store';

export interface PlacementRow {
  order: number;
  /** Absent when the quiz points at a planned lesson that has no file yet. */
  lesson?: Lesson;
  /** Every concept item for the lesson was right and sure. Always false for a planned lesson. */
  solid: boolean;
}

export interface PlacementResult {
  rows: PlacementRow[];
  /** The earliest written lesson whose concept items were not all right and sure. Never a planned lesson. */
  start?: Lesson;
}

/**
 * One row per lesson number that a why or scenario item points at, in lesson order. Recall items
 * are left out: they ask for figures from single papers, so missing them says little.
 */
export function placementResult(course: Course, p: Placement, latest: Map<string, Attempt>): PlacementResult {
  const byOrder = new Map(course.lessons.map((l) => [l.order, l]));
  const concept = p.blocks.flatMap((b) => (b.kind === 'item' && b.item.type !== 'recall' && b.item.targetLessonOrder !== undefined ? [b.item] : []));
  const orders = [...new Set(concept.map((it) => it.targetLessonOrder!))].sort((a, b) => a - b);
  const rows: PlacementRow[] = orders.map((order) => {
    const lesson = byOrder.get(order);
    if (!lesson) return { order, solid: false };
    // Solid is right and sure. An item whose L11 arm is "none" was never asked how sure, so right is enough.
    const solid = concept.filter((it) => it.targetLessonOrder === order).every((it) => {
      const a = latest.get(it.id);
      return a?.mark === 'right' && (a.confidence === 'sure' || a.variants?.L11 === 'none');
    });
    return { order, lesson, solid };
  });
  return { rows, start: rows.find((r) => r.lesson && !r.solid)?.lesson };
}
