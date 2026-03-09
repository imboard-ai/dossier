---dossier
{
  "dossier_schema_version": "1.0.0",
  "title": "Scaffold TypeScript Project",
  "version": "1.0.0",
  "protocol_version": "1.0",
  "status": "Draft",
  "last_updated": "2026-03-09",
  "objective": "Scaffold a complete TypeScript project with CI, testing, linting, documentation, and worktree support — eliminating repetitive boilerplate setup",
  "category": [
    "development",
    "setup"
  ],
  "tags": [
    "scaffold",
    "typescript",
    "boilerplate",
    "ci",
    "project-creation",
    "github-actions"
  ],
  "tools_required": [
    {
      "name": "node",
      "version": ">=20.0.0",
      "check_command": "node --version"
    },
    {
      "name": "gh",
      "version": ">=2.0.0",
      "check_command": "gh --version"
    },
    {
      "name": "git",
      "version": ">=2.30.0",
      "check_command": "git --version"
    }
  ],
  "risk_level": "medium",
  "requires_approval": false,
  "risk_factors": [
    "modifies_files"
  ],
  "destructive_operations": [
    "Creates multiple files in the target directory",
    "Runs npm install (modifies node_modules and package-lock.json)"
  ],
  "estimated_duration": {
    "min_minutes": 5,
    "max_minutes": 15
  },
  "inputs": {
    "required": [
      {
        "name": "project_name",
        "description": "Name of the project (kebab-case, used for package.json name and repo)",
        "type": "string",
        "example": "my-awesome-tool"
      },
      {
        "name": "project_dir",
        "description": "Absolute path to the project root directory",
        "type": "string",
        "example": "/home/user/projects/my-awesome-tool/main"
      },
      {
        "name": "description",
        "description": "One-line project description",
        "type": "string",
        "example": "CLI tool for managing AI agent workflows"
      }
    ],
    "optional": [
      {
        "name": "github_org",
        "description": "GitHub organization for the repo (skip if repo already exists)",
        "type": "string",
        "default": "",
        "example": "imboard-ai"
      },
      {
        "name": "license",
        "description": "License type",
        "type": "string",
        "default": "MIT",
        "example": "AGPL-3.0"
      },
      {
        "name": "linter",
        "description": "Linter to use: biome or eslint",
        "type": "string",
        "default": "biome",
        "example": "eslint"
      },
      {
        "name": "node_version",
        "description": "Node.js version for CI matrix",
        "type": "string",
        "default": "22",
        "example": "20"
      },
      {
        "name": "skip_worktrees",
        "description": "Skip worktree support setup",
        "type": "boolean",
        "default": false
      },
      {
        "name": "skip_github_repo",
        "description": "Skip GitHub repo creation (use if repo already exists)",
        "type": "boolean",
        "default": false
      },
      {
        "name": "author_name",
        "description": "Author name for package.json",
        "type": "string",
        "default": "",
        "example": "Yuval Dimnik"
      },
      {
        "name": "author_email",
        "description": "Author email for package.json",
        "type": "string",
        "default": "",
        "example": "yuval.dimnik@gmail.com"
      }
    ]
  },
  "outputs": {
    "files": [
      {
        "path": "package.json",
        "description": "Package manifest with ESM, scripts, devDependencies"
      },
      {
        "path": "tsconfig.json",
        "description": "TypeScript config (strict, ES2022, ESNext modules)"
      },
      {
        "path": ".gitignore",
        "description": "Comprehensive gitignore for Node/TypeScript"
      },
      {
        "path": ".github/workflows/ci.yml",
        "description": "GitHub Actions CI (typecheck + lint + test)"
      },
      {
        "path": "AGENTS.md",
        "description": "AI agent behavioral rules and project context"
      },
      {
        "path": "vitest.config.ts",
        "description": "Vitest test runner configuration"
      },
      {
        "path": ".env.example",
        "description": "Example environment variables"
      },
      {
        "path": "lib/index.ts",
        "description": "Entry point placeholder"
      }
    ]
  },
  "checksum": {
    "algorithm": "sha256",
    "hash": "5656ee72b0e718647e85ef04a4523c86b17d4ea10ee7125e6e7698b6c62d1a1e"
  }
}
---
# Scaffold TypeScript Project

## Objective

Scaffold a complete TypeScript project with all standard boilerplate: CI pipeline, testing, linting, documentation, environment management, and optionally worktree support. This eliminates the repetitive "let me add CI, let me add workflows, let me add configs" cycle when starting new projects.

## Prerequisites

- [ ] Node.js >= 20 installed
- [ ] GitHub CLI authenticated (`gh auth status`)
- [ ] Git configured with user name and email
- [ ] Target directory exists or can be created

