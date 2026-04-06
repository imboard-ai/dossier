---
name: pm-business-context
description: "Loads imboard business context (ICP, positioning, stage, constraints) before any PM framework or business analysis. Auto-enabled with PM skill toggles, or enable standalone with /pm-context-on."
---

# Business Context Preamble

Before applying any PM framework, business analysis, or product decision skill, you MUST first load the business context:

1. **Read the brief**: `/home/yuvaldim/manna-instances/imboard/strategy/brief.md`
2. **Use the brief** as baseline context for all analysis, feature evaluation, and product decisions
3. **Consult the document registry** at the bottom of the brief when deeper context is needed — load only the specific doc referenced, not all of them
4. If the brief's generation date is more than 30 days old, mention this to the user and suggest running `/pm-context-refresh`

This ensures every framework operates with imboard's real ICP, constraints, stage, and strategy — not generic startup assumptions.
