// Restore from an export file: a guard against losing the phone's data. It only adds. A record whose
// ID is already on the phone is left alone, so restoring the same file twice changes nothing.

import {
  addMissingAssignments, addMissingAttempts, addMissingResponses, addMissingSessions, restoreSettingsIfNone,
  type Assignments, type Attempt, type Response, type Session, type Settings,
} from './store';

export interface RestoreResult {
  attempts: number;
  sessions: number;
  assignments: number;
  /** Responses to checks, predictions and decisions added. */
  responses: number;
  settingsRestored: boolean;
  /** Entries in the file that were not usable and were skipped. */
  skipped: number;
}

export type ParsedExport = { ok: true; file: Record<string, unknown> } | { ok: false; error: string };

const MARKS = ['right', 'partly', 'wrong'];
const isObj = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v);
const isStr = (v: unknown): v is string => typeof v === 'string' && v.length > 0;

export function parseExportFile(text: string): ParsedExport {
  let f: unknown;
  try {
    f = JSON.parse(text);
  } catch {
    return { ok: false, error: 'This file is not JSON, so it cannot be an export from this app.' };
  }
  if (!isObj(f) || f.schema !== 'learning-app-export') {
    return { ok: false, error: 'This is not an export from this app (its "schema" is not "learning-app-export"). Nothing was changed.' };
  }
  if (f.schemaVersion !== 1 && f.schemaVersion !== 2) {
    return { ok: false, error: `This export has schema version ${String(f.schemaVersion)}, which this app does not read (it reads 1 and 2). Nothing was changed.` };
  }
  return { ok: true, file: f };
}

/** Rebuilds attempts from the export, which nests them under their items, and merges everything. */
export function restoreExport(file: Record<string, unknown>): RestoreResult {
  let skipped = 0;
  const attempts: Attempt[] = [];
  for (const it of Array.isArray(file.items) ? file.items : []) {
    if (!isObj(it) || !isStr(it.itemId) || !Array.isArray(it.attempts)) { skipped++; continue; }
    for (const a of it.attempts) {
      const read = isObj(a) && a.exposure === 'read';
      const ok = isObj(a) && isStr(a.attemptId) && isStr(a.sessionId) && isStr(a.markedAt) && isStr(a.mode)
        && (read ? a.mark === null : MARKS.includes(a.mark as string));
      if (!ok) { skipped++; continue; }
      const r = a as Record<string, unknown>;
      attempts.push({
        attemptId: r.attemptId as string,
        itemId: it.itemId,
        itemType: it.itemType as Attempt['itemType'],
        courseId: it.courseId as string,
        courseVersion: r.courseVersion as string,
        parentId: it.parentId as string,
        sessionId: r.sessionId as string,
        mode: r.mode as Attempt['mode'],
        shownAt: r.shownAt as string,
        revealedAt: r.revealedAt as string,
        markedAt: r.markedAt as string,
        text: (r.text as string) ?? '',
        confidence: (r.confidence as Attempt['confidence']) ?? null,
        mark: (r.mark as Attempt['mark']) ?? null,
        exposure: read ? 'read' : 'answered',
        variant: (r.variant as string) ?? 'default',
        variants: isObj(r.variants) ? (r.variants as Record<string, string>) : {},
        appBuild: r.appBuild as string,
      });
    }
  }

  const sessions: Session[] = [];
  for (const s of Array.isArray(file.sessions) ? file.sessions : []) {
    if (!isObj(s) || !isStr(s.sessionId) || !isStr(s.startedAt) || !isStr(s.kind)) { skipped++; continue; }
    sessions.push({
      ...(s as unknown as Session),
      variants: isObj(s.variants) ? (s.variants as Record<string, string>) : {},
      appeal: (s.appeal as Session['appeal']) ?? null,
      appealAt: (s.appealAt as string) ?? null,
    });
  }

  const assignments: Assignments = {};
  if (isObj(file.assignments)) {
    for (const [itemId, exps] of Object.entries(file.assignments)) {
      if (!isObj(exps)) continue;
      for (const [expId, v] of Object.entries(exps)) {
        if (isObj(v) && isStr(v.arm) && isStr(v.assignedAt)) (assignments[itemId] ??= {})[expId] = { arm: v.arm, assignedAt: v.assignedAt };
        else skipped++;
      }
    }
  }

  // Optional: an export from before the flows has no "responses".
  const responses: Response[] = [];
  for (const r of Array.isArray(file.responses) ? file.responses : []) {
    if (isObj(r) && isStr(r.id) && isStr(r.at) && isStr(r.session) && typeof r.value === 'number' && Number.isFinite(r.value)) {
      responses.push({ id: r.id, at: r.at, session: r.session, value: r.value });
    } else skipped++;
  }

  const settings = isObj(file.settings) ? (file.settings as unknown as Settings) : null;
  return {
    attempts: addMissingAttempts(attempts),
    sessions: addMissingSessions(sessions),
    assignments: addMissingAssignments(assignments),
    responses: addMissingResponses(responses),
    settingsRestored: settings ? restoreSettingsIfNone({ experiments: settings.experiments ?? {}, whole: settings.whole ?? {} }) : false,
    skipped,
  };
}
