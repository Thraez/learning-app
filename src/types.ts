// Course data produced by the build-time parser (src/build/parse-courses.ts)
// and read by the app through the virtual module "virtual:courses".

export type ItemType = 'open' | 'why' | 'scenario' | 'recall';

export interface Item {
  id: string;
  type: ItemType;
  /** Lesson id for lesson items, placement id for placement items. */
  parentId: string;
  promptHtml: string;
  answerHtml: string;
  /** Text of the <summary> line, for example "Model answer". */
  answerLabel: string;
  /** Placement items only: the lesson number named at the end of the answer ("Lesson 3."). */
  targetLessonOrder?: number;
}

/** A tap question with feedback on every option (a "```check" block). Not an item: it leaves no attempt. */
export interface CheckOption { text: string; correct: boolean; why: string }
export interface Check { id: string; prompt: string; options: CheckOption[] }

/** Commit a number, then see the real one (a "```predict" block). `covers` is the recall item that brings the figure back in reviews. */
export interface Predict {
  id: string;
  prompt: string;
  unit: string;
  min: number;
  max: number;
  step: number;
  answer: number;
  answerText: string;
  reveal: string;
  covers: string;
  /** Id of a visual in the same lesson, drawn under the reveal. */
  visual?: string;
}

/** Choose first, then see what follows from each choice (a "```decide" block). `best` is set only where the source supports it. */
export interface DecideOption { text: string; outcome: string; best: boolean }
export interface Decide { id: string; prompt: string; options: DecideOption[] }

/** Key points a good answer to a why or scenario item makes (a "```points" block); the learner ticks the ones theirs made. */
export interface Points { for: string; points: string[] }

/** One row of a "gap-timeline" visual: a test delay, the best review gap tested for it, and that gap as a share of the delay. */
export interface GapRow {
  /** Days from the review to the final test. */
  delay: number;
  /** Days from first study to the review. */
  gap: number;
  /** The gap as a whole-number percentage of the delay, as the lesson states it. */
  share: number;
}
export interface BarRow { label: string; value: number; low?: number; high?: number; note?: string }
export interface SpanRow { label: string; from: number; to: number; open: boolean; note?: string }

export type VisualKind = 'gap-timeline' | 'bars' | 'dot-grid' | 'spans';

/**
 * A picture the app draws from data in the lesson file (a "```visual" block). It has a stable id
 * like an item, but nothing is answered, so it leaves no attempt. Only the non-Classic flows show it.
 */
export type Visual = {
  id: string;
  parentId: string;
  title: string;
  /** One plain sentence saying what the picture shows; also its text for screen readers. */
  text: string;
} & (
  | { kind: 'gap-timeline'; rows: GapRow[] }
  | { kind: 'bars'; unit: string; zero: boolean; rows: BarRow[] }
  | { kind: 'dot-grid'; total: number; marked: number; markedLabel: string; restLabel: string }
  | { kind: 'spans'; axis: string; max: number; rows: SpanRow[] }
);

/**
 * The new kinds (check, predict, decide, visual, points, break) are never items. Classic skips them,
 * and so do the scheduler, Progress, experiments and the attempt log, which read only `item` blocks.
 */
export type Block =
  | { kind: 'section'; title: string }
  | { kind: 'prose'; html: string }
  | { kind: 'item'; item: Item }
  | { kind: 'check'; check: Check }
  | { kind: 'predict'; predict: Predict }
  | { kind: 'decide'; decide: Decide }
  | { kind: 'visual'; visual: Visual }
  | { kind: 'points'; points: Points }
  /** A "```sure" block: the audit detail behind a "How sure is this?" tap. Every flow shows it, Classic included. */
  | { kind: 'sure'; html: string }
  | { kind: 'break' };

export interface Source {
  cite: string;
  /** Always an https link (the build fails otherwise). */
  url: string;
  grade?: string;
  /** Credibility tier: 1 peer-reviewed, 2 preprint or report, 3 studio's own data report. */
  tier: 1 | 2 | 3;
  note?: string;
  /** How far the source was read, for example "full text" or "abstract only". */
  read?: string;
  /** One short sentence on what limits the source. */
  caveat?: string;
}

export interface Lesson {
  id: string;
  slug: string;
  file: string;
  title: string;
  order: number;
  status: string;
  /** YYYY-MM-DD of the last passed source check (AGENTS.md, "Checking a lesson"); absent when unchecked. */
  checked?: string;
  /** GitHub link to the claim ledger, set when courses/<folder>/ledgers/<file> exists. */
  ledgerUrl?: string;
  sources: Source[];
  blocks: Block[];
  itemIds: string[];
}

export interface Placement {
  id: string;
  file: string;
  title: string;
  status: string;
  blocks: Block[];
  itemIds: string[];
}

export interface Course {
  id: string;
  folder: string;
  title: string;
  version: string;
  status: string;
  /** course.md body rendered to HTML, with links to lesson files rewritten to app routes. */
  html: string;
  lessons: Lesson[];
  /**
   * How many lessons the course page plans in all ("lessons_planned" in course.md front matter).
   * A placement item may point at a planned lesson number that has no file yet. Absent means
   * every placement item must point at a lesson that exists.
   */
  lessonsPlanned?: number;
  placement?: Placement;
}

export interface CourseData {
  builtAt: string;
  courses: Course[];
}
