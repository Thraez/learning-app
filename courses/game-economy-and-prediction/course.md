---
id: gd-econ
title: Game economies, telemetry and prediction models
version: 0.1.0
status: draft
created: 2026-11-16
topic: game design
audience: designer with a game design degree and three years in the industry
---

# Game economies, telemetry and prediction models

**Status: draft.** Written overnight without the usual approval step, so you could try it on waking. Read this page, take the placement quiz, try lesson 1, then approve the course or redirect it. Anything you say goes into version 0.2.

## Start here

1. This page (3 minutes).
2. [Placement quiz](placement-quiz.md): 12 questions, about 10 to 15 minutes. Guess when you don't know; guessing before being taught helps you learn the answer afterwards (finding 7, grade B).
3. [Lesson 1: starting currency](lessons/01-endowment.md), about 10 to 15 minutes.

The times are estimates. Each lesson has the same shape: a question you probably can't answer yet, one idea, a "why" prompt, a scenario, and recall questions. Try each answer before you open it.

## Direction

The research behind economy and analytics decisions in live games: what published studies actually show about virtual economies, player telemetry and the models that predict churn and spend, how strong each finding is, and where it stops applying. Not a goal to tick off. The aim is that when a sink, a currency grant or a churn model comes up at work, you know what the evidence says and what it doesn't.

## Questions worth exploring

- When a team changes a currency faucet or sink, what actually happens to prices, spend and retention, and how would you know?
- What can telemetry tell you, and what does it hide?
- What is a churn model really predicting, and why do two teams' "churn rates" rarely match?
- Why is spend so hard to predict, and what does that do to LTV numbers used for user acquisition?
- When a model flags a player, what evidence says an intervention helps?
- Where does prediction for profit start to harm the players it targets?

## How strong the evidence is

Thin in places, and that is part of what the course teaches. For game economies, this search found one large randomized test (peer reviewed) and one natural experiment (a preprint). Most churn and spend modelling papers come from a few research groups working with studios, so the games and data are confidential and results can't be checked. Industry figures (such as how much revenue comes from the top fraction of a percent of players) mostly come from vendor press releases, graded B. Most studio practice is unpublished. Each lesson grades its sources: A read in the paper itself, B secondary or untraced, C my inference.

## Concept map

Arrows read "is needed before".

- **Faucets and sinks** (currency in, currency out) → **Starting endowment** (lesson 1) and **Sink side effects** (lesson 2) → **Economy simulation** (lesson 10)
- **Telemetry: what gets logged** (lesson 3) → everything in the prediction branch
- **Churn as a defined event in time** (lesson 4) → **Survival models** (lesson 9)
- **Skewed spend** (lesson 5) → **LTV prediction** (lesson 9) and **Ethics of spend prediction** (lesson 12)
- **Segmentation** (lesson 7) → **Targeted interventions**
- **Prediction is not intervention** (lesson 6) → **Experiments and uplift** (lesson 8) → **Engagement-optimised systems** (lesson 11)

Assumed known from your degree and work: what F2P is, retention cohorts (D1, D7), ARPU and ARPPU, the idea of a soft and a hard currency, and A/B testing in outline.

## Lesson list

| # | Lesson | Main source | Grade | State |
|---|---|---|---|---|
| 1 | [Starting currency is a retention lever](lessons/01-endowment.md) | Zivic et al. 2017, PLOS ONE | A | full |
| 2 | [Sinks move prices, not only remove value](lessons/02-sinks.md) | Hogan-Hennessy et al. 2022, arXiv | A (preprint) | full |
| 3 | [Telemetry shows where design effort goes unused](lessons/03-content-usage.md) | Hullett et al. 2011; Microsoft slides | A abstract, B figures | full |
| 4 | [Churn is a definition and a time, not a label](lessons/04-churn-time.md) | Periáñez et al. 2017; Hadiji et al. 2014 | A | full |
| 5 | [Spend is mostly zero and very concentrated](lessons/05-spend-skew.md) | Sifa et al. 2015; Swrve 2014; Chen et al. 2018 | A and B | full |
| 6 | [Predicting who leaves is not knowing what keeps them](lessons/06-predict-vs-act.md) | Runge et al. 2014 | A | full |
| 7 | Segmentation: the algorithm shapes the segments | Drachen et al. 2012 | to verify | planned |
| 8 | Experiments and uplift: measuring what an action causes | to find | | planned |
| 9 | Survival models for churn and lifetime value | Periáñez et al. 2017; Chen et al. 2018 | to verify | planned |
| 10 | Simulating an economy before launch | Adams and Dormans 2012 (book) | likely B | planned |
| 11 | Matchmaking tuned for engagement | Chen et al. 2017 (EOMM), to verify | | planned |
| 12 | Spend prediction and vulnerable players | loot box and problem gambling studies, to find | | planned |

Lessons 7 to 12 are a plan, not written. Their sources still have to be opened and graded.

## For you to decide

- Approve, or redirect: more economy, more modelling, or more ethics?
- Is the level right after the quiz and lesson 1? Too easy means the course should skip ahead (expertise reversal, finding 12).
- Lesson length: is 10 to 15 minutes right for transit?

## Change log

- 0.1.0 (2026-11-16): first draft. Course page, placement quiz, lessons 1 to 6. Same day: checked lesson 1 and 3 figures against the paper and slides, regraded the Hadiji 2014 source from its abstract, added two concept items to the quiz.
