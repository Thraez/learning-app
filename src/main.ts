// The app: hash routes, plain DOM, no framework.
// Course HTML comes from this repo's own Markdown (trusted, built at deploy time).
// Anything the user typed is escaped before it is shown.

import './style.css';
import courseData from 'virtual:courses';
import type { Course, Item, Lesson, Placement, Block } from './types';
import {
  addAttempt, addSession, endSession, getAssignments, getAttempts, getSessions, getSettings, getStoredSettings, isRead,
  newId, nowIso, requestPersistence, saveSettings, setAppeal, variantString,
  type Appeal, type Attempt, type Confidence, type Mark, type Mode, type SessionKind, type VariantMap,
} from './store';
import {
  E6_DEFAULT, EXPERIMENTS, L15_ON, REVIEW_SIZES, activeWhole, ensureLessonAssignments, experimentOn, itemArms, reviewCap,
  type ReviewSize,
} from './variants';
import { renderVisual } from './visuals';
import { parseExportFile, restoreExport } from './restore';
import { placementResult } from './placement';
import { trustView, type SourceView } from './trust';
import { computeSchedules, courseProgress, dueItems, nextDue, LATE_DAYS } from './scheduler';
import { buildExport, deliverExport, downloadExport, exportFileName } from './export';

declare const __BUILD_ID__: string;
const BUILD = __BUILD_ID__;

const app = document.getElementById('app')!;
const courses = courseData.courses.filter((c) => c.status !== 'retired');

// ---------- helpers ----------

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]!);

function el<K extends keyof HTMLElementTagNameMap>(tag: K, attrs: Record<string, string> = {}, html = ''): HTMLElementTagNameMap[K] {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
  if (html) e.innerHTML = html;
  return e;
}

const fmtDate = (d: Date) => d.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
const fmtDay = (d: Date) => {
  const days = Math.round((startOfDay(d) - startOfDay(new Date())) / 86_400_000);
  if (days <= 0) return 'today';
  if (days === 1) return 'tomorrow';
  return `${fmtDate(d)} (in ${days} days)`;
};
const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();

const route = (kind: string, id: string) => `#/${kind}/${encodeURIComponent(id)}`;

function findLesson(id: string): { course: Course; lesson: Lesson } | null {
  for (const c of courses) {
    const lesson = c.lessons.find((l) => l.id === id);
    if (lesson) return { course: c, lesson };
  }
  return null;
}

function findItem(id: string): { course: Course; item: Item; lesson?: Lesson } | null {
  for (const c of courses) {
    for (const l of c.lessons) for (const b of l.blocks) if (b.kind === 'item' && b.item.id === id) return { course: c, item: b.item, lesson: l };
    for (const b of c.placement?.blocks ?? []) if (b.kind === 'item' && b.item.id === id) return { course: c, item: b.item };
  }
  return null;
}

function finishedLessonIds(): Set<string> {
  return new Set(getSessions().filter((s) => s.kind === 'lesson' && s.completed).map((s) => s.targetId));
}

function lastCompleted(kind: SessionKind, targetId: string): Date | null {
  const s = getSessions().filter((x) => x.kind === kind && x.targetId === targetId && x.completed && x.endedAt);
  return s.length ? new Date(s[s.length - 1].endedAt!) : null;
}

function page(title: string, back?: { href: string; label: string }): HTMLElement {
  app.innerHTML = '';
  window.scrollTo(0, 0);
  const main = el('main');
  if (back) main.append(el('a', { href: back.href, class: 'back' }, `&larr; ${esc(back.label)}`));
  main.append(el('h1', {}, esc(title)));
  app.append(main);
  return main;
}

// ---------- session tracking ----------

/** Starts a session lazily, on the first mark, so browsing a lesson leaves no empty session. */
class Run {
  sessionId: string | null = null;
  /** Whole-app variants in force when the session starts; fixed for its length. */
  whole: VariantMap = activeWhole(getSettings());
  missed: Item[] = [];
  marked = 0;
  constructor(public kind: SessionKind, public course: Course, public targetId: string) {}
  ensure(): string {
    if (!this.sessionId) {
      this.sessionId = newId();
      addSession({
        sessionId: this.sessionId, kind: this.kind, courseId: this.course.id, courseVersion: this.course.version,
        targetId: this.targetId, startedAt: nowIso(), endedAt: null, completed: false, variant: variantString(this.whole), variants: this.whole, appBuild: BUILD,
      });
      void requestPersistence();
    }
    return this.sessionId;
  }
  /** Records the learner's one-tap rating of the session. */
  rate(appeal: Appeal | null) {
    if (this.sessionId) setAppeal(this.sessionId, appeal);
  }
  finish() {
    if (this.sessionId) endSession(this.sessionId, true);
    else {
      // Finished without marking anything (for example a lesson reread): still record that it was finished.
      this.ensure();
      endSession(this.sessionId!, true);
    }
  }
}

