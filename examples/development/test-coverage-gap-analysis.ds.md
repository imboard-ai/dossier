---dossier
{
  "dossier_schema_version": "1.0.0",
  "title": "Test Coverage Gap Analysis",
  "version": "1.0.0",
  "protocol_version": "1.0",
  "status": "Draft",
  "last_updated": "2025-11-30",
  "objective": "Analyze test files against project structure to identify untested code paths, controllers, routes, and functions. Supports Jest, Mocha, Vitest, and other test frameworks.",
  "category": [
    "development",
    "test"
  ],
  "tags": [
    "testing",
    "coverage",
    "gap-analysis",
    "quality-assurance",
    "jest",
    "mocha",
    "vitest"
  ],
  "risk_level": "low",
  "requires_approval": false,
  "risk_factors": [
    "modifies_files"
  ],
  "destructive_operations": [
    "Creates output files in specified directory (coverage-gaps.md, coverage-gaps.json)"
  ],
  "checksum": {
    "algorithm": "sha256",
    "hash": "60a417077bf8b2aa64bf38b4e471379a70029092bc827bf9c6e92db66b3f653c"
  },
  "signature": {
    "algorithm": "ECDSA-SHA-256",
    "signature": "MEYCIQCdYcNB4XhnhQXCeP/s0uI6nYuw1iwu9lou++6wHenIyQIhALc+iFr0AYGfbisLldqZhm/y84/DzpnVmYvffGFFjSTJ",
    "public_key": "MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEqIbQGqW1Jdh97TxQ5ZvnSVvvOcN5NWhfWwXRAaDDuKK1pv8F+kz+uo1W8bNn+8ObgdOBecFTFizkRa/g+QJ8kA==",
    "key_id": "arn:aws:kms:us-east-1:942039714848:key/d9ccd3fc-b190-49fd-83f7-e94df6620c1d",
    "signed_at": "2025-11-30T11:49:30.044Z"
  }
}
---
# Test Coverage Gap Analysis

## Table of Contents

