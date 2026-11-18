# Ledger: gd-econ/sinks

2026-11-16. Rows come from the source check pilot (a fresh checker that did not write the lesson), re-keyed from line numbers to sections and item IDs. The rows the fixes touched were rechecked on 2026-11-16 by a fresh context that did not make the fixes, against the cached full text and Table A1.

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
| The idea | Round two: text gives 14.4% (11.9 to 16.9%); Table A1 gives 0.147, SE 0.024, about 15.8% (10.5 to 21.4%), labelled as the lesson's recomputation | 4.2 text; Table A1 | matches | Text: "a jump in prices on order of 14.4%, with a confidence interval of 11.9% to 16.9%". Table A1, Post by Treated, column 3: "0.147" over "(0.024)". Redone: exp(0.147) minus 1 is 15.8%; exp(0.147 plus or minus 1.96 times 0.024) minus 1 gives 10.5% and 21.4%. Rechecked 2026-11-16. |
| The idea | No change in volume of targeted items detected, but loose: about a 13% drop to an 8% rise (round one), a 23% drop to a 19% rise (round two), labelled the lesson's arithmetic | 4.2; 6; Table A1 | matches | Table A1 volume columns: "-0.034" over "(0.056)" and "-0.045" over "(0.112)". Redone: exp(b plus or minus 1.96 SE) minus 1 gives 13.4% drop to 7.9% rise, and 23.2% drop to 19.1% rise. Rechecked 2026-11-16. |
| The idea | No detectable effect on volume at the 100 GP threshold | 4.1; A.1 | matches | "not distinguishable from zero at any standard level of significance". |
| The idea | 500 million GP is where the cap starts to bite | 4.1; Figure 3 | matches | 1% of 500 million is the 5 million cap. |
| The idea | Cut volume about 6.9%, interval 1 to 13% | 4.1 | matches | "bounds on the treatment effect range -13 to -1%". |
| The idea | Illicit gold prices did not change | 4.3 | matches | No significant breaks in mean or variance. |
| The idea | Sink acted like a large buyer: more demand, higher prices | Section 5 | matches |  |
| The idea | Authors note Jagex has not publicly stated what it intended with this round of changes | Section 5 | matches | "Jagex has not publicly stated their intentions for this round of market interventions". Rechecked 2026-11-16. |
| The idea | Success can't be judged without a goal | Section 5 | matches |  |
| The idea | No player-level records | Section 5, Limitations | matches |  |
| gd-econ/sinks/why | Sink buys on the open market, so it adds demand | Section 5 | matches |  |
| gd-econ/sinks/why | Authors say the demand route fits standard economic theory; the supply route (fewer items left) is labelled grade C | Section 5 | matches | "Our results align clearly with standard economic theory: the new item sink increased demand for high-level items (by buying items), thus leading to increased prices." Removal is mentioned only as "reduces the number of (targeted) high-level items in circulation", not as a price cause, so the lesson's grade C label is right. Rechecked 2026-11-16. |
| gd-econ/sinks/why | A currency sink such as a repair fee works through less money chasing the same goods; labelled grade C | none | inference | The answer now says "That comparison is also my inference, grade C." Rechecked 2026-11-16. |
| gd-econ/sinks/scenario | Targeted items rose about 7% in round one and about 14 to 16% in round two | 4.2; Table A1 | matches | 7% and 14.4% from the text, 15.8% recomputed from Table A1 (see the round two row). Rechecked 2026-11-16. |
| gd-econ/sinks/scenario | An MMO with tens of thousands of players | 2.1, last paragraph | matches | "a popular MMORPG with tens of thousands of players". |
| gd-econ/sinks/scenario | Tabletop transfer; small markets have thin trade | none | inference | Labelled grade C in the lesson. |
| gd-econ/sinks/r1 | r1: funded by the 1% tax; bought targeted items from players on the market and deleted them, up to a daily cap | Section 4 | matches | "the proposed item sink uses the proceeds from the transaction tax to remove high-level items by directly buying the items from players on the GE"; "subject to a daily maximum set by Jagex". Rechecked 2026-11-16. |
| gd-econ/sinks/r2 | r2: about 7% in round one; about 14% by the text and about 16% by the table in round two; against a control group | 4.2; Table A1 | matches | As in the round two row. Rechecked 2026-11-16. |
| gd-econ/sinks/r3 | r3: no detectable drop at 100 GP; 6.9% near 500 million, 1 to 13% | 4.1 | matches |  |
| Sources and grades | Full text read, grade A, tier 2, no published version found by Crossref; names difference-in-differences for the sink, regression discontinuity at 100 GP and regression kink at the cap; records the text and table conflict | whole PDF; 4.1; A.1 to A.3; searches | matches | Introduction lists "difference-in-difference, regression-discontinuity and regression-kink designs"; section 4.1 estimates the 100 GP effect "through a regression discontinuity (RD) design" and the cap effect through "a regression kink (RK) design"; A.3 applies DiD to the item sink. Rechecked 2026-11-16. |
| Sources and grades | Named university researchers | title page | matches | The work was funded by a Capital One grant (Acknowledgments), which the lesson doesn't mention. |


