import { describe, it, expect, vi } from 'vitest';
import { proxy } from './proxy';
import { NextRequest } from 'next/server';

vi.mock('@/lib/auth0', () => ({
  auth0: {
    middleware: vi.fn().mockImplementation((req) => {
      if (req.nextUrl.pathname.startsWith('/auth/')) {
        return new Response('Auth Flow Intercepted');
      }
      return null;
    }),
    getSession: vi.fn().mockResolvedValue(null),
  },
}));

describe('Next.js 16 Proxy Routing', () => {
  it('should redirect unauthenticated users accessing /dashboard to /auth/login', async () => {
    const req = new NextRequest(new URL('http://localhost:3000/dashboard'));
    const res = await proxy(req);
    expect(res.status).toBe(307);
    expect(res.headers.get('location')).toContain('/auth/login');
  });

  it('should let Auth0 middleware handle /auth paths', async () => {
    const req = new NextRequest(new URL('http://localhost:3000/auth/login'));
    const res = await proxy(req);
    const text = await res.text();
    expect(text).toBe('Auth Flow Intercepted');
  });
});
