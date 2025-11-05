/**
 * DossierParser - Parses dossier markdown files.
 *
 * Extracts metadata from the header and parses standard sections
 * according to the dossier specification.
 */

import type {
  DossierMetadata,
  DossierSections,
  ParsedDossier,
  ParseOptions,
} from '../../types/dossier.js';
import { ParseError, InvalidDossierError } from '../../types/errors.js';

/**
 * Parses a dossier markdown file into structured data.
 *
 * @example
 * ```typescript
 * const parser = new DossierParser();
 * const content = fs.readFileSync('dossier.md', 'utf-8');
 * const dossier = parser.parse(content, { path: 'dossier.md' });
 * console.log(dossier.metadata.version); // "1.0.0"
 * ```
 */
export class DossierParser {
  /**
   * Parse a dossier from markdown content.
   *
   * @param content - Raw markdown content
   * @param filePath - Path to the file (for metadata)
   * @param options - Parse options
   * @returns Parsed dossier structure
   * @throws {ParseError} If content cannot be parsed
   * @throws {InvalidDossierError} If required fields are missing
   */
  parse(
    content: string,
    filePath: string,
    options: ParseOptions = {}
  ): ParsedDossier {
    const validateRequired = options.validateRequired ?? true;

    // Extract metadata from header
    const metadata = this.parseMetadata(content, filePath);

    // Extract sections
    const sections = this.parseSections(content);

    // Validate if requested
    if (validateRequired) {
      this.validateRequired(metadata, sections);
    }

    return {
      metadata,
      content: options.includeContent !== false ? content : '',
      sections,
    };
  }

  /**
   * Parse metadata from the dossier header.
   */
  private parseMetadata(content: string, filePath: string): DossierMetadata {
    // Extract title (first H1)
    const titleMatch = content.match(/^#\s+Dossier:\s+(.+)$/m);
    if (!titleMatch) {
      throw new ParseError('Missing dossier title (expected "# Dossier: Name")', {
        filePath,
      });
    }
    const name = titleMatch[1]?.trim() || '';

    // Extract metadata fields from header
    const versionMatch = content.match(/\*\*Version\*\*:\s*(.+)/);
    const protocolMatch = content.match(/\*\*Protocol Version\*\*:\s*(.+)/);
    const statusMatch = content.match(/\*\*Status\*\*:\s*(Draft|Stable|Deprecated)/);

    if (!versionMatch) {
      throw new InvalidDossierError('Missing required field: Version', {
        filePath,
      });
    }

    if (!protocolMatch) {
      throw new InvalidDossierError(
        'Missing required field: Protocol Version',
        { filePath }
      );
    }

    if (!statusMatch) {
      throw new InvalidDossierError('Missing required field: Status', {
        filePath,
      });
    }

    const version = versionMatch[1]?.trim() || '';
    const protocol = protocolMatch[1]?.trim() || '';
    const status = statusMatch[1]?.trim() as 'Draft' | 'Stable' | 'Deprecated';

    // Validate semver format
    if (!this.isValidSemver(version)) {
      throw new InvalidDossierError(
        `Invalid version format: "${version}" (expected semver like "1.0.0")`,
        { filePath }
      );
    }

    return {
      name,
      version,
      protocol,
      status,
      path: filePath,
    };
  }

  /**
   * Parse sections from the dossier content.
   */
  private parseSections(content: string): DossierSections {
    const sections: DossierSections = {};

    // Define section mappings
    const sectionMap: Record<string, keyof DossierSections> = {
      'Objective': 'objective',
      'Prerequisites': 'prerequisites',
      'Context to Gather': 'context',
      'Decision Points': 'decisions',
      'Actions to Perform': 'actions',
      'Validation': 'validation',
      'Example': 'examples',
      'Troubleshooting': 'troubleshooting',
      'Background': 'background',
      'Related Dossiers': 'relatedDossiers',
      'Rollback': 'rollback',
    };

    // Extract each section
    for (const [sectionTitle, sectionKey] of Object.entries(sectionMap)) {
      const sectionContent = this.extractSection(content, sectionTitle);
      if (sectionContent) {
        sections[sectionKey] = sectionContent;
      }
    }

    return sections;
  }

  /**
   * Extract content of a specific section.
   *
   * Finds the section by H2 heading and extracts content until the next H2.
   */
  private extractSection(content: string, sectionTitle: string): string | undefined {
    // Create regex to find section start
    const sectionRegex = new RegExp(`^##\\s+${this.escapeRegex(sectionTitle)}\\s*$`, 'm');
    const match = sectionRegex.exec(content);

    if (!match) {
      return undefined;
    }

    const sectionStart = match.index + match[0].length;

    // Find next section (next H2) or end of document
    const restOfContent = content.slice(sectionStart);
    const nextSectionMatch = /^##\s+/m.exec(restOfContent);

    const sectionEnd = nextSectionMatch
      ? sectionStart + nextSectionMatch.index
      : content.length;

    // Extract and trim section content
    const sectionContent = content.slice(sectionStart, sectionEnd).trim();

    return sectionContent || undefined;
  }

  /**
   * Validate that required sections are present.
   */
  private validateRequired(
    metadata: DossierMetadata,
    sections: DossierSections
  ): void {
    const requiredSections = ['objective', 'prerequisites', 'actions', 'validation'];
    const missing: string[] = [];

    for (const required of requiredSections) {
      if (!sections[required as keyof DossierSections]) {
        missing.push(required);
      }
    }

    if (missing.length > 0) {
      throw new InvalidDossierError(
        `Missing required sections: ${missing.join(', ')}`,
        {
          path: metadata.path,
          missingSections: missing,
        }
      );
    }
  }

  /**
   * Check if a string is valid semver format.
   */
  private isValidSemver(version: string): boolean {
    const semverRegex = /^\d+\.\d+\.\d+(-[a-zA-Z0-9.-]+)?(\+[a-zA-Z0-9.-]+)?$/;
    return semverRegex.test(version);
  }

  /**
   * Escape special regex characters.
   */
  private escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}
