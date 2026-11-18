// Everything the user does is stored on the phone in localStorage.
// The attempt log is append-only and is the source of truth: the review schedule and the
// progress figures are recomputed from it, so a scheduler change never corrupts history.
// Each mark is written immediately, so closing the app mid-lesson loses nothing already marked.

import type { ItemType } from './types';

export type Mark = 'right' | 'partly' | 'wrong';
export type Confidence = 'sure' | 'unsure' | 'guess';
export type Mode = 'lesson' | 'placement' | 'review' | 'retry';
export type SessionKind = 'lesson' | 'placement' | 'review';

export type Exposure = 'answered' | 'read';
export type Appeal = 'liked' | 'neutral' | 'disliked';

/** What the app applied to a record: variant id to value, for example { L1: 'reread' }. */
export type VariantMap = Record<string, string>;

/** The variant string when nothing applies. */
export const DEFAULT_VARIANT = 'default';

/** "default" for no variants, else the pairs sorted and joined, for example "L1=reread;L11=ask". */
export function variantString(v: VariantMap): string {
  const parts = Object.entries(v).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)).map(([k, val]) => `${k}=${val}`);
  return parts.length ? parts.join(';') : DEFAULT_VARIANT;
}

export interface Attempt {
  attemptId: string;
  itemId: string;
  itemType: ItemType;
  courseId: string;
  courseVersion: string;
  parentId: string;
  sessionId: string;
  mode: Mode;
  shownAt: string;
  revealedAt: string;
  markedAt: string;
  text: string;
  confidence: Confidence | null;
  /** Null only for a read exposure (L1 reread arm). */
  mark: Mark | null;
  variant: string;
  appBuild: string;
  /** Absent on records saved before variants existed; those count as "answered". */
  exposure?: Exposure;
  /** Absent on old records; read as {}. */
  variants?: VariantMap;
}

export const isRead = (a: Pick<Attempt, 'exposure'>) => a.exposure === 'read';

export interface Session {
  sessionId: string;
  kind: SessionKind;
  courseId: string;
  courseVersion: string;
  /** Lesson or placement id; empty for review sessions. */
  targetId: string;
  startedAt: string;
  endedAt: string | null;
  completed: boolean;
  variant: string;
  appBuild: string;
  variants?: VariantMap;
  appeal?: Appeal | null;
  appealAt?: string | null;
}

/**
 * A tap on a check, a prediction or a decision in one of the non-Classic flows. Never an attempt: it is
 * kept apart so it cannot reach the scheduler or Progress. `value` is the option index (check, decide)
 * or the committed number (predict).
 */
export interface Response {
  /** The block id, for example "gd-econ/endowment/c1". */
  id: string;
  at: string;
  /** The session the learner was in. */
  session: string;
  value: number;
}

/** itemId -> experimentId -> the arm the item was given, once, for good. */
export type Assignments = Record<string, Record<string, { arm: string; assignedAt: string }>>;

export type WholeAppValue = { value: string; since: string; until: string | null };
export interface Settings {
  /** Experiment id -> on. Missing means on (the default); a stored `false` means the owner switched it off. */
  experiments: Record<string, boolean>;
  /** Whole-app variant id -> its value, when it was switched on, and an optional last day (YYYY-MM-DD). */
  whole: Record<string, WholeAppValue>;
}

const KEY_ATTEMPTS = 'learning-app:v1:attempts';
const KEY_SESSIONS = 'learning-app:v1:sessions';
const KEY_ASSIGNMENTS = 'learning-app:v1:assignments';
const KEY_SETTINGS = 'learning-app:v1:settings';
const KEY_RESPONSES = 'learning-app:v1:responses';

function load<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    const v = raw ? JSON.parse(raw) : [];
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

// Every read and write goes to localStorage directly, never to an in-memory copy: the browser tab
// and the installed app can share this storage (Android), and writing back a stale copy would erase
// answers given in the other one.

export function newId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export const nowIso = () => new Date().toISOString();

export function getAttempts(): readonly Attempt[] {
  return load<Attempt>(KEY_ATTEMPTS);
}

export function getSessions(): readonly Session[] {
  return load<Session>(KEY_SESSIONS);
}

export function addAttempt(a: Attempt) {
  localStorage.setItem(KEY_ATTEMPTS, JSON.stringify([...load<Attempt>(KEY_ATTEMPTS), a]));
}

export function getResponses(): readonly Response[] {
  return load<Response>(KEY_RESPONSES);
}

export function addResponse(r: Response) {
  localStorage.setItem(KEY_RESPONSES, JSON.stringify([...load<Response>(KEY_RESPONSES), r]));
}

