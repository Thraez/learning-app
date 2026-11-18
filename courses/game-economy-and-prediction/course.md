---
id: gd-econ
title: Game economies, telemetry and prediction models
version: 0.3.6
status: draft
created: 2026-11-16
topic: game design
audience: designer with a game design degree and three years in the industry
---

# Game economies, telemetry and prediction models

**Status: draft.** Written overnight without the usual approval step, so you could try it on waking. Read this page, take the placement quiz, try lesson 1, then approve the course or redirect it. Anything you say goes into the next version.

## Start here

1. This page (3 minutes).
2. [Placement quiz](placement-quiz.md): 12 questions, about 10 to 15 minutes. Guess when you don't know; guessing before being taught helps you learn the answer afterwards, a finding [Pan and Rivers 2023](https://doi.org/10.3758/s13421-022-01392-1) describe in their abstract (peer-reviewed, Memory and Cognition).
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

Thin in places, and that is part of what the course teaches. For game economies, this search found one large randomized test (peer-reviewed) and one natural experiment (a preprint, not peer-reviewed). Most churn and spend modelling papers come from a few research groups working with studios, so the data are not published and results can't be rerun by others. Good public figures on how concentrated spending is are scarce; the widely quoted vendor figures are not used, and lesson 5 says what is left. Most studio practice is unpublished.

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

