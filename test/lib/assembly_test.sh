#!/usr/bin/env bash
set -euo pipefail
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
. "$HERE/assembly.sh"

# core layer must come first, skill layer last, life domain in the middle
mapfile -t files < <(whytree_assembly_files life)
[[ "${files[0]}" == */core/operating-rules.md ]] || { echo "FAIL: core not first"; exit 1; }
[[ "${files[-1]}" == */skill/mechanics.md ]]     || { echo "FAIL: mechanics not last"; exit 1; }
printf '%s\n' "${files[@]}" | grep -q '/domains/life/SEED_QUESTIONS.md' || { echo "FAIL: life seeds missing"; exit 1; }

# core+domain view must exclude the skill layer
mapfile -t cd < <(whytree_assembly_files_core_domain life)
printf '%s\n' "${cd[@]}" | grep -q '/skill/' && { echo "FAIL: skill leaked into core+domain view"; exit 1; }
echo "OK: assembly resolver"
