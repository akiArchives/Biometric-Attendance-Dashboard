"use server";

import { redirect } from "next/navigation";

export async function login(_formData: FormData): Promise<{ error?: string; success?: boolean }> {
  redirect("/auth/login");
}

export async function signup(_formData: FormData): Promise<{ error?: string; success?: boolean; message?: string }> {
  redirect("/auth/login");
}

export async function logout() {
  redirect("/auth/logout");
}


