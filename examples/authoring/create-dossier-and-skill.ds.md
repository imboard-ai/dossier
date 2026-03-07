---dossier
{
  "dossier_schema_version": "1.0.0",
  "title": "Create Dossier and Skill",
  "name": "create-dossier-and-skill",
  "version": "1.0.0",
  "protocol_version": "1.0",
  "status": "Stable",
  "last_updated": "2026-03-07",
  "objective": "Guide LLM agent to create both a registry dossier and its companion Claude Code skill in one session, ensuring proper separation of concerns",
  "category": [
    "authoring",
    "meta"
  ],
  "tags": [
    "dossier-creation",
    "skill-creation",
    "authoring",
    "meta-dossier",
    "scaffolding"
  ],
  "risk_level": "low",
  "requires_approval": false,
  "risk_factors": [
    "modifies_files"
  ],
  "destructive_operations": [
    "Creates a new .ds.md file",
    "Creates a new skill directory with SKILL.md"
  ],
  "authors": [
    {
      "name": "Yuval Dimnik"
    }
  ]
}
---
# Create Dossier and Skill

## Objective

Create both a registry dossier (`.ds.md` file) and its companion Claude Code skill (`SKILL.md`) in a single session. This ensures proper separation: the dossier holds the full procedure, while the skill is a thin entry point that invokes it.

## The Pattern

Every workflow has two parts:

1. **Registry dossier** — the full procedure with all steps, validation, troubleshooting, and examples. Published to the registry. Fetched on demand via `ai-dossier run`. This is where ALL the detail lives.

2. **Claude Code skill** — a thin trigger file at `~/.claude/skills/<name>/SKILL.md`. Its only job is to invoke the dossier via `ai-dossier run <registry-name>`. This saves context tokens in regular sessions — the full dossier is only loaded when the skill is triggered.

**Why create them together**: When created separately, the agent lacks full context of what goes in each. Creating both in one session ensures the right content ends up in the right place.

### What goes in the dossier (detailed)

- Full step-by-step procedure
- Prerequisites and context gathering
- Validation checklists
- Error handling and troubleshooting
- Examples with concrete input/output
- All the domain knowledge needed to execute

### What goes in the skill (minimal)

- Dossier frontmatter with `name`, `description`, `title`, `version`
- The `description` field should include trigger phrases (e.g., "Use when user says 'deploy', 'ship it'")
- A heading and 2-5 lines of instructions, primarily: "Run `ai-dossier run <registry-name>`"
- Optionally: how to extract arguments from user input (e.g., issue number)

## Prerequisites

- [ ] You have write access to create the dossier file
- [ ] You know where Claude Code skills are stored (`~/.claude/skills/`)
- [ ] The ai-dossier CLI is installed (`npm install -g @ai-dossier/cli`)

## Context to Gather

### 1. Read User-Provided Context

Check for environment variables or CLI arguments:

- `DOSSIER_CREATE_FILE` - Output file path for the dossier
- `DOSSIER_CREATE_TITLE` - Dossier title
- `DOSSIER_CREATE_OBJECTIVE` - Primary objective
- `DOSSIER_CREATE_RISK` - Risk level (low/medium/high/critical)
- `DOSSIER_CREATE_CATEGORY` - Category
- `DOSSIER_CREATE_TAGS` - Comma-separated tags

If these are not set, prompt the user interactively.

### 2. Determine Skill Name

The skill name is derived from the dossier title:
- Slugify the title: lowercase, hyphens for spaces, strip special chars
- Example: "Deploy to AWS" -> skill name `deploy-to-aws`

### 3. Determine Registry Name

The registry name is the namespace + path for publishing:
- Example: `imboard-ai/devops/deploy-to-aws`
- Ask the user if not obvious from context

## Actions to Perform

### Step 1: Gather Required Metadata

For each required field, check if provided. If not, prompt interactively.

**Required fields:**
- **Title**: Clear, descriptive (3-100 characters)
- **Objective**: Actionable statement of the goal
- **Risk level**: low / medium / high / critical
- **Category**: e.g., devops, development, data-science, database, security, authoring
- **Tags**: Comma-separated (optional)
- **Registry name**: Full registry path for publishing (e.g., `imboard-ai/meta/create-dossier-and-skill`)

