import fs from 'node:fs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('node:fs');

const mockedFs = vi.mocked(fs);

import {
  CACHE_TTL_MS,
  CLAUDE_SETTINGS_FILE,
  DOSSIER_HOOK_COMMAND,
  DOSSIER_HOOK_ID,
  DOSSIER_LIST_CACHE_FILE,
  getCachedDossierList,
  installClaudeHook,
  matchesHookPattern,
  removeClaudeHook,
  saveDossierListCache,
} from '../hooks';

describe('hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedFs.existsSync.mockReturnValue(false);
  });

  describe('matchesHookPattern', () => {
    it.each([
      'help me setup the project',
      'deploy to production',
      'migrate the database',
      'refactor the auth module',
      'create script for testing',
      'configure the CI/CD pipeline',
      'onboard new developer',
      'initialize the project',
      'sync worktree changes',
      'setup pipeline for deployment',
    ])('should match: "%s"', (prompt) => {
      expect(matchesHookPattern(prompt)).toBe(true);
    });

    it.each([
      'hello world',
      'fix the bug',
      'add a button',
      'what is typescript',
      'review this PR',
    ])('should not match: "%s"', (prompt) => {
      expect(matchesHookPattern(prompt)).toBe(false);
    });

    it('should be case-insensitive', () => {
      expect(matchesHookPattern('DEPLOY to staging')).toBe(true);
      expect(matchesHookPattern('Setup the project')).toBe(true);
    });
  });

  describe('installClaudeHook', () => {
    it('should create settings file and install hook when no file exists', () => {
      mockedFs.existsSync.mockReturnValue(false);

      const result = installClaudeHook();

      expect(result).toBe(true);
      expect(mockedFs.writeFileSync).toHaveBeenCalledWith(
        CLAUDE_SETTINGS_FILE,
        expect.stringContaining(DOSSIER_HOOK_ID),
        'utf8'
      );
    });

    it('should return false if hook is already installed by id', () => {
      mockedFs.existsSync.mockReturnValue(true);
      mockedFs.readFileSync.mockReturnValue(
        JSON.stringify({
          hooks: {
            UserPromptSubmit: [{ type: 'command', command: 'other', id: DOSSIER_HOOK_ID }],
          },
        })
      );

      expect(installClaudeHook()).toBe(false);
    });

    it('should return false if hook is already installed by command', () => {
      mockedFs.existsSync.mockReturnValue(true);
      mockedFs.readFileSync.mockReturnValue(
        JSON.stringify({
          hooks: {
            UserPromptSubmit: [{ type: 'command', command: DOSSIER_HOOK_COMMAND }],
          },
        })
      );

      expect(installClaudeHook()).toBe(false);
    });

    it('should add hook to existing settings without UserPromptSubmit', () => {
      mockedFs.existsSync.mockReturnValue(true);
      mockedFs.readFileSync.mockReturnValue(JSON.stringify({ someOther: true }));

      const result = installClaudeHook();
      expect(result).toBe(true);

      const writtenJson = mockedFs.writeFileSync.mock.calls[0][1] as string;
      const written = JSON.parse(writtenJson);
      expect(written.hooks.UserPromptSubmit).toHaveLength(1);
      expect(written.hooks.UserPromptSubmit[0].id).toBe(DOSSIER_HOOK_ID);
    });

    it('should handle corrupted settings file', () => {
      mockedFs.existsSync.mockReturnValue(true);
      mockedFs.readFileSync.mockReturnValue('not json');

      const result = installClaudeHook();
      expect(result).toBe(true);
    });

    it('should detect hook in nested hooks format', () => {
      mockedFs.existsSync.mockReturnValue(true);
      mockedFs.readFileSync.mockReturnValue(
        JSON.stringify({
          hooks: {
            UserPromptSubmit: [
              { type: 'wrapper', hooks: [{ type: 'command', command: DOSSIER_HOOK_COMMAND }] },
            ],
          },
        })
      );

      expect(installClaudeHook()).toBe(false);
    });
  });

  describe('removeClaudeHook', () => {
    it('should return false if settings file does not exist', () => {
      mockedFs.existsSync.mockReturnValue(false);
      expect(removeClaudeHook()).toBe(false);
    });

    it('should return false if no UserPromptSubmit hooks', () => {
      mockedFs.existsSync.mockReturnValue(true);
      mockedFs.readFileSync.mockReturnValue(JSON.stringify({ hooks: {} }));

      expect(removeClaudeHook()).toBe(false);
    });

    it('should remove hook by id and return true', () => {
      mockedFs.existsSync.mockReturnValue(true);
      mockedFs.readFileSync.mockReturnValue(
        JSON.stringify({
          hooks: {
            UserPromptSubmit: [
              { type: 'command', command: 'other-hook' },
              { type: 'command', command: DOSSIER_HOOK_COMMAND, id: DOSSIER_HOOK_ID },
            ],
          },
        })
      );

      expect(removeClaudeHook()).toBe(true);
      const writtenJson = mockedFs.writeFileSync.mock.calls[0][1] as string;
      const written = JSON.parse(writtenJson);
      expect(written.hooks.UserPromptSubmit).toHaveLength(1);
      expect(written.hooks.UserPromptSubmit[0].command).toBe('other-hook');
    });

    it('should return false if hook not found in list', () => {
      mockedFs.existsSync.mockReturnValue(true);
      mockedFs.readFileSync.mockReturnValue(
        JSON.stringify({
          hooks: {
            UserPromptSubmit: [{ type: 'command', command: 'other-hook' }],
          },
        })
      );

      expect(removeClaudeHook()).toBe(false);
    });

    it('should handle corrupted settings file', () => {
      mockedFs.existsSync.mockReturnValue(true);
      mockedFs.readFileSync.mockReturnValue('bad json');

      expect(removeClaudeHook()).toBe(false);
    });
  });

  describe('getCachedDossierList', () => {
    it('should return null when cache file does not exist', () => {
      mockedFs.existsSync.mockReturnValue(false);
      expect(getCachedDossierList()).toBeNull();
    });

    it('should return dossiers when cache is fresh', () => {
      const dossiers = [{ name: 'test', title: 'Test' }];
      mockedFs.existsSync.mockReturnValue(true);
      mockedFs.readFileSync.mockReturnValue(JSON.stringify({ timestamp: Date.now(), dossiers }));

      expect(getCachedDossierList()).toEqual(dossiers);
    });

    it('should return null when cache is stale', () => {
      const dossiers = [{ name: 'test', title: 'Test' }];
      mockedFs.existsSync.mockReturnValue(true);
      mockedFs.readFileSync.mockReturnValue(
        JSON.stringify({ timestamp: Date.now() - CACHE_TTL_MS - 1000, dossiers })
      );

      expect(getCachedDossierList()).toBeNull();
    });

    it('should return null on corrupted cache', () => {
      mockedFs.existsSync.mockReturnValue(true);
      mockedFs.readFileSync.mockReturnValue('bad json');

      expect(getCachedDossierList()).toBeNull();
    });
  });

  describe('saveDossierListCache', () => {
    it('should write cache to file', () => {
      const dossiers = [{ name: 'test', title: 'Test' }];
      saveDossierListCache(dossiers);

      expect(mockedFs.writeFileSync).toHaveBeenCalledWith(
        DOSSIER_LIST_CACHE_FILE,
        expect.stringContaining('"name":"test"'),
        'utf8'
      );
    });

    it('should silently ignore write errors', () => {
      mockedFs.writeFileSync.mockImplementation(() => {
        throw new Error('EACCES');
      });

      expect(() => saveDossierListCache([])).not.toThrow();
    });
  });
});
