---dossier
{
  "dossier_schema_version": "1.0.0",
  "title": "Onboarding Friction Assessment",
  "version": "1.0.0",
  "protocol_version": "1.0",
  "status": "Stable",
  "last_updated": "2025-11-16",
  "objective": "Identify pain points and confusion points for new contributors trying to understand and work with the project",
  "category": [
    "development",
    "documentation"
  ],
  "tags": [
    "onboarding",
    "dx",
    "contributor-experience",
    "analysis"
  ],
  "risk_level": "low",
  "risk_factors": [],
  "requires_approval": false,
  "destructive_operations": [],
  "estimated_duration": {
    "min_minutes": 0.75,
    "max_minutes": 1.5
  },
  "coupling": {
    "level": "Loose",
    "details": "Read-only analysis with no dependencies"
  },
  "inputs": {
    "optional": [
      {
        "name": "focus_area",
        "description": "Specific area to focus on (e.g., 'setup', 'testing', 'architecture', 'all')",
        "type": "string",
        "default": "all"
      }
    ]
  },
  "outputs": {
    "format": "markdown",
    "sections": [
      "Friction Score",
      "Critical Blockers 🚫",
      "Confusion Points 🤔",
      "Missing Guidance 📚",
      "Quick Wins 🎯"
    ]
  },
  "checksum": {
    "algorithm": "sha256",
    "hash": "faf4643c5b276c661f43c1084c25ce546310e3bc4403651a1184a9c324acaba5"
  },
  "signature": {
    "algorithm": "ECDSA-SHA-256",
    "signature": "MEYCIQCEouwqG8q0g35sAV9JcJgv8AMxTTAvFcfqVkq/fQ9pAwIhAKqb8J4fKPsVqFrh8a4EPyA+2FdsqTDw0bxd14NB4aPP",
    "public_key": "MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEqIbQGqW1Jdh97TxQ5ZvnSVvvOcN5NWhfWwXRAaDDuKK1pv8F+kz+uo1W8bNn+8ObgdOBecFTFizkRa/g+QJ8kA==",
    "key_id": "arn:aws:kms:us-east-1:942039714848:key/d9ccd3fc-b190-49fd-83f7-e94df6620c1d",
    "signed_at": "2025-11-16T11:23:37.246Z",
    "signed_by": "Dossier Team <team@dossier.ai>"
  }
}
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