**Risk-based defaults:**
- `low` -> `requires_approval: false`
- `medium` -> `requires_approval: false`
- `high` -> `requires_approval: true`
- `critical` -> `requires_approval: true`

### Step 2: Create the Registry Dossier

Create the `.ds.md` file with dossier frontmatter and full procedure.

**Frontmatter structure:**
```json
{
  "dossier_schema_version": "1.0.0",
  "title": "<title>",
  "name": "<slug>",
  "version": "1.0.0",
  "protocol_version": "1.0",
  "status": "Draft",
  "last_updated": "<YYYY-MM-DD>",
  "objective": "<objective>",
  "category": ["<category>"],
  "tags": ["<tags>"],
  "risk_level": "<risk>",
  "requires_approval": <bool>,
  "risk_factors": [],
  "destructive_operations": [],
  "authors": [{"name": "<author>"}]
}
```

**Note**: Do NOT include `checksum` or `signature` fields. These are added later via `ai-dossier checksum` and `ai-dossier sign`.

**Required markdown sections** (all dossiers):
```markdown
# <Title>

## Objective
<Clear statement of what this dossier accomplishes>

## Prerequisites
- [ ] Prerequisite 1
- [ ] Prerequisite 2

## Actions to Perform
### Step 1: ...
### Step 2: ...

## Validation
- [ ] Success criterion 1
- [ ] Success criterion 2
```

**Additional sections** (based on risk level):
- For `medium+`: Add `## Context to Gather`
- For `high+`: Add `## Troubleshooting` with common issues/solutions
- For all: Add `## Examples` with concrete input/output

**Content guidance:**
- Include ALL detail in the dossier — steps, validation, error handling, examples
- Be specific and actionable — the agent executing this has no prior context
- Include concrete bash commands, file paths, expected output
- Reference the real-world examples (setup-issue-workflow, full-cycle-issue) for quality bar

### Step 3: Create the Companion Skill

Create the skill directory and SKILL.md file.

**Skill location:** `~/.claude/skills/<skill-name>/SKILL.md`

**Skill structure:**
```markdown
---dossier
{
  "dossier_schema_version": "1.0.0",
  "name": "<skill-name>",
  "title": "<Title>",
  "version": "1.0.0",
  "status": "Draft",
  "objective": "<objective>",
  "description": "<1-2 sentence description>. Use when user says '<trigger phrase 1>', '<trigger phrase 2>'",
  "authors": [{"name": "<author>"}],
  "category": ["skills"],
  "tags": ["<relevant-tags>", "skill"],
  "checksum": {
    "algorithm": "sha256",
    "hash": "<computed-later>"
  }
}
---

# <Title>

1. Extract relevant arguments from the user's request
2. Run: `ai-dossier run <registry-name>`
3. Follow ALL steps in the workflow output.
```

**Key rules for skills:**
- Keep it to 5 lines of instructions maximum
- The `description` field MUST include trigger phrases — Claude Code uses this for skill matching
- Do NOT duplicate procedure details from the dossier — just say "run the dossier"
- If the user provides arguments (e.g., issue number, file path), extract them and pass them along
- The skill's `version` is independent of the dossier's version

### Step 4: Compute Checksum for Skill

The skill needs a checksum for integrity:

```bash
ai-dossier checksum <skill-path>/SKILL.md --update
```

If the CLI is not available, compute it manually and note it needs to be updated.

### Step 5: Show File Locations and Next Steps

Display a summary:

```
Dossier and skill created successfully!

Dossier: <dossier-file-path>
Skill:   ~/.claude/skills/<skill-name>/SKILL.md

Next steps:

1. Review the dossier content:
   $EDITOR <dossier-file-path>

2. Compute checksum and sign the dossier:
   ai-dossier checksum <dossier-file-path> --update
   ai-dossier sign <dossier-file-path>

3. Publish the dossier to the registry:
   ai-dossier publish <dossier-file-path>

4. Verify the skill works:
   Type "/<skill-name>" in Claude Code

5. Test the full flow:
   ai-dossier run <registry-name>
```

## Validation

