# Git Project Review - Dossier Examples

LLM-powered analysis tools for understanding and improving your Git projects.

## What This Demonstrates

These dossiers showcase:
- ✅ **Real LLM value** - Analysis that can't be done without deep code understanding
- ✅ **Atomic & composable** - Small, focused dossiers that can be combined
- ✅ **Dogfooding** - Used on Dossier itself to improve the project
- ✅ **Reusable** - Run on any project to get insights

## Quick Start

### Try a Fast One (30-60 seconds)

Check if your README matches reality:
```bash
dossier run examples/git-project-review/atomic/readme-reality-check.dossier
```

### Meta: Explore Dossier Itself

Check if a schema feature is supported:
```bash
dossier run examples/git-project-review/atomic/schema-capability-check.dossier \
  --var capability="Does the schema support referencing other dossier files?"
```

### Assess Onboarding Experience (45-90 seconds)

See what confuses new contributors:
```bash
dossier run examples/git-project-review/atomic/onboarding-friction.dossier
```

### Find Inconsistent Patterns (60-90 seconds)

Identify architectural drift:
```bash
dossier run examples/git-project-review/atomic/architecture-patterns.dossier
```

## Available Atomic Dossiers

| Dossier | Duration | What It Analyzes | Value |
|---------|----------|------------------|-------|
| **schema-capability-check** | ~1-2 min | Explores codebase to answer: "Does it support X?" | Meta-tool for understanding capabilities |
| **readme-reality-check** | ~30-60s | README promises vs. actual code | Catches outdated docs, finds hidden features |
| **onboarding-friction** | ~45-90s | New contributor pain points | Identifies blockers and confusion |
| **architecture-patterns** | ~60-90s | Pattern consistency and duplication | Spots architectural drift |

## Use Cases

### For Maintainers
- Get a fresh perspective on your project
- Identify documentation drift
- Find quick wins to improve contributor experience
- Spot technical debt patterns

### For Contributors
- Understand a new project faster
- Find real vs. documented state
- Identify confusing areas before diving in

### For Security/Audit
- *(Coming soon: security-scan.dossier)*
- Find common vulnerability patterns
- Check input validation

## Composition (Future)

Once the schema supports it, we'll add:
```
composed/
├── quick-health.dossier      # 2-3 fast checks (~2min)
├── comprehensive.dossier     # All atomics (~5-10min)
└── custom-audit.dossier      # Interactive selection
```

Usage will look like:
```bash
# Quick combo
dossier run composed/quick-health.dossier

# Deep dive
dossier run composed/comprehensive.dossier

# Interactive
dossier run composed/custom-audit.dossier
```

## Tips

**Faster Analysis:**
Use `--var project_path=./src` to limit scope

**On Large Repos:**
Start with atomic dossiers, don't run comprehensive analysis

**Custom Focus:**
Many dossiers accept a `focus_area` variable:
```bash
dossier run atomic/onboarding-friction.dossier --var focus_area="setup"
```

## Output Format

All dossiers output structured markdown with:
- Clear sections
- File:line references for evidence
- Actionable recommendations
- Severity/priority indicators

## Dogfooding

These dossiers are actively used on the Dossier project itself:
```bash
# Run on Dossier repo
cd /path/to/dossier
dossier run examples/git-project-review/atomic/readme-reality-check.dossier

# See what needs improvement!
```

## Contributing

Want to add more atomic dossiers? Great patterns to add:
- `test-coverage-gaps.dossier` - Semantic coverage analysis
- `security-scan.dossier` - Common vulnerability patterns
- `dependency-health.dossier` - Outdated deps with impact analysis
- `tech-debt-hotspots.dossier` - Files/areas needing refactor

Keep them:
- **Atomic** - One clear purpose
- **Fast** - Under 2 minutes
- **Actionable** - Specific recommendations with file:line references
- **Evidence-based** - Show proof from code, not speculation

## Learn More

- [Dossier Schema Documentation](../../SCHEMA.md)
- [Writing Custom Dossiers](../../docs/writing-dossiers.md)
- [Dossier Project Repository](https://github.com/imboard-ai/dossier)
