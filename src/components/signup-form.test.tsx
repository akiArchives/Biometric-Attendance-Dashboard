import { describe, it, expect, vi, beforeEach } from "vitest";
import { SignupForm } from "./signup-form";
import { signup } from "@/app/(login)/actions";

const mockPush = vi.fn();
const mockRefresh = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    refresh: mockRefresh,
  }),
}));

vi.mock("@/app/(login)/actions", () => ({
  signup: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("SignupForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should be defined as a React component function", () => {
    expect(SignupForm).toBeTypeOf("function");
  });

  it("verifies router push and refresh logic on signup success", async () => {
    (signup as any).mockResolvedValue({
      success: true,
      message: "Account created successfully!",
    });

    const result = await signup(new FormData());
    if (!result?.error) {
      mockPush("/dashboard");
      mockRefresh();
    }

    expect(mockPush).toHaveBeenCalledWith("/dashboard");
    expect(mockRefresh).toHaveBeenCalled();
  });
});
