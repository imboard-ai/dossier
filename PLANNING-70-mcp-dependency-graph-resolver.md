# Issue #70: MCP: Dependency graph resolver for dossier relationships

## Type
feature

## Problem Statement
Build a dependency graph resolver that reads dossier `relationships` fields (`preceded_by`, `followed_by`, `conflicts_with`, `can_run_parallel_with`) and produces an execution plan as a DAG.

Part of the **MCP Server Refactor** epic. This is the foundational orchestration capability — everything else (journey execution, output mapping) builds on top of the resolved graph.

## Implementation Checklist
- [ ] Understand the issue and gather context
- [ ] Identify files that need modification
- [ ] `orchestration/graph.ts` — DAG builder (cycle detection, topological sort, parallel groups, conflicts)
- [ ] `orchestration/resolver.ts` — Dossier reference resolution (local files, registry via CLI, caching)
- [ ] `tools/resolveGraph.ts` — MCP tool (input: dossier path/name, output: execution plan)
- [ ] Add/update tests (unit tests for graph operations)
- [ ] Update documentation if needed
- [ ] Self-review the changes
- [ ] Create pull request

## Files to Modify
- `orchestration/graph.ts` — new file: DAG builder
- `orchestration/resolver.ts` — new file: dossier reference resolution
- `tools/resolveGraph.ts` — new file: MCP tool exposing the graph resolver

## Testing Strategy
- [ ] Unit tests for cycle detection
- [ ] Unit tests for topological sort
- [ ] Unit tests for parallel group identification
- [ ] Unit tests for `conflicts_with` violation detection
- [ ] Unit tests for dossier reference resolution (local + registry)
- [ ] Integration test for full graph resolution

## Schema Fields Consumed

```json
{
  "relationships": {
    "preceded_by": [{ "dossier": "name", "condition": "required|optional|suggested", "reason": "..." }],
    "followed_by": [{ "dossier": "name", "condition": "required|suggested", "purpose": "..." }],
    "conflicts_with": [{ "dossier": "name", "reason": "..." }],
    "can_run_parallel_with": ["name1", "name2"]
  }
}
```

## Dependencies
- #69 (CLI wrappers — uses `dossier get --json` for registry resolution)

## Notes
<!-- Additional notes, questions, or considerations -->

## Related Issues/PRs
- Issue: #70
- Depends on: #69
