# Dossier Security Architecture

**Status**: Approved - Ready for Implementation
**Date**: 2025-11-06
**Version**: 1.0.0

---

## Executive Summary

This document defines the security architecture for the Dossier system. Dossiers contain executable instructions for LLM agents and require security measures to prevent:
- Malicious instructions
- Tampering (MITM, compromised repos)
- Supply chain attacks
- Blind execution of harmful commands

**Key Decisions:**
- ✅ Signatures: **Optional with warnings** (not required)
- ✅ Trust Model: **Decentralized like Docker** (anyone can sign)
- ✅ Signature Tool: **minisign** (lightweight, purpose-built)
- ✅ Offline Operation: **Supported** (airgapped users manage their own trust)

---

## Security Threats

### 1. Malicious Instructions
Dossier contains harmful commands:
- `rm -rf /`, data exfiltration, credential theft, crypto mining

### 2. Tampering
Modified in transit or at rest:
- MITM attacks, compromised repositories, local file modification

### 3. Supply Chain
Trusted source compromised:
- Repository hijacking, maintainer account takeover

### 4. Impersonation
Fake "official" dossiers:
- Typosquatting, social engineering

### 5. Blind Execution
LLM executes without understanding risk:
- Full system access, no sandboxing, credential access

---

## Priority Framework (Updated)

1. **SECURITY** ← NEW, CRITICAL
   - Authenticity: Know WHO created it
   - Integrity: Know it HASN'T BEEN MODIFIED
   - Non-repudiation: Creator can't deny creating it
   - Trust chain: Verify creator's identity
   - Audit trail: Log what was executed
   - Risk assessment: Classify danger level
   - Safe execution: Limit blast radius

2. **Efficiency** - Self-contained, minimal context

3. **Maintainability** - Easy to update, evolve

4. **Supportability** - Debuggable by users/agents

5. **Portability** - Works offline, airgapped

6. **Performance** - Fast, low latency

7. **Simplicity** - Clear, few failure modes

8. **Discoverability** - Easy to learn

9. **Graceful Degradation** - Works without optional components

---

## Architecture: Multi-Layer Security

### Layer 1: Embedded Risk Metadata (REQUIRED, Always Checked)

Every dossier MUST declare:

```json
{
  "risk_level": "high",
  "risk_factors": [
    "modifies_cloud_resources",
    "requires_credentials",
    "network_access"
  ],
  "requires_approval": true,
  "destructive_operations": [
    "Creates/updates AWS infrastructure",
    "Modifies IAM roles and security groups"
  ]
}
```

### Layer 2: Integrity Check (REQUIRED, Always Verified)

Every dossier MUST include checksum:

```json
{
  "checksum": {
    "algorithm": "sha256",
    "hash": "a3b5c8d9e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8"
  }
}
```

**Verification:** Calculate SHA256 of body, compare with hash. Mismatch = tampering.

### Layer 3: Cryptographic Signature (OPTIONAL, Recommended)

Dossiers SHOULD be signed:

```json
{
  "signature": {
    "algorithm": "minisign",
    "public_key": "RWTx5V7Kf1KLN8BVF3PqZ8cN9nJxH5kM2wQ4pS6rT7yU8vW9xA0bC1dD2e==",
    "signature": "trustedComment: timestamp:1699200000\tfile:deploy-to-aws.md\nRWTx5V...",
    "key_id": "imboard-ai-2024",
    "signed_by": "Imboard AI Security Team <security@imboard.ai>",
    "timestamp": "2025-11-05T12:00:00Z"
  }
}
```

**Why minisign?**
- ✅ Purpose-built for signing software artifacts
- ✅ Simple trust model (user decides which keys to trust)
- ✅ Lightweight (~100KB vs GPG ~20MB)
- ✅ No infrastructure required (no keyservers, no PKI)
- ✅ Works offline
- ✅ Battle-tested: OpenBSD packages, Homebrew, many OSS projects

### Layer 4: MCP Verification (OPTIONAL, When Available)

