/**
 * list_dossiers tool - Discover available dossiers in a directory.
 */

import { FileScanner } from '../core/filesystem/FileScanner.js';
import { DossierParser } from '../core/parser/DossierParser.js';
import type { DossierList, DossierSummary } from '../types/dossier.js';
import fs from 'fs/promises';
import path from 'path';

export interface ListDossiersArgs {
  path?: string;
  recursive?: boolean;
  filter?: string;
}

/**
 * List all dossiers in a directory.
 */
export async function listDossiers(
  args: ListDossiersArgs = {}
): Promise<DossierList> {
  const basePath = args.path || process.cwd();
  const scanner = new FileScanner();
  const parser = new DossierParser();

  // Scan for files
  const scanResult = await scanner.scan({
    basePath,
    pattern: args.filter || '**/*.md',
    recursive: args.recursive ?? true,
  });

  // Filter to dossier-like files
  const dossierFiles = scanner.filterDossierFiles(scanResult.files);

  // Parse each dossier
  const dossiers: DossierSummary[] = [];

  for (const filePath of dossierFiles) {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const parsed = parser.parse(content, filePath, {
        validateRequired: false, // Don't fail on invalid dossiers
        includeContent: false,
      });

      // Extract brief objective (first sentence)
      const objective = parsed.sections.objective
        ? parsed.sections.objective.split(/[.!?]/)[0]?.trim() + '.' || ''
        : '';

      dossiers.push({
        name: parsed.metadata.name,
        path: path.relative(basePath, filePath),
        version: parsed.metadata.version,
        protocol: parsed.metadata.protocol,
        status: parsed.metadata.status,
        objective: objective.slice(0, 200), // Limit length
      });
    } catch (error) {
      // Skip files that can't be parsed
      continue;
    }
  }

  return {
    dossiers,
  };
}
