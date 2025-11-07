# Dossier: Universal LLM Automation Standard

**Dossiers** are intelligent instruction sets that leverage LLM agents to automate complex workflows with adaptability and continuous improvement.

> **🚀 New here?** Jump to [QUICK_START.md](./QUICK_START.md) for a 5-minute guide!

---

## What Are Dossiers?

Instead of writing complex scripts that try to handle every edge case, dossiers provide **clear instructions** that LLM agents (like Claude Code, GPT-4, Cursor, Copilot) can follow intelligently.

### The Concept

Modern developers **already have access to LLMs** in their workflows! So why write brittle shell scripts when we can provide structured guidance for intelligent agents?

**Traditional Approach** (brittle):
```bash
# Complex script with 200+ lines
# Must handle: all project types, all edge cases, all errors
# Breaks when encountering unexpected setup
./setup-wizard.sh
```

**Dossier Approach** (adaptive):
```markdown
# Clear instructions for intelligent agent
# Agent adapts to actual project context
# Handles edge cases naturally through understanding
```

---

## 🔄 Self-Improving Dossiers

Dossiers follow the **Dossier Execution Protocol** ([PROTOCOL.md](./PROTOCOL.md)) which includes a **self-improvement system**.

### How It Works

**Every dossier execution** is an opportunity to improve the dossier:

1. **Before executing**: LLM analyzes dossier quality
2. **Context-aware**: Identifies improvements based on YOUR project
3. **Suggests enhancements**: Proposes specific additions/refinements
4. **You decide**: Accept, iterate, or skip
5. **Continuously improves**: Dossiers get better with each use

**Example**:
```
User: "Use project-init dossier"

LLM: 🔄 Improvement Suggestion
     Your project has Python venv/ but dossier doesn't check for it.
     Should I add Python virtual environment detection? (y/N)

User: "yes"

LLM: ✓ Enhanced dossier with Python support
     ✓ Executing improved version...
```

**Protocol Version**: Each dossier specifies which protocol version it follows (e.g., v1.0)

📚 **Full protocol**: [PROTOCOL.md](./PROTOCOL.md)

---

## 🔒 Security & Trust

Dossiers contain executable instructions, so **security is critical**. The Dossier system includes multiple layers of protection:

### Integrity Verification (Required)

Every dossier includes a **SHA256 checksum** to verify it hasn't been tampered with:

```json
{
  "checksum": {
    "algorithm": "sha256",
    "hash": "a3b5c8d9e1f2..."
  }
}
```

**Before execution**, LLM agents must verify the checksum matches the dossier content. If it doesn't match → **BLOCK execution**.

### Cryptographic Signatures (Optional)

Dossiers can be **signed with minisign** to verify authenticity:

```json
{
  "signature": {
    "algorithm": "minisign",
    "public_key": "RWT...",
    "signature": "...",
    "signed_by": "Imboard AI <security@imboard.ai>"
  }
}
```

**Trust levels:**
- ✅ **VERIFIED**: Signed by a key you trust
- ⚠️  **SIGNED_UNKNOWN**: Valid signature, unknown signer
- ⚠️  **UNSIGNED**: No signature (integrity still checked)
- ❌ **INVALID**: Signature failed → **BLOCK execution**

### Risk Assessment

Every dossier declares its risk level and operations:

```json
{
  "risk_level": "high",
  "risk_factors": ["modifies_cloud_resources", "requires_credentials"],
  "requires_approval": true,
  "destructive_operations": [
    "Creates/updates AWS infrastructure",
    "Modifies IAM roles"
  ]
}
```

**High-risk dossiers require user approval** before execution.

### Verification Tools

```bash
# Verify integrity + authenticity
node tools/verify-dossier.js path/to/dossier.md

# Sign a dossier (authors)
node tools/sign-dossier.js path/to/dossier.md --key your-key.key
```
### Trust Model

Like Docker Hub, Dossier uses **decentralized trust**:
- **Official dossiers**: Signed with AWS KMS by Imboard AI (see [KEYS.txt](./KEYS.txt))
- **Community dossiers**: Signed with minisign by their authors
- **You decide**: Which keys to trust in `~/.dossier/trusted-keys.txt`

