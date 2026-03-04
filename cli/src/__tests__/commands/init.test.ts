import fs from 'node:fs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { registerInitCommand } from '../../commands/init';
import * as config from '../../config';
import * as hooks from '../../hooks';
import { createTestProgram } from '../helpers/test-utils';

vi.mock('node:fs');
vi.mock('../../config');
vi.mock('../../hooks');

const mockedFs = vi.mocked(fs);

describe('init command', () => {
  beforeEach(() => {
    mockedFs.existsSync.mockReset();
    mockedFs.mkdirSync.mockReset();
    mockedFs.writeFileSync.mockReset();
    vi.mocked(config.saveConfig).mockReset();
    vi.mocked(hooks.installClaudeHook).mockReset();
  });

  it('should create directories when they do not exist', async () => {
    mockedFs.existsSync.mockReturnValue(false);
    vi.mocked(config.saveConfig).mockReturnValue(true);
    vi.mocked(hooks.installClaudeHook).mockReturnValue(true);

    const program = createTestProgram();
    registerInitCommand(program);

    await program.parseAsync(['node', 'dossier', 'init']);

    expect(mockedFs.mkdirSync).toHaveBeenCalledTimes(2);
    expect(config.saveConfig).toHaveBeenCalled();
    expect(hooks.installClaudeHook).toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('initialized'));
  });

  it('should skip existing directories', async () => {
    mockedFs.existsSync.mockReturnValue(true);
    vi.mocked(hooks.installClaudeHook).mockReturnValue(false);

    const program = createTestProgram();
    registerInitCommand(program);

    await program.parseAsync(['node', 'dossier', 'init']);

    expect(mockedFs.mkdirSync).not.toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('already exists'));
  });

  it('should skip hooks with --skip-hooks', async () => {
    mockedFs.existsSync.mockReturnValue(true);

    const program = createTestProgram();
    registerInitCommand(program);

    await program.parseAsync(['node', 'dossier', 'init', '--skip-hooks']);

    expect(hooks.installClaudeHook).not.toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Skipped'));
  });
});
