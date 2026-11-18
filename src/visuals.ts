// Visuals: pictures drawn from the data in a lesson's "```visual" block. Inline SVG, no library and
// no network, so they work offline. A picture restates figures the lesson text already gives; it
// never adds a number of its own. Each is a viewBox 320 wide, so on a 375 px phone it scales to
// the column and the 12 px text stays near 13 px. The `text` field is the accessible description.
//
// The geometry and wording are plain functions so they can be tested without a browser.

import type { BarRow, GapRow, SpanRow, Visual } from './types';

type Of<K extends Visual['kind']> = Extract<Visual, { kind: K }>;

const W = 320;
const LINE = 15; // one line of 12 px text

export const escAttr = (s: string) =>
  s.replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]!);

/** Breaks text into lines of at most `n` characters, at spaces. A word longer than `n` stays whole. */
export function wrap(text: string, n: number): string[] {
  const lines: string[] = [];
  let cur = '';
  for (const word of text.split(/\s+/).filter(Boolean)) {
    if (cur && (cur + ' ' + word).length > n) { lines.push(cur); cur = word; }
    else cur = cur ? cur + ' ' + word : word;
  }
  if (cur) lines.push(cur);
  return lines.length ? lines : [''];
}

const lines = (x: number, y: number, parts: string[], cls = '', anchor = '') =>
  parts.map((p, k) => `<text${cls ? ` class="${cls}"` : ''} x="${x}" y="${y + k * LINE}"${anchor ? ` text-anchor="${anchor}"` : ''}>${escAttr(p)}</text>`).join('');

const svgOpen = (h: number, v: Visual) => `<svg viewBox="0 0 ${W} ${h}" role="img" aria-label="${escAttr(v.text)}">`;
const f1 = (n: number) => String(Math.round(n * 10) / 10);

// ---- gap-timeline ----

const GH = 96;
const GL = 16;
const GR = W - 16;
const GY = 48;

const days = (n: number) => `${n} ${n === 1 ? 'day' : 'days'}`;

/** Where study, review and test sit on the line, to scale: the gap and the delay share one axis. */
export function gapTimelinePoints(row: GapRow): { study: number; review: number; test: number } {
  const total = row.gap + row.delay;
  return { study: GL, review: GL + ((GR - GL) * row.gap) / total, test: GR };
}

/** The sentence under the picture. Every figure in it comes from the row. */
export function gapTimelineSentence(row: GapRow): string {
  return `Test ${days(row.delay)} after the review: the best gap tested for recall was ${days(row.gap)}, about ${row.share}% of the delay.`;
}

/** The timeline as SVG markup: study, then the gap, then the review, then the delay, then the test. */
export function gapTimelineSvg(row: GapRow): string {
  const p = gapTimelinePoints(row);
  const r = p.review.toFixed(1);
  return `<svg viewBox="0 0 ${W} ${GH}" role="img" aria-label="${escAttr(gapTimelineSentence(row))}">`
    + `<line class="vis-delay" x1="${r}" y1="${GY}" x2="${p.test}" y2="${GY}"/>`
    + `<line class="vis-gap" x1="${p.study}" y1="${GY}" x2="${r}" y2="${GY}"/>`
    + `<circle class="vis-dot" cx="${p.study}" cy="${GY}" r="5"/>`
    + `<circle class="vis-dot vis-review" cx="${r}" cy="${GY}" r="5"/>`
    + `<circle class="vis-dot" cx="${p.test}" cy="${GY}" r="5"/>`
    + `<text x="${p.study}" y="${GY - 26}">Study</text>`
    + `<text class="vis-strong" x="${p.study}" y="${GY - 12}">gap: ${days(row.gap)}</text>`
    + `<text x="${p.test}" y="${GY - 26}" text-anchor="end">Test</text>`
    + `<text x="${p.test}" y="${GY - 12}" text-anchor="end">delay: ${days(row.delay)}</text>`
    + `<text x="${r}" y="${GY + 24}">Review</text>`
    + `</svg>`;
}

// ---- bars ----

const BL = 8;
const BR = 226;

const barValue = (unit: string, n: number) => (unit === '%' || unit === '' ? `${n}${unit}` : `${n} ${unit}`);

