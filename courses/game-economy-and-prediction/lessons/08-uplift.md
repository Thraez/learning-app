---
id: gd-econ/uplift
course: gd-econ
title: Who does an offer change? Targeting by response and by churn risk
order: 8
status: draft
checked: 2026-11-20
sources:
  - cite: "Ascarza (2018). Retention Futility: Targeting High-Risk Customers Might Be Ineffective. Journal of Marketing Research 55(1), 80-98. DOI 10.1509/jmr.16.0163."
    url: https://doi.org/10.1509/jmr.16.0163
    grade: A
    tier: 1
    read: "abstract only, OpenAlex record"
    caveat: "Abstract only; a marketing journal; effect sizes and experiment settings not seen."
    note: abstract only, read from the OpenAlex record (Crossref carries the same abstract)
  - cite: "Gutierrez, Gérardy (2017). Causal Inference and Uplift Modelling: A Review of the Literature. International Conference on Predictive Applications and APIs (PAPIs 2016), PMLR 67, 1-13."
    url: https://proceedings.mlr.press/v67/gutierrez17a.html
    grade: A
    tier: 2
    read: "full text, PMLR PDF"
    caveat: "A literature review; the paper does not say how it was reviewed."
    note: conference proceedings; the paper does not say how it was reviewed, so it is not counted as peer-reviewed; both authors give Dataiku email addresses
  - cite: "Wei, Qiu, Li, Sun, Li (2024). Multi-Treatment Multi-Task Uplift Modeling for Enhancing User Growth. arXiv:2408.12803."
    url: https://arxiv.org/abs/2408.12803
    grade: A
    tier: 2
    read: "full text, arXiv PDF"
    caveat: "Preprint, not peer-reviewed; Tencent data, proprietary."
    note: preprint, not peer-reviewed, Tencent data
  - cite: "Verhelst, Petit, Verbeke, Bontempi (2023). Uplift vs. predictive modeling: a theoretical analysis. arXiv:2309.12036."
    url: https://arxiv.org/abs/2309.12036
    grade: A
    tier: 2
    read: "abstract, introduction and section 2.2, arXiv PDF"
    caveat: "Preprint, not peer-reviewed; theory and simulations."
    note: preprint; OpenAlex lists only the arXiv record, so no published version was found; only the abstract, the introduction and the definitions of the two approaches in section 2.2 were read
  - cite: "Lemmens, Gupta (2020). Managing Churn to Maximize Profits. Marketing Science 39(5), 956-973. DOI 10.1287/mksc.2020.1229."
    url: https://doi.org/10.1287/mksc.2020.1229
    grade: A
    tier: 1
    read: "abstract only, Erasmus University repository page"
    caveat: "Abstract only; a marketing journal; no figures seen."
    note: abstract only, read on the Erasmus University repository page of the article; the INFORMS page was not opened
---

# Lesson 8: Who does an offer change? Targeting by response and by churn risk

## Opening question

### gd-econ/uplift/open · open

