---
id: gd-econ/survival
course: gd-econ
title: Survival curves for churn and lifetime value
order: 9
status: draft
sources:
  - cite: "Viljanen, Airola, Heikkonen, Pahikkala (2018). Playtime Measurement With Survival Analysis. IEEE Transactions on Games 10(2), 128-138. DOI 10.1109/TCIAIG.2017.2727642. Read as arXiv:1701.02359."
    url: https://doi.org/10.1109/TCIAIG.2017.2727642
    grade: A
    tier: 1
    note: full text read on arXiv; the DOI is the published journal version
  - cite: "Periáñez, Saas, Guitart, Magne (2016). Churn Prediction in Mobile Social Games: Towards a Complete Assessment Using Survival Ensembles. IEEE DSAA 2016, pp. 564-573. DOI 10.1109/DSAA.2016.84. Read as arXiv:1710.02264."
    url: https://doi.org/10.1109/DSAA.2016.84
    grade: A
    tier: 1
  - cite: "Chen, Guitart, Fernández del Río, Periáñez (2018). Customer Lifetime Value in Video Games Using Deep Learning and Parametric Models. IEEE Big Data 2018, pp. 2134-2140. DOI 10.1109/BigData.2018.8622151. Read as arXiv:1811.12799."
    url: https://doi.org/10.1109/BigData.2018.8622151
    grade: A
    tier: 1
---

# Lesson 9: Survival curves for churn and lifetime value

## Opening question

### gd-econ/survival/open · open

Hipster Sheep is a mobile puzzle game the studio Tribeflame was developing in 2015. In one test version ([Viljanen et al. 2018](https://doi.org/10.1109/TCIAIG.2017.2727642)), the typical player quit after 0.77 hours of total playtime. Guess the mean playtime for the same players: about the same, about double, or about three times as long?

<details>
<summary>Answer</summary>
About three times as long: 2.41 hours. A few dedicated players with very long playtimes pull the mean far above the typical player.
</details>

## The idea

Lesson 4 showed why churn data is censored. Survival analysis is the toolkit built for that, and it gives designers better numbers than a churn rate.

[Viljanen and colleagues](https://doi.org/10.1109/TCIAIG.2017.2727642) (University of Turku, peer-reviewed in IEEE Transactions on Games) apply it to total playtime in Hipster Sheep, an in-development puzzle game, using 3,753 players from three test versions. The survival curve shows the share of players still playing after each amount of playtime, and the Kaplan-Meier method draws it while counting censored players correctly. From the curve come the median (when half the players have gone) and the mean (the area under the curve). Simply dropping censored players biases the mean downward, they note. In version 1.18 the median was 0.77 hours and the mean 2.41 hours, which is why they argue for reporting both. In the same version the hazard, the churn rate among those still playing, started at about 0.6 churns per hour, halved to 0.3 within the first 4 hours, and settled near 0.2 from about 10 hours on.

They also use the [log-rank test](https://doi.org/10.1109/TCIAIG.2017.2727642) to compare whole survival curves between versions, as an A/B test for retention. Version 1.15 against 1.11 was highly significant; 1.18 against 1.15 was not (p = 0.534), even though the plot looks like an improvement. One caution: these cohorts were acquired months apart through ad campaigns, not assigned at random, so a version difference can also be an audience difference. The authors raise this and show an adjustment for country.

Survival models can also predict. [Periáñez and colleagues](https://doi.org/10.1109/DSAA.2016.84) used survival ensembles on high-value players and got a lower prediction error (integrated Brier score 0.158) than Cox regression (0.169) or a plain Kaplan-Meier curve (0.199). Each player gets a whole survival curve, not a yes or no.

For lifetime value, the classic tools are "buy till you die" models such as Pareto/NBD, which predict future purchases from how often and how recently a player bought, assuming they buy until they leave. [Chen and colleagues](https://doi.org/10.1109/BigData.2018.8622151) found two problems with these on the mobile RPG Age of Ishtaria: they often predicted no purchases for players who kept spending, and they consistently underestimated the top spenders. Neural networks did better there, with errors on the top 20% of spenders roughly half as large (lesson 5).

## Why

### gd-econ/survival/why · why

Why does a churn hazard that drops over time matter for where a designer spends effort? Answer before opening.

<details>
<summary>Model answer</summary>
A falling hazard means the risk of quitting is highest early and the players who get past the first hours are much more likely to stay. So the first hours carry most of the losses, and small gains there affect the most players. The hazard figures are from Viljanen and colleagues; the design conclusion is my inference, grade C, and it only holds for games whose hazard has this shape.
</details>

## Scenario

### gd-econ/survival/scenario · scenario

A producer says the new version "clearly retains better": the survival curve sits above the old one in a chart, and the new version's players were bought in a different month from a different ad network. What do you say?

<details>
<summary>Explained answer</summary>
A gap in a chart isn't a test. Run a log-rank test on the two curves, since in the Hipster Sheep data a visible gap between 1.15 and 1.18 was not significant. And the two cohorts differ in time and source, so even a significant result may be about who was bought, not what changed. If you can, run both versions at the same time with random assignment; if not, adjust for the known differences as the authors did for country. The test and the cohort caveat are from the paper; the advice to randomise is mine, grade C.
</details>

## Recall

### gd-econ/survival/r1 · recall

What does a survival curve show in a playtime study?

<details>
<summary>Answer</summary>
The share of players still playing after each amount of playtime, with censored players counted correctly.
</details>

### gd-econ/survival/r2 · recall

What is the hazard?

<details>
<summary>Answer</summary>
The churn rate among the players still playing at a given point, for example churns per hour of playtime.
</details>

### gd-econ/survival/r3 · recall

What two weaknesses did Chen and colleagues find in buy-till-you-die models such as Pareto/NBD?

<details>
<summary>Answer</summary>
They often predicted no purchases for players who kept spending, and they consistently underestimated the top spenders.
</details>

## Sources and grades

- [Viljanen et al. 2018, IEEE Transactions on Games](https://doi.org/10.1109/TCIAIG.2017.2727642), full text read as [arXiv:1701.02359](https://arxiv.org/abs/1701.02359). Crossref lists the journal version with the same title and authors. Grade A, tier 1. The dataset, median, mean, hazard figures, the log-rank results (p = 0.534) and the cohort caveat were checked against the text. One small in-development game.
- [Periáñez et al. 2016, IEEE DSAA](https://doi.org/10.1109/DSAA.2016.84), full text read as [arXiv:1710.02264](https://arxiv.org/abs/1710.02264), which lists this DOI. Grade A, tier 1 for the Brier scores (Table I).
- [Chen et al. 2018, IEEE Big Data](https://doi.org/10.1109/BigData.2018.8622151), full text read as [arXiv:1811.12799](https://arxiv.org/abs/1811.12799), which lists this DOI. Grade A, tier 1 for the two weaknesses of the parametric models.
- All three use confidential studio data.
