---dossier
{
  "dossier_schema_version": "1.0.0",
  "title": "Code Refactoring & Abstraction Analysis",
  "version": "1.0.0",
  "protocol_version": "1.0",
  "status": "Draft",
  "last_updated": "2025-11-30",
  "objective": "Analyze code for DRY violations and repetitive patterns, then suggest abstractions to reduce duplication. Supports TypeScript/JavaScript, Python, and Go with configurable output modes.",
  "category": [
    "development",
    "refactoring"
  ],
  "tags": [
    "dry",
    "abstraction",
    "code-quality",
    "refactoring",
    "maintenance",
    "deduplication"
  ],
  "risk_level": "low",
  "requires_approval": false,
  "risk_factors": [
    "modifies_files"
  ],
  "destructive_operations": [
    "Creates output files in specified directory (refactoring-report.md, refactoring-report.json)",
    "Optional: Creates patch files in patches/ directory",
    "Optional: Modifies source files directly (requires explicit approval)"
  ],
  "relationships": {
    "preceded_by": [
      {
        "dossier": "project-exploration",
        "condition": "optional",
        "purpose": "Provides project-map.json for enhanced structural context"
      }
    ]
  },
  "checksum": {
    "algorithm": "sha256",
    "hash": "8be71abef670ecc3e3ad655f92697ae53a643e69d115c305a0a74d08387ab691"
  },
  "signature": {
    "algorithm": "ECDSA-SHA-256",
    "signature": "MEUCIQCfAYeqarpbFguiN649nFnjH1vGX5snRGq7AvlP9WEoJgIgQn6Cif6Uboc+MGuhaj/D3wp415ABbP6niSyNuEyUQcE=",
    "public_key": "MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEqIbQGqW1Jdh97TxQ5ZvnSVvvOcN5NWhfWwXRAaDDuKK1pv8F+kz+uo1W8bNn+8ObgdOBecFTFizkRa/g+QJ8kA==",
    "key_id": "arn:aws:kms:us-east-1:942039714848:key/d9ccd3fc-b190-49fd-83f7-e94df6620c1d",
    "signed_at": "2025-11-30T14:19:10.774Z"
  }
}
---
# Code Refactoring & Abstraction Analysis

## Table of Contents

