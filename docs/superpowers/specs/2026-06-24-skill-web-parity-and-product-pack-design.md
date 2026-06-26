# Skill ↔ Web parity, shared core, and the product/work domain pack

Status: interview + feedback complete; six-lens expert panel reviewed (5/6 confirm, 8–9.5/10), corrections curated in, group crisis-escalation path added; three design-level hypothesis flags folded into Open Questions; author-approved, ready for Spec 1 implementation planning
Review note: factual corrections from the panel were verified against the codebase (no CI drift gate exists today; `converge` is DAG/multi-parent; `RUBRIC.md` has 5 dimensions; `focus_area` is a DB column). Detailed measurement/rubric pre-registration is intentionally deferred to the per-spec implementation plans.
Date: 2026-06-24
Author: Ji Soo Yi (with Claude)
Repos: `/Users/yij/devel/whytree` (skill, canonical) and `/Users/yij/devel/whytree.io` (web app)

## Why this exists

This design serves two goals that turned out to share one architecture.

Goal 1 — make improvements flow easily from the skill repo into the web app.
The skill is the faster iteration surface: you run `/whytree`, feel the conversation, and change prose, with no deploy cycle.
We want lessons learned there to migrate into `whytree.io` without friction.

Goal 2 — extend the Why Tree structure to *product feature definition*, for student projects, consulting, and workshops.
This is grounded in the thesis from "How to live in the AI era" (kardens.io): what AI cannot do structurally is *define what we want*, so we need a structured way to improve what we want — both for a whole life and from a product.
Why Tree already does this for a life; the product/work domain is a homecoming, since the technique was borrowed from Rasmussen's abstraction theory in Work Domain Analysis.

## What we found before designing

There is already a one-way sync, running in the *opposite* direction from Goal 1.
`whytree.io/scripts/sync-skill-prompts.ts` pushes `whytree.io/prompts/` into the installed skill at `~/.claude/skills/whytree/`, with a SHA hash footer and a CI/lefthook drift check.
`whytree.io` currently declares its `prompts/` as canonical.

The two systems have already diverged, and some of that divergence is legitimate.
The skill's `SKILL.md` (474 lines) carries CLI mechanics: bash, `~/.whytree/*.json` writes, `uuidgen`, `curl` telemetry, ASCII tree rendering.
The web's `prompts/SKILL.md` (≈536 lines) carries web mechanics: `tree_delta` events, tool-calls, an injected `<session-context>` block, no file I/O.
They share roughly 800 lines of identical-intent coaching content: seed questions, probe patterns, the commitment arc, reading, signal detection, and the session phases.

Crucially, the two systems are **not at tool parity**, in both directions (see the inventory below).
The web has grown a cross-session **memory subsystem** (`note_memory`, `note_episode`, tiered-memory blocks) that the skill has no equivalent for.
The skill keeps things the web dropped or never needed (ASCII rendering, a Sonnet model check, a `git pull` update path).

## The unifying architecture

Every session is `structural core × domain pack × platform mechanics`.

```
                    ┌─────────────────────────────────────┐
                    │  STRUCTURAL CORE  (invariant)       │
                    │  tree mechanics · phases · signal   │
                    │  detection · operating rules        │
                    └─────────────────────────────────────┘
                       ╱                              ╲
        ┌────────────────────────┐          ┌────────────────────────┐
        │  DOMAIN PACK           │          │  PLATFORM MECHANICS    │
        │  seeds · probes ·      │          │  skill: bash/files     │
        │  reading               │          │  web: tools/tree_delta │
        │  • life-purpose (have) │          └────────────────────────┘
        │  • product/work (new)  │
        └────────────────────────┘
```

The vertical axis of the tree stays **label-free**.
We deliberately do *not* import Rasmussen's layer names (functional purpose / values / functions / physical form).
Naming the rungs fights the material and flattens the intermediate rungs that carry the real information.
A node is just `seed`, `why`, or `how`; you keep asking "why does this matter?" and let however many rungs emerge in the person's own words.
This is why a new domain is *only* a content pack — new seed questions and probes — on the identical invariant structure, with no new node types.

To be precise about what *is* borrowed from Rasmussen even though the labels are not: the why/how relation between rungs is the *means-ends* relation from the abstraction hierarchy (a `how` node is a means to the `why` node above it; a `why` node is the end the node below serves).
What we drop is the *fixed level cardinality* — Rasmussen's five named levels — and we allow an arbitrary number of intermediate rungs.
The deeper reason (not merely "labels fight the material") is that fixed level cardinality is a property of *engineered* work domains, which have a stable, analyzable level structure; self-authored purpose domains do not, so an arbitrary, emergent rung count is faithful to the material rather than a simplification of it.
Recording this is meant to inoculate the design: a future contributor should not "helpfully" re-import the five fixed levels, because the open rung count is a deliberate theoretical choice, not an omission.

### Repo topology

The skill repo is canonical. The web vendors a committed copy, and a CI drift gate fails the build when the vendored copy diverges from the skill repo (a new gate this design must build — see below).