- 0.3.6 (2026-11-18): the teaching text of lessons 1 to 4 rewritten after the learner said the lessons were not fun and read like a questionnaire. "The idea" in each now gives one idea per screen in plain words, with what it means for a designer first. The audit detail left the main text and sits behind a "How sure is this?" tap (a new `sure` block): p-values, where a paper's text and table disagree, what a paper does not print, the intervals behind lesson 2's recomputed figures, which copy was read. Nothing was deleted and no claim was made stronger: every result that was not significant is still called not significant on the main screen, and the lifts in lesson 1 are still called relative. New on the main screen: lesson 1 gives the paper's own reading that the step from 40 to 80 Tokens did much more than the step from 80 to 120; three short designer takeaways are labelled as the lesson's own. Blocks whose text changed, same IDs, same option order: endowment/p1 (reveal), endowment/d1 (outcomes 1 and 2), endowment/c1 and c2 (one why line each), endowment/v1 (text and notes, the p-values moved to the tap). Item whose answer changed: churn-time/open (the note on the paper's "non-playing" and on "approximately" moved to the tap). No other item, prompt, answer or ID changed. Lessons 2 to 4 keep every block as it was, moved only.
- 0.3.5 (2026-11-18): lessons 1 to 4 gain blocks for the Stepped, Predict and Case ways of going through a lesson: chunk breaks in the idea section, check questions, a prediction and a decision in the opening, a picture per lesson, and key points after the why and scenario items. Every figure in a block restates a figure already in that lesson, with its label. No sentence, item or item ID changed. The new blocks have not been through a fresh check.
- 0.3.4 (2026-11-18): trust pass after the learner said they could not tell how far to trust the values. Every source in all 12 lessons now has a `read` field (how far it was read, from the claim ledger) and a `caveat` field. Lessons 1 to 4 reworded where they sounded surer than their ledgers: lesson 1 says the retention lifts are relative and that the paper prints no baseline, lesson 2 labels the 15.8% as this lesson's conversion, lesson 3 no longer calls the Microsoft Research copy camera-ready and links it, lesson 4 notes the paper's "non-playing" and that the 80% and 20% are approximate readings off curves. Where a note said IEEE Xplore but the ledger says OpenAlex (lessons 4, 6, 7, 8), or AAAI where the ledger says the Amsterdam repository copy (lesson 10), the note now follows the ledger. The `checked` dates were removed from all 12 lessons until a fresh checker passes the new wording.
- 0.3.3 (2026-11-16): placement quiz rewritten after the first real attempt. The user's feedback was that many questions were "do you know this": seven of the twelve asked for a figure, a term or a result from a single paper, which nobody can answer before reading it. The quiz now has one question per lesson, all twelve lessons, each answerable from design reasoning. Retired, never to be reused: placement p01, p02, p03, p05, p06, p08, p09. New: p13 (lesson 1), p14 (7), p15 (8), p16 (9), p17 (10), p18 (11), p19 (12). Kept with the same ID: p04 and p11 (p11's answer now marks its reasoning as grade C), p07 (prompt reworded so it points at how the number was made; the answer marks the comparison as grade C), p10 (prompt reworded after the user called it unclear; the answer no longer implies who received the gift), p12 (prompt reworded; the answer now cites Sifa 2015, the paper that makes the split, where it wrongly cited Close 2021). Every answer keeps to what the checked lessons say. A fresh reader checked every answer against the checked lessons and the fixes it asked for were made. Known cost: some answers give away the opening guess of their lesson (lessons 1, 2, 6, 7, 9 and 12), and p04, p10 and p19 sit close to their lesson's own why or scenario item. Not checked: the Pan and Rivers sentence in the quiz intro, which no ledger covers.
- 0.3.2 (2026-11-16): every lesson checked under "Checking a lesson" in AGENTS.md. A fresh checker opened each linked source and wrote a claim ledger per lesson (`ledgers/`); the fixes were made with the source open, and a second fresh reader rechecked every row a fix touched. All 12 lessons now carry `checked: 2026-11-16`: every ledger row is `matches` or `inference`. What changed. Lesson 1: the text's 4.3% and Table 2's 4.0% are both given; the best amount is stated for retention only; the paper's own untested explanations are named; the scenario reasoning is marked grade C. Lesson 3: the claims are scoped to the one game; the career mode figures are given both ways, since the paper's text and numbers disagree; reasoning is marked as such; the source note no longer credits the slide deck with different thresholds. Lesson 4: Hadiji's method is described in the abstract's words; the whale check is scoped; "confidential" and a false quote are gone. Lesson 5: the Chen authors' affiliation is given as the paper prints it. Lesson 6: the abstract does not say who received the gift, so the opening, The idea and recall item r1 no longer say it; "suggest" and "no significant effect" replace stronger words; Zivic 2017 is added as a source for one comparison. Lesson 7: "hard to label", with the one exception; the mechanism is no longer stated as fact; the note says the conference review could not be confirmed, so the paper stays tier 2. Lesson 8: Ascarza is described as the abstract has it (two field experiments combined with machine learning); "simple baseline"; unsourced lines cut or marked. Lesson 9: the comparison with a churn rate is reworded; "confidential" is gone. Lesson 11: UCLA added to the affiliations; two readings marked grade C; the gap between Table 2 and the text is noted. Lesson 12: the loot box claims keep to the Close abstract; the accepted manuscript figures, which could not be opened, are cut. Lessons 2 and 10: no change to the text. Full texts not opened (the lessons claim only what the abstracts say): Sifa 2015, Runge 2014, Drachen 2012, Ascarza 2018, Hadiji 2014, Close 2021. No item ID changed; items whose prompt or answer text changed: endowment/why, endowment/scenario, content-usage/scenario, churn-time/scenario, predict-vs-act/open, predict-vs-act/r1, segments/open, uplift/open.
- 0.3.1 (2026-11-16): lessons 2 and 5 fixed from the source check pilot, each fix made with the source open. Lesson 2: the second-round price rise is given as the paper's text has it (14.4%) and as its Table A1 implies (about 15.8%, our recomputation); the volume result is worded as no change detected, with the wide ranges; only the demand route is credited to the authors; the supply and repair-fee points are marked grade C; the regression kink design is named. Lesson 5: Sifa's second model is described in the abstract's words (the number of purchases a user will make); "under $20" is given as background; the Chen authors are placed at Yokozuna Data rather than a studio; two sentences gained links; the press release sentence is cut. Placement p03 answer reworded to match. Claim ledgers for both lessons added under `ledgers/`. No item ID changed; items whose answer text changed: sinks/why, sinks/scenario, sinks/r2, spend-skew/open, spend-skew/why, spend-skew/r3. The fixed rows await a fresh recheck, so neither lesson is marked checked yet.
- 0.3.0 (2026-11-16): source credibility pass under the new standard (AGENTS.md rule 4). Every source now has a tier as well as a grade, every factual claim links to a DOI or publisher page, and every figure was checked again against the paper's text. Cut: the Swrve press release figures (lesson 5 and quiz p08), the SlideShare figures (lesson 3 and quiz p05), and the Game Developer write-up with the game names and the model-versus-rule claim it alone supported (lesson 6). Replaced: lesson 3 now rests on the peer-reviewed ESEM 2012 paper, whose figures use a 1% threshold; lesson 5 opens on the pooled loot box surveys of Close et al. 2021. Found peer-reviewed versions for Periáñez (DSAA 2016), Chen (IEEE Big Data 2018) and Viljanen (IEEE Transactions on Games 2018); labelled not peer-reviewed: Hogan-Hennessy and Wei (preprints); labelled review unconfirmed, so tier 2: Drachen 2014 (lesson 7), Gutierrez (lesson 8), Dormans (lesson 10). Lesson 12 uses the published Close et al. figures (7,767 buyers, rho 0.34, half of revenue). Openings of lessons 4, 6, 7, 8, 9 and 10 now name the real study and game. Items whose question changed: content-usage/open, content-usage/r2, spend-skew/open, spend-skew/r2, churn-time/open, segments/open, placement p05 and p08.
- 0.2.0 (2026-11-16): lessons 7 to 12 written, every source opened and graded. Lesson 7 uses the open 2014 arXiv comparison by Drachen and colleagues as its main source, with the 2012 CIG paper from its abstract only. Lesson 8 found one games uplift study (Wei et al. 2024, Tencent preprint) and leans on Ascarza 2018 (marketing, abstract) and a review. Lesson 9 adds Viljanen et al. 2017 on playtime survival analysis. Lesson 10 uses Dormans 2011, an open paper by the same author, instead of the Adams and Dormans book, which I did not try to get. Lesson 11 keeps EOMM; it is a simulation, not a live test. Lesson 12 uses three loot box surveys; the link to spend models is graded C. Thin spots: no published check of a pre-launch economy simulation against live data, and no published study of whale models and vulnerable players. No placement quiz items added.
- 0.1.0 (2026-11-16): first draft. Course page, placement quiz, lessons 1 to 6. Same day: checked lesson 1 and 3 figures against the paper and slides, regraded the Hadiji 2014 source from its abstract, added two concept items to the quiz.
