# Authoring Guidelines

How to write dossiers that help agents succeed rather than constrain them.

> **Key insight**: Research shows that overly detailed, procedural context files can *reduce* agent task success rates while increasing cost. Dossiers should tell agents **what** to achieve and **why** it matters, not **how** to do it step-by-step. ([arXiv 2602.11988][paper])

---

## The Core Principle: Declarative Over Procedural

Agents are good at figuring out *how* to accomplish tasks. They can read codebases, discover project structure, choose appropriate tools, and adapt to edge cases. What they genuinely need from dossiers is the information they **cannot infer on their own**:

- The goal and its success criteria
- Constraints and non-obvious requirements
- Architectural decisions and their rationale
- Known pitfalls that would waste significant time
- Domain-specific context that isn't in the code

What they do **not** need:

- Step-by-step bash commands for standard operations
- Detailed instructions for tasks any developer could figure out
- Exhaustive file listings or directory trees the agent can discover itself
- Tool recommendations for common tasks (the agent can choose the right tool)

---

## Good vs. Over-Specified Dossier Sections

### Example 1: Project Setup

**Over-specified** (constrains the agent):
```markdown
## Actions

1. Run `mkdir -p src/{components,utils,hooks}`
2. Run `npm init -y`
3. Run `npm install --save-dev typescript @types/node`
4. Create `tsconfig.json` with the following content:
   ```json
   {
     "compilerOptions": {
       "target": "ES2022",
       "module": "ESNext",
       ...20 more lines...
     }
   }
   ```
5. Run `npx tsc --init`
6. ...
```

**Declarative** (empowers the agent):
```markdown
## Objective

Set up a TypeScript project with strict type checking, ESM modules,
and a standard source layout.

## Constraints

- Must use ESM (`"type": "module"` in package.json)
- TypeScript strict mode enabled
- Target ES2022 or later

## Validation

- `npx tsc --noEmit` passes with zero errors
- Project structure has clear separation of source and test files
```

The agent will figure out the exact commands, config files, and directory structure. The dossier provides the non-obvious constraints (ESM, strict mode, target version) that the agent might otherwise choose differently.

### Example 2: Deployment

**Over-specified**:
```markdown
## Actions

1. Run `docker build -t myapp:latest .`
2. Run `docker tag myapp:latest registry.example.com/myapp:v1.2.3`
3. Run `docker push registry.example.com/myapp:v1.2.3`
4. Run `kubectl set image deployment/myapp myapp=registry.example.com/myapp:v1.2.3`
5. Run `kubectl rollout status deployment/myapp --timeout=300s`
```

**Declarative**:
```markdown
## Objective

Deploy the current build to production with zero-downtime rollout.

## Constraints

- Container registry: registry.example.com
- Kubernetes namespace: production
- Rollout must complete within 5 minutes or auto-rollback
- Health check endpoint: /api/health

## Rollback

If deployment fails, the previous version must be restored automatically.
Kubernetes rollout undo handles this, but verify the health endpoint
responds 200 after rollback.
```

### Example 3: Database Migration

**Over-specified**:
```markdown
## Actions

1. Run `pg_dump -h localhost -U admin -d mydb > backup_$(date +%Y%m%d).sql`
2. Open the migration file at `migrations/003_add_index.sql`
3. Run `psql -h localhost -U admin -d mydb -f migrations/003_add_index.sql`
4. Verify with `psql -c "SELECT indexname FROM pg_indexes WHERE tablename='users'"`
```

**Declarative**:
```markdown
## Objective

Apply pending database migrations with automatic backup and rollback capability.

## Constraints

- Database must be backed up before any schema changes
- Migrations are in `migrations/` directory, applied in numeric order
- The application must remain available during migration (online DDL only)

## Known Pitfalls

- The `users` table has 50M+ rows. Adding an index without `CONCURRENTLY`
  will lock the table and cause downtime.
- The backup user has read-only access. Use the admin credentials from
  the `DATABASE_ADMIN_URL` environment variable for migrations.
```

Notice the "Known Pitfalls" section: this is exactly the kind of **non-inferable information** that belongs in a dossier. An agent cannot know the table has 50M rows or that there are separate credentials for backups vs. migrations without being told.

