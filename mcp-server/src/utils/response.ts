/**
 * MCP tool response utilities
 */

/**
 * Create a standardized MCP tool response
 * @param data - Data to include in the response (will be JSON stringified)
 * @param isError - Whether this is an error response
 * @returns Formatted tool response object
 */
export function createToolResponse(data: unknown, isError = false) {
  const response: {
    content: Array<{ type: 'text'; text: string }>;
    isError?: boolean;
  } = {
    content: [{ type: 'text', text: JSON.stringify(data, null, 2) }],
  };
  if (isError) {
    response.isError = true;
  }
  return response;
}
