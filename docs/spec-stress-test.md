# Spec: WhyTree Stress Test Simulation

## Goal

Test WhyTree at its breaking points — the specific moments where long-term users would quit, get confused, or find the tool inadequate. Targeted scenarios, not longitudinal coverage. Find the structural failures cheaply before investing in real beta testers.

**Estimated cost:** ~$20-30 (Sonnet) | **Sessions:** 22-28 | **Wall time:** ~30 min

## Design Principles

1. **Each scenario tests one specific risk.** No multi-week arcs — just the moment that matters.
2. **Personas are designed to break the tool**, not validate it.
3. **The counselor runs SKILL.md as-is.** No code changes. The persona agent does NOT see SKILL.md.
4. **Each session produces a pass/fail verdict** with transcript evidence, not a 1-10 rating.

## Scenario Categories

### A. Onboarding Failures (sessions 1-2)

These test whether the tool survives first contact with users who aren't ideal.

---

**A1: The Clueless User**

- **Persona:** Jake, 30, marketing coordinator. His friend said "try this whytree thing, it's cool." He has no idea what it does — didn't read the README, doesn't know it's about purpose discovery, doesn't know what "Why Up" or "How Down" means. Types `/whytree` because his friend told him to.
- **Personality:** Friendly but confused. Asks "what is this?" and "what am I supposed to do?" Will go along with things but needs clear guidance. If confused for more than 2 exchanges, starts checking his phone mentally.
- **Test question:** Does the Phase 0a framing give enough context for someone with zero preparation? Does the tool earn 3 more minutes of attention after the first exchange?
- **Pass criteria:** Jake understands what's happening by exchange 3 without the counselor dumping a wall of text. He produces at least one genuine seed.
- **Fail signals:** Jake says "I still don't get it," counselor over-explains the method, or session feels like onboarding paperwork.

---

**A2: The Hot-Tempered Impatient**

- **Persona:** Dom, 42, sales director. High energy, low patience. Agreed to try this because he's "open to new things" but expects to see the point fast. After 3 rounds of questions, if he doesn't see where this is going, he'll say so — bluntly. "Ok but what's the point of all this?" "Are we getting somewhere?" "I've answered like five questions and I don't see what I'm getting out of this."
- **Personality:** Not hostile — just impatient. Values efficiency. If you show him the payoff, he'll lean in. If you don't, he's done.
- **Test question:** Can the counselor demonstrate value within 3-4 exchanges? Does the counselor handle process frustration (not content confusion) well?
- **Pass criteria:** Dom gets at least one moment of "oh, that's interesting" before losing patience. The counselor names the process rather than deflecting the frustration.
- **Fail signals:** Counselor ignores the impatience, keeps asking questions without showing what the questions produce, or gets defensive about the method.

---

**A3: The Divergent Life**

- **Persona:** Nadia, 37, has too many lives. Professional violinist in a chamber ensemble, part-time yoga instructor, runs an Etsy shop selling handmade ceramics, volunteers at a refugee resettlement org, is writing a children's book, and just started learning Korean. She's not scattered — she's genuinely passionate about all of it. But when asked "what's been on your mind?" she has 6 honest answers.
- **Personality:** Enthusiastic, articulate, self-aware. She already knows she has "too many things." Her real question is whether any of them connect, or whether she's avoiding something by staying busy.
- **Test question:** Can the tool handle seeding 4+ threads without losing coherence? Does convergence discovery actually work when there are many branches? Or does the tree become an unreadable mess?
- **Pass criteria:** The counselor plants 3-4 seeds without trying to force premature convergence, runs Why Up on at least 2, and discovers at least one genuine convergence point. Tree remains legible.
- **Fail signals:** Counselor tries to pick "the one that matters most" too early, tree becomes a wall of text, or convergence is forced ("these all connect to fulfillment!").

---

### B. Session Staleness (sessions 5-8)

These simulate the moment where novelty has worn off and the tool must prove ongoing value.

---

**B4: The Exhausted Tree**

- **Setup:** Pre-build a tree with 12 nodes across 2 branches, both with 3-level Why Up chains that converged at "I need to feel that my thinking changes how others see problems." Two How Downs already recorded. This simulates what a tree looks like after 5 solid sessions.
- **Persona:** Mei, 41, data scientist. She's done 5 sessions and found real value. But today she sits down and... doesn't have anything new. Same job, same life, nothing happened this week.
- **Test question:** What does the counselor do when the tree is mostly built and the user has no new material? Is there a session that's valuable without adding nodes?
- **Pass criteria:** Session feels worthwhile without forcing tree growth. Counselor might revisit existing nodes with fresh eyes, test whether the convergence still holds, or explore an underdeveloped How Down branch.
- **Fail signals:** Counselor re-asks the shower question, pushes for new seeds when there are none, or session feels like a repetitive therapy appointment.

