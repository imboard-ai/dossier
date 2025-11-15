# Publishing Guide

Guide for publishing @dossier packages to GitHub Packages and npm.

## Quick Start

### Automated Publishing (Recommended)

The packages are automatically published to GitHub Packages when you push changes to `cli/` or `packages/core/` on the `main` branch.

**Or trigger manually:**

1. Go to: https://github.com/imboard-ai/dossier/actions/workflows/publish-packages.yml
2. Click "Run workflow"
3. Select version bump (patch/minor/major) or skip
4. Click "Run workflow"

### Manual Publishing

```bash
# From repository root
npm run publish:all
```

---

## Publishing to GitHub Packages

### First Time Setup

Packages are configured to publish to GitHub Packages registry:
- `@imboard-ai/dossier-core` → https://github.com/imboard-ai/dossier/packages
- `@imboard-ai/dossier-cli` → https://github.com/imboard-ai/dossier/packages

**No additional setup needed** - GitHub Actions handles authentication automatically.

### Manual Publish Steps

```bash
# 1. Build and publish core
npm run publish:core

# 2. Publish CLI
npm run publish:cli

# Or do both at once
npm run publish:all
```

---

## Installing from GitHub Packages

### For Users

**Step 1: Configure npm for @dossier scope**

Create/edit `~/.npmrc`:
```
@imboard-ai:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN
```

**Get a GitHub token:**
1. Go to https://github.com/settings/tokens
2. Generate new token (classic)
3. Select: `read:packages`
4. Copy token and add to `~/.npmrc`

**Step 2: Install**

```bash
# Install globally
npm install -g @imboard-ai/dossier-cli

# Or use with npx
npx @imboard-ai/dossier-cli --help
```

**Step 3: Test**

```bash
dossier-verify --help
dossier-verify https://raw.githubusercontent.com/imboard-ai/dossier/main/examples/devops/deploy-to-aws.ds.md
```

---

## Version Management

### Automatic Version Bumps (GitHub Actions)

When running the workflow manually:
- **patch**: 0.1.0 → 0.1.1 (bug fixes)
- **minor**: 0.1.0 → 0.2.0 (new features, backward compatible)
- **major**: 0.1.0 → 1.0.0 (breaking changes)
- **skip**: Don't bump version, just publish current

The workflow will:
1. Bump version in both packages
2. Update CLI dependency on core
3. Commit the version bump
4. Publish both packages
5. Create a git tag (e.g., `v0.2.0`)

### Manual Version Bumps

```bash
# Bump core version
cd packages/core
npm version patch  # or minor, major

# Bump CLI version and update dependency
cd ../../cli
npm version patch
npm pkg set dependencies.@imboard-ai/dossier-core="^$(cd ../packages/core && node -p 'require(\"./package.json\").version')"

# Commit
git add packages/core/package.json cli/package.json
git commit -m "chore: bump version to $(node -p 'require(\"./package.json\").version')"
git push

# Publish
cd ..
npm run publish:all
```

---

## Publishing to Public npm Registry

### When to Switch

Switch from GitHub Packages to public npm when:
- Ready for public release
- Want easier installation (no `.npmrc` setup needed)
- Want package to be discoverable on npmjs.com

### How to Switch

**1. Update `publishConfig` in both packages:**

In `packages/core/package.json` and `cli/package.json`:
```json
{
  "publishConfig": {
    "access": "public",
    "registry": "https://registry.npmjs.org"  // Change this line
  }
}
```

**2. Update GitHub Actions workflow:**

In `.github/workflows/publish-packages.yml`:
```yaml
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: '18'
    registry-url: 'https://registry.npmjs.org'  # Change this
    scope: '@dossier'

# And update auth token
env:
  NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}  # Use npm token instead
```

**3. Add NPM_TOKEN secret:**
1. Get token from https://www.npmjs.com/settings/YOUR_USERNAME/tokens
2. Add to GitHub: Settings → Secrets → New repository secret
3. Name: `NPM_TOKEN`

**4. Publish:**
```bash
npm run publish:all
```

---

## Workflow Triggers

The GitHub Actions workflow runs on:

1. **Push to main** - when these files change:
   - `cli/**`
   - `packages/core/**`
   - `.github/workflows/publish-packages.yml`

2. **Manual trigger** - via GitHub Actions UI with optional version bump

### Preventing Auto-Publish

If you want to push changes without auto-publishing:
- Push to a feature branch first
- Merge via PR (workflow won't run on PR merge commits automatically due to path filters)
- Or temporarily disable the workflow

---

## Troubleshooting

### "Package already exists"

If you get version conflicts:
```bash
# Bump version first
cd cli
npm version patch
git add package.json
git commit -m "chore: bump version"
git push
```

### "Permission denied"

For GitHub Packages, ensure:
- Repository has `packages: write` permission in workflow
- Using `GITHUB_TOKEN` (automatically available in Actions)

For npm, ensure:
- `NPM_TOKEN` secret is set
- Token has publish permissions

### "Cannot find module @imboard-ai/dossier-core"

The CLI depends on core, so core must be published first:
```bash
npm run publish:core
npm run publish:cli
```

---

## Best Practices

1. **Always bump versions** when making changes
2. **Test locally first** with `npm pack` and local installation
3. **Use semantic versioning** (patch/minor/major appropriately)
4. **Document changes** in commit messages
5. **Create releases** on GitHub after significant updates
6. **Test installation** from GitHub Packages before major releases

---

## Related

- Issue #27: npm publishing checklist
- Issue #28: Standalone binaries (future)
- GitHub Packages docs: https://docs.github.com/en/packages
