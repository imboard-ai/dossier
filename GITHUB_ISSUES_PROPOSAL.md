# GitHub Issues Proposal for Dossier Project

**Generated**: 2025-11-13
**Focus**: User Adoption & Community Growth
**Total Issues**: 18

---

## 🔥 Critical Priority: User-Facing Adoption Blockers

These issues directly impact first-time user experience and adoption. Every hour delay costs potential users.

---

### Issue 1: VS Code Extension for Dossier Files
**Category**: `tooling`, `ide`, `developer-experience`
**Priority**: P0 (Critical)

**Business Motivation**:
Most developers use VS Code (73% market share). Without IDE support, dossiers feel like plain text files - no validation, no autocomplete, no instant feedback. This creates friction for adoption.

**User Impact**:
- First-time authors struggle with dossier syntax
- No immediate feedback on schema errors
- Manual schema validation slows iteration
- Competing with tools that have IDE support

**Acceptance Criteria**:
- [ ] Syntax highlighting for `.ds.md` and `.dsw.md` files
- [ ] JSON schema validation with inline error messages
- [ ] Autocomplete for metadata fields (version, protocol_version, status, etc.)
- [ ] Snippet library for common dossier patterns
- [ ] Command palette integration: "Create New Dossier from Template"
- [ ] Preview mode showing parsed metadata
- [ ] Link to schema documentation on hover

**Nice-to-Have**:
- [ ] One-click schema validation
- [ ] Risk level indicator in file icon
- [ ] Quick actions for signing/verifying

