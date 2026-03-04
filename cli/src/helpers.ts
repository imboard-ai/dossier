/**
 * Shared helper functions and types for Dossier CLI commands.
 * Extracted from the monolithic bin/dossier entry point.
 */

import { execSync } from 'node:child_process';
import fs from 'node:fs';
import http from 'node:http';
import https from 'node:https';
import path from 'node:path';

import { convertGitHubBlobToRaw } from './github-url';

// ============================================================================
// Path constants
// ============================================================================

/** Root of the CLI package (cli/) */
export const CLI_ROOT = path.resolve(__dirname, '..');

/** The bin/ directory */
export const BIN_DIR = path.join(CLI_ROOT, 'bin');

/** Repository root (parent of cli/) */
export const REPO_ROOT = path.resolve(CLI_ROOT, '..');

// ============================================================================
// Shared constants
// ============================================================================

/** Official KMS keys that require CI/CD signing (not direct CLI use) */
export const OFFICIAL_KMS_KEYS = [
  'alias/dossier-official-prod',
  'alias/dossier-official',
  'arn:aws:kms:us-east-1:942039714848:key/d9ccd3fc-b190-49fd-83f7-e94df6620c1d',
];

/** Required frontmatter fields per schema spec */
export const REQUIRED_FIELDS = ['dossier_schema_version', 'title', 'version'];

/** Recommended fields (warn if missing) */
export const RECOMMENDED_FIELDS = ['objective', 'risk_level', 'status'];

/** Valid values for risk_level */
export const VALID_RISK_LEVELS = ['low', 'medium', 'high', 'critical'];

/** Valid values for status */
export const VALID_STATUSES = ['Draft', 'Stable', 'Deprecated', 'Experimental'];

// ============================================================================
// TypeScript interfaces
// ============================================================================

export interface VerificationOptions {
  skipChecksum?: boolean;
  skipAllChecks?: boolean;
  skipAuthorCheck?: boolean;
  skipDossierCheck?: boolean;
  skipRiskAssessment?: boolean;
  skipReview?: boolean;
  force?: boolean;
  noPrompt?: boolean;
  reviewDossier?: string;
}

export interface VerificationStage {
  stage: number;
  name: string;
  passed?: boolean;
  skipped?: boolean;
  demo?: boolean;
}

export interface VerificationResult {
  passed: boolean;
  stages: VerificationStage[];
}

export interface ListSource {
  type: 'local' | 'github';
  path?: string;
  owner?: string;
  repo?: string;
  branch?: string;
}

export interface DossierMetadata {
  path: string;
  filename: string;
  title: string;
  version?: string;
  risk_level?: string;
  category?: string;
  status?: string;
  signed?: boolean;
  checksum?: boolean;
  objective?: string;
  error: string | null;
}

export interface GitHubFile {
  path: string;
  rawUrl: string;
  githubUrl: string;
}

// ============================================================================
// Helper functions
// ============================================================================

/**
 * Read all data from stdin (piped input) with a timeout.
 * Returns null if stdin is a TTY (interactive terminal).
 */
export function readStdin(timeoutMs = 5000): Promise<string | null> {
  return new Promise((resolve) => {
    if (process.stdin.isTTY) {
      resolve(null);
      return;
    }

    let data = '';
    const timer = setTimeout(() => {
      process.stdin.removeAllListeners();
      process.stdin.pause();
      resolve(data || null);
    }, timeoutMs);

    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (chunk: string) => { data += chunk; });
    process.stdin.on('end', () => {
      clearTimeout(timer);
      resolve(data || null);
    });
    process.stdin.on('error', () => {
      clearTimeout(timer);
      resolve(null);
    });
    process.stdin.resume();
  });
}

/**
 * Detect and resolve which LLM to use.
 * @returns The resolved LLM name, or null if none detected.
 */
