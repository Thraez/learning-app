// Everything the user does is stored on the phone in localStorage.
// The attempt log is append-only and is the source of truth: the review schedule and the
// progress figures are recomputed from it, so a scheduler change never corrupts history.
// Each mark is written immediately, so closing the app mid-lesson loses nothing already marked.

import type { ItemType } from './types';

export type Mark = 'right' | 'partly' | 'wrong';
export type Confidence = 'sure' | 'unsure' | 'guess';
export type Mode = 'lesson' | 'placement' | 'review' | 'retry';
export type SessionKind = 'lesson' | 'placement' | 'review';

/** Fixed until variant support is built; recorded now so the export schema need not change. */
export const VARIANT = 'default';

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
  mark: Mark;
  variant: string;
  appBuild: string;
}

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
}

const KEY_ATTEMPTS = 'learning-app:v1:attempts';
const KEY_SESSIONS = 'learning-app:v1:sessions';

function load<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    const v = raw ? JSON.parse(raw) : [];
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

let attempts: Attempt[] = load<Attempt>(KEY_ATTEMPTS);
let sessions: Session[] = load<Session>(KEY_SESSIONS);

function save() {
  localStorage.setItem(KEY_ATTEMPTS, JSON.stringify(attempts));
  localStorage.setItem(KEY_SESSIONS, JSON.stringify(sessions));
}

export function newId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export const nowIso = () => new Date().toISOString();

export function getAttempts(): readonly Attempt[] {
  return attempts;
}

export function getSessions(): readonly Session[] {
  return sessions;
}

export function addAttempt(a: Attempt) {
  attempts = [...attempts, a];
  save();
}

export function addSession(s: Session) {
  sessions = [...sessions, s];
  save();
}

export function endSession(sessionId: string, completed: boolean) {
  sessions = sessions.map((s) => (s.sessionId === sessionId ? { ...s, endedAt: nowIso(), completed } : s));
  save();
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

/** For tests only. */
export function _resetForTests() {
  attempts = [];
  sessions = [];
}
