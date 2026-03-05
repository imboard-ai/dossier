/**
 * read_dossier tool - Read and return dossier content
 * Thin wrapper around `ai-dossier info --json <path>` + file read for body
 */

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { parseDossierContent } from '@ai-dossier/core';
import { CliNotFoundError, execCli } from '../utils/cli-wrapper';
import { logger } from '../utils/logger';

export interface ReadDossierInput {
  path: string;
}

export interface ReadDossierOutput {
  metadata: Record<string, unknown>;
  body: string;
}

/**
 * Read and parse a dossier file via CLI
 */
export async function readDossier(input: ReadDossierInput): Promise<ReadDossierOutput> {
  const { path: dossierPath } = input;

  // Validate path stays within the current working directory
  const resolvedPath = resolve(dossierPath);
  const cwd = process.cwd();
  if (!resolvedPath.startsWith(`${cwd}/`) && resolvedPath !== cwd) {
    throw new Error(`Access denied: path "${dossierPath}" is outside the working directory`);
  }

  logger.info('Reading dossier via CLI', { dossierFile: dossierPath });

  try {
    const metadata = await execCli<Record<string, unknown>>('info', [dossierPath, '--json']);

    // Read body using core parser (single source of truth for frontmatter extraction)
    const fileContent = readFileSync(resolvedPath, 'utf8');
    let body: string;
    try {
      body = parseDossierContent(fileContent).body;
    } catch {
      body = fileContent;
    }

    logger.info('Dossier read successfully', {
      dossierFile: dossierPath,
      title: metadata.title,
      bodyLength: body.length,
    });

    return { metadata, body };
  } catch (error) {
    if (error instanceof CliNotFoundError) {
      throw new Error(error.message);
    }
    throw error;
  }
}
