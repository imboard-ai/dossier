# Using Dossier with Claude Code

**Last Updated**: 2025-11-28
**Status**: Active

---

## Overview

The Dossier MCP Server integrates directly with Claude Code, enabling you to execute and create dossiers through natural conversation.

## Quick Start

### 1. Install the MCP Server

Add to your Claude Code settings (Settings → Extensions → MCP Servers):

**Option A: Local Development** (if you have the repository cloned)
```json
{
  "mcpServers": {
    "dossier": {
      "command": "node",
      "args": ["/path/to/dossier/mcp-server/dist/index.js"],
      "cwd": "/path/to/dossier"
    }
  }
}
```

**Option B: NPM Package** (after package is published)
```json
{
  "mcpServers": {
    "dossier": {
      "command": "npx",
      "args": ["@imboard-ai/dossier-mcp"]
    }
  }
}
```

### 2. Restart Claude Code

After adding the configuration, restart Claude Code to load the MCP server.

### 3. Verify Installation

Ask Claude:
```
What dossier tools are available?
```

Claude should list the available tools, resources, and prompts.

---

## Available Prompts

The MCP server provides two prompts accessible via Claude Code's prompt picker:

### `execute-dossier`

Run a dossier with full verification and protocol compliance.

**Arguments:**
- `dossier_path` (required): Path or URL to the dossier file

**What Claude Does:**
1. Verifies integrity (checksum) and signature
2. Reads the dossier content
3. Follows the instructions step by step
4. Reports results

### `create-dossier`

Author a new dossier using the official template.

**Arguments:**
- `title` (required): Title for the new dossier
- `category` (optional): Category (e.g., devops, authoring)
- `risk_level` (optional): Risk level: low, medium, high, critical

**What Claude Does:**
1. Executes the official meta-dossier template
2. Guides you through proper frontmatter structure
3. Helps calculate checksum after completion
4. Optionally assists with signing

---

## Executing a Dossier

### Method 1: Natural Language

Simply ask Claude to execute a dossier:

```
Run the dossier at examples/devops/deploy-to-aws.ds.md
```

```
Execute https://raw.githubusercontent.com/imboard-ai/dossier/main/examples/authoring/create-dossier.ds.md
```

### Method 2: Using the Prompt

Use the `execute-dossier` prompt directly with the path argument.

### Execution Protocol

Claude will follow the Dossier Execution Protocol:

1. **VERIFY** - Check integrity and signature
   - If verification fails: STOP and report the issue
   - If signature is from untrusted source: Ask whether to proceed

2. **READ** - Get the dossier content and metadata

3. **EXECUTE** - Follow the instructions
   - Respect risk_level warnings
   - Ask for confirmation before destructive operations
   - Report progress on each step

4. **REPORT** - Summarize what was accomplished

---

## Creating a Dossier

### Method 1: Natural Language

Ask Claude to create a new dossier:

```
Create a dossier for setting up our CI/CD pipeline
```

```
Help me create a high-risk dossier for database migration
```

### Method 2: Using the Prompt

Use the `create-dossier` prompt with:
- `title`: "CI/CD Pipeline Setup"
- `category`: "devops"
- `risk_level`: "medium"

### What Happens

Claude will:
1. Reference the official meta-dossier at `examples/authoring/create-dossier.ds.md`
2. Guide you through creating proper frontmatter
3. Help structure the instructions
4. Calculate the checksum when done
5. Optionally assist with signing

---

## Available Tools

The MCP server also provides these tools that Claude can use:

| Tool | Description |
|------|-------------|
| `verify_dossier` | Check integrity (checksum) and authenticity (signature) |
| `read_dossier` | Get dossier content and metadata |
| `list_dossiers` | List dossiers in a directory |

---

## Available Resources

Claude can access these resources for context:

| Resource | Description |
|----------|-------------|
| `dossier://concept` | What are dossiers? |
| `dossier://protocol` | How to execute dossiers safely |
| `dossier://security` | Security architecture and trust model |

---

## Troubleshooting

### "Signature verification failed"

The dossier may be from an untrusted source. Options:

1. **Add the signer's key** (if you trust them):
   ```bash
   dossier keys add "<public_key>" "<identifier>"
   ```

2. **Proceed anyway** (with caution):
   - Claude will ask if you want to proceed with an unsigned dossier
   - Review the dossier content before agreeing

### "Checksum mismatch"

The dossier content has been modified since it was signed.

**DO NOT EXECUTE** - the content may have been tampered with.

Ask the dossier author for an updated, properly signed version.

### "MCP server not responding"

1. Check Claude Code settings for correct path
2. Verify the MCP server is built: `cd mcp-server && npm run build`
3. Restart Claude Code
4. Check logs for errors

### "Unknown tool/prompt"

Ensure you're using the latest version of the MCP server:
```bash
cd mcp-server
git pull
npm install
npm run build
```

---

## Examples

### Execute a Remote Dossier

```
Execute the dossier at https://raw.githubusercontent.com/imboard-ai/dossier/main/examples/development/add-git-worktree-support.ds.md
```

### Create a DevOps Dossier

```
Create a dossier called "Deploy to Production" with risk level high and category devops
```

### List Available Dossiers

```
What dossiers are available in this project?
```

### Verify Before Executing

```
First verify, then execute the dossier at ./my-automation.ds.md
```

---

## Security Best Practices

1. **Always let Claude verify** - Don't skip verification for convenience
2. **Review high-risk dossiers** - Read the instructions before confirming execution
3. **Trust keys carefully** - Only add public keys from sources you trust
4. **Check signatures** - Prefer signed dossiers from trusted authors
5. **Understand risk levels** - High/critical dossiers deserve extra scrutiny

---

## Related Documentation

- [Signing Dossiers](./signing-dossiers.md) - How to sign your own dossiers
- [MCP Server README](../../mcp-server/README.md) - Full MCP server documentation
- [Security Architecture](../../security/ARCHITECTURE.md) - Security model details
- [Dossier Protocol](../../PROTOCOL.md) - Complete execution protocol

---

## Changelog

### 2025-11-28
- Initial guide created
- Documented execute-dossier and create-dossier prompts
- Added troubleshooting section

---

**Questions or Issues?**
- GitHub Discussions: https://github.com/imboard-ai/dossier/discussions
- Security Issues: security@imboard.ai
