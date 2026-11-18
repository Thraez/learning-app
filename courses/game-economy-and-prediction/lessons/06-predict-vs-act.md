---
id: gd-econ/predict-vs-act
course: gd-econ
title: Predicting who leaves is not knowing what keeps them
order: 6
status: draft
sources:
  - cite: "Runge, Gao, Garcin, Faltings (2014). Churn prediction for high-value players in casual social games. IEEE CIG 2014. DOI 10.1109/CIG.2014.6932875."
    url: https://doi.org/10.1109/CIG.2014.6932875
    grade: A
    tier: 1
    read: "abstract only, OpenAlex record"
    caveat: "Abstract only; effect sizes, sample sizes and game names not seen."
    note: abstract only, read from the OpenAlex record; IEEE Xplore was not opened
  - cite: "Zivic, Andjelkovic, Ozden, Dekic, Castronova (2017). Results of a massive experiment on virtual currency endowments and money demand. PLOS ONE 12(10): e0186407."
    url: https://doi.org/10.1371/journal.pone.0186407
    grade: A
    tier: 1
    read: "full text, publisher PDF"
    caveat: "Used here only for one comparison sentence."
    note: full text read for lesson 1; used here for one comparison sentence
---

# Lesson 6: Predicting who leaves is not knowing what keeps them

## Opening question

### gd-econ/predict-vs-act/open · open

In 2014, [Julian Runge and colleagues](https://doi.org/10.1109/CIG.2014.6932875) built a churn model for high-value players in two casual social games with millions of players each. Then they ran an A/B test in one game, using free in-game currency as an incentive to keep players. Guess: did the gift lower churn or raise spending?

<details>
<summary>Answer</summary>
Neither. The free currency had no significant effect on churn or on spending.
</details>

## The idea

A churn model tells you who is likely to leave. It does not tell you what will make them stay. That needs its own test.

[Runge and colleagues](https://doi.org/10.1109/CIG.2014.6932875) (peer-reviewed at IEEE CIG 2014) compared four common classifiers on the two games and added a hidden Markov model to track changes over time. A neural network had the best AUC. Then, to gauge the business value of churn prediction, they ran an A/B test. The abstract's finding: giving out free in-game currency did not significantly change churn or monetization. One thing did help: contacting players shortly before the predicted churn point "substantially improves" how well the communication works.

From this the authors suggest that players can only be kept by "remarkably changing their gameplay experience" before they would leave, and pointing them to the studio's other games may work better than trying to hold them. The abstract even lists, as a last resort, passing leaving players on to other companies through in-game ads. These are the authors' suggestions; the test covered one kind of gift in one game.

Compare lesson 1. In [Top Eleven](https://doi.org/10.1371/journal.pone.0186407), more free currency at the start raised day-7 retention. Here, free currency in an A/B test had no significant effect on churn or spending. Same lever, a different game and moment, a different result. That is the case for testing each intervention on the group you will use it on. (The comparison across the two studies is my inference, grade C.)

## Why

### gd-econ/predict-vs-act/why · why

Why can a model that predicts churn well still be useless for deciding who should get a retention offer? Answer before opening.

<details>
<summary>Model answer</summary>
Being likely to leave and being moved by an offer are different things. Some flagged players will leave whatever you do, some would have stayed anyway, and only the ones in between are worth an offer. A churn model ranks the first property, not the second. Finding the movable group needs an experiment, or a model trained on experiment results, called uplift modelling. Lesson 8 covers it with sources; this framing here is my summary, grade C.
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

What effect did free in-game currency have in the A/B test?

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
Cross-promote the studio's other games to them, or change their game experience a lot before they would leave.
</details>

## Sources and grades

- [Runge et al. 2014, IEEE CIG](https://doi.org/10.1109/CIG.2014.6932875), abstract read from the OpenAlex record; I did not open IEEE Xplore. Grade A for its claims, tier 1 (peer-reviewed). The full paper is paywalled and was not opened, so effect sizes, sample sizes per arm and the games' names are not given.
- Cut: a Game Developer trade-press write-up of the same work. It was the only source for the games' names and for the claim that the model-picked group did no better than a rule-picked group, so both claims are gone.
- [Zivic et al. 2017, PLOS ONE](https://doi.org/10.1371/journal.pone.0186407), full text read for lesson 1 (publisher PDF). Grade A, tier 1. Used here only for the one-sentence comparison with Top Eleven.
- Two casual games, one kind of gift, tested in one of the games. I found few other published tests of retention offers in games (my search, grade C), so this result can't be generalised far.
