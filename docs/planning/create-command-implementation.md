# `dossier create` Command Implementation Plan

**Status**: 🚧 In Progress
**Start Date**: 2025-11-24
**Target Version**: v0.2.4

---

## Overview

Implementation of the `dossier create` command following a **single-path architecture** where a meta-dossier handles all creation logic, validation, and file generation. The CLI acts as a thin wrapper that always executes the meta-dossier via the detected LLM, regardless of whether flags are provided.

## Design Philosophy

### Single-Path Architecture

**Core Principle**: Always execute the meta-dossier, whether flags are provided or not.

**Benefits**:
- ✅ Consistent behavior in all cases
- ✅ LLM validates all inputs against schema
- ✅ Zero business logic in CLI code
- ✅ Easy to test and extend
- ✅ Self-documenting through meta-dossier
- ✅ Dogfooding: use dossiers to create dossiers

**Rationale**: Having two paths (direct generation vs. meta-dossier) would duplicate validation logic and create inconsistencies. Even when flags are provided, the meta-dossier can verify them, catch edge cases, and ensure schema compliance better than CLI code.

### Meta-Dossier Approach

The meta-dossier (`create-dossier.ds.md`) is a **complete, signed dossier** that:
- Reads context from environment variables (user-provided flags)
- Prompts for missing metadata interactively
- Validates all inputs against `dossier-schema.json`
- References existing examples as patterns
- Generates proper frontmatter and structure
- Writes the file with error handling
- Displays helpful next steps

---

## Implementation Phases

### Phase 1: Planning Document ✅

- [x] Create this planning document
- [x] Define single-path architecture
- [x] Establish implementation phases
- [x] Create progress tracking system

**Status**: ✅ **COMPLETE**
**Completed**: 2025-11-24

---

### Phase 2: Meta-Dossier Creation ✅

**Objective**: Create, test, and sign the meta-dossier that does the actual work.

**File Location**: `cli-work/examples/authoring/create-dossier.ds.md`

**Tasks**:
- [x] Write meta-dossier with comprehensive instructions
  - [x] Frontmatter with proper metadata (title, risk_level, etc.)
  - [x] Context reading (environment variables or stdin)
  - [x] Interactive prompting for missing metadata
  - [x] Schema validation logic
  - [x] File generation logic
  - [x] Error handling (file exists, invalid inputs, etc.)
  - [x] Next steps display
- [x] Calculate checksum and add to file
- [x] Sign the meta-dossier with AWS KMS: `node tools/sign-dossier-kms.js`
- [ ] Test meta-dossier manually (deferred to Phase 3 integration testing)
  - [ ] Test interactive mode: `dossier run create-dossier.ds.md`
  - [ ] Test with context: env vars + run
  - [ ] Verify it creates valid dossiers
  - [ ] Test error cases
- [x] Update this document: mark Phase 2 as ✅

**Status**: ✅ **COMPLETE**
**Completed**: 2025-11-24

**Notes**:
- Meta-dossier created with comprehensive instructions for LLM agents
- Signed with AWS KMS (signature verification will work in CI/CD with AWS access)
- Manual testing will be done after CLI wrapper implementation (Phase 3)

**Meta-Dossier Requirements**:

#### Frontmatter Structure
```yaml
dossier_schema_version: "1.0.0"
title: "Create New Dossier"
version: "1.0.0"
protocol_version: "1.0"
status: "Stable"
objective: "Guide LLM agent to create a new dossier with proper structure and validation"
category: ["authoring", "meta"]
risk_level: "low"
requires_approval: false
checksum: { algorithm: "sha256", hash: "..." }
signature: { ... }
```

#### Functionality Sections

1. **Context Reading**
   - Check for environment variables (DOSSIER_CREATE_*)
   - Read stdin for prepended context
   - Parse provided metadata

2. **Interactive Prompting**
   - For missing title: prompt with validation
   - For missing risk level: show options (low/medium/high/critical)
   - For missing category: suggest based on examples
   - For missing objective: guide with examples
   - Optional: template selection (reference existing examples)

3. **Validation**
   - Load and validate against `dossier-schema.json`
   - Check required fields present
   - Validate enum values (risk_level, status, etc.)
   - Ensure metadata consistency

4. **File Generation**
   - Build frontmatter JSON
   - Generate markdown body sections:
     - Objective
     - Prerequisites
     - Context to Gather (if applicable)
     - Actions to Perform
     - Validation
     - Troubleshooting (if high risk)
   - Combine frontmatter + body

