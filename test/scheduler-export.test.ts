import { describe, expect, it } from 'vitest';
import { resolve } from 'node:path';
import { parseCourses } from '../src/build/parse-courses';
import { computeSchedules, courseMap, courseProgress, dueItems, scheduledItemIds, stageOf, todayPlan } from '../src/scheduler';
import { buildExport, EXPORT_SCHEMA_VERSION } from '../src/export';
import type { Attempt, Mark, Mode, Session } from '../src/store';

const data = parseCourses(resolve(import.meta.dirname, '../courses'));
const course = data.courses.find((c) => c.id === 'gd-econ')!;
const DAY = 86_400_000;

function attempt(itemId: string, at: Date, mark: Mark, mode: Mode = 'lesson', itemType: Attempt['itemType'] = 'recall'): Attempt {
  return {
    attemptId: Math.random().toString(36), itemId, itemType, courseId: 'gd-econ', courseVersion: course.version,
    parentId: itemId.split('/').slice(0, 2).join('/'), sessionId: 's1', mode, shownAt: at.toISOString(),
    revealedAt: at.toISOString(), markedAt: at.toISOString(), text: 'my answer', confidence: 'sure', mark,
    variant: 'default', appBuild: 'test',
  };
}

describe('scheduler', () => {
  it('schedules recall, why and scenario items but not opening questions', () => {
    const ids = scheduledItemIds(course);
    expect(ids).toContain('gd-econ/endowment/r1');
    expect(ids).toContain('gd-econ/endowment/why');
    expect(ids).not.toContain('gd-econ/endowment/open');
  });

  it('brings a wrong item back sooner than a right one, and never on the same day', () => {
    const t0 = new Date('2026-11-16T08:00:00Z');
    const s = computeSchedules([
      attempt('gd-econ/endowment/r1', t0, 'right'),
      attempt('gd-econ/endowment/r2', t0, 'wrong'),
    ]);
    const right = s.get('gd-econ/endowment/r1')!.card.due.getTime();
    const wrong = s.get('gd-econ/endowment/r2')!.card.due.getTime();
    expect(wrong).toBeLessThanOrEqual(right);
    expect(wrong - t0.getTime()).toBeGreaterThanOrEqual(DAY * 0.9);
    expect(dueItems(course, s, t0)).toEqual([]);
    expect(dueItems(course, s, new Date(t0.getTime() + 60 * DAY))).toContain('gd-econ/endowment/r1');
  });

  it('ignores retry and placement attempts and unknown ids', () => {
    const t0 = new Date('2026-11-16T08:00:00Z');
    const s = computeSchedules([
      attempt('gd-econ/endowment/r1', t0, 'wrong', 'retry'),
      attempt('gd-econ/placement/p01', t0, 'wrong', 'placement'),
      attempt('gd-econ/gone/r1', t0, 'wrong'),
    ]);
    expect(s.has('gd-econ/endowment/r1')).toBe(false);
    expect(s.has('gd-econ/placement/p01')).toBe(false);
    expect(dueItems(course, s, new Date(t0.getTime() + 30 * DAY))).toEqual([]);
  });
});

describe('progress', () => {
  it('counts late recall only for answers 14 or more days after the first', () => {
    const t0 = new Date('2026-11-01T08:00:00Z');
    const log = [
      attempt('gd-econ/endowment/r1', t0, 'right'),
      attempt('gd-econ/endowment/r1', new Date(t0.getTime() + 3 * DAY), 'right', 'review'),
      attempt('gd-econ/endowment/r1', new Date(t0.getTime() + 15 * DAY), 'partly', 'review'),
      attempt('gd-econ/endowment/r2', t0, 'wrong'),
    ];
    const p = courseProgress(course, log, new Set(['gd-econ/endowment']), new Date(t0.getTime() + 16 * DAY));
    expect(p.lessonsFinished).toBe(1);
    expect(p.itemsStarted).toBe(2);
    expect(p.itemsLearned).toBe(0);
    expect(p.itemsPartly).toBe(1);
    expect(p.late).toEqual({ answers: 1, items: 1, score: 0.5 });
  });

  it('says when late recall starts if nothing is old enough', () => {
    const t0 = new Date('2026-11-16T08:00:00Z');
    const p = courseProgress(course, [attempt('gd-econ/endowment/r1', t0, 'right')], new Set(), t0);
    expect(p.late.score).toBeNull();
    expect(p.lateStartsOn?.toISOString()).toBe('2026-11-30T08:00:00.000Z');
  });
});

describe('export', () => {
  it('keeps every attempt with its free text, including items no longer in the build', () => {
    const t0 = new Date('2026-11-16T08:00:00Z');
    const log = [
      attempt('gd-econ/endowment/why', t0, 'partly', 'lesson', 'why'),
      attempt('gd-econ/gone/r1', t0, 'wrong'),
    ];
    const out = buildExport(data, log, [], 'test', t0);
    expect(out.schema).toBe('learning-app-export');
    expect(out.schemaVersion).toBe(EXPORT_SCHEMA_VERSION);
    const why = out.items.find((i) => i.itemId === 'gd-econ/endowment/why')!;
    expect(why.inCurrentBuild).toBe(true);
    expect(why.attempts[0].text).toBe('my answer');
    expect(why.schedule?.state).toBeTypeOf('string');
    const gone = out.items.find((i) => i.itemId === 'gd-econ/gone/r1')!;
    expect(gone.inCurrentBuild).toBe(false);
    expect(out.courses[0].lessons.length).toBeGreaterThanOrEqual(6);
    expect(JSON.parse(JSON.stringify(out))).toEqual(out);
  });
});

