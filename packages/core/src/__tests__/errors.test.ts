import { describe, expect, it } from 'vitest';
import { getErrorMessage, getErrorStack } from '../utils/errors';

describe('getErrorMessage', () => {
  it('should extract message from Error instance', () => {
    expect(getErrorMessage(new Error('test error'))).toBe('test error');
  });

  it('should convert non-Error to string', () => {
    expect(getErrorMessage('string error')).toBe('string error');
    expect(getErrorMessage(42)).toBe('42');
    expect(getErrorMessage(null)).toBe('null');
    expect(getErrorMessage(undefined)).toBe('undefined');
  });
});

describe('getErrorStack', () => {
  it('should extract stack from Error instance', () => {
    const err = new Error('test');
    const stack = getErrorStack(err);
    expect(stack).toBeDefined();
    expect(stack).toContain('Error: test');
  });

  it('should return undefined for non-Error types', () => {
    expect(getErrorStack('not an error')).toBeUndefined();
    expect(getErrorStack(42)).toBeUndefined();
    expect(getErrorStack(null)).toBeUndefined();
  });
});
