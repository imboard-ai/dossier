/**
 * Signature verification for dossier authenticity
 * Uses the unified verifier module
 */

import { AuthenticityResult, DossierFrontmatter } from '@imboard-ai/dossier-core';
import { logger } from '../utils/logger';
import { loadTrustedKeys, verifyWithEd25519, verifyWithKms } from '@imboard-ai/dossier-core';

/**
 * Verify dossier authenticity (signature + trust)
 */
export async function verifyAuthenticity(
  body: string,
  frontmatter: DossierFrontmatter,
  trustedKeysPath?: string
): Promise<AuthenticityResult> {
  const signature = frontmatter.signature;

  // No signature present
  if (!signature) {
    logger.info('No signature found in dossier');
    return {
      status: 'unsigned',
      message: 'No signature found - authenticity cannot be verified',
      isTrusted: false,
    };
  }

  // Load trusted keys
  const trustedKeys = loadTrustedKeys(trustedKeysPath);
  const isTrusted = trustedKeys.has(signature.public_key || signature.key_id);
  const trustedAs = isTrusted ? trustedKeys.get(signature.public_key || signature.key_id) : undefined;

  // Verify signature
  try {
    let isValid = false;
    if (signature.algorithm === 'ECDSA-SHA-256') {
      isValid = await verifyWithKms(body, signature.signature, signature.key_id);
    } else {
      isValid = verifyWithEd25519(body, signature.signature, signature.public_key);
    }

    if (!isValid) {
      logger.error('SIGNATURE VERIFICATION FAILED');
      return {
        status: 'invalid',
        message: 'SIGNATURE VERIFICATION FAILED',
        signer: signature.signed_by,
        keyId: signature.key_id,
        publicKey: signature.public_key,
        isTrusted,
        trustedAs,
      };
    }

    // Signature is valid - check if trusted
    if (isTrusted) {
      logger.info('Verified signature from TRUSTED source', { trustedAs });
      return {
        status: 'verified',
        message: `Verified signature from trusted source: ${trustedAs}`,
        signer: signature.signed_by,
        keyId: signature.key_id,
        publicKey: signature.public_key,
        isTrusted: true,
        trustedAs,
      };
    } else {
      logger.warn('Valid signature but key is NOT in trusted list');
      return {
        status: 'signed_unknown',
        message: 'Valid signature but key is not in trusted list',
        signer: signature.signed_by,
        keyId: signature.key_id,
        publicKey: signature.public_key,
        isTrusted: false,
      };
    }
  } catch (err) {
    logger.error('Signature verification error', {
      error: (err as Error).message,
    });
    return {
      status: 'error',
      message: `Verification error: ${(err as Error).message}`,
      signer: signature.signed_by,
      keyId: signature.key_id,
      publicKey: signature.public_key,
      isTrusted,
      trustedAs,
    };
  }
}
