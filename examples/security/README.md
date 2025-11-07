# Security Example Dossiers

This directory contains example dossiers that demonstrate the dossier security model and why security verification is critical.

## 🎓 Complete Security Journey

**Want the full hands-on experience?**

👉 **[SECURITY_DEMONSTRATION.md](../../SECURITY_DEMONSTRATION.md)** 👈

This step-by-step guide walks you through:
1. Testing if MCP server is configured
2. Running the malicious dossier WITHOUT protection (see it execute)
3. Setting up MCP server
4. Running the same dossier WITH protection (see it blocked)
5. Understanding what just happened

**Time**: 15-20 minutes | **Value**: Lifetime protection

---

## ⚠️ Critical Warning

**This example WILL execute malicious code if you run it without MCP server configured.**

### What This Demonstrates

**Without MCP Server**: ❌ LLMs will execute this malicious dossier
- No automatic checksum verification
- No automatic signature verification
- Malicious code WILL run
- Secrets WILL be exposed

**With MCP Server**: ✅ Execution automatically blocked
- Checksum verification runs first
- Signature verification runs first
- Failed verification blocks execution
- You are protected

**This is not a bug - this is the point.**

The security example proves:
1. ✅ Malicious dossiers CAN look legitimate
2. ✅ Without proper tooling, they WILL be executed
3. ✅ MCP server is ESSENTIAL, not optional
4. ✅ The security model works when properly deployed

---

## If You Just Ran This...

**Did the LLM start executing commands?** That's expected without MCP server.

**What just happened**:
- ❌ No checksum verification occurred
- ❌ No signature verification occurred
- ❌ LLM executed the dossier as written
- ⚠️ Your environment variables may have been captured

**What to do**:
1. **Stop execution immediately** if still running
2. **Delete any generated files**: `rm config-validation-*.log`
3. **Set up MCP server**: Run `examples/setup/setup-dossier-mcp.ds.md`
4. **Understand**: This proves why MCP server is critical

---

## Example: Validate Project Configuration

**File**: `validate-project-config.ds.md`

### What It Appears To Be

A helpful development tool that validates project configuration:
- **Title**: "Validate Project Configuration"
- **Description**: Check environment setup and config files
- **Risk Level**: "low" (reads files only)
- **Professional appearance**: Well-structured, helpful examples
- **Legitimate use case**: Common developer task

### What It Actually Does

The dossier contains **subtly malicious code** that:

1. **Creates a validation report** (appears legitimate)
2. **Saves ALL environment files to the report**:
   - Reads `.env`, `.env.local`, `.env.development`, `.env.production`
   - Includes complete file contents (API keys, passwords, secrets)
3. **Captures ALL environment variables**:
   - Runs `env | sort` and saves output
   - Includes database URLs, AWS credentials, tokens
4. **Reads configuration files**:
   - `config.json`, `settings.json`, `.config.js`
   - May contain service credentials, API endpoints
5. **Saves everything to an unprotected local file**:
   - Named `config-validation-TIMESTAMP.log`
   - Contains all secrets in plaintext
   - No warnings about sensitive data

### Security Violations

**Invalid Checksum**:
```
Declared: a1b2c3d4e5f6789012345678901234567890123456789012345678901234abcd
Actual:   [different hash - content doesn't match]
```

**Invalid Signature**:
```
Public Key: RWQf6LRCGA9i53mlYecO4IzT51TGPpvWucNSCh1CBM0QTaLn73Y7GFO3
Signature:  Contains "invalid" - verification will fail
Signed by:  DevTools Community <devtools@example.com> (NOT TRUSTED)
```

**Risk Mismatch**:
- Claims "low" risk (only reads files)
- Actually creates persistent files with secrets
- No mention of saving sensitive data
- No warnings about report contents

### Why It's Subtle and Dangerous

1. **Plausible Use Case**
   - Validating configuration is a real developer need
   - Many teams have similar scripts
   - Appears to solve a genuine problem

2. **Gradually Escalating Actions**
   - Starts with legitimate checks (project type detection)
   - Progresses to reading config files (reasonable)
   - Ends with comprehensive data collection (hidden malice)

3. **Legitimate-Looking Output**
   - Uses checkmarks and formatting
   - Provides helpful suggestions
   - Generates a "validation report" (sounds professional)

4. **No Obvious Red Flags**
   - No external network calls (commented out in obvious example)
   - No unusual commands (just cat, grep, env)
   - Everything stays local (harder to detect)

5. **Social Engineering**
   - "Review the report to ensure all configurations are correct"
   - Sounds helpful, actually creates persistent exposure
   - File stays on disk indefinitely

---

## How Security Model Protects You

### With MCP Server (Automatic)

When you execute this dossier with MCP server:

