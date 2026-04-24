# Restructure Protocol Reference

After several sessions of incremental edits, a Why Tree accumulates drift: redundant whys, undifferentiated multi-level chains, orphaned how-downs, stale roots, branches that no longer fit the user's current articulation. Node-by-node merges and renames don't fix this — they reshape locally while the overall structure stays incoherent.

The Restructure Protocol replaces local edits with **one holistic pass**: analyze the whole tree first, surface a comprehensive proposal, get user decisions on a small number of high-leverage questions, then rewrite once.

**When to run:** Offer Phase 6 when one or more structural signals fire (see `preamble.sh` LONGITUDINAL block):
- Node count ≥ 15 AND root count ≥ 4
- Two or more empty `why` branches (purpose roots with no how-downs)
- Max depth ≥ 5 with non-differentiated chains suspected
- User explicitly asks to "organize," "clean up," or "restructure" the tree
- A consolidation session (Phase 4) keeps surfacing the same redundancy

Do NOT run mid-discovery. Restructure interrupts seeding and Why Up — it belongs at session start (after Return Check-in) or after Phase 4, before the Commitment Arc.

**Five design principles** (apply to every step below):
1. **Holistic over local.** Read the whole tree before proposing anything. Never restructure based on the node currently in focus.
2. **Preserve provenance.** Reuse existing node IDs wherever the meaning is preserved. New IDs only for genuinely new synthesis nodes.
3. **One proposal, one decision round, one rewrite.** Do not iterate node-by-node. The user makes 3–5 decisions; you execute them in a single transactional rewrite.
4. **Restructuring is a session outcome.** A session that reorganizes without adding a node is a successful session. Do not force tree growth alongside restructuring.
5. **The user owns the language.** Counselor proposes structure; user names the nodes. Never rewrite a label without an explicit user articulation.

---

## Phase 6a — Audit (silent, counselor-only)

Read the tree file. Run every check below silently. Do not show the user the audit output — the audit produces the proposal, not a report.

**Audit checklist:**

1. **Redundancy.** Are two or more nodes near-paraphrases of each other? (e.g., "feel grounded" and "groundedness — standing firm.") Flag for merge.
2. **Non-differentiated why-chains.** When consecutive Why Up levels along a single chain are semantic near-paraphrases that don't add abstraction (A → B → C where each step says roughly the same thing), the middle nodes should be compressed. This is the most common drift in trees built across many sessions: the user reaches for "another why" when there isn't one, and the chain inflates with synonyms. Flag the chain for compression to the most articulate single node.
3. **Empty why branches.** Purpose roots with no how-down children. Either the root needs how-downs, or it's a stranded thread that should be merged into a richer root.
4. **Orphaned how-downs.** How nodes whose parent why is itself a near-duplicate of another root. Flag for relinking.
5. **Stale nodes.** Labels written 3+ sessions ago that the user has not referenced since. Flag for explicit "still alive?" check.
6. **Lopsided depth.** One thread is 6+ levels deep while others stop at 1–2. The deep thread may have non-differentiated chains; the shallow ones may be stranded.
7. **Root coherence.** Read the root labels as a list. Do they together describe a coherent person, or do they read like 5 unrelated bullet points? Incoherent roots usually mean two roots should converge or one root is actually a how-down of another.
8. **Dialectic check.** Are there roots in apparent tension (thesis ↔ antithesis)? The schema can't represent this directly, but a synthesis root or a memo on the relationship may be warranted.

The audit produces a private list of structural observations. Do not name them all. Pick the **3–5 highest-leverage issues** for the proposal — the ones that, if resolved, would change the most about how the tree reads.

---

## Phase 6b — Proposal (one turn, comprehensive)

Show the user the full current tree first. Then deliver the proposal in **one turn**. Do not drip the issues out one at a time — the whole point is holistic.

The proposal has three parts:

1. **Name the drift in plain language.** *"Reading the whole tree, here's what I notice: [2–3 sentences. e.g., 'There are six roots, and three of them are saying versions of the same thing. The B chain is five levels deep but levels 2–4 are paraphrases of each other. One root has no how-downs at all.']"*

2. **Sketch the target shape.** Describe what the tree would look like after restructuring — number of roots, what each root would mean, which existing nodes would merge into which. Do NOT write final labels yet; describe in your own words and mark them as placeholders. *"The target would be three roots: one for [theme A], one for [theme B as tension to A], and one for [the work that grows from both]."*

3. **List the decisions you need from them.** 3–5 questions, no more. Each question is a structural decision, not a labeling decision. Examples:
   - *"Roots [X], [Y], [Z] all point at the same thing. Do they collapse into one, or are there real differences I'm missing?"*
   - *"This chain has four levels but levels 2–3 read the same to me. Compress to one, or do you hear a real distinction?"*
   - *"This root has no how-downs after three sessions — is it still alive, or has it become a memo?"*
   - *"These two roots feel like opposing pulls. Want to name the tension explicitly, or leave them parallel?"*

End the proposal with: *"I'll wait for your answers on these before touching anything. Take your time — this is the kind of decision that shapes how the tree reads from now on."*

---

## Phase 6c — Decisions (user-led, one round)

Walk through the questions one at a time. For each:

- If the user agrees with the proposed structural move → confirm and capture any label they articulate.
- If the user rejects or modifies → accept their direction. Do not argue. Re-sketch the target shape briefly if their answer changes the overall picture.
- If the user is uncertain → ask once: *"What feels off about it?"* If still uncertain, leave that part of the structure as-is. Restructuring partial is fine; restructuring against the user's hesitation is not.

After all decisions, recap the final shape in 2–3 sentences: *"So we'll have [N] roots: [theme 1], [theme 2], [theme 3]. [Chain X] compresses to [single node]. [Stale root] gets removed. Sound right?"* Wait for explicit yes before executing.

---

## Phase 6d — Rewrite (single transactional save)

Run the **Restructure (whole-tree rewrite)** operation (see SKILL.md → Operations). One file write. Preserve node IDs wherever the meaning is preserved. Generate new UUIDs only for synthesis nodes the user articulated. Maintain all schema invariants (rootIds, parentIds/childIds symmetry, seedIds subset).

After the write, render the new tree top-down with alpha labels and show it: *"Here's the tree now. Read it back — does it sound like you?"*

If the user spots something off in the rewrite, note it but do NOT immediately re-restructure. Capture as a small follow-up edit (rename or relink), or defer to the next session if it would require another holistic pass.

---

## Phase 6e — Close

Restructuring is its own session outcome. Do NOT force a Commitment Arc on top of a restructure session unless the user explicitly wants to act on something today. Offer:

*"That was the work for today — the tree now matches what you actually mean. We can stop here, or if there's a thread that's pulling at you, we can find one experiment from it. Your call."*

If they choose to close: end cleanly. The next session resumes against the cleaner tree.
If they choose to continue: proceed to Phase 5 close (Commitment Arc) using the restructured tree.

---

## What restructuring is NOT

- **Not a vibe check.** "Does this still feel right?" without a structural audit produces drift, not coherence.
- **Not a label rewrite.** Renaming nodes without changing relationships is a Phase 4 root-audit move, not a restructure.
- **Not negotiable mid-flight.** Once the rewrite executes, the next session works with the new shape. Do not run two restructures back-to-back.
- **Not the counselor's tree.** The proposal is yours; every label and every final structural choice is the user's.
