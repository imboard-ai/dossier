/**
 * verify_dossier tool - Security verification for dossiers
 * Verifies integrity (checksum) and authenticity (signature)
 * Returns recommendation: ALLOW, WARN, or BLOCK
 */

import { parseDossierFile, verifyIntegrity } from '@imboard-ai/dossier-core';
import { verifyAuthenticity } from '../parsers/signatureVerifier';
import { VerificationResult, RiskAssessment } from '../types/dossier';
import { logger } from '../utils/logger';

export interface VerifyDossierInput {
  path: string;
  trusted_keys_path?: string;
}

/**
 * Verify dossier security (integrity, authenticity, risk assessment)
 */
export async function verifyDossier(input: VerifyDossierInput): Promise<VerificationResult> {
  const { path, trusted_keys_path } = input;

  logger.info('Starting dossier verification', { dossierFile: path });

  const result: VerificationResult = {
    dossierFile: path,
    integrity: {
      status: 'missing',
      message: '',
    },
    authenticity: {
      status: 'unsigned',
      message: '',
      isTrusted: false,
    },
    riskAssessment: {
      riskLevel: 'unknown',
      riskFactors: [],
      destructiveOperations: [],
      requiresApproval: true,
    },
    recommendation: 'BLOCK',
    message: '',
    errors: [],
  };

  try {
    // 1. Parse dossier
    const parsed = parseDossierFile(path);
    const { frontmatter, body } = parsed;

    // 2. INTEGRITY CHECK (checksum)
    const checksumHash = frontmatter.checksum?.hash;
    result.integrity = verifyIntegrity(body, checksumHash);

    if (result.integrity.status === 'missing') {
      result.errors.push('Missing checksum - cannot verify integrity');
      result.recommendation = 'BLOCK';
      result.message = 'DO NOT EXECUTE - No checksum found';
      logger.error('Verification FAILED - missing checksum', { dossierFile: path });
      return result;
    }

    if (result.integrity.status === 'invalid') {
      result.errors.push('Checksum verification FAILED - do not execute!');
      result.recommendation = 'BLOCK';
      result.message = 'DO NOT EXECUTE - Dossier has been tampered with!';
      result.authenticity.status = 'error';
      result.authenticity.message = 'Cannot verify signature - integrity check failed';
      logger.error('Verification FAILED - checksum mismatch', { dossierFile: path });
      return result;
    }

    // 3. AUTHENTICITY CHECK (signature)
    result.authenticity = await verifyAuthenticity(body, frontmatter, trusted_keys_path);

    if (result.authenticity.status === 'invalid') {
      result.errors.push('Signature verification FAILED - do not execute!');
      result.recommendation = 'BLOCK';
      result.message = 'DO NOT EXECUTE - Invalid signature!';
      logger.error('Verification FAILED - invalid signature', { dossierFile: path });
      return result;
    }

    // 4. RISK ASSESSMENT
    result.riskAssessment = {
      riskLevel: frontmatter.risk_level || 'unknown',
      riskFactors: frontmatter.risk_factors || [],
      destructiveOperations: frontmatter.destructive_operations || [],
      requiresApproval: frontmatter.requires_approval !== false, // default true
    };

    // 5. RECOMMENDATION LOGIC
    // Note: integrity 'invalid' and authenticity 'invalid' already handled above with early return
    if (
      result.authenticity.status === 'verified' &&
      result.riskAssessment.riskLevel === 'low'
    ) {
      result.recommendation = 'ALLOW';
      result.message = 'Verified dossier from trusted source with low risk. Safe to execute.';
    } else if (
      result.authenticity.status === 'unsigned' ||
      result.authenticity.status === 'signed_unknown' ||
      result.riskAssessment.riskLevel === 'high' ||
      result.riskAssessment.riskLevel === 'critical'
    ) {
      result.recommendation = 'WARN';

      // Build warning message
      const warnings: string[] = [];
      if (result.authenticity.status === 'unsigned') {
        warnings.push('Dossier is not signed (cannot verify author)');
      }
      if (result.authenticity.status === 'signed_unknown') {
        warnings.push('Signature is valid but signer is not in your trusted keys list');
      }
      if (
        result.riskAssessment.riskLevel === 'high' ||
        result.riskAssessment.riskLevel === 'critical'
      ) {
        warnings.push(`High risk level: ${result.riskAssessment.riskLevel}`);
      }

      result.message = `WARNING: ${warnings.join('. ')}. Review before execution.`;
    } else {
      result.recommendation = 'WARN';
      result.message = 'Unsigned dossier with medium risk. Verify source before execution.';
    }

    logger.info('Verification completed', {
      dossierFile: path,
      recommendation: result.recommendation,
      integrity: result.integrity.status,
      authenticity: result.authenticity.status,
      riskLevel: result.riskAssessment.riskLevel,
    });
  } catch (err) {
    result.errors.push(`Verification error: ${(err as Error).message}`);
    result.recommendation = 'BLOCK';
    result.message = `DO NOT EXECUTE - Verification failed: ${(err as Error).message}`;
    logger.error('Verification FAILED with exception', {
      dossierFile: path,
      error: (err as Error).message,
      stack: (err as Error).stack,
    });
  }

  return result;
}
