/**
 * dossier://protocol resource
 * Provides the Dossier Execution Protocol to LLM context
 */

import { readFileSync } from 'fs';
import { join } from 'path';
import { logger } from '../utils/logger';

/**
 * Get PROTOCOL.md content
 * Path: ../../../PROTOCOL.md (relative to this file)
 */
export function getProtocolResource(): string {
  const protocolPath = join(__dirname, '../../../..', 'PROTOCOL.md');

  try {
    const content = readFileSync(protocolPath, 'utf8');
    logger.debug('Loaded protocol resource', {
      path: protocolPath,
      length: content.length,
    });
    return content;
  } catch (err) {
    logger.error('Failed to load PROTOCOL.md', {
      path: protocolPath,
      error: (err as Error).message,
    });
    throw new Error(`Failed to load PROTOCOL.md: ${(err as Error).message}`);
  }
}
