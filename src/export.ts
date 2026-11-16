// Builds the export file. The schema is documented in docs/export-schema.md; change both together
// and raise EXPORT_SCHEMA_VERSION on any change that breaks a reader.

import type { Assignments, Attempt, Session, Settings } from './store';
import type { CourseData } from './types';
import { computeSchedules, stateName } from './scheduler';

export const EXPORT_SCHEMA_VERSION = 2;

export function buildExport(
  data: CourseData,
  attempts: readonly Attempt[],
  sessions: readonly Session[],
  appBuild: string,
  now = new Date(),
  assignments: Assignments = {},
  settings: Settings | null = null,
) {
  const known = new Map<string, { courseId: string; parentId: string; type: string }>();
  for (const c of data.courses) {
    for (const l of c.lessons)
      for (const b of l.blocks) if (b.kind === 'item') known.set(b.item.id, { courseId: c.id, parentId: l.id, type: b.item.type });
    for (const b of c.placement?.blocks ?? [])
      if (b.kind === 'item') known.set(b.item.id, { courseId: c.id, parentId: c.placement!.id, type: b.item.type });
  }

  const schedules = computeSchedules(attempts);
  const byItem = new Map<string, Attempt[]>();
  for (const a of attempts) {
    const list = byItem.get(a.itemId) ?? [];
    list.push(a);
    byItem.set(a.itemId, list);
  }

  const items = [...byItem.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([itemId, list]) => {
      list.sort((x, y) => x.markedAt.localeCompare(y.markedAt));
      const first = list[0];
      const s = schedules.get(itemId);
      return {
        itemId,
        courseId: first.courseId,
        parentId: first.parentId,
        itemType: first.itemType,
        inCurrentBuild: known.has(itemId),
        firstAnsweredAt: first.markedAt,
        schedule: s
          ? {
              due: s.card.due.toISOString(),
              state: stateName(s.card.state),
              stability: round(s.card.stability),
              difficulty: round(s.card.difficulty),
              reps: s.card.reps,
              lapses: s.card.lapses,
            }
          : null,
        attempts: list.map((a) => ({
          attemptId: a.attemptId,
          sessionId: a.sessionId,
          mode: a.mode,
          courseVersion: a.courseVersion,
          shownAt: a.shownAt,
          revealedAt: a.revealedAt,
          markedAt: a.markedAt,
          text: a.text,
          confidence: a.confidence,
          mark: a.mark,
          exposure: a.exposure ?? 'answered',
          variant: a.variant,
          variants: a.variants ?? {},
          appBuild: a.appBuild,
        })),
      };
    });

  return {
    schema: 'learning-app-export',
    schemaVersion: EXPORT_SCHEMA_VERSION,
    exportedAt: now.toISOString(),
    appBuild,
    courses: data.courses.map((c) => ({
      courseId: c.id,
      version: c.version,
      status: c.status,
      lessons: c.lessons.map((l) => ({ lessonId: l.id, order: l.order, status: l.status, itemIds: l.itemIds })),
      placement: c.placement ? { placementId: c.placement.id, itemIds: c.placement.itemIds } : null,
    })),
    sessions: sessions
      .map((s) => ({ ...s, variants: s.variants ?? {}, appeal: s.appeal ?? null, appealAt: s.appealAt ?? null }))
      .sort((a, b) => a.startedAt.localeCompare(b.startedAt)),
    assignments,
    settings,
    items,
  };
}

function round(n: number) {
  return Math.round(n * 1000) / 1000;
}

export function exportFileName(now = new Date()): string {
  const p = (n: number) => String(n).padStart(2, '0');
  return `learning-export-${now.getFullYear()}-${p(now.getMonth() + 1)}-${p(now.getDate())}-${p(now.getHours())}${p(now.getMinutes())}.json`;
}

/** Shares the file through the phone's share sheet when it can, else downloads it. */
export async function deliverExport(json: string, name: string): Promise<'shared' | 'downloaded' | 'cancelled'> {
  const file = new File([json], name, { type: 'application/json' });
  const nav = navigator as Navigator & { canShare?: (d: ShareData) => boolean };
  if (nav.canShare && nav.canShare({ files: [file] })) {
    try {
      await nav.share({ files: [file], title: name });
      return 'shared';
    } catch (e) {
      if ((e as DOMException)?.name === 'AbortError') return 'cancelled';
      // fall through to download
    }
  }
  downloadExport(json, name);
  return 'downloaded';
}

export function downloadExport(json: string, name: string) {
  const url = URL.createObjectURL(new Blob([json], { type: 'application/json' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}
