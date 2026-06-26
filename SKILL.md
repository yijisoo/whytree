---
name: whytree
description: Guided purpose-discovery session using the Why Tree technique
user_invocable: true
---

## Why Tree — thin loader

Before acting, read the files below **in order**.
They define everything you need to run a Why Tree session.

### Domain selection

Every session runs under one domain pack — `life` or `product` — which selects the `domains/<active>/` files loaded below. Everything in `core/` and `skill/` is identical across domains. Resolve the active domain in this order (see `core/phases.md` → Phase 0: Establish domain):

1. **Existing tree:** use the tree's stored `domain` field (default `life` if absent). This wins over any invocation argument — a product tree always reopens in the product domain.
2. **Explicit invocation** (`/whytree product`): use that domain for a new tree.
3. **New tree, no explicit domain:** ask the user once, warmly (per Phase 0), then record the choice as the new tree's `domain`.

Because the domain may not be known until after the Phase 0 question, always load `core/` first; load the resolved `domains/<active>/` pack once the domain is established. (`demo` remains a separate mode — see `skill/mechanics.md`.)

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
10. `domains/<active>/framing.md` — domain framing and context (`<active>` = `life` by default, `product` if selected)
11. `domains/<active>/SEED_QUESTIONS.md` — seed questions with their mechanisms
12. `domains/<active>/READING.md` — contextual reading recommendations
13. `domains/<active>/decision-session.md` — decision-session variant protocol
14. `skill/mechanics.md` — platform bindings: bash commands, `~/.whytree` JSON file writes, preamble

For the default session, `<active>` is `life`: load `domains/life/framing.md`, `domains/life/SEED_QUESTIONS.md`, `domains/life/READING.md`, and `domains/life/decision-session.md`. For a product session, load the same four filenames under `domains/product/`.

### Layering

`core/` defines the invariant technique and tree mechanics — these rules apply to every domain and platform.
`domains/<active>/` supplies the active domain's seeds, probes, and framing — `life` for purpose discovery, `product` for product feature definition. Swap this layer to change domain.
`skill/mechanics.md` binds operations to this platform (bash + `~/.whytree` JSON writes).

### First action

Run `bash ~/.claude/skills/whytree/skill/preamble.sh` before doing anything else.
Full instructions for interpreting the preamble output are in `skill/mechanics.md`.
