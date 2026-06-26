#!/usr/bin/env bash
# Skill file linter — validates SKILL.md and supporting files before push.
# No dependencies beyond bash and standard Unix tools.
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SKILL_DIR="$REPO_ROOT"
SKILL="$SKILL_DIR/SKILL.md"
# TELEMETRY and DEMO_MODE moved under skill/ after the Spec 1 core/adapter split
TELEMETRY="$SKILL_DIR/skill/TELEMETRY.md"
ERRORS=0

# --- Assembly resolver ---
. "$SKILL_DIR/test/lib/assembly.sh"

# Clean up temp assembly file on exit
ASM="$(mktemp)"
trap 'rm -f "$ASM"' EXIT

# Build assembly concatenation (all layers including skill/) once
while read -r f; do
  cat "$f"
  echo
done < <(whytree_assembly_files life) > "$ASM"

pass() { echo "  PASS: $1"; }
fail() { echo "  FAIL: $1"; ERRORS=$((ERRORS + 1)); }

echo "=== Skill Lint ==="
echo

# --- 1. Every manifest file must exist ---
echo "1. Required files"
pass "SKILL.md exists"  # SKILL.md (loader) is always at root
missing=0
while read -r f; do
  if [[ -f "$f" ]]; then
    pass "$(basename "$f") exists"
  else
    echo "  FAIL: manifest file missing: $f"
    missing=1
    ERRORS=$((ERRORS + 1))
  fi
done < <(whytree_assembly_files life)
# Also check preamble.sh (not in manifest, lives in skill/)
if [ -f "$SKILL_DIR/skill/preamble.sh" ]; then
  pass "preamble.sh exists"
else
  fail "preamble.sh missing"
fi

# --- 2. Loader references manifest ---
echo
echo "2. File references"
# After Spec 1 split, SKILL.md (the loader) must reference each manifest file by basename.
# Absolute paths to supporting files are still forbidden.
abs_refs=$(grep -nE '~/\.claude/skills/whytree/[A-Z_]+\.md' "$SKILL" || true)
if [ -z "$abs_refs" ]; then
  pass "No absolute paths to supporting *.md files in SKILL.md"
else
  fail "Found absolute path(s) to supporting *.md files (use bare filename instead):"
  echo "$abs_refs"
fi

