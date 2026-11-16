---
id: gd-econ/content-usage
course: gd-econ
title: Telemetry shows where design effort goes unused
order: 3
status: draft
sources:
  - cite: "Empirical analysis of user data in game software development. Microsoft Research (abstract page)."
    url: https://www.microsoft.com/en-us/research/?p=164184
    grade: A
    note: abstract only
  - cite: "Hullett, Nagappan, Schuh, Hopson (2011). Data analytics for game development. ICSE 2011, New Ideas and Emerging Results track. DOI 10.1145/1985793.1985952."
    url: https://2011.icse-conferences.org/content/data-analytics-game-development.html
    grade: B
    note: paper not opened; figures from the slide deck below
  - cite: "Zimmermann, Nagappan, Philips, Harrison. Data-driven games user research (slides, GUR-CHI 2012), slide 3."
    url: https://www.slideshare.net/slideshow/data-driven-games-user-research-gurchi-2012/12870641
    grade: B
---

# Lesson 3: Telemetry shows where design effort goes unused

## Opening question

### gd-econ/content-usage/open · open

Project Gotham Racing 4 shipped with over a hundred cars, many locations and a long list of race event types. Microsoft researchers read years of its telemetry. Guess: of its 29 event types, how many showed up in fewer than 1% of races?

<details>
<summary>Answer</summary>
12 of 29, according to Microsoft slides presenting the study. Treat it as grade B; the reason is below.
</details>

## The idea

Players use a small part of what a game ships, and only telemetry tells you which part. Designers' guesses about use are not a substitute.

Hullett and colleagues at Microsoft studied Project Gotham Racing 4's play data. The abstract (grade A) says the work looks at how far the game's options were used and at differences between long-term and short-term players, and frames it as one of the first empirical analyses of this kind of data. The figures come from a Microsoft Research slide deck presenting the work (grade B, since I could not open the paper). Across all races: 2 of 9 game modes in under 0.5% of races, 12 of 29 event types in under 1%, and 50 of 134 vehicles in under 0.25%. In multiplayer races: 7 of 16 event types in under 0.1%, and 53 of 133 vehicles in under 0.25%.

A limit worth keeping: telemetry shows what players did, not why. An event type nobody plays may be dull, or hard to find, or locked behind something nobody reaches. Low use is a question, not yet an answer.

## Why

### gd-econ/content-usage/why · why

Why can't the team that built a feature judge from playtests how much it will be used after launch? Answer before opening.

<details>
<summary>Model answer</summary>
Playtests are short, guided and run with small groups, so testers try features they would never seek out at home, and the team's own sense of a feature is shaped by the effort put into it. Live play shows choices made freely, over months, by players who were never told what to try. This is my reasoning, grade C; the study shows the gap, not its cause.
</details>

## Scenario

### gd-econ/content-usage/scenario · scenario

You are planning the next content drop for a live mobile strategy game. The data team can log one extra event per content item but is short on time. The producer asks: should we log "unit used in battle", or "unit unlocked", or both? What do you argue?

<details>
<summary>Explained answer</summary>
Both, if you can, because they answer different questions. Unlock without use tells you players get the unit but don't choose it, which points at balance or appeal. Low unlocks point at the path to the unit, which is the discoverability problem the PGR4 data can't separate from appeal. With only use logged, a rarely used unit could be either. Decide what question you will ask of the data before you log it; telemetry you didn't plan rarely answers the question you have later. That last point is common practice in game analytics, not a finding from this study (grade C).
</details>

## Recall

### gd-econ/content-usage/r1 · recall

Which game did the Microsoft telemetry study use?

<details>
<summary>Answer</summary>
Project Gotham Racing 4.
</details>

### gd-econ/content-usage/r2 · recall

How many of its 29 event types appeared in fewer than 1% of races, and how sure is that figure?

<details>
<summary>Answer</summary>
12 of 29. Grade B: it comes from slides about the work, not from the paper itself.
</details>

### gd-econ/content-usage/r3 · recall

What can't usage telemetry tell you on its own?

<details>
<summary>Answer</summary>
Why players did or didn't use something: whether the content was unappealing, hard to find, or out of reach.
</details>

## Sources and grades

- Hullett et al., Microsoft Research abstract page, read. Grade A for what the abstract says, which has no figures.
- Figures from slide 3 of the Zimmermann et al. deck on SlideShare, opened. Grade B. The full paper is behind the ACM Digital Library and was not opened.
- This lesson rests on one game and one team's study. Published evidence on content usage in other games is thin; most studios keep these numbers private.
