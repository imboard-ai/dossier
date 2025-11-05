# Dossier Execution Protocol

**Version**: 1.0
**Status**: Stable
**Last Updated**: 2025-01-05

---

## Overview

This protocol defines **standard execution guidelines** for all dossiers. Every dossier references this protocol to ensure consistent, safe, and continuously improving automation.

**Purpose**:
- Provide meta-instructions that apply to ALL dossiers
- Enable self-improving dossier system
- Ensure safety and quality across all executions
- Create consistent user experience

---

## 🔄 Self-Improvement Protocol

**Key Insight**: Every dossier execution is an opportunity to improve the dossier itself.

**Default**: Enabled (users can skip with "just execute" or "skip improvements")

### Step 1: Meta-Analysis (Before Execution)

**Before executing any dossier, analyze it for potential improvements**:

**Review the dossier for**:
- [ ] **Clarity**: Are instructions specific enough for this project's context?
- [ ] **Completeness**: Missing edge cases you can anticipate from gathered context?
- [ ] **Examples**: Could examples be more relevant to detected tech stack?
- [ ] **Validation**: Are validation steps sufficient for this scenario?
- [ ] **Troubleshooting**: Cover issues you can foresee?
- [ ] **Decision trees**: Complete for the structure you detected?
- [ ] **Specificity**: Are commands/paths explicit or too generic?

### Step 2: Propose Improvements (If Found)

**If improvements identified**, present suggestion to user:

**Standard format**:
```
🔄 Dossier Improvement Suggestion

**Dossier**: [dossier-name].md
**Protocol Version**: [version]

**Context Triggering Improvement**:
[What about this specific project revealed the gap]

**Improvements Identified**:

1. [Specific improvement]
   - **Why needed**: [Reasoning based on current context]
   - **Benefit**: [Concrete improvement this provides]
   - **Example**: [Show what it would add]

2. [Another improvement if multiple]
   - **Why needed**: [Reasoning]
   - **Benefit**: [Improvement]

**Proposed Changes**:
```markdown
[Show diff or new sections to add to dossier]
```

**Benefits of Adopting**:
- ✅ [Benefit 1: More specific/complete/safer]
- ✅ [Benefit 2: Handles edge case X]
- ✅ [Benefit 3: Better user experience]

**Impact**: [Low/Medium/High] - How much better does this make the dossier?

**Should I update the dossier before executing? (y/N)**
```

### Step 3: User Decision

**User can respond**:
- **"Yes" or "y"**: Update dossier, then execute improved version
- **"No" or "n" or "Skip"**: Execute current version as-is
- **"Iterate"**: Refine suggestion, propose again
- **"Show diff"**: Display detailed before/after comparison
- **"Just execute"** (anytime): Skip improvement check entirely

### Step 4: Apply Improvement (If Accepted)

**If user accepts**:
1. Update dossier file at `dossier location/dossiers/[name].md`
2. Show what changed (diff)
3. If Dossier Operator: Offer to commit improvement
4. If Dossier Citizen: Save locally or just use for this execution
5. Proceed with improved version

**If user declines**:
1. Note suggestion for future reference
2. Execute original version
3. Continue normally

### When to Skip Self-Improvement

**Auto-skip if**:
- User explicitly said "just execute"
- Dossier was recently improved (within last execution)
- Time-critical situation
- User indicated urgency

**Manual skip**:
- User says "skip improvements"
- User says "no suggestions"

---

## 📋 Standard Execution Guidelines

### General Principles

1. **Transparency**: Show what you're doing at each step
2. **Safety**: Validate before destructive operations
3. **Clarity**: Clear success/failure messages
4. **Adaptability**: Handle edge cases gracefully
5. **User agency**: Ask before making significant decisions

### Execution Flow

**Standard dossier execution sequence**:

1. **Self-improvement check** (optional, see above)
2. **Read prerequisites**: Validate all prerequisites met
3. **Gather context**: Analyze project before making decisions
4. **Present plan**: Show user what will happen
5. **Execute actions**: Perform operations with progress updates
6. **Validate results**: Verify success criteria met
7. **Report outcome**: Clear summary of what was done
8. **Next steps**: Guide user on what to do next

### Context Gathering Best Practices

**Always gather context before acting**:
- Scan directory structure
- Check for existing files (avoid conflicts)
- Detect tech stack and tools
- Verify git status
- Understand project type
- Note any unusual patterns

