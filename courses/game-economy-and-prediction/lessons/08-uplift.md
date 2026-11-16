---
id: gd-econ/uplift
course: gd-econ
title: Target the players an offer changes, not the ones most likely to leave
order: 8
status: draft
sources:
  - cite: "Ascarza (2018). Retention Futility: Targeting High-Risk Customers Might Be Ineffective. Journal of Marketing Research 55(1), 80-98. DOI 10.1509/jmr.16.0163."
    url: https://doi.org/10.1509/jmr.16.0163
    grade: A
    tier: 1
    note: abstract only, read via Crossref
  - cite: "Gutierrez, Gérardy (2017). Causal Inference and Uplift Modelling: A Review of the Literature. International Conference on Predictive Applications and APIs (PAPIs 2016), PMLR 67, 1-13."
    url: https://proceedings.mlr.press/v67/gutierrez17a.html
    grade: A
    tier: 2
    note: conference proceedings; the review process is not stated, so not counted as peer-reviewed
  - cite: "Wei, Qiu, Li, Sun, Li (2024). Multi-Treatment Multi-Task Uplift Modeling for Enhancing User Growth. arXiv:2408.12803."
    url: https://arxiv.org/abs/2408.12803
    grade: A
    tier: 2
    note: preprint, not peer-reviewed, Tencent data
---

# Lesson 8: Target the players an offer changes, not the ones most likely to leave

## Opening question

### gd-econ/uplift/open · open

You have a good churn model and budget for retention gifts to 10% of players. The obvious plan is to give them to the 10% with the highest churn risk. A [2018 study by Ascarza](https://doi.org/10.1509/jmr.16.0163) in the Journal of Marketing Research tested exactly this choice in two field experiments with real customers. Guess what it found.

<details>
<summary>Answer</summary>
The customers with the highest churn risk were not necessarily the best targets. Targeting by how much a customer responds to the offer worked significantly better than targeting by risk.
</details>

## The idea

A retention offer is worth giving to a player only if it changes what that player does. Churn risk doesn't measure that. The measure you want is uplift: the player's outcome with the offer minus their outcome without it.

The catch is that you never see both outcomes for the same player. Each player either got the offer or didn't. [Gutierrez and Gérardy](https://proceedings.mlr.press/v67/gutierrez17a.html), in a review of the methods, point out that uplift modelling relies on randomized experiments: some players get the offer at random, some don't, and a model learns from the difference. The simplest method, the two-model approach, trains one model on the treated group and one on the control group and subtracts their predictions. Because no single player's uplift can be observed, these models are judged on groups, for example by deciles or uplift curves, not player by player.

The review also names a type that makes risk-based targeting dangerous: the "sleeping dog", a customer who churns because they were contacted and would have stayed otherwise.

[Ascarza's paper](https://doi.org/10.1509/jmr.16.0163) (peer-reviewed, marketing, not games) tested the standard practice in two field experiments. Its abstract says retention programmes are sometimes futile "not because firms offer the wrong incentives" but because of the targeting rule, and that targeting by sensitivity to the intervention was significantly more effective than targeting the highest-risk customers. This fits lesson 6, where free currency for predicted churners did nothing.

In games, a [2024 Tencent preprint](https://arxiv.org/abs/2408.12803) by Wei and colleagues, not peer-reviewed, built an uplift model for in-game bonuses, trained on over 10 million samples from randomized trials on their gaming platform, with next-day login and more games over 7 days as outcomes. They report that low-activity players were more likely to play the next game when given a higher-valued bonus, while highly active players often kept playing regardless. The model is deployed, and the paper charts activity growth on the live server, but its text gives no live uplift figures.

## Why

### gd-econ/uplift/why · why

Why can't you train an uplift model on data from a past campaign where the team chose who got the gift? Answer before opening.

<details>
<summary>Model answer</summary>
The team picked players for a reason, usually high churn risk, so the gifted and non-gifted groups differed before the gift. Any difference in outcome mixes the gift's effect with those prior differences, and the model can't separate them. Random assignment makes the two groups alike on average, so the difference is the gift's effect. The review states that uplift modelling relies on randomized experiments; this account of selection bias is standard reasoning, grade C.
</details>

## Scenario

### gd-econ/uplift/scenario · scenario

Your studio gives a free pack to every player its churn model flags. Retention among flagged players looks a bit better than last quarter, and the team wants to scale it up. What would you change before spending more?

<details>
<summary>Explained answer</summary>
Keep a random holdout among flagged players who get nothing, so you can see whether the pack changes anything at all, since last quarter is not a control. Then run the offer at random across a wider group, not only the flagged one, and look for who responds: the players who stay because of the pack, not the ones most likely to leave. Watch for sleeping dogs too, players a reminder pushes out. The holdout and uplift logic come from the sources; the rollout plan is my suggestion, grade C.
</details>

## Recall

### gd-econ/uplift/r1 · recall

What is uplift?

<details>
<summary>Answer</summary>
The difference in a player's outcome with the action and without it, so the effect the action causes for that player.
</details>

### gd-econ/uplift/r2 · recall

Why can't an uplift model be checked player by player?

<details>
<summary>Answer</summary>
You never see both outcomes for the same player, so their true uplift is unknown. Models are judged on groups instead, such as deciles or uplift curves.
</details>

### gd-econ/uplift/r3 · recall

What is a "sleeping dog" in uplift modelling?

<details>
<summary>Answer</summary>
Someone who leaves because they were contacted and would have stayed if left alone.
</details>

## Sources and grades

- [Ascarza 2018, Journal of Marketing Research](https://doi.org/10.1509/jmr.16.0163), abstract read via Crossref. Grade A for the abstract's claims, tier 1. I did not see the effect sizes or the settings of the two experiments, so this lesson gives none.
- [Gutierrez and Gérardy 2017, PMLR](https://proceedings.mlr.press/v67/gutierrez17a.html), full text read (PMLR PDF). Grade A for the counterfactual problem, the two-model approach, decile-based evaluation and the sleeping dog definition. Tier 2: it is a literature review in conference proceedings whose review process I could not confirm. Its claims here are standard definitions found across the uplift literature.
- [Wei et al. 2024, arXiv:2408.12803](https://arxiv.org/abs/2408.12803), full text read (arXiv PDF). Grade A for what the paper reports, tier 2: a preprint by a company research team, not peer-reviewed, with confidential data. The low-activity finding is stated as an observation without numbers, and the live results appear only in a chart. A 2026 Neurocomputing paper by the same authors on a similarly named model may be a reviewed version; I have not read it.
- Published uplift studies in games are rare. I found one; most studio practice is unpublished.
