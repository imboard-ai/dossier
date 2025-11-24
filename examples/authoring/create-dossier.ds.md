---dossier
{
  "dossier_schema_version": "1.0.0",
  "title": "Create New Dossier",
  "version": "1.0.0",
  "protocol_version": "1.0",
  "status": "Stable",
  "last_updated": "2025-11-24",
  "objective": "Guide LLM agent to create a new dossier with proper structure, validation, and metadata",
  "category": [
    "authoring",
    "meta"
  ],
  "tags": [
    "dossier-creation",
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
    "Creates a new .ds.md file in the specified location"
  ],
  "checksum": {
    "algorithm": "sha256",
    "hash": "a5becb8badd735b8372dcd7a411b7df745bb3090adee1f4c561b1e67226f8c11"
  },
  "signature": {
    "algorithm": "ECDSA-SHA-256",
    "signature": "MEUCIAdQFeRq8k9sQ7FUpoVb9L8jic+hfWvJ8tr6aHXZxJkOAiEAibswUpF8yQkYu5cV9T731aSm+C7Lg6aKHbxZWzEc2dI=",
    "public_key": "MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEqIbQGqW1Jdh97TxQ5ZvnSVvvOcN5NWhfWwXRAaDDuKK1pv8F+kz+uo1W8bNn+8ObgdOBecFTFizkRa/g+QJ8kA==",
    "key_id": "arn:aws:kms:us-east-1:942039714848:key/d9ccd3fc-b190-49fd-83f7-e94df6620c1d",
    "signed_at": "2025-11-24T17:55:04.572Z"
  }
}
---
# Create New Dossier

## Objective

Create a new dossier file with proper structure, valid frontmatter metadata, and markdown sections. This meta-dossier guides you through gathering requirements, validating inputs against the dossier schema, and generating a well-formed dossier file.

## Prerequisites

- [ ] You have read access to the dossier schema at `cli-work/dossier-schema.json`
- [ ] You have read access to example dossiers in `cli-work/examples/`
- [ ] You have write access to create the new dossier file
- [ ] You understand the dossier specification

## Context to Gather

### 1. Read User-Provided Context

Check for environment variables that may contain user-provided metadata:

- `DOSSIER_CREATE_FILE` - Output file path
- `DOSSIER_CREATE_TITLE` - Dossier title
- `DOSSIER_CREATE_OBJECTIVE` - Primary objective
- `DOSSIER_CREATE_RISK` - Risk level (low/medium/high/critical)
- `DOSSIER_CREATE_CATEGORY` - Category
- `DOSSIER_CREATE_TEMPLATE` - Path to template/example to reference
- `DOSSIER_CREATE_TAGS` - Comma-separated tags

If these are not set or empty, you will need to prompt the user interactively.

### 2. Load Dossier Schema

Read the schema file at `cli-work/dossier-schema.json` to understand:
- Required fields
- Valid enum values (risk_level, status, protocol_version, etc.)
- Field formats and constraints
- Validation rules

### 3. Review Example Dossiers (Optional)

If user specified a template via `DOSSIER_CREATE_TEMPLATE` or wants to reference an existing dossier:
- Read the specified example dossier
- Use its structure as a pattern
- Adapt its sections for the new use case

Common examples to reference:
- `cli-work/examples/devops/deploy-application.ds.md` - Deployment patterns
- `cli-work/examples/development/setup-react-library.ds.md` - Development setup
- `cli-work/examples/data-science/train-ml-model.ds.md` - Data science workflows
- `cli-work/examples/database/migrate-schema.ds.md` - Database operations

## Actions to Perform

### Step 1: Gather Required Metadata

For each required field, check if it was provided via environment variable. If not, prompt the user interactively.

#### 1.1 Output File Path

**Field**: `file`
**Check**: `DOSSIER_CREATE_FILE`
**If empty**: Prompt user:
```
? Output file path (e.g., my-dossier.ds.md):
```
**Validation**:
- Must end with `.ds.md`
- If doesn't end with `.ds.md`, append it automatically
- If file exists, ask: "File exists. Overwrite? [y/N]"

#### 1.2 Title

**Field**: `title`
**Check**: `DOSSIER_CREATE_TITLE`
**If empty**: Prompt user:
```
? Dossier title:
```
**Validation**:
- Required field
- Should be clear and descriptive (3-100 characters)
- Example: "Deploy to AWS Production"

#### 1.3 Objective

**Field**: `objective`
**Check**: `DOSSIER_CREATE_OBJECTIVE`
**If empty**: Prompt user:
```
? Primary objective (clear statement of goal):
```
**Validation**:
- Required field
- Should be a clear, actionable statement
- Example: "Deploy the application to AWS ECS production cluster with zero downtime"

