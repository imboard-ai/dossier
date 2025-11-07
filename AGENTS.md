# AGENTS.md

> **For AI Assistants & Developers**: This file provides comprehensive context about the Dossier project to help you understand, contribute to, and work effectively with this codebase.

## Table of Contents

1. [Project Overview](#project-overview)
2. [Critical Context for AI Assistants](#critical-context-for-ai-assistants)
3. [Architecture](#architecture)
4. [Dossier Specification](#dossier-specification)
5. [Security Architecture](#security-architecture)
6. [Development Workflow](#development-workflow)
7. [Project Structure](#project-structure)
8. [Key Patterns & Conventions](#key-patterns--conventions)
9. [MCP Server Roadmap](#mcp-server-roadmap)
10. [Common Tasks Reference](#common-tasks-reference)
11. [Important Warnings](#important-warnings)

---

## Project Overview

### What is Dossier?

**Dossier** is a universal standard for LLM-executable automation. It defines a structured format (Markdown with JSON frontmatter) that allows AI assistants to intelligently execute complex workflows by following clear, adaptive instructions rather than rigid scripts.

### The Problem

Traditional automation faces critical limitations:

- **Brittle scripts**: Shell scripts fail on edge cases and require handling every scenario explicitly
- **Context blindness**: Scripts can't adapt to different project structures or environments
- **Maintainability**: Complex automation requires extensive code that's hard to update
- **LLM integration gap**: No standard way for AI assistants to discover and execute automation workflows

### The Solution

Instead of writing executable code, you write structured instructions that LLM agents interpret and adapt to your specific project context. Think "infrastructure as documentation that AI can execute."

**Example**: A "deploy to AWS" dossier doesn't contain hardcoded shell commands—it contains instructions like "Identify the infrastructure-as-code tool used in this project, then generate appropriate deployment commands." The AI adapts to whether you're using Terraform, CDK, CloudFormation, or custom scripts.

### Strategic Positioning

Dossier is designed to become the **universal protocol for LLM automation**, similar to how Docker became the standard for containerization:

- **Open Protocol**: The specification is open source (Business Source License 1.1, converting to Apache 2.0 on 2028-10-01)
- **Commercial Infrastructure**: Future offerings may include registries, enterprise features, and managed services
- **Community-Driven**: Anyone can create, share, and improve dossiers
- **LLM-Agnostic**: Works with any AI assistant (Claude, GPT-4, Gemini, Llama, etc.)

**License Note**: See `LICENSE` file. Production use restrictions apply until 2028; other uses are permitted.

---

## Critical Context for AI Assistants

### This is NOT a Traditional Application

**This is a specification project.** Understanding this is critical to working effectively here:

1. **Documentation IS the Product**
   - Primary artifacts: `SPECIFICATION.md`, `PROTOCOL.md`, `SCHEMA.md`, `README.md`
   - These aren't docs for an app—they ARE the deliverable
   - Quality, clarity, and completeness matter more than code

2. **No Traditional Codebase Structure**
   - No `src/`, `lib/`, `tests/` directories
   - Tools are minimal demonstration scripts
   - Focus is on standardization, not implementation

3. **Self-Referential Nature**
   - This project uses dossiers to define dossiers
   - Examples can be run on this codebase itself
   - Example: `examples/git-project-review/` can analyze the dossier project

4. **Security is First-Class**
   - `/security/` directory is as important as core specs
   - Multi-layer defense architecture
   - Threat modeling and incident response are core features

### How This Differs from Normal Projects

| Normal Application | Dossier Project |
|-------------------|----------------|
| Code is primary | Documentation is primary |
| Tests validate behavior | Examples validate specification |
| Build artifacts are deployed | Specification is published |
| Breaking changes affect users | Breaking changes affect protocol adopters |
| Single implementation | Multiple implementations expected |
| Version the app | Version the protocol |

### Mental Model for AI Assistants

Think of this project like:
- **RFC/Standards bodies**: IETF, W3C (defines protocols, not implementations)
- **Specification examples**: JSON Schema, OpenAPI, Markdown
- **Protocol-first projects**: Docker container format, Kubernetes API

When working on this codebase:
- ✅ Improve documentation clarity
- ✅ Add comprehensive examples
- ✅ Enhance security architecture
- ✅ Validate specification compliance
- ❌ Don't build a "dossier runner" application (that's for ecosystem)
- ❌ Don't overcomplicate with complex tooling
- ❌ Don't make breaking protocol changes without major version bump

---

## Architecture

### System Components

```
┌─────────────────────────────────────────────────────────┐
│ USERS & AI ASSISTANTS                                   │
│  • Developers creating automation                       │
│  • LLM agents executing dossiers                        │
│  • Teams sharing workflows                              │
└─────────────────┬───────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────┐
│ MCP SERVER (Planned - In Specification Phase)          │
│  ┌────────────────────────────────────────────────────┐ │
│  │ Tools: list_dossiers, read_dossier,               │ │
│  │        verify_dossier, validate_dossier           │ │
│  │ Resources: dossier://concept, dossier://security  │ │
│  │ Prompts: execute-dossier, improve-dossier         │ │
│  └────────────────────────────────────────────────────┘ │
└─────────────────┬───────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────┐
│ VERIFICATION LAYER (Current - Tools Available)         │
│  ┌──────────────┬────────────┬──────────────┐          │
│  │ Checksums    │ Signatures │ Risk Metadata│          │
│  │ (REQUIRED)   │ (OPTIONAL) │ (REQUIRED)   │          │
│  │              │            │              │          │
│  │ SHA256 hash  │ minisign   │ risk_level   │          │
│  │ in metadata  │ or AWS KMS │ risk_factors │          │
│  │              │ signatures │ requires_    │          │
│  │              │            │ approval     │          │
│  └──────────────┴────────────┴──────────────┘          │
│                                                          │
│  Tools: verify-dossier.js → Returns ALLOW/WARN/BLOCK   │
└─────────────────┬───────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────┐
│ DOSSIER FORMAT (Stable - v1.0)                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │ ---dossier                                        │ │
│  │ {                                                 │ │
│  │   "dossier_schema_version": "1.0.0",             │ │
│  │   "title": "...",                                │ │
│  │   "objective": "...",                            │ │
│  │   "checksum": {...},                             │ │
│  │   "risk_level": "high",                          │ │
│  │   ...                                            │ │
│  │ }                                                 │ │
│  │ ---                                               │ │
│  │                                                   │ │
│  │ # Markdown Instructions                          │ │
│  │ - Structured, human-readable                     │ │
│  │ - LLM interprets and adapts                      │ │
│  │ - Context-aware execution                        │ │
│  └────────────────────────────────────────────────────┘ │
└─────────────────┬───────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────┐
│ VALIDATION & SIGNING (Current)                          │
│  • JSON Schema validation (dossier-schema.json)         │
│  • Checksum generation (tools/sign-dossier.js)          │
│  • Signature creation (minisign or AWS KMS)             │
│  • Automated signing (GitHub Actions + AWS KMS)         │
└─────────────────────────────────────────────────────────┘
```

### Core Components

#### 1. Dossier Format Specification

**Location**: Root documentation files
**Status**: Stable (v1.0)
**Purpose**: Define the universal standard

**Key Files**:
- `SPECIFICATION.md`: Formal standard (required sections, structure, versioning)
- `SCHEMA.md`: JSON frontmatter schema documentation
- `PROTOCOL.md`: Execution protocol (self-improvement, security, validation)
- `dossier-schema.json`: JSON Schema for programmatic validation
- `templates/dossier-template.md`: Standard template

**What It Defines**:
- Required structure (Objective, Prerequisites, Actions, Validation)
- JSON metadata schema (v1.0.0)
- Versioning semantics
- Extension points for domain-specific metadata

#### 2. Security Layer

**Location**: `/security/` directory
**Status**: Comprehensive, actively maintained
**Purpose**: Cryptographic verification and trust management

**Architecture**:

**Multi-Layer Defense**:
1. **Risk Metadata** (REQUIRED) - Declares destructive operations, requires approval
2. **Integrity Checks** (REQUIRED) - SHA256 checksums detect tampering
3. **Signatures** (OPTIONAL) - Cryptographic proof of authenticity
4. **Trust Hierarchy** - Decentralized like PGP web of trust
5. **LLM Execution Guards** - User approval for high-risk operations

**Key Files**:
- `security/ARCHITECTURE.md`: Complete security design ⚠️ **READ THIS FIRST**
- `security/THREAT_MODEL.md`: Attack scenarios and mitigations
- `security/KEY_MANAGEMENT.md`: Key lifecycle procedures
- `security/INCIDENT_RESPONSE.md`: Security incident handling
- `security/decisions/`: Architecture Decision Records (ADRs)
- `KEYS.txt`: Official public keys

**Trust Levels**:
```
VERIFIED         → AWS KMS signature valid (highest trust)
SIGNED_UNKNOWN   → Valid signature, unknown/untrusted key
UNSIGNED         → Checksum valid, no signature (user decision required)
INVALID          → Failed verification → BLOCK EXECUTION
```

#### 3. Validation & Signing Tools

**Location**: `/tools/` directory
**Status**: Functional, Node.js implementation
**Purpose**: Create and verify secure dossiers

**Tools**:

**`tools/sign-dossier.js`**:
- Calculates SHA256 checksum
- Embeds checksum in frontmatter
- Signs with minisign (Ed25519) or AWS KMS (ECDSA-SHA256)
- Updates JSON metadata atomically

**`tools/verify-dossier.js`**:
- Validates checksum integrity
- Verifies signatures if present
- Checks risk metadata
- Returns decision: ALLOW, WARN, or BLOCK

**Technology**: Node.js, native crypto module, child_process for minisign

#### 4. Examples & Templates

**Location**: `/examples/`, `/templates/`
**Status**: Growing collection
**Purpose**: Reference implementations proving the standard works

**Categories**:
- `devops/`: AWS deployment automation
- `database/`: Schema migrations
- `development/`: React library setup
- `data-science/`: ML training pipelines
- `git-project-review/`: LLM-powered code analysis (atomic composable dossiers)
- `validation/`: Schema validation scripts (Node.js + Python)
- `sample-implementation/`: Dossier registry patterns

**Why Examples Matter**:
- Prove specification is implementable
- Serve as templates for new dossiers
- Demonstrate best practices
- Test LLM interpretation across domains

#### 5. MCP Server (Planned)

**Location**: `/mcp-server/`
**Status**: Specification complete, implementation pending
**Purpose**: Frictionless integration with LLM tools

**Planned Features**:
- **Tools**: `list_dossiers`, `read_dossier`, `validate_dossier`, `verify_dossier`, `get_registry`
- **Resources**: `dossier://concept`, `dossier://protocol`, `dossier://security`, `dossier://keys`
- **Prompts**: `execute-dossier`, `create-dossier`, `improve-dossier`

**Technology Stack**: TypeScript, Node.js 18+, @modelcontextprotocol/sdk

**Current State**: See `mcp-server/SPECIFICATION.md` for complete API design

**Contribution Opportunity**: Implementation help welcome! See [MCP Server Roadmap](#mcp-server-roadmap)

#### 6. CI/CD Infrastructure

**Location**: `.github/workflows/`
**Status**: Operational
**Purpose**: Automated signing with AWS KMS

**Key Workflow**: `sign.yml`
- Uses GitHub OIDC to authenticate to AWS
- Accesses AWS KMS key: `alias/dossier-official-prod` (account 942039714848, us-east-1)
- Signs official dossiers with HSM-backed key
- Demonstrates production signing workflow

### Technology Stack

**Core Technologies**:
- **Documentation**: Markdown with JSON frontmatter
- **Schema**: JSON Schema Draft 07
- **Validation**: Ajv (JavaScript), jsonschema (Python)
- **Hashing**: SHA256 (Node.js crypto module)
- **Signatures**:
  - minisign (Ed25519) - Community signing
  - AWS KMS (ECDSA-SHA256, P-256 curve) - Official signing
- **CI/CD**: GitHub Actions + OIDC + AWS KMS

**Tooling Languages**:
- Node.js (primary)
- Python (validation examples)
- TypeScript (planned MCP server)

**No Application Dependencies**:
- No package.json in root (specification project)
- Tools are standalone scripts
- Examples include minimal dependencies for validation

---

## Dossier Specification

### Required Structure

Every dossier MUST follow this structure per `SPECIFICATION.md`:

#### 1. Header (JSON Frontmatter)

```markdown
---dossier
{
  "dossier_schema_version": "1.0.0",
  "title": "Descriptive Title",
  "version": "1.0.0",
  "protocol_version": "1.0",
  "status": "Stable",
  "objective": "Clear, measurable goal (1-3 sentences)",
  "category": ["devops", "deployment"],
  "tags": ["aws", "terraform", "automation"],
  "tools_required": ["aws-cli", "terraform"],
  "checksum": {
    "algorithm": "sha256",
    "hash": "abc123..."
  },
  "risk_level": "high",
  "risk_factors": ["destructive_operations", "cloud_resources"],
  "destructive_operations": ["Deletes existing infrastructure", "Modifies production databases"],
  "requires_approval": true
}
---
```

**Key Metadata Fields**:

| Field | Required | Type | Purpose |
|-------|----------|------|---------|
| `dossier_schema_version` | Yes | String | Schema version (currently "1.0.0") |
| `title` | Yes | String | Human-readable title |
| `version` | Yes | String | Dossier version (semver) |
| `protocol_version` | Yes | String | Protocol compatibility (e.g., "1.0") |
| `status` | Yes | Enum | Draft, Stable, Deprecated |
| `objective` | Yes | String | Clear goal statement |
| `checksum` | Yes | Object | SHA256 hash for integrity |
| `risk_level` | Yes | Enum | low, medium, high, critical |
| `requires_approval` | Conditional | Boolean | Required if risk_level is high/critical |
| `category` | Recommended | Array | Domain tags |
| `tags` | Recommended | Array | Searchable keywords |
| `tools_required` | Recommended | Array | Dependencies |

See `SCHEMA.md` for complete schema documentation.

#### 2. Objective Section

```markdown
## Objective

Deploy a containerized application to AWS ECS with zero-downtime rolling updates,
including infrastructure provisioning, container registry setup, and automated
health checks.
```

**Characteristics**:
- 1-3 sentences maximum
- Clear, measurable outcome
- Specific enough to validate success
- Generic enough to adapt to different projects

#### 3. Prerequisites Section

```markdown
## Prerequisites

### Required
- AWS account with sufficient permissions (ECS, ECR, IAM)
- AWS CLI configured with valid credentials
- Docker installed and running
- Application with Dockerfile present

### Context to Gather
- Identify container orchestration approach (ECS, EKS, Fargate)
- Locate Dockerfile and application entry point
- Determine environment-specific configuration (staging vs production)
- Check for existing infrastructure (Terraform state, CloudFormation stacks)
```

**Purpose**:
- Validate execution is possible
- Prevent failures mid-execution
- Guide LLM to gather necessary context

#### 4. Actions Section

```markdown
## Actions

### 1. Analyze Project Context

Examine the project to determine:
- Container orchestration approach (check for ECS task definitions, K8s manifests)
- Infrastructure-as-code tooling (Terraform, CDK, CloudFormation)
- Existing deployment pipelines

### 2. Prepare Container Image

Based on findings:
- Build Docker image using project's Dockerfile
- Tag image appropriately (use semantic version from package.json or similar)
- Push to ECR (create repository if needed)

### 3. Provision Infrastructure

Using detected IaC tool:
- Create/update ECS cluster, task definitions, services
- Configure load balancer and target groups
- Set up auto-scaling policies

### 4. Deploy Application

Execute deployment with zero-downtime strategy:
- Update ECS service with new task definition
- Monitor rolling update progress
- Verify health checks pass

## Validation

### Success Criteria
- [ ] Container image successfully pushed to ECR
- [ ] ECS service running with desired count of healthy tasks
- [ ] Load balancer health checks passing
- [ ] Application accessible via public endpoint
- [ ] Zero 5xx errors during deployment

### Verification Commands
\`\`\`bash
# Check ECS service status
aws ecs describe-services --cluster <cluster-name> --services <service-name>

# Verify running tasks
aws ecs list-tasks --cluster <cluster-name> --service-name <service-name>

# Test application endpoint
curl -I https://<load-balancer-url>
\`\`\`
```

**Key Principles**:
- Numbered, sequential instructions
- Adaptive language ("Based on findings...", "Using detected tool...")
- Decision points explicitly called out
- Validation integrated throughout

#### 5. Validation Section

**Must Include**:
- Success criteria (checkable items)
- Verification commands (executable tests)
- Expected outcomes

### Recommended Sections

- **Context to Gather**: Questions the LLM should investigate before execution
- **Decision Points**: Key choices requiring user input
- **Example**: Sample execution flow
- **Troubleshooting**: Common failures and resolutions
- **Post-Execution**: Cleanup, next steps, related dossiers

### Schema Validation

Validate dossiers programmatically:

```bash
# Node.js validation
cd examples/validation
npm install ajv ajv-formats
node validate-dossier.js ../../path/to/dossier.md

# Python validation
pip install jsonschema pyyaml
python validate-dossier.py ../../path/to/dossier.md
```

**Schema File**: `/dossier-schema.json` (JSON Schema Draft 07)

---

## Security Architecture

### ⚠️ CRITICAL: Security is Non-Negotiable

**When working with dossiers, you MUST**:

1. ✅ **ALWAYS verify checksums** before execution
2. ✅ **ALWAYS verify signatures** if present
3. ✅ **ALWAYS check risk_level** and get approval for high/critical
4. ✅ **NEVER execute** if verification returns BLOCK
5. ✅ **READ** `security/ARCHITECTURE.md` before implementing security features

### Multi-Layer Defense Architecture

Dossiers use a **defense-in-depth** approach with five security layers:

#### Layer 1: Risk Metadata (REQUIRED)

**Purpose**: Informed consent through transparency

**Required Fields**:
- `risk_level`: low | medium | high | critical
- `risk_factors`: Array of risk categories
- `destructive_operations`: Human-readable descriptions
- `requires_approval`: Boolean (mandatory for high/critical)

**Risk Categories**:
- `destructive_operations`: Deletes/modifies data or infrastructure
- `sensitive_data_access`: Reads credentials, PII, or secrets
- `external_communication`: Network calls to external services
- `privileged_execution`: Requires elevated permissions
- `financial_impact`: Could incur cloud costs
- `production_environment`: Affects live systems

**Example**:
```json
{
  "risk_level": "high",
  "risk_factors": ["destructive_operations", "production_environment", "financial_impact"],
  "destructive_operations": [
    "Deletes existing S3 buckets and contents",
    "Terminates EC2 instances",
    "May incur data transfer costs"
  ],
  "requires_approval": true
}
```

#### Layer 2: Integrity Verification (REQUIRED)

**Purpose**: Detect tampering, corruption, or MITM attacks

**Mechanism**:
- SHA256 hash of dossier content (excluding checksum field itself)
- Hash stored in `checksum.hash` field
- Verification fails if content doesn't match hash

**Calculation** (see `tools/sign-dossier.js`):
```javascript
const crypto = require('crypto');
const content = /* dossier with checksum.hash set to "" */;
const hash = crypto.createHash('sha256').update(content).digest('hex');
```

**Protection Against**:
- Malicious modifications
- Accidental corruption
- Man-in-the-middle attacks
- Compromised repositories

#### Layer 3: Cryptographic Signatures (OPTIONAL but Recommended)

**Purpose**: Verify authorship and authenticity

**Signature Types**:

**Official Signatures (AWS KMS)**:
- Algorithm: ECDSA with SHA256 (P-256 curve)
- Key Storage: AWS KMS (HSM-backed, FIPS 140-2 Level 2)
- Key ID: `alias/dossier-official-prod` (account 942039714848)
- Use Case: Official dossiers from Dossier project
- Trust Level: VERIFIED

**Community Signatures (minisign)**:
- Algorithm: Ed25519
- Key Storage: Self-managed (user's local filesystem)
- Use Case: Community-contributed dossiers
- Trust Level: SIGNED_UNKNOWN (until user adds key to trusted set)

**Signature Format** (in frontmatter):
```json
{
  "signatures": [
    {
      "algorithm": "ECDSA-SHA256",
      "signature": "base64-encoded-signature",
      "key_id": "alias/dossier-official-prod",
      "signed_by": "Dossier Official <security@imboard.ai>",
      "signed_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

#### Layer 4: Trust Hierarchy (Decentralized)

**Trust Model**: Similar to PGP web of trust, not centralized PKI

**Trust Decisions**:
```
Official AWS KMS signature        → Automatic ALLOW (if checksum valid)
Recognized community signature    → ALLOW (user previously trusted this key)
Unknown but valid signature       → WARN (ask user to trust key)
No signature, valid checksum      → WARN (ask user to accept unsigned)
Invalid signature or checksum     → BLOCK (refuse execution)
```

**User Controls Trust**:
- Maintain list of trusted public keys
- Accept unsigned dossiers (acknowledge risk)
- Block specific keys if compromised

#### Layer 5: LLM Execution Guards

**Purpose**: Runtime safety during execution

**Guardrails**:
1. **Pre-Execution Approval**: High/critical risk dossiers require explicit user consent
2. **Progress Reporting**: LLM reports actions before execution
3. **Incremental Execution**: Stop points for user review
4. **Audit Trail**: Log all actions for post-execution review
5. **Error Handling**: Fail safely, don't continue on errors

### Security Verification Workflow

```bash
# Step 1: Verify dossier before execution
node tools/verify-dossier.js examples/devops/deploy-to-aws.md

# Output examples:

# ✅ ALLOW - Safe to execute
# Status: VERIFIED
# Checksum: VALID
# Signature: VALID (AWS KMS - official)
# Risk Level: medium
# Recommendation: ALLOW

# ⚠️  WARN - Requires user decision
# Status: UNSIGNED
# Checksum: VALID
# Signature: NONE
# Risk Level: high
# Recommendation: WARN - User approval required

# 🛑 BLOCK - Do not execute
# Status: INVALID
# Checksum: FAILED
# Risk Level: high
# Recommendation: BLOCK - Content has been modified
```

### Threat Model

The security architecture defends against:

1. **Malicious Instructions**: Risk metadata makes threats visible
2. **Tampering**: Checksums detect any modifications
3. **Impersonation**: Signatures prove authorship
4. **Supply Chain Attacks**: Verification at every execution
5. **Compromised Repositories**: Signatures survive repo compromise
6. **Man-in-the-Middle**: Checksums detect transit modifications
7. **Blind Execution**: Approval requirements prevent unwitting execution

**See**: `security/THREAT_MODEL.md` for detailed attack scenarios and mitigations

### Key Management

**Official Keys** (AWS KMS):
- Managed by Dossier project maintainers
- HSM-backed, automatic rotation
- OIDC authentication via GitHub Actions
- Key ARN in KEYS.txt

**Community Keys** (minisign):
- Self-managed by contributors
- Published in personal repositories
- Users decide which to trust
- Revocation via social coordination

**See**: `security/KEY_MANAGEMENT.md` for lifecycle procedures

### Security Incident Response

**Vulnerability Disclosure**:
- Email: security@imboard.ai
- Private disclosure period: 90 days
- CVE assignment via GitHub Security Advisories

**Incident Types**:
- Malicious dossier discovered
- Key compromise
- Verification bypass
- Implementation vulnerability

**See**: `security/INCIDENT_RESPONSE.md` for procedures

---

## Development Workflow

### Setting Up Your Environment

```bash
# Clone repository
git clone https://github.com/imboard-ai/dossier.git
cd dossier

# Explore core documentation
cat README.md          # Start here
cat QUICK_START.md     # 5-minute introduction
cat SPECIFICATION.md   # Formal standard
cat PROTOCOL.md        # Execution protocol
cat SCHEMA.md          # Metadata schema

# Examine security architecture
cat security/ARCHITECTURE.md   # ⚠️ Essential reading
cat security/THREAT_MODEL.md

# Review examples
ls examples/
cat examples/devops/deploy-to-aws.md
cat examples/git-project-review/README.md
```

**Prerequisites**:
- Node.js (for validation and signing tools)
- Git
- Text editor with Markdown support
- Optional: minisign (for signing), AWS CLI (for KMS signing)

### Creating a New Dossier

#### Step 1: Copy Template

```bash
cp templates/dossier-template.md examples/my-category/my-new-dossier.md
```

#### Step 2: Fill Required Sections

Edit your dossier following `SPECIFICATION.md`:

1. **Frontmatter**: Update JSON metadata
   - Set title, version, objective
   - Choose appropriate risk_level
   - List tools_required
   - Leave checksum empty (will be calculated)

2. **Objective**: Write 1-3 sentence goal statement

3. **Prerequisites**: List required conditions, context to gather

4. **Actions**: Write numbered, adaptive instructions

5. **Validation**: Define success criteria, verification commands

#### Step 3: Validate Schema Compliance

```bash
cd examples/validation
npm install ajv ajv-formats

node validate-dossier.js ../my-category/my-new-dossier.md

# Expected output:
# ✅ Dossier is valid according to schema
```

**Fix validation errors** before proceeding.

#### Step 4: Calculate Checksum and Sign

```bash
# Return to project root
cd ../..

# Sign with minisign (community)
node tools/sign-dossier.js examples/my-category/my-new-dossier.md \
  --key ~/.minisign/mykey.key \
  --key-id mykey-2024 \
  --signed-by "Your Name <you@example.com>"

# Or sign with AWS KMS (official - requires AWS permissions)
node tools/sign-dossier.js examples/my-category/my-new-dossier.md \
  --kms-key-id alias/dossier-official-prod \
  --aws-region us-east-1 \
  --signed-by "Dossier Official <security@imboard.ai>"
```

**Output**: Dossier file updated with checksum and signature in frontmatter

#### Step 5: Verify

```bash
node tools/verify-dossier.js examples/my-category/my-new-dossier.md

# Expected: ALLOW or WARN (depending on trust status)
```

#### Step 6: Test Execution

**Manual Testing**:
1. Copy dossier content
2. Paste into Claude, GPT-4, or other LLM
3. Provide project context
4. Observe execution, note any issues
5. Iterate on instructions if needed

**Test with Multiple LLMs**: Dossiers must work across AI assistants

#### Step 7: Submit (if Contributing)

```bash
# Create feature branch
git checkout -b add-my-dossier

# Add your dossier
git add examples/my-category/my-new-dossier.md

# Commit
git commit -m "Add dossier: My New Dossier

Adds automation for [describe purpose].

Category: my-category
Risk Level: [low/medium/high]
Tools Required: [list]

Co-Authored-By: Claude <noreply@anthropic.com>"

# Push and create PR
git push origin add-my-dossier
```

### Generating Signing Keys

#### minisign (Community Signing)

```bash
# Install minisign
# macOS
brew install minisign

# Ubuntu/Debian
apt install minisign

# Generate key pair
minisign -G -p mykey.pub -s mykey.key

# Outputs:
# - mykey.pub (public key - share this)
# - mykey.key (private key - keep secure)

# Publish public key
cat mykey.pub
# Add to your GitHub profile, website, or repository
```

#### AWS KMS (Official Signing - Maintainers Only)

**Prerequisites**:
- AWS account access
- Permissions for KMS:CreateKey, KMS:Sign, KMS:GetPublicKey
- GitHub OIDC configured (for CI/CD)

**Create Key**:
```bash
aws kms create-key \
  --description "Dossier official signing key" \
  --key-usage SIGN_VERIFY \
  --key-spec ECC_NIST_P256

aws kms create-alias \
  --alias-name alias/dossier-official-prod \
  --target-key-id <key-id-from-above>
```

**Get Public Key**:
```bash
aws kms get-public-key \
  --key-id alias/dossier-official-prod \
  --output text \
  --query PublicKey | base64 -d > dossier-official.pub
```

**Add to KEYS.txt**: Publish public key for verification

### Testing Strategy

#### Schema Validation Testing

```bash
cd examples/validation

# Test all examples
for dossier in ../devops/*.md ../database/*.md; do
  echo "Validating: $dossier"
  node validate-dossier.js "$dossier"
done
```

#### Security Verification Testing

```bash
# Test verification workflow
cd ../..

# Valid signed dossier
node tools/verify-dossier.js examples/devops/deploy-to-aws.md
# Expected: ALLOW

# Tamper with a copy
cp examples/devops/deploy-to-aws.md /tmp/tampered.md
echo "malicious content" >> /tmp/tampered.md
node tools/verify-dossier.js /tmp/tampered.md
# Expected: BLOCK (checksum invalid)
```

#### Execution Testing (Manual)

**Test Matrix**:
| LLM | Dossier | Project Type | Result |
|-----|---------|--------------|--------|
| Claude | deploy-to-aws.md | Node.js API | ✅ Success |
| GPT-4 | deploy-to-aws.md | Python Flask | ✅ Success |
| Claude | setup-react-library.md | Greenfield | ✅ Success |

**Document failures**: Open issues for LLM-specific problems

#### Integration Testing

Test dossiers on real projects:
1. Select diverse project types (Node.js, Python, Go, multi-language)
2. Execute dossiers with minimal modification
3. Verify adaptiveness (did LLM correctly detect project context?)
4. Note any failures or unclear instructions

### Contributing Examples

**High-Value Contributions**:
- ✅ Domain-specific workflows (ML, DevOps, Database, etc.)
- ✅ Atomic, composable dossiers (see `examples/git-project-review/atomic/`)
- ✅ Cross-platform dossiers (work on Linux, macOS, Windows)
- ✅ Multi-language project support

**Quality Standards**:
- Schema-valid JSON frontmatter
- Clear, adaptive instructions
- Comprehensive validation criteria
- Tested with at least 2 different LLMs
- Properly signed (checksum + signature)

---

## Project Structure

```
/home/yuvaldim/projects/dossier/
│
├── README.md                    # Project introduction, value proposition
├── QUICK_START.md              # 5-minute getting started guide
├── SPECIFICATION.md            # ⚠️ FORMAL STANDARD - Core reference
├── PROTOCOL.md                 # Execution protocol (v1.0)
├── SCHEMA.md                   # JSON frontmatter schema documentation
├── dossier-schema.json         # JSON Schema (programmatic validation)
├── LICENSE                     # Business Source License 1.1
├── SECURITY.md                 # Vulnerability disclosure policy
├── KEYS.txt                    # Official public keys for verification
├── AGENTS.md                   # This file - AI assistant reference
│
├── security/                   # 🔒 Security Architecture Hub
│   ├── README.md              # Security overview and index
│   ├── ARCHITECTURE.md        # ⚠️ MUST READ - Complete security design
│   ├── THREAT_MODEL.md        # Attack scenarios and mitigations
│   ├── KEY_MANAGEMENT.md      # Key lifecycle procedures
│   ├── INCIDENT_RESPONSE.md   # Security incident handling
│   └── decisions/             # Architecture Decision Records (ADRs)
│       ├── 001-dual-signature-system.md    # Why both KMS and minisign
│       ├── 002-optional-signatures.md       # Why signatures are optional
│       ├── 003-risk-metadata.md            # Risk transparency approach
│       └── 004-aws-kms-choice.md           # Why AWS KMS for official keys
│
├── templates/                  # Starting Points for New Dossiers
│   ├── dossier-template.md    # Standard template (copy this)
│   └── metadata-section.md    # Metadata examples and patterns
│
├── tools/                      # Security & Validation Tools
│   ├── sign-dossier.js        # Calculate checksums, sign dossiers
│   └── verify-dossier.js      # Verify integrity and authenticity
│
├── examples/                   # Reference Implementations
│   ├── devops/                # DevOps automation
│   │   └── deploy-to-aws.md
│   ├── database/              # Database operations
│   │   └── schema-migration.md
│   ├── development/           # Development workflows
│   │   └── setup-react-library.md
│   ├── data-science/          # ML/Data pipelines
│   │   └── train-model.md
│   ├── git-project-review/    # LLM code analysis
│   │   ├── README.md
│   │   └── atomic/            # ⭐ Composable atomic dossiers
│   │       ├── analyze-architecture.md
│   │       ├── identify-patterns.md
│   │       └── security-review.md
│   ├── validation/            # Schema validation tools
│   │   ├── validate-dossier.js   # Node.js validator
│   │   └── validate-dossier.py   # Python validator
│   └── sample-implementation/ # Dossier registry patterns
│       └── dossiers-registry.md
│
├── mcp-server/                 # 🚧 MCP Server (Planned)
│   ├── README.md              # Overview, roadmap, installation
│   └── SPECIFICATION.md       # Complete API specification
│
├── .github/workflows/          # CI/CD Automation
│   └── sign.yml               # AWS KMS signing workflow (OIDC)
│
└── docs/                       # Additional documentation
```

### Directory Purposes

| Directory | Purpose | Status | Critical? |
|-----------|---------|--------|-----------|
| `/` (root) | Core specification files | Stable | ⚠️ YES |
| `/security/` | Security architecture, threat models, incident response | Active | ⚠️ YES |
| `/templates/` | Scaffolding for creating new dossiers | Stable | No |
| `/tools/` | Sign/verify utilities | Functional | Yes |
| `/examples/` | Working reference implementations | Growing | Yes |
| `/mcp-server/` | Future integration layer | Planned | No |
| `.github/workflows/` | Automated signing | Operational | No |

### Critical Files for AI Assistants

**Must Read Before Contributing**:
1. `SPECIFICATION.md` - Understand the standard
2. `security/ARCHITECTURE.md` - Understand security model
3. `PROTOCOL.md` - Understand execution expectations
4. `SCHEMA.md` - Understand metadata structure

**Reference When Creating Dossiers**:
1. `templates/dossier-template.md` - Starting point
2. `examples/` - Working examples in your domain
3. `dossier-schema.json` - Validate your metadata

**Reference for Security Work**:
1. `security/THREAT_MODEL.md` - What we're defending against
2. `security/KEY_MANAGEMENT.md` - Key lifecycle
3. `tools/verify-dossier.js` - Verification logic

---

## Key Patterns & Conventions

### Versioning

**Protocol Version** (MAJOR.MINOR):
- Current: `1.0`
- Incremented when: Execution behavior changes
- Breaking changes: MAJOR bump required
- Backward compatible additions: MINOR bump

**Schema Version** (Semantic Versioning):
- Current: `1.0.0`
- MAJOR: Breaking metadata changes
- MINOR: New optional fields
- PATCH: Documentation/clarification only

**Dossier Version** (Semantic Versioning):
- Individual dossier versions
- MAJOR: Breaking changes to instructions or objectives
- MINOR: Enhanced instructions, new features
- PATCH: Clarifications, typo fixes

**Stability Promise**:
- `protocol_version: "1.0"` dossiers will ALWAYS work with 1.x executors
- Breaking changes trigger 2.0, 3.0, etc.
- Ecosystem can trust version compatibility

### Naming Conventions

**Files**:
- Format: `lowercase-with-hyphens.md`
- Action-oriented: `deploy-to-aws.md`, `migrate-database.md`, `setup-react-library.md`
- Descriptive, specific: Not `deploy.md`, but `deploy-to-aws.md`
- Extensions: `.md` (standard) or `.dossier` (explicit)

**Directories**:
- Category-based: `devops/`, `database/`, `development/`, `data-science/`
- Lowercase, plural when appropriate

**Keys**:
- minisign: `keyname-YYYY.pub/key` (e.g., `dossier-community-2024.key`)
- AWS KMS: Descriptive aliases (e.g., `alias/dossier-official-prod`)

### Git Workflow

**Branching**:
- Main branch: `main` (stable)
- Feature branches: `add-<dossier-name>`, `update-security-docs`, etc.
- Short-lived branches (merge quickly)

**Commit Messages**:
```
<type>: <summary>

<body>

Co-Authored-By: Claude <noreply@anthropic.com>
```

**Types**: `Add`, `Update`, `Fix`, `Refactor`, `Document`

**Examples** (from recent history):
```
Add comprehensive security architecture documentation

Update MCP README with security features

Add PR description for security architecture implementation
```

**Co-Authorship**: AI-assisted commits include co-author tag

### Code Style

**Markdown**:
- ATX-style headers (`## Header`, not `Header\n======`)
- Fenced code blocks with language tags
- Consistent indentation (2 spaces)
- Use tables for structured data
- Checkboxes for success criteria

**JSON**:
- Pretty-printed (2-space indent)
- Trailing commas disallowed (strict JSON)
- Keys in logical order (schema-defined fields first)

**JavaScript** (tools):
- Node.js native modules preferred
- Minimal dependencies
- Clear error messages
- Synchronous where possible (simplicity)

### Documentation Patterns

**Required Sections in Spec Docs**:
- Clear objective/purpose
- Motivation (why does this exist?)
- Specification (formal definition)
- Examples (working demonstrations)
- Validation (how to verify compliance)

**Required Sections in Security Docs**:
- Threat description
- Attack scenarios
- Mitigations
- Residual risks
- Verification procedures

### Self-Improvement Protocol

Every dossier execution can trigger improvement (see `PROTOCOL.md`):

**Meta-Analysis Phase** (before execution):
1. LLM analyzes dossier quality
2. Identifies gaps based on current project context
3. Proposes specific enhancements

**Improvement Types**:
- Additional prerequisites discovered
- Better validation criteria
- Context-specific decision points
- Troubleshooting scenarios

**User Decision**:
- Accept improvements → Update dossier
- Iterate on suggestions → Refine further
- Skip → Execute as-is

**Workflow**:
```
User: "Execute deploy-to-aws.md"
LLM: "Before executing, I notice this dossier doesn't cover multi-region deployments,
      which your project uses. Should I enhance it first?"
User: "Yes, update it" | "No, just execute"
```

**Purpose**: Continuous quality improvement through usage

---

## MCP Server Roadmap

### Current Status

**Specification**: ✅ Complete (`mcp-server/SPECIFICATION.md`)
**Implementation**: 🚧 Not started
**Timeline**: Contributions welcome, no fixed deadline

### Planned Features

The MCP (Model Context Protocol) server will provide frictionless integration between LLM tools (Claude Code, Continue, etc.) and the Dossier ecosystem.

#### Tools

**`list_dossiers`**:
- Lists available dossiers from configured registries
- Filters by category, tags, risk level
- Returns metadata for discovery

**`read_dossier`**:
- Fetches full dossier content
- Validates schema compliance
- Returns parsed frontmatter + Markdown

**`validate_dossier`**:
- Validates against JSON Schema
- Checks required sections
- Returns compliance report

**`verify_dossier`**:
- Performs security verification
- Checks checksums and signatures
- Returns ALLOW/WARN/BLOCK decision

**`get_registry`**:
- Fetches registry metadata
- Lists available dossier collections
- Returns trust information

#### Resources

**`dossier://concept`**: Introduction to dossiers (from README)
**`dossier://protocol`**: Execution protocol (from PROTOCOL.md)
**`dossier://security`**: Security architecture (from security/ARCHITECTURE.md)
**`dossier://keys`**: Official public keys (from KEYS.txt)

#### Prompts

**`execute-dossier`**:
- Template: "Execute {dossier_name} on current project"
- Automatically verifies, gathers context, executes
- Integrated approval flow

**`create-dossier`**:
- Template: "Create dossier for {objective}"
- Scaffolds from template
- Guides through required sections

**`improve-dossier`**:
- Template: "Analyze and improve {dossier_name}"
- Runs meta-analysis
- Proposes enhancements

### Technology Stack

**Language**: TypeScript
**Runtime**: Node.js 18+
**Dependencies**: `@modelcontextprotocol/sdk`
**Protocol**: MCP 1.0

### Architecture

```
┌─────────────────────────────────────────┐
│ LLM Tools (Claude Code, Continue, etc) │
└────────────────┬────────────────────────┘
                 │ MCP Protocol
                 ▼
┌─────────────────────────────────────────┐
│ Dossier MCP Server                      │
│  ┌───────────────────────────────────┐ │
│  │ Tools Layer                       │ │
│  │  • list_dossiers                  │ │
│  │  • read_dossier                   │ │
│  │  • verify_dossier                 │ │
│  └───────────────────────────────────┘ │
│  ┌───────────────────────────────────┐ │
│  │ Registry Manager                  │ │
│  │  • Local file system              │ │
│  │  • Remote registries              │ │
│  │  • Caching                        │ │
│  └───────────────────────────────────┘ │
│  ┌───────────────────────────────────┐ │
│  │ Security Layer                    │ │
│  │  • Checksum verification          │ │
│  │  • Signature verification         │ │
│  │  • Trust management               │ │
│  └───────────────────────────────────┘ │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│ Dossier Files (local or remote)        │
└─────────────────────────────────────────┘
```

### Implementation Checklist

**Phase 1: Core Infrastructure**
- [ ] Project setup (TypeScript, tsconfig, package.json)
- [ ] MCP SDK integration
- [ ] Basic server scaffolding
- [ ] Connection handling

**Phase 2: Tools Implementation**
- [ ] `read_dossier` (local filesystem)
- [ ] `validate_dossier` (JSON Schema validation)
- [ ] `list_dossiers` (directory scanning)
- [ ] `verify_dossier` (checksum + signature verification)

**Phase 3: Resources**
- [ ] `dossier://concept`
- [ ] `dossier://protocol`
- [ ] `dossier://security`
- [ ] `dossier://keys`

**Phase 4: Prompts**
- [ ] `execute-dossier`
- [ ] `create-dossier`
- [ ] `improve-dossier`

**Phase 5: Advanced Features**
- [ ] Remote registry support
- [ ] Caching layer
- [ ] Trust management UI
- [ ] Configuration file support

**Phase 6: Testing & Documentation**
- [ ] Unit tests (tools, validators)
- [ ] Integration tests (full workflows)
- [ ] User documentation
- [ ] Configuration guide

### How to Contribute

**Getting Started**:
1. Read `mcp-server/SPECIFICATION.md` (complete API design)
2. Review MCP SDK docs: https://modelcontextprotocol.io
3. Set up TypeScript project in `mcp-server/`
4. Implement tools incrementally (start with `read_dossier`)

**Development Flow**:
```bash
cd mcp-server

# Initialize project
npm init -y
npm install @modelcontextprotocol/sdk
npm install -D typescript @types/node

# Create tsconfig.json
npx tsc --init

# Implement server
# See SPECIFICATION.md for API contracts

# Test locally
npm run build
npm start

# Test with Claude Code
# Configure MCP server in Claude Code settings
```

**Pull Request Process**:
1. Implement feature from checklist
2. Add tests
3. Update SPECIFICATION.md if API changes
4. Submit PR with:
   - Clear description
   - Test results
   - Example usage

**Questions?** Open an issue with `mcp-server` label

---

## Common Tasks Reference

### Quick Operations

#### Validate a Dossier

```bash
# Schema validation
cd examples/validation
node validate-dossier.js ../devops/deploy-to-aws.md

# Security verification
cd ../..
node tools/verify-dossier.js examples/devops/deploy-to-aws.md
```

#### Sign a Dossier

```bash
# With minisign
node tools/sign-dossier.js path/to/dossier.md \
  --key ~/.minisign/mykey.key \
  --key-id mykey-2024 \
  --signed-by "Your Name <you@example.com>"

# With AWS KMS (requires permissions)
node tools/sign-dossier.js path/to/dossier.md \
  --kms-key-id alias/dossier-official-prod \
  --aws-region us-east-1 \
  --signed-by "Dossier Official <security@imboard.ai>"
```

#### Create a New Dossier

```bash
# Copy template
cp templates/dossier-template.md examples/my-category/new-dossier.md

# Edit in your editor
$EDITOR examples/my-category/new-dossier.md

# Validate
cd examples/validation
node validate-dossier.js ../my-category/new-dossier.md

# Sign
cd ../..
node tools/sign-dossier.js examples/my-category/new-dossier.md --key <your-key>

# Verify
node tools/verify-dossier.js examples/my-category/new-dossier.md
```

#### Test a Dossier with an LLM

```bash
# Copy dossier content
cat examples/devops/deploy-to-aws.md | pbcopy  # macOS
cat examples/devops/deploy-to-aws.md | xclip -selection clipboard  # Linux

# Paste into Claude, GPT-4, or your LLM tool
# Provide project context
# Observe execution
```

#### Find Dossiers by Category

```bash
# List all categories
ls examples/

# Find specific category
ls examples/devops/
ls examples/database/

# Search by tag (requires grep)
grep -r '"tags":.*"aws"' examples/
```

#### Check Security Status

```bash
# Verify all examples
for dossier in examples/*/*.md; do
  echo "Checking: $dossier"
  node tools/verify-dossier.js "$dossier"
done
```

### Development Tasks

#### Run Full Validation Suite

```bash
# Schema validation on all examples
cd examples/validation
for dossier in ../devops/*.md ../database/*.md ../development/*.md; do
  echo "Validating: $dossier"
  node validate-dossier.js "$dossier" || echo "❌ FAILED: $dossier"
done
```

#### Update Checksum After Edit

```bash
# Re-sign after modifications
node tools/sign-dossier.js path/to/modified-dossier.md --key <your-key>

# This recalculates checksum and updates signature
```

#### Generate New Signing Key

```bash
# minisign
brew install minisign
minisign -G -p mykey.pub -s mykey.key

# Publish public key
cat mykey.pub
# Add to GitHub profile or repository
```

#### Test Across LLMs

```bash
# Create test matrix
cat > /tmp/test-matrix.md << 'EOF'
| LLM | Dossier | Project | Result | Notes |
|-----|---------|---------|--------|-------|
| Claude | deploy-to-aws.md | Node.js | ⏳ Testing | |
| GPT-4 | deploy-to-aws.md | Node.js | ⏳ Testing | |
| Claude | setup-react-library.md | Greenfield | ⏳ Testing | |
EOF

# Execute tests manually, update table
```

---

## Important Warnings

### ⚠️ Non-Negotiable Security Requirements

**For AI Assistants Executing Dossiers**:

1. **NEVER execute without verification**
   - ALWAYS run `verify-dossier.js` first
   - NEVER skip checksum validation
   - If verification returns BLOCK, refuse execution

2. **NEVER ignore risk metadata**
   - ALWAYS check `risk_level`
   - ALWAYS get user approval for `high` or `critical`
   - NEVER proceed if `requires_approval: true` without explicit consent

3. **NEVER trust unsigned high-risk dossiers**
   - High/critical risk WITHOUT signature = high scrutiny
   - Present full instructions to user for review
   - Get explicit approval before any destructive operation

4. **NEVER bypass security checks**
   - No "just this once" exceptions
   - No "I trust this source" shortcuts
   - Verification is mandatory, not optional

5. **NEVER execute modified dossiers**
   - If checksum fails, dossier has been tampered with
   - DO NOT ask user "is this okay?"
   - Simply refuse execution

### ⚠️ Protocol Stability Guarantees

**For Developers Extending Dossier**:

1. **NEVER break protocol_version compatibility**
   - `1.x` dossiers must work with all `1.x` executors
   - Breaking changes require MAJOR version bump (2.0, 3.0)
   - Test backward compatibility rigorously

2. **NEVER make required fields optional**
   - Removing requirements breaks existing validators
   - Add new optional fields only
   - Deprecate gracefully (warnings → errors → removal)

3. **NEVER change checksum algorithm without version bump**
   - Current: SHA256
   - Changes require schema MAJOR version increment
   - Support migration path for existing dossiers

4. **NEVER remove security layers**
   - Security can only be strengthened
   - New layers can be added
   - Existing layers must remain

### ⚠️ Documentation Standards

**For Contributors**:

1. **NEVER update examples without testing**
   - Execute dossier on real project
   - Validate with schema validator
   - Test with at least 2 different LLMs

2. **NEVER commit unsigned dossiers to examples/**
   - All examples must have checksums
   - Official examples must have AWS KMS signatures
   - Community examples must have minisign signatures

3. **NEVER make breaking changes to SPECIFICATION.md without discussion**
   - Open issue first
   - Discuss impact on ecosystem
   - Get maintainer approval
   - Update protocol version

4. **NEVER merge security changes without review**
   - All `/security/` changes require maintainer review
   - Threat model updates need validation
   - Key management changes are especially critical

### ⚠️ Common Pitfalls

**For AI Assistants**:

1. **Don't assume project structure**
   - Dossiers are adaptive—gather context first
   - Check for tools, files, configurations
   - Don't hardcode paths or commands

2. **Don't skip validation sections**
   - Always run verification commands
   - Check success criteria
   - Report failures clearly

3. **Don't ignore errors mid-execution**
   - Fail fast and safely
   - Don't continue after errors
   - Report issue to user

4. **Don't modify dossiers during execution**
   - Self-improvement happens BEFORE execution
   - Once executing, follow instructions as-is
   - Changes require re-signing

**For Developers**:

1. **Don't create tool-specific dossiers**
   - Must work with any LLM (Claude, GPT-4, Gemini, etc.)
   - Avoid "Claude, do X" or "GPT-4, do Y"
   - Use generic instructions

2. **Don't write shell scripts disguised as dossiers**
   - Dossiers are adaptive instructions, not code
   - Use context-aware language
   - Let LLM choose specific commands

3. **Don't overcomplicate JSON metadata**
   - Follow schema exactly
   - Don't add custom fields (use `metadata` object for extensions)
   - Keep it simple and clear

---

## Additional Resources

### Documentation

- **Core Specification**: `SPECIFICATION.md`
- **Execution Protocol**: `PROTOCOL.md`
- **Metadata Schema**: `SCHEMA.md`
- **Security Architecture**: `security/ARCHITECTURE.md`
- **Quick Start**: `QUICK_START.md`

### Examples

- **DevOps**: `examples/devops/`
- **Database**: `examples/database/`
- **Development**: `examples/development/`
- **Data Science**: `examples/data-science/`
- **Atomic Dossiers**: `examples/git-project-review/atomic/`

### Tools

- **Validation**: `examples/validation/validate-dossier.js`
- **Signing**: `tools/sign-dossier.js`
- **Verification**: `tools/verify-dossier.js`

### Community

- **GitHub**: https://github.com/imboard-ai/dossier
- **Issues**: Report bugs, request features
- **Discussions**: Ask questions, share dossiers
- **Security**: security@imboard.ai

---

## Summary

**Dossier is a specification-first project** defining a universal standard for LLM-executable automation. As an AI assistant or developer working with this codebase:

1. **Understand this is NOT a traditional application**—documentation is the product
2. **Security is non-negotiable**—always verify, never skip checks
3. **Protocol stability matters**—breaking changes harm ecosystem adoption
4. **Examples prove the standard**—working implementations are critical
5. **LLM-agnostic design**—must work with Claude, GPT-4, Gemini, and future models
6. **Community-driven evolution**—self-improvement protocol enables continuous enhancement
7. **Business model awareness**—open protocol, commercial infrastructure (like Docker)

**Key Files to Read First**:
- `SPECIFICATION.md` (the standard)
- `security/ARCHITECTURE.md` (security model)
- `PROTOCOL.md` (execution expectations)

**When Contributing**:
- Start with examples (easiest entry point)
- Validate schema compliance
- Sign your dossiers
- Test with multiple LLMs

**Questions?** Open an issue or discussion on GitHub.

---

*This AGENTS.md file is maintained by the Dossier project. Last updated: 2024-01-15*
