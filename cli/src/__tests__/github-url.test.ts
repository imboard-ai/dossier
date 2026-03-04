import { describe, expect, it } from 'vitest';
import { convertGitHubBlobToRaw } from '../github-url';

describe('convertGitHubBlobToRaw', () => {
  it('should convert a GitHub blob URL to raw URL', () => {
    const input = 'https://github.com/owner/repo/blob/main/path/file.md';
    const expected = 'https://raw.githubusercontent.com/owner/repo/main/path/file.md';
    expect(convertGitHubBlobToRaw(input)).toBe(expected);
  });

  it('should handle nested paths', () => {
    const input = 'https://github.com/imboard-ai/ai-dossier/blob/main/examples/test.ds.md';
    const expected =
      'https://raw.githubusercontent.com/imboard-ai/ai-dossier/main/examples/test.ds.md';
    expect(convertGitHubBlobToRaw(input)).toBe(expected);
  });

  it('should handle different branches', () => {
    const input = 'https://github.com/owner/repo/blob/feature/branch/file.md';
    const expected = 'https://raw.githubusercontent.com/owner/repo/feature/branch/file.md';
    expect(convertGitHubBlobToRaw(input)).toBe(expected);
  });

  it('should leave non-GitHub URLs unchanged', () => {
    const input = 'https://example.com/file.md';
    expect(convertGitHubBlobToRaw(input)).toBe(input);
  });

  it('should leave GitHub non-blob URLs unchanged', () => {
    const input = 'https://github.com/owner/repo/tree/main/path';
    expect(convertGitHubBlobToRaw(input)).toBe(input);
  });

  it('should leave raw.githubusercontent URLs unchanged', () => {
    const input = 'https://raw.githubusercontent.com/owner/repo/main/file.md';
    expect(convertGitHubBlobToRaw(input)).toBe(input);
  });
});
