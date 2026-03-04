import fs from 'node:fs';
import { describe, expect, it, vi } from 'vitest';
import { registerFormatCommand } from '../../commands/format';
import { createTestProgram } from '../helpers/test-utils';

vi.mock('node:fs');

const { mockFormatDossierContent, mockFormatDossierFile } = vi.hoisted(() => ({
  mockFormatDossierContent: vi.fn(),
  mockFormatDossierFile: vi.fn(),
}));

vi.mock('@ai-dossier/core', () => ({
  formatDossierContent: mockFormatDossierContent,
  formatDossierFile: mockFormatDossierFile,
}));

const mockedFs = vi.mocked(fs);

describe('format command', () => {
  it('should format a file and report changes', async () => {
    mockFormatDossierFile.mockReturnValue({ changed: true });
    const program = createTestProgram();
    registerFormatCommand(program);

    await expect(program.parseAsync(['node', 'dossier', 'format', 'test.ds.md'])).rejects.toThrow(
      'process.exit(0)'
    );

    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('formatted'));
  });

  it('should report already formatted', async () => {
    mockFormatDossierFile.mockReturnValue({ changed: false });
    const program = createTestProgram();
    registerFormatCommand(program);

    await expect(program.parseAsync(['node', 'dossier', 'format', 'test.ds.md'])).rejects.toThrow(
      'process.exit(0)'
    );

    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('already formatted'));
  });

  it('should exit 1 when --check finds changes needed', async () => {
    mockedFs.readFileSync.mockReturnValue('content');
    mockFormatDossierContent.mockReturnValue({ changed: true });
    const program = createTestProgram();
    registerFormatCommand(program);

    await expect(
      program.parseAsync(['node', 'dossier', 'format', 'test.ds.md', '--check'])
    ).rejects.toThrow('process.exit(1)');

    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('needs formatting'));
  });

  it('should exit 0 when --check finds no changes needed', async () => {
    mockedFs.readFileSync.mockReturnValue('content');
    mockFormatDossierContent.mockReturnValue({ changed: false });
    const program = createTestProgram();
    registerFormatCommand(program);

    await expect(
      program.parseAsync(['node', 'dossier', 'format', 'test.ds.md', '--check'])
    ).rejects.toThrow('process.exit(0)');

    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('already formatted'));
  });

  it('should exit 2 on error', async () => {
    mockFormatDossierFile.mockImplementation(() => {
      throw new Error('parse error');
    });
    const program = createTestProgram();
    registerFormatCommand(program);

    await expect(program.parseAsync(['node', 'dossier', 'format', 'test.ds.md'])).rejects.toThrow(
      'process.exit(2)'
    );
  });

  it('should output JSON with --json', async () => {
    mockFormatDossierFile.mockReturnValue({ changed: true });
    const program = createTestProgram();
    registerFormatCommand(program);

    await expect(
      program.parseAsync(['node', 'dossier', 'format', 'test.ds.md', '--json'])
    ).rejects.toThrow('process.exit(0)');

    const jsonCalls = vi
      .mocked(console.log)
      .mock.calls.filter((c) => typeof c[0] === 'string' && c[0].includes('"changed"'));
    expect(jsonCalls.length).toBeGreaterThan(0);
  });
});
