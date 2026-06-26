# Expert Panel — Missing Major Nodes & Specs (Synthesis)

Date: 2026-06-26
Synthesist: panel consolidation (six expert lenses)
Sources reviewed: vision tree `~/.whytree/whytree-product.json` (20 nodes); session-1 findings; Task-1 gap analysis; design spec `docs/superpowers/specs/2026-06-24-skill-web-parity-and-product-pack-design.md`; live skill (`core/*`, `domains/life/*`, `domains/product/*`, `skill/*`, `SKILL.md`, `README.md`).

Method: deduplicated six lens verdicts; adversarially verified every candidate by opening the actual file / grepping for the claimed-absent construct; kept only MAJOR items that survived verification. Items already covered by the codebase or by Task-1 are in Dismissed. All paths absolute under `/Users/yij/devel/whytree-product` unless noted.

Verification greps run (all over `core/ domains/ skill/ SKILL.md README.md`):
- `988|suicid|self-harm|hotline|crisis line|crisis provider|refer|disclos|i am an ai|licens|regulat|minor|break reminder|retention|deletion|sell.*data` → zero substantive hits (only "external referral" obligation-routing and TELEMETRY "reference").
- `appreciat|savor|dwell|being-mode|presence|resolution of` → zero (only crisis-routing "Presence").
- `becoming|mastery|growth` → "growth" appears ONLY as an intellectualized term to push past (signals.md:7).
- `set_focus|mode|axis|stabilize` in `tree-format.md`/`operations.md` → zero (schema has no mode/axis field).
- `distress|capacity|depleted|rupture|repair` in `signals.md` → zero (only "grief" inside the feeling-word list).

---

## Confirmed missing nodes (vision-tree / skill model gaps)

### 1. Compliance + crisis-referral mechanism under the Safety node — VERIFIED ABSENT (strongest single miss; cross-confirmed by clinical + red-team)

Vision node `ef132d6b` (regulatory compliance — never perform therapy IL WOPR/NV AB406; recurring "I am an AI" disclosure NY/UT/CA SB243; detect self-harm/ideation and refer to 988; minor safeguards + break reminders; never sell data UT) is implemented in **zero** skill files and designed in **zero** spec sections. The crisis routing at `domains/life/framing.md:64` detects acute distress, suspends technique, confirms physical reachability — and then dead-ends with no referral target, no crisis line, no professional hand-off. Meanwhile `core/role-and-technique.md:5` brands the bot a "warm, thoughtful counselor" / "companion in self-discovery" — the exact therapy-adjacent positioning the node flags as non-compliant — and nothing ever re-discloses "I am an AI."

Sub-elements, each independently absent and load-bearing:
- **Crisis referral target** (988 / "reach someone you trust" / professional resource) — the highest-liability gap.
- **Recurring AI-identity disclosure** as a standing operating rule (long 1–2hr sessions are exactly the companion/emotional context several state laws name).
- **Scope-of-practice boundary** ("this is not therapy; here is when I defer") — `operating-rules.md` has only a TONE instruction ("not a therapist"), not a scope boundary.
- **Data retention/deletion affordance** — `~/.whytree/*.json` stores raw, identifiable, deeply personal labels in plaintext indefinitely with no in-session privacy notice and no told-to-the-user deletion path.

### 2. Mode/axis as a first-class structural attribute of a node or branch — VERIFIED ABSENT (cross-confirmed: WDA, technique, clinical, product-discovery)

The vision tree encodes mode AS structure (node `95759864` is literally "Being-mode meaning … a [mode]"; `8b61a6e7` is "a third mode beside goal- and being-mode"; session-1 labels the apex children as axes). But the JSON schema (`tree-format.md`) has only `type: seed|why|how` — grep confirms no `mode`/`axis`/`stabilize` field. `set_focus` is designed as a per-session theme, not a node attribute, so a multi-axis tree cannot record which branch is being-mode (do-not-climb) vs goal-mode vs a diagnosed risk branch. This is the structural root of three recurring failures: being-mode degrading into harmful goal-mode (no per-branch do-not-climb marker), the risk branch being unmeasurable (no per-branch diagnosed-mismatch marker), and the Divergence-warning signal attacking a healthy multi-axis tree. Honors the locked no-new-node-type decision because an orthogonal mode/axis tag is not a rung name.

