# State

**Updated:** 2026-11-16 (night)

## Goal

A personal micro-learning phone app (spec: `Workspace/Inbox/claude - Learning App Purpose.md`). First version: an
offline phone web app, two courses, recall, scenario and "why" questions, a review scheduler, and a manual export of
every answer so Claude can revise the course.

## Where it stands

- Repo `Thraez/learning-app`, public. Live at https://thraez.github.io/learning-app/ from `main` at b7216aa (PRs #1
  to #4 and #6 to #9 merged).
- App on `main`: Vite and TypeScript, no UI framework, `ts-fsrs` for reviews. Offline after the first load,
  installable. Course list, lessons, placement quiz with a "where to start" summary, review sessions, self-marking,
  Progress (late recall at 14+ days), Export as JSON (`docs/export-schema.md`, schema 2), restore from an export that
  only adds. Experiments L1 (recall or reread) and L11 (confidence before the answer) are on by default; a stored
  setting still wins. Not built: streak, points, progress display, story and cue variants.
- Lesson check pipeline on `main` (`AGENTS.md`, "Checking a lesson"): writer and checker are never the same context,
  a claim ledger per lesson, `checked: <date>` in a lesson's front matter once every row passes.
- Course 1 on `main`, `status: draft`: `courses/game-economy-and-prediction/`, 12 lessons and a placement quiz,
  version 0.3.1 (lessons 2 and 5 fixed from the pilot). No lesson is marked checked on `main` yet; that is PR #10.
- Private learner state (interest profile, exports) lives in the private vault at `Workspace/Learning/`, never here.
  That folder is committed locally in the Workspace repo and not pushed.
- Not checked on a real phone. The share-sheet export on iPhone is untested. No note shows the app has been used yet.

## Open pull requests (a merge deploys)

- **PR #10, game economy check (course 0.3.2).** All 12 lessons checked against their sources, with a ledger each;
  every row is `matches` or `inference`, so all 12 carry `checked: 2026-11-16`. Fixes in ten lessons, no item ID
  changed. Tests, build and dash grep pass. It was meant to be merged under the user's delegation, but the merge
  command was refused by Claude Code's permission check, so the user merges it.
- **PR #5, course 2 (learning how to learn, id `learn`, 0.2.0).** Lessons 1 to 5 written and checked, 12 planned, a
  14-item placement quiz. `course.md` declares `lessons_planned: 12`, so the quiz may point at lessons 6 to 11 before
  they exist; the app shows those as planned and never recommends starting there. The user merges this one. Lesson
  slugs, placement IDs and "Lesson N." numbers are permanent once it is merged and used.

## Decided for the user (2026-11-16, under "I trust you with these decisions")

L1 and L11 on by default. The pipeline adopted. Lessons 2 and 5 fixed, then all twelve checked. Course 2 approved as
drafted, with no memory-mechanics lesson and motivation kept as an app decision. Private state in `Workspace/Learning/`.
Each is recorded where it applies (`AGENTS.md`, the course pages' change logs); say so and any of them changes.

## Could not verify

- Full texts not opened, so the lessons claim only what the abstracts say: Sifa 2015, Runge 2014, Drachen 2012,
  Ascarza 2018, Hadiji 2014, Close 2021 (course 1); Dunlosky 2013, Rawson 2022, the body of Latimier 2021 (course 2).
- Drachen 2014 (course 1, lesson 7) stays tier 2: the FDG 2013 conference pages would not open.
- Three review journals in course 2 are "tier 1 unverified": Annual Review of Psychology, Psychological Science in
  the Public Interest, Current Directions in Psychological Science. Opening each journal's policy page settles it.

## Waiting on the user

1. Merge PR #10 and PR #5, or ask for changes.
2. Install the app, take a placement quiz and lesson 1. Nothing can be judged until late-recall data exists.

## Next

- Course 2, lessons 6 to 12, under the same pipeline.
- A dead-link check on pull requests is not built; the build checks only that a link is present and `https`.

## Open questions

- Should new lessons be read seated and reviews done in transit (finding 10, grade C for that step)?
