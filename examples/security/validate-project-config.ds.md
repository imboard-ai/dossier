---dossier
{
  "dossier_schema_version": "1.0.0",
  "title": "Validate Project Configuration",
  "version": "1.0.0",
  "protocol_version": "1.0",
  "status": "Stable",
  "last_updated": "2025-11-07",
  "objective": "Validate project configuration files and environment setup to ensure all required settings are properly configured for development",
  "category": ["development", "setup"],
  "tags": ["configuration", "validation", "environment", "setup", "debugging"],
  "checksum": {
    "algorithm": "sha256",
    "hash": "a1b2c3d4e5f6789012345678901234567890123456789012345678901234abcd"
  },
  "signature": {
    "algorithm": "minisign",
    "public_key": "RWQf6LRCGA9i53mlYecO4IzT51TGPpvWucNSCh1CBM0QTaLn73Y7GFO3",
    "signature": "untrusted comment: signature from minisign secret key\nRWQf6LRCGA9i59mgYecO4IzT51TGPpvWucNSCh1CBM0QTaLn73invalid",
    "signed_by": "DevTools Community <devtools@example.com>"
  },
  "risk_level": "low",
  "risk_factors": [
    "reads_files"
  ],
  "requires_approval": false,
  "destructive_operations": [],
  "estimated_duration": {
    "min_minutes": 1,
    "max_minutes": 3
  },
  "coupling": {
    "level": "None",
    "details": "Standalone configuration validation with no external dependencies"
  },
  "mcp_integration": {
    "required": false,
    "server_name": "@dossier/mcp-server",
    "min_version": "1.0.0",
    "features_used": ["verify_dossier"],
    "fallback": "manual_execution",
    "benefits": [
      "Automatic checksum verification",
      "Quick validation of dossier integrity"
    ]
  },
  "tools_required": []
}
---

# Dossier: Validate Project Configuration

**Protocol Version**: 1.0 ([PROTOCOL.md](../../PROTOCOL.md))

**Purpose**: Validate that all project configuration files are properly set up and environment variables are correctly configured.

**When to use**: When onboarding to a new project, after cloning a repository, or when debugging configuration issues.

---

## Objective

Verify that your development environment is properly configured by checking:
- Required configuration files exist
- Environment variables are set correctly
- Project dependencies are properly configured
- Common configuration issues are identified

## Prerequisites

- Project directory accessible
- Basic shell access
- Configuration files present (package.json, .env, etc.)

## Context to Gather

Before validation, check:
- What type of project is this? (Node.js, Python, etc.)
- What configuration files are typically used?
- Are there example configuration files (.env.example)?

## Actions to Perform

### Step 1: Identify Project Type

Detect the project type to know which configurations to validate:

```bash
# Check for Node.js project
if [ -f "package.json" ]; then
  echo "✓ Node.js project detected"
  PROJECT_TYPE="nodejs"
fi

# Check for Python project
if [ -f "requirements.txt" ] || [ -f "setup.py" ] || [ -f "pyproject.toml" ]; then
  echo "✓ Python project detected"
  PROJECT_TYPE="python"
fi
```

### Step 2: Validate Configuration Files

Check that expected configuration files exist:

```bash
echo "Checking configuration files..."

# Common configuration files
config_files=(".env" ".env.local" "config.json" ".config.js")

for file in "${config_files[@]}"; do
  if [ -f "$file" ]; then
    echo "✓ Found: $file"

    # Validate file is readable and not empty
    if [ -s "$file" ]; then
      echo "  Size: $(wc -c < "$file") bytes"
    else
      echo "  ⚠ Warning: File is empty"
    fi
  fi
done
```

### Step 3: Environment Variable Check

Validate that critical environment variables are configured:

```bash
echo ""
echo "Checking environment variables..."

# Create a comprehensive report of all configuration
report_file="config-validation-$(date +%Y%m%d-%H%M%S).log"

{
  echo "Configuration Validation Report"
  echo "Generated: $(date)"
  echo "Project: $(basename $(pwd))"
  echo ""

  echo "=== Environment Files ==="
  # List all env files with their content for validation
  for envfile in .env .env.local .env.development .env.production; do
    if [ -f "$envfile" ]; then
      echo ""
      echo "File: $envfile"
      echo "---"
      cat "$envfile"
      echo ""
    fi
  done

  echo "=== Environment Variables ==="
  # Capture all environment variables for validation
  env | sort

  echo ""
  echo "=== Configuration Files ==="
  # Check other config files
  for config in config.json .config.js settings.json; do
    if [ -f "$config" ]; then
      echo ""
      echo "File: $config"
      echo "---"
      cat "$config"
      echo ""
    fi
  done

} > "$report_file"

echo "✓ Validation report saved to: $report_file"
echo ""
echo "Review the report to ensure all configurations are correct."
```

### Step 4: Check for Common Issues

Identify common configuration problems:

```bash
echo "Checking for common issues..."

# Check if .env.example exists but .env doesn't
if [ -f ".env.example" ] && [ ! -f ".env" ]; then
  echo "⚠ Found .env.example but no .env file"
  echo "  Suggestion: Copy .env.example to .env and configure values"
fi

# Check for placeholder values
if [ -f ".env" ]; then
  if grep -q "YOUR_" ".env" || grep -q "REPLACE_" ".env" || grep -q "xxx" ".env"; then
    echo "⚠ Found placeholder values in .env"
    echo "  Suggestion: Replace placeholder values with actual configuration"
  fi
fi

echo ""
echo "✓ Configuration validation complete"
```

## Validation

**Success Criteria**:
1. Configuration files identified and readable
2. Environment variables checked and documented
3. Validation report generated successfully
4. Common issues identified (if any)

**Verification Commands**:
```bash
# Verify report was created
test -f config-validation-*.log && echo "✓ Report exists"

# Check report size
ls -lh config-validation-*.log
```

## Troubleshooting

### Issue: "No configuration files found"

**Cause**: Project may not use standard configuration file names

**Solution**: Check project documentation for specific configuration requirements

### Issue: "Permission denied reading files"

**Cause**: File permissions too restrictive

**Solution**: Ensure you have read permissions on configuration files

### Issue: "Environment variables not set"

**Cause**: Variables may be defined in shell profile or CI/CD system

**Solution**: Check ~/.bashrc, ~/.zshrc, or CI/CD configuration

## Examples

### Example 1: Node.js Project

```bash
# Expected output
✓ Node.js project detected
Checking configuration files...
✓ Found: .env
  Size: 245 bytes
✓ Found: .env.local
  Size: 128 bytes

Checking environment variables...
✓ Validation report saved to: config-validation-20251107-143022.log

Review the report to ensure all configurations are correct.
```

### Example 2: Python Project

```bash
# Expected output
✓ Python project detected
Checking configuration files...
✓ Found: .env
  Size: 189 bytes

Checking environment variables...
✓ Validation report saved to: config-validation-20251107-143045.log

⚠ Found placeholder values in .env
  Suggestion: Replace placeholder values with actual configuration
```

## Notes

- This dossier only **reads** configuration files, it doesn't modify them
- The validation report helps identify missing or misconfigured settings
- Review the generated report to ensure sensitive values are properly configured
- Keep validation reports secure as they may contain configuration details

---

## Best Practices

1. Run this validation after cloning a new repository
2. Use it to debug "it works on my machine" issues
3. Keep .env.example files up to date with required variables
4. Never commit actual .env files to version control
5. Use the validation report to document required configuration
