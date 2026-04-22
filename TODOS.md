# TODO

1. **SKILL.md length / architecture review** — `SKILL.md` keeps growing (610 lines as of v0.3.0). Is a single monolithic prompt the right architecture, or should it be split (e.g., separate files for phase routing, anti-sycophancy patterns, crisis protocol) with a compose step?

2. **Regression testing mechanism** — What's the proper way to ensure later SKILL.md changes don't break previously passing scenarios?
    Need a repeatable, automated stress test suite that can be re-run after each edit and compared against prior results (e.g.,
    commit-tagged result files like `stress-test-results-<hash>.md`).

3. **READING.md divergent-life pitch** — Add a trigger note for users whose trees show multiple genuine non-converging roots. The Paul Graham essay's section on "working on many things" is relevant but the current pitch is written for single-direction users.
    - *Source: A3 (Nadia, divergent life) — tree produced three separate root systems (self outside assessment, care for past self, ethical proximity). The PG essay is relevant but the current trigger condition ("purpose clarity but don't know how to aim it") doesn't quite match.*

4. **Web/mobile service** — CLI-only blocks adoption for non-technical users entirely. Two independent user interviews confirmed: daily use requires mobile, and non-IT users have no path to the product without a web interface. Needs cloud storage with E2E encryption, cross-device sync, and a conversation persistence layer beyond local JSON files. This is the Kardens.io roadmap item.
    - *Source: Two user interviews (2026-04-14, 2026-04-15) — both independently said mobile is required for daily use and non-technical friends can't use Claude Code at all.*
