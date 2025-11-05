/**
 * Type definitions for dossier registries.
 *
 * Registries organize multiple dossiers and define their relationships.
 */

/**
 * A journey in a registry - a sequence of dossiers for a common workflow.
 */
export interface Journey {
  /** Journey name */
  name: string;
  /** Description of the journey */
  description?: string;
  /** Ordered list of dossier names in the journey */
  dossiers: string[];
}

/**
 * Relationship between dossiers.
 */
export interface DossierRelationship {
  /** Source dossier name */
  from: string;
  /** Target dossier name */
  to: string;
  /** Type of relationship */
  type: 'depends' | 'suggests' | 'conflicts' | 'related';
  /** Optional description */
  description?: string;
}

/**
 * Dossier entry in a registry.
 */
export interface RegistryEntry {
  /** Dossier name */
  name: string;
  /** Relative path to dossier file */
  path: string;
  /** Version */
  version: string;
  /** Protocol version */
  protocol: string;
  /** Status */
  status: 'Draft' | 'Stable' | 'Deprecated';
  /** Category */
  category: string;
  /** Brief purpose */
  purpose: string;
  /** Coupling level */
  coupling?: 'loose' | 'medium' | 'tight';
}

/**
 * Complete parsed registry.
 */
export interface ParsedRegistry {
  /** Path to registry file */
  path: string;
  /** Registry entries */
  entries: RegistryEntry[];
  /** Defined journeys */
  journeys: Journey[];
  /** Dossier relationships */
  relationships: DossierRelationship[];
  /** Categories found */
  categories: string[];
}
