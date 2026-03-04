import type { Command } from 'commander';
import { deleteCredentials } from '../credentials';

export function registerLogoutCommand(program: Command): void {
  program
    .command('logout')
    .description('Remove stored registry credentials')
    .action(() => {
      const deleted = deleteCredentials();
      if (deleted) {
        console.log('\n✅ Logged out successfully\n');
      } else {
        console.log('\nℹ️  Not logged in (no credentials found)\n');
      }
    });
}
