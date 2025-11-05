/**
 * dossier://protocol resource - Dossier Execution Protocol.
 */

export const PROTOCOL_CONTENT = `# Dossier Execution Protocol v1.0

## Overview

This protocol defines standard execution guidelines for all dossiers, ensuring consistent, safe, and continuously improving automation.

## Execution Steps

### 1. Read Protocol & Dossier

- Access this protocol for execution guidelines
- Read the target dossier completely
- Understand the objective and scope

### 2. Pre-Execution Analysis (Self-Improvement)

Before executing, analyze the dossier for potential improvements:
- Clarity: Are instructions specific for this project?
- Completeness: Missing edge cases?
- Examples: Relevant to detected tech stack?
- Validation: Sufficient verification steps?
- Troubleshooting: Cover foreseeable issues?

If improvements identified, propose to user. Apply if accepted.

### 3. Validate Prerequisites

- Check all prerequisites from dossier
- Verify required tools/permissions
- Confirm with user if any missing

### 4. Gather Context

- Analyze project structure per "Context to Gather" section
- Identify relevant files and configurations
- Understand project-specific constraints

### 5. Make Decisions

- Process "Decision Points" section
- Choose appropriate options based on context
- Explain choices to user

### 6. Execute Actions

- Follow "Actions to Perform" sequentially
- Request confirmation for destructive operations
- Provide progress updates
- Handle errors per troubleshooting guidance

### 7. Validate Results

- Run all validation checks from "Validation" section
- Verify success criteria met
- Report outcome to user

### 8. Post-Execution

- If improvements were made, offer to save improved version
- Document what was learned

## Safety Guidelines

- **Backups**: Create backups before destructive operations
- **Confirmations**: Request user approval for risky actions
- **Rollback**: Provide rollback instructions for critical operations
- **Validation**: Always verify outcomes
- **Transparency**: Explain what you're doing and why

## Output Format

Use checkmarks for completed steps:
- ✓ Step completed successfully
- ⚠️ Warning or non-critical issue
- ✗ Error or failure

## Version Compatibility

- Protocol v1.0 compatible with all v1.x dossiers
- Dossiers specify: \`**Protocol Version**: 1.0\`
`;

export function getProtocolResource(): { contents: Array<{ uri: string; mimeType: string; text: string }> } {
  return {
    contents: [
      {
        uri: 'dossier://protocol',
        mimeType: 'text/markdown',
        text: PROTOCOL_CONTENT,
      },
    ],
  };
}
