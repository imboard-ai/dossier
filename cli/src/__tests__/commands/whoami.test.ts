import { beforeEach, describe, expect, it, vi } from 'vitest';
import { registerWhoamiCommand } from '../../commands/whoami';
import * as credentials from '../../credentials';
import { createTestProgram } from '../helpers/test-utils';

vi.mock('../../credentials');

describe('whoami command', () => {
  beforeEach(() => {
    // Mocks are reset by global afterEach (setup.ts)
  });

  it('should display username when logged in', async () => {
    vi.mocked(credentials.loadCredentials).mockReturnValue({
      token: 'tok',
      username: 'testuser',
      orgs: ['org1'],
      expiresAt: null,
    });
    vi.mocked(credentials.isExpired).mockReturnValue(false);

    const program = createTestProgram();
    registerWhoamiCommand(program);
    await program.parseAsync(['node', 'dossier', 'whoami']);

    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('testuser'));
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('org1'));
  });

  it('should exit 1 when not logged in', async () => {
    vi.mocked(credentials.loadCredentials).mockReturnValue(null);

    const program = createTestProgram();
    registerWhoamiCommand(program);

    await expect(program.parseAsync(['node', 'dossier', 'whoami'])).rejects.toThrow(
      'process.exit(1)'
    );
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Not logged in'));
  });

  it('should exit 1 when credentials expired', async () => {
    vi.mocked(credentials.loadCredentials).mockReturnValue({
      token: 'tok',
      username: 'user',
      orgs: [],
      expiresAt: '2020-01-01',
    });
    vi.mocked(credentials.isExpired).mockReturnValue(true);

    const program = createTestProgram();
    registerWhoamiCommand(program);

    await expect(program.parseAsync(['node', 'dossier', 'whoami'])).rejects.toThrow(
      'process.exit(1)'
    );
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('expired'));
  });

  it('should not show orgs when empty', async () => {
    vi.mocked(credentials.loadCredentials).mockReturnValue({
      token: 'tok',
      username: 'user',
      orgs: [],
      expiresAt: null,
    });
    vi.mocked(credentials.isExpired).mockReturnValue(false);

    const program = createTestProgram();
    registerWhoamiCommand(program);
    await program.parseAsync(['node', 'dossier', 'whoami']);

    expect(console.log).not.toHaveBeenCalledWith(expect.stringContaining('Organizations'));
  });
});
