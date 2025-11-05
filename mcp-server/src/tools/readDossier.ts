/**
 * read_dossier tool - Read and parse a specific dossier.
 */

import { FileScanner } from '../core/filesystem/FileScanner.js';
import { DossierParser } from '../core/parser/DossierParser.js';
import { FileNotFoundError } from '../types/errors.js';
import type { ParsedDossier } from '../types/dossier.js';
import fs from 'fs/promises';
import path from 'path';

export interface ReadDossierArgs {
  name: string;
  basePath?: string;
}

/**
 * Read and parse a specific dossier by name or path.
 */
export async function readDossier(
  args: ReadDossierArgs
): Promise<ParsedDossier> {
  const basePath = args.basePath || process.cwd();
  const parser = new DossierParser();

  // Determine if name is a path or a name
  let filePath: string;

  if (args.name.endsWith('.md')) {
    // Treat as file path
    filePath = path.isAbsolute(args.name)
      ? args.name
      : path.join(basePath, args.name);
  } else {
    // Search for dossier by name
    const scanner = new FileScanner();
    const scanResult = await scanner.scan({ basePath, recursive: true });
    const dossierFiles = scanner.filterDossierFiles(scanResult.files);

    // Find matching dossier
    let found: string | undefined;

    for (const file of dossierFiles) {
      try {
        const content = await fs.readFile(file, 'utf-8');
        const parsed = parser.parse(content, file, {
          validateRequired: false,
          includeContent: false,
        });

        // Match by name (case-insensitive)
        if (parsed.metadata.name.toLowerCase() === args.name.toLowerCase()) {
          found = file;
          break;
        }

        // Also match by filename
        const basename = path.basename(file, '.md');
        if (basename.toLowerCase() === args.name.toLowerCase()) {
          found = file;
          break;
        }
      } catch {
        continue;
      }
    }

    if (!found) {
      throw new FileNotFoundError(args.name, {
        basePath,
        searchedFiles: dossierFiles.length,
      });
    }

    filePath = found;
  }

  // Read and parse the dossier
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return parser.parse(content, filePath, {
      validateRequired: true,
      includeContent: true,
    });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      throw new FileNotFoundError(filePath);
    }
    throw error;
  }
}
