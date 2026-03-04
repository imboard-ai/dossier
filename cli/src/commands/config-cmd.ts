import type { Command } from 'commander';
import * as config from '../config';

export function registerConfigCommand(program: Command): void {
  program
    .command('config')
    .description('Manage dossier configuration')
    .argument('[key]', 'Configuration key (e.g., defaultLlm)')
    .argument('[value]', 'Value to set (omit to get current value)')
    .option('--list', 'List all configuration')
    .option('--reset', 'Reset to defaults')
    .action(
      (
        key: string | undefined,
        value: string | undefined,
        options: { list?: boolean; reset?: boolean }
      ) => {
        if (options.list || (!key && !options.reset)) {
          const currentConfig = config.loadConfig();
          console.log('📋 Current Configuration:\n');
          console.log(`   Config file: ${config.CONFIG_FILE}\n`);
          Object.entries(currentConfig).forEach(([k, v]) => {
            console.log(`   ${k}: ${v}`);
          });
          console.log('\nTo change a setting: dossier config <key> <value>');
          console.log('Example: dossier config defaultLlm claude-code\n');
          process.exit(0);
        }

        if (options.reset) {
          if (config.saveConfig(config.DEFAULT_CONFIG)) {
            console.log('✅ Configuration reset to defaults\n');
            Object.entries(config.DEFAULT_CONFIG).forEach(([k, v]) => {
              console.log(`   ${k}: ${v}`);
            });
          } else {
            console.log('❌ Failed to reset configuration');
            process.exit(1);
          }
          process.exit(0);
        }

        if (key && !value) {
          const val = config.getConfig(key);
          if (val !== undefined) {
            console.log(`${key}: ${val}`);
          } else {
            console.log(`❌ Unknown configuration key: ${key}\n`);
            console.log('Available keys:');
            for (const k of Object.keys(config.DEFAULT_CONFIG)) {
              console.log(`   - ${k}`);
            }
            process.exit(1);
          }
          process.exit(0);
        }

        if (key && value) {
          if (!(key in config.DEFAULT_CONFIG)) {
            console.log(`⚠️  Warning: '${key}' is not a standard config key\n`);
            console.log('Standard keys:');
            for (const k of Object.keys(config.DEFAULT_CONFIG)) {
              console.log(`   - ${k}`);
            }
            console.log('\nContinuing anyway...\n');
          }

          if (key === 'defaultLlm') {
            const validLlms = ['auto', 'claude-code'];
            if (!validLlms.includes(value)) {
              console.log(`⚠️  Warning: '${value}' may not be a supported LLM\n`);
              console.log('Supported values:');
              for (const llm of validLlms) {
                console.log(`   - ${llm}`);
              }
              console.log('\nContinuing anyway...\n');
            }
          }

          if (config.setConfig(key, value)) {
            console.log(`✅ Configuration updated: ${key} = ${value}`);
          } else {
            console.log('❌ Failed to update configuration');
            process.exit(1);
          }
          process.exit(0);
        }
      }
    );
}
