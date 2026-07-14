"use server";

import { createClient, createAdminClient } from "@/lib/supabase/server";

export async function deleteUserAction(targetUserId: string): Promise<{ success: boolean; error?: string }> {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return { success: false, error: "Configuration Error: Supabase keys are missing on the server." };
    }

    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: "Unauthorized: Please log in." };
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile || profile.role !== "admin") {
      return { success: false, error: "Forbidden: Only administrators can delete users." };
    }

    if (targetUserId === user.id) {
      return { success: false, error: "Forbidden: You cannot delete your own account." };
    }

    const supabaseAdmin = await createAdminClient();

    const { error } = await supabaseAdmin.auth.admin.deleteUser(targetUserId);
    if (error) {
      console.error("Admin deletion failed:", error);
      return { success: false, error: `Failed to delete user: ${error.message}` };
    }

    return { success: true };
  } catch (e: any) {
    console.error("deleteUserAction caught error:", e);
    return { success: false, error: e.message || "An unexpected error occurred during user deletion." };
  }
}
