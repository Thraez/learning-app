// Variants: per-item experiments (an item gets one arm, once, for good) and whole-app settings
// (a value that applies to the whole app for a period). Both are off or at their default until the
// owner switches them on in Settings, so shipping this changes nothing by itself.

import type { Item, Lesson } from './types';
import {
  getAssignments, getSettings, nowIso, saveAssignments,
  type Assignments, type Settings, type VariantMap,
} from './store';

export interface Experiment {
  id: string;
  title: string;
  arms: [string, string];
  /** One plain sentence for the Settings screen. */
  about: string;
  /** Which items of a lesson can take part. */
  eligible: (item: Item) => boolean;
}

export const EXPERIMENTS: Experiment[] = [
  {
    id: 'L1',
    title: 'Recall or reread',
    arms: ['recall', 'reread'],
    about: 'Half of the recall items in lessons are shown with their answer and read, not asked; reviews always ask.',
    eligible: (item) => item.type === 'recall',
  },
  {
    id: 'L11',
    title: 'Confidence before the answer',
    arms: ['ask', 'none'],
    about: 'Half of the items make you pick sure, unsure or guess before the answer shows; the other half skip it.',
    eligible: () => true,
  },
];

export const experimentById = (id: string) => EXPERIMENTS.find((e) => e.id === id);

export type ReviewSize = 'short' | 'standard' | 'open';
export const REVIEW_SIZES: Record<ReviewSize, { label: string; cap: number }> = {
  short: { label: 'Short (5 items)', cap: 5 },
  standard: { label: 'Standard (10 items)', cap: 10 },
  open: { label: 'Open (all due items)', cap: Infinity },
};
export const E6_DEFAULT: ReviewSize = 'standard';

export const experimentOn = (s: Settings, id: string) => s.experiments[id] === true;

/** Today's date as YYYY-MM-DD in local time, the format of an end date. */
export function localDay(d: Date): string {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

/** The whole-app variants in force now: only those set to a non-default value and not past their end date. */
export function activeWhole(s: Settings, now = new Date()): VariantMap {
  const out: VariantMap = {};
  const e6 = s.whole.E6;
  if (e6 && e6.value in REVIEW_SIZES && e6.value !== E6_DEFAULT && !(e6.until && localDay(now) > e6.until)) out.E6 = e6.value;
  return out;
}

export function reviewCap(s: Settings, now = new Date()): number {
  const v = (activeWhole(s, now).E6 ?? E6_DEFAULT) as ReviewSize;
  return REVIEW_SIZES[v].cap;
}

/** Fisher-Yates shuffle of a copy. */
export function shuffle<T>(list: readonly T[], rand: () => number): T[] {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Gives an arm to each item that has none, and leaves the rest alone. `existing` maps itemId to the
 * arm it already has. The unassigned items are shuffled, then each takes the arm that is currently
 * less common among the lesson's items; a tie goes to a random arm. With no assignments yet this
 * alternates, so the arms split as evenly as the count allows; a later item gets the rarer arm.
 */
export function drawArms(
  itemIds: readonly string[],
  existing: Record<string, string>,
  arms: readonly [string, string],
  rand: () => number,
): Record<string, string> {
  const counts = new Map<string, number>(arms.map((a) => [a, 0]));
  for (const id of itemIds) {
    const a = existing[id];
    if (a !== undefined && counts.has(a)) counts.set(a, counts.get(a)! + 1);
  }
  const out: Record<string, string> = {};
  for (const id of shuffle(itemIds.filter((i) => existing[i] === undefined), rand)) {
    const [c0, c1] = [counts.get(arms[0])!, counts.get(arms[1])!];
    const arm = c0 < c1 ? arms[0] : c1 < c0 ? arms[1] : arms[rand() < 0.5 ? 0 : 1];
    out[id] = arm;
    counts.set(arm, counts.get(arm)! + 1);
  }
  return out;
}

/** Draws arms for a lesson's eligible items, for each of the given experiments that is on. Stored for good. */
export function ensureLessonAssignments(lesson: Lesson, experimentIds: string[], rand: () => number = Math.random) {
  const settings = getSettings();
  let all: Assignments | null = null;
  for (const exp of EXPERIMENTS) {
    if (!experimentIds.includes(exp.id) || !experimentOn(settings, exp.id)) continue;
    const ids = lesson.blocks.flatMap((b) => (b.kind === 'item' && exp.eligible(b.item) ? [b.item.id] : []));
    all ??= getAssignments();
    const existing: Record<string, string> = {};
    for (const id of ids) if (all[id]?.[exp.id]) existing[id] = all[id][exp.id].arm;
    const drawn = drawArms(ids, existing, exp.arms, rand);
    const at = nowIso();
    for (const [id, arm] of Object.entries(drawn)) (all[id] ??= {})[exp.id] = { arm, assignedAt: at };
    if (Object.keys(drawn).length) saveAssignments(all);
  }
}

/** The item's arms for experiments that are on. Switched-off experiments keep their assignments but apply nothing. */
export function itemArms(settings: Settings, assignments: Assignments, itemId: string): VariantMap {
  const out: VariantMap = {};
  for (const exp of EXPERIMENTS) {
    const a = assignments[itemId]?.[exp.id];
    if (a && experimentOn(settings, exp.id)) out[exp.id] = a.arm;
  }
  return out;
}
