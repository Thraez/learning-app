# Learning app: rules for coding agents

Shared by Claude Code and Codex. Claude loads it through `CLAUDE.md`; Codex reads it directly.

## Purpose

A personal micro-learning phone app. Claude and the user design a course together, Claude writes the lessons, the
user studies them on the phone in short sessions, exports the results, and Claude reads the export and revises the
course. The goal is learning that lasts weeks, not passing a test. The spec is the Workspace note
`Workspace/Inbox/claude - Learning App Purpose.md`; the evidence behind it is
`Workspace/Inbox/claude - Learning Science for a Learning App.md` (finding numbers below refer to it).

No app code exists yet. Building the app, choosing a host, adding a remote and any scheduled task each need the user's
yes first.

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
4. **Stable item IDs.** Every quiz item, opening question, "why" prompt, scenario and recall question has an ID of the
   form `<course-id>/<lesson-slug>/<item>` (for example `gd-econ/endowment/r2`). IDs never depend on lesson order,
   are never reused, and are never renumbered. A revision may add, retire or edit items; a retired ID stays retired.
5. **Courses are versioned.** Each course page has front matter with `id`, `version`, `status` (`draft`, `active`,
   `retired`). Change the version on every revision and log what changed in the course page.
6. **Phone-readable Markdown.** Answers sit in `<details>` blocks. Inside a block, write plain sentences only (no
   lists, bold or tables), and leave a blank line after `</summary>`, so both Obsidian and GitHub render it.

## Folder layout

| Path | Holds |
|---|---|
| `AGENTS.md` | these rules |
| `CLAUDE.md` | imports `AGENTS.md` |
| `State.md` | current state and next steps; overwrite it, keep it to a page |
| `courses/<course-folder>/course.md` | one-page course draft: direction, questions, concept map, lesson list, sources, change log |
| `courses/<course-folder>/placement-quiz.md` | placement quiz, each item mapped to a lesson |
| `courses/<course-folder>/lessons/NN-<slug>.md` | one lesson per file; the `NN` prefix is reading order only, the ID is in the front matter |

## Lesson file format

Front matter: `id`, `course`, `title`, `order`, `status`, `sources` (each with `cite`, `url`, `grade`).
Then one `## ` heading per section, in this order: `Opening question`, `The idea`, `Why`, `Scenario`, `Recall`,
`Sources and grades`. Each answerable item starts with a `### ` heading of the form `### <id> · <type>`, where type is
`open`, `why`, `scenario` or `recall`, followed by the prompt and a `<details>` answer. The future app parses these
headings, so keep the pattern exact.
