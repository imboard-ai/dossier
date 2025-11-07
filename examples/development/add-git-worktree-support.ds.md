---dossier
{
  "dossier_schema_version": "1.0.0",
  "title": "Add Git Worktree Support to Project",
  "version": "1.0.0",
  "protocol_version": "1.0",
  "status": "Stable",
  "last_updated": "2025-11-07",
  "objective": "Restructure a git project to support git worktrees by moving repository contents into a main/ subdirectory and creating a worktree registry for tracking active work",
  "category": ["development", "git", "workflow"],
  "tags": ["git", "worktrees", "workflow", "organization", "development-setup"],
  "tools_required": [
    {
      "name": "git",
      "version": ">=2.5.0",
      "check_command": "git --version",
      "install_url": "https://git-scm.com/downloads"
    }
  ],
  "checksum": {
    "algorithm": "sha256",
    "hash": "a76760f71e77bfe3367ff75cb02b9d11bc2386b467ba5b51e875f0278f751cd8"
  },
  "risk_level": "high",
  "risk_factors": [
    "modifies_directory_structure",
    "moves_files_within_repository",
    "changes_working_directory_paths",
    "requires_multiple_safety_checks"
  ],
  "requires_approval": true,
  "destructive_operations": [
    "Moves all repository files into a new subdirectory (main/)",
    "Changes working directory structure",
    "Creates new WORKTREES.md registry file",
    "May break tools/scripts with hardcoded paths"
  ],
  "estimated_duration": {
    "min_minutes": 5,
    "max_minutes": 15
  },
  "relationships": {
    "followed_by": [
      {
        "dossier": "create-feature-worktree",
        "condition": "suggested",
        "purpose": "Create your first feature worktree after setup"
      }
    ]
  },
  "inputs": {
    "required": [],
    "optional": [
      {
        "name": "main_directory_name",
        "description": "Name for the main worktree directory",
        "type": "string",
        "default": "main",
        "example": "main"
      }
    ]
  },
  "outputs": {
    "files": [
      {
        "path": "main/",
        "description": "All repository contents moved into this subdirectory"
      },
      {
        "path": "main/WORKTREES.md",
        "description": "Registry file tracking active worktrees"
      }
    ],
    "configuration": [
      {
        "type": "directory_structure",
        "description": "Parent directory structure ready for multiple worktrees"
      }
    ]
  },
  "prerequisites": [
    {
      "description": "Must be in a git repository",
      "check": "git rev-parse --git-dir"
    },
    {
      "description": "All work must be pushed to remote",
      "check": "git status",
      "severity": "critical"
    },
    {
      "description": "Working directory should be clean (no uncommitted changes)",
      "check": "git status --porcelain",
      "severity": "critical"
    },
    {
      "description": "Repository should be backed up (cloud or external)",
      "severity": "critical"
    }
  ],
  "validation": {
    "success_criteria": [
      {
        "description": "Main worktree subdirectory exists",
        "check": "test -d main"
      },
      {
        "description": "Git repository exists in main subdirectory",
        "check": "test -d main/.git"
      },
      {
        "description": "WORKTREES.md registry file exists",
        "check": "test -f main/WORKTREES.md"
      },
      {
        "description": "Git still functions correctly",
        "check": "cd main && git status"
      },
      {
        "description": "Can create and remove a test worktree",
        "check": "cd main && git worktree add ../test-worktree && git worktree remove ../test-worktree"
      }
    ]
  },
  "rollback": {
    "supported": true,
    "instructions": "Move all contents from main/ back to parent directory and delete the empty main/ directory"
  }
}
---

# Dossier: Add Git Worktree Support to Project

**Protocol Version**: 1.0

---

## Objective

Restructure a git repository to support the git worktree workflow by:
1. Moving the current repository contents into a `main/` subdirectory
2. Creating a `WORKTREES.md` registry file for tracking active worktrees
3. Documenting the worktree workflow for the team

This enables parallel work on multiple features without constantly switching branches or stashing changes.

---

## What Are Git Worktrees?

Git worktrees allow you to have multiple working directories from the same repository, each checked out to different branches. This enables:

