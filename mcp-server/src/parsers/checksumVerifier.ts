/**
 * Checksum verification for dossier integrity
 * Uses SHA256 hash of the body content (excluding frontmatter)
 * Based on tools/verify-dossier.js
 */

import { createHash } from 'crypto';
import { IntegrityResult } from '../types/dossier';
import { logger } from '../utils/logger';

/**
 * Calculate SHA256 hash of dossier body
 * CRITICAL: Hash is of the BODY only (after ---), not the entire file
 */
export function calculateChecksum(body: string): string {
  const hash = createHash('sha256').update(body, 'utf8').digest('hex');
  logger.debug('Calculated checksum', { hash, bodyLength: body.length });
  return hash;
}

/**
 * Verify dossier integrity by comparing checksums
 */
export function verifyIntegrity(
  body: string,
  expectedHash: string | undefined
): IntegrityResult {
  if (!expectedHash) {
    logger.warn('No checksum found in dossier');
    return {
      status: 'missing',
      message: 'No checksum found in dossier - cannot verify integrity',
    };
  }

  const actualHash = calculateChecksum(body);

  if (actualHash === expectedHash) {
    logger.info('Checksum verification passed', { expectedHash, actualHash });
    return {
      status: 'valid',
      message: 'Checksum matches - content has not been tampered with',
      expectedHash,
      actualHash,
    };
  } else {
    logger.error('CHECKSUM MISMATCH - dossier has been tampered with!', {
      expectedHash,
      actualHash,
    });
    return {
      status: 'invalid',
      message: 'CHECKSUM MISMATCH - dossier has been tampered with!',
      expectedHash,
      actualHash,
    };
  }
}
