# NPM Publishing Plan for Dossier MCP Server

**Version**: 1.0.0
**Package**: `@dossier/mcp-server`
**Status**: Ready to Publish

---

## 📋 Pre-Publishing Checklist

### ✅ Completed

- [x] Version set to 1.0.0
- [x] All tests passing (33/33)
- [x] TypeScript compiles without errors
- [x] Build successful
- [x] Documentation complete
- [x] LICENSE included (MIT)
- [x] package.json configured correctly
- [x] README.md production-ready
- [x] Manual testing verified
- [x] Code reviewed and production-ready

### 📝 Pre-Publish Steps

- [ ] Merge PR to main
- [ ] Pull latest main
- [ ] Final test on main branch
- [ ] Create git tag v1.0.0
- [ ] NPM account setup/verified
- [ ] Ensure you have publish rights to @dossier org

---

## 🚀 Publishing Steps

### 1. Prepare Environment

```bash
# Ensure you're on main branch with latest
git checkout main
git pull origin main

# Navigate to mcp-server
cd mcp-server

# Clean install
rm -rf node_modules package-lock.json
npm install

# Verify tests
npm test

# Verify build
npm run build
```

### 2. NPM Login

```bash
# Login to npm (if not already)
npm login

# Verify you're logged in
npm whoami
```

### 3. Verify Package

```bash
# Do a dry run
npm publish --dry-run

# Check what will be published
npm pack --dry-run
```

**Expected files to publish**:
- `dist/` (compiled JavaScript + declarations)
- `README.md`
- `LICENSE`
- `package.json`

**Should NOT include**:
- `src/` (source TypeScript)
- `tests/`
- `node_modules/`
- `.github/`

### 4. Publish to NPM

```bash
# Publish (for scoped packages, need --access public)
npm publish --access public
```

### 5. Verify Publication

```bash
# Check it's published
npm view @dossier/mcp-server

# Try installing
npm install -g @dossier/mcp-server@1.0.0

# Verify command works
dossier-mcp-server --help || echo "Server runs via stdio"
```

### 6. Tag Release on GitHub

```bash
# Tag the release
git tag -a v1.0.0 -m "v1.0.0 - Production release of Dossier MCP Server"

# Push tag
git push origin v1.0.0

# Create GitHub release (via web UI)
# - Go to https://github.com/imboard-ai/dossier/releases/new
# - Choose tag: v1.0.0
# - Release title: "Dossier MCP Server v1.0.0"
# - Description: Use content from PR_DESCRIPTION.md
```

---

## 📦 Post-Publishing Tasks

### Immediate (Same Day)

- [ ] Update main README to highlight npm installation
- [ ] Tweet/announce the release
- [ ] Post in relevant communities (if any)
- [ ] Monitor npm downloads
- [ ] Watch for issues

### Soon (First Week)

- [ ] Submit to MCP server registry
- [ ] Create demo video
- [ ] Write blog post
- [ ] Update documentation with npm install instructions
- [ ] Create badges (npm version, downloads, etc.)

### Documentation Updates

Update main README.md with npm installation:

```markdown
## Installation

### NPM (Recommended)
```bash
npm install -g @dossier/mcp-server
```

Configure Claude Desktop:
```json
{
  "mcpServers": {
    "dossier": {
      "command": "dossier-mcp-server"
    }
  }
}
```

### From Source
See [mcp-server/README.md](./mcp-server/README.md)
```

---

## 🔧 Package Configuration

### Current package.json Settings

```json
{
  "name": "@dossier/mcp-server",
  "version": "1.0.0",
  "description": "Model Context Protocol server for dossier automation",
  "main": "dist/index.js",
  "bin": {
    "dossier-mcp-server": "./dist/index.js"
  },
  "files": [
    "dist",
    "README.md",
    "LICENSE"
  ],
  "keywords": [
    "mcp",
    "model-context-protocol",
    "dossier",
    "automation",
    "llm",
    "ai",
    "workflow",
    "claude",
    "agent"
  ]
}
```