📚 **Security Documentation**:
- **[security/](./security/)** - Complete security documentation hub
- **[SECURITY.md](./SECURITY.md)** - Vulnerability disclosure policy
- **[security/ARCHITECTURE.md](./security/ARCHITECTURE.md)** - Security architecture
- **[security/THREAT_MODEL.md](./security/THREAT_MODEL.md)** - Threat analysis
- **[security/KEY_MANAGEMENT.md](./security/KEY_MANAGEMENT.md)** - Key lifecycle management

---

## How to Use Dossiers

> **🎯 New User?** See [QUICK_START.md](./QUICK_START.md) for a complete beginner's guide with examples!
>
> **Quick Start**: Most LLMs don't know about dossiers yet. Choose your path below based on your tools.

### Prerequisites

To use dossiers with an AI assistant, you need **ONE** of:
- ✅ **AI with file access** (Claude Code, Cursor, Aider, etc.)
- ✅ **MCP-compatible tool** with dossier MCP server (see below)
- ✅ **Ability to copy-paste** (works with any LLM)

---

### Method 1: AI Tools with File Access (Recommended)

**For Claude Code, Cursor, Aider, Continue, etc.**

These tools can already read files, so just provide context:

```
"I want to use the dossier automation system. First, read and
understand these files:
- README.md (dossier concept)
- examples/devops/deploy-to-aws.ds.md (example dossier)

Then help me execute the project-init dossier from the dossiers/
directory to initialize this project."
```

The AI will:
1. Learn what dossiers are from the README
2. See an example dossier structure
3. Find and execute your requested dossier

---

### Method 2: MCP Server (Frictionless for Claude Desktop)

**🚀 Coming Soon**: Install the dossier MCP server to enable true natural language:

```bash
# Install MCP server (upcoming)
npx @dossier/mcp-server install

# Then just say:
"Use the project-init dossier"
```

The MCP server provides:
- 📂 Automatic dossier discovery
- 📖 Built-in dossier concept documentation
- 🔍 Registry and relationship awareness
- ✅ Validation and compliance checking

**Status**: MCP server in development. See [mcp-server/](./mcp-server/) for progress.

---

### Method 3: Copy-Paste (Universal - Works Everywhere)

**For ChatGPT, Claude.ai, Gemini, or any LLM:**

#### Quick Start Template

Copy and paste this template to any LLM:

```
I'm using the "dossier" automation system. Dossiers are structured
instructions for AI agents to execute complex workflows intelligently.

Here's the dossier I want you to execute:

[PASTE DOSSIER CONTENT HERE]

Please:
1. Read and understand the dossier structure
2. Validate prerequisites
3. Gather the context specified
4. Execute the actions step-by-step
5. Validate success criteria
6. Report the outcome

Start by confirming you understand the objective and prerequisites.
```

#### Example Usage

1. **Get dossier content**:
   ```bash
   cat dossiers/project-init.md
   ```

2. **Copy the output**

3. **Paste into LLM** with the template above

4. **AI executes** the instructions adaptively

---

### Method 4: Explicit File Reference (AI with File Access)

**For tools that can read files directly:**

```
"Read and execute the dossier at dossiers/project-init.md
to initialize this project. The dossier follows the standard
defined in SPECIFICATION.md."
```

---

## Example Dossier Types

Dossiers can be created for any automation workflow. Here are common categories:

### Project Setup Dossiers
- **project-init** - Initialize project structure
- **dependency-install** - Install dependencies
- **environment-setup** - Configure development environment

### Development Workflow Dossiers
- **feature-start** - Begin new feature development
- **code-review** - Automated code review checklist
- **test-setup** - Configure testing framework

### DevOps Dossiers
- **deployment** - Deploy to production/staging
- **backup** - Create backups
- **monitoring-setup** - Configure monitoring

### Maintenance Dossiers
- **cleanup** - Remove temporary files/structures
- **migration** - Data or code migrations
- **rollback** - Revert changes safely

## Implementations

The dossier standard is designed to be implementation-agnostic. Projects can adopt dossiers in various ways:

