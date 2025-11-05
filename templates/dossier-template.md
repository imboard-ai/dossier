# Dossier: [Dossier Name]

**Protocol Version**: 1.0 ([_PROTOCOL.md](./_PROTOCOL.md))

**Purpose**: [One sentence describing what this dossier accomplishes]

**When to use**: [Describe the scenario when this dossier is helpful]

---

*Before executing, optionally review `_PROTOCOL.md` for self-improvement protocol and execution guidelines.*

---

## 📋 Metadata

### Version
- **Dossier**: v1.0.0
- **Protocol**: v1.0
- **Last Updated**: YYYY-MM-DD

### Relationships

**Preceded by**:
- [dossier-name](./dossier-name.md) - When/why (optional|required)

**Followed by**:
- [dossier-name](./dossier-name.md) - Purpose (suggested|required)

**Alternatives**:
- [dossier-name](./dossier-name.md) - When to use instead

**Conflicts with**:
- [dossier-name](./dossier-name.md) - Reason

**Can run in parallel with**:
- [dossier-name](./dossier-name.md) - If applicable
- None (if must run alone)

### Outputs

**Files created**:
- `path/to/file` - Description (required|optional)

**Configuration produced**:
- `config.key` - Consumed by: [dossiers]

**State changes**:
- State description - Affects: [what it impacts]

### Inputs

**Required**:
- Input name - Description

**Optional**:
- Input name - Default behavior

### Coupling

**Level**: [Tight|Medium|Loose|None]
**Details**: Brief explanation

---

## Objective

[Clear, specific statement of the goal. What should be true after executing this dossier?]

Example:
- "Initialize a new project with MI6 structure, customized for the specific project type"
- "Create linked worktrees across multiple repositories for parallel feature development"
- "Generate a comprehensive task document following MI6 patterns"

---

## Prerequisites

[What must exist or be true before running this dossier?]

Examples:
- MI6 is installed and `$MI6_PATH` is set
- Current directory is a git repository
- `.ai-project.json` exists and is valid
- Node.js is installed (if needed for scripts)

**Validation**: [How to check prerequisites are met]

```bash
# Example validation commands
echo $MI6_PATH  # Should show path
git status      # Should show repo info
```

---

## Context to Gather

[What information should the LLM analyze before proceeding?]

### Project Structure
- [ ] Scan current directory structure
- [ ] Identify git repositories (nested or top-level)
- [ ] Detect project type (single-repo, multi-repo, monorepo)

### Technology Stack
- [ ] Check for `package.json`, `requirements.txt`, `go.mod`, etc.
- [ ] Identify languages used (TypeScript, Python, Go, etc.)
- [ ] Detect frameworks (React, Express, Django, etc.)
- [ ] Find build tools (npm, cargo, make, etc.)

### Existing Configuration
- [ ] Check if `.ai-project.json` exists
- [ ] Check if `AI_GUIDE.md` exists
- [ ] Check if task structure exists
- [ ] Look for existing documentation patterns

### Relevant Files
- [ ] List key configuration files to read
- [ ] Note any existing patterns or conventions

**Output**: [Describe what the gathered context should look like]

Example:
```
Project Type: Multi-repo
Repos Found:
  - backend/ (TypeScript, Express, Jest)
  - frontend/ (TypeScript, React+Vite, Playwright)
Existing Config: None
```

---

## Decision Points

[What choices need to be made based on the gathered context?]

### Decision 1: [Name]
**Based on**: [What context informs this decision]

**Options**:
- Option A: [Description] - Use when [condition]
- Option B: [Description] - Use when [condition]
- Option C: [Description] - Use when [condition]

**Recommendation**: [Default or suggested choice]

### Decision 2: [Name]
[Repeat pattern]

---

## Actions to Perform

[Step-by-step instructions for the LLM to execute]

### Step 1: [Action Name]

**What to do**:
[Explicit instructions]

**Commands** (if applicable):
```bash
# Exact commands to run
command --with --flags
```

**Expected outcome**:
[What should exist or be true after this step]

**Validation**:
```bash
# How to verify this step worked
ls -la | grep expected-file
```

