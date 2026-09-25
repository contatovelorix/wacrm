import { beforeEach, describe, expect, it, vi } from 'vitest';

const { getUser, redirect } = vi.hoisted(() => ({
  getUser: vi.fn(),
  redirect: vi.fn((path: string) => {
    throw new Error(`redirect:${path}`);
  }),
}));

vi.mock('@/lib/supabase/server', () => ({
  createClient: async () => ({ auth: { getUser } }),
}));
vi.mock('next/navigation', () => ({ redirect }));

const { requireUser } = await import('./require-user');

describe('requireUser', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns a user verified by Supabase on the server', async () => {
    const user = { id: 'user-1' };
    getUser.mockResolvedValue({ data: { user } });

    await expect(requireUser()).resolves.toBe(user);
    expect(redirect).not.toHaveBeenCalled();
  });

  it('redirects an unauthenticated request to login', async () => {
    getUser.mockResolvedValue({ data: { user: null } });

    await expect(requireUser()).rejects.toThrow('redirect:/login');
    expect(redirect).toHaveBeenCalledWith('/login');
  });
});
