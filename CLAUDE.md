# Why Tree

A structured, generative technique for discovering personal purpose.

## Workflow rules

- **Do not push or release unless explicitly asked.** Commit changes freely, but only run `scripts/release.sh` or `git push` when the user says to. This avoids rapid version bumps from incremental work.

## Skills

- `/whytree` — Start a guided purpose-discovery session (feedback is handled within the session)

## Architecture

No CLI, no runtime dependencies. Claude reads the skill files at the repo root directly and manipulates tree data as JSON files in `~/.whytree/`. Analytics and feedback are sent via `curl` to `kardens.io/api/whytree-telemetry`.

### Key files

- `SKILL.md` — The entire product. Defines the counselor behavior, JSON schema, tree operations, visualization format, signal detection, analytics/feedback via curl, and session flow (Phases 0–5).
- `SEED_QUESTIONS.md` — Seven seed questions with psychological mechanisms. Loaded at Phase 1.
- `PROBE_PATTERNS.md` — Anti-sycophancy rules, three probe moves, six named pushback patterns. Loaded at Phase 2.
- `COMMITMENT_ARC.md` — Six-step closing protocol. Loaded at Phase 5.
- `READING.md` — Contextual reading recommendations (Paul Graham, Garry Tan, Anne-Laure Le Cunff). Loaded before Phase 5.
- `preamble.sh` — Single-shot session state gatherer (user status, session gap, tree JSON, consent, update check). Run once at startup to avoid multiple permission prompts.

### Data format

Tree files live in `~/.whytree/<slug>.json`. The active tree slug is in `~/.whytree/.current`. Schema fields: `schemaVersion`, `name`, `nodes` (keyed by UUID), `rootIds`, `seedIds`, `currentNodeId`, `lastExperimentId`, `createdAt`, `updatedAt`, `purpose`. Node types: `seed`, `why`, `how`.

### Testing

- `test/skill-lint.sh` — Linter (~12 categories, ~60 checks) validating JSON schema, safety sections, file references, curl safety, curl payload fields and forbidden fields, feedbackCategory enum, command enum, depersonalization rule, platform support, phase headings, supporting file content, and YAML frontmatter. Runs in CI on every PR to `main`.
- `.github/workflows/ci.yml` — GitHub Actions workflow. Branch protection requires CI to pass.
- `scripts/release.sh` — Automated release: lint gate → version bump → changelog → push.
- `docs/spec-stress-test.md` — 15-scenario adversarial simulation spec (manual, ~$20/run).

### Platform support

- macOS/Linux/Windows: fully supported (Claude Code terminal, Claude Desktop Code tab, IDE extensions)
- Windows requires Git for Windows — Claude Code uses Git Bash internally, so all bash commands work
- claude.ai web chat: not supported (no Bash/file system access)

### Security notes

- Feedback curl uses temp file + Write tool to avoid shell injection (never interpolate user input into shell commands)
- Git update mechanism diffs SKILL.md and checks for suspicious changes before pulling
- `allowedURLs` scoped to `kardens.io/api/whytree-telemetry`
- Analytics sends a single per-session usage ping only: `deviceId` (anonymous UUID), `command:"session"`, `sessionNumber`, `daysSinceFirstSession`, `treeAgeDays`. No node counts, no labels, no tree content. Versioned consent (`yes-v2`); legacy `yes` users get re-prompted once because the prior consent did not cover linking sessions over time.
- Feedback sends a depersonalized note only on explicit user yes: `deviceId`, `command:"feedback"`, `feedbackMessage`, `feedbackCategory` (one of `tool-misfire | design-insight | bug | ux | naming | localization | general`). Drafts must contain no labels, quoted user words, or purpose statements.
