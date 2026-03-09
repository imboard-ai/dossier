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
    "hash": "a09b457d3865c2da13534a862f47230456ed75a34a9252e80efab31dab63cf7c"
  }
}
---
# Scaffold TypeScript Project

## Objective

Scaffold a complete TypeScript project with CI pipeline, testing, linting, documentation, environment management, and optionally worktree support. The resulting project should pass all checks (`typecheck + lint + test`) out of the box.

## Constraints

These are non-negotiable requirements the agent must follow:

- **ESM**: `"type": "module"` in package.json -- all imports use ESM
- **TypeScript strict mode**: `"strict": true` in tsconfig.json
- **Target**: ES2022 or later, with `"module": "ESNext"` and `"moduleResolution": "Bundler"`
- **Test runner**: Vitest (not Jest) -- tests co-located in `lib/__tests__/*.test.ts`
- **Source layout**: Source code in `lib/`, build output in `dist/`
- **CI**: GitHub Actions workflow on `main` branch, running typecheck + lint + test
- **AGENTS.md**: Every scaffolded project must include an AGENTS.md with build commands and code style conventions
- **Dev script**: Must use `node --env-file=.env --import tsx` for local development (not ts-node)

## Decision Points

### Linter choice (input: `linter`)
- **Biome** (default): All-in-one lint + format. Recommended for new projects.
- **ESLint**: When React/specific ecosystem plugins are needed.

### Worktree support (input: `skip_worktrees`)
- **Enable** (default): Sets up the project directory as `main/` worktree with a `WORKTREES.md` guide. Required for parallel agent development.
- **Skip**: For small scripts or throwaway projects.

### GitHub repo creation (input: `skip_github_repo`)
- **Create**: When `github_org` is provided and repo doesn't already exist.
- **Skip**: For local experiments or existing repos.

## Known Pitfalls

- **`import.meta.url` requires ESNext modules**: If tsconfig uses `"module": "CommonJS"`, TypeScript will error on `import.meta.url`. The module setting must be `"ESNext"`.
- **`--env-file` requires Node 20.6+**: The `node --env-file=.env` flag doesn't exist in older Node versions. The `engines` field in package.json must enforce `>= ${node_version}`.
- **CI/local parity**: `package-lock.json` must be committed for `npm ci` to work in CI. If the agent uses `npm install` locally, it must commit the lockfile.
- **Biome schema version**: Use `https://biomejs.dev/schemas/2.0.0/schema.json` -- older schema versions cause validation warnings.

## Validation

- [ ] `npm run check` passes (typecheck + lint + test -- all three)
- [ ] `npm run dev` starts without errors
- [ ] `package.json` has `"type": "module"`
- [ ] `tsconfig.json` has `"strict": true` and `"module": "ESNext"`
- [ ] GitHub Actions CI workflow exists at `.github/workflows/ci.yml`
- [ ] `.gitignore` covers `node_modules/`, `dist/`, `.env`, IDE files
- [ ] `AGENTS.md` exists with project structure and build commands
- [ ] `.env.example` exists
- [ ] Git repo initialized with initial commit
- [ ] If worktrees enabled: project directory is `main/` and `WORKTREES.md` exists
