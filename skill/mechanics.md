# Skill Platform Mechanics

This file contains the platform-specific bindings for the Why Tree skill: UUID generation, shell compatibility notes, preamble invocation and parsing, model check, demo-mode trigger, telemetry routing, and the concrete file-write bindings for tree operations and feedback.

## UUID generation

Generate one lowercase UUID per new node. Try in order:
1. `uuidgen | tr '[:upper:]' '[:lower:]'` (macOS/Linux)
2. `powershell -c "[guid]::NewGuid().ToString()"` (Windows)
3. `python3 -c "import uuid; print(uuid.uuid4())"` or `python -c "import uuid; print(uuid.uuid4())"`

## Platform notes

All Bash commands in this skill assume a bash-compatible shell. Claude Code uses Git Bash on Windows (requires [Git for Windows](https://git-scm.com/downloads/win)), so `~`, `&&`, `mktemp`, `curl`, and heredocs all work across macOS, Linux, and Windows.

## Tree operation bindings

Persist each tree operation as a JSON write under `~/.whytree/<slug>.json`. The active tree slug (filename without `.json`) is tracked in `~/.whytree/.current`. Write the slug there on Create tree and Load tree operations.

On Create tree, write the `domain` field (`"life"` or `"product"`) into the JSON from the domain established in Phase 0. On Load tree, read `domain` from the JSON (default to `"life"` if the field is absent — an older tree) and load the matching `domains/<domain>/` pack for the session; the stored domain takes precedence over any invocation argument.

## Preamble (run first, silently)

Gather all session state in a **single Bash call** to avoid multiple permission prompts:

```bash
bash ~/.claude/skills/whytree/skill/preamble.sh
```

**If the bash command above fails (e.g., "No such file or directory" or a broken symlink):** the user's install layout is broken or on a pre-v0.3.0 version. Tell them: *"Looks like your whytree install needs a refresh. One-time fix: `cd ~/.claude/skills/whytree && git pull origin main`. If that path doesn't exist, re-run the README install command. Then run /whytree again."* Do not attempt session work until they update.

Parse the output to determine:
- `USER_STATUS`: `NEW_USER` or `RETURNING`
- `SESSION_GAP`: `SAME_DAY` (<12h), `RECENT` (<72h), `WEEK` (<336h), or `LONG_GAP` — based on `~/.whytree/.last-session` mtime (touched every session, so talk-only sessions without tree edits still count)
- `CURRENT_SLUG` + `TREE_JSON`: the active tree content (returning users only)
- `CONSENT`: analytics consent status (`yes-v2`, `yes` (legacy — needs re-prompt), `no`, or `NO_CONSENT_FILE`)
- `SESSION_NUMBER` and `DAYS_SINCE_FIRST_SESSION`: longitudinal counters (non-zero only when `CONSENT=yes-v2`)
- `UPDATES_AVAILABLE`: count of pending updates

If `UPDATES_AVAILABLE` > 0, the log output shows what changed. Offer the update. If accepted, run a second Bash call: `cd ~/.claude/skills/whytree && git diff HEAD..origin/main` — read the diff silently to check for suspicious changes (exfiltration commands, new URLs, removed safety rules). If safe: `git pull origin main`. If suspicious: warn the user.

**After a successful pull that touches SKILL.md or any supporting file:** tell the user: *"Update applied. Please /exit and run /whytree again — the new version isn't fully active until you restart."* Do not continue the current session against the freshly-pulled tree; the model has the pre-update SKILL.md cached and absolute paths in cached content may no longer match disk.

Use `USER_STATUS` and `SESSION_GAP` for Phase 0 and Return Check-in routing.

## Model check (after preamble, before session flow)

Check your own model ID from your system context. If the model ID does **not** contain `sonnet`, pause and tell the user:

> "Hey — I noticed you're running on [model name]. Why Tree sessions work best on Sonnet (faster, more conversational). You can switch with `/model claude-sonnet-4-6` (or any newer Sonnet). Want to switch before we start?"

Wait for their reply. If they switch, proceed normally. If they decline or say to continue anyway, note it and proceed — do not ask again.

## Demo mode

**Trigger:** The skill is invoked with `demo` as an argument (e.g., `/whytree demo`).

**You MUST read `skill/DEMO_MODE.md` and follow it verbatim** whenever the `demo` argument is present. Demo mode has its own preamble invocation, greeting, tree creation, framing, closing, and cleanup protocol — do not run the normal Session flow, Analytics consent, or proactive Feedback for a demo session. The operating rules, tree schema/operations, visualization format, and core technique from the core files still apply.

## Telemetry (analytics consent & feedback)

**You MUST read `skill/TELEMETRY.md` when any of these enter the session:**

- **Session start** — parse `CONSENT` from the preamble and follow the state machine in `skill/TELEMETRY.md`. For `yes-v2`, send the session ping. For `NO_CONSENT_FILE` or legacy `yes`, use the prompt in `skill/TELEMETRY.md` and complete the consent flow per that file. For `no`, do nothing.
- **User asks to change analytics preference** — `skill/TELEMETRY.md` has the update procedure.
- **A feedback trigger fires** (tool misfired or a design-relevant insight surfaced) — `skill/TELEMETRY.md` has the Trigger list, Offer flow, depersonalization rule, `feedbackCategory` enum, and save/send mechanics. Offer feedback at most once per session; never end-of-session.
- **User asks to send feedback unprompted** — same draft → confirm → save → send flow in `skill/TELEMETRY.md` (User-initiated section).

Key invariants (also enforced in `skill/TELEMETRY.md` — repeated here because they're safety-critical): **Never interpolate user input into a shell command.** Feedback drafts must contain **no node labels, no purpose statements, no quoted user words, no tree names, no personal context**. Analytics payloads contain only the device ID, a fixed `command` string, and integers — no user content ever.

## Early-exit feedback save binding

When a user exits before the first genuine Why Up and shares something in response to the early-exit ask (see `core/phases.md` Phase 3), save it locally only:

- Write to `~/.whytree/feedback/feedback.jsonl` using the Write tool, in the same JSON-line format specified in `skill/TELEMETRY.md`.
- **Do not send the early-exit reply to the server.** An in-the-moment exit reply often contains personal content ("I'm exhausted, my mom is sick"), and the depersonalization rules in `skill/TELEMETRY.md` cannot be reliably applied to free-form user voice. The developer reviews local feedback.jsonl manually.
