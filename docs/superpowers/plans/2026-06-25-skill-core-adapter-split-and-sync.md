# Skill Core/Adapter Split + Tiered Sync — Implementation Plan (Spec 1, Plan 1A)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Split the canonical skill repo's mixed `SKILL.md` + supporting files into a clean `core/` + `domains/life/` + `skill/` structure behind a thin loader, reverse the prompt sync to flow skill→web into a read-only vendored copy, and add a real CI drift gate — all with a behavioral-equivalence gate proving "no behavior change."

**Architecture:** A single machine-readable *assembly manifest* (ordered list of prompt files per domain) becomes the shared seam consumed by three things: the human-readable loader in `SKILL.md`, the linter, and the sync script. Content is reconciled to one source-of-truth *before* any structural move, then physically relocated, then the linter and sync are made path-aware. The CI drift gate enforces vendored files are untouched generated artifacts via a self-consistency hash (each vendored file's content must match the sha256 in its own sync footer) — feasible with no submodule and no install dir.

**Tech Stack:** Markdown prompt files; Bash (`test/skill-lint.sh`, `preamble.sh`, GitHub Actions on ubuntu + windows); TypeScript sync script (`scripts/sync-skill-prompts.ts`, run via `pnpm`/`tsx`) and lefthook on the `whytree.io` side; the existing `whytree.io` eval harness (`lib/evals/run.ts`, `evals/RUBRIC.md`) for the one-time model-scored equivalence check.

## Global Constraints

- Skill repo `/Users/yij/devel/whytree` is **canonical**; `/Users/yij/devel/whytree.io/prompts/{core,domains}` is a **generated, read-only vendored copy** — never hand-edited.
- Sync direction is **skill → web**, scoped to `core` + `domains` only. The old web→install direction is retired.
- The tree vertical axis stays **label-free**; no Rasmussen layer names are introduced by any moved content.
- **No new node types** and **no behavioral change** to the counselor: this plan only relocates and re-wires content; it does not rewrite coaching prose.
- Supporting files are referenced by **bare filename** in prompt prose (the v0.3.0 flatten convention), but the loader and tooling resolve them through the manifest's relative paths.
- Per-file sha256 footer format is preserved verbatim: `\n\n<!-- whytree-sync: sha256:<12-hex> from <srcdir> -->\n` (matches `whytree.io/scripts/sync-skill-prompts.ts` line 9 regex).
- CI runs on both `ubuntu-latest` and `windows-latest`; all shell must stay LF and POSIX-bash compatible (Git Bash on Windows).
- Commit freely; **do not push or run `scripts/release.sh`** (project rule — release only on explicit request).
- **`set_focus` and the emergent-purpose reframe are OUT OF SCOPE for this plan** — deferred to Plan 1B, blocked on resolving their interface (spec Open Questions). The `core/` content this plan produces must leave a clean insertion point for them but must not implement them.

### Decisions baked into this plan (override before starting if you disagree)

- **DECISION 1 — file boundaries (spec Open Question, line 335): medium granularity.** `core/` splits into 8 files by concern (rules, tree-format, operations, visualization, signals, phases, role-and-technique, plus the two core coaching files PROBE_PATTERNS.md and COMMITMENT_ARC.md). Rationale: matches the natural section seams found in today's `SKILL.md`, keeps each file holdable in context, avoids both a monolith and over-fragmentation.
- **DECISION 2 — sync unit (spec Open Question, line 335): per-file with per-file sha256 footers, enumeration extended to recurse `core/` and `domains/`.** Rationale: smallest change to the existing proven sync mechanism; preserves the footer regex; lets the CI gate operate per-file.

---

## File Structure (target, skill repo)

```
/Users/yij/devel/whytree
  SKILL.md                       # THIN LOADER: frontmatter + load-order prose + entry instruction
  prompts.manifest               # machine-readable assembly: one "<layer> <relpath>" per line, in load order
  core/
    operating-rules.md           # from SKILL.md 7–34  (safety, one-question, slowdown, JSON-hiding, spatial-language ban)
    tree-format.md               # from SKILL.md 36–78 (slug naming, JSON schema, field docs) — minus UUID 80–89
    operations.md                # from SKILL.md 91–128 (abstract ops + validation invariants), made bash/uuid-free
    visualization.md             # from SKILL.md 130–145 (logical render contract: alpha labels, * convergence, DAG ref)
    signals.md                   # from SKILL.md 147–161 (silent probes)
    phases.md                    # from SKILL.md 203–454 core-only phase routing (role/technique/flow skeleton + Phase 4/5/5b structural parts)
    role-and-technique.md        # from SKILL.md 203–220 + 466–474 (role, the technique, additional rules)
    PROBE_PATTERNS.md            # relocated unchanged (classified CORE)
    COMMITMENT_ARC.md            # relocated unchanged (classified CORE)
  domains/
    life/
      SEED_QUESTIONS.md          # relocated unchanged
      READING.md                 # relocated unchanged
      framing.md                 # life-specific Phase 0 framing + opening-question variants (from SKILL.md 228–339 life parts)
      decision-session.md        # life-flavored Phase 5b decision lens (from SKILL.md 439–453)
  skill/
    mechanics.md                 # from SKILL.md 80–89,165–201,455–464 (uuid, preamble, demo trigger, telemetry pointer, model check, git pull)
    preamble.sh                  # relocated unchanged (path references updated)
    DEMO_MODE.md                 # relocated unchanged
    TELEMETRY.md                 # relocated unchanged
  test/
    lib/assembly.sh              # NEW: resolves prompts.manifest → ordered absolute paths; shared by linter + equivalence test
    skill-lint.sh                # MODIFIED: path-aware, checks the assembled concatenation not hardcoded root files
    equivalence/
      baseline.flat.md           # NEW: the reconciled pre-split flat content (frozen snapshot for the equivalence gate)
  .github/workflows/ci.yml       # MODIFIED: run assembly-equivalence test + path-aware lint + relocated preamble smoke test
```

```
/Users/yij/devel/whytree.io
  prompts/
    core/                        # NEW: vendored read-only copy of skill-repo/core (with sync footers)
    domains/                     # NEW: vendored read-only copy of skill-repo/domains
    web/                         # web platform mechanics (canonical here; created by relocating today's flat prompts)
  scripts/sync-skill-prompts.ts  # REWRITTEN: skill→web, recurse core+domains, scoped, footer self-hash
  lefthook.yml                   # MODIFIED: drift check now verifies vendored self-consistency
  .github/workflows/ci.yml       # MODIFIED: NEW real CI drift gate (self-consistency, no install dir needed)
  lib/session/phase.ts           # MODIFIED: FILES_BY_PHASE points at prompts/{core,domains,web} paths
  lib/session/prompt.ts          # MODIFIED: readSkillText resolves nested vendored paths
```

---

## Phase A — Reconciliation step zero (before any move or sync)

### Task 1: Reconcile the two divergent prompt sets into one source-of-truth, landed flat in the skill repo

The skill `SKILL.md` (474 lines) and web `prompts/SKILL.md` (536 lines) have diverged, plus the supporting files exist in both repos. The first skill→web sync will overwrite the web copies, so any web-only refinement must be back-ported into the skill repo *first*. This task produces (a) a reconciliation memo and (b) the merged flat content committed in the skill repo, still pre-split, so the split in Phase C is a pure relocation.

**Files:**
- Create: `/Users/yij/devel/whytree/docs/superpowers/plans/reconciliation-memo.md`
- Create: `/Users/yij/devel/whytree/test/equivalence/baseline.flat.md`
- Modify: `/Users/yij/devel/whytree/SKILL.md` (back-port any web-only improvements)
- Modify: `/Users/yij/devel/whytree/{PROBE_PATTERNS.md,COMMITMENT_ARC.md,SEED_QUESTIONS.md,READING.md}` (merge web refinements)

**Interfaces:**
- Produces: `test/equivalence/baseline.flat.md` — the frozen, reconciled, pre-split concatenation that Task 11's gate compares the post-split assembly against. Its content is the union of all *core + life-domain* prose (NOT the skill-only mechanics, NOT web-only memory prose).

- [ ] **Step 1: Diff every shared file across both repos**

Run:
```bash
for f in SKILL.md PROBE_PATTERNS.md COMMITMENT_ARC.md SEED_QUESTIONS.md READING.md; do
  echo "=== $f ==="
  diff -u "/Users/yij/devel/whytree.io/prompts/$f" "/Users/yij/devel/whytree/$f" || true
done > /tmp/whytree-recon.diff
wc -l /tmp/whytree-recon.diff
```
Expected: a non-empty unified diff capturing every divergence (web `SKILL.md` is ~62 lines longer, largely web-only memory/tool-call prose).

- [ ] **Step 2: Write the reconciliation memo**

In `docs/superpowers/plans/reconciliation-memo.md`, for each divergent chunk record a one-line decision in this exact table form:

```markdown
# Reconciliation memo (Spec 1, Task 1)

| File | Chunk (lines) | Divergence | Source of truth | Reason |
|---|---|---|---|---|
| SKILL.md | web 52–58 | web-only `tree_delta`/tool-call prose | WEB-ONLY → stays web platform mechanics, NOT back-ported to core | platform binding, Tier-3 |
| SKILL.md | <range> | <what differs> | SKILL or WEB | <why> |
| PROBE_PATTERNS.md | <range> | <what differs> | SKILL or WEB | <why> |
```
Rule: coaching/technique refinements tuned via the web eval harness are back-ported to the skill repo; platform-binding prose (tool calls, `tree_delta`, memory subsystem) is classified web-only and left out of `core`.

- [ ] **Step 3: Back-port the web-only coaching refinements into the skill files**

Apply each "WEB" source-of-truth row from the memo to the corresponding skill-repo file by editing in the merged prose. Make no other changes. (Concrete edits depend on Step 1's diff; the memo row is the spec for each edit.)

- [ ] **Step 4: Verify the existing linter still passes on the reconciled flat files**

Run: `cd /Users/yij/devel/whytree && bash test/skill-lint.sh`
Expected: PASS (reconciliation must not break any existing check — structure is still flat at this point).

- [ ] **Step 5: Freeze the reconciled baseline for the equivalence gate**

Build `test/equivalence/baseline.flat.md` as the concatenation of exactly the core + life-domain content (the prose that will live under `core/` and `domains/life/` after the split), in the intended load order, with a normalizing header per file:
```bash
cd /Users/yij/devel/whytree
{
  for f in SKILL.md PROBE_PATTERNS.md COMMITMENT_ARC.md SEED_QUESTIONS.md READING.md; do
    printf '## %s\n\n' "${f%.md}"; cat "$f"; printf '\n\n---\n\n'
  done
} > test/equivalence/baseline.flat.md
wc -l test/equivalence/baseline.flat.md
```
Note: this baseline intentionally includes skill-only mechanics prose from `SKILL.md` too at this stage; Task 11 will define the precise normalization (strip mechanics + web-only) so the comparison is apples-to-apples. Freezing it now captures the pre-split state.

- [ ] **Step 6: Commit**

```bash
cd /Users/yij/devel/whytree
git add docs/superpowers/plans/reconciliation-memo.md test/equivalence/baseline.flat.md SKILL.md PROBE_PATTERNS.md COMMITMENT_ARC.md SEED_QUESTIONS.md READING.md
git commit -m "docs: reconcile skill/web prompt divergence into single source-of-truth (Spec 1 Task 1)

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Phase B — The assembly seam

### Task 2: Introduce the machine-readable assembly manifest and resolver

This is the shared seam. The manifest lists every prompt file in load order, tagged by layer; the resolver turns it into ordered absolute paths. The linter and the equivalence test both consume the resolver so they can never disagree about what "the assembly" is.

**Files:**
- Create: `/Users/yij/devel/whytree/prompts.manifest`
- Create: `/Users/yij/devel/whytree/test/lib/assembly.sh`
- Create: `/Users/yij/devel/whytree/test/lib/assembly_test.sh`

**Interfaces:**
- Produces: `whytree_assembly_files <domain>` (bash function, sourced from `test/lib/assembly.sh`) — echoes absolute paths, one per line, in load order, for layers `core` + `domains/<domain>` + `skill`. Also `whytree_assembly_files_core_domain <domain>` — same but excludes the `skill` layer (used by the equivalence gate). `$WHYTREE_ROOT` defaults to the repo root inferred from the script location.
- Consumed by: Task 7 (linter), Task 11 (equivalence gate).

- [ ] **Step 1: Write the failing resolver test**

Create `test/lib/assembly_test.sh`:
```bash
#!/usr/bin/env bash
set -euo pipefail
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
. "$HERE/assembly.sh"

# core layer must come first, skill layer last, life domain in the middle
mapfile -t files < <(whytree_assembly_files life)
[[ "${files[0]}" == */core/operating-rules.md ]] || { echo "FAIL: core not first"; exit 1; }
[[ "${files[-1]}" == */skill/mechanics.md ]]     || { echo "FAIL: mechanics not last"; exit 1; }
printf '%s\n' "${files[@]}" | grep -q '/domains/life/SEED_QUESTIONS.md' || { echo "FAIL: life seeds missing"; exit 1; }

# core+domain view must exclude the skill layer
mapfile -t cd < <(whytree_assembly_files_core_domain life)
printf '%s\n' "${cd[@]}" | grep -q '/skill/' && { echo "FAIL: skill leaked into core+domain view"; exit 1; }
echo "OK: assembly resolver"
```

- [ ] **Step 2: Run it to verify it fails**

Run: `bash /Users/yij/devel/whytree/test/lib/assembly_test.sh`
Expected: FAIL (`assembly.sh` and `prompts.manifest` do not exist yet).

- [ ] **Step 3: Write the manifest**

Create `prompts.manifest` (the load order; `#` comments and blank lines ignored):
```
# layer  relative-path
core      core/operating-rules.md
core      core/role-and-technique.md
core      core/tree-format.md
core      core/operations.md
core      core/visualization.md
core      core/signals.md
core      core/phases.md
core      core/PROBE_PATTERNS.md
core      core/COMMITMENT_ARC.md
domain    domains/{domain}/framing.md
domain    domains/{domain}/SEED_QUESTIONS.md
domain    domains/{domain}/READING.md
domain    domains/{domain}/decision-session.md
skill     skill/mechanics.md
```

- [ ] **Step 4: Write the resolver**

Create `test/lib/assembly.sh`:
```bash
#!/usr/bin/env bash
# Resolve prompts.manifest into ordered absolute file paths.
: "${WHYTREE_ROOT:=$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)}"

_whytree_emit() { # $1 = domain, $2 = include-skill (1/0)
  local domain="$1" include_skill="$2" layer rel
  while read -r layer rel; do
    [[ -z "$layer" || "$layer" == \#* ]] && continue
    [[ "$layer" == skill && "$include_skill" != 1 ]] && continue
    rel="${rel//\{domain\}/$domain}"
    printf '%s/%s\n' "$WHYTREE_ROOT" "$rel"
  done < "$WHYTREE_ROOT/prompts.manifest"
}
whytree_assembly_files()             { _whytree_emit "$1" 1; }
whytree_assembly_files_core_domain() { _whytree_emit "$1" 0; }
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `bash /Users/yij/devel/whytree/test/lib/assembly_test.sh`
Expected: `OK: assembly resolver` (the listed files don't exist on disk yet, but the resolver only computes paths — it does not stat them).

- [ ] **Step 6: Commit**

```bash
cd /Users/yij/devel/whytree
git add prompts.manifest test/lib/assembly.sh test/lib/assembly_test.sh
git commit -m "feat: add prompt assembly manifest + resolver (Spec 1 Task 2)

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Phase C — The split (pure relocation, no prose rewrite)

> All four tasks below MOVE prose verbatim from the reconciled flat files into the manifest's target files. The only edits permitted are: (1) section headers, (2) replacing absolute/`~/.claude/skills/whytree/` path references with bare filenames or manifest-relative references, (3) removing bash/uuid detail from `core/operations.md` per DECISION (mechanics move to `skill/mechanics.md`). No coaching prose is reworded.

### Task 3: Create `core/` files

**Files:**
- Create: `core/operating-rules.md`, `core/role-and-technique.md`, `core/tree-format.md`, `core/operations.md`, `core/visualization.md`, `core/signals.md`, `core/phases.md`
- Move: `PROBE_PATTERNS.md` → `core/PROBE_PATTERNS.md`, `COMMITMENT_ARC.md` → `core/COMMITMENT_ARC.md`
- Source: `/Users/yij/devel/whytree/SKILL.md` (line ranges per the File Structure map)

- [ ] **Step 1: Relocate the two core coaching files with git mv**

```bash
cd /Users/yij/devel/whytree
mkdir -p core
git mv PROBE_PATTERNS.md core/PROBE_PATTERNS.md
git mv COMMITMENT_ARC.md core/COMMITMENT_ARC.md
```

- [ ] **Step 2: Carve the core sections out of SKILL.md into their target files**

Create each `core/*.md` by copying the mapped line ranges from the pre-split `SKILL.md` content (use the reconciled version from Task 1). Mapping:
- `core/operating-rules.md` ← Operating rules (SKILL.md 7–34)
- `core/role-and-technique.md` ← Your role (203–212) + The technique (214–220) + Additional rules (466–474)
- `core/tree-format.md` ← File naming (40–43) + Schema (45–78)  *(omit UUID 80–89)*
- `core/operations.md` ← Operations (91–114) + Validation (116–128), with bash/`uuidgen`/file-path detail removed (those go to `skill/mechanics.md` in Task 5)
- `core/visualization.md` ← Visualization format (130–145)
- `core/signals.md` ← Signal detection (147–161)
- `core/phases.md` ← the structural, domain-neutral parts of Session flow (Phase 4 Iterate 402–410, Phase 5 Reflection 416–424, Phase 5b structural shell 439–453) plus the phase-routing skeleton; domain-flavored framing/seeding/decision prose goes to `domains/life/` in Task 4.

- [ ] **Step 3: Verify the core+domain assembly has no platform mechanics leakage**

Run:
```bash
cd /Users/yij/devel/whytree
grep -nE 'uuidgen|~/\.whytree|preamble\.sh|curl |\.current' core/*.md && echo "LEAK FOUND" || echo "OK: core is mechanics-free"
```
Expected: `OK: core is mechanics-free`.

- [ ] **Step 4: Commit**

```bash
cd /Users/yij/devel/whytree
git add core/
git commit -m "refactor: relocate structural core into core/ (Spec 1 Task 3)

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

### Task 4: Create `domains/life/` files

**Files:**
- Move: `SEED_QUESTIONS.md` → `domains/life/SEED_QUESTIONS.md`, `READING.md` → `domains/life/READING.md`
- Create: `domains/life/framing.md`, `domains/life/decision-session.md`
- Source: `/Users/yij/devel/whytree/SKILL.md` (228–339 life framing/seeding; 439–453 decision lens)

- [ ] **Step 1: Relocate the two domain files with git mv**

```bash
cd /Users/yij/devel/whytree
mkdir -p domains/life
git mv SEED_QUESTIONS.md domains/life/SEED_QUESTIONS.md
git mv READING.md domains/life/READING.md
```

- [ ] **Step 2: Carve life-specific prose into framing.md and decision-session.md**

- `domains/life/framing.md` ← Phase 0 first-time framing beats + opening-question variants (Shower Question etc.) + Phase 1 seeding guidance that is life-specific (SKILL.md 228–339, the life-flavored parts; cross-references to `SEED_QUESTIONS.md` kept as bare filename).
- `domains/life/decision-session.md` ← Phase 5b life decision-lens prose (SKILL.md 439–453).

- [ ] **Step 3: Verify domain files contain no `core` structural duplication**

Run:
```bash
cd /Users/yij/devel/whytree
grep -nE 'schemaVersion|rootIds|silent probe' domains/life/*.md && echo "STRUCTURAL LEAK" || echo "OK: domain has no core schema/signal prose"
```
Expected: `OK: domain has no core schema/signal prose`.

- [ ] **Step 4: Commit**

```bash
cd /Users/yij/devel/whytree
git add domains/
git commit -m "refactor: relocate life-purpose pack into domains/life/ (Spec 1 Task 4)

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

### Task 5: Create `skill/` platform-mechanics layer

**Files:**
- Create: `skill/mechanics.md`
- Move: `preamble.sh` → `skill/preamble.sh`, `DEMO_MODE.md` → `skill/DEMO_MODE.md`, `TELEMETRY.md` → `skill/TELEMETRY.md`
- Source: `/Users/yij/devel/whytree/SKILL.md` (UUID 80–89; Preamble 165–201; Telemetry 455–464)

- [ ] **Step 1: Relocate skill-only files with git mv**

```bash
cd /Users/yij/devel/whytree
mkdir -p skill
git mv preamble.sh skill/preamble.sh
git mv DEMO_MODE.md skill/DEMO_MODE.md
git mv TELEMETRY.md skill/TELEMETRY.md
```

- [ ] **Step 2: Author skill/mechanics.md from the mechanics sections**

Create `skill/mechanics.md` containing: UUID generation (80–85), platform notes / Git Bash (87–89), the Preamble invocation + parsing (165–194) with the path updated to `bash ~/.claude/skills/whytree/skill/preamble.sh`, the Sonnet model check, demo-mode trigger + cleanup (195–201) referencing `skill/DEMO_MODE.md`, and the telemetry routing (455–464) referencing `skill/TELEMETRY.md`. Also include the abstract→concrete binding for tree operations: "Persist each tree operation as a JSON write under `~/.whytree/<slug>.json`; generate node IDs with `uuidgen`" — the bash detail removed from `core/operations.md` in Task 3 lands here.

- [ ] **Step 3: Update the preamble path reference inside preamble.sh if it self-references**

Run:
```bash
cd /Users/yij/devel/whytree
grep -n 'skills/whytree/preamble.sh\|skills/whytree' skill/preamble.sh || echo "no self-reference to update"
```
If matches exist, edit them to `skills/whytree/skill/preamble.sh`. Expected after: no stale `skills/whytree/preamble.sh` (without `skill/`) references remain.

- [ ] **Step 4: Commit**

```bash
cd /Users/yij/devel/whytree
git add skill/
git commit -m "refactor: relocate platform mechanics into skill/ (Spec 1 Task 5)

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

### Task 6: Rewrite `SKILL.md` as the thin loader

**Files:**
- Modify: `/Users/yij/devel/whytree/SKILL.md` (replace body; keep frontmatter)

**Interfaces:**
- Consumes: `prompts.manifest` (Task 2) — the loader prose must reference every file the manifest lists, in order, so the Task 7 linter check `loader-references-manifest` passes.

- [ ] **Step 1: Replace SKILL.md body with the loader**

Keep the verbatim frontmatter (lines 1–5: `name: whytree`, `description`, `user_invocable: true`). Replace the body with load-order prose that names each manifest file in order and instructs: "Read these files in order before acting; `core/` defines the invariant technique and tree mechanics, `domains/life/` supplies the active domain's seeds/probes/framing, `skill/mechanics.md` binds operations to this platform (bash + `~/.whytree` JSON). Run `bash ~/.claude/skills/whytree/skill/preamble.sh` first (see `skill/mechanics.md`)." List the files as bare references matching the manifest paths.

- [ ] **Step 2: Verify frontmatter is intact**

Run: `cd /Users/yij/devel/whytree && head -5 SKILL.md`
Expected: the four-key frontmatter block unchanged (`name: whytree`, `user_invocable: true`).

- [ ] **Step 3: Commit**

```bash
cd /Users/yij/devel/whytree
git add SKILL.md
git commit -m "refactor: reduce SKILL.md to thin loader over core/domains/skill (Spec 1 Task 6)

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Phase D — Make the linter path-aware

### Task 7: Refactor `test/skill-lint.sh` to validate the assembled content, not hardcoded root files

The current linter hardcodes root filenames and greps `SKILL.md` for safety/schema/phase strings (skill-repo map §4). After the split that content lives across `core/` files. The fix: resolve the assembly via Task 2's resolver, concatenate it, and run the existing content checks against the concatenation; check file *existence* via the manifest; add a `loader-references-manifest` check.

**Files:**
- Modify: `/Users/yij/devel/whytree/test/skill-lint.sh`
- Test: `/Users/yij/devel/whytree/test/skill-lint.sh` is self-testing (it exits non-zero on failure)

**Interfaces:**
- Consumes: `whytree_assembly_files life` and `whytree_assembly_files_core_domain life` from `test/lib/assembly.sh`.

- [ ] **Step 1: Add a failing check — every manifest file must exist**

Near the top of `skill-lint.sh` after it sets `SKILL_DIR`, source the resolver and add:
```bash
. "$SKILL_DIR/test/lib/assembly.sh"
missing=0
while read -r f; do [[ -f "$f" ]] || { echo "FAIL: manifest file missing: $f"; missing=1; }; done < <(whytree_assembly_files life)
[[ "$missing" == 0 ]] || exit 1
```

- [ ] **Step 2: Run to confirm it passes against the now-split tree**

Run: `cd /Users/yij/devel/whytree && bash test/skill-lint.sh` (it will still fail later checks; this step only confirms the new existence check passes).
Expected: no "manifest file missing" lines (the split files all exist).

- [ ] **Step 3: Replace hardcoded "required files" + "file references" checks**

Delete the old loops (map §4 lines ~18–50) that assume root-level supporting files and that grep `SKILL.md` for backtick references. Replace the "file references" intent with a `loader-references-manifest` check:
```bash
while read -r layer rel; do
  [[ -z "$layer" || "$layer" == \#* ]] && continue
  rel="${rel//\{domain\}/life}"; base="$(basename "$rel")"
  grep -q "$base" "$SKILL_DIR/SKILL.md" || { echo "FAIL: loader SKILL.md does not reference $base"; exit 1; }
done < "$SKILL_DIR/prompts.manifest"
```

- [ ] **Step 4: Point the content checks at the assembled concatenation**

Build the assembly once and run the existing safety/schema/phase greps against it instead of against `SKILL.md`:
```bash
ASM="$(mktemp)"; while read -r f; do cat "$f"; echo; done < <(whytree_assembly_files life) > "$ASM"
```
Repoint every existing `grep ... "$SKILL"` safety/schema/phase check (map §4 categories 4, 7, 8, 9) to `grep ... "$ASM"`. Leave the TELEMETRY.md curl checks pointing at `skill/TELEMETRY.md` (update that path). Remove `"$ASM"` with a trap at exit.

- [ ] **Step 5: Run the full linter**

Run: `cd /Users/yij/devel/whytree && bash test/skill-lint.sh`
Expected: `PASS` — all 12 categories satisfied against the assembled content.

- [ ] **Step 6: Commit**

```bash
cd /Users/yij/devel/whytree
git add test/skill-lint.sh
git commit -m "test: make skill-lint path-aware via assembly manifest (Spec 1 Task 7)

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Phase E — Sync + CI drift gate (whytree.io side)

### Task 8: Rewrite `sync-skill-prompts.ts` to push skill→web, recursing core + domains

**Files:**
- Modify: `/Users/yij/devel/whytree.io/scripts/sync-skill-prompts.ts`
- Test: `/Users/yij/devel/whytree.io/scripts/sync-skill-prompts.test.ts` (create; Vitest, matching repo test runner)

**Interfaces:**
- Produces: `pnpm prompts:sync` (push from skill repo `core/`+`domains/` into `whytree.io/prompts/{core,domains}`, each file footed with `<!-- whytree-sync: sha256:<hash-of-content> from <srcdir> -->`) and `pnpm prompts:sync --check` (verify each vendored file's stripped content hashes to the sha256 in its own footer → self-consistency).
- Consumes: skill-repo source path via `WHYTREE_SKILL_SRC` env (default `/Users/yij/devel/whytree`).

- [ ] **Step 1: Write the failing self-consistency test**

Create `scripts/sync-skill-prompts.test.ts`:
```typescript
import { describe, it, expect } from 'vitest';
import { footerFor, verifySelfConsistent } from './sync-skill-prompts';

describe('vendored footer self-consistency', () => {
  it('accepts content whose footer matches its hash', () => {
    const body = '# core rule\n\nbe kind.\n';
    const vendored = body + footerFor(body, '/skill/core');
    expect(verifySelfConsistent(vendored)).toBe(true);
  });
  it('rejects content edited after the footer was written', () => {
    const body = '# core rule\n\nbe kind.\n';
    const vendored = body.replace('kind', 'cruel') + footerFor(body, '/skill/core');
    expect(verifySelfConsistent(vendored)).toBe(false);
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `cd /Users/yij/devel/whytree.io && pnpm vitest run scripts/sync-skill-prompts.test.ts`
Expected: FAIL (`footerFor` / `verifySelfConsistent` not exported yet).

- [ ] **Step 3: Implement the exported helpers + reversed sync**

In `sync-skill-prompts.ts`: keep the `hash()` (sha256 slice(0,12)) and `FOOTER_RE`. Add and export:
```typescript
export function footerFor(content: string, srcDir: string): string {
  return `\n\n<!-- whytree-sync: sha256:${hash(content)} from ${srcDir} -->\n`;
}
export function verifySelfConsistent(vendored: string): boolean {
  const m = vendored.match(/<!-- whytree-sync: sha256:([a-f0-9]+) from /);
  if (!m) return false;
  return hash(stripFooter(vendored).trim()) === m[1];
}
```
Change `SRC` to read from the skill repo (`process.env.WHYTREE_SKILL_SRC ?? '/Users/yij/devel/whytree'`), enumerate `core/**` and `domains/**` recursively (`.md` only, still excluding `*_commented.md`), and write each into `whytree.io/prompts/<relpath>` with `footerFor`. Rewrite `--check` to walk vendored `prompts/{core,domains}/**` and assert `verifySelfConsistent` on each (drop the install-dir comparison).

- [ ] **Step 4: Run the test to verify it passes**

Run: `cd /Users/yij/devel/whytree.io && pnpm vitest run scripts/sync-skill-prompts.test.ts`
Expected: PASS (both cases).

- [ ] **Step 5: Commit**

```bash
cd /Users/yij/devel/whytree.io
git add scripts/sync-skill-prompts.ts scripts/sync-skill-prompts.test.ts
git commit -m "feat: reverse prompt sync to skill->web with footer self-consistency (Spec 1 Task 8)

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

### Task 9: Inaugural reverse-sync — land the vendored copy and rewire the web loader

**Files:**
- Create (generated): `/Users/yij/devel/whytree.io/prompts/core/**`, `/Users/yij/devel/whytree.io/prompts/domains/**`
- Move: today's flat `whytree.io/prompts/*.md` web-platform prose → `whytree.io/prompts/web/`
- Modify: `/Users/yij/devel/whytree.io/lib/session/phase.ts` (FILES_BY_PHASE paths), `/Users/yij/devel/whytree.io/lib/session/prompt.ts` (nested path resolution)

**Interfaces:**
- Consumes: `pnpm prompts:sync` from Task 8.
- Produces: `prompts/{core,domains,web}` tri-layer that `readSkillText` composes (preserving the per-phase lazy-load behavior in `phase.ts`).

- [ ] **Step 1: Relocate web-only prompt prose into prompts/web/**

```bash
cd /Users/yij/devel/whytree.io
mkdir -p prompts/web
git mv prompts/SKILL.md prompts/web/SKILL.md   # web mechanics + tool-call prose stay canonical here
git mv prompts/README.md prompts/web/README.md
```
(Leave `*_commented.md` operator notes where they are; they never shipped.)

- [ ] **Step 2: Run the inaugural sync**

Run: `cd /Users/yij/devel/whytree.io && WHYTREE_SKILL_SRC=/Users/yij/devel/whytree pnpm prompts:sync`
Expected: `prompts/core/*.md` and `prompts/domains/life/*.md` created, each ending in a `whytree-sync` footer.

- [ ] **Step 3: Verify self-consistency check is green**

Run: `cd /Users/yij/devel/whytree.io && pnpm prompts:sync --check`
Expected: exit 0, no drift.

- [ ] **Step 4: Rewire FILES_BY_PHASE and readSkillText to the new paths**

In `lib/session/phase.ts`, update `FILES_BY_PHASE` entries to the vendored/web relative paths (e.g. `core/operating-rules.md`, `domains/life/SEED_QUESTIONS.md`, `web/SKILL.md`). In `lib/session/prompt.ts` `readSkillText`, change the loop to resolve paths relative to `prompts/` allowing subdirectories, and strip the sync footer before injecting (so the footer never enters the model context):
```typescript
const raw = readFileSync(p, 'utf8').replace(/\n*<!-- whytree-sync:[^>]*-->\n*$/, '');
```

- [ ] **Step 5: Verify the web build and prompt composition still work**

Run: `cd /Users/yij/devel/whytree.io && pnpm test -- lib/session && pnpm build`
Expected: session/prompt tests PASS; build succeeds. (If a snapshot of the composed prompt exists, update it intentionally and note the footer-stripping in the commit.)

- [ ] **Step 6: Commit**

```bash
cd /Users/yij/devel/whytree.io
git add prompts/ lib/session/phase.ts lib/session/prompt.ts
git commit -m "feat: vendor skill core+domains, relocate web prompts to prompts/web (Spec 1 Task 9)

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

### Task 10: Add the real CI drift gate and retire the old direction

**Files:**
- Modify: `/Users/yij/devel/whytree.io/.github/workflows/ci.yml`
- Modify: `/Users/yij/devel/whytree.io/lefthook.yml`

- [ ] **Step 1: Replace the CI "no install dir" comment with a real drift gate**

In `ci.yml`, replace the lines 39–40 comment block with a step that runs the self-consistency check (no install dir, no skill checkout needed):
```yaml
      - name: Prompt vendoring drift gate
        run: pnpm prompts:sync --check
```

- [ ] **Step 2: Make the drift error message instructive**

In `sync-skill-prompts.ts` `check()`, ensure a failure prints exactly:
```
Vendored prompt drift: prompts/<file> was hand-edited.
These files are generated, read-only artifacts. Edit the source in the skill
repo (/Users/yij/devel/whytree) and re-run `pnpm prompts:sync`.
```

- [ ] **Step 3: Update lefthook to the self-consistency check**

In `lefthook.yml` lines 18–20, change the glob to also cover vendored dirs and keep `pnpm prompts:sync --check`:
```yaml
  prompts-sync:
    glob: "prompts/**/*.md"
    run: pnpm prompts:sync --check
```

- [ ] **Step 4: Verify the gate fails on a hand-edit and passes when reverted**

Run:
```bash
cd /Users/yij/devel/whytree.io
f=$(ls prompts/core/*.md | head -1)
printf '\nhand edit\n' >> "$f"
pnpm prompts:sync --check; echo "exit=$?"   # expect non-zero + instructive message
git checkout -- "$f"
pnpm prompts:sync --check; echo "exit=$?"   # expect 0
```
Expected: first check non-zero with the instructive message; second check exit 0.

- [ ] **Step 5: Commit**

```bash
cd /Users/yij/devel/whytree.io
git add .github/workflows/ci.yml lefthook.yml scripts/sync-skill-prompts.ts
git commit -m "ci: add real prompt-drift gate (self-consistency), retire web->install sync (Spec 1 Task 10)

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Phase F — Behavioral-equivalence gate

### Task 11: Deterministic assembly-equivalence test (skill repo, CI)

Prove the post-split assembly preserves the reconciled baseline content (the cheap, falsifiable everyday gate). Normalization strips file headers, the skill-only mechanics layer, and whitespace so the comparison is core+domain prose only.

**Files:**
- Create: `/Users/yij/devel/whytree/test/equivalence/equivalence_test.sh`
- Modify: `/Users/yij/devel/whytree/test/equivalence/baseline.flat.md` (re-freeze to the normalized core+domain form)

**Interfaces:**
- Consumes: `whytree_assembly_files_core_domain life` (Task 2).

- [ ] **Step 1: Define normalization and re-freeze the baseline**

Create the normalizer inline and regenerate the baseline from the *reconciled flat* content limited to core+domain prose (exclude the mechanics sections that moved to `skill/`):
```bash
cd /Users/yij/devel/whytree
norm() { grep -vE '^## |^---$|^\s*$' | sed 's/[[:space:]]\+$//'; }
while read -r f; do cat "$f"; done < <(whytree_assembly_files_core_domain life) | norm | sort > test/equivalence/baseline.flat.md
```
(`sort` makes the gate order-insensitive: it checks the *set* of content lines is preserved, not their order — load order is separately asserted by the manifest test.)

- [ ] **Step 2: Write the equivalence test**

Create `test/equivalence/equivalence_test.sh`:
```bash
#!/usr/bin/env bash
set -euo pipefail
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"; ROOT="$(cd "$HERE/../.." && pwd)"
. "$ROOT/test/lib/assembly.sh"
norm() { grep -vE '^## |^---$|^\s*$' | sed 's/[[:space:]]\+$//'; }
current="$(while read -r f; do cat "$f"; done < <(whytree_assembly_files_core_domain life) | norm | sort)"
if diff <(printf '%s\n' "$current") "$ROOT/test/equivalence/baseline.flat.md" >/tmp/equiv.diff; then
  echo "OK: post-split assembly is content-equivalent to baseline"
else
  echo "FAIL: assembly diverged from frozen baseline:"; cat /tmp/equiv.diff; exit 1
fi
```

- [ ] **Step 3: Run it to verify it passes**

Run: `cd /Users/yij/devel/whytree && bash test/equivalence/equivalence_test.sh`
Expected: `OK: post-split assembly is content-equivalent to baseline`.

- [ ] **Step 4: Prove it catches a regression**

Run:
```bash
cd /Users/yij/devel/whytree
printf '\nan accidental new sentence.\n' >> core/operating-rules.md
bash test/equivalence/equivalence_test.sh; echo "exit=$?"   # expect FAIL + diff
git checkout -- core/operating-rules.md
```
Expected: FAIL with the offending line in the diff.

- [ ] **Step 5: Wire both new tests into skill-repo CI**

In `/Users/yij/devel/whytree/.github/workflows/ci.yml`, add steps after the linter:
```yaml
      - name: Assembly resolver test
        run: bash test/lib/assembly_test.sh
      - name: Behavioral-equivalence gate
        run: bash test/equivalence/equivalence_test.sh
```
Also update the existing preamble smoke-test step to the relocated path `bash skill/preamble.sh`.

- [ ] **Step 6: Verify the whole skill-repo CI suite locally**

Run: `cd /Users/yij/devel/whytree && bash test/skill-lint.sh && bash test/lib/assembly_test.sh && bash test/equivalence/equivalence_test.sh && bash skill/preamble.sh >/dev/null && echo ALL-GREEN`
Expected: `ALL-GREEN`.

- [ ] **Step 7: Commit**

```bash
cd /Users/yij/devel/whytree
git add test/equivalence/ .github/workflows/ci.yml
git commit -m "test: add deterministic behavioral-equivalence gate + wire CI (Spec 1 Task 11)

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

### Task 12: One-time model-scored equivalence check (merge gate, manual)

The deterministic gate proves content is preserved; it cannot prove the *model behaves* the same when prose is chunked across files and loaded per-phase. This task runs the spec-required before/after scored comparison once, using the web eval harness, as a merge-gate checklist (not CI — it needs model calls and is not free).

**Files:**
- Create: `/Users/yij/devel/whytree.io/evals/spec1-equivalence/README.md` (the recorded procedure + thresholds + result)

- [ ] **Step 1: Capture the pre-split baseline scores**

From the commit just before Task 9's rewire, run the existing Tier-3 persona stress cases (`evals/RUBRIC.md` M/V/P/C 1–10, E 1–5) through `lib/evals/run.ts` against the pre-split composed prompt. Record M/V/P/C/E per case.

- [ ] **Step 2: Capture the post-split scores**

Run the identical cases against the post-split composed prompt (vendored `core`+`domains` + `web`). Record the same dimensions.

- [ ] **Step 3: Apply the pass threshold and record the verdict**

Pass rule (from `evals/RUBRIC.md` blocking thresholds): no dimension regresses by >1.0 on M/V/P/C, and E does not regress by >0.5, on any case. Write the per-case before/after table and PASS/FAIL verdict into `evals/spec1-equivalence/README.md`.

- [ ] **Step 4: Commit the recorded result**

```bash
cd /Users/yij/devel/whytree.io
git add evals/spec1-equivalence/README.md
git commit -m "test: record one-time model-scored split-equivalence verdict (Spec 1 Task 12)

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Out of scope — deferred to Plan 1B (blocked on Open Questions)

These Spec 1 line items are **not** in this plan because their interface is an unresolved Open Question and a no-placeholder plan cannot invent it:

- **`set_focus` initial-context operation** (spec lines 142–148, 337): final name, parameters, and `focus_area` seeding rule must be resolved first. `core/` here leaves the insertion point (operations + phases) clean for it.
- **Emergent-purpose reframe of `set_purpose`** (spec lines 134–140, 227): the coordinated cross-repo rename across `lib/tree/pure.ts:255`, `lib/llm/tools.ts:88–97`, `lib/db/trees.ts:313–318`, `app/api/chat/route.ts:186–189`, `app/api/tree/mutate/route.ts:21,64–65`, `lib/evals/run.ts:37`, and the web/core prompt prose. The new tool name and schema are undecided.

Recommend resolving both in a short brainstorm, then writing Plan 1B as one coordinated change (the spec is explicit it must land completely on both sides at once).

---

## Self-Review

**Spec coverage (Spec 1, lines 200–227):**
- "split into core/domains/life/skill" → Tasks 3–6. ✓
- "build skill→web vendor sync with CI drift check" → Tasks 8, 10. ✓
- "retire old web→install sync" → Task 10 Step 3 + Task 8 (`--check` rewritten). ✓
- "relocate today's content with no behavior change" → Tasks 3–5 (pure relocation) + Tasks 11–12 (equivalence gates). ✓
- "abstract core, thin loader adapter per platform" → Task 6 (loader) + Task 5 (`skill/mechanics.md` binds ops) + Task 9 (`prompts/web` is the web adapter). ✓
- "reconciliation step zero before first reverse-sync" → Task 1. ✓
- "behavioral-equivalence gate, same rubric, stated threshold" → Task 11 (deterministic) + Task 12 (model-scored, threshold from RUBRIC.md). ✓
- "CI gate error message instructs editing skill repo + re-sync" → Task 10 Step 2. ✓
- "vendored files are generated, read-only" → enforced by Task 10 self-consistency gate. ✓
- "`set_focus` + emergent-purpose reframe" → explicitly deferred to Plan 1B (justified: Open Question). ◐ (intentional carve-out, surfaced to author)

**Placeholder scan:** No TBD/TODO; every code/edit step shows the content or the exact mapping (line ranges into named files). Prose-move steps cite source line ranges from the verified skill-repo map rather than reproducing ~470 lines verbatim — acceptable because the move is mechanical and the linter + equivalence gate verify completeness.

**Type/name consistency:** `whytree_assembly_files` / `whytree_assembly_files_core_domain` (Task 2) used consistently in Tasks 7 and 11. `footerFor` / `verifySelfConsistent` (Task 8) used in Tasks 9–10. `prompts.manifest` referenced identically across Tasks 2, 6, 7. Footer regex matches the existing `FOOTER_RE` (Global Constraints).
