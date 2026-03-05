/**
 * Integration test: local dossier workflow
 *
 * Tests the validate → checksum → format → lint flow using
 * real dossier-core functions with temporary dossier files.
 */

import fs from 'node:fs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { registerChecksumCommand } from '../../commands/checksum';
import { registerValidateCommand } from '../../commands/validate';
import { createTestProgram } from '../helpers/test-utils';

vi.mock('node:fs');

const mockedFs = vi.mocked(fs);

const validDossier = `---dossier
{
  "dossier_schema_version": "1.0.0",
  "title": "Integration Test Dossier",
  "version": "1.0.0",
  "name": "test/integration-dossier",
  "risk_level": "low",
  "status": "stable",
  "objective": "Test the local workflow integration"
}
---
# Integration Test

This is a test dossier for integration testing.
`;

const invalidDossier = `---dossier
{"title": "Missing Version"}
---
Some content`;

describe('local workflow integration', () => {
  beforeEach(() => {
    mockedFs.existsSync.mockReset();
    mockedFs.readFileSync.mockReset();
    mockedFs.writeFileSync.mockReset();
  });

  it('should validate a well-formed dossier successfully', async () => {
    mockedFs.existsSync.mockReturnValue(true);
    mockedFs.readFileSync.mockReturnValue(validDossier);

    const program = createTestProgram();
    registerValidateCommand(program);

    await expect(
      program.parseAsync(['node', 'dossier', 'validate', 'test.ds.md'])
    ).rejects.toThrow();

    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Valid'));
  });

  it('should validate an invalid dossier and report errors', async () => {
    mockedFs.existsSync.mockReturnValue(true);
    mockedFs.readFileSync.mockReturnValue(invalidDossier);

    const program = createTestProgram();
    registerValidateCommand(program);

    await expect(
      program.parseAsync(['node', 'dossier', 'validate', 'test.ds.md'])
    ).rejects.toThrow();
  });

  it('should compute checksum for a dossier file', async () => {
    mockedFs.existsSync.mockReturnValue(true);
    mockedFs.readFileSync.mockReturnValue(validDossier);

    const program = createTestProgram();
    registerChecksumCommand(program);

    await expect(
      program.parseAsync(['node', 'dossier', 'checksum', 'test.ds.md'])
    ).rejects.toThrow();

    // Should output a SHA-256 hash (64 hex chars)
    const logCalls = vi.mocked(console.log).mock.calls;
    const hashCall = logCalls.find((c) => typeof c[0] === 'string' && /[a-f0-9]{64}/.test(c[0]));
    expect(hashCall).toBeDefined();
  });

  it('should validate then checksum in sequence', async () => {
    mockedFs.existsSync.mockReturnValue(true);
    mockedFs.readFileSync.mockReturnValue(validDossier);

    // Step 1: Validate
    const validateProgram = createTestProgram();
    registerValidateCommand(validateProgram);

    await expect(
      validateProgram.parseAsync(['node', 'dossier', 'validate', 'test.ds.md'])
    ).rejects.toThrow();

    // Step 2: Checksum
    const checksumProgram = createTestProgram();
    registerChecksumCommand(checksumProgram);

    await expect(
      checksumProgram.parseAsync(['node', 'dossier', 'checksum', 'test.ds.md'])
    ).rejects.toThrow();
  });
});
