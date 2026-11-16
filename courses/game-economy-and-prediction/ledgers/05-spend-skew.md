# Ledger: gd-econ/spend-skew

2026-11-16. Rows come from the source check pilot (a fresh checker that did not write the lesson), re-keyed from line numbers to sections and item IDs. Rows whose sentence was then fixed are marked `differs` with the fix in the note, and stay that way until a fresh context rechecks them.

How far each source was read: Close et al. 2021, the published abstract (Europe PMC copy of the PubMed record) and, by the pilot checker only, the accepted manuscript from the University of Wolverhampton repository. Sifa et al. 2015, abstract only (OpenAlex copy of the publisher abstract); the AAAI page and PDF returned a bot check, so the full text is `could not open`. Chen et al. 2018, full text from the arXiv PDF (arXiv:1811.12799); the IEEE version was not opened.

| Where | Claim | Source and place | Verdict | Note |
|---|---|---|---|---|
| front matter | Close et al. cite: authors, title, Addictive Behaviors 117, 106851, DOI | Crossref; Europe PMC | matches |  |
| front matter | Abstract read from PubMed | Europe PMC copy of PMID 33578105 | matches | The record exists with that abstract. |
| front matter | Sifa et al. cite: authors, title, AIIDE 2015, pp. 79 to 85, DOI | Crossref | differs | Old wording. Fixed 2026-11-16 by the orchestrator with the source open; not yet rechecked by a fresh context. Front matter note now says the abstract was read through the OpenAlex record, since the AAAI page sits behind a bot check. |
| front matter | Chen et al. cite: authors, title, IEEE Big Data 2018, pp. 2134 to 2140, DOI, arXiv:1811.12799 | Crossref; arXiv | matches |  |
| front matter | 2% and 50% figure stated without data, so grade B | Chen III.B | matches |  |
| gd-econ/spend-skew/open | Psychologists pooled every open survey dataset on loot box buying they could find | Close abstract, Methods (manuscript) | matches | Authors are in psychology departments. Searches ran up to 28 March 2020, English only. Six open datasets. |
| gd-econ/spend-skew/open | 7,767 loot box buyers | Close abstract (published) | matches | The accepted manuscript says 7,771 in both abstract and Results. |
| gd-econ/spend-skew/open | Most of these buyers spent under $20 a month | Close abstract Introduction; manuscript Introduction | differs | Old wording. Fixed 2026-11-16 by the orchestrator with the source open; not yet rechecked by a fresh context. Now: the abstract says monthly spending is typically modest, under $20, as background and not as a pooled result. Pilot note: Stated as background ("typically modest (i.e. < $20)") and cited to earlier studies (refs 11 to 15), not reported as a result for the pooled 7,767. |
| gd-econ/spend-skew/open | Top 5%, spending over $100 a month | Close abstract Results | matches |  |
| gd-econ/spend-skew/open | One buyer in twenty brought half the money | Close abstract; manuscript Results | matches | Manuscript says "over half". 24 people reporting over $1,000 a month were removed as outliers before this figure. |
| The idea | Most F2P players spend nothing; a small group brings much of the money | Sifa abstract; Chen abstract | differs | Old wording. Fixed 2026-11-16 by the orchestrator with the source open; not yet rechecked by a fresh context. Now: only a small fraction of players buy anything (linked to Sifa) and a small group can bring much of the money (linked to Chen). Pilot note: Supported, but no link at the sentence. |
| The idea | Good public numbers on this are scarce | none | differs | Old wording. Fixed 2026-11-16 by the orchestrator with the source open; not yet rechecked by a fresh context. Now worded as the writer's judgment from its own search, not a fact. Pilot note: The lesson's own judgment, ungraded. Reasonable, but it reads as a fact. |
| The idea | Close is a peer-reviewed secondary analysis of self-report surveys | Close abstract | matches |  |
| The idea | Top 5% made up half of loot box revenue | Close abstract | matches |  |
| The idea | Survey answers, not sales records; loot boxes only | Close abstract | matches |  |
| The idea | A studio paper on the mobile RPG Age of Ishtaria | Chen III.B; title page | differs | Old wording. Fixed 2026-11-16 by the orchestrator with the source open; not yet rechecked by a fresh context. Now: a paper by Chen and colleagues, who worked at the game analytics company Yokozuna Data (affiliation on the arXiv title page). Pilot note: Game is right ("role-playing, freemium, social mobile game"). The authors are from Yokozuna Data, an analytics firm in Keywords Studios, not the game's developer (Silicon Studio). "Studio paper" can mislead. |
| The idea | Whale line: sort by monthly spend, cut where the top reaches half the month's revenue | Chen III.B | matches | The paper averages that threshold over several months. |
| The idea | Whales "around 2%", "may provide up to 50%" | Chen abstract; III.B | matches | Exact words. |
| The idea | No count behind the 2% | Chen III.B; Tables I to III; Figure 3 | matches | Figure 3 is normalized; no whale count is given. Sample: 2,505 paying users who churned. |
| The idea | 0.15% of players bring half of mobile game revenue, from a 2014 vendor press release | Swrve release, PR Newswire, 26 February 2014 | differs | Old wording. Fixed 2026-11-16 by the orchestrator with the source open; not yet rechecked by a fresh context. The sentence was cut from The idea; a vendor press release is not linked or used. Pilot note: No link in the lesson. Release scope: 50% of monthly in-game purchase revenue, January 2014, games on Swrve's network. |
| The idea | Sifa peer-reviewed at AIIDE 2015 | Crossref; AAAI proceedings | matches |  |
| The idea | 100,000-player dataset | Sifa abstract | matches | Abstract only. |
| The idea | Opens with "only a small fraction of the players makes any purchases" | Sifa abstract, first sentence | matches | Abstract only. |
| The idea | Classifier for whether a player will purchase | Sifa abstract | matches | Abstract only. |
| The idea | Regression for how many purchases a payer will make | Sifa abstract | differs | Old wording. Fixed 2026-11-16 by the orchestrator with the source open; not yet rechecked by a fresh context. Now the abstract's words: a regression for the number of purchases a user will make. Whether the model used payers only is still unread; Sources and grades says so. Pilot note: Abstract says "a user". Whether the model used payers only needs the full text, which sits behind a bot check. |
| The idea | Both built as decision and regression trees for actionable rules | Sifa abstract | matches | Abstract only. |
| The idea | Chen compared deep networks with Pareto/NBD for lifetime value | Chen abstract; II.A | matches |  |
| The idea | Both networks beat the parametric models, almost identical results | Chen IV | matches | "Both neural networks outperform all parametric models"; "almost identical results". |
| The idea | Abstract singles out CNNs as most efficient and suited to spotting whales early | Chen abstract | matches |  |
| gd-econ/spend-skew/why | Average describes almost nobody; small-cohort LTV swings | none | inference | Labelled grade C. |
| gd-econ/spend-skew/why | Splitting into "will pay" and "how much, given they pay", as Sifa did | Sifa abstract | differs | Old wording. Fixed 2026-11-16 by the orchestrator with the source open; not yet rechecked by a fresh context. Now: whether a purchase will occur and how many purchases a user will make. Pilot note: Sifa's second model predicts the number of purchases a user makes, not spend, and the abstract doesn't say it is conditional on paying. |
| gd-econ/spend-skew/scenario | Scenario check on 400 installs | none | inference | Labelled grade C. |
| gd-econ/spend-skew/r1 | r1: classifier for whether a player will purchase, regression for how many purchases | Sifa abstract | matches | Abstract only. |
| gd-econ/spend-skew/r2 | r2: top 5%, over $100 a month; self-report, loot boxes only | Close abstract | matches |  |
| gd-econ/spend-skew/r3 | r3: networks vs Pareto/NBD; networks better and nearly tied; abstract names CNNs as the best | Chen abstract; Tables I to II | differs | Old wording. Fixed 2026-11-16 by the orchestrator with the source open; not yet rechecked by a fresh context. Now: the abstract names convolutional networks as the most efficient. Pilot note: Minor. The abstract says "most efficient", partly for speed and no feature engineering. On prediction accuracy (Table II) CNN wins on NRMSE and % error, DNN on RMSLE and SMAPE. |
| Sources and grades | Close: abstract read; top 5% and $100 from the abstract | Close abstract | matches |  |
| Sources and grades | Sifa PDF behind a bot check | ojs.aaai.org | differs | Old wording. Fixed 2026-11-16 by the orchestrator with the source open; not yet rechecked by a fresh context. Now also says the payer question is not answered by the abstract. Pilot note: Same result here. |
| Sources and grades | arXiv lists this DOI as the published version | arXiv abs page, journal reference field | matches |  |
| Sources and grades | Chen: grade A for method and results, B for the whale figure | Chen full text | matches |  |
| Sources and grades | Full text of Sifa et al. 2015 (game used, share of payers, whether the regression used payers only) | ojs.aaai.org page and PDF; Fraunhofer, DFKI, Aalborg and SDU repositories | could not open | Bot check or 403 on every copy tried. The lesson claims nothing that needs the full text and says what is not given. |
