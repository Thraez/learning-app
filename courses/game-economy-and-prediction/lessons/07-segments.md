---
id: gd-econ/segments
course: gd-econ
title: The clustering method shapes the segments
order: 7
status: draft
checked: 2026-11-16
sources:
  - cite: "Drachen, Thurau, Sifa, Bauckhage (2014). A Comparison of Methods for Player Clustering via Behavioral Telemetry. arXiv:1407.3950."
    url: https://arxiv.org/abs/1407.3950
    grade: A
    tier: 2
    note: arXiv comment says Foundations of Digital Games 2013, and a copy with the same title and authors is on the conference site (http only); the conference's review process could not be confirmed from its own pages, so treated as not peer-reviewed
  - cite: "Drachen, Sifa, Bauckhage, Thurau (2012). Guns, swords and data: Clustering of player behavior in computer games in the wild. IEEE CIG 2012, pp. 163-170. DOI 10.1109/CIG.2012.6374152."
    url: https://doi.org/10.1109/CIG.2012.6374152
    grade: A
    tier: 1
    note: abstract only, read on IEEE Xplore
---

# Lesson 7: The clustering method shapes the segments

## Opening question

### gd-econ/segments/open · open

[Researchers](https://arxiv.org/abs/1407.3950) ran k-means on the playtime and levelling speed of 70,014 World of Warcraft characters and asked for eight player groups. When they plotted the groups' average players, the centroids were, with one exception, so alike that they were hard to label. Is the data telling you WoW players are similar, or is something else going on?

<details>
<summary>Answer</summary>
Something else. K-means describes each group by its average player, and here those averages came out similar. A method that looks for extreme players instead gave clearly different profiles on the same data.
</details>

## The idea

Clustering doesn't find the segments in your players. It finds the segments its own method is built to find, and different methods give different answers from the same data.

[Drachen and colleagues](https://arxiv.org/abs/1407.3950) compared common methods on playtime and levelling speed for 70,014 World of Warcraft characters, sampled from about 18 million logged between 2005 and 2010 (data mined from a public site, with a few percent of values filled in). They set eight groups for every method. The paper is on arXiv; its own note names Foundations of Digital Games 2013, and the conference site carries a copy with the same title and authors. I could not confirm that conference's review process from its own pages, so treat it as not peer-reviewed. The results split three ways. PCA and NMF gave profiles that can't happen in the game, such as players losing levels. K-means gave legal profiles, but its centroids were so similar that they were hard to label. Archetypal analysis (run with an algorithm called SIVM) looks for extreme players on the edge of the data rather than averages, so each profile is a real player, and its profiles were clearly different from each other.

Two more points from the paper. The number of groups is a judgment call, since unsupervised methods have no objective cutoff; here the authors picked eight by weighing variance explained against a usable number of profiles. And the paper uses only two variables from one game, so it shows that the choice matters, not which method is best in general.

An [earlier paper by the same group](https://doi.org/10.1109/CIG.2012.6374152) (peer-reviewed, IEEE CIG 2012) clustered 260,000 characters from Tera and Battlefield: Bad Company 2 (the abstract writes "Battlefield 2: Bad Company 2") with k-means and SIVM. Its abstract says the two algorithms gave different insights into the same players, and that the clustering was combined with considerations of each game's design to get actionable profiles.

## Why

### gd-econ/segments/why · why

Why do k-means centroids tend to look alike, while archetypes look different? Answer before opening.

<details>
<summary>Model answer</summary>
A centroid is the average of everyone in its group, so it sits in the dense middle of the data and smooths away the extremes that make players different. An archetype is an actual player on the outer edge of the data, and every other player is described as a mix of these extremes, so the profiles are far apart by design. The paper states that k-means focuses on the average and archetypal analysis on extreme behaviour; the reason averages converge is my explanation, grade C.
</details>

## Scenario

### gd-econ/segments/scenario · scenario

Your team wants to send different offers to "player types". The analyst's deck shows five segments with names like "casual explorer" and "hardcore grinder", built with k-means on 40 features. Before the offers are designed around these names, what do you ask?

<details>
<summary>Explained answer</summary>
Ask how the number of segments was picked, whether another method or another number gives similar groups, and whether each profile is a behaviour the game actually allows. Ask to see real players near each centroid, not just the average, and check how far apart the centroids are on the features that matter for the offer. If the segments shift a lot with the method or the count, the names describe the analysis more than the players. The questions follow from the paper; turning them into a checklist is my suggestion, grade C.
</details>

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
Extreme players on the edge of the data, each one a real player, instead of the average player of each group.
</details>

### gd-econ/segments/r3 · recall

How was the number of groups chosen in the comparison, and why is that a weak point of clustering in general?

<details>
<summary>Answer</summary>
The authors picked eight by weighing variance explained against a useful number of profiles. Unsupervised methods have no objective cutoff, so the number is always a judgment call.
</details>

## Sources and grades

- [Drachen et al., arXiv:1407.3950](https://arxiv.org/abs/1407.3950), full text read (arXiv PDF). Grade A for the dataset, the method comparison and the k = 8 choice, all checked against the text. Tier 2: its arXiv note names Foundations of Digital Games 2013 and the conference site carries the same paper, but Crossref has no record and I could not open the conference's own statement of its review process (a repost of its call for papers speaks of peer-reviewed papers). Until that is confirmed it is labelled not peer-reviewed.
- [Drachen et al. 2012, IEEE CIG](https://doi.org/10.1109/CIG.2012.6374152), abstract read on IEEE Xplore. Grade A for the abstract's claims only, tier 1. I did not see its segments or figures, so this lesson gives none.
- The 2014 comparison uses one game and two variables; the 2012 paper covers two games. How studios segment players in practice is mostly unpublished, as the 2014 paper itself notes.
