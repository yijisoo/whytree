#!/usr/bin/env bash
# Skill file linter — validates SKILL.md and supporting files before push.
# No dependencies beyond bash and standard Unix tools.
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SKILL_DIR="$REPO_ROOT/.claude/skills/whytree"
SKILL="$SKILL_DIR/SKILL.md"
ERRORS=0

pass() { echo "  PASS: $1"; }
fail() { echo "  FAIL: $1"; ERRORS=$((ERRORS + 1)); }

echo "=== Skill Lint ==="
echo

# --- 1. Required files exist ---
echo "1. Required files"
for f in SKILL.md COMMITMENT_ARC.md PROBE_PATTERNS.md SEED_QUESTIONS.md READING.md preamble.sh; do
  if [ -f "$SKILL_DIR/$f" ]; then
    pass "$f exists"
  else
    fail "$f missing"
  fi
done

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

# --- 3. JSON schema example is valid ---
echo
echo "3. JSON schema"
# Extract only the FIRST ```json block (stop after closing ```)
schema_json=$(awk '/^```json/{found=1;next} found && /^```/{exit} found{print}' "$SKILL")
if [ -z "$schema_json" ]; then
  fail "Could not extract JSON schema from SKILL.md"
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
  if grep -qi "$pattern" "$SKILL"; then
    pass "$label present"
  else
    fail "$label MISSING — this is a safety-critical section"
  fi
}

check_section "Operating rules" "Operating rules.*CRITICAL"
check_section "Never show raw JSON" "Never show raw JSON"
check_section "Crisis protocol" "Crisis.*acute distress"
check_section "Analytics consent" "Analytics consent"
check_section "Feedback injection safety" "Never interpolate user input"
check_section "Validation invariants" "rootIds.*set of node IDs"
check_section "Corrupted JSON recovery" "corrupted"

# --- 5. No personal content patterns in curl commands ---
echo
echo "5. Curl payload safety"
curl_payloads=$(grep -A2 'curl.*POST' "$SKILL" | grep "\-d" || true)
if echo "$curl_payloads" | grep -qi "label\|treeName\|node.text\|user.*name"; then
  fail "Curl payload may contain personal content fields"
else
  pass "Curl payloads contain no personal content field names"
fi

# --- 6. Curl payload required fields ---
echo
echo "6. Curl payload required fields"

# Check that the session ping payload includes deviceId and the longitudinal fields
session_payload=$(awk '/Sending the session ping/,/^```$/' "$SKILL" | grep '\-d' || true)
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

# Versioned consent string must be referenced
if grep -q 'yes-v2' "$SKILL"; then
  pass "Versioned consent (yes-v2) referenced"
else
  fail "Versioned consent (yes-v2) not documented — legacy 'yes' users won't be re-prompted"
fi

# Phase telemetry must NOT exist as its own section anymore (folded into session ping)
if grep -q '^## Phase telemetry' "$SKILL"; then
  fail "Phase telemetry section still exists — should be folded into the session ping"
else
  pass "Phase telemetry section removed (folded into session ping)"
fi

# Check that feedback temp file instructions include deviceId
feedback_section=$(awk '/^## Feedback/{found=1;next} found && /^## /{exit} found{print}' "$SKILL")
if echo "$feedback_section" | grep -q 'deviceId'; then
  pass "Feedback payload instructions include deviceId"
else
  fail "Feedback payload instructions missing deviceId — server requires it"
fi

# Check that device-id generation is documented
if grep -q '\.device-id' "$SKILL"; then
  pass "Device ID file (~/.whytree/.device-id) documented"
else
  fail "Device ID file not documented — needed for telemetry"
fi

# Canonical feedbackCategory enum — must include exactly these 7 values, no drift
for cat in tool-misfire design-insight bug ux naming localization general; do
  if grep -q "\`$cat\`" "$SKILL"; then
    pass "feedbackCategory enum includes $cat"
  else
    fail "feedbackCategory enum missing $cat — categories must not drift"
  fi