You have a good churn model and budget for retention gifts to 10% of players. The obvious plan is to give them to the 10% with the highest churn risk. A [2018 study by Ascarza](https://doi.org/10.1509/jmr.16.0163) in the Journal of Marketing Research took on this kind of choice, combining two field experiments with machine learning. Guess what it found.

<details>
<summary>Answer</summary>
The customers with the highest churn risk were not necessarily the best targets. Targeting by how much a customer responds to the offer worked significantly better than targeting by risk. The study is in a marketing journal, and its abstract does not say which businesses it tested.
</details>

```decide
id: gd-econ/uplift/d1
prompt: "You have retention gifts for 10% of players and a good churn model. Who gets the gifts?"
options:
  - text: "The 10% with the highest churn risk."
    outcome: "This is the standard practice Ascarza's study tested. Its abstract, which names no games, says the highest-risk customers are not necessarily the best targets, and that targeting by sensitivity to the offer was significantly more effective."
  - text: "First give the gift at random to some players, then target the kind of player it changed."
    outcome: "This is the uplift approach. A review of the methods says it relies on randomized experiments. Ascarza's abstract, on a study combining two field experiments, reports that targeting by response was significantly more effective than targeting by risk. It names no games."
  - text: "The players who got a gift in last year's campaign and stayed."
    outcome: "Staying after a gift does not show the gift caused it. If the team chose who got the gift, the two groups differed before it, and the gift's effect cannot be separated from that difference unless you assume the choice depended only on things you measured (the lesson's reasoning, grade C)."
```

## The idea

My reasoning (grade C): a retention offer is worth giving to a player only if it changes what that player does. Churn risk does not measure that.

The measure for it is [uplift](https://proceedings.mlr.press/v67/gutierrez17a.html): the player's outcome with the offer minus their outcome without it.

For a designer, still my reasoning: ask "who does this offer change?" as well as "who is about to leave?".

<!-- break -->

The catch: you never see both outcomes for the same player. Each player either got the offer or did not.

[Gutierrez and Gérardy](https://proceedings.mlr.press/v67/gutierrez17a.html), in a review of the methods, say uplift modelling relies on randomized experiments. Some players get the offer at random and some do not, and a model learns from the difference.

```check
id: gd-econ/uplift/c1
prompt: "Why does uplift modelling rely on a randomized experiment?"
options:
  - text: "Because no player is ever seen both with and without the offer, so uplift modelling compares randomly split groups."
    correct: true
    why: "The review says the true uplift of one person is never observed and that uplift modelling relies on randomized experiments."
  - text: "Because a churn model needs random data to rank players by risk."
    why: "Ranking by risk is a different job. The experiment is needed to see what the offer changes, which risk does not measure (the lesson's reasoning, grade C)."
```

<!-- break -->

How is such a model built and judged?

A simple method, often used as a baseline, is the two-model approach. Train one model on the players who got the offer and one on those who did not, then subtract their predictions.

No single player's uplift can be observed. So most of the uplift literature judges these models on groups, for example by deciles or uplift curves ([the same review](https://proceedings.mlr.press/v67/gutierrez17a.html)).

```sure
The review is a literature review in conference proceedings (PMLR volume 67), read in full from the PMLR PDF. The paper does not say how it was reviewed, so the lesson does not count it as peer-reviewed. Both authors give Dataiku email addresses. The review also says the two-model approach is easy to implement but can be surpassed by other methods.
```

<!-- break -->

The review names a kind of customer whom the offer itself pushes out.

It defines the "sleeping dog": someone who churns when given the treatment and does not churn without it.

Such customers are one reason targeting by risk alone can backfire. That link is mine, grade C.

```check
id: gd-econ/uplift/c2
prompt: "What is a sleeping dog?"
options:
  - text: "A player who will leave whatever you do."
    why: "The offer changes nothing for that player. A sleeping dog is one whom the offer itself pushes out."
  - text: "A player who leaves when given the offer and would have stayed without it."
    correct: true
    why: "That is the review's definition, put in player terms. The review says such a person reacts negatively to the action."
```

<!-- break -->

Does targeting by response beat targeting by risk? One peer-reviewed study, in a marketing journal, says it did.

[Ascarza](https://doi.org/10.1509/jmr.16.0163) combined two field experiments with machine learning. Her abstract says the customers at highest risk of churning are "not necessarily the best targets".

Targeting by sensitivity to the offer was significantly more effective than the standard practice of targeting the highest-risk customers.

```sure
I read only the abstract, from the OpenAlex record. So this lesson has no effect size and does not say which businesses the two experiments ran in. The abstract also says the finding suggests retention programmes are sometimes futile "not because firms offer the wrong incentives" but because they do not apply the right targeting rules. The paper is in the Journal of Marketing Research, a marketing journal; the abstract names no games.
```

<!-- break -->

But uplift may not always be the better choice.

A [2023 preprint by Verhelst and colleagues](https://arxiv.org/abs/2309.12036), not peer-reviewed, compares the two by theory and simulation. Its abstract says it shows conditions under which the predictive approach still outperforms uplift modelling.

And a [study in Marketing Science](https://doi.org/10.1287/mksc.2020.1229) by Lemmens and Gupta says both ways of targeting, by risk and by response, ignore that some customers add more to a campaign's profit than others. Their method ranks customers by the offer's effect on churn and on later cash flows, after the cost of the offer.

```sure
In the introduction of Verhelst and colleagues, traditional predictive models "predict the likelihood of customer churning" without considering the effect of the offer. Their abstract names what plays a significant role: the mutual information between the features and the outcome, the variance of the estimators, the distribution of potential outcomes, and the costs and benefits of the treatment and the outcome. I read the abstract, the introduction and the definitions of the two approaches only, and found no published version. For Lemmens and Gupta I read only the abstract, on the Erasmus University repository page. It says two field experiments "affirm" that their approach leads to significantly more profitable campaigns than competing models. It gives no figures. It is in a marketing journal and names no games.
```

```check
id: gd-econ/uplift/c3
prompt: "A colleague says uplift targeting always beats targeting by churn risk. What does the lesson have on that?"
options:
  - text: "It agrees: every study in the lesson found uplift better in every setting."
    why: "A preprint in the lesson reports simulated conditions where the predictive approach still wins, and a profit study says targeting by response ignores that some customers add more to a campaign's profit than others."
  - text: "Not always: one preprint shows simulated conditions where predicting the outcome wins, and a profit study adds later cash flows and the cost of the offer."
    correct: true
    why: "The preprint is theory and simulation, not peer-reviewed. The profit study is from marketing and was read at the abstract only."
```

<!-- break -->

And in games? The lesson has one study.

A [2024 Tencent preprint](https://arxiv.org/abs/2408.12803) by Wei and colleagues, not peer-reviewed, built an uplift model for bonuses on a gaming platform. It used a dataset of over 10 million samples from randomized trials on the company's gaming platform.

They report that low-activity players were more likely to play the next game when given a higher-valued bonus, while highly active players may keep playing with or without a bonus.

```sure
On the game data, the outcomes were logging in the next day and playing more games over the next 7 days. The low-activity finding is stated as an observation, without numbers. The model is deployed, and the paper charts activity growth on the live server, but its text gives no live uplift figures. The data is proprietary. A 2026 Neurocomputing paper by the same authors on a similarly named model may be a reviewed version; I have not read it.
```

<!-- break -->

How does this fit lesson 6? There, free currency in an A/B test had no significant effect on the churn rate or monetization.

One possible reading, mine and untested (grade C): an average over everyone can hide a group that does respond. The abstract of the lesson 6 study mentions no such group.

## Why

### gd-econ/uplift/why · why

Why is it unsafe to train an uplift model on data from a past campaign where the team chose who got the gift? Answer before opening.

<details>
<summary>Model answer</summary>
The team picked players for a reason, usually high churn risk, so the gifted and non-gifted groups differed before the gift. Any difference in outcome mixes the gift's effect with those prior differences, and the model can't separate them unless you assume the team's choice depended only on things in the data. Random assignment makes the two groups alike on average, so the difference is the gift's effect. The review states that uplift modelling relies on randomized experiments; this account of selection bias is standard reasoning, grade C.
</details>

```points
for: gd-econ/uplift/why
points:
  - "The team picked players for a reason, so the gifted and non-gifted groups differed before the gift."
  - "Any difference in outcome mixes the gift's effect with those prior differences."
  - "Random assignment makes the two groups alike on average, so the difference is the gift's effect."
  - "The gift example is the lesson's reasoning, grade C; the review states that uplift modelling relies on randomized experiments."
```

## Scenario

### gd-econ/uplift/scenario · scenario

Your studio gives a free pack to every player its churn model flags. Retention among flagged players looks a bit better than last quarter, and the team wants to scale it up. What would you change before spending more?

<details>
<summary>Explained answer</summary>
Keep a random holdout among flagged players who get nothing, so you can see whether the pack changes anything at all, since last quarter is not a control. Then run the offer at random across a wider group, not only the flagged one, and look for who responds: the players who stay because of the pack, not the ones most likely to leave. Watch for sleeping dogs too, players the pack itself pushes out. The control group and the uplift logic come from the review; the rollout plan is my suggestion, grade C.
</details>

```points
for: gd-econ/uplift/scenario
points:
  - "Keep a random holdout among flagged players who get nothing: last quarter is not a control."
  - "Run the offer at random across a wider group and look for who responds."
  - "Watch for sleeping dogs, players the offer itself pushes out."
  - "The rollout plan is the lesson's suggestion, grade C."
```

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
You never see both outcomes for the same player, so their true uplift is unknown. So most of the literature judges models on groups, such as deciles or uplift curves.
</details>

### gd-econ/uplift/r3 · recall

What is a "sleeping dog" in uplift modelling?

<details>
<summary>Answer</summary>
Someone who leaves when given the treatment and would have stayed without it.
</details>

## Sources and grades

- [Ascarza 2018, Journal of Marketing Research](https://doi.org/10.1509/jmr.16.0163), abstract read from the OpenAlex record (Crossref carries the same abstract). Grade A for the abstract's claims, tier 1. I did not see the effect sizes or the settings of the two experiments, so this lesson gives none.
- [Gutierrez and Gérardy 2017, PMLR](https://proceedings.mlr.press/v67/gutierrez17a.html), full text read (PMLR PDF). Grade A for the counterfactual problem, the two-model approach, decile-based evaluation and the sleeping dog definition. Tier 2: it is a literature review in conference proceedings, and the paper does not say how it was reviewed.
- [Wei et al. 2024, arXiv:2408.12803](https://arxiv.org/abs/2408.12803), full text read (arXiv PDF). Grade A for what the paper reports, tier 2: a preprint by a company research team, not peer-reviewed, with proprietary data. The low-activity finding is stated as an observation without numbers, and the live results appear only in a chart. A 2026 Neurocomputing paper by the same authors on a similarly named model may be a reviewed version; I have not read it.
- [Verhelst et al. 2023, arXiv:2309.12036](https://arxiv.org/abs/2309.12036), abstract, introduction and the definitions of the two approaches read (arXiv PDF). Grade A for those only, tier 2: a preprint, not peer-reviewed, theory and simulations.
- [Lemmens and Gupta 2020, Marketing Science](https://doi.org/10.1287/mksc.2020.1229), abstract read on the Erasmus University repository page of the article. Grade A for the abstract's claims only, tier 1. A marketing journal; the abstract names no games.
- I found one uplift study in games, a preprint. How rare such studies are is my impression from that search, grade C.
