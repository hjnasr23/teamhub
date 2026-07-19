"use client";

import { useEffect, useRef } from "react";
import { signOut } from "next-auth/react";
import { logoutAction } from "@/lib/actions";

export function useInactivityLogout(timeoutMs: number = 60000) {
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleLogout = async () => {
      try {
        await signOut({ redirect: false });
        await logoutAction();
      } catch (e) {
        // Fallback redirection to login page
        window.location.href = "/login";
      }
    };

    const resetTimer = () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = setTimeout(handleLogout, timeoutMs);
    };

    // Listen to standard user interaction events
    const events = ["mousedown", "mousemove", "keypress", "scroll", "touchstart"];

    // Start initial timer
    resetTimer();

    // Bind event listeners
    events.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    // Cleanup listeners and timer
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [timeoutMs]);
}
