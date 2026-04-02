# Why Tree

A structured, generative technique for discovering personal purpose.

## Skills

- `/whytree` — Start a guided purpose-discovery session (feedback is handled within the session)

## Architecture

No CLI, no runtime dependencies. Claude reads the skill files in `.claude/skills/whytree/` directly and manipulates tree data as JSON files in `~/.whytree/`. Analytics and feedback are sent via `curl` to `kardens.io`.
