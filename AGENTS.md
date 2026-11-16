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
   filling the gap. Never invent a number.
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
   games where the source does.
5. **Stable item IDs.** Every quiz item, opening question, "why" prompt, scenario and recall question has an ID of the
   form `<course-id>/<lesson-slug>/<item>` (for example `gd-econ/endowment/r2`). IDs never depend on lesson order,
   are never reused, and are never renumbered. A revision may add, retire or edit items; a retired ID stays retired.
6. **Courses are versioned.** Each course page has front matter with `id`, `version`, `status` (`draft`, `active`,
   `retired`). Change the version on every revision and log what changed in the course page.
7. **Phone-readable Markdown.** Answers sit in `<details>` blocks. Inside a block, write plain sentences only (no
   lists, bold or tables), and put no blank lines inside the block, since Obsidian ends an HTML block at a blank line.

## Folder layout

| Path | Holds |
|---|---|
| `AGENTS.md` | these rules |
| `CLAUDE.md` | imports `AGENTS.md` |
| `State.md` | current state and next steps; overwrite it, keep it to a page |
| `courses/<course-folder>/course.md` | one-page course draft: direction, questions, concept map, lesson list, sources, change log |
| `courses/<course-folder>/placement-quiz.md` | placement quiz, each item mapped to a lesson |
| `courses/<course-folder>/lessons/NN-<slug>.md` | one lesson per file; the `NN` prefix is reading order only, the ID is in the front matter |
| `src/` | the app: `main.ts` (screens), `store.ts` (answers on the phone), `scheduler.ts` (review schedule, progress), `export.ts` |
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
outside its lesson, a duplicate ID, a missing `<details>` answer, or an answer block with no item heading. Run
`npm test` before committing course files. Placement answers end with "Lesson N." so the app can map each item to a
lesson; the test checks that every placement item does. The app keys every stored answer by item ID, which is why rule
4 matters: a renamed ID splits an item's history in two.

## Lesson file format

Front matter: `id`, `course`, `title`, `order`, `status`, `sources` (each with `cite`, `url`, `grade`, `tier`; `tier` is 1, 2 or 3 and the build fails without it, and `note` is optional).
Then one `## ` heading per section, in this order: `Opening question`, `The idea`, `Why`, `Scenario`, `Recall`,
`Sources and grades`. Each answerable item starts with a `### ` heading of the form `### <id> · <type>`, where type is
`open`, `why`, `scenario` or `recall`, followed by the prompt and a `<details>` answer. The future app parses these
headings, so keep the pattern exact.
