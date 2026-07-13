"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function RedirectToDefaultHome() {
  const router = useRouter();

  useEffect(() => {
    try {
      const alreadyRedirected = sessionStorage.getItem("clifsa_already_redirected");
      if (!alreadyRedirected) {
        const saved = localStorage.getItem("clifsa_attendance_settings");
        if (saved) {
          const settings = JSON.parse(saved);
          if (settings.defaultHomePage && settings.defaultHomePage !== "dashboard") {
            sessionStorage.setItem("clifsa_already_redirected", "true");
            if (settings.defaultHomePage === "logs") {
              router.replace("/dashboard/analytics");
            } else if (settings.defaultHomePage === "reports") {
              router.replace("/dashboard/reports");
            }
            return;
          }
        }
      }
      sessionStorage.setItem("clifsa_already_redirected", "true");
    } catch (e) {
      console.error(e);
    }
  }, [router]);

  return null;
}
