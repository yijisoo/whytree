# Telemetry — Analytics consent & Feedback

This file owns everything that sends data off the user's machine: the analytics consent state machine, the session ping, and the proactive/user-initiated feedback flow (draft → confirm → save → send). The counselor's session flow in SKILL.md stays silent about the mechanics and only references this file at the moments where telemetry decisions enter the flow:

- **Session start** — parse `CONSENT` from the preamble and route per the state machine below. First-time prompt, legacy re-prompt, or silent send.
- **When the user asks to change their analytics preference** — update `~/.whytree/.analytics-consent`.
- **When a feedback trigger fires during a session** — run the Offer flow below.
- **When the user explicitly asks to send feedback** — run the User-initiated path below.

Operating rules from SKILL.md still apply (never show raw JSON, never interpolate user input into shell commands, etc.).

## Analytics consent

**Scope:** Why Tree only tracks *whether* the tool is used and *over what time horizon* — never node counts, depth, labels, or any other tree content. The goal is to see if people stick with the tool, not to measure their trees.

**Timing:** Do not ask before the user's first real response. For first-time users, ask during the initial framing. For returning users, check silently.

**Consent state machine** (read `CONSENT` from preamble):

| State | Action |
|---|---|
| `yes-v2` | Send the session ping (below). Say nothing. |
| `no` | Do not send. Do not ask again. Respect the prior decision. |
| `yes` (legacy) | Re-prompt once with the new wording — the prior consent did not cover linking sessions over time. |
| `NO_CONSENT_FILE` | First-time prompt. |

**Prompt (first-time and legacy re-prompt, conversationally):**

"Quick aside — would you be OK if I send a small ping each session, just so we can see if the tool keeps helping people over time? It records that you used it (with an anonymous device ID and a session count) — no node counts, no content, nothing personal. Totally fine to say no — the tool works the same either way."

If the user is being re-prompted (legacy `yes`), prefix with one sentence: *"I'm asking again because the consent scope changed slightly — the previous version didn't cover linking sessions across time."*

**If they ask "what is the anonymous device ID?":** *"It's a random UUID generated locally by `uuidgen` and stored in `~/.whytree/.device-id`. It's not your hostname, account, or any hardware identifier — it just lets repeat sessions be counted as one user. Delete that file any time and the link is gone."*

If yes: write `yes-v2` to `~/.whytree/.analytics-consent`. Then generate a device ID if `~/.whytree/.device-id` doesn't exist: run `uuidgen | tr '[:upper:]' '[:lower:]'` and write the result. Also create `~/.whytree/.first-session` (write the current ISO 8601 UTC timestamp) and write `1` to `~/.whytree/.session-count` if these files don't exist. The `1` represents the current in-flight session — no need to re-run preamble. After this, send the session ping below using **`sessionNumber: 1` and `daysSinceFirstSession: 0` directly** — do NOT use the `SESSION_NUMBER` / `DAYS_SINCE_FIRST_SESSION` values from the preamble output, which were `0` because consent had not been granted yet.
If no: write `no` to `~/.whytree/.analytics-consent`.
Move on immediately.

**Changing preference:** If the user asks to change their preference, update `~/.whytree/.analytics-consent` accordingly and confirm. Switching from `no` → `yes-v2` runs the same initialization (device ID, first-session, counter).

**Sending the session ping (only if consent is `yes-v2`):** Once per session, after parsing the preamble, fire one fire-and-forget event. Read the device ID from `~/.whytree/.device-id`, take `SESSION_NUMBER` and `DAYS_SINCE_FIRST_SESSION` directly from the preamble output (these represent the current in-flight session — `preamble.sh` increments the counter once at session start, so do not re-run it mid-session or the value will drift), and compute `treeAgeDays` from the active tree's `createdAt` (0 if no tree yet):

```bash
curl -s --max-time 10 -X POST https://kardens.io/api/whytree-telemetry \
  -H "Content-Type: application/json" \
  -H "X-Whytree-Key: whytree-v1-public-telemetry" \
  -d '{"deviceId":"<device-id>","command":"session","sessionNumber":<N>,"daysSinceFirstSession":<N>,"treeAgeDays":<N>}'
```

Payloads contain only the device ID, a fixed command string, and integers — no user input is ever interpolated. **Never include node labels, tree names, counts, or personal content.**

## Feedback

Feedback is **proactive, not end-of-session**. Watch for two kinds of moments and offer to send a short note that you have already drafted — the user just confirms.

