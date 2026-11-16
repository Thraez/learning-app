# Ledger: gd-econ/sinks

2026-11-16. Rows come from the source check pilot (a fresh checker that did not write the lesson), re-keyed from line numbers to sections and item IDs. Rows whose sentence was then fixed are marked `differs` with the fix in the note, and stay that way until a fresh context rechecks them.

How far the source was read: Hogan-Hennessy et al. 2022 (arXiv:2210.07970), full text with Appendix Table A1, from the arXiv PDF, by the pilot checker and again by the orchestrator for the fixes.

| Where | Claim | Source and place | Verdict | Note |
|---|---|---|---|---|
| front matter | Cite: Hogan-Hennessy, Xenopoulos, Silva 2022, title, arXiv:2210.07970 | arXiv PDF title page | matches | Cornell and NYU authors. |
| front matter | No published version found | arXiv abs page; Crossref; OpenAlex; web search | matches | Only v1, no journal reference on arXiv. OpenAlex lists it as a preprint. Crossref title search: no match. Semantic Scholar returned 429 and dblp a bot wall. None found by these searches. |
| gd-econ/sinks/open | December 2021, OSRS added a 1% tax on GE sales | Section 4, 4.1 | matches | "formally introduced in December 2021". |
| gd-econ/sinks/open | Tax money used to buy high-level items from players and delete them | Section 4 | matches |  |
| gd-econ/sinks/open | Tax barely changed trading volume | Abstract; 4.1 | matches |  |
| gd-econ/sinks/open | Prices of targeted items went up | Abstract; 4.2 | matches |  |
| The idea | Preprint, not peer-reviewed | arXiv record | matches | See line 12. |
| The idea | Jagex's stated worry: high-level items too common | Section 4 | matches | "publicly expressed concern that high-level items ... were too common-place". |
| The idea | 1% on sales above 100 GP | 4.1 | matches | "only applies if the price is greater than 100 GP". |
| The idea | Capped at 5 million GP per sale | 4.1 | matches | "capped at 5 million GP regardless of item sell price". |
| The idea | Paid out of the seller's proceeds | Section 4 | matches |  |
| The idea | Sink buys selected items and deletes them, up to a daily maximum Jagex sets | Section 4 | matches | Paper adds that no item is removed if the tax coffers run short. |
| The idea | 34 items in round one, 27 more a week later | 4.2 | matches | 09 and 16 December 2021. |
| The idea | Control group of similarly expensive items whose prices didn't move with them | 4.2, equation 2 | matches | Items averaging over 100,000 GP with price correlation below 0.1 in absolute value. |
| The idea | Round one about 7% (5.0 to 9.6%) | 4.2 text; Table A1 | matches | Table: 0.070, SE 0.011, which rebuilds the interval. |
| The idea | Round two about 14.4% (11.9 to 16.9%) | 4.2 text; Table A1 | differs | Old wording. Fixed 2026-11-16 by the orchestrator with the source open; not yet rechecked by a fresh context. The lesson now gives the text figure (14.4%, 11.9 to 16.9%) and the Table A1 figure (0.147, SE 0.024, about 15.8%, 10.5 to 21.4%), the second labelled as a recomputation. Orchestrator redid the arithmetic: exp(0.147) minus 1 is 15.8%; exp(0.147 plus or minus 1.96 times 0.024) minus 1 gives 10.5% and 21.4%. Pilot note: Matches the text only. Table A1: 0.147, SE 0.024, giving about 15.8% (10.5 to 21.4%). The paper disagrees with itself. |
| The idea | Trading volume of those items did not change meaningfully | 4.2; 6; Table A1 | differs | Old wording. Fixed 2026-11-16 by the orchestrator with the source open; not yet rechecked by a fresh context. Now: no change detected, with the Table A1 ranges (0.034 below zero, SE 0.056: about a 13% drop to an 8% rise; 0.045 below zero, SE 0.112: about a 23% drop to a 19% rise), labelled as the lesson's arithmetic. Pilot note: Echoes the paper's own wording, but the intervals are wide: about minus 13 to plus 8% and minus 23 to plus 19%. More certain than the data. |
| The idea | No detectable effect on volume at the 100 GP threshold | 4.1; A.1 | matches | "not distinguishable from zero at any standard level of significance". |
| The idea | 500 million GP is where the cap starts to bite | 4.1; Figure 3 | matches | 1% of 500 million is the 5 million cap. |
| The idea | Cut volume about 6.9%, interval 1 to 13% | 4.1 | matches | "bounds on the treatment effect range -13 to -1%". |
| The idea | Illicit gold prices did not change | 4.3 | matches | No significant breaks in mean or variance. |
| The idea | Sink acted like a large buyer: more demand, higher prices | Section 5 | matches |  |
| The idea | Authors note Jagex never stated its goal | Section 5 | differs | Old wording. Fixed 2026-11-16 by the orchestrator with the source open; not yet rechecked by a fresh context. Now: Jagex has not publicly stated what it intended with this round of changes. Pilot note: Paper: Jagex "has not publicly stated their intentions for this round". "Never" is stronger, and line 34 itself calls the worry "stated". |
| The idea | Success can't be judged without a goal | Section 5 | matches |  |
| The idea | No player-level records | Section 5, Limitations | matches |  |
| gd-econ/sinks/why | Sink buys on the open market, so it adds demand | Section 5 | matches |  |
| gd-econ/sinks/why | Deleting items lowers supply; "both" routes are what the authors call standard economic theory | Section 5 | differs | Old wording. Fixed 2026-11-16 by the orchestrator with the source open; not yet rechecked by a fresh context. Now: only the demand route is credited to the authors as standard economic theory; the supply route is labelled grade C. Pilot note: The paper ties "standard economic theory" to the demand route only. Item removal is mentioned, but not as a price mechanism. |
| gd-econ/sinks/why | A currency sink such as a repair fee works through less money chasing the same goods | none | differs | Old wording. Fixed 2026-11-16 by the orchestrator with the source open; not yet rechecked by a fresh context. Now labelled grade C in the answer and in Sources and grades. Pilot note: Ungraded inference, not marked grade C. |
| gd-econ/sinks/scenario | Targeted items rose 7 to 14% | 4.2 | differs | Old wording. Fixed 2026-11-16 by the orchestrator with the source open; not yet rechecked by a fresh context. Now: about 7% in the first round and about 14 to 16% in the second. Pilot note: See the round two row. |
| gd-econ/sinks/scenario | An MMO with tens of thousands of players | 2.1, last paragraph | matches | "a popular MMORPG with tens of thousands of players". |
| gd-econ/sinks/scenario | Tabletop transfer; small markets have thin trade | none | inference | Labelled grade C in the lesson. |
| gd-econ/sinks/r1 | r1: funded by the 1% tax; bought and deleted targeted items up to a daily cap | Section 4 | differs | Old wording. Fixed 2026-11-16 by the orchestrator with the source open; not yet rechecked by a fresh context. Now: about 14% by the paper's text and about 16% by its table. |
| gd-econ/sinks/r2 | r2: about 7% and 14%, against a control group | 4.2 | matches | Round two inherits the text and table conflict. |
| gd-econ/sinks/r3 | r3: no detectable drop at 100 GP; 6.9% near 500 million, 1 to 13% | 4.1 | matches |  |
| Sources and grades | Full text read, grade A, tier 2, no published version | whole PDF; searches | differs | Old wording. Fixed 2026-11-16 by the orchestrator with the source open; not yet rechecked by a fresh context. Now names difference-in-differences for the sink, regression discontinuity at the 100 GP threshold and regression kink at the cap, and records the text and table conflict. Pilot note: Grade and tier are right under rule 4. |
| Sources and grades | Natural experiment using difference-in-differences and regression discontinuity | 1; 4.1; A.2 | differs | Incomplete: the 6.9% estimate comes from a regression kink design, which the paper names separately. |
| Sources and grades | Named university researchers | title page | matches | The work was funded by a Capital One grant (Acknowledgments), which the lesson doesn't mention. |
