# Gap Analysis: Session-1 Vision Tree vs. Current Skill Implementation

Date: 2026-06-26
Author: Claude (gap-analysis agent)
Source vision: `~/.whytree/whytree-product.json` (20 nodes, locked purpose)
Source findings: `docs/product-discovery/2026-06-26-session-1-whytree-reverse-engineer.md`
Source spec: `docs/superpowers/specs/2026-06-24-skill-web-parity-and-product-pack-design.md`
Skill files read: `SKILL.md`, `core/*.md` (8 files), `domains/life/*.md` (4 files), `domains/product/*.md` (4 files), `skill/mechanics.md`

---

## Gap Table

| Element (from vision/findings) | In skill impl? | Evidence | In spec? | Evidence | Gap severity | Note |
|---|---|---|---|---|---|---|
| **Mode/capacity detection (`set_focus`)** — discriminate goal / being / stabilize / domain before shaping questions | **No** — not as a named fork; domain is selected at invocation (`/whytree product`), but no intra-session mode fork exists | `core/phases.md` has only session-gap routing (NEW / RETURNING) and Focused vs Deep branching on time; no mode gate | **Partial** — named as a Tier-1 universal operation, but its parameters and firing rule are explicitly an open question | Spec §"Initial context vs emergent purpose"; §"Open questions" bullet 3 | **Major** | The spec defers resolution to before Spec 1 ships; neither the skill nor the spec gives a counselor a rule for detecting being-mode or stabilize-mode at session open |
| **Being-mode** as its own sub-mode: dwell/how-down + appreciative-why ("what is it about this?"), not climbing-why | **No** | No mention of being-mode in any core or domain file; `core/role-and-technique.md` describes only upward climb and alternation | **No** | Spec §"Roadmap" and §"Open questions" list `set_focus` but do not mention being-mode as a named mode or define the appreciative-vs-climbing-why distinction | **Major** | Vision tree node `95759864` ("Being-mode meaning — presence, savoring, awe; honored, never pushed") + child nodes define two specific sub-moves (increase resolution; how-down to more presence activities) absent everywhere in the skill |
| **Stabilize-mode** — low capacity → small concrete wins before purpose work; milder sibling of crisis protocol | **Partial** — crisis protocol exists in `domains/life/framing.md` (Opening Question routing: "Crisis / acute distress → all technique phases suspend") | `domains/life/framing.md` §"Opening Question" routing table | **No** | Spec mentions crisis path only in workshop safety (§"Facilitator safety") with no stabilize-mode distinct from it | **Major** | Vision tree node `8b61a6e7` explicitly distinguishes stabilize from crisis ("milder … third mode"). The skill conflates the two; a depleted but non-crisis user has no dedicated path |
| **Longer-arc supported goals** — deadline, anticipated hurdles, between-session encouragement, end-reflection | **Partial** — next-day tiny experiment exists (`core/phases.md` Phase 5, `core/COMMITMENT_ARC.md` referenced); between-session gap routing exists (SAME_DAY / RECENT / WEEK / LONG_GAP) but only to *check-in*, not to *proactively encourage* | `core/phases.md` §"Return Check-in"; `skill/mechanics.md` §"Preamble" | **Partial** — spec names "proactive between-session support" as a gap and lists it as a candidate feature; no design yet | Spec §"Longer-arc supported goals" (findings doc), §"Roadmap caveat on memory" | **Major** | Proactive encouragement and end-of-arc reflection are not implemented; the return check-in is reactive (user opens the session), not proactive |
| **Surface-the-gap (said vs done)** as an explicit counselor move | **No** — present in the vision tree as a named `how` node (`bcc57742`) but absent from `core/PROBE_PATTERNS.md` and `core/signals.md` | Neither file mentions said/done discrepancy as a named pattern or signal | **Yes** — listed in findings §"Candidate features" | Findings doc §"Candidate features" bullet 2 | **Major** | Closest current move is the interest-vs-obligation signal in `core/signals.md`, which detects obligation language but does not compare stated values against actual behaviors |
| **Mattering / contribution axis** — seed questions that elicit this axis of meaning | **No** — all seven life-domain seed questions target inward pull (involuntary attention, flow, intrinsic motivation, aspiration, regret, proxy, unseriousness); none target outward contribution or relational meaning | `domains/life/SEED_QUESTIONS.md` §"Seed Questions Reference" (all seven) | **Partial** — spec notes axis asymmetry as finding #5, lists "outward / engagement / being seed questions" as a candidate feature | Spec §"Axis asymmetry" (findings doc); §"Candidate features" | **Major** | Vision tree node `9c7da6a2` ("Mattering to / contributing to others") is a top-level axis of meaning with its own how-node; no life-domain seed elicits it |
| **Deep-engagement axis** — seed questions that elicit "gripped by real worth" (Wolf) | **Partial** — The Flow Question (#2, `domains/life/SEED_QUESTIONS.md`) touches absorption / flow state; no explicit "gripped by something of real worth" framing | `domains/life/SEED_QUESTIONS.md` Q2 | **Partial** — spec notes axis asymmetry, lists engagement seeds as a candidate; no draft yet | Findings doc §"Axis asymmetry" | **Minor** | Flow question is close but targets Csikszentmihalyi's flow, not Wolf's "subjective pull meets objective worth" distinction |
| **Being-axis seed questions** — elicit presence, savoring, awe | **No** | No seed in `domains/life/SEED_QUESTIONS.md` targets being-present or savoring; all seven target direction/aspiration | `domains/life/SEED_QUESTIONS.md` (full list) | **Partial** — listed as "outward / engagement / being seed questions" candidate | Findings doc §"Candidate features" | **Major** | The being axis is entirely absent from seed design; a user in being-mode would receive direction-flavored questions |
| **Why-up as universal disambiguator** — same activity (e.g., collecting feedback) carries opposite meanings; revealed why discerns authentic vs distorting | **Partial** — the interest-vs-obligation signal (`core/signals.md`) does probe for obligation, and Pattern 4 (solution fixation, `core/PROBE_PATTERNS.md`) tests whether a commitment survives without its solution; but no explicit "climb the why to discern contingent-worth from contribution" move | `core/signals.md` §"Interest vs. obligation signal"; `core/PROBE_PATTERNS.md` Pattern 4 | **Partial** — spec §"Finding 3" names this explicitly; product framing.md §"Evidence provenance" implements it for customer branches in the product domain | `domains/product/framing.md` §"Evidence provenance"; spec §"Finding 3: Why-up is the universal disambiguator" | **Minor** | The principle is articulated in product domain framing but not generalized into core probe patterns; it is absent from the life domain |
| **Versatility / domain generality** — architecture that supports swapping domain packs | **Yes** — the core+domain+mechanics architecture is fully implemented | `SKILL.md` §"Domain selection" and §"Load order"; `core/` is domain-agnostic | **Yes** — the unifying architecture section is the backbone of the spec | Spec §"The unifying architecture" | None | This is the strongest alignment point between vision and current implementation |
| **Tree as mirror / externalize motive-structure** | **Yes** — explicit in `core/role-and-technique.md` ("The tree is a byproduct"), operating rules, and visualization | `core/operating-rules.md`; `core/role-and-technique.md` | **Yes** | Spec §"Unifying architecture" | None | Well-covered |
| **Mindful, unbiased listening** (vision node `12CFD643`) | **Yes** — anti-sycophancy rules, one-question-at-a-time, letting insight arrive | `core/operating-rules.md`; `core/PROBE_PATTERNS.md` §"Anti-sycophancy rules" | **Yes** | Spec §"Core" (operating rules as part of invariant) | None | — |
| **Connect the dots across sessions** (vision node `050928C5`) | **Partial** — session-gap check-in connects to prior experiment; no cross-session memory in skill | `core/phases.md` §"Return Check-in" | **Partial** — spec names cross-session memory as Spec 3 (later) | Spec §"Roadmap" step 3; §"Spec 3" | **Minor** | Intentionally deferred; the gap exists but is accepted by design |
| **Silence and space** (vision node `64660b59`) | **Yes** — "Let the moment of recognition breathe"; "let silence work" | `core/operating-rules.md` §"Let the moment of recognition breathe" | **Yes** (as part of operating rules in core) | — | None | — |
| **Reflect words back** (vision node `81b9032e`) | **Yes** — Move 2 (reflect then probe); Clean Language | `core/PROBE_PATTERNS.md` §"Three probe moves" Move 2 | **Yes** | — | None | — |
| **Goal-oriented conversation / tree as compass** (vision node `53d800b0`) | **Yes** — commitment arc, experiment, return check-in all anchor to the goal | `core/phases.md` Phase 5; `core/COMMITMENT_ARC.md` | **Yes** | Spec §"Tier 1 universal" | None | — |
| **Tiny iterative experiments** (vision node `fd69477f`) | **Yes** | `core/phases.md` Phase 5 Commitment Arc; mini arc in Focused mode | **Yes** | Spec §"Tier 1" | None | — |
| **Safety & guardrails** (vision node `c8cbabd1`) | **Yes** — crisis protocol, blame-free framing, no-judgment rules | `domains/life/framing.md` §"Crisis / acute distress"; `core/operating-rules.md` | **Yes** | Spec §"Facilitator safety" | None | Robust in 1:1; workshop group version is spec-only |
| **Gather others' feedback as data (not a verdict on worth)** via why-up disambiguation (vision node `4b28929e`) | **Partial** — product framing has evidence-provenance probe; life domain has no equivalent | `domains/product/framing.md` §"Evidence provenance" | **Partial** — spec names finding #3 | Spec finding #3 | **Minor** | Only in product domain; absent from life domain's probe patterns |
| **Prolonged, deadline-specific goal** (vision node `7b5f8c0d`) | **No** | No deadline-bound commitment arc exists; Commitment Arc is next-day experiment only | `core/COMMITMENT_ARC.md` (referenced but not read for this analysis — confirmed absent from phases.md) | **No** | Not addressed in spec | **Major** | Between-session encouragement and end-of-arc reflection are entirely undesigned |

---

## Top Missing in the Skill (Implementation Gaps — Major)

These are elements the vision tree and findings surface as important that have **no implementation** in any current skill file.

1. **Mode/capacity gate (`set_focus`)** — No intra-session fork discriminates goal-mode, being-mode, stabilize-mode, or domain before shaping the session's questions and technique. The current skill only selects domain at invocation and routes by session-gap and available time. Running goal-mode why-up on a depleted or being-mode user is an active harm risk, per finding #1.

2. **Being-mode sub-mode** — The appreciative "what is it about this?" probe (distinct from the climbing "why does this matter?"), the how-down-to-more-presence move, and the non-pushing stance for being-axis users are entirely absent from `core/PROBE_PATTERNS.md`, `core/signals.md`, and all domain files. Vision nodes `95759864`, `5c453ed2`, `0d2011ad` have no skill analog.

3. **Mattering / contribution and being-axis seed questions** — All seven life-domain seeds target inward-direction meaning. No seed elicits mattering to others (contribution axis, vision node `9c7da6a2`) or being-present / savoring / awe (being axis, vision node `95759864`). This is the axis asymmetry finding (#5): the tool over-indexes direction and is blind to the other three axes at seeding.

4. **Stabilize-mode path** — A distinct path for low-capacity users (small concrete wins before purpose work) does not exist. The crisis protocol (`domains/life/framing.md`) is the only low-state path, and it suspends all technique. There is no intermediate route for depleted-but-not-in-crisis users. Vision node `8b61a6e7` is unimplemented.

5. **Surface-the-gap (said vs done) as an explicit move** — No probe pattern or signal rule instructs the counselor to name discrepancies between what a user says matters and what they actually spend time on. The vision tree treats this as a core revealing mechanism (node `bcc57742`), not just a background signal.

6. **Longer-arc commitment with proactive between-session support** — The Commitment Arc produces only a next-day experiment. No prolonged, deadline-bound commitment with anticipated hurdles, proactive encouragement, or end-of-arc reflection exists. Vision node `7b5f8c0d` is entirely unimplemented.

---

## Top Missing in the Spec (Design Gaps)

Elements that the session-1 vision and findings surface that are **not yet designed** in the spec (`docs/superpowers/specs/2026-06-24-skill-web-parity-and-product-pack-design.md`).

1. **Being-mode and stabilize-mode design** — The spec names `set_focus` as a Tier-1 operation but does not define what it does when mode=being or mode=stabilize. The appreciative-vs-climbing-why distinction (finding #2), the how-down-to-presence move, and the stabilize small-wins path have no spec section, no probe guidance, and no rubric dimension. These are the most substantive behavioral-design gaps — the spec resolved the architecture question (core + domain packs) but did not fill in the mode-specific content.

2. **Axis-aware seeding design** — The spec names axis asymmetry as finding #5 and lists "outward / engagement / being seed questions" as a candidate feature, but provides no draft seeds, no mechanism analysis, and no rubric amendment for the three non-direction axes. Given that the product-pack seed questions were drafted to the level of seven questions with mechanisms and stage tags, the omission of analogous life-domain seeds for contribution, engagement, and being is a concrete design gap, not a deferred architectural question.

3. **Surface-the-gap as a named probe move** — Listed in findings §"Candidate features" but has no spec section giving it a design, a trigger condition, or integration into `PROBE_PATTERNS.md`.

4. **Longer-arc commitment arc design** — No spec section addresses how a deadline-bound commitment differs from the current next-day experiment: what the commitment schema looks like, how proactive encouragement is triggered, or what the end-of-arc reflection protocol is. The spec acknowledges memory as an engagement item (§"Roadmap caveat") but does not connect it to the longer-arc arc design.

---

## Reverse Gaps (Things the Skill or Spec Have That the Vision Tree Missed)

These are capabilities the current skill or spec contains that the session-1 vision tree did not explicitly surface — they are additional value the tree did not capture, not deficiencies.

1. **Anti-sycophancy rules and named pushback patterns (Patterns 1–7)** — The vision tree captures "mindful, unbiased listening" and "reflect words back" at a high level, but the skill's seven named pushback patterns (`core/PROBE_PATTERNS.md`) — including the fluent-insight trap, purpose-identity collapse (Pattern 5), and performed-purpose earnestness check (Pattern 6) — are substantially more fine-grained than anything the vision tree named. These are a skill-only asset.

2. **Focused vs Deep mode routing** — The vision tree's tool nodes describe the technique at full depth; the skill's time-check routing to Focused mode (20-min cap, mini commitment arc, single how-down) makes the tool accessible to time-constrained users. The vision tree has no node for this adaptation.

3. **Language / locale / register rules** — The operating rules' Korean-specific policies (존댓말, 트리 vs 나무, mixed-language acceptance) are not captured anywhere in the vision tree. They represent a significant UX investment invisible to the technique-level view.

4. **Connection check (incident → existing node)** — `core/signals.md` §"Connecting incidents to existing nodes" is a precise protocol for naming a candidate link without proposing the convergence. The vision tree captures the tree as a mirror (node `2d252d0b`) but not this specific conversational move.

5. **Pattern-aware user override** — `core/phases.md` detects when a returning user signals meta-awareness of the ritual and skips framing. The vision tree has no analog.

6. **Product-domain probe specifics** — Evidence provenance on customer branches, the convergence test as a probe, and the risk-branch counseling stance (`domains/product/framing.md`) go beyond the product-axis nodes in the vision tree. The vision tree captures the axes but not the product counselor's specific conversational moves.

7. **The eval rubric and instrumentation schema** — The spec's pre-registration of success dimensions (Why-Up climb, Convergence quality, Aliveness, etc.) and the per-session anonymous telemetry schema are entirely outside the vision tree's scope. These are design artifacts that serve the measurement infrastructure, not the technique.

---

## Summary

- **Major implementation gaps: 6** (mode gate, being-mode, stabilize-mode, axis-asymmetric seeds, surface-the-gap, longer-arc commitment)
- **Minor implementation gaps: 3** (deep-engagement axis seed, why-up-as-disambiguator in life domain, cross-session memory — deferred by design)
- **Major spec gaps: 4** (being/stabilize-mode design, axis-aware seeding, surface-the-gap design, longer-arc arc design)
- **Reverse gaps: 7** (skill and spec contain substantial value the vision tree did not capture)

The sharpest finding: the vision tree revealed four axes of meaning (direction, mattering, engagement, being) plus a stabilization precondition, but the current skill is built almost entirely on the **direction** axis. The architecture (core + domain packs) is well-positioned to absorb the missing axes; the gap is content and mode-branching, not structure.