**Key points**:
- ✅ Scoped package: `@dossier/mcp-server`
- ✅ Executable: `dossier-mcp-server` command
- ✅ Main entry: `dist/index.js`
- ✅ Only ships built code (not source)
- ✅ Keywords optimized for discovery

---

## 🎯 Success Metrics

### Week 1 Goals

- [ ] 50+ downloads
- [ ] 0 critical bugs reported
- [ ] At least 1 positive feedback
- [ ] Works on all major platforms

### Month 1 Goals

- [ ] 500+ downloads
- [ ] 10+ GitHub stars
- [ ] Used in 5+ projects
- [ ] Mentioned in at least 1 blog/tutorial

### 3 Month Goals

- [ ] 2,000+ downloads
- [ ] 50+ GitHub stars
- [ ] Official MCP registry listing
- [ ] v1.1.0 with additional features

---

## 🐛 Post-Launch Support Plan

### Monitoring

- **NPM**: Check download stats daily (first week)
- **GitHub Issues**: Respond within 24 hours
- **Bugs**: Critical fixes within 48 hours

### Communication Channels

- **Issues**: https://github.com/imboard-ai/dossier/issues
- **Discussions**: https://github.com/imboard-ai/dossier/discussions
- **NPM**: Package page feedback

### Update Schedule

- **Patch (1.0.x)**: As needed for bugs (immediate)
- **Minor (1.x.0)**: Monthly for features
- **Major (x.0.0)**: When breaking changes needed

---

## 🔄 Version Strategy

### Current: v1.0.0

**Focus**: Core functionality, stability

**Includes**:
- Tools: list_dossiers, read_dossier
- Resources: concept, protocol
- Prompts: execute-dossier

### Next: v1.1.0 (Planned)

**Potential additions**:
- Registry support tool
- Validation tool
- More resources (specification, examples)
- Performance improvements
- Additional prompts

**Timeline**: 1-2 months

### Future: v2.0.0

**Breaking changes allowed**:
- API redesign if needed
- MCP protocol updates
- Major architecture changes

**Timeline**: 6+ months

---

## 📝 Checklist Before Publishing

### Code Quality

- [x] All tests passing
- [x] No TypeScript errors
- [x] No linting errors
- [x] Build successful
- [x] Manual testing complete

### Documentation

- [x] README.md complete
- [x] API documented
- [x] Examples provided
- [x] Troubleshooting guide
- [x] Installation instructions

### Legal

- [x] LICENSE file present (MIT)
- [x] Copyright notices
- [x] No proprietary code

### Package

- [x] version: 1.0.0
- [x] Correct main entry point
- [x] Bin command configured
- [x] Files field correct
- [x] Keywords optimized
- [x] Repository links correct
- [x] prepublishOnly script set

### Testing

- [x] Works on macOS
- [ ] Works on Windows (recommend testing)
- [x] Works on Linux
- [x] Works with Claude Desktop
- [ ] Works with Cursor (recommend testing)

---

## ⚠️ Important Notes

### First Time Publishing

If this is your first time publishing to `@dossier` scope:

1. You need to create the org: `npm org add dossier`
2. Or publish to a different scope/no scope initially
3. Can publish as `dossier-mcp-server` (no scope) first

### Alternatives if @dossier Unavailable

If the `@dossier` scope is taken:

**Option 1**: Different scope
```json
{
  "name": "@your-username/dossier-mcp-server"
}
```

**Option 2**: No scope
```json
{
  "name": "dossier-mcp-server"
}
```

**Option 3**: Different name
```json
{
  "name": "@mcp/dossier-server"
}
```

Check availability:
```bash
npm search @dossier/mcp-server
```

---

## 🎉 Ready to Publish!

**Current Status**: ✅ Ready

**Confidence Level**: **HIGH**

**Recommendation**: Publish after PR merge and verification on main branch.

---

## 📞 Need Help?

- **NPM Docs**: https://docs.npmjs.com/cli/v10/commands/npm-publish
- **Scoped Packages**: https://docs.npmjs.com/about-scopes
- **MCP Registry**: https://github.com/modelcontextprotocol/servers

---

**Let's ship this to the world!** 🚀
