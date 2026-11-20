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
    caveat: "Abstract only; one A/B test in one game; effect sizes, sample sizes and game names not seen."
    note: abstract only, read from the OpenAlex record; IEEE Xplore was not opened
  - cite: "Zivic, Andjelkovic, Ozden, Dekic, Castronova (2017). Results of a massive experiment on virtual currency endowments and money demand. PLOS ONE 12(10): e0186407."
    url: https://doi.org/10.1371/journal.pone.0186407
    grade: A
    tier: 1
    read: "full text, publisher PDF"
    caveat: "Used here only for one comparison; one study, one game."
    note: full text read for lesson 1; used here for one comparison
  - cite: "Li, Lu, Wang, Ma, Zhang, Zhao, Qi, Liu, Ma (2021). A Difficulty-Aware Framework for Churn Prediction and Intervention in Games. ACM KDD 2021, pp. 943-952. DOI 10.1145/3447548.3467277."
    url: https://doi.org/10.1145/3447548.3467277
    grade: A
    tier: 1
    read: "abstract only, OpenAlex record"
    caveat: "Abstract only; one puzzle game; no figures seen."
    note: abstract only, read from the OpenAlex record; the full text was not opened
---

# Lesson 6: Predicting who leaves is not knowing what keeps them

## Opening question

### gd-econ/predict-vs-act/open · open

