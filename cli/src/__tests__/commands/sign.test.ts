import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import { describe, expect, it, vi } from 'vitest';
import { registerSignCommand } from '../../commands/sign';
import { createTestProgram } from '../helpers/test-utils';

vi.mock('node:fs');
vi.mock('node:child_process');
vi.mock('../../helpers', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../helpers')>();
  return {
    ...actual,
    OFFICIAL_KMS_KEYS: ['alias/dossier-official-prod'],
    REPO_ROOT: '/repo',
  };
});

const mockedFs = vi.mocked(fs);

describe('sign command', () => {
  it('should exit 1 when file not found', async () => {
    mockedFs.existsSync.mockReturnValue(false);

    const program = createTestProgram();
    registerSignCommand(program);

    await expect(program.parseAsync(['node', 'dossier', 'sign', 'missing.ds.md'])).rejects.toThrow(
      'process.exit(1)'
    );

    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('File not found'));
  });

  it('should exit 1 for official KMS key without --force', async () => {
    mockedFs.existsSync.mockReturnValue(true);

    const program = createTestProgram();
    registerSignCommand(program);

    await expect(program.parseAsync(['node', 'dossier', 'sign', 'test.ds.md'])).rejects.toThrow(
      'process.exit(1)'
    );

    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Official Dossier Key'));
  });

  it('should exit 1 for unknown signing method', async () => {
    mockedFs.existsSync.mockReturnValue(true);

    const program = createTestProgram();
    registerSignCommand(program);

    await expect(
      program.parseAsync(['node', 'dossier', 'sign', 'test.ds.md', '--method', 'unknown'])
    ).rejects.toThrow('process.exit(1)');

    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Unknown signing method'));
  });

  it('should exit 1 for ed25519 without --key', async () => {
    mockedFs.existsSync.mockReturnValue(true);

    const program = createTestProgram();
    registerSignCommand(program);

    await expect(
      program.parseAsync(['node', 'dossier', 'sign', 'test.ds.md', '--method', 'ed25519'])
    ).rejects.toThrow('process.exit(1)');

    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('--key is required'));
  });

  it('should run signing tool for KMS with custom key', async () => {
    mockedFs.existsSync.mockReturnValue(true);
    vi.mocked(spawnSync).mockReturnValue({ status: 0 } as any);

    const program = createTestProgram();
    registerSignCommand(program);

    await program.parseAsync([
      'node',
      'dossier',
      'sign',
      'test.ds.md',
      '--key-id',
      'alias/my-org-key',
    ]);

    expect(spawnSync).toHaveBeenCalledWith(
      'node',
      expect.arrayContaining([expect.stringContaining('sign-dossier-kms.js')]),
      expect.any(Object)
    );
  });
});
