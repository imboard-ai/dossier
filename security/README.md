# Dossier Security Documentation

This directory contains comprehensive security documentation for the Dossier project.

## 📋 Quick Links

### Essential Documents

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Complete security architecture and design
- **[THREAT_MODEL.md](./THREAT_MODEL.md)** - Threat analysis and attack scenarios
- **[KEY_MANAGEMENT.md](./KEY_MANAGEMENT.md)** - Cryptographic key lifecycle management
- **[INCIDENT_RESPONSE.md](./INCIDENT_RESPONSE.md)** - Security incident procedures

### Policy & Reporting

- **[../SECURITY.md](../SECURITY.md)** - Vulnerability disclosure policy (root level)
- **[../KEYS.txt](../KEYS.txt)** - Official public keys (root level)

### Architecture Decisions

- **[decisions/](./decisions/)** - Architecture Decision Records (ADRs)
  - [ADR-001: Dual Signature System](./decisions/001-dual-signature-system.md)
  - [ADR-002: Optional Signatures](./decisions/002-optional-signatures.md)
  - [ADR-003: Risk Metadata](./decisions/003-risk-metadata.md)
  - [ADR-004: AWS KMS Choice](./decisions/004-aws-kms-choice.md)

---

## 🎯 Security Overview

Dossiers are executable workflows for LLM agents. They require strong security because:

- They can contain arbitrary commands
- They execute with user permissions
- They may access credentials and sensitive data
- They can be distributed via untrusted channels

### Multi-Layer Defense

```
┌─────────────────────────────────────────────┐
│ Layer 5: LLM Execution Guards               │ ← User approval flows
├─────────────────────────────────────────────┤
│ Layer 4: MCP Verification (Optional)        │ ← Automated security checks
├─────────────────────────────────────────────┤
│ Layer 3: Cryptographic Signatures (Opt.)    │ ← Authenticity verification
│           • AWS KMS (official dossiers)     │
│           • minisign (community dossiers)   │
├─────────────────────────────────────────────┤
│ Layer 2: Integrity Checks (REQUIRED)        │ ← SHA256 checksums
├─────────────────────────────────────────────┤
│ Layer 1: Risk Metadata (REQUIRED)           │ ← Risk classification
└─────────────────────────────────────────────┘
```

### Security Principles

1. **Defense in Depth** - Multiple independent security layers
2. **Trust but Verify** - Cryptographic proof over assumptions
3. **Risk-Based Decisions** - High-risk operations require approval
4. **Secure by Default** - Safe defaults, opt-in to elevated risk
5. **Transparency** - All security decisions documented and auditable
6. **Zero Trust** - Verify everything, trust nothing implicitly

---

## 🔐 Key Security Features

### 1. Integrity Verification (REQUIRED)

Every dossier must include a SHA256 checksum:

```json
{
  "checksum": {
    "algorithm": "sha256",
    "hash": "a3b5c8d9e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8"
  }
}
```

**Purpose:** Detect tampering, corruption, or MITM attacks

### 2. Cryptographic Signatures (OPTIONAL)

Dossiers can be signed with two methods:

#### Official Dossiers: AWS KMS (ECDSA-SHA256)

- Private key never leaves AWS HSM
- FIPS 140-2 Level 3 compliance
- Automatic key backup and rotation
- CloudTrail audit logs

#### Community Dossiers: minisign (Ed25519)

- Lightweight (~100KB install)
- No infrastructure required
- Battle-tested (OpenBSD, Homebrew)
- Self-custody of keys

**Purpose:** Verify authenticity and establish trust chain

### 3. Risk Assessment (REQUIRED)

