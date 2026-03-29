# Why Tree — Development Conversation

This document captures the conversation that shaped the current state of Why Tree: what was built, why, and in what order.

---

## The Starting Point

The user asked: *"I would like to spawn multiple AI agents who start a conversation with whytree and build their own whytree and provide feedback. What do you think about this idea?"*

The core question: could simulated users — each with a distinct persona and real emotional situation — stress-test a purpose-discovery CLI tool and generate actionable feedback?

The answer was yes. We isolated each agent using `HOME=/tmp/whytree-agent-X` to give them independent `~/.whytree/` directories, then ran 5 parallel agents per round, synthesized their feedback, implemented fixes, committed to git, and repeated.

---

## Score Progression

| Round | Average Score | Key Fix |
|-------|--------------|---------|
| R1 | 6.8 | Baseline assessment |
| R2 | 7.0 | Convergence language, synthesis structure |
| R3 | 7.2 | Inline node list, `insights` command reorder |
| R4 | 7.8 | First-answer challenge, `displayInsightsSynthesis` |
| R5 | 7.0 | Emotional pacing, safety layer, divergence reframe |
| R6 | 6.9 | Stable hash IDs (partial), bolder synthesis |
| R7 | 7.0 | Deepest root anchor, unreached thread, bridging question |
| R8 | 7.0 | Synthesis exercise, insights reorder, direction cue |
| R9 | 7.0* | Remove tree from insights, purpose command, synthesis anchor fix |

*Alex scored 8/10 in R9 — first 8 of the entire run. The variance is increasing, which suggests the improvements are landing for some users.

---

## Round-by-Round Findings

### Round 1 (agents: diverse first-timers)
- Convergence detection was hard to understand without explanation
- "Served by N means" language felt mechanical
- No narrative synthesis at the end — session ended without closure
- Node addressing via UUIDs was confusing

### Round 2 (after R1 fixes)
- Convergence language rewritten: "where N paths converge" / "likely a core value"
- Added `displayInsightsSynthesis` with reflection, divergence, and unexplored seeds

### Round 3 (after R2 fixes)
- Inline compact node list after each why-up/how-down — major UX improvement
- `insights` command reordered: tree → convergence → synthesis
- First-answer challenge prompt added: "Is that the public answer — or the real one?"

### Round 4 (agents: deeper personas)
- R4 average reached 7.8 — the peak before plateau
- First-answer challenge was the single most praised feature across all rounds
- Need identified: emotional pacing, reflection question reorder, partial convergence caveat

### Round 5 (after R4 fixes — 7 changes)
- Emotional pacing: detect emotional markers, add "(That's worth noting.)"
- First-answer variation: softer prompt when answer already emotionally specific
- Safety layer in init: "If anything surfaces that feels heavier than expected, it's okay to pause."
- Reflection reorder: "What are you not yet doing?" comes first
- Partial convergence caveat when unexplored seeds exist
- Underdeveloped seeds detection
- Early divergence signal at 3rd purpose root
- **Score dropped to 7.0 — the plateau began**

### Round 5–8 Plateau Analysis
All agents 7.0 despite real improvements. The ceiling wasn't friction — it was that the tool stopped just before interpretation. Every agent wanted the same thing: a synthesis sentence that names what all the threads have in common. The tool surfaced structure but not meaning.

### Round 6 (stable hash IDs)
- Critical fix: tree display now shows stable 6-char hash IDs (`[abc123]`) instead of positional numbers that shifted after every operation
- Simplify convergence insight; narrative synthesis leads in insights
- Divergence renamed "Unresolved Threads" with "you don't have to resolve it today" framing
- **Still 6.9 — close but not breaking through**

### Round 7 (synthesis anchor + unreached thread)
- Synthesis anchor changed from most-connected convergence to deepest purpose root
- Added "Unreached Thread" section: deep purpose nodes with no how-down
- Bridging question: "Is there something they all protect? All want? All fear losing?"
- How-down friction: "Does this action address the root belief, or work around it?"

### Round 8 (synthesis exercise)
- Added synthesis invitation: "Complete this sentence — All of these trace back to _____."
- Insights reordered: synthesis FIRST (before convergence points, structural analysis)
- Fixed "Unresolved Threads" contradiction (nodes with `*` were also listed as unresolved)
- Direction cue: tree header now shows `↑ purpose/why · ↓ means/how`
- Intellectualized answer detection: flag abstract-noun responses without first-person pronouns
- Session arc: "You've done real work here" when tree has 6+ nodes
- **Alex (R9) scored 8/10 — first breakthrough**

