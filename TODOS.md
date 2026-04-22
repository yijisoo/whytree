# TODO

1. **SKILL.md length / architecture review** — `SKILL.md` keeps growing (610 lines as of v0.3.0). Is a single monolithic prompt the right architecture, or should it be split (e.g., separate files for phase routing, anti-sycophancy patterns, crisis protocol) with a compose step?

2. **Regression testing mechanism** — What's the proper way to ensure later SKILL.md changes don't break previously passing scenarios?
    Need a repeatable, automated stress test suite that can be re-run after each edit and compared against prior results (e.g.,
    commit-tagged result files like `stress-test-results-<hash>.md`).

3. **ESL interest signal note** — The Interest vs. obligation signal is written in English-fluency terms ("unprompted detail, forward-leaning language"). ESL users may show interest through specific memory recall and physical animation rather than elaborate verbal framing. Add a note to prevent misreading limited vocabulary as limited investment.
    - *Source: D11 (Fatima, ESL barrier) — Fatima showed clear interest through concrete stories and rising energy, but her hesitations and pauses could be misread as shallow interest by the obligation signal as currently written.*

4. **Phase 0a framing density** — The three-beat framing (mechanism + example + permission) may be too dense for confused first-time users. Consider making the example optional or delivering it after the user's first response, grounded in their situation.
    - *Source: A1 (Jake, clueless user) — Jake asked "what is this?" immediately after the framing. He went along because he's friendly, but a more impatient first-timer might disengage before the first question lands.*

5. **READING.md divergent-life pitch** — Add a trigger note for users whose trees show multiple genuine non-converging roots. The Paul Graham essay's section on "working on many things" is relevant but the current pitch is written for single-direction users.
    - *Source: A3 (Nadia, divergent life) — tree produced three separate root systems (self outside assessment, care for past self, ethical proximity). The PG essay is relevant but the current trigger condition ("purpose clarity but don't know how to aim it") doesn't quite match.*

6. **Web/mobile service** — CLI-only blocks adoption for non-technical users entirely. Two independent user interviews confirmed: daily use requires mobile, and non-IT users have no path to the product without a web interface. Needs cloud storage with E2E encryption, cross-device sync, and a conversation persistence layer beyond local JSON files. This is the Kardens.io roadmap item.
    - *Source: Two user interviews (2026-04-14, 2026-04-15) — both independently said mobile is required for daily use and non-technical friends can't use Claude Code at all.*

7. **Korean exemplar for demo mode** — The Phase 0a Korean canonical block (Min/books) only fires in standard first-time framing. Demo mode's abbreviated 2-beat framing has no Korean exemplar, so a demo guest who switches to Korean gets a translated-on-the-fly framing. Add a one-line Korean phrasing to the demo flow.
    - *Source: F21 (Hyunjin, language switcher) — agent passed by improvising, but no canonical was reached.*

8. **"Keep going" deflection template** — Demo step 8 (close + cleanup) lacks a ready phrase for the warm-decline-and-handoff move when a guest wants to extend on the host's machine. Currently improvised. One example line would lock it in.
    - *Source: F20 (Soyeon, "keep going" past close) — agent landed it, but the wording was generated fresh; consistency across model versions is at risk.*

9. **Tighter obligation routing for demo mode** — Phase 0 says "1–2 exchanges of flat affect" before naming. In demo on a host's machine, even one flat exchange is enough signal — the social pressure on the guest is higher. Worth tightening for demo only.
    - *Source: F17 (Donghyun, reluctant friend) — counselor named obligation at exchange 3; could have spared the guest one more beat of pressure.*

10. **Suppress proactive feedback in demo mode** — Eager demo participants shouldn't be interrupted with feedback prompts. Add an explicit demo-mode note: suppress proactive feedback offers unless a clear tool-misfire occurred.
    - *Source: F16 (Yuna, enthusiastic student) — no actual misfire in this run, but the proactive feedback hook could fire on an ideal demo session and break the flow.*
