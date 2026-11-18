---
id: gd-econ/sinks
course: gd-econ
title: Sinks move prices, not only remove value
order: 2
status: draft
checked: 2026-11-18
sources:
  - cite: "Hogan-Hennessy, Xenopoulos, Silva (2022). Market Interventions in a Large-Scale Virtual Economy. arXiv:2210.07970."
    url: https://arxiv.org/abs/2210.07970
    grade: A
    tier: 2
    read: "full text, arXiv PDF with Table A1"
    caveat: "Preprint, not peer-reviewed; one game; a natural experiment, not randomized."
    note: preprint, not peer-reviewed; no published version found
---

# Lesson 2: Sinks move prices, not only remove value

## Opening question

### gd-econ/sinks/open · open

In December 2021, Old School RuneScape added a 1% tax on sales in its player market (the Grand Exchange) and used the tax money to buy expensive high-level items from players and delete them ([Hogan-Hennessy et al. 2022](https://arxiv.org/abs/2210.07970), a preprint). Guess: did the tax cut trading, and what happened to the prices of the deleted items?

<details>
<summary>Answer</summary>
The tax barely changed trading volume, and the prices of the targeted items went up. The details are below.
</details>

```predict
id: gd-econ/sinks/p1
prompt: "What do you think: by how much did the prices of the first 34 targeted items rise, against a control group?"
unit: "%"
min: 0
max: 30
step: 1
answer: 7
answer_text: "About 7% higher, against a control group."
reveal: "The first 34 targeted items rose about 7% against a control group of similarly expensive items (95% interval 5.0 to 9.6%). This is a natural experiment in a preprint, not a randomized test, so it holds only if the control group is a fair comparison."
covers: gd-econ/sinks/r2
visual: gd-econ/sinks/v1
```

```decide
id: gd-econ/sinks/d1
prompt: "You run the economy of a large online game. High-level items have become too common, and a new sales tax brings in money you can spend. What do you do with it?"
options:
  - text: "Buy selected high-level items on the market and delete them, up to a daily maximum."
    outcome: "This is what Jagex did. The targeted items' prices rose about 7% in round one, and in round two by 14.4% in the paper's text or about 15.8% by this lesson's conversion of the table. A natural experiment in a preprint."
  - text: "Collect the 1% tax and do nothing with the money."
    outcome: "The study measured the tax on its own for trading volume: no detectable effect at the 100 GP threshold, and about a 6.9% drop near the 500 million GP cap point (interval 1 to 13%). The lesson reports nothing on item rarity under the tax alone."
  - text: "Do nothing and let the market settle."
    outcome: "This lesson has no evidence on it."
```

## The idea

A sink does not only take value out of an economy. It can also move prices, and which prices depends on what the sink takes. That is my reading of one case (grade C), not a rule the paper states.

The case: a sink that bought items off the market acted like a big new buyer, and the price of what it bought went up.

<!-- break -->

The evidence is one study of Old School RuneScape, by [Hogan-Hennessy, Xenopoulos and Silva](https://arxiv.org/abs/2210.07970). It is a preprint: no journal has checked it yet.

It is also a comparison made after the fact, not a randomized test. Keep both in mind for every figure below.

<!-- break -->

What Jagex did. [Its stated worry](https://arxiv.org/abs/2210.07970) was that high-level items had become too common. The fix had two parts.

A tax: 1% on Grand Exchange sales above 100 GP, capped at 5 million GP per sale and paid out of the seller's proceeds.

An item sink: the tax money buys selected high-level items on the market and deletes them, up to a daily maximum Jagex sets. The first round targeted 34 items. A second round, a week later, added 27 more.

<!-- break -->

What happened to prices? The researchers [compared the targeted items](https://arxiv.org/abs/2210.07970) against a control group: similarly expensive items whose prices didn't move with them.

Against that group, the first 34 items rose about 7%. The figure holds only if the control items were a fair comparison.

```sure
The 95% interval for round one runs from 5.0 to 9.6%. The study is a natural experiment: it compares targeted items with control items before and after the change, and the researchers did not assign items at random.
```

```check
id: gd-econ/sinks/c1
prompt: "What does the control group of similarly expensive items do in this study?"
options:
  - text: "It proves the sink caused the price rise."
    why: "This is a natural experiment, not a randomized test, so the estimate holds only if the control items were a fair comparison."
  - text: "It shows what prices did without the sink, so the targeted items' jump is read against it."
    correct: true
    why: "The researchers compared the targeted items against control items whose prices did not move with them. The result holds only if those control items were a fair comparison."
```

<!-- break -->

The estimate for the second round is higher, but how high depends on where you look. [The paper's text](https://arxiv.org/abs/2210.07970) says 14.4%. Its own appendix table works out to about 15.8%.

The 15.8% is this lesson's conversion of the table, not a figure the paper prints. The paper does not explain the gap.

```sure
The paper's text gives 14.4% with a 95% interval of 11.9 to 16.9%. Its Table A1 lists a coefficient of 0.147 with a standard error of 0.024, which works out to about 15.8% (10.5 to 21.4%). That second figure is my recomputation.
```

```visual
id: gd-econ/sinks/v1
kind: bars
title: "Price rises of the targeted items, with intervals"
text: "Price rises of the targeted items against control, with the intervals the lesson gives: about 7% in round one, 14.4% in round two by the paper's text, and about 15.8% in round two by this lesson's conversion of the table, which the paper does not print. A natural experiment in a preprint."
unit: "%"
rows:
  - label: "Round one, 34 items"
    value: 7
    low: 5.0
    high: 9.6
    note: "about 7%"
  - label: "Round two, 27 items, paper's text"
    value: 14.4
    low: 11.9
    high: 16.9
  - label: "Round two, 27 items, table converted"
    value: 15.8
    low: 10.5
    high: 21.4
    note: "this lesson's arithmetic"
```

```check
id: gd-econ/sinks/c2
prompt: "For round two the paper's text says 14.4% and its table works out to about 15.8%. Which statement is right?"
options:
  - text: "Both are reported. 14.4% is the paper's text. 15.8% is this lesson's conversion of the table's coefficient, which the paper does not print."
    correct: true
    why: "Table A1 lists a coefficient of 0.147 with a standard error of 0.024, and the paper does not explain the gap between the two figures."
  - text: "15.8% is the paper's corrected figure."
    why: "It is the lesson's own recomputation from Table A1. The paper does not print it."
```

<!-- break -->

Did trading in those items dry up? [No change in their trading volume](https://arxiv.org/abs/2210.07970) was detected.

But "not detected" is not "none". The estimates are loose, so a sizeable drop can't be ruled out.

```sure
By my arithmetic from the same Table A1, the estimates allow anything from a 13% drop to an 8% rise in round one, and from a 23% drop to a 19% rise in round two. The paper does not print these ranges.
```

```check
id: gd-econ/sinks/c3
prompt: "The study found no detectable change in the trading volume of the targeted items. What does that tell you?"
options:
  - text: "That the sink had no effect on volume at all."
    why: "No change was detected, but the intervals include sizeable drops, so a real drop cannot be ruled out."
  - text: "Not that volume stayed the same. The estimates are loose, and a sizeable drop cannot be ruled out."
    correct: true
    why: "By the lesson's arithmetic from Table A1, round one runs from a 13% drop to an 8% rise, and round two from a 23% drop to a 19% rise."
```

<!-- break -->

And the tax itself? [At the 100 GP threshold](https://arxiv.org/abs/2210.07970) it had no detectable effect on trading volume.

Around the 500 million GP point, where the cap starts to bite, it cut volume by about 6.9%. That estimate is loose too: the interval runs from 1 to 13%.

No change was detected in prices for illicit gold from real-money traders either.

<!-- break -->

So the buy-and-delete sink worked like a large buyer entering the market: more demand, higher prices.

Was that the goal? The [authors note](https://arxiv.org/abs/2210.07970) that Jagex has not publicly stated what it intended with this round of changes, so whether they "succeeded" can't be judged.

One more limit. The data has no player-level records, so the study can't analyse the effects on player behaviour.

## Why

### gd-econ/sinks/why · why

Why would a sink that removes items raise their price rather than leave it alone? Answer before opening.

<details>
<summary>Model answer</summary>
The sink buys on the open market, so it adds demand, and more demand means a higher price. The authors say this fits standard economic theory. Each deleted item also leaves fewer for players, which should push the same way, but the paper does not name that as a cause of the price rise, so it is my inference, grade C. A sink that simply destroyed currency, such as a repair fee, would work through a different route, less money chasing the same goods. That comparison is also my inference, grade C.
</details>

```points
for: gd-econ/sinks/why
points:
  - "The sink buys on the open market, so it adds demand, and more demand means a higher price."
  - "Each deleted item leaves fewer for players, which should push the same way, but the paper does not name it as a cause (the lesson's inference, grade C)."
  - "A sink that destroys currency, such as a repair fee, works through a different route (the lesson's inference, grade C)."
```

## Scenario

### gd-econ/sinks/scenario · scenario

You run a tabletop campaign with a player-run market for magic items. Rare items have piled up and nothing feels special. You consider a guild that buys rare items at market price and locks them away. A player warns this will make rare items unaffordable for the newest character. Are they right, and what would you watch?

<details>
<summary>Explained answer</summary>
Probably right, in direction. In the RuneScape case the targeted items rose in price, by about 7% in the first round and, in the second, by 14.4% in the paper's text or about 15.8% as this lesson converts its table (the paper does not print that figure). These come from a natural experiment, not a randomized test, so they hold only if the control items were a fair comparison. A buyer that removes goods raises their price for everyone, newcomers included. Whether that is a problem depends on your goal: if the goal is that rare items feel rare, rising prices are the point. Watch the price of the targeted items against similar items you didn't target, the way the paper did, and keep a cheaper route for newcomers if access matters to you. The step from an MMO with tens of thousands of players to a table of five is my inference, grade C; a small market has thin trade and prices can jump on a single sale.
</details>

```points
for: gd-econ/sinks/scenario
points:
  - "Probably right in direction: the targeted items rose in price, about 7% in round one and 14.4% or about 15.8% in round two."
  - "The figures come from a natural experiment, so they hold only if the control items were a fair comparison."
  - "Watch the targeted items against similar items you did not target, and keep a cheaper route for newcomers if access matters."
  - "A table of five has thin trade, so prices can jump on a single sale (the lesson's inference, grade C)."
```

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
About 7% in the first round. For the second, 14.4% by the paper's text; its table prints a coefficient of 0.147, which this lesson converts to about 15.8%, a figure the paper does not print. Both are measured against a control group in a natural experiment, not a randomized test, so they hold only if that control group is a fair comparison.
</details>

### gd-econ/sinks/r3 · recall

Did the tax reduce trading volume?

<details>
<summary>Answer</summary>
Not detectably at the 100 GP threshold. Near the 500 million GP cap point the estimate was a 6.9% drop, with a wide interval of 1 to 13%.
</details>

## Sources and grades

- [Hogan-Hennessy, Xenopoulos and Silva 2022, arXiv:2210.07970](https://arxiv.org/abs/2210.07970), full text read (arXiv PDF). Grade A for what the paper reports. Tier 2: a preprint by named university researchers, not peer-reviewed. A Crossref search found no published version. Every figure here was checked against the PDF. The second-round price figure differs between the paper's text (14.4%) and its Table A1 (0.147, standard error 0.024, about 15.8%); the lesson gives both. The volume ranges for the targeted items are my arithmetic from Table A1. It is a natural experiment (difference-in-differences for the item sink, a regression discontinuity design at the 100 GP threshold and a regression kink design at the cap), not a randomized test, so its causal claims rest on the control group being a fair comparison.
- The tabletop transfer in the scenario and the two supply and currency points in the "why" answer are my inference, grade C.
