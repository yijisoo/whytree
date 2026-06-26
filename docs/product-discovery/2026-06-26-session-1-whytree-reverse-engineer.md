# Product Discovery — Session #1: reverse-engineering whytree.io

Date: 2026-06-26
Mode: product domain pack (reverse-engineer), 1:1 dogfooding
Builder: Ji Soo Yi · Counselor: Claude (product pack)
Tree: `~/.whytree/whytree-product.json` (20 nodes)

## Vision (emergent purpose, locked)

> whytree gives people a safe space to reveal the real why beneath their habits, so they can live with meaning — in whatever form is theirs: knowing what to do, mattering to others, deep engagement, or simply being present.

## The tree

```
A. People live with meaning, not suffering meaninglessness  ·apex (Frankl/Adler bedrock)
   ├─ B. Know what to do with their lives  ·axis: direction
   │     ├─ C. Reveal the deeper motivation beneath habits (good questions)  ·seed
   │     │     └─ listening · connect-the-dots · tree-as-mirror · surface-the-gap · reflect-words-back · silence
   │     ├─ J. Goal-oriented conversation — anchor to the goal (the tree as compass)
   │     └─ K. Tiny, iterative experiments — action as a way of knowing (revealing has a ceiling)
   ├─ L. Safety & guardrails — non-judgmental, blame-free; the process protects, never harms  ·foundation
   ├─ M. Mattering to / contributing to others  ·axis: contribution
   │     └─ gather others' feedback as data to refine contribution (not a verdict on your worth)
   ├─ O. Deep engagement — gripped by real worth (Wolf)  ·axis: engagement
   │     └─ prolonged, deadline-specific goal w/ anticipated hurdles, commitment, encouragement, end-reflection
   ├─ Q. Being-mode meaning — presence, savoring, awe; honored, never pushed  ·axis: being
   │     ├─ increase the resolution of being-present / being-self (appreciative "what is it about this", not a climbing why)
   │     └─ how-down to explore more presence-giving activities
   └─ stabilize first when capacity is low — small wins before purpose (a third mode)
```

Four axes of meaning (direction, mattering, engagement, being) on one protective foundation (safety & guardrails), plus a stabilization precondition. The builder's pull (reveal the why) and the customer's need (escape meaninglessness) **converge at the apex** — the strongest signal a product can sit on.

## Product findings (the harvest)

1. **Mode/capacity detection (`set_focus`) is the central safety-and-fit mechanism — not a nicety.** It must discriminate at least four states before the session shapes its questions:
   - **goal-mode** — why-up to purpose (the current default)
   - **being-mode** — dwell, don't climb (see #2)
   - **stabilize-mode** — low capacity / distress → small concrete wins first; meaning needs a floor of capacity (milder sibling of the crisis protocol)
   - **domain** — life vs research-problem vs product vs … (the engine generalizes)
   Running goal-mode why-up on a being-mode, depleted, or grieving person is not just unhelpful — it can harm.

2. **Being-mode is a sub-mode, not a thinner session.** Same tree structure, inverted emphasis: how-down + "increase resolution of being-present," dwelling rather than climbing. There may be two whys — a *climbing* why (to purpose; cheapens presence) and an *appreciative* why-in-place ("what is it about this?"; deepens resolution). Untested assumption flagged by the builder; worth validating against real being-mode sessions.

3. **Why-up is the universal disambiguator.** The same activity (e.g. "collecting others' feedback") carries opposite meanings — contingent worth (distorting) vs data-for-contribution (authentic) — and only the revealed *why* tells which. So each axis reuses the reveal engine for discernment; no separate machinery. Validates **soft discernment over time** (never classify a motive at intake; confidence/obligation probes as gentle flags, not labels).

4. **Longer-arc supported goals.** Beyond the tiny next-day experiment: a prolonged, deadline-bound commitment with anticipated hurdles, *encouragement along the way*, and an end-of-arc reflection to glean lessons and re-adjust. "Encouragement along the way" implies **proactive between-session support** — a capability whytree.io mostly lacks today.

5. **Axis asymmetry.** whytree is deeply instrumented for *direction* (six revealing means + compass + experiments) and thin on *mattering / engagement / being*. A feature-priority direction.

6. **Versatility is a feature iff mode-detection works.** Users apply whytree to unexpected ends — finding a research problem (healthy: a *domain*, evidence the engine generalizes) and processing a breakup (risky: emotional crisis needs stabilize/witness/refer-out, not purpose-extraction; whytree is not therapy). The versatility's safety lives entirely in whether the product senses the mode and adapts.

## Candidate features (not-yet-built)

- The **`set_focus` mode-fork** (goal / being / stabilize / domain) — now reframed as a *safety* feature.
- **Surface-the-gap** (said vs done) as an explicit reflected move, not just a probe.
- A **being-mode sub-mode** (resolution + how-down; no goal-pushing).
- **Proactive between-session encouragement** for longer-arc goals.
- **Outward / engagement / being seed questions** (current seeds lean inward).
- A **stabilize-mode** path: detect low capacity → small wins.

## Implications for Spec 2 (product-pack hardening)

- The pack's stage gate should become a **mode/capacity gate**, not only idea-stage vs has-built.
- Add the appreciative-vs-climbing why distinction to the probe guidance.
- The reverse-engineer mode worked well as a dogfooding entry; the convergence read (builder ↔ customer at the apex) landed naturally.

## Next

- Session #2: reverse-engineer **kardens** (watch builder↔customer convergence; hunt a risk branch).
- Session #3: flex — cold-seed cross-check, or build out the being/stabilize modes.
- Fold findings #1–#6 into the Spec 2 plan; #1 strengthens the case to pull `set_focus` (Plan 1B) forward.