## Context to Gather

Before scaffolding:

1. **Check if directory exists** — if it has existing files, warn and ask before overwriting
2. **Check if git repo exists** — if `.git/` already exists, skip `git init`
3. **Check if GitHub repo exists** — if `skip_github_repo` is false, check with `gh repo view ${github_org}/${project_name}` before creating
4. **Detect author info** — if `author_name`/`author_email` not provided, read from `git config user.name` and `git config user.email`

## Actions to Perform

### Step 1: Create Directory Structure

```
${project_dir}/
├── lib/                    # Source code
│   ├── index.ts            # Entry point
│   └── __tests__/          # Test files
├── .github/
│   └── workflows/
│       └── ci.yml          # CI pipeline
├── package.json
├── tsconfig.json
├── vitest.config.ts
├── .gitignore
├── .env.example
├── AGENTS.md
└── README.md
```

Create the directory structure:
```bash
mkdir -p ${project_dir}/{lib/__tests__,.github/workflows}
```

### Step 2: Create package.json

```json
{
  "name": "${project_name}",
  "version": "0.1.0",
  "description": "${description}",
  "type": "module",
  "scripts": {
    "build": "tsc",
    "dev": "node --env-file=.env --import tsx lib/index.ts",
    "test": "vitest run",
    "test:watch": "vitest",
    "typecheck": "tsc --noEmit",
    "lint": "${linter === 'biome' ? 'biome check .' : 'eslint src/'}",
    "lint:fix": "${linter === 'biome' ? 'biome check --write .' : 'eslint src/ --fix'}",
    "check": "npm run typecheck && npm run lint && npm run test"
  },
  "author": "${author_name} <${author_email}>",
  "license": "${license}",
  "engines": {
    "node": ">=${node_version}.0.0"
  },
  "devDependencies": {}
}
```

Then install dev dependencies:
```bash
cd ${project_dir}
npm install --save-dev typescript @types/node tsx vitest
```

If `linter === 'biome'`:
```bash
npm install --save-dev @biomejs/biome
```

If `linter === 'eslint'`:
```bash
npm install --save-dev eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser
```

### Step 3: Create tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "outDir": "dist",
    "rootDir": ".",
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["lib/**/*.ts"],
  "exclude": ["node_modules", "dist", "lib/__tests__"]
}
```

### Step 4: Create .gitignore

```
# Dependencies
node_modules/

# Build output
dist/
build/
*.tsbuildinfo

# Environment
.env
.env.*
!.env.example

# Logs
logs/
*.log
npm-debug.log*

# Coverage & test output
coverage/
test-results/

# OS files
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp

# Temp
.cache/
temp/
tmp/
```

### Step 5: Create GitHub Actions CI

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '${node_version}'
          cache: 'npm'
      - run: npm ci
      - run: npx tsc --noEmit
      - run: npm run lint
      - run: npm test
```

### Step 6: Create vitest.config.ts

```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['lib/__tests__/**/*.test.ts'],
  },
});
```

### Step 7: Create Linter Config

**If biome**: Create `biome.json`:
```json
{
  "$schema": "https://biomejs.dev/schemas/2.0.0/schema.json",
  "vcs": {
    "enabled": true,
    "clientKind": "git",
    "useIgnoreFile": true
  },
  "formatter": {
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 100
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true
    }
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "single",
      "semicolons": "always",
      "trailingCommas": "es5"
    }
  }
}
```

**If eslint**: Create `eslint.config.js`:
```javascript
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';

export default [
  {
    files: ['lib/**/*.ts'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
];
```

### Step 8: Create .env.example

```bash
# ${project_name} environment variables
# Copy this file to .env and fill in values:
#   cp .env.example .env

# Example:
# API_KEY=your-api-key-here
```

### Step 9: Create AGENTS.md

```markdown
# ${project_name}

## What This Is

${description}

## Repo Structure

```
${project_name}/
├── lib/                    # Source code
│   ├── index.ts            # Entry point
│   └── __tests__/          # Tests (vitest)
├── .github/workflows/      # CI/CD
├── package.json            # ESM, TypeScript
├── tsconfig.json           # Strict TypeScript
└── AGENTS.md               # This file
```

## Build & Test

```bash
npm run typecheck           # TypeScript type checking
npm run lint                # Lint (${linter})
npm run test                # Run tests (vitest)
npm run check               # All checks (typecheck + lint + test)
npm run dev                 # Run with .env loaded
```

## Code Style

- **TypeScript**: ESM (`"type": "module"`), strict mode
- **Linter**: ${linter}
- **Tests**: vitest, files in `lib/__tests__/*.test.ts`
- **Dates**: ISO 8601 (`YYYY-MM-DD`)
- **IDs**: kebab-case
- **JSON**: 2-space indent, trailing newline

## Conventions

- Run `npm run check` before committing
- Zero lint/type errors policy — don't introduce regressions
- Unused vars: prefix with `_`
- Tests: co-located in `lib/__tests__/`, named `*.test.ts`
```

### Step 10: Create Entry Point

Create `lib/index.ts`:
```typescript
/**
 * ${project_name} — ${description}
 */

