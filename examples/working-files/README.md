# Working Files Example

This directory demonstrates the **working files pattern** for dossiers.

## Overview

**Working files** (`.dsw.md`) are mutable, agent-managed markdown files that track execution state alongside immutable dossiers. They provide a structured way to maintain context, progress, and decisions across multiple execution sessions.

## What's in This Example

### 1. `deploy-application.ds.md`
The **immutable dossier** - contains instructions for deploying an application to staging.

**Key characteristics**:
- ✅ Signed/checksummed (in real use)
- ✅ Immutable instructions
- ✅ Security verified
- ❌ Does NOT change during execution

### 2. `deploy-application.dsw.md`
The **working file** - tracks execution state during deployment.

**Key characteristics**:
- ❌ NOT signed or checksummed
- ✅ Mutable state tracking
- ❌ NOT security verified
- ✅ DOES change during execution

### 3. `.gitignore.example`
Example gitignore patterns for working files (if you choose to exclude them).

## The Pattern

### File Naming Convention

```
<dossier-name>.dsw.md
```

Examples:
- `deploy-application.ds.md` → `deploy-application.dsw.md`
- `setup-ci.ds.md` → `setup-ci.dsw.md`
- `run-migration.ds.md` → `run-migration.dsw.md`

### Standard Structure

Every working file should include:

```markdown
# Working File: [Dossier Title]

**Dossier**: [filename].ds.md
**Created**: [timestamp]
**Last Updated**: [timestamp]
**Status**: [In Progress | Completed | Blocked | Paused]

---

## Progress
- [ ] Step 1
- [ ] Step 2

## Context Gathered
[Information discovered]

## Decisions Made
[Important decisions]

## Actions Taken
[Log of operations with timestamps]

## Blockers / Issues
[Problems encountered]

## Next Steps
[What needs to happen next]

## Notes
[Additional observations]
```

## When to Use Working Files

✅ **Create a working file when**:
- Executing a multi-step dossier that spans multiple sessions
- The task requires tracking state (progress, context, decisions)
- You need to gather extensive context before taking action
- The user might interrupt and resume execution later
- Long-running tasks benefit from visible progress tracking

❌ **Do NOT create working files for**:
- Simple, single-step tasks that complete immediately
- Read-only operations with no state to track
- Tasks that don't require context persistence

## Version Control Decision

Should you commit working files to git? **It depends on your workflow**.

### Commit Working Files When:
- ✅ Team collaboration (share execution progress)
- ✅ Resuming on different machines
- ✅ Audit trail is valuable
- ✅ Working files serve as documentation

### Gitignore Working Files When:
- ✅ Solo development with no need to share state
- ✅ Multiple concurrent executions (avoid merge conflicts)
- ✅ Machine-specific or temporary data
- ✅ Clean repository history desired

See `.gitignore.example` for patterns.

## Security Model

**Working files are outside the security boundary**:

```
┌────────────────────────────────┐
│ SECURITY ZONE                  │
│                                │
│  Dossier (.ds.md)             │
│  ✅ Signed, verified           │
│  ✅ Immutable instructions     │
│                                │
└────────────────────────────────┘

Working File (.dsw.md)
❌ No verification
✅ Mutable state
```

**Why this is safe**:
1. **Dossiers define WHAT to do** (instructions) - must be trusted
2. **Working files track WHAT WAS DONE** (state) - no security risk
3. **Separation of concerns** - tampering with working file doesn't change instructions

## Using This Example

### 1. Review the Dossier

Read `deploy-application.ds.md` to understand:
- The deployment instructions
- How it references the working file pattern
- Risk factors and approval requirements

### 2. Examine the Working File

Read `deploy-application.dsw.md` to see:
- How it references the parent dossier
- Progress tracking structure
- Context gathering format
- Decision documentation
- Action logging with timestamps
- Issue tracking
- Resume capability

### 3. Try It Yourself

Create your own working file for a multi-step task:

```bash
# Start with a dossier
cp deploy-application.ds.md my-task.ds.md

# Edit for your use case
# ... edit my-task.ds.md ...

# When executing, create working file
touch my-task.dsw.md

# Use the standard structure from this example
```

## Key Takeaways

1. **Immutable vs Mutable**: Dossiers are immutable instructions, working files are mutable state
2. **Security Separation**: Working files bypass verification - they're not part of the trust model
3. **Resume Capability**: Working files enable interruption and resumption
4. **Documentation Value**: Working files serve as execution logs and decision records
5. **Team Decision**: Commit or gitignore based on your workflow needs

## References

- [PROTOCOL.md - Working Files Protocol](../../PROTOCOL.md#-working-files-protocol-dswmd)
- [ARCHITECTURE.md - Handling Mutable State](../../security/ARCHITECTURE.md#handling-mutable-state-working-files)

## Questions?

- **Q: Must I use working files?**
  - A: No, they're optional. Use them for multi-step tasks where state tracking adds value.

- **Q: Can working files be signed?**
  - A: No, they're intentionally mutable and outside the security model.

- **Q: What if I modify the dossier instead of using a working file?**
  - A: The checksum will break, and security verification will fail. Use working files for mutable state.

- **Q: Can I have multiple working files for one dossier?**
  - A: Generally no. Use one working file per dossier execution. For multiple executions, consider timestamped working files: `deploy-application-20251112.dsw.md`

- **Q: Should working files be in .gitignore?**
  - A: It depends. If they're valuable documentation, commit them. If they're ephemeral, gitignore them. Your team decides.