- **Parallel development**: Work on multiple features simultaneously
- **Easy context switching**: Just `cd` to different directory instead of `git checkout`
- **Clean separation**: Each worktree is isolated, no risk of mixing changes
- **Shared git history**: All worktrees share the same `.git` directory (saves space)

---

## ⚠️ CRITICAL: Safety Checks Before Proceeding

**This dossier performs a HIGH-RISK operation.** All files will be moved into a subdirectory. If interrupted (power loss, system crash), your directory structure may be left in an inconsistent state.

### Safety Check 1: Repository is Pushed to Remote

**Check**:
```
git status
```

**Required output**:
```
Your branch is up to date with 'origin/main'
nothing to commit, working tree clean
```

**❌ If you see**:
- "Your branch is ahead of 'origin/main'" → **Push first**: `git push origin main`
- "Changes not staged for commit" → **Commit or stash first**
- "Untracked files" → **Commit or remove first**

**Ask user**:
```
⚠️ SAFETY CHECK #1: Remote Backup

Is all your work pushed to the remote repository?

Run: git status

Expected: "Your branch is up to date with 'origin/main'"
         "nothing to commit, working tree clean"

Continue? (yes/no)
```

**Only proceed if user types exactly**: `yes`

If NO → **STOP**. User must push changes first.

---

### Safety Check 2: Cloud/External Backup Exists

**Ask user**:
```
⚠️ SAFETY CHECK #2: External Backup

This operation will move all files into a new subdirectory structure.

Is this directory backed up via:
- Cloud sync (Dropbox, Google Drive, OneDrive, iCloud)?
- Version control system (remote git repository)?
- External backup (Time Machine, external drive)?
- Any other backup mechanism?

If you lose power or the process is interrupted, you may need
to manually restore the directory structure.

Do you have a backup? (yes/no)
```

**Only proceed if user types exactly**: `yes`

If NO → **STRONGLY WARN**:
```
⚠️ WARNING: No backup detected

This is a HIGH-RISK operation without a backup. We recommend:
1. Creating a manual copy: cp -r <project> <project>-backup
2. Enabling cloud sync
3. Ensuring git remote is accessible

Proceed anyway? (I understand the risk)
```

Only proceed if user types exactly: `I understand the risk`

---

### Safety Check 3: Understand the Risks

**Show warning**:
```
⚠️ FINAL WARNING: High-Risk Directory Restructuring

This dossier will:
✓ Create a new subdirectory called 'main/'
✓ Move ALL repository files into main/
✓ Change your working directory structure from:
  ~/projects/foo/         →    ~/projects/foo/main/

Risks:
❌ Tools/scripts with hardcoded paths will break
❌ IDE workspaces may need path updates
❌ If interrupted (power loss, crash), directory may be partially moved
❌ You will need to 'cd main/' to access your code after this

Safeguards:
✅ Git history is preserved (all commits safe)
✅ Files remain on disk (just moved to subdirectory)
✅ We'll create a git tag as a checkpoint
✅ Rollback is possible (manual file move)

Type 'PROCEED' to continue, or anything else to abort:
```

**Only proceed if user types exactly**: `PROCEED`

Otherwise → **ABORT**

---

## Prerequisites

### Required

1. **Git repository exists**
   ```
   git rev-parse --git-dir
   ```
   Must be run from within a git repository.

2. **Git version 2.5.0 or higher**
   ```
   git --version
   ```
   Git worktrees were introduced in Git 2.5.0.

3. **Clean working directory** (enforced by safety checks above)
   - No uncommitted changes
   - All work pushed to remote
   - Backup exists

4. **At the repository root**
   ```
   # Should see .git/ directory
   ls -la
   # or on Windows
   dir
   ```

---

## Context to Gather

Before proceeding, the LLM should gather:

### 1. Platform Detection
- **OS**: Windows, macOS, Linux, other?
- **Shell**: bash, zsh, PowerShell, cmd, other?
- **Available tools**: What file manipulation commands are available?

### 2. Current Directory Structure
- Current working directory path
- Project name (from directory name)
- List of files and directories at repository root
- Size of repository (for time estimation)

### 3. Git Repository Information
- Current branch name
- Remote repository URL
- Git status (should be clean from safety checks)
- Any existing worktrees (rare, but check with `git worktree list`)