Every dossier declares its risk profile:

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
    "Creates or updates AWS infrastructure",
    "Modifies IAM roles and security groups"
  ]
}
```

**Purpose:** Enable informed consent and risk-based decisions

### 4. Trust Hierarchy

```
┌──────────────────────────────────────────┐
│ HIGH TRUST                               │
│ • AWS KMS signatures                     │
│ • Official imboard-ai keys               │
│ • Verified, cannot be forged             │
├──────────────────────────────────────────┤
│ MEDIUM TRUST                             │
│ • minisign signatures                    │
│ • Trusted community keys                 │
│ • User explicitly opted-in               │
├──────────────────────────────────────────┤
│ LOW TRUST                                │
│ • Unsigned dossiers                      │
│ • Unknown signatures                     │
│ • Integrity check only                   │
├──────────────────────────────────────────┤
│ NO TRUST                                 │
│ • Invalid signatures                     │
│ • Failed checksums                       │
│ • Execution blocked                      │
└──────────────────────────────────────────┘
```

---

## 🛠️ Security Tools

### Signing Tools

```bash
# Sign with minisign (community)
node tools/sign-dossier.js my-dossier.md \
  --key ~/.minisign/my-key.key \
  --key-id my-key-2024

# Sign with AWS KMS (official - CI/CD)
# See .github/workflows/sign.yml
```

### Verification Tools

```bash
# Verify integrity + signatures
node tools/verify-dossier.js my-dossier.md

# Output: ALLOW / WARN / BLOCK recommendation
```

### MCP Tools

```javascript
// Automated verification via MCP
const result = await use_mcp_tool({
  server: "dossier",
  tool: "verify_dossier",
  arguments: {
    path: "examples/devops/deploy-to-aws.md"
  }
});
```

---

## 📊 Threat Coverage

| Threat | Mitigation | Status |
|--------|------------|--------|
| Malicious Instructions | Risk metadata + approval | ✅ Implemented |
| Tampering (MITM) | SHA256 checksums | ✅ Implemented |
| Supply Chain Attacks | Cryptographic signatures | ✅ Implemented |
| Impersonation | Trust hierarchy + key verification | ✅ Implemented |
| Blind Execution | LLM execution guards | ✅ Implemented |
| Key Compromise | Revocation + rotation procedures | ✅ Documented |
| Privilege Escalation | Risk-based approval | ✅ Implemented |
| Insider Threats | Audit trail (CloudTrail) | 🚧 Partial |
| Advanced Persistent Threats | Registry monitoring | 📋 Planned |
| Zero-Day Exploits | Defense in depth | ✅ Implemented |

---

## 🚨 Incident Response

### If you discover a security issue:

- **DO NOT** open a public issue
- **Email:** security@imboard.ai
- **See:** [INCIDENT_RESPONSE.md](./INCIDENT_RESPONSE.md) for procedures

### If we discover a security issue:

1. Private investigation and fix
2. Coordinated disclosure (90 days)
3. Security advisory publication
4. CVE assignment (if applicable)

---

## 📚 Additional Resources

### External Standards

- **OpenSSF:** https://openssf.org/
- **SLSA Framework:** https://slsa.dev/
- **Sigstore:** https://www.sigstore.dev/
- **NIST Cybersecurity Framework:** https://www.nist.gov/cyberframework

### Related Documentation

- `../PROTOCOL.md` - Dossier execution protocol
- `../SCHEMA.md` - JSON Schema documentation
- `../mcp-server/SPECIFICATION.md` - MCP server spec

---

## 🤝 Contributing to Security

We welcome security contributions:

- **Bug Reports:** Via security@imboard.ai
- **Code Reviews:** Security-focused PR reviews
- **Documentation:** Improve security docs
- **Testing:** Security test cases
- **Research:** Threat modeling, penetration testing

See `CONTRIBUTING.md` for general contribution guidelines.

---

## 📞 Contact

- **Security Email:** security@imboard.ai
- **General Issues:** https://github.com/imboard-ai/dossier/issues
- **Discussions:** https://github.com/imboard-ai/dossier/discussions

---

**Last Updated:** 2025-11-06
**Security Version:** 1.0.0
