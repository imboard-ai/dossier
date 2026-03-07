import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    exclude: ['**/worktrees/**', '**/node_modules/**', '**/dist/**'],
    setupFiles: ['./src/__tests__/helpers/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['dist/', 'node_modules/', 'src/__tests__/'],
      thresholds: {
        statements: 70,
        branches: 60,
        functions: 65,
        lines: 70,
      },
    },
  },
});