### 4. User Preferences
- Main directory name (default: "main", but user may prefer "primary", project name, etc.)

---

## Decision Points

### 1. Main Directory Name

**Options**:
- `main/` (recommended - matches main branch convention)
- `primary/`
- Keep project name (e.g., `foo/` inside `foo/`)
- Other user preference

**Ask user**: "What should we name the main worktree directory? (default: main)"

**Default**: Use `main` if user doesn't specify

---

### 2. Handle Uncommitted Changes (if any detected)

**If uncommitted changes found** (should not happen if safety checks passed):

**Options**:
- A. Commit changes first (recommended)
- B. Stash changes temporarily
- C. Abort operation

**Recommendation**: Option A or abort

---

## Actions to Perform

### Step 1: Create Safety Checkpoint

**Objective**: Create a git tag as a recovery point.

**Actions**:
1. Create a tag with timestamp
2. Document the tag name for user reference

**Example implementation (git - platform agnostic)**:
```bash
# Create backup tag
git tag "before-worktree-restructure-$(date +%Y%m%d-%H%M%S)"

# Show the tag
git tag | grep before-worktree
```

**Note for LLM**:
- On Windows PowerShell: Use `Get-Date -Format "yyyyMMdd-HHmmss"`
- On Windows cmd: Use `%date%-%time%` (formatted appropriately)
- Git commands are platform-agnostic and should work everywhere

**Output to user**:
```
✅ Created safety checkpoint: before-worktree-restructure-20251107-143022

To restore if needed:
  git checkout before-worktree-restructure-20251107-143022
```

---

### Step 2: Create Main Subdirectory

**Objective**: Create the `main/` directory that will hold all repository contents.

**Actions**:
1. Create a directory with the chosen name (default: `main`)
2. Verify it was created successfully

**Example implementation (bash/Unix)**:
```bash
mkdir main
```

**Example implementation (Windows PowerShell)**:
```powershell
New-Item -ItemType Directory -Name "main"
```

**Example implementation (Windows cmd)**:
```cmd
mkdir main
```

**Note for LLM**: Choose the appropriate command based on detected platform.

**Verification**:
- Check that directory exists
- Confirm it's empty

**Output to user**:
```
✅ Created directory: main/
```

---

### Step 3: Move Repository Contents

**Objective**: Move all files and directories (except `main/` itself) into the `main/` subdirectory.

**Critical**: This is the highest-risk step. Be careful to:
- Move hidden files (`.git/`, `.gitignore`, etc.)
- Preserve file permissions
- Not move the `main/` directory into itself
- Handle special characters in filenames

**Approach**:
1. List all items in current directory (excluding `.`, `..`, and `main/`)
2. Move each item into `main/`
3. Verify each move succeeded

**Example implementation (bash/Unix)**:
```bash
# Option 1: Using find (safest, handles all files including hidden)
find . -maxdepth 1 ! -name '.' ! -name '..' ! -name 'main' -exec mv {} main/ \;

# Option 2: Using shell glob with dotglob (alternative)
shopt -s dotglob  # Include hidden files
mv !(main) main/  # Move everything except main
shopt -u dotglob  # Reset
```

**Example implementation (Windows PowerShell)**:
```powershell
Get-ChildItem -Force | Where-Object { $_.Name -ne 'main' } | Move-Item -Destination main
```

**Example implementation (Windows cmd)**:
```cmd
for /d %%d in (*) do if /i not "%%d"=="main" move "%%d" main\
for %%f in (*) do move "%%f" main\
```

**Note for LLM**:
- **Adapt to user's environment** - detect OS/shell and use appropriate commands
- **Test with a dry run** if possible (e.g., echo commands first)
- **Move files in batches** if there are many files
- **Handle errors gracefully** - if a move fails, report it clearly

**Verification after each move**:
- Confirm file exists in new location
- Confirm file removed from old location

**Output to user** (show progress):
```
📦 Moving repository contents into main/...
  ✓ Moved: .git/
  ✓ Moved: .gitignore
  ✓ Moved: src/
  ✓ Moved: README.md
  ✓ Moved: package.json
  ... (show all moves)

✅ All files moved to main/
```

---

### Step 4: Verify Git Repository Integrity

