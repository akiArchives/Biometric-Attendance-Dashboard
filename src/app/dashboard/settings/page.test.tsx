import { describe, it, expect, vi } from "vitest";
import SettingsPage, { getStatusBadgeStyle } from "./page";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
  }),
}));

vi.mock("next-themes", () => ({
  useTheme: () => ({
    theme: "light",
    setTheme: vi.fn(),
  }),
}));

vi.mock("@/lib/supabase/client", () => ({
  createClient: () => ({
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
    },
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: null, error: null }),
    maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
  }),
}));

describe("SettingsPage Component", () => {
  it("should export a function", () => {
    expect(SettingsPage).toBeTypeOf("function");
  });

  describe("getStatusBadgeStyle helper", () => {
    it("should return the correct style class for approved status", () => {
      expect(getStatusBadgeStyle("approved")).toContain("bg-emerald-500/10");
      expect(getStatusBadgeStyle("approved")).toContain("text-emerald-500");
    });

    it("should return the correct style class for rejected status", () => {
      expect(getStatusBadgeStyle("rejected")).toContain("bg-rose-500/10");
      expect(getStatusBadgeStyle("rejected")).toContain("text-rose-500");
    });

    it("should return the correct style class for pending status", () => {
      expect(getStatusBadgeStyle("pending")).toContain("bg-amber-500/10");
      expect(getStatusBadgeStyle("pending")).toContain("text-amber-500");
      expect(getStatusBadgeStyle("pending")).toContain("animate-pulse");
    });
  });
});
