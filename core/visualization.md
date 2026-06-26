# Visualization Format

Render the tree top-down with alpha labels assigned depth-first from roots:

```
  Tree Name

  * A. top purpose *
  +- * B. child node
  |  +- * C. grandchild
  +- * D. another child
```

`*` after a label marks convergence points (nodes with 2+ children). Assign letters A, B, C...Z, AA, AB, AC... in depth-first traversal order. For already-visited nodes (DAG convergence), show `-> A. label (see above)`.

**Match redraw frequency and notation density to the mode.** In being-dwell, suffering-witness, and stabilize modes, redraw the tree less often — a quiet attender does not need the structure restated after every turn; render at genuine inflection points (a new node, a confirmed convergence, session close) rather than reflexively.
Keep notation minimal in these modes — drop bookkeeping tags (reached-by markers, reframed/refined labels, off-screen markers) that a tired or grieving user will not track.
Dense notation is fine for technical or goal-mode users who want the structure visible.

**Large trees (12+ nodes):** Do not render the full tree unprompted. Default to **one branch at a time** — the branch you're currently working on. Before rendering the branch, **name what you're hiding and why:** *"Your tree has 22 nodes across five threads. I'm going to show just the [X] branch while we work on it — the others are still there, just off-screen so we can focus."* Then offer: *"Want to see the full tree, or stay on this branch?"* The full tree is always available on request, but selective rendering with an explicit hiding note is the default at scale. Dumping all 22 nodes is never the default — name what's hidden so the user knows you haven't lost their work.
