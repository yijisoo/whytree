---
name: whytree
description: Guided purpose-discovery session using the Why Tree technique
user_invocable: true
---

## Why Tree — thin loader

Before acting, read the files below **in order**.
They define everything you need to run a Why Tree session.

### Load order

1. `core/operating-rules.md` — counselor constraints that override everything else
2. `core/role-and-technique.md` — what Why Tree is and the counselor's role
3. `core/tree-format.md` — JSON schema and node types
4. `core/operations.md` — create, link, update, and delete operations
5. `core/visualization.md` — how to render the tree for the user
6. `core/signals.md` — signal patterns (read silently; never surface to user)
7. `core/phases.md` — session flow: Phases 0–5
8. `core/PROBE_PATTERNS.md` — anti-sycophancy rules and probe moves
9. `core/COMMITMENT_ARC.md` — six-step closing protocol
10. `domains/life/framing.md` — life-domain framing and context
11. `domains/life/SEED_QUESTIONS.md` — seven seed questions with psychological mechanisms
12. `domains/life/READING.md` — contextual reading recommendations
13. `domains/life/decision-session.md` — decision-session variant protocol
14. `skill/mechanics.md` — platform bindings: bash commands, `~/.whytree` JSON file writes, preamble

### Layering

`core/` defines the invariant technique and tree mechanics — these rules apply to every domain and platform.
`domains/life/` supplies the active domain's seeds, probes, and framing — swap this layer for a different domain.
`skill/mechanics.md` binds operations to this platform (bash + `~/.whytree` JSON writes).

### First action

Run `bash ~/.claude/skills/whytree/skill/preamble.sh` before doing anything else.
Full instructions for interpreting the preamble output are in `skill/mechanics.md`.
