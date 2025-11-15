# Issue Submission Guide

This guide helps you quickly create GitHub issues from GITHUB_ISSUES_PROPOSAL.md.

---

## Quick Reference Table

| # | Title | Priority | Category | Effort | Impact |
|---|-------|----------|----------|--------|--------|
| 1 | VS Code Extension for Dossier Files | P0 | tooling, ide | 2-3w | 🔥🔥🔥 |
| 2 | Public Dossier Registry (MVP) | P0 | discovery | 1-2w | 🔥🔥🔥 |
| 3 | "5-Minute Showcase" Example Pack | P0 | examples | 1w | 🔥🔥🔥 |
| 4 | Interactive Quickstart Tutorial | P0 | docs | 3-5d | 🔥🔥🔥 |
| 5 | 2-Minute Demo Video | P0 | marketing | 2-3d | 🔥🔥🔥 |
| 6 | CLI Enhanced User Experience | P1 | tooling | 1w | 🔥🔥 |
| 7 | Public Case Studies & Testimonials | P1 | marketing | 2w | 🔥🔥 |
| 8 | Automated Example Testing in CI | P1 | testing | 1-2w | 🔥🔥 |
| 9 | GitHub Actions Workflow Templates | P1 | integration | 3-5d | 🔥🔥 |
| 10 | Pre-commit Hook Integration | P2 | integration | 2-3d | 🔥 |
| 11 | Dossier Composition (Chain Execution) | P2 | feature | 2-3w | 🔥 |
| 12 | Debugging & Dry-Run Mode | P2 | tooling | 1-2w | 🔥 |
| 13 | Enhanced Documentation Site | P2 | docs | 1-2w | 🔥 |
| 14 | Dossier Linter & Formatter | P2 | tooling | 1w | 🔥 |
| 15 | Web-Based Dossier Playground | P3 | tooling | 1-2w | 💡 |
| 16 | JetBrains IDE Plugin | P3 | tooling | 2-3w | 💡 |
| 17 | Dossier Signing & Key Management UI | P3 | security | 2-3w | 💡 |
| 18 | Telemetry & Analytics (Opt-In) | P3 | metrics | 1w | 💡 |

**Total Effort**: ~21-38 weeks across all issues

---

## Recommended Submission Order

### Phase 1: Quick Wins (Week 1-4)
Submit these first to get momentum:
- Issue #3: 5-Minute Showcase Pack
- Issue #5: 2-Minute Demo Video
- Issue #4: Interactive Quickstart Tutorial
- Issue #6: CLI Enhanced UX

### Phase 2: Core Infrastructure (Week 5-10)
- Issue #1: VS Code Extension
- Issue #2: Public Dossier Registry
- Issue #8: Automated Example Testing

### Phase 3: Community Growth (Week 11-14)
- Issue #7: Public Case Studies
- Issue #9: GitHub Actions Templates
- Issue #13: Enhanced Documentation Site

### Phase 4: Advanced Features (Week 15+)
- Issue #11: Dossier Composition
- Issue #12: Debugging & Dry-Run Mode
- Issue #14: Linter & Formatter
- Issues #15-18: As needed

---

## GitHub Labels to Create

Before submitting issues, create these labels in your GitHub repo:

```bash
# Priority Labels
P0-critical      # Critical adoption blockers (red)
P1-high          # High priority, important for growth (orange)
P2-medium        # Medium priority, nice to have (yellow)
P3-low           # Low priority, future enhancements (green)

# Category Labels
tooling          # CLI, IDE, developer tools (blue)
documentation    # Docs, tutorials, guides (light blue)
examples         # Example dossiers (purple)
community        # Community building, marketing (pink)
security         # Security features (red)
testing          # Testing infrastructure (green)
integration      # CI/CD, IDE, platform integrations (teal)
feature          # New features, enhancements (indigo)
marketing        # Videos, case studies, promotion (magenta)

# Status Labels
needs-discussion # Requires community input before implementation
help-wanted      # Good for external contributors
good-first-issue # Easy entry point for new contributors
in-progress      # Currently being worked on
blocked          # Blocked by external dependency
```

---

## Issue Template

Use this template when creating each issue:

