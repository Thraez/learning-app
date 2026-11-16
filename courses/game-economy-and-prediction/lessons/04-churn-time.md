---
id: gd-econ/churn-time
course: gd-econ
title: Churn is a definition and a time, not a label
order: 4
status: draft
sources:
  - cite: "Periáñez, Saas, Guitart, Magne (2017). Churn Prediction in Mobile Social Games: Towards a Complete Assessment Using Survival Ensembles. arXiv:1710.02264."
    url: https://arxiv.org/abs/1710.02264
    grade: A
  - cite: "Hadiji, Sifa, Drachen, Thurau, Kersting, Bauckhage (2014). Predicting player churn in the wild. IEEE CIG 2014. DOI 10.1109/CIG.2014.6932876."
    url: https://bibtex.github.io/CIG-2014-HadijiSDTKB.html
    grade: A
    note: abstract
---

# Lesson 4: Churn is a definition and a time, not a label

## Opening question

### gd-econ/churn-time/open · open

A data team shows you a churn model with high accuracy. It was trained on everyone who installed in the last three months, labelled "churned" or "not churned" on the day the data was pulled. Many of those players were still logging in that day. What is wrong with the labels?

<details>
<summary>Answer</summary>
For a player still active on the cutoff day, "not churned" only means "not churned yet". Their real outcome is unknown. Treating it as known is the problem this lesson is about.
</details>

## The idea

A player never sends a "churned" event. Churn is a rule the team picks, and it is an event in time, so a model has to deal with players whose time hasn't come yet.

The rule first. Periáñez and colleagues (Silicon Studio, 2017) count a player as churned after 10 consecutive days without logging in. Hadiji and colleagues (2014) formally defined churn "in line with industry standards" for a cross-game study of five free-to-play games. A different window gives a different churn rate from the same data, so two teams' churn rates are only comparable if their rules match.

Then time. When data is pulled, many players are still active, and their churn time is unknown. Statisticians call this censored data. Periáñez and colleagues argue that standard binary classifiers can't say when a player will stop and work from a static snapshot, and that classic regressions only work once every player has left. Their answer is survival analysis, which predicts the time until churn and uses the censored players as "lasted at least this long". In their sample of 2,500 high spenders, about 20% had churned after 100 days.

Hadiji and colleagues show what such models can run on: generic behaviour features such as playtime, session length and the time between sessions, with no game-specific design features, gave high-accuracy churn prediction across five games.

## Why

### gd-econ/churn-time/why · why

Why does dropping or mislabelling still-active players bias a churn model? Answer before opening.

<details>
<summary>Model answer</summary>
Recent installs have had little time to churn, so labelling them "not churned" makes early-life churn look rarer than it is, and dropping them throws away the most recent behaviour. Either way the model learns from a skewed picture. Survival methods keep those players and use only what is known: that they lasted at least until the cutoff. The authors state the censoring problem; this account of the direction of the bias is my reasoning, grade C.
</details>

## Scenario

### gd-econ/churn-time/scenario · scenario

You work on two games. One is a daily puzzle game. The other is a strategy game whose players typically log in for a weekend event every two weeks. Leadership wants one churn dashboard using a single rule: "no login for 7 days". What goes wrong, and what do you propose?

<details>
<summary>Explained answer</summary>
A 7-day rule fits the daily game but counts many healthy strategy players as churned between events, then counts them as returned. The strategy game's churn rate would look high and noisy for reasons that have nothing to do with players leaving. Pick each game's window from its own play rhythm, for example from the gaps between sessions that players who later come back actually show, and print the rule next to every churn number. Comparing the two games then needs care, because the rules differ. The papers show that the definition is a choice; this way of picking a window is my suggestion, grade C.
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

- Periáñez et al. 2017, read on arXiv (ar5iv HTML). Grade A for the 10-day rule, the censoring argument and the 20% figure. Venue not confirmed.
- Hadiji et al. 2014, abstract read on a catalogue mirror (manuscript.isc.ac). Grade A for the abstract's claims. I did not see the paper's own churn window or accuracy figures, so this lesson gives none.
- Both studies use confidential studio data, so their results can't be rerun by others.