// ---------- trust display ----------

const srcLink = (v: SourceView) => `<a href="${esc(v.url)}" target="_blank" rel="noopener">${esc(v.name)}</a>`;

/** Under the lesson title: when the lesson was checked, and one line per source. */
function trustStrip(lesson: Lesson): HTMLElement {
  const t = trustView(lesson);
  const box = el('div', { class: `trust small${t.checked ? '' : ' trust-open'}` });
  box.append(el('p', { class: 'trust-check' }, esc(t.checkLine)));
  for (const v of t.sources) {
    box.append(el('p', { class: 'trust-src' }, `${srcLink(v)}: ${esc(v.tier)}, ${esc(v.read)}.${v.caveat ? ` ${esc(v.caveat)}` : ''}`));
  }
  if (t.ledgerUrl) box.append(el('p', { class: 'trust-src' }, `<a href="${esc(t.ledgerUrl)}" target="_blank" rel="noopener">See the claim-by-claim check</a>`));
  return box;
}

/**
 * After an answer is shown: every source of the item's lesson. No item-to-source map exists,
 * so none is guessed. Placement items have no lesson and get no footer.
 */
function sourceFooter(item: Item): HTMLElement | null {
  const lesson = findItem(item.id)?.lesson;
  if (!lesson) return null;
  const t = trustView(lesson);
  const box = el('div', { class: 'source-footer small muted' });
  box.append(el('div', {}, 'Sources for this lesson'));
  for (const v of t.sources) {
    box.append(el('div', {}, `${srcLink(v)}: ${esc(v.tier)}, ${esc(v.read)}.${v.caveat ? ` ${esc(v.caveat)}` : ''}`));
  }
  if (!t.checked) box.append(el('div', {}, 'Not yet checked against its sources.'));
  return box;
}

// ---------- the item card ----------

const PLACEHOLDER: Record<Item['type'], string> = {
  open: 'Your guess (optional)',
  recall: 'Your answer (optional)',
  why: 'Your answer, two or three sentences',
  scenario: 'What would you do, and why?',
};
const TYPE_LABEL: Record<Item['type'], string> = { open: 'Before you read', recall: 'Recall', why: 'Why', scenario: 'Scenario' };

