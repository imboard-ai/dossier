# ADR-003: Required Risk Metadata

**Status**: Accepted
**Date**: 2025-11-06
**Deciders**: Security Team, Product Lead, Engineering Lead
**Consulted**: Community
**Informed**: All stakeholders

---

## Context and Problem Statement

Dossiers execute arbitrary commands with user permissions. Even with cryptographic signatures establishing WHO created a dossier, users still need to understand WHAT it will do before approving execution.

**Key Question**: How do we enable informed consent for dossier execution?

---

## Decision Drivers

### Security Requirements
- Users must understand risk before execution
- High-risk operations require explicit approval
- System can make risk-based decisions (ALLOW/WARN/BLOCK)
- Clear communication of potential harm

### Usability Requirements
- Quick to author (don't slow down creation)
- Easy to understand (non-technical users can assess)
- Consistent across dossiers (predictable format)
- Machine-readable (LLMs can interpret)

### Ecosystem Requirements
- Works without signatures (defense in depth)
- Scales to thousands of dossiers
- Community can self-classify
- Official dossiers set good examples

---

## Considered Options

### Option 1: No Risk Declaration (Trust Users)
**Approach**: Let users read code and decide

**Pros**:
- ✅ Simple (no metadata required)
- ✅ Flexible (no constraints on authors)
- ✅ Trusts user judgment

**Cons**:
- ❌ Users may not review code
- ❌ LLMs can't assess risk automatically
- ❌ No guardrails for dangerous operations
- ❌ Social engineering attacks easy

**Verdict**: ❌ Rejected - Insufficient protection

---

### Option 2: Automated Static Analysis Only
**Approach**: Scan dossier code for dangerous patterns

**Example Detection**:
```bash
# Detected: rm -rf
# Risk: HIGH (destructive file operation)

# Detected: curl ... | bash
# Risk: CRITICAL (executes remote code)
```

**Pros**:
- ✅ Automatic (no author burden)
- ✅ Consistent (same rules for all)
- ✅ Catches obvious dangers

**Cons**:
- ❌ False positives (legitimate use of rm)
- ❌ False negatives (obfuscated commands)
- ❌ Can't understand intent (is AWS deploy dangerous?)
- ❌ Complex to maintain rules

**Verdict**: ❌ Rejected as sole solution - Too unreliable

---

### Option 3: Optional Risk Declaration
**Approach**: Authors can optionally declare risk

**Pros**:
- ✅ Lightweight (only for risky dossiers)
- ✅ Flexible (author choice)
- ✅ Better than nothing

**Cons**:
- ❌ Authors may forget or intentionally omit
- ❌ Malicious actors won't declare risk
- ❌ Inconsistent (some dossiers missing metadata)
- ❌ Can't enforce safety requirements

**Verdict**: ❌ Rejected - Insufficient reliability

---

### Option 4: Required Risk Metadata ⭐
**Approach**: ALL dossiers must declare risk level and factors

**Required Fields**:
```json
{
  "risk_level": "low|medium|high|critical",
  "risk_factors": [
    "modifies_files",
    "deletes_files",
    "modifies_cloud_resources",
    "requires_credentials",
    "network_access",
    "executes_external_code",
    "database_operations",
    "system_configuration"
  ],
  "requires_approval": true|false,
  "destructive_operations": [
    "Human-readable description of each dangerous action"
  ]
}
```

**Pros**:
- ✅ **Mandatory**: All dossiers have risk information
- ✅ **Consistent**: Standardized risk language
- ✅ **Actionable**: LLMs can make approval decisions
- ✅ **Transparent**: Users see exactly what's risky
- ✅ **Defense in Depth**: Works even without signatures
- ✅ **Schema Validation**: Invalid metadata = execution blocked

**Cons**:
- ⚠️ Author burden (must think about risk)
- ⚠️ Self-declared (authors could lie, but checksum/signature catch tampering)
- ⚠️ Schema maintenance (need to update risk_factors over time)

**Verdict**: ✅ **SELECTED** - Best balance of security and usability

---

## Decision

**ALL dossiers MUST include risk metadata in frontmatter**:

### Required Fields

1. **`risk_level`** (enum):
   - `low`: Read-only operations, no system modifications
   - `medium`: Modifies files in project directory, reversible changes
   - `high`: Modifies system configuration, cloud resources, or credentials
   - `critical`: Destructive operations, data deletion, security-sensitive

2. **`risk_factors`** (array of enums):
   - `modifies_files`: Creates or updates files
   - `deletes_files`: Removes files or directories
   - `modifies_cloud_resources`: Changes AWS/GCP/Azure resources
   - `requires_credentials`: Needs API keys, passwords, or tokens
   - `network_access`: Makes external HTTP requests
   - `executes_external_code`: Downloads and runs remote scripts
   - `database_operations`: Modifies database schema or data
   - `system_configuration`: Changes OS settings, installs packages

3. **`requires_approval`** (boolean):
   - `true`: User must explicitly approve before execution
   - `false`: Can auto-execute if risk_level is low and user trusts source

4. **`destructive_operations`** (array of strings):
   - Human-readable list of potentially harmful actions
   - Example: "Deletes all files in /tmp directory"
   - Example: "Terminates running AWS EC2 instances"

### Example Dossiers

**Low Risk** (Read-only analysis):
```markdown
---
dossier_schema_version: "1.0.0"
title: "Analyze Project Dependencies"
risk_level: "low"
risk_factors: []
requires_approval: false
destructive_operations: []
---

# Analyze Project Dependencies
Lists all npm/pip dependencies and checks for updates.
No modifications made.
```

**Medium Risk** (Local file modifications):
```markdown
---
dossier_schema_version: "1.0.0"
title: "Update Package Versions"
risk_level: "medium"
risk_factors:
  - "modifies_files"
  - "network_access"
requires_approval: true
destructive_operations:
  - "Updates package.json and package-lock.json"
  - "Runs npm install to update dependencies"
---

# Update Package Versions
Updates all packages to latest versions within semver constraints.
```

**High Risk** (Cloud deployment):
```markdown
---
dossier_schema_version: "1.0.0"
title: "Deploy to AWS Production"
risk_level: "high"
risk_factors:
  - "modifies_cloud_resources"
  - "requires_credentials"
  - "network_access"
requires_approval: true
destructive_operations:
  - "Creates or updates AWS Lambda functions"
  - "Modifies IAM roles and security groups"
  - "Updates production database schema"
---

# Deploy to AWS Production
Deploys application to AWS production environment.
Requires AWS credentials with admin permissions.
```

**Critical Risk** (Data deletion):
```markdown
---
dossier_schema_version: "1.0.0"
title: "Purge Old Backup Files"
risk_level: "critical"
risk_factors:
  - "deletes_files"
  - "modifies_cloud_resources"
requires_approval: true
destructive_operations:
  - "Deletes all backup files older than 90 days from S3"
  - "Permanently removes data (cannot be recovered)"
---

# Purge Old Backup Files
DANGER: This permanently deletes backup files.
Ensure you have verified backup retention requirements.
```

---

## Consequences

### Positive
- **Informed Consent**: Users always know what they're approving
- **LLM Safety**: AI agents can refuse dangerous operations automatically
- **Defense in Depth**: Works even if signatures are bypassed
- **Clear Communication**: Standardized risk language across ecosystem
- **Audit Trail**: Risk metadata logged with execution decisions
- **Schema Validation**: Invalid metadata = execution blocked (fail-safe)

### Negative
- **Author Responsibility**: Authors must accurately assess risk (no tool can fully automate this)
- **Maintenance**: Risk factor enum may need updates over time
- **Verbosity**: More frontmatter required (but offset by clarity)

### Neutral
- **Trust Model**: Still relies on author honesty, but checksum/signature catch tampering
- **Static Analysis**: Could complement (warn if detected risk doesn't match declared)

---

## Implementation

### Schema Enforcement

```javascript
// tools/verify-dossier.js
function validateRiskMetadata(frontmatter) {
  // REQUIRED fields
  if (!frontmatter.risk_level) {
    return {
      valid: false,
      error: "Missing required field: risk_level"
    };
  }

  if (!["low", "medium", "high", "critical"].includes(frontmatter.risk_level)) {
    return {
      valid: false,
      error: `Invalid risk_level: ${frontmatter.risk_level}`
    };
  }

  if (frontmatter.requires_approval === undefined) {
    return {
      valid: false,
      error: "Missing required field: requires_approval"
    };
  }

  return { valid: true };
}
```

### Execution Policy

```javascript
// Decision matrix for execution
function shouldAllowExecution(dossier, userConfig) {
  const { risk_level, requires_approval, signature } = dossier;

  // BLOCK: Invalid checksum (tampering detected)
  if (!dossier.checksumValid) {
    return { action: "BLOCK", reason: "Checksum invalid - possible tampering" };
  }

  // BLOCK: Invalid signature
  if (signature && !signature.valid) {
    return { action: "BLOCK", reason: "Invalid cryptographic signature" };
  }

  // ALWAYS require approval for high/critical risk
  if (["high", "critical"].includes(risk_level)) {
    return {
      action: "REQUIRE_APPROVAL",
      reason: `Risk level: ${risk_level.toUpperCase()}`
    };
  }

  // Require approval if dossier declares it
  if (requires_approval) {
    return {
      action: "REQUIRE_APPROVAL",
      reason: "Dossier requires explicit approval"
    };
  }

  // Require approval for unsigned dossiers
  if (!signature) {
    return {
      action: "REQUIRE_APPROVAL",
      reason: "Unsigned dossier - verify source before executing"
    };
  }

  // Low risk + signed + trusted = can auto-approve
  if (risk_level === "low" && signature.trusted) {
    return { action: "ALLOW", reason: "Low risk from trusted source" };
  }

  // Default: require approval
  return { action: "REQUIRE_APPROVAL", reason: "User approval required" };
}
```

---

## Validation

### Success Criteria
- ✅ 100% of dossiers have valid risk metadata
- ✅ Schema validation blocks execution of invalid dossiers
- ✅ Users report warnings are clear and actionable
- ✅ Zero incidents of users unknowingly executing dangerous dossiers

### Monitoring

```bash
# Check all dossiers have risk metadata
find examples/ -name "*.md" | while read f; do
  if ! grep -q "^risk_level:" "$f"; then
    echo "MISSING RISK METADATA: $f"
  fi
done

# Analyze risk distribution
grep -h "^risk_level:" examples/**/*.md | sort | uniq -c
#   42 risk_level: low
#   23 risk_level: medium
#   12 risk_level: high
#    3 risk_level: critical
```

---

## Related Decisions

- [ADR-001: Dual Signature System](./001-dual-signature-system.md) - Authenticity layer (WHO)
- [ADR-002: Optional Signatures](./002-optional-signatures.md) - Why signatures aren't required
- [ADR-004: AWS KMS Choice](./004-aws-kms-choice.md) - Official signature infrastructure

---

## References

### Risk Classification Standards
- NIST Risk Management Framework
- OWASP Risk Rating Methodology
- CIS Controls Priority Groups

### Similar Approaches
- **GitHub Actions**: Workflow permissions and approval gates
- **Docker**: Security scanning and trust levels
- **npm**: Package risk scoring
- **Kubernetes**: Pod security standards

---

**Last Updated**: 2025-11-06
**Version**: 1.0.0
