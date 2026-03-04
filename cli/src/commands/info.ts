import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import type { Command } from 'commander';
import { getClient, parseNameVersion } from '../registry-client';

export function registerInfoCommand(program: Command): void {
  program
    .command('info')
    .description('Show dossier metadata')
    .argument('<file-or-name>', 'Local dossier file path or registry dossier name')
    .option('--json', 'Output as JSON')
    .action(async (fileOrName: string, options: { json?: boolean }) => {
      let frontmatter: Record<string, any>;
      let body: string | null;
      let source: string;

      const resolved = path.resolve(fileOrName);
      const isLocal = fs.existsSync(resolved);

      if (isLocal) {
        source = resolved;
        const content = fs.readFileSync(resolved, 'utf8');

        const jsonMatch = content.match(/^---dossier\s*\n([\s\S]*?)\n---\n?([\s\S]*)$/);
        if (jsonMatch) {
          try {
            frontmatter = JSON.parse(jsonMatch[1]);
            body = jsonMatch[2];
          } catch (err: unknown) {
            console.error(`\n❌ Invalid JSON in frontmatter: ${(err as Error).message}\n`);
            process.exit(1);
          }
        } else {
          const yamlMatch = content.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
          if (yamlMatch) {
            frontmatter = {};
            const lines = yamlMatch[1].split('\n');
            let currentKey: string | null = null;
            for (const line of lines) {
              const kvMatch = line.match(/^(\w[\w_-]*):\s*(.*)$/);
              if (kvMatch) {
                currentKey = kvMatch[1];
                const val = kvMatch[2].trim();
                if (val === '' || val === '|' || val === '>') {
                  frontmatter[currentKey] = '';
                } else if (val.startsWith('[') || val.startsWith('{')) {
                  try {
                    frontmatter[currentKey] = JSON.parse(val);
                  } catch {
                    frontmatter[currentKey] = val;
                  }
                } else {
                  frontmatter[currentKey] = val;
                }
              } else if (currentKey && line.match(/^\s*-\s+(.+)$/)) {
                const item = line.match(/^\s*-\s+(.+)$/)![1].trim();
                if (!Array.isArray(frontmatter[currentKey])) {
                  frontmatter[currentKey] = frontmatter[currentKey]
                    ? [frontmatter[currentKey]]
                    : [];
                }
                frontmatter[currentKey].push(item);
              }
            }
            body = yamlMatch[2];
          } else {
            console.error('\n❌ Invalid dossier format: no frontmatter found\n');
            process.exit(1);
          }
        }
      } else {
        source = `registry: ${fileOrName}`;
        try {
          const [dossierName, version] = parseNameVersion(fileOrName);
          const client = getClient();
          const meta = (await client.getDossier(dossierName, version || null)) as any;
          frontmatter = meta;
          body = null;
        } catch (err: any) {
          if (err.statusCode === 404) {
            console.error(`\n❌ Not found: ${fileOrName}`);
            console.error('   Not a local file and not found in registry\n');
          } else {
            console.error(`\n❌ Error: ${err.message}\n`);
          }
          process.exit(1);
        }
      }

      if (options.json) {
        console.log(JSON.stringify(frontmatter!, null, 2));
        process.exit(0);
      }

      console.log(`\n📄 Dossier Info\n`);
      console.log(`   Source:    ${source}`);

      const fm = frontmatter!;
      const fields: [string, string][] = [
        ['Name', fm.name || fm.title || ''],
        ['Title', fm.title || ''],
        ['Version', fm.version || ''],
        ['Status', fm.status || ''],
        ['Category', Array.isArray(fm.category) ? fm.category.join(', ') : fm.category || ''],
        ['Risk Level', fm.risk_level || ''],
        ['Objective', fm.objective || fm.description || ''],
      ];

      for (const [label, value] of fields) {
        if (value) {
          console.log(`   ${label.padEnd(10)} ${value}`);
        }
      }

      const authors = fm.authors;
      if (Array.isArray(authors) && authors.length > 0) {
        const authorStr = authors
          .map((a: any) => {
            if (typeof a === 'string') {
              const nameMatch = a.match(/^name:\s*(.+)$/);
              return nameMatch ? nameMatch[1] : a;
            }
            return a.name || '';
          })
          .filter(Boolean)
          .join(', ');
        if (authorStr) console.log(`   Authors:   ${authorStr}`);
      }

      if (Array.isArray(fm.tags) && fm.tags.length > 0) {
        console.log(`   Tags:      ${fm.tags.join(', ')}`);
      }

      if (body !== null) {
        const checksumInfo = fm.checksum;
        if (checksumInfo?.hash) {
          const actual = crypto.createHash('sha256').update(body, 'utf8').digest('hex');
          const valid = actual === checksumInfo.hash;
          console.log(
            `   Checksum:  ${checksumInfo.hash.slice(0, 16)}... ${valid ? '✅ valid' : '❌ mismatch'}`
          );
        } else {
          console.log(`   Checksum:  missing`);
        }
      }

      if (fm.signature) {
        const sig = fm.signature;
        console.log(`   Signed by: ${sig.signed_by || sig.key_id || 'unknown'}`);
      }

      console.log('');
      process.exit(0);
    });
}
