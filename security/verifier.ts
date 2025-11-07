/**
 * Dossier Security Verifier
 *
 * This module provides a unified interface for verifying the security of a dossier,
 * including integrity (checksum) and authenticity (signature).
 *
 * It will support multiple signature schemes, starting with minisign.
 */

import { execSync } from 'child_process';
import { writeFileSync, unlinkSync, existsSync, readFileSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';
import { ExternalToolError } from '../mcp-server/src/utils/errors';
import { logger } from '../mcp-server/src/utils/logger';
import { KMSClient, VerifyCommand, SigningAlgorithmSpec } from '@aws-sdk/client-kms';

/**
 * Load trusted keys from file
 * Default location: ~/.dossier/trusted-keys.txt
 * Format: <public-key> <key-id>
 */
export function loadTrustedKeys(filePath?: string): Map<string, string> {
  const keysPath = filePath || join(homedir(), '.dossier', 'trusted-keys.txt');
  const keys = new Map<string, string>();

  if (!existsSync(keysPath)) {
    logger.info('No trusted keys file found', { keysPath });
    return keys;
  }

  try {
    const content = readFileSync(keysPath, 'utf8');
    let lineNum = 0;

    for (const line of content.split('\n')) {
      lineNum++;
      const trimmed = line.trim();

      // Skip empty lines and comments
      if (!trimmed || trimmed.startsWith('#')) {
        continue;
      }

      // Parse: <public-key> <key-id>
      const parts = trimmed.split(/\s+/);
      if (parts.length >= 2) {
        const publicKey = parts[0];
        const keyId = parts.slice(1).join(' ');
        keys.set(publicKey, keyId);
        logger.debug('Loaded trusted key', { keyId, publicKey: publicKey.slice(0, 20) + '...' });
      } else {
        logger.warn('Invalid line in trusted keys file', { lineNum, line: trimmed });
      }
    }

    logger.info('Loaded trusted keys', { count: keys.size, keysPath });
  } catch (err) {
    logger.error('Failed to load trusted keys', {
      keysPath,
      error: (err as Error).message,
    });
  }

  return keys;
}

import nacl from 'tweetnacl';

/**
 * Verify signature using minisign
 */
export function verifyWithMinisign(
  content: string,
  signature: string,
  publicKey: string
): boolean {
  try {
    const signatureBuffer = Buffer.from(signature, 'base64');
    const contentBuffer = Buffer.from(content);
    const publicKeyBuffer = Buffer.from(publicKey, 'base64');

    return nacl.sign.detached.verify(contentBuffer, signatureBuffer, publicKeyBuffer);
  } catch (err) {
    logger.error('minisign verification error', {
      error: (err as Error).message,
    });
    return false;
  }
}
/**
 * Verify signature using AWS KMS
 */
export async function verifyWithKms(
  content: string,
  signature: string,
  keyId: string,
  region = 'us-east-1'
): Promise<boolean> {
  const client = new KMSClient({ region });
  const signatureBuffer = Buffer.from(signature, 'base64');
  const contentBuffer = Buffer.from(content);

  const command = new VerifyCommand({
    KeyId: keyId,
    Message: contentBuffer,
    Signature: signatureBuffer,
    SigningAlgorithm: SigningAlgorithmSpec.ECDSA_SHA_256,
  });

  try {
    const response = await client.send(command);
    return response.SignatureValid === true;
  } catch (err) {
    logger.error('AWS KMS verification error', {
      error: (err as Error).message,
      keyId,
    });
    return false;
  }
}