# State

**Updated:** 2026-11-16

## Goal

A personal micro-learning phone app (spec: `Workspace/Inbox/claude - Learning App Purpose.md`). First version: an
offline phone web app, two courses, recall, scenario and "why" questions, a review scheduler, and a manual export of
every answer so Claude can revise the course.

## Where it stands

- Repo `Thraez/learning-app`, public, on GitHub. Live at https://thraez.github.io/learning-app/ (PRs #1 and #2
  merged).
- App v1: Vite and TypeScript, no UI framework, `ts-fsrs` for reviews. Works
  offline after the first load and can be installed to the home screen. Course list, lessons (later text stays hidden
  until the item above it is answered), placement quiz with a "where to start" summary, review sessions of up to 10
  due items, missed items asked again at the end of the session, self-marking (right, partly, wrong) with optional
  confidence, Progress (lessons finished, items learned, late recall at 14+ days), Export of the full history as JSON.
  Format: `docs/export-schema.md`.
- Checked in a desktop Chromium at phone size, under the `/learning-app/` subpath: lesson, review, placement, progress,
  export download, and offline reload. Not checked on a real phone; the share-sheet export on iPhone is untested.
- First course drafted, `status: draft`: `courses/game-economy-and-prediction/`, 12 lessons and a placement quiz.
  Version 0.3.0 (branch `claude/upbeat-chatelet-dea743`, PR open, not merged) applies the user's source standard,
  `AGENTS.md` rule 4: a credibility tier per source, inline DOI links, vendor and trade-press figures cut. Sources
  are tier 1 except lessons 2, 7 (one of two), 8 (two of three) and 10, labelled not peer-reviewed in the lesson.
- The second course (learning how to learn) is not written.

## Not in the app yet

- Variant support and the one-tap appeal rating after a session (in the approved first-version scope, left out of
  this build). Attempts and sessions already carry `variant: "default"`, so the export format won't need to change.
- Restore from an export file. If the phone's browser storage is lost, the history is lost except for past exports.

## Next steps

1. Review and merge the source credibility PR (the user's yes).
2. Install on the phone, take the placement quiz and lesson 1.
3. First export after about a week; Claude revises the course from it.
4. Design the learning-how-to-learn course with the user.
5. Decide whether to build variant support and the appeal rating next.

## Open questions

- Should new lessons be read seated and reviews done in transit (finding 10, grade C for that step)?
