"use client";

import { useEffect, useState } from "react";
import { Bell, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const KEY = "sm-notif-asked";

export function NotificationPrompt() {
  const { user } = useAuth();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!user) return;
    if (!("Notification" in window)) return;
    if (Notification.permission === "granted" || Notification.permission === "denied") return;
    if (localStorage.getItem(KEY) === "1") return;

    const t = window.setTimeout(() => setShow(true), 2500);
    return () => clearTimeout(t);
  }, [user]);

  if (!show) return null;

  const dismiss = () => {
    localStorage.setItem(KEY, "1");
    setShow(false);
  };

  const allow = async () => {
    try {
      const perm = await Notification.requestPermission();
      localStorage.setItem(KEY, "1");
      setShow(false);
      if (perm === "granted") {
        toast.success("Notifications enabled");
        try {
          new Notification("Sweet Mandy", {
            body: "You'll get updates on orders and deliveries.",
            icon: "/icon-192.png",
          });
        } catch {
          /* ignore */
        }
      } else {
        toast.message("Notifications blocked — enable later in browser settings");
      }
    } catch {
      dismiss();
    }
  };

  return (
    <div className="fixed bottom-[5.5rem] left-3 right-3 z-[60] mx-auto max-w-md animate-fade-up md:bottom-24 md:left-auto md:right-6">
      <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-[#1a0c0e]/95 p-4 shadow-soft backdrop-blur-xl">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/20 text-primary">
          <Bell className="size-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold">Allow notifications?</p>
          <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
            Get alerts when your order is confirmed, out for delivery, or ready for pickup.
          </p>
          <div className="mt-3 flex items-center gap-2">
            <Button size="sm" className="rounded-full px-4" onClick={allow}>
              Allow
            </Button>
            <button type="button" onClick={dismiss} className="rounded-full px-3 py-1.5 text-sm text-muted-foreground">
              Not now
            </button>
          </div>
        </div>
        <button type="button" onClick={dismiss} className="rounded-full p-1 text-muted-foreground" aria-label="Close">
          <X className="size-4" />
        </button>
      </div>
    </div>
  );
}
