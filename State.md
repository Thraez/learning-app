# State

**Updated:** 2026-11-16

## Goal

A personal micro-learning phone app (spec: `Workspace/Inbox/claude - Learning App Purpose.md`). First version: an
offline phone web app, two courses, recall, scenario and "why" questions, a review scheduler, and a manual export of
every answer so Claude can revise the course.

## Where it stands

- Repo created 2026-11-16, local only (no remote).
- No app code. The build, the host (Cloudflare was proposed) and any remote each wait on the user's yes.
- First course drafted, `status: draft`: `courses/game-economy-and-prediction/`. Course page, placement quiz and six
  full lessons. The user has not yet approved or redirected it.
- The second course in the approved scope (learning how to learn) is not written.

## Next steps

1. The user takes the placement quiz and the first lesson, then approves or redirects the course.
2. Revise the game economy course from that feedback; write the next lessons in the lesson list.
3. Design the learning-how-to-learn course with the user.
4. With the user's yes: plan the app build (course file parser, scheduler, export format).

## Open questions

- Should new lessons be read seated and reviews done in transit (finding 10, grade C for that step)?
- Export file format: per-item history with timestamps and free text; exact schema not decided.
