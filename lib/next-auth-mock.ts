"use client";

export async function signOut({ callbackUrl }: { callbackUrl?: string } = {}) {
  // Clear the auth_session cookie
  document.cookie = "auth_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  
  // Clear localStorage if any
  if (typeof window !== "undefined") {
    localStorage.removeItem("auth_session");
    window.location.href = callbackUrl || "/";
  }
}
