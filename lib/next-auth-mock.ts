"use client";

import { loginAction, logoutAction } from "@/lib/actions";

export async function signOut({ callbackUrl }: { callbackUrl?: string } = {}) {
  // Clear localStorage if any
  if (typeof window !== "undefined") {
    localStorage.removeItem("auth_session");
  }
  
  // Call the Server Action to clear the HTTP-only cookie and redirect
  await logoutAction();
}

export async function signIn(
  provider: string,
  options: { redirect?: boolean; email?: string; password?: string } = {}
) {
  if (provider === "credentials") {
    const formData = new FormData();
    if (options.email) formData.append("email", options.email);
    if (options.password) formData.append("password", options.password);
    
    try {
      const res = await loginAction(formData);
      
      if (res.success && res.data) {
        return {
          error: null,
          status: 200,
          ok: true,
          url: null,
          role: res.data.role,
          clubSlug: res.data.clubSlug,
        };
      } else {
        return {
          error: res.error || "Invalid credentials",
          status: 401,
          ok: false,
          url: null,
        };
      }
    } catch (err: any) {
      return {
        error: err.message || "Authentication error",
        status: 500,
        ok: false,
        url: null,
      };
    }
  }
  
  return { error: "Unsupported provider", status: 400, ok: false, url: null };
}
