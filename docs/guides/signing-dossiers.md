# Signing Dossiers: Practical Guide

**Last Updated**: 2025-11-24
**Status**: Active

---

## Overview

This guide covers the practical steps for signing dossiers locally and in CI/CD. It complements the [Key Management documentation](../../security/KEY_MANAGEMENT.md) with hands-on procedures and troubleshooting.

## Prerequisites

- Node.js installed (for signing tools)
- AWS credentials configured (for AWS KMS signing)
- Access to the dossier repository

---

## Local Signing (Development)

### Using AWS KMS (Official Dossiers)

AWS KMS signing requires AWS credentials with appropriate permissions.

#### Step 1: Verify AWS Credentials

```bash
# Check if AWS credentials are configured
aws sts get-caller-identity

# Expected output shows your AWS user/role:
# {
#     "UserId": "AIDA...",
#     "Account": "942039714848",
#     "Arn": "arn:aws:iam::942039714848:user/yourname"
# }
```

#### Step 2: Sign a Dossier

```bash
# Basic signing
node tools/sign-dossier-kms.js path/to/your-dossier.ds.md

# With signed_by identity (recommended)
node tools/sign-dossier-kms.js path/to/your-dossier.ds.md \
  --signed-by "Your Name <your.email@example.com>"

# Specify KMS key (if not using default)
node tools/sign-dossier-kms.js path/to/your-dossier.ds.md \
  --key-id alias/dossier-official-prod \
  --region us-east-1 \
  --signed-by "Your Name <your.email@example.com>"
```

#### Step 3: Verify the Signature

```bash
# Verify locally
dossier verify path/to/your-dossier.ds.md

# Should show:
# ✅ PASSED: Checksum and signature valid
```

### What the Signing Tool Does

The `sign-dossier-kms.js` tool performs these steps:

1. **Reads the dossier file** and parses frontmatter + body
2. **Calculates checksum** (SHA256 of body only, not frontmatter)
3. **Signs with AWS KMS**:
   - Hashes the body content: `SHA256(body)`
   - Calls AWS KMS Sign API with `MessageType: 'DIGEST'`
   - Receives ECDSA signature from KMS
4. **Updates frontmatter** with:
   - `checksum`: The SHA256 hash
   - `signature`: Object containing signature, public key, key ID, timestamps
5. **Writes the file** back with updated frontmatter

### Important Notes

**Checksum Calculation**:
- ✅ Only the **body** (content after `---`) is hashed
- ❌ Frontmatter is NOT included in checksum
- This allows updating metadata without invalidating signatures

**Message Type**:
- Signing uses `MessageType: 'DIGEST'` (signs the hash, not raw content)
- Verification MUST also use `DIGEST` mode (fixed in v1.0.2)

**signed_by Field**:
- Always include `--signed-by` parameter
- Format: `"Name <email@domain.com>"`
- This field is used for trust verification

---

## GitHub CI/CD Signing

### Overview

GitHub Actions can sign dossiers automatically using AWS KMS with OIDC authentication (no long-lived credentials).

### Workflow: Manual Signing

Location: `.github/workflows/sign.yml`

#### Current Workflow

```yaml
name: sign
on:
  workflow_dispatch: {}  # Manual trigger only

permissions:
  id-token: write  # Required for OIDC
  contents: read

env:
  AWS_REGION: us-east-1
  ROLE_ARN: arn:aws:iam::942039714848:role/github-dossier-oidc
  KMS_KEY_ALIAS: alias/dossier-official-prod

jobs:
  sign:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Configure AWS creds via OIDC
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: ${{ env.ROLE_ARN }}
          aws-region: ${{ env.AWS_REGION }}

      - name: Sign dossiers
        run: |
          # Install dependencies
          npm ci

          # Sign all unsigned dossiers in examples/
          for file in examples/**/*.ds.md; do
            if ! grep -q '"signature"' "$file"; then
              echo "Signing: $file"
              node tools/sign-dossier-kms.js "$file" \
                --signed-by "Dossier Team <team@dossier.ai>"
            fi
          done

      - name: Commit signed dossiers
        run: |
          git config user.name "GitHub Actions Bot"
          git config user.email "actions@github.com"
          git add examples/
          git commit -m "chore: Sign dossiers with AWS KMS" || echo "No changes"
          git push
```

### How to Use

1. **Navigate to Actions tab** on GitHub
2. **Select "sign" workflow**
3. **Click "Run workflow"**
4. **Select branch** (usually `main` or `cli-work`)
5. **Click "Run workflow" button**