**Objective**: Ensure git still works correctly in the new location.

**Actions**:
1. Navigate into `main/` directory
2. Run `git status` to verify repository integrity
3. Check that `.git/` directory exists and is valid
4. Verify branch name is correct

**Example implementation (platform-agnostic)**:
```bash
cd main
git status
git branch --show-current
```

**Expected output**:
```
On branch main
Your branch is up to date with 'origin/main'.

nothing to commit, working tree clean
```

**If git status fails**:
```
❌ ERROR: Git repository integrity check failed

The repository may have been corrupted during the move.

Recovery steps:
1. Restore from git tag:
   cd ..
   git checkout before-worktree-restructure-XXXXXX

2. Or manually move files back:
   mv main/* .
   mv main/.* .  # Move hidden files
   rmdir main

Please restore and try again, or seek help.
```

**If successful**:
```
✅ Git repository verified
   Branch: main
   Status: Clean
   Remote: origin
```

---

### Step 5: Create WORKTREES.md Registry

**Objective**: Create a markdown file to track active worktrees.

**Actions**:
1. Create `WORKTREES.md` in the `main/` directory
2. Populate it with initial content (template below)
3. Include current date and worktree information

**File location**: `main/WORKTREES.md`

**Content template**:

```markdown
# Worktree Registry

This file tracks active git worktrees for this project.

**Last updated**: [Current Date]

---

## What Are Git Worktrees?

Git worktrees allow you to have multiple working directories from the same repository, each checked out to different branches.

**Benefits**:
- Work on multiple features in parallel
- No need to stash or switch branches constantly
- Each worktree is isolated (no risk of mixing changes)
- All worktrees share the same git history (saves disk space)

---

## Active Worktrees

| Worktree | Branch | Created | Status | Purpose | References |
|----------|--------|---------|--------|---------|------------|
| main/ | main | [Date] | Active | Primary development | - |

---

## Worktree Lifecycle

### Creating a New Worktree

```bash
# From the main/ directory
cd main

# Create a worktree for a new feature branch
git worktree add ../feature-name -b feature/name

# Or for an existing branch
git worktree add ../feature-name existing-branch-name

# List all worktrees
git worktree list
```

**After creation, update the table above** with the new worktree information.

---

### Working in a Worktree

```bash
# Navigate to the worktree
cd ../feature-name

# Work normally - edit files, commit, push
git add .
git commit -m "Your changes"
git push origin feature/name
```

---

### Updating This Registry

When you create or remove a worktree, **update the table above**:

1. **Add a row** when creating a worktree
2. **Update status** to "Merged", "Abandoned", or "Paused" when done
3. **Move to Completed section** (create below) after removal

**Example entry**:
```
| feature-auth/ | feature/auth | 2025-11-07 | In Progress | OAuth2 login | #123, JIRA-456 |
```

---

### Deleting a Worktree

```bash
# From main/ directory
cd main

# When feature is merged and you're done with it
git worktree remove ../feature-name

# Delete the remote branch if needed
git push origin --delete feature/name

# Clean up stale worktree metadata
git worktree prune
```

**After removal, update the registry** - mark as completed or remove the row.

---

## Common Worktree Commands

```bash
# List all worktrees (shows path, branch, commit)
git worktree list

# Create a new worktree
git worktree add <path> <branch>

# Create worktree with new branch
git worktree add <path> -b <new-branch>

# Remove a worktree
git worktree remove <path>

# Remove a worktree (force, even if dirty)
git worktree remove --force <path>

# Clean up stale worktree metadata
git worktree prune

# Lock a worktree (prevent automatic removal)
git worktree lock <path>

# Unlock a worktree
git worktree unlock <path>
```

---

## Team Collaboration

### Important: Worktrees are Local

**Key concept**: Worktrees are a local organizational tool. They are **NOT** shared via git.

**What IS shared**:
- ✅ Branches (via `git push`/`git pull`)
- ✅ Commits
- ✅ This registry file (`WORKTREES.md`)

**What is NOT shared**:
- ❌ Worktree directories (local paths)
- ❌ Which worktrees you have locally

### Team Workflow

**Developer A creates a worktree and shares the branch**:
```bash
cd ~/projects/foo/main
git worktree add ../feature-x -b feature/x
cd ../feature-x
# ... work, commit ...
git push -u origin feature/x

