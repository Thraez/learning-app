import { beforeEach, describe, expect, it } from 'vitest';
import { resolve } from 'node:path';
import { parseCourses } from '../src/build/parse-courses';
import { computeSchedules, courseProgress } from '../src/scheduler';
import { buildExport } from '../src/export';
import { parseExportFile, restoreExport } from '../src/restore';
import { drawArms, activeWhole, reviewCap, itemArms, experimentOn } from '../src/variants';
import {
  getAssignments, getAttempts, getSessions, getSettings, saveAssignments, saveSettings, variantString,
  type Attempt, type Session,
} from '../src/store';

class MemoryStorage {
  private m = new Map<string, string>();
  getItem(k: string) { return this.m.get(k) ?? null; }
  setItem(k: string, v: string) { this.m.set(k, String(v)); }
  removeItem(k: string) { this.m.delete(k); }
  clear() { this.m.clear(); }
}
const storage = new MemoryStorage();
Object.defineProperty(globalThis, 'localStorage', { value: storage, configurable: true });

const data = parseCourses(resolve(import.meta.dirname, '../courses'));
const course = data.courses.find((c) => c.id === 'gd-econ')!;
const DAY = 86_400_000;
const T0 = new Date('2026-11-01T08:00:00Z');

/** Seeded random source so draws are repeatable. */
function seeded(seed = 7) {
  let x = seed;
  return () => ((x = (x * 1664525 + 1013904223) % 4294967296) / 4294967296);
}

function oldAttempt(n: number, itemId: string, at: Date, mark: 'right' | 'partly' | 'wrong', mode: Attempt['mode'] = 'lesson'): Attempt {
  // Exactly today's stored shape: no exposure, no variants.
  return {
    attemptId: `a${n}`, itemId, itemType: 'recall', courseId: 'gd-econ', courseVersion: course.version,
    parentId: itemId.split('/').slice(0, 2).join('/'), sessionId: 's1', mode, shownAt: at.toISOString(),
    revealedAt: at.toISOString(), markedAt: at.toISOString(), text: 'synthetic answer', confidence: 'sure', mark,
    variant: 'default', appBuild: 'old',
  };
}
const oldSession = (id: string, at: Date): Session => ({
  sessionId: id, kind: 'lesson', courseId: 'gd-econ', courseVersion: course.version, targetId: 'gd-econ/endowment',
  startedAt: at.toISOString(), endedAt: new Date(at.getTime() + 600_000).toISOString(), completed: true, variant: 'default', appBuild: 'old',
});

function seedOldStorage() {
  const attempts = [
    oldAttempt(1, 'gd-econ/endowment/r1', T0, 'right'),
    oldAttempt(2, 'gd-econ/endowment/r2', T0, 'wrong'),
    oldAttempt(3, 'gd-econ/endowment/r1', new Date(T0.getTime() + 15 * DAY), 'partly', 'review'),
  ];
  storage.setItem('learning-app:v1:attempts', JSON.stringify(attempts));
  storage.setItem('learning-app:v1:sessions', JSON.stringify([oldSession('s1', T0)]));
  return attempts;
}

const exportNow = () => {
  const e = buildExport(data, getAttempts(), getSessions(), 'test', new Date('2026-12-01T00:00:00Z'), getAssignments(), null);
  return JSON.parse(JSON.stringify(e));
};

beforeEach(() => storage.clear());

