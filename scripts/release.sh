#!/usr/bin/env bash
# release.sh — lint, version bump, changelog. Push only with --push.
# Usage: ./scripts/release.sh [patch|minor|major] ["changelog summary"] [--push]
#
# Defaults to patch bump if no argument given.
# Changelog summary is optional — if omitted, auto-generates from git log.
# --push flag pushes to origin after committing. Without it, commits locally only.
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_ROOT"

BUMP_TYPE="patch"
SUMMARY=""
PUSH=0
positional_count=0
for arg in "$@"; do
  if [ "$arg" = "--push" ]; then
    PUSH=1
  elif [ "$positional_count" -eq 0 ]; then
    BUMP_TYPE="$arg"
    positional_count=1
  elif [ "$positional_count" -eq 1 ]; then
    SUMMARY="$arg"
    positional_count=2
  else
    echo "[release] ERROR: unexpected extra positional argument: $arg" >&2
    echo "[release] usage: release.sh [patch|minor|major] [\"summary\"] [--push]" >&2
    exit 1
  fi
done

# --- Colors ---
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
NC='\033[0m'

info()  { echo -e "${GREEN}[release]${NC} $1"; }
warn()  { echo -e "${YELLOW}[release]${NC} $1"; }
error() { echo -e "${RED}[release]${NC} $1"; exit 1; }

# --- 1. Pre-flight checks ---
info "Pre-flight checks..."

# Must be on main branch
BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$BRANCH" != "main" ]; then
  error "Must be on main branch (currently on $BRANCH)"
fi

# Working tree must be clean
if ! git diff --quiet || ! git diff --cached --quiet; then
  error "Working tree is dirty — commit or stash changes first"
fi

# Must be up to date with remote
git fetch origin main --quiet
LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse origin/main)
MERGE_BASE=$(git merge-base HEAD origin/main)
if [ "$LOCAL" != "$REMOTE" ] && [ "$REMOTE" = "$MERGE_BASE" ]; then
  # Local is ahead — that's fine, we're about to push
  :
elif [ "$LOCAL" != "$REMOTE" ]; then
  error "Branch is behind origin/main — pull first"
fi

info "Pre-flight passed."

# --- 2. Run lint ---
info "Running skill lint..."
if ! bash test/skill-lint.sh; then
  error "Lint failed — fix issues before releasing"
fi
info "Lint passed."

# --- 3. Parse current version from CHANGELOG.md ---
CURRENT_VERSION=$(grep -oE '## \[[0-9]+\.[0-9]+\.[0-9]+\]' CHANGELOG.md | head -1 | grep -oE '[0-9]+\.[0-9]+\.[0-9]+')
if [ -z "$CURRENT_VERSION" ]; then
  error "Could not parse current version from CHANGELOG.md"
fi
info "Current version: $CURRENT_VERSION"

# --- 4. Bump version ---
IFS='.' read -r MAJOR MINOR PATCH <<< "$CURRENT_VERSION"
case "$BUMP_TYPE" in
  patch) PATCH=$((PATCH + 1)) ;;
  minor) MINOR=$((MINOR + 1)); PATCH=0 ;;
  major) MAJOR=$((MAJOR + 1)); MINOR=0; PATCH=0 ;;
  *) error "Invalid bump type: $BUMP_TYPE (use patch, minor, or major)" ;;
esac
NEW_VERSION="$MAJOR.$MINOR.$PATCH"
info "New version: $NEW_VERSION"

# --- 5. Generate changelog entry ---
TODAY=$(date +%Y-%m-%d)
LAST_VERSION_TAG=$(git log --oneline --all --grep="bump version to $CURRENT_VERSION" --format="%H" | head -1)
if [ -z "$LAST_VERSION_TAG" ]; then
  warn "Could not find 'bump version to $CURRENT_VERSION' commit — falling back to last 20 commits. Auto-changelog may include unrelated history; review before pushing."
  LAST_VERSION_TAG=$(git log --oneline -20 --format="%H" | tail -1)
fi

# Collect commits since last version
COMMITS=$(git log "$LAST_VERSION_TAG"..HEAD --oneline --no-merges 2>/dev/null || git log --oneline -10 --no-merges)

