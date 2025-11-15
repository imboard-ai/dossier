# Changelog

All notable changes to the Dossier project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Comprehensive documentation restructure following Diataxis framework
- Architecture Decision Records (ADRs) structure
- Root ARCHITECTURE.md for quick reference
- Root CHANGELOG.md for version tracking

### Changed
- Reorganized documentation from root to `docs/` folder
- Moved 20+ markdown files to appropriate `docs/` subdirectories
- Updated documentation to follow OSS best practices

## [@dossier/core@1.0.0] - 2024-11-15

### Added
- Core verification and parsing library
- SHA256 checksum verification
- Minisign signature verification
- AWS KMS signature verification
- TypeScript type definitions

### Dependencies
- `@aws-sdk/client-kms` ^3.927.0
- `tweetnacl` ^1.0.3

## [@dossier/cli@0.1.0] - 2024-11-15

### Added
- Command-line verification tool
- Support for local files and remote URLs
- Verbose mode for detailed output
- Exit codes for scripting integration
- npm publishing configuration
- GitHub Packages publishing support

### Dependencies
- `@dossier/core` ^1.0.0

## [@dossier/mcp-server@1.0.0] - 2024-11-15

### Added
- Model Context Protocol server implementation
- Resource discovery for dossiers
- Verification tools for AI agents
- Integration with Claude Code and other MCP clients

### Dependencies
- `@dossier/core` ^1.0.0
- `@modelcontextprotocol/sdk`
- `zod` for schema validation

## [Documentation] - 2024-11-15

### Added
- Getting Started guides
- How-to Guides
- Tutorials structure
- Reference documentation (Protocol, Schema, Specification)
- Explanation documentation (Concepts, FAQ, Security Model)
- Architecture documentation with overview and ADR structure
- Contributing guidelines
- Planning and roadmap documentation

### Infrastructure
- GitHub Actions workflow for automated publishing
- CI/CD pipeline for npm package distribution
- Publishing guide for maintainers

## Earlier History

See git commit history for changes before structured changelog:
```bash
git log --oneline
```

---

## Types of Changes

- **Added** - New features
- **Changed** - Changes in existing functionality
- **Deprecated** - Soon-to-be removed features
- **Removed** - Removed features
- **Fixed** - Bug fixes
- **Security** - Vulnerability fixes

## Release Process

1. Update version in package.json files
2. Update CHANGELOG.md with release notes
3. Commit changes
4. Tag release: `git tag v1.0.0`
5. Push: `git push && git push --tags`
6. GitHub Actions will publish to GitHub Packages

For detailed publishing instructions, see [docs/guides/publishing-packages.md](docs/guides/publishing-packages.md).

[Unreleased]: https://github.com/imboard-ai/dossier/compare/v0.1.0...HEAD
[@dossier/core@1.0.0]: https://github.com/imboard-ai/dossier/releases/tag/v1.0.0
[@dossier/cli@0.1.0]: https://github.com/imboard-ai/dossier/releases/tag/v0.1.0
[@dossier/mcp-server@1.0.0]: https://github.com/imboard-ai/dossier/releases/tag/v1.0.0
