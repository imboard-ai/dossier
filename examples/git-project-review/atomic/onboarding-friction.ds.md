---
dossier_version: "1.0.0"
metadata:
  name: "Onboarding Friction Assessment"
  description: "Identifies pain points and confusion points for new contributors trying to understand and work with the project"
  tags: ["onboarding", "dx", "contributor-experience"]
  estimated_duration: "45-90 seconds"
  author: "Dossier Team"

prompt_variables:
  - name: "focus_area"
    description: "Specific area to focus on (e.g., 'setup', 'testing', 'architecture', 'all')"
    required: false
    default: "all"

output:
  format: "markdown"
  sections:
    - "Friction Score"
    - "Critical Blockers 🚫"
    - "Confusion Points 🤔"
    - "Missing Guidance 📚"
    - "Quick Wins 🎯"
---

# Onboarding Friction Assessment

You are evaluating the new contributor experience by identifying friction points.

## Your Task

Simulate the journey of a new contributor who wants to:
1. Understand what this project does
2. Set up a development environment
3. Understand the codebase structure
4. Make their first contribution
5. Run tests and verify their changes

For each stage, identify friction points.

## Areas to Investigate

### 1. First Impression (0-2 minutes)
- Is the project purpose clear immediately?
- Is the README welcoming and oriented to newcomers?
- Are there quick examples to understand value?

### 2. Setup Process (2-10 minutes)
- Are dependencies clearly listed?
- Do setup commands actually work?
- Are there multiple conflicting instruction sources?
- Are there hidden system requirements?

### 3. Codebase Navigation (10-30 minutes)
- Is the directory structure intuitive?
- Is there a CONTRIBUTING.md or architecture guide?
- Are naming conventions consistent and clear?
- Can you find where to add a simple feature?

### 4. Development Workflow (30+ minutes)
- How to run tests? Is it documented and does it work?
- Hot reload / fast feedback loops?
- How to debug? Any tooling explained?
- Code style enforcement (linters)? Automatic or manual?

### 5. Contribution Process
- How to submit changes? PR template? Guidelines?
- Are there examples of good PRs to learn from?
- Review process transparent?

## Output Format

### Friction Score
**Overall: [Low/Medium/High]**
- Setup: [score]
- Understanding: [score]
- Contributing: [score]

[One paragraph summary of overall experience]

### Critical Blockers 🚫
[Things that STOP a new contributor]
1. **[Blocker name]**
   - What happens: [specific scenario]
   - Evidence: [file:line or missing file]
   - Impact: [why this is critical]
   - Fix: [specific recommendation]

### Confusion Points 🤔
[Things that SLOW DOWN or CONFUSE contributors]
1. **[Confusion source]**
   - Why it's confusing: [explanation]
   - Where it happens: [context/files]
   - Better approach: [suggestion]

### Missing Guidance 📚
[Documentation gaps that would help newcomers]
- [ ] Missing X explanation (needed in file/doc Y)
- [ ] No examples of Z (would help with understanding W)

### Quick Wins 🎯
[Small changes that would significantly reduce friction]
1. **[Quick win]** - [why it helps] - [where to add it]
   - Effort: [Low/Medium]
   - Impact: [High/Medium]

---

**Instructions:**
- Think from a beginner's perspective (don't assume expert knowledge)
- Be specific about WHERE confusion happens (file paths, doc sections)
- Prioritize based on impact to newcomer success
- Quick wins should be actionable (not "improve docs" but "add setup example to README:45")
- If onboarding is smooth, celebrate what works well!
