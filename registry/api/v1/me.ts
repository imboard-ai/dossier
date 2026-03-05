import * as auth from '../../lib/auth';
import { handleCors } from '../../lib/cors';
import type { VercelRequest, VercelResponse } from '../../lib/types';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res)) return;

  if (req.method !== 'GET') {
    return res.status(405).json({
      error: { code: 'METHOD_NOT_ALLOWED', message: 'Only GET is allowed' },
    });
  }

  const token = auth.extractBearerToken(req);

  if (!token) {
    return res.status(401).json({
      error: {
        code: 'MISSING_TOKEN',
        message: 'Authorization header required. Use: Bearer <token>',
      },
    });
  }

  try {
    const payload = auth.verifyJwt(token);

    const username = payload.sub;
    const orgs = payload.orgs || [];

    const canPublishTo = [`${username}/*`, ...orgs.map((org) => `${org}/*`)];

    return res.status(200).json({
      username,
      email: payload.email || null,
      orgs,
      can_publish_to: canPublishTo,
    });
  } catch (err) {
    if (err instanceof Error && err.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: {
          code: 'TOKEN_EXPIRED',
          message: 'Token has expired. Please login again.',
        },
      });
    }

    if (err instanceof Error && err.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: {
          code: 'INVALID_TOKEN',
          message: 'Invalid token. Please login again.',
        },
      });
    }

    console.error('JWT verification error:', err);
    return res.status(401).json({
      error: {
        code: 'INVALID_TOKEN',
        message: 'Invalid or expired token',
      },
    });
  }
}