MCP server provides `verify_dossier` tool:
- Verifies signatures against known keys
- Checks registry for known-good hashes
- Returns trust level: `verified`, `signed_unknown`, `unsigned`, `invalid`, `revoked`

### Layer 5: LLM Execution Guards (REQUIRED, Always Enforced)

LLM agents MUST follow security protocol:
1. Check risk_level before execution
2. Verify checksum hasn't changed
3. Check signature if present
4. Show user risk_factors and destructive_operations
5. REQUIRE user approval for high-risk or unsigned dossiers
6. Confirm before each destructive operation
7. Log all commands executed
8. Never bypass approval mechanisms

---

## Handling Mutable State: Working Files

### The Challenge

Dossiers are designed to be **immutable and signed** for security. Once a dossier is signed with a checksum and cryptographic signature, any modification breaks the integrity guarantee. This is essential for preventing tampering and establishing trust.

However, during execution, LLM agents need to track **mutable state**:
- Current progress and execution status
- Context gathered from the project
- Decisions made during execution
- Temporary data and intermediate results
- TODO lists that evolve as work progresses
- Logs of actions taken

This creates a fundamental tension: **immutable instructions** vs **mutable execution state**.

### Solution Alternatives Considered

#### Option 1: Sign Each Version
Re-sign the dossier after every modification.

**Rejected because:**
- ❌ Too much overhead for frequent state updates
- ❌ Pollutes the signature/trust model
- ❌ Breaks the atomic guarantee (which version do you trust?)
- ❌ Makes collaboration difficult (conflicting signatures)

#### Option 2: Structured Execution Directory
Create a separate directory structure for execution state:
```
project/
├── deploy-to-aws.ds.md    # Immutable dossier
└── .dossier/
    └── executions/
        └── 2025-11-12-abc123/
            ├── state.json
            ├── working.md
            ├── outputs/
            └── logs/
```

**Tradeoffs:**
- ✅ Supports multiple concurrent executions
- ✅ Structured separation of concerns (logs, outputs, state)
- ✅ Matches patterns from Docker/Kubernetes
- ❌ More complex than needed for most use cases
- ❌ Hidden directory reduces discoverability
- ❌ Overkill for simple workflows

#### Option 3: Simple Working File Pattern (CHOSEN)
Create a sibling markdown file with `.dsw.md` extension (dossier working file):
```
project/
├── deploy-to-aws.ds.md     # Immutable, signed dossier
└── deploy-to-aws.dsw.md    # Mutable working file
```

**Rationale:**
- ✅ Simple and discoverable (visible in file browser)
- ✅ Natural for LLM workflows (markdown todos/logs)
- ✅ Easy naming convention (just add `.w` before `.md`)
- ✅ No hidden directories to manage
- ✅ Sufficient for vast majority of use cases
- ✅ Teams can choose to commit or gitignore based on needs

### The Working File Pattern

**Working files** (`.dsw.md`) are ephemeral, agent-managed files that sit alongside dossiers but operate under different rules:

**Working files ARE:**
- ✅ Mutable markdown files for state tracking
- ✅ Created automatically by LLM during execution
- ✅ Used for progress logs, todos, and context
- ✅ Committed to git OR gitignored (team choice)

**Working files are NOT:**
- ❌ Signed or checksummed
- ❌ Subject to integrity verification
- ❌ Part of the dossier security model
- ❌ Shared across different projects

**Naming Convention:**
```
<dossier-name>.dsw.md

Examples:
deploy-to-aws.ds.md → deploy-to-aws.dsw.md
setup-project.ds.md → setup-project.dsw.md
run-tests.ds.md → run-tests.dsw.md
```

### Security Model for Working Files

Working files exist **outside the security boundary** of dossiers:

```
┌─────────────────────────────────────────────┐
│ SECURITY BOUNDARY                           │
│                                             │
│  ┌────────────────────────────────────┐    │
│  │ Dossier (.ds.md)                   │    │
│  │ ✅ Checksummed                      │    │
│  │ ✅ Optionally signed                │    │
│  │ ✅ Integrity verified               │    │
│  │ ✅ Trust evaluated                  │    │
│  │ ✅ Immutable                        │    │
│  └────────────────────────────────────┘    │
│                                             │
└─────────────────────────────────────────────┘

 ┌────────────────────────────────────┐
 │ Working File (.dsw.md)             │
 │ ❌ No checksum                     │
 │ ❌ No signature                    │
 │ ❌ No verification                 │
 │ ❌ No trust model                  │
 │ ✅ Fully mutable                   │
 └────────────────────────────────────┘
```

**Why this is safe:**
1. **Dossiers define WHAT to do** (instructions) - must be trusted and verified
2. **Working files track WHAT WAS DONE** (state) - no security risk from modification
3. **Separation of concerns** - tampering with a working file doesn't compromise dossier integrity
4. **LLM-private** - working files are for agent state management, not execution instructions

### Version Control Considerations

Teams should decide whether to commit working files based on their workflow:

**Commit Working Files When:**
- ✅ You want team members to see execution progress
- ✅ You want to resume execution on different machines
- ✅ You want an audit trail of decisions made
- ✅ The project is collaborative and state should be shared
- ✅ Working files serve as project documentation

**Gitignore Working Files When:**
- ✅ Multiple people execute the same dossier concurrently (avoid merge conflicts)
- ✅ Working files contain machine-specific or temporary data
- ✅ You want a clean repository history
- ✅ Privacy is a concern (working files might contain sensitive project context)

**Recommendation:**
```gitignore
# Add to .gitignore if you want ephemeral working files
*.dsw.md
```

Or commit them if they serve as useful documentation. **Let your team's workflow decide.**

### Risk Metadata for Dossiers That Use Working Files

If a dossier creates working files, consider adding to risk factors:
```json
{
  "risk_factors": ["modifies_files"],
  "destructive_operations": [
    "Creates working file: deploy-to-aws.dsw.md"
  ]
}
```

However, this is generally **low risk** since working files are:
- Agent-managed (not user-facing)
- Clearly named and discoverable
- Separate from signed content

### Relationship to Multi-Layer Security

Working files interact with **Layer 5: LLM Execution Guards**:
- LLMs read immutable dossiers (verified via Layers 1-4)
- LLMs create/update working files for state tracking
- Working files enable context persistence across sessions
- Working files do not affect dossier security verification

This pattern is analogous to:
- **Git**: Signed commits (immutable) + working directory (mutable)
- **Docker**: Signed images (immutable) + container state (mutable)
- **Kubernetes**: Pod specs (immutable) + pod status (mutable)

---

## Trust Model (Like Docker Hub)

```text
┌─────────────────────────────────────────────────┐
│  Official Dossiers (imboard-ai)                 │
│  ✅ Verified Publisher                          │
│  🔐 Signed with: imboard-ai-2024                │
│  Trust Level: VERIFIED                          │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  Community Dossiers (jane-doe)                  │
│  👤 Community Publisher                         │
│  🔐 Signed with: jane-doe-personal              │
│  Trust Level: USER_CHOICE                       │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  Unsigned Dossiers                              │
│  ⚠️  No signature                               │
│  Trust Level: UNTRUSTED (show warning)          │
└─────────────────────────────────────────────────┘
```

**User trusts keys explicitly:**

```bash
# User's trusted keys file
~/.dossier/trusted-keys.txt

# Official imboard-ai key (always trusted)
RWTx5V7Kf1KLN8BVF3PqZ8cN9nJxH5kM2wQ4pS6rT7yU8vW9xA0bC1dD2e==  imboard-ai-2024

# Community maintainer user explicitly trusts
RWAbc123...  jane-doe-personal
```

---

## Schema Updates

### New Required Fields

```json
{
  "required": [
    "dossier_schema_version",
    "title",
    "version",
    "protocol_version",
    "status",
    "objective",
    "checksum",          // NEW: Always required
    "risk_level",        // NEW: Always required
    "requires_approval"  // NEW: Always required
  ]
}
```

### New Properties