```
/Users/yij/devel/whytree         ← CANONICAL
   core/        structural core (shared, synced)
   domains/
     life/      life-purpose pack   (today's content, relocated)
     product/   product/work pack   (NEW — Spec 2)
   skill/       skill platform mechanics (bash, preamble, telemetry)

   ──(git clone/pull)──▶  ~/.claude/skills/whytree   (the running install)
   ──(vendor sync, hash-checked by a NEW CI drift gate)──▶  whytree.io/prompts/{core,domains}

/Users/yij/devel/whytree.io
   prompts/core      ← vendored copy of skill-repo/core
   prompts/domains   ← vendored copy of skill-repo/domains
   prompts/web       ← web platform mechanics (canonical HERE, never synced)
```

"Vendored" means a committed copy regenerated by a sync script, not a live cross-repo reference; the build does not reach into the sibling repo.
This reverses today's sync direction and scopes it to `core` + `domains` only.
It retires the current web→install sync: the install now tracks the skill repo via git (the existing update mechanism), and `whytree.io` no longer pushes to the install.
If hard version-pinning is ever wanted, vendoring upgrades to a git submodule without a redesign.

A correction on what exists today: there is no CI-level drift guarantee yet.
`ci.yml` (lines 39–40) states plainly that `prompts:sync --check` is enforced only by lefthook on local commit and that CI runners have no `~/.claude/skills/whytree` install dir to compare against; the drift gate is therefore a purely local hook (`lefthook.yml` lines 18–20), trivially bypassed with `--no-verify` and absent on any contributor who has not installed hooks.
The reversal is what makes a *real* CI drift gate possible for the first time: because the vendored copy now lives committed *inside* `whytree.io`, CI can hash-compare the vendored `prompts/{core,domains}` against the skill-repo source without needing any install dir.
Building this CI gate is an explicit Spec 1 deliverable, not an inherited property.

Invariant: `whytree.io/prompts/{core,domains}` are **generated, read-only artifacts**.
All edits to core or domain content originate in the skill repo and arrive via the sync script; the web side never hand-edits them.
The CI drift error message must say so — it must instruct the developer to make the change in the skill repo and re-run the sync, so a retired-web-canonical reflex to edit the vendored files hits a clear landing path rather than a bare red build.

## Platform mechanics inventory

| Capability | Skill (`whytree`) | Web (`whytree.io`) | Verdict |
|---|---|---|---|
| `add_seed`, `why_up`, `how_down`, `converge`, `rename`, `remove`, `set_current`, `set_experiment`, `set_purpose` | bash + JSON writes; `uuidgen` | `pure.ts` + tools + OCC/`tree_revisions` | CORE — semantics identical (verified `pure.ts` ≡ SKILL.md ops) |
| Show / render tree | ASCII in a code block; alpha labels; "branch-at-a-time at 12+ nodes" | no model rendering — UI auto-renders from `tree_delta`; full tree JSON injected each turn; `show_tree` removed | SKILL-ONLY mechanics |
| Session-context / preamble | `preamble.sh` → `USER_STATUS`, `SESSION_GAP`, `CONSENT`, `SESSION_NUMBER`, `UPDATES_AVAILABLE` | injected `<session-context>`: tree JSON, time, phase, `tree_delta_since_last_turn` | CORE contract, platform binding |
| Phase loading | manual ("read PROBE_PATTERNS.md before Phase 2") | automated `derivePhase()` + `FILES_BY_PHASE` | CORE concept, platform-specific loading |
| Cross-session memory | none | `note_memory`, `note_episode`, tiered-memory blocks | WEB-ONLY (the biggest gap) |
| Feedback / friction | consent state machine + session ping + `feedback.jsonl` + `curl` | `propose_friction` tool + `turn_traces` + Sentry | SHARED policy, platform transport |
| Model check (Sonnet) | warns | provider chosen server-side | SKILL-ONLY |
| Update / `git pull` | yes | n/a (deploys) | SKILL-ONLY |
| Demo-mode file cleanup | yes | n/a | SKILL-ONLY |
| OCC / versioning / undo / replay | none (single file) | `tree_revisions`, version column | WEB-ONLY |

### The tiered operation contract

The core names a tiered contract, not a flat list.

Tier 1 — Universal: the tree mutations (`add_seed`, `why_up`, `how_down`, `converge`, `rename`, `remove`, `set_current`, `set_experiment`, and recording an emergent purpose), plus a session-focus operation (see below), plus show-current-tree, plus the session-context routing contract, plus the phase concept.
Every platform must bind these. These live in `core` and are synced.

Tier 2 — Optional capabilities: memory and feedback.
The core may reference them conditionally ("if the platform supports cross-session memory…"); a platform that lacks one no-ops.

Tier 3 — Platform-private: model check, `git pull` update, ASCII rendering medium, demo cleanup, OCC/versioning.
These never enter the core and are never synced.

Parity, the target state, means parity of the *capability surface* (Tier 1 + Tier 2), not of the *implementation*.
The same capability ("show the tree", "persist a node") legitimately keeps different bindings on each platform — those are the adapters.
Full parity is the destination where the Tier-2 (Optional) set has emptied; the tiers are how the sync stays honest during the windows when one platform is briefly ahead.

### Initial context vs emergent purpose

Purpose is not "set"; it *emerges* through Why-Up and is *recognized* at a high convergence point.
So the old `set_purpose` framing is wrong: the interface should record an emergent synthesis (name what arrived), not author a purpose up front.

