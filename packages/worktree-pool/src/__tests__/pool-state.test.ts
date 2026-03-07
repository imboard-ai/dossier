import { describe, expect, it } from 'vitest';
import {
  addWorktree,
  claimWorktree,
  createEmptyState,
  findOrphans,
  findStaleWorktrees,
  getAssignedCount,
  getPoolStatus,
  getSparesNeeded,
  getWarmCount,
  removeWorktree,
  updateWorktree,
  validateState,
} from '../pool-state';
import { DEFAULT_CONFIG, SCHEMA_VERSION } from '../types';
import { createPoolState, createWorktree } from './helpers/setup';

describe('createEmptyState', () => {
  it('creates state with defaults', () => {
    const state = createEmptyState();
    expect(state.schema_version).toBe(SCHEMA_VERSION);
    expect(state.config).toEqual(DEFAULT_CONFIG);
    expect(state.worktrees).toEqual([]);
  });

  it('accepts config overrides', () => {
    const state = createEmptyState({ target_spares: 3, max_pool_size: 20 });
    expect(state.config.target_spares).toBe(3);
    expect(state.config.max_pool_size).toBe(20);
    expect(state.config.stale_after_hours).toBe(DEFAULT_CONFIG.stale_after_hours);
  });
});

describe('validateState', () => {
  it('validates a correct state', () => {
    const state = createPoolState();
    expect(() => validateState(state)).not.toThrow();
  });

  it('rejects null', () => {
    expect(() => validateState(null)).toThrow('must be an object');
  });

  it('rejects unknown schema version', () => {
    const state = createPoolState();
    (state as any).schema_version = '2.0.0';
    expect(() => validateState(state)).toThrow('Unsupported schema version');
  });

  it('rejects missing config', () => {
    const state = { schema_version: SCHEMA_VERSION, worktrees: [] };
    expect(() => validateState(state)).toThrow('must have a config');
  });

  it('rejects invalid target_spares', () => {
    const state = createPoolState({ config: { ...DEFAULT_CONFIG, target_spares: 0 } });
    expect(() => validateState(state)).toThrow('target_spares');
  });

  it('rejects target_spares > 50', () => {
    const state = createPoolState({ config: { ...DEFAULT_CONFIG, target_spares: 51 } });
    expect(() => validateState(state)).toThrow('target_spares');
  });

  it('rejects invalid max_pool_size', () => {
    const state = createPoolState({ config: { ...DEFAULT_CONFIG, max_pool_size: 0 } });
    expect(() => validateState(state)).toThrow('max_pool_size');
  });

  it('rejects invalid stale_after_hours', () => {
    const state = createPoolState({ config: { ...DEFAULT_CONFIG, stale_after_hours: 0 } });
    expect(() => validateState(state)).toThrow('stale_after_hours');
  });

  it('rejects missing worktrees array', () => {
    const state = {
      schema_version: SCHEMA_VERSION,
      config: DEFAULT_CONFIG,
    };
    expect(() => validateState(state)).toThrow('worktrees array');
  });
});

describe('addWorktree', () => {
  it('adds a worktree to state', () => {
    const state = createPoolState();
    const wt = createWorktree({ id: 'test-1' });
    const newState = addWorktree(state, wt);
    expect(newState.worktrees).toHaveLength(1);
    expect(newState.worktrees[0].id).toBe('test-1');
  });

  it('throws when at max capacity', () => {
    const wt1 = createWorktree({ id: 'w1' });
    const wt2 = createWorktree({ id: 'w2' });
    const state = createPoolState({
      config: { ...DEFAULT_CONFIG, max_pool_size: 1 },
      worktrees: [wt1],
    });
    expect(() => addWorktree(state, wt2)).toThrow('max capacity');
  });

  it('does not mutate original state', () => {
    const state = createPoolState();
    const wt = createWorktree();
    const newState = addWorktree(state, wt);
    expect(state.worktrees).toHaveLength(0);
    expect(newState.worktrees).toHaveLength(1);
  });
});

describe('updateWorktree', () => {
  it('updates fields on a worktree', () => {
    const wt = createWorktree({ id: 'w1', status: 'creating' });
    const state = createPoolState({ worktrees: [wt] });
    const newState = updateWorktree(state, 'w1', { status: 'warm' });
    expect(newState.worktrees[0].status).toBe('warm');
  });

  it('throws for unknown id', () => {
    const state = createPoolState();
    expect(() => updateWorktree(state, 'unknown', { status: 'warm' })).toThrow('not found');
  });
});

