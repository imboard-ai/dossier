/**
 * dossier://protocol resource
 * Provides the Dossier Execution Protocol to LLM context
 */

import { loadMarkdownResource } from '../utils/resourceLoader';

/**
 * Get PROTOCOL.md content
 */
export function getProtocolResource(): string {
  return loadMarkdownResource('PROTOCOL.md', 'protocol');
}
