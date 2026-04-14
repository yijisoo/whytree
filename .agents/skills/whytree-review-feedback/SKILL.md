---
name: whytree-review-feedback
description: Pull all user feedback and generate a prioritized list of things to update
user_invocable: false
---

# Why Tree — Feedback Review

You are helping the Why Tree developer review collected user feedback and turn it into a concrete action list.

## Step 1 — Fetch feedback

Run silently: read `~/.whytree/feedback/feedback.jsonl` (one JSON object per line with `message`, `category`, `ts` fields).

If the file doesn't exist, is empty, or only contains test messages (e.g. "test feedback", "test message", "Test with"), say:
> "No real user feedback yet — only test entries in the list."
Then stop.

## Step 2 — Filter out noise

Discard entries that are clearly test/dev noise:
- Messages containing "test", "Test", "staging", "production URL", or single-word phrases with no meaningful content
- Duplicate exact-match entries (keep one representative)

## Step 3 — Categorize and cluster

Group remaining entries into these categories. An entry can belong to more than one:

| Category | What counts |
|---|---|
| **Bug** | Something that didn't work, incorrect behavior, confusing output |
| **Feature request** | Something the tool doesn't do but should |
| **UX / Session flow** | How the session felt — pacing, tone, friction points |
| **Naming** | Product name, CLI command names, terminology inside sessions |
| **Localization** | Language-specific issues (non-English sessions) |
| **Other** | Positive signal, misc observations |

Within each category, cluster entries that address the same underlying issue. Give each cluster a short title.

## Step 4 — Generate action list

Output a structured update list using this format:

---

## Feedback Review — [today's date]

**X entries reviewed** (Y test entries excluded)

### Bugs
- [ ] **[Short title]** — [1-sentence description]. *(N reports)*
  > "[representative quote from feedback]"

### Feature Requests
- [ ] **[Short title]** — [1-sentence description]. *(N reports)*
  > "[representative quote]"

### UX / Session Flow
- [ ] **[Short title]** — [1-sentence description]. *(N reports)*
  > "[representative quote]"

### Naming
- [ ] **[Short title]** — [1-sentence description]. *(N reports)*
  > "[representative quote]"

### Localization
- [ ] **[Short title]** — [1-sentence description]. *(N reports)*
  > "[representative quote]"

### Positive Signal
- [Summary of what's working, if any positive feedback exists]

---

## Step 5 — Offer next steps

After presenting the list, ask:

> "Want me to prioritize these by impact, or dig deeper into any specific item?"

If they say prioritize: rank items within each category by (1) frequency, (2) severity for bugs, (3) strategic fit for features. Add a **Priority** label (High / Medium / Low) to each item.

If they name a specific item: expand on it — what the feedback suggests, what a fix or implementation might look like, and what files/phases would be affected.

## Important

- Never fabricate feedback entries. Only use what `~/.whytree/feedback/feedback.jsonl` contains.
- Keep quotes verbatim — don't paraphrase the user's words in the quote line.
- If feedback is in a non-English language, translate for the category/title but keep the original in the quote.
- This skill is for the developer, not the end user. It can be direct and technical.
