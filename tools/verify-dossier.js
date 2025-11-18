#!/usr/bin/env node

/**
 * Dossier Verification Tool
 *
 * Verifies the integrity (checksum) and authenticity (signature) of a dossier.
 *
 * Usage:
 *   node tools/verify-dossier.js <dossier-file> [--trusted-keys <file>]
 *
 * Example:
 *   node tools/verify-dossier.js examples/devops/deploy-to-aws.ds.md
 *   node tools/verify-dossier.js examples/devops/deploy-to-aws.ds.md --trusted-keys ~/.dossier/trusted-keys.txt
 */

const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const {
  parseDossierContent,
  verifyIntegrity,
  loadTrustedKeys,
  verifySignature,
} = require('@imboard-ai/dossier-core');

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);

  if (args.length < 1 || args.includes('--help') || args.includes('-h')) {
    console.log(`
Dossier Verification Tool

Usage:
  node tools/verify-dossier.js <dossier-file> [options]

Options:
  --trusted-keys <file>  Path to trusted keys file (default: ~/.dossier/trusted-keys.txt)
  --json                 Output result as JSON
  --help, -h             Show this help message

Example:
  node tools/verify-dossier.js examples/devops/deploy-to-aws.ds.md
  node tools/verify-dossier.js examples/devops/deploy-to-aws.ds.md --trusted-keys ./my-keys.txt
`);
    process.exit(args.includes('--help') || args.includes('-h') ? 0 : 1);
  }

  const dossierFile = args[0];
  const trustedKeysIndex = args.indexOf('--trusted-keys');
  const jsonOutput = args.includes('--json');

  const defaultTrustedKeys = path.join(os.homedir(), '.dossier', 'trusted-keys.txt');

  return {
    dossierFile,
    trustedKeysFile: trustedKeysIndex !== -1 ? args[trustedKeysIndex + 1] : defaultTrustedKeys,
    jsonOutput,
  };
}

// Main verification function
async function verifyDossier(dossierFile, trustedKeysFile) {
  const result = {
    dossierFile,
    integrity: {
      status: 'unknown',
      message: '',
    },
    authenticity: {
      status: 'unknown',
      message: '',
      signer: null,
      keyId: null,
      isTrusted: false,
    },
    riskAssessment: {
      riskLevel: null,
      riskFactors: [],
      destructiveOperations: [],
      requiresApproval: null,
    },
    recommendation: 'UNKNOWN',
    errors: [],
  };

  // Read dossier
  if (!fs.existsSync(dossierFile)) {
    result.errors.push(`File not found: ${dossierFile}`);
    result.recommendation = 'BLOCK';
    return result;
  }

  const content = fs.readFileSync(dossierFile, 'utf8');

  // Parse dossier
  let parsed;
  try {
    parsed = parseDossierContent(content);
  } catch (err) {
    result.errors.push(`Parse error: ${err.message}`);
    result.recommendation = 'BLOCK';
    return result;
  }

  const { frontmatter, body } = parsed;

  // 1. INTEGRITY CHECK (checksum) - using @dossier/core
  const integrityResult = verifyIntegrity(body, frontmatter.checksum?.hash);
  result.integrity = integrityResult;

  if (integrityResult.status === 'missing') {
    result.errors.push('Missing checksum - cannot verify integrity');
    result.recommendation = 'BLOCK';
  } else if (integrityResult.status === 'invalid') {
    result.errors.push('Checksum verification FAILED - do not execute!');
    result.recommendation = 'BLOCK';
  }

  // 2. AUTHENTICITY CHECK (signature)
  if (!frontmatter.signature) {
    result.authenticity.status = 'unsigned';
    result.authenticity.message = 'No signature found - authenticity cannot be verified';
  } else {
    const sig = frontmatter.signature;
    result.authenticity.signer = sig.signed_by || 'Unknown';
    result.authenticity.keyId = sig.key_id || 'Unknown';

    // Load trusted keys
    const trustedKeys = loadTrustedKeys(trustedKeysFile);

    // Check if key is trusted
    if (trustedKeys.has(sig.public_key || sig.key_id)) {
      result.authenticity.isTrusted = true;
      result.authenticity.trustedAs = trustedKeys.get(sig.public_key || sig.key_id);
    }

    // Verify signature
    try {
      const isValid = await verifySignature(body, sig);

      if (isValid) {
        if (result.authenticity.isTrusted) {
          result.authenticity.status = 'verified';
          result.authenticity.message = `Verified signature from trusted source: ${result.authenticity.trustedAs}`;
        } else {
          result.authenticity.status = 'signed_unknown';
          result.authenticity.message = `Valid signature but key is not in trusted list`;
        }
      } else {
        result.authenticity.status = 'invalid';
        result.authenticity.message = 'SIGNATURE VERIFICATION FAILED';
        result.errors.push('Signature verification FAILED - do not execute!');
        result.recommendation = 'BLOCK';
      }
    } catch (err) {
      result.authenticity.status = 'error';
      result.authenticity.message = `Verification error: ${err.message}`;
      result.errors.push(`Signature verification error: ${err.message}`);
    }
  }

  // 3. RISK ASSESSMENT
  result.riskAssessment.riskLevel = frontmatter.risk_level || 'unknown';
  result.riskAssessment.riskFactors = frontmatter.risk_factors || [];
  result.riskAssessment.destructiveOperations = frontmatter.destructive_operations || [];
  result.riskAssessment.requiresApproval = frontmatter.requires_approval !== false; // default true

  // 4. RECOMMENDATION
  if (result.recommendation === 'UNKNOWN') {
    if (result.integrity.status === 'invalid' || result.authenticity.status === 'invalid') {
      result.recommendation = 'BLOCK';
    } else if (
      result.authenticity.status === 'verified' &&
      result.riskAssessment.riskLevel === 'low'
    ) {
      result.recommendation = 'ALLOW';
    } else if (
      result.authenticity.status === 'unsigned' ||
      result.authenticity.status === 'signed_unknown'
    ) {
      result.recommendation = 'WARN';
    } else if (
      result.riskAssessment.riskLevel === 'high' ||
      result.riskAssessment.riskLevel === 'critical'
    ) {
      result.recommendation = 'WARN';
    } else {
      result.recommendation = 'WARN';
    }
  }

  return result;
}

