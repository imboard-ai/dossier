# ADR-002: Optional Signatures with Warnings

**Status**: Accepted
**Date**: 2025-11-06
**Deciders**: Security Team, Product Lead
**Consulted**: Community
**Informed**: All stakeholders

---

## Context and Problem Statement

Cryptographic signatures provide authenticity verification, but they also create barriers:
- **Complexity**: Users must generate and manage keys
- **Tooling**: Requires minisign or AWS access
- **Workflow**: Adds steps to dossier creation

**Key Question**: Should cryptographic signatures be REQUIRED or OPTIONAL for dossier execution?

---

## Decision Drivers

### Security Considerations
- Prevent execution of tampered dossiers
- Establish trust chain (know who created it)
- Enable revocation (compromised keys)
- Detect supply chain attacks

### Usability Considerations
- Fast iteration (developers prototyping)
- Low barrier to entry (first-time users)
- Graceful degradation (works without infrastructure)
- Clear risk communication (users understand tradeoffs)

### Ecosystem Considerations
- Community adoption (don't block contribution)
- Enterprise deployment (security teams need guarantees)
- Progressive enhancement (start simple, add security)

---

## Considered Options

### Option 1: Required Signatures (Strict)
**Policy**: Block execution of unsigned dossiers

**Pros**:
- ✅ Maximum security (no unsigned code execution)
- ✅ Forces best practices
- ✅ Clear audit trail (all executions traceable)

**Cons**:
- ❌ Blocks rapid prototyping
- ❌ High barrier for newcomers
- ❌ Breaks existing workflows
- ❌ Creates friction for simple dossiers (e.g., "list files")
- ❌ May discourage community participation

**Example**: Debian package management (requires signatures)

**Verdict**: ❌ Rejected - Too restrictive for open source

---

### Option 2: Optional Signatures (Permissive)
**Policy**: Allow unsigned dossiers with warnings

**Pros**:
- ✅ Low barrier to entry
- ✅ Enables rapid iteration
- ✅ Works offline/airgapped
- ✅ Community-friendly
- ✅ Progressive security (can add signatures later)

**Cons**:
- ❌ Users might ignore warnings
- ❌ Less secure by default
- ❌ Risk of unsigned malicious dossiers

**Example**: npm packages (most aren't signed, rely on registry trust)

**Verdict**: 🤔 Closer, but needs risk mitigation

---

### Option 3: Required Signatures for High-Risk (Hybrid)
**Policy**: Optional signatures, but required for high-risk operations

**Pros**:
- ✅ Balances security and usability
- ✅ Risk-appropriate controls
- ✅ Low barrier for safe operations
- ✅ Strong protection for dangerous operations

**Cons**:
- ⚠️ More complex policy
- ⚠️ Users must understand risk levels
- ⚠️ Edge cases (is this high-risk or not?)

**Example**: Android permissions (dangerous permissions require explicit approval)

**Verdict**: 🤔 Promising, but still has issues

---

### Option 4: Optional Signatures + Strong Risk Warnings ⭐⭐
**Policy**: Signatures optional, but multi-layer defense compensates

**Layers**:
1. **Integrity (REQUIRED)**: SHA256 checksums catch tampering
2. **Signatures (OPTIONAL)**: Authenticity verification available
3. **Risk Metadata (REQUIRED)**: User knows what dossier will do
4. **User Approval (REQUIRED)**: High-risk operations need consent
5. **LLM Guards (REQUIRED)**: Agent must follow security protocol

**Pros**:
- ✅ Defense in depth (signatures are ONE layer, not ONLY layer)
- ✅ Works without signatures (via checksums + approval)
- ✅ Signatures add trust, not just gate
- ✅ Risk-based decision making
- ✅ Community-friendly
- ✅ Enterprise-acceptable (signatures available when needed)

**Cons**:
- ⚠️ Users must actively review (can't be fully automated)
- ⚠️ Social engineering risk (user approves malicious dossier)

**Example**: Docker Hub (unsigned images allowed with warnings, official images signed)

**Verdict**: ✅ **SELECTED** - Best balance of security and usability

---

## Decision

**Signatures are OPTIONAL but RECOMMENDED**:

### Execution Policy

| Checksum       | Signature      | Action            |
|----------------|----------------|-------------------|
| ✅ Valid       | ✅ Trusted     | ALLOW*            |
| ✅ Valid       | ⚠️ Unknown     | WARN + ALLOW**    |
| ✅ Valid       | ❌ None        | WARN + ALLOW**    |
| ✅ Valid       | ❌ Invalid     | BLOCK             |
| ❌ Invalid     | Any            | BLOCK             |

\* Still requires user approval if `risk_level = high/critical`
\*\* Requires user approval + review of dossier content

### Trust Levels

**Unsigned Dossier**:
```text
⚠️ WARNING: UNSIGNED DOSSIER

This dossier is not cryptographically signed. You are trusting:
• The source (e.g., GitHub repository)
• The transport (e.g., HTTPS)
• Your verification of the code

Risk Level: HIGH
Requires Approval: YES

Actions: [Review Code] [Approve] [Cancel]
```

**Signed by Unknown Key**:
```text
⚠️ WARNING: SIGNATURE FROM UNKNOWN KEY

This dossier is signed by: author@example.com
Key: RWTx5V7Kf1KLN8BVF...

This key is NOT in your trusted-keys.txt.

Do you trust this key?
[Add to Trusted Keys] [One-Time Approve] [Cancel]
```

**Signed by Trusted Key**:
```text
✅ VERIFIED SIGNATURE

This dossier is signed by: Imboard AI Security Team
Key: imboard-ai-2024-kms (AWS KMS)
Trust Level: OFFICIAL

Risk Level: MEDIUM
Requires Approval: YES (destructive operations)

[Review Operations] [Approve] [Cancel]
```


### Default Configurations

**For Developers** (~/.dossier/config.json):
```json
{
  "signature_policy": "warn",
  "trust_official_keys": true,
  "require_approval_for": ["high", "critical"],
  "allow_unsigned": true
}
```

**For Enterprises** (org policy):
```json
{
  "signature_policy": "strict",
  "trust_official_keys": true,
  "additional_trusted_keys": ["internal-team-2024"],
  "require_approval_for": ["medium", "high", "critical"],
  "allow_unsigned": false
}
```

---

## Consequences

### Positive
- **Community Adoption**: Low barrier for new users
- **Rapid Iteration**: Developers can test quickly
- **Progressive Security**: Add signatures when publishing
- **Flexibility**: Works in all environments (online, offline, airgapped)
- **Trust Building**: Signatures add credibility, not just gating

### Negative
- **User Responsibility**: Users must actively verify unsigned dossiers
- **Social Engineering**: Attackers can trick users into approving malicious dossiers
- **Inconsistent Security**: Some dossiers signed, some not
- **Education Required**: Users need to understand risks

### Mitigation for Negative Consequences
- **Strong Warnings**: Make unsigned execution scary enough to prompt review
- **Risk Metadata**: Always required, even without signatures
- **Checksums**: Required integrity check catches tampering
- **Default Deny High-Risk**: Unsigned + high-risk = requires explicit approval
- **Education**: Documentation on safe dossier approval practices

---

## Implementation

### Warning UI Examples

```bash
# CLI Warning for Unsigned Dossier
$ node tools/verify-dossier.js unsigned-dossier.md

⚠️  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️   WARNING: UNSIGNED DOSSIER
⚠️  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Title: Deploy to AWS
Risk Level: HIGH
Destructive Operations:
  • Creates or updates AWS infrastructure
  • Modifies IAM roles and security groups

✅ Integrity: PASS (checksum valid)
❌ Authenticity: NONE (no signature)

⚠️  This dossier is NOT signed. Before executing:
   1. Verify the source is trustworthy
   2. Review all commands in the dossier
   3. Ensure you understand what it will do
   4. Consider the risk level (HIGH)

Recommendation: WARN - Requires careful review

Continue? (yes/no): _
```

### MCP Integration

```javascript
// MCP verify_dossier tool response
{
  "integrity": {
    "status": "valid",
    "algorithm": "sha256",
    "hash": "a3b5c8..."
  },
  "authenticity": {
    "status": "unsigned",
    "message": "No cryptographic signature found"
  },
  "risk": {
    "level": "high",
    "factors": ["modifies_cloud_resources", "requires_credentials"]
  },
  "recommendation": "WARN",
  "reason": "Unsigned high-risk dossier requires manual review"
}
```

---

## Validation

### Success Metrics
- **Adoption**: % of community dossiers (target: 50%+ signed within 1 year)
- **Official**: 100% of official dossiers signed
- **Incidents**: Zero execution of tampered unsigned dossiers
- **User Feedback**: Users find warnings clear and actionable

### Monitoring

```bash
# Track signature adoption
find examples/ -name "*.md" | while read f; do
  if grep -q '"signature"' "$f"; then
    echo "SIGNED: $f"
  else
    echo "UNSIGNED: $f"
  fi
done | sort | uniq -c
```

## Future Considerations

### Potential Policy Evolution
Year 1 (Current): Optional signatures, strong warnings

Goal: Build ecosystem, encourage signing
Year 2: Stronger defaults

Official: Require signatures (already have)
High-risk unsigned: Add delay before approval (3-5 seconds)
Unknown signatures: Require explicit key trust decision
Year 3: Stricter policy (if ecosystem matures)

Consider requiring signatures for high-risk
Implement reputation system (signed dossiers get badges)
Transparency log (all signatures publicly auditable)

### Enterprise Override
Some organizations may want stricter policy:

{
  "signature_policy": "required",
  "allowed_signature_types": ["ecdsa-sha256"],
  "block_unsigned": true,
  "block_unknown_signatures": true
}

## Related Decisions
- ADR-001: Dual Signature System - Signature technologies
- ADR-003: Risk Metadata - Risk classification system

## References

### Similar Approaches
- Docker Hub: Unsigned images allowed, official images signed with Notary
- npm: No signature requirement, relies on registry trust
- Homebrew: Signatures optional, uses checksums for integrity
- Debian/RPM: Signatures required for distribution repos
- Python PyPI: Optional signatures (PEP 458/480)

### Security Standards
- NIST SP 800-53: SC-8 (Transmission Confidentiality and Integrity)
- CIS Controls: 2.7 (Allow only authorized software)
- OWASP ASVS: V14.2 (Component verification)

---
**Last Updated**: 2025-11-06
**Version**: 1.0.0