if [ -n "$SUMMARY" ]; then
  # User provided a summary — use it directly
  CHANGELOG_BODY="$SUMMARY"
else
  # Auto-generate from commits, grouped by conventional commit type
  # Strip "<sha> <type>(<scope>): " or "<sha> <type>: " prefix, leave the rest verbatim.
  ADDED=$(echo "$COMMITS"   | grep -iE '^[a-f0-9]+ feat([(:])'                              | sed -E 's/^[a-f0-9]+ feat(\([^)]*\))?: /- /' || true)
  FIXED=$(echo "$COMMITS"   | grep -iE '^[a-f0-9]+ fix([(:])'                               | sed -E 's/^[a-f0-9]+ fix(\([^)]*\))?: /- /' || true)
  CHANGED=$(echo "$COMMITS" | grep -iE '^[a-f0-9]+ (refactor|chore|docs|style|perf)([(:])'  | sed -E 's/^[a-f0-9]+ (refactor|chore|docs|style|perf)(\([^)]*\))?: /- /' || true)

  CHANGELOG_BODY=""
  if [ -n "$ADDED" ]; then
    CHANGELOG_BODY="${CHANGELOG_BODY}\n### Added\n$ADDED\n"
  fi
  if [ -n "$FIXED" ]; then
    CHANGELOG_BODY="${CHANGELOG_BODY}\n### Fixed\n$FIXED\n"
  fi
  if [ -n "$CHANGED" ]; then
    CHANGELOG_BODY="${CHANGELOG_BODY}\n### Changed\n$CHANGED\n"
  fi
fi

if [ -z "$CHANGELOG_BODY" ]; then
  warn "No conventional commits found — using raw commit list"
  CHANGELOG_BODY="### Changed\n$(echo "$COMMITS" | sed 's/^[a-f0-9]* /- /')"
fi

# --- 6. Update CHANGELOG.md ---
info "Updating CHANGELOG.md..."

# Write changelog entry to a temp file, then splice it in
ENTRY_FILE=$(mktemp)
echo "## [$NEW_VERSION] — $TODAY" > "$ENTRY_FILE"
echo "" >> "$ENTRY_FILE"
echo -e "$CHANGELOG_BODY" >> "$ENTRY_FILE"
echo "" >> "$ENTRY_FILE"

# Find the line number of the first version heading and insert before it
FIRST_VERSION_LINE=$(grep -n '^## \[' CHANGELOG.md | head -1 | cut -d: -f1)
if [ -n "$FIRST_VERSION_LINE" ]; then
  head -n $((FIRST_VERSION_LINE - 1)) CHANGELOG.md > CHANGELOG.tmp
  cat "$ENTRY_FILE" >> CHANGELOG.tmp
  tail -n +$FIRST_VERSION_LINE CHANGELOG.md >> CHANGELOG.tmp
  mv CHANGELOG.tmp CHANGELOG.md
else
  error "Could not find version heading in CHANGELOG.md"
fi
rm -f "$ENTRY_FILE"

info "Changelog updated."

# --- 7. Update .version ---
git rev-parse --short HEAD > .version

# --- 8. Commit ---
info "Committing version bump..."
git add CHANGELOG.md .version
git commit -m "$(cat <<EOF
chore: bump version to $NEW_VERSION

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"

# --- 8b. Tag (so each release is referenceable from GitHub issues, etc.) ---
TAG="v$NEW_VERSION"
if git rev-parse --verify --quiet "refs/tags/$TAG" > /dev/null; then
  warn "Tag $TAG already exists locally — skipping tag creation. Resolve manually if this is unexpected."
else
  info "Tagging $TAG..."
  git tag "$TAG"
fi

# --- 9. Push (only with --push flag) ---
if [ "$PUSH" -eq 1 ]; then
  info "Pushing main to origin..."
  git push origin main
  info "Pushing tag $TAG to origin..."
  git push origin "$TAG"
  info "Released and pushed $TAG"
else
  info "$TAG committed and tagged locally. Push when ready: git push origin main && git push origin $TAG"
fi
