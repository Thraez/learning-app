---
id: gd-econ/placement
course: gd-econ
title: Placement quiz
status: draft
items: 12
---

# Placement quiz

About 10 to 15 minutes. These questions are about specific published studies, not general design knowledge, so expect to guess on many. That is fine: a wrong guess followed by the answer still helps you learn it. [Pan and Rivers 2023](https://doi.org/10.3758/s13421-022-01392-1), a peer-reviewed paper in Memory and Cognition, call this pretesting effect a known finding, and their five experiments found that most learners don't believe it: they think reading works better.

For each question, write or say your answer, mark how sure you were (sure, unsure, guess), then open the answer. Note the result next to the ID. Each question points at the lesson it places you into.

**How to read your result.** Items marked `recall` ask for figures from one paper, so an expert will often miss them; they are a pretest, not a placement. Place yourself with the `scenario` and `why` items: right and sure on a lesson's concept item means skim that lesson and do only its scenario. Anything else: do the full lesson. If every concept item is right and sure, tell me, and the course skips ahead to lessons 7 to 12.

Sources and grades for every answer are in the linked lesson.

---

### gd-econ/placement/p01 · recall

In a randomized test on about 575,000 new players of a football manager game, new players got 40, 80 or 120 units of premium currency. What happened to day-7 retention in the bigger groups, and did real-money buying drop?

<details>
<summary>Answer</summary>
Retention rose about 7% against control in both bigger groups, and buying did not drop. The size of the first purchase rose in the 120 group. Source: [Zivic et al. 2017](https://doi.org/10.1371/journal.pone.0186407). Lesson 1.
</details>

### gd-econ/placement/p02 · recall

That same paper's abstract says a bigger money supply leads to inflation. What did the paper actually measure about prices?

<details>
<summary>Answer</summary>
Nothing. It measured retention and purchases; the inflation claim is an interpretation. Source: [Zivic et al. 2017](https://doi.org/10.1371/journal.pone.0186407). Lesson 1.
</details>

### gd-econ/placement/p03 · recall

Old School RuneScape funded an item sink from a 1% market tax, buying high-level items from players and deleting them. What happened to those items' prices and to their trading volume?

<details>
<summary>Answer</summary>
Prices rose (about 7% in the first round and about 14 to 16% in the second) and no change in trading volume was detected, though that estimate is loose. Source: [Hogan-Hennessy et al. 2022, preprint](https://arxiv.org/abs/2210.07970). Lesson 2.
</details>

### gd-econ/placement/p04 · scenario

A designer proposes a sink that buys rare items off players and destroys them, "so rare items stay affordable". What is wrong with the reasoning?

<details>
<summary>Answer</summary>
Buying and destroying items adds demand and cuts supply, so prices go up, not down. That is what happened in RuneScape. Source: [Hogan-Hennessy et al. 2022, preprint](https://arxiv.org/abs/2210.07970). Lesson 2.
</details>

### gd-econ/placement/p05 · recall

In a published telemetry study of a Microsoft racing game, how many of the game's 29 event types showed up in fewer than 1% of races?

<details>
<summary>Answer</summary>
12 of 29 (Project Gotham Racing 4). Source: [Hullett et al. 2012](https://doi.org/10.1145/2372251.2372265). Lesson 3.
</details>

### gd-econ/placement/p06 · recall

A churn study pulls data on a fixed day, and many players are still active. What is the name for their unknown outcome, and what kind of model handles it?

<details>
<summary>Answer</summary>
Censored data. Survival models, which predict time until churn and treat still-active players as "lasted at least this long". Source: [Periáñez et al. 2016](https://doi.org/10.1109/DSAA.2016.84). Lesson 4.
</details>

### gd-econ/placement/p07 · scenario

Two studios both report a 30-day churn rate. Why might the numbers not be comparable even for similar games?

<details>
<summary>Answer</summary>
Churn is a rule each team picks, such as how many days without a login counts as gone. Different rules give different rates from the same data. Source: [Periáñez et al. 2016](https://doi.org/10.1109/DSAA.2016.84). Lesson 4.
</details>

### gd-econ/placement/p08 · recall

Survey data pooled from 7,767 loot box buyers: about what share of the buyers accounted for half of all loot box spending? Pick one: 0.5%, 5%, 20%, 50%.

<details>
<summary>Answer</summary>
5%, the buyers spending over $100 a month (self-reported survey data). Source: [Close et al. 2021](https://doi.org/10.1016/j.addbeh.2021.106851). Lesson 5.
</details>

### gd-econ/placement/p09 · recall

In a 2014 test, high-value players predicted to churn were given free in-game currency. What was the effect on churn and spending?

<details>
<summary>Answer</summary>
No significant effect on either. Source: [Runge et al. 2014](https://doi.org/10.1109/CIG.2014.6932875). Lesson 6.
</details>

### gd-econ/placement/p10 · why

In one or two sentences: why doesn't a churn model that predicts well tell you who should get a retention offer?

<details>
<summary>Model answer</summary>
It ranks how likely players are to leave, not how much an offer would change their choice. Some will leave anyway and some would stay anyway; finding the ones an offer moves needs an experiment. Source: [Runge et al. 2014](https://doi.org/10.1109/CIG.2014.6932875). Lesson 6.
</details>

### gd-econ/placement/p11 · why

Telemetry shows a piece of content is almost never used. Name two different reasons that could explain it, which the usage count alone can't tell apart.

<details>
<summary>Model answer</summary>
Players may find it dull or weak, or they may never find or reach it (hidden, locked or far into progression). The count looks the same either way. Source: [Hullett et al. 2012](https://doi.org/10.1145/2372251.2372265). Lesson 3.
</details>

### gd-econ/placement/p12 · why

Why do purchase prediction models in free-to-play often split the problem into two parts? Name the parts.

<details>
<summary>Model answer</summary>
Most players spend nothing and a few spend a lot, so one model for spend fits nobody well. The parts are whether a player will pay at all, and how much a payer will spend. Source: [Close et al. 2021](https://doi.org/10.1016/j.addbeh.2021.106851). Lesson 5.
</details>
