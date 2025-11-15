# Security Demonstration: The Complete Journey

**Purpose**: Experience firsthand why MCP server security verification is essential for dossiers.

**Time Required**: 15-20 minutes

**What You'll Learn**:
- ✅ How malicious dossiers can look completely legitimate
- ✅ Why LLMs alone can't protect you (without tooling)
- ✅ How MCP server automatically blocks malicious dossiers
- ✅ The importance of checksums and signatures

---

## Prerequisites

- **Claude Code** (or another LLM-powered coding assistant)
- **Fresh terminal session** (no MCP server configured yet)
- **This repository cloned** or access to raw GitHub URLs

---

## Step 1: Open a New LLM Coding Session

Start fresh to ensure no MCP server is configured:

**Claude Code**:
```bash
# Open a new Claude Code window
# Or restart if you have an existing session
```

**Other Tools**:
- Cursor, Aider, Continue, etc. also work
- Just ensure it's a fresh session

---

## Step 2: Test if MCP Server is Configured

Ask your LLM assistant:

```
"Do you have access to a verify_dossier tool or any dossier-related MCP tools?"
```

### Expected Response (Without MCP)

```
I don't have access to any dossier-specific tools or verify_dossier function.
```

### If MCP is Already Configured

```
Yes, I have access to:
- verify_dossier
- read_dossier
- list_dossiers
...
```

