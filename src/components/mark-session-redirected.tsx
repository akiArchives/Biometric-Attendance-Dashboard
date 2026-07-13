"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function MarkSessionRedirected() {
  const pathname = usePathname();
  useEffect(() => {
    if (pathname !== "/dashboard") {
      sessionStorage.setItem("clifsa_already_redirected", "true");
    }
  }, [pathname]);
  return null;
}
