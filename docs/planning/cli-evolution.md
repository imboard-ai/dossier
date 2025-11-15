# CLI Evolution Planning

Planning document for redesigning the Dossier CLI from single-purpose `dossier-verify` to multi-command `dossier` CLI.

## Status Overview

**Current Version**: v0.2.0
**Released**: 2025-11-15
**Status**: ✅ CLI Structure Implemented, 📋 Commands In Development

### Implementation Progress

| Phase | Status | Completion |
|-------|--------|------------|
| Phase 1: MVP | 🚧 In Progress | 25% |
| Phase 2: Enhanced Authoring | 📋 Planned | 0% |
| Phase 3: Advanced Features | 📋 Planned | 0% |

### Command Status

| Command | Status | Version | Priority |
|---------|--------|---------|----------|
| `verify` | ✅ Done | v0.2.0 | P0 |
| `run` | 📋 Planned | - | P0 |
| `create` | 📋 Planned | - | P1 |
| `list` | 📋 Planned | - | P1 |
| `sign` | 📋 Planned | - | P2 |
| `publish` | 📋 Planned | - | P2 |
| `checksum` | 📋 Planned | - | P2 |
| `validate` | 📋 Planned | - | P2 |
| `init` | 📋 Planned | - | P3 |
| `info` | 📋 Planned | - | P3 |

---

## Evolution History

### v0.2.0 - Multi-Command Structure ✅ (2025-11-15)

**What Changed**:
- ✅ Added commander.js CLI framework
- ✅ Implemented subcommand architecture
- ✅ Created 10 command placeholders with helpful TBD messages
- ✅ Migrated `verify` to new structure
- ✅ Removed `dossier-verify` standalone command (breaking change)
- ✅ Updated package scope to `@imboard-ai/*`

**Command**: `dossier <command>`

```bash
dossier verify <file|url> [--verbose]
dossier run <file|url>    # TBD
dossier create [file]     # TBD
# ... 7 more commands
```

### v0.1.x - Single-Purpose Verification (Legacy)

**Command**: `dossier-verify`

```bash
dossier-verify <file|url> [--verbose] [--help]
```

**Functionality**:
- Verify checksum integrity
- Verify signatures (basic)
- Risk assessment
- Exit codes (0=safe, 1=unsafe, 2=error)

**Limitations** (Resolved in v0.2.0):
- ❌ Single-purpose: Only verification, no creation or execution
- ❌ Poor naming: "verify" doesn't reflect full capabilities
- ❌ Not extensible: Hard to add new features
- ❌ Limited workflow: Can't create, sign, or execute dossiers
- ❌ No discovery: Can't list or search available dossiers

---

## User Jobs-to-be-Done Analysis

### 1. Dossier Authors (Creating Content)

**Jobs**:
- Create a new dossier from scratch
- Create from a template
- Calculate and add checksum automatically
- Sign with their key (Minisign or AWS KMS)
- Validate format before publishing
- **Share dossier with community** (like `docker push`)
- Publish to registry for discoverability

**Pain Points**:
- Manual checksum calculation is error-prone
- Signing requires external tools
- No way to validate before sharing
- **No easy way to share dossiers publicly**
- **No central registry for discovery**

### 2. Dossier Users (Consuming Content)

**Jobs**:
- **Discover dossiers in public registry** (like Docker Hub)
- **Install dossiers from registry by ID** (like `npm install`)
- Verify dossier before execution (security)
- Execute verified dossier with AI agent
- List available dossiers in directory/registry
- Download dossiers from URLs
- View metadata without full execution

**Pain Points**:
- Verification and execution are separate steps
- No built-in execution workflow
- **Hard to discover available dossiers**
- **No way to install from registry by ID**
- **Must manually download and save files**

### 3. Security-Conscious Users

**Jobs**:
- Verify checksums and signatures
- Audit dossier before trusting
- Check against specification schema
- Review dossier execution history

**Pain Points**:
- Limited audit trail
- No comprehensive security analysis
- Can't track dossier provenance

