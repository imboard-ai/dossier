import { mkdirSync, unlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { parseDossierContent, parseDossierFile, validateFrontmatter } from '../parser';

describe('parseDossierContent', () => {
  it('should parse valid dossier with minimal frontmatter', () => {
    const content = `---dossier
{
  "version": "1.0.0",
  "protocol_version": "1.0",
  "title": "Test Dossier",
  "objective": "Test parsing",
  "risk_level": "low",
  "risk_factors": [],
  "destructive_operations": []
}
---
# Body content
This is the markdown body.`;

    const result = parseDossierContent(content);

    expect(result.frontmatter.version).toBe('1.0.0');
    expect(result.frontmatter.title).toBe('Test Dossier');
    expect(result.body).toContain('# Body content');
    expect(result.body).toContain('This is the markdown body.');
    expect(result.raw).toBe(content);
  });

  it('should parse dossier with complex frontmatter', () => {
    const content = `---dossier
{
  "version": "1.0.0",
  "protocol_version": "1.0",
  "title": "Complex Test",
  "objective": "Test complex parsing",
  "risk_level": "high",
  "risk_factors": ["data_loss", "security"],
  "destructive_operations": ["delete_files"],
  "checksum": "abc123",
  "signature": {
    "algorithm": "minisign",
    "signature": "sig123",
    "public_key": "key123",
    "signed_at": "2024-11-17T00:00:00Z"
  }
}
---
# Complex body
Multiple lines
With various content`;

    const result = parseDossierContent(content);

    expect(result.frontmatter.risk_level).toBe('high');
    expect(result.frontmatter.risk_factors).toEqual(['data_loss', 'security']);
    expect(result.frontmatter.destructive_operations).toEqual(['delete_files']);
    expect(result.frontmatter.checksum).toBe('abc123');
    expect(result.frontmatter.signature?.algorithm).toBe('minisign');
  });

  it('should reject invalid frontmatter JSON', () => {
    const content = `---dossier
{ invalid json, missing quotes }
---
body`;

    expect(() => parseDossierContent(content)).toThrow('Failed to parse frontmatter JSON');
  });

  it('should reject missing frontmatter', () => {
    const content = '# Just markdown without frontmatter';

    expect(() => parseDossierContent(content)).toThrow('Invalid dossier format');
  });

  it('should reject malformed frontmatter delimiter', () => {
    const content = `---
{
  "version": "1.0.0"
}
---
body`;

    expect(() => parseDossierContent(content)).toThrow('Invalid dossier format');
  });

  it('should handle empty body', () => {
    const content = `---dossier
{
  "version": "1.0.0",
  "protocol_version": "1.0",
  "title": "Test",
  "objective": "Test",
  "risk_level": "low",
  "risk_factors": [],
  "destructive_operations": []
}
---
`;

    const result = parseDossierContent(content);
    expect(result.body).toBe('');
  });

  it('should handle frontmatter with extra whitespace', () => {
    const content = `---dossier

{
  "version": "1.0.0",
  "protocol_version": "1.0",
  "title": "Test",
  "objective": "Test",
  "risk_level": "low",
  "risk_factors": [],
  "destructive_operations": []
}

---

# Body`;

    const result = parseDossierContent(content);
    expect(result.frontmatter.version).toBe('1.0.0');
    expect(result.body).toContain('# Body');
  });
});

describe('parseDossierFile', () => {
  it('should read and parse a valid dossier file', () => {
    const tempDir = join(tmpdir(), `dossier-test-${Date.now()}`);
    mkdirSync(tempDir, { recursive: true });
    const testFile = join(tempDir, 'test.ds.md');

    const content = `---dossier
{
  "version": "1.0.0",
  "protocol_version": "1.0",
  "title": "File Test",
  "objective": "Test file parsing",
  "risk_level": "low",
  "risk_factors": [],
  "destructive_operations": []
}
---
# Test body`;

    writeFileSync(testFile, content, 'utf8');

    const result = parseDossierFile(testFile);

    expect(result.frontmatter.title).toBe('File Test');
    expect(result.body).toContain('# Test body');

    // Cleanup
    unlinkSync(testFile);
  });

  it('should throw error for non-existent file', () => {
    const nonExistentPath = '/tmp/nonexistent-dossier.ds.md';

    expect(() => parseDossierFile(nonExistentPath)).toThrow('Dossier file not found');
  });
});

describe('validateFrontmatter', () => {
  it('should pass validation for complete valid frontmatter', () => {
    const frontmatter: any = {
      version: '1.0.0',
      protocol_version: '1.0',
      title: 'Valid Dossier',
      objective: 'Test validation',
      risk_level: 'low',
      risk_factors: [],
      destructive_operations: [],
    };

    const errors = validateFrontmatter(frontmatter);
    expect(errors).toHaveLength(0);
  });

  it('should detect missing required fields', () => {
    const frontmatter: any = {
      version: '1.0.0',
      title: 'Incomplete Dossier',
      // Missing: protocol_version, objective, risk_level, risk_factors, destructive_operations
    };

    const errors = validateFrontmatter(frontmatter);

    expect(errors).toContain('Missing required field: protocol_version');
    expect(errors).toContain('Missing required field: objective');
    expect(errors).toContain('Missing required field: risk_level');
    expect(errors).toContain('Missing required field: risk_factors');
    expect(errors).toContain('Missing required field: destructive_operations');
  });

  it('should reject invalid risk_level', () => {
    const frontmatter: any = {
      version: '1.0.0',
      protocol_version: '1.0',
      title: 'Test',
      objective: 'Test',
      risk_level: 'invalid_level',
      risk_factors: [],
      destructive_operations: [],
    };

    const errors = validateFrontmatter(frontmatter);

    expect(errors).toContain(
      'Invalid risk_level: invalid_level. Must be one of: low, medium, high, critical'
    );
  });

  it('should accept all valid risk levels', () => {
    const validLevels = ['low', 'medium', 'high', 'critical'];

    for (const level of validLevels) {
      const frontmatter: any = {
        version: '1.0.0',
        protocol_version: '1.0',
        title: 'Test',
        objective: 'Test',
        risk_level: level,
        risk_factors: [],
        destructive_operations: [],
      };

      const errors = validateFrontmatter(frontmatter);
      expect(errors).toHaveLength(0);
    }
  });

  it('should reject invalid status', () => {
    const frontmatter: any = {
      version: '1.0.0',
      protocol_version: '1.0',
      title: 'Test',
      objective: 'Test',
      risk_level: 'low',
      risk_factors: [],
      destructive_operations: [],
      status: 'invalid_status',
    };

    const errors = validateFrontmatter(frontmatter);

    expect(errors).toContain(
      'Invalid status: invalid_status. Must be one of: draft, stable, deprecated'
    );
  });

  it('should accept all valid statuses', () => {
    const validStatuses = ['draft', 'stable', 'deprecated'];

    for (const status of validStatuses) {
      const frontmatter: any = {
        version: '1.0.0',
        protocol_version: '1.0',
        title: 'Test',
        objective: 'Test',
        risk_level: 'low',
        risk_factors: [],
        destructive_operations: [],
        status,
      };

      const errors = validateFrontmatter(frontmatter);
      expect(errors).toHaveLength(0);
    }
  });

  it('should allow optional status field', () => {
    const frontmatter: any = {
      version: '1.0.0',
      protocol_version: '1.0',
      title: 'Test',
      objective: 'Test',
      risk_level: 'low',
      risk_factors: [],
      destructive_operations: [],
      // status is optional
    };

    const errors = validateFrontmatter(frontmatter);
    expect(errors).toHaveLength(0);
  });
});
