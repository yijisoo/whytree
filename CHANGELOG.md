# Changelog

All notable changes to The Why Tree are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

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
