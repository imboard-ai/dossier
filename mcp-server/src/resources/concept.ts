/**
 * dossier://concept resource
 * Provides an introduction to the dossier concept (condensed README.md)
 */

import { createResourceLoader } from '../utils/resourceLoader';

/** Get condensed concept/introduction from README.md */
export const getConceptResource = createResourceLoader('README.md', 'concept');