/** Horizontal position of a value. The domain always holds 0 and every value and interval end. */
export function barScale(rows: readonly BarRow[]): (v: number) => number {
  const all = rows.flatMap((r) => [r.value, r.low ?? r.value, r.high ?? r.value]);
  const lo = Math.min(0, ...all);
  let hi = Math.max(0, ...all);
  if (hi === lo) hi = lo + 1;
  return (v) => BL + ((v - lo) / (hi - lo)) * (BR - BL);
}

/** Bars from zero with an optional interval whisker. Label above each bar, value to its right, note below. */
export function barsSvg(v: Of<'bars'>): string {
  const x = barScale(v.rows);
  const zero = v.zero || v.rows.some((r) => r.value < 0 || (r.low ?? 0) < 0);
  const x0 = x(0);
  let y = 6;
  let body = '';
  for (const r of v.rows) {
    const label = wrap(r.label, 44);
    body += lines(BL, y + 11, label);
    y += label.length * LINE + 2;
    const mid = y + 8;
    const xv = x(r.value);
    body += `<rect class="vis-bar${r.value < 0 ? ' vis-neg' : ''}" x="${f1(Math.min(x0, xv))}" y="${y}" width="${f1(Math.max(Math.abs(xv - x0), 1))}" height="16" rx="2"/>`;
    if (r.low !== undefined || r.high !== undefined) {
      const a = x(r.low ?? r.value);
      const b = x(r.high ?? r.value);
      body += `<line class="vis-whisker" x1="${f1(a)}" y1="${mid}" x2="${f1(b)}" y2="${mid}"/>`
        + `<line class="vis-whisker" x1="${f1(a)}" y1="${mid - 6}" x2="${f1(a)}" y2="${mid + 6}"/>`
        + `<line class="vis-whisker" x1="${f1(b)}" y1="${mid - 6}" x2="${f1(b)}" y2="${mid + 6}"/>`;
    }
    body += `<text class="vis-strong" x="${BR + 8}" y="${mid + 4}">${escAttr(barValue(v.unit, r.value))}</text>`;
    y += 20;
    if (r.note) {
      const note = wrap(r.note, 52);
      body += lines(BL, y + 8, note, 'vis-note');
      y += note.length * LINE;
    }
    y += 12;
  }
  const h = y;
  const zeroLine = zero ? `<line class="vis-zero" x1="${f1(x0)}" y1="2" x2="${f1(x0)}" y2="${h - 6}"/>` : '';
  return svgOpen(h, v) + zeroLine + body + '</svg>';
}

// ---- dot-grid ----

/** Columns and dot spacing so every dot fits the 320 wide picture. */
export function dotLayout(total: number): { cols: number; gap: number; r: number } {
  if (total <= 200) return { cols: Math.min(20, total), gap: 15, r: 5.5 };
  if (total <= 450) return { cols: 30, gap: 10, r: 3.6 };
  return { cols: 40, gap: 7.5, r: 2.7 };
}

/** One dot per unit, the marked ones filled first, then the rest as outlines. Legend under the grid. */
export function dotGridSvg(v: Of<'dot-grid'>): string {
  const { cols, gap, r } = dotLayout(v.total);
  const rows = Math.ceil(v.total / cols);
  const left = (W - (cols - 1) * gap) / 2;
  let body = '';
  for (let k = 0; k < v.total; k++) {
    const cx = f1(left + (k % cols) * gap);
    const cy = f1(r + 4 + Math.floor(k / cols) * gap);
    body += `<circle class="${k < v.marked ? 'vis-dot' : 'vis-dot-off'}" cx="${cx}" cy="${cy}" r="${r}"/>`;
  }
  let y = rows * gap + r + 20;
  const marked = wrap(`${v.marked} ${v.markedLabel}`, 40);
  body += `<circle class="vis-dot" cx="14" cy="${y - 4}" r="5"/>` + lines(28, y, marked);
  y += marked.length * LINE + 6;
  const rest = wrap(v.restLabel, 40);
  body += `<circle class="vis-dot-off" cx="14" cy="${y - 4}" r="5"/>` + lines(28, y, rest);
  y += rest.length * LINE + 4;
  return svgOpen(y, v) + body + '</svg>';
}

// ---- spans ----

const SL = 10;
const SR = W - 10;

/** Horizontal position along the axis, 0 to max. */
export const spanScale = (max: number) => (n: number) => SL + (n / max) * (SR - SL);

