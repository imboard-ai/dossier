---dossier
{
  "dossier_schema_version": "1.0.0",
  "title": "Project Exploration",
  "version": "1.0.0",
  "protocol_version": "1.0",
  "status": "Draft",
  "last_updated": "2025-11-30",
  "objective": "Map a project's structure (routes, controllers, models, types) to enable onboarding, refactoring, and gap analysis. Generates both human-readable Markdown and machine-readable JSON outputs.",
  "category": [
    "development"
  ],
  "tags": [
    "project-mapping",
    "onboarding",
    "refactoring",
    "api-discovery",
    "codebase-analysis",
    "documentation"
  ],
  "risk_level": "low",
  "requires_approval": false,
  "risk_factors": [
    "modifies_files"
  ],
  "destructive_operations": [
    "Creates output files in specified directory (project-map.md, project-map.json, changelog.md)"
  ]
}
---
# Project Exploration

## Table of Contents

- [Objective](#objective)
- [Prerequisites](#prerequisites)
- [Context to Gather](#context-to-gather)
  - [User Preferences](#1-user-preferences)
  - [Previous Run Detection](#2-previous-run-detection)
- [Actions to Perform](#actions-to-perform)
  - [Phase 1: Project Structure Discovery](#phase-1-project-structure-discovery)
  - [Phase 2: API Surface Mapping](#phase-2-api-surface-mapping)
  - [Phase 3: Data Layer Mapping](#phase-3-data-layer-mapping)
  - [Phase 4: Extended Mapping](#phase-4-extended-mapping)
  - [Phase 5: Generate Outputs](#phase-5-generate-outputs)
  - [Phase 6: Present Results](#phase-6-present-results)
- [Validation](#validation)
- [Troubleshooting](#troubleshooting)
- [Example](#example)
- [Notes](#notes)
- [References](#references)

## Objective

Map a project's structure to enable:
- **Onboarding** - New developers or coding agents understanding the codebase
- **Reminder** - Existing developers quickly looking up "where is X?" or "what calls Y?"
- **Refactoring** - Before/after snapshots to understand impact
- **Gap Analysis** - Complete inventory for testing, security, performance, or cost reviews

## Prerequisites

- [ ] Project directory exists and is accessible
- [ ] Project uses a recognized framework (Express, NestJS, Fastify, Koa) or standard patterns
- [ ] You have read access to the source code

## Context to Gather

### 1. User Preferences

Before starting, collect the following from the user:

**Output Directory**
```text
? Where should the generated files be saved?
  Suggested default: docs/project-map/

  Files that will be created:
  - project-map.md    (Human readable summary)
  - project-map.json  (Machine readable data)
  - changelog.md      (Diff from last run, if previous exists)
  - .last-run.json    (Metadata for future comparisons)
```

**Granularity Level**
```text
? How deep should the analysis go?

  1) high   - Routes, HTTP methods, controller mappings (API surface only)
  2) medium - Above + function signatures, middleware, models/schemas, shared types
  3) deep   - Above + model relationships, validation rules, error handling,
              external service calls, auth/permission patterns

  Choice (1-3):
```

**Project Root**
```text
? Which directory contains the project to analyze?
  Default: current working directory

  For monorepos: specify which package(s) to include
  Example: packages/api or src/
```

### 2. Previous Run Detection

Check if a previous run exists:
- Look for `.last-run.json` in the output directory
- If found, load it for changelog generation

## Actions to Perform

### Phase 1: Project Structure Discovery

#### Step 1.1: Identify Project Type

Examine the project to determine its technology stack:

1. **Check `package.json` for framework**:
   ```bash
   cat package.json | grep -E '"(express|@nestjs/core|fastify|koa)"'
   ```

   - Express.js: `"express"` dependency
   - NestJS: `"@nestjs/core"` dependency
   - Fastify: `"fastify"` dependency
   - Koa: `"koa"` dependency

2. **Check for TypeScript**:
   ```bash
   ls tsconfig.json 2>/dev/null && echo "TypeScript detected"
   ```

3. **Check for database patterns**:
   - Mongoose: `"mongoose"` in package.json
   - Prisma: `prisma/schema.prisma` file exists
   - TypeORM: `"typeorm"` in package.json
   - Sequelize: `"sequelize"` in package.json

4. **Check for monorepo structure**:
   - `packages/` directory exists
   - `workspaces` field in package.json
   - `lerna.json` or `pnpm-workspace.yaml` exists

**Output**: Store project type for use in subsequent phases

#### Step 1.2: Discover Entry Points

Find the main application entry points:

1. Look for common entry patterns:
   - `src/app.ts` or `src/app.js`
   - `src/index.ts` or `src/index.js`
   - `src/server.ts` or `src/server.js`
   - `src/main.ts` (NestJS pattern)

2. Check `package.json` for start script:
   ```bash
   cat package.json | grep -A2 '"scripts"' | grep '"start"'
   ```

3. Identify where routes are mounted to the application

**Output**: List of entry point files with their paths

---

### Phase 2: API Surface Mapping

#### Step 2.1: Discover Route Definitions

Find all route definition files:

1. **Search for route files**:
   ```bash
   find src -name "*.routes.ts" -o -name "*.router.ts" -o -name "routes.ts"
   find src/routes -name "*.ts" 2>/dev/null
   ```

2. **For Express.js projects**, look for:
   - `Router()` imports and usage
   - `app.use('{path}', router)` patterns
   - HTTP method calls: `.get()`, `.post()`, `.put()`, `.delete()`, `.patch()`

3. **For NestJS projects**, look for:
   - `@Controller()` decorators
   - `@Get()`, `@Post()`, `@Put()`, `@Delete()`, `@Patch()` decorators

4. **For each route, extract**:
   - Route path (e.g., `/api/{resource}/:id`)
   - HTTP method (GET, POST, PUT, DELETE, PATCH)
   - Handler function or controller reference
   - Middleware applied to route (auth, validation, etc.)
   - Source file and line number

> **Note**: In all output templates throughout this dossier, text within `{curly braces}` represents placeholder values to be replaced with actual data from your project.

**Output format per route**:
```json
{
  "path": "/api/{resource}/:id",
  "method": "GET",
  "handler": "{functionName}",
  "controller": "{controllerName}",
  "middleware": ["{middleware1}", "{middleware2}"],
  "sourceFile": "src/routes/{resource}.routes.ts",
  "sourceLine": 42
}
```

#### Step 2.2: Discover Controllers

Find all controller files and their exported functions:

1. **Search for controller files**:
   ```bash
   find src -name "*Controller.ts" -o -name "*controller.ts" -o -name "*.controller.ts"
   find src/controllers -name "*.ts" 2>/dev/null
   ```

2. **For each controller, extract**:
   - File path
   - All exported functions (name and signature)
   - Which routes reference this controller

**Output format per controller**:
```json
{
  "name": "{controllerName}",
  "sourceFile": "src/controllers/{controllerName}.ts",
  "functions": [
    {
      "name": "{functionName}",
      "signature": "(req: Request, res: Response, next: NextFunction) => Promise<void>",
      "exportType": "named",
      "line": 60,
      "isAsync": true
    }
  ],
  "usedByRoutes": ["/api/{resource}", "/api/{resource}/:id"]
}
```

#### Step 2.3: Discover Middleware

Find all middleware functions:

1. **Search for middleware files**:
   ```bash
   find src -name "*middleware*.ts" -o -name "auth*.ts"
   find src/middleware -name "*.ts" 2>/dev/null
   ```

2. **For each middleware, extract**:
   - Function name
   - Purpose (inferred from name or JSDoc)
   - Where applied (global, route-level, specific routes)
   - Source location

**Output format per middleware**:
```json
{
  "name": "{middlewareName}",
  "sourceFile": "src/middleware/{file}.ts",
  "type": "authentication|authorization|validation|logging|other",
  "appliedTo": ["global::/api/*"],
  "line": 15
}
```

---

### Phase 3: Data Layer Mapping

> **Applies when**: granularity >= medium. Skip this phase if granularity is "high".

#### Step 3.1: Discover Models/Schemas

Find all data model definitions:

1. **For Mongoose projects**:
   ```bash
   find src -name "*.model.ts" -o -name "*.schema.ts"
   grep -r "new Schema(" src/ --include="*.ts" -l
   grep -r "mongoose.model(" src/ --include="*.ts" -l
   ```

2. **For Prisma projects**:
   - Parse `prisma/schema.prisma`

3. **For TypeORM projects**:
   - Look for `@Entity()` decorators

4. **For each model, extract**:
   - Model name
   - Fields with types and constraints
   - Indexes
   - Timestamps configuration
   - Relationships (if granularity = deep)

**Output format per model**:
```json
{
  "name": "{ModelName}",
  "sourceFile": "src/models/{model}.model.ts",
  "fields": [
    {"name": "{fieldName}", "type": "String", "required": true, "unique": false},
    {"name": "{fieldName}", "type": "Date", "required": false}
  ],
  "indexes": [
    {"fields": ["{fieldName}"], "unique": false}
  ],
  "timestamps": true,
  "relationships": []
}
```

#### Step 3.2: Discover Shared Types (TypeScript projects)

Find shared type definitions:

1. **Search for type files**:
   ```bash
   find src -name "*.types.ts" -o -name "*.interfaces.ts" -o -name "*.d.ts"
   find packages/shared-types -name "*.ts" 2>/dev/null
   ```

2. **Focus on API-related types**:
   - Request types (patterns: `IApi*Req`, `*Request`, `*Input`)
   - Response types (patterns: `IApi*Res`, `*Response`, `*Output`)
   - Entity types (patterns: `I{Entity}`, `*Entity`)
   - Enum definitions

**Output format per type**:
```json
{
  "name": "{TypeName}",
  "sourceFile": "src/types/{file}.types.ts",
  "kind": "interface|type|enum",
  "properties": ["{prop1}", "{prop2}", "{prop3}"],
  "line": 45
}
```

---

### Phase 4: Extended Mapping

> **Applies when**: granularity = deep. Skip this phase if granularity is not "deep".

#### Step 4.1: External Service Integrations

Identify external service usage:

1. **Search for common patterns**:
   ```bash
   grep -r "aws-sdk\|@aws-sdk" package.json
   grep -r "S3\|SES\|SNS\|SQS" src/ --include="*.ts" -l
   grep -r "axios\|fetch\|node-fetch" src/ --include="*.ts" -l
   grep -r "sendgrid\|mailgun\|nodemailer" package.json
   ```

2. **For each integration, document**:
   - Service name and type
   - Which files use it
   - Operations performed

**Output format**:
```json
{
  "name": "{ServiceName}",
  "type": "storage|email|analytics|payment|other",
  "usedIn": ["src/utils/{file}.ts", "src/controllers/{controller}.ts"],
  "operations": ["{operation1}", "{operation2}"]
}
```

#### Step 4.2: Background Jobs/Queues

Find async job processing:

1. **Search for job patterns**:
   ```bash
   grep -r "agenda\|bull\|bullmq" package.json
   find src -name "*job*.ts" -o -name "*queue*.ts" -o -name "*worker*.ts"
   ```

2. **For each job, extract**:
   - Job name
   - Trigger (schedule, event, manual)
   - Handler function

**Output format**:
```json
{
  "name": "{jobName}",
  "sourceFile": "src/jobs/{file}.job.ts",
  "trigger": "schedule|event|manual",
  "schedule": "0 * * * *",
  "handler": "{handlerFunction}"
}
```

#### Step 4.3: Error Handling Patterns

Document error handling approach:

1. **Find custom error classes**:
   ```bash
   grep -r "extends Error" src/ --include="*.ts" -l
   find src -name "*error*.ts" -o -name "*Error*.ts"
   ```

2. **Find error middleware**:
   ```bash
   grep -r "err, req, res, next" src/ --include="*.ts" -l
   ```

3. **Document**:
   - Custom error class hierarchy
   - Error response format
   - Error handling middleware

#### Step 4.4: Auth/Permission Patterns

Map authorization model:

1. **Find role/permission definitions**:
   ```bash
   grep -r "enum.*Role\|enum.*Permission" src/ --include="*.ts" -l
   ```

2. **Document**:
   - Role types and hierarchy
   - Permission model
   - Protected routes and their requirements

---

### Phase 5: Generate Outputs

#### Step 5.1: Generate JSON Output

Create `project-map.json` in the output directory:

```json
{
  "metadata": {
    "generatedAt": "{ISO-8601 timestamp}",
    "projectRoot": "{absolute path}",
    "granularity": "{high|medium|deep}",
    "projectType": {
      "framework": "{express|nestjs|fastify|koa|unknown}",
      "language": "{typescript|javascript}",
      "database": "{mongoose|prisma|typeorm|sequelize|none}",
      "isMonorepo": true|false,
      "packages": ["{package names if monorepo}"]
    }
  },
  "summary": {
    "totalRoutes": 0,
    "totalControllers": 0,
    "totalMiddleware": 0,
    "totalModels": 0,
    "totalTypes": 0,
    "totalIntegrations": 0,
    "totalJobs": 0
  },
  "routes": [],
  "controllers": [],
  "middleware": [],
  "models": [],
  "types": [],
  "integrations": [],
  "jobs": [],
  "errors": [],
  "auth": []
}
```

#### Step 5.2: Generate Markdown Output

Create `project-map.md` in the output directory:

```markdown
# Project Map: {project-name}

> Generated: {timestamp}
> Granularity: {level}
> Project Root: {path}

## Overview

| Attribute | Value |
|-----------|-------|
| Framework | {framework} |
| Language | {language} |
| Database | {database} |
| Monorepo | {yes/no} |

## Summary

- **Routes**: {count}
- **Controllers**: {count}
- **Middleware**: {count}
- **Models**: {count}
- **Types**: {count}

## API Routes

| Method | Path | Controller | Function | Middleware |
|--------|------|------------|----------|------------|
| {method} | {path} | {controller} | {function} | {middleware} |

## Controllers

### {controllerName}
| Function | Line | Async | Used By Routes |
|----------|------|-------|----------------|
| {function} | {line} | {yes/no} | {routes} |

## Models (if granularity >= medium)

### {ModelName}
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| {field} | {type} | {yes/no} | {notes} |

## Middleware (if granularity >= medium)

| Name | Type | Applied To |
|------|------|------------|
| {name} | {type} | {scope} |

## External Integrations (if granularity = deep)

| Service | Type | Used In |
|---------|------|---------|
| {service} | {type} | {files} |

## Background Jobs (if granularity = deep)

| Job Name | Trigger | Handler |
|----------|---------|---------|
| {name} | {trigger} | {handler} |

---
*Generated by Project Exploration Dossier*
```

#### Step 5.3: Generate Changelog (if previous run exists)

If `.last-run.json` exists, compare with current run:

1. **Identify additions**:
   - New routes
   - New controllers or functions
   - New models or fields
   - New middleware

2. **Identify removals**:
   - Deleted routes
   - Removed controller functions
   - Deleted models or fields

3. **Identify modifications**:
   - Changed route paths or methods
   - Modified function signatures
   - Updated model fields

Create `changelog.md`:

```markdown
# Project Map Changelog

> Previous: {previous-timestamp}
> Current: {current-timestamp}

## Summary
- Added: {count}
- Removed: {count}
- Modified: {count}

## Added

### Routes
- `{METHOD} {path}` → {controller}.{function}

### Controllers
- {controller}.{function} (line {line})

### Models
- {Model}: Added field `{field}` ({type}, {required/optional})

## Removed

### Routes
- `{METHOD} {path}` (removed)

## Modified

### Routes
- `{oldPath}` → `{newPath}` (path changed)

---
*Generated by Project Exploration Dossier*
```

#### Step 5.4: Save Run Metadata

Create/update `.last-run.json`:

```json
{
  "timestamp": "{ISO-8601}",
  "granularity": "{level}",
  "projectRoot": "{path}",
  "summary": {
    "routes": 0,
    "controllers": 0,
    "models": 0
  },
  "contentHash": "{sha256 hash of project-map.json}"
}
```

---

### Phase 6: Present Results

Display summary to user:

```text
Project Exploration Complete!

Project:     {project-name}
Framework:   {framework}
Granularity: {level}

Discovered:
  Routes:       {count}
  Controllers:  {count}
  Middleware:   {count}
  Models:       {count}
  Types:        {count}

Output Files:
  {output-dir}/project-map.md
  {output-dir}/project-map.json
  {output-dir}/changelog.md (if changes detected)

Suggested Next Steps:
1. Review project-map.md for accuracy
2. Use project-map.json for automated analysis
3. Share with team for onboarding
4. Run gap analysis dossiers against this baseline
```

## Validation

- [ ] User preferences were collected (output dir, granularity, project root)
- [ ] Project type was correctly identified
- [ ] All route files were discovered
- [ ] All controllers were mapped to routes
- [ ] Models were discovered (if granularity >= medium)
- [ ] Types were discovered (if granularity >= medium)
- [ ] External integrations documented (if granularity = deep)
- [ ] JSON output is valid and parseable
- [ ] Markdown output is properly formatted
- [ ] Changelog was generated (if previous run existed)
- [ ] Run metadata was saved for future comparisons

## Troubleshooting

**Issue**: No routes found
**Cause**: Project uses non-standard routing pattern
**Solution**:
- Check if routes are defined in the entry point file directly
- Look for dynamic route registration
- Manually specify route directory location

**Issue**: Controller not linked to any routes
**Cause**: Controller may be unused or dynamically loaded
**Solution**:
- Check for internal-only controllers (not exposed via HTTP)
- Look for dynamic imports or plugin patterns
- Mark as "unlinked" in output for manual review

**Issue**: Models not discovered
**Cause**: Non-standard database library or pattern
**Solution**:
- Verify database dependency is in package.json
- Check for custom ORM or database abstraction
- Manually specify model directory

**Issue**: Previous run not detected for changelog
**Cause**: `.last-run.json` missing or corrupted
**Solution**:
- Check output directory permissions
- Verify previous run completed successfully
- First run will not have changelog (expected)

**Issue**: TypeScript parsing errors
**Cause**: Complex type definitions or syntax
**Solution**:
- Ensure TypeScript version compatibility
- Check for syntax errors in source files
- Report specific files that failed to parse

## Example

**User Input**:
```text
? Where should the generated files be saved? docs/project-map/
? How deep should the analysis go? 2 (medium)
? Which directory contains the project? src/
```

**Output**:
```text
Project Exploration Complete!

Project:     my-ecommerce-api
Framework:   Express.js
Granularity: medium

Discovered:
  Routes:       24
  Controllers:  8
  Middleware:   5
  Models:       12
  Types:        18

Output Files:
  docs/project-map/project-map.md
  docs/project-map/project-map.json

Suggested Next Steps:
1. Review project-map.md for accuracy
2. Use project-map.json for automated analysis
3. Share with team for onboarding
4. Run gap analysis dossiers against this baseline
```

## Notes

- This dossier is READ-ONLY and does not modify source code
- Output files can be committed to version control for team reference
- Re-run periodically to detect codebase drift
- The JSON output can be consumed by other dossiers (e.g., test coverage gap analysis)
- For very large projects, consider running on specific packages rather than entire monorepo

## References

- [Express.js Routing](https://expressjs.com/en/guide/routing.html)
- [NestJS Controllers](https://docs.nestjs.com/controllers)
- [Mongoose Schemas](https://mongoosejs.com/docs/guide.html)
- [TypeScript AST](https://ts-ast-viewer.com/)
