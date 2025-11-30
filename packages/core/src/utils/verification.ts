/**
 * Verification result factory functions
 */

import type { VerificationResult } from '../types';

/**
 * Create a default VerificationResult with safe initial values
 * @param dossierFile - Path to the dossier file being verified
 * @returns VerificationResult with BLOCK recommendation and safe defaults
 */
export function createDefaultVerificationResult(dossierFile: string): VerificationResult {
  return {
    dossierFile,
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
}
