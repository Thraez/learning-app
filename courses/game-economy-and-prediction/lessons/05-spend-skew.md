---
id: gd-econ/spend-skew
course: gd-econ
title: Spend is mostly zero and often very concentrated
order: 5
status: draft
sources:
  - cite: "Close, Spicer, Nicklin, Uther, Lloyd, Lloyd (2021). Secondary analysis of loot box data: Are high-spending whales wealthy gamers or problem gamblers? Addictive Behaviors 117, 106851. DOI 10.1016/j.addbeh.2021.106851."
    url: https://doi.org/10.1016/j.addbeh.2021.106851
    grade: A
    tier: 1
    read: "abstract only, published abstract"
    caveat: "Abstract only; self-reported survey answers, loot boxes only."
    note: abstract read (PubMed record of the published version, through Europe PMC)
  - cite: "Sifa, Hadiji, Runge, Drachen, Kersting, Bauckhage (2015). Predicting Purchase Decisions in Mobile Free-to-Play Games. AIIDE 2015, pp. 79-85. DOI 10.1609/aiide.v11i1.12788."
    url: https://doi.org/10.1609/aiide.v11i1.12788
    grade: A
    tier: 1
    read: "abstract only, OpenAlex copy"
    caveat: "Abstract only; game, share of payers and method details not seen."
    note: abstract only (the publisher abstract, read through the OpenAlex record); the AAAI page and PDF sit behind a bot check
  - cite: "Chen, Guitart, Fernández del Río, Periáñez (2018). Customer Lifetime Value in Video Games Using Deep Learning and Parametric Models. IEEE Big Data 2018, pp. 2134-2140. DOI 10.1109/BigData.2018.8622151. Read as arXiv:1811.12799."
    url: https://doi.org/10.1109/BigData.2018.8622151
    grade: A
    tier: 1
    read: "full text, arXiv copy"
    caveat: "The 2% and 50% whale figure is stated without the count behind it."
    note: full text read on arXiv; B for the 2% and 50% figure, which the paper states without data
  - cite: "Zendle, Flick, Deterding, Cutting, Petrovskaya, Drachen (2023). The Many Faces of Monetisation: Understanding the Diversity and Extremity of Player Spending in Mobile Games via Massive-scale Transactional Analysis. ACM Games: Research and Practice 1(1), 1-28. DOI 10.1145/3582927."
    url: https://doi.org/10.1145/3582927
    grade: A
    tier: 1
    read: "abstract only, OpenAlex record"
    caveat: "Abstract only; the journal's review process was not confirmed from its own pages."
    note: abstract of the published version, read from the OpenAlex record; the ACM page refused automated access, so the full text and the journal's statement of its review process were not opened
---

# Lesson 5: Spend is mostly zero and often very concentrated

## Opening question

### gd-econ/spend-skew/open · open