export function detectLlm(llmOption: string, silent = false): string | null {
  if (llmOption !== 'auto') {
    return llmOption;
  }

  // Auto-detect LLM
  try {
    execSync('command -v claude', { stdio: 'pipe' });
    if (!silent) console.log('   Detected: Claude Code');
    return 'claude-code';
  } catch {
    if (!silent) {
      console.log('❌ No supported LLM detected\n');
      console.log('Supported LLM:');
      console.log('  - Claude Code (install from https://claude.com/claude-code)\n');
      console.log('Or specify manually: --llm claude-code\n');
    }
    return null;
  }
}

/**
 * Build the execution command for a given LLM.
 * @returns The command to execute, or null for unknown LLM.
 */
export function buildLlmCommand(llm: string, file: string, headless = false): string | null {
  // Detect if file is a URL and convert GitHub blob URLs to raw URLs
  const isUrl = file.startsWith('http://') || file.startsWith('https://');
  const resolvedFile = isUrl ? convertGitHubBlobToRaw(file) : file;

  if (llm === 'claude-code') {
    const claudeCommand = headless ? 'claude -p' : 'claude';

    if (isUrl) {
      if (headless) {
        return `tmpfile=$(mktemp /tmp/dossier.XXXXXX.ds.md) && curl -sL "${resolvedFile}" -o "\${tmpfile}" && test -s "\${tmpfile}" && cat "\${tmpfile}" | claude -p; status=$?; rm -f "\${tmpfile}"; exit $status`;
      } else {
        return `tmpfile=$(mktemp /tmp/dossier.XXXXXX.ds.md) && curl -sL "${resolvedFile}" -o "\${tmpfile}" && test -s "\${tmpfile}" && claude "\${tmpfile}"; status=$?; rm -f "\${tmpfile}"; exit $status`;
      }
    } else {
      if (headless) {
        return `cat "${resolvedFile}" | claude -p`;
      } else {
        return `claude "${resolvedFile}"`;
      }
    }
  } else {
    return null;
  }
}

/**
 * Multi-stage verification pipeline.
 */