# Update WORKTREES.md (so team knows)
# Commit and push the registry
```

**Developer B pulls the branch (in their own worktree)**:
```bash
cd ~/dev/foo/main  # Different local path, same repo
git fetch origin
git worktree add ../feature-x feature/x  # Creates their own worktree
cd ../feature-x
# ... collaborate on same branch ...
```

**Both developers**:
- Work on the same **branch** (shared via git)
- Have different **worktree directories** (local paths)
- Push/pull to collaborate (standard git workflow)

---

## Troubleshooting

### "fatal: 'branch' is already checked out"

**Problem**: You're trying to checkout a branch that's already checked out in another worktree.

**Solution**:
- Use a different branch name, OR
- Remove the existing worktree first: `git worktree remove <path>`, OR
- Work in the existing worktree

**Why**: Git prevents the same branch from being checked out in multiple worktrees to avoid conflicts.

---

### "Cannot remove working tree"

**Problem**: Worktree has uncommitted changes.

**Solution**:
```bash
# Option 1: Commit the changes
cd <worktree-path>
git add .
git commit -m "Save work in progress"
cd ../main
git worktree remove <worktree-path>

# Option 2: Force remove (⚠️ DATA LOSS - uncommitted changes deleted)
git worktree remove --force <worktree-path>
```

---

### "Worktree is locked"

**Problem**: Worktree is locked and can't be removed.

**Solution**:
```bash
git worktree unlock <path>
git worktree remove <path>
```

---

### Can't find my code after restructuring

**Problem**: After running this dossier, code is in `main/` subdirectory.

**Solution**:
```bash
# Your code is now here
cd main

# Update IDE workspace/project to point to main/ directory
# Update any scripts with hardcoded paths
```

---

## Additional Resources

- **[Git Worktree Documentation](https://git-scm.com/docs/git-worktree)** - Official git docs
- **[Git Worktree Tutorial](https://www.gitkraken.com/learn/git/git-worktree)** - Visual guide

---

*This registry is version-controlled. Update it whenever you create or remove worktrees to keep the team informed.*
```

**Note for LLM**:
- Create this file with current date
- Use platform-appropriate line endings (LF on Unix, CRLF on Windows)
- Ensure file is created in `main/` directory, not root

**Output to user**:
```
✅ Created WORKTREES.md registry file
   Location: main/WORKTREES.md
```

---

### Step 6: Commit the Registry to Git

**Objective**: Add and commit the WORKTREES.md file so it's tracked in version control and shared with the team.

**Actions**:
1. Stage the new file
2. Create a descriptive commit message
3. Commit the change

**Example implementation (platform-agnostic)**:
```bash
cd main
git add WORKTREES.md
git commit -m "Add git worktree support and WORKTREES.md registry

- Restructured directory to support git worktrees
- Created WORKTREES.md to track active worktrees
- Documented worktree workflow for team collaboration

This enables parallel development on multiple features without
constantly switching branches or stashing changes."
```

**Note for LLM**: Git commands work the same across all platforms.

**Output to user**:
```
✅ WORKTREES.md committed to git
   Commit: abc1234 "Add git worktree support..."
```

---

### Step 7: Final Verification

**Objective**: Verify everything works correctly.

**Verification checklist**:

1. **✅ Directory structure is correct**
   ```
   # From parent directory
   cd ..
   ls
   # Should show only: main/

   cd main
   ls -la  # or 'dir' on Windows
   # Should show: .git/, src/, README.md, WORKTREES.md, etc.
   ```

2. **✅ Git repository works**
   ```
   cd main
   git status
   git log --oneline -n 3
   # Should work normally
   ```

3. **✅ Can create a test worktree**
   ```
   cd main
   git worktree add ../test-worktree -b test/worktree-verification
   git worktree list
   # Should show both main/ and test-worktree/
   ```

4. **✅ Can remove the test worktree**
   ```
   git worktree remove ../test-worktree
   git branch -d test/worktree-verification
   git worktree list
   # Should show only main/
   ```

5. **✅ Remote connection still works**
   ```
   git remote -v
   git fetch origin
   # Should work without errors
   ```

