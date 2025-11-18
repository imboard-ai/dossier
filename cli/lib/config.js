/**
 * Configuration management for Dossier CLI
 * Handles reading and writing user preferences to ~/.dossier/config.json
 */

const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');

const CONFIG_DIR = path.join(os.homedir(), '.dossier');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');

/**
 * Default configuration
 */
const DEFAULT_CONFIG = {
  defaultLlm: 'auto',
  theme: 'auto',
  auditLog: true,
};

/**
 * Ensure config directory exists
 */
function ensureConfigDir() {
  if (!fs.existsSync(CONFIG_DIR)) {
    fs.mkdirSync(CONFIG_DIR, { recursive: true });
  }
}

/**
 * Load configuration from file
 * @returns {Object} Configuration object
 */
function loadConfig() {
  try {
    if (!fs.existsSync(CONFIG_FILE)) {
      return { ...DEFAULT_CONFIG };
    }

    const configData = fs.readFileSync(CONFIG_FILE, 'utf8');
    const config = JSON.parse(configData);

    // Merge with defaults to ensure all keys exist
    return { ...DEFAULT_CONFIG, ...config };
  } catch (_error) {
    console.error('⚠️  Warning: Could not read config file, using defaults');
    return { ...DEFAULT_CONFIG };
  }
}

/**
 * Save configuration to file
 * @param {Object} config - Configuration object to save
 */
function saveConfig(config) {
  try {
    ensureConfigDir();
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('❌ Error: Could not save config file:', error.message);
    return false;
  }
}

/**
 * Get a specific config value
 * @param {string} key - Config key to retrieve
 * @returns {*} Config value
 */
function getConfig(key) {
  const config = loadConfig();
  return config[key];
}

/**
 * Set a specific config value
 * @param {string} key - Config key to set
 * @param {*} value - Value to set
 * @returns {boolean} Success status
 */
function setConfig(key, value) {
  const config = loadConfig();
  config[key] = value;
  return saveConfig(config);
}

module.exports = {
  loadConfig,
  saveConfig,
  getConfig,
  setConfig,
  CONFIG_DIR,
  CONFIG_FILE,
  DEFAULT_CONFIG,
};