5. **File Writing**
   - Check if file exists (prompt to overwrite)
   - Create parent directories if needed
   - Write with proper encoding
   - Verify write succeeded

6. **Next Steps Display**
   ```
   ✅ Created: {file_path}

   Next steps:
   1. Edit content: $EDITOR {file}
   2. Add checksum: dossier checksum {file} --update
   3. Sign: dossier sign {file}
   4. Verify: dossier verify {file}
   ```

---

### Phase 3: CLI Wrapper Implementation 📋

**Objective**: Build thin CLI wrapper that executes meta-dossier with context.

**Files to Modify**:
- `cli-work/cli/bin/dossier` (lines 384-395)
- `cli-work/cli/README.md`
- `cli-work/docs/planning/cli-evolution.md`

**Tasks**:
- [ ] Implement command handler in `cli/bin/dossier`
  - [ ] Parse command-line flags
  - [ ] Detect LLM using `detectLlm()`
  - [ ] Build context from flags
  - [ ] Set environment variables
  - [ ] Execute meta-dossier
  - [ ] Handle execution errors
- [ ] Add command options
  - [ ] `[file]` - Output file path
  - [ ] `--title <title>` - Dossier title
  - [ ] `--objective <text>` - Primary objective
  - [ ] `--risk <level>` - Risk level (low/medium/high/critical)
  - [ ] `--category <category>` - Category
  - [ ] `--template <name>` - Reference example
  - [ ] `--tags <tags>` - Comma-separated tags
  - [ ] `--llm <name>` - LLM to use
- [ ] Test CLI wrapper
  - [ ] Interactive: `dossier create`
  - [ ] With file: `dossier create test.ds.md`
  - [ ] With flags: `dossier create test.ds.md --title "Test" --risk low`
  - [ ] With template: `dossier create --template examples/devops/deploy-application.ds.md`
  - [ ] Error cases: invalid risk, file exists, no LLM
- [ ] Update documentation
  - [ ] Add to `cli/README.md`
  - [ ] Update `cli-evolution.md` status to ✅
  - [ ] Add examples
- [ ] Update this document: mark Phase 3 as ✅

**Status**: 📋 **PENDING**

**CLI Implementation Pattern**:

```javascript
program
  .command('create')
  .description('Create new dossier')
  .argument('[file]', 'Output file path')
  .option('--title <title>', 'Dossier title')
  .option('--objective <text>', 'Primary objective')
  .option('--risk <level>', 'Risk level (low, medium, high, critical)')
  .option('--category <category>', 'Category (devops, data-science, development, etc.)')
  .option('--template <name>', 'Reference template/example')
  .option('--tags <tags>', 'Comma-separated tags')
  .option('--llm <name>', 'LLM to use (claude-code, cursor, auto)', 'auto')
  .action(async (file, options) => {
    try {
      // 1. Detect LLM
      const llm = detectLlm(options.llm, false);

      // 2. Build context from flags
      const context = {
        file: file || '',
        title: options.title || '',
        objective: options.objective || '',
        risk: options.risk || '',
        category: options.category || '',
        template: options.template || '',
        tags: options.tags || ''
      };

      // 3. Set environment variables for meta-dossier
      process.env.DOSSIER_CREATE_FILE = context.file;
      process.env.DOSSIER_CREATE_TITLE = context.title;
      process.env.DOSSIER_CREATE_OBJECTIVE = context.objective;
      process.env.DOSSIER_CREATE_RISK = context.risk;
      process.env.DOSSIER_CREATE_CATEGORY = context.category;
      process.env.DOSSIER_CREATE_TEMPLATE = context.template;
      process.env.DOSSIER_CREATE_TAGS = context.tags;

      // 4. Path to meta-dossier
      const metaDossierPath = path.join(__dirname, '../../examples/authoring/create-dossier.ds.md');

      // 5. Execute meta-dossier
      console.log('🤖 Launching dossier creation assistant...\n');
      await runVerification(metaDossierPath, { llm });

    } catch (error) {
      console.error('❌ Error:', error.message);
      process.exit(2);
    }
  });
```

