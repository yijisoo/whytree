# Why Tree Web Interface — Design Spec

**Date:** 2026-04-10
**Status:** Approved
**Target:** KAIST students, course-integrated pilot (May 2026)

## Overview

Add Why Tree as a feature within the Kardens.io web app, enabling non-technical users to run recurring purpose-discovery sessions through a browser. The Claude counselor runs via the Messages API with conversation state and tree data stored in Turso alongside existing Kardens data.

## Decisions

- **AI backend:** Claude Messages API (GA, stable) — not Managed Agents (beta risk)
- **Deployment:** Within the Kardens.io repo and domain — shared auth, shared DB, shared infra
- **Tree visualization:** Graphical top-down DAG (dagre + React), not ASCII art. Revisit layout direction after initial testing.
- **Session model:** Recurring personal sessions. No facilitator dashboard or group features.

## Data Model

Five new tables in the Kardens Drizzle schema. Follow existing conventions: UUID text PKs, ISO text timestamps, `datetime('now')` defaults.

### `whytreeTrees`

| Column | Type | Notes |
|--------|------|-------|
| id | text (UUID) PK | |
| userId | text FK → users | |
| slug | text | URL-safe identifier |
| name | text | Encrypted |
| purpose | text | One-sentence synthesis, encrypted, nullable |
| schemaVersion | integer | Default 1 |
| lastExperimentId | text | FK → whytreeNodes, nullable |
| createdAt | text | |
| updatedAt | text | |

### `whytreeNodes`

| Column | Type | Notes |
|--------|------|-------|
| id | text (UUID) PK | |
| treeId | text FK → whytreeTrees | |
| label | text | Encrypted |
| type | text | 'seed' / 'why' / 'how' |
| isSeed | integer | 1 if original seed (never changes) |
| createdAt | text | |

### `whytreeEdges`

| Column | Type | Notes |
|--------|------|-------|
| parentId | text FK → whytreeNodes | Composite PK |
| childId | text FK → whytreeNodes | Composite PK |
| treeId | text FK → whytreeTrees | For efficient queries |

### `whytreeMessages`

| Column | Type | Notes |
|--------|------|-------|
| id | text (UUID) PK | |
| treeId | text FK → whytreeTrees | |
| role | text | 'user' / 'assistant' / 'system' |
| content | text | Encrypted |
| phase | text | Current phase when message was sent, nullable |
| createdAt | text | |

### `whytreeTreeEvents`

Append-only mutation log for tree history reconstruction.

| Column | Type | Notes |
|--------|------|-------|
| id | text (UUID) PK | |
| treeId | text FK → whytreeTrees | |
| messageId | text FK → whytreeMessages | Which conversation turn caused this |
| action | text | 'add_seed', 'why_up', 'how_down', 'converge', 'rename', 'relink', 'remove' |
| payload | text | JSON of the change, encrypted |
| createdAt | text | |

## Backend Architecture

### Dependencies

New: `@anthropic-ai/sdk`

### Model Selection

Use `claude-sonnet-4-6` for the counselor. Sonnet balances conversational quality with cost — important for a student pilot with recurring sessions. Can upgrade to Opus if counselor depth proves insufficient during testing.