### 4. Developers/Integrators

**Jobs**:
- Initialize dossier projects quickly
- Validate against spec during development
- Generate documentation from dossiers
- Export to other formats (JSON, YAML)
- Integrate with CI/CD pipelines

**Pain Points**:
- No scaffolding tools
- Manual schema validation
- No automation for common tasks

---

## Proposed CLI Structure

### Modern Convention: Subcommands

Following patterns from `git`, `docker`, `npm`, `gh`:

```bash
dossier <command> [arguments] [options]

# Examples:
dossier run deploy-aws.ds.md
dossier create my-deployment.ds.md
dossier verify https://example.com/dossier.ds.md
dossier list ./dossiers
```

### Why Subcommands?

✅ **Discoverable**: `dossier --help` shows all commands
✅ **Extensible**: Easy to add new commands
✅ **Clear**: Each command has clear purpose
✅ **Standard**: Matches user expectations from git, npm, etc.
✅ **Context-aware**: Each command can have its own options

---

## Core Commands Specification

### 1. `dossier run` (Primary Command)

**Purpose**: Verify, audit, and execute dossier in one step

**Syntax**:
```bash
dossier run <file|url> [options]
```

**Workflow**:
```
1. Download/read dossier
   ↓
2. Verify checksum (FAIL if invalid)
   ↓
3. Verify signature (FAIL if present but invalid)
   ↓
4. Risk assessment
   ↓
5. Log audit trail
   ↓
6. Prompt user if high-risk
   ↓
7. Execute via LLM
```

**Options**:
```bash
--llm <name>           # LLM to use: claude-code, cursor, auto (default)
--audit-server <url>   # Audit log endpoint (future)
--dry-run              # Verify and show plan, don't execute
--force                # Skip risk warnings (not verification)
--no-prompt            # Don't ask for confirmation
--verbose              # Detailed output
--quiet                # Minimal output
```

**Examples**:
```bash
# Basic run (auto-detect LLM)
dossier run deploy-aws.ds.md

# With specific LLM
dossier run setup-project.ds.md --llm claude-code

# Dry run (safety check)
dossier run risky-operation.ds.md --dry-run

# CI/CD usage
dossier run ci-deploy.ds.md --no-prompt --force
```

**Exit Codes**:
- `0` - Verification passed, execution completed
- `1` - Verification failed (checksum/signature)
- `2` - Execution error
- `3` - User cancelled

**Security Rules**:
- ❌ CANNOT skip checksum verification
- ❌ CANNOT skip signature verification (if present)
- ✅ CAN skip risk warnings with `--force`
- ✅ CAN skip user prompts with `--no-prompt`

### 2. `dossier verify` (Security Command)

**Purpose**: Verify integrity and authenticity WITHOUT executing

**Syntax**:
```bash
dossier verify <file|url> [options]
```

**Use Cases**:
- Security review before deciding to execute
- Batch verification of multiple dossiers
- CI/CD checks without execution
- Manual audit workflows

**Options**:
```bash
--verbose              # Show detailed verification steps
--json                 # Output results as JSON
--exit-code-only       # Silent mode (use exit code only)
```

**Examples**:
```bash
# Interactive verification
dossier verify deploy-aws.ds.md

# Scripting (JSON output)
dossier verify deploy-aws.ds.md --json > results.json

# Batch verification
for f in dossiers/*.ds.md; do
  dossier verify "$f" --exit-code-only && echo "✅ $f"
done
```

**Output**:
```
🔐 Dossier Verification Tool

📊 Integrity Check:
✅ Checksum VALID

🔏 Authenticity Check:
⚠️  No signature present

🔴 Risk Assessment:
   Risk Level: MEDIUM

Recommendation: ALLOW (with caution)
```

### 3. `dossier create` (Authoring Command)

**Purpose**: Create new dossier with proper structure

**Syntax**:
```bash
dossier create [file] [options]
```

