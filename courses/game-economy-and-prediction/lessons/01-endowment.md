---
id: gd-econ/endowment
course: gd-econ
title: Starting currency is a retention lever
order: 1
status: draft
checked: 2026-11-18
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
Retention went up in both bigger groups, and first purchases did not fall. Read on for the numbers and the catch.
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
reveal: "In the 120-Token group the first purchase was 34.8% larger than in the 40-Token group, a statistically significant rise. It is a relative rise: the paper prints no purchase sizes. The 14% rise in the 80-Token group was not significant."
covers: gd-econ/endowment/r2
visual: gd-econ/endowment/v1
```

```decide
id: gd-econ/endowment/d1
prompt: "You run the economy of a football manager game. New players start with 40 Tokens, and finance wants to keep it that way to protect purchases. What do you do?"
options:
  - text: "Keep the grant at 40 Tokens."
    outcome: "In the published test, day-7 retention was higher with 80 and 120 Tokens than with 40 (6.9% and 7.7% higher, both statistically significant, both relative rises), and first purchases did not fall."
  - text: "Raise the grant to 80 or 120 Tokens."
    outcome: "In the test, retention rose in both groups and first purchases did not fall. The share of players making a first purchase was about 8% and 4% higher (relative rises), neither significant. First-purchase size was 14% higher (not significant) and 34.8% higher (significant). The authors say the best amount for retention probably lies in the 80 to 120 range."
  - text: "Raise the grant far above 120 Tokens."
    outcome: "The test covered 40 to 120 Tokens only, so the lesson has nothing on larger grants. The authors say the best amount for retention probably lies somewhere in the 80 to 120 range."
```

## The idea

A starting grant is not only a cost. It can keep players around.

So when someone wants to keep the new-player grant small to protect sales, [a large published test](https://doi.org/10.1371/journal.pone.0186407) points the other way: a bigger grant kept more players, and first purchases did not fall. It is one game, so take it as a reason to run your own test, not as a rule (that advice is mine, not the paper's).

<!-- break -->

The test. Nordeus staff and academic co-authors [split about 575,000 new Top Eleven players at random](https://doi.org/10.1371/journal.pone.0186407) into three equal groups. One group started with 40 Tokens, the default since late 2014. The others got 80 or 120. The test ran 28 days, one in-game season, and the paper is peer-reviewed.

The 40-Token group is the control: every rise below is a comparison with it.

```check
id: gd-econ/endowment/c1
prompt: "What is the job of the 40-Token group in this test?"
options:
  - text: "It is the group that got the most Tokens."
    why: "The control got 40, the fewest. The 80 and 120 groups got more."
  - text: "It is the comparison. Every lift is measured against it."
    correct: true
    why: "The 40-Token group is the control, and the paper's Table 1 gives every result relative to it."
  - text: "It is the group the designers expected to do best."
    why: "It was the default since late 2014, and its job is to be the comparison, not a prediction."
