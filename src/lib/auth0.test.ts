import { describe, it, expect } from 'vitest';

describe('Auth0 Client Initialization', () => {
  it('should initialize and export the auth0 client instance', async () => {
    const { auth0 } = await import('./auth0');
    expect(auth0).toBeDefined();
  });
});
