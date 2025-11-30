/**
 * dossier://protocol resource
 * Provides the Dossier Execution Protocol to LLM context
 */

import { createResourceLoader } from '../utils/resourceLoader';

/** Get PROTOCOL.md content */
export const getProtocolResource = createResourceLoader('PROTOCOL.md', 'protocol');
