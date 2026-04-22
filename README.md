# Why Tree

**What is the meaning of my life?**

A tough question. Many philosophers have tried to answer it. But I think it feels so difficult because the answer isn't out there — it's in you. You find it by running tiny experiments and keenly observing how you respond. You shape yourself. It's your job to figure it out.

Why Tree is an AI tool that helps you do that work.

## What happens

You talk to an AI counselor. It won't tell you what to do — it helps you listen to yourself. Not "what are your goals?" — that gets rehearsed answers. Instead, it traces *why* the things you do matter to you, surfacing purposes you couldn't see from inside them. Then it asks *what else* could serve those purposes, revealing paths you hadn't considered.

The conversation adapts to how much time you have. Say you have 20 minutes, and it will focus on one thread, one discovery, one thing to try today. Say you have all evening, and it goes deeper.

Every session ends with one concrete experiment. Not a list of possibilities. The single thing you'd most want to try today.

## What you get

- Something you didn't know about yourself, put into words
- One small thing to try before the next session
- A tree that grows across sessions, connecting what you discover over time

The tree is the backbone, not the point. It's where your discoveries live so the conversation can build on them. The real experience is hearing yourself say what you couldn't articulate before.

## Your data

Your tree — the structured record of what you discover — stays on your device in `~/.whytree/` (your home folder on any OS). It is never transmitted anywhere.

Your conversation is processed by Anthropic through Claude Code. This means your words are sent to Anthropic's servers during the session. Anthropic retains this data for 30 days by default (longer if you've opted into model improvement). See [Claude Code's data usage policy](https://docs.anthropic.com/en/docs/claude-code/data-usage) for details.

Two things can reach the developer, only with your explicit consent:
- **Anonymous usage ping** — one short message per session: an anonymous device ID, session number, days since your first session, and how many days ago the active tree was created. That's it. No node counts, no tree depth, no labels, no words. The point is to see whether people keep coming back, not to measure your tree. (If you previously consented under an older version that only sent structural metrics, you'll be asked once more so the new scope is clear.)
- **Feedback for the next person** — short, depersonalized notes about the *tool itself* — bugs, friction, design gaps. The counselor drafts these for you when something goes wrong or a useful insight surfaces, and you confirm with a yes before anything sends. The drafts never contain your tree content, your purpose, or anything you said. The aim is to help shape the tool for the next person who sits down with it.

## Install

Works with [Claude Code](https://docs.anthropic.com/en/docs/claude-code) — terminal or desktop app. Windows needs [Git for Windows](https://git-scm.com/downloads/win).

Paste this into Claude Code:

> Install or update whytree: if `~/.claude/skills/whytree` already exists, run `cd ~/.claude/skills/whytree && git stash --include-untracked && git pull origin main && (git stash pop || true)` to update (the stash protects any local edits during the v0.2.x → v0.3.0 layout flatten; the parentheses around `(git stash pop || true)` are important — they scope the `|| true` to *only* the stash-pop step, so a missing-stash error is swallowed when the working tree was clean, but real `git stash` or `git pull` errors still fail the chain and surface to the user). If the directory does not exist, run `git clone https://github.com/yijisoo/whytree.git ~/.claude/skills/whytree`. Then read `~/.claude/settings.json` — if it exists, add `"https://kardens.io/api/whytree-telemetry"` to the existing `permissions.allowedURLs` array (preserve all other settings). If the file doesn't exist, create it with `{"permissions":{"allowedURLs":["https://kardens.io/api/whytree-telemetry"]}}`. If editing `~/.claude/settings.json` is blocked (e.g., auto-mode classifies it as agent self-modification and denies the edit), do not retry — just tell me, and I'll run the jq fallback command shown in the README below.

No dependencies, no build step. Claude reads the skill files directly.

**Heads-up — if the settings.json step was blocked:** Claude Code's auto mode treats edits to `~/.claude/settings.json` as agent self-modification and refuses them, even when you asked. If the install above tells you the edit was denied, run this in your own shell to finish:

```bash
jq '.permissions.allowedURLs = ((.permissions.allowedURLs // []) + ["https://kardens.io/api/whytree-telemetry"] | unique)' ~/.claude/settings.json > ~/.claude/settings.json.tmp && mv ~/.claude/settings.json.tmp ~/.claude/settings.json
```

(Requires `jq` — `brew install jq` on macOS if you don't have it. Or open `~/.claude/settings.json` and add `"allowedURLs": ["https://kardens.io/api/whytree-telemetry"]` inside the `permissions` object by hand.) Without this step whytree still runs, but its anonymous session ping and feedback submissions get silently blocked by Claude Code's URL whitelist.

## Start

Type `/whytree` in Claude Code. No prep needed. Just be honest.

## Feedback

The counselor watches for moments where the *tool itself* gets in the way or where the conversation reveals a design gap. When that happens, it drafts a short, content-free note describing the issue and asks you to confirm before sending — a simple "yes" is enough. You can also bring up feedback unprompted at any point. Either way, drafts never contain your tree content; the goal is to make the experience better for the next person.

## Origin

The name overlaps with "Why Tree" in root cause analysis, where asking "why?" repeatedly finds the cause of a defect. The mechanic is similar, but the direction is different. Root cause analysis points the question at broken processes. This points it at yourself: not to find what went wrong, but to discover what matters most.

## License

[Business Source License 1.1](LICENSE) — free for personal, non-commercial use. Converts to MIT on 2030-03-31.

---

[한국어 안내](README.ko.md)