```

<!-- break -->

More Tokens, more players still there a week later. [Day-7 retention](https://doi.org/10.1371/journal.pone.0186407) was 6.9% higher with 80 Tokens and 7.7% higher with 120.

Both rises are statistically significant, which means they are unlikely to be chance alone. The gap between the 80 and 120 groups was too small to tell from chance. The paper's reading: going from 40 to 80 did much more than going from 80 to 120.

One thing to hold on to. These are relative rises, not percentage points: 6.9% higher than whatever the 40-Token group's retention was.

```sure
Both rises were significant against the 40-Token group (p = 0.015 for 80 Tokens, p = 0.005 for 120). The gap between the 80 and 120 groups was not (p = 0.403). The paper prints no retention rate for any group: [its Table 1](https://doi.org/10.1371/journal.pone.0186407) gives every result as an index with the 40-Token group set to 100. So this lesson cannot say what the rate was, only how much higher it got.
```

```check
id: gd-econ/endowment/c2
prompt: "Day-7 retention was 6.9% higher with 80 Tokens. Which reading is right?"
options:
  - text: "A relative lift. The paper prints no baseline rate, so percentage points cannot be given."
    correct: true
    why: "Table 1 gives every result as an index with the 40-Token control set to 100, so 6.9% is a relative lift."
  - text: "Retention rose by 6.9 percentage points."
    why: "A rise in percentage points needs the baseline retention rate, and the paper prints none."
```

<!-- break -->

Did free Tokens replace bought ones? The test found no sign of it.

[The share of players making a first real-money purchase](https://doi.org/10.1371/journal.pone.0186407) on a given day was about 8% higher with 80 Tokens and about 4% higher with 120 (relative rises again, not percentage points). Neither rise is statistically significant, so either could be chance. Read it as "no drop found", not as "a proven rise".

```sure
The p-values are 0.054 for 80 Tokens and 0.197 for 120, and the paper itself says the daily conversion effects are not statistically significant. Its text gives 4.3% for the 120-Token group where [its Table 2](https://doi.org/10.1371/journal.pone.0186407) gives 4.0%, which is why this lesson says "about 4%".
```

<!-- break -->

With 120 Tokens, players who did buy spent more the first time. [The size of the first purchase](https://doi.org/10.1371/journal.pone.0186407) was 14% higher with 80 Tokens and 34.8% higher with 120.

Only the 34.8% is statistically significant. The 14% is not, so it could be chance.

```sure
The 34.8% has p = 0.005. The 14% has p = 0.057, just short of significance, and Table 1 implies 13.9% where Table 2 gives 14.0%. The figures on these screens are from [the paper's Table 2](https://doi.org/10.1371/journal.pone.0186407). They are relative rises: the paper prints no purchase sizes.
```

```visual
id: gd-econ/endowment/v1
kind: bars
title: "Six results against the 40-Token control, as relative lifts"
text: "How much higher each result was than in the 40-Token group. These are relative lifts, not percentage points. Day-7 retention in both groups and first-purchase size at 120 Tokens were statistically significant. The other three results were not."
unit: "%"
rows:
  - label: "Day-7 retention, 80 Tokens"
    value: 6.9
    note: "significant"
  - label: "Day-7 retention, 120 Tokens"
    value: 7.7
    note: "significant"
  - label: "First-purchase share, 80 Tokens"
    value: 8
    note: "about; not significant"
  - label: "First-purchase share, 120 Tokens"
    value: 4
    note: "about; not significant"
  - label: "First-purchase size, 80 Tokens"
    value: 14
    note: "not significant"
  - label: "First-purchase size, 120 Tokens"
    value: 34.8
    note: "significant"
```

<!-- break -->

Now the catch. The paper's [abstract](https://doi.org/10.1371/journal.pone.0186407) goes beyond what the test measured. It suggests that a bigger money supply "leads to inflation and increased money demand".

The test measured no prices and no inflation, and Token packages keep fixed real-money prices. So inflation is the authors' explanation, not a result.

```check
id: gd-econ/endowment/c3
prompt: "The abstract says a bigger money supply leads to inflation. How should you treat that sentence?"
options:
  - text: "As a result, because it is in the abstract."
    why: "The paper measured no prices and no inflation, so the sentence cannot be a measured result."
  - text: "As wrong, because Token packages keep fixed real-money prices."
    why: "The paper did not test inflation either way. The lesson only says it is the authors' reading, not a result."
  - text: "As the authors' reading. The paper measured no prices and no inflation."
    correct: true
    why: "The lesson says the paper measured retention and purchases only, so the inflation part is an interpretation, not a result."
```

<!-- break -->

What the test does support: more free currency at the start, more players still there a week later, and no drop in first purchases.

How much to give? [The authors](https://doi.org/10.1371/journal.pone.0186407) say they cannot pin down the best amount for retention, only that it probably lies somewhere in the 80 to 120 range.

```sure
The abstract also says purchases were "significantly higher". In the paper's Table 2, only one of the four purchase comparisons against the 40-Token group is significant: first-purchase size at 120 Tokens. Several authors worked at Nordeus and the data cannot be shared, so nobody outside can rerun the numbers.
```

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
Neither side can settle it from this paper. It is one game, one genre, one 28-day window and a range of 40 to 120 Tokens, so it shows that a bigger grant did not hurt early first purchases in Top Eleven, not that it will in your game. A strategy game's gems may also flow into longer-term sinks, where an early surplus could shorten the time before players hit a paywall or could cheapen it. The useful move is to run the test yourself: randomize new installs into grant sizes, read day-7 retention, conversion and first-purchase size, and keep watching past the first month, because the paper's window ended at 28 days and later effects are unknown. The paper supplies the design and the 28-day limit; the points about sinks and running your own test are my reasoning, grade C.
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
