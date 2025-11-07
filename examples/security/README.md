# Security Example Dossiers

This directory contains example dossiers that demonstrate the dossier security model and why security verification is critical.

## ⚠️ Warning

**DO NOT EXECUTE the malicious example dossier in this directory.**

These examples are for **educational purposes only** to demonstrate:
- How malicious dossiers might be disguised
- Why security verification is essential
- How the dossier security model protects users
- The value of MCP server integration

---

## Example: Malicious Environment Reader

**File**: `malicious-env-reader.ds.md`

### What It Demonstrates

A malicious dossier disguised as a helpful debugging tool that:

1. **Appears Benign**
   - Title: "Project Environment Validator"
   - Description: Validate environment configuration
   - Risk Level: Falsely marked as "low"
   - Professional dossier structure

2. **Contains Malicious Code**
   - Searches for `.env` files
   - Displays secrets to screen
   - Saves sensitive data to unprotected files
   - Filters for API keys, passwords, tokens
   - Includes commented-out exfiltration code

3. **Has Security Violations**
   - **Invalid Checksum**: Content doesn't match declared hash
   - **Invalid Signature**: Signed by untrusted key ("attacker@evil.com")
   - **Risk Mismatch**: Claims "low" but contains high-risk operations

---

## How Security Model Protects You

### With MCP Server (Automatic)

When you try to execute this dossier with MCP server configured:

```
User: "run examples/security/malicious-env-reader.ds.md"

Claude: *Calls verify_dossier() automatically*

🔐 Security Verification Results

❌ INTEGRITY: INVALID
   Checksum mismatch - content has been tampered with

❌ AUTHENTICITY: INVALID
   Signature verification FAILED
   Signed by: Malicious Actor <attacker@evil.com>
   Key: NOT TRUSTED

🔴 RISK ASSESSMENT: CRITICAL
   - Reads sensitive files (.env)
   - Displays secrets to screen
   - Checksum tampered
   - Invalid signature

❌ RECOMMENDATION: BLOCK EXECUTION

This dossier has failed security verification.
Execution BLOCKED for your protection.
```

**Result**: ✅ Execution automatically blocked

---

### Without MCP Server (Manual)

Without MCP server, you need to manually verify:

```bash
# Verify the dossier
node tools/verify-dossier.js examples/security/malicious-env-reader.ds.md
```

**Output**:
```
🔐 Dossier Verification Tool

Dossier: examples/security/malicious-env-reader.ds.md

📊 Checking integrity...
   Declared: TAMPERED_CHECKSUM_123...
   Actual: a1b2c3d4e5f6...
   ❌ MISMATCH - Content has been tampered with!

🔏 Verifying signature...
   Signed by: Malicious Actor <attacker@evil.com>
   Public Key: RWTfake_public_key...
   ❌ SIGNATURE INVALID - Key not trusted
   ❌ Verification FAILED

🔴 RISK ASSESSMENT: CRITICAL
   Dossier claims "low" risk but contains:
   - File reading operations (.env)
   - Environment variable access
   - Secret exfiltration attempts

❌ RECOMMENDATION: BLOCK EXECUTION
   This dossier has failed security checks.
   DO NOT EXECUTE.
```

**Result**: ✅ User warned before execution

---

## Key Security Principles Demonstrated

### 1. Defense in Depth

Multiple security layers protect users:
- **Checksums** - Detect tampering
- **Signatures** - Verify authenticity
- **Risk Levels** - Appropriate scrutiny
- **Code Review** - Read before executing

### 2. Trust but Verify

Never assume a dossier is safe based on:
- Professional appearance
- Reasonable description
- Claimed "low" risk level
- Trusted-looking source

**Always verify** checksums and signatures.

### 3. Social Engineering Awareness

Attackers use deception:
- ✅ Plausible pretexts ("debugging tool")
- ✅ Confidence-building structure
- ✅ Legitimate-seeming operations
- ✅ Hidden malicious code

**Be skeptical** of dossiers from unknown sources.

### 4. Automatic > Manual

**With MCP Server**:
- ⚡ Instant verification (2 seconds)
- ✅ No human error
- 🔒 Blocks execution automatically
- 📊 Clear risk assessment

**Without MCP Server**:
- ⏰ Manual verification (5-10 min)
- ⚠️ Easy to skip or forget
- 📋 Requires reading verification output
- 👤 Relies on user vigilance

