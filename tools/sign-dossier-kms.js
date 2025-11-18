#!/usr/bin/env node

/**
 * Dossier AWS KMS Signing Tool
 *
 * Signs a dossier with AWS KMS and embeds the checksum and signature in the frontmatter.
 *
 * Usage:
 *   node tools/sign-dossier-kms.js <dossier-file> [options]
 *
 * Prerequisites:
 *   - AWS SDK must be installed (npm install @aws-sdk/client-kms)
 *   - AWS credentials configured (via environment or ~/.aws/credentials)
 *   - Permission to use the KMS key
 *
 * Example:
 *   node tools/sign-dossier-kms.js examples/devops/deploy-to-aws.ds.md \\
 *     --key-id alias/dossier-official-prod \\
 *     --signed-by "Dossier Team <team@dossier.ai>"
 */

const fs = require('node:fs');
const _path = require('node:path');
const { parseDossierContent, calculateChecksum, KmsSigner } = require('@imboard-ai/dossier-core');

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);

  if (args.length < 1 || args.includes('--help') || args.includes('-h')) {
    console.log(`
Dossier AWS KMS Signing Tool

Usage:
  node tools/sign-dossier-kms.js <dossier-file> [options]

Options:
  --key-id <id>        AWS KMS key ID or alias (default: alias/dossier-official-prod)
  --region <region>    AWS region (default: us-east-1)
  --signed-by <name>   Signer identity (e.g., 'Dossier Team <team@dossier.ai>')
  --dry-run            Calculate checksum but don't sign
  --help, -h           Show this help message

Environment Variables:
  AWS_REGION           AWS region (default: us-east-1)
  AWS_ACCESS_KEY_ID    AWS access key
  AWS_SECRET_ACCESS_KEY AWS secret key

Example:
  node tools/sign-dossier-kms.js examples/devops/deploy-to-aws.ds.md \\
    --key-id alias/dossier-official-prod \\
    --signed-by "Dossier Team <team@dossier.ai>"
`);
    process.exit(args.includes('--help') || args.includes('-h') ? 0 : 1);
  }

  const dossierFile = args[0];
  const keyIdIndex = args.indexOf('--key-id');
  const regionIndex = args.indexOf('--region');
  const signedByIndex = args.indexOf('--signed-by');
  const dryRun = args.includes('--dry-run');

  return {
    dossierFile,
    keyId: keyIdIndex !== -1 ? args[keyIdIndex + 1] : 'alias/dossier-official-prod',
    region: regionIndex !== -1 ? args[regionIndex + 1] : process.env.AWS_REGION || 'us-east-1',
    signedBy: signedByIndex !== -1 ? args[signedByIndex + 1] : null,
    dryRun,
  };
}

// Main function
async function main() {
  const options = parseArgs();

  console.log('🔐 Dossier AWS KMS Signing Tool\n');
  console.log(`Dossier: ${options.dossierFile}`);
  console.log(`KMS Key: ${options.keyId}`);
  console.log(`Region: ${options.region}`);

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

  // Sign with AWS KMS
  console.log('\n✍️  Signing with AWS KMS...');

  let signatureResult;
  try {
    const signer = new KmsSigner(options.keyId, options.region);
    signatureResult = await signer.sign(body);
  } catch (err) {
    console.error(`\nError: ${err.message}`);
    process.exit(1);
  }

  console.log('   ✓ Signature created');
  console.log(`   Key ARN: ${signatureResult.key_id}`);

  // Add signature to frontmatter
  frontmatter.signature = signatureResult;

  // Add optional metadata
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
  console.log(`  Algorithm: ECDSA-SHA-256`);
  console.log(`  Key ARN: ${frontmatter.signature.key_id}`);
  console.log(`  Signed by: ${options.signedBy || '(not specified)'}`);
  console.log(`  Signed at: ${frontmatter.signature.signed_at}`);
  console.log(`\nVerify with: cli/bin/dossier-verify ${options.dossierFile}`);
}

// Run
if (require.main === module) {
  main().catch((err) => {
    console.error(`\nFatal error: ${err.message}`);
    process.exit(1);
  });
}