**Options**:
```bash
--template <name>      # Use template (basic, devops, data-science, etc.)
--interactive          # Guided creation with prompts
--title <title>        # Dossier title
--risk <level>         # Risk level (low/medium/high/critical)
--checksum             # Auto-calculate checksum
--sign                 # Sign after creation
```

**Examples**:
```bash
# Interactive mode (guided)
dossier create

# From template
dossier create deploy-prod.ds.md --template devops

# With metadata
dossier create setup.ds.md --title "Setup Project" --risk medium

# Create and sign in one step
dossier create deploy.ds.md --template devops --sign
```

**Workflow**:
```
1. Prompt for metadata (or use flags)
2. Create file with frontmatter
3. Open in $EDITOR or show next steps
4. Calculate checksum (if --checksum)
5. Sign (if --sign)
```

**Output File**:
```markdown
---
title: Deploy to AWS
version: "1.0.0"
risk_level: medium
checksum: sha256:abc123...
created: 2025-11-15T18:00:00Z
---

# Deploy to AWS

## Objective
[Your objective here]

## Steps
1. [Your steps here]

## Validation
- [ ] Deployment successful
```

### 4. `dossier list` (Discovery Command)

**Purpose**: Discover available dossiers

**Syntax**:
```bash
dossier list [directory|registry] [options]
```

**Options**:
```bash
--recursive            # Search subdirectories
--verified-only        # Only show verified dossiers
--risk <level>         # Filter by risk level
--signed-only          # Only show signed dossiers
--format <fmt>         # Output format (table, json, simple)
```

**Examples**:
```bash
# List in current directory
dossier list

# List in specific directory
dossier list ./dossiers

# Recursive search
dossier list ./projects --recursive

# Filter by risk
dossier list --risk low --verified-only

# JSON output for tooling
dossier list --format json
```

**Output**:
```
Found 5 dossiers:

TITLE                    FILE                     RISK     SIGNED  STATUS
Deploy to AWS            deploy-aws.ds.md         MEDIUM   ⚠️      ✅
Setup React Library      setup-react.ds.md        LOW      ✅      ✅
Train ML Model           train-ml.ds.md          MEDIUM   ⚠️      ✅
Database Migration       migrate-db.ds.md         HIGH     ✅      ✅
Critical Deployment      critical-deploy.ds.md    CRITICAL ✅      ✅
```

---

## Additional Commands (Phase 2+)

### `dossier sign`

```bash
dossier sign <file> [options]

Options:
  --key <path>           # Path to signing key
  --method <type>        # minisign, kms
  --output <file>        # Output signed dossier
```

**Use Cases**:
- Sign dossiers before sharing
- Re-sign after updates
- Add signature to unsigned dossiers

### `dossier publish` (aka `share`)

```bash
dossier publish <file> [options]

Options:
  --registry <url>       # Registry URL (default: public registry)
  --name <name>          # Custom name in registry
  --tags <tags>          # Comma-separated tags
  --private              # Private publication (auth required)
```

**Purpose**: Share dossier with community via registry (like `docker push`)

**Workflow**:
```
1. Validate dossier format
   ↓
2. Verify checksum present
   ↓
3. Prompt to sign if unsigned
   ↓
4. Upload to registry
   ↓
5. Return GUID + public URL
```

**MVP Implementation**:
```bash
$ dossier publish deploy-aws.ds.md

🔐 Validating dossier...
✅ Format valid
✅ Checksum present
⚠️  Dossier is unsigned. Sign it? [y/N]: n

📦 Publishing to registry...
✅ Published successfully!

Registry ID:  dsr-7f3a9b2c-4d1e-4a5f-8c6b-9e2d1a3b4c5d
Public URL:   https://registry.dossier.ai/dsr-7f3a9b2c
Install:      dossier run dsr-7f3a9b2c

[MVP: Just prints this message, no actual upload yet]
```

