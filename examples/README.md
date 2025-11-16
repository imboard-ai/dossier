# Dossier Examples Registry

This directory contains example dossiers demonstrating various use cases and patterns for the Dossier protocol.

## Quick Start

Browse the examples below or explore by category. Each example includes links to view the source and access the raw content.

## Examples by Category

### DevOps & Deployment

| Title | Description | Risk Level | Duration | Checksum | Signed | Author | View | Raw URL |
|-------|-------------|------------|----------|----------|--------|--------|------|---------|
| **Deploy to AWS** | Deploy application to AWS using Infrastructure as Code (Terraform/CloudFormation) with validation and rollback capability | High | 15-60 min | ✓ | ✓ | Dossier Team | [View](https://github.com/imboard-ai/dossier/blob/main/examples/devops/deploy-to-aws.ds.md) | [Raw](https://raw.githubusercontent.com/imboard-ai/dossier/main/examples/devops/deploy-to-aws.ds.md) |

### Database

| Title | Description | Risk Level | Duration | Checksum | Signed | Author | View | Raw URL |
|-------|-------------|------------|----------|----------|--------|--------|------|---------|
| **Database Schema Migration** | Execute database schema migrations with comprehensive safety checks, automatic backups, and rollback capability | Critical | 5-120 min | ✓ | ✓ | Dossier Team | [View](https://github.com/imboard-ai/dossier/blob/main/examples/database/migrate-schema.ds.md) | [Raw](https://raw.githubusercontent.com/imboard-ai/dossier/main/examples/database/migrate-schema.ds.md) |

### Development

| Title | Description | Risk Level | Duration | Checksum | Signed | Author | View | Raw URL |
|-------|-------------|------------|----------|----------|--------|--------|------|---------|
| **Add Git Worktree Support** | Restructure a git project to support git worktrees by moving contents into main/ subdirectory and creating worktree registry | High | 5-15 min | ✓ | ✓ | Dossier Team | [View](https://github.com/imboard-ai/dossier/blob/main/examples/development/add-git-worktree-support.ds.md) | [Raw](https://raw.githubusercontent.com/imboard-ai/dossier/main/examples/development/add-git-worktree-support.ds.md) |
| **Setup React Library** | Set up a React component library with TypeScript, Storybook, and publishing workflow | Medium | 10-30 min | ✓ | ✓ | Dossier Team | [View](https://github.com/imboard-ai/dossier/blob/main/examples/development/setup-react-library.ds.md) | [Raw](https://raw.githubusercontent.com/imboard-ai/dossier/main/examples/development/setup-react-library.ds.md) |

### Data Science

| Title | Description | Risk Level | Duration | Checksum | Signed | Author | View | Raw URL |
|-------|-------------|------------|----------|----------|--------|--------|------|---------|
| **Train ML Model** | Train a machine learning model with proper data validation, evaluation, and artifact management | Medium | 5-60 min | ✓ | ✓ | Dossier Team | [View](https://github.com/imboard-ai/dossier/blob/main/examples/data-science/train-ml-model.ds.md) | [Raw](https://raw.githubusercontent.com/imboard-ai/dossier/main/examples/data-science/train-ml-model.ds.md) |

### Security

| Title | Description | Risk Level | Duration | Checksum | Signed | Author | View | Raw URL |
|-------|-------------|------------|----------|----------|--------|--------|------|---------|
| **Validate Project Config** | Validate project configuration files for security issues and best practices | Low | 2-10 min | ✓ | ✓ | Dossier Team | [View](https://github.com/imboard-ai/dossier/blob/main/examples/security/validate-project-config.ds.md) | [Raw](https://raw.githubusercontent.com/imboard-ai/dossier/main/examples/security/validate-project-config.ds.md) |

### Setup

| Title | Description | Risk Level | Duration | Checksum | Signed | Author | View | Raw URL |
|-------|-------------|------------|----------|----------|--------|--------|------|---------|
| **Setup Dossier MCP Server** | Configure Claude Code to use the dossier MCP server for streamlined, secure dossier execution | Low | 5-15 min | ✓ | ✓ | Dossier Team | [View](https://github.com/imboard-ai/dossier/blob/main/examples/setup/setup-dossier-mcp.ds.md) | [Raw](https://raw.githubusercontent.com/imboard-ai/dossier/main/examples/setup/setup-dossier-mcp.ds.md) |

### Git Project Review (Atomic Dossiers)

LLM-powered analysis tools for understanding and improving Git projects. These are small, focused dossiers that can be combined.

| Title | Description | Duration | Checksum | Signed | Author | View | Raw URL |
|-------|-------------|----------|----------|--------|--------|------|---------|
| **README Reality Check** | Compare README promises vs. actual implementation to find documentation drift | ~30-60s | ✓ | ✓ | Dossier Team | [View](https://github.com/imboard-ai/dossier/blob/main/examples/git-project-review/atomic/readme-reality-check.ds.md) | [Raw](https://raw.githubusercontent.com/imboard-ai/dossier/main/examples/git-project-review/atomic/readme-reality-check.ds.md) |
| **Onboarding Friction** | Identify pain points for new contributors and find quick wins | ~45-90s | ✓ | ✓ | Dossier Team | [View](https://github.com/imboard-ai/dossier/blob/main/examples/git-project-review/atomic/onboarding-friction.ds.md) | [Raw](https://raw.githubusercontent.com/imboard-ai/dossier/main/examples/git-project-review/atomic/onboarding-friction.ds.md) |
| **Architecture Patterns** | Find inconsistent patterns and duplication hotspots | ~60-90s | ✓ | ✓ | Dossier Team | [View](https://github.com/imboard-ai/dossier/blob/main/examples/git-project-review/atomic/architecture-patterns.ds.md) | [Raw](https://raw.githubusercontent.com/imboard-ai/dossier/main/examples/git-project-review/atomic/architecture-patterns.ds.md) |
| **Schema Capability Check** | Explore codebase to answer "does it support X?" questions | ~1-2min | ✓ | ✓ | Dossier Team | [View](https://github.com/imboard-ai/dossier/blob/main/examples/git-project-review/atomic/schema-capability-check.ds.md) | [Raw](https://raw.githubusercontent.com/imboard-ai/dossier/main/examples/git-project-review/atomic/schema-capability-check.ds.md) |

See [git-project-review/README.md](./git-project-review/README.md) for detailed usage instructions.

### Validation Tools

| Name | Language | Description | Location |
|------|----------|-------------|----------|
| **validate-dossier.js** | Node.js | Validate dossier files against JSON schema using AJV | [View](https://github.com/imboard-ai/dossier/blob/main/examples/validation/validate-dossier.js) |
| **validate-dossier.py** | Python | Validate dossier files against JSON schema using jsonschema | [View](https://github.com/imboard-ai/dossier/blob/main/examples/validation/validate-dossier.py) |

See [validation/README.md](./validation/README.md) for usage instructions.

### Working Files Pattern

Demonstrates the working files pattern (`.dsw.md`) for tracking execution state alongside immutable dossiers.

| File | Type | Description | Checksum | Signed | Author | View | Raw URL |
|------|------|-------------|----------|--------|--------|------|---------|
| **deploy-application.ds.md** | Dossier | Immutable deployment instructions | ✓ | ✓ | Dossier Team | [View](https://github.com/imboard-ai/dossier/blob/main/examples/working-files/deploy-application.ds.md) | [Raw](https://raw.githubusercontent.com/imboard-ai/dossier/main/examples/working-files/deploy-application.ds.md) |
| **deploy-application.dsw.md** | Working File | Mutable state tracking during execution | N/A | N/A | - | [View](https://github.com/imboard-ai/dossier/blob/main/examples/working-files/deploy-application.dsw.md) | [Raw](https://raw.githubusercontent.com/imboard-ai/dossier/main/examples/working-files/deploy-application.dsw.md) |

See [working-files/README.md](./working-files/README.md) for the complete working files pattern documentation.

## How to Use Examples

### With an LLM Assistant (Claude Code, Cursor, ChatGPT)

You can execute dossiers by asking your LLM assistant:

```
Execute this dossier:
https://raw.githubusercontent.com/imboard-ai/dossier/main/examples/devops/deploy-to-aws.ds.md
```

Or for local files:
```
Execute the dossier at examples/devops/deploy-to-aws.ds.md
```

### With the Dossier MCP Server (Recommended)

First, set up the MCP server using the setup dossier:
```
Execute: examples/setup/setup-dossier-mcp.ds.md
```

Then you can reference dossiers by their resource URI:
```
Run dossier://examples/devops/deploy-to-aws
```

### With Variables

Some dossiers accept variables for customization:

```
Execute this dossier with variables:
https://raw.githubusercontent.com/imboard-ai/dossier/main/examples/git-project-review/atomic/schema-capability-check.ds.md

Variables:
- capability: "Does the schema support referencing other dossier files?"
```

## Understanding the Columns

- **Checksum**: Whether the dossier includes a cryptographic hash for integrity verification (✓ = yes, ✗ = no)
- **Signed**: Whether the dossier is digitally signed for authenticity (✓ = yes, ✗ = no)
- **Author**: The entity that signed the dossier (only shown if signed)

## Understanding Risk Levels

Examples are categorized by risk level to help you understand the potential impact:

- **Low**: Configuration changes, read-only operations
- **Medium**: Creates files, installs packages, moderate system changes
- **High**: Modifies directory structure, cloud resources, or system configuration
- **Critical**: Database operations with potential for data loss

Always review dossiers before execution, especially high and critical risk levels.

## File Types

- **`.ds.md`** - Dossier files (immutable, signed/checksummed instructions)
- **`.dsw.md`** - Working files (mutable state tracking)
- **`.js`** / **`.py`** - Validation tools and utilities
- **`README.md`** - Documentation and usage guides

## Contributing

To add a new example:

1. Create your dossier following the [schema](../SCHEMA.md)
2. Add appropriate metadata (title, description, risk level, etc.)
3. Include a checksum for integrity verification
4. Test your dossier in a safe environment
5. Add entry to this registry with all required columns
6. Submit a pull request

See [SPECIFICATION.md](../SPECIFICATION.md) for dossier authoring guidelines.

## Related Documentation

- [Dossier Schema](../SCHEMA.md) - Complete schema specification
- [Protocol Documentation](../PROTOCOL.md) - Execution protocol
- [Specification](../SPECIFICATION.md) - Authoring guidelines
- [Security Architecture](../security/ARCHITECTURE.md) - Security model

## Quick Links

- **Browse on GitHub**: https://github.com/imboard-ai/dossier/tree/main/examples
- **Main Repository**: https://github.com/imboard-ai/dossier
- **Documentation**: https://github.com/imboard-ai/dossier/tree/main/docs

---

**Last Updated**: 2025-11-16
**Total Examples**: 15 files (12 dossiers, 2 validation tools, 1 working file demo)
**Checksummed**: 12/12 dossiers
**Signed**: 12/12 dossiers (AWS KMS ECDSA-SHA-256)
