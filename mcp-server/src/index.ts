#!/usr/bin/env node

/**
 * Dossier MCP Server
 *
 * Model Context Protocol server for dossier automation.
 * Enables LLMs to discover, understand, and execute dossiers.
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

// Import tools
import { listDossiers } from './tools/listDossiers.js';
import { readDossier } from './tools/readDossier.js';

// Import resources
import { getConceptResource } from './resources/concept.js';
import { getProtocolResource } from './resources/protocol.js';

// Import prompts
import { getExecuteDossierPrompt } from './prompts/executeDossier.js';

// Create server instance
const server = new Server(
  {
    name: 'dossier-mcp-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
      resources: {},
      prompts: {},
    },
  }
);

// Tool handlers
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'list_dossiers',
        description:
          'Discover available dossiers in a directory. Returns a list of dossiers with their metadata.',
        inputSchema: {
          type: 'object',
          properties: {
            path: {
              type: 'string',
              description: 'Directory to search (default: current working directory)',
            },
            recursive: {
              type: 'boolean',
              description: 'Whether to search recursively (default: true)',
            },
            filter: {
              type: 'string',
              description: 'Glob pattern to filter files (default: **/*.md)',
            },
          },
        },
      },
      {
        name: 'read_dossier',
        description:
          'Read and parse a specific dossier file. Returns complete dossier structure with all sections.',
        inputSchema: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'Dossier name or file path (e.g., "project-init" or "dossiers/deploy.md")',
            },
            basePath: {
              type: 'string',
              description: 'Base directory to search from (default: current working directory)',
            },
          },
          required: ['name'],
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'list_dossiers': {
        const result = await listDossiers(args || {});
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
        if (!args || !('name' in args)) {
          throw new Error('Missing required argument: name');
        }
        const result = await readDossier(args as { name: string; basePath?: string });
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
    const err = error as Error;
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(
            {
              error: err.message,
              code: (err as any).code,
              details: (err as any).details,
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

// Resource handlers
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [
      {
        uri: 'dossier://concept',
        name: 'Dossier Concept',
        description: 'Introduction to what dossiers are and how to use them',
        mimeType: 'text/markdown',
      },
      {
        uri: 'dossier://protocol',
        name: 'Dossier Execution Protocol',
        description: 'Standard protocol for executing dossiers safely and effectively',
        mimeType: 'text/markdown',
      },
    ],
  };
});

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;

  switch (uri) {
    case 'dossier://concept':
      return getConceptResource();
    case 'dossier://protocol':
      return getProtocolResource();
    default:
      throw new Error(`Unknown resource: ${uri}`);
  }
});

// Prompt handlers
server.setRequestHandler(ListPromptsRequestSchema, async () => {
  return {
    prompts: [
      {
        name: 'execute-dossier',
        description: 'Execute a dossier following the standard protocol with safety guidelines',
        arguments: [
          {
            name: 'dossier',
            description: 'Name or path of the dossier to execute',
            required: true,
          },
          {
            name: 'skipImprovement',
            description: 'Skip self-improvement analysis (default: false)',
            required: false,
          },
          {
            name: 'dryRun',
            description: 'Validate but do not execute (default: false)',
            required: false,
          },
        ],
      },
    ],
  };
});

server.setRequestHandler(GetPromptRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case 'execute-dossier': {
      if (!args || !('dossier' in args)) {
        throw new Error('Missing required argument: dossier');
      }
      return getExecuteDossierPrompt({
        dossier: String(args.dossier),
        skipImprovement: String(args.skipImprovement) === 'true',
        dryRun: String(args.dryRun) === 'true',
      });
    }
    default:
      throw new Error(`Unknown prompt: ${name}`);
  }
});

// Start server
async function main(): Promise<void> {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Dossier MCP Server v1.0.0 running');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
