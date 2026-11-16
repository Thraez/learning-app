---
id: gd-econ/churn-time
course: gd-econ
title: Churn is a definition and a time, not a label
order: 4
status: draft
checked: 2026-11-16
sources:
  - cite: "Periáñez, Saas, Guitart, Magne (2016). Churn Prediction in Mobile Social Games: Towards a Complete Assessment Using Survival Ensembles. IEEE DSAA 2016, pp. 564-573. DOI 10.1109/DSAA.2016.84. Read as arXiv:1710.02264."
    url: https://doi.org/10.1109/DSAA.2016.84
    grade: A
    tier: 1
    note: full text read on arXiv; the DOI is the published version
  - cite: "Hadiji, Sifa, Drachen, Thurau, Kersting, Bauckhage (2014). Predicting player churn in the wild. IEEE CIG 2014. DOI 10.1109/CIG.2014.6932876."
    url: https://doi.org/10.1109/CIG.2014.6932876
    grade: A
    tier: 1
    note: abstract only, read on IEEE Xplore
---

# Lesson 4: Churn is a definition and a time, not a label

## Opening question

### gd-econ/churn-time/open · open

Age of Ishtaria is a mobile role-playing game from the Japanese studio Silicon Studio. Its data team ([Periáñez et al. 2016](https://doi.org/10.1109/DSAA.2016.84)) counted a player as churned after 10 days in a row without logging in. With that rule, guess two numbers: the share of non-paying players who churned on their very first day, and the share of the top spenders who had churned after 100 days.

<details>
<summary>Answer</summary>
About 80% of non-paying players churned on their first day. Only about 20% of the top spenders had churned after 100 days. Same game, same rule, very different lives.
</details>

## The idea

A player never sends a "churned" event. Churn is a rule the team picks, and it is an event in time, so a model has to deal with players whose time hasn't come yet.

The rule first. [Periáñez and colleagues](https://doi.org/10.1109/DSAA.2016.84) (Silicon Studio, peer-reviewed at IEEE DSAA 2016) used 10 days without a login and checked it against their data: top spenders who came back after 10 idle days brought in only 1.4% of that group's revenue, so 10 days was a fair line for "gone". The Age of Ishtaria figures in the opening come from Kaplan-Meier curves on a sample of 1.5 million players in that paper. [Hadiji and colleagues](https://doi.org/10.1109/CIG.2014.6932876) (IEEE CIG 2014) defined churn formally, "aligning with industry standards", for what their abstract calls the first cross-game churn study, over five free-to-play games. A different window gives a different churn rate from the same data, so two teams' churn rates are only comparable if their rules match (my reasoning, grade C).

Then time. When data is pulled, many players are still active, and their churn time is unknown. Statisticians call this censored data. [Periáñez and colleagues](https://doi.org/10.1109/DSAA.2016.84) argue that binary classifiers can't say when a player will stop and work from static information, and that classic regressions only work once every player has left. Their answer is survival analysis, which predicts the time until churn and treats the censored players as having lasted at least this long. They trained it on 2,500 top spenders (lesson 9 has the results).

[Hadiji and colleagues](https://doi.org/10.1109/CIG.2014.6932876) show what churn classifiers can run on: generic behaviour features such as playtime, session length and the time between sessions, combined with a retention model for each game and no game-specific design features, gave what the abstract calls high-accuracy churn prediction across the five games. The abstract gives no accuracy figure, and I have not read the full paper, so this lesson gives none.

## Why

### gd-econ/churn-time/why · why

Why does dropping or mislabelling still-active players bias a churn model? Answer before opening.

<details>
<summary>Model answer</summary>
Recent installs have had little time to churn, so labelling them "not churned" makes early-life churn look rarer than it is, and dropping them throws away the most recent behaviour. Either way the model learns from a skewed picture. Survival methods keep those players and use only what is known: that they lasted at least until the cutoff. The paper states the censoring problem; this account of the direction of the bias is my reasoning, grade C.
</details>

## Scenario

### gd-econ/churn-time/scenario · scenario

You work on two games. One is a daily puzzle game. The other is a strategy game whose players typically log in for a weekend event every two weeks. Leadership wants one churn dashboard using a single rule: "no login for 7 days". What goes wrong, and what do you propose?

<details>
<summary>Explained answer</summary>
A 7-day rule fits the daily game but counts many healthy strategy players as churned between events, then counts them as returned. The strategy game's churn rate would look high and noisy for reasons that have nothing to do with players leaving. Pick each game's window from its own data, the way Silicon Studio checked that top spenders back after 10 idle days brought in only 1.4% of that group's revenue, and print the rule next to every churn number. Comparing the two games then needs care, because the rules differ. The papers show that the definition is a choice; applying the check to these two games is my suggestion, grade C.
</details>

## Recall

### gd-econ/churn-time/r1 · recall

What churn rule did Periáñez and colleagues use?

<details>
<summary>Answer</summary>
No login for 10 consecutive days.
</details>

### gd-econ/churn-time/r2 · recall

What is censored data in a churn study?

<details>
<summary>Answer</summary>
Players still active when the data ends, so their churn time is unknown. All you know is that they lasted at least until the cutoff.
</details>

### gd-econ/churn-time/r3 · recall

Which kinds of features did Hadiji and colleagues use so the model would work across games?

<details>
<summary>Answer</summary>
Generic behaviour features such as playtime, session length and the time between sessions, with no game-specific design features.
</details>

## Sources and grades

- [Periáñez et al. 2016, IEEE DSAA](https://doi.org/10.1109/DSAA.2016.84), full text read as [arXiv:1710.02264](https://arxiv.org/abs/1710.02264), which lists the DSAA paper and DOI as its published version. Grade A, tier 1 (peer-reviewed). The 10-day rule, the 1.4% figure, the 80% and 20% figures, the sample sizes and the censoring argument were checked against the text.
- [Hadiji et al. 2014, IEEE CIG](https://doi.org/10.1109/CIG.2014.6932876), abstract read on IEEE Xplore. Grade A for the abstract's claims, tier 1. The full paper is paywalled; I did not see its churn window or accuracy figures.
- Periáñez and colleagues worked at the studio whose game they studied, on the studio's own player data, which the paper does not publish, so others can't rerun the results. The Hadiji abstract does not say whose data it used.
