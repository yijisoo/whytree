# Tree Data Format

## File naming

Slugify the tree name: lowercase, replace non-alphanumeric (Unicode-aware) with `-`, collapse runs, trim edges, append `.json`.
Examples: `"Ji Soo — March 2026"` → `ji-soo-march-2026.json`, `"나의 트리"` → `나의-트리.json`

## Schema

```json
{
  "schemaVersion": 1,
  "name": "Display Name",
  "nodes": {
    "<uuid>": {
      "id": "<uuid>",
      "label": "node text",
      "type": "seed | why | how",
      "parentIds": [],
      "childIds": [],
      "createdAt": "ISO 8601"
    }
  },
  "rootIds": ["<uuid>"],
  "seedIds": ["<uuid>"],
  "currentNodeId": null,
  "lastExperimentId": null,
  "createdAt": "ISO 8601",
  "updatedAt": "ISO 8601",
  "purpose": null
}
```

- **schemaVersion**: Integer. Current version is `1`. Used to detect and migrate trees written by older schema versions. Always set to the current version when creating new trees.
- **seed**: Original entry point (user's starting activity/thought)
- **why**: Purpose node (parent — answers "why does this matter?")
- **how**: Means node (child — answers "what else could serve this?")
- **rootIds**: Nodes with no parents (top-level purposes)
- **seedIds**: Original seeds (never changes even if seeds get parents)
- **lastExperimentId**: Node ID of the experiment chosen in the Commitment Arc (null if no experiment yet)
- **purpose**: One-sentence synthesis, set during closing
