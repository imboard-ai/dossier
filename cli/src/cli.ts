/**
 * Dossier CLI - Main entry point (TypeScript)
 * Sets up Commander program and registers all commands.
 */

import { program } from 'commander';

// Package info
const pkg = require('../package.json');

// Import command registrations
import { registerVerifyCommand } from './commands/verify';
import { registerRunCommand } from './commands/run';
import { registerCreateCommand } from './commands/create';
import { registerConfigCommand } from './commands/config-cmd';
import { registerListCommand } from './commands/list';
import { registerSearchCommand } from './commands/search';
import { registerInfoCommand } from './commands/info';
import { registerSignCommand } from './commands/sign';
import { registerPublishCommand } from './commands/publish';
import { registerRemoveCommand } from './commands/remove';
import { registerLoginCommand } from './commands/login';
import { registerLogoutCommand } from './commands/logout';
import { registerWhoamiCommand } from './commands/whoami';
import { registerChecksumCommand } from './commands/checksum';
import { registerValidateCommand } from './commands/validate';
import { registerInitCommand } from './commands/init';
import { registerResetHooksCommand } from './commands/reset-hooks';
import { registerPromptHookCommand } from './commands/prompt-hook';
import { registerPullCommand } from './commands/pull';
import { registerExportCommand } from './commands/export';
import { registerCacheCommand } from './commands/cache';
import { registerInstallSkillCommand } from './commands/install-skill';
import { registerKeysCommand } from './commands/keys';
import { registerLintCommand } from './commands/lint';
import { registerFormatCommand } from './commands/format';

// Setup program
program
  .name('dossier')
  .description('CLI tool for creating, verifying, and executing dossiers')
  .version(pkg.version);

// Register all commands
registerVerifyCommand(program);
registerRunCommand(program);
registerCreateCommand(program);
registerConfigCommand(program);
registerListCommand(program);
registerSearchCommand(program);
registerInfoCommand(program);
registerSignCommand(program);
registerPublishCommand(program);
registerRemoveCommand(program);
registerLoginCommand(program);
registerLogoutCommand(program);
registerWhoamiCommand(program);
registerChecksumCommand(program);
registerValidateCommand(program);
registerInitCommand(program);
registerResetHooksCommand(program);
registerPromptHookCommand(program);
registerPullCommand(program);
registerExportCommand(program);
registerCacheCommand(program);
registerInstallSkillCommand(program);
registerKeysCommand(program);
registerLintCommand(program);
registerFormatCommand(program);

// Parse and execute
program.parse(process.argv);

// Show help if no command provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
