import { describe, expect, it } from 'vitest';
import { resolve } from 'node:path';
import { parseCourses } from '../src/build/parse-courses';
import { computeSchedules, courseProgress, dueItems, scheduledItemIds } from '../src/scheduler';
import { buildExport, EXPORT_SCHEMA_VERSION } from '../src/export';
import type { Attempt, Mark, Mode } from '../src/store';

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