function itemCard(item: Item, run: Run, mode: Mode, context: string, onMarked: (mark: Mark | null) => void): HTMLElement {
  const card = el('section', { class: `item item-${item.type}` });
  const shownAt = nowIso();
  let revealedAt = '';
  let confidence: Confidence | null = null;

  // Experiment arms apply to lesson items only; they are read once, here, so the card and its record agree.
  const arms = itemArms(getSettings(), getAssignments(), item.id);
  const variants: VariantMap = { ...arms, ...run.whole };
  const variant = variantString(variants);
  const record = (fields: Pick<Attempt, 'text' | 'confidence' | 'mark' | 'exposure' | 'revealedAt'>) => {
    const sessionId = run.ensure();
    addAttempt({
      attemptId: newId(), itemId: item.id, itemType: item.type, courseId: run.course.id, courseVersion: run.course.version,
      parentId: item.parentId, sessionId, mode, shownAt, markedAt: nowIso(), variant, variants, appBuild: BUILD, ...fields,
    });
    run.marked++;
  };

  card.append(el('div', { class: 'item-kind' }, esc(context ? `${TYPE_LABEL[item.type]} \u00b7 ${context}` : TYPE_LABEL[item.type])));
  card.append(el('div', { class: 'prompt' }, item.promptHtml));
  const answerHtml = `<div class="answer"><div class="answer-label">${esc(item.answerLabel)}</div>${item.answerHtml}</div>`;

  // L1, reread arm: lesson mode only. Review and retry always ask, so both arms are tested the same way later.
  if (arms.L1 === 'reread' && mode === 'lesson' && item.type === 'recall') {
    card.append(el('div', {}, answerHtml));
    const foot0 = sourceFooter(item);
    if (foot0) card.append(foot0);
    const read = el('button', { type: 'button', class: 'primary' }, 'Read it');
    read.onclick = () => {
      record({ text: '', confidence: null, mark: null, exposure: 'read', revealedAt: shownAt });
      read.replaceWith(el('div', { class: 'marked' }, 'Read.'));
      onMarked(null);
    };
    card.append(read);
    return card;
  }

  const ta = el('textarea', { rows: item.type === 'recall' || item.type === 'open' ? '2' : '4', placeholder: PLACEHOLDER[item.type] });
  card.append(ta);

  const show = el('button', { type: 'button', class: 'primary' }, 'Show answer');
  // L11: with the experiment on, the "ask" arm must pick before the reveal and the "none" arm gets no control.
  // With it off (no arm), the control stays optional, as before.
  if (arms.L11 !== 'none') {
    const required = arms.L11 === 'ask';
    const conf = el('div', { class: 'row conf', role: 'group', 'aria-label': 'How sure are you?' });
    conf.append(el('span', { class: 'muted' }, required ? 'How sure? Pick one first.' : 'How sure?'));
    for (const c of ['sure', 'unsure', 'guess'] as Confidence[]) {
      const b = el('button', { type: 'button', class: 'chip', 'aria-pressed': 'false' }, c);
      b.onclick = () => {
        confidence = !required && confidence === c ? null : c;
        conf.querySelectorAll('button').forEach((x) => x.setAttribute('aria-pressed', String(x === b && confidence === c)));
        if (required) show.disabled = false;
      };
      conf.append(b);
    }
    card.append(conf);
    if (required) show.disabled = true;
  }
  card.append(show);

  show.onclick = () => {
    revealedAt = nowIso();
    ta.readOnly = true;
    card.querySelectorAll('.conf button').forEach((x) => ((x as HTMLButtonElement).disabled = true));
    show.remove();
    card.append(el('div', {}, answerHtml));
    const foot = sourceFooter(item);
    if (foot) card.append(foot);
    const marks = el('div', { class: 'row marks' });
    marks.append(el('span', { class: 'muted' }, 'Your answer was'));
    for (const m of ['right', 'partly', 'wrong'] as Mark[]) {
      const b = el('button', { type: 'button', class: `mark mark-${m}` }, m);
      b.onclick = () => {
        record({ text: ta.value.trim(), confidence, mark: m, exposure: 'answered', revealedAt });
        marks.replaceWith(el('div', { class: `marked marked-${m}` }, `Marked ${m}.`));
        onMarked(m);
      };
      marks.append(b);
    }
    card.append(marks);
  };
  return card;
}

/** An item already marked earlier in an unfinished session, shown as answered. */
function answeredCard(item: Item, a: Attempt): HTMLElement {
  const card = el('section', { class: `item item-${item.type}` });
  card.append(el('div', { class: 'item-kind' }, esc(TYPE_LABEL[item.type])));
  card.append(el('div', { class: 'prompt' }, item.promptHtml));
  if (a.text) card.append(el('p', { class: 'muted' }, `You wrote: ${esc(a.text)}`));
  card.append(el('div', { class: 'answer' }, `<div class="answer-label">${esc(item.answerLabel)}</div>${item.answerHtml}`));
  const foot = sourceFooter(item);
  if (foot) card.append(foot);
  card.append(isRead(a) ? el('div', { class: 'marked' }, 'Read.') : el('div', { class: `marked marked-${a.mark}` }, `Marked ${a.mark}.`));
  return card;
}

/** One question at the end of a session. Skippable; tapping another button changes the answer. No counts, no praise. */
function appealCard(run: Run): HTMLElement {
  const box = el('div', { class: 'row appeal', role: 'group', 'aria-label': 'How was this session?' });
  box.append(el('span', { class: 'muted' }, 'How was this session?'));
  const options: [Appeal, string][] = [['liked', 'Liked it'], ['neutral', 'Neutral'], ['disliked', 'Did not like it']];
  for (const [value, label] of options) {
    const b = el('button', { type: 'button', class: 'chip', 'aria-pressed': 'false' }, label);
    b.onclick = () => {
      run.rate(value);
      box.querySelectorAll('button').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    };
    box.append(b);
  }
  return box;
}

// ---------- screens ----------

