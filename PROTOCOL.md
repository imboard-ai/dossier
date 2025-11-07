# Dossier Execution Protocol

**Version**: 1.0
**Status**: Stable
**Last Updated**: 2025-01-05

---

## Overview

This protocol defines **standard execution guidelines** for all dossiers. Every dossier references this protocol to ensure consistent, safe, and continuously improving automation.

**Purpose**:
- Provide meta-instructions that apply to ALL dossiers
- Enable self-improving dossier system
- Ensure safety and quality across all executions
- Create consistent user experience

---

## 🔄 Self-Improvement Protocol

**Key Insight**: Every dossier execution is an opportunity to improve the dossier itself.

**Default**: Enabled (users can skip with "just execute" or "skip improvements")

### Step 1: Meta-Analysis (Before Execution)

**Before executing any dossier, analyze it for potential improvements**:

**Review the dossier for**:
- [ ] **Clarity**: Are instructions specific enough for this project's context?
- [ ] **Completeness**: Missing edge cases you can anticipate from gathered context?
- [ ] **Examples**: Could examples be more relevant to detected tech stack?
- [ ] **Validation**: Are validation steps sufficient for this scenario?
- [ ] **Troubleshooting**: Cover issues you can foresee?
- [ ] **Decision trees**: Complete for the structure you detected?
- [ ] **Specificity**: Are commands/paths explicit or too generic?

### Step 2: Propose Improvements (If Found)

**If improvements identified**, present suggestion to user:

**Standard format**:
```
🔄 Dossier Improvement Suggestion

**Dossier**: [dossier-name].md
**Protocol Version**: [version]

**Context Triggering Improvement**:
[What about this specific project revealed the gap]

**Improvements Identified**:

1. [Specific improvement]
   - **Why needed**: [Reasoning based on current context]
   - **Benefit**: [Concrete improvement this provides]
   - **Example**: [Show what it would add]

2. [Another improvement if multiple]
   - **Why needed**: [Reasoning]
   - **Benefit**: [Improvement]

**Proposed Changes**:
```markdown
[Show diff or new sections to add to dossier]
```

**Benefits of Adopting**:
- ✅ [Benefit 1: More specific/complete/safer]
- ✅ [Benefit 2: Handles edge case X]
- ✅ [Benefit 3: Better user experience]

**Impact**: [Low/Medium/High] - How much better does this make the dossier?

**Should I update the dossier before executing? (y/N)**
```

### Step 3: User Decision

**User can respond**:
- **"Yes" or "y"**: Update dossier, then execute improved version
- **"No" or "n" or "Skip"**: Execute current version as-is
- **"Iterate"**: Refine suggestion, propose again
- **"Show diff"**: Display detailed before/after comparison
- **"Just execute"** (anytime): Skip improvement check entirely

### Step 4: Apply Improvement (If Accepted)

**If user accepts**:
1. Update dossier file at `dossier location/dossiers/[name].md`
2. Show what changed (diff)
3. If Dossier Operator: Offer to commit improvement
4. If Dossier Citizen: Save locally or just use for this execution
5. Proceed with improved version

**If user declines**:
1. Note suggestion for future reference
2. Execute original version
3. Continue normally

### When to Skip Self-Improvement

**Auto-skip if**:
- User explicitly said "just execute"
- Dossier was recently improved (within last execution)
- Time-critical situation
- User indicated urgency

**Manual skip**:
- User says "skip improvements"
- User says "no suggestions"

---

## 🔒 Security Verification Protocol

**CRITICAL**: Before executing ANY dossier, verify its integrity and authenticity.

### Step 1: Integrity Check (REQUIRED)

**Every dossier execution MUST start with checksum verification**:

1. **Extract checksum** from frontmatter `checksum.hash`
2. **Calculate SHA256** of dossier body (content after `---` closing frontmatter)
3. **Compare** calculated hash with frontmatter hash

**If checksums match**: ✅ Continue to Step 2
**If checksums DON'T match**: ❌ **BLOCK EXECUTION**

```
❌ SECURITY ALERT: Checksum Verification Failed

This dossier has been modified since it was created/signed.
Expected: abc123...
Actual:   def456...

DO NOT EXECUTE - The dossier may have been tampered with.

Actions:
1. Re-download from trusted source
2. Contact dossier author to verify
3. If you made intentional changes, regenerate checksum with:
   node tools/sign-dossier.js <dossier-file> --dry-run
```

### Step 2: Authenticity Check (OPTIONAL but RECOMMENDED)

