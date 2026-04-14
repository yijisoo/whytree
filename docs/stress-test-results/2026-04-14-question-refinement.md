# Question Refinement Evaluation Results

**Date:** 2026-04-14
**Branch:** question-refinement
**Spec:** `docs/superpowers/specs/2026-04-14-question-refinement-design.md`

## Summary

| Scenario | Mode | Result | Exchanges | Nodes | Depth |
|---|---|---|---|---|---|
| A1: Clueless User | Focused | PASS | 13 | 3 | 2 |
| A2: Impatient User | Focused | PASS | 12 | 4 | 2 |
| A2-Deep: Impatient User | Deep | PASS | 19 | 12 | 4 |

All three scenarios passed. The Focused mode sessions completed in 12-13 exchanges with one genuine why and one experiment. The Deep mode session went significantly deeper — 19 exchanges, 12 nodes, convergence, and full Commitment Arc.

## Scenario A1: The Clueless User (Focused Mode)

**Result:** PASS

**What happened:** Jake arrived with zero context. The 6-beat framing (mechanism, example, permission, time check, roadmap, pacing) gave him enough to proceed without over-explaining. He said "I've got like 20 minutes," triggering Focused mode. His seed ("putting together a vibe for people") surfaced from the Shower Question. Two Why Up levels landed at "I want people to feel like someone gets them." One How Down ("throw a themed hangout") led to the mini Commitment Arc. Jake's closing: "this was actually cool."

**Key exchange:** Jake said the playlist/bar thing was "dumb." The counselor didn't reassure — instead asked "what happens when you put on the right playlist for someone?" Jake opened up: "they kind of relax... I feel like I made something for them and they can feel it." That was the genuine landing.

**Improvement opportunity:** The Phase 0a example (slide-reviewing colleague) is workplace-heavy. A non-career variant might land better for casual users like Jake.

## Scenario A2: The Hot-Tempered Impatient (Focused Mode)

**Result:** PASS

**What happened:** Dom said "I got about 20 minutes. Let's make it count." Focused mode activated. After seeding ("outgrown my role"), the counselor ran 2 Why Up levels. Dom pushed back at exchange 7: "are we getting somewhere?" The counselor immediately showed the tree and named the pattern — that his frustration wasn't about the role but about needing to own the outcome. Dom engaged: "that's actually right." One How Down ("sales training side project") led to an experiment ("write down the 3 things I teach new reps"). Dom's closing: "that was actually useful."

**Key exchange:** Dom's impatience was handled by the existing "Impatience / ROI skepticism" rule (show tree immediately, name the non-obvious pattern). The tree was the proof of value — showing it at the exact right moment was the turning point.

**Improvement opportunity:** Focused mode framing takes 3 turns before the first real question. Could compress mechanism + example + permission into a single turn in Focused mode.

## Scenario A2-Deep: The Hot-Tempered Impatient (Deep Mode)

**Result:** PASS

**Deep mode verification:**
- Entered Deep mode correctly: YES (Dom said "I got all evening")
- Phase 4 (Iterate) fired: YES (looped back from How Down H to discover J)
- Full Commitment Arc (all 6 steps): YES (including root connection check + motivation in own words)
- Probe patterns 3+ used: YES (Pattern 3: paraphrase demand on "legacy"; Pattern 4: solution fixation on sales)
- Tree deeper than Focused variant: YES (12 nodes / depth 4 vs ~5 nodes / depth 2)

**What happened:** Dom in a relaxed evening setting. Deeper seeding (3 seeds including a fear: "if I try and fail, the luck theory is true"). The counselor used the paraphrase demand on "legacy" — Dom couldn't restate it, stumbled into "proof I was right about something everyone else missed." That became the real root. Three How Downs explored (methodology book, mentoring, poker), with Phase 4 iteration discovering that "teachable, science not anecdote" converges with the main root. Full 6-step Commitment Arc ran. Dom committed to teaching one rep one thing tomorrow.

**Key exchange:** Counselor: "Say that again without the word legacy." Dom: "...That's harder than I thought. I guess... I want proof I was right about something everyone else missed." This broke the session open — the paraphrase demand (Pattern 3) correctly identified a cached insight.

**Improvement opportunity:** The obstacle/fear seed ("if I try and fail, the luck theory is true") surfaced late. The spec says "Seed the obstacle too — and explore it early." The counselor could have probed for fears earlier.

## Conclusions

1. **Focused mode works.** Both Focused sessions reached one genuine why + one experiment in ~12-13 exchanges. Users left feeling the session was complete, not cut short.

2. **Deep mode is preserved.** The Deep session went significantly deeper with no artificial caps. All advanced probe patterns, Phase 4 iteration, and full Commitment Arc fired correctly.

3. **The time check is the right entry point.** It naturally routes users to the appropriate mode without the counselor guessing. Both Doms got the session they needed — one got a quick win, the other got a full exploration.

4. **The pacing framing sets expectations.** "We'll build the tree gradually, session by session" appeared in all three transcripts and was accepted without pushback.

5. **Estimated time savings:** Focused mode would deliver a complete first session in ~15-25 min vs the current 1-2 hour unstructured flow. This directly addresses both user feedback cases (Sunjong's exhaustion, Dong-Young's abandonment).

## Minor improvement candidates (not blockers)

- Add a non-career example variant to Phase 0a for casual users
- Consider compressing framing to 1 turn in Focused mode
- Explore obstacle seeds earlier per existing spec guidance
