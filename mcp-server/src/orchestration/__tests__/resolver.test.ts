import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DossierResolver, ResolveError } from '../resolver';

// Mock the CLI wrapper
vi.mock('../../utils/cli-wrapper', () => ({
  CliNotFoundError: class extends Error {
    name = 'CliNotFoundError';
    constructor() {
      super('ai-dossier CLI not found');
    }
  },
  execCli: vi.fn(),
}));

// Mock the logger
vi.mock('../../utils/logger', () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  },
}));

import { execCli } from '../../utils/cli-wrapper';

const mockExecCli = vi.mocked(execCli);

describe('DossierResolver', () => {
  let resolver: DossierResolver;

  beforeEach(() => {
    resolver = new DossierResolver('/test/project');
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('resolveFromPath', () => {
    it('should resolve a dossier from a file path', async () => {
      mockExecCli.mockResolvedValueOnce({
        name: 'deploy-to-aws',
        title: 'Deploy to AWS',
        version: '1.0.0',
        risk_level: 'high',
        relationships: {
          preceded_by: [{ dossier: 'setup-infra', condition: 'required' }],
        },
      });

      const result = await resolver.resolveFromPath('/test/project/deploy.ds.md');

      expect(result.name).toBe('deploy-to-aws');
      expect(result.source).toBe('local');
      expect(result.relationships?.preceded_by).toHaveLength(1);
      expect(mockExecCli).toHaveBeenCalledWith('info', ['/test/project/deploy.ds.md', '--json']);
    });

    it('should use filename as name when metadata has no name', async () => {
      mockExecCli.mockResolvedValueOnce({
        title: 'My Dossier',
        version: '1.0.0',
      });

      const result = await resolver.resolveFromPath('/test/project/my-dossier.ds.md');

      expect(result.name).toBe('my-dossier');
    });
  });

  describe('resolve', () => {
    it('should resolve locally first', async () => {
      // First call: list (local index)
      mockExecCli.mockResolvedValueOnce([
        { path: '/test/project/setup.ds.md', name: 'setup-infra' },
      ]);
      // Second call: info (get metadata)
      mockExecCli.mockResolvedValueOnce({
        name: 'setup-infra',
        title: 'Setup Infrastructure',
        risk_level: 'medium',
      });

      const result = await resolver.resolve('setup-infra');

      expect(result.source).toBe('local');
      expect(result.name).toBe('setup-infra');
    });

    it('should fall back to registry when not found locally', async () => {
      // First call: list (empty local index)
      mockExecCli.mockResolvedValueOnce([]);
      // Second call: registry get
      mockExecCli.mockResolvedValueOnce({
        name: 'community-dossier',
        title: 'Community Dossier',
        version: '2.0.0',
      });

      const result = await resolver.resolve('community-dossier');

      expect(result.source).toBe('registry');
      expect(result.name).toBe('community-dossier');
    });

    it('should throw ResolveError when not found anywhere', async () => {
      // First call: list (empty local index)
      mockExecCli.mockResolvedValueOnce([]);
      // Second call: registry get (fails)
      mockExecCli.mockRejectedValueOnce(new Error('Not found'));

      await expect(resolver.resolve('nonexistent')).rejects.toThrow(ResolveError);
    });

    it('should cache resolved dossiers', async () => {
      // First call: list
      mockExecCli.mockResolvedValueOnce([
        { path: '/test/project/cached.ds.md', name: 'cached-dossier' },
      ]);
      // Second call: info
      mockExecCli.mockResolvedValueOnce({
        name: 'cached-dossier',
        title: 'Cached',
      });

      const result1 = await resolver.resolve('cached-dossier');
      const result2 = await resolver.resolve('cached-dossier');

      expect(result1).toBe(result2); // Same reference
      // info should only be called once (second resolve uses cache)
      expect(mockExecCli).toHaveBeenCalledTimes(2); // list + info, no second pair
    });
  });

  describe('resolveGraph', () => {
    it('should recursively resolve dependencies', async () => {
      const entry = {
        name: 'deploy',
        source: 'local' as const,
        path: '/test/deploy.ds.md',
        metadata: { risk_level: 'high' },
        relationships: {
          preceded_by: [{ dossier: 'setup', condition: 'required' as const }],
        },
      };

      // list call (local index scan)
      mockExecCli.mockResolvedValueOnce([{ path: '/test/setup.ds.md', name: 'setup' }]);
      // info call for 'setup'
      mockExecCli.mockResolvedValueOnce({
        name: 'setup',
        title: 'Setup',
        risk_level: 'low',
        relationships: {},
      });

      const nodes = await resolver.resolveGraph(entry);

      expect(nodes.size).toBe(2);
      expect(nodes.has('deploy')).toBe(true);
      expect(nodes.has('setup')).toBe(true);
      expect(nodes.get('deploy')?.riskLevel).toBe('high');
      expect(nodes.get('setup')?.riskLevel).toBe('low');
    });

    it('should handle unresolvable references gracefully', async () => {
      const entry = {
        name: 'deploy',
        source: 'local' as const,
        metadata: {},
        relationships: {
          preceded_by: [{ dossier: 'missing', condition: 'optional' as const }],
        },
      };

      // list call returns empty
      mockExecCli.mockResolvedValueOnce([]);
      // registry lookup fails
      mockExecCli.mockRejectedValueOnce(new Error('Not found'));

      const nodes = await resolver.resolveGraph(entry);

      // Should still have the entry node, just skip the missing one
      expect(nodes.size).toBe(1);
      expect(nodes.has('deploy')).toBe(true);
    });

    it('should not revisit already-resolved nodes', async () => {
      const entry = {
        name: 'a',
        source: 'local' as const,
        metadata: {},
        relationships: {
          preceded_by: [{ dossier: 'b' }],
          followed_by: [{ dossier: 'b' }], // same ref in two places
        },
      };

      // list
      mockExecCli.mockResolvedValueOnce([{ path: '/test/b.ds.md', name: 'b' }]);
      // info for 'b'
      mockExecCli.mockResolvedValueOnce({
        name: 'b',
        relationships: { preceded_by: [{ dossier: 'a' }] }, // refers back to a
      });

      const nodes = await resolver.resolveGraph(entry);

      expect(nodes.size).toBe(2);
    });
  });
});
