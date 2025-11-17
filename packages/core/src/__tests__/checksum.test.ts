import { describe, it, expect } from 'vitest';
import { calculateChecksum, verifyIntegrity } from '../checksum';

describe('calculateChecksum', () => {
  it('should calculate SHA256 hash correctly', () => {
    const hash = calculateChecksum('hello world');
    expect(hash).toBe('b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9');
  });

  it('should be deterministic - same input produces same hash', () => {
    const content = 'test content for determinism check';
    const hash1 = calculateChecksum(content);
    const hash2 = calculateChecksum(content);
    const hash3 = calculateChecksum(content);

    expect(hash1).toBe(hash2);
    expect(hash2).toBe(hash3);
  });

  it('should handle empty string', () => {
    const hash = calculateChecksum('');
    expect(hash).toBe('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
  });

  it('should produce different hashes for different content', () => {
    const hash1 = calculateChecksum('content A');
    const hash2 = calculateChecksum('content B');

    expect(hash1).not.toBe(hash2);
  });

  it('should be case-sensitive', () => {
    const hash1 = calculateChecksum('Hello World');
    const hash2 = calculateChecksum('hello world');

    expect(hash1).not.toBe(hash2);
  });

  it('should handle whitespace differences', () => {
    const hash1 = calculateChecksum('hello world');
    const hash2 = calculateChecksum('hello  world'); // double space
    const hash3 = calculateChecksum('hello\nworld'); // newline

    expect(hash1).not.toBe(hash2);
    expect(hash1).not.toBe(hash3);
    expect(hash2).not.toBe(hash3);
  });

  it('should handle multiline content', () => {
    const content = `# Dossier Body
This is line 1
This is line 2
This is line 3`;

    const hash = calculateChecksum(content);

    // Should produce consistent hash
    expect(hash).toBe(calculateChecksum(content));
    expect(hash).toHaveLength(64); // SHA256 produces 64 hex chars
  });

  it('should handle special characters', () => {
    const content = 'Special chars: !@#$%^&*()_+-={}[]|\\:";\'<>?,./';
    const hash = calculateChecksum(content);

    expect(hash).toHaveLength(64);
    expect(hash).toMatch(/^[a-f0-9]{64}$/); // Valid hex
  });

  it('should handle unicode content', () => {
    const content = 'Unicode: 你好世界 🚀 émojis';
    const hash = calculateChecksum(content);

    expect(hash).toHaveLength(64);
    expect(hash).toMatch(/^[a-f0-9]{64}$/);
  });

  it('should produce valid hex output', () => {
    const hash = calculateChecksum('any content');

    expect(hash).toHaveLength(64);
    expect(hash).toMatch(/^[a-f0-9]{64}$/);
  });
});

describe('verifyIntegrity', () => {
  it('should pass verification with matching checksum', () => {
    const body = 'This is the dossier body content';
    const hash = calculateChecksum(body);

    const result = verifyIntegrity(body, hash);

    expect(result.status).toBe('valid');
    expect(result.message).toContain('not been tampered');
    expect(result.expectedHash).toBe(hash);
    expect(result.actualHash).toBe(hash);
  });

  it('should fail verification with mismatched checksum', () => {
    const body = 'This is the original content';
    const wrongHash = 'abc123'; // Invalid hash

    const result = verifyIntegrity(body, wrongHash);

    expect(result.status).toBe('invalid');
    expect(result.message).toContain('CHECKSUM MISMATCH');
    expect(result.message).toContain('tampered');
    expect(result.expectedHash).toBe(wrongHash);
    expect(result.actualHash).toBe(calculateChecksum(body));
    expect(result.actualHash).not.toBe(wrongHash);
  });

  it('should detect tampered content', () => {
    const originalBody = 'Original content';
    const tamperedBody = 'Tampered content';
    const originalHash = calculateChecksum(originalBody);

    const result = verifyIntegrity(tamperedBody, originalHash);

    expect(result.status).toBe('invalid');
    expect(result.expectedHash).toBe(originalHash);
    expect(result.actualHash).toBe(calculateChecksum(tamperedBody));
    expect(result.actualHash).not.toBe(originalHash);
  });

  it('should detect even small changes', () => {
    const original = 'This is a test.';
    const modified = 'This is a test!'; // Changed period to exclamation
    const hash = calculateChecksum(original);

    const result = verifyIntegrity(modified, hash);

    expect(result.status).toBe('invalid');
  });

  it('should handle missing checksum', () => {
    const body = 'Some content';

    const result = verifyIntegrity(body, undefined);

    expect(result.status).toBe('missing');
    expect(result.message).toContain('No checksum found');
    expect(result.message).toContain('cannot verify');
    expect(result.expectedHash).toBeUndefined();
    expect(result.actualHash).toBeUndefined();
  });

  it('should handle empty string with valid hash', () => {
    const body = '';
    const hash = calculateChecksum(body);

    const result = verifyIntegrity(body, hash);

    expect(result.status).toBe('valid');
    expect(result.actualHash).toBe('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
  });

  it('should be case-sensitive in verification', () => {
    const body = 'Hello World';
    const hash = calculateChecksum(body);
    const modifiedBody = 'hello world'; // Different case

    const result = verifyIntegrity(modifiedBody, hash);

    expect(result.status).toBe('invalid');
  });

  it('should detect whitespace changes', () => {
    const body = 'Line 1\nLine 2';
    const hash = calculateChecksum(body);
    const modified = 'Line 1\n\nLine 2'; // Added extra newline

    const result = verifyIntegrity(modified, hash);

    expect(result.status).toBe('invalid');
  });

  it('should verify complex multiline content', () => {
    const body = `# Header

## Section 1
Content here with **markdown**.

## Section 2
More content:
- Item 1
- Item 2
- Item 3

\`\`\`bash
echo "code block"
\`\`\`

Final paragraph.`;

    const hash = calculateChecksum(body);
    const result = verifyIntegrity(body, hash);

    expect(result.status).toBe('valid');
  });

  it('should verify content with special characters', () => {
    const body = 'Special: !@#$%^&*()';
    const hash = calculateChecksum(body);
    const result = verifyIntegrity(body, hash);

    expect(result.status).toBe('valid');
  });

  it('should verify unicode content correctly', () => {
    const body = 'Unicode: 你好 🌍 café';
    const hash = calculateChecksum(body);
    const result = verifyIntegrity(body, hash);

    expect(result.status).toBe('valid');
  });
});
