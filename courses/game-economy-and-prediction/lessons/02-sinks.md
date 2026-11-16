---
id: gd-econ/sinks
course: gd-econ
title: Sinks move prices, not only remove value
order: 2
status: draft
sources:
  - cite: "Hogan-Hennessy, Xenopoulos, Silva (2022). Market Interventions in a Large-Scale Virtual Economy. arXiv:2210.07970."
    url: https://arxiv.org/abs/2210.07970
    grade: A
    tier: 2
    note: preprint, not peer-reviewed; no published version found
---

# Lesson 2: Sinks move prices, not only remove value

## Opening question

### gd-econ/sinks/open · open

In December 2021, Old School RuneScape added a 1% tax on sales in its player market (the Grand Exchange) and used the tax money to buy expensive high-level items from players and delete them. Guess: did the tax cut trading, and what happened to the prices of the deleted items?

<details>
<summary>Answer</summary>
The tax barely changed trading volume, and the prices of the targeted items went up. The details are below.
</details>

## The idea

A sink does not just take value out of an economy. Where it takes it from decides whose prices move.

The evidence here is one study, [Hogan-Hennessy, Xenopoulos and Silva 2022](https://arxiv.org/abs/2210.07970). It is a preprint on arXiv and has not been peer-reviewed, so treat it as a careful analysis that no journal has checked yet.

Jagex's stated worry was that high-level items had become too common. Its two-part fix: a 1% tax on Grand Exchange sales above 100 GP, capped at 5 million GP per sale and paid out of the seller's proceeds; and an item sink that spends the tax money buying selected high-level items on the market and deleting them, up to a daily maximum Jagex sets. The first round targeted 34 items, the second, a week later, 27 more.

The researchers [compared the targeted items](https://arxiv.org/abs/2210.07970) against a control group of similarly expensive items whose prices didn't move with them. Prices of the first 34 items jumped about 7% (95% interval 5.0 to 9.6%), the next 27 about 14.4% (11.9 to 16.9%). Trading volume of those items did not change meaningfully. The tax had no detectable effect on volume at the 100 GP threshold. Around the 500 million GP point, where the cap starts to bite, it cut volume by about 6.9%, but the interval runs from 1 to 13%, so that estimate is loose. Prices for illicit gold from real-money traders did not change either.

So a buy-and-delete sink worked like a large buyer entering the market: more demand, higher prices. If the goal was to make these items rarer and dearer, that worked. The [authors note](https://arxiv.org/abs/2210.07970) Jagex never stated its goal, so whether the change "succeeded" can't be judged. Their data also has no player-level records, so the study can't say how individual players changed their behaviour.

## Why

### gd-econ/sinks/why · why

Why would a sink that removes items raise their price rather than leave it alone? Answer before opening.

<details>
<summary>Model answer</summary>
The sink buys on the open market, so it adds demand, and each deleted item also lowers the supply left for players. Both push the price up, which the authors call standard economic theory. A sink that simply destroyed currency, such as a repair fee, would work through a different route: less money chasing the same goods.
</details>

## Scenario

### gd-econ/sinks/scenario · scenario

You run a tabletop campaign with a player-run market for magic items. Rare items have piled up and nothing feels special. You consider a guild that buys rare items at market price and locks them away. A player warns this will make rare items unaffordable for the newest character. Are they right, and what would you watch?

<details>
<summary>Explained answer</summary>
Probably right, in direction. In the RuneScape case the targeted items rose 7 to 14% in price, so a buyer that removes goods raises their price for everyone, newcomers included. Whether that is a problem depends on your goal: if the goal is that rare items feel rare, rising prices are the point. Watch the price of the targeted items against similar items you didn't target, the way the paper did, and keep a cheaper route for newcomers if access matters to you. The step from an MMO with tens of thousands of players to a table of five is my inference, grade C; a small market has thin trade and prices can jump on a single sale.
</details>

## Recall

### gd-econ/sinks/r1 · recall

How did the OSRS item sink get its money, and what did it do with the items?

<details>
<summary>Answer</summary>
From the 1% Grand Exchange sales tax. It bought targeted high-level items from players on the market and deleted them, up to a daily cap.
</details>

### gd-econ/sinks/r2 · recall

Roughly how much did the targeted items' prices rise in the two rounds?

<details>
<summary>Answer</summary>
About 7% in the first round and about 14% in the second, against a control group.
</details>

### gd-econ/sinks/r3 · recall

Did the tax reduce trading volume?

<details>
<summary>Answer</summary>
Not detectably at the 100 GP threshold. Near the 500 million GP cap point the estimate was a 6.9% drop, with a wide interval of 1 to 13%.
</details>

## Sources and grades

- [Hogan-Hennessy, Xenopoulos and Silva 2022, arXiv:2210.07970](https://arxiv.org/abs/2210.07970), full text read (arXiv PDF). Grade A for what the paper reports. Tier 2: a preprint by named university researchers, not peer-reviewed. A Crossref search found no published version. Every figure here was checked against the PDF. It is a natural experiment (difference-in-differences and regression discontinuity), not a randomized test, so its causal claims rest on the control group being a fair comparison.
- The tabletop transfer in the scenario is my inference, grade C.
