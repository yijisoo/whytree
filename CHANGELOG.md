# Changelog

All notable changes to The Why Tree are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [0.3.0] — 2026-04-21

Install layout flattened — the repo root is now the Claude Code skill directory. Fixes `Unknown command: /whytree` that occurred after a plain `git clone … ~/.claude/skills/whytree` install.

### Changed
- Skill files (`SKILL.md`, `SEED_QUESTIONS.md`, `PROBE_PATTERNS.md`, `COMMITMENT_ARC.md`, `READING.md`, `preamble.sh`) moved from `.claude/skills/whytree/` to the repo root so Claude Code discovers the skill at `~/.claude/skills/whytree/SKILL.md`
- `preamble.sh` now self-locates via `BASH_SOURCE`, working in any install shape (standard path, symlinked dev checkout, plugin marketplace)
- README install block stashes local edits before pulling so users upgrading from v0.2.x do not lose workaround symlinks or edits
- `docs/stress-test-results/` untracked and gitignored — dev-only artifacts that shouldn't ship to end users

### Migration
- **Standard installs:** rerun the install block in README.md — `git stash --include-untracked` protects local edits through the flatten
- **Symlinked dev checkouts** (repo elsewhere, symlink placed at `~/.claude/skills/whytree`): after pulling, re-point the symlink at the repo root itself rather than the old nested `.claude/skills/whytree` subdirectory

## [0.2.10] — 2026-04-19

Phase 0a Example rewrite — Min/books example with stronger aha line, plus Korean canonical block so the live Korean intro stops reading as a machine translation. Code-review fixes from earlier in the day also ride along.

## [0.2.9] — 2026-04-17

### Added
- Demo mode (`/whytree demo`) — streamlined session for trying Why Tree on a host's machine; cleans up the demo tree and restores the host's previous session at the end
- Solution-seeker pattern handling — Phase 2 now names what the tree shows and quotes the user's own words back when they ask for advice instead of deflecting with more questions
- Phase 5b decision session — post-discovery mode for users who already found their purpose
- 12+ node selective rendering — large trees no longer dump every branch
- Proactive feedback — counselor watches for tool misfires or design-relevant insights, drafts a depersonalized note (no labels, no quoted words, no purpose statements), and asks the user to confirm with a yes; max one offer per session
- Versioned consent (`yes-v2`) and longitudinal usage ping — one event per session (anonymous device ID, session number, days since first session, tree age) replaces the old structural metrics
- Permission beat sets expectation upfront — "the answer isn't out there — it's in you; my job is to help you hear it"
- 7 new stress test scenarios — 6 demo personas (F16–F21) and 1 solution-seeker (E15)

### Fixed
- Premature convergence — Converge now requires the user to articulate the connection first
- Fluent-insight trap detected proactively — blocks tree entry until restated plainly
- Obligation exit now has explicit closing language with one last genuine question
- Install instruction no longer touches project-level CLAUDE.md, reducing the compound permission surface
- Device-ID Q&A and session-counter clarification — counselor can answer "what is the anonymous device ID?" verbatim and won't re-run preamble mid-session
- Canonical `feedbackCategory` table — categories no longer drift across sessions

### Changed
- Phase telemetry folded into the single session ping
- Legacy `yes` users are re-prompted once because the prior consent did not cover linking sessions across time; `no` users are respected silently
- README + README.ko: privacy section now explicit about longitudinal scope and the legacy re-prompt; feedback section reframed as "shape the tool for the next person"
- Both READMEs lead with "it won't tell you what to do — it helps you listen to yourself"
- Cross-platform support clarified; untested IDE mentions removed
- `release.sh` push is now opt-in via `--push`; default is local commit only
- CLAUDE.md adds a workflow rule: no push/release unless explicitly asked

### Removed
- Structural-metric analytics (node counts, depth, convergence) — replaced by the usage ping above
- End-of-session feedback ask in the Commitment Arc — replaced by the proactive flow

### Notes
- The kardens.io endpoint is unchanged. Removed payload fields silently drop server-side; new fields are additive. Any kardens dashboards that relied on structural metrics will go quiet — verify before relying on the new shape.

## [0.2.8] — 2026-04-15

### Fixed
- Security: local feedback JSONL append now mandates Write tool, closing shell injection gap (CSO audit finding)

## [0.2.7] — 2026-04-15

