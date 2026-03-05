import { beforeEach, describe, expect, it, vi } from 'vitest';
import { registerVerifyCommand } from '../../commands/verify';
import * as helpers from '../../helpers';
import { createTestProgram } from '../helpers/test-utils';

vi.mock('../../helpers');

describe('verify command', () => {
  beforeEach(() => {
    // Mocks are reset by global afterEach (setup.ts)
  });

  it('should exit 0 when verification passes', async () => {
    vi.mocked(helpers.runVerification).mockResolvedValue({
      passed: true,
      stages: [
        { stage: 1, name: 'Integrity', passed: true },
        { stage: 2, name: 'Author Check', passed: true, demo: true },
      ],
    });

    const program = createTestProgram();
    registerVerifyCommand(program);

    await expect(program.parseAsync(['node', 'dossier', 'verify', 'test.ds.md'])).rejects.toThrow();

    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Verification passed'));
  });

  it('should exit 1 when verification fails', async () => {
    vi.mocked(helpers.runVerification).mockResolvedValue({
      passed: false,
      stages: [{ stage: 1, name: 'Integrity', passed: false }],
    });

    const program = createTestProgram();
    registerVerifyCommand(program);

    await expect(program.parseAsync(['node', 'dossier', 'verify', 'test.ds.md'])).rejects.toThrow();

    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Verification failed'));
  });

  it('should show stage details with --verbose', async () => {
    vi.mocked(helpers.runVerification).mockResolvedValue({
      passed: true,
      stages: [
        { stage: 1, name: 'Integrity', passed: true },
        { stage: 2, name: 'Author Check', passed: true, demo: true },
        { stage: 3, name: 'Dossier Check', skipped: true },
      ],
    });

    const program = createTestProgram();
    registerVerifyCommand(program);

    await expect(
      program.parseAsync(['node', 'dossier', 'verify', 'test.ds.md', '--verbose'])
    ).rejects.toThrow();

    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Stages completed'));
  });

  it('should pass skip options to runVerification', async () => {
    vi.mocked(helpers.runVerification).mockResolvedValue({
      passed: true,
      stages: [],
    });

    const program = createTestProgram();
    registerVerifyCommand(program);

    await expect(
      program.parseAsync([
        'node',
        'dossier',
        'verify',
        'test.ds.md',
        '--skip-checksum',
        '--skip-risk-assessment',
      ])
    ).rejects.toThrow();

    expect(helpers.runVerification).toHaveBeenCalledWith(
      'test.ds.md',
      expect.objectContaining({
        skipChecksum: true,
        skipRiskAssessment: true,
      })
    );
  });
});
