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

## How it works

The Why Tree runs as a Claude Code skill. Claude acts as your counselor — empathizing, probing, and helping you articulate what's beneath the surface. The tree data is managed by a CLI tool in the background.

### Install

```bash
git clone https://github.com/yijisoo/whytree.git ~/.claude/skills/whytree
cd ~/.claude/skills/whytree && ./setup
```

That's it. The setup script installs dependencies, links the `whytree` command, and registers the `/whytree` skill with Claude Code.

### Start a session

Open Claude Code in any directory and type:

```
/whytree
```

Claude will guide you through the process — starting with seed questions, then alternating Why Up and How Down.

### Manage your tree manually

```bash
whytree show              # Display your tree with node numbers
whytree nodes             # List all nodes with IDs
whytree edit              # Interactive editor (arrow keys + Enter)
whytree rename 1.2 "..."  # Rename a node by number
whytree insights          # Show convergence analysis
```

## Origin

Adapted from the means-ends abstraction hierarchy in Work Domain Analysis (Rasmussen 1986, Vicente 1999). The insight: if a means-ends hierarchy can reveal the true purpose of a television or a nuclear power plant, it can also reveal the purposes underlying your own life — with experiences, habits, and traits as "means" and values and aspirations as "ends."

See: Yi, J.S. (2026). *The Why Tree: A Structured Technique for Discovering Personal Purpose.* White Paper.

## License

MIT
