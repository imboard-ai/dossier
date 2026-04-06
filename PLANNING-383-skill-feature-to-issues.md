# Issue #383: Skill: /feature-to-issues — multi-agent feature development pipeline

## Problem

No automated path from a problem signal to a complete set of GH issues with PRD, FE spec, wireframes, and dependency chain. The existing `guided-cycle-issue` / `full-cycle-issue` workflows operate on existing GH issues. This dossier works upstream — it produces the GH issues and all supporting artifacts.

## Approach

Created a **project-agnostic dossier** (`feature-to-issues.ds.md`) + **thin skill wrapper** (`SKILL.md`) that orchestrate 3 agent personas through 10 stages. Early stages are conversation-driven (PM interviews founder), later stages are structured/autonomous.

## Files Created

1. `examples/workflows/feature-to-issues.ds.md` — Main dossier (10 stages, inline gap-handling, state persistence)
2. `~/.claude/skills/feature-to-issues-skill/SKILL.md` — Skill wrapper (trigger phrases, flag parsing, prerequisites)

## Key Design Decisions

- **Early stages are interviews, not checkpoints** — PM agent acts as skilled PM, no fixed cycle count
- **PM agent pushes back** — evaluates value/impact/feasibility, recommends splitting large PRDs
- **State persisted via files** — STATUS.md tracks stage progress, all artifacts have YAML headers for resumability
- **Gaps handled inline** — data model assessment, issue decomposition, post-implementation review are inline instructions
- **UX/FE uses existing skills** — ux-advisor + visual-design-review + pmf-storyboard
- **Delegates to existing cycles** — implementation uses guided-cycle or full-cycle, not custom logic
- **Review loop** — compares implementation vs PRD, creates new issues for gaps, max 3 iterations

## Visual Review

- [x] Not required (dossier/skill files, no FE changes)

## Base Branch

`main`
