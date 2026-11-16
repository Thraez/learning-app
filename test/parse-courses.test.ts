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
        });
      }

      if (c.placement) {
        it('placement items each point at an existing lesson', () => {
          const orders = new Set(c.lessons.map((l) => l.order));
          const items = c.placement!.blocks.flatMap((b) => (b.kind === 'item' ? [b.item] : []));
          for (const it of items) {
            expect(it.targetLessonOrder, it.id).toBeDefined();
            expect(orders.has(it.targetLessonOrder!), it.id).toBe(true);
          }
        });
      }

      it('rewrites links to lesson files into app routes', () => {
        expect(c.html).toContain('#/lesson/');
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
});
