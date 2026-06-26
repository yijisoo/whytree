#!/usr/bin/env bash
set -euo pipefail
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$HERE/../.." && pwd)"
. "$ROOT/test/lib/assembly.sh"

norm() { grep -vE '^#{1,6} |^---$|^[[:space:]]*$' | sed 's/[[:space:]]*$//'; }

current="$(while read -r f; do cat "$f"; echo; done < <(whytree_assembly_files life) | norm | LC_ALL=C sort)"

if diff <(printf '%s\n' "$current") "$ROOT/test/equivalence/baseline.flat.md" > /tmp/equiv.diff; then
  echo "OK: assembly matches frozen baseline"
else
  echo "FAIL: assembly diverged from frozen baseline:"
  cat /tmp/equiv.diff
  exit 1
fi
