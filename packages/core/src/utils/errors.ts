/**
 * Error handling utilities
 * Safe extraction of error information from unknown error types
 */

/**
 * Safely extract error message from unknown error type
 * Handles the common TypeScript pattern of catching 'unknown' errors
 * @param err - The caught error (unknown type)
 * @returns Error message string
 */
export function getErrorMessage(err: unknown): string {
  if (err instanceof Error) {
    return err.message;
  }
  return String(err);
}

/**
 * Safely extract error stack from unknown error type
 * @param err - The caught error (unknown type)
 * @returns Error stack string or undefined
 */
export function getErrorStack(err: unknown): string | undefined {
  if (err instanceof Error) {
    return err.stack;
  }
  return undefined;
}
