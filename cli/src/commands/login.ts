import type { Command } from 'commander';
import { saveCredentials } from '../credentials';
import { runOAuthFlow } from '../oauth';
import { getRegistryUrl } from '../registry-client';

export function registerLoginCommand(program: Command): void {
  program
    .command('login')
    .description('Authenticate with the dossier registry via GitHub')
    .action(async () => {
      try {
        const registryUrl = getRegistryUrl();
        const result = await runOAuthFlow(registryUrl);

        saveCredentials({
          token: result.token,
          username: result.username,
          orgs: result.orgs,
          expiresAt: null,
        });

        console.log(`\n✅ Logged in as ${result.username}`);
        if (result.orgs.length > 0) {
          console.log(`   Organizations: ${result.orgs.join(', ')}`);
        }
        console.log('');
      } catch (err: unknown) {
        console.error(`\n❌ Login failed: ${(err as Error).message}\n`);
        process.exit(1);
      }
    });
}