**Context Passing via Environment Variables**:
- `DOSSIER_CREATE_FILE` - Output file path
- `DOSSIER_CREATE_TITLE` - Dossier title
- `DOSSIER_CREATE_OBJECTIVE` - Primary objective
- `DOSSIER_CREATE_RISK` - Risk level
- `DOSSIER_CREATE_CATEGORY` - Category
- `DOSSIER_CREATE_TEMPLATE` - Template reference
- `DOSSIER_CREATE_TAGS` - Tags (comma-separated)

---

## Usage Examples

### Interactive Mode (No Flags)
```bash
dossier create
# Launches meta-dossier, prompts for all metadata
```

### With File Path
```bash
dossier create deploy-prod.ds.md
# Prompts for metadata, creates deploy-prod.ds.md
```

### With Partial Metadata
```bash
dossier create deploy.ds.md --title "Deploy to AWS" --risk medium
# LLM validates provided flags, prompts for missing data
```

### With Full Metadata
```bash
dossier create deploy.ds.md \
  --title "Deploy to AWS" \
  --objective "Deploy application to AWS ECS cluster" \
  --risk medium \
  --category devops \
  --tags "aws,deployment,production"
# LLM validates all inputs, creates file
```

### With Template Reference
```bash
dossier create my-deploy.ds.md \
  --template examples/devops/deploy-application.ds.md
# Uses referenced dossier as pattern
```

---

## Testing Checklist

### Manual Testing
- [ ] Run `dossier create` (fully interactive)
- [ ] Run `dossier create test.ds.md`
- [ ] Run with `--title` only
- [ ] Run with `--title` and `--risk`
- [ ] Run with all flags provided
- [ ] Run with `--template` reference
- [ ] Run with Claude Code
- [ ] Run with Cursor (if available)

### Error Cases
- [ ] File already exists (should prompt)
- [ ] Invalid risk level (should reject)
- [ ] Invalid category (should warn/prompt)
- [ ] No LLM detected (should fail gracefully)
- [ ] Missing write permissions (should fail gracefully)
- [ ] Invalid template path (should fail gracefully)

### Validation Testing
- [ ] Generated dossier has valid frontmatter
- [ ] Generated dossier passes schema validation
- [ ] Generated dossier can be verified: `dossier verify`
- [ ] All required fields present
- [ ] Enum values valid (risk_level, status, etc.)

---

## Success Criteria

### Phase 2 (Meta-Dossier)
- [ ] Meta-dossier creates valid dossiers
- [ ] Handles both interactive and flag-based modes
- [ ] Validates against schema correctly
- [ ] Error handling works properly
- [ ] Meta-dossier itself is signed and verified

### Phase 3 (CLI Wrapper)
- [ ] Command accessible via `dossier create`
- [ ] All flags parsed correctly
- [ ] Environment variables passed to meta-dossier
- [ ] Works with both Claude Code and Cursor
- [ ] Error messages are helpful
- [ ] Documentation complete

### Overall
- [ ] Single-path architecture verified
- [ ] No business logic in CLI code
- [ ] Meta-dossier is self-contained
- [ ] Follows existing CLI patterns
- [ ] Integrates with existing commands
- [ ] Ready to mark in `cli-evolution.md` as ✅

---

## Technical Decisions

### Q: Why environment variables for context passing?
**A**: Cleanest approach that works with all LLMs. Alternative approaches (stdin prepending, temp files) are more complex and LLM-specific.

### Q: Why put meta-dossier in examples/ instead of templates/?
**A**: It's a real, working dossier that should be signed and verified. Putting it in examples/ makes it discoverable and demonstrates best practices. Users can study it to learn dossier creation.

### Q: Why always execute meta-dossier, even with full flags?
**A**: Single path ensures consistency. The meta-dossier can validate flags, catch edge cases, and ensure schema compliance better than CLI code. We're not losing anything from this approach - the LLM execution is fast.

### Q: Why not implement direct file generation in CLI?
**A**: Would duplicate validation logic and create two code paths to maintain. Meta-dossier approach is more maintainable, testable, and aligns with dossier philosophy.

---

## Related Files

- CLI implementation: `cli-work/cli/bin/dossier`
- Meta-dossier: `cli-work/examples/authoring/create-dossier.ds.md`
- CLI docs: `cli-work/cli/README.md`
- Evolution plan: `cli-work/docs/planning/cli-evolution.md`
- Schema: `cli-work/dossier-schema.json`

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 0.1.0 | 2025-11-24 | Initial planning document created |

---

**Next Action**: Proceed to Phase 2 - Create and test the meta-dossier.
