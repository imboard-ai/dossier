import fs from 'node:fs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { registerPublishCommand } from '../../commands/publish';
import * as credentials from '../../credentials';
import * as registryClient from '../../registry-client';
import { createTestProgram } from '../helpers/test-utils';

vi.mock('node:fs');
vi.mock('node:readline');
vi.mock('../../credentials');
vi.mock('../../registry-client');

const mockedFs = vi.mocked(fs);

const validDossier = `---dossier
{"title":"Test Dossier","version":"1.0.0","name":"test-dossier","risk_level":"low","status":"stable"}
---
Body content here`;

describe('publish command', () => {
  const mockClient = { publishDossier: vi.fn() };

  beforeEach(() => {
    vi.mocked(credentials.loadCredentials).mockReturnValue({
      token: 'tok',
      username: 'user',
      orgs: ['org'],
      expiresAt: null,
    });
    vi.mocked(credentials.isExpired).mockReturnValue(false);
    vi.mocked(registryClient.getClient).mockReturnValue(mockClient as any);
    mockedFs.existsSync.mockReturnValue(true);
    mockedFs.readFileSync.mockReturnValue(validDossier);
  });

  it('should exit 1 when not logged in', async () => {
    vi.mocked(credentials.loadCredentials).mockReturnValue(null);

    const program = createTestProgram();
    registerPublishCommand(program);

    await expect(program.parseAsync(['node', 'dossier', 'publish', 'test.ds.md'])).rejects.toThrow(
      'process.exit(1)'
    );

    expect(console.error).toHaveBeenCalledWith(expect.stringContaining('Not logged in'));
  });

  it('should exit 1 when credentials expired', async () => {
    vi.mocked(credentials.isExpired).mockReturnValue(true);

    const program = createTestProgram();
    registerPublishCommand(program);

    await expect(program.parseAsync(['node', 'dossier', 'publish', 'test.ds.md'])).rejects.toThrow(
      'process.exit(1)'
    );

    expect(console.error).toHaveBeenCalledWith(expect.stringContaining('expired'));
  });

  it('should exit 1 when file not found', async () => {
    mockedFs.existsSync.mockReturnValue(false);

    const program = createTestProgram();
    registerPublishCommand(program);

    await expect(
      program.parseAsync(['node', 'dossier', 'publish', 'missing.ds.md'])
    ).rejects.toThrow('process.exit(1)');

    expect(console.error).toHaveBeenCalledWith(expect.stringContaining('File not found'));
  });

  it('should exit 1 on invalid dossier format', async () => {
    mockedFs.readFileSync.mockReturnValue('no frontmatter');

    const program = createTestProgram();
    registerPublishCommand(program);

    await expect(program.parseAsync(['node', 'dossier', 'publish', 'test.ds.md'])).rejects.toThrow(
      'process.exit(1)'
    );

    expect(console.error).toHaveBeenCalledWith(expect.stringContaining('Invalid dossier format'));
  });

  it('should exit 1 on missing required fields', async () => {
    mockedFs.readFileSync.mockReturnValue('---dossier\n{"name":"test"}\n---\nBody');

    const program = createTestProgram();
    registerPublishCommand(program);

    await expect(program.parseAsync(['node', 'dossier', 'publish', 'test.ds.md'])).rejects.toThrow(
      'process.exit(1)'
    );

    expect(console.error).toHaveBeenCalledWith(expect.stringContaining('Validation errors'));
  });

  it('should publish with --yes flag', async () => {
    mockClient.publishDossier.mockResolvedValue({
      name: 'org/test-dossier',
      content_url: 'https://registry.example.com/dossiers/org/test-dossier',
    });

    const program = createTestProgram();
    registerPublishCommand(program);

    await program.parseAsync(['node', 'dossier', 'publish', 'test.ds.md', '--yes']);

    expect(mockClient.publishDossier).toHaveBeenCalledWith('org', validDossier, null);
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Published'));
  });

  it('should exit 1 on 409 version conflict', async () => {
    mockClient.publishDossier.mockRejectedValue(
      Object.assign(new Error('Version exists'), { statusCode: 409 })
    );

    const program = createTestProgram();
    registerPublishCommand(program);

    await expect(
      program.parseAsync(['node', 'dossier', 'publish', 'test.ds.md', '--yes'])
    ).rejects.toThrow('process.exit(1)');

    expect(console.error).toHaveBeenCalledWith(expect.stringContaining('Version conflict'));
  });
});
