# Course check: game economy and prediction

Date: 2026-11-19

Method. For each lesson I took the main finding from its front matter, "Opening question" and "The idea", then looked for reviews, replications and contrary or null results. Citing lists: Semantic Scholar for all thirteen sources; OpenAlex, paged in full, for Zivic et al., Hogan-Hennessy et al., Hullett et al., Drachen et al. 2014, Runge et al. 2014, Dormans and Close et al. 2021, where Semantic Scholar's lists were short or empty. I scanned the titles and opened the abstract of anything that looked like a second test. Then I ran web searches on the wider field (windfall spending, virtual economy interventions, churn definitions, uplift modelling, player clustering, game economy simulation, engagement matchmaking, loot boxes and problem gambling, longitudinal loot box studies). Abstracts were read through Semantic Scholar and OpenAlex records or a publisher, repository or PubMed Central page.

Limits. Almost everything here was read at the abstract only, so no number below comes from a table. A title scan misses papers whose title does not name the topic, and where I say what citing papers do, that is judged by title unless the bullet says the abstract was read. Sage, INFORMS, ScienceDirect and CroRIS refused automated access, so some abstracts could not be opened and are listed at the end. Semantic Scholar rate limits cut some lookups short. A paper's authors are noted where they overlap with the lesson's source, since a study by the same group is not an independent check.

## Summary

| Lesson | Main finding | Rests on | Verdict | Note |
|---|---|---|---|---|
| gd-econ/endowment | A bigger starting grant raised day-7 retention; no drop in first purchases found | Zivic et al. 2017, Top Eleven | stands alone | No replication of a starting-grant test found; one randomized trial on easier difficulty shows a similar retention-for-spend trade-off with a different lever |
| gd-econ/sinks | An item sink raised the prices of the items it bought | Hogan-Hennessy et al. 2022, Old School RuneScape, preprint | stands alone | No other study of a game sink's price effect found; still a preprint |
| gd-econ/content-usage | Most shipped content in one racing game was rarely used | Hullett et al. 2012, Project Gotham Racing 4 | stands alone | Later papers cite it, none measures content usage in another game in what I opened |
| gd-econ/churn-time | Churn is a chosen rule, and churn data is censored, so model time | Periáñez et al. 2016; Hadiji et al. 2014 | supported | Survival framing used independently in League of Legends, Blade and Soul and Ubisoft games; the definition-sensitivity paper could not be opened |
| gd-econ/spend-skew | Few players pay; a small group brings much of the revenue | Close et al. 2021; Sifa et al. 2015; Chen et al. 2018 | supported | A 2,873-game transaction study agrees on concentration but finds it varies widely by game |
| gd-econ/predict-vs-act | A churn model says who leaves, not what keeps them; a free-currency gift had no significant effect | Runge et al. 2014 | supported | General point supported by marketing field experiments; the free-currency null itself stands alone |
| gd-econ/segments | The clustering method shapes the segments | Drachen et al. 2014; Drachen et al. 2012 | stands alone | Only the same group's later work agrees; no independent comparison found |
| gd-econ/uplift | Target by response to the offer, not by churn risk | Ascarza 2018; Gutierrez and Gérardy 2017; Wei et al. 2024 | supported | Field experiments and a finance case agree; one theory paper and one field experiment add conditions |
| gd-econ/survival | Survival analysis fits churn and playtime; survival ensembles and neural nets beat older models | Viljanen et al. 2018; Periáñez et al. 2016; Chen et al. 2018 | supported | The method is used independently; the specific model rankings stand alone |
| gd-econ/simulation | An executable economy model can show which levers matter before the game exists | Dormans 2011 | stands alone | No study checking such a model against real players found |
| gd-econ/eomm | Matchmaking tuned for churn retained more players than skill matching, in simulation | Chen et al. 2017 | supported | Independent work points the same way; EOMM's own numbers remain simulation only |
| gd-econ/vulnerable | Loot box spending tracks problem gambling | Zendle and Cairns 2018, 2019; Close et al. 2021 | supported | Two meta-analyses agree; one Chinese sample did not replicate, and income also predicts spend |

## gd-econ/endowment

