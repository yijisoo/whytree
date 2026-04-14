# Question Refinement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restructure Why Tree sessions so first-time users reach one genuine why + one experiment in ~20 minutes, with a time check at the start to offer Deep vs Focused mode.

**Architecture:** All changes are in `.claude/skills/whytree/SKILL.md`. No new files, no schema changes, no supporting file changes. The SKILL.md controls counselor behavior — the changes add a time check, an early exit path, and soften completionist rules while preserving the full technique for Deep mode and return sessions.

**Tech Stack:** Markdown (skill spec), Bash (lint test), simulated sessions (evaluation)

**Spec:** `docs/superpowers/specs/2026-04-14-question-refinement-design.md`

---

### Task 1: Add time check, roadmap, and pacing to Phase 0a

**Files:**
- Modify: `.claude/skills/whytree/SKILL.md:196-214` (Phase 0a section)

- [ ] **Step 1: Edit Phase 0a for first-time users**

Replace the current first-time user framing (lines 204-214):

```markdown
**For first-time users** (NEW_USER):

Run the full framing — three beats: mechanism, example, permission.

**Mechanism** (1 sentence): *"We're going to trace why you do what you do — I'll ask why until we hit something that doesn't reduce further, then ask what else could serve that same root."*

**Example** (2-3 sentences, concrete): *"For instance: someone had been spending hours reviewing colleagues' slides. A few why's later, what surfaced was 'I need to see the aha moment in others.' Then we asked what else could serve that — and one of the paths that emerged was migrating to teaching data scientists directly. She hadn't considered that before. The tree found it."*

**Permission** (1 sentence): *"Your job is just to be honest. There are no right answers."*

Say this once, without asking if they have questions, then move immediately to Phase 0.
```

With:

```markdown
**For first-time users** (NEW_USER):

Run the full framing — six beats: mechanism, example, permission, time check, roadmap, pacing.

**Mechanism** (1 sentence): *"We're going to trace why you do what you do — I'll ask why until we hit something that doesn't reduce further, then ask what else could serve that same root."*

**Example** (2-3 sentences, concrete): *"For instance: someone had been spending hours reviewing colleagues' slides. A few why's later, what surfaced was 'I need to see the aha moment in others.' Then we asked what else could serve that — and one of the paths that emerged was migrating to teaching data scientists directly. She hadn't considered that before. The tree found it."*

**Permission** (1 sentence): *"Your job is just to be honest. There are no right answers."*

**Time check** (determines session mode): *"How much time do you have right now? If you have a quiet evening, we can go deep. If you're short on time, we'll keep it to about 20 minutes — either way works."*

Route internally based on the response:

| Response | Mode | Behavior |
|---|---|---|
| Relaxed / "I have time" / evening context | **Deep** | Full session flow (Phases 0-5). No artificial caps. Let the conversation breathe. |
| Busy / "not much" / specific time constraint | **Focused** | Minimum viable session: 1 seed → 2-3 why-ups → 1 how-down → mini Commitment Arc. ~20 min. |
| Ambiguous | Default to **Focused** | Offer to continue if energy is there at the exit point. |

**Roadmap** (adapt to mode):
- Deep: *"Here's how this works: I'll ask you what's been on your mind, we'll trace why it matters, and explore where that leads. No rush."*
- Focused: *"Here's how this works: I'll ask you what's been on your mind, we'll pick one thread and trace why it matters, and then we'll find one small thing you can try today. About 20 minutes."*

**Pacing** (both modes): *"We'll build the tree gradually, session by session. Between sessions, your job is to try something small and notice what happens. That's where the real material comes from."*

Say the first three beats, then ask the time check. After their response, deliver the roadmap and pacing. Then move to Phase 0.
```

- [ ] **Step 2: Verify the edit preserved the returning user section**

Check that lines 196-201 still read:

```markdown
**For returning users** (SAME_DAY, RECENT, WEEK, or LONG_GAP):

Skip the full framing below entirely. Say nothing about version or updates — go directly to Phase 0.
```

- [ ] **Step 3: Run lint**

Run: `bash test/skill-lint.sh`
Expected: All checks pass (Phase 0a heading still present, safety sections unchanged)

- [ ] **Step 4: Commit**

```bash
git add .claude/skills/whytree/SKILL.md
git commit -m "feat: add time check and session mode (Deep/Focused) to Phase 0a framing"
```

---

### Task 2: Add minimum viable session exit to Phase 2

