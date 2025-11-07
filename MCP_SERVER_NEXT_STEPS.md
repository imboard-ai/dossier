# MCP Server Next Steps

**Context**: This document provides handoff for building the dossier MCP server in a fresh session with clean context window.

**Date**: 2025-11-07

---

## What We Accomplished Today

### 1. Established `.ds.md` Naming Convention
- ✅ Added `.ds.md` extension standard to README.md and PROTOCOL.md
- ✅ Renamed all 4 example dossiers to use `.ds.md`
- ✅ Updated all documentation references

**Why**: Makes dossier files instantly recognizable (like `.test.js`, `.spec.ts`)

### 2. Created Platform-Agnostic Git Worktree Dossier
- ✅ Created `examples/development/add-git-worktree-support.ds.md`
- ✅ Platform-agnostic (Windows, Mac, Linux)
- ✅ LLM-driven approach (scripts are reference examples, not requirements)
- ✅ Works entirely within project directory (no external temps)
- ✅ Multiple safety confirmations (3 checks before proceeding)
- ✅ High-risk level appropriately set
- ✅ Valid checksum generated

**Key insight**: Dossiers should provide WHAT and WHY, let LLM choose HOW based on platform

### 3. Added Automatic Dossier Detection to PROTOCOL.md
- ✅ New section: "Automatic Dossier Detection for LLM Agents"
- ✅ LLMs automatically perform security checks when they see `.ds.md` files
- ✅ Security verification (checksum, signature, risk) is automatic and mandatory
- ✅ User approval required based on risk level
- ✅ Users can simply say "run <dossier>.ds.md"

**Flow**:
1. User says: "run examples/development/add-git-worktree-support.ds.md"
2. LLM automatically:
   - Detects `.ds.md` extension
   - Reads PROTOCOL.md
   - Verifies checksum
   - Checks signature (if present)
   - Assesses risk level
   - Shows security summary to user
3. LLM asks for approval (if high-risk)
4. User says "yes"
5. LLM executes dossier (following its own safety checks)

---

## Current State of Dossier System

### What Works
- ✅ Dossier format and schema (v1.0.0)
- ✅ Naming convention (`.ds.md`)
- ✅ Security protocol (checksum, signature, risk assessment)
- ✅ Verification tools (`tools/sign-dossier.js`, `tools/verify-dossier.js`)
- ✅ 5 example dossiers (ML training, database migration, React library, AWS deployment, git worktrees)
- ✅ PROTOCOL.md with automatic detection rules
- ✅ Platform-agnostic approach

### What's Missing (Critical Gap)
- ❌ **MCP Server** - No native integration with Claude Code/Desktop
- ❌ Natural language execution ("use the worktree dossier")
- ❌ Automatic dossier discovery in projects
- ❌ Built-in security verification (currently relies on LLM following protocol)

---

## The UX Problem

**Current state** (without MCP):
```
User: "run examples/development/add-git-worktree-support.ds.md"

Claude: *Detects .ds.md IF it read PROTOCOL.md*
        *Performs security checks IF it understood the protocol*
        *Asks for approval IF it followed the rules*
        *Executes the dossier*
```

**Problem**: Relies on LLM following instructions. Not guaranteed.

**Desired state** (with MCP):
```
User: "run examples/development/add-git-worktree-support.ds.md"

MCP Server: *Automatically intercepts .ds.md execution*
            *Enforces security checks (code-level, not LLM-dependent)*
            *Shows trust UI in Claude*
            *User approves*
            *Executes with monitoring*
```

**Better**: Security is enforced by code, not LLM instructions.

---

## What Needs to Be Built

### MCP Server for Dossier Execution

**Goal**: Native integration with Claude Code/Desktop using Model Context Protocol

**Location**: `mcp-server/` directory (already exists with spec)

### Core Functionality Required

#### 1. Tool: `execute_dossier`

**Purpose**: Execute a dossier with automatic security verification

**Signature**:
```typescript
interface ExecuteDossierInput {
  dossier_path: string;        // Path to .ds.md file
  skip_approval?: boolean;     // Skip approval for low-risk (default: false)
  trust_unsigned?: boolean;    // Trust unsigned dossiers (default: false)
}

interface ExecuteDossierOutput {
  status: "success" | "blocked" | "requires_approval";
  security_report: {
    integrity: "verified" | "failed";
    authenticity: "verified" | "unsigned" | "failed";
    risk_level: "low" | "medium" | "high" | "critical";
    risk_factors: string[];
    destructive_operations: string[];
  };
  execution_log?: string[];    // If executed
  error?: string;               // If blocked
}
```

