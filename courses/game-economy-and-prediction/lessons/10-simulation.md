---
id: gd-econ/simulation
course: gd-econ
title: Simulating an economy before it is built
order: 10
status: draft
sources:
  - cite: "Dormans (2011). Simulating Mechanics to Study Emergence in Games. AAAI Technical Report WS-11-19."
    url: https://cdn.aaai.org/ojs/12477/12477-52-16005-1-2-20201228.pdf
    grade: A
---

# Lesson 10: Simulating an economy before it is built

## Opening question

### gd-econ/simulation/open · open

A designer simulates a two-player strategy economy a thousand times with scripted bots. Rushing wins almost never, so they try making defensive units dearer, even dearer than attack units. Guess: does that fix the balance?

<details>
<summary>Answer</summary>
Barely. Even with defence costing more than offence, turtling stayed dominant. What moved the balance was the cost of factories and of offensive units.
</details>

## The idea

You can run an economy before you build the game, if you write its resource flows down as a model a computer can execute. The value is finding which levers matter and which don't. The limit is that the model is only the economy, not the game.

Dormans's Machinations framework draws a game's internal economy as a diagram: pools hold resources, sources create them, drains destroy them, converters turn one into another, and traders move them between players (the four functions come from Adams and Rollings). Diagrams run step by step, and scripted "artificial players" can play them thousands of times while charts log the result.

The paper tests this on SimWar, a minimal war game Will Wright described at GDC 2003 but never built: factories make resources, resources buy defensive and offensive units. In 1,000 runs, a rushing bot beat a turtling bot only twice. Dormans then changed one cost at a time and ran 1,000 games per change. Rush wins rose to 745 when factories cost 10, and to 806 when offensive units cost 1.2. Raising the cost of defence to 2.5 lifted rush wins only to 196. So balance depended mostly on production against offence, and little on offence against defence.

Dormans is direct about the limits. The model leaves out level design, tactics and player skill, so "it is naive to assume" the tweaks give a balanced game once built. What it gives is a sign of whether a system can produce a dynamic effect, and ideas about which values to tune. The bots follow simple scripts, and the paper tests nothing against real players.

## Why

### gd-econ/simulation/why · why

Why was raising the defence cost a weak lever, when it looked like the obvious way to stop turtling? Answer before opening.

<details>
<summary>Model answer</summary>
In this model the turtle's advantage came from its economy: factories feed a positive feedback loop, more factories give more resources for more factories. Making defence dearer doesn't touch that loop, while making factories dearer or attacks cheaper does. The paper reports the result and names the factory loop as a feedback structure; linking the two this way is my reading, grade C.
</details>

## Scenario

### gd-econ/simulation/scenario · scenario

Your team builds a spreadsheet simulation of a new crafting economy with 10,000 simulated players and sets all prices from it. Launch is in a month. Which results do you trust, and what do you still check after launch?

<details>
<summary>Explained answer</summary>
Trust the structural findings, such as which prices the outcomes are sensitive to, which feedback loops run away and which sinks barely matter. Don't trust the exact numbers, because the simulated players follow your assumptions, not real behaviour. After launch, watch the levers the simulation said were sensitive, and compare real flows with simulated ones to correct the model. The limits come from Dormans; the plan is my suggestion, grade C. I found no published study that checks a pre-launch economy simulation against live data.
</details>

## Recall

### gd-econ/simulation/r1 · recall

Name the four economic functions used in Machinations diagrams.

<details>
<summary>Answer</summary>
Sources, drains, converters and traders.
</details>

### gd-econ/simulation/r2 · recall

Out of 1,000 simulated SimWar games with no changes, how often did the rushing bot win?

<details>
<summary>Answer</summary>
Twice.
</details>

### gd-econ/simulation/r3 · recall

What does Dormans say a pre-build simulation is good for, and what can't it tell you?

<details>
<summary>Answer</summary>
It shows whether a system can produce a dynamic effect and which values to tune. It can't show the balance of the finished game, since level design, tactics and player skill are left out.
</details>

## Sources and grades

- Dormans 2011, full text read (AAAI workshop PDF). Grade A for the framework, the SimWar results and the stated limits.
- The planned source was Adams and Dormans 2012, *Game Mechanics: Advanced Game Design*, a book I could not open, so I swapped in this paper by the same author.
- The evidence is thin: one hypothetical game, simple bots, no comparison with real players. Studio use of economy simulation for free-to-play games is mostly unpublished.
