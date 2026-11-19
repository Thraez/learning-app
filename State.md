# State

**Updated:** 2026-11-19

## Goal

A personal micro-learning phone app (spec: `Workspace/Inbox/claude - Learning App Purpose.md`). An offline phone web
app, two courses, recall, scenario and "why" questions, a review scheduler, and a manual export of every answer so
Claude can revise the course. The goal is learning that lasts weeks.

## Where it stands

- Repo `Thraez/learning-app`, public. Live at https://thraez.github.io/learning-app/ from `main`. PRs #1 to #12 and
  #14 to #16 are merged; #13 was closed as superseded by #15.
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
  - **#16, lesson rewrite** (18 Nov): the user did course 1 lessons 1 to 4 and said they were not fun and
    read like a questionnaire. "The idea" in those four lessons is rewritten to one idea per screen in plain words,
    with what it means for a designer first. The audit detail (p-values, table against text, what a paper does not
    print) moved behind a "How sure is this?" tap, a new `sure` block that works in all four styles. Stepped is now
    the style a phone with no stored choice runs; a stored choice wins and Classic stays selectable (course 0.3.6).
    The rule for what goes on the main screen and what goes behind the tap is in `AGENTS.md`.
    Fresh checkers held every changed sentence against the sources, under a stricter bar than before: wording
    that says slightly more than the paper fails. They found 12, 9, 8 and 8 such wordings in lessons 1 to 4, some
    carried over from the old text. All were fixed and the fixes rechecked by further fresh contexts, up to four
    rounds for lesson 3. All four lessons carry `checked: 2026-11-18` again. Lessons 5 to 12 carry `checked: 2026-11-18` from
    the earlier pass that day, under the looser bar, so expect the same kind of findings when they are rewritten.
  - **Design pass** (#17, 19 Nov): one look for the whole app, in `src/` only; no lesson text changed. Each
    course has its own accent colour (set by course id in `src/main.ts`, values in `src/style.css`), headings use a
    serif system font, and nothing is loaded from the network. A lesson shows a segmented progress bar next to the
    count and shrinks its title after the first screen. Right and wrong carry an icon and a tint, the slider and the
    guess-against-figure reveal are redrawn, pictures have larger text, and Home, the course page, Progress and the
    finish card are laid out again. Screens fade in over 0.2 s unless the phone asks for reduced motion. The bottom
    nav is on every top-level screen. Fixed: About overflowing sideways, the nav clipping at 360 px, Export's
    buttons outside their row, and Home offering the placement quiz to a course with a finished lesson.
  - **A reason to return** (19 Nov, this change): `src/` only, no lesson text and no new stored data. Home opens
    on a Today card: the reviews due now in each course, then one new lesson from the course studied last, and a
    line for what was done today. Every item has a stage from its own answers: New, Read, Answered, then right
    after a gap of a day, a week, two weeks. A miss sends it back to Answered. The stages show from the first
    lesson as counts on Home and Progress, and a finished review says how many items moved. Progress has a map:
    one row per lesson, one mark per item, and "Explained" when the last answer to each why and scenario question
    was marked right. No streaks, points or day counts. The rules are `stageOf`, `courseMap` and `todayPlan` in
    `src/scheduler.ts`.
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
- Lesson styles and the design pass were walked in a desktop Chromium at 375 px (and the nav at 360 and 320 px),
  never on a phone and never in Safari. The serif heading font differs by phone, since it is whatever the phone has.
- The Today card, stages and map were walked the same way, with the clock moved 6 and then 36 days on. Not walked:
  two courses with reviews due at once, the Read stage's look, and a real phone. The stage marks use
  `conic-gradient`, untested in Safari.
- A Classic lesson was not walked to its end after the design pass, and lessons 6 to 12 were not walked at all.

## Waiting on the user

1. Redo lessons 1 to 4 of course 1 in the new text and say whether they read better than before.

## Next (the map the user saw on 18 Nov; M1 to M3 are done, M4 and M5 remain)

- M4: the plain style for the other 13 lessons, after the user says whether lessons 1 to 4 read better. M5: a
  course-level check for reviews, replications and contrary results, then the debts under "Could not verify".
- Not decided: Stepped, Predict first and Case first have no "try the missed items again" step; Classic and reviews do.

- Blocks and the new text style for the other 13 lessons (course 1 lessons 5 to 12, course 2 lessons 1, 2, 4, 5).
- An interest interview with the user: `Workspace/Learning/Interest Profile.md` is mostly blank.
- Course 2 lessons 6 to 12, written in the new style from the start.
- First export and the first course revision from it. A real phone check.
- A dead-link check on pull requests is not built; the build checks only that a link is present and `https`.

## Open questions

- Should new lessons be read seated and reviews done in transit (finding 10, grade C for that step)?