**If dossier has `signature` field**:

1. **Extract signature** from frontmatter
2. **Verify signature** using public_key (minisign or verify-dossier tool)
3. **Check trust level**:
   - Is `public_key` in user's `~/.dossier/trusted-keys.txt`?
   - Or is it a known official key (e.g., imboard-ai)?

**Trust levels**:
- ✅ **VERIFIED**: Valid signature + key is trusted → Proceed with confidence
- ⚠️  **SIGNED_UNKNOWN**: Valid signature + key NOT trusted → Warn user
- ⚠️  **UNSIGNED**: No signature field → Warn user
- ❌ **INVALID**: Signature verification failed → **BLOCK EXECUTION**

**Warning template for unsigned/unknown**:
```
⚠️  SECURITY WARNING: Unsigned Dossier

This dossier does not have a cryptographic signature.
- Integrity: ✅ Verified (checksum matches)
- Authenticity: ⚠️  Cannot verify author

Only proceed if you trust the source!

Continue? (y/N)
```

### Step 3: Risk Assessment (REQUIRED)

**Read risk metadata from frontmatter**:

```json
{
  "risk_level": "high",
  "risk_factors": ["modifies_cloud_resources", "requires_credentials"],
  "requires_approval": true,
  "destructive_operations": [
    "Creates/updates AWS infrastructure",
    "Modifies IAM roles"
  ]
}
```

**Risk-based approval requirements**:

| Risk Level | Requires Approval | Additional Checks |
|------------|------------------|-------------------|
| **low** | Only if `requires_approval: true` | None |
| **medium** | If unsigned OR `requires_approval: true` | Show risk_factors |
| **high** | ALWAYS | Show risk_factors + destructive_operations |
| **critical** | ALWAYS | Show ALL metadata + require explicit confirmation |

**Approval prompt template**:
```
⚠️  EXECUTION APPROVAL REQUIRED

Dossier: Deploy to AWS v1.0.0
Trust: ✅ Verified (imboard-ai-2024) [or ⚠️ Unsigned]

Risk Level: HIGH
Risk Factors:
  • Modifies cloud resources
  • Requires AWS credentials
  • Network access

This dossier will:
  • Create/update AWS infrastructure (ECS, Lambda, VPC)
  • Modify IAM roles and security groups
  • Deploy application code

Proceed with execution? (y/N)
```

### Step 4: Execution Monitoring (REQUIRED for high/critical risk)

**During execution**:
1. **Log all commands** executed (for audit trail)
2. **Confirm destructive operations** individually (unless auto-approved)
3. **Show progress** at each major step
4. **Handle errors** gracefully with rollback guidance

**Never bypass security**:
- ❌ Don't skip checksum verification
- ❌ Don't auto-approve high-risk operations without user consent
- ❌ Don't execute if signature verification fails
- ❌ Don't hide risk information from user

### Security Verification Tools

**Automated verification** (if available):
```bash
# MCP Server (if available)
Use `verify_dossier` tool for automated checks

# Standalone verification
node tools/verify-dossier.js <dossier-file>
# Exit codes: 0 = ALLOW, 2 = WARN, 1 = BLOCK
```

**Manual verification**:
```bash
# Calculate checksum manually
tail -n +N <dossier-file> | shasum -a 256
# (where N is the line after `---` closing frontmatter)

# Compare with frontmatter checksum.hash
```

---

## 🔧 MCP Server Integration

### Overview

The **Model Context Protocol (MCP) server** provides automated tools and resources that streamline dossier execution with automatic security verification, discovery, and protocol access.

**Key Benefits**:
- ⚡ **Automatic security verification** (checksums, signatures)
- 📋 **Dossier discovery** (`list_dossiers` tool)
- 🔒 **Trust management** (verify authenticity)
- 📖 **Built-in protocol access** (via `dossier://protocol` resource)
- 🚀 **Streamlined execution** (no manual file reading)

**When MCP is configured**: All security checks happen automatically via tools.
**When MCP is missing**: Fallback to manual verification (slower, more steps).

---

### Prerequisites Check

**Before executing any dossier**, LLMs should check if the MCP server is available:

#### Detection Method

**Step 1**: Attempt to call an MCP tool

```typescript
// Try calling any MCP tool
try {
  await tools.list_dossiers({ path: "." });
  // SUCCESS: MCP server is available
  mcpAvailable = true;
} catch (error) {
  if (error.message.includes("tool not found") ||
      error.message.includes("unknown tool")) {
    // MCP server not configured
    mcpAvailable = false;
  } else {
    // Other error (server configured but failing)
    throw error;
  }
}
```

