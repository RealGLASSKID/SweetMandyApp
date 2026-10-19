"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

const STORAGE_KEY = "sm_welcomed";
const SKIP = ["/welcome", "/login", "/signup", "/admin", "/rider"];

export function WelcomeGate() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (SKIP.some((p) => pathname === p || pathname.startsWith(p + "/"))) return;
    try {
      if (localStorage.getItem(STORAGE_KEY) !== "1") {
        router.replace("/welcome");
      }
    } catch {
      /* ignore */
    }
  }, [pathname, router]);

  return null;
}