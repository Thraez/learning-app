// Display data for "can I trust this lesson": the check line and one entry per source.
// Pure functions, no DOM, so tests can run them in Node.

import type { Lesson, Source } from './types';

export interface SourceView {
  name: string;
  url: string;
  tier: string;
  read: string;
  caveat?: string;
}

export interface TrustView {
  checkLine: string;
  checked: boolean;
  sources: SourceView[];
  ledgerUrl?: string;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** "2026-11-16" becomes "16 Nov 2026". Fixed English text so the line reads the same on every phone. */
export function formatCheckDate(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return iso;
  return `${Number(m[3])} ${MONTHS[Number(m[2]) - 1] ?? m[2]} ${m[1]}`;
}

export function checkLine(lesson: Pick<Lesson, 'checked'>): string {
  return lesson.checked
    ? `Checked against its sources on ${formatCheckDate(lesson.checked)}`
    : 'Not yet checked against its sources';
}

/** Cite text up to the first "(YYYY)", parentheses dropped; three or more authors become "First et al." */
export function shortName(cite: string): string {
  const m = /^(.*?)\s*\((\d{4})\)/.exec(cite);
  if (!m || !m[1].trim()) return cite.slice(0, 40);
  const authors = m[1].split(',').map((a) => a.trim()).filter(Boolean);
  const names = authors.length >= 3 ? `${authors[0]} et al.` : authors.length === 2 ? authors.join(' and ') : authors[0];
  return `${names} ${m[2]}`;
}

export function tierWords(tier: Source['tier']): string {
  if (tier === 1) return 'peer-reviewed';
  if (tier === 2) return 'preprint or report, not peer-reviewed';
  return "a studio's own report";
}

export function readDepth(s: Pick<Source, 'read' | 'grade'>): string {
  if (s.read) return s.read;
  const g = (s.grade ?? '').trim().toUpperCase();
  if (g === 'A') return 'read in the paper itself';
  if (g === 'B') return 'secondary summary only';
  if (g === 'C') return 'inference, no direct study';
  return 'read depth not stated';
}

export function sourceView(s: Source): SourceView {
  return { name: shortName(s.cite), url: s.url, tier: tierWords(s.tier), read: readDepth(s), caveat: s.caveat || undefined };
}

export function trustView(lesson: Lesson): TrustView {
  return {
    checkLine: checkLine(lesson),
    checked: !!lesson.checked,
    sources: lesson.sources.map(sourceView),
    ledgerUrl: lesson.ledgerUrl,
  };
}