[Researchers pooled](https://doi.org/10.1016/j.addbeh.2021.106851) the open-access loot box survey datasets that a structured literature search turned up: 7,767 people who buy loot boxes. Their abstract says monthly spending is typically modest, under $20, as background rather than as a result of the pooled data. Guess: what share of these buyers accounted for half of all the loot box spending?

<details>
<summary>Answer</summary>
The top 5%, the ones spending over $100 a month. By the buyers' own survey answers, one buyer in twenty accounted for half the money.
</details>

```predict
id: gd-econ/spend-skew/p1
prompt: "In those pooled surveys, the top 5% of loot box buyers accounted for half of the loot box spending. Above how many dollars a month did that top group report spending?"
unit: "$"
min: 0
max: 500
step: 10
answer: 100
answer_text: "Over $100 a month."
reveal: "The abstract puts the top 5% of spenders at over $100 a month, against a typical monthly spend it calls modest, under $20. These are self-reported survey answers about loot boxes only, not sales records."
covers: gd-econ/spend-skew/r2
```

## The idea

In free-to-play mobile games, only a small fraction of players buy anything ([Sifa et al. 2015](https://doi.org/10.1609/aiide.v11i1.12788)). And a small group can bring much of the money ([Chen et al. 2018](https://doi.org/10.1109/BigData.2018.8622151)).

For a designer, my framing (grade C): "how much will this player spend" is really two questions. Will they pay at all? And if so, how much?

<!-- break -->

How concentrated can spend be? One figure from a journal paper comes from surveys.

[Close and colleagues](https://doi.org/10.1016/j.addbeh.2021.106851) pooled open survey data from 7,767 people who buy loot boxes. The top 5% of spenders, those over $100 a month, made up half of the loot box revenue.

Hold two limits next to that figure. These are survey answers from loot box buyers, not sales records from games. And they cover loot boxes only.

```sure
I read only the abstract of the published paper (the PubMed record, through Europe PMC). It words the result with care: disproportionate revenue "appears to be generated" from high-level spenders. It calls its own method a secondary analysis of self-report data. The "under $20" in the opening question sits in the abstract's introduction, as background, not as a result of the pooled data.
```

```visual
id: gd-econ/spend-skew/v1
kind: dot-grid
title: "5 in every 100 loot box buyers, half of the loot box revenue"
text: "In pooled survey data on 7,767 loot box buyers, the top 5% of spenders made up half of loot box revenue. The grid shows that share as 5 buyers in 100. Self-reported survey answers, loot boxes only."
total: 100
marked: 5
marked_label: "top 5% of buyers: half of loot box revenue"
rest_label: "the other 95%: the other half"
```

```check
id: gd-econ/spend-skew/c1
prompt: "The top 5% made up half of loot box revenue. Five percent of whom?"
options:
  - text: "Of all players of the games."
    why: "The surveys pooled people who buy loot boxes. Players who never buy one are not in the 7,767."
  - text: "Of the people who buy loot boxes, by their own survey answers."
    correct: true
    why: "The pooled data is 7,767 loot box buyers, and the spending is self-reported. It is not a share of all players, and not a sales record."
```

<!-- break -->

A second figure comes from one studio. [Chen and colleagues](https://doi.org/10.1109/BigData.2018.8622151) worked at Yokozuna Data, a Keywords Studio, and studied the mobile role-playing game Age of Ishtaria.

They write that whales, the top spenders, are "around 2%" of all players and "may provide up to 50%" of a game's revenue.

The paper shows no count behind the 2%. So it is the authors' statement, not a measured result (grade B).

```sure
The paper sets its whale line from the first months of data: players are sorted by what they spent in a given month, and the line is drawn where cumulative spend reaches 50% of the total revenue. It repeats this for a number of months and averages the thresholds. No table gives how many whales there were. The paper was published at IEEE Big Data 2018; I read the full text as [arXiv:1811.12799](https://arxiv.org/abs/1811.12799).
```

<!-- break -->

Is spend this concentrated in every game? A study of real transactions found the spread differs widely between games.

[Zendle and colleagues](https://doi.org/10.1145/3582927) analysed $4.7 billion of in-game spending by about 69 million players of 2,873 mobile games. They report diverse revenue distributions across those games.

At one end is a "uniform" cluster, where all spenders spend roughly similar amounts. At the other are "hyper-Pareto" games, where about 38% of revenue comes from 1% of spenders.

Note the group: 1% of spenders, not of all players. So this figure cannot be set beside the 2% above.

My reasoning, grade C: a concentration figure from one paper or one game, the 2% whale figure included, should not be assumed for another game.

```sure
I read only the abstract of the Zendle paper, from the OpenAlex record of the published version. The exact figures there are $4.7B, 69,144,363 players, 2,873 games and 624 days. The abstract does not say how many games fall in each cluster. The ACM page refused automated access, so I did not open the full text or the journal's own statement of its review process. One of its authors, Drachen, is also an author of the Sifa paper.
```

```check
id: gd-econ/spend-skew/c2
prompt: "A colleague says: whales are 2% of players and bring half the revenue, so plan our new game on that. What does the lesson say?"
options:
  - text: "A study of 2,873 mobile games found revenue spread from near uniform to extreme, so a single figure should not be assumed for every game."
    correct: true
    why: "The spread across games is from the study's abstract. That a single figure should not be assumed for every game is the lesson's own reasoning, grade C."
  - text: "That is safe: the 2% figure was measured across thousands of games."
    why: "The 2% figure is stated in a paper on one game, with no count behind it. The study of thousands of games found widely different spreads."
```

<!-- break -->

One paper models purchases in two steps.

[Sifa and colleagues](https://doi.org/10.1609/aiide.v11i1.12788) used a dataset of 100,000 players and built two models. A classifier predicts whether a purchase will occur. A regression predicts the number of purchases a user will make.

Both are presented within a decision and regression tree framework, for building rules a company can act on. The paper is in the AIIDE 2015 proceedings.

```sure
I read only the abstract of the Sifa paper, through the OpenAlex record. The AAAI page and PDF sit behind a bot check. So I did not see which game it used, what share of its players paid, or whether the second model was fitted on payers only. The abstract's first sentence is where "only a small fraction of the players makes any purchases" comes from.
```

```check
id: gd-econ/spend-skew/c3
prompt: "Which two models did Sifa and colleagues build?"
options:
  - text: "One model that predicts each player's total spend in dollars."
    why: "The abstract describes two models, and neither predicts a dollar amount: one predicts whether a purchase occurs, the other the number of purchases."
  - text: "A classifier for whether a purchase will occur, and a regression for the number of purchases."
    correct: true
    why: "That is how the abstract describes them. Reading the pair as will they pay, and if so how much, is the lesson's framing, grade C."
```

<!-- break -->

And lifetime value? [Chen and colleagues](https://doi.org/10.1109/BigData.2018.8622151) compared deep neural networks with parametric models such as Pareto/NBD.

Both neural networks beat the parametric models, and the two networks gave almost identical results.

The abstract singles out convolutional networks as the most efficient, and as well suited to spotting future whales early. This is one game.

## Why

### gd-econ/spend-skew/why · why

Why is average revenue per user a poor summary of a free-to-play game's players, and why does it make LTV forecasts fragile? Answer before opening.

<details>
<summary>Model answer</summary>
The average mixes a large group at zero with a handful of very large spenders, so it describes almost nobody. A few big spenders joining or leaving moves it a lot, which makes LTV estimates from small cohorts swing from week to week. Splitting the question in two describes each group better. Sifa and colleagues built two models: one for whether a purchase will occur, one for how many purchases a user will make. Apart from that description of the Sifa models, this answer is my reasoning, grade C.
</details>

```points
for: gd-econ/spend-skew/why
points:
  - "The average mixes a large group at zero with a handful of very large spenders, so it describes almost nobody (the lesson's reasoning, grade C)."
  - "A few big spenders joining or leaving moves it a lot, so LTV estimates from small cohorts swing (the lesson's reasoning, grade C)."
  - "Splitting the question in two, whether a purchase occurs and how many follow, describes each group better (the lesson's reasoning, grade C)."
```

## Scenario

### gd-econ/spend-skew/scenario · scenario

User acquisition wants a day-3 LTV prediction to set bids per channel. A small test channel shows predicted LTV three times higher than the main one, based on 400 installs. The UA manager wants to move budget there. What do you check first?

<details>
<summary>Explained answer</summary>
Check how many payers sit behind that number. With spend this concentrated, 400 installs may hold only a few payers, and one large spender can triple a channel's average on its own. Look at the conversion rate and the spend per payer separately, and at how the estimate moves if the top spender is removed. If it collapses, the channel needs more installs before the budget moves. All of this is my reasoning from the skew the sources describe, grade C.
</details>

```points
for: gd-econ/spend-skew/scenario
points:
  - "Check how many payers sit behind the number: 400 installs may hold only a few (the lesson's reasoning, grade C)."
  - "Look at the conversion rate and the spend per payer separately (the lesson's suggestion, grade C)."
  - "See how the estimate moves if the top spender is removed; if it collapses, wait for more installs (the lesson's suggestion, grade C)."
```

## Recall

### gd-econ/spend-skew/r1 · recall

What two models did Sifa and colleagues build for purchase prediction?

<details>
<summary>Answer</summary>
A classifier for whether a player will make a purchase, and a regression for how many purchases they will make.
</details>

### gd-econ/spend-skew/r2 · recall

In the pooled loot box surveys, what share of buyers made up half of loot box revenue, and how much did they spend?

<details>
<summary>Answer</summary>
The top 5%, who spent over $100 a month. This is self-reported survey data on loot boxes only.
</details>

### gd-econ/spend-skew/r3 · recall

Which model types did Chen and colleagues compare for lifetime value, and which did best?

<details>
<summary>Answer</summary>
Deep neural networks against parametric models such as Pareto/NBD. The neural networks did better, with the two network types almost tied; the abstract names convolutional networks as the most efficient.
</details>

## Sources and grades

- [Close et al. 2021, Addictive Behaviors](https://doi.org/10.1016/j.addbeh.2021.106851), abstract of the published version read (PubMed record, through Europe PMC). Grade A, tier 1. The top 5% and $100 figures are from the abstract. The "under $20" line is the abstract's background, not a pooled result.
- [Sifa et al. 2015, AIIDE](https://doi.org/10.1609/aiide.v11i1.12788), abstract only, read through the OpenAlex record of the publisher abstract. Grade A for the abstract, tier 1. The AAAI page and PDF sit behind a bot check, so the paper's own share of paying players, which game it used and whether the second model was fitted on payers only are not given.
- [Chen et al. 2018, IEEE Big Data](https://doi.org/10.1109/BigData.2018.8622151), full text read as [arXiv:1811.12799](https://arxiv.org/abs/1811.12799), which lists this DOI as the published version. Grade A, tier 1 for the method and results. Grade B for the "around 2%, up to 50%" whale figure, which the paper states without the count behind it.
- [Zendle et al. 2023, ACM Games: Research and Practice](https://doi.org/10.1145/3582927), abstract of the published version read from the OpenAlex record. Grade A for the abstract's claims only. Tier 1 as an article in an ACM journal, but I could not open the journal's own statement of its review process, so that tier is not confirmed. The full text was not read.
- Cut: the Swrve press release figures from the earlier draft. A vendor press release can't carry a fact under this course's standard.
- The three concentration figures count different groups: loot box buyers in surveys (Close), all players as one studio states it (Chen), and spenders in transaction records (Zendle). They are not comparable with each other.