# Each manifest entry's basename (with {domain}→life) must appear in SKILL.md
while read -r layer rel; do
  [[ -z "$layer" || "$layer" == \#* ]] && continue
  rel="${rel//\{domain\}/life}"
  base="$(basename "$rel")"
  if grep -q "$base" "$SKILL_DIR/SKILL.md"; then
    pass "Loader SKILL.md references $base"
  else
    fail "Loader SKILL.md does not reference $base"
  fi
done < "$SKILL_DIR/prompts.manifest"

# --- 3. JSON schema example is valid ---
echo
echo "3. JSON schema"
# Extract only the FIRST ```json block from the assembly (schema lives in core/tree-format.md)
schema_json=$(awk '/^```json/{found=1;next} found && /^```/{exit} found{print}' "$ASM")
if [ -z "$schema_json" ]; then
  fail "Could not extract JSON schema from assembled content"
else
  test_json=$(echo "$schema_json" \
    | sed 's/<uuid>/test-uuid/g' \
    | sed 's/seed | why | how/seed/g' \
    | sed 's/ISO 8601/2024-01-01T00:00:00Z/g' \
    | sed 's/Display Name/Test/g' \
    | sed 's/node text/test/g' \
    | sed 's/null/null/g')

  if echo "$test_json" | python3 -c "import sys,json; json.load(sys.stdin)" 2>/dev/null; then
    pass "Schema example is valid JSON (after placeholder substitution)"
  elif echo "$test_json" | python -c "import sys,json; json.load(sys.stdin)" 2>/dev/null; then
    pass "Schema example is valid JSON (after placeholder substitution)"
  else
    fail "Schema example is not valid JSON"
    echo "    Extracted:"
    echo "$test_json" | head -5
  fi
fi

# --- 4. Critical safety sections exist ---
echo
echo "4. Critical safety sections"

check_section() {
  local label="$1"
  local pattern="$2"
  shift 2
  if grep -qi "$pattern" "$@"; then
    pass "$label present"
  else
    fail "$label MISSING — this is a safety-critical section"
  fi
}

# Content checks now run against the assembled file (safety content moved to core/)
check_section "Operating rules" "Operating rules.*CRITICAL" "$ASM"
check_section "Never show raw JSON" "Never show raw JSON" "$ASM"
check_section "Crisis protocol" "Crisis.*acute distress" "$ASM"
check_section "Analytics consent" "Analytics consent" "$ASM" "$TELEMETRY"
check_section "Feedback injection safety" "Never interpolate user input" "$ASM" "$TELEMETRY"
check_section "Validation invariants" "rootIds.*set of node IDs" "$ASM"
check_section "Corrupted JSON recovery" "corrupted" "$ASM"

# --- 5. No personal content patterns in curl commands ---
# Curl commands live in skill/TELEMETRY.md after the v0.4.0 / Spec 1 architecture split.
echo
echo "5. Curl payload safety"
curl_payloads=$(grep -A2 'curl.*POST' "$TELEMETRY" | grep "\-d" || true)
if echo "$curl_payloads" | grep -qi "label\|treeName\|node.text\|user.*name"; then
  fail "Curl payload may contain personal content fields"
else
  pass "Curl payloads contain no personal content field names"
fi

# --- 6. Curl payload required fields ---
# Payloads live in skill/TELEMETRY.md; section headings moved too.
echo
echo "6. Curl payload required fields"

# Check that the session ping payload includes deviceId and the longitudinal fields
session_payload=$(awk '/Sending the session ping/,/^```$/' "$TELEMETRY" | grep '\-d' || true)
if echo "$session_payload" | grep -q 'deviceId'; then
  pass "Session ping payload includes deviceId"
else
  fail "Session ping payload missing deviceId — server requires it"
fi

for field in command sessionNumber daysSinceFirstSession treeAgeDays; do
  if echo "$session_payload" | grep -q "\"$field\""; then
    pass "Session ping payload includes $field"
  else
    fail "Session ping payload missing $field"
  fi
done

# Guard against re-introducing structural metric fields in any analytics payload
for forbidden in nodes seeds whys hows convergence maxDepth roots; do
  if echo "$session_payload" | grep -q "\"$forbidden\""; then
    fail "Session ping payload includes structural metric '$forbidden' — analytics is usage-only now"
  fi
done

# Versioned consent string must be referenced (in skill/TELEMETRY.md)
if grep -q 'yes-v2' "$TELEMETRY"; then
  pass "Versioned consent (yes-v2) referenced"
else
  fail "Versioned consent (yes-v2) not documented — legacy 'yes' users won't be re-prompted"
fi

# Phase telemetry must NOT exist as its own section anymore (folded into session ping)
if grep -q '^## Phase telemetry' "$ASM" "$TELEMETRY"; then
  fail "Phase telemetry section still exists — should be folded into the session ping"
else
  pass "Phase telemetry section removed (folded into session ping)"
fi

# Check that feedback temp file instructions include deviceId
feedback_section=$(awk '/^## Feedback/{found=1;next} found && /^## /{exit} found{print}' "$TELEMETRY")
if echo "$feedback_section" | grep -q 'deviceId'; then
  pass "Feedback payload instructions include deviceId"
else
  fail "Feedback payload instructions missing deviceId — server requires it"
fi

# Check that device-id generation is documented
if grep -q '\.device-id' "$TELEMETRY"; then
  pass "Device ID file (~/.whytree/.device-id) documented"
else
  fail "Device ID file not documented — needed for telemetry"
fi

# Canonical feedbackCategory enum — must include exactly these 7 values, no drift
for cat in tool-misfire design-insight bug ux naming localization general; do
  if grep -q "\`$cat\`" "$TELEMETRY"; then
    pass "feedbackCategory enum includes $cat"
  else
    fail "feedbackCategory enum missing $cat — categories must not drift"
  fi
done

# Canonical command enum — payload examples must use only {session, feedback}
if grep -qE '"command":"(session|feedback)"' "$TELEMETRY"; then
  pass "Command enum uses only session/feedback"
else
  fail "Command enum missing — expected \"command\":\"session\" or \"command\":\"feedback\""
fi
# Guard against legacy/spurious command values being reintroduced
for forbidden_cmd in "phase" "analytics" "structural"; do
  if grep -qE "\"command\":\"$forbidden_cmd\"" "$ASM" "$TELEMETRY"; then
    fail "Legacy command \"$forbidden_cmd\" reintroduced — only session/feedback are allowed"
  fi
done

# Depersonalization rule must be explicit (no labels, no quoted words, etc.)
# Lives in skill/TELEMETRY.md and is echoed as a safety reminder in the assembly.
if grep -q "no node labels" "$TELEMETRY" && grep -q "no quoted user words" "$TELEMETRY"; then
  pass "Depersonalization rule explicit (no labels, no quoted user words)"
else
  fail "Depersonalization rule weakened — feedback drafts must explicitly forbid node labels and quoted user words"
fi

# Commitment Arc Step 6 must NOT reintroduce the end-of-session feedback ask
ARC_FILE="$SKILL_DIR/core/COMMITMENT_ARC.md"
if [ -f "$ARC_FILE" ]; then
  if grep -q "Do not ask for feedback at the close" "$ARC_FILE"; then
    pass "Commitment Arc Step 6 keeps the no-end-of-session-feedback guard"
  else
    fail "Commitment Arc Step 6 missing the explicit no-end-of-session-feedback guard"
  fi
fi

# --- 7. Schema completeness — required fields ---
echo
echo "7. Schema required fields"
# Schema lives in core/tree-format.md — check the assembly
for field in schemaVersion rootIds seedIds currentNodeId lastExperimentId createdAt updatedAt purpose; do
  if grep -q "\"$field\"" "$ASM"; then
    pass "Schema has $field"
  else
    fail "Schema missing $field"
  fi
done

# --- 8. Platform support ---
echo
echo "8. Platform support"
# Platform notes may be in core/ files or skill/mechanics.md — check assembly
if grep -q "Git Bash" "$ASM"; then
  pass "Git Bash requirement documented"
else
  fail "No Git Bash requirement found"
fi

# --- 9. Phase heading completeness ---
echo
echo "9. Phase headings"
# Phase content lives in core/phases.md — check the assembly
for phase in "Phase 0:" "Return Check-in" "Phase 1" "Phase 2" "Phase 3" "Phase 4" "Phase 5:" "Phase 5 close"; do
  if grep -q "$phase" "$ASM"; then
    pass "Phase heading '$phase' present"
  else
    fail "Phase heading '$phase' missing"
  fi
done

# --- 10. Supporting file content (not empty/truncated) ---
echo
echo "10. Supporting file content"
# Check each assembled file has meaningful content
while read -r f; do
  lines=$(wc -l < "$f" | tr -d ' ')
  if [ "$lines" -gt 5 ]; then
    pass "$(basename "$f") has content ($lines lines)"
  else
    fail "$(basename "$f") appears empty or truncated ($lines lines)"
  fi
done < <(whytree_assembly_files life)
# Also check skill/TELEMETRY.md and skill/DEMO_MODE.md (not in manifest but referenced)
for extra in "$SKILL_DIR/skill/TELEMETRY.md" "$SKILL_DIR/skill/DEMO_MODE.md"; do
  lines=$(wc -l < "$extra" | tr -d ' ')
  if [ "$lines" -gt 5 ]; then
    pass "$(basename "$extra") has content ($lines lines)"
  else
    fail "$(basename "$extra") appears empty or truncated ($lines lines)"
  fi
done

# --- 11. YAML frontmatter ---
echo
echo "11. YAML frontmatter"
# Frontmatter stays in SKILL.md (the loader)
if head -1 "$SKILL" | grep -q "^---$"; then
  if sed -n '2,/^---$/p' "$SKILL" | grep -q "name:.*whytree"; then
    pass "Frontmatter has name: whytree"
  else
    fail "Frontmatter missing or wrong skill name"
  fi
  if sed -n '2,/^---$/p' "$SKILL" | grep -q "user_invocable: true"; then
    pass "Frontmatter has user_invocable: true"
  else
    fail "Frontmatter missing user_invocable flag"
  fi
else
  fail "No YAML frontmatter (missing opening ---)"
fi

# --- Summary ---
echo
echo "=== Results ==="
if [ "$ERRORS" -eq 0 ]; then
  echo "All checks passed."
  exit 0
else
  echo "$ERRORS check(s) failed."
  exit 1
fi
