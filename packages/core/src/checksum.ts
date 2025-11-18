/**
 * Checksum verification for dossier integrity
 * Uses SHA256 hash of the body content (excluding frontmatter)
 */

import { createHash } from 'node:crypto';
import type { IntegrityResult } from './types';

/**
 * Calculate SHA256 hash of dossier body
 * CRITICAL: Hash is of the BODY only (after ---), not the entire file
 */
export function calculateChecksum(body: string): string {
  return createHash('sha256').update(body, 'utf8').digest('hex');
}

/**
 * Verify dossier integrity by comparing checksums
 */
export function verifyIntegrity(body: string, expectedHash: string | undefined): IntegrityResult {
  if (!expectedHash) {
    return {
      status: 'missing',
      message: 'No checksum found in dossier - cannot verify integrity',
    };
  }

  const actualHash = calculateChecksum(body);

  if (actualHash === expectedHash) {
    return {
      status: 'valid',
      message: 'Checksum matches - content has not been tampered with',
      expectedHash,
      actualHash,
    };
  } else {
    return {
      status: 'invalid',
      message: 'CHECKSUM MISMATCH - dossier has been tampered with!',
      expectedHash,
      actualHash,
    };
  }
}
