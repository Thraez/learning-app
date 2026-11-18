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
    read: "full text, Microsoft Research copy"
    caveat: "One game, one team's study, opted-in players only."
    note: full text read from a copy on the Microsoft Research site; whether it is the camera-ready version is not confirmed
---

# Lesson 3: Telemetry shows where design effort goes unused

## Opening question

### gd-econ/content-usage/open · open

Project Gotham Racing 4 (Xbox 360, 2007) shipped with 134 vehicles. [Researchers from UC Santa Cruz, Microsoft and Bungie](https://doi.org/10.1145/2372251.2372265) read 3.1 million race starts logged from players on Xbox Live. Guess: how many of the 134 vehicles were picked in fewer than 1% of races each?

<details>
<summary>Answer</summary>
104 of 134, or 78%. The same was true of 81 of the 121 routes. The paper and its catch are below.
</details>

```predict
id: gd-econ/content-usage/p1
prompt: "What do you think: Project Gotham Racing 4 had 29 event types. How many were each used in fewer than 1% of races?"
unit: "event types"
min: 0
max: 29
step: 1
answer: 12
answer_text: "12 of the 29 event types."
reveal: "12 of 29 event types were each used in fewer than 1% of races in the game's Start of Race log. This is one game, from players who opted in to telemetry, in a peer-reviewed conference paper."
covers: gd-econ/content-usage/r2
```

```decide
id: gd-econ/content-usage/d1
prompt: "You lead the team planning the sequel to a racing game. Telemetry shows that many of the cars are rarely picked, and each car costs modelling, texturing, tuning and testing. What do you do?"
options:
  - text: "Cut every rarely used car."
    outcome: "The authors argue against this themselves. Rarely used content can extend a game's life, lead to play nobody planned, and sell the game, as with more than 100 vehicles on the box."
  - text: "Cut about 20%, not a purge."
    outcome: "This is the authors' own suggestion. It is their judgment: the paper did not test what players would lose."
  - text: "Keep every car."
    outcome: "The authors recommend fewer options in future games, since each car costs modelling, texturing, tuning and testing. They also give reasons to keep rare content, so the paper does not call keeping everything wrong."
```

## The idea

Players use a small part of what a game ships. In Project Gotham Racing 4, most of the cars were rarely picked.

For a designer: the team cannot see this from the inside. [The authors argue](https://doi.org/10.1145/2372251.2372265) that collecting usage data over the long term is the only workable way to see which part gets used.

<!-- break -->

The study. [Hullett and colleagues](https://doi.org/10.1145/2372251.2372265) (UC Santa Cruz, Microsoft Research, Microsoft Game Studios and Bungie) read the game's "Start of Race" log: about 3.1 million entries, one per race started.

The paper is peer-reviewed. Two things to keep in mind: it is one game, and the log holds only players who opted in to telemetry on Xbox Live.

<!-- break -->

How much went unused? [Across the whole dataset](https://doi.org/10.1145/2372251.2372265), these options were each used in fewer than 1% of races:

- 104 of 134 vehicles
- 81 of 121 routes
- 12 of 29 event types
- 2 of 9 game modes

```sure
The paper says ten game modes in one place and lists nine in another. This lesson uses the nine it lists.
```

```visual
id: gd-econ/content-usage/v1
kind: dot-grid
title: "Vehicles used in fewer than 1% of races each"
text: "104 of the 134 vehicles in Project Gotham Racing 4 were each used in fewer than 1% of races, across the whole dataset. One game, from players who opted in to telemetry."
total: 134
marked: 104
marked_label: "each used in fewer than 1% of races"
rest_label: "the other 30"
```

```check
id: gd-econ/content-usage/c1
prompt: "104 of the 134 vehicles were used in fewer than 1% of races. What does that mean?"
options:
  - text: "Together, the 104 vehicles made up under 1% of races."
    why: "The figure is per vehicle: each one was used in fewer than 1% of races, not all 104 together."
  - text: "Each of those 104 vehicles was used in fewer than 1% of races across the whole dataset."
    correct: true
    why: "The lesson says these options were each used in fewer than 1% of races."
```

<!-- break -->

Do keen players play differently? [The authors split players](https://doi.org/10.1145/2372251.2372265) by total races, from "infrequent" (13 or fewer) to "regular" (over 200).

Regular players raced more in multiplayer. On career mode, the paper's figures point two ways.

<!-- break -->

Look at single-player races only, and [regular players chose career mode more often](https://doi.org/10.1145/2372251.2372265): 59.9% against 47.5% for infrequent players. In their first ten races too: 36.5% against 22.2%.

Look at all races, and it flips. Career mode was 36.6% of regular players' races and 47.0% of infrequent players'.

The lesson for a designer is mine, not the paper's: a share means nothing until you know what it is a share of.

```sure
The paper's text says regular players favour career mode "both overall and in the first ten races". Its own all-races figures, 36.6% against 47.0%, do not show the "overall" part.
```

```check
id: gd-econ/content-usage/c2
prompt: "Regular players chose career mode more within single-player races (59.9% against 47.5%), yet across all races career mode was 36.6% of regular players' races against 47.0% of infrequent players' races. How can both stand?"
options:
  - text: "They use different bases: a share of single-player races in one case, a share of all races in the other."
    correct: true
    why: "The lesson says the paper's figures point two ways. Its text says regular players favour career mode both overall and in the first ten races, which the all-races figures do not show."
  - text: "One of the two figures must be a typo."
    why: "The lesson gives both as the paper's figures, on different bases. What does not fit is the paper's own text on overall use."
```

<!-- break -->

What the authors make of it. They recommend [fewer options in future games](https://doi.org/10.1145/2372251.2372265), since each car costs modelling, texturing, tuning and testing.

Then they argue against themselves. Rarely used content can extend a game's life, lead to play nobody planned, and sell the game ("more than 100 vehicles" on the box).

So they suggest a cut of about 20%, not a purge. That trade-off is their judgment: the paper did not test what players would lose.

<!-- break -->

Two limits to keep. Both are my reasoning (grade C), not the paper's.

First, telemetry shows what players did, not why. A car nobody picks may be slow, ugly, hard to unlock or buried in a menu.

<!-- break -->

Second, the career-mode result is a correlation. The authors recommend steering new players into career mode because, they say, regular players used it more.

But players who already planned to stay may simply prefer career mode. Only a test that steers some new players and not others would show which way it runs.

```check
id: gd-econ/content-usage/c3
prompt: "Regular players used career mode more. Does that show that steering new players into it would keep them playing?"
options:
  - text: "Yes. A gap that large must be caused by the mode."
    why: "The lesson calls the result a correlation, so a gap alone does not show which way it runs."
  - text: "No. Players who already planned to stay may simply prefer career mode."
    correct: true
    why: "The result is a correlation. Only a test that steers some new players and not others would show which way it runs."
```

## Why

### gd-econ/content-usage/why · why

Why can't the team that built a feature judge from playtests how much it will be used after launch? Answer before opening.

<details>
<summary>Model answer</summary>
Playtests are short, guided and run with small groups, so testers try features they would never seek out at home, and the team's own sense of a feature is shaped by the effort put into it. Live play shows choices made freely, over months, by players who were never told what to try. The paper argues that traditional playtesting can't cover everything a complex game allows; this account of why is my reasoning, grade C.
</details>

```points
for: gd-econ/content-usage/why
points:
  - "Playtests are short, guided and run with small groups, so testers try features they would never seek out at home."
  - "The team's own sense of a feature is shaped by the effort put into it."
  - "Live play shows free choices over months by players who were never told what to try."
```

## Scenario

### gd-econ/content-usage/scenario · scenario

You are planning the next content drop for a live mobile strategy game. The data team can log one extra event per content item but is short on time. The producer asks: should we log "unit used in battle", or "unit unlocked", or both? What do you argue?

<details>
<summary>Explained answer</summary>
Both, if you can, because they answer different questions. Unlock without use tells you players get the unit but don't choose it, which points at balance or appeal. Low unlocks point at the path to the unit. With only use logged, a rarely used unit could be either, which is the same gap in the Project Gotham Racing 4 study: the fields the paper lists record what players picked, not what each player had unlocked. Decide what question you will ask of the data before you log it. That last point is common practice in game analytics, not a finding from this study, grade C.
</details>

```points
for: gd-econ/content-usage/scenario
points:
  - "Log both, because use and unlock answer different questions."
  - "Unlock without use points at balance or appeal. Low unlocks point at the path to the unit."
  - "With only use logged, a rarely used unit could be either."
  - "Decide what question you will ask of the data before you log it (common practice, grade C)."
```

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

- [Hullett et al. 2012, ESEM](https://doi.org/10.1145/2372251.2372265), full text read from [a copy on the Microsoft Research site](https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/Hullett-MSR.pdf); I did not try the ACM page, and I cannot confirm the copy is the camera-ready version. Grade A, tier 1 (peer-reviewed). Every figure in this lesson was checked against that text.
- The earlier version of this lesson took its figures from a SlideShare deck. They are replaced with figures from the paper itself.
- This lesson rests on one game, one team's study and players who opted in to telemetry. I found little published evidence on content usage in other games (my search, grade C).
