/**
 * Cryptographic utilities for dossier operations
 */

import { createHash } from 'node:crypto';

/**
 * Calculate SHA256 hash of content
 * @param content - String content to hash
 * @returns Buffer containing the hash
 */
export function sha256Hash(content: string): Buffer {
  return createHash('sha256').update(content, 'utf8').digest();
}

/**
 * Calculate SHA256 hash of content as hex string
 * @param content - String content to hash
 * @returns Hex string of the hash
 */
export function sha256Hex(content: string): string {
  return sha256Hash(content).toString('hex');
}
