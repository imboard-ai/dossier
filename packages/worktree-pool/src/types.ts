export type WorktreeStatus =
  | 'creating'
  | 'warming'
  | 'warm'
  | 'assigned'
  | 'recycling'
  | 'destroying';

export interface PoolConfig {
  target_spares: number;
  max_pool_size: number;
  stale_after_hours: number;
}

export interface PoolWorktree {
  id: string;
  path: string;
  status: WorktreeStatus;
  temp_branch: string;
  base_commit: string;
  warmed_at: string;
  assigned_to_issue: number | null;
  assigned_branch: string | null;
}

export interface PoolState {
  schema_version: '1.0.0';
  config: PoolConfig;
  worktrees: PoolWorktree[];
}

export const DEFAULT_CONFIG: PoolConfig = {
  target_spares: 5,
  max_pool_size: 10,
  stale_after_hours: 72,
};

export const SCHEMA_VERSION = '1.0.0' as const;

export function generateId(): string {
  return `pool-${Date.now()}-${process.pid}`;
}
