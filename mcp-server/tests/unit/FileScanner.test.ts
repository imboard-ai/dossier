import { describe, it, expect, beforeAll } from 'vitest';
import { FileScanner } from '../../src/core/filesystem/FileScanner.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const fixturesDir = path.join(__dirname, '../fixtures');

describe('FileScanner', () => {
  const scanner = new FileScanner();

  describe('scan', () => {
    it('should find all markdown files in valid fixtures', async () => {
      const result = await scanner.scan({
        basePath: path.join(fixturesDir, 'valid'),
        pattern: '**/*.md',
      });

      expect(result.files.length).toBeGreaterThan(0);
      expect(result.basePath).toBe(path.join(fixturesDir, 'valid'));

      // Should find our test fixtures
      const fileNames = result.files.map((f) => path.basename(f));
      expect(fileNames).toContain('simple-dossier.md');
      expect(fileNames).toContain('complete-dossier.md');
    });

    it('should find markdown files recursively', async () => {
      const result = await scanner.scan({
        basePath: fixturesDir,
        recursive: true,
      });

      expect(result.files.length).toBeGreaterThan(0);

      // Should find files from multiple directories
      const hasValid = result.files.some((f) => f.includes('/valid/'));
      const hasInvalid = result.files.some((f) => f.includes('/invalid/'));

      expect(hasValid).toBe(true);
      expect(hasInvalid).toBe(true);
    });

    it('should not recurse when recursive is false', async () => {
      const result = await scanner.scan({
        basePath: fixturesDir,
        recursive: false,
      });

      // Should only find files directly in fixtures dir, not in subdirs
      // Our test fixtures are in valid/ and invalid/ subdirs, so should find none
      expect(result.files.length).toBe(0);
    });

    it('should use cwd as default basePath', async () => {
      const result = await scanner.scan();

      expect(result.basePath).toBe(process.cwd());
    });

    it('should return absolute paths', async () => {
      const result = await scanner.scan({
        basePath: path.join(fixturesDir, 'valid'),
      });

      for (const file of result.files) {
        expect(path.isAbsolute(file)).toBe(true);
      }
    });

    it('should ignore node_modules and dist directories', async () => {
      // This test verifies the ignore patterns work
      const result = await scanner.scan({
        basePath: path.join(__dirname, '../..'),
        recursive: true,
      });

      const hasNodeModules = result.files.some((f) =>
        f.includes('node_modules')
      );
      const hasDist = result.files.some((f) => f.includes('/dist/'));

      expect(hasNodeModules).toBe(false);
      expect(hasDist).toBe(false);
    });
  });

  describe('looksLikeDossier', () => {
    it('should recognize common dossier naming patterns', () => {
      expect(scanner.looksLikeDossier('project-init.md')).toBe(true);
      expect(scanner.looksLikeDossier('setup-environment.md')).toBe(true);
      expect(scanner.looksLikeDossier('deploy-to-aws.md')).toBe(true);
      expect(scanner.looksLikeDossier('database-migration.md')).toBe(true);
      expect(scanner.looksLikeDossier('my-dossier.md')).toBe(true);
    });

    it('should recognize dossier keyword', () => {
      expect(scanner.looksLikeDossier('simple-dossier.md')).toBe(true);
      expect(scanner.looksLikeDossier('DOSSIER-readme.md')).toBe(true);
    });

    it('should reject non-dossier files', () => {
      expect(scanner.looksLikeDossier('README.md')).toBe(false);
      expect(scanner.looksLikeDossier('notes.md')).toBe(false);
      expect(scanner.looksLikeDossier('documentation.md')).toBe(false);
      expect(scanner.looksLikeDossier('changelog.md')).toBe(false);
    });

    it('should work with full paths', () => {
      expect(scanner.looksLikeDossier('/path/to/project-init.md')).toBe(true);
      expect(scanner.looksLikeDossier('/path/to/README.md')).toBe(false);
    });
  });

  describe('filterDossierFiles', () => {
    it('should filter file list to only dossiers', () => {
      const files = [
        '/project/dossiers/project-init.md',
        '/project/README.md',
        '/project/dossiers/deploy-to-aws.md',
        '/project/docs/notes.md',
        '/project/dossiers/cleanup-dossier.md',
      ];

      const filtered = scanner.filterDossierFiles(files);

      expect(filtered).toHaveLength(3);
      expect(filtered).toContain('/project/dossiers/project-init.md');
      expect(filtered).toContain('/project/dossiers/deploy-to-aws.md');
      expect(filtered).toContain('/project/dossiers/cleanup-dossier.md');
      expect(filtered).not.toContain('/project/README.md');
      expect(filtered).not.toContain('/project/docs/notes.md');
    });

    it('should return empty array when no dossiers found', () => {
      const files = ['/project/README.md', '/project/docs/notes.md'];

      const filtered = scanner.filterDossierFiles(files);

      expect(filtered).toHaveLength(0);
    });
  });
});
