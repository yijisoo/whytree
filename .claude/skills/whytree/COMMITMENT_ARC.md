# Commitment Arc Reference

After How Down enumeration is complete (minimum 2 How Downs recorded), run the Commitment Arc. This replaces generating a list — the goal is ONE experiment to try today.

**Step 1 — Selection:**
Ask: *"Of everything we've just named — which one feels most alive to you right now?"*
Do not present a numbered list. Let them name it. Add as how-down if not already in tree.

**Step 2 — Narrow to today:**
Ask: *"What's the simplest version of that you could actually do today? Not this week — today."*
Probe for specificity: a time, a place, a duration. "Think about it more" is not an experiment.
If specificity doesn't emerge after one probe, proceed with the vague framing rather than blocking progress. Specificity is preferred, not required.

**Step 3 — Root connection check (observational only):**
Call `mcp__whytree__nodes`. Identify the top Why node label.
Ask: *"Looking at [top Why node] — does this feel connected?"*
If yes: proceed.
If no: name it — *"I notice this doesn't obviously connect to [root]. That could be fine — or it might mean a different experiment would serve better. Which of the other How Downs felt closer to [root]?"*
Do NOT require connection. If user confirms the disconnected experiment anyway, proceed.

**Step 4 — Motivation in user's own words:**
Ask: *"What's your reason for wanting to try this today — not because the tree says so, in your own words?"*
Listen for genuine articulation. A paraphrase of the tree's framing is not enough.
If they articulate it clearly → this is the close signal. Proceed to Step 5.
If they seem uncertain or echo the tree → ask: *"What would make this feel worth doing — for you specifically, today?"*
If still no genuine motivation → offer: *"Would any of the other options feel more alive?"* Loop back to Step 1 with a different How Down. Do this once. If still no genuine motivation after second attempt, name it: *"It sounds like none of these are pulling you today — that's information too. The tree stays, and we can come back when something does."*

**Step 5 — Close:**
Record the experiment — only if it wasn't already added in Step 1. If the selected How Down already exists in the tree, skip the tool call to avoid duplicates. Otherwise call `mcp__whytree__how_down` with the root reference and experiment label.
Say: *"That's your experiment for today. Come back and tell me what happened — even if you didn't do it. That's data too."*

Motivation rating (1-5) — counselor signal only, not spoken unless useful:
Internally assess: does the user's articulation in Step 4 feel genuine? If it sounded like "I guess I should" rather than "yes, I want to," that's a 2-3. Do not proceed without genuine articulation regardless of what number the user would say.

**Step 6 — Optional feedback:**
*"If you want to say more about how this session went, /whytree-feedback is there."*
Do not push. One mention, then move on.
