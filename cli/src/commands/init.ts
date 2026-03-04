import fs from 'node:fs';
import path from 'node:path';
import type { Command } from 'commander';
import * as config from '../config';
import * as hooks from '../hooks';

export function registerInitCommand(program: Command): void {
  program
    .command('init')
    .description('Initialize ~/.dossier/ directory and install Claude Code hook')
    .option('--skip-hooks', 'Skip installing the Claude Code hook')
    .action((options: { skipHooks?: boolean }) => {
      const dossierDir = config.CONFIG_DIR;
      const cacheDir = path.join(dossierDir, 'cache');
      const trustedKeysPath = path.join(dossierDir, 'trusted-keys.txt');

      console.log('\n🔧 Initializing Dossier\n');

      if (fs.existsSync(dossierDir)) {
        console.log(`   ✓ ${dossierDir} already exists`);
      } else {
        fs.mkdirSync(dossierDir, { recursive: true, mode: 0o700 });
        console.log(`   ✓ Created ${dossierDir}`);
      }

      if (fs.existsSync(cacheDir)) {
        console.log(`   ✓ ${cacheDir} already exists`);
      } else {
        fs.mkdirSync(cacheDir, { recursive: true, mode: 0o700 });
        console.log(`   ✓ Created ${cacheDir}`);
      }

      const configFile = config.CONFIG_FILE;
      if (fs.existsSync(configFile)) {
        console.log(`   ✓ ${configFile} already exists`);
      } else {
        config.saveConfig(config.DEFAULT_CONFIG);
        console.log(`   ✓ Created ${configFile}`);
      }

      if (fs.existsSync(trustedKeysPath)) {
        console.log(`   ✓ ${trustedKeysPath} already exists`);
      } else {
        fs.writeFileSync(trustedKeysPath, '', { mode: 0o600 });
        console.log(`   ✓ Created ${trustedKeysPath}`);
      }

      if (options.skipHooks) {
        console.log('   - Skipped Claude Code hook (--skip-hooks)');
      } else {
        const installed = hooks.installClaudeHook();
        if (installed) {
          console.log('   ✓ Installed Claude Code discovery hook');
        } else {
          console.log('   ✓ Claude Code discovery hook already installed');
        }
      }

      console.log('\n✅ Dossier initialized successfully\n');
    });
}
