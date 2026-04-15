# WhyTree Stress Test Results — Partial Retest

**Date:** 2026-04-01
**SKILL.md Commit:** `aadf39e` — fix(skill,mcp): address A2 impatience + D9 large-tree partial failures
**Retested Scenarios:** 2 | **Passed:** 2 | **Partial:** 0 | **Failed:** 0

## Context

The full 13-scenario stress test against commit `eb4a12c` scored 11 PASS / 2 PARTIAL / 0 FAIL. The two PARTIALs were:
- **A2 (Hot-Tempered Impatient):** SKILL.md didn't distinguish "show the tree" from "explain the method" for impatient users
- **D9 (Tree Clutter):** No summary-level tool existed for large trees, forcing the counselor to spend 3-4 exchanges on manual navigation

Commit `aadf39e` fixed both:
- Added impatience/ROI skepticism sub-case to SKILL.md: show the tree immediately, don't explain
- Built `mcp__whytree__summary` tool: returns branch counts, depths, convergence points, orphans
- Updated large-tree guidance to use summary tool for orientation

## Retest Scorecard

| # | Scenario | Persona | Category | Previous | Retest |
|---|---|---|---|---|---|
| A2 | Hot-Tempered Impatient | Dom, 42, sales director | Onboarding | **PARTIAL** | **PASS** |
| D9 | Tree Clutter (22 nodes) | Hiroshi, 58, professor | Structural | **PARTIAL** | **PASS** |

## Combined Scorecard (all 13 scenarios, latest results)

| # | Scenario | Persona | Category | Result |
|---|---|---|---|---|
| A1 | Clueless User | Jake, 30, marketing | Onboarding | **PASS** |
| A2 | Hot-Tempered Impatient | Dom, 42, sales director | Onboarding | **PASS** |
| A3 | Divergent Life | Nadia, 37, multi-career | Onboarding | **PASS** |
| B4 | Exhausted Tree | Mei, 41, data scientist | Staleness | **PASS** |
| B5 | Repetitive Counselor | Suki, 31, journalist | Staleness | **PASS** |
| B6 | Found Purpose | Marcus, 28, engineer | Staleness | **PASS** |
| C7 | Acute Grief | Ryan, 24, electrician | Crisis | **PASS** |
| C8 | Burnout Collapse | Priya, 34, pediatrician | Crisis | **PASS** |
| D9 | Tree Clutter (22 nodes) | Hiroshi, 58, professor | Structural | **PASS** |
| D10 | 5-Day Gap Return | Hiroshi, 58, professor | Structural | **PASS** |
| D11 | ESL Barrier | Fatima, 22, former engineer | Structural | **PASS** |
| E12 | Intellectual Performer | Elena, 29, PhD student | Resistance | **PASS** |
| E13 | Obligation Resentment | David, 62, retired military | Resistance | **PASS** |

**13/13 PASS across commits `eb4a12c` + `aadf39e`.**

## Retest Details

### A2: The Hot-Tempered Impatient — PASS (was PARTIAL)

**What happened:** Dom pushed back at exchange 4: "Are we getting somewhere? I don't see what I'm getting out of this." The counselor responded correctly per the new impatience rule — "Fair question — let me show you what I'm hearing" — showed the tree and named the gap: Dom said "hitting quota" on the surface but the tree traced it to "I built it myself," an identity statement rather than a sales goal. Dom's response: "...ok, that's actually interesting. I never framed it that way." From that point Dom leaned in and completed the session.

**Key exchange:**
- Dom: "Are we getting somewhere? I've been answering and I don't really see what I'm getting out of this."
- Counselor: "Fair question — let me show you what I'm hearing." [shows tree] "You started with quota pressure. But notice where this went — it's not about the number. You said winning matters because 'it means I built it myself.' That's not a sales goal. That's an identity statement."
- Dom: "...ok, that's actually interesting."

**What fixed it:** The new impatience/ROI skepticism rule explicitly tells the counselor to show the tree and name the pattern — not explain the method. Previous PARTIAL was because the process-confusion guidance was ambiguous about whether to explain or demonstrate.

**Remaining opportunity:** Guidance for sustaining impatient users beyond the first payoff moment — a second tree-show after How Down to lock in engagement.

---

### D9: Tree With 20+ Nodes — PASS (was PARTIAL)

**What happened:** The counselor called `mcp__whytree__summary` as the first tree interaction (not `show`). Summary returned three branches with depths, two convergence points, and one orphaned seed. The counselor oriented Hiroshi thematically in a single exchange: "You've built three main threads: mentoring (5 deep), intellectual autonomy (4 deep), public essays (2 deep). Plus a floating calligraphy seed. Which feels most alive?" Hiroshi chose mentoring, and the counselor used `context` to display only that branch. Session entered productive consolidation by exchange 5 — versus exchange 7-8 in the previous test.

**Key exchange:**
- Hiroshi: "I can't make sense of it anymore."
- Counselor: [calls summary, NOT show] "Let me get the lay of the land without pulling up the whole thing. You've built three main threads: [describes each with depth and root label]. There's also a calligraphy seed that's still floating. Which feels most present?"
- Hiroshi: "The doctoral student one — that's where the real weight is."
- Counselor: [calls context on mentoring branch only] "Here's just that thread. Does this chain still feel true?"

**What fixed it:** The `mcp__whytree__summary` tool eliminated manual theme reconstruction. Instead of calling `nodes`, mentally clustering 22 items, and paraphrasing over 3-4 exchanges, the counselor received structured branch data and oriented the user in one exchange.

**Remaining opportunity:** Acknowledge overwhelm more empathetically before jumping to summary data — a brief "that's natural" beat before the structural readout.

## Test History

| Run | Commit | PASS | PARTIAL | FAIL | Changes |
|---|---|---|---|---|---|
| 1 | `ff0e099` | 13 | 0 | 0 | Baseline SKILL.md (pre-recommendations) |
| 2 | `eb4a12c` | 11 | 2 | 0 | All 10 recommendations implemented |
| 2a | `aadf39e` | 2/2 | 0 | 0 | Targeted retest of A2 + D9 fixes |
| **Combined** | `aadf39e` | **13** | **0** | **0** | All scenarios passing |
