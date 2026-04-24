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

# 1. User status + session gap
if [ ! -d ~/.whytree ] || [ -z "$(ls ~/.whytree/*.json 2>/dev/null)" ]; then
  echo "USER_STATUS=NEW_USER"
else
  # Use .last-session timestamp (updated every session) over tree file mtime
  LAST_SESSION=~/.whytree/.last-session
  if [ -f "$LAST_SESSION" ]; then
    MTIME=$(stat -f%m "$LAST_SESSION" 2>/dev/null || stat -c%Y "$LAST_SESSION" 2>/dev/null || echo 0)
  else
    # First run after upgrading from a pre-.last-session version: estimate gap from the
    # newest tree file's mtime. Subsequent runs use .last-session (touched at line 44).
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
    TREE_FILE=~/.whytree/"$SLUG".json
    if [ -f "$TREE_FILE" ]; then
      cat "$TREE_FILE"
      echo  # ensure newline after JSON

      # 2a. Structural health metrics — surfaced as signals for Phase 6 (Restructure).
      # Computed in Python because parsing JSON in pure bash is fragile. All failures
      # fall through to zero so the preamble never errors out on a malformed tree.
      echo "=== STRUCTURE ==="
      if command -v python3 >/dev/null 2>&1; then
        PYBIN=python3
      elif command -v python >/dev/null 2>&1; then
        PYBIN=python
      else
        PYBIN=""
      fi
      if [ -n "$PYBIN" ]; then
      "$PYBIN" - "$TREE_FILE" <<'PY'
import json, sys
try:
    with open(sys.argv[1]) as f:
        tree = json.load(f)
    nodes = tree.get("nodes", {}) or {}
    roots = tree.get("rootIds", []) or []
    seeds = tree.get("seedIds", []) or []
    node_count = len(nodes)
    root_count = len(roots)
    seed_count = len(seeds)

    # Empty why branches: a root of type "why" with no descendants of type "how"
    def has_how_descendant(nid, seen):
        if nid in seen: return False
        seen.add(nid)
        n = nodes.get(nid)
        if not n: return False
        for cid in n.get("childIds", []) or []:
            c = nodes.get(cid)
            if c and c.get("type") == "how": return True
            if has_how_descendant(cid, seen): return True
        return False

    empty_why = 0
    for rid in roots:
        r = nodes.get(rid)
        if r and r.get("type") == "why" and not has_how_descendant(rid, set()):
            empty_why += 1

    # Max depth (longest path from any root, by childIds)
    def depth(nid, seen):
        if nid in seen: return 0
        seen = seen | {nid}
        n = nodes.get(nid)
        if not n: return 0
        kids = n.get("childIds", []) or []
        if not kids: return 1
        return 1 + max((depth(c, seen) for c in kids), default=0)

    max_depth = max((depth(r, set()) for r in roots), default=0)

    # Seed coverage: fraction of seeds that have at least one why-up parent chain
    covered = 0
    for sid in seeds:
        s = nodes.get(sid)
        if s and (s.get("parentIds") or []):
            covered += 1
    ratio = (covered * 100 // seed_count) if seed_count else 0

    print(f"NODE_COUNT={node_count}")
    print(f"ROOT_COUNT={root_count}")
    print(f"SEED_COUNT={seed_count}")
    print(f"EMPTY_WHY_COUNT={empty_why}")
    print(f"MAX_DEPTH={max_depth}")
    print(f"SEED_COVERAGE_RATIO={ratio}")
except Exception:
    print("NODE_COUNT=0")
    print("ROOT_COUNT=0")
    print("SEED_COUNT=0")
    print("EMPTY_WHY_COUNT=0")
    print("MAX_DEPTH=0")
    print("SEED_COVERAGE_RATIO=0")
PY
      else
        echo "NODE_COUNT=0"
        echo "ROOT_COUNT=0"
        echo "SEED_COUNT=0"
        echo "EMPTY_WHY_COUNT=0"
        echo "MAX_DEPTH=0"
        echo "SEED_COVERAGE_RATIO=0"
      fi
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

  # Initialize first-session if missing (yes-v2 just granted but file not yet created).
  # Source of truth is the ISO timestamp INSIDE the file — survives `touch` or restore-from-backup.
  if [ ! -f "$FIRST_FILE" ]; then
    date -u +"%Y-%m-%dT%H:%M:%SZ" > "$FIRST_FILE"
  fi
  FIRST_ISO=$(head -1 "$FIRST_FILE" 2>/dev/null | tr -d '[:space:]')
  # Parse ISO timestamp to epoch (BSD date first, GNU date fallback). On any parse error,
  # fall through to today so DAYS_SINCE_FIRST=0 instead of a garbage value.
  FIRST_EPOCH=$(date -u -j -f "%Y-%m-%dT%H:%M:%SZ" "$FIRST_ISO" +%s 2>/dev/null \
    || date -u -d "$FIRST_ISO" +%s 2>/dev/null \
    || echo "$TODAY_EPOCH")
  DAYS_SINCE_FIRST=$(( (TODAY_EPOCH - FIRST_EPOCH) / 86400 ))
  if [ "$DAYS_SINCE_FIRST" -lt 0 ]; then DAYS_SINCE_FIRST=0; fi

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
    # Skip the update check if a pull is already in progress in another
    # /whytree session (the index lock is held during pull/merge). Fetch
    # itself is concurrency-safe; this guard avoids racing with a pull.
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