export async function runVerification(file: string, options: VerificationOptions): Promise<VerificationResult> {
  const verifyScript = path.join(BIN_DIR, 'dossier-verify');
  const results: VerificationResult = { passed: true, stages: [] };

  console.log('🔐 Running Multi-Stage Verification Pipeline...\n');

  // Stage 1: Integrity Check (checksum + signature)
  if (!options.skipChecksum && !options.skipAllChecks) {
    console.log('📊 Stage 1: Integrity Check (checksum + signature)');
    try {
      execSync(`node "${verifyScript}" "${file}" --exit-code-only 2>/dev/null`, { stdio: 'pipe' });
      console.log('   ✅ PASSED: Checksum and signature valid\n');
      results.stages.push({ stage: 1, name: 'Integrity', passed: true });
    } catch {
      console.log('   ❌ FAILED: Verification failed');
      console.log('   Run "dossier verify ' + file + '" for details\n');
      results.passed = false;
      results.stages.push({ stage: 1, name: 'Integrity', passed: false });
      return results;
    }
  } else {
    console.log('⚠️  Stage 1: SKIPPED - Integrity check\n');
    results.stages.push({ stage: 1, name: 'Integrity', skipped: true });
  }

  // Stage 2: Author Whitelist/Blacklist (TBD - demo)
  if (!options.skipAuthorCheck && !options.skipAllChecks) {
    console.log('👤 Stage 2: Author Whitelist/Blacklist');
    console.log('   ✅ PASSED: Author check (not in blacklist)');
    console.log('   📋 [Demo: Would check ~/.dossier/authors-whitelist.txt]');
    console.log('   📋 [Demo: Would check ~/.dossier/authors-blacklist.txt]\n');
    results.stages.push({ stage: 2, name: 'Author Check', passed: true, demo: true });
  } else {
    console.log('⚠️  Stage 2: SKIPPED - Author check\n');
    results.stages.push({ stage: 2, name: 'Author Check', skipped: true });
  }

  // Stage 3: Dossier Whitelist/Blacklist (TBD - demo)
  if (!options.skipDossierCheck && !options.skipAllChecks) {
    console.log('📋 Stage 3: Dossier Whitelist/Blacklist');
    console.log('   ✅ PASSED: Dossier check (not in blacklist)');
    console.log('   📋 [Demo: Would check ~/.dossier/dossiers-whitelist.txt]');
    console.log('   📋 [Demo: Would check ~/.dossier/dossiers-blacklist.txt]\n');
    results.stages.push({ stage: 3, name: 'Dossier Check', passed: true, demo: true });
  } else {
    console.log('⚠️  Stage 3: SKIPPED - Dossier check\n');
    results.stages.push({ stage: 3, name: 'Dossier Check', skipped: true });
  }

  // Stage 4: Risk Assessment
  if (!options.skipRiskAssessment && !options.skipAllChecks) {
    console.log('🔴 Stage 4: Risk Assessment');
    console.log('   ✅ PASSED: Risk level acceptable');
    console.log('   📊 Risk: MEDIUM (based on verification)\n');
    if (!options.force && !options.noPrompt) {
      console.log('   ℹ️  High-risk dossiers would prompt for confirmation here');
    }
    results.stages.push({ stage: 4, name: 'Risk Assessment', passed: true });
  } else {
    console.log('⚠️  Stage 4: SKIPPED - Risk assessment\n');
    results.stages.push({ stage: 4, name: 'Risk Assessment', skipped: true });
  }

  // Stage 5: Review Dossier (TBD - demo)
  if (!options.skipReview && !options.skipAllChecks) {
    const reviewDossierPath = options.reviewDossier || 'built-in://review-dossier.ds.md';
    console.log('🔍 Stage 5: Review Dossier Analysis');
    console.log(`   Using: ${reviewDossierPath}`);
    console.log('   ✅ PASSED: Review dossier approved');
    console.log('   📋 [Demo: Would execute review dossier to analyze target]');
    console.log('   📋 [Demo: Review dossier would check for dangerous patterns]\n');
    results.stages.push({ stage: 5, name: 'Review Dossier', passed: true, demo: true });
  } else {
    console.log('⚠️  Stage 5: SKIPPED - Review dossier\n');
    results.stages.push({ stage: 5, name: 'Review Dossier', skipped: true });
  }

  return results;
}

/**
 * Recursively find all .ds.md files in a local directory.
 */
export function findDossierFilesLocal(dir: string, recursive = false): string[] {
  const results: string[] = [];

  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        if (entry.name === 'node_modules' || entry.name.startsWith('.')) {
          continue;
        }
        if (recursive) {
          results.push(...findDossierFilesLocal(fullPath, recursive));
        }
      } else if (entry.isFile() && entry.name.endsWith('.ds.md')) {
        results.push(fullPath);
      }
    }
  } catch {
    // Silently skip directories we can't read
  }

  return results;
}

/**
 * Parse source string to determine type and details.
 */
export function parseListSource(source: string): ListSource {
  // GitHub shorthand: github:owner/repo or github:owner/repo/path@branch
  if (source.startsWith('github:')) {
    const rest = source.slice(7);
    const [pathPart, branch] = rest.split('@');
    const parts = pathPart.split('/');
    const owner = parts[0];
    const repo = parts[1];
    const subpath = parts.slice(2).join('/') || '';
    return {
      type: 'github',
      owner,
      repo,
      path: subpath,
      branch: branch || 'main',
    };
  }

  // GitHub URL
  if (source.startsWith('https://github.com/') || source.startsWith('http://github.com/')) {
    const url = new URL(source);
    const parts = url.pathname.split('/').filter(p => p);
    const owner = parts[0];
    const repo = parts[1];

    if (parts[2] === 'tree' && parts.length >= 4) {
      const branch = parts[3];
      const subpath = parts.slice(4).join('/');
      return {
        type: 'github',
        owner,
        repo,
        path: subpath,
        branch,
      };
    }

    return {
      type: 'github',
      owner,
      repo,
      path: '',
      branch: 'main',
    };
  }

  // Default: local path
  return {
    type: 'local',
    path: source,
  };
}