#### 1.4 Risk Level

**Field**: `risk_level`
**Check**: `DOSSIER_CREATE_RISK`
**If empty**: Prompt user:
```
? Risk level:
  1) low - Read-only operations, minimal system impact
  2) medium - Modifies files, requires review
  3) high - Destructive operations, requires approval
  4) critical - Production systems, requires signature
Choice (1-4):
```
**Validation**:
- Must be one of: `low`, `medium`, `high`, `critical`
- If invalid value provided, show error and prompt again

#### 1.5 Category

**Field**: `category`
**Check**: `DOSSIER_CREATE_CATEGORY`
**If empty**: Prompt user with suggestions:
```
? Category (e.g., devops, data-science, development, database, security):
```
**Common categories**:
- `devops` - Deployment, infrastructure, operations
- `data-science` - ML, data analysis, training
- `development` - Setup, coding, libraries
- `database` - Migrations, schema changes
- `security` - Security validation, auditing
- `documentation` - Documentation generation
- `authoring` - Dossier creation tools

**Validation**:
- Can be multiple (array), comma-separated
- User can provide custom category

#### 1.6 Tags (Optional)

**Field**: `tags`
**Check**: `DOSSIER_CREATE_TAGS`
**If empty**: Prompt user:
```
? Tags (comma-separated, optional):
```
**Validation**:
- Optional field
- Split by comma, trim whitespace
- Example: "aws, deployment, production"

#### 1.7 Template Reference (Optional)

**Field**: `template`
**Check**: `DOSSIER_CREATE_TEMPLATE`
**If provided**:
- Read the template file
- Use its structure as a guide
- Extract common patterns

### Step 2: Validate All Inputs

Before generating the file, validate all gathered metadata:

1. **Required fields present**:
   - `title` ✓
   - `objective` ✓
   - `risk_level` ✓
   - `category` ✓

2. **Enum values valid**:
   - `risk_level` must be: low, medium, high, or critical
   - `status` will be: "Draft" (default for new dossiers)
   - `dossier_schema_version` will be: "1.0.0"
   - `protocol_version` will be: "1.0"

3. **Format validation**:
   - File path ends with `.ds.md`
   - Title length reasonable (3-100 chars)
   - Objective is descriptive (10-500 chars)
   - Categories are valid strings
   - Tags are valid strings

**If validation fails**: Show error message and re-prompt for the invalid field.

### Step 3: Generate Frontmatter

Create the YAML frontmatter with the following structure:

```javascript
{
  "dossier_schema_version": "1.0.0",
  "title": "<user-provided-title>",
  "version": "1.0.0",
  "protocol_version": "1.0",
  "status": "Draft",
  "last_updated": "<current-date-YYYY-MM-DD>",
  "objective": "<user-provided-objective>",
  "category": ["<user-provided-category>"],
  "tags": ["<user-provided-tags>"],
  "risk_level": "<user-provided-risk-level>",
  "requires_approval": <based-on-risk-level>,
  "risk_factors": <infer-from-risk-level>,
  "destructive_operations": []
}
```

**Risk-based defaults**:
- `risk_level: low` → `requires_approval: false`
- `risk_level: medium` → `requires_approval: false`
- `risk_level: high` → `requires_approval: true`
- `risk_level: critical` → `requires_approval: true`

**Risk factors** (suggest based on risk level):
- `low`: `[]` or `["network_access"]`
- `medium`: `["modifies_files"]`
- `high`: `["modifies_files", "deletes_files"]`
- `critical`: `["modifies_cloud_resources", "database_operations"]`

**Note**: Checksum and signature fields are intentionally omitted. They will be added later via `dossier checksum` and `dossier sign` commands.

### Step 4: Generate Markdown Body

Create the markdown body with appropriate sections based on risk level and category.

**Standard sections** (all dossiers):
```markdown
# <Title>

## Objective
<Copy objective from metadata>

## Prerequisites
- [ ] Prerequisite 1
- [ ] Prerequisite 2

## Actions to Perform
1. Step 1
2. Step 2
3. Step 3

## Validation
- [ ] Success criterion 1
- [ ] Success criterion 2
```

**Additional sections** (based on risk level):

For `medium` or higher:
```markdown
## Context to Gather
- Information needed before proceeding
```

For `high` or `critical`:
```markdown
## Troubleshooting
**Issue**: Common problem
**Solution**: How to resolve
```

**Category-specific guidance**:

- **devops**: Include sections for deployment steps, rollback procedures
- **data-science**: Include data sources, model parameters, evaluation metrics
- **development**: Include setup steps, dependencies, configuration
- **database**: Include backup procedures, rollback steps
- **security**: Include verification steps, audit trail