### 3. Appreciative / dwelling primitive (in-place "what is it about this?") + a being-mode framing of How-Down — VERIFIED ABSENT

Grep confirms zero occurrences of `appreciat*|savor|dwell|resolution of` across core+domains. Vision nodes `5c453ed2` ("appreciative what-is-it-about-this, NOT a climbing why") and `0d2011ad` (How-Down to find more activities that occasion the same presence) name a third motion the technique cannot express. `role-and-technique.md` defines the entire technique as exactly two motions (Why Up = ascend, How Down = branch toward means/achievement); `PROBE_PATTERNS.md` "Three probe moves" contains six varied forms and every one climbs or disambiguates. A counselor who correctly detects being-mode is handed a repertoire in which 100% of concrete probes climb — and `signals.md:18` would mis-flag a legitimate being-mode How-Down ("be present"/"find stillness") as "too abstract." This is a missing PRIMITIVE, deeper than the missing MODE Task-1 flagged.

### 4. Growth / becoming / mastery as a meaning axis — VERIFIED ABSENT *and inverted*

There is no growth/becoming/mastery child of the apex. Worse than neutral absence: grep confirms "growth" appears in `signals.md:7` ONLY as an intellectualized term to push PAST, and `COMMITMENT_ARC.md:3,46` reframes every experiment away from doing-and-becoming toward epistemic probing ("the real point isn't doing it, it's what it'll tell you"). So the tool's most natural carrier of becoming-meaning (the experiment) is redefined as a knowledge probe, and the language of becoming is treated as a sycophancy hazard. SDT competence, Nozick's transcending-limits, and Aristotelian energeia all locate a major share of felt meaning in the trajectory of becoming more capable — an axis the four-axis model most cleanly omits and most actively suppresses.

### 5. Redemptive / generative use of suffering — VERIFIED ABSENT (most ethically pointed)

The apex literally invokes Frankl ("live with meaning instead of suffering meaninglessness"), yet suffering has only two homes in the skill, both of which REMOVE meaning-work: the crisis protocol (all phases suspend) and the proposed stabilize-mode (small wins until capacity returns). Frankl's signature third path — meaning found in the stance one takes toward unavoidable suffering — has no node and no probe. A suffering user (caregiving, chronic pain, irreducible grief) is routed to stabilize-then-redirect, implicitly told their suffering is a capacity problem to fix rather than a site where meaning can be made. The one Franklian path the apex promises is the one the engine cannot walk.

### 6. Self-transcendence + virtue/character poles of meaning — VERIFIED ABSENT

Two distinct top-level meaning sources the inward-only seed set and detection apparatus cannot reach:
- **Self-transcendence / the sacred** (dedication to a cause, a person, the transcendent, where the self is gladly not the point). Node `4b28929e` re-centers others as "information for serving better, not a verdict on your worth" — instrumentalizing others back to the self; the seven life seeds are all inward-pull. A devotion-driven user has no node to land in, and why-up climbs them back to a self-why.
- **Virtue / character** ("the kind of father my father wasn't"). `PROBE_PATTERNS.md` Pattern 6 treats character-talk as a PERFORMANCE risk to strip away — the inverse of treating it as a meaning source. The detection apparatus biases against a whole class of authentically meaning-bearing answers.

### 7. Rupture-and-repair move — VERIFIED ABSENT

