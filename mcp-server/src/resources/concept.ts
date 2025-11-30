/**
 * dossier://concept resource
 * Provides an introduction to the dossier concept (condensed README.md)
 */

import { loadMarkdownResource } from '../utils/resourceLoader';

/**
 * Get condensed concept/introduction from README.md
 */
export function getConceptResource(): string {
  return loadMarkdownResource('README.md', 'concept');
}
