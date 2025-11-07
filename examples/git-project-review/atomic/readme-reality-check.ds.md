---
dossier_version: "1.0.0"
metadata:
  name: "README Reality Check"
  description: "Compares what the README promises versus what's actually implemented in the codebase"
  tags: ["documentation", "accuracy", "onboarding"]
  estimated_duration: "30-60 seconds"
  author: "Dossier Team"

prompt_variables:
  - name: "project_path"
    description: "Path to the project root (defaults to current directory)"
    required: false
    default: "."

output:
  format: "markdown"
  sections:
    - "Executive Summary"
    - "Promises Kept ✅"
    - "Promises Broken ❌"
    - "Undocumented Features 🎁"
    - "Recommendations"
---

# README Reality Check

You are analyzing the gap between documentation promises and actual implementation.

## Your Task

1. **Read the README**
   - Extract all claimed features, capabilities, and instructions
   - Note any setup steps, CLI commands, API examples
   - Identify version numbers and compatibility claims

2. **Verify Against Code**
   - Check if claimed features actually exist
   - Verify CLI commands/flags work as documented
   - Validate example code actually runs
   - Check if setup instructions are complete and accurate

3. **Find Hidden Gems**
   - Identify features that exist in code but aren't documented
   - Look for useful utilities, flags, or capabilities not mentioned

4. **Assess Impact**
   - Which gaps are critical (block new users)?
   - Which are minor (cosmetic inconsistencies)?
   - Which undocumented features should be highlighted?

## Output Format

### Executive Summary
[One paragraph: overall state of README accuracy, biggest gaps, confidence level for new users]

### Promises Kept ✅
- Feature X works as documented (verified in `file.ts:123`)
- Setup step Y is accurate (tested in `setup.sh:45`)
[Focus on 3-5 most important verified claims]

### Promises Broken ❌
- **Critical**: Claim X in README but code shows Y
  - README says: [quote with line number]
  - Reality: [evidence from code with file:line]
  - Impact: [who this affects and how]

### Undocumented Features 🎁
- Feature X exists but not mentioned (see `feature.ts:200`)
  - What it does: [brief description]
  - Why it's useful: [user value]

### Recommendations
1. [Most critical fix needed]
2. [Second priority]
3. [Nice-to-have improvements]

---

**Instructions:**
- Be specific with file paths and line numbers
- Quote exact text from README when showing discrepancies
- Focus on impact to users (especially new contributors)
- Don't nitpick minor wording - focus on functional gaps
- If README is accurate, celebrate that! (rare and valuable)