- [Objective](#objective)
- [Prerequisites](#prerequisites)
- [Context to Gather](#context-to-gather)
  - [User Preferences](#1-user-preferences)
  - [Project Map Detection](#2-project-map-detection)
- [Actions to Perform](#actions-to-perform)
  - [Phase 1: Test Framework Discovery](#phase-1-test-framework-discovery)
  - [Phase 2: Test File Discovery](#phase-2-test-file-discovery)
  - [Phase 3: Test Case Extraction](#phase-3-test-case-extraction)
  - [Phase 4: Project Structure Loading](#phase-4-project-structure-loading)
  - [Phase 5: Coverage Cross-Reference](#phase-5-coverage-cross-reference)
  - [Phase 6: Generate Reports](#phase-6-generate-reports)
  - [Phase 7: Present Results](#phase-7-present-results)
- [Validation](#validation)
- [Troubleshooting](#troubleshooting)
- [Example](#example)
- [Notes](#notes)
- [References](#references)

## Objective

Analyze test files against project structure to identify:
- **Untested Routes** - API endpoints with no corresponding test cases
- **Untested Controllers** - Controller functions never invoked in tests
- **Untested Models** - Data models without validation or CRUD tests
- **Partial Coverage** - Functions referenced but not thoroughly tested
- **Test Quality Issues** - Skipped tests, `.only` modifiers, empty test blocks

## Prerequisites

- [ ] Project directory exists and is accessible
- [ ] Test files exist in the project
- [ ] (Optional) Project Map exists from running the Project Exploration dossier

> **Note**: Throughout this dossier, text within `{curly braces}` in code examples and templates represents placeholder values to be replaced with actual data from your project.

## Context to Gather

### 1. User Preferences

Before starting, collect the following from the user:

**Output Directory**
```text
? Where should the coverage gap report be saved?
  Suggested default: docs/test-coverage/

  Files that will be created:
  - coverage-gaps.md    (Human readable report)
  - coverage-gaps.json  (Machine readable data)
```

**Test Directory**
```text
? Where are your test files located?
  Common patterns:
  - tests/
  - __tests__/
  - src/**/*.test.ts
  - src/**/*.spec.ts

  Enter path or glob pattern:
```

**Test Type Focus**
```text
? Which test types should be analyzed?

  1) all         - All test files (unit, integration, e2e)
  2) integration - Integration/API tests only
  3) unit        - Unit tests only
  4) e2e         - End-to-end tests only

  Choice (1-4):
```

**Project Map Location (Optional)**
```text
? Do you have an existing project-map.json from Project Exploration dossier?

  1) Yes - provide path to project-map.json
  2) No  - discover project structure now (slower)

  If yes, enter path:
```

### 2. Project Map Detection

If project map path provided:
- Load and validate `project-map.json`
- Extract routes, controllers, models, middleware

If no project map:
- Run inline discovery (similar to Project Exploration dossier)
- Focus on routes and controllers for coverage analysis

## Actions to Perform

### Phase 1: Test Framework Discovery

#### Step 1.1: Identify Test Framework

Examine the project to determine which test framework is used:

1. **Check `package.json` for test dependencies**:
   ```bash
   grep -E '"(jest|mocha|vitest|ava|tap|jasmine)"' package.json
   ```

   - Jest: `"jest"` dependency
   - Mocha: `"mocha"` dependency
   - Vitest: `"vitest"` dependency
   - AVA: `"ava"` dependency
   - Jasmine: `"jasmine"` dependency

2. **Check for configuration files**:
   ```bash
   ls jest.config.* vitest.config.* .mocharc.* 2>/dev/null
   ```

3. **Determine test file patterns**:
   - Jest/Vitest: `*.test.ts`, `*.spec.ts`, `__tests__/*.ts`
   - Mocha: `test/*.ts`, `*.test.ts`

**Output**: Test framework type and file patterns

#### Step 1.2: Identify Test Syntax

Based on framework, determine syntax patterns to search for:

| Framework | Describe Block | Test Block | Skip | Only |
|-----------|---------------|------------|------|------|
| Jest | `describe()` | `it()`, `test()` | `.skip` | `.only` |
| Mocha | `describe()` | `it()` | `.skip` | `.only` |
| Vitest | `describe()` | `it()`, `test()` | `.skip` | `.only` |
| AVA | N/A | `test()` | `.skip` | `.only` |

---

### Phase 2: Test File Discovery

#### Step 2.1: Find All Test Files

Search for test files based on detected framework:

1. **For Jest/Vitest projects**:
   ```bash
   find {test-directory} -name "*.test.ts" -o -name "*.spec.ts"
   find src -name "*.test.ts" -o -name "*.spec.ts" 2>/dev/null
   find __tests__ -name "*.ts" 2>/dev/null
   ```

2. **For Mocha projects**:
   ```bash
   find test -name "*.ts" -o -name "*.js"
   find {test-directory} -name "*.test.ts"
   ```

3. **Categorize by test type** (based on path or naming):
   - `tests/integration/` or `*.integration.test.ts` → Integration
   - `tests/unit/` or `*.unit.test.ts` → Unit
   - `tests/e2e/` or `*.e2e.test.ts` → E2E
   - Uncategorized → Infer from content

**Output format**:
```json
{
  "testFiles": [
    {
      "path": "tests/integration/{file}.test.ts",
      "type": "integration",
      "framework": "jest"
    }
  ],
  "summary": {
    "total": 0,
    "integration": 0,
    "unit": 0,
    "e2e": 0,
    "uncategorized": 0
  }
}
```

---

### Phase 3: Test Case Extraction

#### Step 3.1: Parse Test Files

For each test file, extract test structure:

1. **Extract describe blocks**:
   ```bash
   grep -n "describe(" {file} | head -20
   ```

2. **Extract test cases**:
   ```bash
   grep -n -E "^\s*(it|test)\(" {file}
   grep -n -E "\.(only|skip)\(" {file}
   ```

3. **For each test case, extract**:
   - Test description (string in quotes)
   - Line number
   - Status (normal, skipped, only)
   - Parent describe block

**Output format per test file**:
```json
{
  "file": "tests/integration/{file}.test.ts",
  "describes": [
    {
      "name": "{describe block name}",
      "line": 10,
      "tests": [
        {
          "name": "{test description}",
          "line": 15,
          "status": "normal|skipped|only",
          "async": true
        }
      ]
    }
  ],
  "issues": [
    {"type": "skip", "line": 25, "description": "{test name}"},
    {"type": "only", "line": 42, "description": "{test name}"}
  ]
}
```

#### Step 3.2: Extract Code References

Analyze test file contents to find what's being tested:

1. **Find imports**:
   ```bash
   grep -E "^import.*from" {file}
   ```

2. **Find API endpoint calls**:
   ```bash
   grep -E "\.(get|post|put|delete|patch)\s*\(" {file}
   grep -E "request\(app\)" {file}
   ```

3. **Find controller/function references**:
   ```bash
   grep -E "(Controller|Service|Model)\." {file}
   ```

4. **Find route path references**:
   ```bash
   grep -E "['\"]/api/" {file}
   ```

**Output format**:
```json
{
  "file": "tests/integration/{file}.test.ts",
  "references": {
    "routes": ["/api/{resource}", "/api/{resource}/:id"],
    "controllers": ["{controllerName}"],
    "functions": ["{functionName}", "{functionName}"],
    "models": ["{ModelName}"]
  }
}
```

---

### Phase 4: Project Structure Loading

#### Step 4.1: Load Project Map (if available)

If user provided `project-map.json`:

1. **Validate JSON structure**:
   ```bash
   python -m json.tool {project-map-path} > /dev/null
   ```

2. **Extract testable items**:
   - Routes (path, method, controller, function)
   - Controllers (name, functions)
   - Models (name, fields)
   - Middleware (name)

#### Step 4.2: Inline Discovery (if no project map)

> **Applies when**: No project map provided. Perform minimal discovery.

1. **Find routes**:
   ```bash
   find src -name "*.routes.ts" -o -name "*.router.ts"
   grep -r "router\.(get|post|put|delete|patch)" src/ --include="*.ts" -l
   ```

2. **Find controllers**:
   ```bash
   find src -name "*Controller.ts" -o -name "*controller.ts"
   ```

3. **Extract function names from controllers**:
   ```bash
   grep -E "^export (async )?function" {controller-file}
   ```

**Output**: Normalized structure matching project-map.json format

---

### Phase 5: Coverage Cross-Reference

#### Step 5.1: Map Tests to Routes

For each route in project structure:

1. **Search for route path in test files**:
   - Exact match: `/api/users/:id`
   - Pattern match: `/api/users/` with dynamic segments

2. **Search for HTTP method + path combination**:
   - `get('/api/users')`
   - `request(app).get('/api/users')`

3. **Classify coverage**:
   - **Covered**: Route path + method found in tests
   - **Partial**: Route path found but not all methods
   - **Not Covered**: No test references found

**Output format**:
```json
{
  "route": "{METHOD} /api/{resource}/:id",
  "controller": "{controllerName}",
  "function": "{functionName}",
  "coverage": "covered|partial|not-covered",
  "testedIn": ["tests/integration/{file}.test.ts"],
  "testCases": ["{test description}"],
  "missingMethods": ["DELETE"]
}
```

#### Step 5.2: Map Tests to Controllers

For each controller function:

1. **Search for function name in test files**:
   - Direct import and call
   - Route handler reference

2. **Search for related route coverage**:
   - If route is covered, function is likely covered

3. **Classify coverage**:
   - **Covered**: Function directly tested or route covered
   - **Partial**: Some code paths tested
   - **Not Covered**: No references found

#### Step 5.3: Map Tests to Models

> **Applies when**: Models exist in project structure.

For each model:

1. **Search for model name in test files**:
   - Import statements
   - Direct usage (create, find, update, delete)

2. **Check for validation tests**:
   - Required field tests
   - Type validation tests

3. **Classify coverage**:
   - **Covered**: CRUD operations and validations tested
   - **Partial**: Some operations tested
   - **Not Covered**: No model tests found

#### Step 5.4: Identify Test Quality Issues

Scan all test files for:

1. **Skipped tests**:
   ```bash
   grep -r "\.skip\(" {test-directory} --include="*.ts"
   grep -r "xit\(" {test-directory} --include="*.ts"
   grep -r "xdescribe\(" {test-directory} --include="*.ts"
   ```

2. **Exclusive tests (.only)**:
   ```bash
   grep -r "\.only\(" {test-directory} --include="*.ts"
   ```

3. **Empty test blocks** (heuristic, may need manual review):
   ```bash
   grep -A1 "it\(" {file} | grep -E "^\s*\}\s*\)"
   ```

4. **TODO/FIXME in tests**:
   ```bash
   grep -r "TODO\|FIXME" {test-directory} --include="*.ts"
   ```

**Output format**:
```json
{
  "issues": [
    {
      "type": "skipped-test",
      "file": "tests/{file}.test.ts",
      "line": 42,
      "description": "{test name}"
    },
    {
      "type": "only-modifier",
      "file": "tests/{file}.test.ts",
      "line": 15,
      "description": "{test name}",
      "severity": "high"
    }
  ]
}
```

---

### Phase 6: Generate Reports

#### Step 6.1: Calculate Coverage Metrics

Compute summary statistics:

```json
{
  "summary": {
    "routes": {
      "total": 0,
      "covered": 0,
      "partial": 0,
      "notCovered": 0,
      "percentage": 0
    },
    "controllers": {
      "total": 0,
      "covered": 0,
      "partial": 0,
      "notCovered": 0,
      "percentage": 0
    },
    "models": {
      "total": 0,
      "covered": 0,
      "partial": 0,
      "notCovered": 0,
      "percentage": 0
    }
  },
  "qualityIssues": {
    "skippedTests": 0,
    "onlyModifiers": 0,
    "emptyTests": 0,
    "todos": 0
  }
}
```

#### Step 6.2: Prioritize Gaps

Assign priority to coverage gaps:

| Priority | Criteria |
|----------|----------|
| **Critical** | Public API routes with no tests |
| **High** | Controller functions with business logic, no tests |
| **Medium** | Models without validation tests |
| **Low** | Internal utilities, middleware |

#### Step 6.3: Generate JSON Output

Create `coverage-gaps.json` in the output directory:

```json
{
  "metadata": {
    "generatedAt": "{ISO-8601 timestamp}",
    "projectRoot": "{absolute path}",
    "testFramework": "{jest|mocha|vitest}",
    "testDirectory": "{path}",
    "projectMapUsed": true|false
  },
  "summary": {
    "routes": {"total": 0, "covered": 0, "percentage": 0},
    "controllers": {"total": 0, "covered": 0, "percentage": 0},
    "models": {"total": 0, "covered": 0, "percentage": 0},
    "overallPercentage": 0
  },
  "gaps": {
    "critical": [],
    "high": [],
    "medium": [],
    "low": []
  },
  "qualityIssues": [],
  "testFiles": [],
  "recommendations": []
}
```

#### Step 6.4: Generate Markdown Report

Create `coverage-gaps.md` in the output directory:

```markdown
# Test Coverage Gap Analysis

> Generated: {timestamp}
> Test Framework: {framework}
> Test Directory: {path}

## Coverage Summary

| Category | Total | Covered | Partial | Not Covered | Coverage |
|----------|-------|---------|---------|-------------|----------|
| Routes | {n} | {n} | {n} | {n} | {n}% |
| Controllers | {n} | {n} | {n} | {n} | {n}% |
| Models | {n} | {n} | {n} | {n} | {n}% |

**Overall Coverage: {n}%**

## Critical Gaps (Priority: Immediate)

These public API endpoints have no test coverage:

| Route | Method | Controller | Function |
|-------|--------|------------|----------|
| {path} | {method} | {controller} | {function} |

### Recommended Tests to Add

1. **{Route}**
   - Test successful response (happy path)
   - Test authentication required
   - Test authorization (role-based access)
   - Test validation errors
   - Test not found scenarios

## High Priority Gaps

Controller functions with business logic lacking tests:

| Controller | Function | Used By Routes |
|------------|----------|----------------|
| {controller} | {function} | {routes} |

## Medium Priority Gaps

Models without complete test coverage:

| Model | Missing Coverage |
|-------|------------------|
| {model} | {missing: validation, CRUD, relationships} |

## Low Priority Gaps

Internal utilities and middleware:

| Item | Type | Notes |
|------|------|-------|
| {name} | {middleware/utility} | {notes} |

## Test Quality Issues

### Skipped Tests ({count})

These tests are currently skipped and should be reviewed:

| File | Line | Test Description |
|------|------|------------------|
| {file} | {line} | {description} |

### Exclusive Tests (.only) ({count})

⚠️ These tests have `.only` modifier which prevents other tests from running:

| File | Line | Test Description |
|------|------|------------------|
| {file} | {line} | {description} |

### Empty or Incomplete Tests ({count})

| File | Line | Issue |
|------|------|-------|
| {file} | {line} | {issue description} |

## Test File Summary

| File | Tests | Skipped | Describes | Coverage Area |
|------|-------|---------|-----------|---------------|
| {file} | {n} | {n} | {n} | {areas} |

## Recommendations

1. **Immediate Actions**
   - Add integration tests for {n} critical routes
   - Remove `.only` modifiers from {n} tests
   - Review and unskip or delete {n} skipped tests

2. **Short Term**
   - Add validation tests for {n} models
   - Increase controller function coverage to {target}%

3. **Long Term**
   - Establish minimum coverage threshold ({n}%)
   - Add coverage to CI/CD pipeline
   - Document testing patterns for team

---
*Generated by Test Coverage Gap Analysis Dossier*
```

---

### Phase 7: Present Results

Display summary to user:

```text
Test Coverage Gap Analysis Complete!

Test Framework: {framework}
Tests Analyzed: {count} files, {count} test cases

Coverage Summary:
  Routes:       {covered}/{total} ({percentage}%)
  Controllers:  {covered}/{total} ({percentage}%)
  Models:       {covered}/{total} ({percentage}%)

  Overall:      {percentage}%

Gaps Found:
  Critical:     {count} (no tests for public APIs)
  High:         {count} (business logic untested)
  Medium:       {count} (models partially tested)
  Low:          {count} (utilities/middleware)

Quality Issues:
  Skipped:      {count} tests
  .only:        {count} tests (⚠️ blocking other tests)
  Empty:        {count} tests

Output Files:
  {output-dir}/coverage-gaps.md
  {output-dir}/coverage-gaps.json

Next Steps:
1. Review critical gaps and prioritize test creation
2. Remove .only modifiers before committing
3. Address skipped tests (fix or remove)
4. Consider running Project Exploration dossier for complete project map
```

## Validation

- [ ] User preferences were collected (output dir, test directory, test type)
- [ ] Test framework was correctly identified
- [ ] All test files were discovered
- [ ] Test cases were extracted from each file
- [ ] Project structure was loaded (from map or inline discovery)
- [ ] Routes were cross-referenced with tests
- [ ] Controllers were cross-referenced with tests
- [ ] Models were cross-referenced with tests (if applicable)
- [ ] Quality issues were identified (skipped, only, empty)
- [ ] Coverage percentages were calculated
- [ ] Gaps were prioritized by severity
- [ ] JSON output is valid and parseable
- [ ] Markdown report is properly formatted

## Troubleshooting

**Issue**: No test files found
**Cause**: Test directory path incorrect or non-standard naming
**Solution**:
- Verify test directory exists
- Check for alternative patterns (`__tests__`, `*.spec.ts`)
- Manually specify glob pattern

**Issue**: Test framework not detected
**Cause**: Framework not in package.json dependencies
**Solution**:
- Check devDependencies section
- Look for framework config files
- Manually specify framework type

**Issue**: Routes not matching tests
**Cause**: Dynamic route parameters or different path formats
**Solution**:
- Check route parameter syntax (`:id` vs `{id}`)
- Normalize paths before comparison
- Review test helper abstractions

**Issue**: Low coverage percentage seems incorrect
**Cause**: Tests use abstractions/helpers that hide actual calls
**Solution**:
- Analyze test helper files
- Look for request wrapper functions
- Check test fixtures and factories

**Issue**: Project map not loading
**Cause**: JSON format invalid or path incorrect
**Solution**:
- Validate JSON syntax
- Check file path
- Re-run Project Exploration dossier

## Example

**User Input**:
```text
? Where should the coverage gap report be saved? docs/test-coverage/
? Where are your test files located? tests/integration/
? Which test types should be analyzed? 2 (integration)
? Do you have an existing project-map.json? Yes - docs/project-map/project-map.json
```

**Output**:
```text
Test Coverage Gap Analysis Complete!

Test Framework: Jest
Tests Analyzed: 9 files, 87 test cases

Coverage Summary:
  Routes:       38/47 (81%)
  Controllers:  12/15 (80%)
  Models:       8/12 (67%)

  Overall:      76%

Gaps Found:
  Critical:     3 (no tests for public APIs)
  High:         4 (business logic untested)
  Medium:       6 (models partially tested)
  Low:          2 (utilities/middleware)

Quality Issues:
  Skipped:      5 tests
  .only:        2 tests (⚠️ blocking other tests)
  Empty:        0 tests

Output Files:
  docs/test-coverage/coverage-gaps.md
  docs/test-coverage/coverage-gaps.json

Next Steps:
1. Review critical gaps and prioritize test creation
2. Remove .only modifiers before committing
3. Address skipped tests (fix or remove)
```

## Notes

- This dossier is READ-ONLY and does not modify source code or tests
- Works best when paired with Project Exploration dossier output
- Coverage percentage is based on structural analysis, not code execution
- For line-level coverage, use native framework coverage tools (jest --coverage)
- Re-run after adding tests to track improvement
- Consider adding to CI/CD to catch coverage regressions

## References

- [Jest Testing Framework](https://jestjs.io/)
- [Mocha Testing Framework](https://mochajs.org/)
- [Vitest](https://vitest.dev/)
- [Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)