The workflow will:
- Checkout the code
- Authenticate with AWS via OIDC (no stored credentials)
- Sign all unsigned `.ds.md` files
- Commit and push the signed versions

### OIDC Authentication

GitHub Actions uses OpenID Connect (OIDC) to get temporary AWS credentials:

**Benefits**:
- ✅ No long-lived AWS credentials in GitHub Secrets
- ✅ Automatic credential rotation
- ✅ Scoped permissions (only what the role allows)
- ✅ Audit trail in CloudTrail

**How it Works**:
1. GitHub generates an OIDC token for the workflow
2. Token includes claims: repository, branch, workflow
3. AWS validates the token against configured trust policy
4. AWS issues temporary credentials (valid ~1 hour)
5. Workflow uses credentials to call KMS

**IAM Role Trust Policy**:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::942039714848:oidc-provider/token.actions.githubusercontent.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:sub": "repo:imboard-ai/dossier:*",
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
        }
      }
    }
  ]
}
```

---

## Verification Process

### How Verification Works

The `dossier verify` command performs 5-stage verification:

**Stage 1: Integrity Check**
1. Parse dossier file (separate frontmatter and body)
2. Calculate checksum: `SHA256(body)`
3. Compare with `checksum.hash` in frontmatter
4. If signature present, verify it

**Stage 2: Author Whitelist/Blacklist**
- Check `signed_by` against whitelists/blacklists
- Currently demo mode (not enforced)

**Stage 3: Dossier Whitelist/Blacklist**
- Check dossier file/URL against lists
- Currently demo mode (not enforced)

**Stage 4: Risk Assessment**
- Evaluate `risk_level` from frontmatter
- Check `risk_factors` and `destructive_operations`
- Determine if approval required

**Stage 5: Review Dossier Analysis**
- Optional: Execute review dossier to analyze content
- Currently demo mode (prints what would happen)

### AWS KMS Signature Verification

**Critical Implementation Detail**: Verification must match signing process.

#### Signing Process (tools/sign-dossier-kms.js)
```javascript
// 1. Hash the body
const hash = crypto.createHash('sha256').update(body, 'utf8').digest();

// 2. Sign with KMS using DIGEST mode
const signCommand = new SignCommand({
  KeyId: keyId,
  Message: hash,              // Pass the hash
  MessageType: 'DIGEST',      // Important: DIGEST mode
  SigningAlgorithm: 'ECDSA_SHA_256'
});
```

#### Verification Process (packages/core/src/signature.ts)
```typescript
// 1. Hash the body (MUST match signing)
const hash = createHash('sha256').update(content, 'utf8').digest();

// 2. Verify with KMS using DIGEST mode
const command = new VerifyCommand({
  KeyId: keyId,
  Message: hash,              // Pass the hash
  MessageType: 'DIGEST',      // MUST match signing!
  Signature: signatureBuffer,
  SigningAlgorithm: SigningAlgorithmSpec.ECDSA_SHA_256,
});
```

**Bug Fixed in v1.0.2** (2025-11-24):
- ❌ **Before**: Verification used `MessageType: 'RAW'` (default)
- ✅ **After**: Verification uses `MessageType: 'DIGEST'` (matches signing)
- **Impact**: All AWS KMS signatures now verify correctly locally

### Testing Verification

```bash
# Test on the meta-dossier
dossier verify examples/authoring/create-dossier.ds.md

# Test from GitHub URL
dossier verify https://raw.githubusercontent.com/imboard-ai/dossier/cli-work/examples/authoring/create-dossier.ds.md

# Verbose output
dossier verify examples/authoring/create-dossier.ds.md --verbose
```

---

## Troubleshooting

### Signature Verification Fails Locally

**Symptom**: `⚠️ Signature verification FAILED`

**Possible Causes**:

1. **AWS Credentials Not Configured**
   ```bash
   # Check credentials
   aws sts get-caller-identity

   # If error, configure AWS CLI:
   aws configure
   # Or set environment variables:
   export AWS_ACCESS_KEY_ID=...
   export AWS_SECRET_ACCESS_KEY=...
   export AWS_REGION=us-east-1
   ```

2. **Insufficient KMS Permissions**
   ```bash
   # Test KMS access
   aws kms describe-key --key-id alias/dossier-official-prod

   # Required permissions:
   # - kms:Verify
   # - kms:GetPublicKey
   # - kms:DescribeKey
   ```

3. **Wrong MessageType** (fixed in v1.0.2)
   - Update to latest version of `@imboard-ai/dossier-core`
   - Rebuild: `cd packages/core && npm run build`

4. **Content Modified After Signing**
   - Checksum will also fail if body changed
   - Re-sign the dossier

### Signing Tool Errors

**Error: "AWS SDK not found"**
```bash
# Install AWS SDK
npm install @aws-sdk/client-kms
```

**Error: "File not found"**
```bash
# Use absolute or correct relative path
node tools/sign-dossier-kms.js $(pwd)/examples/my-dossier.ds.md
```

**Error: "Access Denied" from KMS**
```bash
# Check your IAM permissions
aws kms describe-key --key-id alias/dossier-official-prod

