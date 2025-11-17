#!/usr/bin/env node

/**
 * Dossier Signing Tool
 *
 * Signs a dossier with minisign and embeds the checksum and signature in the frontmatter.
 *
 * Usage:
 *   node tools/sign-dossier.js <dossier-file> --key <minisign-key-file> [--key-id <id>]
 *
 * Prerequisites:
 *   - minisign must be installed (brew install minisign)
 *   - You must have a minisign private key
 *
 * Example:
 *   node tools/sign-dossier.js examples/devops/deploy-to-aws.md --key ~/.minisign/imboard-ai-2024.key --key-id imboard-ai-2024
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { parseDossierContent, calculateChecksum } = require('@imboard-ai/dossier-core');

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);

  if (args.length < 1 || args.includes('--help') || args.includes('-h')) {
    console.log(`
Dossier Signing Tool

Usage:
  node tools/sign-dossier.js <dossier-file> --key <minisign-key-file> [options]

Options:
  --key <file>        Path to minisign private key file (REQUIRED)
  --key-id <id>       Human-readable key identifier (e.g., 'imboard-ai-2024')
  --signed-by <name>  Signer identity (e.g., 'Imboard AI <security@imboard.ai>')
  --dry-run           Calculate checksum but don't sign
  --help, -h          Show this help message

Example:
  node tools/sign-dossier.js examples/devops/deploy-to-aws.md \\
    --key ~/.minisign/imboard-ai-2024.key \\
    --key-id imboard-ai-2024 \\
    --signed-by "Imboard AI <security@imboard.ai>"
`);
    process.exit(args.includes('--help') || args.includes('-h') ? 0 : 1);
  }

  const dossierFile = args[0];
  const keyIndex = args.indexOf('--key');
  const keyIdIndex = args.indexOf('--key-id');
  const signedByIndex = args.indexOf('--signed-by');
  const dryRun = args.includes('--dry-run');

  if (!dryRun && keyIndex === -1) {
    console.error('Error: --key is required (unless using --dry-run)');
    process.exit(1);
  }

  return {
    dossierFile,
    keyFile: keyIndex !== -1 ? args[keyIndex + 1] : null,
    keyId: keyIdIndex !== -1 ? args[keyIdIndex + 1] : null,
    signedBy: signedByIndex !== -1 ? args[signedByIndex + 1] : null,
    dryRun
  };
}

// Sign content with minisign
function signWithMinisign(content, keyFile) {
  // Check if minisign is installed
  try {
    execSync('which minisign', { stdio: 'ignore' });
  } catch (err) {
    throw new Error('minisign not found. Install it with: brew install minisign (macOS) or apt-get install minisign (Linux)');
  }

  // Check if key file exists
  if (!fs.existsSync(keyFile)) {
    throw new Error(`Key file not found: ${keyFile}`);
  }

  // Create temporary file for content
  const tempFile = '/tmp/dossier-content-' + Date.now() + '.txt';
  fs.writeFileSync(tempFile, content, 'utf8');

  try {
    // Sign with minisign
    // Output will be tempFile.minisig
    execSync(`minisign -S -s "${keyFile}" -m "${tempFile}" -t "dossier signature"`, {
      stdio: 'inherit'
    });

    // Read signature file
    const sigFile = tempFile + '.minisig';
    if (!fs.existsSync(sigFile)) {
      throw new Error('Signature file was not created');
    }

    const signature = fs.readFileSync(sigFile, 'utf8');

    // Clean up temp files
    fs.unlinkSync(tempFile);
    fs.unlinkSync(sigFile);

    return signature;
  } catch (err) {
    // Clean up on error
    if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
    if (fs.existsSync(tempFile + '.minisig')) fs.unlinkSync(tempFile + '.minisig');
    throw err;
  }
}

// Extract public key from minisign key file
function getPublicKey(keyFile) {
  // Minisign private key files have corresponding .pub files
  const pubFile = keyFile.replace(/\.key$/, '.pub');

  if (!fs.existsSync(pubFile)) {
    throw new Error(`Public key file not found: ${pubFile}\nMake sure the .pub file is in the same directory as the .key file`);
  }

  const pubContent = fs.readFileSync(pubFile, 'utf8');
  // Public key is on the second line
  const lines = pubContent.trim().split('\n');
  if (lines.length < 2) {
    throw new Error(`Invalid public key file format: ${pubFile}`);
  }

  return lines[1].trim();
}

// Main function
function main() {
  const options = parseArgs();

  console.log('🔐 Dossier Signing Tool\n');
  console.log(`Dossier: ${options.dossierFile}`);

  // Read dossier file
  if (!fs.existsSync(options.dossierFile)) {
    console.error(`Error: File not found: ${options.dossierFile}`);
    process.exit(1);
  }

  const content = fs.readFileSync(options.dossierFile, 'utf8');

  // Parse dossier
  let parsed;
  try {
    parsed = parseDossierContent(content);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }

  const { frontmatter, body } = parsed;

  // Calculate checksum
  console.log('\n📊 Calculating checksum...');
  const checksum = calculateChecksum(body);
  console.log(`   SHA256: ${checksum}`);

  // Add checksum to frontmatter
  frontmatter.checksum = {
    algorithm: 'sha256',
    hash: checksum
  };

  if (options.dryRun) {
    console.log('\n✅ Dry run complete (checksum calculated, no signature)');
    console.log('\nUpdated frontmatter:');
    console.log(JSON.stringify(frontmatter, null, 2));
    return;
  }

  // Sign with minisign
  console.log('\n✍️  Signing with minisign...');
  console.log(`   Key file: ${options.keyFile}`);

  let signature;
  let publicKey;
  try {
    signature = signWithMinisign(body, options.keyFile);
    publicKey = getPublicKey(options.keyFile);
  } catch (err) {
    console.error(`\nError: ${err.message}`);
    process.exit(1);
  }

  console.log('   ✓ Signature created');

  // Add signature to frontmatter
  frontmatter.signature = {
    algorithm: 'minisign',
    public_key: publicKey,
    signature: signature,
    signed_at: new Date().toISOString()
  };

  if (options.keyId) {
    frontmatter.signature.key_id = options.keyId;
  }

  if (options.signedBy) {
    frontmatter.signature.signed_by = options.signedBy;
  }

  // Write updated dossier
  console.log('\n💾 Updating dossier file...');

  const updatedContent = `---dossier\n${JSON.stringify(frontmatter, null, 2)}\n---\n${body}`;
  fs.writeFileSync(options.dossierFile, updatedContent, 'utf8');

  console.log('   ✓ File updated');
  console.log('\n✅ Dossier signed successfully!');
  console.log(`\nSignature details:`);
  console.log(`  Algorithm: minisign`);
  console.log(`  Public key: ${publicKey}`);
  console.log(`  Key ID: ${options.keyId || '(not specified)'}`);
  console.log(`  Signed by: ${options.signedBy || '(not specified)'}`);
  console.log(`  Signed at: ${frontmatter.signature.signed_at}`);
}

// Run
if (require.main === module) {
  try {
    main();
  } catch (err) {
    console.error(`\nFatal error: ${err.message}`);
    process.exit(1);
  }
}

module.exports = { parseDossier, calculateChecksum, signWithMinisign };