**Future: Actual Registry Integration**:
```bash
POST https://registry.dossier.ai/v1/dossiers

Body:
{
  "dossier": {
    "title": "Deploy to AWS",
    "version": "1.0.0",
    "content": "...",
    "checksum": "sha256:...",
    "signature": "minisign:..."
  },
  "metadata": {
    "author": "yuvaldim",
    "tags": ["devops", "aws", "deployment"],
    "visibility": "public"
  }
}

Response:
{
  "id": "dsr-7f3a9b2c-4d1e-4a5f-8c6b-9e2d1a3b4c5d",
  "url": "https://registry.dossier.ai/dsr-7f3a9b2c",
  "shortId": "dsr-7f3a9b2c"
}
```

**Use Cases**:
- Share dossiers with community
- Publish to private team registry
- Version control for dossiers
- Track dossier usage/downloads
- Enable discovery via search

**Related Commands**:
```bash
dossier search devops          # Find published dossiers
dossier install dsr-7f3a9b2c   # Download from registry
dossier unpublish <id>         # Remove from registry
```

### `dossier info`

```bash
dossier info <file|url> [options]

Options:
  --json                 # JSON output
  --short                # Brief summary only
```

**Output**:
```
Title:          Deploy to AWS
Version:        1.0.0
Risk Level:     MEDIUM
Checksum:       sha256:abc123...
Signature:      ⚠️ Unsigned
Created:        2025-11-15
Last Modified:  2025-11-15
File Size:      2.4 KB
```

### `dossier init`

```bash
dossier init [project-name] [options]

Options:
  --template <name>      # Project template
  --git                  # Initialize git repo
```

**Creates**:
```
my-project/
├── dossiers/
│   ├── setup.ds.md
│   └── deploy.ds.md
├── .dossier/
│   ├── config.json
│   └── trusted-keys.txt
└── README.md
```

### `dossier validate`

```bash
dossier validate <file> [options]

Options:
  --schema <file>        # Custom schema
  --fix                  # Auto-fix issues
```

**Checks**:
- Valid YAML frontmatter
- Required fields present
- Checksum format correct
- Signature format valid
- Risk level valid
- Spec version compatibility

### `dossier checksum`

```bash
dossier checksum <file> [options]

Options:
  --update               # Update checksum in file
  --verify               # Just verify, don't update
```

**Use Cases**:
- Update checksum after editing
- Quick integrity check
- Pre-signing validation

---

## Audit Logging Design

### MVP (Phase 1): Console Output

**Purpose**: Show that audit logging happens (build trust)

**Implementation**:
```javascript
function logAudit(dossier, user, action) {
  console.log(`
📝 AUDIT LOG
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Timestamp:    ${new Date().toISOString()}
Dossier:      ${dossier.metadata.title}
File:         ${dossier.path}
Checksum:     ${dossier.checksumValid ? '✅ VALID' : '❌ INVALID'}
Signature:    ${dossier.signatureStatus}
Risk Level:   ${dossier.metadata.risk_level}
User:         ${user}
Executed By:  ${llm}
Action:       ${action}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[In production, this log would be sent to audit server]
  `.trim());
}
```

### Future (Phase 2): Remote Audit Server

**API Endpoint**:
```bash
POST https://audit.dossier.ai/v1/logs

Body:
{
  "timestamp": "2025-11-15T18:00:00Z",
  "dossier": {
    "title": "Deploy to AWS",
    "version": "1.0.0",
    "file": "deploy-aws.ds.md",
    "checksum": "sha256:abc123...",
    "signature": "minisign:xyz789..."
  },
  "verification": {
    "checksum": "valid",
    "signature": "unsigned",
    "risk_level": "medium"
  },
  "execution": {
    "user": "yuvaldim@localhost",
    "llm": "claude-code",
    "action": "run",
    "status": "started"
  }
}
```

**Privacy Considerations**:
- Hash user identifiers
- Don't send dossier content
- Only send metadata and verification results
- Allow opt-out via `--no-audit`

---

## LLM Integration Strategy

### Auto-Detection (`--llm auto`)

