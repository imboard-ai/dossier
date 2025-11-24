#!/usr/bin/env node

/**
 * Dossier Signing Tool
 *
 * Signs a dossier with Ed25519 and embeds the checksum and signature in the frontmatter.
 *
 * Usage:
 *   node tools/sign-dossier.js <dossier-file> --key <ed25519-private-key.pem> [--key-id <id>]
 *
 * Prerequisites:
 *   - Ed25519 private key in PEM format
 *
 * Generate a keypair with:
 *   openssl genpkey -algorithm ED25519 -out private-key.pem
 *   openssl pkey -in private-key.pem -pubout -out public-key.pem
 *
 * Example:
 *   node tools/sign-dossier.js examples/devops/deploy-to-aws.md --key ~/.dossier/private-key.pem --key-id imboard-ai-2024
 */

const fs = require('node:fs');
const {
  parseDossierContent,
  calculateChecksum,
  Ed25519Signer,
} = require('@imboard-ai/dossier-core');

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);

  if (args.length < 1 || args.includes('--help') || args.includes('-h')) {
    console.log(`
Dossier Signing Tool

Usage:
  node tools/sign-dossier.js <dossier-file> --key <ed25519-private-key.pem> [options]

Options:
  --key <file>        Path to Ed25519 private key in PEM format (REQUIRED)
  --key-id <id>       Human-readable key identifier (e.g., 'imboard-ai-2024')
  --signed-by <name>  Signer identity (e.g., 'Imboard AI <security@imboard.ai>')
  --dry-run           Calculate checksum but don't sign
  --help, -h          Show this help message

Generate keypair:
  openssl genpkey -algorithm ED25519 -out private-key.pem
  openssl pkey -in private-key.pem -pubout -out public-key.pem

Example:
  node tools/sign-dossier.js examples/devops/deploy-to-aws.md \\
    --key ~/.dossier/private-key.pem \\
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
    dryRun,
  };
}

// Main function
async function main() {
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
    hash: checksum,
  };

  if (options.dryRun) {
    console.log('\n✅ Dry run complete (checksum calculated, no signature)');
    console.log('\nUpdated frontmatter:');
    console.log(JSON.stringify(frontmatter, null, 2));
    return;
  }

  // Sign with Ed25519
  console.log('\n✍️  Signing with Ed25519...');
  console.log(`   Key file: ${options.keyFile}`);

  let signatureResult;
  try {
    const signer = new Ed25519Signer(options.keyFile);
    signatureResult = await signer.sign(body);
  } catch (err) {
    console.error(`\nError: ${err.message}`);
    process.exit(1);
  }

  console.log('   ✓ Signature created');

  // Add signature to frontmatter
  frontmatter.signature = signatureResult;

  // Add optional metadata
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
  console.log(`  Algorithm: ed25519`);
  console.log(`  Key ID: ${options.keyId || '(not specified)'}`);
  console.log(`  Signed by: ${options.signedBy || '(not specified)'}`);
  console.log(`  Signed at: ${frontmatter.signature.signed_at}`);
}

// Run
if (require.main === module) {
  main().catch((err) => {
    console.error(`\nFatal error: ${err.message}`);
    process.exit(1);
  });
}
