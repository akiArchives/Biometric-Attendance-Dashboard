import { describe, it, expect, vi, beforeEach } from "vitest";
import { deleteUserAction } from "./actions";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";

vi.mock("next/headers", () => ({
  cookies: vi.fn().mockResolvedValue({
    getAll: vi.fn().mockReturnValue([]),
  }),
}));

vi.mock("@supabase/ssr", () => ({
  createServerClient: vi.fn(),
}));

vi.mock("@supabase/supabase-js", () => ({
  createClient: vi.fn(),
}));

describe("deleteUserAction Server Action", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should throw an error if no authenticated user is found", async () => {
    vi.mocked(createServerClient).mockReturnValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
      },
    } as any);

    await expect(deleteUserAction("target-123")).rejects.toThrow("Unauthorized");
  });

  it("should throw an error if caller is not an admin", async () => {
    vi.mocked(createServerClient).mockReturnValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: { id: "caller-123" } }, error: null }),
      },
      from: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: { role: "member" }, error: null }),
    } as any);

    await expect(deleteUserAction("target-123")).rejects.toThrow("Forbidden: Only administrators");
  });

  it("should throw an error if admin tries to delete themselves", async () => {
    vi.mocked(createServerClient).mockReturnValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: { id: "admin-123" } }, error: null }),
      },
      from: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: { role: "admin" }, error: null }),
    } as any);

    await expect(deleteUserAction("admin-123")).rejects.toThrow("Forbidden: You cannot delete your own account");
  });

  it("should execute deletion successfully if caller is admin", async () => {
    vi.mocked(createServerClient).mockReturnValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: { id: "admin-123" } }, error: null }),
      },
      from: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: { role: "admin" }, error: null }),
    } as any);

    const mockDeleteUser = vi.fn().mockResolvedValue({ error: null });
    vi.mocked(createClient).mockReturnValue({
      auth: {
        admin: {
          deleteUser: mockDeleteUser,
        },
      },
    } as any);

    const res = await deleteUserAction("target-123");
    expect(res.success).toBe(true);
    expect(mockDeleteUser).toHaveBeenCalledWith("target-123");
  });
});