```json
{
  "properties": {
    "checksum": {
      "type": "object",
      "description": "Content integrity hash (REQUIRED for security)",
      "required": ["algorithm", "hash"],
      "properties": {
        "algorithm": {
          "enum": ["sha256"],
          "const": "sha256"
        },
        "hash": {
          "type": "string",
          "pattern": "^[a-f0-9]{64}$",
          "description": "SHA256 hash of dossier body (after frontmatter)"
        }
      }
    },

    "signature": {
      "type": "object",
      "description": "Optional cryptographic signature for authenticity (minisign format)",
      "required": ["algorithm", "public_key", "signature", "signed_by"],
      "properties": {
        "algorithm": {
          "enum": ["minisign"],
          "const": "minisign"
        },
        "public_key": {
          "type": "string",
          "description": "Minisign public key (base64, starts with RWT)",
          "pattern": "^RWT[A-Za-z0-9+/=]+$"
        },
        "signature": {
          "type": "string",
          "description": "Minisign signature (base64)"
        },
        "key_id": {
          "type": "string",
          "description": "Human-readable key identifier (e.g., 'imboard-ai-2024')"
        },
        "signed_by": {
          "type": "string",
          "description": "Signer identity (e.g., 'Imboard AI <security@imboard.ai>')"
        },
        "timestamp": {
          "type": "string",
          "format": "date-time",
          "description": "When signature was created"
        }
      }
    },

    "risk_level": {
      "type": "string",
      "enum": ["low", "medium", "high", "critical"],
      "description": "Risk assessment of executing this dossier (REQUIRED)",
      "default": "medium"
    },

    "risk_factors": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": [
          "modifies_files",
          "deletes_files",
          "modifies_cloud_resources",
          "requires_credentials",
          "network_access",
          "executes_external_code",
          "database_operations",
          "system_configuration"
        ]
      },
      "description": "Specific risk factors this dossier involves"
    },

    "requires_approval": {
      "type": "boolean",
      "description": "Whether user approval is required before execution",
      "default": true
    },

    "destructive_operations": {
      "type": "array",
      "items": { "type": "string" },
      "description": "Human-readable list of potentially destructive operations",
      "examples": [
        "Deletes CloudFormation stacks",
        "Drops database tables",
        "Removes Kubernetes deployments"
      ]
    }
  }
}
```

---

## Example Signed Dossier

```markdown
---dossier
{
  "dossier_schema_version": "1.0.0",
  "title": "Deploy to AWS",
  "version": "1.0.0",
  "protocol_version": "1.0",
  "status": "Stable",
  "objective": "Deploy application to AWS using Infrastructure as Code",

  "checksum": {
    "algorithm": "sha256",
    "hash": "a3b5c8d9e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8"
  },

  "signature": {
    "algorithm": "minisign",
    "public_key": "RWTx5V7Kf1KLN8BVF3PqZ8cN9nJxH5kM2wQ4pS6rT7yU8vW9xA0bC1dD2e==",
    "signature": "trustedComment: timestamp:1699200000\tfile:deploy-to-aws.md\nRWTx5V...[base64]...\nY7Mw3kL...[base64]...",
    "key_id": "imboard-ai-2024",
    "signed_by": "Imboard AI Security Team <security@imboard.ai>",
    "timestamp": "2025-11-05T12:00:00Z"
  },

  "risk_level": "high",
  "risk_factors": [
    "modifies_cloud_resources",
    "requires_credentials",
    "network_access"
  ],
  "requires_approval": true,
  "destructive_operations": [
    "Creates/updates AWS infrastructure (ECS, Lambda, VPC)",
    "May replace existing resources during deployment",
    "Modifies IAM roles and security groups"
  ],

  "category": ["devops", "deployment"],
  "tags": ["aws", "terraform", "deployment"]
}
---

# Dossier: Deploy to AWS

[Rest of dossier content...]
```

---

## Security Execution Flow