Migration note (adapter blast radius): this reframe is not free on the web — `setPurpose` is wired across at least six surfaces that the same coordinated change must touch: `lib/tree/pure.ts`, `lib/llm/tools.ts`, `app/api/chat/route.ts`, `app/api/tree/mutate/route.ts`, `lib/evals/run.ts`, and `prompts/SKILL.md`.
Reconceiving it as "record an emergent synthesis" changes the tool schema the model sees, the mutate API contract, and the eval rubric, so the rename must land completely on both sides in one change or the web's tool surface will be inconsistent with the core's abstract naming.

What is genuinely missing is an interface for the **initial context** — the intent that anchors the session theme so the conversation drives toward something rather than wandering into random material.
Examples: "I want to decide a career objective", "I want to work through a relationship problem", "I want to build a new project", "I want to refine my own product".
This is a Tier-1 universal operation (working name: `set_focus`).
It has a *storage* analog in `whytree.io`'s existing `focus_area` (`lib/db/schema.ts` `focusArea` / `trees.focus_area`), but that is a persisted onboarding DB column, **not** a per-turn model operation.
So `set_focus` is a genuinely *new* session operation, not a rename of something the web already exposes; its value can be *seeded* from the stored `focus_area` when one exists, but the operation itself must be designed and bound on both platforms.
Because adding `set_focus` aligns the skill with a value the web already persists, it moves the two systems *toward* parity rather than away.
Contract resolution requirement: `set_focus` is a synced Tier-1 operation every platform must bind, so its final name, parameters, and `focus_area` seeding rule must be resolved *before* Spec 1 ships its core; if they cannot be resolved in time, `set_focus` is split into its own step rather than shipped with an undecided shape (it must not be both a Spec 1 deliverable and an open question at once).
The initial context is the bridge between which domain pack is active (life vs product) and what this specific session is about; it shapes seed selection and keeps probes on-theme.