function home() {
  const main = page('Learning');
  const schedules = computeSchedules(getAttempts());
  const finished = finishedLessonIds();
  if (!courses.length) main.append(el('p', {}, 'No courses in this build.'));
  for (const c of courses) {
    const box = el('section', { class: 'card' });
    box.append(el('h2', {}, `<a href="${route('course', c.id)}">${esc(c.title)}</a>`));
    const due = dueItems(c, schedules);
    if (due.length) {
      const n = Math.min(due.length, reviewCap(getSettings()));
      box.append(el('p', {}, `<a class="button primary" href="${route('review', c.id)}">Review ${n} item${n === 1 ? '' : 's'}</a>`));
    } else {
      const nd = nextDue(c, schedules);
      box.append(el('p', { class: 'muted' }, nd ? `Nothing to review now. Next review ${fmtDay(nd)}.` : 'Nothing to review yet. Items join the review list when you answer them in a lesson.'));
    }
    const next = c.lessons.find((l) => l.status !== 'retired' && !finished.has(l.id));
    if (c.placement && !lastCompleted('placement', c.placement.id)) {
      box.append(el('p', {}, `Not started? <a href="${route('placement', c.placement.id)}">Take the placement quiz</a> first.`));
    }
    if (next) box.append(el('p', {}, `Next lesson: <a href="${route('lesson', next.id)}">${next.order}. ${esc(next.title)}</a>`));
    box.append(el('p', { class: 'muted small' }, `${finished.size ? [...finished].filter((id) => c.lessons.some((l) => l.id === id)).length : 0} of ${c.lessons.length} lessons finished. <a href="${route('course', c.id)}">All lessons</a>`));
    main.append(box);
  }
  main.append(nav());
}

function nav(): HTMLElement {
  const n = el('nav', { class: 'bottom' });
  n.innerHTML = `<a href="#/">Courses</a><a href="#/progress">Progress</a><a href="#/export">Export</a><a href="#/settings">Settings</a><a href="#/about">About</a>`;
  return n;
}

function courseScreen(id: string) {
  const c = courses.find((x) => x.id === id);
  if (!c) return notFound();
  const main = page(c.title, { href: '#/', label: 'Courses' });
  main.append(el('p', { class: 'muted small' }, `Version ${esc(c.version)}, ${esc(c.status)}`));
  const finished = finishedLessonIds();
  const list = el('ol', { class: 'lessons' });
  if (c.placement) {
    const d = lastCompleted('placement', c.placement.id);
    list.append(el('li', { class: 'placement' }, `<a href="${route('placement', c.placement.id)}">${esc(c.placement.title)}</a> <span class="muted small">${d ? `taken ${fmtDate(d)}` : ''}</span>`));
  }
  for (const l of c.lessons) {
    if (l.status === 'retired') continue;
    const d = lastCompleted('lesson', l.id);
    list.append(el('li', {}, `<a href="${route('lesson', l.id)}">${l.order}. ${esc(l.title)}</a> <span class="muted small">${finished.has(l.id) && d ? `finished ${fmtDate(d)}` : ''}</span>`));
  }
  main.append(el('h2', {}, 'Lessons'), list);
  const details = el('details', { class: 'course-page' });
  details.append(el('summary', {}, 'Course page'), el('div', {}, c.html));
  main.append(details);
}

/**
 * Lesson and placement quiz: blocks appear in order, and everything after an item stays hidden
 * until that item is marked, so each answer is tried before the text that gives it away.
 * Missed items come back once at the end of the session.
 */