Finding as the lesson states it. In a randomized test on about 575,000 new Top Eleven players, starting with 80 or 120 Tokens instead of 40 raised day-7 retention by 6.9% and 7.7% (relative), and first purchases did not fall.

Searched. Papers citing Zivic et al. (Semantic Scholar listed 5, OpenAlex 11, several of them misattributed chemistry and biology papers); "field experiment mobile game free virtual currency grant new players retention monetization randomized"; "virtual currency endowment free-to-play retention experiment"; the windfall spending route ("house money effect windfall money spent").

Found.
- Ascarza, Netzer, Runge (2025). Personalized game design for improved user retention and monetization in freemium games. International Journal of Research in Marketing ([DOI](https://doi.org/10.1016/j.ijresmar.2025.01.006)). Tier 1 as published. Read: the abstract of the December 2023 working paper, an institution-hosted PDF ([PDF](https://business.columbia.edu/sites/default/files-efs/citation_file_upload/ascarza_netzer_runge_2023-12-04.pdf)); the published text was not opened. A large randomized trial in one F2P mobile game: an easier game lowered purchases in the round played but raised engagement and long-term retention, and so raised spending in the short and long run. Different lever (difficulty, not a grant), same trade-off shape. Not a replication.
- Runge, Levav, Nair (2022). Price promotions and "freemium" app monetization. Quantitative Marketing and Economics 20(2) ([DOI](https://doi.org/10.1007/s11129-022-09248-3)). Tier 1. Read: abstract summary on the IDEAS record. Randomized promotions on or off in one free-to-play game: higher conversion and revenue, no sign of harmful substitution over time. A different lever (discounts, not free currency); it bears only on the wider worry that giving value away hurts sales.
- Exploratory Bandit Experiments with "Starter Packs" in a Free-to-Play Mobile Game. IEEE CoG 2024 ([DOI](https://doi.org/10.1109/cog60054.2024.10645582)). Tier 1. Read: abstract. A bandit lowered the average price of starter packs for new players and showed an "indicative" lift in revenue per user, repeat purchases and retention against a holdout. A cheaper paid offer, not a free grant, and the abstract calls the lift indicative.
- Consumers' Adoption and Use of E-Currencies in Virtual Markets in the Context of an Online Game. JTAER 2021 ([DOI](https://doi.org/10.3390/jtaer16050071)). Read: abstract. A survey of 205 currency users on technology acceptance; does not test an endowment. The other citing papers were judged by title only (a review of MMOs as research settings, a survey of validity threats, an adoption guide for experiments, a Top Eleven teaching paper) and none looks like a second test.
- Within this course, lesson 6's source (Runge et al. 2014) found that free in-game currency in an A/B test did not significantly change churn or monetization. That is another game and another moment, not a failed replication.
- Windfall spending (Arkes et al. 1994) was found only in a search result and its abstract could not be opened, so it is not used.

Verdict: stands alone. No second test of a starting currency grant was found in any game; the nearest evidence uses other levers.

Lesson edit called for: say that no replication of a starting-grant test was found, so the result is one test in one game.

## gd-econ/sinks

Finding as the lesson states it. In Old School RuneScape, a sink that bought and deleted targeted items raised their prices by about 7% in round one, against control items, in a natural experiment.

Searched. Papers citing the preprint (Semantic Scholar listed one, OpenAlex four); "empirical study virtual economy gold sink tax intervention item prices MMO natural experiment"; "Old School RuneScape Grand Exchange tax item sink prices study". Checked whether a peer-reviewed version exists: none found; Semantic Scholar lists it as arXiv only.

Found. Nothing that tests a sink's price effect in another game.
- Virtual Inflation under Control: Sustainable Mechanisms for Managing In-Game Economies (2026), a narrative review in the Universal Library of Innovative Research and Studies ([DOI](https://doi.org/10.70315/uloap.ulirs.2026.0301002)). Read: abstract. It synthesizes case reports and literature into advice; the abstract reports no new test, and I could not confirm the venue's review process, so it is not used as evidence.
- The other three citing papers (game data storage, legal regulation of virtual goods, smart contracts) were judged by title and are unrelated.
- Other virtual economy papers named in search results (Team Fortress 2 prices, World of Warcraft auction house, a Chinese MMORPG currency model) were seen only as snippets and not opened.

Verdict: stands alone. One preprint, one game, one intervention.

Lesson edit called for: say that no other study of a sink's effect on prices was found and the preprint has no peer-reviewed version yet.

## gd-econ/content-usage

Finding as the lesson states it. In Project Gotham Racing 4, 104 of 134 vehicles and 81 of 121 routes were each used in fewer than 1% of races.

Searched. Papers citing Hullett et al. (Semantic Scholar and OpenAlex each listed 32: game software engineering reviews, balancing papers, skill studies in Halo and Forza, a rally game metrics chapter); "game telemetry study players use small fraction of game content features rarely used empirical"; "Madden NFL telemetry unused features".

Found.
- Improving player balancing in racing games. CHI PLAY 2014 ([DOI](https://doi.org/10.1145/2658537.2658701)). Read: abstract. Tests balancing aids in a prototype racing game; not about content usage.
- Better Game Experience Through Game Metrics: A Rally Videogame Case Study (2013 book chapter, [DOI](https://doi.org/10.1007/978-1-4471-4769-5_16)). No abstract available in OpenAlex; not opened.
- The rest were judged by title; none looks like a measure of unused content in another game.
- A Madden NFL 11 retention paper (Weber et al. 2011) appears to cite the PGR4 study for the unused-content point, but I saw it only in a search result and did not open it.

Verdict: stands alone.

Lesson edit called for: say that no study of content usage in another game was found, so the share of rarely used content is one game's figure.

## gd-econ/churn-time

Finding as the lesson states it. Churn is a rule the team picks (here 10 idle days), and many players are still active when data is pulled, so churn data is censored and a model should treat churn as a time.

Searched. Papers citing Periáñez et al. and Hadiji et al.; "churn definitions mobile games classification"; titles with "survival" or "definition".

Found.
- Lee et al. (2018). Game Data Mining Competition on Churn Prediction and Survival Analysis Using Commercial Game Log Data. IEEE Transactions on Games ([DOI](https://doi.org/10.1109/TG.2018.2888863)). Tier 1. Read: abstract. An open competition on Blade and Soul logs (NCSOFT) asked entrants to predict whether and when a player would churn. Independent group; same framing of churn as a time.
- Demediuk et al. (2018). Player retention in League of Legends: a study using survival analysis. ACSW ([DOI](https://doi.org/10.1145/3167918.3167937)). Tier 1. Read: abstract. Mixed-effects Cox regression on League of Legends; time between matches was a strong churn indicator. Shares one author (Drachen) with Hadiji et al., not with Periáñez et al.
- Allart et al. (2017). Difficulty influence on motivation over time in video games using survival analysis. FDG ([DOI](https://doi.org/10.1145/3102071.3102085)). Tier 1. Read: abstract. Survival analysis of retention in two Ubisoft games. Independent; same method.
- Perišić and Beljo (2025). A Methodological Framework for Quantifying Sensitivity of Prediction Performance to Conceptual Uncertainty: The Case of Churn Window Size. ACIT ([DOI](https://doi.org/10.1109/ACIT65614.2025.11185641)). Tier 1. Read: abstract. Says the modeller must choose a churn window in non-contractual settings and presents a method to measure how prediction performance changes with that choice, on one freemium mobile game. The abstract reports no result, so it supports only that the choice is treated as a real source of uncertainty.
- Perišić, Šišak Jung, Pahor (2021). Churn in the mobile gaming field: Establishing churn definitions and measuring classification similarities. Expert Systems with Applications ([DOI](https://doi.org/10.1016/j.eswa.2021.116277)). Could not open; its findings are not used.

Verdict: supported. Treating churn as a time with censoring is used by independent groups in other games. The claim that different windows give different churn rates is the lesson's own reasoning (grade C); the one paper that tests it directly could not be opened.

Lesson edit called for: none.

## gd-econ/spend-skew

Finding as the lesson states it. Only a small fraction of players buy anything, and a small group brings much of the revenue (top 5% of loot box buyers make half of loot box revenue in pooled surveys; whales around 2% of players in one game).

Searched. Papers citing Close et al. 2021 (OpenAlex), Sifa et al. 2015 and Chen et al. 2018 (Semantic Scholar); titles with "whale", "lifetime value", "spend".

Found.
- Zendle, Flick, Deterding, Cutting, Petrovskaya, Drachen (2023). The Many Faces of Monetisation: Understanding the Diversity and Extremity of Player Spending in Mobile Games via Massive-scale Transactional Analysis. ACM Games: Research and Practice ([DOI](https://doi.org/10.1145/3582927)). Tier 1. Read: abstract. Transaction data, not surveys: $4.7B spent by 69,144,363 players of 2,873 mobile games over 624 days. Revenue distributions are diverse: a "uniform" cluster where spenders spend about the same, and "hyper-Pareto" games where about 38% of revenue comes from 1% of spenders. Agrees that concentration happens and can be extreme, and shows it is not the same in every game. Shares one author (Drachen) with Sifa et al. 2015.
- Valdivia (2021). Customer Lifetime Value in Mobile Games: a Note on Stylized Facts and Statistical Challenges. IEEE CoG ([DOI](https://doi.org/10.1109/CoG52621.2021.9619092)). Tier 1. Read: abstract. Names zero-inflation and heavy tails as empirical properties of mobile game spend data. Independent; agrees on shape, gives no figures in the abstract.
- Close, Spicer, Nicklin, Lloyd, Lloyd (2022). Loot box engagement: relationships with educational attainment, employment status and earnings in a cohort of 16 000 United Kingdom gamers. Addiction ([DOI](https://doi.org/10.1111/add.15837)). Tier 1. Read: abstract. In 16,196 UK adult gamers, 17.16% bought loot boxes, with a mean self-reported monthly spend of £29.12. Same research group as Close et al. 2021, new sample.
- Drachen et al. (2018). To be or not to be...social. ACSW ([DOI](https://doi.org/10.1145/3167918.3167925)). Tier 1. Read: abstract. States as background that only a small fraction of users make purchases, in a casual mobile game with over 200,000 players. Shares an author with Sifa et al.; the abstract gives no share.

Verdict: supported. Concentrated spend is found in transaction data across thousands of games, not only in self-report surveys. The size of the concentration varies a lot between games.

Lesson edit called for: say that a study of 2,873 mobile games found spend concentration ranging from near uniform to extreme, so any one game's figure, including the 2% whale figure, does not carry over.

## gd-econ/predict-vs-act

Finding as the lesson states it. A churn model says who is likely to leave, not what will keep them. In Runge et al.'s A/B test, free in-game currency did not significantly change churn or monetization.

Searched. Papers citing Runge et al. 2014 (Semantic Scholar listed 161, OpenAlex 175; titles with "intervention", "incentive", "treatment", "reward", "currency", "experiment"); the uplift and targeting literature (see the uplift lesson).

Found.
- Ascarza (2018), the uplift lesson's source, abstract read: says programmes can be futile because of the targeting rule and that the highest-risk customers are not necessarily the best targets, from two field experiments outside games. Agrees with the general point.
- Li et al. (2021). A Difficulty-Aware Framework for Churn Prediction and Intervention in Games. KDD ([DOI](https://doi.org/10.1145/3447548.3467277)). Tier 1. Read: abstract. In one puzzle game, an online A/B test of dynamic difficulty adjustment raised retention and engagement significantly. A tested intervention that did work, on a different lever; it supports testing each intervention, not the gift result.
- Ascarza, Netzer, Runge (2025, IJRM; working paper abstract read, see endowment lesson). Easier difficulty raised retention in a randomized trial, with substantial differences between players. It cites Runge et al. 2014.
- No other A/B test of free in-game currency on churn was found.

Verdict: supported for the general point that prediction does not tell you what works, from marketing field experiments and game A/B tests. The specific null for free currency stands alone.

Lesson edit called for: say that the free-currency null is one A/B test with no replication found, while a tested difficulty intervention in another game did raise retention.

## gd-econ/segments

Finding as the lesson states it. Different clustering methods give different segments from the same data (PCA and NMF gave impossible profiles, k-means similar ones, archetypal analysis distinct ones, on World of Warcraft playtime and levelling).

Searched. Papers citing Drachen et al. 2014 (Semantic Scholar listed 80, OpenAlex 84, scanned by title); "player clustering comparison"; the player-modelling systematic review route.

Found.
- Bauckhage, Drachen, Sifa (2015). Clustering Game Behavior Data. IEEE Transactions on Computational Intelligence and AI in Games ([DOI](https://doi.org/10.1109/TCIAIG.2014.2376982)). Tier 1. Read: abstract. A review and tutorial: says proper use of clustering takes expertise and an understanding of the game to judge results. Same authors as the source, so not independent.
- Drachen et al. (2016). Guns and guardians: Comparative cluster analysis and behavioral profiling in Destiny. IEEE CIG ([DOI](https://doi.org/10.1109/CIG.2016.7860423)). Tier 1. Read: abstract. Four methods on Destiny; the abstract says cross-model analysis identified four to five distinct playstyles across each method, and it discusses which model to use in which circumstances. Same group. The abstract does not say whether the methods found the same playstyles.
- Hooshyar, Yousefi, Lim (2018). Data-Driven Approaches to Game Player Modeling: A Systematic Literature Review. ACM Computing Surveys ([DOI](https://doi.org/10.1145/3145814)). Tier 1. Read: abstract. Lists clustering among the main methods in 46 studies; the abstract says nothing on whether methods agree.

Verdict: stands alone. The only related work found is by the same group, and no independent comparison of methods on game data was found.

Lesson edit called for: say that the comparison has not been repeated by another group in what I found.

## gd-econ/uplift

Finding as the lesson states it. Target the players an offer changes (uplift), not those at highest churn risk; Ascarza found targeting by sensitivity significantly more effective than targeting the highest-risk customers.

Searched. Papers citing Ascarza 2018 (Semantic Scholar listed 286; titles with "uplift", "targeting", "treatment"); "uplift models versus churn prediction"; Lemmens and Gupta.

Found.
- Lemmens and Gupta (2020). Managing Churn to Maximize Profits. Marketing Science ([DOI](https://doi.org/10.1287/mksc.2020.1229)). Tier 1. Read: abstract on the Erasmus repository page. Ranks customers by the incremental effect of the intervention on churn and cash flow, net of cost; two field experiments found significantly more profitable campaigns than competing models. Independent; agrees, and adds that response alone is not enough without value and cost.
- Devriendt, Berrevoets, Verbeke (2021). Why you should stop predicting customer churn and start using uplift models. Information Sciences ([DOI](https://doi.org/10.1016/j.ins.2019.12.075)). Tier 1. Read: abstract. Notes the literature lacked conclusive evidence that uplift beats predictive modelling; in a financial-industry retention case, uplift models outperformed churn prediction models and improved profit. Independent; agrees.
- Athey, Keleher, Spiess. Machine Learning Who to Nudge: Causal vs Predictive Targeting in a Field Experiment on Student Financial Aid Renewal ([arXiv](https://arxiv.org/abs/2310.08672)). Tier 2 here: Semantic Scholar lists it as Journal of Econometrics, but I read the arXiv abstract and did not confirm the published version. In a field experiment with over 53,000 students, targeting low predicted baseline outcomes was detrimental, and targeting intermediate baseline outcomes worked best. Agrees that risk is the wrong criterion.
- Verhelst, Petit, Verbeke, Bontempi (2023). Uplift vs. predictive modeling: a theoretical analysis ([arXiv](https://arxiv.org/abs/2309.12036)). Tier 2, not peer-reviewed. Read: abstract. Shows by theory and simulation that there are conditions under which predictive approaches still outperform uplift modelling. A qualification, not a contradiction.
- No game study beyond the lesson's Tencent preprint compares uplift targeting with risk targeting.

Verdict: supported. Independent field experiments and a case study agree that response, not risk, should drive targeting. The evidence is from marketing, finance and education, not games, and one theory paper shows uplift does not always win.

Lesson edit called for: say that uplift is not always better: a theory paper finds conditions where predictive targeting wins, and a profit study adds that customer value and offer cost matter too.

## gd-econ/survival

Finding as the lesson states it. Survival analysis handles censored playtime and churn data and gives a curve, median, mean and hazard; survival ensembles beat Cox and Kaplan-Meier on one game; buy-till-you-die models underestimated top spenders in another.

Searched. Papers citing Viljanen et al. (arXiv record; the journal DOI returned none), Periáñez et al. and Chen et al.

Found.
- Demediuk et al. 2018, Allart et al. 2017 and Lee et al. 2018 (all under churn-time above): survival methods applied to retention in League of Legends, two Ubisoft games and Blade and Soul by groups independent of Viljanen and Periáñez.
- Viljanen et al. (2017). A/B-Test of Retention and Monetization Using the Cox Model. AIIDE ([DOI](https://doi.org/10.1609/aiide.v13i1.12941)). Tier 1. Read: abstract. Same group as the lesson's source; extends its A/B approach with the Cox model on real F2P data. Not independent.
- Valdivia 2021 (spend-skew above): zero-inflation and heavy tails in lifetime value data may call for revisiting assumptions of models such as Pareto/NBD. Independent; in line with the lesson's point on buy-till-you-die models, with no figures in the abstract.
- No independent comparison of survival ensembles against Cox regression on game data was found.

Verdict: supported for the method. The specific model rankings (survival ensembles over Cox, neural nets over Pareto/NBD) each rest on one studio's data.

Lesson edit called for: say that the model rankings come from single games and were not repeated by another group in what I found.

## gd-econ/simulation

Finding as the lesson states it. Machinations diagrams can run a game economy with scripted bots before the game exists; in SimWar, production against offence costs drove balance more than offence against defence.

Searched. Papers citing Dormans 2011 (Semantic Scholar listed 37, OpenAlex 39, scanned by title); "Machinations game economy simulation validation against real player data study".

Found.
- Neil (2012). Game design tools: Time to evaluate. Nordic DiGRA ([DOI](https://doi.org/10.26503/dl.v2012i1.606)). Tier 1. Read: abstract. Argues that formal game design models and tools had not been adopted in mainstream practice and that evaluation of how they fare in real design work was missing. Independent; agrees with the lesson's limits.
- Rogers et al. (2023). Using Evolutionary Algorithms to Target Complexity Levels in Game Economies. IEEE Transactions on Games ([DOI](https://doi.org/10.1109/TG.2023.3238163)). Tier 1. Read: abstract. Generates economy graphs of a target complexity and checks perceived complexity with a user study in a city-building prototype. Checks a model property against players, but not whether a simulation predicts balance.
- Zhang et al. Beyond Playtesting: A Generative Multi-Agent Simulation System for MMO Games ([arXiv](https://arxiv.org/abs/2512.02358)). Tier 2 here: listed as WWW 2026, published version not confirmed. Read: abstract. LLM agents trained on real player logs; reports strong consistency with real player behaviour. A different kind of simulation, and it shows the gap the lesson names: simple scripted bots are not real players.
- No study was found that tests a Machinations-style prediction against what real players later did.

Verdict: stands alone. One independent paper agrees with the lesson's limits, and no validation against players was found.

Lesson edit called for: say that no study comparing such a simulation's predictions with real play was found.

## gd-econ/eomm

Finding as the lesson states it. Matching players to minimise predicted churn retained 0.7% more players per round than skill-based matching in a simulation on EA data; nothing was tested on live players.

Searched. Papers citing Chen et al. 2017 (Semantic Scholar listed 32); "engagement matchmaking"; Huang, Jasin, Manchanda.

Found.
- Huang, Jasin, Manchanda (2019). "Level Up": Leveraging Skill and Engagement to Maximize Player Game-Play in Online Video Games. Information Systems Research ([DOI](https://doi.org/10.1287/isre.2019.0839)). Tier 1. Read: abstract (Semantic Scholar record). A hidden Markov model of engagement on 1,309 players over 29 months, then a matching algorithm that raises play volume and frequency by 4 to 8%, conservatively. The abstract does not say this was tested on live players. Independent; same direction.
- Chen, Elmachtoub, Lei (2022). Matchmaking Strategies for Maximizing Player Engagement in Video Games. ACM EC ([DOI](https://doi.org/10.1145/3490486.3538314)). Tier 1. Read: abstract. A model where players churn after losing streaks; on online chess data the optimal policy improves engagement by 4 to 6% over skill-based matching. Model-based, not a live test. Independent.
- Deng et al. (2021). Globally Optimized Matchmaking in Online Games. KDD ([DOI](https://doi.org/10.1145/3447548.3467074)). Tier 1. Read: abstract. Reports experiments in simulation and online game environments; no numbers in the abstract.
- Wang et al. (2024). EnMatch: Matchmaking for Better Player Engagement via Neural Combinatorial Optimization. AAAI ([DOI](https://doi.org/10.1609/aaai.v38i8.28760)). Tier 1. Read: abstract. Engagement-oriented matching with online deployments in two games; no numbers in the abstract.
- Kang, Suh, Kim (2024). Match experiences affect interest. Heliyon ([DOI](https://doi.org/10.1016/j.heliyon.2024.e24891)). Tier 1. Read: abstract. Observational panel of about six million matches by over 262,000 players in one casual game: being matched with weaker opponents lowered churn more than fair matches, and stronger opponents raised it. Supports the premise that fair is not the churn-minimising match.

Verdict: supported for the idea that matching tuned for engagement can beat skill-only matching, from independent groups. EOMM's own figures are still simulation only, and no live result with numbers was seen in the abstracts.

Lesson edit called for: say that later independent work points the same way (one system reports online deployments in two games, another reports online experiments, and an observational study found weaker opponents lowered churn), but none of the abstracts gives live numbers, so EOMM's own figures remain simulation only.

## gd-econ/vulnerable

Finding as the lesson states it. Loot box spending is linked to problem gambling severity in self-report surveys, and in pooled data spend tracked problem gambling, not earnings.

Searched. Papers citing Close et al. 2021 (OpenAlex, about 110 listed); "meta-analysis loot box spending problem gambling"; "loot box spending personal income problem gambling"; titles naming null or weak links, gateway effects and longitudinal designs; "longitudinal study loot box purchasing problem gambling prospective cohort".

Found.
- Garea, Drummond, Sauer, Hall, Williams (2021). Meta-analysis of the relationship between problem gambling, excessive gaming and loot box spending. International Gambling Studies ([DOI](https://doi.org/10.1080/14459795.2021.1914705)). Tier 1. Read: abstract. 15 studies: r = 0.26 between loot box spending and gambling symptoms (0.37 with trim and fill), called small but replicable. Agrees.
- Spicer, Nicklin, Uther, Lloyd, Lloyd, Close (2022). Loot boxes, problem gambling and problem video gaming: A systematic review and meta-synthesis. New Media and Society ([DOI](https://doi.org/10.1177/14614448211027175)). Tier 1. Read: abstract (Semantic Scholar record; the Sage page refused access). 12 of 13 publications reported a positive link, mean r = .27; says the direction of causality needs more evidence. Shares authors with Close et al. 2021.
- Xiao, Fraser, Newall (2022). Opening Pandora's Loot Box: Weak Links Between Gambling and Loot Box Expenditure in China. Journal of Gambling Studies ([DOI](https://doi.org/10.1007/s10899-022-10148-0)). Tier 1. Read: abstract. A preregistered survey of 879 players in mainland China failed to replicate the correlation with problem gambling; few respondents gambled (87), which the authors call a limitation. A null in a different setting.
- Xiao, Newall, James (2023). To screen, or not to screen. Computers in Human Behavior ([DOI](https://doi.org/10.1016/j.chb.2023.108019)). Tier 1. Read: abstract. An experiment with 2,027 participants: the correlation held whether or not the problem gambling scale was screened, so it is likely not due to players counting loot boxes as gambling. Supports.
- Mattinen, Macey, Hamari (2026). Predicting participation and expenditure on distinct gambling-like mechanics. Internet Research ([DOI](https://doi.org/10.1108/intr-06-2025-0905)). Tier 1. Read: abstract. In 587 adult gamers, problem gambling severity predicted whether people bought some gambling-like content but predicted the amount spent in no category. Partly contrary on spend amount.
- Garrett, Sauer, Drummond, Lowe-Calverley (2022). Problem gambling and income as predictors of loot box spending. International Gambling Studies ([DOI](https://doi.org/10.1080/14459795.2022.2029528)). Tier 1. Read: abstract. Reanalysis of 1,049 participants in three countries: higher income brackets spent more on loot boxes; problem gambling mattered more than income, but both contribute. Qualifies "not earnings".
- Close et al. (2022), Addiction (spend-skew above). Lower earners spent a higher share of monthly earnings on loot boxes. Same group as the source.
- Spicer et al. (2022). Loot boxes and problem gambling: Investigating the "gateway hypothesis". Addictive Behaviors ([DOI](https://doi.org/10.1016/j.addbeh.2022.107327)). Tier 1. Read: abstract. Self-reported gateway effects in both directions among 1,102 people who buy loot boxes and gamble; cross-sectional, so causality is not settled. Same group as the source.
- Palmer, Brooks, Clark (2025). A longitudinal replication study testing migration from video game loot boxes to gambling in British Columbia, Canada. BMC Psychology 13:459 ([DOI](https://doi.org/10.1186/s40359-025-02766-1)). Tier 1. Read: full text on PubMed Central. A six-month follow-up of young adult gamers, with 54 baseline non-gamblers followed up: loot box spending predicted later gambling spend; for starting to gamble, only the Bayesian models with priors from the earlier study showed an association, with 7 starters. The authors say the results do not extend to problem gambling or harm. Longitudinal, small, and about gambling, not problem gambling severity.
- McCaffrey (2023). Loot Boxes, Problem Gambling, and Problem Gaming: A Critical Review of the Emerging Literature. Communications of the AIS ([DOI](https://doi.org/10.17705/1cais.05206)). Tier 1. Read: abstract. Argues the field has problems with data, sampling and tools, and is not yet reliable for practical purposes. A critical review.
- Xiao, Ballou, Eben (2025). Fundamental Flaws in the Design and Reporting of Chew and Neo (2024). Trends in Psychology ([DOI](https://doi.org/10.1007/s43076-025-00486-4)). Tier 1. Read: abstract. Says Chew and Neo reported findings contrary to prior work, and that their survey wrongly told participants League of Legends had no loot boxes. The Chew and Neo paper itself could not be opened.

Verdict: supported. Two meta-analyses and an experiment back the link in Western samples. There is one preregistered null in China, one study where problem gambling predicted buying but not amount, a critical review of the field's methods, and evidence that income also predicts spend.

Lesson edit called for: say that income also predicts loot box spend in one reanalysis and that the link did not replicate in a Chinese sample; the lesson's own sources are cross-sectional self-report, and the one longitudinal study read here tracked later gambling, not problem gambling.

## Could not open

- Perišić, Šišak Jung, Pahor (2021), Expert Systems with Applications, [DOI](https://doi.org/10.1016/j.eswa.2021.116277). ScienceDirect returned 403, no abstract in Crossref or OpenAlex, and CroRIS shows a robot check.
- Chew and Neo (2024), Trends in Psychology, [DOI](https://doi.org/10.1007/s43076-024-00425-9). No abstract in OpenAlex; Semantic Scholar rate limit. Described here only through the critique's abstract.
- Arkes et al. (1994), The Psychology of Windfall Gains, Organizational Behavior and Human Decision Processes, [DOI](https://doi.org/10.1006/obhd.1994.1063). No abstract in OpenAlex; the Michigan repository returned 403.
- Weber, John, Mateas, Jhala (2011), Modeling Player Retention in Madden NFL 11, AAAI. Seen only in a search result; not opened.
- Studies named only in search snippets and not opened: Zendle, Petrovskaya and Wardle on Counter-Strike loot box openings; a 2024 Journal on Interactive Systems paper using Machinations; Baumer and Kephart on Team Fortress 2 prices; Xu et al. 2017 on MMORPG currency prices. None is used above.
- Publisher pages that refused access (403), with abstracts read elsewhere instead: Sage for Spicer et al. 2022, INFORMS for Huang et al. 2019, Erasmus repository used for Lemmens and Gupta 2020.
