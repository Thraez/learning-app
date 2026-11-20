---
id: gd-econ/segments
course: gd-econ
title: The clustering method shapes the segments
order: 7
status: draft
checked: 2026-11-20
sources:
  - cite: "Drachen, Thurau, Sifa, Bauckhage (2013). A Comparison of Methods for Player Clustering via Behavioral Telemetry. Foundations of Digital Games 2013, pp. 245-252. Read as arXiv:1407.3950 (posted 2014)."
    url: https://arxiv.org/abs/1407.3950
    grade: A
    tier: 1
    read: "full text, arXiv copy"
    caveat: "One game, two variables; not repeated by another group that this course found."
    note: arXiv comment says Foundations of Digital Games 2013; the conference site (http only, so the link here is the arXiv copy) lists the paper at pages 245 to 252 and carries a copy; the conference's call for papers says it presents peer-reviewed papers and asks for anonymized submissions for double-blind review, which is its statement about its papers in general; one author, Drachen, is listed as a track chair of that conference
  - cite: "Drachen, Sifa, Bauckhage, Thurau (2012). Guns, swords and data: Clustering of player behavior in computer games in the wild. IEEE CIG 2012, pp. 163-170. DOI 10.1109/CIG.2012.6374152."
    url: https://doi.org/10.1109/CIG.2012.6374152
    grade: A
    tier: 1
    read: "abstract only, OpenAlex record"
    caveat: "Abstract only; two games; no segments or figures seen."
    note: abstract only, read from the OpenAlex record; IEEE Xplore was not opened
---

# Lesson 7: The clustering method shapes the segments

## Opening question

### gd-econ/segments/open · open