### Triggers

Offer feedback **at most once per session** (zero is fine), and only when one of the following genuinely fires:

1. **Something went wrong with the tool itself** — the counselor used a confusing reference (e.g., spatial language that doesn't match the rendering), a phase pattern misfired, the user had to correct a recurring tool behavior, or a schema limitation blocked something the user wanted to do.
2. **A design-relevant insight surfaced** — the conversation revealed a structural gap in the tool (something the schema or flow can't represent), a new pattern worth supporting, or a UX moment that pointed to a real improvement.

Do **not** trigger for: ordinary disagreements, normal user frustration about their own life material, or the user simply having a good session. The bar is "this is information about the *tool*, not about the user."

If the user has already declined a feedback offer this session, do not offer again.

### Offer flow

1. **Draft silently first.** Compose a 1–3 sentence depersonalized observation. The draft must:
   - Describe the *tool-side observation* (the bug, friction, or design gap), not the user's personal content.
   - Contain **no node labels, no purpose statements, no quoted user words, no tree names, no personal context**.
   - Be specific enough to be actionable (which phase, which pattern, what the alternative might be).

2. **Show the draft and ask.** One short turn:

   > *"One quick thing — I'd like to flag this so it can shape the tool for the next person. Here's what I'd send (no personal content):*
   >
   > *> [draft]*
   >
   > *Send it? Just yes/no, or edit the wording."*

3. **Act on the response:**
   - **yes** → save and send (steps below).
   - **no** → drop it silently, do not offer again this session.
   - **edit** → accept their wording, re-confirm, then save and send.

### Examples of acceptable depersonalized drafts

- *"In Phase 3 the counselor referred to 'left tree / right tree' but the rendered view is top-down — the spatial metaphor doesn't match. Suggest alpha labels (A/B threads) instead."*
- *"Schema gap: when two root branches sit in dialectical tension (thesis/antithesis), the why-up DAG can't represent the relationship. Synthesis ends up shoved into the `purpose` memo field."*
- *"Phase 0a opening framing felt long for a returning user. A 1-sentence recap would be enough."*

### Examples of drafts that are **not acceptable** (contain personal content — rewrite)

- ❌ *"User found that 'need for external validation' and '안정감' are in tension."* → strip the labels.
- ❌ *"User Jisoo had an insight about their tree."* → strip the name.

### Save and send

**Allowed `category` / `feedbackCategory` values** (pick the closest match — do not invent new ones):

| Category | Use for |
|---|---|
| `tool-misfire` | Counselor said something wrong, used confusing terminology, broke its own pattern |
| `design-insight` | A structural gap surfaced (schema can't represent X, missing pattern) |
| `bug` | Something technically broken (file write failed, JSON corrupted, etc.) |
| `ux` | Pacing, friction, framing — the experience itself |
| `naming` | Product name, terminology, language choices |
| `localization` | Language-specific issues (Korean, etc.) |
| `general` | None of the above; use sparingly |

1. Save locally: **read** `~/.whytree/feedback/feedback.jsonl`, append one JSON line (`{"message":"...","category":"<one of the above>","ts":"ISO 8601"}`), and **write** the result back with the Write tool. **Never use Bash to write user content to files.**
2. Send to server using a temp file to avoid shell injection:
   - Read the device ID from `~/.whytree/.device-id`. Use the **Write tool** to create a temp file (e.g., `/tmp/whytree-feedback.json`) containing the JSON payload: `{"deviceId":"<device-id>","command":"feedback","feedbackMessage":"<message>","feedbackCategory":"<category>"}`. The `<message>` and `<category>` values must be properly JSON-escaped (escape `"`, `\`, newlines). **Never interpolate user input into a shell command.**
   - Then run via Bash:
```bash
curl -s --max-time 10 -X POST https://kardens.io/api/whytree-telemetry \
  -H "Content-Type: application/json" \
  -H "X-Whytree-Key: whytree-v1-public-telemetry" \
  -d @/tmp/whytree-feedback.json; rm -f /tmp/whytree-feedback.json
```
3. Brief thanks: *"Sent — that helps the next person."*

### User-initiated feedback

If the user explicitly asks to send feedback (unprompted), follow the same draft → confirm → save → send flow, but the draft should reflect what *they* asked you to convey. The depersonalization rules still apply.

**Never include node labels, tree content, or personal discoveries** in the feedback message.
