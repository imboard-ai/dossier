import type { Command } from 'commander';
import * as config from '../config';

const REQUIRED_PROTOCOL = 'https:';
const VALID_LLMS = ['auto', 'claude-code'];

interface ConfigOptions {
  list?: boolean;
  reset?: boolean;
  addRegistry?: string;
  removeRegistry?: string;
  setDefaultRegistry?: string;
  listRegistries?: boolean;
  url?: string;
  default?: boolean;
  readonly?: boolean;
  json?: boolean;
}

function handleListRegistries(options: ConfigOptions): void {
  const registries = config.resolveRegistries();
  const currentConfig = config.loadConfig();
  const projectConfig = config.loadProjectConfig();

  if (options.json) {
    console.log(
      JSON.stringify(
        {
          registries: registries.map((r) => ({
            name: r.name,
            url: r.url,
            readonly: r.readonly || false,
            default: r.name === (projectConfig?.defaultRegistry || currentConfig.defaultRegistry),
          })),
          defaultRegistry: projectConfig?.defaultRegistry || currentConfig.defaultRegistry || null,
        },
        null,
        2
      )
    );
  } else {
    console.log('\n📋 Configured Registries:\n');
    const defaultName = projectConfig?.defaultRegistry || currentConfig.defaultRegistry;
    for (const r of registries) {
      const flags: string[] = [];
      if (r.name === defaultName) flags.push('default');
      if (r.readonly) flags.push('read-only');
      const flagStr = flags.length > 0 ? ` (${flags.join(', ')})` : '';
      console.log(`   ${r.name}: ${r.url}${flagStr}`);
    }
    console.log('');
  }
  process.exit(0);
}

function handleAddRegistry(options: ConfigOptions): void {
  if (!options.url) {
    console.error('\n❌ --url is required when adding a registry\n');
    console.error(
      'Example: dossier config --add-registry internal --url https://dossier.company.com\n'
    );
    process.exit(1);
  }

  // Validate HTTPS — reject http:// and other insecure protocols
  try {
    const parsed = new URL(options.url);
    if (parsed.protocol !== REQUIRED_PROTOCOL) {
      console.error(`\n❌ Registry URL must use HTTPS: ${options.url}\n`);
      console.error('Only https:// URLs are allowed to protect credentials in transit.\n');
      process.exit(1);
    }
  } catch {
    console.error(`\n❌ Invalid URL: ${options.url}\n`);
    process.exit(1);
  }

  const currentConfig = config.loadConfig();
  if (!currentConfig.registries) {
    currentConfig.registries = {};
  }

  const entry: config.RegistryEntry = { url: options.url };
  if (options.default) entry.default = true;
  if (options.readonly) entry.readonly = true;

  currentConfig.registries[options.addRegistry!] = entry;

  if (options.default) {
    currentConfig.defaultRegistry = options.addRegistry;
  }

  if (config.saveConfig(currentConfig)) {
    console.log(`\n✅ Added registry '${options.addRegistry}': ${options.url}`);
    if (options.default) console.log('   Set as default registry');
    if (options.readonly) console.log('   Marked as read-only');
    console.log('');
  } else {
    console.error('❌ Failed to save configuration');
    process.exit(1);
  }
  process.exit(0);
}

function handleRemoveRegistry(options: ConfigOptions): void {
  const currentConfig = config.loadConfig();
  if (!currentConfig.registries || !(options.removeRegistry! in currentConfig.registries)) {
    console.error(`\n❌ Registry '${options.removeRegistry}' not found\n`);
    process.exit(1);
  }

  delete currentConfig.registries[options.removeRegistry!];
  if (currentConfig.defaultRegistry === options.removeRegistry) {
    delete currentConfig.defaultRegistry;
  }

  if (config.saveConfig(currentConfig)) {
    console.log(`\n✅ Removed registry '${options.removeRegistry}'\n`);
  } else {
    console.error('❌ Failed to save configuration');
    process.exit(1);
  }
  process.exit(0);
}

function handleSetDefaultRegistry(options: ConfigOptions): void {
  const registries = config.resolveRegistries();
  const found = registries.find((r) => r.name === options.setDefaultRegistry);
  if (!found) {
    const names = registries.map((r) => r.name).join(', ');
    console.error(`\n❌ Registry '${options.setDefaultRegistry}' not found`);
    console.error(`   Available: ${names}\n`);
    process.exit(1);
  }

  const currentConfig = config.loadConfig();
  currentConfig.defaultRegistry = options.setDefaultRegistry;

  if (config.saveConfig(currentConfig)) {
    console.log(`\n✅ Default registry set to '${options.setDefaultRegistry}'\n`);
  } else {
    console.error('❌ Failed to save configuration');
    process.exit(1);
  }
  process.exit(0);
}

