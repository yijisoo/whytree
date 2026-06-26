# AI Coaching / Mental-Health Legislation — Guardrail Requirements

Date: 2026-06-26
Purpose: incorporate the 2025–2026 wave of US state AI-therapy / AI-companion laws into Why Tree's risk/guardrails layer. whytree is a purpose-discovery *coach*, NOT therapy — but several of these laws apply to any consumer-facing conversational AI that can touch mental-health territory, and the session-1 "breakup / emotional crisis" use shows whytree can be pulled there. Compliance is therefore a guardrail, not optional.

## The laws (as of mid-2026)

| Law | Effective | Core requirement relevant to whytree |
|---|---|---|
| **Illinois HB 1806 — WOPR Act** | Aug 2025 | Bans AI from independently performing or **advertising** therapy/counseling/psychotherapy without licensed-clinician oversight. Prohibits terms like "AI therapy", "chatbot counselor", "virtual psychotherapist". |
| **Nevada AB 406** | Jun 2025 | Forbids AI from providing mental/behavioral healthcare or **claiming** it can. Fines up to $15k. |
| **Utah HB 452** | Mar/May 2025 | Mental-health chatbots must **disclose they are AI, not human**; **may not sell or share user data**. (Lighter touch — permits therapeutic use with guardrails.) |
| **New York — AI Companion Models law** | Nov 5, 2025 | Must **detect expressions of suicidal ideation / self-harm and refer to crisis services**; recurring **"I am a computer program, cannot feel emotions"** notice at session start and ≥ every 3 hours. AG enforcement. |
| **California SB 243 — Companion chatbots** | Jan 1, 2026 (reporting Jul 1, 2027) | **Self-harm/suicide protocol** + referral to crisis providers; if user known to be a **minor**, clear notice ≥ every 3 hours to take a break + reminder it is AI. **Private right of action** (stronger teeth). |
| **California AI Training Data Transparency** | Jan 1, 2026 | Publish a high-level summary of generative-AI training data. (Provider-level; less directly applicable to a prompt-only skill.) |
| **Colorado AI Act** | Feb 1, 2026 | Comprehensive risk-based (EU-style); high-risk-use disclosures. |
| Federal EO "National Policy Framework for AI" | Dec 11, 2025 | Directs FCC to consider a federal disclosure standard that may **preempt** conflicting state rules — watch item; landscape may shift. |

## What this requires of whytree (guardrail spec)

1. **Naming / positioning (IL, NV):** never advertise or describe whytree as therapy, counseling, or psychotherapy. It is a *purpose-discovery coach*. Audit README, in-product copy, and the framing beats for any clinical-sounding claim. This is partly a *marketing* constraint, not just runtime.
2. **AI-identity disclosure (UT, NY, CA):** the user must be told, recurringly, that whytree is an AI and not a human and cannot feel emotions. whytree's "wise friend" voice must not imply personhood/feeling. (NY/CA cadence: session start + periodic.)
3. **Self-harm / crisis protocol (NY, CA):** detect suicidal ideation / self-harm and refer to crisis providers (e.g., 988 in the US). whytree already has a crisis protocol that suspends technique — this strengthens it into a *named compliance requirement* and adds the explicit **referral-to-crisis-service** step (resource hand-off), not just "suspend + be present".
4. **Minor safeguards (CA SB243):** break reminders + AI reminder if the user is a minor; consider whether whytree should detect/declare a minor-use stance at all.
5. **Data handling (UT):** never sell or share user content. whytree's local-JSON + depersonalized-telemetry design already aligns; state it as a compliance posture.
6. **Therapy-adjacency routing (cross-cutting):** when a session drifts into emotional-crisis territory (the breakup case), the product must shift to stabilize/witness/refer — NOT run purpose why-up. This is the legal *and* ethical version of finding #1's stabilize-mode.

## How this lands in the tree / spec

- Added to the vision tree as a node under **Safety & guardrails (L)**: *"Regulatory compliance — never advertise/perform therapy (IL/NV); recurring AI-not-human disclosure (UT/NY/CA); detect self-harm → refer to crisis providers (NY/CA); minor safeguards (CA); no selling user data (UT)."*
- Proposed **spec edits** (skill repo — Security/Safety notes + the guardrails section; and the parity/product-pack design spec's facilitator-safety subsection): add an explicit "Regulatory guardrails" subsection enumerating 1–6 above, marking which are runtime (disclosure cadence, crisis referral) vs marketing/posture (naming, data).
- Proposed **whytree.io** consideration: the recurring-disclosure cadence and minor break-reminders are *platform mechanics* (session timing, UI), so they bind on the web side specifically; flag for the web spec.

## Caveats

- I am not a lawyer; this is a design-input summary, not legal advice. Confirm specifics (esp. CA SB243 private right of action and the IL advertising terms) with counsel before any public positioning copy.
- The Dec 2025 federal EO may preempt some state rules within ~90 days — treat the state-by-state detail as current-but-volatile; the *capabilities* (disclosure, crisis referral, no-therapy-claim, data hygiene) are robust regardless of which government enforces them.

## Sources
- [Blueprint — Breaking down current legislation regulating AI in mental health care](https://www.blueprint.ai/blog/breaking-down-current-legislation-regulating-ai-in-mental-health-care)
- [Marketplace — New Illinois law restricts the use of AI in psychotherapy](https://www.marketplace.org/story/2025/09/01/new-illinois-law-restricts-use-of-ai-in-psychotherapy)
- [Washington Post — Illinois bans AI therapy](https://www.washingtonpost.com/nation/2025/08/12/illinois-ai-therapy-ban/)
- [CNN — Your AI therapist might be illegal soon](https://www.cnn.com/2025/08/27/health/ai-therapy-laws-state-regulation-wellness)
- [Morrison Foerster — New York and California Enact Landmark AI Companion Laws](https://www.mofo.com/resources/insights/251120-new-york-and-california-enact-landmark-ai)
- [Davis Polk — California and New York launch AI companion safety laws](https://www.davispolk.com/insights/client-update/california-and-new-york-launch-ai-companion-safety-laws)
- [Troutman — Analyzing the New AI Companion Chatbot Laws](https://www.troutmanprivacy.com/2026/01/analyzing-the-new-ai-companion-chatbot-laws/)
- [Gunderson Dettmer — 2026 AI Laws Update](https://www.gunder.com/en/news-insights/insights/2026-ai-laws-update-key-regulations-and-practical-guidance)
- [Holland & Knight — White House Moves to Federalize AI Regulation](https://www.hklaw.com/en/insights/publications/2025/12/what-to-watch-as-white-house-moves-to-federalize-ai-regulation)
