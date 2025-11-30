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

const { Ed25519Signer } = require('@imboard-ai/dossier-core');
const {
  readAndParseDossier,
  addChecksum,
  handleDryRun,
  writeDossier,
} = require('./lib/signing-common');
const { createCliParser } = require('./lib/cli-parser');

// Configure CLI parser
const parseArgs = createCliParser({
  name: 'Dossier Signing Tool',
  description: 'Signs a dossier with Ed25519 and embeds the checksum and signature in the frontmatter.',
  usage: 'node tools/sign-dossier.js <dossier-file> --key <ed25519-private-key.pem> [options]',
  options: [
    {
      name: 'keyFile',
      flag: 'key',
      description: 'Path to Ed25519 private key in PEM format',
      required: true,
    },
    {
      name: 'keyId',
      flag: 'key-id',
      description: "Human-readable key identifier (e.g., 'imboard-ai-2024')",
    },
    {
      name: 'signedBy',
      flag: 'signed-by',
      description: "Signer identity (e.g., 'Imboard AI <security@imboard.ai>')",
    },
    {
      name: 'dryRun',
      flag: 'dry-run',
      description: "Calculate checksum but don't sign",
      isBoolean: true,
    },
  ],
  extraHelp: `
Generate keypair:
  openssl genpkey -algorithm ED25519 -out private-key.pem
  openssl pkey -in private-key.pem -pubout -out public-key.pem

Example:
  node tools/sign-dossier.js examples/devops/deploy-to-aws.md \\
    --key ~/.dossier/private-key.pem \\
    --key-id imboard-ai-2024 \\
    --signed-by "Imboard AI <security@imboard.ai>"`,
});

// Main function
async function main() {
  const options = parseArgs();

  console.log('🔐 Dossier Signing Tool\n');
  console.log(`Dossier: ${options.dossierFile}`);

  // Read and parse dossier
  const { frontmatter, body } = readAndParseDossier(options.dossierFile);

  // Calculate and add checksum
  addChecksum(frontmatter, body);

  if (options.dryRun) {
    handleDryRun(frontmatter);
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
  writeDossier(options.dossierFile, frontmatter, body);
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
