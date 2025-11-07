/**
 * dossier://security resource
 * Provides the Security Architecture documentation to LLM context
 */

import { readFileSync } from 'fs';
import { join } from 'path';
import { logger } from '../utils/logger';

/**
 * Get security/ARCHITECTURE.md content
 * Path: ../../../security/ARCHITECTURE.md (relative to this file)
 */
export function getSecurityResource(): string {
  const securityPath = join(__dirname, '../../../..', 'security', 'ARCHITECTURE.md');

  try {
    const content = readFileSync(securityPath, 'utf8');
    logger.debug('Loaded security resource', {
      path: securityPath,
      length: content.length,
    });
    return content;
  } catch (err) {
    logger.error('Failed to load security/ARCHITECTURE.md', {
      path: securityPath,
      error: (err as Error).message,
    });
    throw new Error(`Failed to load security/ARCHITECTURE.md: ${(err as Error).message}`);
  }
}
