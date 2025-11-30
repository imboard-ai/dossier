/**
 * dossier://security resource
 * Provides the Security Architecture documentation to LLM context
 */

import { loadMarkdownResource } from '../utils/resourceLoader';

/**
 * Get security/ARCHITECTURE.md content
 */
export function getSecurityResource(): string {
  return loadMarkdownResource('security/ARCHITECTURE.md', 'security');
}