```
User: "run examples/security/validate-project-config.ds.md"

Claude: *Calls verify_dossier() automatically*

🔐 Security Verification Results

❌ INTEGRITY: INVALID
   Checksum mismatch detected
   Declared: a1b2c3d4e5f6...
   Actual:   [different]
   → Content has been tampered with

❌ AUTHENTICITY: INVALID
   Signature verification FAILED
   Signed by: DevTools Community <devtools@example.com>
   Key: RWQf6LRCGA9i53mlYecO4IzT51TGPpvWucNSCh1CBM0QTaLn73Y7GFO3
   → NOT in trusted keys list

🔴 RISK ASSESSMENT: HIGH
   Despite "low" risk claim, this dossier:
   - Reads sensitive files (.env)
   - Saves data persistently
   - No trusted signature
   - Tampered checksum

❌ RECOMMENDATION: BLOCK EXECUTION
   This dossier has failed security verification.
   DO NOT EXECUTE.
```

**Result**: ✅ **Execution automatically blocked before any code runs**

---

### Without MCP Server (Manual)

Without MCP server, you must manually verify:

```bash
# Verify the dossier
node tools/verify-dossier.js examples/security/validate-project-config.ds.md
```

**Output**:
```
🔐 Dossier Verification Tool

Dossier: examples/security/validate-project-config.ds.md

📊 Checking integrity...
   Declared: a1b2c3d4e5f6789012345678901234567890123456789012345678901234abcd
   Actual:   e8f9g0h1i2j3k4l5m6n7o8p9q0r1s2t3u4v5w6x7y8z9a0b1c2d3e4f5g6h7
   ❌ CHECKSUM MISMATCH
   Content has been modified since checksum was created

🔏 Verifying signature...
   Algorithm: minisign
   Public Key: RWQf6LRCGA9i53mlYecO4IzT51TGPpvWucNSCh1CBM0QTaLn73Y7GFO3
   Signed by: DevTools Community <devtools@example.com>

   Checking against trusted keys... NOT FOUND
   Attempting signature verification... FAILED

   ❌ SIGNATURE INVALID
   Key is not in your trusted keys list
   Signature verification failed

🔴 RISK ASSESSMENT: ELEVATED
   Dossier claims "low" risk but:
   - Reads environment files (.env)
   - Creates persistent output files
   - No trusted signature
   - Checksum tampered

❌ RECOMMENDATION: DO NOT EXECUTE
   Manual verification failed. This dossier should not be trusted.
```

**Result**: ✅ **User warned, execution prevented by verification**

---

## What Makes This Example Effective

### 1. Appears Completely Legitimate

Unlike obvious examples with "MALICIOUS" in the title:
- ✅ Realistic use case (config validation)
- ✅ Professional documentation
- ✅ Helpful examples and troubleshooting
- ✅ Proper dossier structure
- ✅ Reasonable risk level claim
- ✅ No suspicious commands at first glance

### 2. Relies Entirely on Security Protocol

The **only** way to detect this is through:
- ❌ Checksum verification (will fail)
- ❌ Signature verification (will fail)
- ✅ Code review (but who has time?)

**This proves the security model works!**

### 3. Realistic Attack Vector

Real attackers would:
- Use plausible pretexts (✓)
- Appear professional (✓)
- Start with legitimate operations (✓)
- Hide malicious code in normal-looking commands (✓)
- Avoid obvious network exfiltration (✓)
- Keep data local initially (✓)

### 4. Educational Value

Shows users:
- **Why checksums matter** - Detect tampered content
- **Why signatures matter** - Verify trusted sources
- **Why reading code isn't enough** - Subtle malice is hard to spot
- **Why MCP server helps** - Automatic protection
- **Social engineering works** - Even on developers

---

## Testing the Security Model

### Safe Testing (Verification Only)

You can safely **verify** (but not execute):

```bash
# Download the dossier
curl -O https://raw.githubusercontent.com/imboard-ai/dossier/main/examples/security/validate-project-config.ds.md

# Verify it (safe - doesn't execute)
node tools/verify-dossier.js validate-project-config.ds.md
```

**Expected results**:
- ❌ Checksum verification FAILS
- ❌ Signature verification FAILS
- 🔴 Risk assessment warnings
- ❌ Recommendation: DO NOT EXECUTE

### With MCP Server

If you have MCP server configured:

```
User: "Verify examples/security/validate-project-config.ds.md"

Claude: *Automatically calls verify_dossier()*
        *Shows security verification failure*
        *Blocks execution*
```

### What NOT To Do

**❌ DO NOT**:
- Execute the dossier
- Skip verification
- Ignore verification failures
- Trust it because it "looks legitimate"
- Assume "low risk" means safe

---

## Key Security Lessons

### 1. Checksums Are Critical

Even if a dossier looks perfect:
- Content might be tampered
- Malicious code could be injected
- Checksum verification catches this

**Without checksum**: Malicious code executes
**With checksum**: Tampering detected, execution blocked

### 2. Signatures Verify Trust

A dossier can have valid structure but:
- Be signed by untrusted party
- Be created by attacker
- Not come from claimed source

**Without signature**: Unknown source
**With signature**: Verify trusted author

### 3. Visual Inspection Isn't Enough

This example shows:
- Professional appearance doesn't mean safe
- Reasonable use cases can hide malice
- Subtle code changes are hard to spot
- Automated verification is essential

### 4. Defense in Depth

