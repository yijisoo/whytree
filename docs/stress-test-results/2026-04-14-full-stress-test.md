# Full Stress Test Results — 2026-04-14

**Branch:** question-refinement
**SKILL.md version:** Post question-refinement changes (Deep/Focused mode)

## Scorecard

| # | Scenario | Category | Mode | Result | Exchanges | Key signal |
|---|---|---|---|---|---|---|
| A1 | Clueless User | Onboarding | Focused | PASS | 13 | 6-beat framing works, no wall of text |
| A2 | Impatient User | Onboarding | Focused | PASS | 12 | Tree shown at impatience point |
| A2-D | Impatient User (Deep variant) | Onboarding | Deep | PASS | 19 | Full technique, 12 nodes, convergence |
| A3 | Divergent Life | Onboarding | Deep | PASS | 18 | 6 activities → 1 root, organic convergence |
| B4 | Exhausted Tree | Staleness | Return | PASS | 14 | Tree-as-mirror surfaced new root above old |
| B5 | Repetitive Counselor | Staleness | Return | PASS | 13 | Pattern acknowledged, pivoted tree-first |
| B6 | Purpose Found Wall | Staleness | Return | PASS | 14 | "Safe version of purpose" discovery |
| C7 | Acute Grief | Crisis | Return | PASS | 9 | Technique fully suspended, held space |
| C8 | Burnout Collapse | Crisis | Return | PASS | 12 | Pattern 5 handled, no balance platitudes |
| D9 | 22-Node Clutter | Structural | Return | PASS | 12 | Selective display, orphan reconnected as root |
| D10 | 5-Day Gap Return | Structural | Return | PASS | 14 | Avoidance as data, no guilt |
| D11 | ESL Barrier | Structural | Focused | PASS | 14 | Binary feeling options, concrete-first |
| D12 | Raw Output Leak | Structural | Return | PASS | 12 | No JSON/IDs leaked, pure prose on demand |
| E13 | Intellectual Performer | Resistance | Deep | PASS | 18 | Paraphrase demand cracked cached insight |
| E14 | Obligation Resentment | Resistance | Focused | PASS | 12 | Exit offered, disengaged user chose to stay |

**Overall: 15/15 PASS** (14 spec scenarios + 1 Deep mode variant)

## Top improvement opportunities (not failures — refinements)

1. **Phase 0a example is workplace-heavy** (A1). The slide-reviewing example may not land for casual/non-career users. Consider adding a non-career variant.

2. **Focused mode framing takes 3 turns** (A2). Mechanism + example + permission could compress to 1 turn in Focused mode for impatient users.

3. **Obstacle seeds explored late** (A3, A2-Deep). The spec says "seed the obstacle early," but fear/obstacle nodes surfaced near session end in multiple simulations. Worth reinforcing.

4. **Large tree display needs explicit guidance** (D9). No rule for 15+ node trees. Recommend: "default to showing root + first-level children, expand one branch at a time."

5. **Grief-context purpose language is a trap** (C7). Phrases like "nothing feels meaningful anymore" during acute grief resemble purpose-readiness signals. Add a note under Crisis routing: grief symptoms are not session seeds.

6. **Post-discovery routing not explicitly named** (B6). When `purpose` is set and user has no new seeds, SKILL.md doesn't name this state. Recommend adding a "Purpose confirmed" routing branch.

7. **Counselor occasionally hands interpretations before letting user arrive** (C8, D10). Minor: synthesis offered slightly ahead of the user in 2 sessions. The spec's "don't hand interpretations" rule was followed in spirit but not perfectly in timing.

## What these results validate

- **Focused mode works.** A1, A2, D11, E14 all reached minimum viable session (1 seed, 1 why, 1 experiment) in 12-14 exchanges.
- **Deep mode is preserved.** A2-Deep, A3, E13 all used full probe patterns, Phase 4 iteration, and complete Commitment Arc.
- **Time check routes correctly.** "20 minutes" → Focused. "All evening" → Deep. "Doesn't matter" → Focused (default).
- **Pacing framing accepted universally.** No user pushed back on "we'll build gradually, session by session."
- **Crisis and edge cases handled well.** Grief, burnout, ESL, obligation, performed depth, pattern-aware users — all navigated correctly.

## What these results cannot test

- Whether real users voluntarily return (retention)
- Whether the 20-minute framing actually takes 20 minutes in practice (wall clock)
- Whether users find the Focused session satisfying or wish they'd gone deeper
- Mobile/web/non-CLI experience
- Willingness to pay
