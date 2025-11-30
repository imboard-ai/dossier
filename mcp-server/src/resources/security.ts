/**
 * dossier://security resource
 * Provides the Security Architecture documentation to LLM context
 */

import { createResourceLoader } from '../utils/resourceLoader';

/** Get security/ARCHITECTURE.md content */
export const getSecurityResource = createResourceLoader('security/ARCHITECTURE.md', 'security');
