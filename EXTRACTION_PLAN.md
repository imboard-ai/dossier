# Dossier Project Extraction Plan

**Status**: Repository initialized, needs content extraction from MI6
**Estimated Time**: ~4-6 hours remaining

---

## What's Done
- ✅ Created ~/projects/dossier repository
- ✅ Initialized git (main branch)
- ✅ Created directory structure
- ✅ Copied LICENSE and .gitignore
- ✅ Created universal README.md

---

## Remaining Work

### 1. Extract Universal PROTOCOL.md from MI6 (1 hour)

**Source**: `~/projects/mi6/dossiers/_PROTOCOL.md`
**Destination**: `~/projects/dossier/PROTOCOL.md`

**Changes needed**:
- Remove MI6-specific references (.ai-project.json, task lifecycle, etc.)
- Keep universal: self-improvement, safety, validation, output formats
- Make domain-agnostic
- Add note: "See implementations (MI6) for domain-specific extensions"

---

### 2. Create SPECIFICATION.md (1-1.5 hours)

**Contents**:
- What is a dossier (formal definition)
- Required sections (Objective, Prerequisites, Context, Actions, Validation)
- Optional sections (Metadata, Examples, Troubleshooting)
- Protocol compliance requirements
- Relationship types (preceded-by, followed-by, conflicts, etc.)
- Output types (files, config, state, agents)
- Coupling levels (tight, medium, loose)
- Versioning semantics

---

### 3. Copy Universal Templates (30 min)

**From MI6 dossiers/templates/**:
- dossier-template.md → templates/dossier-template.md (make universal)
- metadata-section.md → templates/metadata-template.md (make universal)

---

### 4. Create Non-MI6 Examples (1-2 hours)

**examples/devops/deploy-to-aws.md**:
- Deploy application to AWS
- No MI6 dependencies
- Shows dossier pattern for DevOps

**examples/development/refactor-typescript.md**:
- Code refactoring workflow
- Language-specific but not MI6-specific

**examples/data-science/setup-ml-pipeline.md**:
- ML workflow automation
- Completely different domain

**Purpose**: Prove dossiers are universal, not just for MI6

---

### 5. Create Validation Tool (1 hour)

**tools/validate.js**:
```javascript
// Validates dossier structure
// Checks: required sections, protocol compliance, metadata format
```

---

### 6. Push Dossier to GitHub (15 min)

```bash
cd ~/projects/dossier
git add -A
git commit -m "Initial release: Universal dossier standard"
# Create repo on GitHub first
git remote add origin git@github.com:imboard-ai/dossier.git
git push -u origin main
```

---

### 7. Refactor MI6 to Use Dossier (1-2 hours)

**7.1 Add submodule**:
```bash
cd ~/projects/mi6
git submodule add https://github.com/imboard-ai/dossier.git dossiers/.dossier
```

**7.2 Create MI6 extensions**:
**File**: `dossiers/_MI6_EXTENSIONS.md`
```markdown
# MI6 Dossier Extensions

**Extends**: [Dossier Protocol v1.0](https://github.com/imboard-ai/dossier)

## MI6-Specific Additions
- .ai-project.json schema references
- Task lifecycle patterns
- Worktree conventions
```

**7.3 Update MI6 dossier headers**:
```markdown
**Protocol**: Dossier v1.0 + MI6 Extensions v1.0
```

**7.4 Update MI6 README**:
```markdown
# MI6 - Agent Organization Framework

**Built on [Dossier](https://github.com/imboard-ai/dossier)** - universal LLM automation standard

MI6 provides opinionated dossiers for agent-driven development.
```

---

## Success Criteria

1. ✅ `dossier` repo exists independently
2. ✅ PROTOCOL.md is universal (no MI6 specifics)
3. ✅ SPECIFICATION.md formally defines dossiers
4. ✅ Non-MI6 examples prove universality
5. ✅ MI6 references dossier via submodule
6. ✅ Clear separation: protocol (universal) vs MI6 (specific application)
7. ✅ Both repos pushed to GitHub

---

## Next Steps After Extraction

1. Announce Dossier as universal standard
2. Encourage community dossiers
3. Build discovery tools
4. Create more examples across domains

---

**This could become the standard for LLM automation!**