**Report what you found**:
```
📊 Context Gathered:
  Project Type: Multi-repo
  Repos: backend/ (Node.js), frontend/ (React)
  Git Status: Clean
  Existing Dossiers: None
```

### Decision Making

**When making decisions**:
- Explain reasoning clearly
- Present options when multiple paths exist
- Recommend default but allow override
- Document why recommendation is best for this context

**Format**:
```
**Decision Point**: Which template to use?

**Options**:
  A. Single-repo template (best for: simple APIs, libraries)
  B. Multi-repo template (best for: backend + frontend)
  C. Monorepo template (best for: Nx/Turbo workspaces)

**Detected**: Multiple repos found (backend/, frontend/)
**Recommendation**: Multi-repo template (option B)

**Proceeding with**: [wait for user or use recommendation]
```

---

## 🎨 Output Format Standards

### Emojis/Icons

**Use consistently across all dossiers**:
- ✅ Success / completed step
- ❌ Error / failed operation
- ⚠️ Warning / requires attention
- ℹ️ Information / FYI
- 🔄 Self-improvement / suggestion
- 📊 Status / summary
- 📁 Directory / folder operation
- 📦 Repository / package
- 🔀 Git branch operation
- 💾 File operation (write/copy)
- 🧹 Cleanup / removal
- 🚀 Start / launch
- ⏸️ Pause / stash
- 🎉 Complete / celebration
- 🎯 Dossier branding

### Progress Reporting

**Show clear progress**:
```
Step 1/5: Detecting project structure...
  ✓ Found 2 git repositories
  ✓ Detected: Multi-repo

Step 2/5: Copying templates...
  ✓ Copied .ai-project.json
  ✓ Copied AI_GUIDE.md
  ...
```

### Summary Format

**Always end with clear summary**:
```
=========================
✅ [Dossier Name] Complete!

📊 Summary:
  - Created: 5 files
  - Modified: 2 files
  - Repos configured: 3

📝 Next Steps:
  1. [Action user should take]
  2. [Another action]

💡 Tip: [Helpful suggestion]
```

---

## 💾 Safety Guidelines

### Always Create Backups

**Before destructive operations**:
```bash
# Backup files before overwriting
cp file.json file.json.backup

# Create git backup branch
git checkout -b backup-before-dossier
git checkout -

# Document backup location
echo "✓ Backup created: file.json.backup"
```

### Confirm Destructive Operations

**Before deleting/overwriting**:
```
⚠️ About to delete:
  - .worktrees/feature-x/
  - 3 files, 127 KB

Continue? (y/N)
```

**Always**:
- Show exactly what will be affected
- Explain consequences
- Provide alternative options
- Allow user to abort

### Check for Uncommitted Changes

**Before modifying git-tracked files**:
```bash
git status --short
# If output not empty: warn user
```

**Pattern**:
```
⚠️ Uncommitted changes detected:
  M src/file.ts
  ?? new-file.ts

Options:
  1. Commit changes first (recommended)
  2. Stash changes
  3. Continue anyway (may cause conflicts)
  4. Abort

What would you like to do?
```

### Validate Permissions

**Before file operations**:
```bash
# Check write permission
if [ ! -w "." ]; then
  echo "❌ No write permission in current directory"
  exit 1
fi
```

### Provide Rollback Instructions

**Always explain how to undo**:
```
If something goes wrong:
  1. Restore from backup: cp file.json.backup file.json
  2. Or use git: git checkout backup-before-dossier
  3. Or rollback: Use appropriate rollback procedures for your project
```

---

## ✅ Validation Patterns

### File Existence Validation

**Standard pattern**:
```bash
# Check file exists
if [ ! -f ".ai-project.json" ]; then
  echo "❌ Required file not found: .ai-project.json"
  exit 1
fi

echo "✓ Found: .ai-project.json"
```

### JSON Validation

**Standard pattern**:
```bash
# Validate JSON syntax (try multiple parsers)
if cat .ai-project.json | python3 -c "import json,sys; json.load(sys.stdin)" 2>/dev/null; then
  echo "✓ Valid JSON"
elif cat .ai-project.json | node -e "JSON.parse(require('fs').readFileSync('/dev/stdin'))" 2>/dev/null; then
  echo "✓ Valid JSON"
else
  echo "❌ Invalid JSON in .ai-project.json"
  exit 1
fi
```

