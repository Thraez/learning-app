// Review schedule and progress, both derived from the attempt log.
//
// Scheduler: FSRS (ts-fsrs) with short-term learning steps off, so a missed item comes back on a
// later day; the same-session return of missed items is handled by the session queue instead.
// Only lesson items of type recall, why and scenario are scheduled. Opening questions and
// placement items are pretests, so they are recorded but never scheduled.
// Marks map to ratings: right = Good, partly = Hard, wrong = Again. "retry" attempts (the
// second try inside a session) are not fed to the scheduler. A read exposure (the L1 reread arm)
// counts as a first rating of Good, so the item enters review like a correctly recalled one.

import { fsrs, createEmptyCard, Rating, type Card, type Grade, type State } from 'ts-fsrs';
import { isRead, type Attempt, type Mark, type Session } from './store';
import type { Course, ItemType } from './types';

const f = fsrs({ enable_short_term: false, enable_fuzz: false });

export const SCHEDULED_TYPES: ItemType[] = ['recall', 'why', 'scenario'];
const RATING: Record<Mark, Grade> = {
  right: Rating.Good,
  partly: Rating.Hard,
  wrong: Rating.Again,
};

function ratingOf(a: Attempt): Grade {
  return isRead(a) || a.mark === null ? Rating.Good : RATING[a.mark];
}

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
    for (const a of list) card = f.next(card, new Date(a.markedAt), ratingOf(a)).card;
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
  // A read exposure is not an answer: it is left out of learned, accuracy and late recall.
  const by = schedulingAttempts(attempts.filter((a) => ids.has(a.itemId) && !isRead(a)));
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
        lateScore += SCORE[a.mark!];
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

// ---- Stages (what each item has been through) and the knowledge map ----
//
// A stage says what has happened, never what will: the longest gap an item was answered right
// across. It comes from the answers alone, not from the FSRS card, because a read exposure moves
// the card but is not an answer. A miss sends the item back to "answered".

export const STAGES = ['new', 'read', 'answered', 'day', 'week', 'late'] as const;
export type Stage = (typeof STAGES)[number];
export const WEEK_DAYS = 7;

/** Stage of one item from its lesson and review attempts, oldest first. */
export function stageOf(list: readonly Attempt[]): Stage {
  let gap = 0;
  let answered = false;
  for (let i = 0; i < list.length; i++) {
    const a = list[i];
    if (isRead(a) || !a.mark) continue;
    answered = true;
    if (a.mark === 'wrong') gap = 0;
    else if (a.mark === 'right' && i > 0) {
      gap = Math.max(gap, new Date(a.markedAt).getTime() - new Date(list[i - 1].markedAt).getTime());
    }
  }
  if (!answered) return list.length ? 'read' : 'new';
  if (gap >= LATE_DAYS * DAY) return 'late';
  if (gap >= WEEK_DAYS * DAY) return 'week';
  if (gap >= DAY) return 'day';
  return 'answered';
}

/** Stage of every item that has a lesson or review attempt. An item not in the map is "new". */
export function itemStages(attempts: readonly Attempt[]): Map<string, Stage> {
  const out = new Map<string, Stage>();
  for (const [id, list] of schedulingAttempts(attempts)) out.set(id, stageOf(list));
  return out;
}

export interface LessonMap {
  lessonId: string;
  items: { id: string; stage: Stage }[];
  /** Items whose latest answer was marked right. */
  right: number;
  started: boolean;
  /** The latest answer to every why and scenario item was marked right (every item, if the lesson has neither). */
  explained: boolean;
}

export interface CourseMap {
  lessons: LessonMap[];
  counts: Record<Stage, number>;
  explained: number;
}

export function courseMap(course: Course, attempts: readonly Attempt[]): CourseMap {
  const by = schedulingAttempts(attempts);
  const counts: Record<Stage, number> = { new: 0, read: 0, answered: 0, day: 0, week: 0, late: 0 };
  const lessons: LessonMap[] = [];
  for (const l of course.lessons) {
    if (l.status === 'retired') continue;
    const all = l.blocks.flatMap((b) => (b.kind === 'item' && SCHEDULED_TYPES.includes(b.item.type) ? [b.item] : []));
    const lastRight = (id: string) => (by.get(id) ?? []).filter((a) => !isRead(a) && a.mark).at(-1)?.mark === 'right';
    const items = all.map((it) => ({ id: it.id, stage: stageOf(by.get(it.id) ?? []) }));
    for (const it of items) counts[it.stage]++;
    const explain = all.filter((it) => it.type !== 'recall');
    const need = explain.length ? explain : all;
    lessons.push({
      lessonId: l.id,
      items,
      right: all.filter((it) => lastRight(it.id)).length,
      started: items.some((it) => it.stage !== 'new'),
      explained: need.length > 0 && need.every((it) => lastRight(it.id)),
    });
  }
  return { lessons, counts, explained: lessons.filter((l) => l.explained).length };
}

// ---- Today: a short review, then one new lesson ----

export interface TodayPlan {
  /** Courses with items due, and how many the review session will serve (the cap applied). */
  reviews: { courseId: string; count: number }[];
  /** The next unfinished lesson of the course studied last. Null before the first session, or when none is left. */
  next: { courseId: string; lessonId: string } | null;
  /** False until the first session of any kind. */
  started: boolean;
  reviewedToday: number;
  lessonsToday: string[];
  /** Earliest coming review over all courses, when nothing is due now. */
  nextDue: Date | null;
}

export function todayPlan(
  courses: readonly Course[],
  attempts: readonly Attempt[],
  sessions: readonly Session[],
  cap: number,
  dayStart: number,
  now = new Date(),
): TodayPlan {
  const schedules = computeSchedules(attempts);
  const reviews: TodayPlan['reviews'] = [];
  let nd: Date | null = null;
  for (const c of courses) {
    const due = dueItems(c, schedules, now).length;
    if (due) reviews.push({ courseId: c.id, count: Math.min(due, cap) });
    const d = nextDue(c, schedules, now);
    if (d && (!nd || d < nd)) nd = d;
  }
  const finished = new Set(sessions.filter((s) => s.kind === 'lesson' && s.completed).map((s) => s.targetId));
  const last = [...sessions].sort((a, b) => a.startedAt.localeCompare(b.startedAt)).at(-1);
  let next: TodayPlan['next'] = null;
  if (last) {
    const order = [...courses].sort((a, b) => Number(b.id === last.courseId) - Number(a.id === last.courseId));
    for (const c of order) {
      const l = c.lessons.find((x) => x.status !== 'retired' && !finished.has(x.id));
      if (l) { next = { courseId: c.id, lessonId: l.id }; break; }
    }
  }
  const today = (iso: string | null) => !!iso && new Date(iso).getTime() >= dayStart;
  return {
    reviews,
    next,
    started: !!last,
    reviewedToday: attempts.filter((a) => a.mode === 'review' && !isRead(a) && today(a.markedAt)).length,
    lessonsToday: [...new Set(sessions.filter((s) => s.kind === 'lesson' && s.completed && today(s.endedAt)).map((s) => s.targetId))],
    nextDue: reviews.length ? null : nd,
  };
}
