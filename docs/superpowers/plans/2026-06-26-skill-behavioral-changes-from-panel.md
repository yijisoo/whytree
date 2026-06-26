# Skill Behavioral Changes from the Expert Panel — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Implement the panel's *behavioral* findings that the spec edits only described — the skill-content and schema changes that change how the running counselor behaves: undo the growth-suppression, add a dwelling (being-mode) probe primitive, add rupture-and-repair, and make mode/axis a first-class branch attribute (with the coordinated whytree.io propagation).

**Architecture:** Four mostly-independent changes, ordered by blast radius. Tasks 1–3 are pure skill-content edits to `core/*.md` (no schema, no web propagation, re-freeze the equivalence baseline after each). Task 4 is a schema change (`mode`/`axis` branch attribute) that must land coordinated across the skill `core/tree-format.md` + `core/operations.md` AND whytree.io (`lib/tree/pure.ts`, types, `lib/llm/tools.ts`, the mutate/chat routes, evals) — the same blast-radius discipline the spec already requires for the `set_purpose` reframe.

**Tech Stack:** Markdown prompt files (skill); the skill test gates (`test/skill-lint.sh`, `test/lib/assembly_test.sh`, `test/equivalence/equivalence_test.sh`); on the web side TypeScript (`pure.ts`, Vitest) + the vendoring sync.

## Global Constraints

- Skill repo `/Users/yij/devel/whytree` is canonical; `whytree.io/prompts/{core,domains}` is generated/read-only and refreshed by `pnpm prompts:sync`.
- **No new node *type*** (locked). A `mode`/`axis` attribute is an orthogonal *flag* on an existing node/branch, not a new rung type — this is what keeps Task 4 inside the locked decision.
- Any edit to `core/*.md` or `domains/*` changes the assembly → **re-freeze `test/equivalence/baseline.flat.md`** and confirm `lint + assembly + equivalence` all green before commit.
- One full sentence per physical line in all prose edits.
- **Task 4 is gated** on the `set_focus` mode taxonomy being settled (the mode enum the attribute stores must match the resolved `goal / being / stabilize / suffering-witness / refer` set). Do not freeze the attribute's allowed values before that contract is resolved.
- Commit freely; do **not** push or release unless explicitly asked.
- Work on a branch off current `product-pack-mvp` (or its merge target); the vision tree `~/.whytree/whytree-product.json` is the reference model, not a build artifact.

---

## Task 1: Undo the growth/becoming suppression (node 4 de-inversion)

The panel found growth is not just absent but *inverted*: `signals.md` flags "growth" as an intellectualized term to push past, and `COMMITMENT_ARC.md` reframes every experiment away from becoming toward epistemic probing. Growth is now an adopted axis, so the suppression must be lifted without re-introducing sycophancy.

**Files:**
- Modify: `core/signals.md` (the intellectualized-term signal)
- Modify: `core/COMMITMENT_ARC.md` (the experiment framing)

**Interfaces:**
- Produces: a counselor that treats genuine becoming-language as a meaning signal, while still catching empty abstraction.

- [ ] **Step 1: Soften the growth-as-sycophancy flag in signals.md**
  Find the intellectualized-vocabulary signal listing "growth" among abstract terms to probe past. Change it so the *test* is concreteness/personal-pronoun grounding, not the word itself: a growth/mastery statement backed by a specific capability the person is building or a concrete next rung is a real axis signal; only ungrounded growth-talk ("I just want to grow") still triggers the paraphrase probe. Keep the other intellectualized terms.

- [ ] **Step 2: Stop COMMITMENT_ARC redefining the experiment away from becoming**
  In `COMMITMENT_ARC.md`, the epistemic-movement framing ("the real point isn't doing it, it's what it'll tell you") currently crowds out becoming. Add that an experiment may legitimately be a *step in becoming more capable* (building a skill / capacity), not only a knowledge probe — so a growth-axis user's experiment is framed as practice toward mastery, not only as a test. Do not remove the epistemic framing; add the becoming reading alongside it.

