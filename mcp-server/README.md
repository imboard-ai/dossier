# Dossier MCP Server

> **Status**: 🚧 In Development - Specification complete, implementation in progress

Make dossier automation truly frictionless with Model Context Protocol integration.

---

## The Problem

Currently, using dossiers requires explaining the concept and providing file contents to your LLM:

```
❌ Current Reality:
User: "Use the project-init dossier"
LLM:  "I don't know what a dossier is, and I can't access that file"

User: *Explains dossiers, copies file content, pastes it*
LLM:  "OK, now I understand. Let me execute this..."
```

This creates friction for new users and breaks the promise of natural language automation.

---

## The Solution

The **Dossier MCP Server** enables LLMs to discover, understand, and execute dossiers automatically:

```
✅ With MCP Server:
User: "Use the project-init dossier"
LLM:  *Uses MCP to read concept, find dossier, understand protocol*
LLM:  "Found project-init dossier v1.0.0. Analyzing prerequisites..."
```

---

## What It Provides

### 🛠️ Tools

- **`list_dossiers`** - Discover available dossiers
- **`read_dossier`** - Get dossier content and metadata
- **`get_registry`** - Understand dossier relationships
- **`validate_dossier`** - Check compliance

### 📚 Resources

- **`dossier://concept`** - What are dossiers?
- **`dossier://protocol`** - How to execute them
- **`dossier://specification`** - How to create them
- **`dossier://examples`** - Example dossiers

### 💡 Prompts

- **`execute-dossier`** - Run a dossier following protocol
- **`create-dossier`** - Author a new dossier
- **`improve-dossier`** - Enhance existing dossiers

---

## Installation

### For End Users

**Using with Claude Desktop:**

1. Install the MCP server:
```bash
npm install -g @dossier/mcp-server
```

2. Configure Claude Desktop (`~/Library/Application Support/Claude/claude_desktop_config.json`):
```json
{
  "mcpServers": {
    "dossier": {
      "command": "npx",
      "args": ["@dossier/mcp-server"]
    }
  }
}
```

3. Restart Claude Desktop

4. Try it:
```
"List available dossiers in this project"
"Execute the project-init dossier"
```

**Using with Cursor:**

1. Install the MCP server (same as above)

2. Configure Cursor (`.cursor/mcp_config.json`):
```json
{
  "mcpServers": {
    "dossier": {
      "command": "npx",
      "args": ["@dossier/mcp-server"]
    }
  }
}
```

3. Restart Cursor

---

## Example Usage

### Discovery

```
User: "What dossiers are available in this project?"

LLM: *Uses list_dossiers tool*
     Found 5 dossiers:
     - project-init (Setup) - Initialize project structure
     - environment-setup (Setup) - Configure development environment
     - deploy-to-aws (DevOps) - Deploy to AWS with validation
     - run-tests (Development) - Execute test suite
     - cleanup (Maintenance) - Remove temporary files
```

### Execution

```
User: "Use the project-init dossier"

LLM: *Uses read_dossier tool to get content*
     *Uses dossier://protocol resource to understand execution*

     Executing: project-init dossier v1.0.0

     Prerequisites:
     ✓ Directory is writable
     ✓ Git is installed

     Context Analysis:
     - Detected: Node.js project (package.json found)
     - Framework: Express.js
     - TypeScript: Yes

     Decision: Using Node.js + TypeScript template

     Actions:
     ✓ Created .gitignore
     ✓ Created tsconfig.json
     ✓ Created README.md
     ✓ Initialized Git repository

     Validation:
     ✓ All files created successfully
     ✓ Git repository initialized

     Project initialization complete!
```

### Registry Understanding

```
User: "I want to set up a new project from scratch. What's the recommended workflow?"

LLM: *Uses get_registry tool*

     Based on your project's dossier registry, here's the recommended
     "Greenfield Project Setup" journey:

     1. project-init - Initialize basic structure
     2. environment-setup - Configure dev environment
     3. dependency-install - Install dependencies
     4. test-setup - Set up testing framework

     Would you like me to execute this journey?
```

---

## For Developers

### Project Structure

```
dossier-mcp-server/
├── src/
│   ├── index.ts              # Server entry point
│   ├── tools/                # Tool implementations
│   ├── resources/            # Resource providers
│   ├── prompts/              # Prompt templates
│   ├── parsers/              # Dossier parsing logic
│   └── types/                # TypeScript definitions
├── tests/                    # Test suite
├── examples/                 # Usage examples
└── docs/                     # Additional documentation
```

### Development Setup

```bash
# Clone and install
git clone https://github.com/imboard-ai/dossier.git
cd dossier/mcp-server
npm install

# Build
npm run build

# Test
npm test

# Run locally
npm start
```

### Contributing

See [SPECIFICATION.md](./SPECIFICATION.md) for detailed API design.

Contributions welcome! This is a critical piece of infrastructure for making dossiers truly frictionless.

**Priority areas**:
- [ ] Core tool implementations
- [ ] Resource providers
- [ ] Dossier parser
- [ ] Validation logic
- [ ] Test coverage
- [ ] Documentation

---

## Roadmap

### Phase 1: MVP (v1.0.0) - Target: 2 weeks
- [ ] Basic tools (list, read, get_registry)
- [ ] Core resources (concept, protocol, spec)
- [ ] Execute-dossier prompt
- [ ] Simple validation
- [ ] Working with Claude Desktop

### Phase 2: Enhanced (v1.1.0) - Target: 4 weeks
- [ ] Advanced validation
- [ ] Registry relationship parsing
- [ ] Journey map support
- [ ] Create/improve dossier prompts
- [ ] Comprehensive test suite

### Phase 3: Ecosystem (v1.2.0) - Target: 8 weeks
- [ ] NPM package published
- [ ] VS Code extension
- [ ] Web documentation
- [ ] Community templates
- [ ] Video tutorials

---

## Why This Matters

The Dossier MCP Server is the key to making dossiers **truly universal and frictionless**.

**Without MCP**:
- Users must manually explain dossiers
- Copy-pasting file contents is tedious
- No standardized discovery
- Limited to file-access-capable tools

**With MCP**:
- LLMs understand dossiers automatically
- Discovery is programmatic
- Works with any MCP-compatible tool
- Execution follows standard protocol
- Registry relationships are understood

This transforms dossiers from "interesting idea" to "production-ready automation standard".

---

## Technical Details

- **Protocol**: MCP 1.0
- **Language**: TypeScript
- **Runtime**: Node.js 18+
- **Dependencies**: @modelcontextprotocol/sdk
- **License**: MIT

---

## Links

- [Full Specification](./SPECIFICATION.md)
- [Dossier Standard](../README.md)
- [Examples](../examples/)
- [Contributing Guidelines](./CONTRIBUTING.md)

---

## Status

**Current Phase**: Specification & Design ✅

**Next Steps**:
1. Implement core tools
2. Create resource providers
3. Build parser
4. Add tests
5. Publish to NPM

**Contributors Welcome!** This is a community-driven effort to make LLM automation truly accessible.

---

**Questions or ideas?** Open an issue or start a discussion!
