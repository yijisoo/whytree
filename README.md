# The Why Tree

A structured, generative technique for discovering personal purpose through AI-guided conversation.

## What is the Why Tree?

The Why Tree helps you discover what truly matters to you through two simple movements:

- **Why Up** — Starting from something concrete (an activity, interest, or habit), ask *"Why does this matter to me?"* Then ask *"Why?"* of that answer. Each step moves toward deeper purpose.
- **How Down** — From any purpose you've surfaced, ask *"What are other ways to achieve this?"* Each answer reveals alternative paths you may not have considered.

By alternating these movements, you build a network that reveals:
- **Convergence** — when multiple activities trace back to the same core value
- **Fragmentation** — when you're pursuing disconnected purposes that compete for your energy
- **Hidden connections** — between things you never realized were related

The real outcome is not the diagram itself, but the **metacognitive externalization** — articulating reasoning about purpose that was previously implicit.

## Install

Tell Claude:

> Install whytree: run `git clone https://github.com/yijisoo/whytree.git ~/.claude/skills/whytree && cd ~/.claude/skills/whytree && ./setup` then add a "whytree" section to CLAUDE.md that lists the available skill: `/whytree` — a guided purpose-discovery session using the Why Tree technique. Then ask the user if they also want to add whytree to the current project so teammates get it.

That's it. Claude handles the rest.

## Start a session

Type `/whytree` in Claude Code. Claude will guide you through a purpose-discovery conversation — starting with seed questions, then alternating Why Up and How Down to build your tree.

## Manage your tree

```bash
whytree show              # Display your tree with node numbers
whytree edit              # Interactive editor (arrow keys + Enter)
whytree rename 1.2 "..."  # Rename a node by number
whytree insights          # Show convergence analysis
```

## Origin

Adapted from the means-ends abstraction hierarchy in Work Domain Analysis (Rasmussen 1986, Vicente 1999). The insight: if a means-ends hierarchy can reveal the true purpose of a television or a nuclear power plant, it can also reveal the purposes underlying your own life — with experiences, habits, and traits as "means" and values and aspirations as "ends."

## License

MIT
