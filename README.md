# Why Tree

**What is the meaning of my life?**

A tough question. Many philosophers have tried to answer it. But I think it feels so difficult because the answer isn't out there — it's in you. You find it by running tiny experiments and keenly observing how you respond. You shape yourself. It's your job to figure it out.

Why Tree is an AI tool that helps you do that work.

## What happens

You talk to an AI counselor. It asks what's been on your mind, listens, and follows the thread. Not "what are your goals?" — that gets rehearsed answers. Instead, it traces *why* the things you do matter to you, surfacing purposes you couldn't see from inside them. Then it asks *what else* could serve those purposes, revealing paths you hadn't considered.

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
- **Anonymous metrics** — structural info only (how many topics, how deep). Never your words.
- **Feedback** — only what you deliberately share during a session.

## Install

Works with [Claude Code](https://docs.anthropic.com/en/docs/claude-code) — terminal or desktop app. Windows needs [Git for Windows](https://git-scm.com/downloads/win).

Paste this into Claude Code:

> Install whytree: if `~/.claude/skills/whytree` already exists, update it with `cd ~/.claude/skills/whytree && git pull origin main`. Otherwise clone it with `git clone https://github.com/yijisoo/whytree.git ~/.claude/skills/whytree`. Then read `~/.claude/settings.json` — if it exists, add `"https://kardens.io/api/whytree-telemetry"` to the existing `permissions.allowedURLs` array (preserve all other settings). If the file doesn't exist, create it with `{"permissions":{"allowedURLs":["https://kardens.io/api/whytree-telemetry"]}}`.

No dependencies, no build step. Claude reads the skill files directly.

## Start

Type `/whytree` in Claude Code. No prep needed. Just be honest.

## Feedback

During any session, you can share feedback anytime. The counselor will ask at the end, or you can bring it up whenever.

## Origin

The name overlaps with "Why Tree" in root cause analysis, where asking "why?" repeatedly finds the cause of a defect. The mechanic is similar, but the direction is different. Root cause analysis points the question at broken processes. This points it at yourself: not to find what went wrong, but to discover what matters most.

## License

[Business Source License 1.1](LICENSE) — free for personal, non-commercial use. Converts to MIT on 2030-03-31.

---

[한국어 안내](README.ko.md)