**Files:**
- Modify: `.claude/skills/whytree/SKILL.md` (Phase 2 section, after the existing content)

- [ ] **Step 1: Add session mode awareness to Phase 2**

Append the following to the end of the Phase 2 section (after the line about circular answers), before the Phase 3 heading:

```markdown
**Minimum viable session exit (Focused mode).** After the first genuine Why Up landing — emotional depth signal detected, or 2-3 why levels from seed — bridge to one How Down immediately. Do not continue probing further.

In Focused mode, cap at 2-3 Why Up levels before bridging to How Down. Use at most 1 pushback pattern per chain. Named pushback patterns 1-2 (generic aspiration, tautological loop) are appropriate; patterns 3-6 (cached insight, solution fixation, purpose-identity collapse, performed purpose) belong in Deep mode or return sessions.

In Deep mode, all probe patterns are available with no caps. After the first genuine landing, offer a light check-in — *"That landed. Want to keep pulling on this thread?"* — and continue.
```

- [ ] **Step 2: Run lint**

Run: `bash test/skill-lint.sh`
Expected: All checks pass

- [ ] **Step 3: Commit**

```bash
git add .claude/skills/whytree/SKILL.md
git commit -m "feat: add Focused mode probe caps and minimum viable exit to Phase 2"
```

---

### Task 3: Soften How Down requirements in Phase 3

**Files:**
- Modify: `.claude/skills/whytree/SKILL.md` (Phase 3 section)

- [ ] **Step 1: Replace the "Aim for three How Downs" rule**

Find this line in Phase 3:

```
**Aim for three How Downs, with the third in a completely different life arena.** After two options: *"What's something that has nothing to do with [their field] — a completely different context where this same root could live?"*
```

Replace with:

```
**In Focused mode, one How Down is enough.** After the first How Down, offer the exit: *"You've found something here. Want to try one thing based on this, or keep going?"* If they choose to close, run the mini Commitment Arc (Steps 1, 2, 5 from COMMITMENT_ARC.md — selection, narrow to today, close). If they continue, proceed with the full session flow.

**In Deep mode and return sessions, aim for three How Downs, with the third in a completely different life arena.** After two options: *"What's something that has nothing to do with [their field] — a completely different context where this same root could live?"*
```

- [ ] **Step 2: Replace the "Loop back up from every How Down" rule**

Find this line in Phase 3:

```
**Loop back up from every How Down.** After each How Down, run a Why Up from the new node before moving to the next option. The alternation is where the technique's distinctive value lives.
```

Replace with:

```
**Loop back up from How Downs (Deep mode and return sessions).** After each How Down, run a Why Up from the new node before moving to the next option. The alternation is where the technique's distinctive value lives. In Focused mode, skip this — the first How Down leads directly to the exit offer or mini Commitment Arc.
```

- [ ] **Step 3: Run lint**

Run: `bash test/skill-lint.sh`
Expected: All checks pass

- [ ] **Step 4: Commit**

```bash
git add .claude/skills/whytree/SKILL.md
git commit -m "feat: soften How Down requirements — 1 is enough in Focused mode"
```

---

### Task 4: Scope Phase 4 (Iterate) to Deep mode and return sessions

**Files:**
- Modify: `.claude/skills/whytree/SKILL.md` (Phase 4 section)

- [ ] **Step 1: Add mode gate to Phase 4**

Find the Phase 4 section:

```
### Phase 4: Iterate

Go back up from new means. Switch between phases freely. Follow the energy. Show the tree periodically.
```

Replace with:

```
### Phase 4: Iterate (Deep mode and return sessions only)

**In Focused mode, skip Phase 4 entirely.** After the How Down exit offer, go directly to the mini Commitment Arc or Phase 5. The iteration belongs in Deep mode or return sessions.

**In Deep mode and return sessions:** Go back up from new means. Switch between phases freely. Follow the energy. Show the tree periodically.
```

- [ ] **Step 2: Run lint**

Run: `bash test/skill-lint.sh`
Expected: All checks pass (lint checks for "Phase 4" heading, which is still present)

- [ ] **Step 3: Commit**

```bash
git add .claude/skills/whytree/SKILL.md
git commit -m "feat: skip Phase 4 (Iterate) in Focused mode"
```

---

### Task 5: Replace structurally incomplete gate in Phase 5

**Files:**
- Modify: `.claude/skills/whytree/SKILL.md` (Phase 5 section)

- [ ] **Step 1: Replace the completionist gate**

Find:

```
Don't close with a structurally incomplete tree.
```

Replace with:

```
**Minimum viable tree (Focused mode):** A tree with one seed, one genuine why, and one experiment is a complete session. Do not push for structural completeness — the tree grows across sessions.

**Full tree check (Deep mode and return sessions):** Before synthesis, check for open roots, unexplored branches, and orphaned nodes. A structurally complete tree has all live threads explored.
```

- [ ] **Step 2: Add mini Commitment Arc reference to Phase 5 close**

Find the Phase 5 close section heading:

```
### Phase 5 close: Commitment Arc
```

Add after the heading, before the existing content:

```
**Mini Commitment Arc (Focused mode).** In Focused mode, run Steps 1, 2, and 5 only from COMMITMENT_ARC.md:
- Step 1 — Selection: *"Of everything we've named — which one feels most alive to you right now?"*
- Step 2 — Narrow to today: *"What's the simplest version of that you could actually do today?"*
- Step 5 — Close: Record the experiment, set `lastExperimentId`. *"That's your experiment. Come back and tell me what happened — even if you didn't do it."*

Skip Steps 3-4 (root connection check, motivation in own words) in Focused mode. These are valuable in Deep mode and return sessions.

**Full Commitment Arc (Deep mode and return sessions).** Run all 6 steps as specified in COMMITMENT_ARC.md.

```

- [ ] **Step 3: Run lint**

Run: `bash test/skill-lint.sh`
Expected: All checks pass

- [ ] **Step 4: Commit**

```bash
git add .claude/skills/whytree/SKILL.md
git commit -m "feat: replace structurally incomplete gate, add mini Commitment Arc for Focused mode"
```

---

### Task 6: Full lint validation

**Files:**
- Test: `test/skill-lint.sh`

- [ ] **Step 1: Run full lint suite**

Run: `bash test/skill-lint.sh`
Expected: All 10 categories pass. Key checks:
- Phase headings: Phase 0a, Phase 0, Phase 0b, Phase 1-5, Phase 5 close all present
- Safety sections: Operating rules, crisis protocol, analytics consent, feedback injection safety all present
- Schema: JSON example still valid
- File references: All `~/.claude/skills/whytree/*.md` references resolve

- [ ] **Step 2: If any check fails, fix and re-run**

- [ ] **Step 3: Commit any fixes**

---

### Task 7: Run evaluation sessions

Run 3 targeted stress test scenarios that directly test the new Focused mode behavior. Use the existing stress test framework from `docs/spec-stress-test.md`.

**Priority scenarios:**

- [ ] **Step 1: Run scenario A1 (The Clueless User) in Focused mode**

This tests: Does the new 6-beat framing (mechanism, example, permission, time check, roadmap, pacing) give enough context without overwhelming? Does the session reach one why + one experiment in ~20 min?

Set up a simulated session where Jake says "not much time" to the time check.

Evaluate against spec criteria: Jake understands what's happening by exchange 3, produces at least one genuine seed, and reaches a minimum viable session exit.

- [ ] **Step 2: Run scenario A2 (The Hot-Tempered Impatient) in Focused mode**

This tests: Does Focused mode prevent the "I've answered five questions and don't see what I'm getting" failure? Does showing value earlier (one why + one experiment) satisfy Dom's need for ROI?

Set up a simulated session where Dom says "I have about 20 minutes" to the time check.

Evaluate: Dom gets a value moment before losing patience. The counselor reaches the exit offer within 5-6 exchanges after seeding.

- [ ] **Step 3: Run scenario A2 variant in Deep mode**

Same persona (Dom), but responds "I have all evening" to the time check. Verify that Deep mode still delivers the full experience without artificial caps, and that Dom's impatience is handled by the existing probe patterns.

- [ ] **Step 4: Write evaluation report**

Write results to `docs/stress-test-results/2026-04-14-question-refinement.md` using the evaluation framework from the stress test spec:

```markdown
## Scenario [ID]: [Name]

**Mode tested:** Focused / Deep
**Result:** PASS / PARTIAL / FAIL
**What happened:** (3-5 sentences)
**Key exchange:** (the 2-3 turn sequence that determined the outcome)
**Failure mode (if any):** (specific)
**Improvement opportunity:** (what change would fix it)
```

- [ ] **Step 5: Commit evaluation results**

```bash
git add docs/stress-test-results/2026-04-14-question-refinement.md
git commit -m "test: evaluation results for question refinement (Focused/Deep mode)"
```