describe('old stored data', () => {
  it('loads, schedules and exports as before', () => {
    const attempts = seedOldStorage();
    expect(getAttempts()).toHaveLength(3);
    expect(getSessions()[0].variant).toBe('default');

    // The schedule must match a replay of the same records with the new fields spelled out.
    const explicit = attempts.map((a) => ({ ...a, exposure: 'answered' as const, variants: {} }));
    const now = computeSchedules(getAttempts());
    const spelled = computeSchedules(explicit);
    for (const id of ['gd-econ/endowment/r1', 'gd-econ/endowment/r2']) {
      expect(now.get(id)!.card.due.toISOString()).toBe(spelled.get(id)!.card.due.toISOString());
      expect(now.get(id)!.card.reps).toBe(spelled.get(id)!.card.reps);
    }
    // r1: Good then Hard; r2: Again. Same as the rating map has always given.
    expect(now.get('gd-econ/endowment/r1')!.card.reps).toBe(2);
    expect(now.get('gd-econ/endowment/r2')!.card.lapses).toBeGreaterThanOrEqual(0);

    const out = exportNow();
    expect(out.schemaVersion).toBe(2);
    const r1 = out.items.find((i: { itemId: string }) => i.itemId === 'gd-econ/endowment/r1');
    expect(r1.attempts[0].exposure).toBe('answered');
    expect(r1.attempts[0].variants).toEqual({});
    expect(out.sessions[0].appeal).toBeNull();
    expect(out.settings).toBeNull();
  });
});

describe('restore', () => {
  it('export, clear, restore, export again gives the same file apart from exportedAt', () => {
    seedOldStorage();
    // Add new-format records too: a read exposure, an appeal, an assignment, an experiment variant.
    const read: Attempt = {
      ...oldAttempt(4, 'gd-econ/endowment/r3', new Date(T0.getTime() + 1000), 'right'),
      mark: null, exposure: 'read', confidence: null, text: '', variant: 'L1=reread', variants: { L1: 'reread' },
    };
    storage.setItem('learning-app:v1:attempts', JSON.stringify([...getAttempts(), read]));
    storage.setItem('learning-app:v1:sessions', JSON.stringify([{ ...getSessions()[0], appeal: 'liked', appealAt: T0.toISOString(), variants: { E6: 'short' }, variant: 'E6=short' }]));
    saveAssignments({ 'gd-econ/endowment/r3': { L1: { arm: 'reread', assignedAt: T0.toISOString() } } });

    const before = exportNow();
    storage.clear();
    const parsed = parseExportFile(JSON.stringify(before));
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;
    const first = restoreExport(parsed.file);
    expect(first).toMatchObject({ attempts: 4, sessions: 1, assignments: 1, skipped: 0 });
    const after = exportNow();
    expect({ ...after, exportedAt: 0 }).toEqual({ ...before, exportedAt: 0 });

    const second = restoreExport(parsed.file);
    expect(second).toMatchObject({ attempts: 0, sessions: 0, assignments: 0, settingsRestored: false });
    expect(exportNow()).toEqual(after);
  });

  it('restores a version 1 file and rebuilds attempts from their items', () => {
    const v1 = {
      schema: 'learning-app-export', schemaVersion: 1, exportedAt: T0.toISOString(), appBuild: 'old', courses: [],
      sessions: [oldSession('s1', T0)],
      items: [{
        itemId: 'gd-econ/endowment/r1', courseId: 'gd-econ', parentId: 'gd-econ/endowment', itemType: 'recall',
        inCurrentBuild: true, firstAnsweredAt: T0.toISOString(), schedule: null,
        attempts: [(() => {
          const { itemId, itemType, courseId, parentId, ...rest } = oldAttempt(1, 'gd-econ/endowment/r1', T0, 'right');
          void itemId; void itemType; void courseId; void parentId;
          return rest;
        })()],
      }],
    };
    const parsed = parseExportFile(JSON.stringify(v1));
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;
    expect(restoreExport(parsed.file)).toMatchObject({ attempts: 1, sessions: 1 });
    const a = getAttempts()[0];
    expect(a).toMatchObject({ itemId: 'gd-econ/endowment/r1', itemType: 'recall', courseId: 'gd-econ', parentId: 'gd-econ/endowment', exposure: 'answered' });
    expect(a.variants).toEqual({});
  });

  it('never overwrites a local record, keeps local assignments and settings', () => {
    seedOldStorage();
    const file = exportNow();
    // Same IDs, different content in the file: the local copy must stay.
    file.items[0].attempts[0].text = 'changed in the file';
    saveAssignments({ x: { L1: { arm: 'recall', assignedAt: T0.toISOString() } } });
    saveSettings({ experiments: { L1: true }, whole: {} });
    file.assignments = { x: { L1: { arm: 'reread', assignedAt: 'z' } }, y: { L11: { arm: 'ask', assignedAt: T0.toISOString() } } };
    file.settings = { experiments: { L11: true }, whole: {} };
    const r = restoreExport(file);
    expect(r).toMatchObject({ attempts: 0, assignments: 1, settingsRestored: false });
    expect(getAttempts().find((a) => a.attemptId === 'a1')!.text).toBe('synthetic answer');
    expect(getAssignments().x.L1.arm).toBe('recall');
    expect(getSettings().experiments).toEqual({ L1: true });
  });

  it('restores settings when none exist locally, and rejects files that are not exports', () => {
    const file = { ...exportNow(), settings: { experiments: { L11: true }, whole: {} } };
    expect(restoreExport(file).settingsRestored).toBe(true);
    expect(getSettings().experiments.L11).toBe(true);
    expect(parseExportFile('not json').ok).toBe(false);
    const other = parseExportFile(JSON.stringify({ schema: 'something-else', schemaVersion: 1 }));
    expect(other.ok).toBe(false);
    if (!other.ok) expect(other.error).toContain('not an export from this app');
    expect(parseExportFile(JSON.stringify({ schema: 'learning-app-export', schemaVersion: 9 })).ok).toBe(false);
  });
});

