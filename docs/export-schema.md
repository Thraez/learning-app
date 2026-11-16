# Export file schema

The Export screen writes one JSON file, `learning-export-YYYY-MM-DD-HHMM.json` (local time of the phone). It holds
every answer stored on the phone, never a summary, so delayed recall can be read from it. Exporting deletes nothing.
Code: `src/export.ts`. Raise `schemaVersion` on any change that breaks a reader, and update this page in the same
commit.

## Top level

| Field | Meaning |
|---|---|
| `schema` | always `"learning-app-export"` |
| `schemaVersion` | `1` |
| `exportedAt` | UTC time of the export, ISO 8601 |
| `appBuild` | build that wrote the file: short commit hash plus build time |
| `courses` | the courses in that build (below) |
| `sessions` | every session, oldest first (below) |
| `items` | one entry per item the user has answered at least once, sorted by ID (below) |

All times are UTC ISO 8601 strings.

## `courses[]`

The course structure as the exporting build knew it, so a reader can tell which items exist but were never answered.

| Field | Meaning |
|---|---|
| `courseId`, `version`, `status` | from the course page front matter |
| `lessons[]` | `lessonId`, `order`, `status`, `itemIds` (every item in the lesson, in reading order) |
| `placement` | `placementId` and `itemIds`, or `null` |

## `sessions[]`

| Field | Meaning |
|---|---|
| `sessionId` | random ID |
| `kind` | `lesson`, `placement` or `review` |
| `courseId`, `courseVersion` | course and its version when the session started |
| `targetId` | lesson or placement ID; empty for reviews |
| `startedAt` | time of the first mark in the session |
| `endedAt`, `completed` | set when the user pressed Finish; `null` and `false` if the app was left mid-session |
| `variant` | always `"default"` until variant support is built |
| `appBuild` | build in use |

A session starts at its first mark, so opening a lesson without answering anything leaves no session, unless the
user presses Finish.

## `items[]`

| Field | Meaning |
|---|---|
| `itemId` | stable item ID, `<course-id>/<lesson-slug>/<item>` |
| `courseId`, `parentId` | course, and the lesson or placement the item belongs to |
| `itemType` | `open`, `why`, `scenario` or `recall` |
| `inCurrentBuild` | `false` if the item is no longer in the course files (retired or renamed); its history is still exported |
| `firstAnsweredAt` | time of the first mark of any mode |
| `schedule` | the review scheduler's state for the item, or `null` for items it does not schedule (below) |
| `attempts[]` | every answer to the item, oldest first (below) |

### `schedule`

`due`, `state` (`New`, `Learning`, `Review`, `Relearning`), `stability`, `difficulty`, `reps`, `lapses`. Derived by
replaying the attempts through FSRS at export time, so it can always be recomputed from `attempts`.

### `attempts[]`

| Field | Meaning |
|---|---|
| `attemptId`, `sessionId` | random IDs; `sessionId` links to `sessions[]` |
| `mode` | `lesson` (first pass through a lesson), `placement`, `review` (scheduled review), or `retry` (a missed item asked again at the end of the same session) |
| `courseVersion` | course version the answer was given against |
| `shownAt` | when the question appeared |
| `revealedAt` | when the user opened the answer |
| `markedAt` | when the user marked it |
| `text` | what the user typed, trimmed; empty if nothing |
| `confidence` | `sure`, `unsure`, `guess`, or `null` if not picked |
| `mark` | the user's self-mark against the model answer: `right`, `partly` or `wrong` |
| `variant` | always `"default"` for now |
| `appBuild` | build in use |

## How the app uses the history

- **Scheduling.** Only lesson items of type `recall`, `why` and `scenario` are scheduled. Opening questions and placement
  items are pretests: recorded, never scheduled. Attempts with mode `lesson` or `review` feed FSRS (`ts-fsrs`,
  short-term steps off, no fuzz); `right` counts as Good, `partly` as Hard, `wrong` as Again. A missed item returns
  the next day at the earliest. `retry` attempts are recorded but not fed to the scheduler. A review session takes at
  most 10 due items.
- **Learned.** An item counts as learned when its latest `lesson` or `review` mark is `right`.
- **Late recall.** Answers with mode `lesson` or `review` given 14 or more days after the item's first such answer.
  Score: right 1, partly 0.5, wrong 0, averaged over those answers. Until an item is 14 days old the Progress screen
  says when the first one will be.

## Reading it at revision time

Items missed repeatedly: several `wrong` marks across sessions. Items right at first but forgotten later: `right` in
`lesson` mode, then `wrong` or `partly` in a `review` 14 or more days later. Scenarios where facts were known but the
choice was wrong: compare the same lesson's `recall` marks with its `scenario` mark and read the `text`.