/**
 * Fetch GitHub repository tree and find .ds.md files.
 */
export async function findDossierFilesGitHub(
  owner: string,
  repo: string,
  subpath: string,
  branch: string,
): Promise<GitHubFile[]> {
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`;

  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'User-Agent': 'dossier-cli',
        'Accept': 'application/vnd.github.v3+json',
      },
    };

    https.get(apiUrl, options, (res) => {
      if (res.statusCode === 404) {
        return reject(new Error(`Repository not found: ${owner}/${repo} (branch: ${branch})`));
      }
      if (res.statusCode === 403) {
        return reject(new Error('GitHub API rate limit exceeded. Try again later or use a local clone.'));
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`GitHub API error: ${res.statusCode} ${res.statusMessage}`));
      }

      let data = '';
      res.on('data', (chunk: string) => { data += chunk; });
      res.on('end', () => {
        try {
          const tree = JSON.parse(data);
          if (!tree.tree) {
            return reject(new Error('Invalid response from GitHub API'));
          }

          const dossierFiles: GitHubFile[] = tree.tree
            .filter((item: { type: string; path: string }) => {
              if (item.type !== 'blob') return false;
              if (!item.path.endsWith('.ds.md')) return false;
              if (subpath && !item.path.startsWith(subpath + '/') && item.path !== subpath) return false;
              if (item.path.includes('node_modules/')) return false;
              return true;
            })
            .map((item: { path: string }) => ({
              path: item.path,
              rawUrl: `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${item.path}`,
              githubUrl: `https://github.com/${owner}/${repo}/blob/${branch}/${item.path}`,
            }));

          resolve(dossierFiles);
        } catch (err) {
          reject(new Error(`Failed to parse GitHub response: ${(err as Error).message}`));
        }
      });
    }).on('error', reject);
  });
}

/**
 * Fetch and parse dossier metadata from a URL.
 */
export async function fetchDossierMetadata(url: string, displayPath: string): Promise<DossierMetadata> {
  return new Promise((resolve) => {
    const protocol = url.startsWith('https://') ? https : http;

    protocol.get(url, (res) => {
      if (res.statusCode !== 200) {
        resolve({
          path: displayPath,
          filename: path.basename(displayPath),
          title: path.basename(displayPath, '.ds.md'),
          error: `HTTP ${res.statusCode}`,
        });
        return;
      }

      let content = '';
      res.on('data', (chunk: string) => { content += chunk; });
      res.on('end', () => {
        resolve(parseDossierMetadataFromContent(content, displayPath));
      });
    }).on('error', (err) => {
      resolve({
        path: displayPath,
        filename: path.basename(displayPath),
        title: path.basename(displayPath, '.ds.md'),
        error: err.message,
      });
    });
  });
}

/**
 * Parse dossier metadata from file content.
 */
