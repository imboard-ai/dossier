#!/usr/bin/env node

/**
 * Test script for verify_dossier functionality
 */

const { verifyDossier } = require('./dist/tools/verifyDossier.js');
const path = require('path');

// Test with the git worktree dossier
const dossierPath = path.join(__dirname, '../examples/development/add-git-worktree-support.ds.md');

console.log('Testing verify_dossier with:', dossierPath);
console.log('');

try {
  const result = verifyDossier({ path: dossierPath });
  console.log(JSON.stringify(result, null, 2));
  console.log('');
  console.log('Test completed successfully!');
  process.exit(0);
} catch (error) {
  console.error('Test failed:', error.message);
  console.error(error.stack);
  process.exit(1);
}
