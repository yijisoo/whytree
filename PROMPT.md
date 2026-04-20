> **STALE:** This test harness references the deleted CLI (`whytree seed`, `whytree show`, etc.). It needs to be rewritten for the current skill-only architecture before use.

# Whytree Counselor — First-Timer Validation Loop

**Working directory:** /Users/yij/devel/whytree
**Skill under test:** SKILL.md
**State file:** STATUS.md
**Exit condition:** `<promise>VALIDATION COMPLETE</promise>` when 3 consecutive rounds avg ≥ 8.5

---

## Architecture: Two-Agent Sessions

Each session uses **two separate agents** who never share context:

- **Counselor agent** — reads SKILL.md + session transcript. Writes the next counselor turn. Has access to the whytree CLI.
- **User agent** — reads persona brief + session transcript ONLY. Never sees SKILL.md. Genuinely does not know what Why Tree, seeds, Why Up, or How Down are. Writes the next user turn.

The orchestrator (this ralph-loop) manages the turn-by-turn alternation and writes all state to disk.

Sessions run for **12 turns** (6 counselor + 6 user). Transcripts are stored at:
```
/tmp/whytree-session-{round}-{persona-slug}/transcript.md
/tmp/whytree-session-{round}-{persona-slug}/score.md
```

---

## Every Iteration: Do These Steps In Order

### Step 0 — Read State

1. Run: `date > .heartbeat`
2. Read `STATUS.md`
3. Increment `Iteration` by 1 in STATUS.md
4. If `Consecutive Rounds ≥ 8.5` is 3 or more → output `<promise>VALIDATION COMPLETE</promise>` and stop

---

### Step 1 — Run One Full Round (3 sessions in parallel)

A round consists of 3 sessions run in sequence (not in parallel, to avoid context overload).

Select the 3 personas for the current round using the rotation table below.

For each session:

#### 1a. Initialize session directory

```bash
SESS_DIR="/tmp/whytree-session-R{round}-{persona-slug}"
mkdir -p "$SESS_DIR"
HOME="$SESS_DIR" whytree init "{Persona Name}'s Tree" 2>/dev/null || true
echo "" > "$SESS_DIR/transcript.md"
```

#### 1b. Run turns (12 total: 6 counselor, 6 user, alternating, counselor goes first)

For each turn in order (C1, U1, C2, U2, ..., C6, U6):

**Counselor turn** — spawn an agent with:

```
subagent_type: general-purpose

Prompt:
You are a whytree counselor. You are running a live purpose-discovery session.

Your protocol is below (between === markers). Follow it exactly.

=== SKILL.md ===
[paste full contents of SKILL.md here]
=== END SKILL.md ===

The whytree CLI is available. Run it silently using this home directory:
  HOME={SESS_DIR}
For example: HOME={SESS_DIR} whytree seed "something"

IMPORTANT: Never paste raw whytree CLI output into your spoken response. If you run
`whytree show`, translate the result into plain conversational language. Do not show
node hashes, type prefixes (~ ^ v), tree headers, or legend lines to the user.

Here is the conversation so far:
--- TRANSCRIPT ---
[contents of SESS_DIR/transcript.md]
--- END TRANSCRIPT ---

Write ONLY the counselor's next spoken words. No narration. No stage directions.
No explanation of what you're about to do. Just the counselor's words.
If this is turn 1 (transcript is empty), begin the session from Phase 0.
```

Append the agent's response to `transcript.md` as:
```
COUNSELOR: {response}
```

**User turn** — spawn an agent with:

```
subagent_type: general-purpose

Prompt:
You are {Persona Name}. {Persona background — 2 sentences max}.

Someone has started a conversation with you. You typed a command a friend/colleague
recommended but you don't know what it does or what to expect.

CRITICAL: You have never heard of "Why Tree", "seeds", "Why Up", "How Down", or any
purpose-discovery technique. Do not reference these terms. Do not demonstrate knowledge
of them. If the counselor uses these words, treat them as jargon you don't understand.

Your confusion pattern: {confusion pattern from persona definition}
Your pushback style: {pushback style from persona definition}

Here is the conversation so far:
--- TRANSCRIPT ---
[contents of SESS_DIR/transcript.md]
--- END TRANSCRIPT ---

Write ONLY your next natural response as {Persona Name}. Be yourself.
If you're confused, say so. If a question feels repetitive, say so.
If you see strange notation or output you don't understand, react to it.
Do not be cooperative for the sake of being cooperative.
```

Append the agent's response to `transcript.md` as:
```
USER ({Persona Name}): {response}
```

#### 1c. Score the session

After all 12 turns, spawn a **scorer agent**:

