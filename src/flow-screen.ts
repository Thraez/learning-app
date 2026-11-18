// The screen for the non-Classic flows: one screen at a time, a "3 of 14" count and a Next button.
// The list of screens comes from flows.ts. Items are drawn by the app's own item card (passed in),
// so attempts, experiment arms, the confidence prompt and the source footer behave as in Classic.
// Taps on checks, predictions and decisions are saved as responses, never as attempts.

import { el, esc } from './dom';
import { buildScreens, type Flow, type Screen } from './flows';
import { addResponse, nowIso, type Mark } from './store';
import type { Item, Lesson } from './types';
import { renderVisual } from './visuals';

export interface FlowDeps {
  main: HTMLElement;
  lesson: Lesson;
  flow: Flow;
  run: { ensure(): string; finish(): void; marked: number };
  /** The item card; `afterAnswer` runs once the answer is shown, before the marks. */
  itemCard(item: Item, onMarked: (m: Mark | null) => void, afterAnswer?: (card: HTMLElement) => void): HTMLElement;
  /** The item shown as answered, when an unfinished session already holds its answer. */
  answeredCard(item: Item): { card: HTMLElement; mark: Mark | null } | null;
  trust(): HTMLElement;
  appeal(): HTMLElement;
}

/** The decimals a step needs, so 0.5 shows "6.5" and 1 shows "7". */
export const decimalsOf = (step: number) => (String(step).split('.')[1] ?? '').length;

const sectionLabel = (title: string) => (title ? el('div', { class: 'item-kind' }, esc(title)) : null);

export function flowScreen(d: FlowDeps) {
  const screens = buildScreens(d.lesson, d.flow);
  const total = screens.length;
  const marks = new Map<string, Mark | null>();

  const count = el('p', { class: 'muted small flow-count', role: 'status' });
  const stage = el('div', { class: 'flow-stage', tabindex: '-1' });
  const next = el('button', { type: 'button', class: 'primary flow-next' }, 'Next');
  d.main.append(count, stage, next);

  let n = 0;

  const show = () => {
    const s = screens[n];
    stage.innerHTML = '';
    if (n === 0) stage.append(d.trust());
    count.textContent = `${n + 1} of ${total}`;
    next.textContent = n === total - 1 ? 'Finish' : 'Next';
    const lock = renderScreen(s, stage, d, marks, () => { next.disabled = false; });
    next.disabled = lock;
    window.scrollTo(0, 0);
    stage.focus({ preventScroll: true });
  };

  next.onclick = () => {
    if (n + 1 < total) { n++; show(); } else finish();
  };

  const finish = () => {
    stage.innerHTML = '';
    count.remove();
    next.remove();
    d.run.finish();
    const tally = { right: 0, partly: 0, wrong: 0, read: 0 };
    for (const m of marks.values()) { if (m === null) tally.read++; else tally[m]++; }
    const parts = [`${tally.right} right`, `${tally.partly} partly`, `${tally.wrong} wrong`];
    const end = el('div', { class: 'card end' });
    end.append(el('p', {}, `Lesson finished. ${d.run.marked} answer${d.run.marked === 1 ? '' : 's'} saved.`));
    end.append(el('p', {}, `Marks: ${parts.join(', ')}${tally.read ? `. Read, not asked: ${tally.read}` : ''}.`));
    end.append(el('p', {}, 'Its recall, why and scenario items now come back for review on later days.'));
    end.append(d.appeal(), el('p', {}, '<a href="#/">Back to courses</a>'));
    stage.append(end);
    window.scrollTo(0, 0);
  };

  if (total) show();
  else finish();
}

/** Draws one screen into `stage`. Returns true when Next must wait for the learner to act first. */
function renderScreen(s: Screen, stage: HTMLElement, d: FlowDeps, marks: Map<string, Mark | null>, unlock: () => void): boolean {
  const label = sectionLabel(s.section);
  if (label && s.kind === 'chunk') stage.append(label);

  switch (s.kind) {
    case 'chunk': {
      if (s.html) stage.append(el('div', { class: 'prose' }, s.html));
      for (const v of s.visuals) stage.append(renderVisual(v));
      return false;
    }
    case 'check': return renderCheck(s, stage, d, unlock);
    case 'predict': return renderPredict(s, stage, d, unlock);
    case 'decide': return renderDecide(s, stage, d, unlock);
    case 'item': {
      const done = d.answeredCard(s.item);
      if (done) { marks.set(s.item.id, done.mark); stage.append(done.card); return false; }
      const afterAnswer = s.points ? (card: HTMLElement) => card.append(pointsList(s.points!)) : undefined;
      stage.append(d.itemCard(s.item, (m) => { marks.set(s.item.id, m); unlock(); }, afterAnswer));
      return true;
    }
  }
}

function respond(d: FlowDeps, id: string, value: number) {
  addResponse({ id, at: nowIso(), session: d.run.ensure(), value });
}

