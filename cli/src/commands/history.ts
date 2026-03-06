/**
 * ai-dossier history — show persistent run log
 */

import type { Command } from 'commander';
import { clearRunLog, readRunLog } from '../run-log';

export function registerHistoryCommand(program: Command): void {
  program
    .command('history')
    .description('Show dossier run history')
    .option('--limit <n>', 'Number of entries to show', '20')
    .option('--dossier <name>', 'Filter by dossier name')
    .option('--json', 'Output as JSON')
    .option('--clear', 'Clear run history')
    .option('--yes', 'Skip confirmation for --clear')
    .action(
      async (options: {
        limit?: string;
        dossier?: string;
        json?: boolean;
        clear?: boolean;
        yes?: boolean;
      }) => {
        if (options.clear) {
          if (!options.yes) {
            console.error('Use --yes to confirm clearing run history');
            process.exit(1);
            return;
          }
          clearRunLog();
          console.log('Run history cleared.');
          process.exit(0);
          return;
        }

        const limit = Number.parseInt(options.limit || '20', 10);
        const entries = readRunLog({ limit, dossier: options.dossier });

        if (entries.length === 0) {
          console.log('No run history found.');
          process.exit(0);
        }

        if (options.json) {
          console.log(JSON.stringify(entries, null, 2));
          process.exit(0);
        }

        // Table output
        const colTimestamp = 20;
        const colDossier = 35;
        const colVersion = 8;
        const colSource = 10;
        const colVerified = 12;

        const header = [
          'TIMESTAMP'.padEnd(colTimestamp),
          'DOSSIER'.padEnd(colDossier),
          'VERSION'.padEnd(colVersion),
          'SOURCE'.padEnd(colSource),
          'VERIFIED'.padEnd(colVerified),
        ].join('  ');

        console.log(header);
        console.log('─'.repeat(header.length));

        for (const entry of entries) {
          const ts = entry.timestamp
            .replace('T', ' ')
            .replace(/\.\d+Z$/, '')
            .slice(0, 19);
          const dossier =
            entry.dossier.length > colDossier - 1
              ? `${entry.dossier.slice(0, colDossier - 4)}...`
              : entry.dossier;
          const ver = entry.resolved_version.slice(0, colVersion);
          const src = entry.source.slice(0, colSource);
          const verified = entry.verification;

          const line = [
            ts.padEnd(colTimestamp),
            dossier.padEnd(colDossier),
            ver.padEnd(colVersion),
            src.padEnd(colSource),
            verified.padEnd(colVerified),
          ].join('  ');

          console.log(line);

          if (entry.update_available) {
            console.log(`  ↑ update available: ${entry.update_available}`);
          }
        }

        process.exit(0);
      }
    );
}