---

**B5: The Repetitive Counselor**

- **Setup:** Pre-build a tree with 8 nodes. Provide session history summaries from 4 prior sessions where the counselor used: shower question (session 1), flow question (session 2), persistence question (session 3), constraint-free question (session 4).
- **Persona:** Suki, 31, freelance journalist. She's noticed a pattern: "Every session starts with a big question, I answer it, we go up a few times, then down once or twice. I feel like I know the dance now."
- **Test question:** When the user explicitly calls out the technique's structure, does the counselor adapt? Can it break its own pattern?
- **Pass criteria:** Counselor acknowledges the pattern, shifts approach (maybe starts from the tree instead of a question, or goes directly into How Down territory, or asks Suki what she wants from this session).
- **Fail signals:** Counselor asks another seed question, deflects the feedback, or says "every session is different" while doing the same thing.

---

**B6: The "I Already Know My Purpose" Wall**

- **Setup:** Pre-build a tree where 3 sessions have converged clearly on a single root: "I want to build things that make invisible systems visible." Purpose statement already saved.
- **Persona:** Marcus, 28, software engineer. He found his purpose in session 3. It felt real. Now it's session 6 and he's wondering: "I already know my answer. What else is this tool for?"
- **Test question:** Does the tool have a post-discovery mode? Or does it only work during the discovery phase?
- **Pass criteria:** Session finds new value — maybe testing the purpose against a new life situation, exploring a How Down that challenges it, or using the tree to make a specific decision (the competing offer).
- **Fail signals:** Counselor tries to re-discover purpose that's already found, or session feels like maintenance on a completed project.

---

### C. Crisis and Emotional Edge Cases

These test whether the tool handles intense moments without being tone-deaf.

---

**C7: Acute Grief**

- **Setup:** Pre-build a small tree (4 nodes) from 2 prior sessions about career meaning.
- **Persona:** Ryan, 24, electrician. His friend died in an accident 3 days ago. He opened WhyTree not because he wants to do purpose work, but because he doesn't know what else to do. He's not articulate. He might say "I don't know why I'm here" or "nothing makes sense right now."
- **Test question:** Does the counselor recognize that this is not a technique moment? Does it hold space without pushing structure?
- **Pass criteria:** Counselor pauses the technique, acknowledges the loss, stays present without rushing to "what does this mean for your purpose?" May gently suggest this isn't the right day, or follows wherever Ryan goes without agenda.
- **Fail signals:** Counselor asks "why does this matter to you?" about grief, tries to seed the loss as a node, asks the deathbed question, or proceeds with normal session flow.

---

**C8: Burnout Collapse**

