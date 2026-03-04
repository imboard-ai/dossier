import { execSync } from 'node:child_process';
import fs from 'node:fs';
import { describe, expect, it, vi } from 'vitest';
import { registerCreateCommand } from '../../commands/create';
import * as config from '../../config';
import { createTestProgram } from '../helpers/test-utils';

vi.mock('node:fs');
vi.mock('node:child_process');
vi.mock('../../config');
vi.mock('../../helpers', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../helpers')>();
  return {
    ...actual,
    REPO_ROOT: '/repo',
    BIN_DIR: '/repo/cli/bin',
    detectLlm: vi.fn(),
  };
});

const mockedFs = vi.mocked(fs);

// Import after mock setup
const { detectLlm } = await import('../../helpers');

describe('create command', () => {
  it('should exit 2 when LLM not detected', async () => {
    vi.mocked(detectLlm).mockReturnValue(null);

    const program = createTestProgram();
    registerCreateCommand(program);

    await expect(program.parseAsync(['node', 'dossier', 'create'])).rejects.toThrow(
      'process.exit(2)'
    );
  });

  it('should exit 2 when meta-dossier not found', async () => {
    vi.mocked(detectLlm).mockReturnValue('claude-code');
    mockedFs.existsSync.mockReturnValue(false);

    const program = createTestProgram();
    registerCreateCommand(program);

    await expect(program.parseAsync(['node', 'dossier', 'create'])).rejects.toThrow(
      'process.exit(2)'
    );

    expect(console.error).toHaveBeenCalledWith(expect.stringContaining('Meta-dossier not found'));
  });

  it('should launch LLM with dossier content', async () => {
    vi.mocked(detectLlm).mockReturnValue('claude-code');
    mockedFs.existsSync.mockReturnValue(true);
    mockedFs.readFileSync.mockReturnValue('# Meta dossier content');
    vi.mocked(execSync).mockReturnValue(Buffer.from(''));

    const program = createTestProgram();
    registerCreateCommand(program);

    await program.parseAsync(['node', 'dossier', 'create', '--title', 'My Dossier']);

    expect(execSync).toHaveBeenCalled();
    expect(mockedFs.writeFileSync).toHaveBeenCalled();
    expect(mockedFs.unlinkSync).toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('completed'));
  });

  it('should clean up temp file on exec failure', async () => {
    vi.mocked(detectLlm).mockReturnValue('claude-code');
    mockedFs.existsSync.mockReturnValue(true);
    mockedFs.readFileSync.mockReturnValue('# Meta dossier');
    vi.mocked(execSync).mockImplementation(() => {
      throw Object.assign(new Error('exec failed'), { status: 1 });
    });

    const program = createTestProgram();
    registerCreateCommand(program);

    await expect(program.parseAsync(['node', 'dossier', 'create'])).rejects.toThrow(
      'process.exit(1)'
    );

    expect(mockedFs.unlinkSync).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith(expect.stringContaining('creation failed'));
  });
});
