---
id: gd-econ/placement
course: gd-econ
title: Placement quiz
status: draft
items: 12
---

# Placement quiz

About 10 to 15 minutes, one question per lesson. Every question can be reasoned out from design experience; none asks for a figure from a paper. Guess when you are unsure: a wrong guess followed by the answer still helps you learn it. [Pan and Rivers 2023](https://doi.org/10.3758/s13421-022-01392-1), a peer-reviewed paper in Memory and Cognition, call this pretesting effect a known finding, and their five experiments found that most learners don't believe it: they think reading works better.

For each question, write or say your answer, mark how sure you were (sure, unsure, guess), then open the answer. Each question points at the lesson it places you into.

**How to read your result.** Right and sure means skim that lesson and do only its scenario. Anything else: do the full lesson.

Sources and grades for every answer are in the lesson named at the end of that answer. Where an answer says "grade C", that part is my reasoning and not a finding.

Retired in course version 0.3.3, and never to be reused: p01, p02, p03, p05, p06, p08 and p09. They asked for a figure, a term or a result from a single paper, which says little about where to start.

---

### gd-econ/placement/p13 · why

A free-to-play game doubles the premium currency it hands to new players. Give one reason real-money purchases might fall, and one reason they might not.

<details>
<summary>Model answer</summary>
They might fall because players now hold currency they would otherwise have bought. They might not because a bigger grant can keep more players in the game, and players who stay have more chances to buy. Both reasons are my reasoning, grade C. In a randomized test in Top Eleven, the two bigger starting grants raised day-7 retention by 6.9% and 7.7% against control and buying did not drop; the size of the first purchase rose in the largest group. That is one game over 28 days. Source: [Zivic et al. 2017](https://doi.org/10.1371/journal.pone.0186407). Lesson 1.
</details>

### gd-econ/placement/p04 · scenario

A designer proposes a sink that buys rare items off players and destroys them, "so rare items stay affordable". What is wrong with the reasoning?

<details>
<summary>Answer</summary>
Buying items in order to destroy them adds demand, so prices go up, not down. In RuneScape the sink worked like a large buyer entering the market, and the targeted items got dearer. Each destroyed item also leaves fewer for players, which should push the same way; the paper does not name that as a cause, so it is inference, grade C. Source: [Hogan-Hennessy et al. 2022, preprint](https://arxiv.org/abs/2210.07970). Lesson 2.
</details>

### gd-econ/placement/p11 · why

Telemetry shows a piece of content is almost never used. Name two different reasons that could explain it, which the usage count alone can't tell apart.

<details>
<summary>Model answer</summary>
Players may find it dull or weak, or they may never find or reach it (hidden, locked or far into progression). The count looks the same either way. That a count can't show why is the lesson's reasoning, grade C, and not a finding of the paper it draws on. Source: [Hullett et al. 2012](https://doi.org/10.1145/2372251.2372265). Lesson 3.
</details>

### gd-econ/placement/p07 · scenario

Two studios run similar games and both log every login. Each reports a churn rate for a player's first month, and one rate is much higher than the other. Before you conclude that one game loses more players, what would you check about how each number was made?

<details>
<summary>Answer</summary>
The rule each team used for "churned". A player never sends a churned event, so the team picks a rule, such as how many days without a login counts as gone. Periáñez and colleagues used 10 days and checked that choice against their own data. A different window gives a different churn rate from the same data, so two rates compare only if the rules match. That whole point about comparing is the lesson's reasoning, grade C. Source: [Periáñez et al. 2016](https://doi.org/10.1109/DSAA.2016.84). Lesson 4.
</details>

### gd-econ/placement/p12 · why

One published approach to predicting purchases in a free-to-play game uses two models where you might expect one. What would you guess the two models do, and what about player spending makes the split sensible?

<details>
<summary>Model answer</summary>
Only a small fraction of players buy anything, so one question is whether a player will buy at all and a second is how much buying follows. Sifa and colleagues built a classifier for whether a player will purchase, and a regression for the number of purchases a user will make. Reading the pair as "will they pay, and if so how much" is the lesson's framing. Source: [Sifa et al. 2015](https://doi.org/10.1609/aiide.v11i1.12788). Lesson 5.
</details>

### gd-econ/placement/p10 · why

A churn model correctly flags the players most likely to quit next week. Marketing wants to send each of them a free gift. Why isn't the model's accuracy enough to say the gift will keep them?

<details>
<summary>Model answer</summary>
Being likely to leave and being moved by a gift are different things. Some flagged players will leave whatever you do and some would have stayed anyway, and the model ranks only how likely each is to leave. Whether the gift changes anything needs its own test (my summary, grade C). In one published A/B test, giving out free in-game currency did not significantly change the churn rate or monetization. Source: [Runge et al. 2014](https://doi.org/10.1109/CIG.2014.6932875). Lesson 6.
</details>

### gd-econ/placement/p14 · scenario

Two analysts cluster the same player data. One reports four player types, the other reports seven, and the descriptions don't line up. Has one of them made a mistake?

<details>
<summary>Answer</summary>
Not necessarily. Different clustering methods can give different answers from the same data; in one comparison they did. The number of groups is a judgment call, since these methods usually have no objective cutoff. On the same World of Warcraft data, k-means gave profiles that were, with one exception, so similar that they were hard to label, while archetypal analysis gave profiles that differed more. So segments describe the analysis as well as the players (my reading, grade C). The copy read is on arXiv; the conference it names lists the paper, and its call for papers says the conference presents peer-reviewed papers. It is one game and two variables. Source: [Drachen et al. 2013](https://arxiv.org/abs/1407.3950). Lesson 7.
</details>

### gd-econ/placement/p15 · why

A retention offer can fail to keep a player. Could it also do harm, by pushing out a player who would have stayed? What would that mean for sending offers to everyone a churn model flags?

<details>
<summary>Model answer</summary>
It is possible in principle, though the lesson has no measured case of it. A review of uplift modelling defines the "sleeping dog": someone who churns when given the treatment and does not churn without it. So the players worth an offer are the ones whose outcome the offer improves, and estimating that relies on a randomized experiment in which some players get the offer and some don't. That sleeping dogs are a reason risk-based targeting can backfire is my link, grade C. I could not confirm the review's own peer review. Source: [Gutierrez and Gérardy 2017](https://proceedings.mlr.press/v67/gutierrez17a.html). Lesson 8.
</details>

### gd-econ/placement/p16 · why

A game's median total playtime is under an hour, but its mean is over two hours. What does the gap tell you about its players, and why report both numbers?

<details>
<summary>Model answer</summary>
Half the players are gone within the first hour, while a minority play far longer and pull the mean up. Either number alone misleads: the median hides the long players and the mean hides how early most leave. Both points are my reading, grade C. In one test version of the puzzle game Hipster Sheep the median was 0.77 hours and the mean 2.41, and the authors argue for reporting both. Source: [Viljanen et al. 2018](https://doi.org/10.1109/TCIAIG.2017.2727642). Lesson 9.
</details>

### gd-econ/placement/p17 · why

Before a game is built, a designer writes its economy down as resource flows and lets scripted bots play that model a thousand times. Name one thing the model can tell you and one thing it can't.

<details>
<summary>Model answer</summary>
It can give a sign of whether a system is able to produce a dynamic effect, and ideas about which values to tune. It can't tell you the finished game is balanced: Dormans himself says the model leaves out level design, tactics and player skill. The bots also follow simple scripts, and the paper tests nothing against real players. It is a workshop paper, and I could not confirm it was peer-reviewed. Source: [Dormans 2011](https://doi.org/10.1609/aiide.v7i3.12477). Lesson 10.
</details>

### gd-econ/placement/p18 · scenario

A paper reports that a matchmaker built to keep players from quitting retained more players than skill-based matching. The result comes from a simulation built on real match data, not from a live test. What would you want to know about the simulation before you believed the result?

<details>
<summary>Answer</summary>
What decided which simulated players quit. Here the same churn model chose the pairs and then decided who churned, so the result shows that the method optimises its own model, not that real players would stay (my reading, grade C). Nothing was tested on live players. Ask about size and conditions too: the gain was 0.7% more players retained per round, averaged over pools of 200 to 500, and at the smallest pool of 100 it retained fewer than skill-based matching. Source: [Chen et al. 2017](https://doi.org/10.1145/3038912.3052559). Lesson 11.
</details>

### gd-econ/placement/p19 · scenario

A model flags a game's likely top spenders in their first week, and the game sells loot boxes. Why might the players it flags not simply be the ones with the most money?

<details>
<summary>Answer</summary>
For loot boxes, survey evidence links bigger spending with problem gambling and not with earnings. In pooled survey data the top 5% of spenders made up half of loot box revenue, and spend tracked problem gambling. So a model that finds big spenders may also be finding vulnerable players. The surveys are self-reported and correlational, and none studies a spend model, so that last step is my inference, grade C. Source: [Close et al. 2021](https://doi.org/10.1016/j.addbeh.2021.106851). Lesson 12.
</details>
