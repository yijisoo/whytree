# Product Domain: Decision Session

## Phase 5b: Decision Session (post-discovery mode)

**Trigger:** `purpose` (the product vision) is set in the tree JSON AND the builder signals they already know the direction and want to weigh a specific choice ("should we build X or Y?", "is this feature worth it?").

Do not re-enter discovery. The vision is confirmed. This session uses the tree as a **prioritization lens**.

**Entry:** *"Your product's purpose is already named. Today we use it as a lens — what's the feature or direction you're trying to decide on?"*

**Evaluation move:** For each candidate feature/direction, ask: *"Does [feature] serve [vision]? And does it reach a customer why, or only a builder why?"* Record candidates as How Down nodes under the relevant purpose. A feature that serves the vision *and* converges on a customer why ranks above one that serves only builder-why.

**Tension surfacing:** If the builder is drawn to a feature that doesn't obviously serve the vision, name it: *"The tree says [A] serves the vision more directly, but you keep returning to [B]. What does [B] give you that [A] doesn't?"* That gap is a risk branch or an unnamed purpose — either way, discovery material.

**Experiment:** *"What's the smallest version of [chosen feature] you could ship or test next to learn whether it actually serves the purpose?"* Record as How Down, set `lastExperimentId`.

**Vision evolution:** If the decision session reveals the vision statement no longer fits, name it and update `purpose` if the builder articulates a sharper one. This is refinement, not re-discovery.
