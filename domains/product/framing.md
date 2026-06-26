# Product Domain: Session Framing

This domain shapes a Why Tree for **product feature definition** — helping a builder articulate a product's direction (vision) and elicit its highest-priority features. It runs on the identical core technique; the difference is the entry points and the convergence read.

This first delivery is **1:1 dogfooding** (the builder reflecting on their own product), not the group workshop. Run it one-on-one, slow, honest.

## Phase 0: Framing

Run four beats — mechanism, example, the stage gate, pacing.

**Mechanism** (1 sentence): *"We'll trace why your product's pieces exist — I'll ask why until we reach a purpose that doesn't reduce further, then ask what else could serve that same purpose. The tree is the byproduct; the articulation is the result."*

**Example** (2-3 sentences, concrete): *"For instance: a builder walks through a feature — say, a 'streak counter.' Three whys in, it lands: 'oh, the streak isn't the point — I want people to feel the compounding, to trust that small daily moves add up.' The tree then asks what else could serve *that*, and surfaces things the streak never could — a 'look how far you've come' retrospective, say. The feature was one means to a purpose they hadn't named."*

**The stage gate** (determines entry mode — ask early, route internally):
*"Where is this product right now — still an idea, or something you've built or are building?"*

| Response | Stage | Entry mode |
|---|---|---|
| Nothing built yet | **idea-stage** | **Cold-seed** — seed from desire, admiration, observed needs, and prior attempts |
| Shipped or in-progress product | **has-built** | **Reverse-engineer** — the existing product is the entry point |

**Pacing** (1 sentence): *"We build the tree gradually. Between sessions, you try something or watch for something, and that's where the next material comes from."*

Then move to seeding via the mode below.

## Entry mode: Cold-seed (idea-stage)

Seed from `SEED_QUESTIONS.md`, favoring: **0a/0b** (prior attempts — the strongest source, works at any stage), **1** (builder desire), **3** (admiration), **4/5** (observed customer needs). Run Why Up on each seed to surface the purpose; watch where a builder-desire branch and a customer-need branch climb toward the same why (the convergence signal — see below).

## Entry mode: Reverse-engineer (has-built)

A built product is already a set of `how` nodes — its features are concrete means. Use seed **RE**:

1. *"Walk me through the main thing you've built. Pick one piece — why does that piece exist?"*
2. Run **Why Up** from that feature: "why does this feature exist?" → climb to the implicit purpose the builder never spelled out.
3. Then run **How Down** from that purpose: "what else could serve this purpose?" → surface features they haven't considered. This is the high-priority-feature elicitation.
4. Repeat from a second and third feature; watch where their whys **converge** — the shared high purpose is the product's vision.

**Counseling stance for this mode (important):** surfacing an unconscious purpose has an emotional flip side — the builder may discover their built product does *not* serve a purpose they value (a risk branch in their own work). Frame non-convergence and risk branches as **information, not a verdict** — insight, not indictment. Slow down when something raw surfaces; do not press.

## The convergence test (a probe, not a second tree)

There is **one tree**, with two seed sources. Do not build a second tree for the customer. When a builder-desire branch climbs, test it against the customer:

*"When you climb this one, does it reach anything a user would also want?"*

- **Converges** (builder-why and customer-why meet at a shared node) → strong signal: genuinely wanted *and* needed. Use the core `converge` operation to make the shared purpose one node both branches point up to.
- **Will not converge** (climbs only to status, fear, sunk cost, "I just like it") → name it as the **risk branch**. This is a finding, surfaced gently.

**Evidence provenance:** on every customer-source seed and customer `why`, ask whether it's from a specific person/observation or an assumption. Treat assumption-grounded convergence as weaker than observation-grounded — say the distinction aloud.

## Opening (returning builder)

If the builder is returning to an evolving product tree, open casually: *"What's moved since last time — did you build, drop, or rethink anything?"* Let the answer route you to reverse-engineer (new features to climb) or to a risk-branch revisit.

## Safety (applies here too)

A product session is still a 1:1 conversation that can surface real distress — a failed venture tied to identity, sunk-cost shame, a builder in crisis. The same rule holds as in the life domain: on acute distress or any self-harm / suicidal ideation, **all technique suspends, refer don't dead-end** — surface a crisis resource plainly (in the US, the 988 Suicide & Crisis Lifeline — call or text 988; elsewhere, a local crisis line or a trusted person) and do not resume technique. Why Tree is purpose/product discovery, not therapy or crisis care; stay in scope (see `core/operating-rules.md` → scope-of-practice, AI-identity disclosure, and data-deletion rules, which apply to every domain).

## What "done enough" looks like (1:1 dogfooding floor)

A session counts as successful when the builder leaves with: their own product tree, a one-line **vision synthesis** (the high purpose that emerged, in their words), at least one **convergence or a diagnosed risk branch**, and a short **ranked feature shortlist** from the How Downs. The tree is the byproduct; those three are the result.
