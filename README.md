# MI6 Dossiers: Agentic Automation

**Dossiers** are intelligent instruction sets that leverage LLM agents to automate complex MI6 workflows.

---

## What Are Dossiers?

Instead of writing complex scripts that try to handle every edge case, MI6 dossiers provide **clear instructions** that LLM agents (like Claude Code, GPT-4, Cursor, Copilot) can follow intelligently.

### The Concept

MI6 users **already have access to LLMs** - that's the whole point of this framework! So why write brittle shell scripts when we can provide structured guidance for intelligent agents?

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

MI6 dossiers follow the **Dossier Execution Protocol** (`_PROTOCOL.md`) which includes a **self-improvement system**.

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

📚 **Full protocol**: [_PROTOCOL.md](./_PROTOCOL.md)

---

## How to Use Dossiers

### Method 1: Natural Language (Easiest)

Just tell your AI assistant:

```
"Use the MI6 project-init dossier to set up this directory"
```

The AI knows to look in `$MI6_PATH/dossiers/` and follow the instructions.

### Method 2: Explicit Reference

```
"Follow the instructions in $MI6_PATH/dossiers/project-init.md
to initialize this project"
```

### Method 3: Copy-Paste (Always Works)

1. Open dossier file: `cat $MI6_PATH/dossiers/project-init.md`
2. Copy content
3. Paste into AI chat
4. AI executes the instructions

---

## Available Dossiers

### Citizen Journey Dossiers

**For new projects (greenfield)**:
| Dossier | Purpose | When to Use |
|---------|---------|-------------|
| **greenfield-start.md** | Start brand new project from zero | Absolute beginning - no directory yet |
| **project-init.md** | Initialize MI6 structure | After directory/repos created |
| **dependency-install.md** | Install all dependencies | After MI6 initialization |
| **first-dev-session.md** | First productive dev session | Ready to start coding |

**For existing projects (brownfield)**:
| Dossier | Purpose | When to Use |
|---------|---------|-------------|
| **brownfield-adoption.md** | Add MI6 to existing project safely | Have existing code, want MI6 benefits |
| **project-uninstall.md** | Remove MI6 if adoption fails | MI6 didn't work out, need clean removal |

### Feature Dossiers

| Dossier | Purpose | When to Use |
|---------|---------|-------------|
| **worktree-multi-repo.md** | Set up multi-repo worktrees | Working on features across multiple repos |
| **worktree-cleanup.md** | Remove worktrees safely | Completing/abandoning feature work |
| **task-create.md** | Create new task document | Starting new work that needs documentation |

### Community Dossiers

Coming soon! See [CONTRIBUTING.md](../CONTRIBUTING.md) for how to contribute dossiers.

---

## Dossiers vs Scripts

MI6 uses **both** dossiers and traditional scripts - each for what they do best:

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
| Set MI6_PATH | Script ✅ | Simple, deterministic |
| **Initialize project** | **Dossier** ✅ | Needs to understand project |
| Benchmark git | Script ✅ | Fixed commands |
| **Create worktrees** | **Dossier** ✅ | Needs repo detection |
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

## Creating Custom Dossiers

### 1. Use the Template

Start with the dossier template:

```bash
cp $MI6_PATH/dossiers/templates/dossier-template.md \
   $MI6_PATH/dossiers/my-custom-dossier.md
```

### 2. Follow the Format

Fill in all sections. Be specific and clear. The LLM will follow your instructions literally.

### 3. Test with an LLM

Try your dossier with an AI assistant. Refine based on results.

### 4. Contribute Back

Share useful dossiers! See [CONTRIBUTING.md](../CONTRIBUTING.md).

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
- **Hardcode paths**: Use `$MI6_PATH` and relative paths
- **Require specific LLM**: Should work with any AI

---

## Examples

### Example 1: Quick Project Setup

```
User: "I have a Node.js backend and React frontend.
       Use MI6 project-init to set this up."

AI: (Follows project-init.md dossier)
    ✓ Detected: Multi-repo structure
    ✓ Found: backend/ (Node.js), frontend/ (React)
    ✓ Created: .ai-project.json with 2 repos
    ✓ Copied: All templates
    ✓ Customized: AI_GUIDE.md with npm commands
    ✓ Set up: .aicontextignore for Node/React
    ✓ Created: Task structure
    ✓ Initialized: Git repository

    "Project initialized! Ready to use MI6."
```

### Example 2: Worktree Setup

```
User: "Create worktrees for feature-x using the worktree dossier"

AI: (Follows worktree-multi-repo.md dossier)
    ✓ Read: .ai-project.json (found 2 repos)
    ✓ Created: .worktrees/feature-x/backend/ on branch feature-x
    ✓ Created: .worktrees/feature-x/frontend/ on branch feature-x
    ✓ Verified: Both branches created successfully

    "Worktrees ready! Work in .worktrees/feature-x/"
```

### Example 3: Task Creation

```
User: "Use task-create dossier to make a task for
       implementing dark mode"

AI: (Follows task-create.md dossier)
    ✓ Generated: DARK_MODE_IMPLEMENTATION.md
    ✓ Added: Requirements and acceptance criteria
    ✓ Created: In tasks/planned/
    ✓ Suggested: Next step is 'npm run task:start DARK_MODE'

    "Task created! Start with: npm run task:start DARK_MODE"
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
- Use traditional MI6 scripts (setup-env.sh, task-manager.js, etc.)
- Dossiers are optional enhancements, not requirements
- Many tasks can be done manually following docs

---

## See Also

- [Dossier System Guide](../docs/dossier-system.md) - Comprehensive documentation
- [Dossier Template](./templates/dossier-template.md) - Create custom dossiers
- [CONTRIBUTING.md](../CONTRIBUTING.md) - Contribute dossiers
- [MI6 Workflows](../workflows/) - Traditional documentation

---

## Philosophy

> "Agents need structure. MI6 provides it."

Dossiers embody this philosophy - they give AI agents clear structure and guidance, enabling them to intelligently automate complex workflows that would be brittle to script.

---

**🕵️ MI6 Agentic Automation**
*Simpler than scripts. More powerful than manual.*
