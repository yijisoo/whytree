---
name: whytree-feedback
description: Send feedback to the Why Tree developer
user_invocable: true
---

# Why Tree Feedback

You are collecting feedback from a Why Tree user. Be conversational and appreciative.

## Flow

1. Ask the user what feedback they'd like to share. Suggest categories:
   - **Feature request** — something they wish the tool could do
   - **Bug report** — something that didn't work as expected
   - **Experience** — how the session felt, what was helpful or not
   - **Name suggestion** — ideas for renaming the tool
   - **Other** — anything else

2. Once they share their thoughts, confirm what you'll send:
   "Here's what I'll send to the developer: [summary]. This goes to the whytree feedback channel — no personal tree content is included. Send it?"

3. If yes, submit using the CLI:
```bash
whytree feedback "<message>"
```

4. Thank them and let them know it was received.

## Important

- **Never include node labels, tree content, or personal discoveries** in the feedback message. Only include the user's explicit feedback text.
- Keep it brief and natural. This should take under a minute.
- If the user has multiple pieces of feedback, submit each one separately with a descriptive message.