In 2014, [Julian Runge and colleagues](https://doi.org/10.1109/CIG.2014.6932875) built a churn model for high-value players in two casual social games with millions of players each. Then they ran an A/B test in one game, using free in-game currency as an incentive to keep players. Guess: did the gift lower churn or raise spending?

<details>
<summary>Answer</summary>
Not in any way the test could show. The free currency had no significant effect on churn or on spending.
</details>

```decide
id: gd-econ/predict-vs-act/d1
prompt: "Your churn model flags high-value players who are likely to leave soon. Marketing has free in-game currency to hand out. What do you do with the list?"
options:
  - text: "Give every flagged player the free currency."
    outcome: "In the one A/B test this lesson has, in one casual social game, giving out free in-game currency did not significantly change the churn rate or the players' spending."
  - text: "Give it to a random part of the flagged players and compare with the rest."
    outcome: "This is the kind of test Runge and colleagues ran: an A/B test in one of their two games. It is how they learned that the gift had no significant effect."
  - text: "Contact flagged players shortly before the predicted leaving point."
    outcome: "The abstract says contacting players shortly before the predicted churn event substantially improves the effectiveness of communication with players. It gives no figure."
```

## The idea

A churn model tells you who is likely to leave. It does not tell you what will make them stay.

That second question needs its own test. This framing is mine (grade C); the study below is the case behind it.

<!-- break -->

The study. [Runge and colleagues](https://doi.org/10.1109/CIG.2014.6932875) worked on high-value players of two casual social games, each with millions of players.

They compared four common classification algorithms. A neural network had the best AUC, a standard score for how well a model ranks players.

The paper is peer-reviewed (IEEE CIG 2014).

```sure
I read only the abstract, from the OpenAlex record. The full paper is paywalled and I did not open it. So this lesson has no AUC value, no sample sizes, no size for any effect and no names for the two games. The abstract also says the authors implemented a hidden Markov model to address changes over time. The one-line gloss of AUC is mine, not the abstract's.
```

<!-- break -->

Then they tested what the model was for. In one of the games they ran an A/B test, with free in-game currency as the incentive to stay.

The result: giving out free currency did not significantly change the churn rate or the players' spending.

Read that with care. "Not significant" means any difference was too small to tell from chance in this test. It does not prove the gift does nothing (my note on reading such a result, grade C).

```check
id: gd-econ/predict-vs-act/c1
prompt: "The free currency did not significantly change churn. Which reading is right?"
options:
  - text: "Any difference was too small to tell from chance in this test."
    correct: true
    why: "That is what not significant means. The abstract gives no effect size, so the lesson cannot say how small."
  - text: "The test proved that free currency never affects churn."
    why: "One A/B test in one game cannot show that. A result that is not significant is not proof of no effect, and the test covered one kind of gift."
```

<!-- break -->

One thing did help. Contacting players shortly before the predicted churn point "substantially improves" the effectiveness of communication with them.

So the model was useful for timing a message. The abstract gives no figure for how much.

<!-- break -->

What do the authors make of it? They write that the results suggest players can only be kept by "remarkably changing their gameplay experience" before they would leave.

They add that pointing players to the studio's other games "may be the more effective measure".

These are the authors' suggestions, not test results. The test covered one kind of gift in one game.

```sure
The abstract opens by listing three things a studio can do with a churn prediction: give players an incentive to stay, cross-link them to other games in the company's portfolio, or "as a last resort" pass them on to other companies through in-game advertisement. Only the incentive was tested, as far as the abstract says.
```

```check
id: gd-econ/predict-vs-act/c2
prompt: "Which of these did the A/B test actually measure?"
options:
  - text: "That cross-promoting the studio's other games keeps players better than gifts."
    why: "The authors say cross-linking may be the more effective measure. That is their suggestion; the abstract reports no test of it."
  - text: "That free in-game currency did not significantly change churn or spending."
    correct: true
    why: "That is the test result in the abstract. The advice about changing the game experience and cross-linking is what the authors suggest from it."
```

<!-- break -->

Now compare two other tests.

In lesson 1, a [bigger starting grant in Top Eleven](https://doi.org/10.1371/journal.pone.0186407) came with higher day-7 retention: 6.9% and 7.7% higher, both relative rises, both significant.

In [one puzzle game](https://doi.org/10.1145/3447548.3467277), Li and colleagues adjusted difficulty to the player. Their abstract says an A/B test showed significantly better retention and engagement. I read only that abstract, and it gives no figures.

<!-- break -->

Three tests, three games, three different moments and players. They cannot be compared head to head.

My reasoning, grade C: together they are the case for testing each intervention on the group you will use it on. A lever that worked elsewhere has not been shown to work for your players.

One more limit. The free-currency result is a single A/B test. This course's own search of later papers found no second test of free currency against churn. That search scanned titles and abstracts, so it can have missed one.

## Why

### gd-econ/predict-vs-act/why · why

Why can a model that predicts churn well still be useless for deciding who should get a retention offer? Answer before opening.

<details>
<summary>Model answer</summary>
Being likely to leave and being moved by an offer are different things. Some flagged players will leave whatever you do, some would have stayed anyway, and only the ones in between are worth an offer. A churn model ranks the first property, not the second. Finding the movable group needs an experiment, or a model trained on experiment results, called uplift modelling. Lesson 8 covers it with sources; this framing here is my summary, grade C.
</details>

```points
for: gd-econ/predict-vs-act/why
points:
  - "Being likely to leave and being moved by an offer are different things (the lesson's summary, grade C)."
  - "Some flagged players will leave whatever you do and some would have stayed anyway."
  - "A churn model ranks who is likely to leave, not who an offer would change."
  - "Finding the movable group needs an experiment, or a model trained on experiment results."
```

## Scenario

### gd-econ/predict-vs-act/scenario · scenario

Outside games: a gym chain's model flags members likely to cancel next month, and marketing wants to send all of them a free month. What would you ask for before it goes out?

<details>
<summary>Explained answer</summary>
A holdout. Send the offer to a random part of the flagged members and nothing to the rest, then compare cancellations. Without it, any drop could just be people who would have stayed anyway, and the free month costs real money for each of them. Also try timing, since Runge and colleagues report that contact shortly before the predicted leaving point made communication more effective. The gym case is a transfer of the game result, grade C.
</details>

```points
for: gd-econ/predict-vs-act/scenario
points:
  - "A holdout: the offer to a random part of the flagged members, nothing to the rest, then compare cancellations."
  - "Without it, a drop could just be people who would have stayed anyway."
  - "Try timing too: in the game study, contact shortly before the predicted leaving point made communication more effective."
  - "The gym case is a transfer of the game result, the lesson's own, grade C."
```

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
- [Zivic et al. 2017, PLOS ONE](https://doi.org/10.1371/journal.pone.0186407), full text read for lesson 1 (publisher PDF). Grade A, tier 1. Used here only for the comparison with Top Eleven.
- [Li et al. 2021, ACM KDD](https://doi.org/10.1145/3447548.3467277), abstract read from the OpenAlex record. Grade A for the abstract's claims only, tier 1 (conference paper). One puzzle game; the abstract gives no retention figures and the full text was not opened.
- Two casual games, one kind of gift, tested in one of the games. The search for a second test of free currency against churn was this course's own (the course-level check of 2026-11-19, by titles and abstracts), grade C, so "none found" is not "none exists".
