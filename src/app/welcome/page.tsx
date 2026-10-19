"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brand/Logo";
import { useAuth } from "@/context/AuthContext";

const WELCOME_HERO = "/assets/welcome-hero.jpg";
const STORAGE_KEY = "sm_welcomed";

function markWelcomed() {
  try {
    localStorage.setItem(STORAGE_KEY, "1");
  } catch {
    /* ignore */
  }
}

export default function WelcomePage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [ready, setReady] = useState(false);

  // Already welcomed → skip to home/menu
  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) === "1") {
        router.replace(user ? "/menu" : "/");
        return;
      }
    } catch {
      /* ignore */
    }
    setReady(true);
  }, [router, user]);

  const go = (href: string) => {
    markWelcomed();
    router.push(href);
  };

  if (!ready || loading) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-[#0a0406] text-sm text-white/50">
        Loading…
      </div>
    );
  }

  const content = (
    <div className="w-full max-w-md animate-fade-up">
      <div className="mb-8 text-center lg:text-left">
        <Logo className="justify-center lg:justify-start" size="lg" />
        <h1 className="mt-6 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Welcome to Sweet Mandy
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-white/70 sm:text-base">
          Fresh bakery &amp; delicious meals in Ijegun, Lagos. Order Take Away or Mainland
          delivery — jollof, small chops, breads, drinks &amp; more.
        </p>
      </div>

      <div className="space-y-3 rounded-3xl border border-white/10 bg-[#1a0c0e]/85 p-6 shadow-soft backdrop-blur-xl">
        <Button
          className="h-12 w-full rounded-full shadow-glow"
          onClick={() => go("/menu")}
        >
          Get started — browse menu
        </Button>
        <Button
          variant="outline"
          className="h-11 w-full rounded-full border-white/15 bg-white/5 text-white hover:bg-white/10"
          onClick={() => go(user ? "/menu" : "/login")}
        >
          {user ? "Continue to menu" : "Sign in"}
        </Button>
        <button
          type="button"
          className="w-full py-2 text-center text-xs text-white/50 transition hover:text-white/80"
          onClick={() => go("/")}
        >
          Skip for now
        </button>
      </div>

      <p className="mt-6 text-center text-xs text-white/45 lg:text-left">
        Delivery on Lagos Mainland only · Pay by bank transfer for delivery
      </p>
    </div>
  );

  return (
    <div className="relative min-h-[100dvh] w-full lg:grid lg:min-h-[100dvh] lg:grid-cols-2">
      {/* Desktop left panel */}
      <div className="relative hidden lg:block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={WELCOME_HERO}
          alt="Sweet Mandy Food & Bakery"
          className="absolute inset-0 size-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0a0406]/45" />
      </div>

      {/* Mobile bg + content */}
      <div className="relative flex min-h-[100dvh] items-end justify-center px-4 pb-12 pt-28 sm:items-center sm:py-12 lg:items-center lg:bg-[#0a0406] lg:px-10">
        <div className="absolute inset-0 lg:hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={WELCOME_HERO} alt="" className="size-full object-cover object-top" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0406] via-[#0a0406]/90 to-[#0a0406]/30" />
        </div>
        <div className="relative z-10 w-full flex justify-center lg:justify-start">{content}</div>
      </div>
    </div>
  );
}