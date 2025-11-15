/**
 * Dossier Signature Verification
 *
 * This module provides signature verification for dossiers,
 * supporting multiple signature schemes (Minisign and AWS KMS).
 */

import { existsSync, readFileSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';
import { KMSClient, VerifyCommand, SigningAlgorithmSpec } from '@aws-sdk/client-kms';
import nacl from 'tweetnacl';

/**
 * Load trusted keys from file
 * Default location: ~/.dossier/trusted-keys.txt
 * Format: <public-key> <key-id>
 */
export function loadTrustedKeys(filePath?: string): Map<string, string> {
  const keysPath = filePath || join(homedir(), '.dossier', 'trusted-keys.txt');
  const keys = new Map<string, string>();

  if (!existsSync(keysPath)) {
    return keys;
  }

  try {
    const content = readFileSync(keysPath, 'utf8');

    for (const line of content.split('\n')) {
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
      }
    }
  } catch (err) {
    // Silently handle errors - consumers can check the returned Map size
  }

  return keys;
}

/**
 * Verify signature using Minisign (Ed25519)
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
    return false;
  }
}

/**
 * Verify signature using AWS KMS (ECDSA-SHA-256)
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
    return false;
  }
}
