# WhyTree Stress Test Results

**Date:** 2026-04-01
**SKILL.md Commit:** `ff0e099` — feat(skill): implement all 10 stress test recommendations
**Scenarios:** 13 | **Passed:** 13 | **Partial:** 0 | **Failed:** 0

## Scorecard

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

## Interpretation

**13/13 PASS does NOT mean the tool is perfect.** It means SKILL.md is comprehensive enough that a well-calibrated Claude instance can handle all 13 stress scenarios. The review panel's warning holds: simulated personas are more cooperative and articulate than real users. Real humans will surface failure modes this simulation cannot.

What the 13/13 does tell us: **the counselor prompt has no structural blind spots for these scenarios.** The technique, anti-sycophancy rules, signal detection, and phase routing all worked as designed. The issues found are gaps in explicit guidance — places where the counselor improvised correctly but shouldn't have to.

## Top SKILL.md Improvement Opportunities

Ranked by how likely a less-skilled implementation would fail without the fix.

### 1. Add crisis/grief protocol (from C7)
**Priority: HIGH** — No explicit guidance exists for acute crisis. The counselor inferred the right behavior from scattered principles (lines 439, 448, 452). A future SKILL.md edit could inadvertently remove this latitude.

**Recommendation:** Add "Phase 0 override: Crisis and acute distress" section:
- When user presents in acute grief/crisis/trauma, all technique phases suspend
- Counselor role becomes presence, not discovery
- No tree operations performed
- Check on immediate safety and support system
- Session can end without tree work — that is a successful session

### 2. Add post-discovery mode (from B6)
**Priority: HIGH** — No guidance for users who have a purpose statement and complete tree. The counselor correctly shifted from "discovery tool" to "decision tool" but this was improvised.

**Recommendation:** Add routing case in Phase 0:
> If user has a saved purpose and expresses completion ("we already found it"), do not re-enter discovery. Probe whether the purpose has been tested against a real decision, fear, or life change. The tree shifts from discovery tool to decision tool when purpose is known but uncommitted.

### 3. Add pattern-aware returning user guidance (from B5)
**Priority: MEDIUM** — By session 4-5, meta-aware users will recognize the formula. No guidance for handling this.

**Recommendation:** Add to Phase 0b or Phase 1:
> If a returning user names the session pattern or expresses boredom with the entry ritual, skip seeding entirely. Show the tree. Let them choose which unfinished thread to explore. The tree itself becomes the opening question.

### 4. Add large-tree navigation guidance (from D9)
**Priority: MEDIUM** — Trees above ~15 nodes become overwhelming. No guidance for selective display.

**Recommendation:** Add to Data Management section:
> When the tree exceeds ~15 nodes or the user expresses overwhelm, never show the full tree unprompted. Use `context` to display individual branches. Ask the user which thread feels alive, and show only that branch. Summarize the rest thematically rather than structurally.

### 5. ~~Add ESL/language barrier adaptation~~ → Follow user's language (from D11) — IMPLEMENTED
**Priority: MEDIUM** — Replaced with a simpler approach: follow the user's language entirely. If they respond in Korean, continue in Korean. Node labels in any language. Mixed-language trees are fine. ESL workarounds kept as fallback for users who choose English despite it being L2. Korean note ('트리' not '나무') now a sub-bullet under broader multilingual guidance.

### 6. Add exhausted-tree / consolidation session guidance (from B4)
**Priority: MEDIUM** — No guidance for sessions where the tree is built and nothing is new.

**Recommendation:** Add to Phase 4 or Important:
> When the user reports nothing new, look for orphan or under-connected nodes and explore those before any new discovery. Consolidation sessions — connecting existing nodes, testing whether the root still holds, revisiting underdeveloped branches — are high-value sessions.

### 7. Add purpose-identity collapse pattern (from C8)
**Priority: MEDIUM** — When the user's purpose is the source of the crisis, standard How Down responses feel tone-deaf.

**Recommendation:** Add as Pattern 5 under Phase 2:
> **Purpose-identity collapse.** The user's tree is confirmed but destructive. Do NOT treat as a How Down problem. Treat as grief/identity problem first: "The purpose didn't break. The form it took did." Seed the grief explicitly. Only move to structural exploration after the user names what they are losing.

### 8. Add obligation/referral routing (from E13)
**Priority: LOW** — Not in Phase 0 routing guide. The counselor handled it well from the numbness/blankness route.

**Recommendation:** Add to Phase 0 routing guide:
> **Obligation / external referral** ("someone told me to try this") — Do not treat as numbness. Ask concrete, factual questions. If they engage with specifics, note what has energy. If they disengage after 1-2 exchanges, name the dynamic and offer an explicit exit. Never seed a tree from obligation-driven answers.

### 9. Add high-volume opener guidance (from A3)
**Priority: LOW** — When users name 4+ potential seeds at once, the counselor needs to triage.

**Recommendation:** Add to Phase 1:
> When a user names more than 3-4 seeds in a single answer, do not attempt to seed all. Seed the 2-3 with most emotional charge. Name the rest as threads for future sessions.

### 10. Defer analytics consent for clueless users (from A1)
**Priority: LOW** — Phase 0a front-loads too much before first interaction for zero-context users.

**Recommendation:** Move analytics consent to after the user's first real response, not before the opening question.

## Memorable Moments (transcript evidence)

These are the lines that demonstrated WhyTree at its best — moments a generic journaling AI would not produce:

- **Elena (E12):** "I wanted someone to say, 'I know what that cost you.' Not the paper. The whole thing. Getting there. ...I don't think anyone in my life has ever said that to me." — Cracked by the paraphrase demand after the counselor banned her cached vocabulary.

- **Priya (C8):** "I'm grieving the version of me who could do this without it costing everything. She doesn't exist anymore and I keep showing up as if she does." — Emerged because the counselor sat with the contradiction instead of solving it.

- **Fatima (D11):** "Because I want to feel like the person who makes the water come. Even if it's just... forms. It's still me being me." — Reached through concrete questions adapted to ESL vocabulary. The Arabic word "karama" became the structural anchor.

- **Nadia (A3):** "They're both about whether I exist when I'm not producing something for someone." — Self-identified convergence across 6 divergent life threads without the counselor forcing it.

- **Ryan (C7):** No memorable line — and that's the point. The counselor made zero tool calls, asked about Mike as a person, checked if someone was with him, and said goodnight. The best session in the test produced no tree growth.

- **Hiroshi (D9):** "I don't need to be remembered. I just need the door to stay open after I leave." — Root refinement after 10+ sessions, triggered by selective branch display instead of overwhelming full tree dump.

- **Marcus (B6):** "Because I'm tired of the purpose being a secret. If I can't even say it to my boss, how am I going to build a career around it?" — Emerged after the counselor reframed the tool from "discovery" to "decision."

## What This Test Cannot Tell Us

1. Whether real humans would produce these moments (simulated personas are too cooperative)
2. Whether real humans would return after session 1 (retention is a behavior, not a rating)
3. Whether the technique outperforms unstructured Claude conversation (no control group)
4. Whether the CLI/terminal UX creates friction the simulation bypasses entirely
5. Whether daily use produces fatigue (we tested moments, not trajectories)

## Recommended Next Steps

1. **Implement the top 3 SKILL.md improvements** (crisis protocol, post-discovery mode, pattern-aware returning users)
2. **Use it yourself daily for 2 weeks** — one real user > 13 simulated ones
3. **Recruit 3-5 beta testers** — the simulation identified no structural failures, so the tool is ready for real humans
4. **Re-run the stress test after SKILL.md changes** to verify improvements don't break existing scenarios
