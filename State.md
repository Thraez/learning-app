# State

**Updated:** 2026-11-18 (evening)

## Goal

A personal micro-learning phone app (spec: `Workspace/Inbox/claude - Learning App Purpose.md`). An offline phone web
app, two courses, recall, scenario and "why" questions, a review scheduler, and a manual export of every answer so
Claude can revise the course. The goal is learning that lasts weeks.

## Where it stands

- Repo `Thraez/learning-app`, public. Live at https://thraez.github.io/learning-app/ from `main`. PRs #1 to #12, #14
  and #15 are merged; #13 was closed as superseded by #15.
- App: Vite and TypeScript, no UI framework, `ts-fsrs` for reviews. Offline after the first load, installable. Course
  list, lessons, placement quiz with a "where to start" summary, review sessions, self-marking, Progress (late recall
  at 14+ days), Export as JSON (`docs/export-schema.md`, schema 2 extended), restore from an export that only adds.
  Experiments L1 (recall or reread) and L11 (confidence before the answer) are on by default.
- Since #11, in order:
  - **#12** (16 Nov): course 1 placement quiz rewritten, one reasoning question per lesson (course 0.3.3).
  - **#14** (18 Nov): the source check shows on screen. Each lesson shows its check date, each source's tier, how far
    it was read and one caveat, under the title and on every answer card, with a link to the claim ledger. Lessons 1
    to 4 reworded where they sounded surer than their ledgers (course 0.3.4).
  - **#15** (18 Nov): three lesson styles besides Classic (Stepped, Predict first, Case first), one screen at a time,
    and the blocks they use: `check`, `predict`, `decide`, `visual`, `points`, chunk breaks. Blocks written for
    course 1 lessons 1 to 4 and course 2 lesson 3 (course 0.3.5). Taps on blocks are stored as responses, apart
    from attempts.
  - **Lesson rewrite** (18 Nov, this change): the user did course 1 lessons 1 to 4 and said they were not fun and
    read like a questionnaire. "The idea" in those four lessons is rewritten to one idea per screen in plain words,
    with what it means for a designer first. The audit detail (p-values, table against text, what a paper does not
    print) moved behind a "How sure is this?" tap, a new `sure` block that works in all four styles. Stepped is now
    the style a phone with no stored choice runs; a stored choice wins and Classic stays selectable (course 0.3.6).
    The rule for what goes on the main screen and what goes behind the tap is in `AGENTS.md`.
- Course 1, `status: draft`: `courses/game-economy-and-prediction/`, 12 lessons and a placement quiz, version 0.3.6.
  Every lesson has a claim ledger under `ledgers/`. Lessons 1 to 4 carry the interactive blocks and the new text;
  lessons 5 to 12 are in the older style and run as Stepped with their prose split at paragraphs.
- Course 2, `status: draft`: `courses/learning-how-to-learn/`, id `learn`. Lessons 1 to 5 written and checked, 12
  planned, a 14-item placement quiz. Only lesson 3 carries the interactive blocks.
- Private learner state (interest profile, exports) lives in the private vault at `Workspace/Learning/`, never here.
- Not checked on a real phone. The share-sheet export on iPhone is untested.

## Decided for the user

- 2026-11-16, under "I trust you with these decisions": L1 and L11 on by default, the check pipeline, course 2 as
  drafted, private state in `Workspace/Learning/`.
- 2026-11-16: the orchestrator may merge PRs without asking, after rerunning the checks and reading the diff.
- 2026-11-18: "Yes, start there" to rewriting the lesson text first, on the four lessons the user had tried.

Each is recorded where it applies (`AGENTS.md`, the course pages' change logs); say so and any of them changes.

## Could not verify

- Full texts not opened, so the lessons claim only what the abstracts say: Sifa 2015, Runge 2014, Drachen 2012,
  Ascarza 2018, Hadiji 2014, Close 2021 (course 1); Dunlosky 2013, Rawson 2022, the body of Latimier 2021 (course 2).
- Drachen 2014 (course 1, lesson 7) stays tier 2: the FDG 2013 conference pages would not open.
- Three review journals in course 2 are "tier 1 unverified": Annual Review of Psychology, Psychological Science in
  the Public Interest, Current Directions in Psychological Science.
- Lesson styles were walked in a desktop browser at phone width, never on a phone.

## Waiting on the user

1. Redo lessons 1 to 4 of course 1 in the new text and say whether they read better than before.

## Next (the map the user saw on 18 Nov)

- Blocks and the new text style for the other 13 lessons (course 1 lessons 5 to 12, course 2 lessons 1, 2, 4, 5).
- A "today" card and a visible knowledge map on the home screen; items shown maturing from day one.
- An interest interview with the user: `Workspace/Learning/Interest Profile.md` is mostly blank.
- Course 2 lessons 6 to 12, written in the new style from the start.
- First export and the first course revision from it. A real phone check.
- A dead-link check on pull requests is not built; the build checks only that a link is present and `https`.

## Open questions

- Should new lessons be read seated and reviews done in transit (finding 10, grade C for that step)?