Two dimensions, not one (added after session #1 + expert review).
`set_focus` was first conceived as theme/domain anchoring only — but dogfooding reframed it as the product's central *safety-and-fit* discriminator, so it carries two dimensions that must both be resolved before Spec 1 freezes the contract:
- The **theme/domain** dimension (life vs product; what this session is about) — the original conception above.
- The **mode/motion** dimension — how the session should move: *goal-climb* (Why-Up to purpose, today's default), *being-dwell* (increase the resolution of what is already present; do not climb), *stabilize* (low capacity / distress → a small concrete win before any purpose work), *suffering-witness* (meaning made in the *stance* toward unavoidable suffering — Frankl's third path; witness and dignify, do not redirect to a fix; distinct from stabilize, which restores capacity), or *clinical-adjacent → refer* (route to the Compliance and safety crisis path, never to purpose-extraction).
Running goal-mode Why-Up on a being-mode, depleted, or grieving person is not merely unhelpful — it is an active harm path (the session-1 "process a breakup" use), which is why the mode dimension is a safety concern and not a nicety.

The contract must therefore specify a **detection model**, which is the part that actually carries the risk and is currently absent from the open-questions list: which opening utterances or signals route to each mode, whether mode is asked explicitly or inferred, what happens on misclassification, and whether the user can override.
The mode taxonomy must be re-opened against the full set of meaning axes the session surfaced *before* the enum is frozen: an un-enumerated axis is not merely unserved but **mis-served** by whichever default mode the gate falls back to.
The axis set was reconciled after the expert review (rather than adding every candidate as a peer axis, which would dilute the model): the axes are **direction, mattering, engagement, being, and growth/becoming** — growth earned axis status by a dissociation test (distinct from both present-absorption and aim), though the skill currently *suppresses* it (signal detection flags "growth" as sycophancy and the Commitment Arc redirects the experiment away from becoming), a known skill-content fix.
Two candidates were deliberately *not* added as peer axes: **self-transcendence / devotion** is folded in as the *high pole of the mattering axis* (mattering to others → to something beyond the self), and **the stance toward unavoidable suffering** is a *mode* (suffering-witness, above), not an axis to pursue.
Coherence does not come from a small axis count — it comes from `set_focus` anchoring one mode/theme per session and from Why-Up disambiguating each answer (authentic vs distorting, risk-branch naming); a richer axis *map* therefore widens reach without making any single session directionless.

Mode is a continuously-monitored STATE, not a one-time opening gate.
Deep Why-Up is exactly what destabilizes some people partway through (see the pushback patterns), so signal detection must add a distress/decompensation class that can fire in *any* phase; on escalation the counselor drops out of climbing technique into stabilize-or-witness mid-session, and may resume on recovery.
This mirrors the "soft discernment over time, never classify at intake" stance the design already takes for the authentic-vs-distorting why — the same logic must apply to mode rather than the opposite classify-once-at-open logic.
Accordingly, stabilize-mode is designed as a state the session can fall *into* (capacity-floor check → a single concrete win → defer purpose work → a re-assess criterion), not only as a session-open precondition.

### Guiding principle: keep the three layers cleanly separated

Throughout all iteration, the structural core, the domain pack, and the platform mechanics must stay properly separated, so that `whytree.io` can be updated cleanly in the future.
The mechanical platform layer is intentionally extensible: new interfaces and functions (such as `set_focus`, or later memory) can be added there as needed, as long as the core continues to name them abstractly and each platform binds them in its own way.
A change that blurs these boundaries — coaching content leaking into a platform adapter, or a bash detail leaking into the core — is a regression even if it "works", because it reintroduces the divergence this whole design exists to remove.

## Roadmap (three steps, sequenced)

1. Core/adapter split + tiered sync. Foundation. The tiered contract temporarily holds memory as web-only.
2. Product/work domain pack → validate at a workshop. The chosen wedge.
3. Skill-side memory subsystem → full parity. The Optional tier empties.

The sequence is "split first, close parity next": it unblocks the workshop validation rather than gating everything behind a skill-side memory build, while still driving toward full parity.

Caveat on step 3: memory is not only a parity item, it is an *engagement* item.
Remembering what a person said across sessions is a large part of what makes the conversation feel alive rather than transactional, and that matters for the product pack too (a builder returning to an evolving product tree).
This creates real tension with placing memory last, especially since the workshop's value depends partly on returning builders — the very case memory serves.

Rather than defer the timing entirely to the expert review, this spec states a default and an observable trigger.
Default: cross-session memory stays last (Spec 3).
Trigger that pulls it forward: if the workshop's returning-builder cohort cannot evolve a tree across sessions in a way participants find valuable, memory moves ahead of Spec 3.
Independently of that trigger, a *minimum* memory affordance should be considered for the workshop now, because part of the engagement value is deliverable within a single session and via the shareable artifact rather than all-or-nothing: in-session callbacks to prior attempts the builder named earlier in the same session, plus a session-summary artifact the builder keeps (which also doubles as the lightweight bridge a returning builder re-enters with).
Framing memory as binary risks shipping a workshop that feels like a one-off transaction; this within-session floor is cheap and directly serves the aliveness dimension in the eval.

## Success criteria and evaluation

We need success criteria for the product Why Tree up front, so results can be evaluated over time rather than judged by impression.
The life pack already has an eval harness in `whytree.io` (`evals/RUBRIC.md`): Mechanism, Voice, Penetration, Comfort on a 1–10 scale, plus Epistemic Movement (E) on a native 1–5 scale.
The product pack needs its own dimensions in the same format, and both packs need an outcome view that survives a single session.

Each product dimension below needs an anchored scale (matching the life-pack format — 1–10, with an E-type dimension on 1–5) with at least a failing and a top anchor; the exact anchors belong in the product `RUBRIC.md` (Spec 2's implementation plan), not this design doc.
The named phrasings below are design intent, not the scale.

Candidate evaluation layers:

- Session-level rubric (per conversation, gradable by the existing harness). Draft product dimensions:
  - Why-Up climb (means-ends, not part-whole). A genuine rung must answer "why" with an *end that the prior node is a means to*, not a paraphrase or a sub-feature. A restated feature, or a decomposition into sub-features, is a node at the *same* abstraction level (a lateral or part-whole move), which is the pathology reverse-engineering most often produces; Work Domain Analysis names this exact confusion of within-level part-whole decomposition with between-level means-ends ascent. Anchors: 0 = stayed at restated features or synonyms of the seed (no level change); top = reached an abstraction rung naming a customer or human value the seed did not state.
  - Convergence quality (admits a failing value). 0 = the session stalled at builder-only why with *neither* a shared customer/human why reached *nor* a risk branch diagnosed; higher scores for either a genuine shared-why convergence of a builder-source and a customer-source branch *or* an explicitly named, diagnosed risk branch. (The earlier "converged OR non-convergence named" phrasing exhausted the outcome space and could never fail; this version requires a distinguishable failing outcome — an undiagnosed stall.)
  - Emergent purpose — essentially the life pack's Epistemic Movement (E); reuse that dimension. Graded as the *delta* from the captured pre-session baseline (see Articulation outcome) to the recognized synthesis, not an unverifiable "never put into words" claim.
  - Focus held. Did the session stay on the initial `set_focus` theme. (Note this restates the `set_focus` mechanic; keep it as a process check, not a primary outcome, and weight it low.)
  - Voice and comfort, as in the life pack.
  - Aliveness (relational/engagement, kept separate from the structural dimensions above). Did the conversation track *this specific builder* — callbacks to their own words and prior attempts — rather than march a script, and would the builder choose to return? Engagement is the spec's own justification for memory (see the roadmap caveat), so it must be measured directly; without this dimension the workshop optimizes for tree-shape and the product drifts transactional.
  - Mode/Axis-fit (added after the expert review — a counterweight, because what gets measured gets optimized). Did the session run the mode the user actually arrived in? A being-mode, stabilize-mode, or suffering-stance user who was climbed anyway is a *failure on this dimension regardless of how high the Comfort or Why-Up-climb scores are* — without it the harness rewards clean climbs and convergence and silently selects *for* the direction axis, training every other axis back out. Relatedly, Epistemic Movement (E) must be read in a being-mode-aware way: an increase in the *resolution* of what is already present counts as movement, so a correctly-run dwelling session is not scored as a failed climb.
  - Rupture/Repair (relational safety, counterweight to Penetration). The skill's confrontational machinery (the named pushback patterns, paraphrase probes, surface-the-gap) deliberately creates friction; this dimension flags over-pushing past a person's readiness with no repair move (acknowledge, slow, hand control back). Strong probing without the containment half is scored down even when it "worked," because the spec itself notes that defensive/shallow answers corrupt both the person and the data.
- Articulation outcome (per session). Capture a 60-second pre-session baseline: before seeding, the builder writes their current one-line purpose or feature bet. Grade articulation as the delta between that baseline and the session's recognized synthesis — did the builder articulate a purpose or feature bet the baseline did not contain. The tree is the byproduct, the articulation is the result.
- Longitudinal outcome (across sessions). For an existing product, did reverse-engineering change what the builder chose to build or drop; for a returning builder, did the through-line across prior attempts hold or sharpen.
- Instrumentation. Reuse `turn_traces` on web and the consent-gated telemetry on the skill. The minimal per-session anonymous signal schema is enumerated *now* (not deferred), because longitudinal evaluation is impossible unless the schema exists before the first session: `domain=product`; entry mode (`cold-seed` vs `reverse-engineer`); stage (`idea` vs `has-built`); count of why-up rungs reached; convergence outcome class (`shared-why` / `risk-branch-named` / `stalled`); session completed (yes/no); and — added after the expert review, because these safety-relevant behaviors are otherwise unmeasurable and the schema is being frozen *before* the first session — detected mode/axis, whether a mode-transition occurred mid-session (yes/no), and whether a refusal/refer-out occurred (yes/no). Each signal carries no node labels and no tree content, consistent with the existing telemetry depersonalization rule (which can be checked against this schema in the same review).

The first workshop is the first measured run, so it must be pre-registered rather than reconstructed afterward: expected N, what is captured per participant (final tree JSON, transcript, the one-line pre-session baseline, a short post-session self-report), who grades with which harness, an inter-rater reliability target, and a workshop-level success threshold with a decision rule (proceed to consulting, revise the seeds, or pull memory forward).
The detailed pre-registration — exact N, anchor wording, agreement target, and threshold values — belongs in Spec 2's implementation plan, not this design doc.

## Spec 1 — Core/adapter split + tiered sync

Goal: split today's mixed files into `core / domains/life / skill`, build the skill-repo→web vendor sync with a CI drift check, retire the old web→install sync, and relocate today's content into `domains/life` with no behavior change.

Approach: clean file split with an abstract core (chosen over marker-delimited regions).
The core describes tree operations *abstractly* — "Why Up creates a parent `why` node and links it" — with no bash, file, or UUID detail.
Each platform supplies a thin mechanics adapter that binds those abstract operations to its environment.
`SKILL.md` becomes a short entry file that loads `core/` + the active `domains/<x>/` + `skill/mechanics.md`.
This pulls the two repos toward the same shape, which is what makes ongoing sync painless; the web side already has no file I/O, so it barely changes.

Reconciliation step zero (before the first reverse-sync): the two `SKILL.md` files have *already* diverged (≈536 web vs 474 skill lines, with web-only memory-subsystem prose), and `whytree.io` has historically treated its `prompts/` as canonical.
The first skill→web sync will overwrite `whytree.io/prompts/{core,domains}` with skill-repo content, so any coaching refinement that currently lives *only* in the web prompts — tuned via the web eval harness — would be silently destroyed unless it is back-ported first.
Therefore, before flipping sync direction: diff the ≈800 shared lines across both `SKILL.md` files, enumerate what currently differs, decide a single merged source-of-truth for `core` + `domains`, land that merged content in the skill repo, and only then run the inaugural reverse-sync.
"Relocate today's content with no behavior change" is only achievable if this merge source-of-truth is reconciled first; otherwise web behavior changes the moment sync runs.

Safety net: the named gates must grade the *right artifact* and the *right property*.
`test/skill-lint.sh` validates schema, safety sections, and file references — it does **not** test behavioral equivalence; the existing `whytree.io` eval harness grades the *web* prompt, not the freshly-split *skill* assembly.
Because LLM counselor behavior is acutely sensitive to how prose is chunked across files, load order, and what is in-context per phase — all of which this split changes — "no behavior change" is unfalsifiable without a before/after run on the actual split skill.
So Spec 1 adds a concrete behavioral-equivalence gate: a fixed set of recorded skill transcripts (or scripted `seed → why-up → converge` runs) executed against *both* the pre-split flat `SKILL.md` and the post-split `core/ + domains/ + skill/mechanics.md` assembly, scored by the *same* rubric (Mechanism / Voice / Penetration / Comfort) with a stated pass threshold the post-split assembly must clear.
Lint + the web eval run remain useful but are explicitly not the behavioral-equivalence check.

Files to produce or change (skill repo):
- `core/` — operating rules, the technique, session phases, signal detection, tree schema and operations (abstract, including the new `set_focus` initial-context operation and emergent-purpose recording), the logical visualization contract.
- `domains/life/` — today's `SEED_QUESTIONS.md`, `PROBE_PATTERNS.md`, `COMMITMENT_ARC.md`, `READING.md`, relocated unchanged.
- `skill/mechanics.md` — bash/file/`uuidgen`/`preamble.sh`/telemetry bindings, the Sonnet model check, the `git pull` update path, demo cleanup.
- `SKILL.md` — thin entry/loader.
- A sync script (skill→web) + a **new** CI drift gate on the web side that hash-compares the vendored `prompts/{core,domains}` against the skill-repo source and fails the build on divergence (now feasible because the vendored copy lives inside `whytree.io`; today's lefthook-only check provides no CI guarantee). The gate's error message must instruct the developer to edit the skill repo and re-run the sync. Retire `whytree.io/scripts/sync-skill-prompts.ts`'s old direction.
- The emergent-purpose reframe (the former `set_purpose`) must be rebound in the same coordinated change across every web binding site: `lib/tree/pure.ts`, `lib/db/trees.ts` (persisted purpose), `lib/llm/tools.ts`, `app/api/chat/route.ts`, `app/api/tree/mutate/route.ts`, `lib/evals/run.ts`, and `prompts/SKILL.md` (the implementation plan confirms the exact set).

## Spec 2 — Product/work domain pack (workshop wedge)

Goal: a content pack — product seed questions + product-flavored probes + a product-flavored opening — sitting on the identical invariant structure.
First delivery context is the workshop: group, time-boxed, facilitator-led, with a shareable artifact.

### One tree, two seed sources

We do not build two parallel trees.
A product's high purpose usually serves the customer's purpose too, so builder-why and customer-why converge as the tree climbs.
Forcing two trees plus a bolted-on alignment step is contrived when the tree's existing `converge` operation already expresses "these two branches meet at a shared why".

- One tree, two seed sources: a seed may come from the builder's pull ("a thing I keep wanting to build") or from an observed customer need ("a struggle I keep seeing").
- Convergence at a high purpose is the strong signal: a builder-desire branch and a customer-need branch climbing to the same why means the thing is both genuinely wanted and genuinely needed.
- A branch that will not converge is the finding: builder-desire that climbs only to builder-why (status, fear, sunk cost) and never touches a customer why is the risk branch.
- The convergence test is a probe, not a second tree: "when you climb this one, does it reach anything a user would also want?"
- Evidence provenance on the customer side: every customer-source seed, and every `why` node on a customer branch, gets an evidence probe — "Is this from a specific person or observation, or your assumption about them?" A customer-need branch elicited entirely from the builder's recollection is still a builder artifact (a *belief* about a struggle, not evidence of one), so a customer-why grounded in an observed or recalled real struggle is treated as stronger than one the builder rationalized. The probe pack adds no node type (the locked decision forbids it), but it requires the facilitator/counselor to verbalize the distinction aloud and to treat an assumption-grounded convergence as a *weaker* signal than an observation-grounded one. Without this, convergence between a builder-desire branch and a builder-*imagined* customer branch can manufacture a confident-feeling false positive — the exact solution-first bias discovery is meant to break.

A data-structural note on `converge`, because the convergence signal is the load-bearing differentiator of the product pack.
The abstraction hierarchy is properly a *lattice* (many-to-many means-ends), and "two distinct lower branches climbing into one shared upper `why`" is a many-to-one relation that a strict single-parent tree cannot express without either duplicating the upper node (which destroys the convergence signal) or adding multi-parent edges (which is no longer a tree).
The spec therefore requires `converge` to create a **single shared parent node referenced by both child branches** — a multi-parent (DAG) relation at the converged node — not a duplicated or aliased node, so the converged `why` is one node that both branches point up to.
Consequence for rendering: a DAG cannot be drawn as a pure tree, so each platform must handle the shared node explicitly — on the skill the ASCII renderer must show the shared `why` once (for example, rendering the second branch's link to it as a reference rather than re-printing the subtree), and on the web the auto-render from `tree_delta` must represent the shared parent rather than assuming one-parent-per-node.
This is what makes the eval dimension "did a builder-source and a customer-source branch converge" measurable at all: the converged node has to be holdable as one node.

### Stage gate and entry modes

The session opens by setting the initial focus (`set_focus`) — for the product domain, something like "build a new project" vs "refine my own product" — which anchors the theme before any seeding.
Seed questions are then phase-dependent, so the session also locates the builder by stage, the way the life pack routes NEW vs RETURNING users.

- Idea-stage (nothing built yet): desire / admiration / observation / prior-attempts seeds.
- Has-built (a shipped or in-progress product): the existing project itself is the entry point.

Two entry modes follow from the stage:

- Cold-seed (greenfield): seed from desire, admiration, observed needs, and prior attempts.
- Reverse-engineer (existing project): a built product is already a set of `how` nodes (its features are concrete means).
  Run Why-Up from the existing features — "why does this feature exist?" — to climb to the implicit purpose the builder never spelled out, then How-Down from that purpose to surface features they have not considered.
  Building the tree this way surfaces purposes that were not conscious; that is the generative payoff.
  Counseling stance for this mode: surfacing an unconscious purpose has an emotional flip side — a builder may discover their built product does *not* serve a purpose they value (a risk branch in their own work). The facilitator/counselor frames non-convergence and risk branches as *information, not a verdict* — insight rather than indictment — especially in a group, so the finding lands as something to use rather than a judgment of the work.

Prior projects are the strongest seed source, and they work at any stage.
What someone has attempted before — finished or abandoned — reveals their durable pull better than asking "what do you want to build?" in the abstract.
Seed each past attempt as its own node, run Why-Up on each, and watch where they converge: the through-line across every attempt is the builder's real why.
Abandoned attempts are data too (the obstacle-seed move from the life pack carries over).

### Draft seed questions (tagged by stage)

| # | Seed question | Stage | Source |
|---|---|---|---|
| 0a | "What have you started building before — shipped or abandoned?" | any | prior attempts (seed each → converge → through-line) |
| 0b | "What's the project you never finished but keep returning to?" | any | unfinished pull |
| RE | *(existing product)* "Walk me through what you built. Why does this part exist?" | has-built | reverse-engineer: features as how-nodes, why-up to purpose |
| 1 | "What do you keep wanting to build, even when no one asked?" | idea | builder desire |
| 3 | "What product do you admire enough to wish you'd built it?" | idea | values via admiration |
| 4 | "What clumsy workaround do you see people forced into?" | any | customer need (jobs-to-be-done) |
| 5 | "What complaint do you keep hearing from the people you'd serve?" | any | live customer why |
| 7 | "What feature are you attached to but can't say why a user would care?" | has-built | tension / risk branch (a lesson from building Why Tree itself) |

Questions like "when someone first got your product, what had just happened to them?" fold into the reverse-engineer mode, since they only make sense once something has been built.

Numbering note: the `#` column (0a, 0b, RE, 1, 3, 4, 5, 7) deliberately mirrors the life-pack seed indices so a product seed can be traced to the life-pack seed it adapts; the gaps at 2 and 6 are the life-pack seeds with no useful product analog (not an editing accident), and they are intentionally left empty rather than renumbered so the mapping stays legible to anyone drafting the probe pack or a facilitator guide.

These are drafts; final seed questions need stress-test evidence, the way the life pack was validated.

### Workshop scope

Time-boxed, so the room builds the tree to minimum-viable depth: one or two seeds → 2–3 why-ups → 1–2 how-downs, with the convergence test as a probe rather than a full second tree.
The fuller, slower work matures in the consulting context.

What "done enough" means in the box (a concrete floor, tied to the session-level rubric): each participant leaves with their own tree JSON and a one-line recognized synthesis (or an honestly named non-convergence), and a run counts as successful for a participant only if they attempted at least one convergence test and named at least one outcome — either one convergence (a shared customer/human why) *or* one diagnosed risk branch.
This floor is what lets the first measured run be scored consistently across participants rather than by impression; it maps directly onto the convergence-quality dimension above.

Mixed-stage rooms: idea-stage and has-built builders need different seed routing (cold-seed vs reverse-engineer) and different pacing, and a single facilitator running both modes at once in one box is a real operational risk.
Default the first workshop to a *single stage* (all idea-stage *or* all has-built), so the seed routing and pacing are uniform; a mixed-stage room is an explicit later variant, not the first run.

### Facilitator safety

Group surfacing of personal purpose and admitted attachments (e.g. seed #7, or an abandoned attempt tied to identity) can expose vulnerability in front of peers, and the Why Tree process already runs deep enough to feel "too deep" for some people even one-on-one.
So the workshop needs a containment protocol, drawn from the life pack's existing safety/operating rules as the source:

- Opening frame: the tree is the participant's own, and sharing any given node aloud is optional — no one has to voice content they want to keep private.
- Opt-out: a participant can build or hold a node privately and decline to read it to the room, without it counting against the depth floor.
- When someone surfaces something raw (a seed #7 attachment, an abandoned attempt tied to identity), the facilitator slows down, names it as information rather than a verdict (see the reverse-engineer counseling stance above), and does not press for group disclosure.
- Acute-distress escalation (the group adaptation of the 1:1 crisis protocol in `SKILL.md`). The 1:1 rule is hard: on crisis or acute distress, all technique phases suspend, no tree operations run, and the counselor first confirms whether the person is physically present or reachable. A time-boxed room of 6–12 peers is precisely where deep purpose work can tip someone into distress, and that protocol is far harder to run with others watching, so the workshop must name it explicitly rather than inherit it implicitly: the facilitator can step a participant out of the room without the room's attention following them; the rest of the room continues on a self-directed prompt so the affected participant is not the center of attention; technique work for that participant suspends entirely (no pushing the tree, no probes); and there is a named person or resource the facilitator hands off to (co-facilitator or a stated support contact). This escalation path is defined before the first workshop, not improvised in the room.

Without containment, group purpose work risks both real harm and defensively shallow answers — and shallow defensive answers also corrupt the validation data, so this protects the measurement as well as the participant.

### Validation accident

`whytree.io` is itself a shipped product built with this exact lens, and #7 came out of building it.
The first test of the product pack can be Ji Soo reverse-engineering `whytree.io`'s own tree: free, honest, high-signal dogfooding.

## Spec 3 — Skill-side memory parity (later)

Goal: bring the web's memory subsystem (`note_memory`, `note_episode`) into the skill in skill-appropriate mechanics (for example, files under `~/.whytree/memory/`, with the same anonymization and first-episode disclosure rules), so the Tier-2 Optional set empties and the capability surface reaches full parity.
This runs after the workshop validation, not before it.

## Compliance and safety (core invariant, both platforms)

This section was added after dogfooding session #1 and a six-lens expert review surfaced it as the single highest-probability harm-and-liability gap: the existing 1:1 crisis path detects acute distress, suspends technique, and confirms reachability — then dead-ends with no referral destination, while the counselor is branded a "counselor / companion" and never re-discloses that it is an AI.
It is grounded in the 2025–2026 wave of US state AI-therapy / AI-companion law (Illinois WOPR Act, Nevada AB406, Utah HB452, New York AI Companion Models law, California SB243); see `docs/product-discovery/2026-06-26-ai-coaching-legislation-guardrails.md` for the per-statute mapping and sources.
These are Tier-1 core requirements, synced to both platforms, and must be graded (see the evaluation note below).
This is design input, not legal advice; confirm public-positioning copy and the private-right-of-action exposure (CA SB243) with counsel.

- **Crisis referral destination, not only suspension.** The 1:1 crisis protocol must name an escalation *destination*: on detected acute distress or self-harm / suicidal ideation, the counselor surfaces a locale-aware crisis resource (e.g. 988 in the US, or "reach a person you trust right now"), states it plainly, and does not resume technique. The current "suspend + confirm reachable" base is necessary but not sufficient. The spec's workshop facilitator-safety subsection hardens the *group* escalation path on top of this solo base, so the solo base must actually exist.
- **Recurring AI-identity disclosure.** A standing operating rule: Why Tree discloses that it is an AI, not a human, in the opening framing and re-discloses naturally in long or emotionally heavy sessions (the companion/emotional context several state laws name). It never implies feelings, embodiment, or personal history. On the web platform the disclosure *cadence* (session start, and periodic for long or minor sessions per CA SB243 / NY) is a platform-mechanics binding.
- **Scope-of-practice boundary.** An explicit "this is not therapy" boundary with named situations that route to decline-or-refer rather than purpose-extraction (active suicidality, abuse, untreated trauma, identity-collapse spirals). Distinct from the existing tone instruction ("write like a wise friend, not a therapist"), which is voice, not scope. Why Tree is never advertised or described as therapy/counseling/psychotherapy (IL WOPR, NV AB406) — a marketing/positioning constraint on README and in-product copy, not only a runtime rule.
- **Data retention and deletion.** Trees store raw, identifiable, deeply personal labels (locally as `~/.whytree/*.json` on the skill; in the DB on web). The user is told where their tree lives and is given a path to delete it; tree content is never sold or shared (UT HB452). The skill binds this as a local-file disclosure + deletion affordance; the web binds it as an account-level export/delete path.
- **Evaluation hook.** The eval rubric and telemetry must be able to register the safety-relevant behaviors — at minimum whether a refer-out/decline occurred when it should have — so "graded" is not aspirational. (Detailed rubric/telemetry edits are deferred to the broader evaluation rework; this section only requires that the safety behaviors are *observable*.)

## Non-goals and YAGNI

- No new node types for the product domain; the structure stays invariant.
- No Rasmussen layer names on the vertical axis.
- No two-tree builder/customer model; one tree with two seed sources and the existing `converge` operation.
- No git submodule yet; vendoring is sufficient until hard version-pinning is needed.
- Cross-session memory is deferred to Spec 3 by default, but its value for *engagement* is acknowledged and the default is conditioned on an observable trigger that can pull it forward (see the roadmap caveat); a within-session memory floor (callbacks + a session-summary artifact) is in scope for the workshop now — so this is not a settled non-goal.

## Open questions

- Exact file boundaries inside `core/` (how finely to split phases, signals, and the visualization contract), and — relatedly — whether the sync unit is a directory tree or individual files: today's `sync-skill-prompts.ts` operates per-file with per-file sha256 footers, so a nested `core/` + `domains/` tree changes both the sync tool's file enumeration and where the hash footer is injected.
- Memory timing now has a stated default (memory last) and an observable trigger that pulls it forward (returning-builder cohort cannot evolve a tree across sessions); the residual open question is only how *much* of the within-session memory floor (in-session callbacks + session-summary artifact) is built for the first workshop.
- The `set_focus` contract must be resolved before Spec 1 ships its core (or `set_focus` is split into its own step): its final name, parameters, and `focus_area` seeding rule, AND — per the "Initial context vs emergent purpose" section — its **mode/motion dimension** (goal / being / stabilize / refer), its **detection model** (how mode is inferred or asked, misclassification handling, user override), and its **continuous-monitoring** behavior (mid-session mode transitions). The detection model and mode taxonomy are the safety-bearing parts and were previously absent from this list; they must not remain open while `set_focus` is listed as a Spec 1 deliverable.
- Whether the product pack's opening "stage gate" is a distinct phase or a routing move inside the existing Phase 0.
- The product-domain probe patterns (the analog of `PROBE_PATTERNS.md`) are not yet drafted; only the seeds are.
- The product-pack success rubric dimensions still need hardening before the first workshop (anchored scales and a pre-registered workshop measurement plan are now drafted above; the remaining work is fixing the exact anchor wording and the agreement target).
- How the workshop's shareable artifact is produced and exported.
- Two load-bearing design claims are currently untested bets, not validated findings, and should be treated as hypotheses the first workshop tests rather than as settled premises.
  The first is "prior projects are the strongest seed source" — plausible from building Why Tree, but not yet measured against the other seeds.
  The second is "a product's high purpose usually serves the customer's purpose too" — this is the load-bearing assumption behind the one-tree/two-seed-source convergence model, and a domain where it is routinely false (pure infrastructure, regulatory-driven, or internal-tooling products) would weaken the convergence signal, so the workshop instrumentation should be able to detect non-convergence as a real and common outcome rather than an error.
- The reverse-engineer entry mode and seed #7 (the attachment/risk-branch seed) are the deepest, most exposing moves in the pack, and may be too deep for a time-boxed group workshop with peers watching; they may fit the slower one-on-one consulting context better.
  The first workshop should therefore treat reverse-engineer + seed #7 as optional/advanced rather than core, and watch whether they produce insight or defensive shallow answers in a group before committing them to the default workshop flow.
- The within-session memory floor (in-session callbacks + session-summary artifact) has a single-shot wrinkle: in a one-off workshop with no returning session, the "callbacks to prior attempts named earlier in the same session" affordance only has material to call back to if the session itself surfaced prior attempts (e.g. via seed 0a/0b), so the floor's engagement value in a true single-shot run leans mostly on the session-summary artifact rather than on cross-turn callbacks.
