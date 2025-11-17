import { describe, it, expect } from 'vitest';
import { loadTrustedKeys, verifyWithMinisign } from '../signature';
import { writeFileSync, unlinkSync, mkdirSync, existsSync, rmSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

describe('loadTrustedKeys', () => {
  const createTempDir = () => {
    const dir = join(tmpdir(), `dossier-test-${Date.now()}-${Math.random()}`);
    mkdirSync(dir, { recursive: true });
    return dir;
  };

  const cleanup = (path: string) => {
    if (existsSync(path)) {
      rmSync(path, { recursive: true, force: true });
    }
  };

  it('should load trusted keys from file', () => {
    const tempDir = createTempDir();
    const keysFile = join(tempDir, 'trusted-keys.txt');

    writeFileSync(keysFile, `RWTKey1== official-key-1
RWTKey2== official-key-2`, 'utf8');

    const keys = loadTrustedKeys(keysFile);

    expect(keys.size).toBe(2);
    expect(keys.get('RWTKey1==')).toBe('official-key-1');
    expect(keys.get('RWTKey2==')).toBe('official-key-2');

    cleanup(tempDir);
  });

  it('should skip empty lines', () => {
    const tempDir = createTempDir();
    const keysFile = join(tempDir, 'trusted-keys.txt');

    writeFileSync(keysFile, `RWTKey1== key-1

RWTKey2== key-2

`, 'utf8');

    const keys = loadTrustedKeys(keysFile);

    expect(keys.size).toBe(2);
    expect(keys.get('RWTKey1==')).toBe('key-1');
    expect(keys.get('RWTKey2==')).toBe('key-2');

    cleanup(tempDir);
  });

  it('should skip comment lines starting with #', () => {
    const tempDir = createTempDir();
    const keysFile = join(tempDir, 'trusted-keys.txt');

    writeFileSync(keysFile, `# This is a comment
RWTKey1== key-1
# Another comment
RWTKey2== key-2`, 'utf8');

    const keys = loadTrustedKeys(keysFile);

    expect(keys.size).toBe(2);
    expect(keys.get('RWTKey1==')).toBe('key-1');

    cleanup(tempDir);
  });

  it('should handle key IDs with spaces', () => {
    const tempDir = createTempDir();
    const keysFile = join(tempDir, 'trusted-keys.txt');

    writeFileSync(keysFile, `RWTKey1== Official Key Name
RWTKey2== Another Key With Spaces`, 'utf8');

    const keys = loadTrustedKeys(keysFile);

    expect(keys.size).toBe(2);
    expect(keys.get('RWTKey1==')).toBe('Official Key Name');
    expect(keys.get('RWTKey2==')).toBe('Another Key With Spaces');

    cleanup(tempDir);
  });

  it('should handle missing file gracefully', () => {
    const nonExistentPath = '/tmp/nonexistent-dossier-keys-12345.txt';

    const keys = loadTrustedKeys(nonExistentPath);

    expect(keys.size).toBe(0);
  });

  it('should return empty map for empty file', () => {
    const tempDir = createTempDir();
    const keysFile = join(tempDir, 'trusted-keys.txt');

    writeFileSync(keysFile, '', 'utf8');

    const keys = loadTrustedKeys(keysFile);

    expect(keys.size).toBe(0);

    cleanup(tempDir);
  });

  it('should return empty map for file with only comments', () => {
    const tempDir = createTempDir();
    const keysFile = join(tempDir, 'trusted-keys.txt');

    writeFileSync(keysFile, `# Comment 1
# Comment 2
# Comment 3`, 'utf8');

    const keys = loadTrustedKeys(keysFile);

    expect(keys.size).toBe(0);

    cleanup(tempDir);
  });

  it('should skip lines with only whitespace', () => {
    const tempDir = createTempDir();
    const keysFile = join(tempDir, 'trusted-keys.txt');

    writeFileSync(keysFile, `RWTKey1== key-1


RWTKey2== key-2`, 'utf8');

    const keys = loadTrustedKeys(keysFile);

    expect(keys.size).toBe(2);

    cleanup(tempDir);
  });

  it('should handle malformed lines gracefully', () => {
    const tempDir = createTempDir();
    const keysFile = join(tempDir, 'trusted-keys.txt');

    // Lines without space delimiter should be skipped
    writeFileSync(keysFile, `RWTKey1== key-1
InvalidLineWithoutSpace
RWTKey2== key-2`, 'utf8');

    const keys = loadTrustedKeys(keysFile);

    // Should only load valid lines
    expect(keys.size).toBe(2);
    expect(keys.get('RWTKey1==')).toBe('key-1');
    expect(keys.get('RWTKey2==')).toBe('key-2');

    cleanup(tempDir);
  });

  it('should trim whitespace from keys and IDs', () => {
    const tempDir = createTempDir();
    const keysFile = join(tempDir, 'trusted-keys.txt');

    writeFileSync(keysFile, `  RWTKey1==   key-1
	RWTKey2==	key-2	`, 'utf8');

    const keys = loadTrustedKeys(keysFile);

    expect(keys.size).toBe(2);
    expect(keys.get('RWTKey1==')).toBe('key-1');
    expect(keys.get('RWTKey2==')).toBe('key-2');

    cleanup(tempDir);
  });

  it('should handle multiple keys correctly', () => {
    const tempDir = createTempDir();
    const keysFile = join(tempDir, 'trusted-keys.txt');

    const manyKeys = Array.from({ length: 100 }, (_, i) =>
      `RWTKey${i}== key-${i}`
    ).join('\n');

    writeFileSync(keysFile, manyKeys, 'utf8');

    const keys = loadTrustedKeys(keysFile);

    expect(keys.size).toBe(100);
    expect(keys.get('RWTKey0==')).toBe('key-0');
    expect(keys.get('RWTKey99==')).toBe('key-99');

    cleanup(tempDir);
  });
});

describe('verifyWithMinisign', () => {
  it('should reject invalid signature format', () => {
    const content = 'test content';
    const invalidSignature = 'not-a-valid-signature';
    const invalidPublicKey = 'not-a-valid-key';

    const result = verifyWithMinisign(content, invalidSignature, invalidPublicKey);

    expect(result).toBe(false);
  });

  it('should reject empty signature', () => {
    const content = 'test content';
    const result = verifyWithMinisign(content, '', '');

    expect(result).toBe(false);
  });

  it('should handle malformed base64 signature gracefully', () => {
    const content = 'test content';
    const malformedSignature = 'not-base64!!!';
    const malformedKey = 'also-not-base64!!!';

    const result = verifyWithMinisign(content, malformedSignature, malformedKey);

    expect(result).toBe(false);
  });

  it('should reject signature with wrong length', () => {
    const content = 'test content';
    // Valid base64 but wrong length for Ed25519 signature
    const shortSignature = Buffer.from('short').toString('base64');
    const shortKey = Buffer.from('key').toString('base64');

    const result = verifyWithMinisign(content, shortSignature, shortKey);

    expect(result).toBe(false);
  });

  it('should handle empty content', () => {
    const content = '';
    const signature = 'dGVzdA=='; // base64 "test"
    const publicKey = 'a2V5'; // base64 "key"

    const result = verifyWithMinisign(content, signature, publicKey);

    expect(result).toBe(false);
  });

  // Note: Real minisign signature tests are in Step 2.5
  it.skip('should verify valid minisign signature (tested in Step 2.5)', () => {
    // This will be tested with real minisign-generated signatures
  });
});

describe('verifyWithKms', () => {
  // KMS tests require AWS credentials and are integration tests
  // We'll skip them for now and add proper mocking later if needed

  it.skip('should verify valid KMS signature (requires AWS credentials)', () => {
    // Integration test - requires real AWS KMS access
  });

  it.skip('should reject invalid KMS signature (requires AWS credentials)', () => {
    // Integration test - requires real AWS KMS access
  });

  it.skip('should handle KMS errors gracefully (requires mocking)', () => {
    // Would require mocking AWS SDK
  });
});