Recheck 2026-11-18: rows the 2026-11-18 edits touched, by a fresh context that did not make the edits. Hogan-Hennessy et al. 2022 (arXiv:2210.07970v1) was read in full text again from the arXiv PDF, including Appendix Table A1, extracted with pdftotext.

| Where | Claim | Source and place | Verdict | Note |
|---|---|---|---|---|
| front matter, sources | read: full text, arXiv PDF with Table A1 | Whole PDF | matches | Consistent with the opening lines of this ledger. |
| front matter, sources | caveat: preprint, not peer-reviewed; one game; natural experiment, not randomized | Title page; Sections 4 and 6 | matches | arXiv v1 [cs.HC]. The paper says it performed "no researcher-guided randomization or A/B design" and calls the sinks natural experiments. Old School RuneScape is the only game. I did not search again for a published version; the earlier ledger found none. |
| Answer to the sinks question (body) | First sink raised targeted item prices by about 7% | Section 4.1; Table A1 column 1 | matches | Text: "on the order of 7%", CI 5.0% to 9.6%. Table: 0.070, SE 0.011. Redone: exp(0.070) minus 1 is 7.25%; 0.070 plus or minus 1.96 times 0.011 exponentiates to about 4.8% to 9.4%, close to the text CI. |
| Answer to the sinks question (body) | Second sink: 14.4% in the paper's text | Section 4.1 | matches | Text: "jump in prices on order of 14.4%", CI 11.9% to 16.9%. |
| Answer to the sinks question (body) | The table prints coefficient 0.147 for the second sink | Table A1, column 3, Post x Treated | matches | 0.147, SE 0.024. Column 3 is price for the second sink; column 4 is volume (minus 0.045). |
| Answer to the sinks question (body) | The lesson converts 0.147 to about 15.8%; the paper does not print that figure | Section 4 (log transformation for a percent-change reading); arithmetic | matches | The paper says outcomes use a log transformation to give a percent-change interpretation. Redone: exp(0.147) minus 1 is 15.84%. The paper does not print 15.8. |
| Answer to the sinks question (body) | Found on recheck, not a lesson claim: text and table disagree beyond the point estimate | Section 4.1 against Table A1 column 3 | matches | The text CI 11.9% to 16.9% implies an SE near 0.012; the table's SE of 0.024 would give about 10.5% to 21.4%. The lesson states no interval, so nothing in it is wrong. It matters only if a CI is ever quoted. |
| Answer to the sinks question (body) | Natural experiment, so results hold only if the control items were a fair comparison | Section 4 (DiD, control group, pre-trends) | matches | DiD is described as a causal comparison "when researcher-directed randomization did not occur", resting on the constructed control group and the pre-trends assumption. |
| Item IDs and answers | No item ID or heading changed; the reworded answer is plain sentences with no blank line, list, bold or table | git diff d4ce597 e2c3a5a | matches |  |
