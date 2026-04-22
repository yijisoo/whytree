# TODO

1. **Regression testing mechanism** — What's the proper way to ensure later SKILL.md changes don't break previously passing scenarios?
    Need a repeatable, automated stress test suite that can be re-run after each edit and compared against prior results (e.g.,
    commit-tagged result files like `stress-test-results-<hash>.md`).

2. **Root-refinement → downstream audit** — Phase 4's new root-audit move catches stale root labels and refines them in the user's words, but the downstream why-up children may now feel off relative to the refined root. Currently the counselor has to improvise the follow-through. Add a one-sentence cue to the root-audit block: *"After refining the root, ask once whether any child node now feels off given the new wording. Don't force a retouch; the user can leave stale children for a later session."*
    - *Source: v0.4.0 pre-release stress test, B4 (Mei, exhausted tree) — Mei explicitly flagged one stale child ("the TED-talk version again") after the root refinement; counselor handled it by improvisation rather than via an explicit rule.*

3. **Flood-opener seed cap in Deep mode** — The new flood-opener rule says "seed only the thread they pick." In Focused/Demo mode that's enforced by the single-seed cap, but in Deep mode nothing stops the counselor from planting 4+ additional seeds after the self-selection. One simulation reached four seeds before anchoring. Add a cap: *"In Deep mode, cap seeded threads at 3–4. If the user has more, note the rest exist without seeding them — they can surface in later sessions."*
    - *Source: v0.4.0 pre-release stress test, A3 (Nadia, divergent life) — counselor planted four seeds; a fifth would have diluted the session. Passed by judgment, not rule.*

4. **Pattern 3 → Pattern 6 escalation trigger** — `PROBE_PATTERNS.md` Pattern 3 (cached insight) says to fire the paraphrase probe. If the user's paraphrase lands in the same vocabulary register (authentic → alive → intentional → integrity), the escalation to Pattern 6 (performed purpose) is implied but not named. Add one sentence to Pattern 3: *"If the user's paraphrase lands in the same vocabulary register, do not commit to the tree yet — escalate to Pattern 6 (performed purpose earnestness check)."*
    - *Source: v0.4.0 pre-release stress test, E13 (Cass, intellectual performer) — counselor correctly inferred the escalation, but the inference isn't documented; less careful implementations might hop between Patterns 3 and 4 instead.*

5. **Web/mobile service** — CLI-only blocks adoption for non-technical users entirely. Two independent user interviews confirmed: daily use requires mobile, and non-IT users have no path to the product without a web interface. Needs cloud storage with E2E encryption, cross-device sync, and a conversation persistence layer beyond local JSON files. This is the Kardens.io roadmap item.
    - *Source: Two user interviews (2026-04-14, 2026-04-15) — both independently said mobile is required for daily use and non-technical friends can't use Claude Code at all.*