### Step 5: Combine and Write File

1. **Combine frontmatter and body**:
```
---dossier
<frontmatter-json>
---
<markdown-body>
```

2. **Check if file exists**:
   - If exists and user said "no" to overwrite earlier → abort
   - If exists and user said "yes" → proceed with overwrite

3. **Create parent directories** if needed:
   - Extract directory path from file path
   - Create directories recursively if they don't exist

4. **Write file** with UTF-8 encoding

5. **Verify write succeeded**:
   - Check file exists
   - Check file is readable
   - Optionally: read back and verify content matches

### Step 6: Display Success Message and Next Steps

Show a success message with helpful next steps:

```
✅ Dossier created successfully!

File: <file-path>

Next steps:
1. Review and edit the content:
   $EDITOR <file-path>

2. Calculate checksum (recommended):
   dossier checksum <file-path> --update

3. Sign the dossier (for high-risk dossiers):
   dossier sign <file-path>

4. Verify the dossier:
   dossier verify <file-path>

5. Run the dossier:
   dossier run <file-path>

Documentation: See cli-work/docs/planning/cli-evolution.md for more information.
```

## Validation

After completing all steps, verify:

- [ ] File was created at the specified path
- [ ] File has valid YAML frontmatter delimited by `---dossier` and `---`
- [ ] Frontmatter is valid JSON
- [ ] All required fields are present in frontmatter
- [ ] Enum values are valid (risk_level, status, etc.)
- [ ] Markdown body has appropriate sections
- [ ] File is valid UTF-8
- [ ] User was shown success message with next steps

## Error Handling

### File Already Exists
- Ask user: "File exists. Overwrite? [y/N]"
- If "no" or invalid response: abort with message "❌ Aborted. File was not modified."

### Invalid Risk Level
- Show error: "❌ Invalid risk level. Must be one of: low, medium, high, critical"
- Re-prompt for risk level

### Missing Required Field
- Show error: "❌ Required field '<field>' cannot be empty"
- Re-prompt for that field

### Write Permission Error
- Show error: "❌ Cannot write to <file-path>. Check permissions."
- Exit with error code

### Template Not Found
- Show warning: "⚠️  Template not found at <template-path>. Proceeding with basic structure."
- Continue with default template

## Example

Here's what a generated dossier might look like:

```markdown
---dossier
{
  "dossier_schema_version": "1.0.0",
  "title": "Deploy to AWS Production",
  "version": "1.0.0",
  "protocol_version": "1.0",
  "status": "Draft",
  "last_updated": "2025-11-24",
  "objective": "Deploy the application to AWS ECS production cluster with zero downtime",
  "category": ["devops"],
  "tags": ["aws", "deployment", "production", "ecs"],
  "risk_level": "high",
  "requires_approval": true,
  "risk_factors": ["modifies_cloud_resources", "requires_credentials"],
  "destructive_operations": [
    "Updates ECS service with new task definition",
    "May restart running containers"
  ]
}
---

# Deploy to AWS Production

## Objective
Deploy the application to AWS ECS production cluster with zero downtime

## Prerequisites
- [ ] AWS credentials configured
- [ ] Docker image built and pushed to ECR
- [ ] ECS cluster is healthy
- [ ] Database migrations completed

## Context to Gather
- Current ECS task definition version
- Number of running tasks
- Target ECS cluster name
- Docker image tag to deploy

## Actions to Perform
1. Verify ECS cluster health
2. Create new task definition revision
3. Update ECS service with new task definition
4. Monitor deployment progress
5. Verify new tasks are healthy
6. Wait for old tasks to drain

## Validation
- [ ] New tasks are running
- [ ] Health checks passing
- [ ] No error logs in CloudWatch
- [ ] Application endpoints responding
- [ ] Zero downtime achieved

## Troubleshooting
**Issue**: Deployment stuck at "in progress"
**Solution**: Check task logs in CloudWatch, verify security groups allow traffic

**Issue**: New tasks fail health checks
**Solution**: Rollback to previous task definition, investigate application errors
```

## Notes

- This is a meta-dossier: it creates other dossiers
- It should be signed and verified itself to establish trust
- The generated dossier will be in "Draft" status - user should review and edit
- Checksum and signature are NOT generated by this dossier - they are separate steps
- This dossier is read-only on the schema and examples, write-only on the output file

## References

- Dossier Schema: `cli-work/dossier-schema.json`
- Example Dossiers: `cli-work/examples/`
- CLI Documentation: `cli-work/cli/README.md`
- Implementation Plan: `cli-work/docs/planning/create-command-implementation.md`
