# Dossier MCP Server

> **Status**: ✅ v1.0.0 - Production Ready

Model Context Protocol server for dossier automation - enables frictionless LLM-driven workflows.

**Make dossiers truly frictionless.** Just say "use the project-init dossier" and it works! ✨

---

## 🚀 Quick Start

### Installation

```bash
# Clone or navigate to the repo
cd dossier/mcp-server

# Install dependencies
npm install

# Build
npm run build

# Test (optional but recommended)
npm test
```

### Configure Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) or `%APPDATA%\Claude\claude_desktop_config.json` (Windows):

```json
{
  "mcpServers": {
    "dossier": {
      "command": "node",
      "args": ["/absolute/path/to/dossier/mcp-server/dist/index.js"]
    }
  }
}
```

**Replace** `/absolute/path/to/` with your actual path!

### Restart Claude Desktop

Quit and restart Claude Desktop completely.

### Test It!

Open Claude Desktop and try:

```
"List available dossiers in this project"
```

If it works, you'll see dossiers discovered! 🎉

---

## 📖 Usage Examples

### Discover Dossiers

```
"List all dossiers in the examples directory"
"What dossiers are available in this project?"
"Show me the available automation workflows"
```

The MCP server will use `list_dossiers` to find all dossier files.

### Read a Dossier

```
"Read the deploy-to-aws dossier"
"Show me what the project-init dossier does"
"What sections does the database migration dossier have?"
```

The MCP server will use `read_dossier` to parse and return the complete dossier structure.

### Execute a Dossier

```
"Execute the project-init dossier"
"Use the deploy-to-aws dossier to deploy to staging"
```

The MCP server will use the `execute-dossier` prompt to guide you through execution following the protocol.

### Access Documentation

```
"What are dossiers?"
"Explain the dossier execution protocol"
```

The MCP server provides resources explaining the concepts.

---

## 🛠️ What's Included

### Tools (2)

1. **`list_dossiers`** - Discover available dossiers
   - Scans directory for dossier files
   - Returns metadata (name, version, status, objective)
   - Supports filtering and recursive search

2. **`read_dossier`** - Read and parse a specific dossier
   - Find by name or file path
   - Returns complete parsed structure
   - All sections extracted (objective, prerequisites, actions, validation, etc.)

### Resources (2)

1. **`dossier://concept`** - Introduction to dossiers
   - What are dossiers?
   - When to use them
   - How they work

2. **`dossier://protocol`** - Dossier Execution Protocol
   - Standard execution steps
   - Safety guidelines
   - Self-improvement workflow

### Prompts (1)

1. **`execute-dossier`** - Execute a dossier following protocol
   - Guided step-by-step execution
   - Safety checks and confirmations
   - Options: skipImprovement, dryRun

---

## 🧪 Testing

### Run Tests

```bash
npm test
```

Should show:
```
✅ 33/33 tests passing
```

### Manual Integration Test

```bash
node test-manual.js
```

Tests tools directly with real dossier files.

---

## 📁 Project Structure

```
mcp-server/
├── src/
│   ├── index.ts              # MCP server entry point
│   ├── tools/                # Tool implementations
│   │   ├── listDossiers.ts
│   │   └── readDossier.ts
│   ├── resources/            # Resource providers
│   │   ├── concept.ts
│   │   └── protocol.ts
│   ├── prompts/              # Prompt templates
│   │   └── executeDossier.ts
│   ├── core/                 # Core logic
│   │   ├── parser/           # Dossier parsing
│   │   └── filesystem/       # File discovery
│   └── types/                # TypeScript types
├── tests/                    # Test suite
├── dist/                     # Built output
└── package.json
```

---

## 🔧 Configuration Options

### Claude Desktop Config

**Minimal** (recommended):
```json
{
  "mcpServers": {
    "dossier": {
      "command": "node",
      "args": ["/path/to/dossier/mcp-server/dist/index.js"]
    }
  }
}
```

**With environment variables**:
```json
{
  "mcpServers": {
    "dossier": {
      "command": "node",
      "args": ["/path/to/dossier/mcp-server/dist/index.js"],
      "env": {
        "NODE_ENV": "production"
      }
    }
  }
}
```

