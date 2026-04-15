#!/usr/bin/env bash
# WhyTree preamble — gathers all session state in one shot.
# Output is structured with === SECTION === markers for parsing.

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
if [ -f ~/.whytree/.analytics-consent ]; then
  cat ~/.whytree/.analytics-consent
  echo  # ensure newline
else
  echo "NO_CONSENT_FILE"
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
