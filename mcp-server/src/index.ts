#!/usr/bin/env node

/**
 * Dossier MCP Server
 * Model Context Protocol server for dossier automation standard
 * Enables LLMs to discover, verify, and execute dossiers securely
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { getConceptResource } from './resources/concept.js';
import { getProtocolResource } from './resources/protocol.js';
import { getSecurityResource } from './resources/security.js';
import { type ListDossiersInput, listDossiers } from './tools/listDossiers.js';
import { type ReadDossierInput, readDossier } from './tools/readDossier.js';
import { type VerifyDossierInput, verifyDossier } from './tools/verifyDossier.js';
import { logger } from './utils/logger.js';

// Create MCP server instance
const server = new Server(
  {
    name: '@dossier/mcp-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
      resources: {},
    },
  }
);

// Register tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  logger.debug('Listing tools');
  return {
    tools: [
      {
        name: 'verify_dossier',
        description:
          '🔒 Security verification - Verify integrity (checksum) and authenticity (signature) of a dossier. Returns ALLOW/WARN/BLOCK recommendation.',
        inputSchema: {
          type: 'object',
          properties: {
            path: {
              type: 'string',
              description: 'Path to dossier file (.ds.md)',
            },
            trusted_keys_path: {
              type: 'string',
              description: 'Path to trusted-keys.txt (default: ~/.dossier/trusted-keys.txt)',
            },
          },
          required: ['path'],
        },
      },
      {
        name: 'read_dossier',
        description:
          'Read and parse a dossier file. Returns metadata and content. Should be called AFTER verify_dossier passes.',
        inputSchema: {
          type: 'object',
          properties: {
            path: {
              type: 'string',
              description: 'Path to dossier file (.ds.md)',
            },
          },
          required: ['path'],
        },
      },
      {
        name: 'list_dossiers',
        description:
          'Discover available dossiers in a directory. Scans for *.ds.md files and returns metadata.',
        inputSchema: {
          type: 'object',
          properties: {
            path: {
              type: 'string',
              description: 'Directory to search (default: current working directory)',
            },
            recursive: {
              type: 'boolean',
              description: 'Search subdirectories recursively (default: true)',
            },
          },
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  logger.info('Tool call received', { tool: name, arguments: args });

  try {
    switch (name) {
      case 'verify_dossier': {
        const result = await verifyDossier(args as unknown as VerifyDossierInput);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'read_dossier': {
        const result = readDossier(args as unknown as ReadDossierInput);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'list_dossiers': {
        const result = listDossiers(args as unknown as ListDossiersInput);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    logger.error('Tool execution error', {
      tool: name,
      error: (error as Error).message,
      stack: (error as Error).stack,
    });

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(
            {
              error: {
                message: (error as Error).message,
                tool: name,
              },
            },
            null,
            2
          ),
        },
      ],
      isError: true,
    };
  }
});

// Register resources
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  logger.debug('Listing resources');
  return {
    resources: [
      {
        uri: 'dossier://protocol',
        name: 'Dossier Execution Protocol',
        description: 'How to execute dossiers safely and effectively',
        mimeType: 'text/markdown',
      },
      {
        uri: 'dossier://security',
        name: 'Security Architecture',
        description: 'Security model, signing, verification, and trust management',
        mimeType: 'text/markdown',
      },
      {
        uri: 'dossier://concept',
        name: 'Dossier Concept',
        description: 'Introduction to dossiers - what they are and why to use them',
        mimeType: 'text/markdown',
      },
    ],
  };
});

// Handle resource reads
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;

  logger.info('Resource read requested', { uri });

  try {
    let content: string;

    switch (uri) {
      case 'dossier://protocol':
        content = getProtocolResource();
        break;

      case 'dossier://security':
        content = getSecurityResource();
        break;

      case 'dossier://concept':
        content = getConceptResource();
        break;

      default:
        throw new Error(`Unknown resource: ${uri}`);
    }

    return {
      contents: [
        {
          uri,
          mimeType: 'text/markdown',
          text: content,
        },
      ],
    };
  } catch (error) {
    logger.error('Resource read error', {
      uri,
      error: (error as Error).message,
      stack: (error as Error).stack,
    });

    throw error;
  }
});

// Start server
async function main() {
  try {
    const transport = new StdioServerTransport();
    await server.connect(transport);

    logger.info('Dossier MCP Server started', {
      name: '@dossier/mcp-server',
      version: '1.0.0',
      transport: 'stdio',
    });

    // Keep process alive
    process.stdin.resume();
  } catch (error) {
    logger.error('Failed to start server', {
      error: (error as Error).message,
      stack: (error as Error).stack,
    });
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  logger.info('Received SIGINT, shutting down gracefully');
  process.exit(0);
});

process.on('SIGTERM', () => {
  logger.info('Received SIGTERM, shutting down gracefully');
  process.exit(0);
});

// Run server
main().catch((error) => {
  logger.error('Fatal error', {
    error: error.message,
    stack: error.stack,
  });
  process.exit(1);
});
