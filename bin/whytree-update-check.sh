#!/usr/bin/env bash
# Check if a newer version of whytree is available on GitHub.
# Prints "UPDATE_AVAILABLE <local> <remote>" if an update exists.
# Prints nothing if up to date or if check fails.
# Designed to be called by the SKILL.md preamble on each session.

INSTALL_DIR="${WHYTREE_DIR:-$HOME/.claude/skills/whytree}"

# Must be a git repo
if [ ! -d "$INSTALL_DIR/.git" ]; then
  exit 0
fi

cd "$INSTALL_DIR" || exit 0

# Get local version
LOCAL=$(git rev-parse --short HEAD 2>/dev/null || echo "unknown")

# Fetch latest from remote (timeout 5s, silent)
git fetch origin main --quiet 2>/dev/null &
FETCH_PID=$!

# Wait up to 5 seconds for fetch
( sleep 5 && kill $FETCH_PID 2>/dev/null ) &
TIMER_PID=$!
wait $FETCH_PID 2>/dev/null
kill $TIMER_PID 2>/dev/null

# Get remote version
REMOTE=$(git rev-parse --short origin/main 2>/dev/null || echo "unknown")

if [ "$LOCAL" != "$REMOTE" ] && [ "$LOCAL" != "unknown" ] && [ "$REMOTE" != "unknown" ]; then
  BEHIND=$(git rev-list HEAD..origin/main --count 2>/dev/null || echo "?")
  echo "UPDATE_AVAILABLE $LOCAL $REMOTE $BEHIND"
fi
