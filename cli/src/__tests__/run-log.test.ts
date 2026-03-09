import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import * as config from '../config';
import { appendRunLog, clearRunLog, readRunLog } from '../run-log';

vi.mock('node:fs');
vi.mock('../config');

const mockedFs = vi.mocked(fs);

describe('run-log', () => {
  beforeEach(() => {
    vi.mocked(config.getConfig).mockReset();
    vi.mocked(config.ensureConfigDir).mockReset();
    mockedFs.appendFileSync.mockReset();
    mockedFs.existsSync.mockReset();
    mockedFs.readFileSync.mockReset();
    mockedFs.writeFileSync.mockReset();

    vi.mocked(config.getConfig).mockReturnValue(true);
    vi.mocked(config.ensureConfigDir).mockReturnValue(undefined);
    mockedFs.appendFileSync.mockReturnValue(undefined);
    mockedFs.existsSync.mockReturnValue(false);
  });

  const makeEntry = (overrides = {}) => ({
    timestamp: '2026-03-06T15:00:00.000Z',
    dossier: 'imboard-ai/full-cycle-issue',
    resolved_version: '2.1.0',
    source: 'cache' as const,
    verification: 'passed' as const,
    llm: 'auto',
    user: 'testuser@host',
    cwd: '/home/test',
    nested: false,
    ...overrides,
  });

  describe('appendRunLog', () => {
    it('should write a JSONL line', () => {
      const entry = makeEntry();

      appendRunLog(entry);

      expect(mockedFs.appendFileSync).toHaveBeenCalledTimes(1);
      const [filePath, content, opts] = mockedFs.appendFileSync.mock.calls[0];
      expect(filePath).toContain('runs.jsonl');
      expect(content).toBe(`${JSON.stringify(entry)}\n`);
      expect(opts).toEqual({ mode: 0o600 });
    });

    it('should skip when auditLog is false', () => {
      vi.mocked(config.getConfig).mockReset();
      vi.mocked(config.getConfig).mockReturnValue(false);

      appendRunLog(makeEntry());

      expect(mockedFs.appendFileSync).not.toHaveBeenCalled();
    });

    it('should not throw on write error', () => {
      mockedFs.appendFileSync.mockImplementation(() => {
        throw new Error('EACCES');
      });

      expect(() => appendRunLog(makeEntry())).not.toThrow();
    });
  });

  describe('readRunLog', () => {
    it('should return empty array when file does not exist', () => {
      mockedFs.existsSync.mockReturnValue(false);

      expect(readRunLog()).toEqual([]);
    });

    it('should parse JSONL and return most-recent-first', () => {
      const entry1 = makeEntry({ timestamp: '2026-03-06T14:00:00Z' });
      const entry2 = makeEntry({ timestamp: '2026-03-06T15:00:00Z' });
      mockedFs.existsSync.mockReturnValue(true);
      mockedFs.readFileSync.mockReturnValue(
        `${JSON.stringify(entry1)}\n${JSON.stringify(entry2)}\n`
      );

      const result = readRunLog();

      expect(result).toHaveLength(2);
      expect(result[0].timestamp).toBe('2026-03-06T15:00:00Z');
      expect(result[1].timestamp).toBe('2026-03-06T14:00:00Z');
    });

    it('should skip malformed lines', () => {
      const entry = makeEntry();
      mockedFs.existsSync.mockReturnValue(true);
      mockedFs.readFileSync.mockReturnValue(`not json\n${JSON.stringify(entry)}\n{broken\n`);

      const result = readRunLog();

      expect(result).toHaveLength(1);
      expect(result[0].dossier).toBe('imboard-ai/full-cycle-issue');
    });

    it('should filter by dossier name', () => {
      const entry1 = makeEntry({ dossier: 'org/a' });
      const entry2 = makeEntry({ dossier: 'org/b' });
      mockedFs.existsSync.mockReturnValue(true);
      mockedFs.readFileSync.mockReturnValue(
        `${JSON.stringify(entry1)}\n${JSON.stringify(entry2)}\n`
      );

      const result = readRunLog({ dossier: 'org/a' });

      expect(result).toHaveLength(1);
      expect(result[0].dossier).toBe('org/a');
    });

    it('should respect limit', () => {
      const entries = Array.from({ length: 10 }, (_, i) =>
        makeEntry({ timestamp: `2026-03-06T${String(i).padStart(2, '0')}:00:00Z` })
      );
      mockedFs.existsSync.mockReturnValue(true);
      mockedFs.readFileSync.mockReturnValue(
        entries.map((e) => JSON.stringify(e)).join('\n') + '\n'
      );

      const result = readRunLog({ limit: 3 });

      expect(result).toHaveLength(3);
    });
  });

  describe('clearRunLog', () => {
    it('should truncate the log file', () => {
      mockedFs.existsSync.mockReturnValue(true);
      mockedFs.writeFileSync.mockReturnValue(undefined);

      clearRunLog();

      expect(mockedFs.writeFileSync).toHaveBeenCalledWith(
        expect.stringContaining('runs.jsonl'),
        '',
        { mode: 0o600 }
      );
    });
  });
});