**Behavior**:
1. Read dossier file
2. Parse frontmatter (JSON schema)
3. Verify checksum (calculate SHA256, compare)
4. Verify signature if present (using minisign)
5. Assess risk level from metadata
6. Return security_report
7. If `requires_approval`, return status "requires_approval"
8. If approved, execute dossier instructions (delegate to LLM)
9. Return execution_log

#### 2. Tool: `verify_dossier`

**Purpose**: Verify dossier without executing (for inspection)

**Signature**:
```typescript
interface VerifyDossierInput {
  dossier_path: string;
}

interface VerifyDossierOutput {
  valid: boolean;
  integrity: "verified" | "failed";
  authenticity: "verified" | "unsigned" | "unknown" | "failed";
  metadata: {
    title: string;
    version: string;
    risk_level: string;
    // ... other frontmatter fields
  };
  issues: string[];  // Problems found
}
```

#### 3. Resource: `dossier://protocol`

**Purpose**: Provide PROTOCOL.md as a resource for LLM context

**Behavior**:
- When LLM needs to understand dossier execution
- MCP server provides PROTOCOL.md content
- LLM has automatic access without explicit read

#### 4. Resource: `dossier://list`

**Purpose**: List available dossiers in project

**Behavior**:
- Scan project for `**/*.ds.md` files
- Return list with metadata (title, description, risk level)
- Enable natural language: "what dossiers are available?"

### Implementation Steps

1. **Setup MCP Server Boilerplate**
   - Initialize Node.js project in `mcp-server/`
   - Install dependencies: `@modelcontextprotocol/sdk`
   - Create server entry point

2. **Implement Dossier Parser**
   - Parse `---dossier\n{...}\n---\n[body]` format
   - Extract frontmatter JSON
   - Validate against schema

3. **Implement Security Verification**
   - Checksum calculation (SHA256)
   - Signature verification (minisign integration)
   - Risk assessment logic

4. **Implement `verify_dossier` Tool**
   - Read dossier
   - Parse and validate
   - Return security report

5. **Implement `execute_dossier` Tool**
   - Call `verify_dossier` internally
   - Check approval requirements
   - Delegate execution to LLM context
   - Monitor and log

6. **Implement Resources**
   - `dossier://protocol` → serve PROTOCOL.md
   - `dossier://list` → scan and list dossiers

7. **Test with Claude Code**
   - Install MCP server locally
   - Configure in Claude Code settings
   - Test: "run add-git-worktree-support.ds.md"
   - Verify security checks happen automatically

8. **Dogfood**
   - Use the worktree dossier on the dossier project itself
   - Verify it successfully restructures the directory
   - Test the worktree workflow

---

## Acceptance Criteria

### Minimum Viable Product (MVP)

**User can**:
1. Say "run <dossier>.ds.md" in Claude Code
2. MCP server automatically:
   - Verifies checksum
   - Checks signature
   - Shows security summary
3. User approves/denies based on trust level
4. Dossier executes with LLM following instructions

**Security**:
- ✅ Checksum verification enforced (code-level)
- ✅ Risk assessment shown to user
- ✅ User approval required for high-risk
- ✅ Execution logged

**UX**:
- ✅ Simple: "run <dossier>.ds.md"
- ✅ Safe: Security checks automatic
- ✅ Transparent: User sees what will happen

### Future Enhancements (Post-MVP)

1. **Natural Language**:
   - "use the worktree dossier"
   - "what dossiers are available?"
   - "is this dossier safe?"

2. **Trust Management**:
   - UI for managing trusted keys
   - Key rotation
   - Trust levels (always trust this key, etc.)

3. **Dossier Registry**:
   - Central repository of official dossiers
   - Download and install dossiers
   - Update notifications

4. **Execution History**:
   - Track which dossiers were run
   - Success/failure metrics
   - Rollback capability

---

## Files to Review

### Existing Specs
- `mcp-server/SPECIFICATION.md` - MCP server spec (may be outdated)
- `mcp-server/README.md` - MCP server overview

### Documentation
- `PROTOCOL.md` - Execution protocol (just updated with auto-detection)
- `SCHEMA.md` - Dossier schema specification
- `README.md` - Project overview
- `SPECIFICATION.md` - Dossier format spec

