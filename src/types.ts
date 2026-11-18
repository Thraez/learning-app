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

export type Block =
  | { kind: 'section'; title: string }
  | { kind: 'prose'; html: string }
  | { kind: 'item'; item: Item };

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