- **[Sample Implementation](./examples/sample-implementation/)** - Example showing how to organize and document your dossiers
- **[MI6](https://github.com/imboard-ai/mi6)** - An AI-native project automation framework (early adopter)
- **Your project** - Create your own dossier collection for your specific workflows

Want to create an implementation? See [SPECIFICATION.md](./SPECIFICATION.md) for the formal standard.

---

## 📚 Example Dossiers

This repository includes comprehensive example dossiers demonstrating the standard across diverse domains:

### 🔬 Data Science: ML Training Pipeline
**[examples/data-science/train-ml-model.ds.md](./examples/data-science/train-ml-model.ds.md)**

Train a machine learning model with proper validation, evaluation, and artifact management.

**What it demonstrates**:
- ✅ Computational workflows (not just deployment)
- ✅ Data validation and quality checks
- ✅ Python ecosystem (pandas, scikit-learn, numpy)
- ✅ Iterative experimentation with metrics tracking
- ✅ Artifact management (models, scalers, experiment logs)

**Key features**:
- Auto-detects classification vs regression
- Handles missing values and categorical encoding
- Generates performance metrics and feature importance
- Creates reproducible experiment logs
- Includes complete working Python code

**Perfect for**: Data scientists, ML engineers, analytics teams

---

### 🗄️ Database: Schema Migration
**[examples/database/migrate-schema.ds.md](./examples/database/migrate-schema.ds.md)**

Execute database schema migrations with comprehensive safety checks and rollback capability.

**What it demonstrates**:
- ✅ High-risk stateful operations
- ✅ ACID transaction workflows
- ✅ Multiple database types (PostgreSQL, MySQL, MongoDB, SQLite)
- ✅ Robust rollback procedures
- ✅ Data integrity validation

**Key features**:
- Automatic pre-migration backup
- Dry-run testing before production execution
- Transaction-based migration (where supported)
- Post-migration validation suite
- Complete rollback scripts

**Perfect for**: DevOps engineers, database administrators, backend developers

---

### ⚛️ Frontend Development: React Component Library
**[examples/development/setup-react-library.ds.md](./examples/development/setup-react-library.ds.md)**

Create a production-ready React component library with TypeScript, Storybook, and testing.

**What it demonstrates**:
- ✅ Development tooling setup (not operations)
- ✅ NPM publishing workflow
- ✅ Frontend ecosystem (React, Vite, Storybook)
- ✅ Multi-tool configuration
- ✅ Build optimization

**Key features**:
- TypeScript strict mode with generated type definitions
- Vite bundler with multiple output formats (ESM, CJS)
- Storybook for interactive documentation
- Vitest + React Testing Library
- Complete example components with tests and stories

**Perfect for**: Frontend developers, UI/UX engineers, design system teams

---

### 🚀 DevOps: AWS Deployment
**[examples/devops/deploy-to-aws.ds.md](./examples/devops/deploy-to-aws.ds.md)**

Deploy applications to AWS using Infrastructure as Code with validation and rollback.

**What it demonstrates**:
- ✅ Cloud infrastructure automation
- ✅ Infrastructure as Code (Terraform/CloudFormation)
- ✅ Deployment workflows
- ✅ Environment management

**Perfect for**: DevOps teams, cloud engineers, SREs

---

### 🔍 Git Project Review: LLM-Powered Analysis
**[examples/git-project-review/](./examples/git-project-review/)**

Atomic dossiers that analyze Git projects to surface insights requiring deep code understanding.

**What it demonstrates**:
- ✅ **Real LLM value** - Analysis impossible without understanding context
- ✅ **Atomic & composable** - Small, focused dossiers as building blocks
- ✅ **Dogfooding** - Can be run on the Dossier project itself
- ✅ **Universal utility** - Works on any Git project

**Available dossiers**:
- **readme-reality-check** (~30-60s) - Compares README claims vs actual code
- **onboarding-friction** (~45-90s) - Identifies new contributor pain points
- **architecture-patterns** (~60-90s) - Finds inconsistent patterns and duplication
- **schema-capability-check** (~1-2min) - Meta-tool to explore if features exist

**How to run** (works today):
```
Analyze https://github.com/yourorg/yourproject using:
https://raw.githubusercontent.com/imboard-ai/dossier/main/examples/git-project-review/atomic/readme-reality-check.dossier
```

Your LLM fetches the dossier, analyzes the project, and provides structured output with:
- Specific findings with file:line references
- Evidence-based insights (not speculation)
- Actionable recommendations

**Perfect for**: Maintainers, contributors, auditors analyzing any codebase

**Future vision**: Once composition is supported, these atomics combine into comprehensive audit suites.

---

### Why These Examples Matter

These dossiers prove the **universal applicability** of the dossier standard:

| Domain | Example | Complexity | Risk Level |
|--------|---------|-----------|------------|
| **Data Science** | ML Training | Medium | Low (local) |
| **Database** | Schema Migration | High | **Critical** |
| **Frontend** | React Library | Medium | Low (dev tools) |
| **DevOps** | AWS Deploy | High | High (infrastructure) |
| **Code Analysis** | Git Project Review | Low-Medium | None (read-only) |

**Each example includes**:
- ✅ Real, executable code (not placeholders)
- ✅ Complete before/after examples
- ✅ Comprehensive troubleshooting sections
- ✅ Validation procedures
- ✅ Context detection and decision trees
- ✅ LLM-executable instructions

**Domain diversity proves**:
- Dossiers work for **data processing**, **infrastructure**, **development**, and **analysis**
- Handle both **stateless** (ML training) and **stateful** (database) operations
- Support **local** (React library) and **remote** (AWS) execution
- Scale from **no-risk** (read-only analysis) to **critical** (database migration)
- Demonstrate **composability** (atomic analysis building blocks)

---

## Dossiers vs Scripts

Use **both** dossiers and traditional scripts - each for what they do best:

### Use Dossiers When:
- ✅ Context awareness needed (detect project structure)
- ✅ Decisions required (which templates to use)
- ✅ Adaptation needed (handle unexpected setups)
- ✅ User guidance helpful (explain choices)

### Use Scripts When:
- ✅ Inputs are clear and deterministic
- ✅ Fast execution matters
- ✅ No decisions needed
- ✅ Same operation every time

### Examples

| Task | Approach | Why |
|------|----------|-----|
| Set ENV variable | Script ✅ | Simple, deterministic |
| **Initialize project** | **Dossier** ✅ | Needs to understand project |
| Run benchmarks | Script ✅ | Fixed commands |
| **Setup development** | **Dossier** ✅ | Needs context detection |
| Validate config | Script ✅ | Schema checking |
| **Generate config** | **Dossier** ✅ | Needs intelligence |

---

## Dossier Structure

Every dossier follows this format:

```markdown
# Dossier: [Name]

## Objective
Clear statement of what this accomplishes

## Prerequisites
What must exist before running this dossier

## Context to Gather
What the LLM should analyze in the project:
- Directory structure
- Existing files
- Git repositories
- Configuration files

## Decision Points
Key choices the LLM needs to make:
- Which template to use
- What values to set
- How to handle edge cases

## Actions to Perform
Step-by-step instructions:
1. Do X
2. Do Y
3. Do Z

## Validation
How to verify success:
- Check file X exists
- Verify Y is valid
- Confirm Z works

## Example
Show what the expected result looks like

## Troubleshooting
Common issues and how to resolve them
```

---

## 🔬 Dossier Schema (v1.0.0)

**New in v1.0.0**: Dossiers now support **structured JSON metadata** via frontmatter, providing deterministic validation and tooling foundation.

### The Problem: Inconsistency & Ambiguity

Without a schema, LLMs interpret Dossiers based on training. This creates brittleness:

| **Without Schema** | **With Schema** |
|-------------------|-----------------|
| ❌ Ambiguous - LLM must infer metadata | ✅ Deterministic - explicit machine-readable structure |
| ❌ Brittle - model updates can break execution | ✅ Robust - validated before execution |
| ❌ Isolated - hard to search/categorize programmatically | ✅ Integrated - tooling-ready (CLI, IDE, registries) |
| ❌ Unpredictable costs - unknown tool requirements | ✅ Predictable - know tools/deps before execution |

### What the Schema Provides

1. **Deterministic Parsing**: Extract metadata without LLM interpretation
2. **Fast Validation**: Catch errors before expensive LLM execution
3. **Tooling Foundation**: Enable CLI tools, IDEs, registries, and automation
4. **Searchability**: Discover Dossiers by category, tags, tools, dependencies
5. **Professional Credibility**: Enterprise-ready automation standard

### Schema Format

Dossiers can include JSON frontmatter at the top of the file:

```markdown
---dossier
{
  "dossier_schema_version": "1.0.0",
  "title": "Deploy to AWS",
  "version": "1.0.0",
  "protocol_version": "1.0",
  "status": "Stable",
  "objective": "Deploy application to AWS using Infrastructure as Code",
  "category": ["devops", "deployment"],
  "tags": ["aws", "terraform", "ecs"],
  "tools_required": [
    {
      "name": "terraform",
      "version": ">=1.0.0",
      "check_command": "terraform --version"
    }
  ],
  "risk_level": "high",
  "relationships": {
    "preceded_by": [
      {
        "dossier": "setup-aws-infrastructure",
        "condition": "required",
        "reason": "Infrastructure must exist before deployment"
      }
    ]
  },
  "inputs": {
    "required": [
      {
        "name": "environment",
        "description": "Target environment (dev/staging/production)",
        "type": "string",
        "validation": "^(dev|staging|production)$"
      }
    ]
  }
}
---

# Dossier: Deploy to AWS

[Rest of markdown content...]
```

### Key Schema Features

**Required Fields**:
- `dossier_schema_version`: Schema version (currently `"1.0.0"`)
- `title`: Dossier name
- `version`: Semantic version
- `protocol_version`: Protocol compliance version
- `status`: Lifecycle status (`Draft`, `Stable`, `Deprecated`, `Experimental`)
- `objective`: Clear, measurable goal statement

**Organization & Discovery**:
- `category`: Primary categories (devops, database, development, etc.)
- `tags`: Free-form tags for searchability
- `tools_required`: List of required CLI tools with versions

**Relationships**:
- `preceded_by`: Dossiers that should run before this one
- `followed_by`: Dossiers that should run after
- `alternatives`: Alternative approaches for similar goals
- `conflicts_with`: Incompatible Dossiers
- `can_run_parallel_with`: Dossiers that can execute simultaneously

**Inputs & Outputs**:
- `inputs.required`: Required parameters with validation
- `inputs.optional`: Optional parameters with defaults
- `outputs.files`: Files created/modified
- `outputs.configuration`: Configuration values produced
- `outputs.artifacts`: Generated scripts, logs, reports

**Validation & Safety**:
- `risk_level`: Risk assessment (`low`, `medium`, `high`, `critical`)
- `prerequisites`: Requirements that must be met
- `validation.success_criteria`: Verifiable success conditions
- `rollback`: Rollback capability information

### Validation Tools

Validate Dossiers programmatically before execution:

**Node.js**:
```bash
cd examples/validation
npm install ajv ajv-formats
node validate-dossier.js ../devops/deploy-to-aws.ds.md
```

**Python**:
```bash
pip install jsonschema
python validate-dossier.py ../devops/deploy-to-aws.ds.md
```

**Output**:
```
🔍 Validating: ../devops/deploy-to-aws.ds.md

✓ Frontmatter extracted successfully
  Title: Deploy to AWS
  Version: 1.0.0
  Status: Stable

✅ VALID - Dossier schema is compliant
```

### Backward Compatibility

**Important**: Dossiers without schema frontmatter remain valid and can be executed by LLM agents. The schema is an **enhancement**, not a breaking change.

- ✅ **Legacy Dossiers**: Pure markdown Dossiers still work
- ✅ **Gradual Adoption**: Add schema to new Dossiers first
- ✅ **Dual Format**: Can keep both JSON frontmatter and markdown metadata during transition

### Complete Documentation

- **[SCHEMA.md](./SCHEMA.md)** - Complete schema specification
- **[dossier-schema.json](./dossier-schema.json)** - JSON Schema definition
- **[examples/validation/](./examples/validation/)** - Validation tools and examples
- **[templates/dossier-template.md](./templates/dossier-template.md)** - Updated template with schema

### Example with Schema

See **[examples/devops/deploy-to-aws.ds.md](./examples/devops/deploy-to-aws.ds.md)** for a complete example Dossier with schema frontmatter.

---

## Creating Custom Dossiers

### Naming Convention

**All dossier files should use the `.ds.md` extension** to clearly identify them as dossier files:

```bash
✅ add-git-worktree-support.ds.md
✅ deploy-to-production.ds.md
✅ setup-development-environment.ds.md

❌ setup-project.md  # Could be regular documentation
❌ dossier-deploy.md # Unclear naming
```

**Benefits**:
- Instantly recognizable as dossier files
- Won't be confused with regular documentation
- Tools can easily glob for `**/*.ds.md`
- Follows common patterns (`.test.js`, `.spec.ts`, etc.)

### 1. Use the Template

Start with the dossier template:

```bash
cp templates/dossier-template.md \
   dossiers/my-custom-dossier.ds.md
```

### 2. Follow the Format

Fill in all sections. Be specific and clear. The LLM will follow your instructions literally.

### 3. Test with an LLM

Try your dossier with an AI assistant. Refine based on results.

### 4. Share with Community

Share useful dossiers! Contribute to dossier implementations or create your own collection.

---

## Organizing Multiple Dossiers

As your dossier collection grows, organization becomes important. A **dossier registry** helps document relationships, workflows, and navigation paths.

### Why Use a Registry?

When you have multiple dossiers, a registry provides:
- **Quick reference** - Summary table of all dossiers
- **Journey mapping** - Common workflow paths (e.g., greenfield vs brownfield)
- **Relationship documentation** - Which dossiers depend on or complement each other
- **Navigation guidance** - Help users find the right dossier for their needs
- **Output tracking** - What each dossier produces and what consumes it

### Registry Pattern

A dossier registry typically includes:

1. **Quick Reference Table**
   - List all dossiers with version, purpose, and coupling level
   - Helps users scan available automation

2. **Journey Maps**
   - Group dossiers into common workflows
   - Show sequential paths (e.g., "New Project: init → setup → deploy")
   - Visualize with mermaid diagrams

3. **Relationship Matrix**
   - Document dependencies between dossiers
   - Identify sequential, suggested, or conflicting relationships
   - Note coupling levels (loose, medium, tight)

4. **Output Matrix**
   - Track what files/artifacts each dossier creates
   - Document which other dossiers consume those outputs
   - Helps understand data flow

5. **Navigation Guide**
   - User-centric paths ("I want to..." → recommended dossiers)
   - Makes discovery easier for both humans and LLMs

### Example Registry

See **[examples/sample-implementation/dossiers-registry.md](./examples/sample-implementation/dossiers-registry.md)** for a complete example showing:
- Categorization (Setup, Development, Maintenance)
- Journey mapping (Greenfield vs Brownfield paths)
- Relationship and output matrices
- Coupling level classification
- User-centric navigation

### When to Create a Registry

- **3+ dossiers**: Consider a simple list
- **5+ dossiers**: Add categorization and basic relationships
- **10+ dossiers**: Full registry with journeys and matrices

A well-organized registry makes your dossier collection more discoverable and helps LLMs understand how to chain multiple dossiers together intelligently.

---

## Best Practices

### ✅ Do:
- **Be specific**: "Copy all .md files from tasks/active/" not "get the tasks"
- **Show examples**: Include expected output samples
- **Handle errors**: Include troubleshooting sections
- **Validate results**: Always include validation steps
- **Be LLM-agnostic**: Don't use Claude-specific features

### ❌ Don't:
- **Assume context**: Explicitly state what to check
- **Skip validation**: Always verify the outcome
- **Be vague**: "Set up the project" → too broad
- **Hardcode paths**: Use relative paths or configurable variables
- **Require specific LLM**: Should work with any AI

---

## Examples

### Example 1: AWS Deployment

```
User: "Deploy to AWS staging using the deploy-to-aws dossier"

AI: (Follows deploy-to-aws.ds.md dossier)
    ✓ Detected: AWS credentials configured
    ✓ Found: terraform/ configuration
    ✓ Validated: Staging environment exists
    ✓ Running: terraform plan
    ✓ Confirmed: Changes look safe
    ✓ Executing: terraform apply
    ✓ Verified: Deployment successful
    ✓ Output: Staging URL: https://staging.example.com

    "Deployment complete! Staging is live."
```

### Example 2: Project Setup

```
User: "Initialize this Node.js project using project-init dossier"

AI: (Follows project-init.md dossier)
    ✓ Detected: Node.js project (package.json found)
    ✓ Analyzed: Dependencies and scripts
    ✓ Created: Development environment config
    ✓ Set up: .gitignore with Node.js patterns
    ✓ Initialized: Git repository
    ✓ Created: README.md template

    "Project initialized! Ready for development."
```

### Example 3: Database Migration

```
User: "Run the database migration dossier for the user table changes"

AI: (Follows db-migration.md dossier)
    ✓ Detected: PostgreSQL database
    ✓ Validated: Connection to database
    ✓ Created: Backup of current schema
    ✓ Generated: Migration script
    ✓ Reviewed: Changes with user
    ✓ Applied: Migration successfully
    ✓ Verified: Data integrity maintained

    "Migration complete! Backup saved to backups/schema-2025-11-05.sql"
```

---

## Why This Works

### 1. **Adaptive Intelligence**
LLMs can understand your project's unique structure and adapt dossier instructions accordingly.

### 2. **Less Code to Maintain**
Dossiers are markdown files with instructions, not complex error-prone scripts.

### 3. **Better Error Handling**
LLMs can troubleshoot and retry intelligently rather than crashing on unexpected input.

### 4. **User Trust**
Users see what the AI is doing and can guide the process, unlike opaque scripts.

### 5. **Community Extensible**
Anyone can write a dossier - no shell scripting expertise required.

---

## Troubleshooting

### "The AI didn't follow the dossier correctly"

**Causes**:
- Dossier instructions too vague
- Missing context about project structure
- Edge case not documented

**Solutions**:
- Make instructions more explicit
- Add examples of expected output
- Update dossier with troubleshooting section

---

### "Dossier works with Claude but not GPT-4"

**Cause**: LLM-specific assumptions

**Solution**: Make dossier more explicit:
- Avoid relying on tool-specific features
- Be very clear about file paths
- Include step-by-step validation

---

### "I don't have access to an LLM"

If you don't have an LLM agent:
- Dossiers can still serve as excellent documentation
- Follow dossier steps manually
- Use traditional automation scripts alongside dossiers
- Dossiers provide clear workflow documentation even without AI execution

---

## 🚀 MCP Server (Frictionless Integration)

The **Dossier MCP Server** is in development to make dossier usage truly frictionless with Model Context Protocol integration.

### What It Enables

With the MCP server installed, Claude Desktop (and other MCP-compatible tools) can:
- 📂 **Auto-discover** available dossiers in your project
- 📖 **Understand** the dossier concept automatically
- 🔍 **Navigate** dossier registries and relationships
- ✅ **Execute** dossiers following the standard protocol

### Vision

```
# Instead of explaining and copy-pasting...
User: "Use the project-init dossier"

# The AI just works!
AI: *Discovers dossiers via MCP*
    *Understands concept from resources*
    *Reads and executes*
    "Executing project-init dossier v1.0.0..."
```

### Status & Contributing

- **Specification**: ✅ Complete
- **Implementation**: 🚧 In Progress
- **Contributors**: Welcome!

See [mcp-server/](./mcp-server/) for:
- Full API specification
- Development roadmap
- How to contribute

This is a **community-driven effort** to make LLM automation truly accessible. Help us build the future of AI-powered development workflows!

---

## See Also

- [QUICK_START.md](./QUICK_START.md) - Get started in 5 minutes
- [PROTOCOL.md](./PROTOCOL.md) - Dossier execution protocol
- [SPECIFICATION.md](./SPECIFICATION.md) - Formal dossier specification
- [SCHEMA.md](./SCHEMA.md) - Dossier schema specification (v1.0.0)
- [dossier-schema.json](./dossier-schema.json) - JSON Schema definition
- [mcp-server/](./mcp-server/) - MCP Server for frictionless integration
- [examples/](./examples/) - Example dossier implementations
- [examples/validation/](./examples/validation/) - Schema validation tools
- [Sample Implementation](./examples/sample-implementation/) - Example of organizing dossiers
- [MI6](https://github.com/imboard-ai/mi6) - Community implementation example

---

## Philosophy

> "Agents need structure. Dossiers provide it."

Dossiers embody this philosophy - they give AI agents clear structure and guidance, enabling them to intelligently automate complex workflows that would be brittle to script.

**The dossier standard** enables:
- **Adaptability**: LLMs understand context and adjust behavior
- **Maintainability**: Markdown documentation instead of complex scripts
- **Collaboration**: Clear, readable instructions anyone can contribute to
- **Continuous improvement**: Self-improving through the protocol
- **Universal adoption**: Any project, any workflow, any implementation

---

**🎯 Dossier: Universal LLM Automation Standard**
*Structure your agents. Not your scripts.*