describe('assignment draw', () => {
  const ids = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
  const count = (m: Record<string, string>, arm: string) => Object.values(m).filter((x) => x === arm).length;

  it('splits as evenly as the count allows, whatever the random source', () => {
    for (const seed of [1, 2, 3, 4, 5]) {
      const got = drawArms(ids, {}, ['recall', 'reread'], seeded(seed));
      expect(Object.keys(got).sort()).toEqual(ids);
      expect(Math.abs(count(got, 'recall') - count(got, 'reread'))).toBe(1);
      const even = drawArms(ids.slice(0, 6), {}, ['ask', 'none'], seeded(seed));
      expect(count(even, 'ask')).toBe(3);
    }
  });

  it('never re-draws an assigned item, and a new item gets the rarer arm', () => {
    const first = drawArms(ids.slice(0, 6), {}, ['recall', 'reread'], seeded(9));
    expect(drawArms(ids.slice(0, 6), first, ['recall', 'reread'], seeded(10))).toEqual({});
    // Make recall rarer by hand, then add a seventh item: it must take recall.
    const skewed: Record<string, string> = { a: 'reread', b: 'reread', c: 'reread', d: 'recall' };
    expect(drawArms([...Object.keys(skewed), 'e'], skewed, ['recall', 'reread'], seeded(1))).toEqual({ e: 'recall' });
  });

  it('only applies the arms of experiments that are on', () => {
    const assignments = { i1: { L1: { arm: 'reread', assignedAt: 't' }, L11: { arm: 'none', assignedAt: 't' } } };
    expect(itemArms({ experiments: { L1: false, L11: false }, whole: {} }, assignments, 'i1')).toEqual({});
    expect(itemArms({ experiments: { L1: true, L11: false }, whole: {} }, assignments, 'i1')).toEqual({ L1: 'reread' });
    expect(variantString({ L11: 'ask', L1: 'reread' })).toBe('L1=reread;L11=ask');
    expect(variantString({})).toBe('default');
  });
});

