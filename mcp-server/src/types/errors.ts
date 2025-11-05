/**
 * Custom error types for the MCP server.
 *
 * These provide structured error information that can be
 * properly communicated through the MCP protocol.
 */

/**
 * Base error class for all dossier-related errors.
 */
export class DossierError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'DossierError';
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Error thrown when parsing fails.
 */
export class ParseError extends DossierError {
  constructor(message: string, details?: unknown) {
    super(message, 'PARSE_ERROR', details);
    this.name = 'ParseError';
  }
}

/**
 * Error thrown when a file is not found.
 */
export class FileNotFoundError extends DossierError {
  constructor(path: string, details?: unknown) {
    super(`File not found: ${path}`, 'FILE_NOT_FOUND', details);
    this.name = 'FileNotFoundError';
  }
}

/**
 * Error thrown when validation fails.
 */
export class ValidationError extends DossierError {
  constructor(message: string, details?: unknown) {
    super(message, 'VALIDATION_ERROR', details);
    this.name = 'ValidationError';
  }
}

/**
 * Error thrown when a dossier is invalid or malformed.
 */
export class InvalidDossierError extends DossierError {
  constructor(message: string, details?: unknown) {
    super(message, 'INVALID_DOSSIER', details);
    this.name = 'InvalidDossierError';
  }
}

/**
 * Error thrown when a registry is invalid or malformed.
 */
export class InvalidRegistryError extends DossierError {
  constructor(message: string, details?: unknown) {
    super(message, 'INVALID_REGISTRY', details);
    this.name = 'InvalidRegistryError';
  }
}