### Step 2: [Action Name]

[Repeat pattern for each step]

### Step 3: [Action Name]

[Continue...]

---

## File Operations

[If dossier involves creating/modifying files, specify them clearly]

### Create: `.ai-project.json`

**Location**: Project root

**Content structure**:
```json
{
  "name": "[detected from context]",
  "structure": "[detected: single-repo|multi-repo|mono-repo]",
  "repos": [
    {
      "name": "[detected repo name]",
      "type": "[detected: backend|frontend|shared]",
      "language": "[detected language]",
      "framework": "[detected framework]"
    }
  ]
}
```

**Customization**:
- Replace `[detected from context]` with actual values
- Add all detected repos
- Include project-specific details

### Modify: `AI_GUIDE.md`

**Location**: Project root

**Changes**:
- Update project name
- Fill in actual build commands
- Add detected tech stack info
- Customize code style section

---

## Validation

[How to verify the dossier executed successfully]

### Checks to Perform

- [ ] **File existence**: Verify all expected files were created
  ```bash
  ls .ai-project.json AI_GUIDE.md tasks/
  ```

- [ ] **File validity**: Check files are properly formatted
  ```bash
  # Validate JSON
  cat .ai-project.json | jq .
  ```

- [ ] **Git status**: Ensure clean state or appropriate changes
  ```bash
  git status
  ```

- [ ] **Functional test**: Try using the setup
  ```bash
  npm run task:list
  ```

### Success Criteria

[List what must be true for this dossier to be considered successful]

1. ✅ Criterion 1
2. ✅ Criterion 2
3. ✅ Criterion 3

### If Validation Fails

[Troubleshooting steps if something didn't work]

**Problem**: [Common issue]
**Solution**: [How to fix]

---

## Example

[Show a complete example of what this dossier produces]

### Before:
```
my-project/
├── backend/
│   ├── src/
│   └── package.json
└── frontend/
    ├── src/
    └── package.json
```

### After:
```
my-project/
├── .ai-project.json          # ← Created
├── AI_GUIDE.md               # ← Created
├── .aicontextignore          # ← Created
├── .gitignore                # ← Created (if needed)
├── package.json              # ← Created (with task scripts)
├── tasks/                    # ← Created
│   ├── planned/
│   ├── active/
│   ├── stashed/
│   └── completed/
├── scripts/
│   └── task-manager.js       # ← Copied
├── backend/                  # Existing
└── frontend/                 # Existing
```

### Generated `.ai-project.json`:
```json
{
  "name": "my-project",
  "structure": "multi-repo",
  "repos": [
    {
      "name": "backend",
      "type": "backend",
      "language": "typescript",
      "framework": "express"
    },
    {
      "name": "frontend",
      "type": "frontend",
      "language": "typescript",
      "framework": "react-vite"
    }
  ],
  "taskManagement": {
    "enabled": true,
    "autoCommit": true
  },
  "mi6": {
    "version": "v1"
  }
}
```

---

## Troubleshooting

### Issue 1: [Common Problem]

**Symptoms**:
- [What the user sees]

**Causes**:
- [Possible reasons]

**Solutions**:
1. [Try this first]
2. [If that doesn't work, try this]
3. [Last resort]

### Issue 2: [Another Problem]

[Repeat pattern]

---

## Notes for LLM Execution

[Special instructions for AI agents executing this dossier]

- **File paths**: Always use `$MI6_PATH` for MI6 resources
- **Relative paths**: Use `./ ` for project files
- **Error handling**: If a step fails, explain what went wrong and suggest fixes
- **User confirmation**: Ask before destructive operations (deleting files, etc.)
- **Show progress**: Report what you're doing at each step
- **Adaptation**: Adjust instructions based on actual project structure

---

## Related Dossiers

- [other-dossier.md](./other-dossier.md) - Related automation
- [another-dossier.md](./another-dossier.md) - Complementary workflow

---

## Version History

- **v1.0** - Initial version
- **v1.1** - Added troubleshooting section
- [Update as dossier evolves]

---

**🕵️ MI6 Dossier Template**
*Use this template to create new dossiers for MI6 agentic automation*
