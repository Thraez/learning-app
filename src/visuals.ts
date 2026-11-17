// Visuals: pictures drawn from the data in a lesson's "```visual" block. Inline SVG and buttons,
// no library and no network, so they work offline. The picture restates figures the lesson text
// already gives; it never adds a number of its own.
//
// The geometry and wording are plain functions so they can be tested without a browser.

import type { GapRow, Visual } from './types';

const W = 320;
const H = 96;
const LEFT = 16;
const RIGHT = W - 16;
const Y = 48;

const days = (n: number) => `${n} ${n === 1 ? 'day' : 'days'}`;

/** Where study, review and test sit on the line, to scale: the gap and the delay share one axis. */
export function gapTimelinePoints(row: GapRow): { study: number; review: number; test: number } {
  const total = row.gap + row.delay;
  return { study: LEFT, review: LEFT + ((RIGHT - LEFT) * row.gap) / total, test: RIGHT };
}

/** The sentence under the picture. Every figure in it comes from the row. */
export function gapTimelineSentence(row: GapRow): string {
  return `Test ${days(row.delay)} after the review: the best gap tested for recall was ${days(row.gap)}, about ${row.share}% of the delay.`;
}

/** The timeline as SVG markup: study, then the gap, then the review, then the delay, then the test. */
export function gapTimelineSvg(row: GapRow): string {
  const p = gapTimelinePoints(row);
  const r = p.review.toFixed(1);
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${gapTimelineSentence(row)}">`
    + `<line class="vis-delay" x1="${r}" y1="${Y}" x2="${p.test}" y2="${Y}"/>`
    + `<line class="vis-gap" x1="${p.study}" y1="${Y}" x2="${r}" y2="${Y}"/>`
    + `<circle class="vis-dot" cx="${p.study}" cy="${Y}" r="5"/>`
    + `<circle class="vis-dot vis-review" cx="${r}" cy="${Y}" r="5"/>`
    + `<circle class="vis-dot" cx="${p.test}" cy="${Y}" r="5"/>`
    + `<text x="${p.study}" y="${Y - 26}">Study</text>`
    + `<text class="vis-strong" x="${p.study}" y="${Y - 12}">gap: ${days(row.gap)}</text>`
    + `<text x="${p.test}" y="${Y - 26}" text-anchor="end">Test</text>`
    + `<text x="${p.test}" y="${Y - 12}" text-anchor="end">delay: ${days(row.delay)}</text>`
    + `<text x="${r}" y="${Y + 24}">Review</text>`
    + `</svg>`;
}

/**
 * The card for a visual: one button per delay, and the timeline for the one picked. Nothing shows
 * until the learner picks, so each picture is a step they chose (learner-paced, one part at a time).
 */
export function renderVisual(v: Visual): HTMLElement {
  const fig = document.createElement('figure');
  fig.className = 'visual';
  fig.dataset.visualId = v.id;

  const cap = document.createElement('figcaption');
  cap.textContent = v.title;
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

  fig.append(cap, ask, buttons, picture, line);
  return fig;
}
