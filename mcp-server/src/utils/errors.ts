/**
 * Error types for dossier MCP server
 */

export enum ErrorType {
  CLIENT_ERROR = 'CLIENT_ERROR',
  SERVER_ERROR = 'SERVER_ERROR',
  SECURITY_ERROR = 'SECURITY_ERROR',
  EXTERNAL_ERROR = 'EXTERNAL_ERROR',
}

export class DossierError extends Error {
  constructor(
    public type: ErrorType,
    message: string,
    public code?: string,
    public context?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'DossierError';
  }

  toJSON() {
    return {
      type: this.type,
      message: this.message,
      code: this.code,
      context: this.context,
    };
  }
}

export class DossierParseError extends DossierError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(ErrorType.CLIENT_ERROR, message, 'PARSE_ERROR', context);
    this.name = 'DossierParseError';
  }
}

export class DossierVerificationError extends DossierError {
  constructor(
    public verificationType: 'CHECKSUM_MISMATCH' | 'SIGNATURE_INVALID' | 'MISSING_METADATA',
    details: Record<string, unknown>
  ) {
    super(
      ErrorType.SECURITY_ERROR,
      `Verification failed: ${verificationType}`,
      verificationType,
      details
    );
    this.name = 'DossierVerificationError';
  }
}

export class DossierNotFoundError extends DossierError {
  constructor(path: string) {
    super(ErrorType.CLIENT_ERROR, `Dossier not found: ${path}`, 'NOT_FOUND', { path });
    this.name = 'DossierNotFoundError';
  }
}

export class ExternalToolError extends DossierError {
  constructor(tool: string, message: string, context?: Record<string, unknown>) {
    super(ErrorType.EXTERNAL_ERROR, `${tool} error: ${message}`, 'EXTERNAL_TOOL_ERROR', {
      tool,
      ...context,
    });
    this.name = 'ExternalToolError';
  }
}