function renderCheck(s: Extract<Screen, { kind: 'check' }>, stage: HTMLElement, d: FlowDeps, unlock: () => void): boolean {
  const c = s.check;
  const card = el('section', { class: 'item item-check' });
  card.append(el('div', { class: 'item-kind' }, `Check${s.section ? ` · ${esc(s.section)}` : ''}`));
  card.append(el('p', { class: 'prompt' }, esc(c.prompt)));
  const group = el('div', { class: 'choices', role: 'group', 'aria-label': 'Options' });
  const feedback = el('div', { class: 'feedback', 'aria-live': 'polite' });
  const buttons = c.options.map((o, idx) => {
    const b = el('button', { type: 'button', class: 'choice' }, esc(o.text));
    b.onclick = () => {
      respond(d, c.id, idx);
      buttons.forEach((x, k) => {
        x.disabled = true;
        x.setAttribute('aria-pressed', String(k === idx));
        if (c.options[k].correct) x.classList.add('is-right');
        else if (k === idx) x.classList.add('is-wrong');
      });
      const right = c.options.find((x) => x.correct)!;
      feedback.append(el('p', { class: o.correct ? 'marked marked-right' : 'marked marked-wrong' }, o.correct ? 'Right.' : 'Not quite.'));
      feedback.append(el('p', {}, esc(o.why)));
      if (!o.correct) feedback.append(el('p', {}, `<strong>The right answer:</strong> ${esc(right.text)} ${esc(right.why)}`));
      unlock();
    };
    return b;
  });
  group.append(...buttons);
  card.append(group, feedback);
  stage.append(card);
  return true;
}

function renderPredict(s: Extract<Screen, { kind: 'predict' }>, stage: HTMLElement, d: FlowDeps, unlock: () => void): boolean {
  const p = s.predict;
  const dec = decimalsOf(p.step);
  const fmt = (v: number) => `${Number(v.toFixed(dec))}${p.unit === '%' || p.unit === '' ? p.unit : ` ${p.unit}`}`;
  const start = Math.min(p.max, Math.max(p.min, p.min + Math.round((p.max - p.min) / 2 / p.step) * p.step));

  const card = el('section', { class: 'item item-predict' });
  card.append(el('div', { class: 'item-kind' }, 'Predict'));
  card.append(el('p', { class: 'prompt' }, esc(p.prompt)));
  const slider = el('input', {
    type: 'range', min: String(p.min), max: String(p.max), step: String(p.step), value: String(start), 'aria-label': 'Your guess',
  });
  const shown = el('output', { class: 'predict-value' }, esc(fmt(start)));
  slider.oninput = () => { shown.textContent = fmt(Number(slider.value)); };
  const row = el('div', { class: 'row predict-row' });
  row.append(slider, shown);
  const commit = el('button', { type: 'button', class: 'primary' }, 'Commit');
  const reveal = el('div', { class: 'predict-reveal', 'aria-live': 'polite' });
  commit.onclick = () => {
    const guess = Number(slider.value);
    respond(d, p.id, guess);
    slider.disabled = true;
    commit.remove();
    reveal.append(el('p', {}, `<strong>Your guess:</strong> ${esc(fmt(guess))}`));
    reveal.append(el('p', {}, `<strong>The figure:</strong> ${esc(p.answerText)}`));
    reveal.append(el('p', {}, esc(p.reveal)));
    if (s.visual) reveal.append(renderVisual(s.visual));
    unlock();
  };
  card.append(row, commit, reveal);
  stage.append(card);
  return true;
}

function renderDecide(s: Extract<Screen, { kind: 'decide' }>, stage: HTMLElement, d: FlowDeps, unlock: () => void): boolean {
  const q = s.decide;
  const hasBest = q.options.some((o) => o.best);
  const card = el('section', { class: 'item item-decide' });
  card.append(el('div', { class: 'item-kind' }, 'Decide'));
  card.append(el('p', { class: 'prompt' }, esc(q.prompt)));
  const group = el('div', { class: 'choices', role: 'group', 'aria-label': 'Options' });
  const outcomes = el('div', { class: 'feedback', 'aria-live': 'polite' });
  const buttons = q.options.map((o, idx) => {
    const b = el('button', { type: 'button', class: 'choice' }, esc(o.text));
    b.onclick = () => {
      respond(d, q.id, idx);
      group.remove();
      outcomes.append(el('p', { class: 'muted small' }, 'What follows from each choice:'));
      q.options.forEach((x, k) => {
        const tags = [k === idx ? 'Your choice' : '', x.best ? 'Best supported' : ''].filter(Boolean);
        const box = el('div', { class: `outcome${k === idx ? ' is-chosen' : ''}${x.best ? ' is-best' : ''}` });
        box.append(el('p', {}, `<strong>${esc(x.text)}</strong>${tags.length ? ` <span class="tag">${esc(tags.join(', '))}</span>` : ''}`));
        box.append(el('p', {}, esc(x.outcome)));
        outcomes.append(box);
      });
      if (!hasBest) outcomes.append(el('p', { class: 'muted' }, 'The evidence does not pick one of these as best.'));
      unlock();
    };
    return b;
  });
  group.append(...buttons);
  card.append(group, outcomes);
  stage.append(card);
  return true;
}

/** "Which of these did your answer make?" Ticks are shown to the learner and never stored. */
function pointsList(points: string[]): HTMLElement {
  const box = el('fieldset', { class: 'points' });
  box.append(el('legend', {}, 'Which of these did your answer make?'));
  for (const text of points) {
    const label = el('label', { class: 'switch' });
    label.append(el('input', { type: 'checkbox' }), el('span', {}, ` ${esc(text)}`));
    box.append(el('p', {}, ''));
    box.lastElementChild!.append(label);
  }
  return box;
}
