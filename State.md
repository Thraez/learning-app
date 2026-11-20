# State

**Updated:** 2026-11-20

## Goal

A personal micro-learning phone app (spec: `Workspace/Inbox/claude - Learning App Purpose.md`). An offline phone web
app, two courses, recall, scenario and "why" questions, a review scheduler, and a manual export of every answer so
Claude can revise the course. The goal is learning that lasts weeks.

## Where it stands

- Repo `Thraez/learning-app`, public. Live at https://thraez.github.io/learning-app/ from `main`. PRs #1 to #12 and
  #14 to #23 are merged; #13 was closed as superseded by #15.
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
  - **A reason to return** (#18, 19 Nov): `src/` only, no lesson text and no new stored data. Home opens
    on a Today card: the reviews due now in each course, then one new lesson from the course studied last, and a
    line for what was done today. Every item has a stage from its own answers: New, Read, Answered, then right
    after a gap of a day, a week, two weeks. A miss sends it back to Answered. The stages show from the first
    lesson as counts on Home and Progress, and a finished review says how many items moved. Progress has a map:
    one row per lesson, one mark per item, and "Explained" when the last answer to each why and scenario question
    was marked right. No streaks, points or day counts. The rules are `stageOf`, `courseMap` and `todayPlan` in
    `src/scheduler.ts`.
  - **Dead-link check** (#19, 19 Nov): every pull request opens the `url` of each source in the lesson
    front matter (`scripts/check-links.mjs`, `npm run links`). A 404 or 410 fails the PR; a blocked or timed-out
    link is listed apart and does not. Links inside lesson text are not checked, and a `doi.org` link is judged by
    whether the DOI is registered, not by the publisher's page.
  - **Visual tests** (#20, 19 Nov): `test/visuals.test.ts`, ten tests. Of the 13 tests dropped with PR #13,
    two were for a setting (L15) that no longer exists and six for block parsing that `test/flows.test.ts` covers
    now. The rest are back: the gap timeline's geometry and wording, and the spacing lesson's four rows. New: every
    visual block in both courses draws as one SVG with a description and stays inside its 320-wide frame.
  - **Missed items come back in every lesson style** (#22, 20 Nov, the user's yes): Stepped, Predict first
    and Case first now ask each item marked wrong once more before the lesson ends, as Classic and reviews do.
  - **Course-level check** (#21, 19 Nov): a ledger proves a lesson matches its paper, not that the paper
    is typical. For each lesson's main finding, a fresh context searched for reviews, replications and contrary
    results and wrote `courses/<course-folder>/ledgers/course-check.md`. Course 1: five findings stand alone
    (endowment, sinks, content usage, segments, simulation) and seven are supported, most with a qualifier. Course
    2: all five are supported, each with a limit. No lesson text changed; the edits the reports call for are listed
    under "Lesson edits from the course check" below.
  - **M4 part 1, lessons 5 to 8** (#23, 20 Nov): the user typed "please resume your work" to the top
    orchestrator, which is the go-ahead for M4 but not a verdict on lessons 1 to 4. Course 1 lessons 5 to 8 are
    rewritten in the plain style: one idea per screen, the designer's takeaway first and labelled as the lesson's
    own, audit detail behind the "How sure is this?" tap, with check, decide, predict, points and one visual block
    (course 0.3.7). The four course-check edits are in, each from its opened source. Three fresh rounds checked
    the text. Round one read each whole lesson and found 19, 21, 18 and 38 wordings that said more than the
    sources. Round two read each whole lesson again after the fixes and found 6, 1, 5 and 4. Round three read
    only the last fixes. All four lessons carry `checked: 2026-11-20`. Two titles changed because the old ones
    claimed more than the sources: lesson 5 is "Spend is mostly zero and can be very concentrated", lesson 8 is
    "Who does an offer change? Targeting by response and by churn risk". The clustering paper in lesson 7 is now
    tier 1: the FDG 2013 site lists it at pages 245 to 252 and its call for papers says peer-reviewed, with
    double-blind submissions. Placement answers for lessons 6, 7 and 8 were brought in line. No item ID changed.
- Course 1, `status: draft`: `courses/game-economy-and-prediction/`, 12 lessons and a placement quiz, version 0.3.7.
  Every lesson has a claim ledger under `ledgers/`. Lessons 1 to 8 carry the interactive blocks and the new text;
  lessons 9 to 12 are in the older style and run as Stepped with their prose split at paragraphs.
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
  Ascarza 2018, Hadiji 2014, Close 2021, and new on 20 Nov Zendle 2023, Li 2021 and Lemmens and Gupta 2020
  (course 1); Dunlosky 2013, Rawson 2022, the body of Latimier 2021 (course 2). Verhelst 2023 (lesson 8) was read
  at the abstract, introduction and section 2.2 only.
- Tier 1 in lessons 5 and 6 rests on the venue alone (a journal or a conference proceedings at Crossref); no
  venue's own review statement was opened, and the lessons say so. That includes the Zendle 2023 journal, whose
  ACM page refused automated access.
- Lesson 5: a checker read Chen 2018's Figure 3 off a log axis and could not square its whale counts with "around
  2% of all players". The lesson only says the paper does not connect the figure to the 2%; nobody has settled it.
- M4 part 1: only lesson 5 was walked in the preview (Stepped, 375 px, 16 screens, no console error), and that was
  before the wording fixes. Lessons 6 to 8 were not walked. Predict first and Case first were not walked for any.
- Three review journals in course 2 are "tier 1 unverified": Annual Review of Psychology, Psychological Science in
  the Public Interest, Current Directions in Psychological Science.
- Lesson styles and the design pass were walked in a desktop Chromium at 375 px (and the nav at 360 and 320 px),
  never on a phone and never in Safari. The serif heading font differs by phone, since it is whatever the phone has.
- The Today card, stages and map were walked the same way, with the clock moved 6 and then 36 days on. Not walked:
  two courses with reviews due at once, the Read stage's look, and a real phone. The stage marks use
  `conic-gradient`, untested in Safari.
- A Classic lesson was not walked to its end after the design pass, and lessons 9 to 12 were not walked at all.

- The course check read almost every outside source at the abstract only, and its "stands alone" verdicts rest on
  title scans of citing papers. The orchestrator sampled cited abstracts through OpenAlex. Course 1: five abstracts, every
  figure the report gives from them matched. Course 2: three abstracts matched on design and study counts only. The
  two course 2 findings that contradict a lesson (Yang 2021: a significant 0.321 on untested material, and no
  recall over recognition difference) come from a full text the report read on a third-party copy; the orchestrator
  could not open that text, so both are the report's claims, unconfirmed. Higham 2022's d = 0.705 and Palmer 2025
  were not rechecked either. Each report ends with its own "Could not open" list.

## Lesson edits from the course check

Made for course 1 lessons 5 to 8 on 20 Nov (M4 part 1); the rest are not made yet. They go in with the M4 rewrite
of each lesson, since an edit to a factual sentence removes `checked` and M4 rewrites the same files. Each new sentence needs its source opened and a ledger row from a fresh checker;
the report is a pointer to the source, never the source itself.

Course 1 (`courses/game-economy-and-prediction/ledgers/course-check.md`):

- 01 endowment: say no replication of a starting-grant test was found, so this is one test in one game.
- 02 sinks: say no other study of a sink's effect on prices was found and the preprint has no peer-reviewed version.
- 03 content usage: say no study of content usage in another game was found.
- 04 churn time: none.
- 05 spend skew (done 20 Nov): add that a study of 2,873 mobile games found spend concentration ranging from near uniform to
  extreme, so one game's figure, the 2% whale figure included, does not carry over.
- 06 predict vs act (done 20 Nov): say the free-currency null is one A/B test with no replication found, while a tested difficulty
  change in another game did raise retention.
- 07 segments (done 20 Nov): say the comparison has not been repeated by another group.
- 08 uplift (done 20 Nov): say uplift is not always better: a theory preprint finds conditions where targeting by risk wins, and a
  profit study adds that customer value and offer cost matter.
- 09 survival: say the model rankings come from single games.
- 10 simulation: say no study comparing such a simulation with real play was found.
- 11 EOMM: say later independent work points the same way, but EOMM's own figures remain simulation only.
- 12 vulnerable: say income also predicts loot box spend in one reanalysis, the link did not replicate in a Chinese
  sample, and the sources are cross-sectional self-report.

Course 2 (`courses/learning-how-to-learn/ledgers/course-check.md`):

- 01 fluency: say beliefs about what works, not only the feel of fluency, drive the misjudgments, and that the
  interleaving benefit shown with paintings reversed for words in a meta-analysis.
- 02 testing: say the recall over recognition advantage comes from mostly lab studies, and a classroom meta-analysis
  of 222 studies found no difference between recall and recognition quizzes.
- 03 spacing: may add that an independent classroom study found the same direction; the exact gaps have no outside
  replication.
- 04 relearning: say the evidence is nearly all from one lab, which found only a small gain for math procedures,
  and the one independent classroom study compared relearning with restudy, not with one-session drilling.
- 05 transfer: add the classroom meta-analysis's significant result for untested material, against the
  not-significant figure the lesson quotes.

## Waiting on the user

1. Redo lessons 1 to 4 of course 1 in the new text and say whether they read better than before.

## Next (the map the user saw on 18 Nov; M1 to M3 are done, M4 and M5 remain)

- M4: the plain style for the other lessons, with the lesson edits from the course check. Part 1 (course 1
  lessons 5 to 8) is done. Part 2 is course 1 lessons 9 to 12, part 3 is course 2 lessons 1 to 5, one PR each.
  The plain style is the working choice until the user says whether lessons 1 to 4 read better. M5 done so far: the dead-link check, the course-level check, the visual
  tests. M5 left: the debts under "Could not verify" and course 2 lessons 6 to 12.

- Blocks and the new text style for the other 9 lessons (course 1 lessons 9 to 12, course 2 lessons 1 to 5).
- An interest interview with the user: `Workspace/Learning/Interest Profile.md` is mostly blank.
- Course 2 lessons 6 to 12, written in the new style from the start.
- First export and the first course revision from it. A real phone check.

## Open questions

- Should new lessons be read seated and reviews done in transit (finding 10, grade C for that step)?
