import type { Command } from 'commander';
import { loadCredentials, isExpired } from '../credentials';

export function registerWhoamiCommand(program: Command): void {
  program
    .command('whoami')
    .description('Show current registry user')
    .action(() => {
      const credentials = loadCredentials();
      if (!credentials) {
        console.log('\nℹ️  Not logged in');
        console.log('   Run `dossier login` to authenticate\n');
        process.exit(1);
      }

      if (isExpired(credentials)) {
        console.log('\n⚠️  Credentials expired');
        console.log('   Run `dossier login` to re-authenticate\n');
        process.exit(1);
      }

      console.log(`\n👤 ${credentials.username}`);
      if (credentials.orgs.length > 0) {
        console.log(`   Organizations: ${credentials.orgs.join(', ')}`);
      }
      console.log('');
    });
}
