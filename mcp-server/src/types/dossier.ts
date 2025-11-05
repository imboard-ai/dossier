/**
 * Type definitions for dossier structures.
 *
 * These types represent the parsed structure of dossier files
 * and related data structures used throughout the MCP server.
 */

/**
 * Dossier metadata extracted from the header.
 */
export interface DossierMetadata {
  /** Dossier name (from title) */
  name: string;
  /** Semantic version (e.g., "1.0.0") */
  version: string;
  /** Protocol version (e.g., "1.0") */
  protocol: string;
  /** Status: Draft, Stable, or Deprecated */
  status: 'Draft' | 'Stable' | 'Deprecated';
  /** File path (relative or absolute) */
  path: string;
}

/**
 * Parsed sections from a dossier.
 * All sections are optional as not all dossiers include every section.
 */
export interface DossierSections {
  /** Objective section content */
  objective?: string;
  /** Prerequisites section content */
  prerequisites?: string;
  /** Context to Gather section content */
  context?: string;
  /** Decision Points section content */
  decisions?: string;
  /** Actions to Perform section content */
  actions?: string;
  /** Validation section content */
  validation?: string;
  /** Example section content */
  examples?: string;
  /** Troubleshooting section content */
  troubleshooting?: string;
  /** Background section content */
  background?: string;
  /** Related Dossiers section content */
  relatedDossiers?: string;
  /** Rollback section content */
  rollback?: string;
}

/**
 * Complete parsed dossier structure.
 */
export interface ParsedDossier {
  /** Dossier metadata */
  metadata: DossierMetadata;
  /** Raw markdown content */
  content: string;
  /** Parsed sections */
  sections: DossierSections;
}

/**
 * Options for parsing dossiers.
 */
export interface ParseOptions {
  /** Whether to validate required sections */
  validateRequired?: boolean;
  /** Whether to include raw content */
  includeContent?: boolean;
}

/**
 * Summary information about a dossier (used in listings).
 */
export interface DossierSummary {
  /** Dossier name */
  name: string;
  /** Relative file path */
  path: string;
  /** Semantic version */
  version: string;
  /** Protocol version */
  protocol: string;
  /** Status */
  status: 'Draft' | 'Stable' | 'Deprecated';
  /** Brief objective statement */
  objective: string;
  /** Category (if from registry) */
  category?: string;
}

/**
 * Options for scanning/listing dossiers.
 */
export interface ScanOptions {
  /** Base directory to search */
  path?: string;
  /** Whether to search recursively */
  recursive?: boolean;
  /** Glob pattern filter */
  filter?: string;
  /** Whether to include registry information */
  includeRegistry?: boolean;
}

/**
 * Result of scanning for dossiers.
 */
export interface DossierList {
  /** List of discovered dossiers */
  dossiers: DossierSummary[];
  /** Registry information (if found) */
  registry?: RegistryInfo;
}

/**
 * Registry metadata.
 */
export interface RegistryInfo {
  /** Path to registry file */
  path: string;
  /** Whether registry includes journey maps */
  hasJourneyMaps: boolean;
  /** Whether registry includes dependencies */
  hasDependencies: boolean;
}

/**
 * Registry context for a specific dossier.
 */
export interface RegistryContext {
  /** Related dossiers */
  relatedDossiers: string[];
  /** Dependencies (must run before this) */
  dependencies: string[];
  /** Suggested to run after (complementary) */
  suggestedAfter?: string[];
  /** Which journey this belongs to */
  journey?: string;
  /** Conflicts with (shouldn't run together) */
  conflicts?: string[];
}

/**
 * Validation error details.
 */
export interface ValidationError {
  /** Section where error occurred */
  section: string;
  /** Description of the issue */
  issue: string;
  /** Severity level */
  severity: 'error' | 'warning' | 'info';
  /** Optional line number */
  line?: number;
}

/**
 * Validation result.
 */
export interface ValidationResult {
  /** Whether dossier is valid */
  valid: boolean;
  /** Compliance level achieved */
  compliance: 'basic' | 'standard' | 'advanced' | 'non-compliant';
  /** List of errors */
  errors: ValidationError[];
  /** List of warnings/suggestions */
  warnings: ValidationError[];
  /** Compliance score breakdown */
  score: {
    /** Required sections score (0-100) */
    required: number;
    /** Recommended sections score (0-100) */
    recommended: number;
    /** Overall score (0-100) */
    overall: number;
  };
}

/**
 * Compliance level for validation.
 */
export type ComplianceLevel = 'basic' | 'standard' | 'advanced';
