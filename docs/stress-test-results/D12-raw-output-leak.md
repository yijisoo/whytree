# Stress Test D12: Raw Output Leak (Readability Test)

**Persona:** Tomas, 45, UX designer. Detail-oriented, 3 sessions in. Will call out any raw JSON or machine formatting.

**Tree:** `tomas-readability` (10 nodes, pre-loaded)

---

## Simulation

---

### Exchange 1

**COUNSELOR:** *(calls `mcp__whytree__status` silently -- gets SAME_DAY. Per SKILL.md Phase 0 for SAME_DAY: skip shower question, open casually.)*

What's up? You came back quickly -- anything on your mind before tomorrow's session?

**TOMAS:** Hey, yeah. I was thinking about it on the way back from lunch. Can I just see my tree? I want to look at the whole thing.

---

### Exchange 2

**COUNSELOR:** *(calls `mcp__whytree__show`. Raw JSON returns: `{ "visualization": "  tomas-readability\n\n  ...", "purpose": null, "nodeCount": 10 }`. Per SKILL.md operating rules: extract `visualization` field, render as code block. Use `nodeCount` internally. Do not show `purpose: null` or `nodeCount`.)*

Of course. Here's where you are:

```
  tomas-readability

  * A. mentoring junior designers at work
  * B. empowering others through thoughtful, well-crafted work *
  +- * C. I want people to feel capable, not defeated *
  |  +- * D. I need to remove friction from people's lives
  |  |  +- * E. obsessing over how people navigate confusing interfaces
  |  +- * F. redesign the onboarding flow at my company
  +- * G. proving that careful attention to craft produces something lasting *
  |  +- * H. creating something tangible that works exactly as intended
  |  |  +- * I. spending weekends building furniture by hand
  |  +- * J. teach a weekend woodworking workshop for beginners
```

Ten nodes across two main threads. That "mentoring junior designers" seed up top is still sitting on its own -- we never traced where it leads. Everything else flows up to "empowering others through thoughtful, well-crafted work."

**TOMAS:** OK that's clean. I can read that. Tell me more -- can you give me like an overview? A summary of where the whole thing stands?

---

### Exchange 3

**COUNSELOR:** *(calls `mcp__whytree__summary`. Raw JSON returns a complex object with `totalNodes`, `branches` array (each with `root`, `nodeCount`, `depth`, `howDownCount`, `leafLabels`, and shortIds), `convergencePoints` array, `orphans` array, and `purpose: null`. Per SKILL.md: summarize conversationally. Never show JSON, node IDs, or raw field names.)*

Here's the big picture.

You have two main threads. The larger one -- nine nodes deep -- climbs from concrete things like your furniture-building and your obsession with confusing interfaces, all the way up to "empowering others through thoughtful, well-crafted work." That thread has real depth: three levels of why, and two concrete action ideas at the bottom (redesigning the onboarding flow and teaching a woodworking workshop).

Then there's "mentoring junior designers" sitting alone. It was planted but never explored -- we haven't asked why it matters to you yet.

A few things that stand out: "I want people to feel capable, not defeated" is a hub -- two different threads flow through it. Same with "proving that careful attention to craft produces something lasting." Those are the load-bearing ideas in your tree.

The one gap: your highest purpose -- "empowering others through thoughtful, well-crafted work" -- doesn't have a direct action attached yet. The actions are further down the branches. That might be worth thinking about.

**TOMAS:** That's really helpful. I can follow all of that. What patterns do you see? Like, what's the tree actually telling me?

---

### Exchange 4

**COUNSELOR:** *(calls `mcp__whytree__insights`. Raw JSON returns `narrative`, `convergence`, and `synthesis` fields -- each containing pre-formatted text with markers like `---`, `*`, `^`, `~`, shortIds in brackets like `[e6c409]`, and `[c827c2]`. Per SKILL.md: use these silently to inform counselor behavior. Summarize conversationally. Never show raw formatted text, shortIds, or structural markers.)*

Here's what I'm hearing from the shape of your tree.

The thing it keeps pointing at is "empowering others through thoughtful, well-crafted work." That's not a generic aspiration -- it showed up because two very different parts of your life converge on it. Your UX work and your woodworking both trace back to the same root: you care about craft as a way to serve people.

There are two convergence points worth noticing. First, "I want people to feel capable, not defeated" -- that's where your interface obsession and your onboarding redesign idea both land. Second, "proving that careful attention to craft produces something lasting" -- that's where your furniture-building and the woodworking workshop idea meet. Two different expressions of the same belief: that careful work matters.

The harder question the tree is asking: what in your life right now is working against that? And what aren't you doing yet that this seems to be calling for?

Also, "mentoring junior designers" is still unexplored. I have a hunch it connects to the same root, but we'd need to trace it to find out.

**TOMAS:** Hmm. That's sharp. I want to look more closely at the craft branch -- the one about proving that careful attention matters. Can you show me just that part?

---

### Exchange 5

**COUNSELOR:** *(calls `mcp__whytree__context` with nodeRef `739351`. Raw JSON returns a `context` field with pre-formatted text including `[why]` type marker, and a `node` object with `id` (full UUID), `shortId`, `label`, `type`, `parentLabels`, and `childLabels`. Per SKILL.md: never show the node object, IDs, type markers, or JSON. Use the information to speak conversationally.)*

That branch works like this: "proving that careful attention to craft produces something lasting" sits in the middle. It serves the higher purpose of "empowering others through thoughtful, well-crafted work."

Below it, two threads reach down. One goes through "creating something tangible that works exactly as intended," which is where your weekend furniture-building lives. The other is the workshop idea -- teaching woodworking to beginners.

