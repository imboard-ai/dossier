/**
 * File system utilities for dossier operations
 */

import { existsSync, readFileSync } from 'node:fs';

/**
 * Read a file if it exists, optionally throwing an error if not found
 * @param filePath - Path to the file
 * @param errorMessage - Optional error message template (use {path} as placeholder)
 * @returns File content as string, or null if file doesn't exist and no errorMessage provided
 * @throws Error if file doesn't exist and errorMessage is provided
 */
export function readFileIfExists(filePath: string, errorMessage?: string): string | null {
  if (!existsSync(filePath)) {
    if (errorMessage) {
      throw new Error(errorMessage.replace('{path}', filePath));
    }
    return null;
  }
  return readFileSync(filePath, 'utf8');
}