### Example Dossier
- `examples/development/add-git-worktree-support.ds.md` - Use this for testing

### Tools
- `tools/verify-dossier.js` - Existing verification tool (can reuse logic)
- `tools/sign-dossier.js` - Signing tool (see how it works)

---

## Technical Notes

### Checksum Calculation

**Must match exactly**:
```javascript
const crypto = require('crypto');

// Extract body after closing ---
const frontmatterRegex = /^---dossier\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/m;
const match = content.match(frontmatterRegex);
const body = match[2];

// Calculate SHA256
const checksum = crypto.createHash('sha256').update(body, 'utf8').digest('hex');
```

**Critical**: Hash is of the BODY only (after `---`), not the entire file.

### Signature Verification

**Uses minisign**:
```bash
# Verify signature
minisign -Vm <file> -P <public-key>
```

**Integration**:
- Embed signature in frontmatter
- Extract to temp file
- Call minisign via child_process
- Parse result

### Risk Level Logic

```javascript
function requiresApproval(metadata, isUnsigned) {
  const { risk_level, requires_approval } = metadata;

  if (risk_level === 'high' || risk_level === 'critical') {
    return true;  // ALWAYS require approval
  }

  if (risk_level === 'medium' && (isUnsigned || requires_approval)) {
    return true;
  }

  if (requires_approval) {
    return true;
  }

  return false;
}
```

---

## Development Workflow

### 1. Start Fresh Session

```bash
# New terminal, fresh Claude Code instance
cd ~/projects/dossier/mcp-server
```

### 2. Initialize MCP Server

```bash
npm init -y
npm install @modelcontextprotocol/sdk
```

### 3. Create Server Entry Point

**File**: `mcp-server/src/index.js`

```javascript
#!/usr/bin/env node

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');

// ... implement server
```

### 4. Implement Tools

- Start with `verify_dossier` (simpler, no execution)
- Then `execute_dossier` (builds on verify)

### 5. Test Locally

```bash
# Run server
node mcp-server/src/index.js

# Configure in Claude Code settings.json
{
  "mcpServers": {
    "dossier": {
      "command": "node",
      "args": ["/absolute/path/to/dossier/mcp-server/src/index.js"]
    }
  }
}
```

### 6. Test Execution

In Claude Code:
```
"run examples/development/add-git-worktree-support.ds.md"
```

Should trigger MCP server, show security report, ask for approval.

---

## Success Metrics

### Must Have (MVP)
- ✅ User says "run <dossier>.ds.md"
- ✅ MCP server verifies checksum automatically
- ✅ User sees security summary
- ✅ User approves
- ✅ Dossier executes successfully

### Should Have
- ✅ Signature verification works (if signed)
- ✅ Risk levels displayed correctly
- ✅ Execution logged

### Nice to Have
- ✅ Natural language ("use the worktree dossier")
- ✅ Dossier discovery ("what dossiers exist?")

---

## Next Session Prompt

**Copy-paste this to start the next session**:

```
I want to build the MCP server for the dossier system.

Context:
- Read MCP_SERVER_NEXT_STEPS.md (this file) to understand what needs to be built
- Review mcp-server/SPECIFICATION.md for the existing spec
- Look at tools/verify-dossier.js to see how verification works

Goal:
Build an MCP server that enables users to execute dossiers by simply saying
"run <dossier>.ds.md", with automatic security verification.

Start by:
1. Setting up the MCP server boilerplate in mcp-server/
2. Implementing verify_dossier tool (checksum + signature verification)
3. Testing with examples/development/add-git-worktree-support.ds.md

Let me know when you're ready to start!
```

---

## Questions to Answer (When Building)

1. How should execution delegation work?
   - MCP server verifies, then tells LLM to execute?
   - Or MCP server reads dossier and executes directly?

2. How to handle dossier interaction?
   - Dossier asks user questions during execution
   - MCP server needs to pass through to LLM context

3. Execution monitoring?
   - How to capture what the LLM does?
   - How to log for audit trail?

4. Error handling?
   - What if checksum fails?
   - What if signature invalid?
   - How to show errors to user?

---

**Status**: Ready to build MCP server

**Next**: Start fresh session, read this file, begin implementation

**Timeline**: 2-4 hours for MVP

---

*Generated: 2025-11-07 by Claude Code session*
*Current commit: b51e420*
