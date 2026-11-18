// Parser tests. The first block runs against the real files in courses/, so a lesson written in
// a format the app can't read fails CI on its pull request. The checks are invariants and
// minimums, not exact counts, so new lessons don't break them.

import { describe, expect, it } from 'vitest';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { parseCourses, CourseFormatError } from '../src/build/parse-courses';

const COURSES = process.env.COURSES_DIR ?? resolve(import.meta.dirname, '../courses');
const data = parseCourses(COURSES);

describe('real course files', () => {
  it('finds the game economy course', () => {
    const c = data.courses.find((x) => x.id === 'gd-econ');
    expect(c).toBeDefined();
    expect(c!.version).toMatch(/^\d+\.\d+\.\d+$/);
    expect(c!.lessons.length).toBeGreaterThanOrEqual(6);
    expect(c!.placement?.itemIds.length).toBeGreaterThanOrEqual(12);
  });

  for (const c of data.courses) {
    describe(c.id, () => {
      it('has lessons in order with matching ids', () => {
        const orders = c.lessons.map((l) => l.order);
        expect(orders).toEqual([...orders].sort((a, b) => a - b));
        for (const l of c.lessons) expect(l.id).toBe(`${c.id}/${l.slug}`);
      });

      for (const l of c.lessons) {
        it(`${l.slug}: has the lesson shape`, () => {
          const sections = l.blocks.flatMap((b) => (b.kind === 'section' ? [b.title] : []));
          expect(sections).toEqual(['Opening question', 'The idea', 'Why', 'Scenario', 'Recall', 'Sources and grades']);
          const items = l.blocks.flatMap((b) => (b.kind === 'item' ? [b.item] : []));
          const types = items.map((it) => it.type);
          expect(types).toContain('open');
          expect(types).toContain('why');
          expect(types).toContain('scenario');
          expect(types).toContain('recall');
          for (const it of items) {
            expect(it.id.startsWith(l.id + '/')).toBe(true);
            expect(it.promptHtml.length).toBeGreaterThan(10);
            expect(it.answerHtml.length).toBeGreaterThan(5);
            expect(it.answerHtml).not.toMatch(/<\/?details|<summary/i);
          }
          expect(l.sources.length).toBeGreaterThanOrEqual(1);
          for (const s of l.sources) {
            expect([1, 2, 3]).toContain(s.tier);
            expect(s.url).toMatch(/^https:\/\//);
          }
        });
      }

      if (c.placement) {
        it('placement items each point at an existing or a planned lesson', () => {
          const orders = new Set(c.lessons.map((l) => l.order));
          const items = c.placement!.blocks.flatMap((b) => (b.kind === 'item' ? [b.item] : []));
          for (const it of items) {
            const n = it.targetLessonOrder;
            expect(n, it.id).toBeDefined();
            const planned = c.lessonsPlanned !== undefined && n! >= 1 && n! <= c.lessonsPlanned;
            expect(orders.has(n!) || planned, it.id).toBe(true);
          }
        });
      }

      it('rewrites links to lesson files into app routes', () => {
        if (c.id === 'gd-econ') expect(c.html).toContain('#/lesson/');
        expect(c.html).not.toMatch(/href="lessons\//);
      });
    });
  }
});

describe('format errors fail the build', () => {
  const lesson = (body: string) => `---\nid: t/a\ncourse: t\ntitle: A\norder: 1\n---\n${body}`;
  function build(lessonText: string) {
    const root = mkdtempSync(join(tmpdir(), 'courses-'));
    mkdirSync(join(root, 't', 'lessons'), { recursive: true });
    writeFileSync(join(root, 't', 'course.md'), '---\nid: t\ntitle: T\nversion: 0.1.0\nstatus: draft\n---\nHi\n');
    writeFileSync(join(root, 't', 'lessons', '01-a.md'), lessonText);
    return () => parseCourses(root);
  }

  it('accepts CRLF line endings', () => {
    const text = lesson('## Recall\n\n### t/a/r1 · recall\n\nQ?\n\n<details>\n<summary>Answer</summary>\nA.\n</details>\n').replace(/\n/g, '\r\n');
    const d = build(text)();
    expect(d.courses[0].lessons[0].itemIds).toEqual(['t/a/r1']);
  });
  it('rejects a missing answer block', () => {
    expect(build(lesson('### t/a/r1 · recall\n\nQ?\n'))).toThrow(CourseFormatError);
  });
  it('rejects an unknown type', () => {
    expect(build(lesson('### t/a/r1 · quiz\n\nQ?\n<details>\nA\n</details>\n'))).toThrow(/unknown type/);
  });
  it('rejects an id outside its lesson', () => {
    expect(build(lesson('### t/b/r1 · recall\n\nQ?\n<details>\nA\n</details>\n'))).toThrow(/does not start/);
  });
  it('rejects duplicate ids', () => {
    const it2 = '### t/a/r1 · recall\n\nQ?\n<details>\nA\n</details>\n';
    expect(build(lesson(it2 + it2))).toThrow(/duplicate/);
  });
  it('rejects an orphan answer block', () => {
    expect(build(lesson('Some prose.\n<details>\nA\n</details>\n'))).toThrow(/outside an item/);
  });
  it('rejects a source without a valid tier', () => {
    const withSource = (extra: string) =>
      `---\nid: t/a\ncourse: t\ntitle: A\norder: 1\nsources:\n  - cite: "X"\n    url: https://doi.org/10.1/x\n    grade: A\n${extra}---\n## Recall\n`;
    expect(build(withSource(''))).toThrow(/tier/);
    expect(build(withSource('    tier: 4\n'))).toThrow(/tier/);
    expect(build(withSource('    tier: 1\n'))()).toBeTruthy();
  });
  it('rejects a source without an https link', () => {
    const withUrl = (urlLine: string) =>
      `---\nid: t/a\ncourse: t\ntitle: A\norder: 1\nsources:\n  - cite: "X"\n${urlLine}    grade: A\n    tier: 1\n---\n## Recall\n`;
    expect(build(withUrl(''))).toThrow(/https link/);
    expect(build(withUrl('    url: http://example.org/x\n'))).toThrow(/https link/);
    expect(build(withUrl('    url: doi.org/10.1/x\n'))).toThrow(/https link/);
    expect(build(withUrl('    url: https://doi.org/10.1/x\n'))().courses[0].lessons[0].sources[0].url).toBe('https://doi.org/10.1/x');
  });
  describe('placement targets', () => {
    const item = (n: string, tail: string) => `### t/placement/${n} · scenario\n\nQ?\n\n<details>\n<summary>Answer</summary>\nA. ${tail}\n</details>\n\n`;
    function buildCourse(courseExtra: string, quizBody: string, lessonOrder = 1) {
      const root = mkdtempSync(join(tmpdir(), 'courses-'));
      mkdirSync(join(root, 't', 'lessons'), { recursive: true });
      writeFileSync(join(root, 't', 'course.md'), `---\nid: t\ntitle: T\nversion: 0.1.0\nstatus: draft\n${courseExtra}---\nHi\n`);
      writeFileSync(join(root, 't', 'lessons', '01-a.md'), `---\nid: t/a\ncourse: t\ntitle: A\norder: ${lessonOrder}\n---\n## Recall\n`);
      writeFileSync(join(root, 't', 'placement-quiz.md'), `---\nid: t/placement\ncourse: t\ntitle: Placement quiz\n---\n${quizBody}`);
      return () => parseCourses(root);
    }
    it('accepts an existing lesson, and a planned one when the course declares lessons_planned', () => {
      const c = buildCourse('lessons_planned: 3\n', item('p01', 'Lesson 1.') + item('p02', 'Lesson 3.'))().courses[0];
      expect(c.lessonsPlanned).toBe(3);
      expect(c.placement!.itemIds).toEqual(['t/placement/p01', 't/placement/p02']);
    });
    it('rejects a lesson number above lessons_planned', () => {
      expect(buildCourse('lessons_planned: 3\n', item('p01', 'Lesson 4.'))).toThrow(/above "lessons_planned: 3"/);
      expect(buildCourse('lessons_planned: 3\n', item('p01', 'Lesson 0.'))).toThrow(/lessons_planned/);
    });
    it('rejects an answer that names no lesson number', () => {
      expect(buildCourse('lessons_planned: 3\n', item('p01', 'Lesson three.'))).toThrow(/must end with "Lesson N\."/);
      expect(buildCourse('lessons_planned: 3\n', item('p01', 'See the course page.'))).toThrow(/must end with "Lesson N\."/);
    });
    it('stays strict for a course without lessons_planned', () => {
      expect(buildCourse('', item('p01', 'Lesson 1.'))().courses[0].lessonsPlanned).toBeUndefined();
      expect(buildCourse('', item('p01', 'Lesson 2.'))).toThrow(/no lesson file/);
    });
    it('rejects a lessons_planned that is not a whole number, or is below an existing lesson', () => {
      for (const bad of ['twelve', '2.5', '"3"', '0']) {
        expect(buildCourse(`lessons_planned: ${bad}\n`, item('p01', 'Lesson 1.')), bad).toThrow(/whole number/);
      }
      expect(buildCourse('lessons_planned: 1\n', item('p01', 'Lesson 1.'), 2)).toThrow(/is below lesson 2/);
    });
  });

  it('reads a checked date and rejects a malformed one', () => {
    const withChecked = (line: string) => `---\nid: t/a\ncourse: t\ntitle: A\norder: 1\n${line}---\n## Recall\n`;
    expect(build(withChecked(''))().courses[0].lessons[0].checked).toBeUndefined();
    expect(build(withChecked('checked: 2026-11-16\n'))().courses[0].lessons[0].checked).toBe('2026-11-16');
    expect(build(withChecked('checked: yes\n'))).toThrow(/checked/);
  });
});

describe('trust fields', () => {
  const src = (extra: string) =>
    `---\nid: t/a\ncourse: t\ntitle: A\norder: 1\nsources:\n  - cite: "Smith (2020). Title."\n    url: https://example.org/x\n    tier: 1\n${extra}---\n## Recall\n`;
  function build(lessonText: string, ledger?: string) {
    const root = mkdtempSync(join(tmpdir(), 'courses-'));
    mkdirSync(join(root, 't', 'lessons'), { recursive: true });
    writeFileSync(join(root, 't', 'course.md'), '---\nid: t\ntitle: T\nversion: 0.1.0\nstatus: draft\n---\nHi\n');
    writeFileSync(join(root, 't', 'lessons', '01-a.md'), lessonText);
    if (ledger) {
      mkdirSync(join(root, 't', 'ledgers'));
      writeFileSync(join(root, 't', 'ledgers', ledger), 'ledger\n');
    }
    return parseCourses(root).courses[0].lessons[0];
  }

  it('reads read and caveat, and leaves them undefined when absent', () => {
    const a = build(src('    read: full text\n    caveat: One study, one game.\n')).sources[0];
    expect(a.read).toBe('full text');
    expect(a.caveat).toBe('One study, one game.');
    const b = build(src('')).sources[0];
    expect(b.read).toBeUndefined();
    expect(b.caveat).toBeUndefined();
  });

  it('sets ledgerUrl only when the ledger file exists', () => {
    expect(build(src(''))).toMatchObject({ ledgerUrl: undefined });
    expect(build(src(''), '01-a.md').ledgerUrl).toBe('https://github.com/Thraez/learning-app/blob/main/courses/t/ledgers/01-a.md');
    expect(build(src(''), '02-b.md').ledgerUrl).toBeUndefined();
  });
});