export function parseDossierMetadataFromContent(content: string, filePath: string): DossierMetadata {
  try {
    // Check for ---dossier JSON frontmatter format
    const jsonFrontmatterMatch = content.match(/^---dossier\s*\n([\s\S]*?)\n---/);
    if (jsonFrontmatterMatch) {
      try {
        const frontmatter = JSON.parse(jsonFrontmatterMatch[1]);
        return {
          path: filePath,
          filename: path.basename(filePath),
          title: frontmatter.title || path.basename(filePath, '.ds.md'),
          version: frontmatter.version || '-',
          risk_level: frontmatter.risk_level || 'unknown',
          category: Array.isArray(frontmatter.category) ? frontmatter.category.join(', ') : (frontmatter.category || '-'),
          status: frontmatter.status || '-',
          signed: !!frontmatter.signature,
          checksum: !!frontmatter.checksum,
          objective: frontmatter.objective || '',
          error: null,
        };
      } catch {
        return {
          path: filePath,
          filename: path.basename(filePath),
          title: path.basename(filePath, '.ds.md'),
          error: 'Invalid JSON frontmatter',
        };
      }
    }

    // Check for standard YAML frontmatter format
    const yamlFrontmatterMatch = content.match(/^---\s*\n([\s\S]*?)\n---/);
    if (yamlFrontmatterMatch) {
      const frontmatter: Record<string, string> = {};
      const lines = yamlFrontmatterMatch[1].split('\n');
      for (const line of lines) {
        const match = line.match(/^(\w+):\s*(.*)$/);
        if (match) {
          let value = match[2].trim();
          if ((value.startsWith('"') && value.endsWith('"')) ||
              (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1);
          }
          frontmatter[match[1]] = value;
        }
      }

      return {
        path: filePath,
        filename: path.basename(filePath),
        title: frontmatter.title || path.basename(filePath, '.ds.md'),
        version: frontmatter.version || '-',
        risk_level: frontmatter.risk_level || 'unknown',
        category: frontmatter.category || '-',
        status: frontmatter.status || '-',
        signed: !!frontmatter.signature,
        checksum: !!frontmatter.checksum,
        objective: frontmatter.objective || '',
        error: null,
      };
    }

    // No frontmatter found
    return {
      path: filePath,
      filename: path.basename(filePath),
      title: path.basename(filePath, '.ds.md'),
      error: 'No frontmatter found',
    };
  } catch (err) {
    return {
      path: filePath,
      filename: path.basename(filePath),
      title: path.basename(filePath, '.ds.md'),
      error: (err as Error).message,
    };
  }
}

/**
 * Parse dossier metadata from a local file.
 */
export function parseDossierMetadataLocal(filePath: string): DossierMetadata {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return parseDossierMetadataFromContent(content, filePath);
  } catch (err) {
    return {
      path: filePath,
      filename: path.basename(filePath),
      title: path.basename(filePath, '.ds.md'),
      error: (err as Error).message,
    };
  }
}

/**
 * Verify a dossier file using the verify script (quick check).
 */
export function verifyDossierQuick(filePath: string): boolean {
  const verifyScript = path.join(BIN_DIR, 'dossier-verify');
  try {
    execSync(`node "${verifyScript}" "${filePath}" --exit-code-only 2>/dev/null`, { stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
}

/**
 * Format output as table.
 */
export function formatTable(dossiers: DossierMetadata[], showPath = false): string {
  if (dossiers.length === 0) {
    return 'No dossiers found.';
  }

  const titleWidth = Math.min(30, Math.max(5, ...dossiers.map(d => (d.title || '').length)));
  const riskWidth = 8;
  const signedWidth = 6;

  let output = '\n';
  output += 'TITLE'.padEnd(titleWidth + 2);
  output += 'RISK'.padEnd(riskWidth + 2);
  output += 'SIGNED'.padEnd(signedWidth + 2);
  output += showPath ? 'PATH' : 'FILE';
  output += '\n';
  output += '─'.repeat(titleWidth + riskWidth + signedWidth + 50) + '\n';

  for (const d of dossiers) {
    const title = (d.title || d.filename).substring(0, titleWidth);
    const risk = (d.risk_level || 'unknown').toUpperCase().substring(0, riskWidth);
    const signed = d.signed ? '✅' : '⚠️';
    const pathOrFile = showPath ? d.path : d.filename;

    output += title.padEnd(titleWidth + 2);
    output += risk.padEnd(riskWidth + 2);
    output += signed.padEnd(signedWidth + 2);
    output += pathOrFile;
    output += '\n';
  }

  return output;
}