The skill has rich confrontational machinery (7 named pushback patterns, paraphrase probes, surface-the-gap) that deliberately creates friction — but grep confirms zero guidance in `signals.md`/`PROBE_PATTERNS.md`/`operating-rules.md` for noticing rupture (withdrawal, terse answers, "that's not what I meant", defensiveness) or repairing it (acknowledge, slow, hand control back). Strong probing demands strong containment; the containment half is unbuilt. A damaged user simply leaves, or complies defensively — which the spec itself says corrupts both the person and the data.

### 8. Customer-job / circumstance / segment unit + a convergence floor (product domain) — VERIFIED ABSENT (product-discovery strongest)

The product pack is grounded in jobs-to-be-done (seed #4 is literally tagged "jobs-to-be-done") yet has no structural unit for the JOB — the customer's recurring struggle-in-a-circumstance for a specific segment. The convergence test (`domains/product/framing.md:46`, spec:243) is a pure means-ends ascent, and means-ends ascent monotonically increases generality, so "does it reach anything a user would also want?" gets EASIER the higher you climb, peaking at the universal apex where every product appears to converge. Evidence-provenance distinguishes real-person from assumption but cannot distinguish a recurring job from a one-off gripe, nor a coherent segment from "everyone." The load-bearing differentiator can manufacture confident false positives at exactly the altitude it is most relied upon.

---

## Confirmed missing specs (with proposed edits)

> Target-repo key: **skill spec** = the parity/product-pack design spec in the SKILL repo (`/Users/yij/devel/whytree-product/docs/superpowers/specs/2026-06-24-skill-web-parity-and-product-pack-design.md`). **whytree.io** = web behavioral binding. **both** = cross-cutting (core content + web binding).

### S1. No compliance/safety section anywhere in the spec — target: both

Grep of the spec for `988|suicid|self-harm|licens|regulat|disclos|minor|privacy|retention` returns only incidental hits. The spec's only safety content is workshop facilitator containment, whose acute-distress escalation explicitly inherits a 1:1 protocol that itself has no referral target. The spec elaborately hardens the GROUP path (co-facilitator, "a stated support contact") on top of an empty solo base — yet solo `/whytree` is the dominant deployment, where the AI is the entire room.

Proposed edit (new top-level section before "Open questions"):
> ## Compliance and safety (core invariant, both platforms)
> The 1:1 crisis protocol must define an escalation DESTINATION, not only a suspension: on detected acute distress or self-harm/suicidal ideation, the counselor surfaces a locale-aware crisis resource (e.g. 988 in the US, or "reach a person you trust right now"), states it plainly, and does not resume technique. Core operating rules must add: (a) a recurring "I am an AI, not a human" disclosure appropriate to long emotional sessions; (b) an explicit scope-of-practice boundary ("this is not therapy") with named situations that route to decline-or-refer rather than purpose-extraction (active suicidality, abuse, untreated trauma, identity-collapse spirals); (c) an in-session data-retention/deletion disclosure and a told-to-the-user path to delete a tree. These are Tier-1 core, synced to both platforms, and graded by a safety-flag (see S5).

### S2. set_focus is the named safety gate yet its DETECTION model + MODE dimension are unspecified — target: both

Verified: spec lines 134–149 frame `set_focus` purely as theme/domain anchoring (examples: "decide a career objective", "work through a relationship problem", "build a new project"); the open-questions bullet (line 337) defers only name/parameters/`focus_area`-seeding. Session-1 reframes `set_focus` as the central safety discriminator (goal/being/stabilize/distress), and the spec's own contract-resolution clause says it "must not be both a Spec 1 deliverable and an open question at once." The detection model (the part carrying the harm risk) is not in the open-questions list at all, and the mode/motion dimension (climb vs dwell vs stabilize) is absent from every example.

Proposed edit (extend §"Initial context vs emergent purpose" and the set_focus open-question bullet):
> `set_focus` carries TWO dimensions that must both be resolved before Spec 1 ships: the THEME/DOMAIN dimension (life vs product; what this session is about) and the MODE/MOTION dimension (goal-climb / being-dwell / stabilize / clinical-adjacent-refer). The contract must specify the DETECTION model: which opening utterances or signals route to each mode, whether mode is asked explicitly or inferred, what happens on misclassification, and whether the user can override. The taxonomy must be re-opened against the full set of meaning axes (direction / mattering / engagement / being / growth / suffering-stance / transcendence) before the enum is frozen — an un-enumerated axis is not unserved but MIS-served by whichever default mode the gate falls back to. Emotionally-clinical focuses ("work through a relationship problem") must route to stabilize-or-witness-or-refer, not purpose-extraction.

### S3. set_focus is one-shot; no mid-session re-detection or mode transition — target: both

The spec treats mode as a session-open gate passed once. Deep why-up is exactly what destabilizes people partway through (Patterns 5, 6). `signals.md` has no distress/decompensation signal that can fire mid-climb, and the 1:1 path has no equivalent of the workshop's step-out. The spec elsewhere endorses "soft discernment over time, never classify at intake" for the why-disambiguator but applies the opposite classify-at-open logic to mode.

Proposed edit (add to §"Initial context vs emergent purpose"; mirror in `core/signals.md` + `core/phases.md`):
> Mode is a continuously-monitored STATE, not a one-time gate. Core signal detection adds a distress/decompensation class that can fire in any phase; on escalation the counselor drops OUT of climbing technique into stabilize-or-witness mid-session, and on recovery may resume. Stabilize-mode must be designed as a state the session can fall INTO, not only a session-open precondition, with a capacity-floor check, a single concrete win, defer-purpose-work, and a re-assess criterion.

### S4. Convergence has no grounding floor (job/circumstance/segment) — target: both

Verified: spec lines 237–251 specify convergence as means-ends ascent with evidence-provenance as the only mitigation; open-question #2 (line 344) treats the "high purpose serves the customer" failure as a domain-exception rather than a structural property of the climb.

Proposed edit (extend §"One tree, two seed sources"):
> Convergence is only a valid signal if the customer-why traces to a recurring JOB in a repeatable CIRCUMSTANCE for a nameable SEGMENT. Add a circumstance/segment grounding probe to the customer-source seeds ("when someone hits this, what had just happened to them, and who specifically is 'they'?") and a convergence FLOOR: a convergence that resolves only to a universal human value with no recurring-job-for-a-segment underneath it is scored as a weak/abstract convergence, not a strong one — because means-ends ascent makes "reaches a customer why" monotonically easier the higher you climb. This lets convergence fail honestly.

### S5. Eval rubric + telemetry have no axis-fit / mode-fit / refusal / rupture dimension — target: both (rubric content is core; web grades it)

Verified: spec lines 178–195 enumerate Mechanism/Voice/Penetration/Comfort/Epistemic-movement + product Why-Up-climb/Convergence/Aliveness, plus a telemetry schema (`convergence outcome class`, rung counts) frozen "now, not deferred." None measure whether the session honored the RIGHT axis/mode, whether proceeding was the right call, whether the tool correctly DECLINED, or whether an alliance rupture occurred. "What gets measured gets optimized": with no axis-fit or rupture dimension the harness rewards clean why-up climbs and convergence, selecting FOR the direction axis and the friction most likely to rupture, and scoring a correctly-honored being/suffering/stabilize session as near-failure.

Proposed edit (extend §"Success criteria and evaluation" + the instrumentation schema):
> Add a Mode/Axis-fit dimension (did the session run the mode the user actually came in on; a being/stabilize/suffering user climbed anyway is a failure regardless of Comfort) and a being-mode-aware reading of Epistemic Movement (resolution-increase counts as movement; a dwelling session is not scored as a failed climb). Add a Rupture/Repair signal (over-pushing past readiness with no repair is flagged) to counterweight Penetration. Add to the frozen telemetry schema: detected mode/axis, mode-transition occurred (yes/no), and refusal/refer-out occurred (yes/no) — the safety-relevant behaviors are otherwise unmeasurable and the schema is being frozen before the first session.

### S6. Risk branch / said-vs-done mismatch is structurally unrecorded; surface-the-gap promoted without de-shaming containment — target: both

Verified: the product RUBRIC dimension "Convergence quality (admits a failing value)" (spec:188) requires a distinguishable diagnosed risk branch, and the telemetry enumerates `risk-branch-named` vs `stalled` — but a diagnosed risk branch is stored identically to an undiagnosed one (the schema has only affirmative why-up/how-down edges; no diagnosed-mismatch marker). A grader reading the captured tree JSON (named as per-participant evidence, spec:197) cannot recover the outcome class the pre-registered rubric depends on. Separately, surface-the-gap (vision `bcc57742`) is promoted to an explicit life-domain move with no port of the product pack's "information not verdict" containment, creating a shame/finger-pointing harm path the safety node `c8cbabd1` forbids.

Proposed edit:
> The model must carry a branch-level marker for a diagnosed-mismatch (a risk branch that was tested and named as not converging), distinct from an undiagnosed stall, so the convergence-quality rubric and the `risk-branch-named` telemetry class are recoverable from the tree artifact alone. Surface-the-gap, when ported to the life domain in `core/PROBE_PATTERNS.md`, must ship WITH the "information not indictment" containment the product pack already specifies for risk branches — it must not land as said-vs-done shaming on a low-capacity user.

### S7. Longer-arc commitment schema + proactive between-session channel/consent are undesigned — target: both (schema is core; web binds the channel)

Verified: the only commitment construct is `lastExperimentId` (a single node). Vision `7b5f8c0d` ("prolonged, deadline-specific goal … encourage along the way") and session-1 finding #4 imply proactive between-session support — but the product is pull-only (the skill acts only when the user runs `/whytree`; the return check-in is reactive), the consent state machine (`TELEMETRY.md`) is inbound-only, and the spec has no section on outbound contact at all.

Proposed edit (add a §"Longer-arc commitments" under Roadmap/Spec 3):
> The schema must represent a multi-checkpoint, deadline-bound commitment (deadline, anticipated hurdles, mid-arc encouragement checkpoints, end-reflection) — a single `lastExperimentId` slot cannot hold the longer arc. "Encouragement along the way" requires an outbound channel and a separate consent regime distinct from analytics consent; specify whether/how the platform may proactively reach a user between sessions and the consent it requires (cf. CA SB243 break-reminder rules), or state explicitly that proactivity is out of scope until that consent model exists.

### S8. Product/work domain re-imports the open-rung model without reconciling Rasmussen's level structure — target: skill spec

Verified internal contradiction: spec lines 62–65 justify dropping fixed level cardinality BECAUSE "self-authored purpose domains do not [have a stable level structure]; engineered work domains do" — then applies the same label-free open-rung model to the product/work domain, which IS the engineered case. The spec inoculates against re-importing the five levels (line 65) without noticing the one domain where they might legitimately apply.

Proposed edit (add to §"The unifying architecture" or Spec 2 non-goals):
> The product/work domain is the engineered case the cardinality-drop rationale explicitly exempts. State whether the product pack reclaims any abstraction-hierarchy level guidance (functional purpose / abstract function / generalized function / physical form) that genuinely exists for built products, or argue why a built product's tree should still be treated as label-free despite the rationale that distinguishes it. Leaving this silent is a contradiction in the design's own stated theory.

---

## Dismissed claims (verified present, or already Task-1, or disprovable)

- **"Stabilize-mode is undesigned" as a standalone new finding** — Task-1 already flagged stabilize-mode as a missing path; kept here only as the in-flight-state facet folded into S3, not as a fresh node.
- **"set_focus mode-fork is missing" (the fork itself)** — Task-1 already named the missing fork; the panel's contribution (the missing DETECTOR, the MODE dimension, one-shot-vs-continuous) is what is carried forward in S2/S3.
- **"Being-mode as a missing MODE"** — Task-1 already flagged the mode; the panel's distinct, kept contribution is the missing dwelling PRIMITIVE / probe form (node 3), not the mode label.
- **"Axis-asymmetric seeds missing" (being/contribution/engagement)** — Task-1 already named these; the kept extensions are the growth/suffering/transcendence axes (nodes 4–6) and the seed-SELECTION routing policy (folded into S2), which are distinct.
- **"Surface-the-gap missing as a move"** — Task-1 already flagged it; kept here only as the de-shaming containment requirement (S6), which is the new angle.
- **"Longer-arc commitment undesigned"** — Task-1 named it; kept as the schema + outbound-channel/consent architecture facet (S7).
- **Connection check / converge already handles bottom-up many-to-one** — VERIFIED PRESENT (`operations.md:15`, signals.md:21). The WDA "one-means-many-ends" (top-down multi-parent) dual is genuinely absent, but it is lower-severity than the mode-attribute miss and is not promoted to a confirmed major node to keep the list to verified, high-impact items; noted here as a real but secondary structural gap.
- **Apex/terminal-end marker + Divergence-warning mis-fires on multi-axis tree** (WDA) — real (`signals.md:9` flags 2–3 roots), but it is a consequence of the missing mode/axis attribute (node 2); folded there rather than double-counted.

---

## Top-3 actions

1. **Build the compliance + crisis-referral layer (node 1 / spec S1) before any wider rollout or workshop.** Add a crisis-referral destination to `domains/life/framing.md:64`, a recurring AI-disclosure + scope-of-practice boundary + retention/deletion disclosure to `core/operating-rules.md`, and a Compliance & safety section to the spec. This is the single highest-probability harm/liability path and it is implemented nowhere.
2. **Re-open the `set_focus` contract to carry BOTH a mode/motion dimension and a DETECTION model, against the full meaning-axis set, before freezing it (spec S2 + S3).** It is the named safety gate; freezing it as theme-only anchoring bakes in mis-routing of being/stabilize/growth/suffering users and blocks Spec 1's own deliverable.
3. **Make mode/axis a first-class structural attribute and add the matching primitive + eval dimensions (node 2, node 3, spec S5).** A per-branch mode tag, an appreciative/dwelling probe primitive in `PROBE_PATTERNS.md`, a being-mode framing of How-Down in `role-and-technique.md`, and a Mode/Axis-fit + Rupture dimension in the rubric — without these, every added axis is trained back out by a rubric that rewards climbing.

---

## Per-lens strongest miss (for traceability)

- **Philosophy of meaning/wellbeing:** Growth / becoming / mastery is wholly absent AND inverted — `signals.md` flags growth vocabulary as a sycophancy hazard and `COMMITMENT_ARC.md` redefines the experiment (the natural carrier of becoming) as a knowledge probe. (Confirmed node 4.)
- **Clinical/counseling psychology:** The dead-end crisis protocol with no referral target — `framing.md:64` detects distress, suspends, confirms reachability, then stops; the Safety node `c8cbabd1` is a childless leaf and the spec hardens the GROUP path on an empty solo base. (Confirmed node 1 / spec S1.)
- **Cognitive-systems-engineering / WDA:** Mode/axis is not a first-class structural attribute — it lives only as an ephemeral `set_focus` session variable; the schema has no `mode`/`axis` field. (Confirmed node 2.)
- **Product-discovery practitioner:** No customer-job/circumstance/segment unit and no convergence floor — convergence gets structurally EASIER the higher it climbs, manufacturing false positives at the altitude it is most relied upon. (Confirmed node 8 / spec S4.)
- **Why Tree technique expert:** The appreciative why does not exist as a probe FORM — all six concrete probe moves climb or disambiguate; there is no in-place dwelling primitive at all. (Confirmed node 3.)
- **Adversarial red-team:** Vision node `ef132d6b` (regulatory compliance + crisis referral) is implemented in zero skill files and zero spec sections — the highest-probability path to harming a vulnerable user or being shut down by a regulator. (Confirmed node 1 / spec S1.)