**Step 2**: Check dossier's MCP requirements

```typescript
// Read dossier frontmatter
const dossier = await readDossierFile(path);
const mcpConfig = dossier.frontmatter.mcp_integration;

// Determine if MCP is required
const mcpRequired = mcpConfig?.required === true;
const fallbackMode = mcpConfig?.fallback || "manual_execution";
```

**Step 3**: Decide how to proceed

```typescript
if (mcpAvailable) {
  // Use MCP tools for automatic verification
  executeWithMCP(dossier);
} else if (mcpRequired && fallbackMode === "error") {
  // Block execution - MCP required but not available
  showSetupInstructions();
  return;
} else {
  // Proceed with fallback mode
  executeWithFallback(dossier, fallbackMode);
}
```

---

### MCP Server Not Configured

When MCP server is not available, behavior depends on the dossier's `mcp_integration.fallback` setting:

#### If Dossier Requires MCP (`mcp_integration.required: true`)

**Recommended User Flow**:

```
LLM: "This dossier requires the MCP server for automatic security
      verification, but I don't see it configured yet.

The MCP server enables:
- ✅ Automatic checksum verification
- ✅ Signature validation
- ✅ Risk assessment
- ✅ Streamlined execution

Would you like to:
1. Set up MCP server now (5-10 minutes, one-time)
   → I'll guide you through setup-dossier-mcp.ds.md
2. See manual configuration instructions
3. Cancel execution

Your choice?"
```

**After User Choice**:
- **Option 1**: Execute `examples/setup/setup-dossier-mcp.ds.md` interactively
- **Option 2**: Show manual configuration steps (JSON editing)
- **Option 3**: Exit gracefully

#### If Dossier Allows Fallback

**Check fallback mode**:

```typescript
switch (mcpConfig.fallback) {
  case "manual_execution":
    // Offer choice: setup MCP or continue manually
    offerSetupOrManual();
    break;

  case "degraded":
    // Continue with reduced functionality
    // (e.g., skip signature verification, keep checksums)
    executeInDegradedMode();
    break;

  case "error":
    // Block execution, require MCP setup
    requireMCPSetup();
    break;
}
```

**Recommended Flow for `manual_execution` fallback**:

```
LLM: "I notice the dossier MCP server isn't configured yet.

This dossier can work without MCP, but automatic security
verification won't be available. I'll need to guide you through
manual verification steps.

Would you like to:
1. Set up MCP server first (recommended, 5-10 min one-time setup)
2. Continue with manual verification (this session only)
3. See what MCP server provides

Your preference?"
```

---

### Fallback Modes Explained

#### 1. `manual_execution` (Default, Recommended)

**When to use**: Most dossiers

**Behavior**:
- LLM reads dossier content directly (via Read tool)
- Manual checksum verification with user
- Manual risk assessment explanation
- Step-by-step execution with user approval
- No automatic security checks

**User experience**: Slower, more manual steps, but fully functional

**Example**:
```json
{
  "mcp_integration": {
    "required": false,
    "fallback": "manual_execution"
  }
}
```

---

#### 2. `degraded` (Reduced Functionality)

**When to use**: Dossiers with optional features that enhance with MCP

**Behavior**:
- Continue execution with core functionality only
- Skip optional MCP-dependent features
- Warn user about missing capabilities
- Don't block execution

**User experience**: Works, but misses enhanced features

**Example**:
```json
{
  "mcp_integration": {
    "required": false,
    "fallback": "degraded",
    "benefits": [
      "Without MCP: basic execution only",
      "With MCP: automatic discovery of related dossiers"
    ]
  }
}
```

---

#### 3. `error` (Block Execution)

**When to use**: Dossiers that truly cannot function without MCP

**Behavior**:
- Block execution immediately
- Show clear error message
- Provide setup instructions
- Don't attempt fallback

**User experience**: Must set up MCP to use this dossier

**Example**:
```json
{
  "mcp_integration": {
    "required": true,
    "fallback": "error",
    "benefits": [
      "This dossier requires MCP server for automated registry parsing"
    ]
  }
}
```

**Note**: Very few dossiers should use `error` fallback. Most can work in `manual_execution` mode.

---

### Setup Guidance Flow

When offering MCP setup, use this flow:

#### Step 1: Explain Benefits

