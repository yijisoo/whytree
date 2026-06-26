#!/usr/bin/env bash
# Resolve prompts.manifest into ordered absolute file paths.
: "${WHYTREE_ROOT:=$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)}"

_whytree_emit() { # $1 = domain, $2 = include-skill (1/0)
  local domain="$1" include_skill="$2" layer rel
  while read -r layer rel; do
    layer="${layer%$'\r'}"; rel="${rel%$'\r'}"  # tolerate CRLF checkouts (Windows)
    [[ -z "$layer" || "$layer" == \#* ]] && continue
    [[ "$layer" == skill && "$include_skill" != 1 ]] && continue
    rel="${rel//\{domain\}/$domain}"
    printf '%s/%s\n' "$WHYTREE_ROOT" "$rel"
  done < "$WHYTREE_ROOT/prompts.manifest"
}
whytree_assembly_files()             { _whytree_emit "$1" 1; }
whytree_assembly_files_core_domain() { _whytree_emit "$1" 0; }
