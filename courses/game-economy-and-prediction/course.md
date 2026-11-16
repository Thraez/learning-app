---
id: gd-econ
title: Game economies, telemetry and prediction models
version: 0.3.0
status: draft
created: 2026-11-16
topic: game design
audience: designer with a game design degree and three years in the industry
---

# Game economies, telemetry and prediction models

**Status: draft.** Written overnight without the usual approval step, so you could try it on waking. Read this page, take the placement quiz, try lesson 1, then approve the course or redirect it. Anything you say goes into the next version.

## Start here

1. This page (3 minutes).
2. [Placement quiz](placement-quiz.md): 12 questions, about 10 to 15 minutes. Guess when you don't know; guessing before being taught helps you learn the answer afterwards, an effect [Pan and Rivers 2023](https://doi.org/10.3758/s13421-022-01392-1) describe as established (grade B: they state it as background, not as their own result).
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

Thin in places, and that is part of what the course teaches. For game economies, this search found one large randomized test (peer-reviewed) and one natural experiment (a preprint, not peer-reviewed). Most churn and spend modelling papers come from a few research groups working with studios, so the games and data are confidential and results can't be checked. Good public figures on how concentrated spending is are scarce; the widely quoted vendor figures are not used, and lesson 5 says what is left. Most studio practice is unpublished.

Each source carries two labels. The **grade** says how much of it I read: A read in the paper itself, B secondary or a figure the paper gives without its data, C my inference. The **tier** says what kind of source it is: 1 peer-reviewed, 2 a preprint or report by named researchers (always labelled not peer-reviewed in the lesson), 3 a studio's own data report. Press releases, blogs, slide decks and trade-press write-ups are not used for facts. Every claim links to its source at the sentence.

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

| # | Lesson | Main source | Grade | Tier |
|---|---|---|---|---|
| 1 | [Starting currency is a retention lever](lessons/01-endowment.md) | Zivic et al. 2017, PLOS ONE | A | 1 |
| 2 | [Sinks move prices, not only remove value](lessons/02-sinks.md) | Hogan-Hennessy et al. 2022, arXiv | A | 2 |
| 3 | [Telemetry shows where design effort goes unused](lessons/03-content-usage.md) | Hullett et al. 2012, ESEM | A | 1 |
| 4 | [Churn is a definition and a time, not a label](lessons/04-churn-time.md) | Periáñez et al. 2016, DSAA; Hadiji et al. 2014, CIG | A; A abstract | 1 |
| 5 | [Spend is mostly zero and very concentrated](lessons/05-spend-skew.md) | Close et al. 2021; Sifa et al. 2015; Chen et al. 2018 | A abstract; A abstract; A | 1 |
| 6 | [Predicting who leaves is not knowing what keeps them](lessons/06-predict-vs-act.md) | Runge et al. 2014, CIG | A abstract | 1 |
| 7 | [The clustering method shapes the segments](lessons/07-segments.md) | Drachen et al. 2014, arXiv; Drachen et al. 2012, CIG | A; A abstract | 2; 1 |
| 8 | [Target the players an offer changes, not the ones most likely to leave](lessons/08-uplift.md) | Ascarza 2018; Gutierrez and Gérardy 2017; Wei et al. 2024 | A abstract; A; A | 1; 2; 2 |
| 9 | [Survival curves for churn and lifetime value](lessons/09-survival.md) | Viljanen et al. 2018; Periáñez et al. 2016; Chen et al. 2018 | A | 1 |
| 10 | [Simulating an economy before it is built](lessons/10-simulation.md) | Dormans 2011, AAAI workshop | A | 2 |
| 11 | [Matchmaking tuned for engagement](lessons/11-eomm.md) | Chen et al. 2017 (EOMM), WWW | A | 1 |
| 12 | [Spend prediction and vulnerable players](lessons/12-vulnerable.md) | Zendle and Cairns 2018, 2019; Close et al. 2021 | A; A abstract | 1 |

## For you to decide

- Approve, or redirect: more economy, more modelling, or more ethics?
- Is the level right after the quiz and lesson 1? Too easy means the course should skip ahead (expertise reversal, finding 12).
- Lesson length: is 10 to 15 minutes right for transit?

## Change log

- 0.3.0 (2026-11-16): source credibility pass under the new standard (AGENTS.md rule 4). Every source now has a tier as well as a grade, every factual claim links to a DOI or publisher page, and every figure was checked again against the paper's text. Cut: the Swrve press release figures (lesson 5 and quiz p08), the SlideShare figures (lesson 3 and quiz p05), and the Game Developer write-up with the game names and the model-versus-rule claim it alone supported (lesson 6). Replaced: lesson 3 now rests on the peer-reviewed ESEM 2012 paper, whose figures use a 1% threshold; lesson 5 opens on the pooled loot box surveys of Close et al. 2021. Found peer-reviewed versions for Periáñez (DSAA 2016), Chen (IEEE Big Data 2018) and Viljanen (IEEE Transactions on Games 2018); labelled as not peer-reviewed: Hogan-Hennessy (lesson 2), Drachen 2014 (lesson 7), Gutierrez and Wei (lesson 8), Dormans (lesson 10). Lesson 12 uses the published Close et al. figures (7,767 buyers, rho 0.34, half of revenue). Openings of lessons 4, 6, 7, 8, 9 and 10 now name the real study and game. Items whose question changed: content-usage/open, content-usage/r2, spend-skew/open, spend-skew/r2, churn-time/open, segments/open, placement p05 and p08.
- 0.2.0 (2026-11-16): lessons 7 to 12 written, every source opened and graded. Lesson 7 uses the open 2014 arXiv comparison by Drachen and colleagues as its main source, with the 2012 CIG paper from its abstract only. Lesson 8 found one games uplift study (Wei et al. 2024, Tencent preprint) and leans on Ascarza 2018 (marketing, abstract) and a review. Lesson 9 adds Viljanen et al. 2017 on playtime survival analysis. Lesson 10 uses Dormans 2011, an open paper by the same author, instead of the Adams and Dormans book, which I did not try to get. Lesson 11 keeps EOMM; it is a simulation, not a live test. Lesson 12 uses three loot box surveys; the link to spend models is graded C. Thin spots: no published check of a pre-launch economy simulation against live data, and no published study of whale models and vulnerable players. No placement quiz items added.
- 0.1.0 (2026-11-16): first draft. Course page, placement quiz, lessons 1 to 6. Same day: checked lesson 1 and 3 figures against the paper and slides, regraded the Hadiji 2014 source from its abstract, added two concept items to the quiz.