```
"The dossier MCP server provides:

✅ Automatic Security Verification
   - Checksums verified automatically
   - Signatures validated
   - Risk assessment shown before execution

✅ Dossier Discovery
   - Find dossiers with natural language
   - See metadata without reading files

✅ Protocol Access
   - Built-in documentation
   - Consistent execution across all dossiers

This is a one-time setup (5-10 minutes) that enhances
all future dossier executions."
```

#### Step 2: Offer Setup Options

```
"Would you like to set up the MCP server?

1. ⭐ Guided setup (recommended)
   → I'll walk you through setup-dossier-mcp.ds.md step-by-step

2. Manual configuration
   → I'll show you the configuration file to edit

3. Skip for now
   → Continue without MCP (manual verification mode)

What's your preference?"
```

#### Step 3: Execute Setup (if chosen)

**If option 1 (guided)**:
```typescript
// Execute setup dossier
await executeDossier("examples/setup/setup-dossier-mcp.ds.md");

// After completion, verify
const result = await tools.list_dossiers({ path: "." });
if (result.success) {
  console.log("✅ MCP server configured successfully!");
  console.log("Returning to original dossier execution...");
} else {
  console.log("Setup incomplete. See troubleshooting.");
}
```

**If option 2 (manual)**:
```markdown
To configure manually:

1. Edit: ~/.claude/settings.local.json
2. Add:
   {
     "mcpServers": {
       "dossier": {
         "command": "npx",
         "args": ["-y", "@dossier/mcp-server"]
       }
     }
   }
3. Restart Claude Code
4. Return to this dossier
```

#### Step 4: Return to Original Task

After setup complete, resume the original dossier execution with MCP now available.

---

### Example Conversation Flows

#### Example 1: High-Risk Dossier, No MCP

```
User: "run examples/devops/deploy-to-aws.ds.md"

LLM: *Attempts verify_dossier() → fails*
     *Reads dossier frontmatter*
     *Sees: mcp_integration.required: false, fallback: manual_execution*

LLM: "I notice the dossier MCP server isn't configured yet.

This is a HIGH RISK dossier (modifies cloud resources) that
benefits from automatic security verification.

Without MCP server:
- ❌ No automatic checksum verification
- ❌ No signature validation
- ⚠️  Manual verification required

With MCP server:
- ✅ Automatic security checks
- ✅ Cryptographic verification
- ✅ Clear risk assessment

Would you like to set up MCP server first? (recommended)
1. Yes, guide me through setup (5-10 min)
2. No, continue with manual verification
3. Learn more about MCP server"

User: "1"

LLM: "Great! Let's set up the MCP server..."
     *Executes setup-dossier-mcp.ds.md*
     ...
LLM: "✅ Setup complete! Now let's execute deploy-to-aws.ds.md
     with automatic security verification..."
     *Calls verify_dossier() → SUCCESS*
```

#### Example 2: Bootstrap Dossier (Setup Itself)

```
User: "run examples/setup/setup-dossier-mcp.ds.md"

LLM: *Attempts verify_dossier() → fails*
     *Reads dossier frontmatter*
     *Sees: mcp_integration.required: false (bootstrap pattern)*

LLM: *Proceeds in manual_execution mode*
     "This dossier will set up the MCP server for future use.

     Let's start by checking prerequisites..."

     *Guides through setup without needing MCP*
     *User completes configuration*

     "✅ Setup complete! Verifying MCP server is working..."
     *Calls list_dossiers() → SUCCESS*

     "Perfect! MCP server is now configured. All future dossiers
     can use automatic verification."
```

#### Example 3: Low-Risk Dossier, Optional MCP

```
User: "run examples/development/setup-react-library.ds.md"

LLM: *Attempts verify_dossier() → fails*
     *Reads dossier frontmatter*
     *Sees: mcp_integration.required: false, risk_level: medium*

LLM: "This dossier can work without the MCP server, but would benefit
     from automatic verification.

     Quick setup available (5 min) or continue as-is?

     1. Set up MCP server (recommended for future dossiers too)
     2. Continue without MCP

     Your choice?"
```

---

### MCP Tools Reference

When MCP server is available, use these tools:

#### `verify_dossier`
```typescript
const result = await tools.verify_dossier({
  path: "path/to/dossier.ds.md",
  trusted_keys_path: "~/.dossier/trusted-keys.txt" // optional
});

// result contains:
// - integrity: { status, message, expectedHash, actualHash }
// - authenticity: { status, message, signer, isTrusted }
// - riskAssessment: { riskLevel, riskFactors, destructiveOperations }
// - recommendation: "ALLOW" | "WARN" | "BLOCK"
```