describe('removeWorktree', () => {
  it('removes a worktree by id', () => {
    const wt1 = createWorktree({ id: 'w1' });
    const wt2 = createWorktree({ id: 'w2' });
    const state = createPoolState({ worktrees: [wt1, wt2] });
    const newState = removeWorktree(state, 'w1');
    expect(newState.worktrees).toHaveLength(1);
    expect(newState.worktrees[0].id).toBe('w2');
  });

  it('returns same state if id not found', () => {
    const wt = createWorktree({ id: 'w1' });
    const state = createPoolState({ worktrees: [wt] });
    const newState = removeWorktree(state, 'nonexistent');
    expect(newState.worktrees).toHaveLength(1);
  });
});

describe('claimWorktree', () => {
  it('claims the first warm worktree', () => {
    const wt1 = createWorktree({ id: 'w1', status: 'assigned' });
    const wt2 = createWorktree({ id: 'w2', status: 'warm' });
    const wt3 = createWorktree({ id: 'w3', status: 'warm' });
    const state = createPoolState({ worktrees: [wt1, wt2, wt3] });

    const result = claimWorktree(state, 99, 'feature/99-test');
    expect(result).not.toBeNull();
    expect(result?.worktree.id).toBe('w2');
    expect(result?.worktree.status).toBe('assigned');
    expect(result?.worktree.assigned_to_issue).toBe(99);
    expect(result?.worktree.assigned_branch).toBe('feature/99-test');
  });

  it('returns null when no warm worktrees', () => {
    const wt = createWorktree({ id: 'w1', status: 'assigned' });
    const state = createPoolState({ worktrees: [wt] });
    expect(claimWorktree(state, 99, 'feature/99')).toBeNull();
  });

  it('returns null on empty pool', () => {
    const state = createPoolState();
    expect(claimWorktree(state, 99, 'feature/99')).toBeNull();
  });

  it('concurrent claims: second claim gets different worktree', () => {
    const wt1 = createWorktree({ id: 'w1', status: 'warm' });
    const wt2 = createWorktree({ id: 'w2', status: 'warm' });
    const state = createPoolState({ worktrees: [wt1, wt2] });

    const result1 = claimWorktree(state, 1, 'feature/1');
    expect(result1).not.toBeNull();
    expect(result1?.worktree.id).toBe('w1');

    // Second claim against the updated state
    const result2 = claimWorktree(result1?.state, 2, 'feature/2');
    expect(result2).not.toBeNull();
    expect(result2?.worktree.id).toBe('w2');
  });

  it('concurrent claims: returns null when single warm exhausted', () => {
    const wt = createWorktree({ id: 'w1', status: 'warm' });
    const state = createPoolState({ worktrees: [wt] });

    const result1 = claimWorktree(state, 1, 'feature/1');
    expect(result1).not.toBeNull();

    const result2 = claimWorktree(result1?.state, 2, 'feature/2');
    expect(result2).toBeNull();
  });
});

describe('getWarmCount / getAssignedCount', () => {
  it('counts correctly', () => {
    const state = createPoolState({
      worktrees: [
        createWorktree({ id: 'w1', status: 'warm' }),
        createWorktree({ id: 'w2', status: 'warm' }),
        createWorktree({ id: 'w3', status: 'assigned' }),
        createWorktree({ id: 'w4', status: 'creating' }),
      ],
    });
    expect(getWarmCount(state)).toBe(2);
    expect(getAssignedCount(state)).toBe(1);
  });
});

describe('getSparesNeeded', () => {
  it('returns spares needed to hit target', () => {
    const state = createPoolState({
      config: { ...DEFAULT_CONFIG, target_spares: 5, max_pool_size: 10 },
      worktrees: [
        createWorktree({ id: 'w1', status: 'warm' }),
        createWorktree({ id: 'w2', status: 'warm' }),
        createWorktree({ id: 'w3', status: 'assigned' }),
      ],
    });
    // 5 target - 2 warm = 3 needed, capacity = 10 - 3 = 7
    expect(getSparesNeeded(state)).toBe(3);
  });

  it('returns 0 when target met', () => {
    const state = createPoolState({
      config: { ...DEFAULT_CONFIG, target_spares: 2 },
      worktrees: [
        createWorktree({ id: 'w1', status: 'warm' }),
        createWorktree({ id: 'w2', status: 'warm' }),
      ],
    });
    expect(getSparesNeeded(state)).toBe(0);
  });

  it('caps at available capacity', () => {
    const state = createPoolState({
      config: { ...DEFAULT_CONFIG, target_spares: 5, max_pool_size: 3 },
      worktrees: [
        createWorktree({ id: 'w1', status: 'assigned' }),
        createWorktree({ id: 'w2', status: 'assigned' }),
      ],
    });
    // Need 5 warm, have 0. Capacity = 3 - 2 = 1
    expect(getSparesNeeded(state)).toBe(1);
  });
});

