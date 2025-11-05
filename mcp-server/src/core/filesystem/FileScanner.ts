/**
 * FileScanner - Discovers dossier files in a directory.
 *
 * Uses glob patterns to find dossier markdown files and
 * returns their paths for further processing.
 */

import { glob } from 'glob';
import path from 'path';

export interface ScanResult {
  /** Absolute paths to discovered dossier files */
  files: string[];
  /** Base directory that was scanned */
  basePath: string;
}

export interface ScanOptions {
  /** Base directory to scan (default: cwd) */
  basePath?: string;
  /** Glob pattern (default: all markdown files) */
  pattern?: string;
  /** Whether to search recursively (default: true) */
  recursive?: boolean;
  /** Maximum depth for recursive search (default: 10) */
  maxDepth?: number;
}

/**
 * Scans a directory for dossier files.
 *
 * @param options - Scan configuration options
 * @returns Promise resolving to scan results with file paths
 *
 * @example
 * ```typescript
 * const scanner = new FileScanner();
 * const result = await scanner.scan({
 *   basePath: './my-project',
 *   pattern: '**\/*.md'
 * });
 * console.log(`Found ${result.files.length} dossiers`);
 * ```
 */
export class FileScanner {
  /**
   * Scan for dossier files matching the criteria.
   */
  async scan(options: ScanOptions = {}): Promise<ScanResult> {
    const basePath = options.basePath || process.cwd();
    const recursive = options.recursive ?? true;
    const maxDepth = options.maxDepth ?? 10;

    // Build glob pattern
    let pattern = options.pattern || '**/*.md';

    // If not recursive, limit depth
    if (!recursive) {
      pattern = '*.md';
    }

    // Perform glob search
    const files = await glob(pattern, {
      cwd: basePath,
      absolute: true,
      nodir: true,
      maxDepth: recursive ? maxDepth : 1,
      ignore: ['**/node_modules/**', '**/dist/**', '**/build/**'],
    });

    return {
      files,
      basePath,
    };
  }

  /**
   * Check if a file path appears to be a dossier based on naming conventions.
   *
   * This is a heuristic check - actual validation requires parsing the file.
   */
  looksLikeDossier(filePath: string): boolean {
    const basename = path.basename(filePath, '.md');

    // Dossiers typically have certain naming patterns
    const patterns = [
      /dossier/i,
      /-init$/,
      /-setup$/,
      /-deploy/,
      /-migration$/,
      /^project-/,
      /^setup-/,
      /^deploy-/,
    ];

    return patterns.some((pattern) => pattern.test(basename));
  }

  /**
   * Filter file list to only those that look like dossiers.
   */
  filterDossierFiles(files: string[]): string[] {
    return files.filter((file) => this.looksLikeDossier(file));
  }
}
