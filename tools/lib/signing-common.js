/**
 * Common utilities for dossier signing tools
 * Shared by sign-dossier.js and sign-dossier-kms.js
 */

const fs = require('node:fs');
const { parseDossierContent, calculateChecksum } = require('@imboard-ai/dossier-core');

/**
 * Read and parse a dossier file
 * @param {string} dossierFile - Path to dossier file
 * @returns {{ frontmatter: object, body: string }} Parsed dossier
 */
function readAndParseDossier(dossierFile) {
  if (!fs.existsSync(dossierFile)) {
    console.error(`Error: File not found: ${dossierFile}`);
    process.exit(1);
  }

  const content = fs.readFileSync(dossierFile, 'utf8');

  let parsed;
  try {
    parsed = parseDossierContent(content);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }

  return parsed;
}

/**
 * Calculate and add checksum to frontmatter
 * @param {object} frontmatter - Frontmatter object to update
 * @param {string} body - Dossier body content
 * @returns {string} The calculated checksum hash
 */
function addChecksum(frontmatter, body) {
  console.log('\n📊 Calculating checksum...');
  const checksum = calculateChecksum(body);
  console.log(`   SHA256: ${checksum}`);

  frontmatter.checksum = {
    algorithm: 'sha256',
    hash: checksum,
  };

  return checksum;
}

/**
 * Handle dry run - print checksum without signing
 * @param {object} frontmatter - Frontmatter with checksum added
 */
function handleDryRun(frontmatter) {
  console.log('\n✅ Dry run complete (checksum calculated, no signature)');
  console.log('\nUpdated frontmatter:');
  console.log(JSON.stringify(frontmatter, null, 2));
}

/**
 * Write updated dossier file with new frontmatter
 * @param {string} dossierFile - Path to dossier file
 * @param {object} frontmatter - Updated frontmatter
 * @param {string} body - Dossier body content
 */
function writeDossier(dossierFile, frontmatter, body) {
  console.log('\n💾 Updating dossier file...');

  const updatedContent = `---dossier\n${JSON.stringify(frontmatter, null, 2)}\n---\n${body}`;
  fs.writeFileSync(dossierFile, updatedContent, 'utf8');

  console.log('   ✓ File updated');
}

module.exports = {
  readAndParseDossier,
  addChecksum,
  handleDryRun,
  writeDossier,
};