describe('findStaleWorktrees', () => {
  it('finds worktrees older than threshold', () => {
    const now = new Date('2025-01-10T00:00:00Z');
    const old = new Date('2025-01-01T00:00:00Z').toISOString(); // 9 days ago
    const recent = new Date('2025-01-09T00:00:00Z').toISOString(); // 1 day ago

    const state = createPoolState({
      config: { ...DEFAULT_CONFIG, stale_after_hours: 48 },
      worktrees: [
        createWorktree({ id: 'old', status: 'warm', warmed_at: old }),
        createWorktree({ id: 'recent', status: 'warm', warmed_at: recent }),
        createWorktree({ id: 'assigned-old', status: 'assigned', warmed_at: old }),
      ],
    });

    const stale = findStaleWorktrees(state, now);
    expect(stale).toHaveLength(1);
    expect(stale[0].id).toBe('old');
  });

  it('never marks assigned worktrees as stale', () => {
    const now = new Date('2025-01-10T00:00:00Z');
    const old = new Date('2025-01-01T00:00:00Z').toISOString();

    const state = createPoolState({
      config: { ...DEFAULT_CONFIG, stale_after_hours: 24 },
      worktrees: [createWorktree({ id: 'w1', status: 'assigned', warmed_at: old })],
    });

    expect(findStaleWorktrees(state, now)).toHaveLength(0);
  });
});

describe('findOrphans', () => {
  it('detects state entries not on disk', () => {
    const state = createPoolState({
      worktrees: [
        createWorktree({ id: 'w1', path: '/pool/w1' }),
        createWorktree({ id: 'w2', path: '/pool/w2' }),
      ],
    });

    const existingPaths = new Set(['/pool/w1']);
    const orphans = findOrphans(state, existingPaths);
    expect(orphans.inStateNotOnDisk).toHaveLength(1);
    expect(orphans.inStateNotOnDisk[0].id).toBe('w2');
  });

  it('detects disk entries not in state', () => {
    const state = createPoolState({
      worktrees: [createWorktree({ id: 'w1', path: '/pool/w1' })],
    });

    const existingPaths = new Set(['/pool/w1', '/pool/unknown']);
    const orphans = findOrphans(state, existingPaths);
    expect(orphans.onDiskNotInState).toEqual(['/pool/unknown']);
  });
});

describe('getPoolStatus', () => {
  it('returns full status summary', () => {
    const state = createPoolState({
      config: { ...DEFAULT_CONFIG, target_spares: 3 },
      worktrees: [
        createWorktree({ id: 'w1', status: 'warm' }),
        createWorktree({ id: 'w2', status: 'assigned' }),
        createWorktree({ id: 'w3', status: 'creating' }),
        createWorktree({ id: 'w4', status: 'destroying' }),
      ],
    });

    const s = getPoolStatus(state);
    expect(s.warm).toBe(1);
    expect(s.assigned).toBe(1);
    expect(s.creating).toBe(1);
    expect(s.other).toBe(1);
    expect(s.total).toBe(4);
    expect(s.spares_needed).toBe(2);
  });
});

describe('state transitions', () => {
  it('creating -> warming -> warm -> assigned -> recycling -> warm', () => {
    let state = createPoolState();
    const wt = createWorktree({ id: 'w1', status: 'creating' });

    state = addWorktree(state, wt);
    expect(state.worktrees[0].status).toBe('creating');

    state = updateWorktree(state, 'w1', { status: 'warming' });
    expect(state.worktrees[0].status).toBe('warming');

    state = updateWorktree(state, 'w1', { status: 'warm' });
    expect(state.worktrees[0].status).toBe('warm');

    const claimed = claimWorktree(state, 42, 'feature/42-foo');
    expect(claimed).not.toBeNull();
    state = claimed?.state;
    expect(state.worktrees[0].status).toBe('assigned');

    state = updateWorktree(state, 'w1', { status: 'recycling' });
    expect(state.worktrees[0].status).toBe('recycling');

    state = updateWorktree(state, 'w1', {
      status: 'warm',
      assigned_to_issue: null,
      assigned_branch: null,
    });
    expect(state.worktrees[0].status).toBe('warm');
    expect(state.worktrees[0].assigned_to_issue).toBeNull();
  });

  it('creating -> warming -> warm -> assigned -> destroying (removal)', () => {
    let state = createPoolState();
    const wt = createWorktree({ id: 'w1', status: 'creating' });

    state = addWorktree(state, wt);
    state = updateWorktree(state, 'w1', { status: 'warming' });
    state = updateWorktree(state, 'w1', { status: 'warm' });

    const claimed = claimWorktree(state, 10, 'feature/10-bar');
    state = claimed?.state;

    state = updateWorktree(state, 'w1', { status: 'destroying' });
    expect(state.worktrees[0].status).toBe('destroying');

    state = removeWorktree(state, 'w1');
    expect(state.worktrees).toHaveLength(0);
  });
});