[Researchers](https://arxiv.org/abs/1407.3950) ran k-means on the playtime and levelling speed of 70,014 World of Warcraft characters and asked for eight player groups. When they plotted the groups' average players, the centroids were, with one exception, so alike that they were hard to label. Is the data telling you WoW players are similar, or is something else going on?

<details>
<summary>Answer</summary>
Something else. K-means describes each group by its average player, and here those averages came out similar. A method that looks for extreme players instead gave profiles that differed more from each other, on the same data.
</details>

```decide
id: gd-econ/segments/d1
prompt: "Your analyst clusters players with k-means and the group averages all look much the same. What do you conclude?"
options:
  - text: "Our players are all alike, so segmenting them is pointless."
    outcome: "In the World of Warcraft comparison, k-means centroids were with one exception similar and hard to label, yet archetypal analysis gave profiles that differed more, from the same data. So, my reading (grade C): similar averages did not mean similar players there. One game, two variables."
  - text: "Try a method that looks for extreme players and compare the results."
    outcome: "That is what the comparison did. Archetypal analysis looks for extreme players on the edge of the data, and its profiles differed more from each other than the k-means centroids did. One game, two variables."
  - text: "Use PCA instead, since it is the standard way to simplify data."
    outcome: "In the comparison, PCA and NMF gave profiles that are not possible in the game, such as characters losing levels. The paper calls them not or only partly interpretable."
```

## The idea

Clustering does not simply hand you the segments in your players. In the one comparison this lesson rests on, different methods gave different profiles from the same data.

For a designer, my reasoning (grade C): a segment is partly a product of the method that made it. Ask which method, before you design around the names.

<!-- break -->

The comparison. [Drachen and colleagues](https://arxiv.org/abs/1407.3950) took playtime and levelling speed for 70,014 World of Warcraft characters.

They ran several common clustering methods on that same data and set eight groups for each.

The copy I read is on arXiv. The conference it names, Foundations of Digital Games 2013, lists the paper in its programme, and its call for papers says the conference presents peer-reviewed papers.

```sure
The 70,014 characters were picked at random from about 18 million logged between 2005 and 2010. The data was mined from the Warcraft Realms site, and the authors filled in missing values "on the scale of a few percent". The paper's arXiv note names Foundations of Digital Games 2013, and the conference site lists it at pages 245 to 252 and carries a copy with the same title and authors. Crossref has no record of it. The conference's call for papers says it "will include presentations of peer-reviewed papers" and asks for submissions anonymized for double-blind review. That is the conference's statement about its papers in general, not about this one by name, and one of the authors, Drachen, is listed as a track chair there. The authors also ran c-means, found it functionally similar to k-means, and show only k-means.
```

<!-- break -->

The results split three ways.

PCA and NMF gave profiles that cannot happen in the game, such as characters losing levels.

K-means gave profiles the game allows. But its centroids, the average player of each group, were with one exception so similar that they were hard to label.

Archetypal analysis looks for extreme players on the edge of the data, not averages. Each of its profiles sits on a real player, and the profiles differed more from each other.

```sure
The paper's words for k-means: the centroids "display some similarity", a similar shape "with one exception", and its figure caption says they are "overall very similar to each other and do not allow straight forward interpretation". For PCA and NMF it says the profiles are "not or only partly interpretable". Archetypal analysis was run with an algorithm called SIVM, and the paper says its profiles "reside on actual data samples". These are the authors' readings of their plots; the paper gives no number for how similar the centroids are. One sentence early in the paper says the opposite, that the centroids "do easily allow a straight forward labeling". It contradicts the paper's own figure caption and conclusion, and I read it as a missing "not" (my reading, grade C).
```

```check
id: gd-econ/segments/c1
prompt: "In the World of Warcraft comparison, what was the trouble with the k-means result?"
options:
  - text: "Its profiles were impossible in the game, such as characters losing levels."
    why: "That was PCA and NMF. The k-means profiles were ones the game allows."
  - text: "Its centroids were so similar that they were hard to label."
    correct: true
    why: "The k-means centroids were legal but alike, with one exception. Archetypal analysis gave profiles that differed more, on the same data."
```

<!-- break -->

How many groups? That is a judgment call too.

The paper says unsupervised methods usually have no objective way to set the number. Here the authors picked eight, weighing variance explained against a useful number of profiles.

```check
id: gd-econ/segments/c2
prompt: "Why eight groups in the comparison?"
options:
  - text: "The authors chose it, weighing variance explained against a useful number of profiles."
    correct: true
    why: "The paper says unsupervised methods usually have no objective way to set the number, so it is a judgment call."
  - text: "The data contains exactly eight kinds of player, and the methods found them."
    why: "The number was set by the authors for every method. The paper says there is usually no objective way to define it."
```

<!-- break -->

Hold the limits next to this. The paper uses two variables from one game.

So it shows that the choice of method mattered there. It does not show which method is best in general (my reading, grade C).

And it stands alone so far. This course's own search of later papers found no comparison of this kind by another research group. That search scanned titles, and opened abstracts only where a title looked relevant, so it can have missed one.

<!-- break -->

An [earlier paper by the same group](https://doi.org/10.1109/CIG.2012.6374152) (IEEE CIG 2012) clustered 260,000 characters from two games: Tera and Battlefield: Bad Company 2.

It used k-means and SIVM. Its abstract says the two algorithms gave different insights into the same players.

It also says the clustering was combined with considerations of each game's design to get profiles a developer can act on.

```sure
I read only the abstract of the 2012 paper, from the OpenAlex record, so this lesson gives none of its segments or figures. The abstract writes the second game's name as "Battlefield 2: Bad Company 2". It is by the same research group as the comparison, so it is not an independent check of it.
```

## Why

### gd-econ/segments/why · why

Why do k-means centroids tend to look alike, while archetypes look different? Answer before opening.

<details>
<summary>Model answer</summary>
A centroid is the average of everyone in its group, so it sits in the middle of its group and smooths away the extremes that make players different. In the version the paper used (SIVM), an archetype is an actual player on the outer edge of the data, and every other player is described as a mix of these extremes, so the profiles are far apart by design. The paper states that k-means focuses on the average and archetypal analysis on extreme behaviour; why averages come out alike, and that archetypes end up far apart by design, are my explanation, grade C.
</details>

```points
for: gd-econ/segments/why
points:
  - "A centroid is the average of everyone in its group, so it sits in the middle of its group."
  - "In the version the paper used (SIVM), an archetype is an actual player on the outer edge of the data."
  - "Every other player is described as a mix of these extremes."
  - "Why averages come out alike, and that archetypes end up far apart by design, are the lesson's explanation, grade C."
```

## Scenario

### gd-econ/segments/scenario · scenario

Your team wants to send different offers to "player types". The analyst's deck shows five segments with names like "casual explorer" and "hardcore grinder", built with k-means on 40 features. Before the offers are designed around these names, what do you ask?

<details>
<summary>Explained answer</summary>
Ask how the number of segments was picked, whether another method or another number gives similar groups, and whether each profile is a behaviour the game actually allows. Ask to see real players near each centroid, not just the average, and check how far apart the centroids are on the features that matter for the offer. If the segments shift a lot with the method or the count, the names describe the analysis more than the players. Most of the questions follow from the paper; the ones about another number of groups and about the offer, and the conclusion in the last sentence before this one, are mine, and turning them into a checklist is my suggestion, grade C.
</details>

```points
for: gd-econ/segments/scenario
points:
  - "Ask how the number of segments was picked."
  - "Ask whether another method or another number gives similar groups."
  - "Ask whether each profile is a behaviour the game allows, and to see real players near each centroid."
  - "If the segments shift with the method or the count, the names describe the analysis more than the players (the lesson's suggestion, grade C)."
```

## Recall

### gd-econ/segments/r1 · recall

What went wrong with the PCA and NMF profiles in the World of Warcraft comparison?

<details>
<summary>Answer</summary>
They described behaviour that is impossible in the game, such as players losing levels.
</details>

### gd-econ/segments/r2 · recall

What does archetypal analysis look for, compared with k-means?

<details>
<summary>Answer</summary>
Extreme players on the edge of the data (in the SIVM version the paper used, each one a real player), instead of the average player of each group.
</details>

### gd-econ/segments/r3 · recall

How was the number of groups chosen in the comparison, and why is that a weak point of clustering in general?

<details>
<summary>Answer</summary>
The authors picked eight by weighing variance explained against a useful number of profiles. Unsupervised methods usually have no objective cutoff, so the number is a judgment call.
</details>

## Sources and grades

- [Drachen et al., arXiv:1407.3950](https://arxiv.org/abs/1407.3950), full text read (arXiv PDF). Grade A for the dataset, the method comparison and the k = 8 choice, all checked against the text. Tier 1: its arXiv note names Foundations of Digital Games 2013, and the conference site lists the paper at pages 245 to 252 and carries a copy. The conference's call for papers says it presents peer-reviewed papers and asks for anonymized submissions for double-blind review. That is the conference's statement about its papers in general. Crossref has no record of the paper, the conference site is http only, so the link is the arXiv copy, and one author, Drachen, is listed as a track chair there.
- [Drachen et al. 2012, IEEE CIG](https://doi.org/10.1109/CIG.2012.6374152), abstract read from the OpenAlex record; I did not open IEEE Xplore. Grade A for the abstract's claims only, tier 1. I did not see its segments or figures, so this lesson gives none.
- The 2013 comparison (arXiv copy posted 2014) uses one game and two variables; the 2012 paper covers two games. Both are by the same group. The search for a comparison by another group was this course's own (the course-level check of 2026-11-19, by titles and abstracts), grade C, so "none found" is not "none exists".