describe('read exposure', () => {
  const read = (n: number, at: Date): Attempt => ({
    ...oldAttempt(n, 'gd-econ/endowment/r1', at, 'right'), mark: null, exposure: 'read', confidence: null, text: '',
    variant: 'L1=reread', variants: { L1: 'reread' },
  });

  it('schedules like a first Good', () => {
    const viaRead = computeSchedules([read(1, T0)]).get('gd-econ/endowment/r1')!;
    const viaGood = computeSchedules([oldAttempt(1, 'gd-econ/endowment/r1', T0, 'right')]).get('gd-econ/endowment/r1')!;
    expect(viaRead.card.due.toISOString()).toBe(viaGood.card.due.toISOString());
    expect(viaRead.card.stability).toBe(viaGood.card.stability);
    expect(viaRead.card.reps).toBe(1);
  });

  it('is not an answer in progress, accuracy or late recall', () => {
    const log = [
      read(1, T0),
      oldAttempt(2, 'gd-econ/endowment/r1', new Date(T0.getTime() + 15 * DAY), 'wrong', 'review'),
    ];
    const p = courseProgress(course, log, new Set(['gd-econ/endowment']), new Date(T0.getTime() + 16 * DAY));
    expect(p.itemsLearned).toBe(0);
    expect(p.lessonsFinished).toBe(1);
    // The only answer is the review one, and it is the item's first answer, so it is not "late".
    expect(p.late.answers).toBe(0);
    const readOnly = courseProgress(course, [read(1, T0)], new Set(), new Date(T0.getTime() + 20 * DAY));
    expect(readOnly.itemsStarted).toBe(0);
    expect(readOnly.itemsLearned).toBe(0);
    expect(readOnly.late.score).toBeNull();
  });
});

describe('whole-app variant E6', () => {
  it('caps review size, and falls back after the end date', () => {
    const now = new Date(2026, 10, 20, 12);
    expect(reviewCap({ experiments: {}, whole: {} }, now)).toBe(10);
    const s = (value: string, until: string | null) => ({ experiments: {}, whole: { E6: { value, since: 'x', until } } });
    expect(reviewCap(s('short', null), now)).toBe(5);
    expect(reviewCap(s('open', null), now)).toBe(Infinity);
    expect(reviewCap(s('short', '2026-11-20'), now)).toBe(5);
    expect(reviewCap(s('short', '2026-11-19'), now)).toBe(10);
    expect(activeWhole(s('standard', null), now)).toEqual({});
    expect(activeWhole(s('short', null), now)).toEqual({ E6: 'short' });
  });
});

describe('experiments are on by default', () => {
  const both = (s: { experiments: Record<string, boolean> }) => [experimentOn(s as never, 'L1'), experimentOn(s as never, 'L11')];

  it('a phone with no stored settings has both on', () => {
    localStorage.clear();
    expect(getSettings()).toEqual({ experiments: {}, whole: {} });
    expect(both(getSettings())).toEqual([true, true]);
  });

  it('a phone that stored only a review length still has both on', () => {
    localStorage.clear();
    saveSettings({ experiments: {}, whole: { E6: { value: 'short', since: '2026-11-16T10:00:00.000Z', until: null } } });
    expect(both(getSettings())).toEqual([true, true]);
    expect(reviewCap(getSettings())).toBe(5);
  });

  it('a stored false wins over the default', () => {
    localStorage.clear();
    saveSettings({ experiments: { L1: false }, whole: {} });
    expect(both(getSettings())).toEqual([false, true]);
  });

  it('settings stored before the change keep an explicit choice, and an untouched key is now on', () => {
    localStorage.clear();
    localStorage.setItem('learning-app:v1:settings', JSON.stringify({ experiments: { L1: true }, whole: {} }));
    expect(both(getSettings())).toEqual([true, true]);
    localStorage.setItem('learning-app:v1:settings', JSON.stringify({ experiments: { L1: true, L11: false }, whole: {} }));
    expect(both(getSettings())).toEqual([true, false]);
  });

  it('switching the default on leaves stored arms alone', () => {
    const assignments = { i1: { L1: { arm: 'reread', assignedAt: 't' } } };
    expect(itemArms({ experiments: {}, whole: {} }, assignments, 'i1')).toEqual({ L1: 'reread' });
    expect(drawArms(['i1'], { i1: 'reread' }, ['recall', 'reread'], () => 0.1)).toEqual({});
  });
});
