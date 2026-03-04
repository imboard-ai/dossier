import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import type { Command } from 'commander';

export function registerKeysCommand(program: Command): void {
  const keysCmd = program.command('keys').description('Manage trusted signing keys');

  keysCmd
    .command('list')
    .description('List trusted signing keys')
    .option('--json', 'JSON output')
    .action((options: { json?: boolean }) => {
      const trustedKeysPath = path.join(os.homedir(), '.dossier', 'trusted-keys.txt');

      console.log('\n🔑 Trusted Signing Keys\n');

      if (!fs.existsSync(trustedKeysPath)) {
        console.log('⚠️  No trusted keys file found');
        console.log(`   Location: ${trustedKeysPath}`);
        console.log('\nTo add a trusted key:');
        console.log('   dossier keys add <public-key> <identifier>\n');
        process.exit(0);
      }

      const content = fs.readFileSync(trustedKeysPath, 'utf8');
      const lines = content.split('\n').filter((line) => line.trim() && !line.startsWith('#'));

      if (lines.length === 0) {
        console.log('⚠️  No trusted keys configured');
        console.log(`   File exists at: ${trustedKeysPath}`);
        console.log('\nTo add a trusted key:');
        console.log('   dossier keys add <public-key> <identifier>\n');
        process.exit(0);
      }

      if (options.json) {
        const keys = lines.map((line) => {
          const [key, ...idParts] = line.trim().split(/\s+/);
          return { public_key: key, identifier: idParts.join(' ') };
        });
        console.log(JSON.stringify(keys, null, 2));
      } else {
        console.log(`Total: ${lines.length} trusted key(s)\n`);
        lines.forEach((line, index) => {
          const [key, ...idParts] = line.trim().split(/\s+/);
          const identifier = idParts.join(' ');
          const shortKey = key.length > 60 ? key.substring(0, 60) + '...' : key;
          console.log(`${index + 1}. ${identifier}`);
          console.log(`   ${shortKey}`);
          console.log();
        });
        console.log(`Location: ${trustedKeysPath}\n`);
      }

      process.exit(0);
    });

  keysCmd
    .command('add')
    .description('Add a trusted signing key')
    .argument('<public-key>', 'Public key (base64 or minisign format)')
    .argument('<identifier>', 'Human-readable identifier (e.g., "dossier-team-2025")')
    .action((publicKey: string, identifier: string) => {
      const dossierDir = path.join(os.homedir(), '.dossier');
      const trustedKeysPath = path.join(dossierDir, 'trusted-keys.txt');

      console.log('\n🔑 Adding Trusted Key\n');

      if (!fs.existsSync(dossierDir)) {
        fs.mkdirSync(dossierDir, { recursive: true });
        console.log(`✅ Created directory: ${dossierDir}`);
      }

      if (fs.existsSync(trustedKeysPath)) {
        const content = fs.readFileSync(trustedKeysPath, 'utf8');
        if (content.includes(publicKey)) {
          console.log('⚠️  This key already exists in trusted keys');
          console.log(`   Location: ${trustedKeysPath}\n`);
          process.exit(0);
        }
      }

      const entry = `${publicKey} ${identifier}\n`;
      fs.appendFileSync(trustedKeysPath, entry, 'utf8');

      console.log('✅ Key added successfully');
      console.log(`   Identifier: ${identifier}`);
      console.log(
        `   Public Key: ${publicKey.substring(0, 60)}${publicKey.length > 60 ? '...' : ''}`
      );
      console.log(`   Location: ${trustedKeysPath}`);
      console.log('\nYou can now verify dossiers signed with this key.\n');

      process.exit(0);
    });
}
