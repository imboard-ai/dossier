/**
 * Persistent run log for dossier executions.
 * Append-only JSONL at ~/.dossier/runs.jsonl.
 */

import fs from 'node:fs';
import path from 'node:path';
import { CONFIG_DIR, ensureConfigDir, getConfig } from './config';

export interface RunLogEntry {
  timestamp: string;
  dossier: string;
  resolved_version: string;
  source: 'cache' | 'registry' | 'local' | 'url';
  registry?: string;
  verification: 'passed' | 'failed' | 'skipped' | 'nested-skip';
  llm: string;
  user: string;
  cwd: string;
  nested: boolean;
  update_available?: string;
}

const LOG_FILE = path.join(CONFIG_DIR, 'runs.jsonl');

/**
 * Append one JSONL line to ~/.dossier/runs.jsonl.
 * Respects auditLog config flag. Never crashes the run.
 */
export function appendRunLog(entry: RunLogEntry): void {
  try {
    if (getConfig('auditLog') === false) return;
    ensureConfigDir();
    fs.appendFileSync(LOG_FILE, `${JSON.stringify(entry)}\n`, { mode: 0o600 });
  } catch {
    // Never crash the run
  }
}

/**
 * Read the run log, filter, return most-recent-first.
 * Skips malformed lines.
 */
export function readRunLog(opts?: { limit?: number; dossier?: string }): RunLogEntry[] {
  try {
    if (!fs.existsSync(LOG_FILE)) return [];
    const lines = fs.readFileSync(LOG_FILE, 'utf8').split('\n').filter(Boolean);
    let entries: RunLogEntry[] = [];
    for (const line of lines) {
      try {
        entries.push(JSON.parse(line));
      } catch {
        // Skip malformed lines
      }
    }
    if (opts?.dossier) {
      entries = entries.filter((e) => e.dossier === opts.dossier);
    }
    entries.reverse();
    if (opts?.limit) {
      entries = entries.slice(0, opts.limit);
    }
    return entries;
  } catch {
    return [];
  }
}

/**
 * Clear the run log file.
 */
export function clearRunLog(): void {
  try {
    if (fs.existsSync(LOG_FILE)) {
      fs.writeFileSync(LOG_FILE, '', { mode: 0o600 });
    }
  } catch {
    // Silently fail
  }
}

export { LOG_FILE };