#### `read_dossier`
```typescript
const dossier = await tools.read_dossier({
  path: "path/to/dossier.ds.md"
});

// dossier contains:
// - metadata: { title, version, status, risk_level, ... }
// - frontmatter: { ... full frontmatter }
// - body: "markdown content"
```

#### `list_dossiers`
```typescript
const result = await tools.list_dossiers({
  path: "./examples",  // optional, default: cwd
  recursive: true      // optional, default: true
});

// result contains:
// - dossiers: [{ name, path, version, status, objective, riskLevel }]
// - scannedPath: string
// - count: number
```

#### Resources

```typescript
// Access protocol documentation
const protocol = await resources.read("dossier://protocol");

// Access security architecture
const security = await resources.read("dossier://security");

// Access dossier concept introduction
const concept = await resources.read("dossier://concept");
```

---

### Best Practices

#### For LLM Agents

1. **Always check MCP availability first** - Try calling a tool before assuming it's not available
2. **Read mcp_integration metadata** - Respect the dossier's fallback preferences
3. **Be helpful about setup** - Offer guided setup, don't just say "not available"
4. **Respect user choice** - If they decline MCP, proceed with fallback gracefully
5. **Use MCP when available** - Don't fall back to manual if MCP is working

#### For Dossier Authors

1. **Default to `required: false`** - Most dossiers can work without MCP
2. **Use `manual_execution` fallback** - Provides best user experience
3. **Document MCP benefits** - Help users understand value of setup
4. **Test without MCP** - Ensure fallback mode actually works
5. **Only use `error` fallback** - When truly impossible to execute without MCP

---

## 📋 Standard Execution Guidelines

### General Principles

1. **Transparency**: Show what you're doing at each step
2. **Safety**: Validate before destructive operations
3. **Clarity**: Clear success/failure messages
4. **Adaptability**: Handle edge cases gracefully
5. **User agency**: Ask before making significant decisions

### Execution Flow

**Standard dossier execution sequence**:

1. **🔒 Security verification** (REQUIRED - see Security Verification Protocol above)
   - Verify checksum (integrity)
   - Verify signature (authenticity) if present
   - Assess risk level
   - Request approval if required
2. **🔄 Self-improvement check** (optional, see Self-Improvement Protocol above)
3. **📋 Read prerequisites**: Validate all prerequisites met
4. **🔍 Gather context**: Analyze project before making decisions
5. **📝 Present plan**: Show user what will happen
6. **⚙️  Execute actions**: Perform operations with progress updates
7. **✅ Validate results**: Verify success criteria met
8. **📊 Report outcome**: Clear summary of what was done
9. **➡️  Next steps**: Guide user on what to do next

### Context Gathering Best Practices

**Always gather context before acting**:
- Scan directory structure
- Check for existing files (avoid conflicts)
- Detect tech stack and tools
- Verify git status
- Understand project type
- Note any unusual patterns

**Report what you found**:
```
📊 Context Gathered:
  Project Type: Multi-repo
  Repos: backend/ (Node.js), frontend/ (React)
  Git Status: Clean
  Existing Dossiers: None
```

### Decision Making

**When making decisions**:
- Explain reasoning clearly
- Present options when multiple paths exist
- Recommend default but allow override
- Document why recommendation is best for this context

**Format**:
```
**Decision Point**: Which template to use?

**Options**:
  A. Single-repo template (best for: simple APIs, libraries)
  B. Multi-repo template (best for: backend + frontend)
  C. Monorepo template (best for: Nx/Turbo workspaces)

**Detected**: Multiple repos found (backend/, frontend/)
**Recommendation**: Multi-repo template (option B)

**Proceeding with**: [wait for user or use recommendation]
```

---

## 🎨 Output Format Standards

### Emojis/Icons

**Use consistently across all dossiers**:
- ✅ Success / completed step
- ❌ Error / failed operation
- ⚠️ Warning / requires attention
- ℹ️ Information / FYI
- 🔄 Self-improvement / suggestion
- 📊 Status / summary
- 📁 Directory / folder operation
- 📦 Repository / package
- 🔀 Git branch operation
- 💾 File operation (write/copy)
- 🧹 Cleanup / removal
- 🚀 Start / launch
- ⏸️ Pause / stash
- 🎉 Complete / celebration
- 🎯 Dossier branding

### Progress Reporting

**Show clear progress**:
```
Step 1/5: Detecting project structure...
  ✓ Found 2 git repositories
  ✓ Detected: Multi-repo

Step 2/5: Copying templates...
  ✓ Copied .ai-project.json
  ✓ Copied AI_GUIDE.md
  ...
```

