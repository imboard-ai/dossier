/**
 * dossier://concept resource
 * Provides an introduction to the dossier concept (condensed README.md)
 */

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { logger } from '../utils/logger';

/**
 * Get condensed concept/introduction from README.md
 * For MVP, we'll just return the full README.md
 * TODO: Create a condensed version focusing on "what/why/when"
 */
export function getConceptResource(): string {
  const readmePath = join(__dirname, '../../../..', 'README.md');

  try {
    const content = readFileSync(readmePath, 'utf8');
    logger.debug('Loaded concept resource', {
      path: readmePath,
      length: content.length,
    });
    return content;
  } catch (err) {
    logger.error('Failed to load README.md', {
      path: readmePath,
      error: (err as Error).message,
    });
    throw new Error(`Failed to load README.md: ${(err as Error).message}`);
  }
}