**If all checks pass**:
```
🎉 SUCCESS! Git worktree support added successfully.

✅ All verification checks passed
✅ Repository is ready for parallel development
✅ WORKTREES.md registry is committed

Next steps:
1. Push changes: git push origin main
2. Create your first feature worktree
3. Update your team about the new workflow
```

**If any check fails**:
```
❌ Verification failed: [specific check]

See troubleshooting section below or rollback the changes.
```

---

## Example: Before and After

### Before Restructuring

```
~/projects/foo/
├── .git/
├── .gitignore
├── src/
│   ├── index.js
│   └── utils.js
├── tests/
├── README.md
├── package.json
└── .env
```

**To work on a feature**: `git checkout -b feature/auth` (switches whole directory)

---

### After Restructuring

```
~/projects/foo/
└── main/                          # Main worktree
    ├── .git/                      # Git repository (same location, just moved)
    ├── .gitignore
    ├── src/
    │   ├── index.js
    │   └── utils.js
    ├── tests/
    ├── README.md
    ├── package.json
    ├── .env
    └── WORKTREES.md              # Registry file (NEW)
```

**To work on a feature**:
```bash
cd main
git worktree add ../feature-auth -b feature/auth
cd ../feature-auth  # Separate directory, isolated work
```

---

### With Multiple Worktrees Created

```
~/projects/foo/
├── main/                          # Main branch
│   ├── .git/
│   ├── WORKTREES.md
│   └── [all project files]
│
├── feature-auth/                  # Feature branch (separate worktree)
│   ├── .git → points to main/.git/worktrees/feature-auth
│   └── [project files on feature/auth branch]
│
├── bugfix-ui/                     # Bugfix branch (separate worktree)
│   └── [project files on bugfix/ui branch]
│
└── review-pr-123/                 # Temporary worktree for PR review
    └── [project files on pr-123 branch]
```

**Parallel workflow enabled**:
- Terminal 1: `cd ~/projects/foo/feature-auth` → work on authentication
- Terminal 2: `cd ~/projects/foo/bugfix-ui` → fix urgent bug
- Terminal 3: `cd ~/projects/foo/review-pr-123` → review teammate's code

No branch switching. No stashing. No context loss.

---

## Troubleshooting

### Issue: "Directory structure looks wrong after Step 3"

**Symptoms**: Files are missing or in wrong locations

**Diagnosis**:
```bash
# Check current directory
pwd

# List all files (including hidden)
ls -la    # Unix/Mac
dir /a    # Windows cmd
Get-ChildItem -Force    # Windows PowerShell

# Check if files are in main/
ls -la main/    # Unix/Mac
dir /a main\    # Windows cmd
Get-ChildItem main -Force    # PowerShell
```

**Common causes**:
- Move command failed partway through
- Hidden files not moved
- Permissions issue

