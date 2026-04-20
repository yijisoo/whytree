# Install Restructure Implementation Plan (v2)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix the install-path bug that breaks `/whytree` on fresh installs by flattening the repo so cloning to `~/.claude/skills/whytree/` produces `SKILL.md` directly at that path. Make `preamble.sh` self-locate so future install layouts (symlink, plugin marketplace, dotfiles sync) keep working. Keep existing v0.2.10 users on a clean migration path.

**Architecture:** Single stage. `git mv` skill files from `.claude/skills/whytree/` to repo root. SKILL.md keeps its current `bash ~/.claude/skills/whytree/preamble.sh` invocation — which is wrong today but becomes correct after flatten. `preamble.sh` is rewritten to derive its own dir from `${BASH_SOURCE[0]}` so it works for any install shape (standard, symlinked, marketplace, dotfiles). Rollback tag created before file moves so a single revert command exists if anything breaks. Lint regex tightened, CHANGELOG written in the existing house style (`## [X.Y.Z] — YYYY-MM-DD`), `.version` left to `scripts/release.sh` (which writes a short SHA, not semver — manual edits would be overwritten).

**Tech Stack:** Bash, markdown, git. No new dependencies.

---

## Why single-stage (changed from v1 of this plan)

Earlier draft proposed a two-stage rollout: Stage 1 surgical fix to restore the auto-update channel, Stage 2 the layout flatten. Three review-cycle findings collapsed this to one stage:

1. **Claude Code does recursive skill discovery.** Verified empirically: `find ~/.claude/skills -name SKILL.md` returns ~200 SKILL.md files at every depth, all of which appear as available skills. Brand-new users on the broken nested install do discover the skill — they just can't run preamble. So the Stage 1 fallback chain (`bash flat || bash nested`) wasn't bridging a discovery gap; it was scaffolding for a problem that didn't exist.

2. **`bash X || bash Y` is error-masking, not path-selection** (Codex + code-reviewer). Any real preamble failure (e.g., `set -euo pipefail` trip on bad data) would cascade through both arms. Replace with explicit `[ -f X ]` check or — cleaner — flatten the layout so there's only one path.

3. **Existing users need a manual `cd … && git pull origin main` regardless.** Stage 1 didn't avoid that. So its only benefit was "auto-update works for the *next* migration after this one" — which has no concrete next migration planned. Don't pay scaffolding cost for hypothetical future use.

Single-stage flatten is what the reviewers landed on. Two-stage was over-design.

---

## Background

### The bug

- README install: `git clone https://github.com/yijisoo/whytree.git ~/.claude/skills/whytree` → clones whole repo there.
- After install, `~/.claude/skills/whytree/SKILL.md` does not exist. The actual SKILL.md is nested at `~/.claude/skills/whytree/.claude/skills/whytree/SKILL.md`.
- Claude Code's recursive discovery finds the nested SKILL.md and loads the skill.
- SKILL.md (line 170) tells the model to run `bash ~/.claude/skills/whytree/preamble.sh` — that path doesn't exist.
- Preamble fails, `/whytree` aborts at startup.
- Auto-update logic lives inside preamble. Broken preamble = no auto-updates. Existing users need manual `git pull` to escape.

### Files that hardcode the layout

From `grep '~/\.claude/skills/whytree\|\.claude/skills/whytree'`:

