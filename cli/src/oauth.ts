/**
 * OAuth authentication flow for registry login.
 * Opens browser for GitHub authentication, prompts user for code,
 * decodes JWT token to extract user info.
 */

import { execFile } from 'node:child_process';
import readline from 'node:readline';

export interface OAuthResult {
  token: string;
  username: string;
  orgs: string[];
  email: string | null;
  expiresAt: string | null;
}

interface JwtPayload {
  sub: string;
  orgs?: string[];
  email?: string;
  exp?: number;
}

class OAuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'OAuthError';
  }
}

/**
 * Exact prompt string the user sees when login is awaiting the OAuth code.
 * Exported so smoke tests can wait for it on stderr without duplicating the
 * literal — keeps the test from silently breaking if the copy is reworded.
 */
export const LOGIN_CODE_PROMPT = 'Enter the code from your browser: ';

/**
 * Decode a base64url-encoded string, adding padding if needed.
 */
function decodeBase64Url(data: string): string {
  // Replace URL-safe chars with standard base64 chars
  let base64 = data.replace(/-/g, '+').replace(/_/g, '/');
  // Add padding
  const padding = 4 - (base64.length % 4);
  if (padding !== 4) {
    base64 += '='.repeat(padding);
  }
  return Buffer.from(base64, 'base64').toString('utf8');
}

/**
 * Open a URL in the user's default browser (platform-aware).
 */
function openBrowser(url: string): void {
  const platform = process.platform;
  let cmd: string;
  let args: string[];
  if (platform === 'darwin') {
    cmd = 'open';
    args = [url];
  } else if (platform === 'win32') {
    cmd = 'cmd';
    args = ['/c', 'start', '', url];
  } else {
    cmd = 'xdg-open';
    args = [url];
  }

  const child = execFile(cmd, args, (_err) => {
    // Browser failed to open — URL is already printed for the user
  });
  // Don't keep the parent alive while the browser process lingers.
  child.unref();
}

/**
 * Prompt the user for input via the given readable stream (default: process.stdin).
 * Exported for tests; production callers omit `input` and get process.stdin.
 */
export function prompt(
  question: string,
  input: NodeJS.ReadableStream = process.stdin
): Promise<string> {
  const rl = readline.createInterface({
    input,
    output: process.stderr,
  });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      // Without this, readline's reference on stdin keeps the event loop alive
      // and the CLI hangs after a successful login instead of exiting.
      // Only applies to process.stdin; other streams manage their own refs.
      if (input === process.stdin) {
        process.stdin.unref();
      }
      resolve(answer);
    });
  });
}

/**
 * Run the OAuth flow using copy/paste method.
 * Opens a browser for GitHub authentication. The registry displays a code
 * that the user copies and pastes back into the CLI.
 */
async function runOAuthFlow(registryUrl: string): Promise<OAuthResult> {
  const authUrl = `${registryUrl}/auth/login`;

  console.log(`\n🔐 Opening browser for GitHub authentication...`);
  console.log(`   If it doesn't open automatically, visit:\n   ${authUrl}\n`);

  openBrowser(authUrl);

  const code = (await prompt(LOGIN_CODE_PROMPT)).trim();

  if (!code) {
    if (!process.stdin.isTTY) {
      throw new OAuthError(
        'No code provided. Non-interactive session detected — set DOSSIER_REGISTRY_TOKEN instead.'
      );
    }
    throw new OAuthError('No code provided');
  }

  // The code is a base64url-encoded JWT
  let token: string;
  try {
    token = decodeBase64Url(code);
  } catch (err) {
    throw new OAuthError(`Invalid code format: ${(err as Error).message}`);
  }

  // Decode JWT payload (middle part) to get user info
  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new OAuthError('Invalid token format');
  }

  let payload: JwtPayload;
  try {
    payload = JSON.parse(decodeBase64Url(parts[1]));
  } catch (err) {
    throw new OAuthError(`Invalid token: ${(err as Error).message}`);
  }

  const username = payload.sub;
  if (!username) {
    throw new OAuthError('Invalid token: missing username');
  }

  return {
    token,
    username,
    orgs: payload.orgs || [],
    email: payload.email || null,
    expiresAt: payload.exp ? new Date(payload.exp * 1000).toISOString() : null,
  };
}

export { OAuthError, runOAuthFlow };
