# The Why Tree

**The real outcome isn't a diagram. It's hearing yourself say what you couldn't articulate before.**

Most people arrive because something feels slightly off — a gap between how the days go and what actually matters, felt rather than named. Some come because something is changing and they want to understand what they actually want before committing to the next thing. Some did everything right and still feel hollow. Some are just curious what's underneath.

All of it is the right reason.

The Why Tree is a guided conversation — powered by Claude — that works differently from journaling or reflection. It moves in two directions: tracing *why* your activities matter to surface purposes you couldn't see from inside them, then asking *how else* you could serve those purposes to surface paths you hadn't considered. The structure is what makes it generative rather than just reflective.

## How it works

You start somewhere real. Claude doesn't open with "what are your goals?" — that question gets rehearsed answers. Instead it listens to what's actually on your mind, and follows the thread from there.

Then it walks you through two movements:

**Why Up** — *"Why does this matter to you?"* Then *"Why?"* of that answer. Each step moves from the specific toward something deeper — from "I keep working on this side project" to "I need to feel like I'm building something real."

**How Down** — *"What else could give you this?"* From any purpose you've surfaced, explore paths you hadn't considered — career changes, projects, life experiments that serve the same root.

By alternating these movements, patterns emerge: multiple interests pointing to the same core value, new paths to purposes you've already named, clarity about what's worth your energy and what isn't.

Every session ends with **one concrete experiment** — not a list of possibilities, but the single thing you'd most want to try today. Small enough to do, specific enough to mean something.

## What it looks like

Someone came in talking about FOMO and burnout. A few sessions later they'd traced it to something specific — and discovered five concrete practices that serve it, some they'd never thought to connect:

```
=== My Why Tree ===

  +-- [1] ^ feel secured / grounded in myself
        |-- [1.1] ~ helping people reclaim agency as AI grows
        |-- [1.2] v a sweaty run
        |-- [1.3] v sit with difficulty before reaching for relief
        |-- [1.4] v private discovery journaling
        +-- [1.5] v track concrete impact, not validation
```

## Across sessions

Your tree saves locally at `~/.whytree/` and grows over time. Come back when you've had new experiences, made a decision, or just have a new question. The tree is a living document — not a finished product.

## Your data

Everything you discover stays on your device. Node labels, answers, personal insights — none of it leaves your machine.

Two things can reach the developer, and only with your explicit involvement:

- **Anonymous usage metrics** — structural information only: how many nodes you created, how deep your tree went, session counts. Never any content — not your words, not your labels, not what you discovered. You're asked once at your first session and can say no.
- **Feedback** — only what you deliberately send via `/whytree-feedback`. Nothing from your tree is included unless you type it yourself.

If you said no to analytics and change your mind: `whytree analytics-on`. To opt back out: `whytree analytics-off`.

## Install

Tell Claude:

> Install whytree: run `git clone https://github.com/yijisoo/whytree.git ~/.claude/skills/whytree && cd ~/.claude/skills/whytree && ./setup` then add a "whytree" section to CLAUDE.md that lists the available skills: `/whytree` — a guided purpose-discovery session, and `/whytree-feedback` — send feedback to the developer. Then ask the user if they also want to add whytree to the current project so teammates get it.

That's it. Claude handles the rest.

## Start a session

Type `/whytree` in Claude Code. No prep needed — just answer honestly.

First-time users get a brief orientation. Returning users skip straight in.

## Manage your tree

```bash
whytree show              # Display your tree with node numbers
whytree nodes             # List all nodes with IDs and timestamps
whytree edit              # Interactive editor (arrow keys + Enter)
whytree rename 1.2 "..."  # Rename a node by number
whytree relink 1.2 1.1    # Move a node to a different parent
whytree remove 1.3        # Remove a node (children become roots)
whytree insights          # Show convergence analysis
whytree context 1.2       # Show context for a specific node
whytree purpose "..."     # Save a one-sentence synthesis
whytree stats             # Show tree statistics
```

## Give feedback

Type `/whytree-feedback` in Claude Code to share what worked, what didn't, or suggest a feature.

## Origin

The name overlaps with "Why Tree" in Six Sigma and lean manufacturing, where asking "why?" repeatedly uncovers the root cause of a defect. The mechanic is similar — keep asking why — but the direction is completely different. Six Sigma points the question at broken processes. This points it at yourself: not to find what went wrong, but to discover what matters most.

It also draws from the means-ends abstraction hierarchy in Work Domain Analysis (Rasmussen 1986, Vicente 1999) — the insight that if a structured hierarchy can reveal the true purpose of a nuclear power plant, it can reveal yours too.

## License

MIT