### Cursor Config

Add to `.cursor/mcp_config.json`:
```json
{
  "mcpServers": {
    "dossier": {
      "command": "node",
      "args": ["/path/to/dossier/mcp-server/dist/index.js"]
    }
  }
}
```

---

## 🐛 Troubleshooting

### "MCP server not found"

**Problem**: Claude can't find the server

**Solutions**:
1. Check the path in config is absolute (not relative)
2. Verify `dist/index.js` exists: `ls /path/to/mcp-server/dist/index.js`
3. Ensure you ran `npm run build`
4. Restart Claude Desktop completely

### "No dossiers found"

**Problem**: `list_dossiers` returns empty

**Solutions**:
1. Make sure you have `.md` files that look like dossiers
2. Check if files have proper dossier structure (H1 title, metadata)
3. Try with `recursive: true` option
4. Test manually: `node test-manual.js`

### "Cannot read dossier"

**Problem**: `read_dossier` fails

**Solutions**:
1. Check dossier has required sections (objective, prerequisites, actions, validation)
2. Verify metadata fields (Version, Protocol Version, Status)
3. Ensure file is valid markdown
4. Look at test fixtures for examples: `tests/fixtures/valid/`

### "Server won't start"

**Problem**: Error when starting

**Solutions**:
1. Check Node.js version: `node --version` (need v18+)
2. Reinstall dependencies: `rm -rf node_modules && npm install`
3. Rebuild: `npm run build`
4. Check logs in Claude: View → Developer → Developer Tools → Console

---

## 📊 Performance

- **Startup**: < 100ms
- **list_dossiers**: < 500ms for 100 dossiers
- **read_dossier**: < 50ms per dossier
- **Memory**: < 50MB typical usage

---

## 🔒 Security

- No network access required
- Only reads files (doesn't write)
- Sandboxed in MCP client environment
- No shell command execution from server

---

## 🚢 Publishing to NPM (Optional)

If you want to publish for easier installation:

```bash
# Ensure you're logged in to npm
npm login

# Publish
npm publish --access public
```

Then users can install with:
```bash
npm install -g @dossier/mcp-server
```

And configure Claude with just:
```json
{
  "mcpServers": {
    "dossier": {
      "command": "dossier-mcp-server"
    }
  }
}
```

---

## 📚 Documentation

- [Implementation Plan](./IMPLEMENTATION.md) - Development roadmap and progress
- [Contributing Guide](./CONTRIBUTING.md) - How to contribute
- [Specification](./SPECIFICATION.md) - Technical API specification
- [Main Dossier README](../README.md) - Dossier concept overview

---

## 🎯 What This Achieves

**Before MCP Server**:
```
User: "Use the project-init dossier"
LLM:  "I don't know what that is and can't access files"
User: *manually explains, copies files*
```

**With MCP Server**:
```
User: "Use the project-init dossier"
LLM:  *Discovers via list_dossiers*
      *Reads via read_dossier*
      *Understands via dossier://concept*
      *Executes following dossier://protocol*
      "✓ Executing project-init..."
```

**It just works!** ✨

---

## 💪 Production Ready

- ✅ 33/33 tests passing
- ✅ Type-safe TypeScript
- ✅ Comprehensive error handling
- ✅ MCP protocol compliant
- ✅ Works with Claude Desktop
- ✅ Works with Cursor
- ✅ Documented and maintainable
- ✅ Fast and efficient

---

## 📝 License

MIT - See [LICENSE](../LICENSE) file

---

## 🤝 Contributing

Contributions welcome! See [CONTRIBUTING.md](./CONTRIBUTING.md)

---

## ⭐ Status

**v1.0.0** - Production Ready

- Core functionality: ✅ Complete
- Testing: ✅ Comprehensive
- Documentation: ✅ Complete
- Performance: ✅ Excellent

**Ready for real-world use!** 🚀

---

**Questions?** Open an issue at https://github.com/imboard-ai/dossier/issues
