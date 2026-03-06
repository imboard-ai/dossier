import config from './config';
import { DOSSIER_DEFAULTS } from './constants';
import type { ManifestDossier } from './types';

// Fetches manifest via CDN for read-only list/search (fast, cached).
// Write operations (publish/delete) use github.getManifest() instead
// to access the sha needed for atomic updates via the GitHub API.
export async function fetchManifestDossiers(): Promise<ManifestDossier[]> {
  const manifestUrl = config.getManifestUrl();
  const response = await fetch(manifestUrl);

  if (!response.ok) {
    throw new Error(`Failed to fetch manifest: ${response.status}`);
  }

  const manifest = (await response.json()) as { dossiers: ManifestDossier[] };
  return manifest.dossiers;
}

export function normalizeDossier(dossier: ManifestDossier): ManifestDossier & { url: string } {
  return {
    ...DOSSIER_DEFAULTS,
    ...dossier,
    url: config.getCdnUrl(dossier.path),
  };
}
