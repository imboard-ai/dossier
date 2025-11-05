# Dossier Schema Validation Examples

This directory contains examples and tools for validating Dossier files against the JSON Schema.

## Overview

The Dossier Schema enables deterministic validation of Dossier metadata before LLM execution. These validation tools help ensure your Dossiers are compliant with the schema specification.

## Validation Tools

### Node.js Validator

**File**: `validate-dossier.js`

**Prerequisites**:
```bash
npm install ajv ajv-formats
```

**Usage**:
```bash
node validate-dossier.js <path-to-dossier.md>
```

**Example**:
```bash
# Validate the AWS deployment Dossier
node validate-dossier.js ../devops/deploy-to-aws.md
```

**Features**:
- Extracts JSON frontmatter from Dossier markdown files
- Validates against `dossier-schema.json`
- Provides detailed error messages with paths
- Returns exit code 0 (success) or 1 (failure)

---

### Python Validator

**File**: `validate-dossier.py`

**Prerequisites**:
```bash
pip install jsonschema
```

**Usage**:
```bash
python validate-dossier.py <path-to-dossier.md>
```

**Example**:
```bash
# Validate the AWS deployment Dossier
python validate-dossier.py ../devops/deploy-to-aws.md
```

**Features**:
- Extracts JSON frontmatter from Dossier markdown files
- Validates against `dossier-schema.json`
- Provides detailed error messages with validation constraints
- Returns exit code 0 (success) or 1 (failure)

---

## Validation Output

### Success Example

```
🔍 Validating: ../devops/deploy-to-aws.md

✓ Frontmatter extracted successfully
  Title: Deploy to AWS
  Version: 1.0.0
  Status: Stable

✅ VALID - Dossier schema is compliant
```

### Failure Example

```
🔍 Validating: my-dossier.md

✓ Frontmatter extracted successfully
  Title: My Dossier
  Version: 1.0.0
  Status: Draft

❌ INVALID - Schema validation failed:

  Error 1:
    Path: (root)
    Message: 'objective' is a required property

  Error 2:
    Path: status
    Message: 'Draft' is not one of ['Draft', 'Stable', 'Deprecated', 'Experimental']
```

---

## CI/CD Integration

You can integrate these validators into your CI/CD pipeline:

### GitHub Actions Example

```yaml
name: Validate Dossiers

on: [push, pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: |
          cd examples/validation
          npm install ajv ajv-formats

      - name: Validate all Dossiers
        run: |
          for file in examples/*/*.md; do
            node examples/validation/validate-dossier.js "$file" || exit 1
          done
```

### GitLab CI Example

```yaml
validate-dossiers:
  stage: test
  image: python:3.11
  script:
    - pip install jsonschema
    - |
      for file in examples/*/*.md; do
        python examples/validation/validate-dossier.py "$file" || exit 1
      done
```

---

## Pre-commit Hook

Add this to `.git/hooks/pre-commit` to validate before commits:

```bash
#!/bin/bash

echo "Validating Dossier schemas..."

# Find all changed .md files in examples/
for file in $(git diff --cached --name-only --diff-filter=ACM | grep '^examples/.*\.md$'); do
  if [ -f "$file" ]; then
    echo "Validating $file..."
    node examples/validation/validate-dossier.js "$file"
    if [ $? -ne 0 ]; then
      echo "❌ Validation failed for $file"
      echo "Fix the schema errors before committing."
      exit 1
    fi
  fi
done

echo "✅ All Dossiers valid"
exit 0
```

Make it executable:
```bash
chmod +x .git/hooks/pre-commit
```

---

## Manual Testing

### Test Valid Dossier

```bash
# Should pass
node validate-dossier.js ../devops/deploy-to-aws.md
echo $?  # Should output: 0
```

### Test Invalid Dossier

Create a test file `test-invalid.md`:

```markdown
---dossier
{
  "dossier_schema_version": "1.0.0",
  "title": "Test",
  "version": "1.0.0"
}
---

# Test Dossier
```

Validate it:
```bash
node validate-dossier.js test-invalid.md
echo $?  # Should output: 1
```

Expected errors:
- Missing required field: `protocol_version`
- Missing required field: `status`
- Missing required field: `objective`

---

## Validation Workflow

```
┌─────────────────────┐
│  Dossier File       │
│  (.md)              │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Extract            │
│  Frontmatter        │
│  (---dossier {...}) │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Parse JSON         │
│  (validate syntax)  │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Validate against   │
│  dossier-schema.json│
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Report Results     │
│  ✅ Valid / ❌ Invalid │
└─────────────────────┘
```

---

## Common Validation Errors

### 1. Missing Required Fields

**Error**:
```
'objective' is a required property
```

**Fix**: Add all required fields to your frontmatter:
- `dossier_schema_version`
- `title`
- `version`
- `protocol_version`
- `status`
- `objective`

### 2. Invalid Enum Values

**Error**:
```
'InProgress' is not one of ['Draft', 'Stable', 'Deprecated', 'Experimental']
```

**Fix**: Use one of the allowed status values:
```json
"status": "Draft"  // Not "InProgress"
```

### 3. Invalid Semver Format

**Error**:
```
String does not match pattern '^\\d+\\.\\d+\\.\\d+...'
```

**Fix**: Use valid semantic versioning:
```json
"version": "1.0.0"  // Not "1.0" or "v1.0.0"
```

### 4. Invalid Category

**Error**:
```
Additional items not allowed: 'my-category'
```

**Fix**: Use predefined categories from the schema:
```json
"category": ["devops", "deployment"]
```

Allowed categories: `devops`, `database`, `development`, `data-science`, `security`, `testing`, `deployment`, `maintenance`, `setup`, `migration`, `monitoring`, `infrastructure`, `ci-cd`, `documentation`

---

## Programmatic Usage

### Node.js

```javascript
const { validateDossier } = require('./validate-dossier.js');

const isValid = validateDossier('../devops/deploy-to-aws.md');
if (isValid) {
  console.log('Dossier is valid!');
} else {
  console.log('Dossier has schema errors');
}
```

### Python

```python
from validate_dossier import validate_dossier

is_valid = validate_dossier('../devops/deploy-to-aws.md')
if is_valid:
    print('Dossier is valid!')
else:
    print('Dossier has schema errors')
```

---

## Additional Resources

- [SCHEMA.md](../../SCHEMA.md) - Complete schema documentation
- [dossier-schema.json](../../dossier-schema.json) - JSON Schema definition
- [SPECIFICATION.md](../../SPECIFICATION.md) - Dossier specification

---

## Contributing

To add support for other languages:

1. Create a new validator file (e.g., `validate-dossier.go`, `validate-dossier.rb`)
2. Implement:
   - Frontmatter extraction (regex: `^---dossier\s*\n([\s\S]*?)\n---`)
   - JSON parsing
   - JSON Schema validation (use language-specific library)
   - Error reporting
3. Update this README with usage instructions
4. Add CI/CD example for the language

---

**Last Updated**: 2025-11-05
**Schema Version**: 1.0.0