export function main(): void {
  console.log('${project_name} is running');
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
```

Create `lib/__tests__/index.test.ts`:
```typescript
import { describe, it, expect } from 'vitest';
import { main } from '../index.js';

describe('${project_name}', () => {
  it('should export main function', () => {
    expect(typeof main).toBe('function');
  });
});
```

### Step 11: Create README.md

```markdown
# ${project_name}

${description}

## Quick Start

```bash
# Install dependencies
npm install

# Run
npm run dev

# Test
npm test
```

## Development

See [AGENTS.md](./AGENTS.md) for development conventions and project structure.

## License

${license}
```

### Step 12: Set Up Worktree Support (if not skipped)

If `skip_worktrees` is false:

1. Ensure the project directory is named `main/` (the main worktree)
2. Create `WORKTREES.md`:

```markdown
# Worktrees

Active worktrees for ${project_name}.

| Worktree | Branch | Created | Status | Purpose |
|----------|--------|---------|--------|---------|
| main/    | main   | ${today} | Active | Primary development |

## Commands

```bash
# Create a feature worktree
git worktree add ../feature-name -b feature/name

# List all worktrees
git worktree list

# Remove a worktree after merging
git worktree remove ../feature-name
```

## Rules

- Never checkout branches in `main/` — always create a worktree
- Each worktree gets its own `node_modules` — run `npm install` after creating
- Clean up worktrees after PR merge
```

### Step 13: Initialize Git & GitHub

If no `.git/` directory exists:
```bash
cd ${project_dir}
git init
git add -A
git commit -m "feat: scaffold ${project_name} project"
```

If `skip_github_repo` is false and `github_org` is provided:
```bash
gh repo create ${github_org}/${project_name} --private --source=. --push
```

If repo already exists, just push:
```bash
git remote add origin https://github.com/${github_org}/${project_name}.git
git push -u origin main
```

### Step 14: Verify Everything Works

Run the full check suite:
```bash
cd ${project_dir}
npm run check
```

Expected output:
- `tsc --noEmit` passes with zero errors
- Linter passes with zero errors/warnings
- `vitest run` shows 1 passing test

## Decision Points

### 1. Biome vs ESLint
- **Biome** (default): Faster, simpler config, all-in-one (lint + format). Best for new projects.
- **ESLint**: More ecosystem plugins, more granular control. Best when you need React/specific plugins.

### 2. Worktree Support
- **Enable** (default): Required for parallel agent development. All imboard-ai projects use worktrees.
- **Skip**: For small scripts or throwaway projects.

### 3. GitHub Repo
- **Create**: For real projects that will be maintained.
- **Skip**: For local experiments or when repo already exists.

## Validation

- [ ] `package.json` has `"type": "module"` and correct scripts
- [ ] `tsconfig.json` is strict with ESNext modules
- [ ] `.gitignore` covers node_modules, dist, .env, IDE files
- [ ] GitHub Actions CI runs typecheck + lint + test
- [ ] vitest.config.ts points to correct test directory
- [ ] Linter config exists and passes on generated code
- [ ] `.env.example` exists (even if empty)
- [ ] `AGENTS.md` describes project structure and conventions
- [ ] `README.md` has quick start instructions
- [ ] Entry point runs: `npm run dev`
- [ ] Tests pass: `npm test`
- [ ] Full check passes: `npm run check`
- [ ] Git repo initialized with initial commit
- [ ] If worktrees enabled: `WORKTREES.md` exists

## Troubleshooting

**Issue**: `npm run dev` fails with "Cannot find module"
**Solution**: Ensure `"type": "module"` in package.json and `--import tsx` flag is present in the dev script.

**Issue**: TypeScript errors on `import.meta.url`
**Solution**: Ensure `"module": "ESNext"` in tsconfig.json (not CommonJS).

**Issue**: Vitest can't find tests
**Solution**: Check `vitest.config.ts` include pattern matches your test file locations.

**Issue**: CI fails but local passes
**Solution**: Check Node version in CI matches local. Ensure `package-lock.json` is committed.