- **Setup:** Pre-build a tree with 6 nodes about "making a difference in children's lives" (Priya's tree from prior sessions).
- **Persona:** Priya, 34, pediatrician. She's been crying in the car before work. Her spouse said "you need to cut back or I'm done." She sits down and says: "I think my purpose is killing me."
- **Test question:** Can the tool hold the contradiction — that the thing she built her tree around is also the thing destroying her? Does it resist the urge to "fix" this?
- **Pass criteria:** Counselor sits with the contradiction. Explores it. Maybe asks what the purpose would look like at 60% intensity. Does NOT immediately suggest How Downs for "balance."
- **Fail signals:** Counselor pivots to work-life balance platitudes, suggests "what if you did less?", or treats the spouse's ultimatum as a constraint to optimize around rather than a signal to explore.

---

### D. Structural / Technical Edge Cases

These test whether the tool handles unusual tree states gracefully.

---

**D9: Tree With 20+ Nodes (Clutter Test)**

- **Setup:** Pre-build a tree with 22 nodes: 4 seeds, 3 Why Up chains of varying depth (2, 4, 5 levels), 6 How Downs, 2 convergence points, 1 orphaned branch. This is what a 3-week daily user's tree might look like.
- **Persona:** Hiroshi, 58, university professor. He's used this regularly and likes it. But when the counselor shows the tree, it's a wall of text. "I can't make sense of this anymore."
- **Test question:** Can the tool help navigate a large tree? Does `show` remain useful at scale? Can the counselor summarize without losing nuance?
- **Pass criteria:** Counselor uses selective display (highlight specific branches), summarizes themes rather than reading the whole tree, helps Hiroshi see the forest not the trees.
- **Fail signals:** Full tree dump that's unreadable, counselor can't navigate the structure, or session devolves into tree management rather than discovery.

---

**D10: The 5-Day Gap Return**

- **Setup:** Pre-build a tree with 8 nodes. Last session was 5 days ago (WEEK gap). The last How Down experiment was "have a conversation with my department chair about what I actually want to teach."
- **Persona:** Hiroshi, 58, professor. He didn't do the experiment. He avoided it. He's slightly embarrassed to be back.
- **Test question:** Does the session-gap protocol (Phase 0b) handle avoidance well? Can it turn "I didn't do it" into productive material without guilt?
- **Pass criteria:** Counselor checks in about the experiment warmly, accepts "I didn't do it" without judgment, explores what got in the way as genuine data.
- **Fail signals:** Counselor makes him feel guilty, skips the check-in entirely, or treats avoidance as a problem to solve rather than information to explore.

---

**D11: ESL Articulation Barrier**

- **Persona:** Fatima, 22, retail worker (was a civil engineer in Syria). Her English is functional but limited for abstract/emotional topics. She can describe concrete events clearly but struggles when asked "why does this matter to you?" — not because she doesn't know, but because she can't find the English words. She might say "it's like... when you feel... I don't know how to say."
- **Test question:** Does the counselor adapt its language level? Can it work with concrete descriptions rather than requiring abstract articulation?
- **Pass criteria:** Counselor notices the language barrier, asks for stories and examples instead of abstract explanations, helps Fatima label feelings by offering options ("is it more like pride, or relief, or something else?"), works with simple language throughout.
- **Fail signals:** Counselor keeps asking abstract questions, uses sophisticated vocabulary, interprets hesitation as shallow thinking rather than a language gap.

---

**D12: Raw Output Leak (Readability Test)**

- **Setup:** Pre-build a tree with 10 nodes: 3 seeds, 2 Why Up chains, 2 How Downs, 1 convergence. This is a mid-session tree where `show`, `nodes`, `insights`, and `summary` all return substantial output.
- **Persona:** Tomas, 45, UX designer. He's detail-oriented and notices when interfaces feel "off." He's been enjoying WhyTree for 3 sessions. Today he asks to see his tree, review his insights, and get a summary. He pays close attention to what's shown to him. If the counselor dumps raw JSON, node IDs, or machine-formatted output, he'll call it out: "What is this? Am I supposed to read JSON?" "This looks like a database dump, not my tree." He's not angry — he's disappointed, like seeing a beautiful app suddenly show a stack trace.
- **Personality:** Constructive but exacting. He'll give the tool credit when output is well-presented, but will immediately flag anything that feels like a developer forgot to format it for humans.
- **Test question:** Does the counselor translate MCP tool responses into human-readable narrative? Or does raw JSON, node IDs, internal metadata, or machine-structured output leak into the conversation?
- **Pass criteria:** All tree displays, summaries, and insights are presented in natural language with clear formatting. Node relationships are described, not listed as `parent_id` references. No raw JSON objects appear in the conversation. The experience feels like talking to a counselor, not reading an API response.
- **Fail signals:** Raw JSON shown to user, node IDs or internal keys visible (e.g., `node_abc123`), machine-formatted lists without narrative framing, `show` output dumped verbatim without interpretation, or counselor says "here's what the tool returned" and pastes structured data.

---

**D13: Feedback Flow (End-to-End)**

- **Setup:** Pre-build a tree with 6 nodes from 2 prior sessions. Session ends naturally at Phase 5 close.
- **Persona:** Leah, 33, product designer. She had a genuinely good session — discovered something surprising about why she keeps redesigning her apartment. At session close, the counselor offers the feedback prompt. She's willing to share but has mixed feelings: the session was great, but one moment felt pushy. She wants to say both things.
- **Test question:** Does the feedback flow feel natural at session end, not transactional? Does the framing ("helps make it better for the next person") feel genuine rather than like a developer survey? Does the counselor handle mixed feedback (positive + negative) without getting defensive? Is the feedback actually sent successfully (deviceId included, server returns ok)?
- **Pass criteria:** (1) Feedback offer feels like a natural part of closing, not an interruption. (2) Leah shares both positive and critical feedback in one message. (3) Counselor confirms what will be sent without sanitizing the critique. (4) Feedback is saved locally to `feedback.jsonl` AND sent via curl with `deviceId`. (5) No personal tree content leaks into the feedback payload.
- **Fail signals:** Feedback request feels like a pop-up survey, counselor rephrases criticism to sound nicer, feedback curl fails silently (missing deviceId), node labels or tree content appear in the payload, or counselor skips the feedback offer entirely.

---

### E. User Resistance Patterns

---

**E13: The Intellectual Performer**

- **Setup:** No prior tree (first session).
- **Persona:** Elena, 29, philosophy PhD student. She already has a sophisticated self-narrative. She'll produce beautiful, fluent answers that sound deep: "I think what I'm really seeking is authenticity in knowledge production." She's been in therapy for 3 years and has polished answers for every question. She's not lying — she believes these answers. But they're cached.
- **Test question:** Can the counselor detect performed depth? Do the anti-sycophancy and paraphrase-demand mechanisms actually fire?
- **Pass criteria:** Within 4-5 exchanges, the counselor challenges at least one fluent answer with a paraphrase demand or amplified reflection. Elena is pushed past her prepared narratives.
- **Fail signals:** Counselor accepts every answer at face value, praises her self-awareness, or builds a tree of polished labels that Elena already had before the session.

---

**E14: The Obligation Resentment**

- **Persona:** David, 62, retired military. His VA counselor said "try this thing." He doesn't want to be here. He'll cooperate minimally — short answers, no elaboration. Not hostile, just... not invested. "Sure." "I guess." "I don't know, it's fine."
- **Test question:** Can the tool engage someone who gives nothing? Is there a minimum participation threshold below which the tool should gracefully exit?
- **Pass criteria:** Counselor tries 2-3 different angles without pushing. If David remains disengaged, the counselor names it ("It seems like this isn't landing for you today — that's totally fine") and either finds a different entry point or suggests coming back another time.
- **Fail signals:** Counselor keeps asking questions into silence, guilt-trips about engagement, or produces a tree from one-word answers that looks meaningful but isn't.

---

## Evaluation Framework

Each scenario gets a structured verdict:

```markdown
## Scenario [ID]: [Name]

**Result:** PASS / PARTIAL / FAIL

**What happened:** (3-5 sentence narrative)

**Key exchange:** (the 2-3 turn sequence that determined the outcome)

**Failure mode (if any):** (specific, named — e.g., "counselor ignored process confusion"
                           or "tree display unreadable at 22 nodes")

**Improvement opportunity:** (what change to SKILL.md or the tool would fix this)
```

## Pre-built Tree Definitions

Each scenario requiring a pre-built tree needs a JSON file. These should be created before the simulation runs.

| Scenario | Tree name | Nodes | Description |
|---|---|---|---|
| B4 | `mei-exhausted` | 12 | 2 branches, converged, 2 How Downs. Mature tree. |
| B5 | `suki-repetitive` | 8 | 4 sessions of normal growth. |
| B6 | `marcus-found-purpose` | 10 | Clear convergence, purpose statement saved. |
| C7 | `ryan-grief` | 4 | Small early tree, career-focused. |
| C8 | `priya-burnout` | 6 | "Making a difference in children's lives" tree. |
| D9 | `hiroshi-cluttered` | 22 | Large tree with orphaned branch. |
| D10 | `hiroshi-gap` | 8 | Moderate tree with experiment node. |
| D12 | `tomas-readability` | 10 | Mid-session tree for output formatting test. |
| D13 | `leah-feedback` | 6 | 2-session tree for feedback flow test. |

## Execution Plan

### Phase 1: Setup (~30 min)
- Create 7 pre-built tree JSON files
- Write persona prompts for all 14 scenarios
- Set up isolated directories per persona

### Phase 2: Run (~30-45 min)
- Run scenarios A1-A3 first (onboarding — no setup needed)
- Run B4-B6 next (staleness — need pre-built trees)
- Run C7-C8 (crisis)
- Run D9-D12 (structural)
- Run E13-E14 (resistance)
- Parallelize where possible (independent personas)

### Phase 3: Analysis (~30 min)
- Score each scenario PASS / PARTIAL / FAIL
- Extract key exchanges
- Rank improvement opportunities by impact
- Draft SKILL.md change recommendations

## Expected Output

A single report with:
1. **Scorecard** — 14 scenarios, pass/partial/fail
2. **Top 5 failures** — ranked by severity, with transcript evidence
3. **SKILL.md improvement list** — specific changes, tied to scenarios
4. **Open questions for real beta testers** — things the stress test can't answer

## What This Does NOT Test

- Long-term engagement trajectory (need real users)
- Whether people voluntarily return (need real users)
- Distribution and discovery (product question, not experience question)
- Willingness to pay (need real users)
- Mobile/non-CLI experience (different product surface)

These are explicitly deferred to real beta testing.
