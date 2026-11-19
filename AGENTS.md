# Learning app: rules for coding agents

Shared by Claude Code and Codex. Claude loads it through `CLAUDE.md`; Codex reads it directly.

## Purpose

A personal micro-learning phone app. Claude and the user design a course together, Claude writes the lessons, the
user studies them on the phone in short sessions, exports the results, and Claude reads the export and revises the
course. The goal is learning that lasts weeks, not passing a test. The spec is the Workspace note
`Workspace/Inbox/claude - Learning App Purpose.md`; the evidence behind it is
`Workspace/Inbox/claude - Learning Science for a Learning App.md` (finding numbers below refer to it).

The app is a static phone web app (PWA) in this repo, hosted on GitHub Pages from the public repo `Thraez/learning-app`
(the user's yes, 2026-11-16). Any scheduled task, a server, sign-in or a new host each need the user's yes first.

## Rules

1. **No em dashes or en dashes**, anywhere: courses, commits, notes. Rewrite with a colon, a comma or two sentences.
   Before each commit, grep for U+2014 and U+2013.
2. **Write the way the user does.** Plain words, short and varied sentences, the answer first. No praise, no filler,
   no exclamation marks. The user's global writing rules apply to everything here.
3. **Facts come from sources, never from memory.** Every lesson cites at least one source and grades it:
   - **A**: read in the paper's abstract or full text.
   - **B**: secondary summary only (press release, blog, slides, search digest), or a claim a paper states without a
     traced source.
   - **C**: Claude's inference, no direct study.
   Say plainly where the evidence is thin. Much game industry practice is unpublished; mark it as such instead of
   filling the gap. Never invent a number. Write only what the text you opened says: a claim that needs the full text
   when only the abstract was read is cut or worded as unverified. A grade is the writer's claim until the lesson has
   passed the check in "Checking a lesson" below.
4. **Only credible sources, linked at the claim** (the user's standard, 2026-11-16; decision 8 in the purpose note).
   The user's words: "I'm not learning some bullshit." Every source also gets a credibility tier, separate from the
   read grade above:
   - **Tier 1**: peer-reviewed journal or conference paper, or a systematic review.
   - **Tier 2**: preprint or technical report by named researchers at a university or studio research group. The
     lesson says "not peer-reviewed" where it uses one. An arXiv paper is tier 2 unless a published version with the
     same title and authors is found; then cite and link that version and say which text was read.
   - **Tier 3**: a studio's own data report or talk with its method shown, used only as "this studio reported X".
   - **Never the basis for a fact**: vendor press releases, marketing reports, blogs, slide decks, trade-press
     write-ups, unsourced numbers. A claim only such a source supports is cut, or worded as "a vendor claimed X".
   Every factual claim links inline, at the sentence, to the DOI or the publisher's page (arXiv for preprints), never a
   third-party mirror. Open the source before citing it; the PDF text beats a search summary. A number a paper states
   without its own data or reference gets grade B and says so. Where credible evidence is thin or mixed, the lesson
   says so in plain words. Each lesson opens on a real case or puzzle from a credible source, and scenarios name real
   games where the source does. Every source in the front matter has an `https` link in `url`; the build fails
   without one. A number is checked against the paper's tables as well as its text; where the two disagree, the
   lesson gives the paper's stated figure and says what the table implies.
5. **Stable item IDs.** Every quiz item, opening question, "why" prompt, scenario and recall question has an ID of the
   form `<course-id>/<lesson-slug>/<item>` (for example `gd-econ/endowment/r2`). IDs never depend on lesson order,
   are never reused, and are never renumbered. A revision may add, retire or edit items; a retired ID stays retired.
6. **Courses are versioned.** Each course page has front matter with `id`, `version`, `status` (`draft`, `active`,
   `retired`). Change the version on every revision and log what changed in the course page.
7. **Phone-readable Markdown.** Answers sit in `<details>` blocks. Inside a block, write plain sentences only (no
   lists, bold or tables), and put no blank lines inside the block, since Obsidian ends an HTML block at a blank line.

## Checking a lesson

Adopted 2026-11-16 after a pilot on lessons 02 and 05, where a fresh reader found seven wording and attribution
errors that the writer's own source pass had missed. The steps, in order:

1. **The writer and the checker are never the same context.** Whoever wrote or fixed a lesson cannot verify it, since
   they read the source with the claim already in mind. A fresh checker opens every linked source and checks every
   factual claim against the text. This is the one case where a worker is spawned to verify another's work.
2. **A claim ledger per lesson**, at `courses/<course-folder>/ledgers/NN-<slug>.md`, next to `lessons/`. It opens
   with a line saying how far each source was read (full text, abstract, which copy), then one table row per factual
   claim: the section or item ID, the claim in a few words, where in the source, a verdict and a note. Rows are keyed
   by section or item ID and never by line number, because line numbers go stale on the first edit. The verdicts are
   `matches`, `differs`, `not in source`, `could not open` and `inference` (the lesson's own grade C reasoning,
   labelled as such in the lesson).
3. **"Could not open" blocks a pass.** The claim is cut, reworded to what a readable text supports, or the user opens
   the paper and pastes the passage. A source read only at its abstract supports only what the abstract says.
4. **Numbers are checked against tables.** Where a paper gives a coefficient and a standard error, the checker redoes
   the arithmetic and says so in the note.
5. **Fixes are rechecked.** Whoever fixes a lesson opens the source for each fix, and the rows it touched are checked
   again by a context that did not make the fix.
6. **The orchestrator samples each report** against the sources before accepting it: a few `matches` rows, every
   finding it acts on, and one number redone from a table where the lesson has one.
7. **A lesson shows its check state.** When every row is `matches` or `inference`, the lesson's front matter gets
   `checked: YYYY-MM-DD`. A later edit to a factual sentence removes `checked` until its rows are rechecked. An edit
   to wording that carries no claim leaves it. A ledger is append-only: a later recheck row replaces the row it
   rechecks, so `checked` is judged on the latest row for each claim, and older `differs` rows stay as the record.
8. **The bar** (2026-11-18). Wording that says even slightly more than the source is `differs`, never `matches` with
   a caveat: a narrower "only" claim, a result that was not significant worded as no change, a judgment the paper
   does not make. The lesson's own reasoning is `inference` only when it is labelled as its own on the same screen;
   a check block is a screen of its own.

A ledger quotes papers, so it follows rule 1 like every other file: rewrite a range such as "5 to 9" in words.
Not built: a dead-link check on pull requests. The build checks that a link is present and `https`, not that it opens.

## Folder layout

| Path | Holds |
|---|---|
| `AGENTS.md` | these rules |
| `CLAUDE.md` | imports `AGENTS.md` |
| `State.md` | current state and next steps; overwrite it, keep it to a page |
| `courses/<course-folder>/course.md` | one-page course draft: direction, questions, concept map, lesson list, sources, change log |
| `courses/<course-folder>/placement-quiz.md` | placement quiz, each item mapped to a lesson |
| `courses/<course-folder>/lessons/NN-<slug>.md` | one lesson per file; the `NN` prefix is reading order only, the ID is in the front matter |
| `courses/<course-folder>/ledgers/NN-<slug>.md` | the claim ledger for the lesson of the same name; the app does not read it |
| `src/` | the app: `main.ts` (screens), `flows.ts` and `flow-screen.ts` (the one-screen-at-a-time lesson flows), `visuals.ts` (pictures drawn from lesson data), `trust.ts` (check date and source lines), `store.ts` (answers on the phone), `scheduler.ts` (review schedule, progress, item stages, the Today plan), `variants.ts` (experiments, whole-app settings), `placement.ts` (placement result), `export.ts`, `restore.ts` |
| `src/build/parse-courses.ts` | build-time parser that turns `courses/` into app data |
| `src/sw-template.js` | service worker; the build fills in the file list |
| `test/` | parser tests against the real course files, scheduler and export tests |
| `docs/export-schema.md` | the export file format; change it with `src/export.ts` |
| `public/` | web manifest and icons (`npm run icons` redraws the icons) |
| `.github/workflows/pages.yml` | tests and builds every PR; deploys `main` to GitHub Pages |

## Building the app

Node 20 or later. `npm ci`, then `npm test` (parser, scheduler, export), `npm run build` (writes `dist/`), and
`npm run dev` for a local server. A merge to `main` deploys to https://thraez.github.io/learning-app/ within a few
minutes; the phone picks it up the next time the app is opened online and shows a Reload bar.

The parser reads every `courses/*/course.md`, `placement-quiz.md` and `lessons/*.md` at build time, so a new lesson
needs no app change. It fails the build, with the file and the reason, on a broken item heading, an unknown type, an ID
outside its lesson, a duplicate ID, a missing `<details>` answer, an answer block with no item heading, a source
without a tier or an `https` link, or a `checked` value that is not a date. Run
`npm test` before committing course files. Placement answers end with "Lesson N." so the app can map each item to a
lesson, and the build fails on an item without one. N must be a lesson that has a file. A course whose later lessons
are planned but not written adds `lessons_planned: <count>` to its `course.md` front matter; N may then be any lesson
number up to that count, and the app shows such a lesson as planned and never recommends starting there. The app keys every stored answer by item ID, which is why rule
5 matters: a renamed ID splits an item's history in two.

## Lesson file format

Front matter: `id`, `course`, `title`, `order`, `status`, `sources` (each with `cite`, `url`, `grade`, `tier`; `tier` is 1, 2 or 3, `url` is an `https` link, the build fails without either, and `note` is optional), and
`checked` (a date, present only once the lesson has passed "Checking a lesson"). Each source also takes `read` (how far it
was read and from which copy, in a few words, taken from the ledger's opening lines) and `caveat` (one short sentence a
reader should hold next to the numbers: one study, one game, a preprint, the studio's own data). The app shows both,
with the tier and the check date, under the lesson title and on every answer card, so they are factual claims and the
checker covers them like any other sentence.
Then one `## ` heading per section, in this order: `Opening question`, `The idea`, `Why`, `Scenario`, `Recall`,
`Sources and grades`. Each answerable item starts with a `### ` heading of the form `### <id> · <type>`, where type is
`open`, `why`, `scenario` or `recall`, followed by the prompt and a `<details>` answer. The future app parses these
headings, so keep the pattern exact.

### Blocks for the lesson flows

A lesson may also hold blocks that only the non-Classic flows show. Classic, reviews, the scheduler, Progress and the
attempt log skip them, so adding one never changes what an existing item does. The one exception is `sure`, which
Classic shows too. Each is a fenced block whose info string is the kind and whose body is YAML (`sure` holds Markdown); the build fails on an unknown field or a broken rule.

- `check` (`id`, `prompt`, `options` of two or three, each with `text` and `why`, exactly one with `correct: true`): a
  tap question. Wrong options must be plausible and every `why` must teach, since a lure read without correction can
  be learned as a fact. Vary where the right option sits.
- `predict` (`id`, `prompt`, `unit`, `min`, `max`, `step`, `answer`, `answer_text`, `reveal`, `covers`, optional
  `visual`): the learner commits a number, then sees the real one. `covers` names a recall item of the same lesson
  whose answer holds the figure, because only items come back in reviews.
- `decide` (`id`, `prompt`, `options` of two or three, each with `text` and `outcome`, at most one `best: true`): choose
  first, then see what the source found for each choice. `best` only where the lesson's text supports it.
- `visual` (`id`, `kind`, `title`, `text`, then the kind's fields): `bars`, `dot-grid`, `spans`, `gap-timeline`. Every
  number is already in the lesson's prose; an invented example says so in its title or text.
- `points` (`for`, `points` of two to four): directly after a why or scenario item, the points a good answer makes.
- A line holding only `<!-- break -->`, with a blank line on each side, splits "The idea" into short screens.
- `sure`: the "How sure is this?" tap. The body is plain Markdown, not YAML, so its sentences keep their links, and it
  has no ID because nothing is stored. The app draws it as a closed `<details>` under the text it follows, in all
  four flows, Classic included. It holds what a reader needs to judge a figure but not to follow the lesson: p-values,
  where a paper's text and table disagree, what the paper does not print, which copy was read. Put it directly after
  the paragraph it qualifies, before any `visual` or `check`, so it lands on that paragraph's screen. Write no
  `<details>` inside it and no blank line that would split a sentence from its link.

IDs are `<lesson-id>/c1`, `p1`, `d1`, `v1` and follow rule 5: permanent, never reused. `predict` and `decide` go in
"Opening question" after the open item; `check`, `visual`, `sure` and breaks go in "The idea". A block restates what
the lesson's checked prose says, with the same labels (relative lift, this lesson's arithmetic, one game); a `sure`
block counts as the lesson's prose for this, so a figure may live there. It is a factual claim like any sentence: a
new or changed block removes `checked` until a fresh checker has a ledger row for it, keyed by the block ID, or for a
`sure` block by its section and first words. The flows (Classic, Stepped, Predict first, Case first) are the
whole-app setting `F`; Stepped is what a phone with no stored choice runs. Taps on these blocks are stored as
responses, apart from attempts (`docs/export-schema.md`).

### What goes on the main screen and what goes behind the tap

Adopted 2026-11-18, after the learner said lessons 1 to 4 read like a questionnaire. The source check had leaked
into the teaching text. The split:

- **Main screen**: one idea per screen in plain words, with what it means for a designer first. The verdict on every
  result stays here in plain words, because it changes what the learner believes: "too small to tell from chance" for
  a result that was not significant, "a relative rise, not percentage points", "one game", "not peer-reviewed", "a
  comparison, not a randomized test".
- **Behind the tap** (`sure`): the audit trail for that verdict. The p-values, the table against the text, what the
  paper does not print, how a figure was recomputed.
- Moving detail behind the tap never makes a claim stronger. A result that was not significant is never worded as
  "no change", and a designer takeaway the paper does not state is labelled as the lesson's own reasoning (grade C).
- Every figure that an item answer or a block uses is still stated on a main screen or in the answer itself.