- `.claude/skills/whytree/SKILL.md` lines 170, 181, 193, 356, 376, 439, 462
- `.claude/skills/whytree/preamble.sh` lines 16, 116
- `test/skill-lint.sh` lines 7, 30, 258
- `CLAUDE.md` lines 15, 19–25
- `PROMPT.md` lines 6, 72, 232, 276
- `README.md` line 41 (install one-liner — destination doesn't change, no rewrite needed)
- `README.ko.md` line 41 (same as above)
- `docs/todo.md`, `docs/superpowers/plans/2026-04-14-question-refinement.md` — historical, intentionally not updated

### Out of scope

- Publishing as an official Claude Code marketplace plugin.
- Tree data format (`~/.whytree/`) — completely untouched.
- Restructuring `whytree-review-feedback` (developer-only skill) beyond what's required to keep it loadable.
- Switching `.version` from SHA to semver (orthogonal — `scripts/release.sh` decides, not this plan).

### Known facts (from investigation, not assumption)

| Fact | Source |
|---|---|
| `.version` contains a git short SHA (`d8c929c` today), not semver | `cat .version`; `scripts/release.sh:159` writes `git rev-parse --short HEAD > .version` |
| Version source of truth is `## [X.Y.Z]` heading in `CHANGELOG.md` | `scripts/release.sh:79` parses it |
| CHANGELOG entries use `## [X.Y.Z] — YYYY-MM-DD` (with brackets) | Existing entries; release.sh:139 writes that format |
| `release.sh` does the version bump and changelog insert; manual edits would conflict | `scripts/release.sh:78–156` |
| Claude Code discovers skills recursively (any depth under `~/.claude/skills/`) | `find ~/.claude/skills -name SKILL.md` returns deeply-nested matches that all appear in available-skills |
| Demo invocation in SKILL.md line 193 is `bash …preamble.sh demo` (with arg, no quotes) | Direct read of SKILL.md:193 |

---

## Pre-flight

These tasks run before any file changes. They establish a recovery path.

### Task 0.1: Create rollback tag

**Files:** none (just a git tag)

**Why:** If the flatten introduces a regression, a one-command revert (`git checkout pre-flatten-rollback`) restores the working state. Cheap insurance.

- [ ] **Step 1: Tag current HEAD**

```bash
git tag pre-flatten-rollback
```

- [ ] **Step 2: Verify tag exists**

```bash
git tag -l pre-flatten-rollback
```
Expected: prints `pre-flatten-rollback`.

- [ ] **Step 3: Note for later — push the tag with the release**

```bash
# Will run later as part of the release: git push origin pre-flatten-rollback
```

No commit (tags are stored separately).

---

### Task 0.2: Check for in-flight PRs against affected paths

**Files:** none (read-only check)

**Why:** Any open PR touching `.claude/skills/whytree/SKILL.md` will conflict with the rename. Adversarial review flagged this; trivial to check.

- [ ] **Step 1: List open PRs**

```bash
# Confirm gh is authed first; an unauth/offline gh returns empty output and would falsely look "safe."
gh auth status >/dev/null 2>&1 || { echo "gh not authenticated — auth before continuing"; exit 1; }
gh pr list --state open --json number,title,files --jq '.[] | select(.files[].path | startswith(".claude/skills/whytree/")) | "#\(.number): \(.title)"'
```

Expected: empty output (no conflicting PRs). If output is non-empty, **stop the plan** and either land/close the PR or coordinate the rebase before proceeding. Document any handled PRs in commit message.

If `gh` is not installed or this repo is unforked/local-only, skip this task and note it in the release commit message — there are no PRs to conflict with.

No commit.

---

### Task 0.3: Confirm working tree clean and on main

- [ ] **Step 1: Verify state**

```bash
git status --short
git rev-parse --abbrev-ref HEAD
```

Expected: `git status --short` empty; current branch `main`. If dirty, stash or commit before proceeding.

No commit.

---

## Layout flatten

### Task 1.1: Move skill files to repo root with `git mv`

**Files:**
- Move: `.claude/skills/whytree/SKILL.md` → `SKILL.md`
- Move: `.claude/skills/whytree/preamble.sh` → `preamble.sh`
- Move: `.claude/skills/whytree/SEED_QUESTIONS.md` → `SEED_QUESTIONS.md`
- Move: `.claude/skills/whytree/PROBE_PATTERNS.md` → `PROBE_PATTERNS.md`
- Move: `.claude/skills/whytree/COMMITMENT_ARC.md` → `COMMITMENT_ARC.md`
- Move: `.claude/skills/whytree/READING.md` → `READING.md`
- Remove (empty after moves): `.claude/skills/whytree/`

**Why:** With these files at repo root, `git clone … ~/.claude/skills/whytree/` produces an install where `~/.claude/skills/whytree/SKILL.md` exists directly. The hardcoded path in the existing SKILL.md (`bash ~/.claude/skills/whytree/preamble.sh`) becomes correct. `whytree-review-feedback` stays at `.claude/skills/whytree-review-feedback/SKILL.md` — it's a developer-only skill loaded only when working in the repo dir, and the recursive discovery means it'll still be found there.

- [ ] **Step 1: `git mv` each file**

```bash
git mv .claude/skills/whytree/SKILL.md SKILL.md
git mv .claude/skills/whytree/preamble.sh preamble.sh
git mv .claude/skills/whytree/SEED_QUESTIONS.md SEED_QUESTIONS.md
git mv .claude/skills/whytree/PROBE_PATTERNS.md PROBE_PATTERNS.md
git mv .claude/skills/whytree/COMMITMENT_ARC.md COMMITMENT_ARC.md
git mv .claude/skills/whytree/READING.md READING.md
```

- [ ] **Step 2: Remove empty whytree skill subdir**

```bash
rmdir .claude/skills/whytree
```

If `rmdir` fails with "not empty," check what's left. The expected non-tracked culprit is `.DS_Store` (macOS Finder leaves it behind whenever the folder is opened in GUI). Resolve with:

```bash
ls -la .claude/skills/whytree   # see what's there
rm -f .claude/skills/whytree/.DS_Store   # only if it's just .DS_Store
rmdir .claude/skills/whytree
```

If anything else remains (a stray file you didn't expect), **stop and investigate** — do not blindly delete. The directory is empty by design after the `git mv` calls; anything left is a signal.

`whytree-review-feedback` is in a sibling subdir (`.claude/skills/whytree-review-feedback/`), not inside `whytree/`, so it's unaffected.

- [ ] **Step 3: Verify file presence**

```bash
ls SKILL.md preamble.sh SEED_QUESTIONS.md PROBE_PATTERNS.md COMMITMENT_ARC.md READING.md
ls .claude/skills/   # should show only whytree-review-feedback
```

Expected: all six skill files at root; `.claude/skills/` contains only `whytree-review-feedback/`.

No commit yet — subsequent tasks update the references and we batch-commit.

---

### Task 1.2: Rewrite `preamble.sh` to self-locate via `${BASH_SOURCE[0]}`

**Files:**
- Modify: `preamble.sh` (lines 16 and 116, where `SKILL_DIR=~/.claude/skills/whytree` is hardcoded)

**Why:** Currently preamble hardcodes `SKILL_DIR=~/.claude/skills/whytree`. After the flatten, this happens to be correct for the standard install, but breaks for any non-standard install (symlink, marketplace, dotfiles checkout). Self-locating via `BASH_SOURCE` makes the script work from wherever it's invoked. Adversarial review flagged this; cheap to do alongside the flatten.

Also: detect when `~/.claude/skills/whytree` is a symlink to a developer's working copy and skip the auto-update check (otherwise `git pull origin main` against a feature branch / dirty tree fails noisily). Adversarial finding #4.

- [ ] **Step 1: Read the current preamble.sh end-to-end**

```bash
# Reference only — do this with the Read tool to capture the exact context for the edits below.
```

The two hardcoded `SKILL_DIR=~/.claude/skills/whytree` lines are at line 16 (used for `.version` read at line 17) and line 116 (used for `.git` check at line 117).

- [ ] **Step 2: Replace the version-read block (~lines 14–21)**

Replace the existing block:

```bash
# 0. Version
SKILL_DIR=~/.claude/skills/whytree
if [ -f "$SKILL_DIR/.version" ]; then
  echo "VERSION=$(cat "$SKILL_DIR/.version")"
else
  echo "VERSION=unknown"
fi
```

with:

```bash
# 0. Version — derive SKILL_DIR from this script's own location so we work
# regardless of install shape (standard ~/.claude/skills/whytree, symlinked
# dev checkout, plugin marketplace path, etc.).
SCRIPT_PATH="${BASH_SOURCE[0]:-$0}"
SKILL_DIR="$(cd "$(dirname "$SCRIPT_PATH")" && pwd -P)"
if [ -f "$SKILL_DIR/.version" ]; then
  echo "VERSION=$(cat "$SKILL_DIR/.version")"
else
  echo "VERSION=unknown"
fi
```

`pwd -P` resolves symlinks so the dir is canonical (avoids two-source-of-truth confusion if the script is reached via a symlink chain).

- [ ] **Step 3: Replace the update-check block (~lines 114–126)**

Replace the existing block:

```bash
# 4. Update check
echo "=== UPDATE_CHECK ==="
SKILL_DIR=~/.claude/skills/whytree
if [ -d "$SKILL_DIR/.git" ] && cd "$SKILL_DIR" 2>/dev/null; then
  git fetch origin main --quiet 2>/dev/null || true
  UPDATE_COUNT=$(git rev-list HEAD..origin/main --count 2>/dev/null || echo 0)
  echo "UPDATES_AVAILABLE=$UPDATE_COUNT"
  if [ "$UPDATE_COUNT" -gt 0 ] 2>/dev/null; then
    git log --oneline HEAD..origin/main 2>/dev/null
  fi
else
  echo "UPDATES_AVAILABLE=0"
fi
```

with:

```bash
# 4. Update check
# SKILL_DIR was set above from BASH_SOURCE; reuse it (do not re-hardcode a path).
echo "=== UPDATE_CHECK ==="
INSTALL_LINK=~/.claude/skills/whytree
# Skip update check when the install dir is a symlink (typically a dev
# checkout on a feature branch). git pull on a feature/dirty tree would
# fail noisily and isn't what the developer wants.
if [ -L "$INSTALL_LINK" ]; then
  echo "UPDATES_AVAILABLE=0"
  echo "SYMLINK_INSTALL=1  # skipping update check"
elif [ -d "$SKILL_DIR/.git" ]; then
  # Use a subshell so cd doesn't affect the rest of the script.
  (
    cd "$SKILL_DIR" || exit 0
    # Avoid concurrent-update corruption: if another /whytree session is
    # already pulling, skip this round.
    if [ -f .git/index.lock ]; then
      echo "UPDATES_AVAILABLE=0"
      echo "UPDATE_SKIPPED=concurrent  # another session holds .git/index.lock"
      exit 0
    fi
    git fetch origin main --quiet 2>/dev/null || true
    UPDATE_COUNT=$(git rev-list HEAD..origin/main --count 2>/dev/null || echo 0)
    echo "UPDATES_AVAILABLE=$UPDATE_COUNT"
    if [ "$UPDATE_COUNT" -gt 0 ] 2>/dev/null; then
      git log --oneline HEAD..origin/main 2>/dev/null
    fi
  )
else
  echo "UPDATES_AVAILABLE=0"
fi
```

Three changes vs the original:
1. Reuse `SKILL_DIR` from the BASH_SOURCE-derived value (no second hardcode).
2. Symlink detection — addresses adversarial finding #4 (dev footgun).
3. Concurrent-update guard via `.git/index.lock` check — addresses adversarial finding #7 (race).

- [ ] **Step 4: Smoke test the updated preamble against current layout**

(At this point in the plan, layout has flattened. Run preamble from the dev repo and from a temp simulated install.)

```bash
# A. From the dev repo's flattened root:
bash preamble.sh | head -10

# B. From a simulated standard install:
TMP=$(mktemp -d)
mkdir -p "$TMP/.claude/skills/whytree"
cp SKILL.md preamble.sh SEED_QUESTIONS.md PROBE_PATTERNS.md COMMITMENT_ARC.md READING.md "$TMP/.claude/skills/whytree/"
echo "test-sha" > "$TMP/.claude/skills/whytree/.version"
HOME=$TMP bash "$TMP/.claude/skills/whytree/preamble.sh" | head -3
rm -rf "$TMP"
```

Expected for both: `=== WHYTREE PREAMBLE ===` line, then `VERSION=<sha>` line, then `USER_STATUS=...` line. No `bash: …: No such file or directory` errors.

No commit yet.

---

### Task 1.3: Update `SKILL.md` for layout-agnostic file references

**Files:**
- Modify: `SKILL.md` lines 170, 181, 193, 356, 376, 439, 462 (line numbers from pre-flatten file; same content lives in flattened `SKILL.md` at the same line numbers)

**Why:** Even though `bash ~/.claude/skills/whytree/preamble.sh` becomes correct after flatten, the four supporting-file references (`SEED_QUESTIONS.md`, `PROBE_PATTERNS.md`, `READING.md`, `COMMITMENT_ARC.md`) and the auto-update `cd ~/.claude/skills/whytree && git pull` should switch to language that's robust to install variations. Reasoning matches Codex's "use explicit existence checks, not shell-OR" — clear intent over clever shell tricks.

- [ ] **Step 1: Verify SKILL.md preamble invocation works as-is**

Read `SKILL.md:170`. Confirm it says `bash ~/.claude/skills/whytree/preamble.sh`. After flatten, this is correct for the standard install. **No change needed at line 170 or 193 (demo invocation).**

If we wanted defense-in-depth across non-standard installs (symlink dirs that aren't named `whytree`, marketplace), we could change to:
```bash
bash ~/.claude/skills/whytree/preamble.sh
```
…and trust the model to substitute the actual base directory it sees in the load context if the standard path fails. We're explicitly choosing **not** to add a fallback chain — Codex called the chain pattern out as error-masking. If the standard path fails for some user, they'll get a clear "No such file" error and can report it.

No edit at lines 170/193.

- [ ] **Step 2: Add a post-update restart instruction**

Find the auto-update accept-flow in SKILL.md (the paragraph around line 181 starting "If `UPDATES_AVAILABLE` > 0"). Locate the existing sentence about `git pull origin main` running on accept. Append this sentence to that paragraph:

```
After a successful pull that touches SKILL.md or any supporting file, tell the user: *"Update applied. Please /exit and run /whytree again — the new version isn't fully active until you restart."* Do not continue the current session against the freshly-pulled tree; the model has the pre-update SKILL.md cached and absolute paths in cached content may no longer match disk.
```

This is the in-product mitigation for Scenario F (mid-session auto-update hazard). Reviewers (code-reviewer I1, adversarial S1/S2) flagged that the prior "out-of-scope, follow-up patch" punt was wrong — this is the modal upgrade path for every existing user post-v0.3.0, so it lands in this release.

The actual `git diff HEAD..origin/main` and `git pull origin main` commands at line 181 are unchanged and remain correct after the flatten.

- [ ] **Step 3: Update lines 356, 376, 439, 462 (supporting-file reads)**

Replace each absolute path with a base-directory-relative phrasing. The model knows the skill base directory from session-start load context.

Line 356: `\`~/.claude/skills/whytree/SEED_QUESTIONS.md\`` → `\`SEED_QUESTIONS.md\` (in this skill's base directory)`
Line 376: `\`~/.claude/skills/whytree/PROBE_PATTERNS.md\`` → `\`PROBE_PATTERNS.md\` (in this skill's base directory)`
Line 439: `\`~/.claude/skills/whytree/READING.md\`` → `\`READING.md\` (in this skill's base directory)`
Line 462: `\`~/.claude/skills/whytree/COMMITMENT_ARC.md\`` → `\`COMMITMENT_ARC.md\` (in this skill's base directory)`

- [ ] **Step 4: Add a model-side recovery hint after the preamble invocation block**

Insert as a new paragraph immediately after the closing fence of the bash block that contains `bash ~/.claude/skills/whytree/preamble.sh` (in the current file the bash command is on line 170 and the closing ```` ``` ```` is on line 171; insert after line 171):

```markdown
**If the bash command above fails with "No such file or directory":** the user is on a pre-v0.3.0 install with the deep-nested layout. Tell them: *"Looks like your whytree install is on an old layout. One-time fix: `cd ~/.claude/skills/whytree && git pull origin main`. Then run /whytree again."* Do not attempt session work until they update.
```

This addresses adversarial finding #2 — in-product recovery instead of relying solely on CHANGELOG.

No commit yet — Task 1.4 batches everything.

---

### Task 1.4: Update `test/skill-lint.sh` to flat layout

**Files:**
- Modify: `test/skill-lint.sh` line 7 (SKILL_DIR), line 30 (file-reference regex)

**Why:** Linter currently expects skill files at `$REPO_ROOT/.claude/skills/whytree`. After flatten, they're at `$REPO_ROOT`.

- [ ] **Step 1: Change SKILL_DIR**

Edit `test/skill-lint.sh` line 7 from:
```bash
SKILL_DIR="$REPO_ROOT/.claude/skills/whytree"
```
to:
```bash
SKILL_DIR="$REPO_ROOT"
```

- [ ] **Step 2: Replace the file-reference check (lines 27–38)**

Replace the existing block:

```bash
# --- 2. All file references in SKILL.md resolve ---
echo
echo "2. File references"
refs=$(grep -oE '~/.claude/skills/whytree/[A-Z_]+\.md' "$SKILL" | sort -u || true)
for ref in $refs; do
  filename=$(basename "$ref")
  if [ -f "$SKILL_DIR/$filename" ]; then
    pass "Reference $filename resolves"
  else
    fail "Reference $filename not found in $SKILL_DIR"
  fi
done
```

with:

```bash
# --- 2. File references use base-directory-relative phrasing, files exist ---
echo
echo "2. File references"
# After v0.3.0 flatten, supporting *.md files are referenced by bare name
# (no absolute path). Forbid absolute paths — they were the v0.2.x bug.
abs_refs=$(grep -nE '~/\.claude/skills/whytree/[A-Z_]+\.md' "$SKILL" || true)
if [ -z "$abs_refs" ]; then
  pass "No absolute paths to supporting *.md files in SKILL.md"
else
  fail "Found absolute path(s) to supporting *.md files (use bare filename instead):"
  echo "$abs_refs"
fi

# Verify each supporting file referenced by name exists
for f in SEED_QUESTIONS.md PROBE_PATTERNS.md COMMITMENT_ARC.md READING.md; do
  if grep -qE "\`$f\`" "$SKILL"; then
    if [ -f "$SKILL_DIR/$f" ]; then
      pass "Reference $f resolves"
    else
      fail "Reference $f mentioned but file missing in $SKILL_DIR"
    fi
  fi
done
```

- [ ] **Step 3: Verify whytree-review-feedback path (line 258) is still correct**

Read `test/skill-lint.sh:258`. It should read:
```bash
REVIEW_SKILL="$REPO_ROOT/.claude/skills/whytree-review-feedback/SKILL.md"
```

This path is unchanged by the flatten (review-feedback isn't moved). No edit needed; verify and move on.

- [ ] **Step 4: Run lint**

```bash
bash test/skill-lint.sh
```

Expected: all checks PASS, exit 0. If any FAIL, fix and re-run before committing.

- [ ] **Step 5: Commit the layout flatten + preamble + SKILL.md + lint together**

```bash
git add SKILL.md preamble.sh SEED_QUESTIONS.md PROBE_PATTERNS.md COMMITMENT_ARC.md READING.md test/skill-lint.sh
git commit -m "$(cat <<'EOF'
refactor(install): flatten skill files to repo root + self-locating preamble

Why: README install command clones the whole repo to ~/.claude/skills/whytree,
which left SKILL.md nested two levels deep and broke the hardcoded
~/.claude/skills/whytree/preamble.sh invocation. Fresh installs failed at
session start.

Move SKILL.md, preamble.sh, SEED_QUESTIONS.md, PROBE_PATTERNS.md,
COMMITMENT_ARC.md, READING.md from .claude/skills/whytree/ to repo root.
After this, cloning to ~/.claude/skills/whytree/ produces SKILL.md at the
install root — matching Claude Code's standard skill layout.

preamble.sh now derives SKILL_DIR from BASH_SOURCE (works for symlinked
dev checkouts, plugin marketplace installs, dotfiles syncs). Adds:
- Symlink detection: skip auto-update check when ~/.claude/skills/whytree
  is a symlink (typical for dev), to avoid git pull on dirty/feature
  branches.
- Concurrent-update guard: skip update check if .git/index.lock present
  (another /whytree session is pulling).

SKILL.md supporting-file references switch from absolute paths to
"in this skill's base directory" phrasing. Adds a recovery hint paragraph
telling the model what to say if the bash invocation fails on pre-v0.3.0
installs.

Lint script: SKILL_DIR points to repo root; new check forbids absolute
*.md paths (re-introduces the bug if anyone ever adds one).

whytree-review-feedback skill stays at .claude/skills/whytree-review-feedback/
(developer-only, loaded as project skill).

A pre-flatten-rollback git tag exists at the parent commit for one-step
recovery if needed.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

### Task 1.5: Update CLAUDE.md, PROMPT.md doc references

**Files:**
- Modify: `CLAUDE.md` lines 15, 19–24
- Modify: `PROMPT.md` lines 6, 72, 232, 276

**Why:** These project-doc files reference the old `.claude/skills/whytree/<file>` location. After flatten, they're at repo root.

- [ ] **Step 1: Update CLAUDE.md**

Edit each occurrence:
- Line 15: `Claude reads the skill files in \`.claude/skills/whytree/\` directly` → `Claude reads the skill files at the repo root directly`
- Lines 19–24: `\`.claude/skills/whytree/SKILL.md\`` → `\`SKILL.md\`` (and similarly for `SEED_QUESTIONS.md`, `PROBE_PATTERNS.md`, `COMMITMENT_ARC.md`, `READING.md`, `preamble.sh`)
- Line 25: `\`.claude/skills/whytree-review-feedback/SKILL.md\`` — **unchanged**, this skill wasn't moved.

- [ ] **Step 2: Update PROMPT.md**

- Line 6: `Skill under test: .claude/skills/whytree/SKILL.md` → `Skill under test: SKILL.md`
- Line 72: `[paste full contents of .claude/skills/whytree/SKILL.md here]` → `[paste full contents of SKILL.md here]`
- Line 232: `Read \`.claude/skills/whytree/SKILL.md\`.` → `Read \`SKILL.md\`.`
- Line 276: `git add .claude/skills/whytree/SKILL.md STATUS.md` → `git add SKILL.md STATUS.md`

- [ ] **Step 3: Verify no other live references to old path**

```bash
# Excluding historical plans (intentionally not updated) and the dev-only review-feedback skill
grep -rn '\.claude/skills/whytree[^-]' . \
  --include='*.md' --include='*.sh' \
  | grep -v '\.git/' \
  | grep -v 'docs/superpowers/plans/2026-04-14' \
  | grep -v 'docs/superpowers/plans/2026-04-20'
```

Expected: empty. If anything appears, evaluate and either update or document why it's left alone.

- [ ] **Step 4: Add a one-line note to historical docs that reference old paths**

Two files reference old paths and won't be edited substantively:
- `docs/todo.md`
- `docs/superpowers/plans/2026-04-14-question-refinement.md`

For each, prepend a single line at the very top:
```markdown
> **Note:** Paths in this doc reflect pre-v0.3.0 layout (skill files were under `.claude/skills/whytree/`). See CHANGELOG for the v0.3.0 flatten.
```

This addresses adversarial finding #10 (cargo-cult risk for future contributors).

- [ ] **Step 5: Commit**

```bash
git add CLAUDE.md PROMPT.md docs/todo.md docs/superpowers/plans/2026-04-14-question-refinement.md
git commit -m "$(cat <<'EOF'
docs: update skill-file paths after v0.3.0 flatten

CLAUDE.md and PROMPT.md previously referenced .claude/skills/whytree/<file>;
after the flatten those files live at repo root. Historical plans and
todo.md get a one-line note pointing readers at the CHANGELOG so future
contributors don't cargo-cult the old paths.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

### Task 1.6: Update README install snippet

**Files:**
- Modify: `README.md` line 41 (English install snippet)
- Modify: `README.ko.md` line 41 (Korean install snippet)

**Why:** The install destination doesn't change (still `~/.claude/skills/whytree/`), so the existing snippet still works for fresh installs. **However**, the README's "if already exists, update with `git pull`" branch may run against a stale pre-v0.3.0 install dir whose working tree no longer matches origin/main (because Stage 2's `git mv` removes the `.claude/skills/whytree/` subdir). `git pull` will succeed and reconcile, but the user's clone may have local uncommitted "changes" if they touched anything. Safer to update the snippet to be explicit about what version they should land on.

- [ ] **Step 1: Read current README install snippet**

Read `README.md:41`. Current text:
```
> Install whytree: if `~/.claude/skills/whytree` already exists, update it with `cd ~/.claude/skills/whytree && git pull origin main`. Otherwise clone it with `git clone https://github.com/yijisoo/whytree.git ~/.claude/skills/whytree`. Then read `~/.claude/settings.json` — if it exists, add `"https://kardens.io/api/whytree-telemetry"` to the existing `permissions.allowedURLs` array (preserve all other settings). If the file doesn't exist, create it with `{"permissions":{"allowedURLs":["https://kardens.io/api/whytree-telemetry"]}}`.
```

- [ ] **Step 2: Update to mention the v0.3.0 layout transition**

Replace with:

```
> Install or update whytree: if `~/.claude/skills/whytree` already exists, run `cd ~/.claude/skills/whytree && git stash --include-untracked && git pull origin main && git stash pop || true` to update (the stash protects any local edits during the v0.2.x → v0.3.0 layout flatten; the trailing `|| true` only swallows a missing-stash error from `git stash pop` when the working tree was clean — real `git stash` or `git pull` errors will surface and the user should investigate). If the directory does not exist, run `git clone https://github.com/yijisoo/whytree.git ~/.claude/skills/whytree`. Then read `~/.claude/settings.json` — if it exists, add `"https://kardens.io/api/whytree-telemetry"` to the existing `permissions.allowedURLs` array (preserve all other settings). If the file doesn't exist, create it with `{"permissions":{"allowedURLs":["https://kardens.io/api/whytree-telemetry"]}}`.
```

- [ ] **Step 3: Mirror the change to README.ko.md line 41**

Apply equivalent Korean wording. Read the current Korean snippet first to match style, then update.

- [ ] **Step 4: Commit**

```bash
git add README.md README.ko.md
git commit -m "$(cat <<'EOF'
docs(readme): protect local edits during v0.3.0 layout update

The v0.3.0 flatten removes .claude/skills/whytree/ from the working tree.
Existing v0.2.x users running the README install snippet would get a
clean fast-forward in the common case, but a user who customized files
locally would see git pull complain about overwriting their changes.

Add a defensive `git stash --include-untracked` before the pull. The
stash is a no-op if the tree is clean; users with local edits are told
to `git stash pop` afterward.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

---

## Release

### Task 2.1: Run release script (don't manually edit `.version` or `CHANGELOG.md`)

**Files:**
- Auto-modified by `scripts/release.sh`: `CHANGELOG.md`, `.version`

**Why:** `scripts/release.sh` is the canonical version-bump path. It parses `## [X.Y.Z]` from CHANGELOG, bumps semver per `BUMP_TYPE` arg, writes a new entry, and rewrites `.version` to `git rev-parse --short HEAD`. Manually editing either file would either be overwritten or conflict.

This is a **minor bump** (0.2.x → 0.3.0) because the layout change is significant enough to warrant a minor.

- [ ] **Step 1: Compose the changelog summary**

Run release.sh with an explicit summary so the auto-generated commit-list isn't used (it would be noisy with all the renames).

```bash
SUMMARY=$(cat <<'EOF'
### Changed
- **Repo layout flattened** to match Claude Code's standard skill layout. SKILL.md and supporting files (preamble.sh, SEED_QUESTIONS.md, PROBE_PATTERNS.md, COMMITMENT_ARC.md, READING.md) now live at the repo root. Previously they were nested under `.claude/skills/whytree/`, which broke the install path for users running the README's `git clone` command (the clone produced a `~/.claude/skills/whytree/.claude/skills/whytree/SKILL.md` chain, and SKILL.md's hardcoded `bash ~/.claude/skills/whytree/preamble.sh` invocation didn't resolve). After v0.3.0, the install destination is unchanged but the resulting layout is correct.

### Fixed
- `/whytree` failed at startup on fresh installs because of the path mismatch above. The flatten resolves it.

### Migration

**Existing v0.2.x users:** one-time manual update.

```
cd ~/.claude/skills/whytree
git stash --include-untracked   # stashes any local edits; no-op on clean tree
git pull origin main
git stash pop || true           # restores edits; "no stash" error is fine
```

After this your `/whytree` works again and future updates flow automatically.

> Restart any open Claude Code sessions after the update — cached skill content from before the pull won't reflect the new layout.

**Expected diff shape on this update:** ~6 file renames (skill files moved from `.claude/skills/whytree/` to root), edits to `preamble.sh` (self-locating via BASH_SOURCE, plus symlink and concurrent-update guards), `SKILL.md` (supporting-file references switch to base-directory-relative phrasing), `test/skill-lint.sh`, `CLAUDE.md`, `PROMPT.md`, and `README.md`. **No new outbound network calls, no new endpoints, no changes to the analytics/feedback payload schema.** If your update prompt shows a diff that includes anything else (especially new `curl` invocations or unfamiliar URLs), refuse the update and report what you saw.

A `pre-flatten-rollback` git tag is pushed alongside this release. If the update breaks something for you, recover with:

```
cd ~/.claude/skills/whytree
git checkout pre-flatten-rollback           # detached HEAD on the rollback tag
git update-ref refs/heads/main pre-flatten-rollback   # pin main to rollback so the next preamble auto-update doesn't re-pull the broken release
git checkout main
```

This puts you on a fixed `main` that won't auto-update back to the broken release. To rejoin the upstream once a fix ships, run `git fetch origin main && git reset --hard origin/main`.

### Developer experience

You can now symlink `~/.claude/skills/whytree` to your dev checkout (`ln -sfn ~/your/path/whytree ~/.claude/skills/whytree`) and your `/whytree` sessions from any directory will use your in-progress edits. preamble.sh detects the symlink and skips the auto-update check so it doesn't try to `git pull` on your feature branch.
EOF
)
```

- [ ] **Step 2: Run release.sh with summary, no push**

```bash
bash scripts/release.sh minor "$SUMMARY"
```

This will:
1. Run lint (must pass)
2. Parse current version from CHANGELOG (`0.2.10`)
3. Bump to `0.3.0` (minor)
4. Insert the summary as the new CHANGELOG entry
5. Update `.version` to current commit SHA
6. Commit `chore: bump version to 0.3.0`
7. **Stop without pushing** (no `--push` flag)

- [ ] **Step 3: Verify the release commit looks right**

```bash
git log --oneline -5
git show --stat HEAD
cat .version
head -30 CHANGELOG.md
```

Expected: commit message `chore: bump version to 0.3.0`, only `CHANGELOG.md` and `.version` modified, `.version` is a 7-char SHA, CHANGELOG top entry is `## [0.3.0] — <today>` with the migration text.

- [ ] **Step 4: Push (release tag and main together)**

**Wait for explicit user approval before pushing.** Per project CLAUDE.md: "Do not push or release unless explicitly asked. Commit changes freely, but only run `scripts/release.sh` or `git push` when the user says to."

When the user says to push:

```bash
git push origin main
git push origin pre-flatten-rollback
```

---

## Verification gate

Before declaring done:

- [ ] `bash test/skill-lint.sh` passes.
- [ ] Sandbox fresh install (mirror the README install path — `git clone` to the `~/.claude/skills/whytree*` destination directly, no intermediate copy):
  ```bash
  rm -rf ~/.claude/skills/whytree-fresh-test
  git clone . ~/.claude/skills/whytree-fresh-test
  ls ~/.claude/skills/whytree-fresh-test/SKILL.md  # exists at the root
  bash ~/.claude/skills/whytree-fresh-test/preamble.sh | head -3
  rm -rf ~/.claude/skills/whytree-fresh-test
  ```
  Expected: `SKILL.md` at the listed path, preamble outputs `=== WHYTREE PREAMBLE ===` on the first line. Using `git clone` (not `cp -r`) ensures the `.git` directory is set up the same way an end-user install would be — important because the auto-update check exercises `.git` state.
- [ ] Symlink dev workflow:
  ```bash
  # Backup current install (don't trash it)
  mv ~/.claude/skills/whytree ~/.claude/skills/whytree.bak
  ln -sfn ~/devel/whytree ~/.claude/skills/whytree
  # Run /whytree from a non-project directory (do this in a separate Claude Code session)
  # Verify it loads and shows the version
  # Then restore:
  rm ~/.claude/skills/whytree
  mv ~/.claude/skills/whytree.bak ~/.claude/skills/whytree
  ```
  Expected: `/whytree` loads, preamble runs, `SYMLINK_INSTALL=1` line appears in preamble output (skips update check).
- [ ] Rollback tag exists locally and (after push) on origin.

---

## Multi-scenario review (updated for single-stage plan)

Each scenario walks through what happens with the v0.3.0 release.

### A. Existing v0.2.10 user — does nothing

- `/whytree` was already broken; remains broken. They're no worse off.
- CHANGELOG includes the manual-update one-liner. Whether they see it depends on the notification path — see Mitigations below.
- **Mitigation:** Cross-post the manual-update instruction to the channels where the user base actually is (FB launch post comment thread, GitHub release notes, any direct contacts mentioned in project memory).

### B. Existing v0.2.10 user — runs the README install snippet (which now includes the stash + pull)

- `git stash --include-untracked` succeeds (no-op if clean, otherwise stashes).
- `git pull origin main` brings them to v0.3.0. Working tree now has skill files at root, `.claude/skills/whytree/` is gone.
- Next `/whytree` session: SKILL.md is at `~/.claude/skills/whytree/SKILL.md` directly. preamble runs from `~/.claude/skills/whytree/preamble.sh`. Works.

### C. Brand-new user (no prior install)

- Clones the repo to `~/.claude/skills/whytree/`. SKILL.md is at the root.
- Claude Code finds it via the standard `~/.claude/skills/<name>/SKILL.md` lookup. Recursive discovery is no longer needed for this skill.
- preamble runs cleanly. Works on first try.

### D. Developer (the user) with symlink

- After Stage 1 of personal setup: `ln -sfn ~/devel/whytree ~/.claude/skills/whytree`
- `/whytree` from any directory loads the symlinked skill.
- preamble's symlink detection fires — skips auto-update check.
- Edits to preamble.sh, SKILL.md, etc. in the dev repo are immediately live in `/whytree` sessions. **Dogfooding goal met.**

### E. User with local modifications to install dir

- Stash protects them during the README's update path.
- Without stash, `git pull` would refuse — they'd see git's error and could deal with it.
- Either way: not silently destructive.

### F. Mid-session auto-update

- User runs `/whytree`, accepts the update prompt.
- `git pull` reorganizes files on disk. Currently-loaded SKILL.md (in model context) still references the old paths.
- Subsequent supporting-file reads in the same session may fail with "file not found at the absolute path I read."
- **Mitigation (in scope):** Task 1.3 Step 2 adds a sentence to SKILL.md's auto-update accept-flow telling the model to instruct the user to `/exit` and re-run `/whytree` after a successful pull, and not to continue session work against the freshly-pulled tree. This is in this release because the v0.3.0 → v0.3.1+ transition is the first one where mid-session auto-update will actually fire (v0.2.10 users have a broken preamble, so they reach v0.3.0 via manual pull, not in-session).

### G. Concurrent `/whytree` sessions during update

- Both sessions fire preamble's update check.
- One acquires `.git/index.lock` and pulls. The other sees the lock and outputs `UPDATE_SKIPPED=concurrent`.
- No corruption. Second session continues with the pre-update state until next start.

### H. Auto-update detects a suspicious diff

- v0.3.0's diff is large (renames + content changes). The model's "look for suspicious changes" check needs context that this is expected.
- CHANGELOG's "Expected diff shape" section gives the model an explicit manifest to compare against. If the diff contains anything beyond the listed renames + named file edits, the model refuses.

### I. Plugin marketplace install (future)

- A future marketplace install would put files at e.g. `~/.claude/plugins/cache/.../whytree/`.
- preamble.sh's BASH_SOURCE-derived `SKILL_DIR` works there too.
- Auto-update check runs only if `.git/` exists in `SKILL_DIR` — marketplace installs typically don't ship `.git`, so update is silently skipped (correct: marketplaces handle their own updates).

### J. Dotfiles-repo user syncing `~/.claude/`

- After v0.3.0, the install dir's git history changes. Their dotfiles repo would see the auto-update commit as a "dirty" pile of changes.
- **Mitigation:** Document in CHANGELOG: "If you sync `~/.claude/` via dotfiles, gitignore `~/.claude/skills/whytree/` (or treat it as a git-managed subdir, not a synced one)."

### K. Claude Desktop / IDE plugin caches

- Cached skill metadata may persist across sessions and point at old locations.
- **Mitigation:** Document "Restart Claude Code (or your IDE) after the update if `/whytree` doesn't work immediately." Add to CHANGELOG.

### L. Contributors with PRs in flight

- Pre-flight Task 0.2 catches this. If PRs exist, plan halts.

### M. Rollback needed

- `pre-flatten-rollback` tag exists. CHANGELOG includes the full rollback recipe (checkout tag → `git update-ref refs/heads/main` → checkout main) so users land on a fixed `main` that won't auto-update back to the broken release.
- Without the `git update-ref` step, a naked `git checkout pre-flatten-rollback` puts the user on detached HEAD; the next preamble auto-update would fast-forward them back into the bad state. The CHANGELOG-documented recipe prevents this.
- To rejoin upstream once a fix ships: `git fetch origin main && git reset --hard origin/main`.
- If the rollback needs to be the new HEAD on origin (to undo a bad release), the user can `git revert <release-commit>` and push, or force-push to the tag (with usual force-push caveats).

---

## Open questions / follow-ups (not in this plan)

- **Out-of-band notification channels** for inactive v0.2.10 users (Scenario A). Manual outreach.
- **Frontmatter version field** in SKILL.md as a single source of truth. Today `.version` is a SHA, CHANGELOG has the semver, and they're not coupled. Not breaking anything, but worth thinking about for v0.4.x.

---

## Self-Review

### Spec coverage

- ✅ Fix preamble path bug — Task 1.1 (flatten) + Task 1.2 (self-locating preamble)
- ✅ Don't break existing users — README stash defends; CHANGELOG migration text; rollback tag
- ✅ Dev experience parity — symlink workflow + symlink detection in preamble
- ✅ Address all reviewer findings: see table below

### Reviewer-finding coverage

| Finding | Source | Addressed in |
|---|---|---|
| `bash X \|\| bash Y` is error-masking | Codex + code-reviewer | Single-stage flatten removes the need for any fallback; SKILL.md keeps single clean path |
| `.version` is a SHA, plan must not edit manually | code-reviewer | Task 2.1 (use release.sh) |
| CHANGELOG format is `## [X.Y.Z] — DATE` | code-reviewer | Task 2.1 release.sh enforces this |
| Verify Claude Code recursive discovery | Codex | Investigated empirically (200+ deeply-nested SKILL.md files load); single-stage doesn't depend on it but it's confirmed regardless |
| Stage 1 lint regex was wrong | code-reviewer | No Stage 1 anymore; Task 1.4 lint regex re-derived from scratch |
| In-product recovery hint when preamble fails | adversarial #2 | Task 1.3 Step 4 |
| preamble.sh self-locate via BASH_SOURCE | adversarial #3 | Task 1.2 |
| Symlink + git pull footgun | adversarial #4 | Task 1.2 (symlink detection) |
| Trust model: large diff cover for malice | adversarial #5 | Task 2.1 CHANGELOG includes "Expected diff shape" manifest |
| Rollback tag | adversarial #6 | Task 0.1 |
| Concurrent session race | adversarial #7 | Task 1.2 (`.git/index.lock` check) |
| Lint script `\|\| true` discipline | adversarial #8 | Task 1.4 Step 2 keeps `\|\| true` on potentially-empty greps |
| In-flight PR check | adversarial #13 | Task 0.2 |
| Dotfiles-repo sync issue | adversarial #14 | Scenario J + CHANGELOG note |
| README install snippet protection | adversarial #1 | Task 1.6 (stash+pull) |
| Historical-doc cargo-cult risk | adversarial #10 | Task 1.5 Step 4 (one-line note) |
| Stage 1 abort criteria | adversarial #12 | No Stage 1; Task 0.3 + verification gate cover the equivalent |
| Codex single-stage recommendation | Codex | Adopted |
| Codex: existing-users-won't-break too strong | Codex | Acknowledged in Scenario F (mid-session pull edge case); restart hint added in Task 1.3 Step 2 |
| v2 review: mid-session auto-update hazard | code-reviewer I1, adversarial S1/S2 | Task 1.3 Step 2 (in-product restart hint) |
| v2 review: rollback UX is one-way | adversarial S6 | Task 2.1 CHANGELOG migration recipe + Scenario M update |
| v2 review: stash error-masking | code-reviewer I3, adversarial S4 | Task 1.6 + Task 2.1 use `\|\| true` only on `git stash pop` (real stash/pull errors surface) |
| v2 review: cosmetic SKILL.md edit was no-op | code-reviewer B2, adversarial S9 | Replaced with the substantive restart-hint edit (Task 1.3 Step 2) |
| v2 review: line-number off-by-one in Task 1.3 Step 4 | code-reviewer B3 | Clarified to "after the closing fence (line 171)" |
| v2 review: verification gate uses cp -r | code-reviewer I2 | Switched to `git clone` to mirror README install path |
| v2 review: gh pr list false negative when offline/unauth | code-reviewer I4, adversarial S10 | Task 0.2 adds `gh auth status` precheck and skip-with-note fallback |
| v2 review: .DS_Store may block rmdir | adversarial S11 | Task 1.1 Step 2 documents the macOS .DS_Store case explicitly |

### Placeholder scan

No "TBD," "implement later," etc. All bash commands, regex patterns, and replacement strings are concrete.

### Path consistency

- All references to old `.claude/skills/whytree/<file>` are updated in Tasks 1.5 (CLAUDE.md, PROMPT.md), 1.4 (lint script), 1.3 (SKILL.md self-references). Verified by Task 1.5 Step 3 grep.
- `whytree-review-feedback` references intentionally unchanged.
- Historical plans & docs intentionally not updated (Task 1.5 Step 4 adds a forward-pointing note instead).
