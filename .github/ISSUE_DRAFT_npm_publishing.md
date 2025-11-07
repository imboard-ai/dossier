# GitHub Issue Draft: Publish CLI and MCP Server packages to npm

**Title:** Publish CLI and MCP Server packages to npm

**Labels:** enhancement

---

## Context

The repository transformation (community files, adopter playbooks, RFC process, etc.) has been completed. However, the documentation currently references local installation paths because the npm packages are not yet published.

## Current State

**Unpublished packages:**
- `@dossier/cli` - Command-line verification tool
- `@dossier/mcp-server` - Model Context Protocol server

**Current workaround:**
Users must clone the repository and use local paths:
```bash
# CLI
git clone https://github.com/imboard-ai/dossier.git
cd dossier/cli
chmod +x bin/dossier-verify
./bin/dossier-verify <dossier-path>

# MCP Server
{
  "mcpServers": {
    "dossier": {
      "command": "node",
      "args": ["/path/to/dossier/mcp-server/dist/index.js"]
    }
  }
}
```

## Desired State

Once packages are published, the experience will be much simpler:

```bash
# CLI - via npx (no install needed)
npx -y @dossier/cli verify <dossier-url>

# Or global install
npm install -g @dossier/cli
dossier-verify <dossier-path>

# MCP Server - via npx
{
  "mcpServers": {
    "dossier": {
      "command": "npx",
      "args": ["-y", "@dossier/mcp-server"]
    }
  }
}
```

## Action Items

### Pre-Publishing
- [ ] Review package.json for both packages
- [ ] Ensure versions are appropriate (0.1.0 or 1.0.0?)
- [ ] Add README.md to each package directory if needed
- [ ] Test installation from tarball locally
- [ ] Verify bin scripts work correctly when installed via npm

### Publishing
- [ ] Publish `@dossier/cli` to npm
- [ ] Publish `@dossier/mcp-server` to npm
- [ ] Verify packages are accessible via `npm view @dossier/cli`
- [ ] Test `npx -y @dossier/cli` works end-to-end

### Post-Publishing Documentation Updates
- [ ] Update README.md "Try it in 30 seconds" section
- [ ] Update docs/adopter-playbooks.md with simpler npm-based installation
- [ ] Update scripts/demo-readme-reality-check.sh to use npx
- [ ] Add npm badge back to README: `[![npm](https://img.shields.io/npm/v/@dossier/cli)](https://www.npmjs.com/package/@dossier/cli)`
- [ ] Update CONTRIBUTING.md with npm installation instructions
- [ ] Update GitHub Actions examples to use npx

## Benefits

1. **Lower adoption friction** - No need to clone repo
2. **Simpler onboarding** - Single command to get started
3. **Better versioning** - Users can pin to specific versions
4. **Professional appearance** - Shows project maturity

## References

- CLI package: `/cli/package.json`
- MCP Server package: `/mcp-server/package.json`
- Current documentation: Uses local paths throughout

---

**Note**: This issue was created after completing the repository transformation. The transformation is production-ready with local paths, but publishing to npm will significantly improve the user experience.

---

## How to Create This Issue

1. Go to https://github.com/imboard-ai/dossier/issues/new
2. Copy the content above (starting from "## Context")
3. Set title: "Publish CLI and MCP Server packages to npm"
4. Add label: "enhancement"
5. Submit