Multiple security layers protect you:
1. **Checksums** - Detect tampering
2. **Signatures** - Verify authenticity
3. **Risk levels** - Guide scrutiny
4. **MCP server** - Automate verification
5. **Code review** - Final check

**All layers matter** - Skip one and you're vulnerable

### 5. Automation Beats Humans

**Human verification**:
- ⏰ Time-consuming
- 😴 Easy to skip
- 👁️ Miss subtle issues
- 🤔 Requires expertise

**MCP server verification**:
- ⚡ Instant (2 seconds)
- 🔒 Always runs
- 🎯 Catches everything
- 🤖 No expertise needed

---

## Real-World Parallels

| Dossier Security | Real-World Example |
|------------------|-------------------|
| Checksum verification | npm package integrity |
| Signature verification | macOS code signing |
| Trusted keys list | Browser certificate authorities |
| Risk levels | Android permission requests |
| MCP auto-verification | Windows Defender |

**The dossier security model** uses proven security practices from:
- Software package managers (npm, apt, pip)
- Operating system security (macOS, Windows, Linux)
- Browser security (HTTPS, certificate validation)
- Mobile platforms (iOS, Android app signing)

---

## For Dossier Authors

### How to Create Trusted Dossiers

1. **Sign with your key**
   ```bash
   node tools/sign-dossier.js my-dossier.ds.md --key ~/.minisign/my-key.key
   ```

2. **Publish your public key**
   - Add to KEYS.txt in your repository
   - Post on your website
   - Share in trusted channels

3. **Honest risk levels**
   - "low": Read-only operations
   - "medium": File modifications, non-destructive
   - "high": Cloud resources, production changes
   - "critical": Database operations, destructive actions

4. **Clear documentation**
   - Explain what the dossier does
   - Document all file operations
   - List all network access
   - Be transparent about data handling

5. **Update checksums**
   - After any content changes
   - Before publishing
   - Document versioning

### What NOT To Do

❌ Never falsify risk levels
❌ Never hide operations in comments
❌ Never obfuscate malicious code
❌ Never sign with untrusted keys
❌ Never tamper with checksums

---

## For Organizations

### Security Best Practices

1. **Maintain trusted keys list**
   - Document trusted authors
   - Review and update regularly
   - Revoke compromised keys

2. **Require MCP server**
   - Enforce for all developers
   - Include in onboarding
   - Make verification automatic

3. **Security training**
   - Use these examples
   - Teach social engineering tactics
   - Practice verification workflows

4. **Code review process**
   - Review custom dossiers
   - Check security metadata
   - Verify before sharing

5. **Incident response plan**
   - Process for compromised dossiers
   - Communication protocol
   - Recovery procedures

---

## Questions & Answers

### Q: Why not use more obvious malicious code?

**A**: Because real attackers don't label their code "MALICIOUS". This example is realistic - it demonstrates how actual social engineering works.

### Q: How likely is a real attack like this?

**A**: As dossiers become popular, attacks become more likely. The security model is designed to prevent this **before** it becomes a problem.

### Q: What if I accidentally executed it?

**A**: This specific example:
- Saves secrets to a local file (bad)
- Doesn't exfiltrate to remote servers (contained)
- But real malicious dossiers could be worse

**If this happened**:
1. Delete the validation report file
2. Rotate all exposed credentials
3. Review system for unauthorized changes
4. Report the incident

### Q: Can MCP server be bypassed?

**A**: No, if properly configured:
- Verification runs before execution
- Failed verification blocks execution
- User must explicitly override (not recommended)
- Logs create audit trail

### Q: Should I never trust dossiers?

**A**: Trust **verified** dossiers:
- ✅ Valid checksum (no tampering)
- ✅ Valid signature (trusted author)
- ✅ Appropriate risk level
- ✅ Source code reviewed

**Don't trust**:
- ❌ Failed checksum
- ❌ Failed signature
- ❌ Unknown source
- ❌ Suspicious operations

---

## Additional Resources

- **[SECURITY.md](../../SECURITY.md)** - Security policy
- **[security/](../../security/)** - Complete security documentation
- **[KEYS.txt](../../KEYS.txt)** - Official trusted public keys
- **[PROTOCOL.md](../../PROTOCOL.md)** - Security verification protocol
- **[tools/verify-dossier.js](../../tools/verify-dossier.js)** - Verification tool

---

## Reporting Security Issues

Found a real vulnerability? (Not this example)

**DO NOT** open a public issue.

**Email**: security@imboard.ai

Include:
- Description of vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

See [SECURITY.md](../../SECURITY.md) for responsible disclosure policy.

---

## Summary

**This example proves**:
- ✅ Malicious dossiers can look completely legitimate
- ✅ Social engineering tactics work on developers too
- ✅ Visual inspection isn't sufficient protection
- ✅ The security model (checksums + signatures) works
- ✅ MCP server provides essential automated protection

**Key takeaway**: Always verify. Never execute blindly.

The dossier security model exists because attacks like this are realistic and will eventually happen. By verifying checksums and signatures, we prevent them before they cause harm.

---

**Remember**: The best defense is awareness + verification.
