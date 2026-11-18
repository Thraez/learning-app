// The flows: three ways, besides Classic, to go through the same lesson. The pure part lives here:
// it turns a lesson's blocks and a flow name into the ordered list of screens. No DOM, no storage,
// so it can be tested in Node. Every flow shows every item exactly once, through the item card, so
// attempts, experiment arms and item IDs are untouched.

import type { Block, Check, Decide, Item, Predict, Visual } from './types';

export type Flow = 'classic' | 'stepped' | 'predict' | 'case';

export const FLOW_DEFAULT: Flow = 'classic';

/** The order here is the order of the picker. `about` is one plain line for Settings. */
export const FLOWS: Record<Flow, { label: string; about: string }> = {
  classic: { label: 'Classic', about: 'The whole lesson on one page, one card at a time. This is how lessons have always run.' },
  stepped: { label: 'Stepped', about: 'One short screen at a time, with quick checks after the text they test.' },
  predict: { label: 'Predict first', about: 'Guess the key numbers before you see them, then go through the lesson in short screens.' },
  case: { label: 'Case first', about: 'Make a call on a real case first and see what follows, then the lesson in short screens.' },
};

export const isFlow = (v: unknown): v is Flow => typeof v === 'string' && Object.prototype.hasOwnProperty.call(FLOWS, v);

/** An unknown or missing stored value reads as Classic. */
export const asFlow = (v: unknown): Flow => (isFlow(v) ? v : FLOW_DEFAULT);

export type Screen =
  | { kind: 'chunk'; section: string; html: string; visuals: Visual[] }
  | { kind: 'check'; section: string; check: Check }
  | { kind: 'item'; section: string; item: Item; points?: string[] }
  | { kind: 'predict'; section: string; predict: Predict; visual?: Visual }
  | { kind: 'decide'; section: string; decide: Decide };

/** Block kinds that only the non-Classic flows use. */
export const NEW_KINDS: ReadonlySet<Block['kind']> = new Set(['check', 'predict', 'decide', 'visual', 'points', 'break']);

export const hasNewBlocks = (blocks: readonly Block[]) => blocks.some((b) => NEW_KINDS.has(b.kind));

/**
 * What Classic renders: the blocks without the new kinds, with prose that the new kinds had split
 * put back together. A lesson with the new blocks and the same lesson without them give the same list.
 */
export function classicBlocks(blocks: readonly Block[]): Block[] {
  const out: Block[] = [];
  for (const b of blocks) {
    if (NEW_KINDS.has(b.kind)) continue;
    const last = out[out.length - 1];
    if (b.kind === 'prose' && last?.kind === 'prose') out[out.length - 1] = { kind: 'prose', html: last.html + b.html };
    else out.push(b);
  }
  return out;
}

const BLOCK_TAG = /<(\/?)(p|ul|ol|table|blockquote|pre|div|h[1-6]|hr)\b[^>]*?(\/?)>/gi;
const textLength = (html: string) => html.replace(/<[^>]*>/g, '').length;

/** Cuts rendered HTML into its top-level elements (paragraphs, lists, tables). A nested tag never splits. */
export function topLevelParts(html: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let start = 0;
  BLOCK_TAG.lastIndex = 0;
  for (let m = BLOCK_TAG.exec(html); m; m = BLOCK_TAG.exec(html)) {
    const closing = m[1] === '/';
    const voidTag = m[2].toLowerCase() === 'hr' || m[3] === '/';
    if (voidTag) { if (depth === 0) { parts.push(html.slice(start, BLOCK_TAG.lastIndex)); start = BLOCK_TAG.lastIndex; } continue; }
    depth += closing ? -1 : 1;
    if (depth <= 0) {
      depth = 0;
      parts.push(html.slice(start, BLOCK_TAG.lastIndex));
      start = BLOCK_TAG.lastIndex;
    }
  }
  if (html.slice(start).trim()) parts.push(html.slice(start));
  return parts.map((p) => p.trim()).filter(Boolean);
}

