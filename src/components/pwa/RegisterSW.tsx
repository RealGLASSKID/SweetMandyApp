"use client";

import { useEffect } from "react";

export function RegisterSW() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

    // Only register in production (or when testing HTTPS / localhost)
    const register = async () => {
      try {
        const reg = await navigator.serviceWorker.register("/sw.js", { scope: "/" });
        console.log("[PWA] Service worker registered", reg.scope);
      } catch (err) {
        console.warn("[PWA] Service worker registration failed", err);
      }
    };

    register();
  }, []);

  return null;
}