### Summary Format

**Always end with clear summary**:
```
=========================
✅ [Dossier Name] Complete!

📊 Summary:
  - Created: 5 files
  - Modified: 2 files
  - Repos configured: 3

📝 Next Steps:
  1. [Action user should take]
  2. [Another action]

💡 Tip: [Helpful suggestion]
```

---

## 💾 Safety Guidelines

### Always Create Backups

**Before destructive operations**:
```bash
# Backup files before overwriting
cp file.json file.json.backup

# Create git backup branch
git checkout -b backup-before-dossier
git checkout -

# Document backup location
echo "✓ Backup created: file.json.backup"
```

### Confirm Destructive Operations

**Before deleting/overwriting**:
```
⚠️ About to delete:
  - .worktrees/feature-x/
  - 3 files, 127 KB

Continue? (y/N)
```

**Always**:
- Show exactly what will be affected
- Explain consequences
- Provide alternative options
- Allow user to abort

### Check for Uncommitted Changes

**Before modifying git-tracked files**:
```bash
git status --short
# If output not empty: warn user
```

**Pattern**:
```
⚠️ Uncommitted changes detected:
  M src/file.ts
  ?? new-file.ts

Options:
  1. Commit changes first (recommended)
  2. Stash changes
  3. Continue anyway (may cause conflicts)
  4. Abort

What would you like to do?
```

### Validate Permissions

**Before file operations**:
```bash
# Check write permission
if [ ! -w "." ]; then
  echo "❌ No write permission in current directory"
  exit 1
fi
```

### Provide Rollback Instructions

**Always explain how to undo**:
```
If something goes wrong:
  1. Restore from backup: cp file.json.backup file.json
  2. Or use git: git checkout backup-before-dossier
  3. Or rollback: Use appropriate rollback procedures for your project
```

---

## ✅ Validation Patterns

### File Existence Validation

**Standard pattern**:
```bash
# Check file exists
if [ ! -f ".ai-project.json" ]; then
  echo "❌ Required file not found: .ai-project.json"
  exit 1
fi

echo "✓ Found: .ai-project.json"
```

### JSON Validation

**Standard pattern**:
```bash
# Validate JSON syntax (try multiple parsers)
if cat .ai-project.json | python3 -c "import json,sys; json.load(sys.stdin)" 2>/dev/null; then
  echo "✓ Valid JSON"
elif cat .ai-project.json | node -e "JSON.parse(require('fs').readFileSync('/dev/stdin'))" 2>/dev/null; then
  echo "✓ Valid JSON"
else
  echo "❌ Invalid JSON in .ai-project.json"
  exit 1
fi
```

### Git Status Validation

**Standard pattern**:
```bash
# Check if git repo
if ! git rev-parse --git-dir > /dev/null 2>&1; then
  echo "❌ Not a git repository"
  exit 1
fi

echo "✓ Git repository detected"

# Check branch
branch=$(git branch --show-current)
echo "✓ Current branch: $branch"
```

### Success Criteria Format

**Standard checklist**:
```markdown
## Success Criteria

1. ✅ [Criterion 1 - specific and measurable]
2. ✅ [Criterion 2 - verifiable]
3. ✅ [Criterion 3 - clear pass/fail]

**Verification**:
```bash
# Commands to verify each criterion
ls .ai-project.json  # Criterion 1
npm run task:list    # Criterion 2
git status           # Criterion 3
```
```

---

## 🤖 Automatic Dossier Detection for LLM Agents

### When User References a `.ds.md` File

**If user says**: "run path/to/file.ds.md" or any reference to a `.ds.md` file

**You MUST automatically perform security verification** (before any user interaction):

1. **Verify integrity**: Check checksum in frontmatter
   - Calculate SHA256 of dossier content (after `---` closing frontmatter)
   - Compare with frontmatter `checksum.hash`
   - If mismatch → **BLOCK EXECUTION**, report to user
   - Never skip this step

2. **Verify authenticity**: Check signature if present
   - Verify signature using public_key
   - Check if key is in `~/.dossier/trusted-keys.txt`
   - If invalid → **BLOCK EXECUTION**, report to user
   - If unsigned → Note this in security report

3. **Assess risk**: Read risk_level from frontmatter
   - Extract `risk_level`, `risk_factors`, `destructive_operations`
   - Prepare security summary for user

