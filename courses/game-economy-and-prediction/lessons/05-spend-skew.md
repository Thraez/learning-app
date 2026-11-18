---
id: gd-econ/spend-skew
course: gd-econ
title: Spend is mostly zero and very concentrated
order: 5
status: draft
sources:
  - cite: "Close, Spicer, Nicklin, Uther, Lloyd, Lloyd (2021). Secondary analysis of loot box data: Are high-spending whales wealthy gamers or problem gamblers? Addictive Behaviors 117, 106851. DOI 10.1016/j.addbeh.2021.106851."
    url: https://doi.org/10.1016/j.addbeh.2021.106851
    grade: A
    tier: 1
    read: "abstract only, published abstract"
    caveat: "Abstract only; the full text was not read."
    note: abstract read (PubMed record of the published version)
  - cite: "Sifa, Hadiji, Runge, Drachen, Kersting, Bauckhage (2015). Predicting Purchase Decisions in Mobile Free-to-Play Games. AIIDE 2015, pp. 79-85. DOI 10.1609/aiide.v11i1.12788."
    url: https://doi.org/10.1609/aiide.v11i1.12788
    grade: A
    tier: 1
    read: "abstract only, OpenAlex copy"
    caveat: "Abstract only; game, share of payers and method not seen."
    note: abstract only (the publisher abstract, read through the OpenAlex record); the AAAI page and PDF sit behind a bot check
  - cite: "Chen, Guitart, Fernández del Río, Periáñez (2018). Customer Lifetime Value in Video Games Using Deep Learning and Parametric Models. IEEE Big Data 2018, pp. 2134-2140. DOI 10.1109/BigData.2018.8622151. Read as arXiv:1811.12799."
    url: https://doi.org/10.1109/BigData.2018.8622151
    grade: A
    tier: 1
    read: "full text, arXiv copy"
    caveat: "The 2% and 50% whale figure is stated without the count behind it."
    note: full text read on arXiv; B for the 2% and 50% figure, which the paper states without data
---

# Lesson 5: Spend is mostly zero and very concentrated

## Opening question

### gd-econ/spend-skew/open · open

[Psychologists pooled](https://doi.org/10.1016/j.addbeh.2021.106851) every open survey dataset on loot box buying they could find: 7,767 people who buy loot boxes. Their abstract says monthly spending is typically modest, under $20, as background rather than as a result of the pooled data. Guess: what share of these buyers accounted for half of all the loot box spending?

<details>
<summary>Answer</summary>
The top 5%, the ones spending over $100 a month. One buyer in twenty brought half the money.
</details>

## The idea

In free-to-play, only a small fraction of players buy anything ([Sifa et al. 2015](https://doi.org/10.1609/aiide.v11i1.12788)) and a small group can bring much of the money ([Chen et al. 2018](https://doi.org/10.1109/BigData.2018.8622151)). So "how much will this player spend" is really two questions: will they pay at all, and if so, how much.

I found few good public numbers on this; that is my judgment from the search for this lesson, not a sourced fact. The pooled loot box data comes from [Close and colleagues](https://doi.org/10.1016/j.addbeh.2021.106851), a peer-reviewed secondary analysis of self-report surveys: the top 5% of buyers made up half of loot box revenue. Those are survey answers from loot box buyers, not sales records from games, and they cover loot boxes only. In a paper on the mobile RPG Age of Ishtaria, [Chen and colleagues](https://doi.org/10.1109/BigData.2018.8622151), who worked at Yokozuna Data, a Keywords Studio, define a "whale" by sorting players by monthly spend and drawing the line where the top spenders reach half of the month's revenue. They say whales are "around 2%" of players and "may provide up to 50%" of revenue, but show no count behind the 2%, so that figure is grade B.

That shape drives how spend is modelled. [Sifa and colleagues](https://doi.org/10.1609/aiide.v11i1.12788) (peer-reviewed at AIIDE 2015, a 100,000-player dataset) open with the point that "only a small fraction of the players makes any purchases" and split the problem in two: a classifier for whether a player will purchase, and a regression for the number of purchases a user will make, both as decision and regression trees so the rules could be acted on. [Chen and colleagues](https://doi.org/10.1109/BigData.2018.8622151) compared deep neural networks with Pareto/NBD, a classic statistical model of customer purchases, for predicting lifetime value. Both neural networks beat the parametric models and gave almost identical results; the abstract singles out convolutional networks as the most efficient and well suited to spotting future whales early.

## Why

### gd-econ/spend-skew/why · why

Why is average revenue per user a poor summary of a free-to-play game's players, and why does it make LTV forecasts fragile? Answer before opening.

<details>
<summary>Model answer</summary>
The average mixes a large group at zero with a handful of very large spenders, so it describes almost nobody. A few big spenders joining or leaving moves it a lot, which makes LTV estimates from small cohorts swing from week to week. Splitting the question in two describes each group better. Sifa and colleagues split it into whether a purchase will occur and how many purchases a user will make. The fragility argument is my reasoning, grade C.
</details>

## Scenario

### gd-econ/spend-skew/scenario · scenario

User acquisition wants a day-3 LTV prediction to set bids per channel. A small test channel shows predicted LTV three times higher than the main one, based on 400 installs. The UA manager wants to move budget there. What do you check first?

<details>
<summary>Explained answer</summary>
Check how many payers sit behind that number. With spend this concentrated, 400 installs may hold only a few payers, and one large spender can triple a channel's average on its own. Look at the conversion rate and the spend per payer separately, and at how the estimate moves if the top spender is removed. If it collapses, the channel needs more installs before the budget moves. This follows from the skew the sources describe; the specific check is my suggestion, grade C.
</details>

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
- Cut: the Swrve press release figures from the earlier draft. A vendor press release can't carry a fact under this course's standard. Peer-reviewed figures on spend concentration across many free-to-play games are something I did not find.
