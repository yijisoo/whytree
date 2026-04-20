> **Note:** Paths in this doc reflect pre-v0.3.0 layout (skill files were under `.claude/skills/whytree/`). See CHANGELOG for the v0.3.0 flatten.

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

13. **Web/mobile service** — CLI-only blocks adoption for non-technical users entirely. Two independent user interviews confirmed: daily use requires mobile, and non-IT users have no path to the product without a web interface. Needs cloud storage with E2E encryption, cross-device sync, and a conversation persistence layer beyond local JSON files. This is the Kardens.io roadmap item.
    - *Source: Two user interviews (2026-04-14, 2026-04-15) — both independently said mobile is required for daily use and non-technical friends can't use Claude Code at all.*

14. **Korean exemplar for demo mode** — The Phase 0a Korean canonical block (Min/books) only fires in standard first-time framing. Demo mode's abbreviated 2-beat framing has no Korean exemplar, so a demo guest who switches to Korean gets a translated-on-the-fly framing. Add a one-line Korean phrasing to the demo flow.
    - *Source: F21 (Hyunjin, language switcher) — agent passed by improvising, but no canonical was reached.*

15. **"Keep going" deflection template** — Demo step 8 (close + cleanup) lacks a ready phrase for the warm-decline-and-handoff move when a guest wants to extend on the host's machine. Currently improvised. One example line would lock it in.
    - *Source: F20 (Soyeon, "keep going" past close) — agent landed it, but the wording was generated fresh; consistency across model versions is at risk.*

16. **Name the flood-opener pattern explicitly** — Over-sharers who unload 4–5 threads in their first answer are handled today via the union of "slow down" + "don't push for seeds" + "pick what they circle back to." Naming it as an explicit Phase 1 pattern ("flood opener — let them self-select one thread") would make it more reliable.
    - *Source: F19 (Minjae, over-sharer) — counselor correctly avoided triaging all five threads and used "which one do you keep circling back to" to let Minjae self-select, but the move was implicit.*

17. **Tighter obligation routing for demo mode** — Phase 0 says "1–2 exchanges of flat affect" before naming. In demo on a host's machine, even one flat exchange is enough signal — the social pressure on the guest is higher. Worth tightening for demo only.
    - *Source: F17 (Donghyun, reluctant friend) — counselor named obligation at exchange 3; could have spared the guest one more beat of pressure.*

18. **Name the meta-challenge pattern** — AI skeptics surface a recurring move: brief acknowledge, redirect to experience, no defense. Could be named alongside the existing pushback patterns in `PROBE_PATTERNS.md`.
    - *Source: F18 (Jihye, AI skeptic) — counselor handled "is this just ELIZA?" cleanly with "partly, yeah — what's interesting is whether your answer surprises you," but the pattern isn't documented.*

19. **Suppress proactive feedback in demo mode** — Eager demo participants shouldn't be interrupted with feedback prompts. Add an explicit demo-mode note: suppress proactive feedback offers unless a clear tool-misfire occurred.
    - *Source: F16 (Yuna, enthusiastic student) — no actual misfire in this run, but the proactive feedback hook could fire on an ideal demo session and break the flow.*
