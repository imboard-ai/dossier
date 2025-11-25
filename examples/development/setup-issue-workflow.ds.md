---dossier
{
  "dossier_schema_version": "1.0.0",
  "title": "Setup Issue Workflow",
  "version": "1.0.0",
  "protocol_version": "1.0",
  "status": "Draft",
  "last_updated": "2025-11-25",
  "objective": "Create a workflow for GitHub issues that fetches issue details, creates appropriately named branches, sets up git worktrees, and generates PLANNING.md files for structured development",
  "category": ["development"],
  "tags": ["github", "issues", "workflow", "worktree", "branch-management", "planning"],
  "risk_level": "medium",
  "requires_approval": false,
  "risk_factors": ["modifies_files", "network_access"],
  "destructive_operations": [
    "Creates new git branch in the repository",
    "Creates new git worktree directory",
    "Creates PLANNING.md file in worktree"
  ]
}
---
# Setup Issue Workflow

## Objective

Create a workflow for GitHub issues that fetches issue details, creates appropriately named branches, sets up git worktrees, and generates PLANNING.md files for structured development.

## Prerequisites

- [ ] Git is installed and configured
- [ ] GitHub CLI (gh) is installed and authenticated
- [ ] You are in a git repository with GitHub as a remote
- [ ] You have push access to create branches

## Context to Gather

### 1. Issue Information

Collect the GitHub issue number from user input. Then fetch:
- Issue title
- Issue labels (especially "bug" or "feature")
- Issue body/description
- Issue assignees (optional)

### 2. Worktree Location Discovery

Discover where to create the worktree using this priority order:

1. **Check documentation first** (avoid trial-and-error):
   - Look in `WORKTREES.md`, `.claude.md`, `agents.md`, `README.md`, `CONTRIBUTING.md` for worktree instructions
   - These files should have explicit guidance on worktree location patterns
   - **Critical**: Some repos use nested main worktree (e.g., `repo/main/`) where worktrees should be siblings to `main/`, not to `repo/`

2. **Check for sibling worktrees** (most common pattern):
   ```bash
   git worktree list
   ```

   Example output for flat structure:
   ```
   /home/user/projects/dossier     abc1234 [main]
   /home/user/projects/cli-work    def5678 [cli-work]
   /home/user/projects/feature-42  ghi9012 [feature/42-add-dashboard]
   ```

   Example output for nested main worktree:
   ```
   /home/user/projects/monorepo/main        abc1234 [main]
   /home/user/projects/monorepo/cli-work    def5678 [cli-work]
   /home/user/projects/monorepo/feature-42  ghi9012 [feature/42-add-dashboard]
   ```

   **Analysis strategy**:
   - Get the main worktree path (look for `[main]` or `[master]` branch)
   - Check if main worktree ends with `/main/` or `/master/` - indicates nested structure
   - If nested: worktrees are siblings to the nested main directory
   - If flat: worktrees are siblings to the repository root
   - For branch `bug/123-fix-login`:
     - Nested: `monorepo/bug-123-fix-login/` (sibling to `monorepo/main/`)
     - Flat: `bug-123-fix-login/` (sibling to repository root)

3. **Check for nested worktrees directory**:
   - Look for `../worktrees/` or `.worktrees/` patterns in existing worktrees
   - If found, use that directory

4. **If unclear**: Prompt user:
   ```
   ? Where should I create the worktree? (e.g., ../feature-123):
   ```

## Actions to Perform

### Step 1: Get Issue Number

Prompt the user for the GitHub issue number if not already provided:
```
? GitHub issue number:
```

### Step 2: Fetch Issue Details

Use the GitHub CLI to fetch issue information:

```bash
gh issue view <ISSUE_NUMBER> --json title,labels,body,assignees
```

Extract:
- `title` - Issue title for branch naming
- `labels` - Check for "bug" or "feature" labels
- `body` - Issue description for PLANNING.md

### Step 3: Determine Branch Type

Based on issue labels:

1. **If "bug" label present**: Use `bug/` prefix
2. **If "feature" label present**: Use `feature/` prefix
3. **If both or neither**: Prompt user to choose:
   ```
   ? Issue type:
     1) bug - This is a bug fix
     2) feature - This is a new feature
   Choice (1-2):
   ```

### Step 4: Create Branch Name

Generate the branch name:

1. **Slugify the title**:
   - Convert to lowercase
   - Replace spaces with hyphens
   - Remove special characters
   - Truncate to reasonable length (50 chars max)