4. **Report findings**: Show complete security summary
   - Integrity status (checksum match/mismatch)
   - Authenticity status (signed/unsigned/trusted)
   - Risk level and factors
   - What the dossier will do (destructive operations)

5. **Request approval** (based on risk level):
   - **high/critical** → ALWAYS require explicit approval
   - **medium** → Require if unsigned OR `requires_approval: true`
   - **low** → Proceed unless `requires_approval: true`

6. **Execute**: If approved, follow the dossier's instructions
   - Dossier may have its own internal safety checks
   - Dossier may interact with user for decisions
   - Follow the dossier's workflow exactly

**Critical Rules**:
- ✅ Steps 1-4 are AUTOMATIC - user cannot skip them
- ✅ User involvement starts at step 5 (approval decision)
- ✅ Security checks happen BEFORE any execution
- ❌ Never skip checksum verification
- ❌ Never execute without risk assessment
- ❌ Never bypass security even if user says "just run it"

**Example user inputs that trigger this**:
- "run examples/development/add-git-worktree-support.ds.md"
- "execute the worktree dossier"
- "use add-git-worktree-support.ds.md on this project"

---

## 🤖 LLM Execution Notes

### For AI Agents Executing Dossiers

**You should**:
- ✅ Read PROTOCOL.md before first execution (understand guidelines)
- ✅ Perform self-improvement analysis (unless user skips)
- ✅ Show progress at each step
- ✅ Validate prerequisites before proceeding
- ✅ Ask clarifying questions when ambiguous
- ✅ Explain your decisions and reasoning
- ✅ Handle errors gracefully with clear messages
- ✅ Verify success criteria at end
- ✅ Provide actionable next steps

**You should NOT**:
- ❌ Assume context without gathering
- ❌ Make destructive changes without confirmation
- ❌ Skip validation steps
- ❌ Proceed if prerequisites not met
- ❌ Hide errors or failures
- ❌ Leave project in broken state
- ❌ Forget to explain what you did

### Error Handling

**When operations fail**:
```
❌ Error: [What failed]

**Context**: [What you were trying to do]
**Cause**: [Why it failed]

**Solutions**:
  1. [First thing to try]
  2. [If that doesn't work]
  3. [Escalation path]

**Current state**: [What's the project state now]
**Safe to retry**: [Yes/No]
```

### Progress Updates

**For long operations, show progress**:
```
📦 Installing dependencies...
  ✓ Backend: 247 packages installed (2.3s)
  ✓ Frontend: 189 packages installed (1.8s)
  ⏳ Shared: Installing... (15/32)
```

---

## 📚 Protocol Version History

### v1.0 (2025-01-05) - Initial Release

**Introduced**:
- Self-improvement protocol
- Standard execution guidelines
- Output format standards
- Validation patterns
- Safety guidelines
- LLM execution notes

**Compatible dossiers**: All dossiers v1.0

---

### Future Versions

**v1.1** (Planned - Minor update):
- Enhanced troubleshooting patterns
- Additional validation checks
- Improved error messages
- **Backwards compatible** with v1.0 dossiers

**v2.0** (Planned - Breaking changes):
- TBD based on learnings
- Will require dossier updates
- Separate protocol file for compatibility

---

## 🎯 Using This Protocol

### For Dossier Operators (Dossier Authors)

**When creating new dossiers**:
1. Use `dossiers/templates/dossier-template.md`
2. **Name files with `.ds.md` extension** (e.g., `setup-project.ds.md`)
3. Reference protocol version in header
4. Follow guidelines in this protocol
5. Don't duplicate what's in protocol

**When updating existing dossiers**:
1. Add protocol version header if missing
2. Rename to use `.ds.md` extension for clarity
3. Optionally refactor to align with protocol
4. Document any protocol deviations

**Naming Convention**: All dossier files should use `.ds.md` extension to clearly identify them as dossiers (not regular documentation).

### For Dossier Citizens (Dossier Users)

**When using dossiers**:
1. Your AI agent reads this protocol automatically
2. Self-improvement suggestions are optional
3. You can skip improvement check with "just execute"
4. Protocol ensures consistent safe execution

### For LLM Agents

**When executing dossiers**:
1. Check protocol version in dossier header
2. Read corresponding `PROTOCOL.md` version
3. Follow all guidelines in this document
4. Perform self-improvement analysis (unless skipped)
5. Execute dossier-specific instructions
6. Validate according to protocol standards

---

## 🔧 Extending the Protocol

### Contributing Improvements

**To suggest protocol improvements**:
1. Open issue on the dossier protocol repository
2. Describe improvement and rationale
3. Show impact on existing dossiers
4. Propose version bump (minor vs major)