// Pretty print results
function printResults(result) {
  console.log('\n🔍 Dossier Verification Report\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`File: ${result.dossierFile}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Integrity
  console.log('📊 INTEGRITY CHECK (Checksum)');
  const integrityIcon =
    result.integrity.status === 'valid' ? '✅' : result.integrity.status === 'invalid' ? '❌' : '⚠️';
  console.log(`   ${integrityIcon} Status: ${result.integrity.status.toUpperCase()}`);
  console.log(`   ${result.integrity.message}`);
  if (result.integrity.expectedHash) {
    console.log(`   Expected: ${result.integrity.expectedHash}`);
    console.log(`   Actual:   ${result.integrity.actualHash}`);
  }
  console.log();

  // Authenticity
  console.log('🔐 AUTHENTICITY CHECK (Signature)');
  const authIcon =
    result.authenticity.status === 'verified'
      ? '✅'
      : result.authenticity.status === 'signed_unknown'
        ? '⚠️'
        : result.authenticity.status === 'unsigned'
          ? '⚠️'
          : '❌';
  console.log(`   ${authIcon} Status: ${result.authenticity.status.toUpperCase()}`);
  console.log(`   ${result.authenticity.message}`);
  if (result.authenticity.signer) {
    console.log(`   Signer: ${result.authenticity.signer}`);
    console.log(`   Key ID: ${result.authenticity.keyId}`);
    console.log(`   Trusted: ${result.authenticity.isTrusted ? 'YES' : 'NO'}`);
  }
  console.log();

  // Risk Assessment
  console.log('⚠️  RISK ASSESSMENT');
  const riskIcon =
    result.riskAssessment.riskLevel === 'low'
      ? '🟢'
      : result.riskAssessment.riskLevel === 'medium'
        ? '🟡'
        : result.riskAssessment.riskLevel === 'high'
          ? '🟠'
          : result.riskAssessment.riskLevel === 'critical'
            ? '🔴'
            : '⚪';
  console.log(
    `   ${riskIcon} Risk Level: ${(result.riskAssessment.riskLevel || 'UNKNOWN').toUpperCase()}`
  );
  if (result.riskAssessment.riskFactors.length > 0) {
    console.log('   Risk Factors:');
    result.riskAssessment.riskFactors.forEach((factor) => {
      console.log(`     • ${factor}`);
    });
  }
  if (result.riskAssessment.destructiveOperations.length > 0) {
    console.log('   Destructive Operations:');
    result.riskAssessment.destructiveOperations.forEach((op) => {
      console.log(`     • ${op}`);
    });
  }
  console.log(`   Requires Approval: ${result.riskAssessment.requiresApproval ? 'YES' : 'NO'}`);
  console.log();

  // Errors
  if (result.errors.length > 0) {
    console.log('❌ ERRORS');
    result.errors.forEach((err) => {
      console.log(`   • ${err}`);
    });
    console.log();
  }

  // Recommendation
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  const recIcon =
    result.recommendation === 'ALLOW' ? '✅' : result.recommendation === 'WARN' ? '⚠️' : '❌';
  console.log(`${recIcon} RECOMMENDATION: ${result.recommendation}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  if (result.recommendation === 'ALLOW') {
    console.log('This dossier passed all security checks and can be executed safely.');
  } else if (result.recommendation === 'WARN') {
    console.log('⚠️  WARNING: This dossier should be reviewed before execution.');
    console.log('Reasons:');
    if (result.authenticity.status === 'unsigned') {
      console.log('  • Dossier is not signed (cannot verify author)');
    }
    if (result.authenticity.status === 'signed_unknown') {
      console.log('  • Signature is valid but signer is not in your trusted keys list');
    }
    if (
      result.riskAssessment.riskLevel === 'high' ||
      result.riskAssessment.riskLevel === 'critical'
    ) {
      console.log(`  • High risk level: ${result.riskAssessment.riskLevel}`);
    }
    console.log('\nOnly execute if you trust the source!');
  } else {
    console.log('❌ BLOCKED: This dossier has FAILED security checks.');
    console.log('DO NOT EXECUTE until issues are resolved!');
  }
  console.log();
}

// Main
async function main() {
  const options = parseArgs();

  const result = await verifyDossier(options.dossierFile, options.trustedKeysFile);

  if (options.jsonOutput) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    printResults(result);
  }

  // Exit code based on recommendation
  if (result.recommendation === 'BLOCK') {
    process.exit(1);
  } else if (result.recommendation === 'WARN') {
    process.exit(2);
  } else {
    process.exit(0);
  }
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

module.exports = { verifyDossier };