export function addSession(s: Session) {
  localStorage.setItem(KEY_SESSIONS, JSON.stringify([...load<Session>(KEY_SESSIONS), s]));
}

export function endSession(sessionId: string, completed: boolean) {
  const sessions = load<Session>(KEY_SESSIONS).map((s) => (s.sessionId === sessionId ? { ...s, endedAt: nowIso(), completed } : s));
  localStorage.setItem(KEY_SESSIONS, JSON.stringify(sessions));
}

export function setAppeal(sessionId: string, appeal: Appeal | null) {
  const sessions = load<Session>(KEY_SESSIONS).map((s) => (s.sessionId === sessionId ? { ...s, appeal, appealAt: nowIso() } : s));
  localStorage.setItem(KEY_SESSIONS, JSON.stringify(sessions));
}

function loadObject<T extends object>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    const v = raw ? JSON.parse(raw) : null;
    return v && typeof v === 'object' && !Array.isArray(v) ? (v as T) : null;
  } catch {
    return null;
  }
}

export function getAssignments(): Assignments {
  return loadObject<Assignments>(KEY_ASSIGNMENTS) ?? {};
}

export function saveAssignments(a: Assignments) {
  localStorage.setItem(KEY_ASSIGNMENTS, JSON.stringify(a));
}

/** The stored settings, or null when the user never changed one. */
export function getStoredSettings(): Settings | null {
  const s = loadObject<Partial<Settings>>(KEY_SETTINGS);
  return s ? { experiments: s.experiments ?? {}, whole: s.whole ?? {} } : null;
}

export function getSettings(): Settings {
  return getStoredSettings() ?? { experiments: {}, whole: {} };
}

export function saveSettings(s: Settings) {
  localStorage.setItem(KEY_SETTINGS, JSON.stringify(s));
}

// ---- merging records from an export file (restore): add what is missing, never overwrite or delete ----

export function addMissingAttempts(list: readonly Attempt[]): number {
  const have = load<Attempt>(KEY_ATTEMPTS);
  const ids = new Set(have.map((a) => a.attemptId));
  const add = list.filter((a) => !ids.has(a.attemptId) && ids.add(a.attemptId));
  if (add.length) {
    // Progress takes the latest answer by position, so keep the log in time order.
    const all = [...have, ...add].sort((x, y) => x.markedAt.localeCompare(y.markedAt));
    localStorage.setItem(KEY_ATTEMPTS, JSON.stringify(all));
  }
  return add.length;
}

const responseKey = (r: Response) => `${r.session}|${r.id}|${r.at}`;

export function addMissingResponses(list: readonly Response[]): number {
  const have = load<Response>(KEY_RESPONSES);
  const keys = new Set(have.map(responseKey));
  const add = list.filter((r) => !keys.has(responseKey(r)) && keys.add(responseKey(r)));
  if (add.length) {
    const all = [...have, ...add].sort((x, y) => x.at.localeCompare(y.at));
    localStorage.setItem(KEY_RESPONSES, JSON.stringify(all));
  }
  return add.length;
}

export function addMissingSessions(list: readonly Session[]): number {
  const have = load<Session>(KEY_SESSIONS);
  const ids = new Set(have.map((s) => s.sessionId));
  const add = list.filter((s) => !ids.has(s.sessionId) && ids.add(s.sessionId));
  if (add.length) {
    const all = [...have, ...add].sort((x, y) => x.startedAt.localeCompare(y.startedAt));
    localStorage.setItem(KEY_SESSIONS, JSON.stringify(all));
  }
  return add.length;
}

/** A local assignment always wins over the file's. */
export function addMissingAssignments(file: Assignments): number {
  const have = getAssignments();
  let n = 0;
  for (const [itemId, exps] of Object.entries(file)) {
    for (const [expId, v] of Object.entries(exps)) {
      if (have[itemId]?.[expId]) continue;
      (have[itemId] ??= {})[expId] = v;
      n++;
    }
  }
  if (n) saveAssignments(have);
  return n;
}

/** Settings from a file are used only when this phone has none. */
export function restoreSettingsIfNone(file: Settings): boolean {
  if (getStoredSettings()) return false;
  saveSettings(file);
  return true;
}

/** Asks the browser not to clear this site's storage under pressure. Installed apps usually get it. */
export async function requestPersistence(): Promise<boolean | null> {
  try {
    if (navigator.storage?.persisted && (await navigator.storage.persisted())) return true;
    if (navigator.storage?.persist) return await navigator.storage.persist();
  } catch {
    /* not supported */
  }
  return null;
}
