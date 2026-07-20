import { describe, it, expect, vi } from "vitest";
import { SiteHeader } from "./site-header";

vi.mock("next/navigation", () => ({
  usePathname: () => "/dashboard/analytics",
  useSearchParams: () => new URLSearchParams(),
  useRouter: () => ({ push: vi.fn() }),
}));

describe("SiteHeader", () => {
  it("should be exported as a React component function", () => {
    expect(SiteHeader).toBeTypeOf("function");
  });

  it("should return JSX element for admin view", () => {
    const element = SiteHeader({ isAdmin: true });
    expect(element).toBeDefined();
    expect(element.type).toBeDefined();
  });

  it("should return JSX element for non-admin view", () => {
    const element = SiteHeader({ isAdmin: false });
    expect(element).toBeDefined();
    expect(element.type).toBeDefined();
  });
});