### Git Status Validation

**Standard pattern**:
```bash
# Check if git repo
if ! git rev-parse --git-dir > /dev/null 2>&1; then
  echo "❌ Not a git repository"
  exit 1
fi

echo "✓ Git repository detected"

# Check branch
branch=$(git branch --show-current)
echo "✓ Current branch: $branch"
```

### Success Criteria Format

**Standard checklist**:
```markdown
## Success Criteria

1. ✅ [Criterion 1 - specific and measurable]
2. ✅ [Criterion 2 - verifiable]
3. ✅ [Criterion 3 - clear pass/fail]

**Verification**:
```bash
# Commands to verify each criterion
ls .ai-project.json  # Criterion 1
npm run task:list    # Criterion 2
git status           # Criterion 3
```
```

---

## 🤖 LLM Execution Notes

### For AI Agents Executing Dossiers

**You should**:
- ✅ Read PROTOCOL.md before first execution (understand guidelines)
- ✅ Perform self-improvement analysis (unless user skips)
- ✅ Show progress at each step
- ✅ Validate prerequisites before proceeding
- ✅ Ask clarifying questions when ambiguous
- ✅ Explain your decisions and reasoning
- ✅ Handle errors gracefully with clear messages
- ✅ Verify success criteria at end
- ✅ Provide actionable next steps

**You should NOT**:
- ❌ Assume context without gathering
- ❌ Make destructive changes without confirmation
- ❌ Skip validation steps
- ❌ Proceed if prerequisites not met
- ❌ Hide errors or failures
- ❌ Leave project in broken state
- ❌ Forget to explain what you did

### Error Handling

**When operations fail**:
```
❌ Error: [What failed]

**Context**: [What you were trying to do]
**Cause**: [Why it failed]

**Solutions**:
  1. [First thing to try]
  2. [If that doesn't work]
  3. [Escalation path]

**Current state**: [What's the project state now]
**Safe to retry**: [Yes/No]
```

### Progress Updates

**For long operations, show progress**:
```
📦 Installing dependencies...
  ✓ Backend: 247 packages installed (2.3s)
  ✓ Frontend: 189 packages installed (1.8s)
  ⏳ Shared: Installing... (15/32)
```

---

## 📚 Protocol Version History

### v1.0 (2025-01-05) - Initial Release

**Introduced**:
- Self-improvement protocol
- Standard execution guidelines
- Output format standards
- Validation patterns
- Safety guidelines
- LLM execution notes

**Compatible dossiers**: All dossiers v1.0

---

### Future Versions

**v1.1** (Planned - Minor update):
- Enhanced troubleshooting patterns
- Additional validation checks
- Improved error messages
- **Backwards compatible** with v1.0 dossiers

**v2.0** (Planned - Breaking changes):
- TBD based on learnings
- Will require dossier updates
- Separate protocol file for compatibility

---

## 🎯 Using This Protocol

### For Dossier Operators (Dossier Authors)

**When creating new dossiers**:
1. Use `dossiers/templates/dossier-template.md`
2. Reference protocol version in header
3. Follow guidelines in this protocol
4. Don't duplicate what's in protocol

**When updating existing dossiers**:
1. Add protocol version header if missing
2. Optionally refactor to align with protocol
3. Document any protocol deviations

### For Dossier Citizens (Dossier Users)

**When using dossiers**:
1. Your AI agent reads this protocol automatically
2. Self-improvement suggestions are optional
3. You can skip improvement check with "just execute"
4. Protocol ensures consistent safe execution

### For LLM Agents

**When executing dossiers**:
1. Check protocol version in dossier header
2. Read corresponding `PROTOCOL.md` version
3. Follow all guidelines in this document
4. Perform self-improvement analysis (unless skipped)
5. Execute dossier-specific instructions
6. Validate according to protocol standards

---

## 🔧 Extending the Protocol

### Contributing Improvements

**To suggest protocol improvements**:
1. Open issue on the dossier protocol repository
2. Describe improvement and rationale
3. Show impact on existing dossiers
4. Propose version bump (minor vs major)

**For breaking changes**:
- Must increment to v2.0
- Create `PROTOCOL-v2.md`
- Document migration path
- Maintain v1.0 for backwards compatibility

