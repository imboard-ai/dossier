import crypto from 'node:crypto';
import config from '../../lib/config';
import { OAUTH_STATE_COOKIE, OAUTH_STATE_MAX_AGE } from '../../lib/constants';
import type { VercelRequest, VercelResponse } from '../../lib/types';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      error: { code: 'METHOD_NOT_ALLOWED', message: 'Only GET is allowed' },
    });
  }

  const state = crypto.randomBytes(32).toString('hex');

  const params = new URLSearchParams({
    client_id: config.auth.github.clientId,
    redirect_uri: `${config.baseUrl}/auth/callback`,
    scope: config.auth.github.scopes,
    state,
  });

  res.setHeader(
    'Set-Cookie',
    `${OAUTH_STATE_COOKIE}=${state}; HttpOnly; Secure; SameSite=Lax; Path=/auth; Max-Age=${OAUTH_STATE_MAX_AGE}`
  );

  console.log(`[auth/login] Redirecting to GitHub OAuth`);
  res.redirect(`https://github.com/login/oauth/authorize?${params}`);
}
