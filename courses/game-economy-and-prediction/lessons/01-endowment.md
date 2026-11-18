---
id: gd-econ/endowment
course: gd-econ
title: Starting currency is a retention lever
order: 1
status: draft
sources:
  - cite: "Zivic, Andjelkovic, Ozden, Dekic, Castronova (2017). Results of a massive experiment on virtual currency endowments and money demand. PLOS ONE 12(10): e0186407."
    url: https://doi.org/10.1371/journal.pone.0186407
    grade: A
    tier: 1
    read: "full text, publisher PDF"
    caveat: "One study, one game (Top Eleven); authors include Nordeus staff; data not shareable."
---

# Lesson 1: Starting currency is a retention lever

## Opening question

### gd-econ/endowment/open · open

Top Eleven is a football manager game by Nordeus. New players started with 40 Tokens, its premium currency. In a [published test](https://doi.org/10.1371/journal.pone.0186407), some new players got 80 or 120 instead. Before reading on, guess: what happened to day-7 retention, and did players buy fewer Tokens with real money?

<details>
<summary>Answer</summary>
Retention went up in both bigger groups, and purchases did not fall. Read on for the numbers and the catch.
</details>

```predict
id: gd-econ/endowment/p1
prompt: "What do you think: by how much did the size of the first real-money purchase rise in the 120-Token group, against the 40-Token control?"
unit: "%"
min: 0
max: 80
step: 1
answer: 34.8
answer_text: "34.8% higher, as a relative lift against the 40-Token control."
reveal: "In the 120-Token group the size of the first purchase rose 34.8% against control (p = 0.005, significant). It is a relative lift, and the paper prints no baseline. The 14% rise in the 80-Token group was just short of significance (p = 0.057)."
covers: gd-econ/endowment/r2
visual: gd-econ/endowment/v1
```

```decide
id: gd-econ/endowment/d1
prompt: "You run the economy of a football manager game. New players start with 40 Tokens, and finance wants to keep it that way to protect purchases. What do you do?"
options:
  - text: "Keep the grant at 40 Tokens."
    outcome: "In the published test, day-7 retention was higher with 80 and 120 Tokens than with 40 (relative lifts of 6.9% and 7.7%, both significant), and buying did not fall. The paper prints no baseline rates."
  - text: "Raise the grant to 80 or 120 Tokens."
    outcome: "In the test, retention rose in both groups and buying did not fall. First-purchase share rose about 8% and 4%, neither significant. First-purchase size rose 14% (not significant) and 34.8% (significant). The authors say the best amount for retention probably lies in the 80 to 120 range."
  - text: "Raise the grant far above 120 Tokens."
    outcome: "The test covered 40 to 120 Tokens only, so the lesson has nothing on larger grants. The authors say the best amount for retention probably lies somewhere in the 80 to 120 range."
```

## The idea

A faucet aimed at new players is not only a cost to monetization. It can be a retention lever.

Nordeus and Edward Castronova [ran a randomized test](https://doi.org/10.1371/journal.pone.0186407) on about 575,000 new Top Eleven players, split equally into three groups: 40 Tokens (the control, the default since late 2014), 80 and 120. It ran for 28 days, one in-game season. The paper is peer-reviewed (PLOS ONE).

```check
id: gd-econ/endowment/c1
prompt: "What is the job of the 40-Token group in this test?"
options:
  - text: "It is the comparison. Every lift is measured against it."
    correct: true
    why: "Right. The 40-Token group is the control, and the paper's Table 1 gives every result as an index with the control set to 100."
  - text: "It is the group that got the most Tokens."
    why: "No. The control got 40, the fewest. The 80 and 120 groups got more."
  - text: "It is the group the designers expected to do best."
    why: "No. It was the default since late 2014, and its job is to be the comparison, not a prediction."
```

<!-- break -->

Against control, day-7 retention was 6.9% higher with 80 Tokens and 7.7% higher with 120. These are relative lifts, not percentage points: Table 1 gives every result as an index with the 40-Token control set to 100, and the paper prints no baseline retention rate, so this lesson has none. Both were significant against control (p = 0.015 and 0.005), but not different from each other.

```check
id: gd-econ/endowment/c2
prompt: "Day-7 retention was 6.9% higher with 80 Tokens. Which reading is right?"
options:
  - text: "A relative lift. The paper prints no baseline rate, so percentage points cannot be given."
    correct: true
    why: "Right. Table 1 gives every result as an index with the 40-Token control set to 100, so 6.9% is a relative lift."
  - text: "Retention rose by 6.9 percentage points."
    why: "No. A rise in percentage points needs the baseline retention rate, and the paper prints none."
```

<!-- break -->

On purchases, the daily share of players making a first real-money purchase rose by about 8% and 4%, but neither was statistically significant (p = 0.054 and 0.197). The paper's text gives 4.3% for the 120-Token group where its Table 2 gives 4.0%.

<!-- break -->

The size of that first purchase rose 14% (80 Tokens, p = 0.057, just short of significance; Table 1 implies 13.9%) and 34.8% (120 Tokens, p = 0.005). Figures are from the [paper's Table 2](https://doi.org/10.1371/journal.pone.0186407).

```visual
id: gd-econ/endowment/v1
kind: bars
title: "Six results against the 40-Token control, as relative lifts"
text: "Relative lifts against the 40-Token control, not percentage points; the paper prints no baseline rate. Day-7 retention in both groups and first-purchase size at 120 Tokens were significant. The other three results were not."
unit: "%"
rows:
  - label: "Day-7 retention, 80 Tokens"
    value: 6.9
    note: "significant, p = 0.015"
  - label: "Day-7 retention, 120 Tokens"
    value: 7.7
    note: "significant, p = 0.005"
  - label: "First-purchase share, 80 Tokens"
    value: 8
    note: "about; not significant, p = 0.054"
  - label: "First-purchase share, 120 Tokens"
    value: 4
    note: "about; not significant, p = 0.197"
  - label: "First-purchase size, 80 Tokens"
    value: 14
    note: "not significant, p = 0.057"
  - label: "First-purchase size, 120 Tokens"
    value: 34.8
    note: "significant, p = 0.005"
```

<!-- break -->

Now the catch. The [abstract](https://doi.org/10.1371/journal.pone.0186407) says a bigger money supply "leads to inflation and increased money demand". The paper measured no prices and no inflation; Token packages keep fixed real-money prices. So the inflation part is the authors' reading, not a result.

```check
id: gd-econ/endowment/c3
prompt: "The abstract says a bigger money supply leads to inflation. How should you treat that sentence?"
options:
  - text: "As the authors' reading. The paper measured no prices and no inflation."
    correct: true
    why: "Right. The lesson says the paper measured retention and purchases only, so the inflation part is an interpretation, not a result."
  - text: "As a result, because it is in the abstract."
    why: "No. The paper measured no prices and no inflation, so the sentence cannot be a measured result."
  - text: "As wrong, because Token packages keep fixed real-money prices."
    why: "No. The paper did not test inflation either way. The lesson only says it is the authors' reading, not a result."
```

<!-- break -->

The abstract also says purchases were "significantly higher", but in Table 2 only one of the four purchase comparisons against control is significant. What was measured: more free currency at the start, more players still there a week later, and no drop in buying. The authors also say they cannot pin down the best amount for retention, only that it probably lies somewhere in the 80 to 120 range.

## Why

### gd-econ/endowment/why · why

Why might giving away premium currency at the start raise later purchase size instead of replacing purchases? Write two or three sentences before opening.

<details>
<summary>Model answer</summary>
Players who get more currency early can try more of the paid systems, so they learn what the currency is worth to them and may settle on a higher spending level. Players who stay longer also have more chances to buy, so even unchanged buying per day adds up. This is my explanation (grade C). The paper offers its own candidates, none of them tested: new players anchoring on the starting amount as a reference point, consistency seeking, and what it calls rational addiction. It also asks whether such reference points carry across games.
</details>

```points
for: gd-econ/endowment/why
points:
  - "Players with more currency early can try more of the paid systems and learn what the currency is worth to them."
  - "Players who stay longer have more chances to buy, so unchanged buying per day still adds up."
  - "The paper offers untested candidates: anchoring on the starting amount, consistency seeking and rational addiction."
```

## Scenario

### gd-econ/endowment/scenario · scenario

Your live team wants to cut the new-player gem grant in a mid-core strategy game from 500 to 250 "to protect monetization". A product lead counters with this paper and wants to double it instead. You are asked to settle it. What do you say?

<details>
<summary>Explained answer</summary>
Neither side can settle it from this paper. It is one game, one genre, one 28-day window and a range of 40 to 120 Tokens, so it shows that a bigger grant did not hurt early buying in Top Eleven, not that it will in your game. A strategy game's gems may also flow into longer-term sinks, where an early surplus could shorten the time before players hit a paywall or could cheapen it. The useful move is to run the test yourself: randomize new installs into grant sizes, read day-7 retention, conversion and first-purchase size, and keep watching past the first month, because the paper's window ended at 28 days and later effects are unknown. The paper supplies the design and the 28-day limit; the points about sinks and running your own test are my reasoning, grade C.
</details>

```points
for: gd-econ/endowment/scenario
points:
  - "Neither side can settle it: one game, one genre, a 28-day window and a range of 40 to 120 Tokens."
  - "Gems may flow into longer-term sinks, so an early surplus could change when players hit a paywall (the lesson's own reasoning, grade C)."
  - "Run your own randomized test of grant sizes and watch past the first month."
```

## Recall

### gd-econ/endowment/r1 · recall

What were the three starting Token amounts in the Top Eleven test, and which was the control?

<details>
<summary>Answer</summary>
40, 80 and 120 Tokens. 40 was the control.
</details>

### gd-econ/endowment/r2 · recall

Which purchase result was statistically significant?

<details>
<summary>Answer</summary>
Only the size of the first purchase in the 120-Token group, up 34.8% against control. The change in how many players converted was not significant in either group.
</details>

### gd-econ/endowment/r3 · recall

Did the paper measure inflation?

<details>
<summary>Answer</summary>
No. It measured retention and purchases. The inflation claim in the abstract is the authors' interpretation.
</details>

## Sources and grades

- [Zivic et al. 2017, PLOS ONE](https://doi.org/10.1371/journal.pone.0186407), full text read (publisher PDF). Grade A, tier 1 (peer-reviewed). Every figure in this lesson was checked against the paper's text and Table 2. One caveat from the paper itself: several authors worked at Nordeus and the data can't be shared, so the results can't be checked independently.
- The mechanism in the "why" answer is my inference, grade C.
