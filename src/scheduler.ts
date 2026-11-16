// Review schedule and progress, both derived from the attempt log.
//
// Scheduler: FSRS (ts-fsrs) with short-term learning steps off, so a missed item comes back on a
// later day; the same-session return of missed items is handled by the session queue instead.
// Only lesson items of type recall, why and scenario are scheduled. Opening questions and
// placement items are pretests, so they are recorded but never scheduled.
// Marks map to ratings: right = Good, partly = Hard, wrong = Again. "retry" attempts (the
// second try inside a session) are not fed to the scheduler.

import { fsrs, createEmptyCard, Rating, type Card, type Grade, type State } from 'ts-fsrs';
import type { Attempt, Mark } from './store';
import type { Course, ItemType } from './types';

const f = fsrs({ enable_short_term: false, enable_fuzz: false });

export const SCHEDULED_TYPES: ItemType[] = ['recall', 'why', 'scenario'];
const RATING: Record<Mark, Grade> = {
  right: Rating.Good,
  partly: Rating.Hard,
  wrong: Rating.Again,
};

export interface ItemSchedule {
  itemId: string;
  card: Card;
}

/** Item ids of a course that the scheduler handles, in lesson order. */
export function scheduledItemIds(course: Course): string[] {
  const out: string[] = [];
  for (const l of course.lessons) {
    if (l.status === 'retired') continue;
    for (const b of l.blocks) if (b.kind === 'item' && SCHEDULED_TYPES.includes(b.item.type)) out.push(b.item.id);
  }
  return out;
}

function schedulingAttempts(attempts: readonly Attempt[]): Map<string, Attempt[]> {
  const by = new Map<string, Attempt[]>();
  for (const a of attempts) {
    if (a.mode !== 'lesson' && a.mode !== 'review') continue;
    if (!SCHEDULED_TYPES.includes(a.itemType)) continue;
    const list = by.get(a.itemId) ?? [];
    list.push(a);
    by.set(a.itemId, list);
  }
  for (const list of by.values()) list.sort((x, y) => x.markedAt.localeCompare(y.markedAt));
  return by;
}

/** Replays each item's attempts through FSRS. Items never attempted have no schedule. */
export function computeSchedules(attempts: readonly Attempt[]): Map<string, ItemSchedule> {
  const out = new Map<string, ItemSchedule>();
  for (const [itemId, list] of schedulingAttempts(attempts)) {
    let card = createEmptyCard(new Date(list[0].markedAt));
    for (const a of list) card = f.next(card, new Date(a.markedAt), RATING[a.mark]).card;
    out.set(itemId, { itemId, card });
  }
  return out;
}

/** Due items of a course, most overdue first. Ids no longer in the course are skipped. */
export function dueItems(course: Course, schedules: Map<string, ItemSchedule>, now = new Date()): string[] {
  return scheduledItemIds(course)
    .map((id) => schedules.get(id))
    .filter((s): s is ItemSchedule => !!s && s.card.due.getTime() <= now.getTime())
    .sort((a, b) => a.card.due.getTime() - b.card.due.getTime())
    .map((s) => s.itemId);
}

export function nextDue(course: Course, schedules: Map<string, ItemSchedule>, now = new Date()): Date | null {
  let best: Date | null = null;
  for (const id of scheduledItemIds(course)) {
    const s = schedules.get(id);
    if (!s || s.card.due.getTime() <= now.getTime()) continue;
    if (!best || s.card.due < best) best = s.card.due;
  }
  return best;
}

export function stateName(s: State): string {
  const names = ['New', 'Learning', 'Review', 'Relearning'];
  return names[s as number] ?? String(s);
}

// ---- Progress (competence, not activity) ----

export const LATE_DAYS = 14;
const DAY = 24 * 3600 * 1000;
const SCORE: Record<Mark, number> = { right: 1, partly: 0.5, wrong: 0 };

export interface CourseProgress {
  lessonsTotal: number;
  lessonsFinished: number;
  itemsTotal: number;
  itemsStarted: number;
  /** Items whose most recent lesson or review mark is "right". */
  itemsLearned: number;
  itemsPartly: number;
  /** Answers given 14 or more days after the item was first answered. */
  late: { answers: number; items: number; score: number | null };
  /** When the earliest started item reaches 14 days, if none has yet. */
  lateStartsOn: Date | null;
}

export function courseProgress(
  course: Course,
  attempts: readonly Attempt[],
  finishedLessonIds: Set<string>,
  now = new Date(),
): CourseProgress {
  const ids = new Set(scheduledItemIds(course));
  const by = schedulingAttempts(attempts.filter((a) => ids.has(a.itemId)));
  let learned = 0;
  let partly = 0;
  let lateAnswers = 0;
  let lateScore = 0;
  const lateItems = new Set<string>();
  let earliestFirst: number | null = null;

  for (const [itemId, list] of by) {
    const last = list[list.length - 1];
    if (last.mark === 'right') learned++;
    else if (last.mark === 'partly') partly++;
    const first = new Date(list[0].markedAt).getTime();
    if (earliestFirst === null || first < earliestFirst) earliestFirst = first;
    for (const a of list) {
      if (new Date(a.markedAt).getTime() - first >= LATE_DAYS * DAY) {
        lateAnswers++;
        lateScore += SCORE[a.mark];
        lateItems.add(itemId);
      }
    }
  }
  const live = course.lessons.filter((l) => l.status !== 'retired');
  return {
    lessonsTotal: live.length,
    lessonsFinished: live.filter((l) => finishedLessonIds.has(l.id)).length,
    itemsTotal: ids.size,
    itemsStarted: by.size,
    itemsLearned: learned,
    itemsPartly: partly,
    late: { answers: lateAnswers, items: lateItems.size, score: lateAnswers ? lateScore / lateAnswers : null },
    lateStartsOn:
      lateAnswers === 0 && earliestFirst !== null && earliestFirst + LATE_DAYS * DAY > now.getTime()
        ? new Date(earliestFirst + LATE_DAYS * DAY)
        : null,
  };
}
