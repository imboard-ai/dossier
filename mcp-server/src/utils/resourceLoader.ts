/**
 * Resource file loader utility
 * Loads markdown files from the project with logging
 */

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { getErrorMessage } from '@imboard-ai/dossier-core';
import { logger } from './logger';

/**
 * Load a markdown resource file with logging
 * @param relativePath - Path relative to project root (e.g., 'PROTOCOL.md', 'security/ARCHITECTURE.md')
 * @param resourceName - Human-readable name for logging (e.g., 'protocol', 'security')
 * @returns File content as string
 * @throws Error if file cannot be loaded
 */
export function loadMarkdownResource(relativePath: string, resourceName: string): string {
  const fullPath = join(__dirname, '../../..', relativePath);

  try {
    const content = readFileSync(fullPath, 'utf8');
    logger.debug(`Loaded ${resourceName} resource`, {
      path: fullPath,
      length: content.length,
    });
    return content;
  } catch (err) {
    logger.error(`Failed to load ${relativePath}`, {
      path: fullPath,
      error: getErrorMessage(err),
    });
    throw new Error(`Failed to load ${relativePath}: ${getErrorMessage(err)}`);
  }
}
