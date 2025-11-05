---
dossier_version: "1.0.0"
metadata:
  name: "Architecture & Pattern Consistency"
  description: "Identifies inconsistent patterns, duplicate approaches, and architectural drift in the codebase"
  tags: ["architecture", "consistency", "tech-debt", "patterns"]
  estimated_duration: "60-90 seconds"
  author: "Dossier Team"

prompt_variables:
  - name: "focus_pattern"
    description: "Specific pattern to analyze (e.g., 'error-handling', 'data-fetching', 'state-management', 'all')"
    required: false
    default: "all"

output:
  format: "markdown"
  sections:
    - "Consistency Score"
    - "Pattern Inventory"
    - "Inconsistencies Found"
    - "Duplication Hotspots"
    - "Recommendations"
---

# Architecture & Pattern Consistency Analysis

You are analyzing the codebase for architectural consistency and pattern usage.

## Your Task

Identify how the codebase handles common concerns and whether it does so consistently.

## Patterns to Investigate

### 1. Error Handling
- try/catch blocks?
- Error classes/types?
- Result types (Ok/Err pattern)?
- Error boundaries (if applicable)?
- How many different approaches exist?

### 2. Data Fetching / External Calls
- Direct fetch/axios?
- Wrapper utilities?
- Libraries (React Query, SWR, etc.)?
- Where is retry logic? Timeout handling?

### 3. State Management (if applicable)
- Local component state?
- Context?
- Global store (Redux, Zustand, etc.)?
- Multiple approaches for similar needs?

### 4. Configuration Management
- Environment variables?
- Config files (JSON, YAML, .env)?
- Where are configs located? (multiple places?)
- Hardcoded values scattered in code?

### 5. Testing Patterns
- Unit test style (describe/it, test())?
- Mocking approach?
- Test utilities location and usage?
- Coverage of different code areas?

### 6. File/Module Organization
- Grouping by feature? By type?
- Consistent across codebase?
- Import patterns (absolute, relative)?

### 7. Code Reuse
- Same logic implemented multiple times?
- Similar functions with slight variations?
- Opportunities for abstraction?

## Output Format

### Consistency Score
**Overall: [High/Medium/Low]**

[One paragraph: general architectural health, main consistency issues]

### Pattern Inventory
[List the different approaches found for each concern]

**Error Handling:**
- Approach A: try/catch (files: `x.ts:10`, `y.ts:45`)
- Approach B: Result types (files: `z.ts:100`)
- Approach C: Throw and don't catch (files: `w.ts:200`)

**[Other patterns...]**

### Inconsistencies Found
[Flag patterns where multiple approaches exist for the same concern]

1. **Error Handling Inconsistency (Critical)**
   - 3 different approaches across codebase
   - Evidence:
     - `auth.ts:45` - uses try/catch with custom errors
     - `api.ts:120` - throws strings (!!)
     - `db.ts:89` - returns error codes
   - Impact: Hard to handle errors consistently, new contributors confused
   - Recommendation: Standardize on [suggested approach]

### Duplication Hotspots
[Identify similar/duplicate code]

1. **Date Formatting Logic (3 locations)**
   - `utils/format.ts:10`
   - `components/DateDisplay.tsx:34`
   - `services/reports.ts:156`
   - Recommendation: Extract to shared utility

### Recommendations

**High Priority:**
1. [Most critical consistency fix]
   - Why: [impact]
   - Where: [files affected]
   - Effort: [estimate]

**Medium Priority:**
2. [Second priority]

**Low Priority / Future:**
3. [Nice-to-have consistency improvements]

---

**Instructions:**
- Focus on patterns that affect maintainability and onboarding
- Don't nitpick style (unless it causes bugs) - focus on architectural concerns
- Provide specific file:line references for each pattern
- Be pragmatic: some inconsistency is okay if it's intentional
- If architecture is clean and consistent, highlight what's done well!
