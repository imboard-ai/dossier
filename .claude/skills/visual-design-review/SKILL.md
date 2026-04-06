---
name: visual-design-review
description: Review existing UI code for visual design quality. Evaluates typography, color, motion, spatial composition, and visual polish — scoring against aesthetic principles adapted from the frontend-design skill.
---

This skill guides **review** of existing frontend interfaces for visual design quality. It complements UX/usability reviews by evaluating aesthetics — how beautiful, intentional, and polished the UI feels.

When reviewing a page or component, evaluate against these five dimensions:

## 1. Typography (0-10)
- Are font choices distinctive and intentional, or generic defaults (Inter, Roboto, Arial, system fonts)?
- Is there a clear typographic hierarchy (display, heading, body, caption)?
- Do font pairings create character — a distinctive display font with a refined body font?
- Are font sizes, weights, and line heights tuned with care?

## 2. Color & Theme (0-10)
- Is there a cohesive color system with CSS variables?
- Does the palette have personality — dominant colors with sharp accents, not timid even distribution?
- Are the color choices context-appropriate (e.g., fintech ≠ playful toy app)?
- Does it avoid cliched AI-generated schemes (purple gradients on white)?

## 3. Motion & Micro-interactions (0-10)
- Are there meaningful transitions and animations, or is everything static?
- Do high-impact moments (page load, state changes) have orchestrated reveals?
- Are hover states, focus states, and interactive feedback thoughtful?
- Is motion used with restraint where the design calls for it?

## 4. Spatial Composition & Layout (0-10)
- Is the layout intentional — does it use space, alignment, and rhythm deliberately?
- Is there any spatial personality (asymmetry, overlap, grid-breaking elements, generous whitespace)?
- Or is it a predictable, cookie-cutter component stack with no compositional thought?
- Does the density match the content type (data-dense dashboards vs. airy landing pages)?

## 5. Visual Polish & Atmosphere (0-10)
- Are there background treatments, textures, or depth beyond flat solid colors?
- Do shadows, borders, and surface treatments create visual hierarchy?
- Are there finishing touches — custom icons, illustrations, subtle gradients, grain overlays?
- Does the page have a distinct visual identity, or could it be any generic SaaS app?

## Scoring Guide
- **9-10**: Distinctive, memorable design with clear aesthetic point-of-view
- **7-8**: Polished and professional, some personality
- **5-6**: Functional but generic — looks like every other SaaS app
- **3-4**: Rough or inconsistent — feels unfinished
- **1-2**: No visual design thought applied

## Review Output Format
For each page, produce:

```
### Visual Design Review: [Page Name]
**Overall Visual Score**: X/10
**Aesthetic Direction**: [What it currently feels like — e.g., "generic SaaS", "clean minimal", "utilitarian dashboard"]

| Dimension          | Score | Notes |
|--------------------|-------|-------|
| Typography         | X/10  | ...   |
| Color & Theme      | X/10  | ...   |
| Motion             | X/10  | ...   |
| Spatial Composition| X/10  | ...   |
| Visual Polish      | X/10  | ...   |

**What works**: ...
**What's generic/weak**: ...
**Visual upgrade ideas**: Concrete suggestions to make this page more distinctive and polished
```

## Key Principle
The goal is not to make every page maximalist or flashy. The goal is **intentionality** — every page should feel deliberately designed for its context, not assembled from default components. A minimalist settings page can score 9/10 if the minimalism is refined and intentional. A dashboard can score 9/10 if its density is controlled and its data visualization is beautiful.