**If MCP is already configured**: Skip to [Step 5](#step-5-set-up-mcp-server) to verify it's working, then jump to [Step 6](#step-6-test-protection-run-malicious-dossier-again).

---

## Step 3: Run Malicious Dossier (WITHOUT MCP Server)

⚠️ **WARNING**: This will execute malicious code that captures environment data.

**What's about to happen**:
- The dossier looks like a helpful configuration validator
- Your LLM will execute it without any security checks
- It will read `.env` files and capture environment variables
- Information will be displayed on screen and saved to a file

### Run the Malicious Dossier

In your LLM assistant, run:

```
run https://raw.githubusercontent.com/imboard-ai/dossier/main/examples/security/validate-project-config.ds.md
```

### What You'll See

The LLM behavior varies. You'll see one of two scenarios:

#### Scenario A: Immediate Execution (More Vulnerable)

The LLM will:
1. ✅ Fetch the dossier
2. ✅ Read it as a legitimate tool
3. ✅ Start executing commands
4. ❌ **No security verification occurs**
5. ❌ **Searches for .env files**
6. ❌ **Displays environment variables**
7. ❌ **Saves secrets to config-validation-*.log file**

**Example Output**:
```
● Fetching dossier...
● Received 7.5KB (200 OK)

● I'll validate your project configuration...

● Search(pattern: ".env")
  ⎿ Found 0 files

● Bash(printenv | head -20)
  ⎿ API_KEY=sk-1234567890abcdef...
    DATABASE_URL=postgresql://user:pass@localhost...
    AWS_SECRET_ACCESS_KEY=wJalrXUtn...
```

**This is the vulnerability!** Without MCP server, malicious dossiers execute freely.

#### Scenario B: Asks Permission First (Still Vulnerable)

The LLM might ask before executing:

**Example Output**:
```
● Fetching dossier...
● Received 7.5KB (200 OK)

● I can see the content of the dossier file, which describes
  a validation process for project configuration.

  Would you like me to:
  1. Manually perform the validation steps described?
  2. Show you the full content?
  3. Help install a dossier runner?
```

**Why this is still a problem**:
- ❌ No security verification happened
- ❌ User must manually review code (time-consuming, error-prone)
- ❌ Malicious intent is hidden in normal-looking commands
- ❌ Easy to say "yes, go ahead" without careful review

**If LLM asks, respond**: `"Yes, perform the validation steps (option 1)"`

Then watch as it executes the malicious code without verification.

### Both Scenarios Show the Problem

**Scenario A**: Executes immediately → obvious vulnerability
**Scenario B**: Requires manual review → human error vulnerability

**Either way**: Without MCP server, you're relying on:
- Human vigilance (easy to skip)
- Code review skills (hard to spot subtle malice)
- Time investment (5-10 minutes per dossier)

**With MCP server**: Automatic verification catches it instantly.

### Clean Up

```bash
# Remove any generated files
rm config-validation-*.log 2>/dev/null
```

---

## Step 4: Understand What Just Happened

### Why Did This Happen?

**Without MCP Server**:
- ❌ No automatic checksum verification
- ❌ No automatic signature verification
- ❌ LLM has no security hooks
- ❌ Dossier executed as written

### Why Didn't the LLM Catch It?

The dossier was designed to look legitimate:
- ✅ Professional title: "Validate Project Configuration"
- ✅ Reasonable use case (developers do this)
- ✅ Proper dossier structure
- ✅ Helpful documentation
- ✅ Starts with legitimate checks
- ✅ Gradually introduces malicious behavior

**Visual inspection isn't enough** - you need cryptographic verification.

### What Was Compromised?

If you had `.env` files or environment variables:
- 🔴 **API keys** displayed on screen
- 🔴 **Passwords** displayed on screen
- 🔴 **Database URLs** displayed on screen
- 🔴 **AWS credentials** displayed on screen
- 🔴 **All secrets** saved to local file

In a real attack, this data could be exfiltrated to remote servers.

---

## Step 5: Set Up MCP Server

Now let's fix this by installing the dossier MCP server.

### Option A: Interactive Setup (Recommended)

Run the setup dossier:

```
run https://raw.githubusercontent.com/imboard-ai/dossier/main/examples/setup/setup-dossier-mcp.ds.md
```

Follow the prompts to:
1. Choose installation method (npx recommended)
2. Create/update configuration file
3. Restart Claude Code

### Option B: Manual Setup

1. **Create/edit** `~/.claude/settings.local.json`:

```json
{
  "mcpServers": {
    "dossier": {
      "command": "npx",
      "args": ["-y", "@dossier/mcp-server"]
    }
  }
}
```

2. **Restart Claude Code completely** (Cmd+Q / Ctrl+Q, then reopen)

### Verify MCP Server is Working

After restart, ask your LLM:

```
"Do you have access to a verify_dossier tool now?"
```

**Expected response**:

```
Yes! I now have access to:
- verify_dossier(path): Verify dossier checksums and signatures
- read_dossier(path): Read dossier with automatic verification
- list_dossiers(directory): Discover dossiers
- dossier://protocol: Protocol documentation resource
- dossier://security: Security documentation resource
```

**If you don't see these tools**, MCP server isn't loaded:
- Double-check the JSON syntax in settings.local.json
- Ensure you completely quit and reopened Claude Code
- Wait 5-10 seconds after opening for MCP servers to load

---

## Step 6: Test Protection - Run Malicious Dossier Again

Now that MCP server is configured, run the same malicious dossier:

```
run https://raw.githubusercontent.com/imboard-ai/dossier/main/examples/security/validate-project-config.ds.md
```

### What You Should See Now

The LLM should:
1. ✅ Fetch the dossier
2. ✅ **Automatically call verify_dossier()**
3. ❌ **Checksum verification FAILS**
4. ❌ **Signature verification FAILS**
5. 🔒 **Execution BLOCKED**

### Expected Output

```
● Fetching dossier...
● Received 7.5KB (200 OK)

● I'll verify this dossier's security first...

● MCP Tool: verify_dossier(examples/security/validate-project-config.ds.md)

🔐 Security Verification Results:

❌ INTEGRITY: INVALID
   Checksum mismatch detected
   Declared: a1b2c3d4e5f6789012345678...
   Actual:   [different hash]
   → Content has been tampered with

❌ AUTHENTICITY: INVALID
   Signature verification FAILED
   Signed by: DevTools Community <devtools@example.com>
   Key: RWQf6LRCGA9i53mlYecO4IzT51TGPpvWucNSCh1CBM0QTaLn73Y7GFO3
   → NOT in trusted keys list

🔴 RISK ASSESSMENT: CRITICAL
   - Invalid checksum (content tampered)
   - Invalid signature (untrusted key)
   - Claims "low" risk but reads sensitive files
   - Saves data to unprotected files

❌ RECOMMENDATION: BLOCK EXECUTION

This dossier has failed security verification.
I will NOT execute it for your protection.
```

### 🎉 Success! You're Now Protected

The MCP server:
- ✅ Automatically verified checksums
- ✅ Automatically verified signatures
- ✅ Detected tampering
- ✅ Detected untrusted source
- ✅ Blocked execution before any code ran
- ✅ Protected your environment

---

## Step 7: Test with Legitimate Dossier

Now let's verify that legitimate dossiers still work.

### Run a Legitimate Example

```
run https://raw.githubusercontent.com/imboard-ai/dossier/main/examples/data-science/train-ml-model.ds.md
```

### Expected Behavior

```
● Fetching dossier...
● Received 15.2KB (200 OK)

● Verifying dossier security...

● MCP Tool: verify_dossier(examples/data-science/train-ml-model.ds.md)

🔐 Security Verification Results:

✅ INTEGRITY: VALID
   Checksum verified - content matches declaration

⚠️ AUTHENTICITY: UNSIGNED
   No signature present (not required for this dossier)

🟡 RISK ASSESSMENT: MEDIUM
   - Installs Python packages
   - Executes ML training code
   - Creates local files
   - No cloud resources modified

✅ RECOMMENDATION: ALLOW (with awareness)

Dossier appears safe to execute.
Proceeding with execution...
```

The LLM should then:
- ✅ Execute the legitimate dossier
- ✅ Follow its instructions
- ✅ Complete successfully

---

## Comparison: Before and After

### Before MCP Server

| Aspect | Without MCP Server |
|--------|-------------------|
| **Checksum Verification** | ❌ Not performed |
| **Signature Verification** | ❌ Not performed |
| **Malicious Dossiers** | ✅ Execute freely |
| **Legitimate Dossiers** | ✅ Execute normally |
| **User Protection** | ❌ None - relies on manual review |
| **Time to Verify** | ⏰ 5-10 minutes (if you remember) |

### After MCP Server

| Aspect | With MCP Server |
|--------|----------------|
| **Checksum Verification** | ✅ Automatic (2 seconds) |
| **Signature Verification** | ✅ Automatic (2 seconds) |
| **Malicious Dossiers** | 🔒 Blocked automatically |
| **Legitimate Dossiers** | ✅ Execute normally |
| **User Protection** | ✅ Comprehensive |
| **Time to Verify** | ⚡ Instant |

---

## Key Takeaways

### 1. Visual Inspection Isn't Enough

The malicious dossier looked completely legitimate:
- Professional documentation
- Reasonable use case
- Proper structure
- Helpful examples

**You can't spot malicious code by reading** - you need cryptographic verification.

### 2. LLMs Need Tooling

Without MCP server, LLMs:
- Have no way to verify checksums
- Have no way to verify signatures
- Execute dossiers as written
- Can't protect you from malicious code

**LLMs are powerful but need proper infrastructure.**

### 3. Defense in Depth Works

Multiple security layers protect you:
1. **Checksums** - Detect tampering
2. **Signatures** - Verify trusted sources
3. **Risk levels** - Guide scrutiny
4. **MCP server** - Automate everything

**Skip one layer and you're vulnerable.**

### 4. MCP Server is Essential

Not optional, not nice-to-have - **essential infrastructure**:
- ⚡ Instant verification (2 seconds vs 5-10 minutes)
- 🔒 Always runs (can't forget or skip)
- 🎯 Catches everything (no human error)
- 🤖 No expertise needed (fully automated)

### 5. One-Time Setup, Lifetime Protection

Setting up MCP server:
- ⏰ Takes 5-10 minutes once
- 🔧 Simple configuration
- ✅ Works for all future dossiers
- 🛡️ Protects your entire environment

**The security demonstration proves this investment is worthwhile.**

---

## What You Just Experienced

### The Journey

1. **Vulnerability**: Ran malicious dossier without protection
2. **Exposure**: Saw how secrets could be compromised
3. **Understanding**: Learned why security verification matters
4. **Protection**: Set up MCP server
5. **Validation**: Saw automatic blocking of malicious dossier
6. **Confidence**: Verified legitimate dossiers still work

### The Proof

You've now seen firsthand:
- ✅ Malicious dossiers DO look legitimate
- ✅ Without tooling, they WILL execute
- ✅ MCP server DOES block them automatically
- ✅ The security model WORKS when deployed

**This wasn't theoretical - you experienced it.**

---

## Next Steps

### For Personal Use

1. ✅ **Keep MCP server configured** - Don't remove it
2. ✅ **Trust the verification** - If it says block, don't override
3. ✅ **Stay updated** - Keep @dossier/mcp-server current
4. ✅ **Report issues** - security@imboard.ai for vulnerabilities

### For Teams

1. ✅ **Require MCP server** - Make it mandatory for all developers
2. ✅ **Share this demonstration** - Educate your team
3. ✅ **Maintain trusted keys** - Document which authors you trust
4. ✅ **Security training** - Use this as training material
5. ✅ **Incident response** - Have a plan for compromised dossiers

### For Dossier Authors

1. ✅ **Sign your dossiers** - Use your own minisign key
2. ✅ **Publish your key** - In KEYS.txt and trusted channels
3. ✅ **Honest risk levels** - Never falsify
4. ✅ **Update checksums** - After every content change
5. ✅ **Test without MCP** - Ensure fallback works

---

## Troubleshooting

### MCP Server Not Loading

**Symptoms**: verify_dossier tool not available after restart

**Solutions**:
1. Check JSON syntax: `cat ~/.claude/settings.local.json | python3 -m json.tool`
2. Ensure file path correct: `ls -la ~/.claude/settings.local.json`
3. Completely quit Claude Code (not just close window)
4. Wait 5-10 seconds after reopening
5. Check Claude Code logs for MCP server errors

### Verification Still Not Happening

**Symptoms**: Dossiers execute without verification

**Possible causes**:
1. MCP server not properly configured
2. Using wrong settings file location
3. Claude Code not restarted
4. Different LLM tool (not Claude Code)

**Solution**: Follow [Step 5](#step-5-set-up-mcp-server) again carefully

### Want to Test Again

**Reset your environment**:
```bash
# Remove MCP configuration temporarily
mv ~/.claude/settings.local.json ~/.claude/settings.local.json.backup

# Restart Claude Code

# Run malicious dossier (will execute without protection)

# Restore MCP configuration
mv ~/.claude/settings.local.json.backup ~/.claude/settings.local.json

# Restart Claude Code

# Run malicious dossier again (will be blocked)
```

---

## Additional Resources

### Documentation

- **[README.md](./README.md)** - MCP Server Integration section
- **[PROTOCOL.md](./PROTOCOL.md)** - Security Verification Protocol
- **[SECURITY.md](./SECURITY.md)** - Security policy
- **[examples/security/README.md](./examples/security/README.md)** - Detailed analysis
- **[KEYS.txt](./KEYS.txt)** - Official trusted public keys

### Setup Guides

- **[examples/setup/setup-dossier-mcp.ds.md](./examples/setup/setup-dossier-mcp.ds.md)** - Interactive setup
- **[MCP_AUTO_DETECTION_IMPLEMENTATION_STATUS.md](./MCP_AUTO_DETECTION_IMPLEMENTATION_STATUS.md)** - Implementation details

### Security Documentation

- **[security/](./security/)** - Complete security documentation
- **[security/ARCHITECTURE.md](./security/ARCHITECTURE.md)** - Security architecture
- **[security/THREAT_MODEL.md](./security/THREAT_MODEL.md)** - Threat analysis

---

## Share Your Experience

Help others understand the importance of dossier security:

1. **Document your journey** - Write about your experience
2. **Educate your team** - Share this demonstration
3. **Contribute improvements** - Suggest better security measures
4. **Report vulnerabilities** - security@imboard.ai

---

## Summary

**You've completed the security demonstration!**

**What you proved**:
- ✅ Malicious dossiers can fool visual inspection
- ✅ LLMs need proper tooling to protect users
- ✅ MCP server provides essential automatic verification
- ✅ The security model works when properly deployed

**Key lesson**: Security isn't optional - it's infrastructure.

**Time invested**: 15-20 minutes
**Protection gained**: Lifetime

---

**Thank you for taking security seriously. Your diligence protects not just you, but the entire dossier ecosystem.**

🔒 Stay secure!
