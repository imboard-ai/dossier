/**
 * Signature verification for dossier authenticity
 * Uses minisign for Ed25519 signature verification
 * Based on tools/verify-dossier.js
 */

import { execSync } from 'child_process';
import { writeFileSync, unlinkSync, existsSync, readFileSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';
import { AuthenticityResult, DossierFrontmatter, TrustedKey } from '../types/dossier';
import { ExternalToolError } from '../utils/errors';
import { logger } from '../utils/logger';

/**
 * Load trusted keys from file
 * Default location: ~/.dossier/trusted-keys.txt
 * Format: <public-key> <key-id>
 */
export function loadTrustedKeys(filePath?: string): Map<string, string> {
  const keysPath = filePath || join(homedir(), '.dossier', 'trusted-keys.txt');
  const keys = new Map<string, string>();

  if (!existsSync(keysPath)) {
    logger.info('No trusted keys file found', { keysPath });
    return keys;
  }

  try {
    const content = readFileSync(keysPath, 'utf8');
    let lineNum = 0;

    for (const line of content.split('\n')) {
      lineNum++;
      const trimmed = line.trim();

      // Skip empty lines and comments
      if (!trimmed || trimmed.startsWith('#')) {
        continue;
      }

      // Parse: <public-key> <key-id>
      const parts = trimmed.split(/\s+/);
      if (parts.length >= 2) {
        const publicKey = parts[0];
        const keyId = parts.slice(1).join(' ');
        keys.set(publicKey, keyId);
        logger.debug('Loaded trusted key', { keyId, publicKey: publicKey.slice(0, 20) + '...' });
      } else {
        logger.warn('Invalid line in trusted keys file', { lineNum, line: trimmed });
      }
    }

    logger.info('Loaded trusted keys', { count: keys.size, keysPath });
  } catch (err) {
    logger.error('Failed to load trusted keys', {
      keysPath,
      error: (err as Error).message,
    });
  }

  return keys;
}

/**
 * Verify signature using minisign
 */
export function verifyWithMinisign(
  content: string,
  signature: string,
  publicKey: string
): boolean {
  // Check if minisign is installed
  try {
    execSync('which minisign', { stdio: 'ignore' });
  } catch (err) {
    throw new ExternalToolError(
      'minisign',
      'minisign not found. Install it with: brew install minisign (macOS) or apt-get install minisign (Linux)'
    );
  }

  // Create temporary files
  const timestamp = Date.now();
  const tempContent = `/tmp/dossier-verify-content-${timestamp}.txt`;
  const tempSig = `/tmp/dossier-verify-sig-${timestamp}.minisig`;
  const tempPubKey = `/tmp/dossier-verify-key-${timestamp}.pub`;

  try {
    writeFileSync(tempContent, content, 'utf8');
    writeFileSync(tempSig, signature, 'utf8');
    // Minisign public key file format requires untrusted comment line
    writeFileSync(tempPubKey, `untrusted comment: dossier verification\n${publicKey}\n`, 'utf8');

    logger.debug('Verifying signature with minisign', {
      contentLength: content.length,
      publicKey: publicKey.slice(0, 20) + '...',
    });

    // Verify with minisign
    execSync(`minisign -V -p "${tempPubKey}" -m "${tempContent}" -x "${tempSig}"`, {
      stdio: 'pipe',
    });

    // Clean up
    unlinkSync(tempContent);
    unlinkSync(tempSig);
    unlinkSync(tempPubKey);

    logger.info('Signature verification PASSED');
    return true;
  } catch (err) {
    // Clean up on error
    if (existsSync(tempContent)) unlinkSync(tempContent);
    if (existsSync(tempSig)) unlinkSync(tempSig);
    if (existsSync(tempPubKey)) unlinkSync(tempPubKey);

    logger.warn('Signature verification FAILED', {
      error: (err as Error).message,
    });
    return false;
  }
}

/**
 * Verify dossier authenticity (signature + trust)
 */
export function verifyAuthenticity(
  body: string,
  frontmatter: DossierFrontmatter,
  trustedKeysPath?: string
): AuthenticityResult {
  const signature = frontmatter.signature;

  // No signature present
  if (!signature) {
    logger.info('No signature found in dossier');
    return {
      status: 'unsigned',
      message: 'No signature found - authenticity cannot be verified',
      isTrusted: false,
    };
  }

  // Load trusted keys
  const trustedKeys = loadTrustedKeys(trustedKeysPath);
  const isTrusted = trustedKeys.has(signature.public_key);
  const trustedAs = isTrusted ? trustedKeys.get(signature.public_key) : undefined;

  // Verify signature with minisign
  try {
    const isValid = verifyWithMinisign(body, signature.signature, signature.public_key);

    if (!isValid) {
      logger.error('SIGNATURE VERIFICATION FAILED');
      return {
        status: 'invalid',
        message: 'SIGNATURE VERIFICATION FAILED',
        signer: signature.signed_by,
        keyId: signature.key_id,
        publicKey: signature.public_key,
        isTrusted,
        trustedAs,
      };
    }

    // Signature is valid - check if trusted
    if (isTrusted) {
      logger.info('Verified signature from TRUSTED source', { trustedAs });
      return {
        status: 'verified',
        message: `Verified signature from trusted source: ${trustedAs}`,
        signer: signature.signed_by,
        keyId: signature.key_id,
        publicKey: signature.public_key,
        isTrusted: true,
        trustedAs,
      };
    } else {
      logger.warn('Valid signature but key is NOT in trusted list');
      return {
        status: 'signed_unknown',
        message: 'Valid signature but key is not in trusted list',
        signer: signature.signed_by,
        keyId: signature.key_id,
        publicKey: signature.public_key,
        isTrusted: false,
      };
    }
  } catch (err) {
    logger.error('Signature verification error', {
      error: (err as Error).message,
    });
    return {
      status: 'error',
      message: `Verification error: ${(err as Error).message}`,
      signer: signature.signed_by,
      keyId: signature.key_id,
      publicKey: signature.public_key,
      isTrusted,
      trustedAs,
    };
  }
}
