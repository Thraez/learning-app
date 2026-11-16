---
id: gd-econ/eomm
course: gd-econ
title: Matchmaking tuned for engagement
order: 11
status: draft
sources:
  - cite: "Chen, Xue, Kolen, Aghdaie, Zaman, Sun, Seif El-Nasr (2017). EOMM: An Engagement Optimized Matchmaking Framework. WWW 2017. DOI 10.1145/3038912.3052559; arXiv:1702.06820."
    url: https://arxiv.org/abs/1702.06820
    grade: A
---

# Lesson 11: Matchmaking tuned for engagement

## Opening question

### gd-econ/eomm/open · open

In a 1-vs-1 game from Electronic Arts, researchers measured how many players stopped playing for a week after a match, grouped by their last three results. Guess: how much higher was that rate after some runs of losses than after the safest runs?

<details>
<summary>Answer</summary>
Almost double: about 5.1% after some losing runs against 2.6% to 2.7% for the safest ones.
</details>

## The idea

Matchmaking usually aims for fair games. EOMM aims for something else: pick opponents so that as few players as possible stop playing. Fairness becomes one possible outcome of that goal, not the goal.

Chen and colleagues (Northeastern University and EA, WWW 2017) treat the waiting pool as a graph. Every possible pair gets a weight: both players' predicted churn risk if they are matched. A standard algorithm then picks the set of pairs with the lowest total risk. Three parts make it work: a skill model (Glicko) that predicts win, loss or draw for each pair, a churn model that predicts each player's risk given their recent history and that outcome, and the matching algorithm. Here "churn" means no 1-vs-1 match in the next eight hours.

The evidence is a simulation built on 36.9 million real matches by 1.68 million players from the first half of 2016. Bots were drawn from real player states and paired by four methods, 10,000 rounds per pool size. EOMM retained on average 0.7% more players per round than skill-based matching, and was not significantly better than random pairing at the smallest pool of 100. The authors extrapolate that over 20 rounds this compounds to about 15% more players retained. Skill-based matching did not consistently beat random pairing.

Read the limits closely. Nothing was tested on live players. The same churn model chose the pairs and then decided in the simulation who churned, so the result shows the method optimises its own model, not that real players would stay. And the paper says the objective can be swapped for playtime or spending. That last point is where the ethics start: a matchmaker can be tuned for a business metric, and players can't see what it optimises.

## Why

### gd-econ/eomm/why · why

Why can matching unequal players sometimes keep more people playing than fair matches? Answer before opening.

<details>
<summary>Model answer</summary>
Churn risk depends on the player's state, not only on skill. A player on a losing streak is much more likely to quit after another loss, while a player on a winning streak can absorb a loss. Pairing them so the fragile player is likely to win lowers total risk, even though the game is unfair. The paper shows the state-dependent churn rates and proves skill matching is optimal only under a simple assumption; this example is my illustration, grade C.
</details>

## Scenario

### gd-econ/eomm/scenario · scenario

Your PvP team proposes adding churn prediction to the matchmaker, citing EOMM. A producer asks if it could also raise spending, since the paper says the objective can change. What do you say about evidence, and about players?

<details>
<summary>Explained answer</summary>
On evidence: the paper shows a small simulated gain driven by its own churn model, not a live result, so run a randomized test with real players before trusting any number. On players: optimising matches for spend means deliberately shaping who wins and loses to drive purchases, which players would see as manipulation if they knew. At minimum, decide in writing what the matchmaker may optimise, and check that winning stays tied to skill. The evidence points are from the paper; the ethical judgement is mine, grade C.
</details>

## Recall

### gd-econ/eomm/r1 · recall

What are EOMM's three parts?

<details>
<summary>Answer</summary>
A skill model that predicts match outcomes, a churn model that predicts each player's risk given the outcome, and a graph matching algorithm that picks the pairs with the lowest total risk.
</details>

### gd-econ/eomm/r2 · recall

How was EOMM evaluated, and what was the average gain over skill-based matching?

<details>
<summary>Answer</summary>
In a simulation built from real EA match data, not on live players. It retained about 0.7% more players per round.
</details>

### gd-econ/eomm/r3 · recall

What did "churn" mean in the EOMM simulation?

<details>
<summary>Answer</summary>
No 1-vs-1 match within the next eight hours.
</details>

## Sources and grades

- Chen et al. 2017, full text read on arXiv. Grade A for the method, the dataset size, the churn table and the simulation results. The paper doesn't name the game.
- Whether EOMM or anything like it runs in a live game is not stated in the paper. Studio matchmaking practice is unpublished, so this lesson says nothing about current use.