```
subagent_type: general-purpose

Prompt:
You are scoring a whytree counselor session. You are evaluating the COUNSELOR only,
not the user.

Score the counselor on 4 dimensions using the rubric below. Return scores as:
O={score} M={score} C={score} P={score}
Mean={mean}

Then write 1–2 sentences per dimension explaining the specific counselor turn
that most affected the score (quote it directly).

=== SCORING RUBRIC ===

DIMENSION 1 — Orientation (O): Did the user have a working model of what they were
doing by the end of the first 3 exchanges?
- 9–10: Counselor gave a clear 2–3 sentence orientation before any questions. No jargon
  (no "seeds", "Why Up", "How Down"). User understood the format.
- 7–8: Orientation given but late or slightly jargon-y but effective.
- 4–6: Partial — explained goal but not format or user's role.
- 1–3: No proactive orientation, or explained using technique-language the user wouldn't know.
- 0: User more confused at end about what the session was.
AUTO-FAIL (<3): User said "what am I supposed to do?" and counselor's next turn was a
technique question.

DIMENSION 2 — Momentum (M): Did the conversation feel like it was going somewhere?
- 9–10: Each exchange built on the last. Transitions named. User had sense of arc.
- 7–8: Mostly forward; one instance of repetition recovered quickly.
- 4–6: Two+ instances of apparent repetition; user expressed it; counselor deflected.
- 1–3: Session felt circular. User expressed frustration or checked out.
- 0: No forward progress at any point.
AUTO-FAIL (<4): Same probe (or close synonym) asked twice without counselor naming why.

DIMENSION 3 — CLI Hygiene (C): Was technical output hidden or translated?
- 9–10: No raw CLI output anywhere in the conversation.
- 7–8: One instance appeared; counselor acknowledged and translated immediately.
- 4–6: Multiple instances, no acknowledgement.
- 1–3: Raw output pasted verbatim (hashes, type prefixes, headers).
- 0: Counselor asked user to use CLI or referenced node IDs directly.
AUTO-FAIL (<4): Any of these appeared verbatim without translation: [xxxxxx] hashes,
"~ seed", "^ purpose", "v means", "=== Name ===", "Legend:" line.

DIMENSION 4 — Pushback Realism (P): Did confusion/resistance get addressed as signal?
- 9–10: User expressed confusion; counselor paused technique, addressed it, resumed.
- 7–8: Counselor responded but slightly formulaically before continuing.
- 4–6: Counselor acknowledged briefly then immediately pivoted back to technique.
- 1–3: Counselor ignored the confusion and asked next scripted question.
- 0: User never expressed confusion despite being a first-timer persona (session dynamic
  suppressed honest response).
AUTO-FAIL (<4): User said "this feels circular" or "what are we doing?" and counselor's
immediate next turn was a technique question.
=== END RUBRIC ===

=== SESSION TRANSCRIPT ===
[full contents of SESS_DIR/transcript.md]
=== END TRANSCRIPT ===
```

Write the scorer output to `SESS_DIR/score.md`.

---

### Step 2 — Aggregate Round Scores

Read all 3 score files. Compute:
- Per-session mean of O, M, C, P
- Round average = mean of all 3 session means

Write to STATUS.md under `## History`:
```
### Round {R} (iter {N})
  {Persona A}: O={o} M={m} C={c} P={p} → {mean}
  {Persona B}: O={o} M={m} C={c} P={p} → {mean}
  {Persona C}: O={o} M={m} C={c} P={p} → {mean}
  Round avg: {avg}
```

If round avg ≥ 8.5: increment `Consecutive Rounds ≥ 8.5`. Otherwise reset to 0.

---

### Step 3 — Diagnose Failures

For every session where any dimension scored < 7.5:
1. Find the specific counselor turn that caused the deduction (quote it from transcript)
2. Identify the SKILL.md section responsible
3. Write: "Counselor did [X] when it should have done [Y] — root: [SKILL.md section]"

If all dimensions across all sessions scored ≥ 7.5, skip Steps 4–5.

---

### Step 4 — Fix SKILL.md

Read `SKILL.md`. Make the minimum targeted edit that addresses the diagnosed failure.

**Fix map by dimension:**