### Round 9 (remove tree from insights + purpose command)
- **Remove `displayTree` from `insights`** — synthesis was still buried after full tree reprint
- Fix synthesis anchor: use convergence×depth scoring (not just deepest root)
- Add `whytree purpose <sentence>` — user stores their own one-sentence synthesis
- Closing ritual: insights ends with "In one sentence: what are you building toward?"
- Lower divergence signal threshold from 3 to 2 threads
- How-down root-check only on first how-down (Yemi: "canned repetition")

---

## What the Agents Consistently Praised (Across All Rounds)

1. **"Is that the public answer — or the real one?"** — called out by nearly every agent as the single most valuable line in the tool
2. **Convergence detection with `*` markers** — "the moment the tree felt like it was doing real work"
3. **"That's worth noting."** — light-touch emotional pacing after emotionally weighted answers
4. **The tree structure itself** — watching purpose emerge from seeds felt generative, not extractive

---

## What the Agents Consistently Wanted (That Remains Partially Unresolved)

1. **A tool-generated synthesis sentence** — the CLI can surface structure but not semantic meaning; the current solution (synthesis exercise) asks the USER to complete the sentence
2. **Lateral node linking** — connect sibling purpose threads without forcing a new abstraction layer above them (multiple agents: Dmitri, Daniel, Mei, Kwame)
3. **Mid-session convergence prompt** — when 2+ threads exist mid-session, ask "do these feel connected to you?" (currently fires at 2 via divergence signal, but could be more interactive)
4. **How-down specificity** — push "when, with whom, in what form?" rather than accepting abstract means
5. **Closing ritual** — `whytree purpose` command added in Round 9; agents want more ceremony around it

---

## Current Tool Architecture

### `bin/whytree.js` (CLI entry point, ~475 lines)
All command handling. Key features:
- `init` — safety layer note, single-quote tip for special chars
- `seed` — adds seed node
- `why-up` — emotional marker detection, intellectualized answer detection, first-answer challenge, divergence signal at 2/3 threads, mid-session momentum beat at 3rd why-node, convergence announcement
- `how-down` — specificity nudge ("when, with whom, in what form?"), root-check on first how-down only
- `insights` — **synthesis first** (no tree reprint), then convergence points, structural analysis, closing synthesis ritual + `purpose` prompt
- `show` — displays tree + shows saved purpose if set
- `purpose <sentence>` — stores user-authored one-sentence synthesis
- `nodes` — full node list with stable hash IDs
- `stats`, `context`, `rename`, `relink`, `unlink`, `remove`, `edit`
- Analytics + feedback commands

### `src/display.js` (visualization + insights, ~324 lines)
- `displayTree` — ASCII tree with stable 6-char hash IDs (`[abc123]`), direction cue header
- `displayNarrativeSynthesis` — leads `insights`; anchor = convergence node scored by (childIds.length + depth); bold synthesis question
- `displayConvergenceInsight` — brief list of convergence points
- `displayInsightsSynthesis` — structural sections: Purpose Roots (with synthesis exercise), Unreached Thread, Worth Going Deeper, Unexplored Seeds
- `displayConvergenceInsight`, `displayTreeStats`, `displayNodeContext`, `displayWelcome`

### `src/tree.js` (data model, ~237 lines)
DAG structure. Key functions: `createTree`, `addSeed`, `whyUp`, `howDown`, `findConvergencePoints`, `buildNumbering`, `getDepth`, `removeNode`, `relinkNode`, `unlinkNodes`

### `src/store.js`
Persists trees to `~/.whytree/` as JSON files.

### `src/analytics.js`
Opt-in anonymous structural metrics (node counts, depth, convergence). No personal content.

---

## The Unbuilt Feature (Lateral Linking)

Seven different agents across rounds 7–10 asked for a way to connect two sibling purpose threads without forcing one to be a child of the other. The tree structure is a DAG — parents and children — but it can't represent "these two nodes are related without one being above the other."

A `whytree converge <id1> <id2> "reason"` command would:
- Create a new shared parent node labeled with the user's reason
- Link both nodes as children of that parent
- Surface the merged node as a new convergence point

This would be the most structurally significant addition remaining.

---

## The Score Ceiling

The tool has been stable at 7.0 average for 5 rounds (R5–R9), with individual scores ranging 6–8. The pattern: every agent confirms the structural elements work, then asks for the tool to complete the interpretive move it's been building toward.

The tool cannot semantically analyze node labels — it can't know that "I'm afraid I'll disappear" and "I want to prove coming back was worth it" are the same underlying fear. But it can:
1. Ask the user to complete the synthesis (current approach)
2. Route through Claude (the `/whytree` skill) where Claude can read the node labels and actually generate the synthesis

The CLI tool is designed to be driven by Claude as counselor. The `/whytree` skill is where the interpretive layer belongs — not in the CLI itself.

---

*Generated from conversation starting 2026-03-30*