- [Objective](#objective)
- [Prerequisites](#prerequisites)
- [Context to Gather](#context-to-gather)
  - [User Preferences](#1-user-preferences)
  - [Project Map Detection](#2-project-map-detection)
- [Actions to Perform](#actions-to-perform)
  - [Phase 1: Environment Setup](#phase-1-environment-setup)
  - [Phase 2: Code Loading & Segmentation](#phase-2-code-loading--segmentation)
  - [Phase 3: Repetition Discovery](#phase-3-repetition-discovery)
  - [Phase 4: Abstraction Definition](#phase-4-abstraction-definition)
  - [Phase 5: Risk Assessment](#phase-5-risk-assessment)
  - [Phase 6: Generate Outputs](#phase-6-generate-outputs)
  - [Phase 7: Present Results](#phase-7-present-results)
- [Validation](#validation)
- [Troubleshooting](#troubleshooting)
- [Example](#example)
- [Notes](#notes)
- [References](#references)

## Objective

Analyze code for DRY (Don't Repeat Yourself) violations to identify:
- **Duplicate Code Blocks** - Identical or near-identical code appearing in multiple locations
- **Abstraction Opportunities** - Repeated patterns that can be generalized into reusable functions
- **Refactoring Candidates** - Code that would benefit from extraction into utilities or helpers
- **Technical Debt** - Repetition that increases maintenance burden and bug risk

## Prerequisites

- [ ] Project directory exists and is accessible
- [ ] Source code files exist in the target directories
- [ ] (Optional) Project Map exists from running the Project Exploration dossier

> **Note**: Throughout this dossier, text within `{curly braces}` in code examples and templates represents placeholder values to be replaced with actual data from your project.

## Context to Gather

### 1. User Preferences

Before starting, collect the following from the user:

**Analysis Mode**
```text
? What type of analysis would you like to perform?

  1) pr-review   - Analyze specific files (e.g., files changed in a PR)
  2) maintenance - Full codebase scan for ongoing code health
  3) custom      - Specify exact files or directories to analyze

  Choice (1-3):
```

**Target Files/Directories**
```text
? Which files or directories should be analyzed?

  For PR review mode:
  - Paste file list or provide PR number/branch
  - Example: src/controllers/user.ts, src/services/auth.ts

  For maintenance mode:
  - Default: src/
  - Or specify: packages/api/src/, lib/

  For custom mode:
  - Provide glob pattern or file list
  - Example: src/**/*.ts, !src/**/*.test.ts

  Enter paths:
```

**Exclusion Patterns**
```text
? Which patterns should be excluded from analysis?

  Common exclusions (selected by default):
  - [ ] node_modules/
  - [ ] dist/, build/, out/
  - [ ] *.test.ts, *.spec.ts
  - [ ] *.d.ts
  - [ ] __mocks__/, __tests__/

  Additional exclusions (enter glob patterns):
```

**Output Mode**
```text
? How should the results be delivered?

  1) report-only     - Generate refactoring-report.md and .json (safest)
  2) report-with-diffs - Above + patch files that can be applied with git apply
  3) direct-edits    - Modify source files directly (requires approval)

  Choice (1-3):
```

**Refactoring Scope**
```text
? Where should new abstractions be placed?

  1) global - Create new utility files (e.g., src/utils/helpers.ts)
  2) local  - Add private functions within the same file
  3) both   - Suggest appropriate scope based on reuse potential

  Choice (1-3):
```

**Output Directory**
```text
? Where should the report files be saved?
  Suggested default: docs/refactoring/

  Files that will be created:
  - refactoring-report.md    (Human readable report)
  - refactoring-report.json  (Machine readable data)
  - patches/                 (If report-with-diffs mode)
```

### 2. Project Map Detection

If user has an existing project-map.json:
```text
? Do you have an existing project-map.json from Project Exploration dossier?

  1) Yes - provide path to project-map.json
  2) No  - proceed without structural context

  If yes, enter path:
```

Benefits of using project map:
- Better understanding of code organization
- Awareness of existing utility directories
- Knowledge of naming conventions
- Context about related files

## Actions to Perform

### Phase 1: Environment Setup

#### Step 1.1: Detect Primary Language(s)

Examine the target files to determine language(s):

1. **Check file extensions**:
   - `.ts`, `.tsx`, `.js`, `.jsx` → TypeScript/JavaScript
   - `.py` → Python
   - `.go` → Go

2. **Count files per language** to determine primary focus

3. **Check for language-specific configs**:
   ```bash
   ls tsconfig.json pyproject.toml go.mod 2>/dev/null
   ```

**Output**: Primary language and any secondary languages detected

#### Step 1.2: Build File List

Based on analysis mode, compile the list of files to analyze:

1. **For PR review mode**:
   - Use provided file list
   - Or fetch changed files from git:
     ```bash
     git diff --name-only {base-branch}...HEAD
     ```

2. **For maintenance mode**:
   - Find all source files:
     ```bash
     find {target-dir} -name "*.ts" -o -name "*.py" -o -name "*.go"
     ```

3. **Apply exclusion patterns**:
   - Filter out test files, generated code, dependencies

**Output**: Final list of files to analyze with their languages

#### Step 1.3: Identify Existing Utilities

Look for existing utility/helper directories:

```bash
find src -type d -name "utils" -o -name "helpers" -o -name "lib" -o -name "common"
```

Scan for existing utility functions to avoid suggesting duplicates of what already exists.

**Output**: Map of existing utilities and their purposes

---

### Phase 2: Code Loading & Segmentation

#### Step 2.1: Load Target Files

For each file in the analysis list:

1. **Read file contents**
2. **Track metadata**:
   - File path
   - Language
   - Line count
   - Last modified date

#### Step 2.2: Segment into Logical Blocks

Break code into analyzable segments:

**For TypeScript/JavaScript:**
- Function declarations
- Arrow function assignments
- Class methods
- Module-level code blocks
- React component bodies

**For Python:**
- Function definitions (def)
- Class methods
- Module-level code blocks
- List/dict comprehensions

**For Go:**
- Function definitions (func)
- Method definitions
- Init blocks

**Output format per file**:
```json
{
  "file": "{path}",
  "language": "typescript|python|go",
  "segments": [
    {
      "type": "function|method|block",
      "name": "{identifier}",
      "startLine": 10,
      "endLine": 25,
      "content": "{code}"
    }
  ]
}
```

---

### Phase 3: Repetition Discovery

> **Note**: This phase uses LLM reasoning to identify patterns. Read through the segmented code and identify repetitions.

#### Step 3.1: Identify Language-Specific Patterns

**TypeScript/JavaScript patterns to look for:**

| Pattern | Description | Example |
|---------|-------------|---------|
| Try-catch wrappers | Repeated async error handling | `try { await api() } catch (e) { handleError(e) }` |
| API call structures | Similar fetch/axios patterns | `await fetch(url, { headers, method })` |
| Validation logic | Repeated input validation | `if (!x) throw new Error()` |
| Data transformations | Similar map/filter/reduce | `items.map(x => ({ id: x.id, name: x.name }))` |
| React patterns | Repeated hooks or JSX structures | `const [state, setState] = useState()` |
| Null checks | Repeated optional chaining | `obj?.prop?.nested ?? default` |

**Python patterns to look for:**

| Pattern | Description | Example |
|---------|-------------|---------|
| Try-except blocks | Repeated exception handling | `try: ... except Exception as e: log(e)` |
| List comprehensions | Similar filtering/mapping | `[x.name for x in items if x.active]` |
| File I/O | Repeated read/write patterns | `with open(path) as f: data = f.read()` |
| API requests | Similar request patterns | `response = requests.get(url, headers=headers)` |
| Dict operations | Repeated dict manipulations | `{k: v for k, v in d.items() if condition}` |

**Go patterns to look for:**

| Pattern | Description | Example |
|---------|-------------|---------|
| Error handling | Repeated `if err != nil` | `if err != nil { return nil, err }` |
| Struct init | Similar struct initialization | `&MyStruct{Field: value}` |
| HTTP handlers | Similar handler patterns | `func(w http.ResponseWriter, r *http.Request)` |
| Defer patterns | Repeated cleanup | `defer file.Close()` |
| Slice operations | Similar filtering/mapping | `for _, item := range items { ... }` |

**Cross-language patterns:**

| Pattern | Description |
|---------|-------------|
| Logging | Repeated log statements with similar formatting |
| Config access | Repeated environment/config reads |
| String building | Similar string concatenation or formatting |
| Date/time | Repeated date formatting or parsing |

#### Step 3.2: Group Similar Segments

For each identified pattern:

1. **Cluster similar code blocks** based on:
   - Structural similarity (same control flow)
   - Semantic similarity (same purpose)
   - Variable differences only

2. **Score similarity**:
   - **Identical**: Exact match (perfect DRY violation)
   - **Near-identical**: Same structure, different variables/constants
   - **Similar**: Same pattern, minor structural differences

3. **Minimum threshold**: Only report clusters with 2+ occurrences

**Output format**:
```json
{
  "clusters": [
    {
      "id": "cluster-001",
      "pattern": "async-error-handling",
      "similarity": "near-identical",
      "occurrences": [
        {
          "file": "{path}",
          "startLine": 45,
          "endLine": 52,
          "code": "{snippet}"
        }
      ],
      "variableParts": ["apiEndpoint", "errorMessage"],
      "constantParts": ["try-catch structure", "error logging"]
    }
  ]
}
```

---

### Phase 4: Abstraction Definition

For each repetition cluster, define a potential abstraction:

#### Step 4.1: Analyze Variable Parts

Identify what changes between occurrences:
- Input values → become function parameters
- Output handling → determine return type
- Configuration → become options object

#### Step 4.2: Design Function Signature

**For TypeScript/JavaScript:**
```typescript
/**
 * {description}
 * @param {paramType} {paramName} - {paramDescription}
 * @returns {returnType} {returnDescription}
 */
export function {functionName}({params}): {returnType} {
  {body}
}
```

**For Python:**
```python
def {function_name}({params}) -> {return_type}:
    """
    {description}

    Args:
        {param_name}: {param_description}

    Returns:
        {return_description}
    """
    {body}
```

**For Go:**
```go
// {FunctionName} {description}
func {FunctionName}({params}) ({returnType}, error) {
    {body}
}
```

#### Step 4.3: Determine Placement

Based on refactoring scope preference:

**Global scope** (create new file):
- Used in 3+ files
- General-purpose utility
- Suggested path: `src/utils/{category}.{ext}`

**Local scope** (same file):
- Used only within one file
- File-specific helper
- Place at top of file or near usage

**Output format per abstraction**:
```json
{
  "id": "abstraction-001",
  "clusterId": "cluster-001",
  "name": "{functionName}",
  "signature": "{full signature}",
  "parameters": [
    {"name": "{param}", "type": "{type}", "description": "{desc}"}
  ],
  "returnType": "{type}",
  "scope": "global|local",
  "suggestedPath": "{path}",
  "implementation": "{code}",
  "usageExample": "{how to call it}",
  "replacements": [
    {
      "file": "{path}",
      "startLine": 45,
      "endLine": 52,
      "originalCode": "{snippet}",
      "newCode": "{replacement call}"
    }
  ]
}
```

---

### Phase 5: Risk Assessment

#### Step 5.1: Classify Risk Level

For each suggested abstraction:

| Risk Level | Criteria | Examples |
|------------|----------|----------|
| **Low** | Pure function, no side effects, simple replacement | String formatting, math helpers |
| **Medium** | Has I/O, state, or affects control flow | API calls, file operations, logging |
| **High** | Changes shared utilities, class hierarchies, or core logic | Base class changes, middleware, interceptors |

#### Step 5.2: Identify Dependencies

Check if the abstraction:
- Requires new imports
- Depends on external packages
- Needs additional type definitions
- Affects test coverage

#### Step 5.3: Estimate Impact

Calculate metrics:
- **Lines of code removed**: Total lines replaced
- **Files affected**: Number of files with changes
- **Complexity reduction**: Cyclomatic complexity improvement

**Output format**:
```json
{
  "abstractionId": "abstraction-001",
  "riskLevel": "low|medium|high",
  "riskFactors": ["{factor1}", "{factor2}"],
  "dependencies": {
    "newImports": ["{import}"],
    "externalPackages": [],
    "typeDefinitions": []
  },
  "impact": {
    "linesRemoved": 45,
    "filesAffected": 5,
    "estimatedTimeToImplement": "15 minutes"
  }
}
```

---

### Phase 6: Generate Outputs

#### Step 6.1: Calculate Summary Metrics

```json
{
  "summary": {
    "filesAnalyzed": 0,
    "totalLines": 0,
    "clustersFound": 0,
    "abstractionsSuggested": 0,
    "estimatedLinesRemoved": 0,
    "estimatedReductionPercent": 0,
    "byRiskLevel": {
      "low": 0,
      "medium": 0,
      "high": 0
    },
    "byLanguage": {
      "typescript": 0,
      "python": 0,
      "go": 0
    }
  }
}
```

#### Step 6.2: Generate JSON Output

Create `refactoring-report.json` in the output directory:

```json
{
  "metadata": {
    "generatedAt": "{ISO-8601 timestamp}",
    "projectRoot": "{absolute path}",
    "analysisMode": "{pr-review|maintenance|custom}",
    "outputMode": "{report-only|report-with-diffs|direct-edits}",
    "languages": ["{detected languages}"],
    "filesAnalyzed": 0,
    "projectMapUsed": true|false
  },
  "summary": {
    "clustersFound": 0,
    "abstractionsSuggested": 0,
    "estimatedLinesRemoved": 0,
    "estimatedReductionPercent": 0
  },
  "abstractions": [],
  "byPriority": {
    "high": [],
    "medium": [],
    "low": []
  }
}
```

#### Step 6.3: Generate Markdown Report

Create `refactoring-report.md` in the output directory:

```markdown
# Code Refactoring & Abstraction Report

> Generated: {timestamp}
> Analysis Mode: {mode}
> Files Analyzed: {count}

## Executive Summary

| Metric | Value |
|--------|-------|
| Files Analyzed | {n} |
| Total Lines Scanned | {n} |
| Repetition Clusters Found | {n} |
| Abstractions Suggested | {n} |
| Estimated Lines Removed | {n} |
| Estimated Code Reduction | {n}% |

## Suggestions by Priority

### High Value (Recommended)

These abstractions provide the greatest benefit with acceptable risk:

#### 1. {Abstraction Name}

**Impact**: Removes {n} lines across {n} files
**Risk**: {Low|Medium|High}

**Proposed Function**:
```{language}
{signature and implementation}
```

**Occurrences to Replace**:

| File | Lines | Current Code |
|------|-------|--------------|
| {file} | {start}-{end} | `{snippet}` |

**Replacement**:
```{language}
{how to use the new function}
```

---

### Medium Value

{Similar structure for medium priority suggestions}

### Low Value

{Similar structure for low priority suggestions}

## Risk Assessment Summary

| Risk Level | Count | Recommendation |
|------------|-------|----------------|
| Low | {n} | Safe to implement |
| Medium | {n} | Review before implementing |
| High | {n} | Requires careful consideration |

## Implementation Checklist

- [ ] Review all High Value suggestions
- [ ] Create utility files if needed
- [ ] Implement abstractions one at a time
- [ ] Run tests after each change
- [ ] Update imports in affected files

## Next Steps

1. Start with Low-risk, High-value abstractions
2. Run existing tests to ensure no regressions
3. Consider adding tests for new utility functions
4. Document new utilities for team awareness

---
*Generated by Code Refactoring & Abstraction Analysis Dossier*
```

#### Step 6.4: Generate Patches (if report-with-diffs mode)

> **Applies when**: Output mode is `report-with-diffs`

Create `patches/` directory with:

1. **Individual patches** per abstraction:
   - `patches/001-{abstraction-name}.patch`

2. **Combined patch**:
   - `patches/all-changes.patch`

Patch format:
```diff
--- a/{file}
+++ b/{file}
@@ -{start},{count} +{start},{count} @@
-{original code}
+{replacement code}
```

#### Step 6.5: Apply Direct Edits (if direct-edits mode)

> **Applies when**: Output mode is `direct-edits`
> **Requires**: Explicit user approval before proceeding

1. **Create new utility files** if needed
2. **Add imports** to affected files
3. **Replace code blocks** with function calls
4. **Run formatter** (prettier, black, gofmt) on changed files

**Safety checks before editing:**
- Confirm with user before each file modification
- Create backup of original files
- Verify tests pass after each change

---

### Phase 7: Present Results

Display summary to user:

```text
Code Refactoring Analysis Complete!

Analysis Mode:  {mode}
Files Analyzed: {count}
Languages:      {languages}

Findings:
  Repetition Clusters: {count}
  Abstractions Suggested: {count}

  Estimated Impact:
    Lines Removed:    {count}
    Code Reduction:   {percent}%

Suggestions by Risk:
  Low Risk:    {count} (safe to implement)
  Medium Risk: {count} (review recommended)
  High Risk:   {count} (careful consideration needed)

Top 3 Recommendations:
1. {abstraction-name} - Removes {n} lines across {n} files
2. {abstraction-name} - Removes {n} lines across {n} files
3. {abstraction-name} - Removes {n} lines across {n} files

Output Files:
  {output-dir}/refactoring-report.md
  {output-dir}/refactoring-report.json
  {output-dir}/patches/  (if applicable)

Next Steps:
1. Review refactoring-report.md for detailed suggestions
2. Start with Low-risk items for quick wins
3. Run tests after implementing changes
4. Consider pairing this with Test Coverage Gap Analysis dossier
```

## Validation

- [ ] Analysis mode and target files confirmed
- [ ] Language(s) correctly detected
- [ ] All target files were loaded and segmented
- [ ] Repetition patterns identified and clustered
- [ ] Abstractions have valid signatures for target language
- [ ] Risk levels assigned to all suggestions
- [ ] Impact metrics calculated
- [ ] JSON output is valid and parseable
- [ ] Markdown report is properly formatted
- [ ] (If diffs) Patch files are syntactically correct
- [ ] (If direct edits) All changes applied cleanly
- [ ] (If direct edits) Tests still pass

## Troubleshooting

**Issue**: No repetitions found
**Cause**: Code is already well-abstracted, or analysis scope too narrow
**Solution**:
- Expand target directories
- Lower similarity threshold
- Check if existing utilities cover common patterns

**Issue**: Language detection incorrect
**Cause**: Mixed file types or non-standard extensions
**Solution**:
- Manually specify primary language
- Check file extension mappings
- Exclude non-source files

**Issue**: Too many suggestions (overwhelming)
**Cause**: Large codebase or very lenient detection
**Solution**:
- Filter by risk level (start with Low)
- Filter by impact (minimum lines saved)
- Focus on specific directories first

**Issue**: Suggested abstraction doesn't compile
**Cause**: Complex type inference or missing context
**Solution**:
- Review generated signature
- Add missing type annotations
- Adjust parameter types manually

**Issue**: Patches don't apply cleanly
**Cause**: File changed since analysis, or conflicting changes
**Solution**:
- Re-run analysis on current code
- Apply patches one at a time
- Resolve conflicts manually

**Issue**: Tests fail after direct edits
**Cause**: Behavior changed subtly, or missing edge cases
**Solution**:
- Review the abstraction logic
- Check parameter handling
- Roll back and apply manually with adjustments

## Example

### PR Review Mode

**User Input**:
```text
? What type of analysis? 1 (pr-review)
? Which files? src/controllers/user.ts, src/controllers/auth.ts, src/services/email.ts
? Exclusions? (default)
? Output mode? 2 (report-with-diffs)
? Refactoring scope? 3 (both)
? Output directory? docs/refactoring/
```

**Output**:
```text
Code Refactoring Analysis Complete!

Analysis Mode:  PR Review
Files Analyzed: 3
Languages:      TypeScript

Findings:
  Repetition Clusters: 4
  Abstractions Suggested: 3

  Estimated Impact:
    Lines Removed:    67
    Code Reduction:   12%

Suggestions by Risk:
  Low Risk:    2 (safe to implement)
  Medium Risk: 1 (review recommended)
  High Risk:   0

Top 3 Recommendations:
1. wrapAsync() - Removes 34 lines across 3 files (async error handling)
2. validateEmail() - Removes 18 lines across 2 files (email validation)
3. formatUserResponse() - Removes 15 lines across 2 files (response formatting)

Output Files:
  docs/refactoring/refactoring-report.md
  docs/refactoring/refactoring-report.json
  docs/refactoring/patches/

Next Steps:
1. Review patches with: cat docs/refactoring/patches/all-changes.patch
2. Apply with: git apply docs/refactoring/patches/all-changes.patch
3. Run tests to verify
```

### Maintenance Mode

**User Input**:
```text
? What type of analysis? 2 (maintenance)
? Which directories? src/
? Exclusions? node_modules/, dist/, *.test.ts
? Output mode? 1 (report-only)
? Refactoring scope? 1 (global)
? Output directory? docs/refactoring/
? Project map? Yes - docs/project-map/project-map.json
```

**Output**:
```text
Code Refactoring Analysis Complete!

Analysis Mode:  Maintenance (Full Codebase)
Files Analyzed: 89
Languages:      TypeScript, Python

Findings:
  Repetition Clusters: 23
  Abstractions Suggested: 15

  Estimated Impact:
    Lines Removed:    412
    Code Reduction:   8%

Suggestions by Risk:
  Low Risk:    9 (safe to implement)
  Medium Risk: 4 (review recommended)
  High Risk:   2 (careful consideration needed)

Top 3 Recommendations:
1. createApiClient() - Removes 89 lines across 12 files
2. withRetry() - Removes 67 lines across 8 files
3. parseConfig() - Removes 45 lines across 6 files

Output Files:
  docs/refactoring/refactoring-report.md
  docs/refactoring/refactoring-report.json

Next Steps:
1. Review refactoring-report.md for detailed analysis
2. Prioritize based on team capacity
3. Create tickets for High-risk items requiring discussion
```

## Notes

- This dossier does NOT execute code - all analysis is structural/textual
- Generated abstractions are suggestions - human review recommended
- The "lines removed" metric is an estimate based on replacement
- Works best on codebases with consistent coding style
- For line-level coverage analysis, pair with Test Coverage Gap Analysis dossier
- Consider running after major feature additions or before releases
- Results can be used to update team coding guidelines

## References

- [DRY Principle](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)
- [Refactoring: Improving the Design of Existing Code](https://refactoring.com/)
- [Clean Code by Robert C. Martin](https://www.oreilly.com/library/view/clean-code-a/9780136083238/)
- [Extract Function Refactoring](https://refactoring.guru/extract-method)
