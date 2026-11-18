# Export file schema

The Export screen writes one JSON file, `learning-export-YYYY-MM-DD-HHMM.json` (local time of the phone). It holds
every answer stored on the phone, never a summary, so delayed recall can be read from it. Exporting deletes nothing.
Code: `src/export.ts`. Raise `schemaVersion` on any change that breaks a reader, and update this page in the same
commit.

## Top level

| Field | Meaning |
|---|---|
| `schema` | always `"learning-app-export"` |
| `schemaVersion` | `2`. Version 1 files (before variants) still restore; see Version history |
| `exportedAt` | UTC time of the export, ISO 8601 |
| `appBuild` | build that wrote the file: short commit hash plus build time |
| `courses` | the courses in that build (below) |
| `sessions` | every session, oldest first (below) |
| `assignments` | the arm each item was given in each experiment, `{ [itemId]: { [experimentId]: { arm, assignedAt } } }`; `{}` if none |
| `settings` | the Settings screen state `{ experiments, whole }` (below), or `null` if the user never changed one, which means the defaults (experiments on) |
| `responses` | taps on checks, predictions and decisions in the Stepped, Predict and Case lesson flows, oldest first (below); `[]` if none. Absent in files written before the flows, which still restore |
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
| `variant` | `"default"` when no variant applied, else the active whole-app variants as sorted `id=value` pairs joined by `;` (for example `"E6=short"`) |
| `variants` | the same as an object, for example `{ "E6": "short" }`; `{}` when none (old records have no field and read as `{}`) |
| `appeal` | the end-of-session rating: `liked`, `neutral`, `disliked`, or `null` if skipped |
| `appealAt` | when it was last set, or `null` |
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
| `confidence` | `sure`, `unsure`, `guess`, or `null` if not picked (always `null` in the L11 `none` arm and for read exposures) |
| `mark` | the user's self-mark against the model answer: `right`, `partly` or `wrong`; `null` for a read exposure |
| `exposure` | `answered` (the learner was asked) or `read` (L1 reread arm: prompt and answer shown together, one "Read it" tap, no mark). Records saved before version 2 have no field and count as `answered` |
| `variant` | `"default"` when nothing applies, else the item's arms for experiments that were on plus active whole-app variants, sorted by id and joined by `;`, for example `"L1=reread;L11=ask"` |
| `variants` | the same pairs as an object, for example `{ "L1": "reread", "L11": "ask" }`; `{}` for old records |
| `appBuild` | build in use |

## Experiments, settings and assignments

Experiments are on by default and can be switched off in Settings (before 2026-11-16 they were off by default).
In `settings.experiments` a missing key means on and only `false` means off, so `settings: null` means the
defaults: both experiments on, review length `standard`. An answer's own `variant` field always records what applied
when it was given. An item gets one arm of an experiment once, at random
(balanced within its lesson), and keeps it.

| Experiment | Eligible items | Arms |
|---|---|---|
| `L1` | `recall` items, lesson mode only | `recall` (asked, as before) or `reread` (answer shown with the prompt, one "Read it" tap). Review and retry always ask |
| `L11` | every lesson item, every mode (not placement) | `ask` (confidence must be picked before the answer shows) or `none` (no confidence control) |

`settings` is `{ "experiments": { "L1": true }, "whole": { "E6": { "value", "since", "until" } } }`. `E6` is the review
session length: `short` (5 items), `standard` (10, the default) or `open` (all due). `since` is when the value was set
(ISO 8601); `until` is the last day it applies (`YYYY-MM-DD`) or `null`, after which `standard` applies.

## `responses[]`

A check, a prediction or a decision is not an item, so a tap on one is never an attempt and never reaches the
scheduler or Progress. It is stored apart, one record per tap: `{ id, at, session, value }`.

| Field | Meaning |
|---|---|
| `id` | the block's ID, for example `gd-econ/endowment/c1` (check), `.../p1` (prediction), `.../d1` (decision) |
| `at` | UTC time of the tap |
| `session` | the `sessionId` of the session the learner was in |
| `value` | for a check or decision, the index of the tapped option (0 is the first listed in the lesson file); for a prediction, the number the learner committed, in the unit the block gives |

Phone storage key: `learning-app:v1:responses`. The lesson file holds the block's text and its correct answer, so
read a response against the lesson file of the course version in the session.

## The `F` variant

`F` is a whole-app setting for the lesson flow: `stepped`, `predict` or `case`. Classic is the default and is never
stored on a session, like a default `E6`. A session that ran in a flow has it in `variants` (for example
`{ "F": "case" }`) and in `variant` (`F=case`), and so does each attempt made in it. `settings.whole.F` has the
same shape as `E6`, with `until` always `null`. A stored value the app does not know reads as Classic.

## Version history

- **2, extended**: adds the optional `responses` array and the `F` value in `variants`. Neither breaks a reader that
  ignores unknown fields, so the version stays at 2.

- **2**: adds `assignments`, `settings`, session `variants`, `appeal`, `appealAt`, and attempt `exposure`, `variants`.
  `mark` can now be `null` (read exposures), which a version 1 reader would not expect, so the version was raised.
- **1**: the first format.

## Restoring from a file

Settings has a file picker that merges an export into the phone. Attempts are matched by `attemptId` and sessions by
`sessionId`; missing ones are added, existing ones are never changed or deleted, so restoring the same file twice adds
nothing. Each attempt's `itemId`, `itemType`, `courseId` and `parentId` come from its item entry. A local assignment
wins over the file's, and `settings` are taken from the file only when the phone has none. Responses are matched by session, block ID and time; missing ones are added. A file without `responses` restores as
before. Files whose `schema` is not
`learning-app-export`, or whose `schemaVersion` is not 1 or 2, are rejected.

## How the app uses the history

- **Scheduling.** Only lesson items of type `recall`, `why` and `scenario` are scheduled. Opening questions and placement
  items are pretests: recorded, never scheduled. Attempts with mode `lesson` or `review` feed FSRS (`ts-fsrs`,
  short-term steps off, no fuzz); `right` counts as Good, `partly` as Hard, `wrong` as Again. A missed item returns
  the next day at the earliest. `retry` attempts are recorded but not fed to the scheduler. A `read` exposure counts as Good. A review session
  takes at most 10 due items, or the `E6` setting's number.
- **Learned.** An item counts as learned when its latest `lesson` or `review` mark is `right`. Read exposures are not
  answers: they are left out of learned, accuracy and late recall.
- **Late recall.** Answers with mode `lesson` or `review` given 14 or more days after the item's first such answer.
  Score: right 1, partly 0.5, wrong 0, averaged over those answers. Until an item is 14 days old the Progress screen
  says when the first one will be.

## Reading it at revision time

Items missed repeatedly: several `wrong` marks across sessions. Items right at first but forgotten later: `right` in
`lesson` mode, then `wrong` or `partly` in a `review` 14 or more days later. Scenarios where facts were known but the
choice was wrong: compare the same lesson's `recall` marks with its `scenario` mark and read the `text`.