```text
┌─────────────────────────────────────────────────┐
│ 1. User: "Execute deploy-to-aws dossier"        │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│ 2. LLM reads dossier                            │
│    - Frontmatter parsed                         │
│    - Body content read                          │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│ 3. INTEGRITY CHECK (Always)                     │
│    Calculate SHA256 of body                     │
│    Compare with checksum.hash                   │
│    ❌ Mismatch → BLOCK + "Dossier tampered!"   │
│    ✅ Match → Continue                          │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│ 4. AUTHENTICITY CHECK (If signed)               │
│    Verify signature with public_key             │
│    Check if public_key in trusted-keys.txt      │
│    Result: verified|signed_unknown|invalid      │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│ 5. RISK ASSESSMENT                              │
│    Read: risk_level, risk_factors,              │
│          destructive_operations                 │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│ 6. USER APPROVAL (If required)                  │
│                                                  │
│    ⚠️  SECURITY WARNING                         │
│    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│    Dossier: Deploy to AWS v1.0.0                │
│    Trust: ✅ Verified (imboard-ai-2024)         │
│           OR                                     │
│           ⚠️ Signed by unknown key (jane-doe)   │
│           OR                                     │
│           ⚠️ UNSIGNED - No signature            │
│                                                  │
│    Risk Level: HIGH                             │
│    Risk Factors:                                │
│      • Modifies cloud resources                 │
│      • Requires AWS credentials                 │
│                                                  │
│    Will perform:                                │
│      • Create/update AWS infrastructure         │
│      • Modify IAM roles                         │
│      • Deploy application code                  │
│                                                  │
│    Proceed? (y/N)                               │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│ 7. EXECUTE (If approved)                        │
│    - Log all actions                            │
│    - Confirm destructive operations             │
│    - Monitor execution                          │
└─────────────────────────────────────────────────┘
```

---

## Author Workflow: Signing Dossiers

### 1. Generate Key Pair (One Time)

```bash
# Install minisign
brew install minisign  # macOS
# or apt-get install minisign  # Linux
# or download from: https://jedisct1.github.io/minisign/

# Generate key pair
minisign -G -p imboard-ai-2024.pub -s imboard-ai-2024.key

# Keep .key file PRIVATE and SECURE
# Share .pub file publicly (in repo, documentation, etc.)
```

### 2. Sign Dossier

```bash
# Use signing tool (will be created in Phase 1)
node tools/sign-dossier.js deploy-to-aws.md --key imboard-ai-2024.key

# This script:
# 1. Reads dossier
# 2. Calculates SHA256 of body (after frontmatter)
# 3. Calls minisign to sign the file
# 4. Embeds checksum + signature in frontmatter
# 5. Writes updated dossier
```

### 3. Publish Public Key

```bash
# Add to repository
echo "RWTx5V7Kf1KLN8BVF3PqZ8cN9nJxH5kM2wQ4pS6rT7yU8vW9xA0bC1dD2e==" > KEYS.txt

# Document in README
# Users can add this to their trusted-keys.txt
```

---

## User Workflow: Verifying Dossiers

### 1. Trust Official Key (One Time)

```bash
# Create trusted keys file
mkdir -p ~/.dossier
echo "RWTx5V7Kf1KLN8BVF3PqZ8cN9nJxH5kM2wQ4pS6rT7yU8vW9xA0bC1dD2e==  imboard-ai-2024" >> ~/.dossier/trusted-keys.txt
```

### 2. Execute Dossier

```bash
# User: "Run the deploy-to-aws dossier"

# LLM automatically:
# 1. Verifies checksum (integrity)
# 2. Verifies signature (authenticity)
# 3. Checks trust level
# 4. Shows risk warning
# 5. Requests approval
# 6. Executes if approved
```

### 3. Trust Community Key (Optional)

```bash
# Add community maintainer key
echo "RWAbc123...  jane-doe-personal" >> ~/.dossier/trusted-keys.txt

# Now dossiers signed by jane-doe will show as "Verified"
```

---

## MCP Server Verification Tool

