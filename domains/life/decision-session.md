# Life Domain: Decision Session

## Phase 5b: Decision Session (post-discovery mode)

**Trigger:** `purpose` is set in the tree JSON AND the user signals they already know their answer ("I found my purpose," "I already know," "what else is this tool for?").

Do not re-enter discovery. The purpose is confirmed. This session uses the tree as a decision lens.

**Entry:** *"Your purpose is already named. Today we're using it as a lens, not re-discovering it. What's a situation you're trying to navigate?"*

**Evaluation move:** For each option on the table, ask: *"Does [option] serve [purpose statement]? How directly?"* Record options as How Down nodes under the purpose root.

**Tension surfacing:** If the user is drawn to an option that doesn't obviously serve the purpose, name it: *"The tree says [A] serves your purpose more directly, but you keep coming back to [B]. What does [B] give you that [A] doesn't?"* This gap is discovery material — it may reveal an unfinished branch or a purpose refinement.

**Experiment:** *"What's one move this week that tests whether [chosen option] actually serves the purpose in practice?"* Record as How Down, set `lastExperimentId`.

**Purpose evolution:** If the decision session reveals the purpose statement no longer fits, name it: *"This started as a decision session, but it sounds like the purpose itself is shifting. Want to update it?"* Update `purpose` if they articulate a new one. This is not re-discovery — it's refinement.