**Solution**:
1. **If files are partially moved**: Finish moving manually or rollback
2. **If .git/ is missing from main/**: Check if it's still in parent directory
3. **If everything is in wrong place**: Follow rollback procedure below

---

### Issue: "Git doesn't work in main/ directory"

**Symptoms**: `fatal: not a git repository` when in `main/`

**Diagnosis**:
```bash
cd main
ls -la | grep .git    # Unix/Mac - should see .git/
dir /a | find ".git"  # Windows - should see .git/

git rev-parse --git-dir  # Should show .git
```

**Solution**:
- If `.git/` directory is missing from `main/`, check parent directory
- If `.git/` is in parent, move it manually: `mv ../.git .` (Unix) or `move ..\.git .` (Windows)
- If `.git/` is corrupted, restore from git tag: `git checkout before-worktree-restructure-XXXXXX`

---

### Issue: "IDE/tools can't find project files"

**Symptoms**: IDE shows errors, build tools fail, paths don't work

**Cause**: Tools have hardcoded paths to old structure

**Solution**:
1. **Update IDE workspace**:
   - VS Code: Update `.vscode/settings.json` paths
   - IntelliJ: Re-import project from `main/` directory
   - Other: Point project root to `main/`

2. **Update build scripts**:
   - Check `package.json`, `Makefile`, CI configs
   - Update any hardcoded paths to include `main/` prefix

3. **Update shell configs**:
   - Aliases pointing to project directory
   - Environment variables with paths

---

### Issue: "Can't push changes after restructuring"

**Symptoms**: `git push` fails or shows errors

**Diagnosis**:
```bash
cd main
git remote -v    # Check remote is still configured
git branch -vv   # Check upstream tracking
git status       # Check for uncommitted changes
```

**Solution**:
```bash
# Ensure you're in main/ directory
cd main

# Verify remote exists
git remote -v

# If remote is missing, re-add it
git remote add origin <your-repo-url>

# Push with tracking
git push -u origin main
```

---

## Rollback Procedure

If something goes wrong and you need to undo the restructuring:

### Option 1: Restore from Git Tag (If repository is still functional)

```bash
# Find the backup tag
git tag | grep before-worktree

# Checkout the tag (this restores the repository state)
git checkout before-worktree-restructure-XXXXXX

# Create a new branch from this state if needed
git checkout -b restored-state
```

**Note**: This restores **git state** (commits, branches) but may not restore directory structure if files were physically moved. Use Option 2 for directory restore.

---

### Option 2: Manual Directory Rollback

**If files are in `main/` but you want them back in parent**:

```bash
# Navigate to parent directory
cd ..    # or cd to parent of main/

# Move all contents of main/ back to parent
# Unix/Mac:
mv main/* .
mv main/.* . 2>/dev/null   # Move hidden files (ignore error for . and ..)

# Windows PowerShell:
Get-ChildItem main -Force | Move-Item -Destination .

# Windows cmd:
for /r main %f in (*) do move "%f" .
for /r main %d in (.*) do move "%d" .

# Remove now-empty main/ directory
rmdir main    # Unix/Mac/Windows
```

**Verify**:
```bash
ls -la    # Unix/Mac - should see .git/ in current directory
dir /a    # Windows - should see .git in current directory

git status    # Should work from current directory
```

**Output**:
```
✅ Rolled back to original structure
   Repository files restored to: <current-directory>
```

---

### Option 3: Restore from Backup (If you created one per Safety Check #2)

**If you have a cloud backup or manual copy**:

1. Delete the partially-migrated directory
2. Restore from backup (cloud sync, Time Machine, manual copy)
3. Verify git still works: `git status`

---

## Next Steps

After successfully completing this dossier:

### 1. ✅ Push the Changes

```bash
cd main
git push origin main
```

This makes the `WORKTREES.md` registry available to your team and saves your restructuring work.

---

### 2. 📚 Familiarize Yourself with the Registry

```bash
# Read the documentation
cat main/WORKTREES.md    # Unix/Mac
type main\WORKTREES.md   # Windows cmd
Get-Content main/WORKTREES.md    # Windows PowerShell
```

Understand the worktree workflow before creating your first worktree.

---

### 3. 🚀 Create Your First Feature Worktree

```bash
cd main

# Create a worktree for a new feature
git worktree add ../my-feature -b feature/my-awesome-feature

# Navigate to the new worktree
cd ../my-feature

# Start coding!
# Edit files, commit, push normally
```

**Don't forget**: Update `WORKTREES.md` with your new worktree information.

---

### 4. 👥 Update Your Team (if applicable)

**If this is a team project**:

1. **Notify the team** about the directory restructure:
   ```
   📢 Team Update: Git Worktree Support Added

   The repository structure has changed:
   - All code is now in the main/ subdirectory
   - We can now use git worktrees for parallel development
   - See WORKTREES.md for documentation

   When you pull:
   - cd into main/ to access code
   - Update IDE/tool paths if needed
   - Read WORKTREES.md to learn the workflow
   ```

2. **Share the workflow documentation** (WORKTREES.md)

3. **Help teammates** update their local setups

---

### 5. 🔧 Update Scripts and Configs

**Check these files for hardcoded paths**:

- `package.json` scripts
- `Makefile` or build scripts
- CI/CD configuration (`.github/workflows/`, `.gitlab-ci.yml`, etc.)
- Deployment scripts
- Docker configurations
- IDE workspace files

**Update paths to reference `main/` where needed**.

**Example**:
```json
// Before
"scripts": {
  "build": "cd src && npm run build"
}

// After (if script is run from parent directory)
"scripts": {
  "build": "cd main/src && npm run build"
}

// Or run from main/ directory (better)
"scripts": {
  "build": "cd src && npm run build"
}
```

---

## Notes for Team Collaboration

### Key Concepts

1. **Worktrees are local-only**
   - Your worktree directories are **not** pushed to GitHub/remote
   - Only branches are shared (via `git push`/`git pull`)
   - Each team member creates their own worktrees in their own local paths

2. **WORKTREES.md registry is shared**
   - It's tracked in git and pushed to remote
   - Everyone can see what others are working on
   - Update it when you create/remove worktrees (helps coordination)

3. **Directory paths are local**
   - `~/projects/foo/main/` is YOUR local path
   - Teammate might use `~/dev/foo/main/` or `C:\Code\foo\main\`
   - Paths in documentation are examples only, not requirements

4. **Branches are shared as normal**
   - `git push`/`git pull` work exactly the same
   - CI/CD sees branches, not worktrees
   - Merge workflows are unchanged

---

### Team Workflow Example

**Developer Alice creates a feature worktree**:
```bash
cd ~/projects/foo/main
git worktree add ../feature-auth -b feature/auth

# Work on feature
cd ../feature-auth
# ... edit files, commit ...
git push -u origin feature/auth

# Update registry
cd ../main
# Edit WORKTREES.md, add row for feature-auth
git add WORKTREES.md
git commit -m "Registry: Add feature-auth worktree"
git push origin main
```

**Developer Bob pulls Alice's branch (creates his own worktree)**:
```bash
# Bob's machine, different local path
cd ~/dev/foo/main

# Pull Alice's updates
git fetch origin
git pull origin main  # Gets updated WORKTREES.md

# Create his own worktree for the same branch
git worktree add ../feature-auth feature/auth

# Work collaboratively
cd ../feature-auth
# ... edit files, commit ...
git pull origin feature/auth  # Get Alice's changes
git push origin feature/auth  # Share his changes
```

**Both Alice and Bob**:
- Work on the same **branch** (`feature/auth` - shared via git)
- Have different **worktree directories** (Alice: `~/projects/foo/feature-auth`, Bob: `~/dev/foo/feature-auth`)
- Collaborate using standard git push/pull

---

### Handling Shared Registry Updates

**Recommended practice**:

When creating a worktree, update WORKTREES.md immediately:
```bash
git worktree add ../feature-x -b feature/x

# Immediately update registry
cd ../main
# Edit WORKTREES.md to add feature-x entry
git add WORKTREES.md
git commit -m "Registry: Add feature-x worktree"
git push origin main

# Go back to work
cd ../feature-x
```

When removing a worktree, mark it completed:
```bash
cd main
git worktree remove ../feature-x

# Update registry
# Edit WORKTREES.md to mark feature-x as "Merged" or remove row
git add WORKTREES.md
git commit -m "Registry: Mark feature-x as merged"
git push origin main
```

This keeps the team informed about active work.

---

## Platform-Specific Notes

### Windows

- **Use `\` instead of `/` for paths** in commands: `main\WORKTREES.md`
- **PowerShell recommended** over cmd for better cross-platform compatibility
- **Git Bash** (comes with Git for Windows) provides Unix-like commands
- **Line endings**: Git should handle CRLF ↔ LF automatically

### macOS

- **Case-insensitive filesystem** by default (APFS, HFS+)
  - Be careful with case in filenames
  - `Main/` and `main/` are the same directory
  - Recommended: Use lowercase consistently

### Linux

- **Case-sensitive filesystem** (ext4, btrfs, etc.)
  - `Main/` and `main/` are different directories
  - Match case exactly in commands

---

## Additional Resources

- **[Official Git Worktree Documentation](https://git-scm.com/docs/git-worktree)** - Complete reference
- **[Git Worktree Tutorial](https://www.gitkraken.com/learn/git/git-worktree)** - Visual walkthrough
- **[Git Worktree Workflow Guide](https://spin.atomicobject.com/2016/06/26/parallelize-development-git-worktrees/)** - Real-world usage

---

**🎯 Dossier: Add Git Worktree Support**

*Enable parallel development. Work on multiple features simultaneously. Eliminate context switching.*