**Implementation Notes**:
- Use Language Server Protocol (LSP) for validation
- Leverage existing `dossier-schema.json`
- Publish to VS Code marketplace as `@dossier/vscode`
- Reference: [VS Code Extension Guide](https://code.visualstudio.com/api)

**Estimated Effort**: 2-3 weeks (1 engineer)

---

### Issue 2: Public Dossier Registry (Minimal Viable Version)
**Category**: `discovery`, `community`, `adoption`
**Priority**: P0 (Critical)

**Business Motivation**:
Without discovery, dossiers are isolated. Users can't find, share, or rate community dossiers. This kills network effects and community growth. Compare to Docker Hub, npm registry - discovery is essential for ecosystem growth.

**User Impact**:
- "Where do I find dossiers for X?" - no good answer today
- Can't discover best practices from community
- No way to share dossiers beyond GitHub links
- Missing viral loop: "I found this amazing dossier..."

**Acceptance Criteria (MVP)**:
- [ ] Static website at `registry.dossier.dev` or similar
- [ ] Browse all community dossiers with filters:
  - [ ] By category (devops, database, development, etc.)
  - [ ] By risk level (low/medium/high/critical)
  - [ ] By estimated duration (<5min, <15min, <30min, 1hr+)
  - [ ] By tags
- [ ] Search by keywords in title/description
- [ ] Each dossier page shows:
  - [ ] Full metadata (author, version, tools_required)
  - [ ] Description and objective
  - [ ] "Copy URL" button for direct use
  - [ ] View source link to GitHub
- [ ] Submission process: PR to `registry/` folder in repo
- [ ] Auto-deploy via GitHub Actions

**Explicitly Out of Scope (for MVP)**:
- User accounts / auth
- Ratings / comments
- Upload UI (use PRs for now)
- Analytics / usage tracking

**Implementation Notes**:
- Use static site generator (Astro, Next.js, or Hugo)
- Host on Vercel/Netlify (free tier)
- Registry data: JSON files in `/registry` folder
- CI validates schema on PR
- Auto-deploy on merge to main

**Estimated Effort**: 1-2 weeks (1 engineer)

**Success Metrics**:
- 50+ dossiers listed within 3 months
- 500+ monthly visitors within 6 months

---

### Issue 3: "5-Minute Showcase" Example Pack
**Category**: `examples`, `documentation`, `onboarding`
**Priority**: P0 (Critical)

**Business Motivation**:
Current examples are too ambitious (10-15 min claims that likely take 30+ min). New users need instant gratification - quick wins that prove value in <5 actual minutes. This is the "aha moment" that drives adoption.

**User Impact**:
- First-time users get discouraged by complex examples
- Can't quickly validate if dossier solves their problem
- Missing "wow" moment that drives word-of-mouth

**Acceptance Criteria**:
Create 5 new dossiers that truly run in <5 minutes, tested on real projects:

1. **`check-package-updates.ds.md`** (~2 min)
   - Scan package.json for outdated dependencies
   - Generate update commands
   - Output: Markdown report with recommendations
   - Risk: Low (read-only)

2. **`audit-gitignore.ds.md`** (~3 min)
   - Check for common missing patterns (.env, node_modules, .DS_Store)
   - Detect ignored files accidentally committed
   - Output: Recommendations for .gitignore fixes
   - Risk: Low (read-only)

3. **`generate-changelog.ds.md`** (~4 min)
   - Parse git commits since last tag
   - Group by type (feat/fix/docs)
   - Generate CHANGELOG.md section
   - Risk: Low (creates one file)

4. **`docker-health-check.ds.md`** (~3 min)
   - Verify Dockerfile best practices
   - Check for security issues (running as root, exposed secrets)
   - Output: Security report
   - Risk: Low (read-only)

5. **`api-response-validator.ds.md`** (~4 min)
   - Given OpenAPI spec, generate test requests
   - Validate responses match schema
   - Output: Validation report
   - Risk: Low (read-only, requires running API)

**Quality Bar**:
- [ ] Tested on 3+ real projects (not toy examples)
- [ ] Actual execution time <5 min (measured)
- [ ] Clear, focused objective (one thing done well)
- [ ] Output is immediately useful (copy-paste ready)
- [ ] Error handling for edge cases
- [ ] Troubleshooting section

**Promotion Strategy**:
- Featured in README "Try it Now" section
- Tweet thread: "5 things you can automate in 5 minutes"
- Blog post: "Dossier quick wins"

**Estimated Effort**: 1 week (1 engineer)

---

### Issue 4: Interactive Quickstart Tutorial
**Category**: `documentation`, `onboarding`
**Priority**: P0 (Critical)

**Business Motivation**:
QUICK_START.md is good but passive. Users learn by doing. An interactive tutorial guides them through creating and running their first dossier in <10 minutes - this builds confidence and reduces drop-off.

**User Impact**:
- Passive docs lead to "I'll read it later" (never)
- No guided first success
- Higher activation cost
- Competing with tools that have interactive onboarding

**Acceptance Criteria**:
Create interactive tutorial (choose format):

**Option A: Interactive Dossier** (`examples/tutorials/first-dossier.ds.md`)
- User runs: `"Execute the first-dossier tutorial"`
- Dossier guides them step-by-step:
  1. Explains what dossiers are (30 seconds)
  2. Creates a simple dossier together (2 min)
  3. Runs it and validates success (1 min)
  4. Shows how to modify it (2 min)
  5. Points to next steps
- Self-contained, no external dependencies

**Option B: Web-Based Tutorial** (tutorial.dossier.dev)
- Interactive code editor
- Live preview of dossier execution
- Step-by-step guidance with progress bar
- Can export created dossier

**Recommended**: Option A (lower cost, dogfooding)

**Success Metrics**:
- 80% of users who start complete it
- <10 minutes average completion time
- "I built my first dossier!" sentiment

**Estimated Effort**: 3-5 days (1 engineer)

---

### Issue 5: 2-Minute Demo Video
**Category**: `marketing`, `documentation`, `adoption`
**Priority**: P0 (Critical)

**Business Motivation**:
Video is 10x more engaging than text. Most users won't read 1,000+ line README. A 2-minute video showing "problem → solution → value" is the fastest way to communicate value. This is what gets shared on Twitter, LinkedIn, HN.

**User Impact**:
- Text-heavy docs scare away visual learners
- Can't quickly share Dossier with colleagues
- Missing "aha moment" visualization
- Competing with tools that have slick demos

**Acceptance Criteria**:
- [ ] 2-minute video showing:
  - [ ] Problem: Brittle script failing on edge case (15 sec)
  - [ ] Solution: Same workflow as dossier, adapts to edge case (30 sec)
  - [ ] Live demo: Run a simple dossier (45 sec)
  - [ ] Value prop: "Works with any LLM, verified, portable" (15 sec)
  - [ ] Call to action: Try 5-minute example (15 sec)
- [ ] Professional quality (screencast + narration)
- [ ] Embedded in README (top section)
- [ ] Uploaded to YouTube + GitHub
- [ ] Closed captions for accessibility

**Script Outline**:
```
0:00 - Hook: "Shell scripts break. Dossiers adapt."
0:15 - Show real broken script (missing directory)
0:30 - Show dossier handling same situation intelligently
1:00 - Quick demo: "Run deploy-to-aws dossier"
1:45 - Show verification, safety features
2:00 - CTA: "Try your first dossier in 5 minutes"
```

**Tools**:
- Screencast: OBS Studio or ScreenFlow
- Editing: DaVinci Resolve (free) or Final Cut Pro
- Narration: Professional voiceover or founder voice

**Estimated Effort**: 2-3 days (1 person, includes scripting, recording, editing)

---

### Issue 6: CLI Enhanced User Experience
**Category**: `tooling`, `cli`, `developer-experience`
**Priority**: P1 (High)

**Business Motivation**:
Current CLI only verifies. Users need a complete tool: run dossiers with enforced verification, dry-run mode, better errors. This makes CLI the "safe way" to use dossiers, reducing security concerns that block adoption.

**User Impact**:
- Can't run dossiers from CLI today (only verify)
- No dry-run mode to preview changes
- Error messages not actionable
- Missing "trusted path" for security-conscious users

**Acceptance Criteria**:

**New Commands**:
```bash
# Verify and run with enforced checks
dossier run https://example.com/dossier.ds.md

# Dry-run mode (show what would happen)
dossier run --dry-run ./deploy.ds.md

# Verify only (existing)
dossier verify ./deploy.ds.md

# Describe dossier metadata
dossier inspect ./deploy.ds.md

# Initialize new dossier from template
dossier init my-workflow
```

**Improved UX**:
- [ ] Colorized output (green/red for success/failure)
- [ ] Progress indicators for long operations
- [ ] Clear error messages with suggestions:
  ```
  ❌ Checksum verification failed

  Expected: abc123...
  Actual:   def456...

  Possible causes:
  - File was modified after checksum was generated
  - Download was corrupted
  - Malicious tampering

  Fix: Re-download from trusted source or regenerate checksum
  ```
- [ ] Risk level warnings:
  ```
  ⚠️  HIGH RISK DOSSIER

  This dossier will:
  - Modify cloud infrastructure (AWS)
  - Delete existing resources
  - Require AWS credentials

  Continue? [y/N]
  ```

**Estimated Effort**: 1 week (1 engineer)

---

## 💡 High Priority: Community & Growth

These issues build community and credibility, indirectly driving adoption.

---

### Issue 7: Public Case Studies & Testimonials
**Category**: `marketing`, `community`, `credibility`
**Priority**: P1 (High)

**Business Motivation**:
"15+ production examples" is claimed but unverified. Real case studies build trust and provide social proof. This answers "Who else uses this?" and "Does it actually work?" - critical for enterprise adoption.

**User Impact**:
- Can't convince manager without real-world proof
- Missing validation that dossiers work at scale
- No reference points for "how others use this"

**Acceptance Criteria**:
Document 3-5 real-world case studies:

**Format** (case-studies/company-name.md):
```markdown
# Case Study: [Company Name]

**Company**: [Size, Industry]
**Use Case**: [What they automated]
**Results**: [Metrics: time saved, errors reduced, etc.]
**Quote**: "[Testimonial from user]"

## The Problem
[What they were doing before]

## The Solution
[Which dossiers they use, how they're customized]

## The Results
- Reduced deployment time from X to Y
- Eliminated Z% of configuration errors
- Saved N hours per week

## Key Takeaways
[Lessons learned, tips for others]
```

**Outreach Strategy**:
1. Contact early adopters (GitHub stars, Twitter mentions)
2. Offer to write case study for them (low effort for them)
3. Review cycle: draft → approval → publish
4. Promotion: Tweet, blog post, newsletter

**Target Profiles**:
- Solo dev who automated their workflow
- OSS project using dossiers for contributors
- Startup using dossiers for deployments
- Enterprise team (if possible)

**Estimated Effort**: 2 weeks (outreach + writing + reviews)

---

### Issue 8: Automated Example Testing in CI
**Category**: `testing`, `reliability`, `maintenance`
**Priority**: P1 (High)

**Business Motivation**:
Example dossiers are the primary way users learn. If examples break, trust erodes. Automated testing ensures examples stay functional, reducing maintenance burden and building confidence.

**User Impact**:
- Broken examples waste user time
- Reduces trust in the project
- Users don't know if problem is them or the example

**Acceptance Criteria**:
- [ ] GitHub Actions workflow tests all examples weekly
- [ ] Each example has test criteria:
  ```yaml
  # tests/example-tests.yml
  tests:
    - dossier: examples/data-science/train-ml-model.ds.md
      environment: python:3.11
      fixtures: tests/fixtures/sample-data.csv
      expect_files:
        - model.pkl
        - experiment_log.json
      expect_no_errors: true
      max_duration: 600s # 10 minutes
  ```
- [ ] Test runner validates:
  - [ ] Dossier schema is valid
  - [ ] Checksum matches content
  - [ ] Required tools are available
  - [ ] Expected outputs are created
  - [ ] No errors in execution
- [ ] Failures create GitHub issue automatically
- [ ] Status badge in README: "Examples: Passing"

**Implementation Notes**:
- Use Docker for isolated test environments
- Mock external dependencies (AWS, databases) where needed
- Run subset in PR (fast smoke tests), full suite weekly

**Estimated Effort**: 1-2 weeks (1 engineer)

---

### Issue 9: GitHub Actions Workflow Templates
**Category**: `integration`, `ci-cd`, `adoption`
**Priority**: P1 (High)

**Business Motivation**:
CI/CD integration is table stakes for DevOps tools. GitHub Actions templates make it trivial to add dossiers to existing workflows - reducing integration friction and expanding use cases.

**User Impact**:
- Users don't know how to use dossiers in CI/CD
- Missing obvious use case: PR checks, deployments
- Competing tools have CI integrations

**Acceptance Criteria**:
Create 3-5 reusable workflow templates:

1. **`verify-dossiers-on-pr.yml`**
   - Runs on every PR
   - Verifies all `.ds.md` files in repo
   - Checks schema validity, checksums
   - Blocks merge if verification fails

2. **`run-readme-check-weekly.yml`**
   - Runs readme-reality-check dossier weekly
   - Creates issue if gaps found
   - Example of scheduled dossier execution

3. **`deploy-with-dossier.yml`**
   - Runs deployment dossier on push to main
   - Shows environment variable passing
   - Includes rollback on failure

4. **`validate-config-changes.yml`**
   - Runs when config files change
   - Uses validation dossier to check correctness
   - Comments on PR with results

**Documentation**:
- [ ] How to use each template
- [ ] How to customize for your project
- [ ] Troubleshooting guide

**Placement**:
- Store in `.github/workflows/templates/`
- Document in `docs/ci-cd-integration.md`
- Link from README

**Estimated Effort**: 3-5 days (1 engineer)

---

### Issue 10: Pre-commit Hook Integration
**Category**: `integration`, `developer-experience`, `quality`
**Priority**: P2 (Medium)

**Business Motivation**:
Pre-commit hooks catch issues before they reach CI, speeding up development. Dossier validation at commit time prevents broken dossiers from being committed - maintaining quality at the source.

**User Impact**:
- Users commit broken dossiers, discover in CI
- Slower feedback loop
- Missing quality gate

**Acceptance Criteria**:
- [ ] Pre-commit hook config: `.pre-commit-config.yaml`
  ```yaml
  repos:
    - repo: https://github.com/imboard-ai/dossier
      rev: v1.0.0
      hooks:
        - id: validate-dossiers
          name: Validate Dossier Schema
          entry: dossier-verify
          language: node
          files: \.ds\.md$|\.dsw\.md$

        - id: verify-checksums
          name: Verify Dossier Checksums
          entry: dossier-verify --checksums
          language: node
          files: \.ds\.md$|\.dsw\.md$
  ```
- [ ] Documentation: `docs/pre-commit-hooks.md`
- [ ] Auto-setup script: `scripts/setup-pre-commit.sh`

**Estimated Effort**: 2-3 days (1 engineer)

---

## 🔧 Medium Priority: Developer Experience

Important for power users and contributors, but not blocking initial adoption.

---

### Issue 11: Dossier Composition (Chain Execution)
**Category**: `feature`, `core`, `protocol`
**Priority**: P2 (Medium)

**Business Motivation**:
Many workflows are multi-step: setup → deploy → verify. Users want to run them as a suite, not manually one-by-one. Composition unlocks complex automation and is frequently requested.

**User Impact**:
- Can't automate multi-dossier workflows
- Manual chaining is error-prone
- Missing key value proposition vs scripts

**Acceptance Criteria**:
- [ ] Define composition syntax in schema:
  ```yaml
  composition:
    execute_in_order:
      - dossier: setup-infrastructure.ds.md
        on_failure: abort
      - dossier: deploy-application.ds.md
        on_failure: rollback
        rollback_dossier: rollback-deployment.ds.md
      - dossier: verify-deployment.ds.md
        on_failure: alert
  ```
- [ ] CLI support: `dossier run --compose workflow.yml`
- [ ] Handle dependencies from schema `preceded_by` / `followed_by`
- [ ] Pass outputs between dossiers (environment variables)
- [ ] Rollback on failure
- [ ] Parallel execution for independent dossiers

**Protocol Changes**:
- Requires Dossier Protocol v1.1
- Backward compatible (composition is optional)

**Estimated Effort**: 2-3 weeks (1 engineer)

---

### Issue 12: Debugging & Dry-Run Mode
**Category**: `tooling`, `developer-experience`
**Priority**: P2 (Medium)

**Business Motivation**:
Users are cautious about running automation they don't fully understand. Dry-run shows what would happen without executing - building confidence and catching issues early.

**User Impact**:
- Can't preview dossier actions safely
- Trial and error on real systems
- Slows iteration and experimentation

**Acceptance Criteria**:
- [ ] `--dry-run` flag for CLI and MCP server
- [ ] Shows:
  - [ ] What files would be created/modified/deleted
  - [ ] What commands would be executed
  - [ ] What API calls would be made
  - [ ] What environment variables would be read
- [ ] Color-coded output:
  - Green: Safe (read-only)
  - Yellow: Modifies local files
  - Red: Modifies remote resources (cloud, databases)
- [ ] Estimated risk score (0-100)
- [ ] Can generate "execution plan" file for review

**Example Output**:
```
Dry-Run: deploy-to-aws.ds.md

Would execute:
  ✓ Read AWS credentials from ~/.aws/credentials
  ⚠ Modify infrastructure in us-east-1
  ⚠ Create ECS cluster "production-app"
  ⚠ Update IAM role "app-execution-role"
  ✓ Generate deployment report

Files that would be created:
  - deployment-log.json
  - terraform.tfstate

Commands that would run:
  1. terraform plan -out=tfplan
  2. terraform apply tfplan
  3. aws ecs update-service --cluster production

Risk Score: 78/100 (High)
Reason: Modifies production cloud infrastructure

Proceed with actual execution? [y/N]
```

**Estimated Effort**: 1-2 weeks (1 engineer)

---

### Issue 13: Enhanced Documentation Site
**Category**: `documentation`, `website`
**Priority**: P2 (Medium)

**Business Motivation**:
Current docs are GitHub markdown - good for developers, but not polished for broader audience. A dedicated docs site improves professionalism and SEO, driving organic discovery.

**User Impact**:
- GitHub markdown is hard to navigate
- No search functionality
- Not mobile-friendly
- Looks less professional than competitors

**Acceptance Criteria**:
- [ ] Static docs site at `docs.dossier.dev`
- [ ] Sections:
  - [ ] Introduction & Quick Start
  - [ ] Core Concepts
  - [ ] Specification & Protocol
  - [ ] Examples & Tutorials
  - [ ] Security Model
  - [ ] Integrations (MCP, CLI, IDE)
  - [ ] API Reference
  - [ ] FAQ
  - [ ] Community & Contributing
- [ ] Features:
  - [ ] Full-text search
  - [ ] Version dropdown (current + legacy)
  - [ ] Dark mode
  - [ ] Mobile responsive
  - [ ] Copy code buttons
  - [ ] "Edit on GitHub" links
- [ ] SEO optimized
- [ ] Analytics (Plausible or similar, privacy-friendly)

**Tech Stack**:
- Docusaurus, VitePress, or Astro Starlight
- Deploy: Vercel or Netlify
- Search: Built-in or Algolia DocSearch

**Estimated Effort**: 1-2 weeks (1 engineer)

---

### Issue 14: Dossier Linter & Formatter
**Category**: `tooling`, `quality`
**Priority**: P2 (Medium)

**Business Motivation**:
Consistent style improves readability and professionalism. A linter catches common mistakes early. This is expected tooling for any serious standard.

**User Impact**:
- Inconsistent dossier formatting
- Common mistakes not caught until execution
- Manual style enforcement

**Acceptance Criteria**:

**Linter** (`dossier lint`):
- [ ] Checks:
  - [ ] Schema validity
  - [ ] Required sections present
  - [ ] Checksum matches content
  - [ ] Version follows semver
  - [ ] Objective is clear and measurable
  - [ ] Success criteria are testable
  - [ ] Risk level matches destructive_operations
  - [ ] Tools in tools_required have check_command
  - [ ] Links are valid (not 404)
  - [ ] Markdown syntax is valid
- [ ] Configurable rules: `.dossierrc.json`
- [ ] Exit code 0 = pass, 1 = warnings, 2 = errors

**Formatter** (`dossier format`):
- [ ] Formats:
  - [ ] Consistent heading levels
  - [ ] Alphabetize metadata fields
  - [ ] Indent JSON frontmatter
  - [ ] Normalize bullet points and lists
  - [ ] Trim trailing whitespace
- [ ] Preserves checksums (updates them automatically)
- [ ] Flag: `--check` to verify without modifying

**Integration**:
- [ ] Pre-commit hook
- [ ] CI/CD check
- [ ] VS Code extension integration

**Estimated Effort**: 1 week (1 engineer)

---

## 🚀 Lower Priority: Future Enhancements

Important but can wait until core adoption is established.

---

### Issue 15: Web-Based Dossier Playground
**Category**: `tooling`, `education`, `adoption`
**Priority**: P3 (Lower)

**Business Motivation**:
Remove all barriers to trying dossiers. Web playground lets users create, edit, and validate dossiers in browser - no installation required. This is the ultimate low-friction entry point.

**User Impact**:
- Zero setup required to try dossiers
- Learn by experimentation
- Share dossiers via URL

**Acceptance Criteria**:
- [ ] Web app at `playground.dossier.dev`
- [ ] Features:
  - [ ] Monaco editor (VS Code in browser)
  - [ ] Live schema validation
  - [ ] Metadata preview panel
  - [ ] Example dossier templates (dropdown)
  - [ ] "Share" button (generates URL)
  - [ ] "Export" button (download .ds.md)
  - [ ] Checksum calculator
  - [ ] Risk level indicator
- [ ] No backend required (pure client-side)
- [ ] Mobile responsive

**Tech Stack**:
- React/Vue/Svelte
- Monaco Editor
- Dossier schema validator
- Deploy: Static hosting

**Estimated Effort**: 1-2 weeks (1 engineer)

---

### Issue 16: JetBrains IDE Plugin (IntelliJ, PyCharm, WebStorm)
**Category**: `tooling`, `ide`
**Priority**: P3 (Lower)

**Business Motivation**:
After VS Code, JetBrains IDEs are next most popular (20-30% of developers). Supporting them expands reach, especially in enterprise/Java/Python communities.

**User Impact**:
- JetBrains users feel like second-class citizens
- Missing features they expect in their IDE
- Limits adoption in JetBrains-heavy orgs

**Acceptance Criteria**:
- [ ] Plugin for IntelliJ Platform (supports IntelliJ, PyCharm, WebStorm, etc.)
- [ ] Features (parity with VS Code extension):
  - [ ] Syntax highlighting
  - [ ] Schema validation
  - [ ] Autocomplete
  - [ ] Snippets
  - [ ] Commands (create, validate, sign)
- [ ] Published to JetBrains Plugin Marketplace

**Estimated Effort**: 2-3 weeks (1 engineer with JetBrains experience)

---

### Issue 17: Dossier Signing & Key Management UI
**Category**: `security`, `tooling`
**Priority**: P3 (Lower)

**Business Motivation**:
Current signing process is CLI-based and manual. A UI makes it accessible to non-technical authors and streamlines key management - removing friction for dossier creators.

**User Impact**:
- CLI-only signing intimidates non-technical users
- Key management is manual and error-prone
- Hard to rotate keys or manage team keys

**Acceptance Criteria**:

**Web UI** (`sign.dossier.dev`):
- [ ] Upload dossier file
- [ ] Generate or import signing key
- [ ] Sign dossier (updates checksum + adds signature)
- [ ] Download signed dossier
- [ ] Key management:
  - [ ] List keys
  - [ ] Generate new key
  - [ ] Revoke key
  - [ ] Export public key
- [ ] Team features:
  - [ ] Shared team keys
  - [ ] Signing logs (who signed what, when)

**Security Requirements**:
- [ ] Keys never leave user's browser (client-side crypto)
- [ ] Optional: Integration with hardware security keys (YubiKey)
- [ ] Optional: Integration with cloud KMS (AWS, GCP, Azure)

**Estimated Effort**: 2-3 weeks (1 engineer)

---

### Issue 18: Telemetry & Analytics (Opt-In)
**Category**: `metrics`, `product`, `community`
**Priority**: P3 (Lower)

**Business Motivation**:
Without usage data, we're flying blind. Opt-in telemetry helps understand:
- Which features are used
- Where users get stuck
- Which examples are popular
- Performance issues

**User Impact**:
- Better prioritization of features
- Proactive bug fixes
- Improved documentation based on real usage

**Acceptance Criteria**:
- [ ] Opt-in only (explicit consent, default OFF)
- [ ] Respects DNT (Do Not Track) header
- [ ] Privacy-preserving:
  - [ ] No PII collected
  - [ ] No dossier content collected
  - [ ] Anonymized project IDs
- [ ] Metrics collected:
  - [ ] Dossier executions (success/failure counts)
  - [ ] Execution duration
  - [ ] Schema version usage
  - [ ] Tool usage (CLI, MCP server)
  - [ ] Error types (schema validation, checksum failure, etc.)
- [ ] Configuration: `~/.dossier/config.json`
  ```json
  {
    "telemetry": {
      "enabled": false,
      "endpoint": "https://telemetry.dossier.dev"
    }
  }
  ```
- [ ] Public dashboard showing aggregate metrics
- [ ] Data retention: 90 days

**Privacy Requirements**:
- [ ] Open source telemetry code
- [ ] Clear privacy policy
- [ ] Easy opt-out
- [ ] GDPR compliant

**Estimated Effort**: 1 week (1 engineer)

---

## 📊 Summary

**Total Issues**: 18

**By Priority**:
- **P0 (Critical)**: 6 issues - User-facing adoption blockers
- **P1 (High)**: 5 issues - Community & growth
- **P2 (Medium)**: 4 issues - Developer experience
- **P3 (Lower)**: 3 issues - Future enhancements

**By Category**:
- Tooling: 7 issues
- Documentation: 4 issues
- Community: 3 issues
- Security: 2 issues
- Testing: 1 issue
- Integration: 1 issue

**Estimated Total Effort**:
- P0: 6-10 weeks (1-2 engineers)
- P1: 5-7 weeks (1-2 engineers)
- P2: 5-8 weeks (1 engineer)
- P3: 5-9 weeks (1 engineer)

**Recommended First Sprint (4 weeks, 2 engineers)**:
1. Issue 3: 5-Minute Showcase Pack (1 week)
2. Issue 5: 2-Minute Demo Video (3 days)
3. Issue 1: VS Code Extension (2 weeks)
4. Issue 2: Public Registry MVP (2 weeks)
5. Issue 6: CLI Enhanced UX (1 week)

This delivers maximum adoption impact in shortest time.

---

## 🎯 Next Steps

1. Review and prioritize issues
2. Refine scope and acceptance criteria
3. Create GitHub issues with labels
4. Assign to milestones
5. Start with P0 issues
6. Measure adoption metrics after each release

**Success Metrics to Track**:
- GitHub stars growth rate
- Weekly active dossier executions
- Community dossier contributions
- Time to first successful dossier (new users)
- Documentation search queries
- VS Code extension installs
