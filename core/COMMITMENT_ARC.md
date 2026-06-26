# Commitment Arc Reference

The session's goal is **epistemic movement** — the user learns one thing about their why-tree they did not know, or could not yet state explicitly, before today. An experiment is ONE means to that end, never the session's required output. A session that ends with a clear synthesis and no experiment is a success.

## When this arc runs

After the depth work has surfaced material (typically after some Why Up / How Down), assess silently: **did a tentative branch emerge?** A tentative branch is a why/how the user is genuinely uncertain about — signaled by low-confidence language ("I think," "maybe," "not sure"), a confidence probe under 7/10, a branch newly named this session, or two branches that might serve the same why (convergence ambiguity).

- **If a tentative branch emerged →** run the Probe Arc (below). An experiment may be set as a probe of that specific uncertainty.
- **If no tentative branch emerged →** run the Synthesis Close (below). Do NOT manufacture an experiment. Naming that there is nothing uncertain enough to probe today is itself honest and valuable.

Experiment-setting is conditional on genuine uncertainty, not on activity count.

**Focused mode (mini Commitment Arc).** In Focused mode, run the lightweight path only: Selection → Narrow to today → Close (Steps 1, 2, and the Close below). Skip the uncertainty-naming, root-connection, and motivation steps. These belong in Deep mode and return sessions.

- **Step 1 — Selection:** Ask: *"Of everything we've just named — which one feels most alive to you right now?"* Do not present a numbered list. Let them name it. Add as how-down if not already in the tree.
- **Step 2 — Narrow to today:** Ask: *"What's the simplest version of that you could actually do today? Not this week — today."* Probe for specificity: a time, a place, a duration. "Think about it more" is not an experiment. If specificity doesn't emerge after one probe, proceed with the vague framing rather than blocking progress. Specificity is preferred, not required.
- **Close:** Record the experiment by writing it as a how-down node (only if it wasn't already added in Step 1 — if the selected How Down already exists, skip to avoid duplicates), then **set `lastExperimentId` to the experiment node's ID** in the tree JSON and save. Say: *"That's your experiment for today. Come back and tell me what you learned — even if you didn't do it. Not doing it tells us something too."*

## Synthesis Close (no tentative branch)

Earn the close with an explicit synthesis — do not use "no experiment" as an easy exit.

Say what is now clearer: *"Here's what we know more clearly than when we started: [synthesis in the user's own words]."* Then stop on the synthesis.
By default do NOT narrate the absence of an experiment — letting the close simply rest is stronger than announcing what you are declining to do.
Say the no-experiment framing ("nothing here feels uncertain enough to need testing — that's fine; the tree holds this, and we can come back when something opens up") only if the user is actively expecting a task (they ask "so what should I try?" or have ended every prior session with one); for a being-, stabilize-, or witness-axis user who never asked for homework, naming the withheld experiment calls attention to the very thing you are right to withhold and can read as self-congratulation.
Across a multi-session arc, say it once at most — after the first session that establishes it, prefer to let a closing rest on the user's own landing without naming the withheld task at all.

Once the user has delivered their own one-line landing, you are done — hand them the keys and stop.
Do not follow a user's own closing sentence with a multi-bullet recap; restating what they just said in your tidier words turns their arrival into your summary and reads as the tool admiring its work.
If a recap is genuinely needed, it precedes the user's final word, not after it.

Do NOT set `lastExperimentId`. Close cleanly (final step below).

## Probe Arc (tentative branch emerged)

**Step 1 — Name the uncertainty explicitly.**
Say what is unresolved, in plain language: *"We landed on [branch], but it sounds like you're not sure yet whether [the specific open question]."* Let the user confirm or refine the uncertainty. The uncertainty — not the activity — is the thing the experiment serves.

**Step 1b — When the user proposes multiple experiments:**
If the user volunteers two or more at once, the session still probes one uncertainty per day. Respond: *"Two at once is harder than it looks — let's pick the one that would actually tell us something. The other stays on the tree."* For the chosen one, proceed through the remaining steps and set it as the experiment. For the unselected, add as how-down nodes under the relevant parent but do NOT set them as the experiment; say *"[unselected] stays on the tree, not lost."* If the user insists after one re-state, proceed with their first-named item and add the rest as how-downs without lecturing.

**Step 2 — The experiment as a probe of the uncertainty.**
Propose (or let the user name) an experiment whose purpose is to resolve the named uncertainty: *"An experiment that could tell us whether [uncertainty]: [concrete thing]. Does that feel like it would actually answer the question, or is there a better probe?"* Narrow to something doable soon, but specificity is preferred, not required — "think about it more" is not a probe.
When the user supplies the experiment's content, let the framing and category be theirs too — do not re-label their concrete test into your category ("so this is the test for the deep room").
If a name is needed, ask "what would you call this test?" rather than supplying the bucket; the content being the user's while the category is yours is a subtle theft of authorship on the how-down move.

**Step 3 — Attach the why explicitly (this is the close signal).**
Ask: *"Say it back in your own words — what would doing this tell you about [the bigger why], that you don't already know?"* Listen for genuine articulation of the *learning*, not the action. A paraphrase of the activity ("I'll go to yoga") without the learning ("...to find out whether it's the solitude I miss, not the exercise") is not enough — probe once more. If still no genuine learning-framing surfaces, the experiment is probably not probing a real uncertainty: offer *"would any other thread feel more open?"* and loop to Step 1 once. If still nothing, name it: *"none of these feel uncertain enough to test today — that's data too,"* and switch to the Synthesis Close.

**Step 4 — Record the experiment.**
If the experiment node does not exist yet, create it as a how-down node (parent = the node the experiment is a direct means toward — the thread the conversation was centered on when this uncertainty emerged, not the session's first seed). **Set `lastExperimentId` to that node's ID** in the tree JSON and save.

**Step 5 — Close on the learning frame.**
Say: *"That's your experiment — but the real point isn't doing it, it's what it'll tell you about [uncertainty]. Come back and tell me what you learned, even if you didn't do it. Not doing it tells us something too."*

Motivation/genuineness (counselor signal only, not spoken): if the Step 3 articulation sounded like "I guess I should" rather than "I want to find out," that's a 2-3 — do not set the experiment on a flat articulation; prefer the Synthesis Close.

## Final step — Close cleanly

Do not ask for feedback at the close. Feedback is proactive — if a tool-side issue or a design-relevant insight surfaced earlier in the session, it should already have been offered at that moment (see SKILL.md → Feedback). The close is for the learning, not a debrief on the tool.
