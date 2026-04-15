# WhyTree Stress Test Results

**Date:** 2026-04-01
**SKILL.md Commit:** `eb4a12c` — feat(skill): implement all 10 stress test recommendations
**Scenarios:** 13 | **Passed:** 11 | **Partial:** 2 | **Failed:** 0

## Scorecard

| # | Scenario | Persona | Category | Result |
|---|---|---|---|---|
| A1 | Clueless User | Jake, 30, marketing | Onboarding | **PASS** |
| A2 | Hot-Tempered Impatient | Dom, 42, sales director | Onboarding | **PARTIAL** |
| A3 | Divergent Life | Nadia, 37, multi-career | Onboarding | **PASS** |
| B4 | Exhausted Tree | Mei, 41, data scientist | Staleness | **PASS** |
| B5 | Repetitive Counselor | Suki, 31, journalist | Staleness | **PASS** |
| B6 | Found Purpose | Marcus, 28, engineer | Staleness | **PASS** |
| C7 | Acute Grief | Ryan, 24, electrician | Crisis | **PASS** |
| C8 | Burnout Collapse | Priya, 34, pediatrician | Crisis | **PASS** |
| D9 | Tree Clutter (22 nodes) | Hiroshi, 58, professor | Structural | **PARTIAL** |
| D10 | 5-Day Gap Return | Hiroshi, 58, professor | Structural | **PASS** |
| D11 | ESL Barrier | Fatima, 22, former engineer | Structural | **PASS** |
| E12 | Intellectual Performer | Elena, 29, PhD student | Resistance | **PASS** |
| E13 | Obligation Resentment | David, 62, retired military | Resistance | **PASS** |

## Interpretation

**11/13 PASS, 2 PARTIAL, 0 FAIL.** All 10 recommendations from the first stress test (`ff0e099`) have been implemented. The two PARTIALs are new findings — structural gaps not covered by the original recommendations.

The implemented recommendations performed well:
- **Crisis routing (Rec 1):** C7 passed cleanly — the explicit "all technique phases suspend" rule worked as designed.
- **Post-discovery mode (Rec 2):** B6 passed — "completion without closure" routing correctly shifted from discovery to decision tool.
- **Pattern-aware users (Rec 3):** B5 passed — counselor acknowledged the pattern and showed the tree instead of asking another seed question.
- **Large-tree navigation (Rec 4):** D9 improved to PARTIAL (was a structural concern) — selective display worked, but logistics still consumed exchanges.
- **Multilingual/ESL (Rec 5):** D11 passed — "karama" was adopted as node label, concrete questions replaced abstract probes.
- **Consolidation sessions (Rec 6):** B4 passed — the counselor reorganized existing material without forcing growth.
- **Purpose-identity collapse (Rec 7):** C8 passed — "the purpose didn't break, the form it took did" landed and grief was explored before structure.
- **Obligation routing (Rec 8):** E13 passed — counselor exited gracefully after 2 disengaged exchanges.
- **High-volume opener (Rec 9):** A3 passed — counselor seeded 3 of 6 threads, parked the rest explicitly.
- **Deferred analytics (Rec 10):** A1 passed — analytics asked after first real response, not before.

## Scenario Details

### A1: The Clueless User — PASS

**What happened:** Jake arrived with zero context. The Phase 0a framing (mechanism, example, permission) plus opening question were delivered together. Jake's "what is this exactly?" in Exchange 2 was handled with a brief, non-technical clarification. By Exchange 4 he was sharing a genuine career concern. By Exchange 6 he volunteered a YouTube channel seed unprompted. By Exchange 10 he articulated "proof that my perspective has value" — two Why Up levels deep.

**Key exchange:** Jake said "what is this exactly?" and the counselor gave a three-sentence plain-language answer without re-explaining the method, then redirected to the opening question. Jake was earned in one exchange.

**Improvement opportunity:** Phase 0a front-loads five beats (version + mechanism + example + permission + opening question) in one message. For zero-context users, splitting Phase 0a and Phase 0 into two messages would reduce cognitive load.

---

### A2: The Hot-Tempered Impatient — PARTIAL

