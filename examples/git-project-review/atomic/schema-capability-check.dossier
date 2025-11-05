---
dossier_version: "1.0.0"
metadata:
  name: "Schema Capability Check"
  description: "Explores the codebase to determine if a specific feature or capability is supported by the Dossier schema and implementation"
  tags: ["meta", "schema", "exploration"]
  estimated_duration: "1-2 minutes"
  author: "Dossier Team"

prompt_variables:
  - name: "capability"
    description: "The feature or capability to check (e.g., 'composition/references', 'conditional execution', 'loops')"
    required: true
    example: "Does the schema support referencing other dossier files?"

output:
  format: "markdown"
  sections:
    - "Answer Summary"
    - "Evidence from Code"
    - "Usage Examples (if supported)"
    - "Recommendations"
---

# Schema Capability Check

You are analyzing the Dossier project to determine if it supports: **{{capability}}**

## Your Task

1. **Explore the Schema Definition**
   - Read the schema documentation (README.md, SCHEMA.md, schema.json, etc.)
   - Look for JSON Schema definitions or TypeScript types
   - Check for relevant field names or structures

2. **Explore the Implementation**
   - Find the validator/parser code
   - Look for runtime handling of the feature
   - Check test files for usage examples

3. **Search for Examples**
   - Look in examples/ directory
   - Search for usage in existing dossier files
   - Check test fixtures

4. **Provide Clear Answer**
   - ✅ YES - Feature is supported (with evidence)
   - ⚠️ PARTIAL - Some support exists (explain limitations)
   - ❌ NO - Not currently supported (suggest workarounds or alternatives)

## Output Format

### Answer Summary
[Clear yes/partial/no answer with one-line explanation]

### Evidence from Code
[Specific file paths and line numbers showing schema definitions, implementation code, or tests]

### Usage Examples (if supported)
[Show concrete examples of how to use this feature]

### Recommendations
[If not supported: suggest workarounds or whether it should be added]
[If supported: best practices for using it]

---

**Instructions:**
- Focus on factual evidence from code, not speculation
- Include file paths with line numbers (e.g., `schema.json:45-50`)
- If unsure, say so and explain what you found vs. what's unclear
- Be concise but thorough
