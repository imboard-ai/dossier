# Architecture Documentation

System architecture, design decisions, and technical deep-dives for the Dossier project.

## Overview

This section contains comprehensive architectural documentation for developers and contributors who want to understand how Dossier is built.

## Contents

- [Overview](overview.md) *(coming soon)* - High-level architecture overview
- [Architecture Decision Records (ADRs)](adr/) - Key design decisions and rationale
- [Diagrams](diagrams/) - Visual representations of system architecture

## System Components

### Core Components
- **@dossier/core** - Verification and parsing library
- **@dossier/cli** - Command-line verification tool
- **@dossier/mcp-server** - Model Context Protocol integration

### File Structure
- Monorepo organization (npm workspaces)
- Package interdependencies
- Build and publish pipeline

### Security Architecture
- Cryptographic verification flow
- Key management (Minisign, AWS KMS)
- Threat model and mitigations

See [../../security/](../../security/) for detailed security architecture.

## Architecture Decision Records

We use ADRs to document significant architectural decisions. Each ADR describes:
- The context and problem
- The decision made
- The consequences and trade-offs

Browse [adr/](adr/) for all architecture decisions.

## Design Principles

1. **Security First**: Cryptographic verification before execution
2. **Simplicity**: Minimal dependencies, clear abstractions
3. **Extensibility**: Plugin architecture for custom verifiers
4. **Standards-Based**: Follow OSS best practices
5. **Developer Experience**: Clear APIs, good documentation

## For Contributors

- **Understanding the codebase**: Start with [Overview](overview.md)
- **Making architectural changes**: Create an ADR in [adr/](adr/)
- **Development setup**: See [../contributing/development-setup.md](../contributing/development-setup.md)
- **Workflows**: Check [../contributing/workflows.md](../contributing/workflows.md)

## External Resources

- [Security Architecture](../../security/ARCHITECTURE.md)
- [Protocol Specification](../reference/protocol.md)
- [Main README](../../README.md)
