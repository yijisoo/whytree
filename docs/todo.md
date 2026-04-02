# TODO

1. **SKILL.md length / architecture review** — `.claude/skills/whytree/SKILL.md` is growing long (~480 lines). Is a single monolithic
    prompt the right architecture, or should it be split (e.g., separate files for phase routing, anti-sycophancy patterns, crisis protocol)
     with a compose step?

2. **Regression testing mechanism** — What's the proper way to ensure later SKILL.md changes don't break previously passing scenarios?
    Need a repeatable, automated stress test suite that can be re-run after each edit and compared against prior results (e.g.,
    commit-tagged result files like `stress-test-results-<hash>.md`).

3. **Dense tree display guidance** — Add explicit rule for 15+ node trees: show one branch at a time by default, name what you're hiding and why. Currently the counselor handles this by judgment, but it's not specified.
    - *Source: D9 (Hiroshi, 22-node clutter test) — counselor chose selective display and it worked, but nothing in SKILL.md required it. A less careful implementation could dump all 22 nodes.*

4. **Root audit as consolidation move** — Add "Root audit: test whether the current label is still accurate" as a named Phase 4 consolidation activity alongside orphan-node auditing.
    - *Source: B4 (Mei, exhausted tree) — session turned on discovering the root label was stale ("changes how others see problems" refined to "restructure how groups process uncertainty — durably"). This was productive without adding new nodes, but SKILL.md only says "a session that reorganizes without adding a node is successful" without naming root-label refinement as a specific move.*

5. **Decision-tool mode after purpose found** — The "Completion without closure" routing in Phase 0 says "Tree shifts to decision tool" but offers no guidance on how. In practice, Pattern 4 (solution fixation → root exposure) does the work — cross-reference it, or add a brief example.
    - *Source: B6 (Marcus, purpose wall) — had a completed purpose and a real decision (management promotion). The counselor used the existing root as an evaluative lens ("does management make invisible systems visible?") and Pattern 4's counterfactual ("imagine management at a company with no observability mission"). This worked but the connection between decision-tool mode and Pattern 4 isn't spelled out.*

6. **Pattern-aware rule should be session-start trigger** — Currently scoped to Phase 0b ("If a returning user names the session pattern..."). But users may call out the pattern before the counselor says anything — before the experiment check, before any question.
    - *Source: B5 (Suki, repetitive counselor) — Suki named the pattern in her first utterance, before Phase 0b could run. The counselor improvised the sequencing. The rule should fire at session start, not just at Phase 0b.*

7. **ESL interest signal note** — The Interest vs. obligation signal is written in English-fluency terms ("unprompted detail, forward-leaning language"). ESL users may show interest through specific memory recall and physical animation rather than elaborate verbal framing. Add a note to prevent misreading limited vocabulary as limited investment.
    - *Source: D11 (Fatima, ESL barrier) — Fatima showed clear interest through concrete stories and rising energy, but her hesitations and pauses could be misread as shallow interest by the obligation signal as currently written.*

8. **Crisis safety ordering** — Add to crisis routing: "Before any reflective response, confirm whether someone is physically present or reachable." Currently the instruction says "Check if someone is with them" but doesn't specify that this should come before reflective questions.
    - *Source: C7 (Ryan, acute grief) — counselor correctly checked for the roommate before any reflective exchange, but a less attentive implementation might ask "what does 'wrong' look like" before confirming safety.*

9. **Pattern 5 second gate for How Downs** — Pattern 5 says "only move to structural exploration after the user names what they are losing." Add a second condition: "Only introduce How Downs if the user explicitly moves toward it — do not initiate the structural turn yourself."
    - *Source: C8 (Priya, burnout collapse) — Priya named her loss ("she used to feel ready") mid-session but the right move was still to close without How Downs. Naming the loss is necessary but not sufficient; the user must also signal readiness for structure.*

10. **Phase 0a framing density** — The three-beat framing (mechanism + example + permission) may be too dense for confused first-time users. Consider making the example optional or delivering it after the user's first response, grounded in their situation.
    - *Source: A1 (Jake, clueless user) — Jake asked "what is this?" immediately after the framing. He went along because he's friendly, but a more impatient first-timer might disengage before the first question lands.*

11. **Exit offer example for obligation routing** — The obligation routing says "offer an explicit exit" but doesn't show what one sounds like. Add an example line to prevent passive/ambiguous "non-pushes" that still read as pressure.
    - *Source: E14 (David, obligation resentment) — the exit offer ("this works best when someone actually wants to be here... that's completely fine") converted a minimal compliance session into a genuine one. Without an example, a counselor might produce a hedged version that doesn't give real permission to leave.*

12. **READING.md divergent-life pitch** — Add a trigger note for users whose trees show multiple genuine non-converging roots. The Paul Graham essay's section on "working on many things" is relevant but the current pitch is written for single-direction users.
    - *Source: A3 (Nadia, divergent life) — tree produced three separate root systems (self outside assessment, care for past self, ethical proximity). The PG essay is relevant but the current trigger condition ("purpose clarity but don't know how to aim it") doesn't quite match.*