done

# Canonical command enum — payload examples must use only {session, feedback}
if grep -qE '"command":"(session|feedback)"' "$SKILL"; then
  pass "Command enum uses only session/feedback"
else
  fail "Command enum missing — expected \"command\":\"session\" or \"command\":\"feedback\""
fi
# Guard against legacy/spurious command values being reintroduced
for forbidden_cmd in "phase" "analytics" "structural"; do
  if grep -qE "\"command\":\"$forbidden_cmd\"" "$SKILL"; then
    fail "Legacy command \"$forbidden_cmd\" reintroduced — only session/feedback are allowed"
  fi
done

# Depersonalization rule must be explicit (no labels, no quoted words, etc.)
if grep -q "no node labels" "$SKILL" && grep -q "no quoted user words" "$SKILL"; then
  pass "Depersonalization rule explicit (no labels, no quoted user words)"
else
  fail "Depersonalization rule weakened — feedback drafts must explicitly forbid node labels and quoted user words"
fi

# Commitment Arc Step 6 must NOT reintroduce the end-of-session feedback ask
ARC_FILE="$SKILL_DIR/COMMITMENT_ARC.md"
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
for field in schemaVersion rootIds seedIds currentNodeId lastExperimentId createdAt updatedAt purpose; do
  if grep -q "\"$field\"" "$SKILL"; then
    pass "Schema has $field"
  else
    fail "Schema missing $field"
  fi
done

# --- 8. Platform support ---
echo
echo "8. Platform support"
if grep -q "Git Bash" "$SKILL"; then
  pass "Git Bash requirement documented"
else
  fail "No Git Bash requirement found"
fi

# --- 9. Phase heading completeness ---
echo
echo "9. Phase headings"
for phase in "Phase 0a" "Phase 0:" "Phase 0b" "Phase 1" "Phase 2" "Phase 3" "Phase 4" "Phase 5:" "Phase 5 close"; do
  if grep -q "$phase" "$SKILL"; then
    pass "Phase heading '$phase' present"
  else
    fail "Phase heading '$phase' missing"
  fi
done

# --- 10. Supporting file content (not empty/truncated) ---
echo
echo "10. Supporting file content"
for f in COMMITMENT_ARC.md PROBE_PATTERNS.md SEED_QUESTIONS.md READING.md; do
  lines=$(wc -l < "$SKILL_DIR/$f" | tr -d ' ')
  if [ "$lines" -gt 5 ]; then
    pass "$f has content ($lines lines)"
  else
    fail "$f appears empty or truncated ($lines lines)"
  fi
done

# --- 11. YAML frontmatter ---
echo
echo "11. YAML frontmatter"
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

# --- 12. Review-feedback skill ---
echo
echo "12. Review-feedback skill"
REVIEW_SKILL="$REPO_ROOT/.claude/skills/whytree-review-feedback/SKILL.md"
if [ -f "$REVIEW_SKILL" ]; then
  pass "whytree-review-feedback/SKILL.md exists"
  # Check frontmatter
  if head -1 "$REVIEW_SKILL" | grep -q "^---$"; then
    pass "Review-feedback has YAML frontmatter"
  else
    fail "Review-feedback missing YAML frontmatter"
  fi
  # Check it references the correct feedback file path
  if grep -q 'feedback/feedback.jsonl' "$REVIEW_SKILL"; then
    pass "Review-feedback references feedback.jsonl"
  else
    fail "Review-feedback missing feedback.jsonl reference"
  fi
  # Check required sections
  if grep -q 'Filter out noise' "$REVIEW_SKILL"; then
    pass "Review-feedback has noise filter step"
  else
    fail "Review-feedback missing noise filter step"
  fi
  # Check it has verbatim quote rule
  if grep -q 'verbatim' "$REVIEW_SKILL"; then
    pass "Review-feedback has verbatim quote rule"
  else
    fail "Review-feedback missing verbatim quote rule"
  fi
else
  fail "whytree-review-feedback/SKILL.md missing"
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
