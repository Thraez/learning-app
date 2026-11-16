---
id: gd-econ/predict-vs-act
course: gd-econ
title: Predicting who leaves is not knowing what keeps them
order: 6
status: draft
sources:
  - cite: "Runge, Gao, Garcin, Faltings (2014). Churn prediction for high-value players in casual social games. IEEE CIG 2014. DOI 10.1109/CIG.2014.6932875."
    url: https://manuscript.isc.ac/Inventory/49/130212.htm
    grade: A
    note: abstract
  - cite: "Game Developer, Churn prediction and prevention in high value players (write-up of the same work)."
    url: https://www.gamedeveloper.com/business/churn-prediction-and-prevention-in-high-value-players
    grade: B
---

# Lesson 6: Predicting who leaves is not knowing what keeps them

## Opening question

### gd-econ/predict-vs-act/open · open

A team built a churn model for high-value players in two casual social games with millions of players. Then they ran an A/B test: players the model flagged as about to leave got free premium currency. Guess: did the gift lower churn or raise spending?

<details>
<summary>Answer</summary>
No. The free currency had no significant effect on churn or on spending.
</details>

## The idea

A churn model tells you who is likely to leave. It does not tell you what will make them stay. That needs its own test.

Runge and colleagues (2014) compared four classifiers on two casual social games (Diamond Dash and Monster World, per the write-up below) and added a hidden Markov model to track changes over time. A neural network had the best AUC. Then they acted on the predictions in an A/B test. The abstract's finding: giving out free in-game currency did not significantly change churn or monetization. One thing did help: contacting players shortly before the predicted churn point made the communication itself work better. The authors suggest cross-promoting the studio's other games to players who are about to leave, instead of trying to hold them.

A secondary write-up (grade B) adds that in the Monster World test, the group targeted by the model did no better than a group picked by a simple rule.

Compare lesson 1. In Top Eleven, more free currency at the start raised retention. Here, free currency handed to players already on their way out did nothing measurable. Same lever, different players and timing, different result. That is the case for testing each intervention on the group you will use it on. (The comparison across the two studies is my inference, grade C.)

## Why

### gd-econ/predict-vs-act/why · why

Why can a model that predicts churn well still be useless for deciding who should get a retention offer? Answer before opening.

<details>
<summary>Model answer</summary>
Being likely to leave and being moved by an offer are different things. Some flagged players will leave whatever you do, some would have stayed anyway, and only the ones in between are worth an offer. A churn model ranks the first property, not the second. Finding the movable group needs an experiment, or a model trained on experiment results, often called uplift modelling. The uplift framing is mine, grade C; lesson 8 is planned to source it.
</details>

## Scenario

### gd-econ/predict-vs-act/scenario · scenario

Outside games: a gym chain's model flags members likely to cancel next month, and marketing wants to send all of them a free month. What would you ask for before it goes out?

<details>
<summary>Explained answer</summary>
A holdout. Send the offer to a random part of the flagged members and nothing to the rest, then compare cancellations. Without it, any drop could just be people who would have stayed anyway, and the free month costs real money for each of them. Also try timing, since Runge and colleagues found contact shortly before the predicted leaving point worked better. The gym case is a transfer of the game result, grade C.
</details>

## Recall

### gd-econ/predict-vs-act/r1 · recall

What effect did free in-game currency have on players predicted to churn?

<details>
<summary>Answer</summary>
No significant effect on churn or on monetization.
</details>

### gd-econ/predict-vs-act/r2 · recall

What did help, according to the same study?

<details>
<summary>Answer</summary>
Contacting players shortly before the predicted churn point made the communication more effective.
</details>

### gd-econ/predict-vs-act/r3 · recall

What did the authors suggest doing with players likely to leave?

<details>
<summary>Answer</summary>
Cross-promote the studio's other games to them.
</details>

## Sources and grades

- Runge et al. 2014, abstract read on a catalogue mirror. Grade A for its claims. The full paper was not opened, so effect sizes and sample sizes per arm are not given.
- Game Developer write-up of the same work. Grade B for the comparison of the model-picked group with the rule-picked group.
- One studio, two casual games, one kind of incentive. Published tests of retention offers are rare, so this result can't be generalised far.
