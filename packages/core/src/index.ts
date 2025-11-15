/**
 * @dossier/core - Core verification and parsing logic for dossier automation standard
 *
 * This package provides:
 * - Dossier parsing (frontmatter + body extraction)
 * - Checksum verification (SHA256 integrity checks)
 * - Signature verification (Minisign and AWS KMS)
 * - TypeScript type definitions
 */

// Type exports
export * from './types';

// Parser exports
export { parseDossierContent, parseDossierFile, validateFrontmatter } from './parser';

// Checksum exports
export { calculateChecksum, verifyIntegrity } from './checksum';

// Signature exports
export { loadTrustedKeys, verifyWithMinisign, verifyWithKms } from './signature';
