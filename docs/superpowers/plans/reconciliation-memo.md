# Reconciliation memo (Spec 1, Task 1)

## Summary for approval

**Files compared:** SKILL.md, PROBE_PATTERNS.md, COMMITMENT_ARC.md, SEED_QUESTIONS.md, READING.md

**Result:** Only two files diverge — SKILL.md and COMMITMENT_ARC.md.
PROBE_PATTERNS.md, SEED_QUESTIONS.md, and READING.md are byte-identical across both repos.

**Divergence counts:**

- SKILL.md: web is 62 lines longer (536 vs 474).
  Chunks: ~15 meaningful divergences.
- COMMITMENT_ARC.md: web is 14 lines longer (50 vs 36).
  Chunks: ~3 meaningful divergences.

**Proposed actions:**

- Back-port to skill repo (WEB): **2 chunks** — coaching refinements tuned on the web side that improve counselor technique without adding any platform binding.
- Leave web-only, do not back-port (WEB-ONLY): **16 chunks** — all tool-call mechanics, session-context XML preamble, Morning bridge with memories subsystem, onboarding-context integration, tree_delta/partial_turn_recovery fields, `propose_friction` tool, `note_memory`/`note_episode` tools, tentative-branch tagging, and the web Commitment Arc Probe Arc.

**Judgment calls for author confirmation (flagged below):**

1. **SKILL.md "Know when to stop asking" (web rule → skill rule):** The web version has a concrete 3-rule formula (5 consecutive question-only turns → synthesize; message length drops by half → close; same theme 3+ messages → name it). The skill version has a softer, judgment-based version. The web rules are more precise and would improve skill-repo sessions — but they're also more brittle (message length counting is harder for a counselor with no turn-log). Proposing **WEB** (back-port) but flagging for author confirmation.

2. **SKILL.md "Follow the user's language" (Korean block):** The web version has a longer block including `user_locale` rules, how the locale governs only the greeting, 존댓말 mandate, and a strict prohibition on recalling `user_locale` mid-session. The skill version is shorter and omits the 존댓말 mandate and locale-governance rules. These are coaching refinements with no platform binding — proposing **WEB** (back-port). But the `user_locale` field itself comes from the web's `<session-context>` block and doesn't exist in the skill preamble, so the locale-governance rule would need slight re-wording on back-port. Flagging for author decision on exact wording.

3. **COMMITMENT_ARC.md complete rewrite:** The skill repo has a 5-step linear flow; the web repo has a richer Probe Arc / Synthesis Close split, tentative-branch gating, `set_experiment` tool calls, `learning_goal` argument, and machine-readable `<!-- tentative: ... -->` tag. The tool-call mechanics are WEB-ONLY. But the Probe Arc structure (name the uncertainty → experiment as probe of uncertainty → attach the why → close on learning frame) is a genuine coaching refinement over the skill repo's simpler "pick one, narrow to today" flow. Proposing: Probe Arc logic = WEB (back-port prose, drop tool calls); Synthesis Close = WEB (back-port); `set_experiment` call + `learning_goal` arg + tentative tag = WEB-ONLY. This is the largest judgment call — flagging for author confirmation before any editing.

---

## Divergence table