- [ ] **Step 3: Re-freeze the baseline and run gates**
  Run: `cd /Users/yij/devel/whytree && . test/lib/assembly.sh && norm(){ tr -d '\r'|grep -vE '^#{1,6} |^---$|^[[:space:]]*$'|sed 's/[[:space:]]*$//'; }; while read -r f; do cat "$f"; echo; done < <(WHYTREE_ROOT=/Users/yij/devel/whytree whytree_assembly_files life) | norm | LC_ALL=C sort > test/equivalence/baseline.flat.md`
  Then: `bash test/skill-lint.sh && bash test/lib/assembly_test.sh && bash test/equivalence/equivalence_test.sh`
  Expected: all green.

- [ ] **Step 4: Commit**
  `git commit -m "feat(skill): de-invert growth/becoming — treat grounded mastery-talk as a meaning signal (panel node 4)"` with the Co-Authored-By trailer.

---

## Task 2: Add the dwelling (being-mode) probe primitive (node 3)

Every concrete probe in `PROBE_PATTERNS.md` climbs or disambiguates; there is no in-place "increase the resolution of what is present" move, and `role-and-technique.md` defines the technique as only two motions (Why-Up / How-Down). A counselor who correctly detects being-mode has no repertoire for it.

**Files:**
- Modify: `core/PROBE_PATTERNS.md` (add the appreciative/dwelling probe as a named move)
- Modify: `core/role-and-technique.md` (name the being-mode reading of How-Down: explore more activities that occasion the same presence)
- Modify: `core/signals.md` (stop mis-flagging a legitimate being-mode landing — e.g. "be present", "find stillness" — as "too abstract")

**Interfaces:**
- Consumes: the being-dwell mode from `set_focus` (Task 4 / the spec).
- Produces: an appreciative probe primitive and a being-mode How-Down framing the counselor can use when mode = being.

- [ ] **Step 1: Add the appreciative/dwelling probe to PROBE_PATTERNS.md**
  Add a named move (e.g. "Resolution probe"): in being-mode, instead of "why does this matter?" (which cheapens presence), ask "what is it about this that lands — what exactly, right now?" — deepening the resolution of the present experience without climbing to a purpose above it. Note explicitly it is *not* a climbing why and *not* to be scored as a failed climb.

- [ ] **Step 2: Name the being-mode How-Down in role-and-technique.md**
  Add that How-Down has a being-mode reading: from a node that already occasions presence, branch to *other activities that occasion the same presence/being-self*, rather than to means toward an achievement. Same operation, different intent.

- [ ] **Step 3: Guard signals.md against mis-flagging being-mode landings**
  The "too abstract" signal would fire on a legitimate being-mode landing ("be present", "find stillness"). Add the exception: when the session is in being-mode, a short present-tense landing is the destination, not an under-specified answer to push past.

- [ ] **Step 4: Re-freeze the baseline and run gates** (same commands as Task 1 Step 3). Expected: all green.

- [ ] **Step 5: Commit**
  `git commit -m "feat(skill): add dwelling/appreciative probe + being-mode How-Down primitive (panel node 3)"`.

---

## Task 3: Add rupture-and-repair (node 7)

The skill has rich confrontational machinery but zero guidance for noticing an alliance rupture (withdrawal, terse replies, "that's not what I meant", defensiveness) or repairing it. Strong probing demands the containment half.

**Files:**
- Modify: `core/signals.md` (add a rupture-detection signal)
- Modify: `core/PROBE_PATTERNS.md` (add the repair move)

**Interfaces:**
- Produces: a counselor that detects rupture and repairs before continuing — feeding the Rupture/Repair eval dimension (spec S5).

- [ ] **Step 1: Add a rupture signal to signals.md**
  A silent signal: sudden terseness, withdrawal, "that's not what I meant", defensiveness, or a drop in disclosure after a push = a possible rupture. It fires the repair move, not another probe.

- [ ] **Step 2: Add the repair move to PROBE_PATTERNS.md**
  When rupture is detected: stop probing, acknowledge ("I think I pushed too fast there"), slow down, and hand control back ("what would feel more useful right now?"). Only resume technique once the alliance is restored.

- [ ] **Step 3: Re-freeze the baseline and run gates.** Expected: all green.

- [ ] **Step 4: Commit**
  `git commit -m "feat(skill): add rupture detection + repair move (panel node 7)"`.

---

## Task 4: Make mode/axis a first-class branch attribute (node 2) — COORDINATED, cross-repo

