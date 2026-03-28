# The Why Tree

**You know you want more from life. You just can't say what.**

You're busy. Maybe even successful. But there's a gap — between how your days are spent and what you actually care about.

Or maybe it's simpler. You just feel a bit lost. Like everyone else has a direction and you're still waiting for yours to arrive.

That's not a flaw. It's the most honest starting point there is.

The Why Tree is a guided conversation — powered by Claude — that starts from where you actually are and helps you trace your way to what matters most.

## How it works

You start with something concrete: an activity you love, a project you keep returning to, something that won't leave your head.

Then Claude walks you through two movements:

**Why Up** — *"Why does this matter to you?"* Then *"Why?"* of that answer. Each step moves from the specific toward something deeper — from "I keep working on this side project" to "I need to feel like I'm building something real."

**How Down** — *"What else could give you this?"* From any purpose you've surfaced, explore paths you hadn't considered — career changes, projects, life experiments that serve the same root.

By going up and back down, patterns emerge: multiple interests pointing to the same core value, new paths to purposes you've already named, clarity about what's worth your energy and what isn't.

The real outcome isn't the diagram. It's hearing yourself say, out loud, what you couldn't articulate before.

## What it looks like

Here's a fragment from a real session:

```
=== My Why Tree ===

  +-- [1] ^ feel secured / grounded in myself
        |-- [1.1] ~ helping people reclaim agency as AI grows
        |-- [1.2] v a sweaty run
        |-- [1.3] v sit with difficulty before reaching for relief
        |-- [1.4] v private discovery journaling
        +-- [1.5] v track concrete impact, not validation
```

Someone came in talking about FOMO and burnout. By the end they'd traced it to something specific — and discovered five concrete practices that serve it, some they'd never thought to connect.

## Who this is for

- **Students** who can't explain why nothing on the menu feels right
- **Builders and solopreneurs** who need to stop chasing every opportunity and find the one problem that's truly theirs
- **Career changers** who know they want something different but can't name what
- **Anyone** who has felt the gap between "I'm busy" and "I'm fulfilled"

You don't need to have your life figured out. You just need 20 minutes and an honest conversation.

## Install

Tell Claude:

> Install whytree: run `git clone https://github.com/yijisoo/whytree.git ~/.claude/skills/whytree && cd ~/.claude/skills/whytree && ./setup` then add a "whytree" section to CLAUDE.md that lists the available skill: `/whytree` — a guided purpose-discovery session using the Why Tree technique. Then ask the user if they also want to add whytree to the current project so teammates get it.

That's it. Claude handles the rest.

## Start a session

Type `/whytree` in Claude Code. No prep needed — just answer honestly.

Your tree saves locally at `~/.whytree/` and grows across sessions. Come back when you've had new experiences or new questions. The tree is a living document.

## Manage your tree

```bash
whytree show              # Display your tree with node numbers
whytree edit              # Interactive editor (arrow keys + Enter)
whytree rename 1.2 "..."  # Rename a node by number
whytree insights          # Show convergence analysis
```

## Give feedback

Type `/whytree-feedback` in Claude Code to share what worked, what didn't, or suggest a feature.

## Origin

The name overlaps with "Why Tree" in Six Sigma and lean manufacturing, where asking "why?" repeatedly uncovers the root cause of a defect. The mechanic is similar — keep asking why — but the direction is completely different. Six Sigma points the question at broken processes. This points it at yourself: not to find what went wrong, but to discover what matters most.

It also draws from the means-ends abstraction hierarchy in Work Domain Analysis (Rasmussen 1986, Vicente 1999) — the insight that if a structured hierarchy can reveal the true purpose of a nuclear power plant, it can reveal yours too.

## License

MIT