### API Routes

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/whytree/trees` | GET, POST | List user's trees, create new tree |
| `/api/whytree/trees/[treeId]` | GET, PATCH | Get tree with nodes+edges, update metadata |
| `/api/whytree/trees/[treeId]/chat` | POST | Send a message, stream Claude's response via SSE |

### Chat Route Flow

On each user message to `/api/whytree/trees/[treeId]/chat`:

1. **Load context** — fetch tree state (nodes + edges) and recent messages from Turso. Budget ~180K tokens after system prompt.
2. **Build messages array** — system prompt (phase-appropriate layers) + conversation history + current tree state.
3. **Call Claude Messages API** with streaming.
4. **Parse response** — extract conversational text (streamed to browser via SSE) and tree operation tags (executed server-side).
5. **Apply tree mutations** — run operations against DB, log each to `whytreeTreeEvents` with `messageId` link.
6. **Save messages** — store user and assistant messages to `whytreeMessages`.
7. **Send final SSE event** — updated tree state for the frontend to re-render.

### Tree Operation Tags

Claude emits structured tags within its response to signal tree mutations:

```xml
<tree_op action="why_up" child="uuid-123" label="I want to feel like my work matters" />
<tree_op action="add_seed" label="Teaching data scientists" />
<tree_op action="converge" id1="uuid-1" id2="uuid-2" label="Making others see" />
<phase_transition to="2" />
```

The server strips these before streaming text to the client.

### Tree Operations

Server-side functions in `app/lib/whytree/operations.ts`:

- `addSeed(treeId, label)` — insert node + edge, log event
- `whyUp(treeId, childId, label)` — create why node, link as parent, update root tracking, log event
- `howDown(treeId, parentId, label)` — create how node, link as child, log event
- `converge(treeId, id1, id2, label)` — create parent of both, log event
- `rename(treeId, nodeId, newLabel)` — update label, log event
- `remove(treeId, nodeId)` — remove node and edges, log event
- `relink(treeId, nodeId, newParentId)` — update edges, log event

Each function validates structural invariants (root tracking, bidirectional edges) and writes to both the live tables and the event log in a single transaction.

### Circuit Breaker

Reuse or extend the existing Kardens circuit breaker pattern (`app/lib/coach/circuit-breaker.ts`) — per-user rate limiting, timeout, failure tracking.

## Counselor Logic — System Prompt Translation

The SKILL.md counselor behavior becomes a **layered system prompt** with phase-appropriate context injection.

### Prompt Layers

| Layer | Content | When injected | ~Tokens |
|-------|---------|---------------|---------|
| Base | Operating rules, tone, role, visualization suppression, signal detection, tree_op tag format | Every request | ~2K |
| Phase 0 | First question routing, shower question, session return check-in | Session start | ~500 |
| Phase 1 | Seed questions (from SEED_QUESTIONS.md content) | When seeding | ~400 |
| Phase 2 | Probe patterns, anti-sycophancy rules, pushback patterns (from PROBE_PATTERNS.md content) | When probing | ~600 |
| Phase 3-4 | How Down rules, root quality gate, iteration guidance | When exploring | ~400 |
| Phase 5 | Reading recs (READING.md), Commitment Arc (COMMITMENT_ARC.md) | When closing | ~500 |
| Tree state | Current tree as structured JSON (nodes, edges, roots) | Every request | Variable |
| Session context | Session gap, returning vs new user, last session summary | Every request | ~200 |

### Phase Tracking

Phase stored as a field on the latest assistant message. Claude signals transitions via `<phase_transition to="N" />` tags. The server records the transition and adjusts which prompt layers are injected on the next turn.

### Translation Summary

| Claude Code version | Web version |
|---------------------|-------------|
| File reads (SEED_QUESTIONS.md, etc.) | Injected into system prompt at the right phase |
| Bash commands (UUID gen, curl) | Server-side functions |
| JSON file I/O (~/.whytree/*.json) | Turso queries |
| preamble.sh | Server-side session initialization |
| ASCII tree in chat | Suppressed — replaced by graphical tree panel |
| Analytics consent file | User setting in Kardens DB |
| Session notes files | Derived from whytreeMessages + event log |

## Frontend

### Navigation

"Why Tree" appears as a sidebar navigation item in UnifiedSidebar, alongside Daily Note and All Notes. Standard Kardens navigation — no separate mode or exit button.

### Routes

```
app/(app)/whytree/
  layout.tsx        — uses standard (app) layout with sidebar
  page.tsx          — tree list + "Start new tree" button
  [treeId]/
    page.tsx        — session view (tree + chat)
```

### Session View — Two-Panel Layout

| Left panel (~55%) | Right panel (~45%) |
|---|---|
| Tree visualization | Chat interface |
| Interactive dagre top-down graph | Message stream (like coach/mel panel) |
| Nodes as colored cards by type | Text input at bottom |
| Zoom/pan, click-to-inspect | Streaming text via SSE |

On mobile: single panel with toggle between chat and tree views.

### Tree Visualization

- **Layout:** dagre top-down DAG (roots at top, seeds at bottom)
- **Nodes:** Rounded cards with text wrapping, colored by type (seed / why / how)
- **Convergence:** Visually highlighted (thicker border or distinct styling)
- **Interaction:** Click node for popover (type, creation date, which conversation turn created it via event log)
- **Animation:** New nodes fade/slide in on creation
- **Canvas:** Zoom and pan for large trees
- **Library:** reactflow or D3 with dagre layout
- **Layout direction:** Top-down initially; revisit after user testing

### Chat Interface

- Messages stream in via SSE
- ASCII tree blocks from Claude's response are suppressed (graphical tree replaces them)
- Markdown rendering for conversational text
- Simple text input (no rich editor)
- Typing indicator during streaming

### Session Continuity

Returning to `/whytree/[treeId]` loads chat history from `whytreeMessages` and tree state from live tables. SESSION_GAP computed server-side from the latest message timestamp.

## Kardens Notes Integration

During Phase 1 (seeding), the system prompt includes **titles of the user's 50 most recent Kardens notes** (by `createdAt` desc) from the `notes` table.

- Titles only — not full content
- Enough for Claude to reference: "I see you've been writing about X — is that connected?"
- If user engages with a specific note, the server fetches that note's content and injects it into the next turn's context
- No opt-out toggle for now; revisit if it feels intrusive

## Analytics / Telemetry

Reuse the existing `/api/whytree-telemetry` endpoint in Kardens. After tree mutations, the server sends structural metrics (node counts by type, max depth, convergence count, root count) — same payload format as the CLI version. No user content is included.

Analytics consent is stored as a user-level setting in Kardens (not a file). Consent prompt appears during the first Why Tree session, same wording as the CLI version.

## Security

- All user-generated content encrypted at rest (tree names, node labels, messages, event payloads) using Kardens' existing AES-256-GCM encryption
- No user input interpolated into shell commands (no Bash in the web version)
- Analytics payloads contain only integer metrics — never labels or content
- Claude API key stored as environment variable, never exposed to client
- Auth enforced by existing proxy.ts — all `/whytree` routes are protected

## Out of Scope

- Facilitator dashboard or aggregate analytics
- Group sharing or peer review of trees
- Export/import of trees
- Mobile-native app
- Managed Agents integration
