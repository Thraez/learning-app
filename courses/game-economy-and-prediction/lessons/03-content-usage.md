---
id: gd-econ/content-usage
course: gd-econ
title: Telemetry shows where design effort goes unused
order: 3
status: draft
sources:
  - cite: "Hullett, Nagappan, Schuh, Hopson (2012). Empirical analysis of user data in game software development. ESEM 2012, ACM-IEEE International Symposium on Empirical Software Engineering and Measurement. DOI 10.1145/2372251.2372265."
    url: https://doi.org/10.1145/2372251.2372265
    grade: A
    tier: 1
    note: full text read from the authors' camera-ready copy on Microsoft Research
---

# Lesson 3: Telemetry shows where design effort goes unused

## Opening question

### gd-econ/content-usage/open · open

Project Gotham Racing 4 (Xbox 360, 2007) shipped with 134 vehicles. Microsoft researchers read 3.1 million race starts logged from players on Xbox Live. Guess: how many of the 134 vehicles were picked in fewer than 1% of races each?

<details>
<summary>Answer</summary>
104 of 134, or 78%. The same was true of 81 of the 121 routes. The paper and its catch are below.
</details>

## The idea

Players use a small part of what a game ships, and only telemetry tells you which part. Designers' guesses about use are not a substitute.

[Hullett and colleagues](https://doi.org/10.1145/2372251.2372265) (UC Santa Cruz, Microsoft Research, Microsoft Game Studios and Bungie) studied Project Gotham Racing 4's "Start of Race" log: about 3.1 million entries, one per race started, from players who opted in to telemetry on Xbox Live. It is a peer-reviewed conference paper (ESEM 2012). Across the whole dataset, these options were each used in fewer than 1% of races: 2 of 9 game modes, 12 of 29 event types, 81 of 121 routes and 104 of 134 vehicles. The authors split players by total races, from "infrequent" (13 or fewer) to "regular" (over 200), and found regular players raced more in multiplayer and in career mode.

From this they recommend [fewer options in future games](https://doi.org/10.1145/2372251.2372265), since each car costs modelling, texturing, tuning and testing. They also argue against themselves: rarely used content can extend a game's life, lead to play nobody planned, and sell the game ("more than 100 vehicles" on the box). So they suggest a cut of about 20%, not a purge. That trade-off is their judgment; the paper did not test what players would lose.

Two limits to keep. Telemetry shows what players did, not why: a car nobody picks may be slow, ugly, hard to unlock or buried in a menu. And the career-mode result is a correlation. The authors recommend steering new players into career mode because regular players used it more, but players who already planned to stay may simply prefer career mode. Only a test that steers some new players and not others would show which way it runs.

## Why

### gd-econ/content-usage/why · why

Why can't the team that built a feature judge from playtests how much it will be used after launch? Answer before opening.

<details>
<summary>Model answer</summary>
Playtests are short, guided and run with small groups, so testers try features they would never seek out at home, and the team's own sense of a feature is shaped by the effort put into it. Live play shows choices made freely, over months, by players who were never told what to try. The paper argues that traditional playtesting can't cover everything a complex game allows; this account of why is my reasoning, grade C.
</details>

## Scenario

### gd-econ/content-usage/scenario · scenario

You are planning the next content drop for a live mobile strategy game. The data team can log one extra event per content item but is short on time. The producer asks: should we log "unit used in battle", or "unit unlocked", or both? What do you argue?

<details>
<summary>Explained answer</summary>
Both, if you can, because they answer different questions. Unlock without use tells you players get the unit but don't choose it, which points at balance or appeal. Low unlocks point at the path to the unit. With only use logged, a rarely used unit could be either, which is the same gap the Project Gotham Racing 4 data has: it logged what players picked, not what they could pick. Decide what question you will ask of the data before you log it. That last point is common practice in game analytics, not a finding from this study, grade C.
</details>

## Recall

### gd-econ/content-usage/r1 · recall

Which game did the Microsoft telemetry study use?

<details>
<summary>Answer</summary>
Project Gotham Racing 4.
</details>

### gd-econ/content-usage/r2 · recall

How many of the game's 29 event types appeared in fewer than 1% of races?

<details>
<summary>Answer</summary>
12 of 29.
</details>

### gd-econ/content-usage/r3 · recall

What can't usage telemetry tell you on its own?

<details>
<summary>Answer</summary>
Why players did or didn't use something: whether the content was unappealing, hard to find, or out of reach.
</details>

## Sources and grades

- [Hullett et al. 2012, ESEM](https://doi.org/10.1145/2372251.2372265), full text read from the authors' camera-ready copy hosted by Microsoft Research (the ACM page blocked automated access). Grade A, tier 1 (peer-reviewed). Every figure in this lesson was checked against that text.
- The earlier version of this lesson took its figures from a SlideShare deck, which had different thresholds (0.5% and 0.25%). Those figures are cut; the paper's 1% figures replace them.
- This lesson rests on one game, one team's study and players who opted in to telemetry. Published evidence on content usage in other games is thin; most studios keep these numbers private.
