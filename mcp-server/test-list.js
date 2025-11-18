#!/usr/bin/env node

/**
 * Test script for list_dossiers functionality
 */

const { listDossiers } = require('./dist/tools/listDossiers.js');
const path = require('node:path');

// Test with the examples directory
const examplesPath = path.join(__dirname, '../examples');

console.log('Testing list_dossiers with:', examplesPath);
console.log('');

try {
  const result = listDossiers({ path: examplesPath, recursive: true });
  console.log(JSON.stringify(result, null, 2));
  console.log('');
  console.log(`Found ${result.count} dossiers`);
  console.log('Test completed successfully!');
  process.exit(0);
} catch (error) {
  console.error('Test failed:', error.message);
  console.error(error.stack);
  process.exit(1);
}
