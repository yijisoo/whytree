# TODO

    1. **SKILL.md length / architecture review** — `.claude/skills/whytree/SKILL.md` is growing long (~480 lines). Is a single monolithic
    prompt the right architecture, or should it be split (e.g., separate files for phase routing, anti-sycophancy patterns, crisis protocol)
     with a compose step?

    2. **Regression testing mechanism** — What's the proper way to ensure later SKILL.md changes don't break previously passing scenarios?
    Need a repeatable, automated stress test suite that can be re-run after each edit and compared against prior results (e.g.,
    commit-tagged result files like `stress-test-results-<hash>.md`).