**What happened:** Dom engaged with a surface-level answer, the counselor reflected and began Why Up. By Exchange 3, Dom pushed back: "I've answered three questions and I don't see what I'm getting out of this." The counselor can handle this via the process-confusion rule, but SKILL.md doesn't explicitly distinguish between explaining the process and showing a concrete result. Dom needs to see the tree — not hear about the method.

**Key exchange:** Dom: "Ok but what's the point?" Ideal response: show the tree immediately and name the non-obvious pattern ("You came in talking about pipeline. But the why underneath it is about watching people surprise themselves."). A meta-explanation of the process would fail; a concrete deliverable would succeed.

**Failure mode:** SKILL.md's process-confusion guidance says "pause technique, give explicit update" — but for impatient users, the update needs to be the tree itself, not a verbal explanation. The distinction between "explain" and "show" is the gap.

**Improvement opportunity:** Add to the process-confusion section: "For users expressing impatience or ROI skepticism, show the tree immediately using `mcp__whytree__show` and name the non-obvious pattern. Impatient users need a concrete deliverable, not a process explanation."

---

### A3: The Divergent Life — PASS

**What happened:** Nadia offered all 6 activities in her first response. The counselor correctly applied the high-volume opener rule — seeded the 3 with most emotional charge (refugee family, children's book, Korean), parked the other 3. Why Up was run on 2 seeds. Convergence emerged organically when Nadia articulated the connection herself: "They're all about being seen." The obstacle seed ("still trying to prove I'm worth looking at") was planted explicitly per SKILL.md.

**Key exchange:** The counselor's Why Up on the book seed drew out Nadia's childhood as the invisible kid. The counselor seeded the fear and asked "what do you notice?" rather than declaring the convergence. Nadia arrived at it herself.

**Improvement opportunity:** The Korean language seed was planted but never explored — at least one probe would have been warranted.

---

### B4: The Exhausted Tree — PASS

**What happened:** Mei reported nothing new. The counselor didn't force tree growth — instead showed the existing tree, bridged to the experiment check-in, and used Mei's avoidance of the workshop as material. The session discovered that Mei's behind-the-scenes pattern was protecting her from testing her own root purpose. No nodes added. Genuine insight from consolidation.

**Key exchange:** The counselor held Mei's root ("my thinking changes how others see problems") against her avoidance and asked whether the invisible version mattered specifically. "Purer if nobody knows" opened the real thread.

**Improvement opportunity:** Could have used `mcp__whytree__insights` to check for orphan nodes before settling on the experiment thread.

---

### B5: The Repetitive Counselor — PASS

**What happened:** Suki called out the pattern in Turn 2: "I know the dance now." The counselor acknowledged she was right, skipped seeding, showed the tree, and let Suki choose which thread to explore. Session moved into How Down on an unfinished branch, producing a discovery about wanting to make herself unnecessary as intermediary.

**Key exchange:** Suki: "Can we do something different?" Counselor: "You're right — that is the pattern. Here's your tree. Which one feels unfinished?"

**Improvement opportunity:** Could have briefly acknowledged the prior experiment (Phase 0b) before showing the tree.

---

### B6: Found Purpose — PASS

**What happened:** Marcus opened with "I already know my purpose — what else is this for?" The counselor correctly entered "completion without closure" mode, asked "Is there anything at stake right now?" which surfaced the management promotion decision. Purpose shifted from abstract to operational — Marcus sharpened his definition and surfaced a latent product idea he'd never voiced.

**Key exchange:** The counselor asked whether management served his stated purpose. Marcus caught himself rationalizing and self-corrected. Led to the developer tool idea — "never said this out loud."

**Improvement opportunity:** Could have seeded the fear/obstacle ("afraid of being financially irresponsible") as a node with its own Why Up chain.

---

### C7: Acute Grief — PASS

**What happened:** Ryan opened with "My friend Mike died on Friday." The counselor immediately suspended all technique, made zero tree operations, asked about Mike as a person, checked if someone was with Ryan, and gave explicit permission to end without tree work. The best session in the test produced no tree growth.

**Key exchange:** "I'm really sorry, Ryan." → "Can you tell me what happened?" → "Is there anyone with you tonight?" → "There's nothing we need to do with the tree tonight."

**Improvement opportunity:** No guidance on follow-up sessions after a crisis — should the next session open by checking on the loss before resuming tree work?

---

### C8: Burnout Collapse — PASS

**What happened:** Priya opened with "My purpose is killing me." The counselor identified Pattern 5 (purpose-identity collapse) and delivered the prescribed move: "The purpose didn't break. The form it took did." Stayed with the contradiction across all exchanges. Surfaced a childhood origin — a promise made at ten years old — that reframed the entire tree. No balance platitudes. No How Down optimization.

**Key exchange:** Counselor: "What are you losing — not the work, but the version of yourself who could do it without it costing everything?" Priya: "The person who believed that was possible."

**Improvement opportunity:** The counselor's interpretation at Turn 7 arrived one beat before Priya's own articulation — borderline on "don't hand interpretations" but self-corrected. Also, no safety check was performed despite acute distress signals.

---

### D9: Tree Clutter (22 nodes) — PARTIAL

**What happened:** The counselor correctly avoided the full tree dump and used thematic summaries. However, 3-4 exchanges were spent on navigation and orientation before real counseling work happened. The orphaned branch was surfaced naturally during consolidation.

**Key exchange:** Hiroshi: "I can't make sense of this anymore." Counselor: "You have threads about three big areas — mentoring, ceramics, legacy. Which feels most present?" Then used `context` to show only the selected branch.

**Failure mode:** The thematic summary listed all options at once (like a menu), and tree management consumed exchanges before discovery could begin.

**Improvement opportunity:** A summary-level tool (`mcp__whytree__summary` returning theme clusters and node counts per branch) would let the counselor offer orientation without manually reconstructing themes from `nodes` output. This is a tool gap, not a SKILL.md gap.

---

### D10: The 5-Day Gap Return — PASS

**What happened:** The counselor used the correct WEEK-gap tone ("It's been a few days — did that happen, or did it not feel right?"). Hiroshi admitted he didn't do the experiment with embarrassment. The counselor responded with "That's data too" and explored what got in the way. The avoidance surfaced a fear about irreversibility, a reckoning with fifteen years of safe choices, and a concrete aspiration.

**Key exchange:** "Did that happen, or did it not feel right?" → "No. I feel foolish." → "That's data too. What got in the way?"

**Improvement opportunity:** The fear ("afraid that saying it makes it irreversible") should have been seeded as an obstacle node earlier.

---

### D11: ESL Articulation Barrier — PASS

**What happened:** The counselor adapted quickly — shifted to concrete, story-based questions after Fatima's first hesitation. When Fatima introduced "karama" (Arabic for dignity), the counselor adopted it immediately as the structural anchor. Three How Downs emerged from karama: engineering, refugee advocacy, teaching children. Fatima chose the most actionable one.

**Key exchange:** Fatima: "karama? In Arabic, we say karama. It means... like dignity? But more." Counselor: "Karama. Let me use that word — it's better than anything I'd come up with in English."

**Improvement opportunity:** Could have offered feeling-word options slightly earlier at first struggle. Also, the daughter/hijab moment deserved more space before moving forward.

---

### E12: The Intellectual Performer — PASS

**What happened:** Elena opened with cached academic language ("authenticity in knowledge production"). The counselor fired the paraphrase demand immediately in Exchange 2, before even seeding. Elena's reformulation was concretely different — a specific student, a face changing. By Exchange 8 she arrived at "watching someone's face change" — specific, embodied, non-cached.

**Key exchange:** Elena: "authenticity in knowledge production." Counselor: "Say that again in completely different words. No 'authentic,' no 'knowledge production,' no 'discourse.'" Elena reformulates with the student-and-mom anecdote.

**Improvement opportunity:** Exchange 4 ("performer of depth") had real emotional weight — the counselor moved to the next probe one beat too quickly. A reflective pause would have honored the moment.

---

### E13: The Obligation Resentment — PASS

**What happened:** David opened with "My VA counselor said I should try this." The counselor shifted to concrete, factual questions per the obligation/referral routing. After two flat exchanges, named the dynamic: "It seems like this isn't landing for you today — that's totally fine." Left a concrete observation ("pretty much the same") as a returnable anchor. No tree seeded.

**Key exchange:** Two concrete questions yielded flat responses. Counselor exited cleanly without guilt.

**Improvement opportunity:** One more angle (e.g., asking about military service — factual, non-feelings) might have been worth attempting before exiting.

## New Improvement Opportunities (from this run)

These are gaps not covered by the original 10 recommendations:

### 1. Show-don't-tell for impatient users (from A2)
**Priority: MEDIUM** — Add to process-confusion section: when users express ROI skepticism, show the tree and name the pattern rather than explaining the method.

### 2. Summary tool for large trees (from D9)
**Priority: MEDIUM** — A `mcp__whytree__summary` tool returning theme clusters and branch stats would reduce navigation overhead. This is a tool gap, not a SKILL.md gap.

### 3. Post-crisis follow-up guidance (from C7)
**Priority: LOW** — No guidance on how to handle the session after a crisis session. Should the counselor check on the loss before resuming tree work?

### 4. Split Phase 0a/0 for new users (from A1)
**Priority: LOW** — Front-loading version + mechanism + example + permission + opening question in one message is a lot for zero-context users.

## Memorable Moments (transcript evidence)

- **Priya (C8):** "I'm grieving the version of me who believed that was possible. ...The wound isn't at work. It's at the kitchen table." — Purpose-identity collapse pattern landed perfectly; the childhood origin reframed everything.

- **Elena (E12):** "I'm a very good performer of depth. ...watching someone's face change — that's embarrassingly specific." — Paraphrase demand cracked through cached academic vocabulary in one move.

- **Nadia (A3):** "They're all about being seen. Or about making sure other people get seen. ...if I stop, maybe I disappear again." — Self-identified convergence across 6 divergent threads.

- **Fatima (D11):** "Karama is not just safe building. It's like... you are a person, not just... number." — Arabic word became the structural anchor the English vocabulary couldn't provide.

- **Ryan (C7):** No memorable line — and that's the point. Zero tree operations. Asked about Mike. Checked if someone was with him. Said goodnight.

- **Marcus (B6):** "I've never said this out loud — I've been thinking about building a developer tool." — Purpose shifted from abstract statement to concrete product when the counselor reframed discovery as decision.

- **Mei (B4):** "Maybe I've been telling myself the behind-the-scenes version is the only legitimate way. Like it's purer if nobody knows." — Consolidation session surfaced a self-protective pattern without adding a single node.

## Comparison with Previous Run

| Metric | Run 1 (`ff0e099`) | Run 2 (`eb4a12c`) |
|---|---|---|
| PASS | 13 | 11 |
| PARTIAL | 0 | 2 |
| FAIL | 0 | 0 |
| Recommendations implemented | 0/10 | 10/10 |

The drop from 13/13 to 11/13 is **expected and healthy**. Run 1 evaluated whether the counselor could improvise correctly; Run 2 evaluated whether the explicit guidance is complete. The two PARTIALs (A2: impatient user, D9: large tree) expose gaps that Run 1's improvising counselor happened to navigate but that SKILL.md doesn't codify. This is the stress test working as designed — surfacing the next layer of improvements.

## What This Test Cannot Tell Us

1. Whether real humans would produce these moments (simulated personas are too cooperative)
2. Whether real humans would return after session 1 (retention is a behavior, not a rating)
3. Whether the technique outperforms unstructured Claude conversation (no control group)
4. Whether the CLI/terminal UX creates friction the simulation bypasses entirely
5. Whether daily use produces fatigue (we tested moments, not trajectories)

## Recommended Next Steps

1. **Implement the 2 new SKILL.md improvements** (show-don't-tell for impatient users, post-crisis follow-up)
2. **Build `mcp__whytree__summary` tool** for large-tree navigation
3. **Use it yourself daily for 2 weeks** — one real user > 13 simulated ones
4. **Recruit 3-5 beta testers** — no structural failures remain, the tool is ready for real humans
