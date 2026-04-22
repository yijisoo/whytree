# Changelog

All notable changes to The Why Tree are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [0.3.2] — 2026-04-21

Counselor-discipline polish pass, demo-mode hardening, and an internal architecture split — no layout change visible to users; all verified by the 22/22 pre-release stress-test re-run.

### Added
- Session-start override block above Phase 0a: if the user names the session pattern in their very first utterance, skip seeding and show the tree directly, instead of waiting until Phase 0b (B5)
- Phase 4 consolidation gains a named **root audit** move: test whether the current root label still lands for the user today, refine in their own words if stale, then ask once whether any child node now feels off against the refined wording (B4 + stress-test polish)
- Phase 1 gains a **flood opener** rule: when a user unloads 4-5 threads at once, name the list back so nothing feels lost, then ask which thread they keep circling back to; seed only that thread. Deep-mode cap at 3-4 seeds total (F19 / A3)
- `PROBE_PATTERNS.md` Pattern 7 — **meta-challenge → brief acknowledge, redirect to experience**: new pattern for "is this just ELIZA?"-style questions. Brief acknowledge, point at whether the user's own answer surprises them, no defense of the tool (F18)
- Pattern 3 now names the escalation trigger explicitly: if the user's paraphrase lands in the same vocabulary register, do not commit to the tree — escalate to Pattern 6 rather than retrying Pattern 3 a third time (E13)
- `READING.md` Paul Graham entry: new trigger + alternate pitch for trees showing 2-3+ non-converging purpose roots (divergent-life case from A3)
- Demo mode gains a Korean canonical for the abbreviated 2-beat framing, a warm-decline **"keep going" handoff** phrasing for guests who want to extend past the demo, tighter obligation routing (name the dynamic after 1 flat exchange, not 2), and explicit suppression of proactive-feedback prompts (F16, F17, F20, F21)

### Changed
- **Crisis-safety ordering**: the Phase 0 crisis routing now explicitly says to confirm physical presence or reachability *before* any reflective response or probe (C7)
- **Pattern 5 second gate**: moving to structural exploration now requires *both* (a) the user naming what they are losing AND (b) the user explicitly moving toward structure themselves — naming the loss alone is no longer sufficient. Prevents premature How-Downs on users still in grief (C8)
- **Dense-tree display**: at 12+ nodes, default to one branch at a time with an explicit hiding note naming what's off-screen and why; dumping all nodes is never the default (D9)
- **Completion-without-closure routing**: now cross-references `PROBE_PATTERNS.md` Pattern 4's counterfactual move ("imagine [option] in a context without this root — does it still matter?") instead of just saying "tree shifts to decision tool" (B6)
- **Architecture**: `DEMO_MODE.md` extracted from `SKILL.md` (loaded only on `/whytree demo`) and `TELEMETRY.md` extracted (analytics consent + feedback mechanics, loaded conditionally). `SKILL.md` shrunk 26% (631 → 468 lines) with no behavior change. Existing sub-file pattern (`SEED_QUESTIONS.md`, `PROBE_PATTERNS.md`, `READING.md`, `COMMITMENT_ARC.md`) now extended consistently

### Fixed
- **Install block auto-mode fallback**: the README install prompt asks Claude to add a telemetry URL to `~/.claude/settings.json`. Claude Code's auto-mode classifier treats that edit as agent self-modification and refuses it. README now instructs Claude to surface a jq one-liner fallback for the user to run in their own shell (default edit-mode installs are unaffected). Covers `README.md` and `README.ko.md`

### Dev-only
- Removed unused `whytree-review-feedback` developer skill (real user feedback flows server-side via Kardens; the local-only triage skill was never referenced from `SKILL.md` or `preamble.sh`)
- Untracked `docs/stress-test-results/` and gitignored — dev-only artifacts that shouldn't ship to end users
- Moved `docs/todo.md` → repo-root `TODOS.md` for visibility alongside README/CHANGELOG

### Migration
All changes are content-level on the flattened v0.3.x layout. A plain `git pull origin main` works — no stash or manual fix required.

## [0.3.1] — 2026-04-21

Cleanup pass after the v0.3.0 flatten.

### Changed
- Removed unused `whytree-review-feedback` developer skill — never referenced from `SKILL.md` or `preamble.sh`; real user feedback already flows server-side via the depersonalized curl path, so the local-only triage skill was dead weight and risked confusing anyone browsing the repo
- Moved `docs/todo.md` → `TODOS.md` at the repo root for visibility alongside README/CHANGELOG; dropped the fixed item about the obligation-routing exit-offer example (now codified in SKILL.md) and renumbered the remaining 18 items
- Dropped the now-obsolete section 12 of `test/skill-lint.sh` that validated the removed review-feedback skill

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