```typescript
// Tool: verify_dossier
{
  "name": "verify_dossier",
  "description": "Verify integrity and authenticity of a dossier",
  "parameters": {
    "path": "string - Path to dossier file",
    "trusted_keys_path": "string - Path to trusted-keys.txt (optional)"
  },
  "returns": {
    "integrity": {
      "status": "valid" | "invalid" | "missing",
      "checksum_expected": "sha256_hash",
      "checksum_actual": "sha256_hash"
    },
    "authenticity": {
      "status": "verified" | "signed_unknown" | "unsigned" | "invalid",
      "signer": "Imboard AI <security@imboard.ai>",
      "key_id": "imboard-ai-2024",
      "public_key": "RWT...",
      "is_trusted": true | false
    },
    "risk_assessment": {
      "risk_level": "low" | "medium" | "high" | "critical",
      "risk_factors": ["modifies_cloud_resources", "requires_credentials"],
      "destructive_operations": ["Creates AWS resources", "Modifies IAM"]
    },
    "recommendation": "ALLOW" | "WARN" | "BLOCK",
    "message": "Human-readable explanation"
  }
}
```

**Example Output:**

```json
{
  "integrity": {
    "status": "valid",
    "checksum_expected": "a3b5c8d9...",
    "checksum_actual": "a3b5c8d9..."
  },
  "authenticity": {
    "status": "verified",
    "signer": "Imboard AI Security Team <security@imboard.ai>",
    "key_id": "imboard-ai-2024",
    "public_key": "RWTx5V7Kf1KLN8BVF...",
    "is_trusted": true
  },
  "risk_assessment": {
    "risk_level": "high",
    "risk_factors": ["modifies_cloud_resources", "requires_credentials"],
    "destructive_operations": [
      "Creates/updates AWS infrastructure",
      "Modifies IAM roles"
    ]
  },
  "recommendation": "WARN",
  "message": "Verified dossier from trusted source. High risk operations require approval."
}
```

---

## Implementation Plan

### Phase 1 (Immediate - Current PR)

**Goal:** Add security metadata and signing capability

1. **Update `dossier-schema.json`**
   - Add `checksum` (REQUIRED)
   - Add `signature` (OPTIONAL)
   - Add `risk_level` (REQUIRED)
   - Add `risk_factors` (OPTIONAL)
   - Add `requires_approval` (REQUIRED)
   - Add `destructive_operations` (OPTIONAL)

2. **Create `tools/sign-dossier.js`**
   - Read dossier
   - Calculate SHA256 of body
   - Call minisign to sign
   - Embed checksum + signature in frontmatter
   - Write updated dossier

3. **Update all example dossiers**
   - Add risk metadata to all examples
   - Add checksums to all examples
   - Sign official dossiers with imboard-ai key

4. **Update `PROTOCOL.md`**
   - Add security verification steps
   - Add risk assessment flow
   - Add user approval process
   - Add execution guards

5. **Update `templates/dossier-template.md`**
   - Add security fields to frontmatter
   - Add embedded security guide
   - Add examples of risk metadata

6. **Create `KEYS.txt`**
   - Document official imboard-ai public key
   - Explain how to verify signatures
   - Explain trusted-keys.txt

7. **Update `README.md`**
   - Add security section
   - Explain trust model
   - Link to SECURITY_ARCHITECTURE.md

8. **Generate imboard-ai key pair**
   - Generate key with minisign
   - Securely store private key
   - Publish public key

### Phase 2 (Next PR)

**Goal:** Add verification tooling

1. **Create `tools/verify-dossier.js`**
   - Standalone verification tool
   - Can be run independently of MCP

2. **Implement MCP `verify_dossier` tool**
   - Full verification logic
   - Trusted keys management
   - Risk assessment

3. **Add verification to MCP server**
   - Automatic verification on read_dossier
   - Trust level reporting

4. **Create trusted-keys management**
   - CLI tool to add/remove keys
   - List trusted keys
   - Import/export trust chains

5. **Documentation**
   - User guide for verification
   - Author guide for signing
   - Security best practices

### Phase 3 (Future)

**Goal:** Enhanced security features

1. **Registry integration**
   - Known-good hashes registry
   - Revocation list
   - Transparency log

2. **Advanced verification**
   - Timestamp verification
   - Key expiration
   - Multi-signature support

3. **Sandboxing**
   - Execution in isolated environments
   - Resource limits
   - Permission system

---

