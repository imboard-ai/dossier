import { describe, expect, it, vi } from 'vitest';
import { registerResetHooksCommand } from '../../commands/reset-hooks';
import * as hooks from '../../hooks';
import { createTestProgram } from '../helpers/test-utils';

vi.mock('../../hooks');

describe('reset-hooks command', () => {
  it('should show success when hook was removed', async () => {
    vi.mocked(hooks.removeClaudeHook).mockReturnValue(true);
    const program = createTestProgram();
    registerResetHooksCommand(program);

    await program.parseAsync(['node', 'dossier', 'reset-hooks']);

    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('hook removed'));
  });

  it('should show not-found when no hook exists', async () => {
    vi.mocked(hooks.removeClaudeHook).mockReturnValue(false);
    const program = createTestProgram();
    registerResetHooksCommand(program);

    await program.parseAsync(['node', 'dossier', 'reset-hooks']);

    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('No Dossier hook'));
  });
});