---

## When Procedural Guidance IS Appropriate

Not all procedural instructions are bad. Include step-by-step guidance when:

1. **The procedure is genuinely non-obvious**: Custom internal tooling, non-standard workflows, or undocumented APIs that the agent cannot discover from the codebase.

2. **The order matters and isn't self-evident**: When steps must happen in a specific sequence for subtle reasons (e.g., "create the database role *before* running migrations because the migration scripts assume the role exists").

3. **Known pitfalls would waste significant time**: If an agent will predictably hit a wall and spend 10 minutes debugging, a one-line warning saves that cost.

4. **Environment-specific configuration**: Credentials, endpoints, or settings that differ between environments and cannot be inferred.

---

## The Tool Name-Dropping Trap

Research found that merely mentioning a tool by name makes agents use it **2.5x more frequently** -- even when it's not the best choice for the task. This creates a subtle but real problem.

**Avoid this**:
```markdown
## Actions
Use `ripgrep` to search the codebase for all TODO comments.
Then use `jq` to parse the JSON config file.
Format the output using `prettier`.
```

**Prefer this**:
```markdown
## Objective
Find all TODO comments in the codebase and compile them into a
prioritized report alongside the project's current configuration.
```

The agent will choose the right search tool, the right JSON parser, and the right formatter. Name-dropping specific tools locks the agent into choices that may not be optimal for the given environment.

**Exception**: Name tools when they are genuine constraints:
```markdown
## Constraints
- Linter: Biome (not ESLint) -- the project uses Biome exclusively
- Container runtime: Podman (Docker is not installed on CI runners)
```

This is appropriate because the agent *needs* to know that the project uses Biome, not ESLint. Without this, the agent might reasonably choose ESLint and waste time.

---

## Checklist for Dossier Authors

Before publishing a dossier, review each section and ask:

- [ ] **Can the agent figure this out by reading the codebase?** If yes, remove it.
- [ ] **Am I describing *what* to achieve, or *how* to do it?** Prefer *what*.
- [ ] **Does this mention a tool by name?** If so, is the tool a genuine constraint, or just a preference? Remove preferences.
- [ ] **Is this information inferable from the environment?** (e.g., "Node.js project" when `package.json` exists). Remove inferable facts.
- [ ] **Would an experienced developer need this information?** If not, the agent probably doesn't either.
- [ ] **Does the Validation section have clear, verifiable success criteria?** This is the most important section -- invest time here.

---

## Anatomy of a Well-Written Dossier

The most valuable dossier sections, in order of importance:

1. **Objective**: What success looks like. Clear, measurable, unambiguous.
2. **Validation / Success Criteria**: How to verify the objective was met. Concrete checks the agent can run.
3. **Constraints**: Non-negotiable requirements that the agent cannot infer. Architectural decisions, required tools, performance targets.
4. **Known Pitfalls**: Traps that would waste significant agent time. Environment-specific gotchas, subtle bugs, counterintuitive behaviors.
5. **Context**: Domain knowledge, business rationale, historical decisions. The "why" behind constraints.
6. **Decision Points**: Forks where the agent needs guidance on which path to take, with criteria for choosing.

Sections that are often *less* valuable than authors think:

- **Step-by-step Actions**: The agent can figure out the steps. Focus on the goal and constraints instead.
- **File listings / directory trees**: The agent can read the filesystem.
- **Exhaustive prerequisite checks**: The agent will discover missing tools when commands fail.
- **Detailed troubleshooting for common errors**: The agent can read error messages and search for solutions.

---

## Further Reading

- [Dossier Guide](dossier-guide.md) -- Schema, structure, and security
- [Your First Dossier](../tutorials/your-first-dossier.md) -- Hands-on tutorial
- [Dossier Template](../../templates/dossier-template.md) -- Starting point for new dossiers
- [REFERENCES.md](../../REFERENCES.md) -- Academic research backing these guidelines

[paper]: https://arxiv.org/abs/2602.11988 "Evaluating AGENTS.md: Are Repository-Level Context Files Helpful for Coding Agents?"
