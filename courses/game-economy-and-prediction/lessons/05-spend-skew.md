---
id: gd-econ/spend-skew
course: gd-econ
title: Spend is mostly zero and very concentrated
order: 5
status: draft
sources:
  - cite: "Sifa, Hadiji, Runge, Drachen, Kersting, Bauckhage (2015). Predicting Purchase Decisions in Mobile Free-to-Play Games. AIIDE 2015, pp. 79-85."
    url: https://ojs.aaai.org/index.php/AIIDE/article/view/12788
    grade: A
    note: abstract
  - cite: "Swrve press releases, January and July 2014 monetization reports."
    url: https://www.prnewswire.com/news-releases/swrve-finds-015-of-mobile-gamers-contribute-50-of-all-in-game-revenue-247246771.html
    grade: B
  - cite: "Chen, Guitart, Fernández del Río, Periáñez (2018). Customer Lifetime Value in Video Games Using Deep Learning and Parametric Models. IEEE Big Data 2018; arXiv:1811.12799."
    url: https://arxiv.org/abs/1811.12799
    grade: A
    note: B for the 2% and 50% revenue figure, which the abstract does not source
---

# Lesson 5: Spend is mostly zero and very concentrated

## Opening question

### gd-econ/spend-skew/open · open

A mobile analytics vendor looked at one month of in-app purchases across many free-to-play games in early 2014. Guess: what share of players brought in half of that month's in-game revenue?

<details>
<summary>Answer</summary>
0.15%, according to Swrve's January 2014 report. That is about one player in 670. The grade is B; see below.
</details>

## The idea

In free-to-play, most players spend nothing and a tiny group brings most of the money. So "how much will this player spend" is really two questions: will they pay at all, and if so, how much.

The figures on concentration come mostly from industry, not peer review. Swrve's press releases (grade B) reported that 0.15% of players brought 50% of in-game revenue in January 2014, and that by July 2014, 0.13% brought 62%, with only 1.35% of players paying at all. Chen and colleagues' 2018 abstract says "up to 50%" of free-to-play revenue comes from "around 2%" of players, but gives no source for the figure there (grade B). The numbers differ a lot because they measure different things over different games and windows. What they agree on is the shape: mostly zeros, then a very long tail.

That shape drives how spend is modelled. Sifa and colleagues (AIIDE 2015, 100,000 players from a Wooga puzzle game) split the problem in two: a classifier for whether a player will purchase, and a regression for how many purchases a payer will make, both as decision and regression trees so the rules could be acted on. Chen and colleagues compared deep neural networks with Pareto/NBD, a classic parametric model of customer purchases, for predicting lifetime value, and report that convolutional networks did best and were well suited to spotting future high spenders early.

## Why

### gd-econ/spend-skew/why · why

Why is average revenue per user a poor summary of a free-to-play game's players, and why does it make LTV forecasts fragile? Answer before opening.

<details>
<summary>Model answer</summary>
The average mixes a large group at zero with a handful of very large spenders, so it describes almost nobody. A few big spenders joining or leaving moves it a lot, which makes LTV estimates from small cohorts swing from week to week. Splitting into "will pay" and "how much, given they pay", as Sifa and colleagues did, describes each group better. The fragility argument is my reasoning, grade C.
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

In Swrve's July 2014 report, what share of players paid at all?

<details>
<summary>Answer</summary>
1.35%. Grade B, from a press release.
</details>

### gd-econ/spend-skew/r3 · recall

Which model types did Chen and colleagues compare for lifetime value, and which did best?

<details>
<summary>Answer</summary>
Deep neural networks against parametric models such as Pareto/NBD. Convolutional neural networks did best in their study.
</details>

## Sources and grades

- Sifa et al. 2015, abstract read on a DFKI publication page, and dataset details from a search digest of the paper. Grade A for the abstract. The paper's own figures (for example its share of paying players) were not read, so none are given.
- Swrve 2014 figures, press releases seen through search results. Grade B. A vendor's own data, one month per report, not peer reviewed.
- Chen et al. 2018, abstract read on arXiv. Grade A for the method and result claims, B for the "2% bring up to 50%" figure, which has no source in the abstract.
- Up-to-date, peer-reviewed figures on spend concentration are scarce. Most current numbers are private or come from vendors.
