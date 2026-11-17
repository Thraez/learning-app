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

/** One row of a "gap-timeline" visual: a test delay, the best review gap tested for it, and that gap as a share of the delay. */
export interface GapRow {
  /** Days from the review to the final test. */
  delay: number;
  /** Days from first study to the review. */
  gap: number;
  /** The gap as a whole-number percentage of the delay, as the lesson states it. */
  share: number;
}

/** The pictures the app can draw. A new kind needs a renderer in src/visuals.ts and an entry in the parser's list. */
export type VisualKind = 'gap-timeline';

/**
 * A picture the app draws from data in the lesson file (a "```visual" block). It has a stable id
 * like an item, but nothing is answered, so it leaves no attempt. The app shows it only when the
 * whole-app setting L15 is on; otherwise the lesson reads as if the block were not there.
 */
export interface Visual {
  id: string;
  kind: VisualKind;
  parentId: string;
  title: string;
  /** One plain sentence saying what the picture shows; also its text for screen readers. */
  text: string;
  rows: GapRow[];
}

export type Block =
  | { kind: 'section'; title: string }
  | { kind: 'prose'; html: string }
  | { kind: 'item'; item: Item }
  | { kind: 'visual'; visual: Visual };

export interface Source {
  cite: string;
  /** Always an https link (the build fails otherwise). */
  url: string;
  grade?: string;
  /** Credibility tier: 1 peer-reviewed, 2 preprint or report, 3 studio's own data report. */
  tier: 1 | 2 | 3;
  note?: string;
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
  sources: Source[];
  blocks: Block[];
  itemIds: string[];
  /** Ids of the lesson's visuals, in order. Empty for most lessons. */
  visualIds: string[];
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