| File | Chunk (web lines) | Divergence | Source of truth | Reason |
|---|---|---|---|---|
| SKILL.md | web 1 | `<!-- version: stage3 -->` HTML comment | WEB-ONLY | Web versioning header; skill repo uses YAML frontmatter with name/description/user_invocable — both are correct for their platform |
| SKILL.md | web 14 | "Never show raw JSON, internal IDs, or tree-structure prose" — web says "The tree is your working memory; the user sees your words and the tree visualization the web app renders. Never write out a tree in ASCII, never paste a node id, never describe the tree's shape…" vs skill's shorter version | WEB-ONLY | The prohibition on ASCII trees and tree-shape descriptions is web-specific (the web app renders the tree; skill repo counselor renders ASCII trees itself) |
| SKILL.md | web 18–19 | "After every tree modification: 1. The web app handles tree rendering automatically via `tree_delta` events, plus a yellow flash on freshly added nodes…" | WEB-ONLY | `tree_delta` events and yellow flash are web-platform rendering mechanics |
| SKILL.md | web 26–27 | "Slow down" and "Don't hand interpretations" — web uses "the user" throughout; skill uses "someone" / "them" (gender-neutral). Web also has "usually a metaphor, an inversion" in the recognition-breathe rule | WEB | Coaching tone; the "metaphor, inversion" specificity is a refinement. Skill repo should adopt the "usually a metaphor, an inversion, or a sentence they could not have written before" phrasing |
| SKILL.md | web 36–38 | "Know when to stop asking" — web has 3 concrete rules (5-turn synthesis cap; message-length halving; 3+ theme recurrences); skill has softer version | WEB | Coaching precision — see judgment call 1 above |
| SKILL.md | web 41–42 | "Follow the user's language" — web has `user_locale` governance, 존댓말 mandate, locale-after-greeting prohibition; skill has shorter version | WEB (partial) | 존댓말 mandate and "never recall locale mid-session" are coaching quality; `user_locale` field reference is web-specific preamble — see judgment call 2 |
| SKILL.md | web 49–58 | "Respect the tense the user has anchored" + verb-tense slip rules + disallowed slips table | WEB | Coaching refinement — tense-slip prevention is high-value technique with no platform binding. Should back-port. |
| SKILL.md | web 72–115 (tree structure / tool calls) | "Tree structure (read-only context)", `<session-context>` block, tree mutations via tool calls (`add_seed`, `why_up`, `how_down`, `converge`, `rename`, `remove`, `set_current_node`, `set_experiment`, `set_purpose`), when to call a mutating tool, tool sequencing rules, `tree_delta_since_last_turn`, no-duplicate-labels rule, Connection check | WEB-ONLY | All tree mutations happen through tool calls in web; skill repo manages JSON files directly via Bash. The Connection check technique prose (web 167–197) is coaching refinement but is deeply embedded in tool-call context — see note below |
| SKILL.md | web 208–409 (Morning bridge section) | Full Morning bridge: `LAST_SESSION` block, `<memories>` block, soft-attribution rules, experiment-temporal-check, session-note llm_synthesis, `tree_delta_since_last`, gap-tone table, note on recurring themes, one-time disclosure | WEB-ONLY | Cross-session memory subsystem (`<memories>`, `note_memory`, `note_episode`, `LAST_SESSION`) is entirely web-platform. Skill repo uses SESSION_GAP from preamble.sh without deep memory. |
| SKILL.md | web 412–428 (NEW_USER onboarding-context block) | Web's NEW_USER block assumes `<onboarding-context>` is present; the 3-beat first-turn rule (reflect tension → seed → one probe); "do NOT explain how the Why Tree works"; no time-check question | WEB-ONLY | `<onboarding-context>` is a web server injection. Skill repo does its own full 6-beat onboarding (mechanism, example, permission, time check, roadmap, pacing, feedback). Skill version is correct for its platform. |
| SKILL.md | web 436 | "`<onboarding-context>` present → skip Opening Question" gate | WEB-ONLY | References web server injection not present in skill repo |
| SKILL.md | web 445–456 (Return Check-in tone table) | Web table has richer uncertainty-framing templates ("last time the open question was whether [uncertainty]…"); skill table has simpler "did [experiment] happen" templates | WEB | Coaching refinement — "lead with the learning, not just whether it happened" is a meaningful improvement. Propose back-porting the uncertainty-framing language. |
| SKILL.md | web 462 | "Lead with the learning — what the experiment was meant to reveal" rule | WEB | Direct coaching improvement over skill's simpler "one question, warm, curious" |
| SKILL.md | web 480–506 (Memory section) | `note_memory`, `note_episode` tool calls, `user_fact`/`preference`/`reference` taxonomy, episode criteria, one-time disclosure, meaning-proximity criterion, tree isolation rule | WEB-ONLY | Memory tool calls are web-platform. Skill repo has no persistent memory subsystem beyond the tree JSON. |
| SKILL.md | web 235–241 (propose_friction tool) | `propose_friction` tool — when to call, hard rules, writing it, surfacing it | WEB-ONLY | Tool call; web-platform only |
| COMMITMENT_ARC.md | web 1–3 (opening frame) | Web: "The session's goal is epistemic movement…An experiment is ONE means to that end, never the session's required output. A session that ends with a clear synthesis and no experiment is a success." vs skill's "After How Down enumeration is complete (minimum 2 How Downs recorded), run the Commitment Arc." | WEB | Coaching philosophy — the epistemic-movement framing and "no experiment = success" principle are important counselor priors. Should back-port. |
| COMMITMENT_ARC.md | web 5–14 (when arc runs / tentative branch gate) | Web: tentative-branch gating logic — arc only runs if a tentative branch emerged; Synthesis Close if no tentative branch | WEB (partial) | The tentative-branch concept (confirmed vs. tentative based on confidence language, confidence probe <7/10, etc.) is coaching refinement. But `<!-- tentative: nodeId=... -->` tag and `set_experiment` with `learning_goal` arg are WEB-ONLY tool mechanics. |
| COMMITMENT_ARC.md | web 15–34 (Synthesis Close) | Web: Synthesis Close section — "earn the close with explicit synthesis; do NOT manufacture an experiment; do NOT call set_experiment; name what is clearer; close cleanly" | WEB | Coaching refinement — Synthesis Close is valuable even for skill repo. Back-port prose without `set_experiment` reference. |
| COMMITMENT_ARC.md | web 36–46 (Probe Arc steps 1–2) | Web: "Name the uncertainty explicitly" + experiment-as-probe-of-uncertainty framing; Step 1b handling multiple experiments | WEB | Core technique improvement — naming the uncertainty first, then proposing the experiment as a probe of that uncertainty, is a meaningful upgrade over skill's "which feels most alive?" opener. Back-port prose. |
| COMMITMENT_ARC.md | web 47–52 (Step 3 — attach the why) | Web: "Say it back in your own words — what would doing this tell you about [the bigger why] that you don't already know?" — requires learning articulation, not just action paraphrase | WEB | Coaching refinement — "learning frame not action frame" is better than skill's "what's your reason for wanting to try this." Back-port. |
| COMMITMENT_ARC.md | web 53–58 (Step 4 — set_experiment tool call + tentative tag) | `set_experiment` call, `learning_goal` arg, `<!-- tentative: nodeId=... reason=... -->` machine-readable tag | WEB-ONLY | Tool call and harness-only comment; skill repo records experiment by setting `lastExperimentId` in the JSON directly |
| COMMITMENT_ARC.md | web 59 (Step 5 close) | Web Step 5: "Come back and tell me what you learned, even if you didn't do it. Not doing it tells us something too." vs skill's "Come back and tell me what happened — even if you didn't do it. That's data too." | WEB | Minor coaching refinement — "what you learned" > "what happened" because it reinforces the epistemic frame. Back-port. |
| COMMITMENT_ARC.md | web 61–62 (Step 6 + motivation note) | Web Step 6 motivation note: "if Step 3 sounded like 'I guess I should' rather than 'I want to find out'… do not set the experiment on a flat articulation; prefer the Synthesis Close." | WEB | Counselor signal — back-port the motivation-genuineness check (drop the `set_experiment` reference, keep the "prefer Synthesis Close" language) |

---

## Connection check note (SKILL.md web 167–197)

The web version's "Connection check" section (when an incident traces to a why-node already on the tree, name one candidate connection before moving to the next probe) is embedded in the tool-call section but the technique itself has no platform binding.
The skill repo has no equivalent.
This is a significant coaching refinement — proposing **WEB** (back-port), but the gates must be reworded slightly: "already in the `tree` block" → "already in the tree file."
Flagging for author confirmation since it's a net-new section being added to the skill repo, not a refinement of an existing one.

---

## Verb-tense slip note (SKILL.md web 49–58)

The web version has a detailed tense-slip prevention section including disallowed-slips table and `current_time`-based tense resolution.
The skill repo has no equivalent.
This is coaching quality with direct applicability to the skill repo (Korean sessions especially).
Proposing **WEB** (back-port entire section as-is), but `current_time` comes from the preamble.sh output in the skill repo, so the reference is valid on both platforms.