/** Schematic timelines: a bar per row from its start, an arrow where it is still running, a stop mark where it ended. */
export function spansSvg(v: Of<'spans'>): string {
  const x = spanScale(v.max);
  let y = 6;
  let body = '';
  for (const r of v.rows as SpanRow[]) {
    const label = wrap(r.label, 44);
    body += lines(SL, y + 11, label);
    y += label.length * LINE + 2;
    const mid = y + 7;
    const a = x(r.from);
    const b = x(r.to);
    body += `<line class="vis-span" x1="${f1(a)}" y1="${mid}" x2="${f1(b)}" y2="${mid}"/>`
      + `<circle class="vis-dot" cx="${f1(a)}" cy="${mid}" r="4"/>`;
    if (r.open) body += `<path class="vis-arrow" d="M${f1(b)} ${mid - 7} L${f1(b + 11)} ${mid} L${f1(b)} ${mid + 7} Z"/>`;
    else body += `<line class="vis-stop" x1="${f1(b)}" y1="${mid - 8}" x2="${f1(b)}" y2="${mid + 8}"/>`;
    y += 20;
    if (r.note) {
      const note = wrap(r.note, 52);
      body += lines(SL, y + 8, note, 'vis-note');
      y += note.length * LINE;
    }
    y += 12;
  }
  const ax = y;
  body += `<line class="vis-axis" x1="${SL}" y1="${ax}" x2="${SR}" y2="${ax}"/>`
    + `<line class="vis-axis" x1="${SL}" y1="${ax}" x2="${SL}" y2="${ax + 5}"/>`
    + `<line class="vis-axis" x1="${SR}" y1="${ax}" x2="${SR}" y2="${ax + 5}"/>`
    + `<text class="vis-note" x="${SL}" y="${ax + 18}">0</text>`
    + `<text class="vis-note" x="${SR}" y="${ax + 18}" text-anchor="end">${v.max}</text>`
    + `<text class="vis-note" x="${W / 2}" y="${ax + 18}" text-anchor="middle">${escAttr(v.axis)}</text>`;
  return svgOpen(ax + 26, v) + body + '</svg>';
}

/** The static picture for kinds that need no tap. */
export function visualSvg(v: Visual): string {
  switch (v.kind) {
    case 'bars': return barsSvg(v);
    case 'dot-grid': return dotGridSvg(v);
    case 'spans': return spansSvg(v);
    case 'gap-timeline': return gapTimelineSvg(v.rows[0]);
  }
}

/**
 * The figure for a visual: title, picture, then the plain sentence. The gap timeline stays as built
 * for it: one button per delay, and the timeline for the one picked, so the learner guesses first.
 */
export function renderVisual(v: Visual): HTMLElement {
  const fig = document.createElement('figure');
  fig.className = 'visual';
  fig.dataset.visualId = v.id;
  const cap = document.createElement('figcaption');
  cap.textContent = v.title;
  fig.append(cap);

  if (v.kind === 'gap-timeline') {
    const ask = document.createElement('p');
    ask.className = 'muted small';
    ask.textContent = 'Pick how long after the review the test comes. Guess the best gap first, then tap.';
    const buttons = document.createElement('div');
    buttons.className = 'row';
    buttons.setAttribute('role', 'group');
    buttons.setAttribute('aria-label', 'Test delay');
    const picture = document.createElement('div');
    picture.className = 'vis-picture';
    const line = document.createElement('p');
    line.className = 'vis-line';
    line.setAttribute('aria-live', 'polite');
    for (const row of v.rows) {
      const b = document.createElement('button');
      b.type = 'button';
      b.textContent = days(row.delay);
      b.setAttribute('aria-pressed', 'false');
      b.onclick = () => {
        for (const other of buttons.querySelectorAll('button')) other.setAttribute('aria-pressed', String(other === b));
        picture.innerHTML = gapTimelineSvg(row);
        line.textContent = gapTimelineSentence(row);
      };
      buttons.append(b);
    }
    fig.append(ask, buttons, picture, line);
    return fig;
  }

  const picture = document.createElement('div');
  picture.className = 'vis-picture';
  picture.innerHTML = visualSvg(v);
  const line = document.createElement('p');
  line.className = 'vis-line';
  line.setAttribute('aria-hidden', 'true'); // the picture already carries the same text for screen readers
  line.textContent = v.text;
  fig.append(picture, line);
  return fig;
}
