"use client";

import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const DISMISS_KEY = "sm-install-dismissed";

export function InstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(DISMISS_KEY) === "1") return;

    // Already installed?
    if (window.matchMedia("(display-mode: standalone)").matches) return;

    const onBip = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
      setVisible(true);
    };

    window.addEventListener("beforeinstallprompt", onBip);

    // iOS / browsers without beforeinstallprompt — show soft tip after delay
    const t = window.setTimeout(() => {
      const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);
      if (isIos && !window.matchMedia("(display-mode: standalone)").matches) {
        setVisible(true);
      }
    }, 4000);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBip);
      clearTimeout(t);
    };
  }, []);

  if (!visible) return null;

  const dismiss = () => {
    setVisible(false);
    sessionStorage.setItem(DISMISS_KEY, "1");
  };

  const install = async () => {
    if (deferred) {
      await deferred.prompt();
      const { outcome } = await deferred.userChoice;
      if (outcome === "accepted") setVisible(false);
      setDeferred(null);
    } else {
      // iOS instructions
      alert(
        "To install Sweet Mandy:\n\n1. Tap the Share button\n2. Choose “Add to Home Screen”\n3. Tap Add",
      );
    }
  };

  return (
    <div className="fixed bottom-[5.5rem] left-3 right-3 z-[60] mx-auto max-w-md animate-fade-up md:bottom-6 md:left-auto md:right-6">
      <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-[#1a0c0e]/95 p-4 shadow-soft backdrop-blur-xl">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/20 text-primary">
          <Download className="size-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-foreground">Install Sweet Mandy</p>
          <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
            Install the app on your home screen for quicker access and offline support.
          </p>
          <div className="mt-3 flex items-center gap-2">
            <Button size="sm" className="rounded-full px-4" onClick={install}>
              Install
            </Button>
            <button
              type="button"
              onClick={dismiss}
              className="rounded-full px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground"
            >
              Not now
            </button>
          </div>
        </div>
        <button
          type="button"
          onClick={dismiss}
          className="rounded-full p-1 text-muted-foreground hover:bg-white/5 hover:text-foreground"
          aria-label="Close"
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  );
}