### Changed
- Lint expanded to 12 sections (~55 checks) — now validates review-feedback skill
- preamble.sh reports VERSION from .version file at session start
- Stress test results consolidated under docs/stress-test-results/
- CLAUDE.md updated to reflect current tooling (release script, lint scope)

## [0.2.6] — 2026-04-15

### Fixed
- Release script: changelog insertion and em dash encoding

## [0.2.5] — 2026-04-15

### Added
- Release automation — `scripts/release.sh` with lint gate, version bump, changelog, push
- Lint section 6 — validates deviceId in all curl payloads (analytics, phase, feedback)
- Stress test D13 — feedback end-to-end flow scenario

### Fixed
- All telemetry curl payloads now include required deviceId field
- Feedback framing: 'helps the next person' instead of 'send to developer'

### Removed
- Codex agent support (.agents/, AGENTS.md) — cannot be tested reliably

## [0.2.4] — 2026-04-15

### Added
- Deep/Focused session modes — time-aware routing with distinct pacing and exit points
- Early-exit feedback — captures user input before minimum viable session exit
- Minimum viable session flow — 1 seed → 2-3 why-ups → 1 how-down → mini Commitment Arc (~20 min)

## [0.2.3] — 2026-04-01

### Added
- Crisis/grief protocol — technique suspends, counselor becomes presence
- Post-discovery mode — tree shifts from discovery to decision tool
- Obligation/referral routing — graceful exit for disengaged users
- Pattern-aware returning users — skip entry ritual, show tree directly
- Multilingual support — follow user's language, adopt L1 terms as node labels
- Purpose-identity collapse pattern — grief before structure
- High-volume opener triage — seed 2-3, hold the rest
- Consolidation session guidance — reorganize without forcing growth
- Large-tree navigation with `summary` MCP tool — thematic orientation without full dump
- Deferred analytics consent — ask after first real response
- Impatience/ROI skepticism handling — show tree immediately, don't explain method

### Fixed
- ESL fallback guidance — concrete questions, feeling-word options

## [0.2.2] — 2026-03-31

### Fixed
- MCP server version now read from package.json dynamically instead of hardcoded
- Converge tool links second node directly to parent, avoiding duplicate nodes on case mismatch
- Setup script backs up settings.json before modifying it
- Added .heartbeat to .gitignore
- Tracked mcp-server.js and text-render.js (previously untracked)

## [0.2.1] — 2026-03-31

### Added
- Setup auto-registers MCP server at user scope — no manual `claude mcp add` needed
- Setup adds `mcp__whytree__*` permission to global settings — zero approval prompts during sessions

### Fixed
- Upgrades from older versions now clean up local/project-scoped MCP registrations before re-adding at user scope

## [0.2.0] — 2026-03-31

### Added
- Session gap detection — sessions now adapt based on how long it's been (same day, a few days, a week, long gap)
- Time-aware return greeting — Phase 0b tone adjusts to the gap: casual check-in if same day, gentle if a week, re-orient if it's been a while
- Four arrival state routing — opener now handles distress, transition, achievement hollowness, curiosity, and numbness with distinct follow-through moves
- `whytree-review-feedback` developer skill — pulls all user feedback and generates a prioritized action list

### Changed
- Session opener is now presence-first: one open question ("What's been taking up space lately?"), internal routing — no self-classification menu
- Phase 0a: returning users skip the full method framing; first-time users still get mechanism + example + permission
- Version number shown to first-time users at session start

### Fixed
- Banned left/right spatial language — the tree renders top-down, not left-to-right
- Korean sessions now use '트리' (unambiguous borrowed term) instead of '나무'

### Docs
- README: value prop moved to top, four arrival states named, differentiation from journaling added, story now precedes tree diagram

## [0.1.0] — 2026-03-26

### Added
- Core Why Up / How Down technique — bidirectional purpose discovery
- Commitment Arc — every session ends with one concrete experiment to try today, not a list
- Root quality gate — prevents shallow How Down by checking purpose depth first
- Anti-sycophancy rules — counselor never validates instead of advancing
- Named pushback patterns — four documented moves when default probing stalls
- Session persistence — tree saves locally to `~/.whytree/` and grows across sessions
- Update check — preamble detects new versions and offers to update
- Anonymous analytics (opt-in) — structural metrics only, never personal content
- `/whytree-feedback` skill — users can send feedback to the developer
