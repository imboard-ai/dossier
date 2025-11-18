/**
 * Registry for Verifier instances
 */

import type { Verifier } from './index';

export class VerifierRegistry {
  private verifiers: Verifier[] = [];

  /**
   * Register a verifier
   */
  register(verifier: Verifier): void {
    this.verifiers.push(verifier);
  }

  /**
   * Get a verifier that supports the given algorithm
   * @throws Error if no verifier supports the algorithm
   */
  get(algorithm: string): Verifier {
    const verifier = this.verifiers.find((v) => v.supports(algorithm));
    if (!verifier) {
      throw new Error(`No verifier registered for algorithm: ${algorithm}`);
    }
    return verifier;
  }

  /**
   * Check if any verifier supports the algorithm
   */
  has(algorithm: string): boolean {
    return this.verifiers.some((v) => v.supports(algorithm));
  }

  /**
   * Get all supported algorithms
   */
  getSupportedAlgorithms(): string[] {
    // Note: This returns a simple list, but verifiers may support multiple algorithms
    return ['ed25519', 'ECDSA-SHA-256'];
  }
}

// Global singleton instance
let globalVerifierRegistry: VerifierRegistry | null = null;

/**
 * Get the global verifier registry (creates it if needed)
 */
export function getVerifierRegistry(): VerifierRegistry {
  if (!globalVerifierRegistry) {
    globalVerifierRegistry = new VerifierRegistry();
    // Auto-register built-in verifiers
    initializeBuiltInVerifiers();
  }
  return globalVerifierRegistry;
}

/**
 * Initialize built-in verifiers
 */
function initializeBuiltInVerifiers(): void {
  if (!globalVerifierRegistry) return;

  // Import and register built-in verifiers
  const { Ed25519Verifier } = require('./ed25519');
  const { KmsVerifier } = require('./kms');

  globalVerifierRegistry.register(new Ed25519Verifier());
  globalVerifierRegistry.register(new KmsVerifier());
}
