# State

**Updated:** 2026-11-16

## Goal

A personal micro-learning phone app (spec: `Workspace/Inbox/claude - Learning App Purpose.md`). First version: an
offline phone web app, two courses, recall, scenario and "why" questions, a review scheduler, and a manual export of
every answer so Claude can revise the course.

## Where it stands

- Repo `Thraez/learning-app`, public, on GitHub. The app deploys to GitHub Pages:
  https://thraez.github.io/learning-app/ (live once the first app PR is merged to `main`).
- App v1 built (branch `claude/app-v1-405d61`): Vite and TypeScript, no UI framework, `ts-fsrs` for reviews. Works
  offline after the first load and can be installed to the home screen. Course list, lessons (later text stays hidden
  until the item above it is answered), placement quiz with a "where to start" summary, review sessions of up to 10
  due items, missed items asked again at the end of the session, self-marking (right, partly, wrong) with optional
  confidence, Progress (lessons finished, items learned, late recall at 14+ days), Export of the full history as JSON.
  Format: `docs/export-schema.md`.
- Checked in a desktop Chromium at phone size, under the `/learning-app/` subpath: lesson, review, placement, progress,
  export download, and offline reload. Not checked on a real phone; the share-sheet export on iPhone is untested.
- First course drafted, `status: draft`: `courses/game-economy-and-prediction/`, version 0.1.0, placement quiz and six
  lessons. Lessons 7 to 12 are being written in a separate session on its own branch.
- The second course (learning how to learn) is not written.

## Not in the app yet

- Variant support and the one-tap appeal rating after a session (in the approved first-version scope, left out of
  this build). Attempts and sessions already carry `variant: "default"`, so the export format won't need to change.
- Restore from an export file. If the phone's browser storage is lost, the history is lost except for past exports.

## Next steps

1. Merge the app PR (the user's yes), install on the phone, take the placement quiz and lesson 1.
2. First export after about a week; Claude revises the course from it.
3. Merge lessons 7 to 12; the next deploy shows them.
4. Design the learning-how-to-learn course with the user.
5. Decide whether to build variant support and the appeal rating next.

## Open questions

- Should new lessons be read seated and reviews done in transit (finding 10, grade C for that step)?
