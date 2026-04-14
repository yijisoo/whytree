# Why Tree

A structured, generative technique for discovering personal purpose.

## Skills

- `/whytree` — Start a guided purpose-discovery session (feedback is handled within the session)

## Architecture

No CLI, no runtime dependencies. Codex reads the skill files in `.Codex/skills/whytree/` directly and manipulates tree data as JSON files in `~/.whytree/`. Analytics and feedback are sent via `curl` to `kardens.io/api/whytree-telemetry`.

### Key files

- `.Codex/skills/whytree/SKILL.md` — The entire product. Defines the counselor behavior, JSON schema, tree operations, visualization format, signal detection, analytics/feedback via curl, and session flow (Phases 0–5).
- `.Codex/skills/whytree/SEED_QUESTIONS.md` — Seven seed questions with psychological mechanisms. Loaded at Phase 1.
- `.Codex/skills/whytree/PROBE_PATTERNS.md` — Anti-sycophancy rules, three probe moves, six named pushback patterns. Loaded at Phase 2.
- `.Codex/skills/whytree/COMMITMENT_ARC.md` — Six-step closing protocol. Loaded at Phase 5.
- `.Codex/skills/whytree/READING.md` — Contextual reading recommendations (Paul Graham, Garry Tan, Anne-Laure Le Cunff). Loaded before Phase 5.
- `.Codex/skills/whytree/preamble.sh` — Single-shot session state gatherer (user status, session gap, tree JSON, session notes, consent, update check). Run once at startup to avoid multiple permission prompts.
- `.Codex/skills/whytree-review-feedback/SKILL.md` — Developer-facing skill to review collected feedback from `~/.whytree/feedback/feedback.jsonl`.

### Data format

Tree files live in `~/.whytree/<slug>.json`. The active tree slug is in `~/.whytree/.current`. Schema fields: `schemaVersion`, `name`, `nodes` (keyed by UUID), `rootIds`, `seedIds`, `currentNodeId`, `lastExperimentId`, `createdAt`, `updatedAt`, `purpose`. Node types: `seed`, `why`, `how`.

### Testing

- `test/skill-lint.sh` — Linter with 10 categories (~30 checks) validating JSON schema, safety sections, file references, curl safety, platform support, phase headings, supporting file content, and YAML frontmatter. Runs in CI on every PR to `main`.
- `.github/workflows/ci.yml` — GitHub Actions workflow. Branch protection requires CI to pass.
- `docs/spec-stress-test.md` — 14-scenario adversarial simulation spec (manual, ~$20/run).
- `PROMPT.md` — Ralph Loop test harness (STALE — references deleted CLI, needs rewrite).

### Platform support

- macOS/Linux/Windows: fully supported (Codex terminal, Codex Desktop Code tab, IDE extensions)
- Windows requires Git for Windows — Codex uses Git Bash internally, so all bash commands work
- Codex.ai web chat: not supported (no Bash/file system access)

### Security notes

- Feedback curl uses temp file + Write tool to avoid shell injection (never interpolate user input into shell commands)
- Git update mechanism diffs SKILL.md and checks for suspicious changes before pulling
- `allowedURLs` scoped to `kardens.io/api/whytree-telemetry`
- Analytics sends structural metrics only (node counts, depth) — never labels or content
