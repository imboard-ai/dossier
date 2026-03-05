import type { Command } from 'commander';
import { isExpired, loadCredentials } from '../credentials';

export function registerWhoamiCommand(program: Command): void {
  program
    .command('whoami')
    .description('Show current registry user')
    .option('--json', 'Output as JSON')
    .action((options: { json?: boolean }) => {
      const credentials = loadCredentials();
      if (!credentials) {
        if (options.json) {
          console.log(
            JSON.stringify(
              { logged_in: false, error: 'Not logged in', code: 'not_logged_in' },
              null,
              2
            )
          );
        } else {
          console.log('\nℹ️  Not logged in');
          console.log('   Run `dossier login` to authenticate\n');
        }
        process.exit(1);
      }

      if (isExpired(credentials)) {
        if (options.json) {
          console.log(
            JSON.stringify(
              { logged_in: false, error: 'Credentials expired', code: 'expired' },
              null,
              2
            )
          );
        } else {
          console.log('\n⚠️  Credentials expired');
          console.log('   Run `dossier login` to re-authenticate\n');
        }
        process.exit(1);
      }

      if (options.json) {
        console.log(
          JSON.stringify(
            {
              logged_in: true,
              username: credentials.username,
              orgs: credentials.orgs,
            },
            null,
            2
          )
        );
      } else {
        console.log(`\n👤 ${credentials.username}`);
        if (credentials.orgs.length > 0) {
          console.log(`   Organizations: ${credentials.orgs.join(', ')}`);
        }
        console.log('');
      }
    });
}
