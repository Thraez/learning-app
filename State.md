# State

**Updated:** 2026-11-16 (evening)

## Goal

A personal micro-learning phone app (spec: `Workspace/Inbox/claude - Learning App Purpose.md`). First version: an
offline phone web app, two courses, recall, scenario and "why" questions, a review scheduler, and a manual export of
every answer so Claude can revise the course.

## Where it stands

- Repo `Thraez/learning-app`, public. Live at https://thraez.github.io/learning-app/ from `main` at e881c3b (PRs #1,
  #2 and #3 merged).
- App v1 on `main`: Vite and TypeScript, no UI framework, `ts-fsrs` for reviews. Offline after the first load,
  installable. Course list, lessons, placement quiz with a "where to start" summary, review sessions of up to 10 due
  items, self-marking with optional confidence, Progress (late recall at 14+ days), Export as JSON
  (`docs/export-schema.md`).
- First course on `main`, `status: draft`: `courses/game-economy-and-prediction/`, 12 lessons and a placement quiz,
  version 0.3.0, with the source standard of `AGENTS.md` rule 4 applied.
- Not checked on a real phone. The share-sheet export on iPhone is untested. No note shows the app has been used yet.

## Open pull requests (each merge is the user's yes; a merge deploys)

- **PR #4, variants, appeal rating, settings, restore from export.** Per-item experiments L1 (recall or reread) and
  L11 (confidence before the answer), both switched off until turned on in Settings; review session length (5, 10,
  all due) as the one whole-app variant; a one-tap rating at the end of a session; restore that only adds, never
  overwrites. Export schema goes to version 2 and restore reads 1 and 2. Old stored answers still load. Rechecked by
  the orchestrator: 40 tests pass, build passes, dash grep clean, old-format data loads at phone size. Not built:
  streak, points, progress display, story and cue variants. Restore was not in the approved scope; it is a guard
  against data loss. Known gap: for a reread item, Progress counts late recall from the first real answer, not the
  first read.
- **PR #5, course 2 draft (learning how to learn).** `course.md` (id `learn`, 0.1.0, a 12-lesson plan, 15 tier 1
  sources reopened) and a 14-item placement quiz. No lessons. One test line relaxed so a course with no lesson files
  passes. If merged before lessons exist, the live app shows the course with "0 of 0 lessons" and a placement summary
  that says "No concept items in this quiz", so merge it when the first lessons land or accept that. Placement item
  IDs and their "Lesson N." numbers are permanent once answered, so settle the lesson order before merging. Caveats
  from the worker: nine sources were read at abstract only, some through Crossref or Europe PMC records because the
  publisher blocked the fetch; Annual Review and Current Directions were given tier 1 without confirming their review
  process. Rechecked: 32 tests pass, build passes, dash grep clean, both files read, two abstracts (Cepeda 2008,
  Brunmair 2019) sampled against the numbers.

## Source check pilot (no repo change)

A fresh checker opened the sources of lessons 02 and 05: 76 claims, 63 match, 7 differ, 5 not in source (3 of them
labelled grade C inferences), 1 could not open. No wrong number; the errors are wording and attribution, plus one
paper whose text and table disagree. Report: `Workspace/Inbox/claude - Learning App Source Check Pilot.md`. The
lessons are not yet fixed.

## Waiting on the user

1. Merge PR #4 and PR #5, or ask for changes.
2. Which per-item variants to switch on first (L1 and L11 are built).
3. The research pipeline and the "what to learn next" proposal:
   `Workspace/Inbox/claude - Learning App Pipeline and Next-Topic Proposal.md`. `AGENTS.md` rules 3 and 4 stay as
   they are until the user agrees.
4. Where private learner state (exports, interest profile) lives. Candidate: a folder in the private Workspace vault.
   Never in this public repo.
   Follow-up once PR #4 merges: add `variants.ts` and `restore.ts` to the `src/` row in `AGENTS.md`.
5. Whether to fix lessons 02 and 05 from the pilot's list now (version 0.3.1).
6. The open questions in the course 2 draft (`course.md`, "For you to decide").
7. Install the app, take the placement quiz and lesson 1. Nothing can be judged until late-recall data exists.

## Open questions

- Should new lessons be read seated and reviews done in transit (finding 10, grade C for that step)?
