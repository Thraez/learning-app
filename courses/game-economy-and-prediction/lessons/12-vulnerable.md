---
id: gd-econ/vulnerable
course: gd-econ
title: Spend prediction and vulnerable players
order: 12
status: draft
sources:
  - cite: "Zendle, Cairns (2018). Video game loot boxes are linked to problem gambling: Results of a large-scale survey. PLOS ONE 13(11): e0206767."
    url: https://doi.org/10.1371/journal.pone.0206767
    grade: A
    tier: 1
  - cite: "Zendle, Cairns (2019). Loot boxes are again linked to problem gambling: Results of a replication study. PLOS ONE 14(3): e0213194."
    url: https://doi.org/10.1371/journal.pone.0213194
    grade: A
    tier: 1
  - cite: "Close, Spicer, Nicklin, Uther, Lloyd, Lloyd (2021). Secondary analysis of loot box data: are high-spending whales wealthy gamers or problem gamblers? Addictive Behaviors 117, 106851. DOI 10.1016/j.addbeh.2021.106851."
    url: https://doi.org/10.1016/j.addbeh.2021.106851
    grade: A
    tier: 1
    note: abstract of the published version read (PubMed)
---

# Lesson 12: Spend prediction and vulnerable players

## Opening question

### gd-econ/vulnerable/open · open

A 2021 study pooled survey data on 7,767 people who buy loot boxes and asked who the biggest spenders are. One common guess is that they are simply people with money. Guess: did loot box spending track earnings or problem gambling scores?

<details>
<summary>Answer</summary>
Problem gambling. Spend correlated with problem gambling severity (rho = 0.34) and not significantly with earnings (rho = 0.02).
</details>

## The idea

Lessons 5 and 9 showed that a few players bring much of the revenue and that models are built to find them early. For loot boxes, the evidence says many of those big spenders show signs of problem gambling, not wealth. A model that finds future whales may also be finding vulnerable players.

[Zendle and Cairns](https://doi.org/10.1371/journal.pone.0206767) surveyed 7,422 adult gamers recruited on Reddit. The more people spent on loot boxes, the higher their problem gambling severity (η² = 0.054, a small to medium effect). Spending on other in-game items showed a much weaker link (η² = 0.004). The sample chose itself and knew the topic, so in 2019 they [repeated the survey](https://doi.org/10.1371/journal.pone.0213194) with 1,172 gamers on Amazon Mechanical Turk who were told only that it was about spending in games. The link held (η² = 0.051), though the link to other purchases was stronger this time (η² = 0.025), and this sample had an unusually high rate of problem gamblers.

[Close and colleagues](https://doi.org/10.1016/j.addbeh.2021.106851) then pooled the open data from several such surveys. Most spend was modest, under $20 a month, but the top 5% of spenders (over $100 a month) made up half of loot box revenue, and spend tracked problem gambling, not earnings. Their conclusion: developers, "unwittingly or not", profit disproportionately from moderate and high-risk gamblers.

All of this is self-reported and correlational. Zendle and Cairns say plainly that the direction can't be told apart: loot boxes may lead to problem gambling, problem gamblers may be drawn to loot boxes, or both. None of these papers studies a spend prediction model. The step from "big loot box spenders are often problem gamblers" to "a whale model targets vulnerable players" is my inference, grade C, though it follows directly if the model works.

## Why

### gd-econ/vulnerable/why · why

Why does it matter for a studio whether whales are rich or at risk, if the revenue is the same either way? Answer before opening.

<details>
<summary>Model answer</summary>
If whales are rich, high spend is affordable fun and targeting them is ordinary marketing. If many are at risk, the same revenue comes partly from harm, and every system that finds and nudges them, offers, matchmaking, personalised prices, amplifies that harm. It also matters for regulation, which the papers say is the policy question. The data are from Close and colleagues; the reasoning about targeting is mine, grade C.
</details>

## Scenario

### gd-econ/vulnerable/scenario · scenario

Your team's new model flags likely high spenders in their first week so they can get premium offers sooner. The game sells loot boxes. What safeguards do you propose before launch?

<details>
<summary>Explained answer</summary>
Treat the flag as a risk signal as well as a value signal. Don't send extra loot box offers to flagged players; look at signs of harmful spending such as fast escalation, spending at odd hours or chasing after bad pulls, and offer spending limits or cool-downs instead of more offers. Measure the model's effect in a randomized test that includes harm-related outcomes, not just revenue. The link between big spend and problem gambling comes from the surveys; these safeguards are my suggestions, grade C, and none has been tested in a published study I found.
</details>

## Recall

### gd-econ/vulnerable/r1 · recall

What did Close and colleagues find about who the top loot box spenders are?

<details>
<summary>Answer</summary>
Spend correlated with problem gambling severity and not significantly with earnings. The top 5% of spenders made up half of loot box revenue.
</details>

### gd-econ/vulnerable/r2 · recall

Why did Zendle and Cairns run their 2019 replication with a different sample?

<details>
<summary>Answer</summary>
The first sample chose itself on Reddit and knew the study was about loot boxes and gambling. The replication used people who were not told the topic. The link held.
</details>

### gd-econ/vulnerable/r3 · recall

What can't these studies tell you about loot boxes and problem gambling?

<details>
<summary>Answer</summary>
The direction of cause. Loot boxes may lead to problem gambling, problem gamblers may spend more on loot boxes, or both.
</details>

## Sources and grades

- [Zendle and Cairns 2018](https://doi.org/10.1371/journal.pone.0206767) and [2019](https://doi.org/10.1371/journal.pone.0213194), PLOS ONE, full text read (publisher PDFs). Grade A, tier 1. Samples, effect sizes and stated limits checked against the text.
- [Close et al. 2021, Addictive Behaviors](https://doi.org/10.1016/j.addbeh.2021.106851), abstract of the published version read (PubMed). Grade A, tier 1. The earlier draft of this lesson used the accepted manuscript, whose figures differ slightly (7,771 buyers, rho .33, "over half"); the published figures replace them.
- All three rest on self-report surveys. Zendle and Cairns surveyed adults in English. Close et al. pooled several surveys; I read only their abstract, so I have not checked who each survey sampled. The link to spend prediction models is my inference, grade C. I found no published study of whale-detection models and vulnerable players.