**Detection Order**:
```
1. Check for Claude Code in PATH
   → command -v claude-code

2. Check for Cursor in PATH
   → command -v cursor

3. Check for GitHub Copilot CLI
   → command -v gh copilot

4. Check environment variables
   → $DOSSIER_LLM

5. Fail with helpful message
   → "No LLM detected. Install Claude Code or use --llm <name>"
```

### Execution Methods

**Claude Code**:
```bash
claude-code "Execute the verified dossier at ${file}"
```

**Cursor**:
```bash
cursor "${file}"
# or
cursor --execute-dossier "${file}"
```

**GitHub Copilot**:
```bash
gh copilot execute "${file}"
```

**Generic / Fallback**:
```bash
# Copy to clipboard + show instruction
echo "📋 Dossier copied to clipboard"
echo "Paste this into your LLM:"
echo ""
cat "${file}"
```

### Configuration File

**`~/.dossier/config.json`**:
```json
{
  "defaultLLM": "claude-code",
  "llmPaths": {
    "claude-code": "/usr/local/bin/claude-code",
    "cursor": "/Applications/Cursor.app/Contents/MacOS/cursor"
  },
  "auditServer": "https://audit.company.com",
  "enableAudit": true,
  "trustedKeys": "~/.dossier/trusted-keys.txt"
}
```

---

## Security Model for `run` Command

### Verification Rules (Cannot Be Bypassed)

**ALWAYS FAIL if**:
- ❌ Checksum is invalid (content tampered)
- ❌ Signature present but invalid (bad signature)
- ❌ Critical risk without signature

**ALWAYS WARN if** (can proceed with `--force`):
- ⚠️ No signature (unsigned dossier)
- ⚠️ High risk level
- ⚠️ Unknown/untrusted key

**ALWAYS LOG**:
- 📝 Every execution attempt
- 📝 Verification results
- 📝 User decision (proceed/cancel)

### Risk-Based Behavior

```
Risk: LOW
  → No signature: ALLOW (no prompt)
  → Signed: ALLOW

Risk: MEDIUM
  → No signature: PROMPT ("Proceed? [y/N]")
  → Signed: ALLOW

Risk: HIGH
  → No signature: BLOCK
  → Signed + trusted: ALLOW
  → Signed + unknown: PROMPT with strong warning

Risk: CRITICAL
  → No signature: BLOCK (hard)
  → Signed + trusted: PROMPT
  → Signed + unknown: BLOCK
```

### Example Flows

**Safe dossier (low risk, signed)**:
```bash
$ dossier run setup.ds.md

🔐 Verifying...
✅ Checksum valid
✅ Signed by: trusted-author@example.com
📊 Risk: LOW
📝 Audit logged
🤖 Executing with Claude Code...
```

**Unsigned medium-risk dossier**:
```bash
$ dossier run deploy.ds.md

🔐 Verifying...
✅ Checksum valid
⚠️  No signature
📊 Risk: MEDIUM

Proceed with unsigned dossier? [y/N]:
```

**Tampered dossier (checksum fail)**:
```bash
$ dossier run malicious.ds.md

🔐 Verifying...
❌ Checksum INVALID
📊 Content has been tampered with

❌ BLOCKED
   This dossier failed security verification.
   Do NOT execute.

Exit code: 1
```

---

## Implementation Phases

### Phase 1: MVP (Core Commands) 🚧 25% Complete

**Timeline**: 1-2 weeks
**Status**: In Progress

**Infrastructure** ✅:
- [x] Subcommand architecture (commander.js)
- [x] Help system with all commands
- [x] Package publishing to GitHub Packages
- [x] Automated workflow with version detection
- [x] Documentation restructure

**Commands**:
1. ✅ `dossier verify` - Done (v0.2.0) - Just verification
2. 📋 `dossier run` - Planned - Verify + audit + execute
3. 📋 `dossier create` - Planned - Basic creation (no templates)
4. 📋 `dossier list` - Planned - Simple file discovery

