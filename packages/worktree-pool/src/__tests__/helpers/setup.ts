import { execSync } from 'node:child_process';
import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import type { PoolState, PoolWorktree } from '../../types';
import { DEFAULT_CONFIG, SCHEMA_VERSION } from '../../types';

export interface TempRepo {
  root: string;
  cleanup: () => void;
}

export function createTempRepo(): TempRepo {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'worktree-pool-test-'));
  const repoDir = path.join(tmpDir, 'main');
  fs.mkdirSync(repoDir);

  // Init git repo with an initial commit
  execSync('git init', { cwd: repoDir, stdio: 'pipe' });
  execSync('git config user.email "test@test.com"', {
    cwd: repoDir,
    stdio: 'pipe',
  });
  execSync('git config user.name "Test"', {
    cwd: repoDir,
    stdio: 'pipe',
  });

  // Create minimal package.json
  fs.writeFileSync(
    path.join(repoDir, 'package.json'),
    JSON.stringify(
      {
        name: 'test-repo',
        version: '1.0.0',
        scripts: { build: 'echo build' },
      },
      null,
      2
    )
  );

  // Create minimal Makefile
  fs.writeFileSync(
    path.join(repoDir, 'Makefile'),
    `build-core:\n\t@echo "build-core"\nbuild-mcp:\n\t@echo "build-mcp"\nbuild-cli:\n\t@echo "build-cli"\n`
  );

  // Create .gitignore
  fs.writeFileSync(path.join(repoDir, '.gitignore'), 'node_modules/\nworktrees/\n');

  execSync('git add -A', { cwd: repoDir, stdio: 'pipe' });
  execSync('git commit -m "initial"', { cwd: repoDir, stdio: 'pipe' });
  execSync('git branch -M main', { cwd: repoDir, stdio: 'pipe' });

  // Create a bare "origin" to simulate remote
  const bareDir = path.join(tmpDir, 'origin.git');
  execSync(`git clone --bare "${repoDir}" "${bareDir}"`, { stdio: 'pipe' });
  execSync(`git remote add origin "${bareDir}"`, {
    cwd: repoDir,
    stdio: 'pipe',
  });
  execSync('git fetch origin', { cwd: repoDir, stdio: 'pipe' });

  // Create worktrees directory (sibling of main/)
  const worktreesDir = path.join(tmpDir, 'worktrees');
  fs.mkdirSync(worktreesDir);

  return {
    root: repoDir,
    cleanup: () => {
      // Remove all worktrees first
      try {
        const wtList = execSync('git worktree list --porcelain', {
          cwd: repoDir,
          encoding: 'utf-8',
        });
        for (const line of wtList.split('\n')) {
          if (line.startsWith('worktree ')) {
            const wtPath = line.slice('worktree '.length);
            if (path.resolve(wtPath) !== path.resolve(repoDir)) {
              try {
                execSync(`git worktree remove "${wtPath}" --force`, {
                  cwd: repoDir,
                  stdio: 'pipe',
                });
              } catch {
                // best effort
              }
            }
          }
        }
      } catch {
        // best effort
      }
      fs.rmSync(tmpDir, { recursive: true, force: true });
    },
  };
}

export function createPoolState(overrides?: Partial<PoolState>): PoolState {
  return {
    schema_version: SCHEMA_VERSION,
    config: { ...DEFAULT_CONFIG, ...overrides?.config },
    worktrees: overrides?.worktrees || [],
  };
}

export function createWorktree(overrides?: Partial<PoolWorktree>): PoolWorktree {
  const id = overrides?.id || `pool-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  return {
    id,
    path: overrides?.path || `/tmp/worktrees/${id}`,
    status: overrides?.status || 'warm',
    temp_branch: overrides?.temp_branch || `pool/spare-${id}`,
    base_commit: overrides?.base_commit || 'abc123',
    warmed_at: overrides?.warmed_at || new Date().toISOString(),
    assigned_to_issue: overrides?.assigned_to_issue ?? null,
    assigned_branch: overrides?.assigned_branch ?? null,
  };
}
