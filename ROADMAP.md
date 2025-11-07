# Dossier Roadmap

This roadmap provides a high-level view of the Dossier project's direction. It reflects our current thinking but is not a guarantee of what will be built or when.

**Community input welcome!** Propose changes via RFCs in the `/rfcs` directory or through GitHub discussions.

---

## Current Focus: Q4 2024 – Q1 2025

### 1. Specification Hardening
**Goal**: Make Dossier v1.0 spec production-ready

- **Expand examples** - Add 5-10 diverse, real-world dossiers across domains
- **Conformance testing** - Create test suite for spec compliance
- **Version markers** - Clear stable/draft indicators in documentation
- **Edge case documentation** - Handle composition, rollback, and failure modes
- **Reference implementations** - Document how to build compliant tools

### 2. Security Enhancements
**Goal**: Robust verification and trust model

- **Broader verification** - Extend checksum/signature support to all dossier types
- **Provenance tracking** - Record dossier lineage and modifications
- **Trust UI improvements** - Better presentation of risk levels and signatures
- **Key management tools** - Simplified signing and verification for authors
- **Security audit** - Third-party review of verification implementation
- **Attestation support** - Enable build provenance and supply chain security

### 3. MCP Server Polish
**Goal**: Production-ready MCP integration

- **Error handling** - Better error surfaces and recovery
- **Permission prompts** - Granular user control over operations
- **Performance** - Optimize parsing and verification speed
- **UX improvements** - Clearer status messages and progress indicators
- **Discovery enhancements** - Better natural language dossier search
- **Configuration validation** - Detect and warn about misconfigurations
- **Telemetry (opt-in)** - Usage metrics for improving the server

### 4. Examples & Documentation
**Goal**: Show the breadth of dossier applications

- **Target: 10+ high-signal examples**, each under 15 minutes:
  - DevOps: Kubernetes deploy, Docker compose setup, GitHub Actions workflow
  - ML/Data: Model training, data pipeline, experiment tracking
  - Frontend: Component library, Storybook setup, E2E testing
  - Backend: API testing, database seeding, service deployment
  - Security: Vulnerability scan, secrets audit, compliance check

- **Documentation site** - Versioned spec with Draft/Stable/Deprecated banners
- **Video tutorials** - Walkthrough of key use cases
- **Quick reference** - Cheat sheet for dossier structure
- **Best practices guide** - Patterns and anti-patterns

### 5. Tooling & Integrations
**Goal**: Make dossiers easy to use everywhere

- **CLI improvements** - Better error messages, progress indicators, dry-run mode
- **IDE extensions** - VS Code extension with validation and autocomplete
- **CI/CD templates** - GitHub Actions, GitLab CI, Jenkins examples
- **Registry improvements** - Better search and categorization

---

## Future Priorities (Q2 2025+)

### Composition & Orchestration
- **Dossier composition** - Execute multiple dossiers as a workflow
- **Dependency resolution** - Automatic ordering based on relationships
- **Conditional execution** - Skip/run dossiers based on context
- **Parallel execution** - Run independent dossiers concurrently

### Advanced Validation
- **Post-execution validation** - Verify outcomes after dossier completes
- **Continuous validation** - Monitor deployed systems against success criteria
- **Rollback automation** - Auto-generate and execute rollback dossiers
- **Evidence collection** - Capture artifacts, logs, and metrics as proof

### Community & Ecosystem
- **Dossier registry** - Public catalog of community dossiers
- **Awesome-dossiers** - Curated list of high-quality examples
- **Author profiles** - Track and showcase dossier creators
- **Rating & feedback** - Community ratings and reviews
- **Template library** - Starter templates for common workflows

### Platform Support
- **Additional LLMs** - Explicit guides for Gemini, Mistral, local models
- **Non-MCP integrations** - Direct support in popular AI tools
- **API server** - HTTP API for dossier verification and execution
- **Webhooks** - Trigger dossiers via external events

---

## Nice-to-Haves (Exploratory)

These are ideas we're considering but haven't committed to:

### Infrastructure as Code Examples
- Terraform/OpenTofu sample deploy dossiers
- Pulumi integration examples
- Ansible playbook migration to dossiers
- CloudFormation stack management

### Developer Experience
- **Live preview** - See dossier execution in real-time
- **Debugging tools** - Step through dossier execution
- **Diff visualization** - Show what changed during execution
- **Cost estimation** - Predict LLM token costs before running

### Advanced Security
- **Sandboxed execution** - Run dossiers in isolated environments
- **Policy engine** - Organization-level controls on dossier execution
- **Audit trail** - Complete log of all dossier executions
- **Compliance reporting** - Generate reports for security audits

### Integration Examples
- Slack/Discord bot integration (run dossiers from chat)
- GitHub bot for PR-triggered dossiers
- Jenkins plugin for CI/CD pipelines
- VS Code workspace automation

---

## Past Milestones

### ✅ Completed (Q3 2024)
- Dossier Protocol v1.0 specification
- JSON Schema v1.0.0 for structured metadata
- MCP server initial release
- CLI verification tool
- Security architecture documentation
- Example dossiers: ML training, DB migration, React library, AWS deploy, Git project review
- Templates and validation tools

---

## How to Influence the Roadmap

1. **Open an RFC** for significant feature proposals (`/rfcs`)
2. **Start a discussion** to gauge community interest
3. **Contribute examples** - Show what's possible with dossiers
4. **File issues** for bugs or small feature requests
5. **Share your use cases** - Help us understand real-world needs

---

## Versioning & Stability

- **Protocol versions** follow semantic versioning (currently v1.0)
- **Breaking changes** will be announced well in advance
- **Deprecation policy** - At least 6 months notice before removing features
- **Backward compatibility** - We strive to maintain it whenever possible

---

## Disclaimer

This roadmap is **directional, not a guarantee**. Priorities may shift based on:
- Community feedback and contributions
- Security vulnerabilities or urgent issues
- Resource constraints
- Emerging use cases or technologies

We'll update this roadmap quarterly to reflect current thinking.

---

**Last updated**: November 2024
**Next review**: February 2025

Questions or suggestions? Open a discussion or RFC!
