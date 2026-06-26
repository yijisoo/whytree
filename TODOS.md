# TODO

1. **Regression testing mechanism** — What's the proper way to ensure later SKILL.md changes don't break previously passing scenarios?
    Need a repeatable, automated stress test suite that can be re-run after each edit and compared against prior results (e.g.,
    commit-tagged result files like `stress-test-results-<hash>.md`).

2. **Web/mobile service** — CLI-only blocks adoption for non-technical users entirely. Two independent user interviews confirmed: daily use requires mobile, and non-IT users have no path to the product without a web interface. Needs cloud storage with E2E encryption, cross-device sync, and a conversation persistence layer beyond local JSON files. This is the Kardens.io roadmap item.
    - *Source: Two user interviews (2026-04-14, 2026-04-15) — both independently said mobile is required for daily use and non-technical friends can't use Claude Code at all.*

3. **Avoid restart-after-update friction** — After a successful `git pull` that touches SKILL.md, the skill currently tells the user to `/exit` and re-run `/whytree`. Investigate whether the skill can re-load itself mid-session without a full restart, or at minimum make the UX less jarring (e.g., offer to re-invoke automatically). (2026-04-22)

4. **Phase 6 — Restructure (deferred for further investigation)** — Drafted in commit `b440c30`, reverted in `16c5644` after a five-reviewer panel surfaced data-loss risk and silent-capture failure modes. **Do not re-land without addressing every item in the spec below.** (2026-04-24)

   ### Problem
   Trees built across many sessions accumulate drift: redundant whys, **non-differentiated why-chains** (consecutive Why-Up nodes that are paraphrases without added abstraction — Ji Soo's specifically named insight), orphaned how-downs, stale roots, lopsided depth. Node-by-node merges reshape locally while the overall structure stays incoherent. The user reaches for "another why" when there isn't one, and the chain inflates with synonyms.

   ### Original goal
   Replace local edits with **one holistic pass per session**: counselor analyzes the whole tree silently, surfaces a comprehensive proposal, gets a small number of structural decisions from the user, then executes a single transactional rewrite.

   ### Five design principles (still endorsed)
   1. Holistic over local — read the whole tree before proposing anything.
   2. Preserve provenance — reuse existing node IDs wherever meaning is preserved.
   3. One proposal, one decision round, one rewrite — no node-by-node iteration.
   4. Restructuring is a session outcome — a session that reorganizes without adding a node is successful.
   5. The user owns the language — counselor proposes structure; user names the nodes.

   ### Sketched flow (Phase 6a–6e)
   - **6a Audit** (silent): redundancy, non-differentiated why-chains, empty branches, orphaned how-downs, stale nodes, lopsided depth, root coherence, dialectic check.
   - **6b Proposal** (one turn): name the drift, sketch target shape, list 3–5 decision questions.
   - **6c Decisions** (user-led, one round): walk questions one at a time; capture user articulations.
   - **6d Rewrite**: single transactional save with ID preservation.
   - **6e Close**: restructuring is its own outcome — do not force a Commitment Arc.

   ### Why this is dangerous (from review panel — must all be resolved before re-landing)

   **Data safety (HIGH — these alone justified the revert):**
   - Naive single-write semantics on the highest-stakes operation in the skill. Ctrl-C / OOM / full disk during the rewrite leaves `<slug>.json` half-written, which then trips the "corrupted file → rename to `.corrupted.json` → start fresh" branch in SKILL.md and **destroys the entire tree**.
   - No backup, no undo path. When the user reads the rewrite and says "actually undo that," there is no rollback.
   - No UUID-uniqueness check; a duplicated UUID silently overwrites a node in the JSON `nodes` object.
   - `seedIds ⊆ {n : n.type == "seed"}` is documented but not validated; a rewrite that flips a node's `type` from `seed` to `why` while keeping it in `seedIds` violates the schema silently.
   - `createdAt` preservation isn't documented — an LLM rewriting wholesale will likely regenerate timestamps, destroying authorship history.
   - Acyclicity not in the invariant list; bidirectional symmetry is satisfied by `A↔B` cycles.

   **Silent capture (HIGH — violates principle 5):**
   - Phase 6a is fully silent and 6b ships a target shape *before* the user speaks. That's anchoring, regardless of the principle.
   - The yes-saying user gives blanket "yeah" to every move; counselor either freezes (no labels, can't write) or violates principle 5 and ships its own labels under the user's name. **This is the mainline failure mode.**
   - "Sound right?" before an irreversible save is yes-bias. Replace with "Read this back to me in your own words."
   - "Just do it for me" delegation has no protocol — counselor refuses (rigid) or proceeds (silent capture).

   **State unawareness (HIGH):**
   - No crisis precondition: a grieving user with a triggering tree gets a tone-deaf restructure offer.
   - No `purpose`-set awareness: Phase 6 can re-root a decision-mode tree in ways `purpose` no longer matches.
   - No new-synthesis exit: if a brand-new root surfaces mid-6c, the transactional rewrite has no slot for the most important moment of the session.
   - No cross-session cooldown: user can run Phase 6 every session and never let the tree settle.
   - Mid-Phase-2 pivot has no bookmark path; literal refusal is paternalistic.

   **Trigger fragility (MED):**
   - 6b's offer language presumes drift, so a healthy wide tree (5 distinct domains, 17 nodes) traps the counselor into either lying or backing out awkwardly. 6a needs an explicit go/no-go gate (skip offer if <3 high-leverage issues found).
   - `EMPTY_WHY_COUNT` only counts `type:"why"` roots, so stranded **seed** roots — exactly what early-tree drift looks like — are invisible. Likely under-fires during the period restructure is most useful.
   - `MAX_DEPTH ≥ 5 with non-differentiated chains suspected` isn't measurable from preamble alone; needs to be an audit-time check or paired with a depth-diversity metric.
   - `SEED_COVERAGE_RATIO` was emitted but never wired to a trigger.
   - Decision count "3–5" with no floor invites bloat; clinical lens recommends capping at **3** for users whose tree is already incoherent enough to need this.

   **Structural omissions:**
   - Audit checklist missing: cycle/DAG check, type-rule violations from Converge+Rename, should-converge cross-root pairs, purpose-vs-tree drift.
   - ID-preservation rule underspecified — needs a deterministic "older `createdAt` wins on merge; compression preserves the most articulate surviving node's ID" rule.
   - Non-differentiated chain detection is the central novel claim and was left as a vibe. Needs a 3-layer cascade: lexical Jaccard >0.5 → structural (chain length ≥3, no branching, no how-down spurs) → LLM semantic check on flagged triples.
   - Soft-archive option for retired roots (don't hard-delete a once-core self-narrative).
   - Phase 6 interaction with demo mode unspecified.

   ### Investigation plan before re-landing
   1. **Build the safety substrate first.** Pre-write backup to `<slug>.pre-restructure-<ISO>.json`, atomic write via `.tmp` + `mv`, schema-version bump to add `lastRestructureAt`, expanded post-write validator (UUID uniqueness, seedIds-type membership, acyclicity, rootIds ⊆ nodes, createdAt preservation). This work is independently valuable — every tree-write op benefits.
   2. **Resolve the silent-capture problem head-on.** Decide whether the counselor is allowed to author labels at all, and if so under what visible "provisional" status. The mainline failure (yes-saying user) needs a protocol-level fix, not a tone fix. Possibly: hard rule that 3 consecutive non-articulating yeses in 6c aborts the rewrite.
   3. **Add state-aware preconditions.** Crisis-affect skip, purpose-set alignment check, cross-session cooldown via `lastRestructureAt`, new-synthesis exit, mid-Phase-2 bookmark.
   4. **Replace the drift-presuming offer with a conditional offer.** 6a must produce a go/no-go count; <3 high-leverage issues = no offer.
   5. **Operationalize the non-differentiated chain detector** (3-layer cascade) before claiming it as a feature.
   6. **Run the 10-scenario adversarial stress test against the redesigned protocol** before re-landing. Reference scenarios live in the conversation log of session `1b95d94a-d792-48c7-8f82-8723f6101677`; covers sycophancy, refusal, mid-phase pivot, false-positive trigger, insisted distinction, acute distress, delegation, mid-restructure synthesis, decision-mode tree, cross-session churn.
   7. **Re-run the five-lens panel** (code-reviewer, clinical, information architecture, safety/invariants, adversarial stress) on the redesigned spec before code lands.

   ### Reference commits
   - `b440c30` — original Phase 6 implementation (4 files, 251 insertions). Useful as a starting point for the rewrite, but every HIGH-severity issue above must be addressed before any of it is reused.
   - `16c5644` — revert.