The schema has only `type: seed|why|how`; there is no way to mark a branch "being-mode / do-not-climb", or to record a *diagnosed* risk branch distinct from an untested stall (spec S6). This is the structural root of three failures (being-mode degrading to goal-mode, risk branch unmeasurable, divergence-warning mis-firing on a healthy multi-axis tree). **Gated on the `set_focus` mode taxonomy being resolved.**

**Files (skill):**
- Modify: `core/tree-format.md` (add the optional `mode`/`axis` attribute + the `diagnosed-mismatch` branch flag to the schema)
- Modify: `core/operations.md` (how the attribute is set/updated; honor "no new node type")
- Modify: `core/signals.md` (the divergence-warning must not fire on branches tagged as distinct axes)
**Files (whytree.io — same coordinated change):**
- Modify: `lib/tree/types.ts` (or wherever `Node`/`Tree` types live), `lib/tree/pure.ts` (carry the attribute through mutations), `lib/llm/tools.ts` (any tool that sets it), `app/api/tree/mutate/route.ts` + `app/api/chat/route.ts` (dispatch), `lib/evals/run.ts` (if graded). Then `pnpm prompts:sync` to refresh the vendored copy and `pnpm test` + `pnpm prompts:sync --check`.

**Interfaces:**
- Consumes: the resolved `set_focus` mode enum (`goal / being / stabilize / suffering-witness / refer`) — do not hardcode the values before that contract is settled.
- Produces: a per-branch `mode`/`axis` tag + a `diagnosed-mismatch` flag, recoverable from the tree JSON; the convergence-quality rubric and `risk-branch-named` telemetry (spec S5/S6) become computable from the artifact.

- [ ] **Step 1: Confirm the gate is open**
  Verify the `set_focus` mode taxonomy is resolved (the spec's set_focus open-question bullet is closed). If not, STOP — Task 4 is blocked; do Tasks 1–3 and report.

- [ ] **Step 2: Skill schema — add the attribute (tree-format.md + operations.md)**
  Add an optional `mode` (or `axis`) field on a node/branch and a `diagnosedMismatch` boolean flag, describing them abstractly (no bash/JSON-write detail in core). State they are orthogonal flags, not node types.

- [ ] **Step 3: Web — propagate the type through pure.ts (TDD)**
  Write a failing Vitest that a mutation preserves the new attribute, then thread it through the `Node`/`Tree` type and the relevant `pure.ts` functions. Run `pnpm vitest run` for the tree tests. Expected: RED → GREEN.

- [ ] **Step 4: Web — bind the remaining surfaces**
  Update tools/routes/evals that read or write nodes so the attribute round-trips (mirror the set_purpose blast-radius checklist). Run `pnpm test`. Expected: green.

- [ ] **Step 5: Sync + drift gate**
  `cd /Users/yij/devel/whytree.io && WHYTREE_SKILL_SRC=<skill> pnpm prompts:sync && pnpm prompts:sync --check` (exit 0).

- [ ] **Step 6: Re-freeze skill baseline + run skill gates** (Task 1 Step 3 commands). Expected: all green.

- [ ] **Step 7: Commit (one coordinated commit per repo)**
  Skill: `git commit -m "feat(skill): mode/axis branch attribute + diagnosed-mismatch flag (panel node 2)"`. Web: `git commit -m "feat: carry mode/axis + diagnosed-mismatch through tree schema (panel node 2)"`.

---

## Self-Review

**Coverage:** node 4 → Task 1; node 3 → Task 2; node 7 → Task 3; node 2 + spec S6 marker → Task 4. The remaining panel items (S1/S2/S3/S4/S5/S7/S8) are spec-level and already landed; their *implementation* (e.g. the longer-arc schema, the convergence-floor probe wording, the set_focus detector) are separate efforts tracked in the spec, not in this plan.

**Ordering:** Tasks 1–3 are independent and low-risk (pure skill content); Task 4 last because it is cross-repo and gated on the set_focus contract.

**Gate discipline:** every skill-content task re-freezes the equivalence baseline (intentional content change) and re-runs lint + assembly + equivalence; Task 4 additionally runs the web tests and the prompt-drift gate.

**Not in scope:** the `set_focus` detector itself, the longer-arc commitment schema (spec S7), and the convergence-floor probe content (spec S4) — each is its own change; this plan covers only node 2/3/4/7.