2. **Construct branch name**:
   ```
   {type}/{issue-number}-{slugified-title}
   ```

   Examples:
   - `bug/123-fix-login-redirect-issue`
   - `feature/456-add-user-dashboard`

### Step 5: Discover Worktree Location

Follow the discovery process from "Context to Gather" section:

1. **Check documentation first**: Look in `WORKTREES.md`, `.claude.md`, etc. for explicit instructions
2. **Analyze `git worktree list`** output:
   - Check if main worktree path ends with `/main/` or `/master/` (nested structure)
   - If nested: create worktree as sibling to main (e.g., `../bug-123/` next to `../main/`)
   - If flat: create worktree as sibling to repo root
3. **Check for nested worktrees directory** pattern
4. **If unclear**: Ask user for location

### Step 6: Create Git Branch

Create the branch (without checking it out - the worktree will handle checkout):

```bash
git branch <branch-name>
```

Verify branch was created:
```bash
git branch --list <branch-name>
```

**Note**: We only create the branch here; `git worktree add` in the next step will check it out in the worktree directory.

### Step 7: Create Git Worktree

```bash
git worktree add <worktree-path> <branch-name>
```

This command checks out the branch in the new worktree directory.

Verify worktree was created:
```bash
git worktree list
```

### Step 8: Generate PLANNING.md

Create the PLANNING.md file in the worktree root with this structure:

```markdown
# Issue #<NUMBER>: <TITLE>

## Type
<bug|feature>

## Problem Statement
<Issue body content here>

## Implementation Checklist
- [ ] Understand the issue and gather context
- [ ] Identify files that need modification
- [ ] Implement the changes
- [ ] Add/update tests
- [ ] Update documentation if needed
- [ ] Self-review the changes
- [ ] Create pull request

## Files to Modify
<!-- List the files you expect to modify -->

## Testing Strategy
<!-- Describe how you will test the changes -->
- [ ] Unit tests
- [ ] Integration tests
- [ ] Manual testing

## Notes
<!-- Additional notes, questions, or considerations -->

## Related Issues/PRs
- Issue: #<NUMBER>
```

### Step 9: Display Results

Show a summary of what was created:

```
Issue workflow setup complete!

Issue:      #<NUMBER> - <TITLE>
Type:       <bug|feature>
Branch:     <branch-name>
Worktree:   <worktree-path>
Planning:   <worktree-path>/PLANNING.md

Next steps:
1. Navigate to the worktree:
   cd <worktree-path>

2. Review and update PLANNING.md with your implementation plan

3. Start working on the issue!

4. When done, create a PR:
   gh pr create --title "<title>" --body "Closes #<NUMBER>"
```

## Validation

- [ ] Issue details were successfully fetched from GitHub
- [ ] Branch name follows the convention: `{type}/{number}-{slug}`
- [ ] Git branch was created successfully
- [ ] Git worktree was created at the correct location
- [ ] PLANNING.md was created in the worktree root
- [ ] PLANNING.md contains all required sections
- [ ] User was shown clear next steps

## Troubleshooting

**Issue**: `gh` command not found
**Solution**: Install GitHub CLI: https://cli.github.com/

**Issue**: Not authenticated with GitHub
**Solution**: Run `gh auth login` to authenticate

**Issue**: Issue not found
**Solution**: Verify the issue number and that you have access to the repository

**Issue**: Branch already exists
**Solution**: Either use the existing branch or choose a different name

**Issue**: Worktree path already in use
**Solution**: Check `git worktree list` and choose a different location

## Example

For issue #42 with title "Add user preferences page" and "feature" label:

**Input**:
```
? GitHub issue number: 42
```

**Output**:
```
Issue workflow setup complete!

Issue:      #42 - Add user preferences page
Type:       feature
Branch:     feature/42-add-user-preferences-page
Worktree:   ../feature-42-add-user-preferences-page
Planning:   ../feature-42-add-user-preferences-page/PLANNING.md

Next steps:
1. Navigate to the worktree:
   cd ../feature-42-add-user-preferences-page

2. Review and update PLANNING.md with your implementation plan

3. Start working on the issue!

4. When done, create a PR:
   gh pr create --title "Add user preferences page" --body "Closes #42"
```

## Notes

- This workflow assumes a GitHub-based repository
- The worktree approach allows working on multiple issues simultaneously
- PLANNING.md helps maintain focus and track progress
- Consider adding this workflow to your `.claude.md` for easy access

## References

- [Git Worktrees Documentation](https://git-scm.com/docs/git-worktree)
- [GitHub CLI Documentation](https://cli.github.com/manual/)
- [Branch Naming Conventions](https://www.conventionalcommits.org/)