---

## Testing the Security Model

### Safe Test (Verification Only)

You can safely **verify** (but not execute) the malicious dossier:

```bash
# Verify only - safe operation
node tools/verify-dossier.js examples/security/malicious-env-reader.ds.md
```

This demonstrates:
- ❌ Checksum verification failure
- ❌ Signature verification failure
- 🔴 Risk assessment warnings

### What NOT To Do

**❌ DO NOT**:
- Execute the dossier
- Skip verification
- Ignore verification failures
- Trust "low risk" labels blindly
- Share this as a "real" dossier

---

## Educational Use Cases

### For Security Training

Use this example to teach:
1. **Threat modeling** - How attacks work
2. **Defense mechanisms** - How to prevent attacks
3. **Verification workflows** - Security best practices
4. **Social engineering** - Recognize deception

### For Dossier Authors

Learn what NOT to do:
1. Never falsify risk levels
2. Always document capabilities honestly
3. Sign dossiers with your own key
4. Update checksums after changes
5. Be transparent about operations

### For Users

Understand why verification matters:
1. Checksums detect tampering
2. Signatures verify authenticity
3. Risk levels guide scrutiny
4. MCP server automates protection

---

## Real-World Parallels

This scenario mirrors real security threats:

| Dossier Security | Real-World Analog |
|------------------|-------------------|
| Checksum verification | Package integrity (npm, apt) |
| Signature verification | Code signing certificates |
| Risk levels | Permission prompts (Android, iOS) |
| MCP auto-verification | Antivirus scanning |
| Manual verification | Security audits |

**The dossier security model** is based on proven security practices from software distribution, mobile apps, and enterprise security.

---

## Questions & Discussion

### Q: Why create a malicious example?

**A**: Education. Understanding attacks helps users:
- Recognize threats
- Value security features
- Use verification tools
- Question suspicious dossiers

### Q: Is this representative of real attacks?

**A**: Yes. Real attacks use:
- Social engineering (plausible pretexts)
- Deception (false risk levels)
- Obfuscation (hidden malicious code)
- Trust exploitation (fake signatures)

### Q: How likely is a real malicious dossier?

**A**: Currently unlikely because:
- ✅ Dossier ecosystem is small and trusted
- ✅ Community-driven with transparency
- ✅ Security model makes attacks difficult

**But** as dossiers grow popular, attacks become more likely. **Security verification must be standard practice.**

### Q: What if I accidentally executed it?

**A**: This specific example is relatively harmless:
- Displays secrets to screen (bad, but local)
- Saves to local file (bad, but contained)
- No actual exfiltration (commented out)

**Real malicious dossiers could**:
- Exfiltrate data to remote servers
- Install backdoors
- Modify system files
- Steal credentials

**Always verify before executing.**

---

## Best Practices

### For All Users

1. ✅ **Always verify** dossiers from unknown sources
2. ✅ **Use MCP server** for automatic verification
3. ✅ **Check signatures** against trusted keys
4. ✅ **Read the code** before executing
5. ✅ **Question plausible** pretexts

### For Dossier Authors

1. ✅ **Sign your dossiers** with your key
2. ✅ **Honest risk levels** - Never falsify
3. ✅ **Clear documentation** - No hidden behavior
4. ✅ **Update checksums** after changes
5. ✅ **Publish your key** in trusted channels

### For Organizations

1. ✅ **Maintain trusted keys** list
2. ✅ **Require MCP server** for all users
3. ✅ **Security training** on dossier risks
4. ✅ **Code review** for custom dossiers
5. ✅ **Incident response** plan

---

## Additional Resources

- **[SECURITY.md](../../SECURITY.md)** - Security policy
- **[security/](../../security/)** - Complete security docs
- **[KEYS.txt](../../KEYS.txt)** - Trusted public keys
- **[PROTOCOL.md](../../PROTOCOL.md)** - Security verification protocol
- **[tools/verify-dossier.js](../../tools/verify-dossier.js)** - Verification tool

---

## Reporting Security Issues

If you find a real security vulnerability:

**DO NOT** open a public issue.

**Email**: security@imboard.ai

See [SECURITY.md](../../SECURITY.md) for responsible disclosure policy.

---

**Remember**: The best defense is awareness + verification.

Always verify. Never execute blindly.