describe('stages, the map and the today plan', () => {
  const t0 = new Date('2026-11-16T12:00:00Z');
  const at = (days: number) => new Date(t0.getTime() + days * DAY);
  const R1 = 'gd-econ/endowment/r1';
  const session = (kind: Session['kind'], courseId: string, targetId: string, when: Date): Session => ({
    sessionId: Math.random().toString(36), kind, courseId, courseVersion: '0', targetId, startedAt: when.toISOString(),
    endedAt: when.toISOString(), completed: true, variant: 'default', appBuild: 'test',
  });

  it('moves an item up only on a right answer after a gap, and back on a miss', () => {
    expect(stageOf([])).toBe('new');
    expect(stageOf([attempt(R1, t0, 'right')])).toBe('answered');
    expect(stageOf([attempt(R1, t0, 'wrong'), attempt(R1, at(3), 'right', 'review')])).toBe('day');
    expect(stageOf([attempt(R1, t0, 'right'), attempt(R1, at(3), 'right', 'review'), attempt(R1, at(11), 'right', 'review')])).toBe('week');
    expect(stageOf([attempt(R1, t0, 'right'), attempt(R1, at(15), 'right', 'review')])).toBe('late');
    // Partly holds the stage; wrong resets it.
    expect(stageOf([attempt(R1, t0, 'right'), attempt(R1, at(8), 'right', 'review'), attempt(R1, at(20), 'partly', 'review')])).toBe('week');
    expect(stageOf([attempt(R1, t0, 'right'), attempt(R1, at(8), 'right', 'review'), attempt(R1, at(20), 'wrong', 'review')])).toBe('answered');
  });

  it('keeps a read exposure apart from an answer', () => {
    const read: Attempt = { ...attempt(R1, t0, 'right'), exposure: 'read', mark: null };
    expect(stageOf([read])).toBe('read');
    // A right answer three days after the read is a real gap.
    expect(stageOf([read, attempt(R1, at(3), 'right', 'review')])).toBe('day');
  });

  it('counts every scheduled item once and calls a lesson explained on its why and scenario answers', () => {
    const lesson = course.lessons.find((l) => l.id === 'gd-econ/endowment')!;
    const items = lesson.blocks.flatMap((b) => (b.kind === 'item' && b.item.type !== 'open' ? [b.item] : []));
    const explain = items.filter((i) => i.type !== 'recall');
    expect(explain.length).toBeGreaterThan(0);
    const fresh = courseMap(course, []);
    expect(fresh.counts.new).toBe(scheduledItemIds(course).length);
    expect(fresh.explained).toBe(0);
    expect(fresh.lessons[0].started).toBe(false);
    const some = explain.map((i) => attempt(i.id, t0, 'right', 'lesson', i.type));
    const map = courseMap(course, some);
    const row = map.lessons.find((l) => l.lessonId === lesson.id)!;
    expect(row.explained).toBe(true);
    expect(row.right).toBe(explain.length);
    expect(map.counts.answered).toBe(explain.length);
    expect(Object.values(map.counts).reduce((a, b) => a + b, 0)).toBe(scheduledItemIds(course).length);
    // A later miss on one of them takes the lesson off the list.
    const missed = courseMap(course, [...some, attempt(explain[0].id, at(3), 'wrong', 'review', explain[0].type)]);
    expect(missed.explained).toBe(0);
  });

  it('plans nothing before the first session, then a review and the next lesson of the course studied last', () => {
    const all = data.courses;
    const dayStart = at(6).getTime() - DAY / 2;
    const empty = todayPlan(all, [], [], 10, dayStart, at(6));
    expect(empty).toMatchObject({ started: false, next: null, reviews: [], reviewedToday: 0, lessonsToday: [] });

    const attempts = ['r1', 'r2', 'r3'].map((r) => attempt(`gd-econ/endowment/${r}`, t0, 'right'));
    const sessions = [session('lesson', 'gd-econ', 'gd-econ/endowment', t0)];
    const sameDay = todayPlan(all, attempts, sessions, 10, t0.getTime() - DAY / 2, t0);
    expect(sameDay.reviews).toEqual([]);
    expect(sameDay.lessonsToday).toEqual(['gd-econ/endowment']);
    expect(sameDay.nextDue!.getTime()).toBeGreaterThan(t0.getTime());
    expect(sameDay.next).toEqual({ courseId: 'gd-econ', lessonId: course.lessons[1].id });

    const later = todayPlan(all, attempts, sessions, 2, dayStart, at(6));
    expect(later.reviews).toEqual([{ courseId: 'gd-econ', count: 2 }]);
    expect(later.nextDue).toBeNull();
    expect(later.lessonsToday).toEqual([]);

    const reviewed = [...attempts, attempt('gd-econ/endowment/r1', at(6), 'right', 'review')];
    expect(todayPlan(all, reviewed, sessions, 10, dayStart, at(6)).reviewedToday).toBe(1);

    // A session in the other course moves the next lesson there.
    const other = [...sessions, session('placement', 'learn', 'learn/placement', at(5))];
    expect(todayPlan(all, attempts, other, 10, dayStart, at(6)).next!.courseId).toBe('learn');
  });
});
