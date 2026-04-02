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
for f in SKILL.md COMMITMENT_ARC.md PROBE_PATTERNS.md SEED_QUESTIONS.md; do
  if [ -f "$SKILL_DIR/$f" ]; then
    pass "$f exists"
  else
    fail "$f missing"
  fi
done

# --- 2. All file references in SKILL.md resolve ---
echo
echo "2. File references"
# Extract paths like ~/.claude/skills/whytree/SOMETHING.md
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
# Extract the first ```json block in the file (the schema)
schema_json=$(awk '/^```json/{found=1;next} found && /^```/{found=0;next} found{print}' "$SKILL")
if [ -z "$schema_json" ]; then
  fail "Could not extract JSON schema from SKILL.md"
else
  # The schema uses placeholder values like <uuid> — replace them for validation
  test_json=$(echo "$schema_json" \
    | sed 's/<uuid>/test-uuid/g' \
    | sed 's/seed | why | how/seed/g' \
    | sed 's/ISO 8601/2024-01-01T00:00:00Z/g' \
    | sed 's/Display Name/Test/g' \
    | sed 's/node text/test/g' \
    | sed 's/null/null/g')

  # Try to parse with python (most portable JSON validator)
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
check_section "Feedback injection safety" "Write tool.*not shell interpolation"
check_section "Validation invariants" "rootIds.*set of node IDs"
check_section "Corrupted JSON recovery" "corrupted"

# --- 5. No personal content patterns in curl commands ---
echo
echo "5. Curl payload safety"
# Extract curl -d lines and check they don't reference node labels or tree names
curl_payloads=$(grep -A2 'curl.*POST' "$SKILL" | grep "\-d" || true)
if echo "$curl_payloads" | grep -qi "label\|treeName\|node.text\|user.*name"; then
  fail "Curl payload may contain personal content fields"
else
  pass "Curl payloads contain no personal content field names"
fi

# --- 6. Schema completeness — required fields ---
echo
echo "6. Schema required fields"
for field in rootIds seedIds currentNodeId lastExperimentId createdAt updatedAt purpose; do
  if grep -q "\"$field\"" "$SKILL"; then
    pass "Schema has $field"
  else
    fail "Schema missing $field"
  fi
done

# --- 7. Platform support ---
echo
echo "7. Platform support"
if grep -q "powershell\|PowerShell" "$SKILL"; then
  pass "Windows UUID fallback documented"
else
  fail "No Windows UUID fallback (PowerShell) found"
fi
if grep -q '\$HOME\|USERPROFILE' "$SKILL"; then
  pass "Windows home directory expansion documented"
else
  fail "No Windows home directory guidance found"
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
