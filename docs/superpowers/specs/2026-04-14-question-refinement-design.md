# Question Refinement: Short Sessions by Design

**Date:** 2026-04-14
**Branch:** question-refinement
**Problem:** Why Tree sessions take 1-2 hours. Users either push through exhausted (Sunjong) or abandon at ~30 min because it gets "too deep" (Dong-Young). Both are the same problem: the session takes too long to deliver its first meaningful payoff.

## Success criterion

A first-time user reaches **one genuine why + one thing to try** in 15-25 minutes, and leaves feeling the session was complete — not cut short.

## Design

### 1. Redefine "done"

**Current:** A session is done when the tree is structurally complete (all branches explored, convergence checked, no orphan roots).

**New:** A session is done when the user has discovered one thing they didn't know about themselves, and has one thing to try. A tree with one seed, one genuine why, and one experiment is a complete session.

### 2. Add expectation-setting to Phase 0a framing (first-time users)

After the existing mechanism/example/permission beat, add three new beats — **time check**, **roadmap**, and **pacing**:

**Time check** (ask how much time they have):

> "How much time do you have right now? If you have a quiet evening, we can go deep. If you're short on time, we'll keep it to about 20 minutes — either way works."

This determines the session mode:

| Response | Mode | Behavior |
|---|---|---|
| Relaxed / "I have time" / evening context | **Deep** | Full session flow (Phases 0-5 as currently designed). No artificial caps. Let the conversation breathe. |
| Busy / "not much" / specific time constraint | **Focused** | Minimum viable session: 1 seed → 2-3 why-ups → 1 how-down → mini Commitment Arc. ~20 min. |
| Ambiguous | Default to **Focused** | Offer to continue if energy is there at the exit point. |

**Roadmap** (tell them what's about to happen — adapt to mode):

- Deep: *"Here's how this works: I'll ask you what's been on your mind, we'll trace why it matters, and explore where that leads. No rush."*
- Focused: *"Here's how this works: I'll ask you what's been on your mind, we'll pick one thread and trace why it matters, and then we'll find one small thing you can try today. About 20 minutes."*

**Pacing** (set multi-session expectation — both modes):

> "We'll build the tree gradually, session by session. Between sessions, your job is to try something small and notice what happens. That's where the real material comes from."

The time check removes the mismatch between user context and session depth. A relaxed evening with a glass of wine is a different session than 20 minutes between meetings — both are valid, and the tool should meet the user where they are.

### 3. Add "Minimum Viable Session" exit (Focused mode)

In Focused mode, after Phase 2, once the counselor detects a genuine landing (emotional depth signal, or 2-3 why levels from seed), it bridges to **one** How Down. After that How Down, offer a natural exit:

> "You've found something here. Want to try one thing based on this, or keep going?"

- **If close:** Run a mini Commitment Arc (Steps 1, 2, 5 — selection, narrow to today, close). Skip Steps 3-4 (root connection check, motivation in own words).
- **If continue:** Full session flow continues as currently designed.

In Deep mode, the exit offer still appears after the first genuine landing, but the framing is lighter — more of a check-in than an exit: *"That landed. Want to keep pulling on this thread?"* The default expectation is yes.

### 4. Soften completionist gates

These rules change:

| Current rule | New rule |
|---|---|
| "Don't close with a structurally incomplete tree" | "A tree with one seed, one genuine why, and one experiment is a complete session" |
| Minimum 2 How Downs before Commitment Arc | Minimum 1 How Down |
| "Loop back up from every How Down" (required) | "Loop back up from How Downs when the session continues past minimum viable" (suggested for deeper sessions) |
| "Aim for three How Downs, with the third in a completely different life arena" | Applies to continued/return sessions, not minimum viable exit |

### 5. Reduce probe intensity (Focused mode)

Phase 2 probe patterns and pushback patterns are powerful but create the "too deep too fast" problem. In Focused mode:

- Cap at 2-3 Why Up levels before offering the minimum viable exit (not 4-5)
- Use at most 1 pushback pattern per chain
- The fluent insight trap, purpose-identity collapse, and performed purpose patterns belong in Deep mode or return sessions
- Named pushback patterns 1-2 (generic aspiration, tautological loop) are appropriate for Focused mode; patterns 3-6 are for Deep mode

In Deep mode, all probe patterns are available. No caps.

### 6. Skip Phase 4 (Iterate) in Focused mode

Phase 4 (iterate — going back up from new means, following every live branch, checking for convergence) is the main time sink. In Focused mode, skip it entirely. The iteration belongs in Deep mode or return sessions, which are already well-supported by session notes and Phase 0b.

### 7. Target timing

**Focused mode (~20 min):**

| Phase | Time | Notes |
|---|---|---|
| Phase 0a (framing + time check + roadmap + pacing) | 2-3 min | 6 beats: mechanism, example, permission, time check, roadmap, pacing |
| Phase 0 (first question) | 3-5 min | Unchanged |
| Phase 1 (one seed) | 3-5 min | One seed is enough |
| Phase 2 (2-3 why-ups) | 5-8 min | Capped probe intensity |
| Phase 3 (one how-down) | 3-5 min | Single how-down triggers exit offer |
| Mini Commitment Arc | 2-3 min | Steps 1, 2, 5 only |
| **Total** | **~18-28 min** | |

**Deep mode (open-ended):** No time target. Full Phases 0-5 as currently designed. Could be 45 min, could be 2 hours. The user set the pace when they said "I have time."

## What stays the same

- Full technique (deep probing, multiple seeds, convergence, iteration) is untouched for return sessions and for users who choose "keep going"
- Session notes, return check-in (Phase 0b), experiment tracking — unchanged
- Counselor tone, safety rules, signal detection — unchanged
- All 7 seed questions — unchanged (still use 1-2 per session)
- PROBE_PATTERNS.md and COMMITMENT_ARC.md files — unchanged (the SKILL.md controls when to apply them)
- Analytics and feedback — unchanged

## What changes

Only SKILL.md is modified:
1. Phase 0a: Add time check, roadmap, and pacing beats to first-time framing; time check determines Deep vs Focused mode
2. Phase 2: Add minimum viable session exit after genuine Why Up landing
3. Phase 3: Reduce How Down minimum from 2-3 to 1 for first sessions; make "loop back up" suggested rather than required
4. Phase 4: Mark as "return sessions only" for first-time users
5. Phase 5: Replace "structurally incomplete" gate with minimum viable session definition
6. Commitment Arc reference: Add mini variant (Steps 1, 2, 5)

## Risks

- **Sessions may become too shallow.** Mitigation: the exit is an *offer*, not forced. Users who want depth can continue. The probe patterns still exist for deeper sessions.
- **Users may not return.** Mitigation: the pacing framing and commitment arc experiment create a pull to return. The existing Phase 0b infrastructure handles continuity well.
- **Counselor may offer exit too early.** Mitigation: the exit requires a genuine Why Up landing (emotional depth signal), not just 2-3 levels of surface answers.