- [ ] Dossier `.ds.md` file was created with valid frontmatter
- [ ] Dossier contains all required sections (Objective, Prerequisites, Actions, Validation)
- [ ] Dossier has sufficient detail for an agent to execute without prior context
- [ ] Skill `SKILL.md` was created at `~/.claude/skills/<name>/SKILL.md`
- [ ] Skill has dossier frontmatter with `description` including trigger phrases
- [ ] Skill body is minimal (5 lines max) and references the registry dossier
- [ ] Skill does NOT duplicate procedure details from the dossier
- [ ] User was shown next steps for checksum, signing, and publishing

## Error Handling

### File Already Exists
- Ask user: "File exists. Overwrite? [y/N]"
- If "no": abort with "Aborted. File was not modified."

### Missing Required Field
- Show error: "Required field '<field>' cannot be empty"
- Re-prompt for that field

### Skills Directory Does Not Exist
- Create it: `mkdir -p ~/.claude/skills/<skill-name>`
- Continue normally

### ai-dossier CLI Not Installed
- Warn: "ai-dossier CLI not installed. Install with: npm install -g @ai-dossier/cli"
- Still create the files — checksum/sign/publish can be done later

## Examples

### Example: Creating a "Deploy to AWS" dossier + skill

**User input:**
```
Title: Deploy to AWS Production
Objective: Deploy the application to AWS ECS with zero downtime
Risk: high
Category: devops
Tags: aws, deployment, production, ecs
Registry name: imboard-ai/devops/deploy-to-aws
```

**Generated dossier** (`deploy-to-aws.ds.md`):
```markdown
---dossier
{
  "dossier_schema_version": "1.0.0",
  "title": "Deploy to AWS Production",
  "name": "deploy-to-aws",
  "version": "1.0.0",
  "status": "Draft",
  "objective": "Deploy the application to AWS ECS with zero downtime",
  "category": ["devops"],
  "tags": ["aws", "deployment", "production", "ecs"],
  "risk_level": "high",
  "requires_approval": true,
  ...
}
---

# Deploy to AWS Production

## Objective
Deploy the application to AWS ECS production cluster with zero downtime.

## Prerequisites
- [ ] AWS credentials configured
- [ ] Docker image built and pushed to ECR
...

## Context to Gather
- Current ECS task definition version
- Target cluster name
...

## Actions to Perform
### Step 1: Verify ECS cluster health
...

## Validation
- [ ] New tasks are running
- [ ] Health checks passing
...

## Troubleshooting
**Issue**: Deployment stuck
**Solution**: Check CloudWatch logs
...
```

**Generated skill** (`~/.claude/skills/deploy-to-aws/SKILL.md`):
```markdown
---dossier
{
  "dossier_schema_version": "1.0.0",
  "name": "deploy-to-aws",
  "title": "Deploy to AWS Production",
  "version": "1.0.0",
  "status": "Draft",
  "objective": "Deploy the application to AWS ECS with zero downtime",
  "description": "Deploy to AWS ECS production. Use when user says 'deploy', 'ship to prod', 'deploy to aws'",
  "authors": [{"name": "Yuval Dimnik"}],
  "category": ["skills"],
  "tags": ["aws", "deployment", "skill"]
}
---

# Deploy to AWS Production

1. Run: `ai-dossier run imboard-ai/devops/deploy-to-aws`
2. Follow ALL steps in the workflow output.
3. Do not skip approval gates — this is a high-risk deployment.
```

## Notes

- This is a meta-dossier: it creates other dossiers and skills
- The generated dossier starts in "Draft" status — the user should review before publishing
- Checksum and signature are NOT generated by this dossier — they are separate CLI commands
- The skill's version is independent of the dossier's version — they evolve separately
- The old `create-dossier` template remains available via `--template imboard-ai/meta/create-dossier` for dossier-only creation

## References

- Existing skill examples: `~/.claude/skills/start-issue/SKILL.md`, `~/.claude/skills/full-cycle-issue-skill/SKILL.md`
- Existing registry dossier examples: `imboard-ai/development/git/setup-issue-workflow`, `imboard-ai/full-cycle-issue`
- Dossier CLI: `ai-dossier --help`