**Features**:
- [x] Subcommand architecture
- [ ] Auto-detect LLM (claude-code, cursor)
- [ ] Console audit logging (print to stdout)
- [ ] Basic error handling
- [x] Helpful TBD messages for unimplemented commands

**Deliverables**:
- [x] Refactored CLI codebase structure
- [x] Updated documentation
- [x] Migration from `dossier-verify` (removed old command)
- [ ] Test coverage
- [ ] `run` command implementation
- [ ] `create` command implementation
- [ ] `list` command implementation

### Phase 2: Enhanced Authoring 📋 0% Complete

**Timeline**: 2-3 weeks
**Status**: Planned

**Commands**:
5. 📋 `dossier sign` - Sign dossiers
6. 📋 `dossier publish` - Share to registry (MVP: print GUID only)
7. 📋 `dossier init` - Scaffold projects
8. 📋 `dossier checksum` - Checksum utilities
9. 📋 `dossier validate` - Schema validation

**Features**:
- [ ] Templates for common use cases
- [ ] Interactive creation mode
- [ ] Key management basics
- [ ] Better error messages
- [ ] **Registry publish (MVP simulation)** - Print registry ID to demonstrate workflow

**Deliverables**:
- [ ] Template library
- [ ] Signing integration
- [ ] Comprehensive examples
- [ ] **Registry publish command** (simulation with GUID generation)

### Phase 3: Advanced Features 📋 0% Complete

**Timeline**: 4-6 weeks
**Status**: Planned

**Commands**:
10. 📋 `dossier search` - Search registry for dossiers
11. 📋 `dossier install` - Download from registry by ID
12. 📋 `dossier info` - Metadata display
13. 📋 `dossier diff` - Compare dossiers
14. 📋 `dossier export` - Format conversion
15. 📋 `dossier audit` - Deep security analysis
16. 📋 `dossier unpublish` - Remove from registry

**Features**:
- [ ] Remote audit server integration
- [ ] **Full registry integration** (search, install, publish, unpublish)
- [ ] Trust management UI
- [ ] Advanced analytics
- [ ] Dossier versioning in registry
- [ ] Download statistics

**Deliverables**:
- [ ] Audit server API
- [ ] **Registry server implementation**
  - [ ] REST API for dossier storage
  - [ ] Search and discovery
  - [ ] Download tracking
  - [ ] Version management
- [ ] Trust management system
- [ ] Registry CLI commands (search, install, unpublish)

---

## Technical Architecture

### Proposed Structure

```
cli/
├── bin/
│   └── dossier              # Main entry point
├── src/
│   ├── commands/            # Command implementations
│   │   ├── run.js
│   │   ├── verify.js
│   │   ├── create.js
│   │   ├── list.js
│   │   └── index.js
│   ├── lib/                 # Shared utilities
│   │   ├── llm-detect.js
│   │   ├── audit-log.js
│   │   ├── prompt.js
│   │   └── output.js
│   ├── templates/           # Dossier templates
│   │   ├── basic.md
│   │   ├── devops.md
│   │   └── data-science.md
│   └── index.js            # CLI router
├── package.json
└── README.md
```

### Command Router

```javascript
#!/usr/bin/env node

const { program } = require('commander');
const { runCommand } = require('./src/commands/run');
const { verifyCommand } = require('./src/commands/verify');
const { createCommand } = require('./src/commands/create');
const { listCommand } = require('./src/commands/list');

program
  .name('dossier')
  .description('Dossier CLI - Automation standard for AI agents')
  .version('0.2.0');

program
  .command('run')
  .description('Verify and execute dossier')
  .argument('<file>', 'Dossier file or URL')
  .option('--llm <name>', 'LLM to use (claude-code, cursor, auto)', 'auto')
  .option('--dry-run', 'Show plan without executing')
  .option('--force', 'Skip risk warnings')
  .action(runCommand);

program
  .command('verify')
  .description('Verify dossier without executing')
  .argument('<file>', 'Dossier file or URL')
  .option('--verbose', 'Detailed output')
  .option('--json', 'JSON output')
  .action(verifyCommand);

program
  .command('create')
  .description('Create new dossier')
  .argument('[file]', 'Output file')
  .option('--template <name>', 'Use template')
  .option('--interactive', 'Guided creation')
  .action(createCommand);

program
  .command('list')
  .description('List available dossiers')
  .argument('[directory]', 'Directory to search', '.')
  .option('--recursive', 'Search subdirectories')
  .option('--verified-only', 'Only verified dossiers')
  .action(listCommand);

program.parse();
```

