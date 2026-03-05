import fs from 'node:fs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { registerExportCommand } from '../../commands/export';
import * as registryClient from '../../registry-client';
import { createTestProgram } from '../helpers/test-utils';

vi.mock('node:fs');
vi.mock('../../registry-client');

const mockedFs = vi.mocked(fs);

describe('export command', () => {
  const mockClient = {
    getDossierContent: vi.fn(),
  };

  beforeEach(() => {
    // Mocks are reset by global afterEach (setup.ts)
    vi.mocked(registryClient.getClient).mockReturnValue(mockClient as any);
    vi.mocked(registryClient.parseNameVersion).mockImplementation((name: string) => {
      if (name.includes('@')) {
        const idx = name.lastIndexOf('@');
        return [name.slice(0, idx), name.slice(idx + 1)];
      }
      return [name, null];
    });
    mockedFs.existsSync.mockReturnValue(true);
  });

  it('should export dossier to file', async () => {
    mockClient.getDossierContent.mockResolvedValue({
      content: '# Dossier content',
      digest: 'sha256:abc',
    });

    const program = createTestProgram();
    registerExportCommand(program);

    // export command doesn't call process.exit on success (non-stdout)
    await program.parseAsync(['node', 'dossier', 'export', 'my-dossier']);

    expect(mockedFs.writeFileSync).toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Exported'));
  });

  it('should export specific version', async () => {
    mockClient.getDossierContent.mockResolvedValue({
      content: 'content',
      digest: null,
    });

    const program = createTestProgram();
    registerExportCommand(program);

    await program.parseAsync(['node', 'dossier', 'export', 'my-dossier@1.0.0']);

    expect(mockClient.getDossierContent).toHaveBeenCalledWith('my-dossier', '1.0.0');
  });

  it('should write to stdout with --stdout', async () => {
    mockClient.getDossierContent.mockResolvedValue({
      content: 'dossier content here',
      digest: null,
    });
    const writeSpy = vi.spyOn(process.stdout, 'write').mockImplementation(() => true);

    const program = createTestProgram();
    registerExportCommand(program);

    await expect(
      program.parseAsync(['node', 'dossier', 'export', 'my-dossier', '--stdout'])
    ).rejects.toThrow();

    expect(writeSpy).toHaveBeenCalledWith('dossier content here');
  });

  it('should exit 1 on 404 error', async () => {
    mockClient.getDossierContent.mockRejectedValue(
      Object.assign(new Error('Not found'), { statusCode: 404 })
    );

    const program = createTestProgram();
    registerExportCommand(program);

    await expect(
      program.parseAsync(['node', 'dossier', 'export', 'missing-dossier'])
    ).rejects.toThrow();

    expect(console.error).toHaveBeenCalledWith(expect.stringContaining('Not found'));
  });

  it('should use custom output path with -o', async () => {
    mockClient.getDossierContent.mockResolvedValue({
      content: 'content',
      digest: null,
    });

    const program = createTestProgram();
    registerExportCommand(program);

    await program.parseAsync(['node', 'dossier', 'export', 'my-dossier', '-o', '/tmp/out.ds.md']);

    expect(mockedFs.writeFileSync).toHaveBeenCalledWith(
      expect.stringContaining('out.ds.md'),
      'content',
      'utf8'
    );
  });
});
