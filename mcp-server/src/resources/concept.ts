/**
 * dossier://concept resource - Introduction to the dossier concept.
 */

export const CONCEPT_CONTENT = `# Dossier Concept

## What Are Dossiers?

**Dossiers** are structured instructions for AI agents to automate complex workflows intelligently.

Instead of writing brittle scripts that break on edge cases, dossiers provide **clear instructions** that LLM agents can follow and adapt to your specific project context.

## Key Principles

1. **Declarative**: Describe what should be accomplished, not exact commands
2. **Context-aware**: Instructions adapt based on analyzed project state
3. **Self-documenting**: Serve as both automation and documentation
4. **LLM-agnostic**: Work with any capable AI agent
5. **Self-improving**: Can be enhanced based on execution feedback

## When to Use Dossiers

Use dossiers when:
- ✅ Context awareness needed (detect project structure)
- ✅ Decisions required (which templates to use)
- ✅ Adaptation needed (handle unexpected setups)
- ✅ User guidance helpful (explain choices)

Use scripts when:
- ✅ Inputs are clear and deterministic
- ✅ Fast execution matters
- ✅ No decisions needed
- ✅ Same operation every time

## Dossier Structure

Every dossier includes:

- **Objective**: Clear statement of what this accomplishes
- **Prerequisites**: What must exist before running
- **Context to Gather**: What the LLM should analyze
- **Decision Points**: Key choices the LLM needs to make
- **Actions to Perform**: Step-by-step instructions
- **Validation**: How to verify success
- **Example**: Expected result
- **Troubleshooting**: Common issues and resolutions

## Protocol

Dossiers follow the **Dossier Execution Protocol** which includes:
- Self-improvement analysis before execution
- Context gathering and decision making
- Safety guidelines (backups, confirmations)
- Validation and verification steps

See \`dossier://protocol\` for the full protocol specification.
`;

export function getConceptResource(): { contents: Array<{ uri: string; mimeType: string; text: string }> } {
  return {
    contents: [
      {
        uri: 'dossier://concept',
        mimeType: 'text/markdown',
        text: CONCEPT_CONTENT,
      },
    ],
  };
}