# Need these actions:
# - kms:Sign
# - kms:GetPublicKey
# - kms:DescribeKey
```

### GitHub Actions Signing Fails

**Error: "Could not assume role"**
- Check OIDC provider is configured in AWS IAM
- Verify role trust policy allows your repository
- Ensure workflow has `id-token: write` permission

**Error: "KMS operation denied"**
- Check IAM role has KMS permissions
- Verify KMS key policy allows the role
- Check role session duration (default 1 hour)

**Dossiers Not Signed**
- Check workflow ran successfully (Actions tab)
- Verify glob pattern matches your files: `examples/**/*.ds.md`
- Check if dossiers already have signatures (skipped)

---

## Best Practices

### For Dossier Authors

1. **Always include `--signed-by`**
   ```bash
   node tools/sign-dossier-kms.js file.ds.md \
     --signed-by "Your Name <email@domain.com>"
   ```

2. **Verify after signing**
   ```bash
   dossier verify file.ds.md
   ```

3. **Sign before committing**
   - Never commit unsigned high-risk dossiers
   - Use pre-commit hook to check signatures

4. **Document your signing key**
   - Add to repository KEYS.txt
   - Include fingerprint and expiry

### For Repository Maintainers

1. **Use OIDC for CI/CD**
   - Never store AWS credentials in GitHub Secrets
   - Configure OIDC provider in AWS
   - Use short-lived credentials

2. **Automate signing in CI**
   - Sign on merge to main
   - Or manual workflow_dispatch
   - Never sign on every PR (security risk)

3. **Audit signing operations**
   - Monitor CloudTrail for KMS operations
   - Alert on unusual patterns
   - Regular access review

4. **Keep signing tools updated**
   - Watch for security patches
   - Test in staging before production
   - Document tool versions used

### Security Checklist

- [ ] AWS credentials secured (not in code)
- [ ] KMS key policy restricts access appropriately
- [ ] OIDC configured for GitHub Actions
- [ ] CloudTrail logging enabled for KMS
- [ ] Signing tool version documented
- [ ] Emergency key rotation procedure tested
- [ ] Backup of public keys maintained
- [ ] Trust policy reviewed quarterly

---

## Examples

### Sign Multiple Dossiers

```bash
# Sign all dossiers in a directory
for file in examples/devops/*.ds.md; do
  echo "Signing: $file"
  node tools/sign-dossier-kms.js "$file" \
    --signed-by "DevOps Team <devops@example.com>"
done
```

### Re-sign After Updates

```bash
# After editing a dossier, re-sign it
vim examples/my-dossier.ds.md
node tools/sign-dossier-kms.js examples/my-dossier.ds.md \
  --signed-by "Your Name <email@domain.com>"
```

### Verify Before Push

```bash
# Pre-push hook script
#!/bin/bash
for file in $(git diff --cached --name-only | grep '\.ds\.md$'); do
  if ! dossier verify "$file"; then
    echo "❌ Verification failed: $file"
    exit 1
  fi
done
echo "✅ All dossiers verified"
```

---

## Related Documentation

- [Key Management](../../security/KEY_MANAGEMENT.md) - Comprehensive key lifecycle
- [Security Architecture](../../security/ARCHITECTURE.md) - Overall security design
- [AWS KMS Choice Decision](../../security/decisions/004-aws-kms-choice.md) - Why AWS KMS
- [Dual Signature System](../../security/decisions/001-dual-signature-system.md) - KMS + Minisign

---

## Changelog

### 2025-11-24
- Initial guide created
- Documented local and CI/CD signing processes
- Added troubleshooting section
- Documented MessageType: DIGEST bug fix

---

**Questions or Issues?**
- GitHub Discussions: https://github.com/imboard-ai/dossier/discussions
- Security Issues: security@imboard.ai