### Custom Protocol Extensions

**Projects can create local protocol extensions**:
```markdown
# project/.dossier/LOCAL_PROTOCOL.md

**Extends**: Dossier PROTOCOL.md v1.0

**Additional guidelines for this project**:
- [Project-specific rules]
- [Team conventions]
- [Custom validation]
```

Reference in project's dossiers:
```markdown
**Protocol**: Dossier v1.0 + LOCAL v1.0
```

---

## 📖 Examples

### Example 1: Self-Improvement in Action

**User runs**:
```
"Use project-init dossier to set up this directory"
```

**LLM with protocol**:
```
[Reads project-init.md]
[Sees: Protocol Version 1.0]
[Reads PROTOCOL.md]
[Performs self-improvement analysis]

🔄 Dossier Improvement Suggestion

**Dossier**: project-init.md

**Context**: Your project has Python virtual environment (venv/)
but current dossier doesn't check for it.

**Improvement Identified**:
Add Python venv detection to "Context to Gather"

**Why needed**: Python projects need venv activation check
**Benefit**: Prevents pip install failures, better Python support

**Proposed Addition**:
In "Context to Gather" section, add:
---
### Python Virtual Environment
```bash
if [ -d "venv" ] || [ -d ".venv" ]; then
  echo "✓ Virtual environment detected"
  # Note: User should activate venv before dependency install
fi
```
---

**Should I update the dossier before executing? (y/N)**

[User: "yes"]

✓ Updated project-init.md with Python venv detection
✓ Proceeding with improved version...

[Executes project-init with enhancement]
```

### Example 2: Protocol Ensures Safety

**Dossier about to delete files**:
```
[Following protocol safety guidelines]

⚠️ About to remove:
  📂 .worktrees/feature-x/ (3 repos, 1.2 MB)

Checking for uncommitted changes... [per protocol]
  ✓ Backend: Clean
  ✓ Frontend: Clean
  ⚠️ Shared: 2 uncommitted files

❌ Cleanup aborted - uncommitted changes detected [per protocol]

Options: [per protocol]
  1. Commit changes first
  2. Stash changes
  3. Force remove (DATA LOSS)

What would you like to do?
```

---

## 🔄 Protocol Versioning

### Version Numbers

**Format**: MAJOR.MINOR.PATCH (semver)

**Examples**:
- `1.0.0` - Initial stable release
- `1.1.0` - Added new guideline (compatible)
- `1.0.1` - Fixed typo (compatible)
- `2.0.0` - Breaking change (incompatible)

### Compatibility

**Dossiers specify protocol version**:
```markdown
**Protocol Version**: 1.0
```

**Meaning**:
- Works with protocol v1.0.0 through v1.x.x
- May not work with v2.0.0+ (breaking changes)

**When protocol updates**:
- **Minor/Patch (1.0 → 1.1)**: All dossiers benefit automatically
- **Major (1.x → 2.0)**: Dossiers must be updated explicitly

---

## 🚀 Best Practices

### For Dossier Authors

1. ✅ Reference protocol version clearly
2. ✅ Don't duplicate protocol content
3. ✅ Focus on dossier-unique logic
4. ✅ Follow output format standards
5. ✅ Include examples
6. ✅ Test self-improvement suggestions

### For LLM Execution

1. ✅ Read protocol before first execution
2. ✅ Apply self-improvement analysis
3. ✅ Follow safety guidelines
4. ✅ Use standard output formats
5. ✅ Validate thoroughly
6. ✅ Report clearly

### For Users

1. ✅ Trust the self-improvement suggestions
2. ✅ Provide feedback when protocol fails
3. ✅ Skip improvements when in a hurry (that's okay!)
4. ✅ Report protocol violations in dossiers

---

## 📞 Support

### Protocol Issues

**If protocol seems wrong or insufficient**:
- Open GitHub issue
- Describe scenario where protocol failed
- Suggest improvement
- Tag as `protocol-improvement`

### Dossier Not Following Protocol

**If a dossier violates protocol**:
- Open GitHub issue
- Reference protocol section violated
- Suggest fix
- Tag as `protocol-violation`

---

**🎯 Dossier Execution Protocol v1.0**

> "Structure your agents. Not your scripts."

*This protocol ensures dossiers are safe, consistent, and continuously improving.*