### Dependencies

**New**:
- `commander` - CLI framework (industry standard)
- `inquirer` - Interactive prompts
- `chalk` - Terminal colors (already using)
- `ora` - Spinners for loading states
- `clipboardy` - Clipboard integration (fallback)

**Existing**:
- `@imboard-ai/dossier-core` - Verification logic

---

## Migration Strategy

### Backward Compatibility

**Keep `dossier-verify` as alias**:
```bash
# Old command still works
dossier-verify file.ds.md

# Internally maps to:
dossier verify file.ds.md
```

**Deprecation Plan**:
1. v0.2.0 - Introduce new commands, keep `dossier-verify`
2. v0.3.0 - Add deprecation warning to `dossier-verify`
3. v1.0.0 - Remove `dossier-verify`, only `dossier verify`

### User Communication

**In package.json**:
```json
{
  "bin": {
    "dossier": "./bin/dossier",
    "dossier-verify": "./bin/dossier-verify-legacy"
  }
}
```

**Deprecation message**:
```
⚠️  DEPRECATED: dossier-verify will be removed in v1.0.0
   Use: dossier verify <file>

   Migration guide: https://github.com/imboard-ai/dossier/wiki/CLI-Migration
```

---

## User Personas & Workflows

### Persona 1: DevOps Engineer

**Job**: Deploy applications safely

**Workflow**:
```bash
# Discover deployment dossiers
dossier list ./devops --risk high --signed-only

# Review before running
dossier info deploy-production.ds.md

# Dry run to see plan
dossier run deploy-production.ds.md --dry-run

# Execute with audit trail
dossier run deploy-production.ds.md
```

### Persona 2: Dossier Author

**Job**: Create and share dossiers

**Workflow**:
```bash
# Create from template
dossier create my-deployment.ds.md --template devops --interactive

# Edit content
$EDITOR my-deployment.ds.md

# Validate format
dossier validate my-deployment.ds.md

# Add checksum
dossier checksum my-deployment.ds.md --update

# Sign
dossier sign my-deployment.ds.md --key ~/.ssh/minisign.key

# Verify before sharing
dossier verify my-deployment.ds.md --verbose

# Publish to registry
dossier publish my-deployment.ds.md --tags "devops,aws"
# Returns: dsr-abc123 (registry ID)
```

### Persona 3: Security Auditor

**Job**: Audit dossier safety

**Workflow**:
```bash
# Batch verification
for f in dossiers/*.ds.md; do
  dossier verify "$f" --json >> audit-results.json
done

# Check specific dossier
dossier verify suspicious.ds.md --verbose

# Deep audit
dossier audit suspicious.ds.md
```

### Persona 4: Solo Developer

**Job**: Quick automation

**Workflow**:
```bash
# Just run trusted dossier
dossier run setup-project.ds.md

# That's it! (verify + execute in one step)
```

---

## Breaking Changes from v0.1.x

### Command Name

**Old**:
```bash
dossier-verify file.ds.md
```

**New**:
```bash
dossier verify file.ds.md
```

### Binary Name in package.json

**Old**:
```json
{
  "bin": {
    "dossier-verify": "./bin/dossier-verify"
  }
}
```

**New**:
```json
{
  "bin": {
    "dossier": "./bin/dossier",
    "dossier-verify": "./bin/dossier-verify-legacy"  // Backward compat
  }
}
```

### Version Bump

- v0.1.1 (current) → v0.2.0 (minor version for new features)

---

## Open Questions

