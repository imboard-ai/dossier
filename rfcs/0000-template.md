# RFC-0000: [Title]

- **Status**: Proposal
- **Author(s)**: [Your Name / GitHub handle]
- **Created**: YYYY-MM-DD
- **Related**: [Links to issues, PRs, or discussions]

## Summary

One paragraph explanation of the proposal. What is this RFC about in plain language?

## Motivation

Why are we doing this? What use cases does it support? What problems does it solve?

- What is the expected outcome if this is implemented?
- Who benefits from this change?
- What pain points does it address?

## Design

### Proposed Changes

Detailed explanation of the proposal:

- What changes to the protocol, specification, or tooling are needed?
- How does this affect existing functionality?
- What new capabilities does this enable?

### API / Specification Changes

If applicable, show concrete examples of:

- New dossier metadata fields
- Changes to the JSON schema
- New CLI commands or flags
- MCP server tool modifications
- Protocol updates

**Example** (if applicable):
```json
{
  "new_field": "example_value",
  "updated_field": {
    "description": "New behavior"
  }
}
```

### Backwards Compatibility

- Is this a breaking change?
- How will existing dossiers be affected?
- What migration path exists for users?
- Can old and new versions coexist?

### Security Implications

- Does this introduce new security considerations?
- How does it affect verification and trust?
- What are the attack vectors?
- What mitigations are proposed?

### Validation Requirements

- How will this be validated?
- What tests are needed?
- What edge cases need consideration?

### Alternatives Considered

What other approaches were considered and why were they not chosen?

1. **Alternative A**: Description and tradeoffs
2. **Alternative B**: Description and tradeoffs
3. **Do Nothing**: What happens if we don't implement this?

## Rollout

### Implementation Phases

Break down the implementation into phases:

1. **Phase 1**: Initial prototype / proof of concept
2. **Phase 2**: Core implementation
3. **Phase 3**: Documentation and examples
4. **Phase 4**: Community feedback and iteration

### Migration Strategy

If this is a breaking change or significant update:

- How will existing users migrate?
- What tooling can help with migration?
- What is the deprecation timeline?
- How will we communicate the change?

### Telemetry

If applicable:

- What metrics should we track? (opt-in only)
- How will we measure success?
- What privacy considerations exist?

**Default**: No telemetry unless explicitly opt-in

## Unresolved Questions

What parts of the design still need to be resolved?

- Open technical questions
- Unclear edge cases
- Areas needing community input
- Dependencies on other decisions

## Future Possibilities

What could this enable in the future that's out of scope for this RFC?

- Follow-up RFCs that could build on this
- Related improvements
- Long-term vision

---

## Notes for RFC Authors

### When to Create an RFC

Use an RFC for:
- Changes to the Dossier protocol or execution model
- Changes to the schema specification
- New security features or trust models
- Breaking changes to existing behavior
- Significant new features that affect users

Don't use an RFC for:
- Bug fixes
- Documentation improvements
- New example dossiers (unless they introduce new patterns)
- Minor tool improvements

### RFC Process

1. **Copy this template** to `rfcs/NNNN-your-title.md` (use next available number)
2. **Fill in all sections** - Remove this "Notes" section before submitting
3. **Open a PR** with your RFC
4. **Discuss** - Respond to feedback and update the RFC
5. **Decision** - Maintainers will accept, defer, or close

### Status Values

- **Proposal** - Initial draft, under discussion
- **Accepted** - Approved for implementation
- **Implemented** - Changes have been merged
- **Deferred** - Good idea but not now
- **Rejected** - Not moving forward

### Tips

- Be specific about what's changing and why
- Include concrete examples
- Consider backwards compatibility
- Think about security implications
- Identify edge cases and alternatives
- Keep it focused - one RFC per major change