function handleListConfig(): void {
  const currentConfig = config.loadConfig();
  console.log('📋 Current Configuration:\n');
  console.log(`   Config file: ${config.CONFIG_FILE}\n`);
  Object.entries(currentConfig).forEach(([k, v]) => {
    if (typeof v === 'object' && v !== null) {
      console.log(`   ${k}: ${JSON.stringify(v)}`);
    } else {
      console.log(`   ${k}: ${v}`);
    }
  });
  console.log('\nTo change a setting: dossier config <key> <value>');
  console.log('Example: dossier config defaultLlm claude-code\n');
  process.exit(0);
}

function handleReset(): void {
  const currentConfig = config.loadConfig();
  const resetConfig: config.DossierConfig = { ...config.DEFAULT_CONFIG };
  if (currentConfig.registries) {
    resetConfig.registries = currentConfig.registries;
  }
  if (currentConfig.defaultRegistry) {
    resetConfig.defaultRegistry = currentConfig.defaultRegistry;
  }
  if (config.saveConfig(resetConfig)) {
    console.log('✅ Configuration reset to defaults (registry settings preserved)\n');
    Object.entries(resetConfig).forEach(([k, v]) => {
      if (typeof v === 'object' && v !== null) {
        console.log(`   ${k}: ${JSON.stringify(v)}`);
      } else {
        console.log(`   ${k}: ${v}`);
      }
    });
  } else {
    console.log('❌ Failed to reset configuration');
    process.exit(1);
  }
  process.exit(0);
}

function handleGetConfig(key: string): void {
  const val = config.getConfig(key);
  if (val !== undefined) {
    if (typeof val === 'object' && val !== null) {
      console.log(`${key}: ${JSON.stringify(val, null, 2)}`);
    } else {
      console.log(`${key}: ${val}`);
    }
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

function handleSetConfig(key: string, value: string): void {
  if (!(key in config.DEFAULT_CONFIG)) {
    console.log(`⚠️  Warning: '${key}' is not a standard config key\n`);
    console.log('Standard keys:');
    for (const k of Object.keys(config.DEFAULT_CONFIG)) {
      console.log(`   - ${k}`);
    }
    console.log('\nContinuing anyway...\n');
  }

  if (key === 'defaultLlm') {
    if (!VALID_LLMS.includes(value)) {
      console.log(`⚠️  Warning: '${value}' may not be a supported LLM\n`);
      console.log('Supported values:');
      for (const llm of VALID_LLMS) {
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

export function registerConfigCommand(program: Command): void {
  program
    .command('config')
    .description(
      'Manage dossier configuration and registry settings. Use --add-registry, --remove-registry, and --list-registries to manage multiple registries.'
    )
    .argument('[key]', 'Configuration key (e.g., defaultLlm)')
    .argument('[value]', 'Value to set (omit to get current value)')
    .option('--list', 'List all configuration')
    .option('--reset', 'Reset to defaults')
    .option('--add-registry <name>', 'Add a named registry')
    .option('--remove-registry <name>', 'Remove a named registry')
    .option('--set-default-registry <name>', 'Set the default registry')
    .option('--list-registries', 'List configured registries')
    .option('--url <url>', 'Registry URL (used with --add-registry)')
    .option('--default', 'Mark registry as default (used with --add-registry)')
    .option('--readonly', 'Mark registry as read-only (used with --add-registry)')
    .option('--json', 'Output as JSON')
    .addHelpText(
      'after',
      `
Project-level config:
  Place a .dossierrc.json in your project root for team-shared registry settings:
  {
    "registries": { "internal": { "url": "https://dossier.company.com" } },
    "defaultRegistry": "internal"
  }

Environment variables:
  DOSSIER_REGISTRY_URL    Override/add a registry URL (creates virtual "env" registry)
  DOSSIER_REGISTRY_TOKEN  Auth token for the default registry
  DOSSIER_REGISTRY_USER   Username for registry authentication
  DOSSIER_REGISTRY_ORGS   Comma-separated org scopes for registry queries
`
    )
    .action((key: string | undefined, value: string | undefined, options: ConfigOptions) => {
      // --- Registry management ---
      if (options.listRegistries) return handleListRegistries(options);
      if (options.addRegistry) return handleAddRegistry(options);
      if (options.removeRegistry) return handleRemoveRegistry(options);
      if (options.setDefaultRegistry) return handleSetDefaultRegistry(options);

      // --- General config management ---
      if (options.list || (!key && !options.reset)) return handleListConfig();
      if (options.reset) return handleReset();
      if (key && !value) return handleGetConfig(key);
      if (key && value) return handleSetConfig(key, value);
    });
}