1. **Should `dossier run` require confirmation for unsigned high-risk dossiers?**
   - Option A: Always prompt (safer)
   - Option B: Only with `--interactive` flag (faster)
   - Recommendation: Always prompt unless `--force` or `--no-prompt`

2. **Should we support executing multiple dossiers in sequence?**
   ```bash
   dossier run setup.ds.md deploy.ds.md cleanup.ds.md
   ```
   - Useful for workflows
   - Need to handle failures (continue or stop?)

3. **Should audit logging be opt-in or opt-out?**
   - Option A: Opt-in (`--audit`)
   - Option B: Opt-out (`--no-audit`)
   - Recommendation: Opt-out (audit by default for security)

4. **Should we support dossier chaining/dependencies?**
   ```yaml
   requires:
     - setup-environment.ds.md
     - install-dependencies.ds.md
   ```
   - Powerful for complex workflows
   - Adds complexity to verification

5. **Should `create` open $EDITOR automatically?**
   - Convenient but assumes environment
   - Maybe with `--edit` flag?

---

## Success Metrics

### Phase 1 Success Criteria

**Infrastructure** (5/6 complete):
- [x] CLI structure with commander.js
- [x] Help system
- [x] Documentation updated
- [x] Published to GitHub Packages
- [x] Smart version detection in workflow
- [ ] 90% test coverage

**Commands** (1/4 complete):
- [x] `verify` command working
- [ ] `run` command working
- [ ] `create` command working
- [ ] `list` command working

**Features** (0/2 complete):
- [ ] LLM auto-detection for Claude Code and Cursor
- [ ] Console audit logging

### User Adoption Metrics

- [ ] 50+ GitHub stars
- [ ] 10+ weekly npm downloads
- [ ] 5+ community dossiers created
- [ ] 0 critical security issues

### Developer Experience

- [ ] Clear, helpful error messages
- [ ] Fast execution (< 500ms for verify)
- [ ] Intuitive command names
- [ ] Good defaults (minimal flags needed)

---

## Related

- Issue #27: npm publishing
- Issue #28: Standalone binaries
- [CLI README](../../cli/README.md)
- [Architecture Overview](../architecture/overview.md)

---

## Next Steps (Priority Order)

### Immediate (v0.2.x)

**1. Implement `dossier run` command** (P0 - Highest value)
- [ ] Integrate with `dossier verify` logic
- [ ] Add LLM auto-detection (claude-code, cursor)
- [ ] Implement console audit logging
- [ ] Add user prompts for high-risk dossiers
- [ ] Execute via detected LLM
- [ ] Add `--dry-run`, `--force`, `--no-prompt` options
- **Target**: v0.2.1
- **Effort**: 1-2 days
- **Issue**: Create issue for implementation

**2. Implement `dossier create` command** (P1 - Enable authoring)
- [ ] Interactive mode with prompts
- [ ] Basic template (frontmatter + structure)
- [ ] Auto-calculate checksum
- [ ] Option to open in $EDITOR
- **Target**: v0.2.2
- **Effort**: 1 day
- **Issue**: Create issue for implementation

**3. Implement `dossier list` command** (P1 - Discovery)
- [ ] Scan directory for .ds.md files
- [ ] Parse metadata from each
- [ ] Display table format
- [ ] Add --recursive option
- **Target**: v0.2.3
- **Effort**: 1 day
- **Issue**: Create issue for implementation

### Short Term (v0.3.x - Phase 2)

**4. Implement `dossier sign` command** (P2)
**5. Implement `dossier publish` command** (P2 - MVP simulation)
**6. Implement `dossier checksum` command** (P2)
**7. Implement `dossier validate` command** (P2)

### Medium Term (v0.4.x - Phase 3)

**8. Registry server development**
**9. Full publish/search/install integration**
**10. Advanced commands** (info, diff, export, audit)

---

**Current Status**: ✅ v0.2.0 Released - CLI structure complete, ready for feature implementation

**Last Updated**: 2025-11-15 (v0.2.0 release)
