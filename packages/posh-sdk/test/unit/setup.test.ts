import { describe, it, expect } from 'vitest';

describe('Package Setup', () => {
  it('should pass a basic test', () => {
    expect(true).toBe(true);
  });

  it('should handle TypeScript types correctly', () => {
    const value: string = 'test';
    expect(typeof value).toBe('string');
  });
});
