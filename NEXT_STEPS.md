# Dossier Project - Completion Steps

**Current Status**: Foundation created, docs copied from MI6, needs universalization

---

## What's Done ✅

- ✅ Repository initialized (~/projects/dossier)
- ✅ README.md created (universal pitch)
- ✅ PROTOCOL.md extracted
- ✅ Templates copied
- ✅ README.md and REGISTRY.md copied from MI6
- ✅ 2 commits made locally

---

## Quick Wins to Finish (2-3 hours)

### 1. Edit README.md - Make Universal (20 min)
**Current**: Has MI6-specific references
**Change**: Replace "MI6" with "Dossier" as universal concept
- Remove MI6_PATH references
- Keep examples but make generic
- Add "Implementations: MI6, [others]" section

### 2. Edit REGISTRY.md - Keep as MI6 Example (10 min)
**Option A**: Keep as examples/mi6-dossiers-registry.md
**Option B**: Create universal registry template

### 3. Create Quick SPECIFICATION.md (30 min)
```markdown
# Dossier Specification v1.0

## What is a Dossier?
Structured markdown file that LLM agents execute

## Required Sections
- Objective
- Prerequisites
- Actions
- Validation

## Protocol Compliance
Must follow PROTOCOL.md

[Simple, formal definition]
```

### 4. Create 1 Universal Example (20 min)
**examples/devops/deploy-to-aws.md** - Simple AWS deployment dossier
Proves pattern works outside MI6

### 5. Push to GitHub (15 min)
```bash
cd ~/projects/dossier
git add -A
git commit -m "Universal dossier standard v1.0"
# Create repo at github.com/imboard-ai/dossier
git remote add origin git@github.com:imboard-ai/dossier.git
git push -u origin main
```

### 6. Link MI6 to Dossier (30 min)
```bash
cd ~/projects/mi6
# Update README: "Built on Dossier"
# Reference dossier project
git commit -m "Position MI6 as built on universal Dossier standard"
git push
```

---

## Minimal Viable Release

**Just need**:
1. Universal README
2. PROTOCOL.md
3. One example
4. Push to GitHub

**Can add later**:
- Full spec
- More examples
- Schemas
- Tools

---

**Total**: ~2 hours to minimal release
**Result**: Universal dossier standard live!
