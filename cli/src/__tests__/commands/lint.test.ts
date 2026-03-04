import { describe, expect, it, vi } from 'vitest';
import { registerLintCommand } from '../../commands/lint';
import { createTestProgram } from '../helpers/test-utils';

const { mockLintDossierFile, MockLintRuleRegistry } = vi.hoisted(() => {
  const mockGetRules = vi
    .fn()
    .mockReturnValue([{ id: 'test-rule', description: 'A test rule', defaultSeverity: 'warning' }]);
  return {
    mockLintDossierFile: vi.fn(),
    MockLintRuleRegistry: class {
      registerAll = vi.fn();
      getRules = mockGetRules;
    },
  };
});

vi.mock('@imboard-ai/dossier-core', () => ({
  LintRuleRegistry: MockLintRuleRegistry,
  defaultRules: [],
  lintDossierFile: mockLintDossierFile,
}));

describe('lint command', () => {
  it('should list rules with --list-rules', async () => {
    const program = createTestProgram();
    registerLintCommand(program);

    await expect(program.parseAsync(['node', 'dossier', 'lint', '--list-rules'])).rejects.toThrow(
      'process.exit(0)'
    );

    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('lint rules'));
  });

  it('should exit 2 when no file argument provided', async () => {
    const program = createTestProgram();
    registerLintCommand(program);

    await expect(program.parseAsync(['node', 'dossier', 'lint'])).rejects.toThrow(
      'process.exit(2)'
    );
  });

  it('should report no issues for clean file', async () => {
    mockLintDossierFile.mockReturnValue({
      diagnostics: [],
      errorCount: 0,
      warningCount: 0,
      infoCount: 0,
    });
    const program = createTestProgram();
    registerLintCommand(program);

    await expect(program.parseAsync(['node', 'dossier', 'lint', 'test.ds.md'])).rejects.toThrow(
      'process.exit(0)'
    );

    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('no issues'));
  });

  it('should exit 2 when errors found', async () => {
    mockLintDossierFile.mockReturnValue({
      diagnostics: [{ severity: 'error', message: 'Bad field', ruleId: 'test' }],
      errorCount: 1,
      warningCount: 0,
      infoCount: 0,
    });
    const program = createTestProgram();
    registerLintCommand(program);

    await expect(program.parseAsync(['node', 'dossier', 'lint', 'test.ds.md'])).rejects.toThrow(
      'process.exit(2)'
    );
  });

  it('should exit 1 when only warnings found', async () => {
    mockLintDossierFile.mockReturnValue({
      diagnostics: [{ severity: 'warning', message: 'Missing field', ruleId: 'test' }],
      errorCount: 0,
      warningCount: 1,
      infoCount: 0,
    });
    const program = createTestProgram();
    registerLintCommand(program);

    await expect(program.parseAsync(['node', 'dossier', 'lint', 'test.ds.md'])).rejects.toThrow(
      'process.exit(1)'
    );
  });

  it('should treat warnings as errors with --strict', async () => {
    mockLintDossierFile.mockReturnValue({
      diagnostics: [{ severity: 'warning', message: 'Missing field', ruleId: 'test' }],
      errorCount: 0,
      warningCount: 1,
      infoCount: 0,
    });
    const program = createTestProgram();
    registerLintCommand(program);

    await expect(
      program.parseAsync(['node', 'dossier', 'lint', 'test.ds.md', '--strict'])
    ).rejects.toThrow('process.exit(2)');
  });
});
