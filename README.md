# Dossier

**Universal standard for LLM-executable automation**

[![License: BSL 1.1](https://img.shields.io/badge/License-BSL%201.1-blue.svg)](./LICENSE)

---

## What is Dossier?

**Dossier** is a universal pattern for creating structured, LLM-executable automation workflows.

Think of it as **"Dockerfile for LLM workflows"** - a standardized way to define tasks that AI agents can execute intelligently.

---

## Core Concept

Instead of writing brittle scripts that handle every edge case, write **clear instructions** that LLM agents follow adaptively.

**Traditional Script** (200+ lines, breaks on edge cases):
```bash
#!/bin/bash
# Complex setup wizard
# Must anticipate everything
./setup.sh
```

**Dossier** (Clear instructions, LLM adapts):
```markdown
# Dossier: Project Setup

## Objective
Initialize project with detected tech stack

## Context to Gather
- Detect: Node.js, Python, or Go?
- Check: Existing config files?

## Actions
1. Copy templates for detected stack
2. Customize based on findings
3. Initialize git if needed

[LLM executes intelligently based on actual project]
```

---

## Key Features

### 🔄 Self-Improving
Dossiers analyze themselves during execution and suggest improvements based on project context.

### 🎯 Universal
Works with any:
- LLM (Claude, GPT-4, Cursor, Copilot)
- Domain (web dev, ML, DevOps, security)
- Language (TypeScript, Python, Go, Rust, etc.)
- Framework (or no framework)

### 📋 Structured
Follow standard protocol with:
- Clear objectives
- Context gathering
- Decision points
- Validation
- Safety guidelines

### 🔗 Composable
Dossiers reference other dossiers, creating complex workflows from simple components.

---

## Quick Start

### Using Dossiers

```
"Use the deploy-to-aws dossier to deploy this application"
```

Your LLM reads the dossier and executes it intelligently.

### Writing Dossiers

```bash
# Copy template
cp templates/dossier-template.md my-automation.md

# Fill in:
# - Objective
# - Context to gather
# - Actions to perform
# - Validation steps

# Use it!
"Execute my-automation dossier"
```

---

## Examples

### DevOps
- Deploy to AWS
- Setup Kubernetes cluster
- Configure CI/CD pipeline

### Development
- Initialize new project
- Refactor codebase
- Generate tests

### Data Science
- Setup ML pipeline
- Clean dataset
- Deploy model

### MI6 Framework
- 10 production dossiers for agent organization
- See: [imboard-ai/mi6](https://github.com/imboard-ai/mi6)

---

## Protocol

All dossiers follow the [Dossier Protocol](./PROTOCOL.md):
- Self-improvement analysis
- Safety guidelines
- Standard validation
- Output formats
- LLM execution notes

**Current Version**: 1.0

---

## Tools

- **validate.js** - Validate dossier structure
- **graph.js** - Generate dependency graphs
- **CLI** - Search, validate, execute dossiers

---

## Community

**Dossier is framework-agnostic** - create dossiers for your domain!

### Implementations
- [MI6](https://github.com/imboard-ai/mi6) - Agent organization framework
- [Your project here] - Submit PR to list your dossiers!

### Contributing
- Write dossiers for your use case
- Improve the protocol
- Build tools
- Share examples

See [CONTRIBUTING.md](./CONTRIBUTING.md)

---

## Philosophy

> "Structure for intelligent automation"

Dossiers provide the structure. LLMs provide the intelligence.

Together: Powerful, adaptive, maintainable automation.

---

## License

Business Source License 1.1
- Free for personal, educational, and internal use
- Transitions to Apache 2.0 on 2028-10-01

See [LICENSE](./LICENSE)

---

## About

Created by [ImBoard.ai](https://imboard.ai)
Part of the agent-driven development initiative

---

**🎯 Dossier: Universal LLM Automation**