function studyScreen(kind: 'lesson' | 'placement', course: Course, target: Lesson | Placement, title: string) {
  const main = page(title, { href: route('course', course.id), label: course.title });
  const run = new Run(kind, course, target.id);
  const mode: Mode = kind;
  if (kind === 'lesson') {
    ensureLessonAssignments(target as Lesson, EXPERIMENTS.map((e) => e.id));
    main.append(trustStrip(target as Lesson));
  }
  const blocks: Block[] = target.blocks;
  const marks = new Map<string, { mark: Mark | null }>();
  let i = 0;

  // Resume an unfinished session for this lesson (the phone may have reloaded the app mid-lesson),
  // so marked items are not asked, and logged, a second time.
  const open = getSessions().filter((s) => s.kind === kind && s.targetId === target.id && !s.endedAt).pop();
  const prior = new Map<string, Attempt>();
  if (open) {
    run.sessionId = open.sessionId;
    // A resumed session keeps the whole-app variants it started with, so its record stays true
    // (a visual does not appear halfway through a session logged without L15).
    run.whole = open.variants ?? {};
    const retried = new Set<string>();
    for (const a of getAttempts()) {
      if (a.sessionId !== open.sessionId) continue;
      if (a.mode === mode) prior.set(a.itemId, a);
      if (a.mode === 'retry') retried.add(a.itemId);
    }
    for (const a of prior.values()) if (a.mark === 'wrong' && kind === 'lesson' && a.itemType !== 'open' && !retried.has(a.itemId)) {
      const f = findItem(a.itemId);
      if (f) run.missed.push(f.item);
    }
    run.marked = prior.size;
    if (prior.size) main.append(el('p', { class: 'muted small' }, 'Picked up where you left off.'));
  }

  const advance = () => {
    while (i < blocks.length) {
      const b = blocks[i++];
      if (b.kind === 'section') main.append(el('h2', {}, esc(b.title)));
      else if (b.kind === 'prose') main.append(el('div', { class: 'prose' }, b.html));
      // A visual shows only with L15 on (fixed for the session, like every whole-app variant); otherwise it is skipped.
      else if (b.kind === 'visual') { if (run.whole.L15 === L15_ON) main.append(renderVisual(b.visual)); }
      else {
        const it = b.item;
        const done = prior.get(it.id);
        if (done) { marks.set(it.id, { mark: done.mark }); main.append(answeredCard(it, done)); continue; }
        main.append(itemCard(it, run, mode, '', (m) => {
          marks.set(it.id, { mark: m });
          if (m === 'wrong' && kind === 'lesson' && it.type !== 'open') run.missed.push(it);
          advance();
        }));
        return; // wait for the mark
      }
    }
    finishButton();
  };

  const finishButton = () => {
    const b = el('button', { type: 'button', class: 'primary' }, run.missed.length ? 'Try the missed items again' : 'Finish');
    b.onclick = () => {
      b.remove();
      if (run.missed.length) retryMissed(main, run, () => done());
      else done();
    };
    main.append(b);
  };

  const done = () => {
    run.finish();
    if (kind === 'placement') placementSummary(main, course, target as Placement, run);
    else {
      const end = el('div', { class: 'card end' }, `<p>Lesson finished. ${run.marked} answer${run.marked === 1 ? '' : 's'} saved.</p><p>Its recall, why and scenario items now come back for review on later days.</p>`);
      end.append(appealCard(run), el('p', {}, '<a href="#/">Back to courses</a>'));
      main.append(end);
    }
    main.lastElementChild?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  advance();
}

function retryMissed(main: HTMLElement, run: Run, then: () => void) {
  const queue = [...run.missed];
  run.missed = [];
  main.append(el('h2', {}, 'Missed items, once more'));
  const next = () => {
    const it = queue.shift();
    if (!it) return then();
    const card = itemCard(it, run, 'retry', 'second try', () => next());
    main.append(card);
    card.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  next();
}

function placementSummary(main: HTMLElement, course: Course, p: Placement, run: Run) {
  // Latest placement attempt per item.
  const latest = new Map<string, Attempt>();
  for (const a of getAttempts()) if (a.mode === 'placement' && a.parentId === p.id) latest.set(a.itemId, a);
  const box = el('section', { class: 'card end' });
  box.append(el('h2', {}, 'Where to start'));
  box.append(el('p', {}, 'Placement uses the why and scenario items only. Recall items are about figures from single papers, so missing them says little.'));
  const result = placementResult(course, p, latest);
  const rows = result.rows.map((r) => r.lesson
    ? `<li><a href="${route('lesson', r.lesson.id)}">${r.order}. ${esc(r.lesson.title)}</a>: ${r.solid ? 'right and sure, so skim it and do its scenario' : 'do the full lesson'}</li>`
    : `<li>Lesson ${r.order}: planned, not written yet</li>`);
  if (result.start) {
    box.append(el('p', {}, `Start with <a href="${route('lesson', result.start.id)}">lesson ${result.start.order}: ${esc(result.start.title)}</a>.`));
  }
  box.append(el('ul', {}, rows.join('') || '<li>No concept items in this quiz.</li>'));
  box.append(appealCard(run));
  box.append(el('p', {}, `Lessons the quiz does not cover: do them in full. <a href="#/">Back to courses</a>`));
  main.append(box);
}

function reviewScreen(courseId: string) {
  const c = courses.find((x) => x.id === courseId);
  if (!c) return notFound();
  const main = page(`Review: ${c.title}`, { href: '#/', label: 'Courses' });
  const queue = dueItems(c, computeSchedules(getAttempts())).slice(0, reviewCap(getSettings()));
  if (!queue.length) {
    main.append(el('p', {}, 'Nothing is due. <a href="#/">Back to courses</a>'));
    return;
  }
  // L11 applies in every mode, so an item without an arm yet gets one before it is asked.
  for (const l of new Set(queue.map((id) => findItem(id)?.lesson).filter((l): l is Lesson => !!l))) ensureLessonAssignments(l, ['L11']);
  const run = new Run('review', c, '');
  const total = queue.length;
  const counter = el('p', { class: 'muted small' });
  main.append(counter);
  const holder = el('div');
  main.append(holder);
  let n = 0;

  const next = () => {
    const id = queue.shift();
    if (!id) {
      if (run.missed.length) {
        holder.innerHTML = '';
        counter.textContent = '';
        return retryMissed(holder, run, end);
      }
      return end();
    }
    n++;
    counter.textContent = `${n} of ${total}`;
    const found = findItem(id);
    if (!found) return next();
    holder.innerHTML = '';
    const ctx = found.lesson ? `lesson ${found.lesson.order}` : '';
    holder.append(itemCard(found.item, run, 'review', ctx, (m) => {
      if (m === 'wrong') run.missed.push(found.item);
      const b = el('button', { type: 'button', class: 'primary' }, queue.length ? 'Next' : 'Finish');
      b.onclick = () => { window.scrollTo(0, 0); next(); };
      holder.append(b);
    }));
  };

  const end = () => {
    run.finish();
    const nd = nextDue(c, computeSchedules(getAttempts()));
    holder.innerHTML = '';
    counter.textContent = '';
    const endCard = el('div', { class: 'card end' }, `<p>Review finished. ${total} item${total === 1 ? '' : 's'}.</p>${nd ? `<p class="muted">Next review ${fmtDay(nd)}.</p>` : ''}`);
    endCard.append(appealCard(run), el('p', {}, '<a href="#/">Back to courses</a>'));
    holder.append(endCard);
  };
  next();
}

function progressScreen() {
  const main = page('Progress', { href: '#/', label: 'Courses' });
  main.append(el('p', { class: 'muted' }, `What you can recall, not how often you open the app. "Learned" means your last answer to the item was right. Late recall counts answers given ${LATE_DAYS} or more days after you first answered the item.`));
  const finished = finishedLessonIds();
  const attempts = getAttempts();
  for (const c of courses) {
    const p = courseProgress(c, attempts, finished);
    const box = el('section', { class: 'card' });
    box.append(el('h2', {}, esc(c.title)));
    const late = p.late.score === null
      ? (p.lateStartsOn ? `No item is two weeks old yet. The first reaches two weeks on ${fmtDate(p.lateStartsOn)}.` : p.itemsStarted ? 'No answers two weeks after first sight yet.' : 'Starts two weeks after your first lesson.')
      : `${Math.round(p.late.score * 100)}% over ${p.late.answers} answer${p.late.answers === 1 ? '' : 's'} on ${p.late.items} item${p.late.items === 1 ? '' : 's'}.`;
    box.append(el('dl', {}, `
      <dt>Lessons finished</dt><dd>${p.lessonsFinished} of ${p.lessonsTotal}</dd>
      <dt>Items learned</dt><dd>${p.itemsLearned} of ${p.itemsTotal}${p.itemsPartly ? `, ${p.itemsPartly} partly` : ''}</dd>
      <dt>Items not yet answered</dt><dd>${p.itemsTotal - p.itemsStarted}</dd>
      <dt>Late recall (${LATE_DAYS}+ days)</dt><dd>${late}</dd>`));
    // Per lesson: learned of total.
    const sched = new Map<string, Mark>();
    for (const a of attempts) if ((a.mode === 'lesson' || a.mode === 'review') && !isRead(a) && a.mark) sched.set(a.itemId, a.mark);
    const rows = c.lessons.filter((l) => l.status !== 'retired').map((l) => {
      const ids = l.blocks.flatMap((b) => (b.kind === 'item' && b.item.type !== 'open' ? [b.item.id] : []));
      const right = ids.filter((id) => sched.get(id) === 'right').length;
      return `<li>${l.order}. ${esc(l.title)}: <span class="muted">${right} of ${ids.length} learned</span></li>`;
    });
    box.append(el('ul', { class: 'small' }, rows.join('')));
    main.append(box);
  }
}

function exportScreen() {
  const main = page('Export', { href: '#/', label: 'Courses' });
  const attempts = getAttempts();
  main.append(el('p', {}, `Writes every answer on this phone to a JSON file: ${attempts.length} answer${attempts.length === 1 ? '' : 's'} in ${getSessions().length} session${getSessions().length === 1 ? '' : 's'}. Bring the file to a course session at the PC.`));
  main.append(el('p', { class: 'muted small' }, 'Nothing leaves the phone unless you send the file. Exporting does not delete anything.'));
  const status = el('p', { class: 'muted' });
  const make = () => {
    const json = JSON.stringify(buildExport(courseData, getAttempts(), getSessions(), BUILD, new Date(), getAssignments(), getStoredSettings()), null, 2);
    return { json, name: exportFileName() };
  };
  const share = el('button', { type: 'button', class: 'primary' }, 'Export answers');
  share.onclick = async () => {
    const { json, name } = make();
    const r = await deliverExport(json, name);
    status.textContent = r === 'shared' ? `Shared ${name}.` : r === 'downloaded' ? `Saved ${name}.` : 'Cancelled.';
  };
  const dl = el('button', { type: 'button' }, 'Save as file instead');
  dl.onclick = () => {
    const { json, name } = make();
    downloadExport(json, name);
    status.textContent = `Saved ${name}.`;
  };
  main.append(el('div', { class: 'row' }), share, ' ', dl, status);
  main.append(el('p', { class: 'muted small' }, 'Lost your answers? <a href="#/settings">Restore from an export file</a> in Settings.'));
}

function settingsScreen() {
  const main = page('Settings', { href: '#/', label: 'Courses' });
  const settings = getSettings();

  main.append(el('h2', {}, 'Experiments'));
  main.append(el('p', { class: 'muted small' }, 'Both are on unless you switch them off here. An item keeps its arm for good, even if you switch the experiment off and on again. Each answer records which arm it got.'));
  for (const exp of EXPERIMENTS) {
    const cb = el('input', { type: 'checkbox', id: `exp-${exp.id}` });
    cb.checked = experimentOn(settings, exp.id);
    cb.onchange = () => {
      const s = getSettings();
      s.experiments[exp.id] = cb.checked;
      saveSettings(s);
    };
    const label = el('label', { class: 'switch' });
    label.append(cb, el('span', {}, ` <strong>${esc(exp.id)}: ${esc(exp.title)}.</strong> ${esc(exp.about)}`));
    const p = el('p');
    p.append(label);
    main.append(p);
  }

  main.append(el('h2', {}, 'Review session length'));
  main.append(el('p', { class: 'muted small' }, 'The most items one review session asks. After the last day, if you set one, it goes back to Standard.'));
  const e6 = settings.whole.E6;
  const select = el('select', { id: 'e6-value', 'aria-label': 'Review session length' });
  for (const [v, info] of Object.entries(REVIEW_SIZES)) select.append(el('option', { value: v }, esc(info.label)));
  select.value = e6?.value && e6.value in REVIEW_SIZES ? e6.value : E6_DEFAULT;
  const until = el('input', { type: 'date', id: 'e6-until', 'aria-label': 'Last day (optional)' });
  until.value = e6?.until ?? '';
  const note = el('p', { class: 'muted small' });
  const describe = () => {
    const cur = getSettings().whole.E6;
    const a = activeWhole(getSettings());
    note.textContent = cur && cur.value !== E6_DEFAULT && !a.E6
      ? 'The last day has passed, so Standard applies.'
      : `In force now: ${REVIEW_SIZES[(a.E6 ?? E6_DEFAULT) as ReviewSize].label}.`;
  };
  const saveE6 = () => {
    const s = getSettings();
    const prev = s.whole.E6;
    s.whole.E6 = { value: select.value, since: prev && prev.value === select.value ? prev.since : nowIso(), until: until.value || null };
    saveSettings(s);
    describe();
  };
  select.onchange = saveE6;
  until.onchange = saveE6;
  const row = el('div', { class: 'row' });
  row.append(select, el('span', { class: 'muted small' }, 'Last day (optional):'), until);
  main.append(row, note);
  describe();

  main.append(el('h2', {}, 'Interactive visuals'));
  main.append(el('p', { class: 'muted small' }, 'Off unless you switch it on. Some lessons have a picture you can tap through; it restates figures the lesson text already gives. Sessions record whether it was on.'));
  const vis = el('input', { type: 'checkbox', id: 'l15-on' });
  vis.checked = activeWhole(settings).L15 === L15_ON;
  vis.onchange = () => {
    const s = getSettings();
    s.whole.L15 = { value: vis.checked ? L15_ON : 'off', since: nowIso(), until: null };
    saveSettings(s);
  };
  const visLabel = el('label', { class: 'switch' });
  visLabel.append(vis, el('span', {}, ' <strong>L15: Show interactive visuals in lessons.</strong>'));
  const visP = el('p');
  visP.append(visLabel);
  main.append(visP);

  main.append(el('h2', {}, 'Restore from an export file'));
  main.append(el('p', { class: 'muted small' }, 'Adds answers and sessions from an export file that are missing on this phone. Nothing already here is changed or deleted, so restoring the same file twice adds nothing. Settings come back only if this phone has none.'));
  const file = el('input', { type: 'file', accept: 'application/json,.json', id: 'restore-file', 'aria-label': 'Export file to restore' });
  const status = el('p', { role: 'status' });
  file.onchange = async () => {
    const f = file.files?.[0];
    if (!f) return;
    const parsed = parseExportFile(await f.text());
    if (!parsed.ok) { status.textContent = parsed.error; file.value = ''; return; }
    const r = restoreExport(parsed.file);
    const plural = (n: number, w: string) => `${n} ${w}${n === 1 ? '' : 's'}`;
    status.textContent = `Added ${plural(r.attempts, 'answer')}, ${plural(r.sessions, 'session')} and ${plural(r.assignments, 'experiment assignment')}. Settings ${r.settingsRestored ? 'restored' : 'kept as they were'}.${r.skipped ? ` Skipped ${plural(r.skipped, 'unusable entry')}.` : ''}`;
    file.value = '';
  };
  main.append(file, status);
  main.append(nav());
}

function aboutScreen() {
  const main = page('About', { href: '#/', label: 'Courses' });
  main.append(el('dl', {}, `
    <dt>App build</dt><dd>${esc(BUILD)}</dd>
    <dt>Courses built</dt><dd>${esc(new Date(courseData.builtAt).toLocaleString())}</dd>
    ${courses.map((c) => `<dt>${esc(c.title)}</dt><dd>version ${esc(c.version)}, ${c.lessons.length} lessons</dd>`).join('')}
    <dt>Storage</dt><dd id="persist">checking</dd>`));
  const check = el('button', { type: 'button' }, 'Check for a new version');
  const msg = el('p', { class: 'muted small' });
  check.onclick = async () => {
    msg.textContent = 'Checking.';
    const reg = await navigator.serviceWorker?.getRegistration();
    if (!reg) { msg.textContent = 'Offline support is not active in this browser.'; return; }
    await reg.update().catch(() => undefined);
    msg.textContent = reg.installing || reg.waiting ? 'A new version is loading.' : 'This is the newest version, or the phone is offline.';
  };
  main.append(check, msg);
  main.append(el('p', { class: 'muted small' }, 'Your answers live only in this browser on this phone. On iPhone, the home screen app and Safari keep separate storage, so always open the app from the home screen.'));
  void (async () => {
    const p = await (navigator.storage?.persisted?.() ?? Promise.resolve(false)).catch(() => false);
    const d = document.getElementById('persist');
    if (d) d.textContent = p ? 'kept (the browser will not clear it on its own)' : 'not marked as kept yet; installing the app usually fixes this';
  })();
}

function notFound() {
  const main = page('Not found', { href: '#/', label: 'Courses' });
  main.append(el('p', {}, 'This page is not in the current build. A lesson may have been renamed or retired.'));
}

// ---------- router ----------

function render() {
  const [, kind = '', raw = ''] = location.hash.split('/');
  const id = decodeURIComponent(raw);
  switch (kind) {
    case '': return home();
    case 'course': return courseScreen(id);
    case 'lesson': {
      const f = findLesson(id);
      return f ? studyScreen('lesson', f.course, f.lesson, `${f.lesson.order}. ${f.lesson.title}`) : notFound();
    }
    case 'placement': {
      const c = courses.find((x) => x.placement?.id === id);
      return c ? studyScreen('placement', c, c.placement!, c.placement!.title) : notFound();
    }
    case 'review': return reviewScreen(id);
    case 'progress': return progressScreen();
    case 'export': return exportScreen();
    case 'settings': return settingsScreen();
    case 'about': return aboutScreen();
    default: return notFound();
  }
}

window.addEventListener('hashchange', render);
render();

// ---------- offline support and updates ----------

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  const hadController = !!navigator.serviceWorker.controller;
  navigator.serviceWorker.register('./sw.js').then((reg) => {
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') reg.update().catch(() => undefined);
    });
  }).catch(() => undefined);
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!hadController) return; // first install, nothing to reload
    if (document.getElementById('update-bar')) return;
    // A cold launch already loads the newest build; skip the bar if this page is that build.
    void caches.keys().then((keys) => {
      if (keys.length === 1 && keys[0] === `learning-app-${BUILD}`) return;
      showUpdateBar();
    });
  });
  const showUpdateBar = () => {
    const bar = el('div', { id: 'update-bar', role: 'status' }, 'A new version is ready. ');
    const b = el('button', { type: 'button' }, 'Reload');
    b.onclick = () => location.reload();
    bar.append(b);
    document.body.append(bar);
  };
}
