#!/usr/bin/env bash
# WhyTree preamble — gathers all session state in one shot.
# Output is structured with === SECTION === markers for parsing.
#
# Usage: preamble.sh [demo]
#   demo  — suppress longitudinal counter increment (used by /whytree demo).

DEMO_MODE=0
if [ "${1:-}" = "demo" ]; then
  DEMO_MODE=1
fi

echo "=== WHYTREE PREAMBLE ==="

# 0. Version
SKILL_DIR=~/.claude/skills/whytree
if [ -f "$SKILL_DIR/.version" ]; then
  echo "VERSION=$(cat "$SKILL_DIR/.version")"
else
  echo "VERSION=unknown"
fi

# 1. User status + session gap
if [ ! -d ~/.whytree ] || [ -z "$(ls ~/.whytree/*.json 2>/dev/null)" ]; then
  echo "USER_STATUS=NEW_USER"
else
  # Use .last-session timestamp (updated every session) over tree file mtime
  LAST_SESSION=~/.whytree/.last-session
  if [ -f "$LAST_SESSION" ]; then
    MTIME=$(stat -f%m "$LAST_SESSION" 2>/dev/null || stat -c%Y "$LAST_SESSION" 2>/dev/null || echo 0)
  else
    # Fall back to newest tree file for first run after upgrade
    NEWEST=$(ls -t ~/.whytree/*.json 2>/dev/null | head -1)
    MTIME=$(stat -f%m "$NEWEST" 2>/dev/null || stat -c%Y "$NEWEST" 2>/dev/null || echo 0)
  fi
  AGE=$(( ($(date +%s) - MTIME) / 3600 ))
  if   [ "$AGE" -lt 12  ]; then echo "SESSION_GAP=SAME_DAY"
  elif [ "$AGE" -lt 72  ]; then echo "SESSION_GAP=RECENT"
  elif [ "$AGE" -lt 336 ]; then echo "SESSION_GAP=WEEK"
  else                          echo "SESSION_GAP=LONG_GAP"
  fi

  # Record this session start
  touch "$LAST_SESSION"

  echo "USER_STATUS=RETURNING"

  # 2. Current tree
  if [ -f ~/.whytree/.current ]; then
    SLUG=$(cat ~/.whytree/.current)
    echo "CURRENT_SLUG=$SLUG"
    echo "=== TREE_JSON ==="
    if [ -f ~/.whytree/"$SLUG".json ]; then
      cat ~/.whytree/"$SLUG".json
      echo  # ensure newline after JSON
    else
      echo "TREE_FILE_MISSING"
    fi
  else
    echo "NO_CURRENT_TREE"
  fi
fi

# 3. Analytics consent
echo "=== CONSENT ==="
CONSENT_FILE=~/.whytree/.analytics-consent
if [ -f "$CONSENT_FILE" ]; then
  CONSENT_VAL=$(cat "$CONSENT_FILE")
  echo "$CONSENT_VAL"
else
  CONSENT_VAL="NO_CONSENT_FILE"
  echo "NO_CONSENT_FILE"
fi

# 3a. Longitudinal counters (only meaningful when consent is yes-v2 AND not a demo)
echo "=== LONGITUDINAL ==="
if [ "$CONSENT_VAL" = "yes-v2" ] && [ "$DEMO_MODE" -eq 0 ]; then
  FIRST_FILE=~/.whytree/.first-session
  COUNT_FILE=~/.whytree/.session-count
  TODAY_EPOCH=$(date +%s)

  # Initialize first-session if missing (yes-v2 just granted but file not yet created)
  if [ ! -f "$FIRST_FILE" ]; then
    date -u +"%Y-%m-%dT%H:%M:%SZ" > "$FIRST_FILE"
  fi
  FIRST_EPOCH=$(stat -f%m "$FIRST_FILE" 2>/dev/null || stat -c%Y "$FIRST_FILE" 2>/dev/null || echo "$TODAY_EPOCH")
  DAYS_SINCE_FIRST=$(( (TODAY_EPOCH - FIRST_EPOCH) / 86400 ))

  # Increment session counter atomically-ish
  if [ -f "$COUNT_FILE" ]; then
    PREV=$(cat "$COUNT_FILE" 2>/dev/null || echo 0)
    case "$PREV" in ''|*[!0-9]*) PREV=0 ;; esac
  else
    PREV=0
  fi
  NEXT=$((PREV + 1))
  echo "$NEXT" > "$COUNT_FILE"

  echo "SESSION_NUMBER=$NEXT"
  echo "DAYS_SINCE_FIRST_SESSION=$DAYS_SINCE_FIRST"
else
  echo "SESSION_NUMBER=0"
  echo "DAYS_SINCE_FIRST_SESSION=0"
fi

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
