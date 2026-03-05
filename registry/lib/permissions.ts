import { getRootNamespace } from './dossier';
import type { JwtPayload, PublishPermission } from './types';

export function canPublishTo(jwtPayload: JwtPayload, namespace: string): PublishPermission {
  const rootNamespace = getRootNamespace(namespace);
  const username = jwtPayload.sub;
  const orgs = jwtPayload.orgs || [];

  if (rootNamespace === username) {
    return {
      allowed: true,
      reason: `Personal namespace: ${username}`,
    };
  }

  if (orgs.includes(rootNamespace)) {
    return {
      allowed: true,
      reason: `Organization namespace: ${rootNamespace}`,
    };
  }

  return {
    allowed: false,
    reason: `You cannot publish to namespace '${rootNamespace}'. You can publish to: ${username}, ${orgs.join(', ') || '(no orgs)'}`,
  };
}
