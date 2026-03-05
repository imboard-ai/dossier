// Dossier parsing and validation utilities for the registry.
// Parsing logic is aligned with @ai-dossier/core's parseDossierContent.
// Uses gray-matter directly because Vercel deploys the registry standalone
// (the workspace-linked core with gray-matter is not available at deploy time).

const matter = require('gray-matter');

/**
 * Parse frontmatter from dossier content (supports YAML, JSON, ---dossier delimiter).
 * Logic mirrors @ai-dossier/core parseDossierContent.
 * @param {string} content - Full .ds.md file content
 * @returns {Object} { frontmatter: Object, body: string }
 * @throws {Error} If frontmatter is missing or malformed
 */
function parseFrontmatter(content) {
  if (!content || typeof content !== 'string') {
    throw new Error(
      'Missing or malformed frontmatter. Content must start with --- or ---dossier and end with ---'
    );
  }

  if (!content.startsWith('---')) {
    throw new Error(
      'Missing or malformed frontmatter. Content must start with --- or ---dossier and end with ---'
    );
  }

  // Normalize dossier-specific delimiters to standard --- for gray-matter
  let normalized = content;
  if (content.startsWith('---dossier')) {
    const firstNewline = content.indexOf('\n');
    normalized = '---\n' + (firstNewline >= 0 ? content.slice(firstNewline + 1) : '');
  } else if (content.startsWith('---json')) {
    const firstNewline = content.indexOf('\n');
    normalized = '---\n' + (firstNewline >= 0 ? content.slice(firstNewline + 1) : '');
  }

  try {
    const parsed = matter(normalized);
    return { frontmatter: parsed.data, body: parsed.content };
  } catch (err) {
    throw new Error(`Invalid frontmatter: ${err.message}`);
  }
}

/**
 * Validate dossier has required fields for registry publishing.
 * Uses core validation plus registry-specific name checks.
 * @param {Object} frontmatter - Parsed frontmatter
 * @returns {Object} { valid: boolean, errors: string[] }
 */
function validateDossier(frontmatter) {
  const errors = [];

  // Registry requires name, title, version
  const required = ['name', 'title', 'version'];
  for (const field of required) {
    if (!frontmatter[field]) {
      errors.push(`Missing required field: ${field}`);
    }
  }

  // Validate name format (lowercase, alphanumeric, hyphens)
  if (frontmatter.name) {
    if (typeof frontmatter.name !== 'string') {
      errors.push(`Name must be a string, got ${typeof frontmatter.name}`);
    } else {
      if (!/^[a-z0-9][a-z0-9-]*[a-z0-9]$|^[a-z0-9]$/.test(frontmatter.name)) {
        errors.push(`Invalid name "${frontmatter.name}": must be lowercase alphanumeric with hyphens, cannot start/end with hyphen`);
      }
      if (frontmatter.name.length > 64) {
        errors.push(`Name too long (${frontmatter.name.length} chars): must be 64 characters or less`);
      }
    }
  }

  // Validate version format (semver-like)
  if (frontmatter.version) {
    if (typeof frontmatter.version !== 'string') {
      errors.push(`Version must be a string, got ${typeof frontmatter.version} (use quotes: version: "1.0.0")`);
    } else if (!/^\d+\.\d+\.\d+(-[a-zA-Z0-9.-]+)?$/.test(frontmatter.version)) {
      errors.push(`Invalid version "${frontmatter.version}": must be in semver format (x.y.z)`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Build full dossier path from namespace and name
 * @param {string} namespace - e.g., "imboard-ai/development"
 * @param {string} name - e.g., "setup-react"
 * @returns {string} Full path, e.g., "imboard-ai/development/setup-react"
 */
function buildFullName(namespace, name) {
  // Normalize: remove trailing slashes
  const normalizedNamespace = namespace.replace(/\/+$/, '');
  return `${normalizedNamespace}/${name}`;
}

/**
 * Extract root namespace (first segment) for permission checking
 * @param {string} namespace - e.g., "imboard-ai/development"
 * @returns {string} Root namespace, e.g., "imboard-ai"
 */
function getRootNamespace(namespace) {
  return namespace.split('/')[0];
}

/**
 * Validate namespace format
 * @param {string} namespace
 * @returns {Object} { valid: boolean, error: string|null }
 */
function validateNamespace(namespace) {
  if (!namespace) {
    return { valid: false, error: 'Namespace is required' };
  }

  // Check for path traversal
  if (namespace.includes('..')) {
    return { valid: false, error: 'Invalid namespace: contains ..' };
  }

  // Check format (segments separated by /, each segment alphanumeric + hyphens)
  const segments = namespace.split('/');
  if (segments.length > 5) {
    return { valid: false, error: 'Namespace too deep (max 5 levels)' };
  }

  for (const segment of segments) {
    if (!/^[a-z0-9][a-z0-9-]*[a-z0-9]$|^[a-z0-9]$/.test(segment)) {
      return { valid: false, error: `Invalid namespace segment: ${segment}` };
    }
  }

  return { valid: true, error: null };
}

module.exports = {
  parseFrontmatter,
  validateDossier,
  buildFullName,
  getRootNamespace,
  validateNamespace,
};
