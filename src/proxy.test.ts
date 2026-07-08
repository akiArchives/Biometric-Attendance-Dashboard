/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { proxy } from './proxy';
import { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

vi.mock('@supabase/ssr', () => ({
  createServerClient: vi.fn(),
}));

describe('Next.js Middleware Routing', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should redirect unauthenticated users accessing /dashboard to /sign-in', async () => {
    const mockGetUser = vi.fn().mockResolvedValue({ data: { user: null }, error: null });
    vi.mocked(createServerClient).mockReturnValue({
      auth: { getUser: mockGetUser },
    } as any);

    const req = new NextRequest(new URL('http://localhost:3000/dashboard'));
    const res = await proxy(req);
    expect(res.status).toBe(307);
    expect(res.headers.get('location')).toContain('/sign-in');
  });

  it('should redirect authenticated users accessing /sign-in to /dashboard', async () => {
    const mockGetUser = vi.fn().mockResolvedValue({ data: { user: { email: 'user@example.com' } }, error: null });
    vi.mocked(createServerClient).mockReturnValue({
      auth: { getUser: mockGetUser },
    } as any);

    const req = new NextRequest(new URL('http://localhost:3000/sign-in'));
    const res = await proxy(req);
    expect(res.status).toBe(307);
    expect(res.headers.get('location')).toContain('/dashboard');
  });

  it('should allow authenticated users to access /dashboard without redirect', async () => {
    const mockGetUser = vi.fn().mockResolvedValue({ data: { user: { email: 'user@example.com' } }, error: null });
    vi.mocked(createServerClient).mockReturnValue({
      auth: { getUser: mockGetUser },
    } as any);

    const req = new NextRequest(new URL('http://localhost:3000/dashboard'));
    const res = await proxy(req);
    expect(res.status).not.toBe(307);
    expect(res.headers.get('location')).toBeNull();
  });
});
