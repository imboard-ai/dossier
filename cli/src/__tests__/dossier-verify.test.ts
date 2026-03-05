import { createHash } from 'node:crypto';
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// The dossier-verify bin file uses require() for @ai-dossier/core,
// so vi.mock doesn't intercept it. We test with the real core library.
const { parseDossier, verifyChecksum, verifyDossier } = require('../../bin/dossier-verify');

function sha256(content: string): string {
  return createHash('sha256').update(content, 'utf8').digest('hex');
}

describe('dossier-verify: parseDossier', () => {
  it('should parse JSON frontmatter and body', () => {
    const content = '---dossier\n{"title":"Test","version":"1.0.0"}\n---\n# Body';
    const result = parseDossier(content);

    expect(result.frontmatter.title).toBe('Test');
    expect(result.frontmatter.version).toBe('1.0.0');
    expect(result.body).toBe('# Body');
  });

  it('should throw on invalid format', () => {
    expect(() => parseDossier('no frontmatter here')).toThrow();
  });
});

describe('dossier-verify: verifyChecksum', () => {
  it('should return passed when checksum matches', () => {
    const body = '# Test Body\n\nSome content.';
    const hash = sha256(body);

    const result = verifyChecksum(body, hash);

    expect(result.passed).toBe(true);
    expect(result.actual).toBe(hash);
    expect(result.declared).toBe(hash);
  });

  it('should return failed when checksum does not match', () => {
    const body = '# Test Body\n\nSome content.';
    const wrongHash = 'deadbeef';

    const result = verifyChecksum(body, wrongHash);

    expect(result.passed).toBe(false);
    expect(result.declared).toBe(wrongHash);
    expect(result.actual).toBe(sha256(body));
  });
});

describe('dossier-verify: verifyDossier', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = join(tmpdir(), `dossier-verify-test-${Date.now()}`);
    mkdirSync(tempDir, { recursive: true });
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
    rmSync(tempDir, { recursive: true, force: true });
  });

  function makeDossier(body: string, extra: Record<string, unknown> = {}): string {
    const hash = sha256(body);
    const fm = {
      title: 'Test',
      version: '1.0.0',
      checksum: { algorithm: 'sha256', hash },
      ...extra,
    };
    return `---dossier\n${JSON.stringify(fm, null, 2)}\n---\n${body}`;
  }

  it('should return true for valid dossier with correct checksum', async () => {
    const body = '# Test\n\nValid dossier content.';
    const filePath = join(tempDir, 'valid.ds.md');
    writeFileSync(filePath, makeDossier(body));

    const result = await verifyDossier(filePath, { verbose: false });
    expect(result).toBe(true);
  });

  it('should return false for tampered content', async () => {
    const body = '# Test\n\nOriginal content.';
    const content = makeDossier(body);
    const tampered = content.replace('Original content.', 'Tampered content!');
    const filePath = join(tempDir, 'tampered.ds.md');
    writeFileSync(filePath, tampered);

    const result = await verifyDossier(filePath, { verbose: false });
    expect(result).toBe(false);
  });

  it('should return false when file does not exist', async () => {
    const result = await verifyDossier('/nonexistent/path.ds.md', { verbose: false });
    expect(result).toBe(false);
  });

  it('should handle verbose mode without error', async () => {
    const body = '# Test\n\nVerbose test.';
    const filePath = join(tempDir, 'verbose.ds.md');
    writeFileSync(filePath, makeDossier(body));

    const result = await verifyDossier(filePath, { verbose: true });
    expect(result).toBe(true);
  });

  it('should allow unsigned dossier with default risk', async () => {
    const body = '# Unsigned\n\nNo signature.';
    const filePath = join(tempDir, 'unsigned.ds.md');
    writeFileSync(filePath, makeDossier(body));

    const result = await verifyDossier(filePath, { verbose: false });
    expect(result).toBe(true);
  });

  it('should proceed for critical-risk unsigned dossier with valid checksum', async () => {
    const body = '# Critical\n\nHigh risk content.';
    const filePath = join(tempDir, 'critical.ds.md');
    writeFileSync(filePath, makeDossier(body, { risk_level: 'critical' }));

    const result = await verifyDossier(filePath, { verbose: false });
    expect(result).toBe(true);
  });
});