/**
 * Splits long prose at paragraph boundaries into chunks of about `max` characters of text. An element
 * is never cut, so one long paragraph stays whole. Prose at or under `max` is returned as it is.
 */
export function splitProse(html: string, max = 500): string[] {
  if (textLength(html) <= max) return [html];
  const chunks: string[] = [];
  let cur: string[] = [];
  let len = 0;
  for (const part of topLevelParts(html)) {
    const n = textLength(part);
    if (cur.length && len + n > max) { chunks.push(cur.join('\n')); cur = []; len = 0; }
    cur.push(part);
    len += n;
  }
  if (cur.length) chunks.push(cur.join('\n'));
  return chunks;
}

/**
 * Stepped over the lesson's blocks in file order. Prose chunks end at a break marker, a visual, a check,
 * an item or a section heading. A visual goes on the screen of the chunk it follows. Predict and decide
 * blocks are left out here; the Predict and Case flows put them first.
 */
function stepped(blocks: readonly Block[], fallback: boolean): Screen[] {
  const out: Screen[] = [];
  let section = '';
  let pending: string[] = [];
  const pointsFor = new Map<string, string[]>();
  for (const b of blocks) if (b.kind === 'points') pointsFor.set(b.points.for, b.points.points);

  const flush = () => {
    const html = pending.join('\n');
    pending = [];
    if (!html.trim()) return;
    for (const part of fallback ? splitProse(html) : [html]) out.push({ kind: 'chunk', section, html: part, visuals: [] });
  };

  for (const b of blocks) {
    if (b.kind === 'section') { flush(); section = b.title; }
    else if (b.kind === 'prose') pending.push(b.html);
    else if (b.kind === 'break') flush();
    else if (b.kind === 'visual') {
      flush();
      const last = out[out.length - 1];
      if (last?.kind === 'chunk' && last.section === section) last.visuals.push(b.visual);
      else out.push({ kind: 'chunk', section, html: '', visuals: [b.visual] });
    } else if (b.kind === 'check') { flush(); out.push({ kind: 'check', section, check: b.check }); }
    else if (b.kind === 'item') {
      flush();
      const points = pointsFor.get(b.item.id);
      out.push(points ? { kind: 'item', section, item: b.item, points } : { kind: 'item', section, item: b.item });
    }
  }
  flush();
  return out;
}

/**
 * The ordered screens of a lesson for a flow. Classic has none (it keeps its own page). A lesson with
 * none of the new blocks runs as Stepped in any other flow, with long prose split at paragraph boundaries.
 */
export function buildScreens(lesson: { blocks: readonly Block[] }, flow: Flow): Screen[] {
  if (flow === 'classic') return [];
  const blocks = lesson.blocks;
  if (!hasNewBlocks(blocks)) return stepped(blocks, true);

  const visuals = new Map<string, Visual>();
  for (const b of blocks) if (b.kind === 'visual') visuals.set(b.visual.id, b.visual);
  const base = stepped(blocks, false);

  if (flow === 'predict') {
    const first: Screen[] = blocks.flatMap((b): Screen[] => (b.kind === 'predict'
      ? [{ kind: 'predict', section: 'Opening question', predict: b.predict, visual: b.predict.visual ? visuals.get(b.predict.visual) : undefined }]
      : []));
    return [...first, ...base];
  }
  if (flow === 'case') {
    const first: Screen[] = blocks.flatMap((b): Screen[] => (b.kind === 'decide' ? [{ kind: 'decide', section: 'Opening question', decide: b.decide }] : []));
    const idea = base.filter((s) => s.section === 'The idea' && s.kind !== 'item');
    const scenario = base.filter((s) => s.kind === 'item' && s.item.type === 'scenario');
    const rest = base.filter((s) => !idea.includes(s) && !scenario.includes(s));
    return [...first, ...idea, ...scenario, ...rest];
  }
  return base;
}

export const screenItemIds = (screens: readonly Screen[]): string[] => screens.flatMap((s) => (s.kind === 'item' ? [s.item.id] : []));