## Risk Metadata Guidelines

### risk_level Classification

**low:**
- Read-only operations
- No external network access
- No credentials required
- Example: "List project files", "Generate documentation"

**medium:**
- Modifies local files
- Installs dependencies
- Local network access
- Example: "Initialize project", "Install packages"

**high:**
- Modifies cloud resources
- Requires credentials
- Database operations
- Example: "Deploy to AWS", "Run migrations"

**critical:**
- Deletes resources
- Production deployments
- Security-sensitive operations
- Example: "Delete production database", "Revoke all credentials"

### risk_factors Options

- `modifies_files` - Changes local files
- `deletes_files` - Removes files
- `modifies_cloud_resources` - Changes cloud infrastructure
- `requires_credentials` - Needs AWS/GCP/Azure credentials
- `network_access` - Makes external network requests
- `executes_external_code` - Downloads and runs code
- `database_operations` - Modifies database
- `system_configuration` - Changes system settings

**Note on Working Files**: If a dossier creates working files (`.dsw.md`), consider adding `modifies_files` to risk factors. However, this is generally low risk since working files are agent-managed, clearly named, and separate from signed content. See [Handling Mutable State: Working Files](#handling-mutable-state-working-files) for details.

### destructive_operations

Be explicit about what can be destroyed:
- ✅ "Deletes CloudFormation stacks"
- ✅ "Drops database tables"
- ✅ "Terminates EC2 instances"
- ❌ "Performs deployment" (too vague)

---

## Security Best Practices

### For Authors

1. **Always sign official dossiers**
2. **Keep private keys secure** (use password-protected keys)
3. **Rotate keys periodically** (yearly)
4. **Document risk accurately** (err on higher risk level)
5. **List all destructive operations explicitly**
6. **Test dossiers before signing**
7. **Version bump after changes** (update checksum/signature)

### For Users

1. **Always verify checksums** (automatic in MCP)
2. **Trust keys explicitly** (don't trust blindly)
3. **Review risk warnings** (especially for unsigned)
4. **Audit trusted keys periodically**
5. **Report suspicious dossiers**
6. **Keep execution logs**
7. **Test in dev before production**

### For LLM Agents

1. **ALWAYS check integrity** (checksum verification)
2. **ALWAYS show risk warnings** (before execution)
3. **ALWAYS request approval** (for high-risk)
4. **NEVER bypass security checks**
5. **ALWAYS log execution**
6. **NEVER execute if checksum fails**
7. **ALWAYS confirm destructive operations**

---

## FAQ

### Q: What if I don't want to sign my dossiers?
**A:** That's fine! Signatures are optional. Unsigned dossiers will show a warning but can still be executed if user approves.

### Q: How do I trust a community dossier?
**A:** Add the author's public key to `~/.dossier/trusted-keys.txt`. Then dossiers signed with that key will show as "Verified".

### Q: What if checksum verification fails?
**A:** The dossier has been modified since signing. DO NOT execute. Either:
- Re-download from trusted source
- Contact author to verify
- Reject execution

### Q: Can I use GPG instead of minisign?
**A:** Not recommended. Minisign is simpler and purpose-built for this use case. But technically yes, the schema supports multiple algorithms.

### Q: What about airgapped environments?
**A:** Everything works offline. Checksums always work. Signatures work if you have the public key cached locally.

### Q: Who generates the checksum?
**A:** The signing tool calculates it when signing. For unsigned dossiers, authors can manually calculate: `tail -n +X dossier.md | shasum -a 256`

### Q: How do I revoke a compromised key?
**A:** Phase 2 will include revocation lists. For now, remove from trusted-keys.txt and publish security advisory.

---

## References

- [minisign](https://jedisct1.github.io/minisign/) - Signature tool
- [Sigstore](https://www.sigstore.dev/) - Future transparency log integration
- [Docker Content Trust](https://docs.docker.com/engine/security/trust/) - Similar trust model
- [SLSA Framework](https://slsa.dev/) - Supply chain security levels

---

**Document Status**: Ready for implementation
**Next Steps**: Begin Phase 1 implementation