```markdown
## Summary
[One sentence describing the issue]

## Business Motivation
[Why this matters for adoption/growth - copy from proposal]

## User Impact
[How this affects users - copy from proposal]

## Acceptance Criteria
[Checkbox list from proposal]

## Implementation Notes
[Technical guidance from proposal]

## Estimated Effort
[Time estimate from proposal]

## Success Metrics (if applicable)
[How we'll measure success]

## Related Issues
[Link to dependencies or related issues]
```

---

## Bulk Issue Creation Script

You can use GitHub CLI to create issues in bulk:

```bash
#!/bin/bash
# create-issues.sh

# Issue 1: VS Code Extension
gh issue create \
  --title "VS Code Extension for Dossier Files" \
  --label "P0-critical,tooling,ide,help-wanted" \
  --body-file templates/issue-01-vscode.md

# Issue 2: Public Registry
gh issue create \
  --title "Public Dossier Registry (Minimal Viable Version)" \
  --label "P0-critical,discovery,community" \
  --body-file templates/issue-02-registry.md

# Issue 3: 5-Minute Examples
gh issue create \
  --title "\"5-Minute Showcase\" Example Pack" \
  --label "P0-critical,examples,documentation" \
  --body-file templates/issue-03-examples.md

# ... continue for all 18 issues
```

---

## Individual Issue Bodies

I'll create separate markdown files for each issue body that you can use directly.

### Issue 1: VS Code Extension
File: `templates/issue-01-vscode.md`

---

### Issue 2: Public Registry
File: `templates/issue-02-registry.md`

---

[Continue for all 18 issues...]

---

## Milestone Organization

Create these milestones in GitHub:

1. **v1.1 - Adoption Essentials** (Target: 2 months)
   - Issues: #1, #2, #3, #4, #5, #6
   - Goal: Remove all adoption friction

2. **v1.2 - Community Growth** (Target: 4 months)
   - Issues: #7, #8, #9, #10
   - Goal: Build community and credibility

3. **v1.3 - Developer Experience** (Target: 6 months)
   - Issues: #11, #12, #13, #14
   - Goal: Power user features

4. **v2.0 - Ecosystem** (Target: 12 months)
   - Issues: #15, #16, #17, #18
   - Goal: Full ecosystem maturity

---

## Project Board Setup

Create a GitHub Project board with these columns:

1. **Backlog** - All issues not yet prioritized
2. **Ready** - Issues ready to be worked on
3. **In Progress** - Currently being developed
4. **Review** - In code review or testing
5. **Done** - Completed and deployed

Automation:
- New issues → Backlog
- Issues with "in-progress" label → In Progress
- Pull requests linked to issue → Review
- Merged PRs → Done

---

## Community Engagement

For each issue:

1. **Tag appropriate people**
   - IDE experts for Issue #1
   - DevRel for Issues #5, #7
   - Security experts for Issue #17

2. **Add "help-wanted" where appropriate**
   - Issues #3, #9, #10 are great for contributors

3. **Link to discussions**
   - Start discussion for controversial issues
   - Gather feedback before committing

4. **Encourage RFCs**
   - Issue #11 (composition) needs RFC
   - Issue #17 (key management) needs RFC

---

## Next Steps

1. ✅ Review GITHUB_ISSUES_PROPOSAL.md
2. ⬜ Create GitHub labels
3. ⬜ Create milestones
4. ⬜ Submit Phase 1 issues (#3, #5, #4, #6)
5. ⬜ Set up project board
6. ⬜ Announce to community (tweet, discussion post)
7. ⬜ Start working on highest priority issues

---

## Tips

- **Don't submit all 18 at once** - it's overwhelming
- **Start with 4-6 issues** to build momentum
- **Gather feedback** on first batch before continuing
- **Celebrate progress** as issues are completed
- **Update roadmap** to reflect new priorities
- **Share wins** on social media (completed issues)

---

## Questions to Resolve First

Before submitting issues, decide:

1. **Who will work on these?**
   - Internal team size?
   - Budget for contractors?
   - Relying on community contributions?

2. **What's the timeline?**
   - Aggressive (3 months for P0s)?
   - Moderate (6 months for P0s)?
   - Relaxed (12 months for P0s)?

3. **What's the budget?**
   - Self-funded?
   - Grant-funded?
   - Sponsored development?

4. **What's the governance?**
   - Who decides priorities?
   - Who approves RFCs?
   - Who maintains the codebase?

Answer these first to set realistic expectations in the issues.
