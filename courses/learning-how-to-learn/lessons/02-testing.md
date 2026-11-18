---
id: learn/testing
course: learn
title: A practice test beats a second read, and the answer matters
order: 2
status: draft
checked: 2026-11-18
sources:
  - cite: "Rowland (2014). The Effect of Testing Versus Restudy on Retention: A Meta-Analytic Review of the Testing Effect. Psychological Bulletin 140(6), 1432 to 1463."
    url: https://doi.org/10.1037/a0037559
    grade: A
    tier: 1
    read: "full text, author's online-first upload"
    caveat: "A meta-analysis; feedback and delay comparisons are across studies, not experiments."
    note: "full text read, the author's upload of the online-first version; page numbers there are not final"
---

# Lesson 2: A practice test beats a second read, and the answer matters

## Opening question

### learn/testing/open · open

A meta-analysis pooled 159 effect sizes from 61 studies, published or not, from 1975 to 2013, each comparing a practice test with simply studying the material again ([Rowland 2014](https://doi.org/10.1037/a0037559)). Guess: in studies where people got half or fewer of the practice answers right and were never shown the right answers, did the test still beat restudying?

<details>
<summary>Answer</summary>
No reliable benefit: g = 0.03, with a 95% interval from -0.21 to 0.27, across 17 effect sizes. With the answers shown afterwards, tests beat restudy at g = 0.73.
</details>

## The idea

Trying to recall something strengthens memory more than reading it again. Whether you see the right answer after the try decides much of how much you gain.

The source is [Rowland 2014](https://doi.org/10.1037/a0037559), a meta-analysis: it pools the results of many experiments into one estimate. Across all 159 effect sizes, testing beat restudy at g = 0.50 (95% interval 0.42 to 0.58). 81% of the effect sizes favoured testing and 18% favoured restudy. The studies varied a lot (I² about 84%), so the average hides a wide spread.

Feedback, in this paper, means the studied material is shown again at least once after the test. Studies with feedback found [g = 0.73](https://doi.org/10.1037/a0037559) (52 effect sizes); studies without found g = 0.39 (107). Without feedback, how well people did on the practice test mattered: g = 0.03 at half or fewer right, 0.29 at 51 to 75% right, 0.56 above 75%. These are comparisons between studies, not one experiment, so other differences between those studies could play a part.

Three more findings. The gain was larger when the final test came [a day or more later](https://doi.org/10.1037/a0037559) (g = 0.69) than within a day (0.41). Practice tests that asked you to recall beat ones that asked you to recognise: in the subset of studies with feedback or high first-test scores, cued recall gave g = 0.72, free recall 0.81 and recognition 0.36. And feedback given after a delay beat immediate feedback (1.38 against 0.66), which Rowland says to treat with caution: only six effect sizes had delayed feedback, and retention interval, which can be confounded with feedback delay, was not controlled for.

The limits. In the subset of studies whose final test came a day or more later, the no-feedback, half-or-fewer-right group showed g = 0.26 (0.01 to 0.52) over seven effect sizes, so the "no reliable gain" above may be softer for long delays (my reading); Rowland warns these subset cells are small. Published studies showed larger effects than unpublished ones (0.58 against 0.25), though Rowland traces most of that gap to unpublished studies more often lacking feedback and having low first-test scores. Most samples were college students learning words, word pairs or prose. Rowland found similar effects in the few other samples, but too few to analyse closely. Whether it holds for learning a game engine or a rules system is my inference, grade C.

## Why

### learn/testing/why · why

Why would a practice test without answers help so little when you get most questions wrong? Answer before opening.

<details>
<summary>Model answer</summary>
Restudy shows you every item again, but a test without feedback only re-exposes the items you managed to recall. When you recall few, most of the material gets no second exposure at all, so the test is up against a restudy condition that saw everything. Rowland points to this exposure gap himself. Feedback closes it, which fits the larger effect when the answers are shown.
</details>

## Scenario

### learn/testing/scenario · scenario

You are teaching yourself statistics to read playtest data. A textbook has end-of-chapter questions but the answer key is online and a hassle to find. You plan to do the questions and skip the key, since the effort of trying is what counts. What would you change?

<details>
<summary>Explained answer</summary>
Get the key and check every answer after you try. On new material you will get many wrong, and in the meta-analysis, tests without feedback where half or fewer answers were right gave no reliable gain over rereading. With feedback the gain was g = 0.73. Prefer questions that make you produce an answer over multiple choice, since, in studies with feedback or high first-test scores, recall practice tests gave larger gains than recognition tests (Rowland counted multiple choice as recognition). Treating statistics problems like the word lists and texts in these studies is my inference, grade C.
</details>

## Recall

### learn/testing/r1 · recall

Across 159 effect sizes, how much did testing beat restudy on average?

<details>
<summary>Answer</summary>
g = 0.50, with a 95% interval of 0.42 to 0.58. The studies varied widely around that average.
</details>

### learn/testing/r2 · recall

What were the effect sizes with and without feedback?

<details>
<summary>Answer</summary>
g = 0.73 with feedback and g = 0.39 without. Without feedback and with half or fewer first answers right, there was no reliable gain (g = 0.03).
</details>

### learn/testing/r3 · recall

Was the testing effect bigger when the final test came within a day or a day or more later?

<details>
<summary>Answer</summary>
A day or more later: g = 0.69, against 0.41 within a day.
</details>

## Sources and grades

- [Rowland 2014](https://doi.org/10.1037/a0037559), full text read (the author's upload of the online-first version). Grade A. Tier 1. Figures for feedback, first-test score, delay, test type and publication status were checked against the text and Tables 1, 2 and B1; the 81%, 18%, I² and delayed-feedback figures appear in the text only. A few figures in the paper's text differ slightly from its tables (the 51 to 75% interval, the row for studies with no feedback and no reported first-test score, and published studies in Table 2); none of those is used here. One that is used: free recall practice tests are 0.81 in Table 2 and 0.82 in the Discussion, and the lesson gives the table's figure. The comparisons between feedback levels and delays are moderator analyses across studies, not experiments.
- The step from lab word lists and texts to learning a technical subject at work is my inference, grade C.