**For breaking changes**:
- Must increment to v2.0
- Create `PROTOCOL-v2.md`
- Document migration path
- Maintain v1.0 for backwards compatibility

### Custom Protocol Extensions

**Projects can create local protocol extensions**:
```markdown
# project/.dossier/LOCAL_PROTOCOL.md

**Extends**: Dossier PROTOCOL.md v1.0

**Additional guidelines for this project**:
- [Project-specific rules]
- [Team conventions]
- [Custom validation]
```

Reference in project's dossiers:
```markdown
**Protocol**: Dossier v1.0 + LOCAL v1.0
```

---

## 📖 Examples

### Example 1: Self-Improvement in Action

**User runs**:
```
"Use project-init dossier to set up this directory"
```

**LLM with protocol**:
```
[Reads project-init.md]
[Sees: Protocol Version 1.0]
[Reads PROTOCOL.md]
[Performs self-improvement analysis]

🔄 Dossier Improvement Suggestion

**Dossier**: project-init.md

**Context**: Your project has Python virtual environment (venv/)
but current dossier doesn't check for it.

**Improvement Identified**:
Add Python venv detection to "Context to Gather"

**Why needed**: Python projects need venv activation check
**Benefit**: Prevents pip install failures, better Python support

**Proposed Addition**:
In "Context to Gather" section, add:
---
### Python Virtual Environment
```bash
if [ -d "venv" ] || [ -d ".venv" ]; then
  echo "✓ Virtual environment detected"
  # Note: User should activate venv before dependency install
fi
```
---

**Should I update the dossier before executing? (y/N)**

[User: "yes"]

✓ Updated project-init.md with Python venv detection
✓ Proceeding with improved version...

[Executes project-init with enhancement]
```

### Example 2: Protocol Ensures Safety

**Dossier about to delete files**:
```
[Following protocol safety guidelines]

⚠️ About to remove:
  📂 .worktrees/feature-x/ (3 repos, 1.2 MB)

Checking for uncommitted changes... [per protocol]
  ✓ Backend: Clean
  ✓ Frontend: Clean
  ⚠️ Shared: 2 uncommitted files

❌ Cleanup aborted - uncommitted changes detected [per protocol]

Options: [per protocol]
  1. Commit changes first
  2. Stash changes
  3. Force remove (DATA LOSS)

What would you like to do?
```

---

## 🔄 Protocol Versioning

### Version Numbers

**Format**: MAJOR.MINOR.PATCH (semver)

**Examples**:
- `1.0.0` - Initial stable release
- `1.1.0` - Added new guideline (compatible)
- `1.0.1` - Fixed typo (compatible)
- `2.0.0` - Breaking change (incompatible)

### Compatibility

**Dossiers specify protocol version**:
```markdown
**Protocol Version**: 1.0
```

**Meaning**:
- Works with protocol v1.0.0 through v1.x.x
- May not work with v2.0.0+ (breaking changes)

**When protocol updates**:
- **Minor/Patch (1.0 → 1.1)**: All dossiers benefit automatically
- **Major (1.x → 2.0)**: Dossiers must be updated explicitly

---

## 🚀 Best Practices

### For Dossier Authors

1. ✅ Reference protocol version clearly
2. ✅ Don't duplicate protocol content
3. ✅ Focus on dossier-unique logic
4. ✅ Follow output format standards
5. ✅ Include examples
6. ✅ Test self-improvement suggestions

### For LLM Execution

1. ✅ Read protocol before first execution
2. ✅ Apply self-improvement analysis
3. ✅ Follow safety guidelines
4. ✅ Use standard output formats
5. ✅ Validate thoroughly
6. ✅ Report clearly

### For Users

1. ✅ Trust the self-improvement suggestions
2. ✅ Provide feedback when protocol fails
3. ✅ Skip improvements when in a hurry (that's okay!)
4. ✅ Report protocol violations in dossiers

---

## 📞 Support

### Protocol Issues

**If protocol seems wrong or insufficient**:
- Open GitHub issue
- Describe scenario where protocol failed
- Suggest improvement
- Tag as `protocol-improvement`

### Dossier Not Following Protocol

**If a dossier violates protocol**:
- Open GitHub issue
- Reference protocol section violated
- Suggest fix
- Tag as `protocol-violation`

---

**🎯 Dossier Execution Protocol v1.0**

> "Structure your agents. Not your scripts."

*This protocol ensures dossiers are safe, consistent, and continuously improving.*