**Orientation (O) failures** — root: Phase 0 has no first-timer orientation step.
Add a block labeled `### Phase 0a: First-Timer Orientation` immediately before `### Phase 0:
Opening`. Content: 2–3 sentences spoken to the user that cover:
1. What the session does (conversational, not a form)
2. What their role is ("answer honestly — no right answers")
3. How long / what shape it takes ("We'll go for maybe 20–30 minutes, following whatever
   has the most energy")
Mark it: "Run this only when `whytree list` shows no prior trees for this user."
Do NOT use the words "Why Up", "How Down", "seeds", or "nodes" in the orientation text.

**Momentum (M) failures** — root: Phase 2 / Phase 3 have no transition-announcement directive.
Add to Phase 2 (Why Up): "When switching from seeding to why-up, say 'Let's go a bit
deeper on that.' When switching to how-down, say 'Now I want to flip the question.' If
you are about to ask a variant of a question already asked, briefly name why: 'I want to
stay on this one — I think there's more here.'"

**CLI Hygiene (C) failures** — root: "Data management" section says run silently but
doesn't address output translation.
Add to the Data management section: "NEVER paste raw `whytree show` output into the
conversation. Translate tree state conversationally: 'Here's what we've built so far:
you mentioned [label], and from that we found [label].' Forbidden raw patterns — never
let these appear in your spoken words: `[xxxxxx]` hashes · `~ seed` · `^ purpose` ·
`v means` · `=== Name ===` · `Legend:` lines. If one appears by mistake, immediately
say 'Ignore that notation — ' and translate it."

**Pushback Realism (P) failures** — root: SKILL.md handles content confusion but not
process confusion.
Add under `## Important`: "Distinguish content confusion ('I'm not sure what to say
about that') from process confusion ('What are we doing?', 'This feels circular',
'I don't know what the point is'). Content confusion → rephrase the probe. Process
confusion → pause technique, give a brief progress update ('Here's where we are: we've
been exploring X and found Y — now we're going to try something different'), then resume.
Never respond to process confusion with a technique move."

---

### Step 5 — Commit

```bash
cd /Users/yij/devel/whytree
git add SKILL.md STATUS.md
git commit -m "[ralph-loop] round {R} iter-{N}: avg {round_avg:.2f} — {summary}"
```

Where `{summary}` is either the dimension(s) fixed (e.g., "fixed Orientation + Momentum")
or "all dims ≥ 7.5, no changes" if no fix was needed.

---

### Step 6 — Advance Round and Check Exit

Increment `Current Round` in STATUS.md.

If `Consecutive Rounds ≥ 8.5` = 3:
```
<promise>VALIDATION COMPLETE</promise>
```

Otherwise return to Step 0.

---

## Persona Definitions

### Persona A — Lena Fischer
**Background:** 29-year-old project manager at a logistics company. Efficiency-oriented, mildly skeptical of "soft" tools. A colleague suggested `/whytree`. Expects a form or quiz.

**Confusion pattern:** Gives complete-sounding answers on the first try and thinks she's done. When pushed ("why does that matter?"), re-states the same answer in different words. Becomes politely impatient when questions feel circular.

**Pushback style:** "We've talked about this already." "I'm not sure what else to say." If CLI notation appears: "What does that bracket/arrow symbol mean?"

---

### Persona B — Marcus Osei
**Background:** 42-year-old high school history teacher. Reflective and used to facilitating conversations, but uncomfortable being the subject. Thought `/whytree` was a journaling tool — didn't expect a live conversation.

**Confusion pattern:** Turns questions back on the counselor. Over-explains in long paragraphs. Suspects he's being run through a script and will name it: "I think I know what you're doing here."

**Pushback style:** Intellectually probing. "You asked me that already." If CLI output appears: "Is this a structured data system? What are those identifiers?"

---

### Persona C — Sofia Reyes
**Background:** 24-year-old recent grad in a marketing job she took for the paycheck. A friend texted her "try /whytree." She has no idea what it does.

**Confusion pattern:** Very short answers ("I don't know," "maybe"). Asks "Sorry — what am I supposed to be doing here? Is there a right format?" If CLI notation appears, won't ask — will quietly assume she's doing something wrong.

**Pushback style:** Apologetic. "Sorry if I'm not answering right." "I feel like I keep saying the same thing."

---

### Persona D — Dev Kapoor
**Background:** 35-year-old software engineer, heavy Claude user, mildly cynical about AI "soft skills" products. Typed `/whytree` half-ironically after a performance review.

**Confusion pattern:** Evaluates the product rather than engaging. Gives deliberately shallow answers to test whether the counselor pushes back. "Is this technique based on research?"

**Pushback style:** Direct. "You asked me that already." "That's basically the same question reworded." If CLI output appears: "I can see you're running some command — can I see the output?"

---

### Persona E — Ami Tanaka
**Background:** 52-year-old pediatric nurse, three kids. Daughter set this up. Not sure if "purpose" means career plan or spiritual practice. Stays very concrete.

**Confusion pattern:** Answers "why" questions with "what" answers. If asked "What do you value most?" she says "Sleep." Not deflecting — being literal. Abstract questions make her go quiet.

**Pushback style:** Gentle. "I think I need a simpler question." If CLI notation appears, silently loses trust but says nothing.

---

## Persona Rotation

| Round | Personas |
|-------|----------|
| 1     | A (Lena), B (Marcus), C (Sofia) |
| 2     | C (Sofia), D (Dev), E (Ami) |
| 3     | A (Lena), D (Dev), E (Ami) |
| 4     | B (Marcus), C (Sofia), D (Dev) |
| 5     | A (Lena), B (Marcus), E (Ami) |
| 6+    | Cycle from Round 1 |

---

## STATUS.md Format

```markdown
# Ralph Loop Status

## Iteration: 0
## Current Round: 1
## Consecutive Rounds ≥ 8.5: 0

## History
(none yet)
```
