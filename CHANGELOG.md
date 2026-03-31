# Changelog

All notable changes to The Why Tree are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

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