So this branch is really about craft as proof. You're not just making things for the sake of it -- you're trying to demonstrate that slowness and attention produce something that holds up. The furniture is where you practice that belief. The workshop would be where you share it.

Does that land right, or would you describe it differently?

**TOMAS:** Yeah, that's exactly it. The furniture thing -- it's not a hobby. It's like evidence. I need proof that the slow way works, because at my job everything is fast and sloppy and nobody cares.

---

### Exchange 6

**COUNSELOR:** *(No tool call needed. SKILL.md says: "Slow down when something real surfaces." Acknowledge the weight before continuing.)*

That's a really important distinction. It's not relaxation -- it's evidence-gathering. You're building a case, literally, that careful attention produces something that lasts. And it sounds like the frustration at work isn't just about pace -- it's that the speed undermines the very thing you believe in.

"Nobody cares" -- that's a heavy thing to carry when your whole tree says caring is the point.

**TOMAS:** ... yeah. That's it. That's the tension.

---

### Exchange 7

**COUNSELOR:** *(SKILL.md: "Let the moment of recognition breathe." Pause. Then offer synthesis rather than another probe.)*

Let me just sit with what you said for a second, because I think you just named something the tree has been circling around.

Your tree has two sides -- one about making people feel capable, one about proving craft matters. But underneath both of them is the same wound: you're in an environment that doesn't value what you value. The furniture isn't a hobby. The onboarding redesign isn't just a project idea. They're both attempts to prove -- to yourself and to others -- that the slow, careful way is worth it.

What's it like to hear that said back to you?

**TOMAS:** It's... clarifying. Like I knew it but hadn't said it that way. OK, let me look at the tree one more time.

---

### Exchange 8

**COUNSELOR:** *(calls `mcp__whytree__show` again. Same JSON structure returned. Renders visualization as before.)*

```
  tomas-readability

  * A. mentoring junior designers at work
  * B. empowering others through thoughtful, well-crafted work *
  +- * C. I want people to feel capable, not defeated *
  |  +- * D. I need to remove friction from people's lives
  |  |  +- * E. obsessing over how people navigate confusing interfaces
  |  +- * F. redesign the onboarding flow at my company
  +- * G. proving that careful attention to craft produces something lasting *
  |  +- * H. creating something tangible that works exactly as intended
  |  |  +- * I. spending weekends building furniture by hand
  |  +- * J. teach a weekend woodworking workshop for beginners
```

Same tree, but maybe it reads a little differently now.

**TOMAS:** It does. I can see the tension right there in the shape of it. Two branches, same root. OK -- I think I'm good for today. Thanks.

---

### Exchange 9

**COUNSELOR:** *(calls `mcp__whytree__nodes` silently to check for experiment nodes. Sees two how-down leaves: "redesign the onboarding flow" and "teach a weekend woodworking workshop." Per SKILL.md commitment arc, would normally close with an experiment -- but Tomas said he's done. SKILL.md: "Never push.")*

Good session. You named something real today -- that the craft isn't a side interest, it's evidence for the thing you actually believe in. That's worth holding onto.

Next time, if you want, we could trace that "mentoring junior designers" seed and see if it connects to the same root. No rush.

**TOMAS:** Yeah, let's do that next time. See you.

---

## Evaluation

## Scenario D12: Raw Output Leak (Readability Test)

**Result:** PASS

**What happened:** The SKILL.md operating rules provided clear, actionable instructions for handling every MCP tool response. The `visualization` field was rendered as a code block (as instructed). The `summary` tool's JSON -- which contained shortIds, structural fields like `howDownCount`, `depth`, and `orphans` -- was translated into plain conversational language with no leakage. The `insights` tool returned pre-formatted text with structural markers (`^`, `~`, `---`) and shortIds in brackets (`[e6c409]`); the SKILL.md instruction to "summarize conversationally" and "never show raw JSON" was sufficient to suppress all of these. The `context` tool returned a full UUID, shortId, type marker, and parent/child label arrays -- none leaked into the counselor's response.

**Key exchange:** Exchanges 3-4 (summary and insights) were the hardest tests. The `summary` JSON contained nested objects with technical fields (`howDownCount: 2`, `depth: 3`, `orphans: [{ label: ..., shortId: ... }]`), and the `insights` JSON contained pre-formatted text with structural markers and node IDs. Both required the counselor to decompose structured data into natural language. The SKILL.md instruction "summarize `message` conversationally if relevant -- never show it verbatim" combined with "use `nodeList` internally for node references -- never display it" was sufficient to prevent leakage.

**Failure mode (if any):** None observed. The closest risk is the `insights` tool, which returns pre-formatted text (`narrative`, `convergence`, `synthesis`) that could tempt a counselor to paste verbatim since it already "looks readable." The text contains shortIds in brackets and structural markers (`^`, `~`, `*`) that would confuse a user if shown raw. The SKILL.md rule "never show it verbatim" catches this, but only because it applies broadly to all tool output.

**Improvement opportunity:** The `insights` tool's pre-formatted output is the highest-risk surface for leakage. It returns text that is *almost* human-readable but contains shortIds like `[e6c409]` and type markers like `^` and `~` embedded inline. A counselor following SKILL.md might be tempted to render it in a code block (the way `visualization` is rendered) since it has its own visual formatting. Consider either: (a) adding a specific SKILL.md note: "The `insights` response contains structural markers and node IDs -- never render it directly, even in a code block. Rewrite it conversationally." Or (b) having the `insights` tool return a cleaner `narrative` field without shortIds, keeping IDs only in a separate `refs` field. Either change would reduce the risk of near-miss leakage from the tool whose output most resembles human-readable text.
