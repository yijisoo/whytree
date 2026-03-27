# The Why Tree

**You know you want more from life. You just can't say what.**

You're a student staring at a major selection form, unable to explain why one path feels right and another doesn't. You're a solopreneur three pivots in, still not sure which problem is truly *yours* to solve. You're someone who has plenty of interests but no coherent story connecting them.

The Why Tree is a guided conversation — powered by Claude — that helps you discover what actually matters to you and why.

## How it works

You start with something concrete: an activity you love, a project you keep coming back to, a topic that won't leave your head. Then Claude walks you through two movements:

**Why Up** — *"Why does this matter to you?"* Then *"Why?"* of that answer. Each step moves from the specific toward something deeper — from "I like cooking" to "I need to nourish the people I love."

**How Down** — *"What are other ways to achieve this?"* From any purpose you've surfaced, explore alternative paths you hadn't considered — career changes, side projects, life experiments.

By going up and back down, patterns emerge:

- **Convergence** — multiple interests trace back to the same core value. That's a signal.
- **New paths** — purposes you've already named can be served by means you've never tried.
- **Clarity** — the things competing for your energy either connect to the same root or they don't.

The real outcome isn't the diagram. It's hearing yourself say, out loud, what you couldn't articulate before.

## Who this is for

- **Students** figuring out what to study, what career to pursue, or why nothing on the menu feels right
- **Solopreneurs and indie builders** who need to stop chasing every opportunity and find the one problem that's truly theirs
- **Career changers** who know they want something different but can't name what
- **Anyone** who has felt the gap between "I'm busy" and "I'm fulfilled"

You don't need to have your life figured out. You just need 20 minutes and an honest conversation.

## Install

Tell Claude:

> Install whytree: run `git clone https://github.com/yijisoo/whytree.git ~/.claude/skills/whytree && cd ~/.claude/skills/whytree && ./setup` then add a "whytree" section to CLAUDE.md that lists the available skill: `/whytree` — a guided purpose-discovery session using the Why Tree technique. Then ask the user if they also want to add whytree to the current project so teammates get it.

That's it. Claude handles the rest.

## Start a session

Type `/whytree` in Claude Code. Claude guides you through a purpose-discovery conversation — no prep needed, just answer honestly.

Your tree is saved locally at `~/.whytree/` and grows across sessions. Come back when you've had new experiences or new questions.

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

If the name sounds familiar — yes, the "Why Tree" comes from the same root as the 5 Whys and Why-Why Analysis in Six Sigma and lean manufacturing, where asking "why?" repeatedly uncovers the root cause of a defect. The Why Tree takes that same mechanic and points it inward: instead of diagnosing what went wrong with a process, you're discovering what matters most in your life.

It also draws from the means-ends abstraction hierarchy in Work Domain Analysis (Rasmussen 1986, Vicente 1999) — the insight that if a structured hierarchy can reveal the true purpose of a nuclear power plant, it can reveal yours too.

## License

MIT
