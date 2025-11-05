/**
 * execute-dossier prompt - Execute a dossier following the protocol.
 */

export interface ExecuteDossierArgs {
  dossier: string;
  skipImprovement?: boolean;
  dryRun?: boolean;
}

export function getExecuteDossierPrompt(
  args: ExecuteDossierArgs
): { description: string; messages: Array<{ role: string; content: { type: string; text: string } }> } {
  const skipImprovementText = args.skipImprovement
    ? '- Skip self-improvement analysis (proceed directly)'
    : '- Perform self-improvement analysis per protocol';

  const dryRunText = args.dryRun
    ? '- **DRY RUN MODE**: Validate but do NOT execute actions'
    : '- Execute actions as specified';

  const promptText = `You are about to execute the "${args.dossier}" dossier following the Dossier Execution Protocol v1.0.

## Protocol Steps

1. **Read Protocol & Dossier**
   - Access dossier://protocol resource for execution guidelines
   - Use read_dossier tool to get the "${args.dossier}" dossier content
   - Review the complete structure

2. **Pre-Execution Analysis**
   ${skipImprovementText}
   ${args.skipImprovement ? '' : '- Identify potential improvements based on current project\n   - Suggest enhancements to user\n   - Apply improvements if user accepts'}

3. **Validate Prerequisites**
   - Check all prerequisites from dossier
   - Verify required tools/permissions
   - Confirm with user if any are missing

4. **Gather Context**
   - Analyze project structure per "Context to Gather" section
   - Identify relevant files and configurations
   - Understand project-specific constraints

5. **Make Decisions**
   - Process "Decision Points" section
   - Choose appropriate options based on gathered context
   - Explain choices to user

6. **Execute Actions**
   ${dryRunText}
   ${args.dryRun ? '' : '- Request confirmation for destructive operations\n   - Provide progress updates\n   - Handle errors per troubleshooting guidance'}

7. **Validate Results**
   - Run all validation checks from "Validation" section
   - Verify success criteria met
   - Report outcome to user

8. **Post-Execution**
   ${args.skipImprovement ? '' : '- If improvements were made, offer to save improved dossier version'}

## Execution Options

- Dossier: ${args.dossier}
- Skip self-improvement: ${args.skipImprovement || false}
- Dry run mode: ${args.dryRun || false}

## Safety Guidelines

- Create backups before destructive operations
- Request approval for risky actions
- Provide clear progress updates
- Validate all outcomes

---

**Begin execution now.** Start by reading the protocol and dossier, then proceed through each step systematically.
`;

  return {
    description: `Execute the "${args.dossier}" dossier following the standard protocol`,
    messages: [
      {
        role: 'user',
        content: {
          type: 'text',
          text: promptText,
        },
      },
    ],
  };
}
