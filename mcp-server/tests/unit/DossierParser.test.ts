import { describe, it, expect } from 'vitest';
import { DossierParser } from '../../src/core/parser/DossierParser.js';
import { ParseError, InvalidDossierError } from '../../src/types/errors.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const fixturesDir = path.join(__dirname, '../fixtures');

describe('DossierParser', () => {
  const parser = new DossierParser();

  describe('parseMetadata', () => {
    it('should extract metadata from valid dossier', async () => {
      const content = await fs.readFile(
        path.join(fixturesDir, 'valid/simple-dossier.md'),
        'utf-8'
      );

      const result = parser.parse(content, 'simple-dossier.md');

      expect(result.metadata.name).toBe('Simple Test Dossier');
      expect(result.metadata.version).toBe('1.0.0');
      expect(result.metadata.protocol).toBe('1.0');
      expect(result.metadata.status).toBe('Stable');
      expect(result.metadata.path).toBe('simple-dossier.md');
    });

    it('should extract metadata from complete dossier', async () => {
      const content = await fs.readFile(
        path.join(fixturesDir, 'valid/complete-dossier.md'),
        'utf-8'
      );

      const result = parser.parse(content, 'complete-dossier.md');

      expect(result.metadata.name).toBe('Complete Test Dossier');
      expect(result.metadata.version).toBe('2.1.3');
      expect(result.metadata.protocol).toBe('1.0');
      expect(result.metadata.status).toBe('Stable');
    });

    it('should throw ParseError on missing title', () => {
      const content = `
**Version**: 1.0.0
**Protocol Version**: 1.0
**Status**: Stable

## Objective
Test
      `.trim();

      expect(() => parser.parse(content, 'test.md')).toThrow(ParseError);
      expect(() => parser.parse(content, 'test.md')).toThrow(
        /Missing dossier title/
      );
    });

    it('should throw InvalidDossierError on missing version', () => {
      const content = `
# Dossier: Test

**Protocol Version**: 1.0
**Status**: Stable

## Objective
Test
      `.trim();

      expect(() => parser.parse(content, 'test.md')).toThrow(
        InvalidDossierError
      );
      expect(() => parser.parse(content, 'test.md')).toThrow(/Version/);
    });

    it('should throw InvalidDossierError on missing protocol', () => {
      const content = `
# Dossier: Test

**Version**: 1.0.0
**Status**: Stable

## Objective
Test
      `.trim();

      expect(() => parser.parse(content, 'test.md')).toThrow(
        InvalidDossierError
      );
      expect(() => parser.parse(content, 'test.md')).toThrow(
        /Protocol Version/
      );
    });

    it('should throw InvalidDossierError on missing status', () => {
      const content = `
# Dossier: Test

**Version**: 1.0.0
**Protocol Version**: 1.0

## Objective
Test
      `.trim();

      expect(() => parser.parse(content, 'test.md')).toThrow(
        InvalidDossierError
      );
      expect(() => parser.parse(content, 'test.md')).toThrow(/Status/);
    });

    it('should reject invalid semver versions', () => {
      const content = `
# Dossier: Test

**Version**: 1.0
**Protocol Version**: 1.0
**Status**: Stable

## Objective
Test
      `.trim();

      expect(() => parser.parse(content, 'test.md')).toThrow(
        InvalidDossierError
      );
      expect(() => parser.parse(content, 'test.md')).toThrow(
        /Invalid version format/
      );
    });

    it('should accept semver with pre-release tags', () => {
      const content = `
# Dossier: Test

**Version**: 1.0.0-beta.1
**Protocol Version**: 1.0
**Status**: Draft

## Objective
Test objective

## Prerequisites
- Test

## Actions to Perform
1. Test

## Validation
Success
      `.trim();

      const result = parser.parse(content, 'test.md');
      expect(result.metadata.version).toBe('1.0.0-beta.1');
    });
  });

  describe('parseSections', () => {
    it('should extract all sections from complete dossier', async () => {
      const content = await fs.readFile(
        path.join(fixturesDir, 'valid/complete-dossier.md'),
        'utf-8'
      );

      const result = parser.parse(content, 'complete-dossier.md');

      expect(result.sections.objective).toBeDefined();
      expect(result.sections.objective).toContain('complete dossier');

      expect(result.sections.prerequisites).toBeDefined();
      expect(result.sections.prerequisites).toContain('dependencies');

      expect(result.sections.context).toBeDefined();
      expect(result.sections.context).toContain('Project structure');

      expect(result.sections.decisions).toBeDefined();
      expect(result.sections.decisions).toContain('Deployment Target');

      expect(result.sections.actions).toBeDefined();
      expect(result.sections.actions).toContain('Validate prerequisites');

      expect(result.sections.validation).toBeDefined();
      expect(result.sections.validation).toContain('Success Criteria');

      expect(result.sections.examples).toBeDefined();
      expect(result.sections.examples).toContain('Expected Output');

      expect(result.sections.troubleshooting).toBeDefined();
      expect(result.sections.troubleshooting).toContain('Permission Denied');

      expect(result.sections.background).toBeDefined();
      expect(result.sections.rollback).toBeDefined();
      expect(result.sections.relatedDossiers).toBeDefined();
    });

    it('should extract required sections from simple dossier', async () => {
      const content = await fs.readFile(
        path.join(fixturesDir, 'valid/simple-dossier.md'),
        'utf-8'
      );

      const result = parser.parse(content, 'simple-dossier.md');

      expect(result.sections.objective).toBeDefined();
      expect(result.sections.prerequisites).toBeDefined();
      expect(result.sections.actions).toBeDefined();
      expect(result.sections.validation).toBeDefined();
    });

    it('should handle sections with special characters in title', () => {
      const content = `
# Dossier: Test

**Version**: 1.0.0
**Protocol Version**: 1.0
**Status**: Stable

## Objective
Test objective

## Prerequisites
Required items

## Context to Gather
Context information

## Actions to Perform
1. Do this
2. Do that

## Validation
Success criteria
      `.trim();

      const result = parser.parse(content, 'test.md');

      expect(result.sections.context).toBeDefined();
      expect(result.sections.context).toBe('Context information');
    });

    it('should handle empty sections gracefully', () => {
      const content = `
# Dossier: Test

**Version**: 1.0.0
**Protocol Version**: 1.0
**Status**: Stable

## Objective
Valid objective

## Prerequisites
- Required item

## Context to Gather

## Actions to Perform
1. Action

## Validation
Success
      `.trim();

      const result = parser.parse(content, 'test.md');

      // Empty optional section should be undefined
      expect(result.sections.context).toBeUndefined();
      // Non-empty sections should be defined
      expect(result.sections.objective).toBeDefined();
      expect(result.sections.prerequisites).toBeDefined();
      expect(result.sections.actions).toBeDefined();
    });
  });

  describe('validation', () => {
    it('should throw InvalidDossierError when required sections missing', async () => {
      const content = await fs.readFile(
        path.join(fixturesDir, 'invalid/no-sections.md'),
        'utf-8'
      );

      expect(() => parser.parse(content, 'no-sections.md')).toThrow(
        InvalidDossierError
      );
      expect(() => parser.parse(content, 'no-sections.md')).toThrow(
        /Missing required sections/
      );
    });

    it('should not validate when validateRequired is false', async () => {
      const content = await fs.readFile(
        path.join(fixturesDir, 'invalid/no-sections.md'),
        'utf-8'
      );

      // Should not throw
      const result = parser.parse(content, 'no-sections.md', {
        validateRequired: false,
      });

      expect(result.metadata.name).toBe('No Sections');
    });

    it('should include content when requested', async () => {
      const content = await fs.readFile(
        path.join(fixturesDir, 'valid/simple-dossier.md'),
        'utf-8'
      );

      const result = parser.parse(content, 'simple-dossier.md', {
        includeContent: true,
      });

      expect(result.content).toBe(content);
    });

    it('should exclude content when not requested', async () => {
      const content = await fs.readFile(
        path.join(fixturesDir, 'valid/simple-dossier.md'),
        'utf-8'
      );

      const result = parser.parse(content, 'simple-dossier.md', {
        includeContent: false,
      });

      expect(result.content).toBe('');
    });
  });

  describe('edge cases', () => {
    it('should handle Windows line endings', () => {
      const content = [
        '# Dossier: Test\r\n',
        '\r\n',
        '**Version**: 1.0.0\r\n',
        '**Protocol Version**: 1.0\r\n',
        '**Status**: Stable\r\n',
        '\r\n',
        '## Objective\r\n',
        'Test\r\n',
        '\r\n',
        '## Prerequisites\r\n',
        '- Item\r\n',
        '\r\n',
        '## Actions to Perform\r\n',
        '1. Action\r\n',
        '\r\n',
        '## Validation\r\n',
        'Success\r\n',
      ].join('');

      const result = parser.parse(content, 'test.md');

      expect(result.metadata.name).toBe('Test');
      expect(result.sections.objective).toBeDefined();
    });

    it('should handle multiple spaces in metadata', () => {
      const content = `
# Dossier:    Test With Spaces

**Version**:     1.0.0
**Protocol Version**:    1.0
**Status**:   Stable

## Objective
Test

## Prerequisites
- Item

## Actions to Perform
1. Action

## Validation
Success
      `.trim();

      const result = parser.parse(content, 'test.md');

      expect(result.metadata.name).toBe('Test With Spaces');
      expect(result.metadata.version).toBe('1.0.0');
    });

    it('should handle sections with code blocks', () => {
      const content = `
# Dossier: Test

**Version**: 1.0.0
**Protocol Version**: 1.0
**Status**: Stable

## Objective
Run tests

## Prerequisites
- Node.js

## Actions to Perform
Run the command:
\`\`\`bash
npm test
\`\`\`

## Validation
\`\`\`bash
echo "Success"
\`\`\`
      `.trim();

      const result = parser.parse(content, 'test.md');

      expect(result.sections.actions).toContain('npm test');
      expect(result.sections.validation).toContain('echo "Success"');
    });
  });
});
