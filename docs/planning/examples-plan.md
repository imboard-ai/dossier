# Create Universal Example Dossiers - Implementation Plan

**Goal**: Create 3 comprehensive examples proving Dossier works across different domains

**Time**: 11-13 hours total
**Priority**: MUST-HAVE for 100% production-ready

---

## Example 1: ML Training Pipeline (3.5-4 hours)

### File
`examples/data-science/train-ml-model.md`

### What to Prove
- Computational workflows (not just deployment)
- Data validation and quality
- Python ecosystem
- Iterative experimentation
- Artifact management

### Key Sections

**Context Detection** should check for:
- Python version, venv status
- Dataset files (CSV/JSON/parquet)
- ML library (scikit-learn/TensorFlow/PyTorch)
- Existing models/experiments
- Jupyter notebooks vs scripts

**Decision Trees**:
- Which ML framework? (detect or recommend scikit-learn)
- Train/test split? (80/20 default)
- Model type? (based on data: classification/regression)
- Hyperparameter tuning? (grid search default)

**Workflow** (7 steps):
1. Setup Python venv + install requirements
2. Load and validate data
3. Preprocess and split train/test
4. Train model with progress tracking
5. Evaluate (metrics, confusion matrix)
6. Save artifacts (model, scaler, metrics)
7. Generate experiment log

**Must Include**:
- Actual Python code snippets
- Real sklearn/pandas examples
- Sample requirements.txt
- Metrics output example
- Model file structure

**Demonstrates**: Data-centric, local computation, statistical validation

---

## Example 2: Database Migration (4-5 hours)

### File
`examples/database/migrate-schema.md`

### What to Prove
- High-risk stateful operations
- ACID transaction workflows
- Multiple database types
- Robust rollback
- Data integrity validation

### Key Sections

**Context Detection** for:
- Database type (PostgreSQL/MySQL/MongoDB/SQLite)
- Connection credentials
- Current schema version
- Migration files or ORM models
- Backup availability

**Decision Trees**:
- Migration strategy? (SQL scripts vs ORM)
- Backup first? (ALWAYS yes for production)
- Dry-run? (recommended)
- Rollback if fails? (automatic)
- Environment? (staging vs production)

**Workflow** (6 critical steps):
1. Pre-migration validation (connectivity, permissions)
2. Create timestamped backup
3. Dry-run in transaction (test migration)
4. Execute migration (begin transaction → migrate → commit)
5. Post-migration validation (test queries, check integrity)
6. Document migration + rollback procedure

**Must Include**:
- Real SQL migration examples (ALTER TABLE, CREATE INDEX)
- Actual backup commands (pg_dump, mysqldump)
- Transaction examples (BEGIN, COMMIT, ROLLBACK)
- Validation queries
- Rollback script example

**Demonstrates**: Stateful operations, ACID transactions, critical data safety

---

## Example 3: React Component Library (3-3.5 hours)

### File
`examples/development/setup-react-library.md`

### What to Prove
- Development tooling (not ops)
- NPM publishing workflow
- Frontend ecosystem
- Multi-tool configuration
- Build optimization

### Key Sections

**Context Detection** for:
- Existing package.json?
- React version (if exists)
- TypeScript vs JavaScript
- Build tools (Vite/Rollup/Webpack)
- Test framework
- CSS approach

**Decision Trees**:
- Library structure? (flat vs categorized)
- Bundler? (Vite recommended)
- TypeScript strict? (yes recommended)
- Storybook addons? (a11y, docs, controls)
- CSS solution? (styled-components default)
- Publishing? (npm vs GitHub Packages)

**Workflow** (7 steps):
1. Create component library structure
2. Configure bundler (Vite or Rollup)
3. Setup TypeScript strict mode
4. Install and configure Storybook
5. Setup testing (Vitest + Testing Library)
6. Configure package.json for publishing
7. Create example components with stories

**Must Include**:
- Real package.json for library
- Actual tsconfig.json (strict)
- Vite config example
- Storybook configuration (.storybook/main.ts)
- Example Button component + story + test
- Build output structure (dist/ with .d.ts)

**Demonstrates**: Frontend tooling, NPM ecosystem, multi-tool integration

---

## Implementation Checklist

### For Each Example Dossier:

- [ ] Follow dossier-template.md structure
- [ ] Include comprehensive metadata
- [ ] Add real, executable code examples
- [ ] Show actual file structures (before/after)
- [ ] Include 3+ troubleshooting scenarios
- [ ] Demonstrate protocol compliance (self-improvement note)
- [ ] Add validation commands that actually work
- [ ] Show expected outputs (metrics, files, logs)
- [ ] Make LLM-executable (test with Claude if possible)

---

## Quality Checklist

### Before Committing Each Example:

- [ ] Can an LLM follow this and succeed?
- [ ] Are all commands actually executable?
- [ ] Are code examples real (not placeholder)?
- [ ] Does it clearly differ from other examples?
- [ ] Does it prove dossiers work in this domain?
- [ ] Is it self-contained (no external dossier dependencies)?
- [ ] Does it follow PROTOCOL.md?
- [ ] Are edge cases covered?

---

## After All 3 Examples Complete

**Update dossier/README.md**:
- Add examples section showcasing all 4
- Show domain diversity
- Link to each example

**Dossier is 100% Production-Ready**:
- Proven universal across 4+ domains
- Clear specification
- Working examples
- Ready for community adoption

---

**Start with**: ML Training Pipeline (most different from existing AWS example)
**Then**: Database Migration (highest risk = best safety demonstration)
**Finally**: React Library (completes the picture)
