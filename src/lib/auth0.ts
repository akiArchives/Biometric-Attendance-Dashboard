import { Auth0Client } from '@auth0/nextjs-auth0/server';

export const auth0 = new Auth0Client({
  domain: process.env.AUTH0_DOMAIN || 'test-tenant.auth0.com',
  clientId: process.env.AUTH0_CLIENT_ID || 'test-client-id',
  clientSecret: process.env.AUTH0_CLIENT_SECRET || 'test-client-secret',
  secret: process.env.AUTH0_SECRET || '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
  appBaseUrl: process.env.APP_BASE_URL || 'http://localhost:3000',
});
