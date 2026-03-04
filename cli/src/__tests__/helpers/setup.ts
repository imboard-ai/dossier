/**
 * Global test setup for CLI tests.
 * Prevents process.exit from killing the test runner and captures console output.
 */
import { afterEach, beforeEach, vi } from 'vitest';

beforeEach(() => {
  vi.spyOn(process, 'exit').mockImplementation(((code?: number) => {
    throw new Error(`process.exit(${code ?? 0})`);
  }) as never);
  vi.spyOn(console, 'log').mockImplementation(() => {});
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});
