"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/brand/Logo";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const LOGIN_HERO = "/assets/login-hero.jpg";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/menu";
  const { signIn, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn(email.trim(), password);
      toast.success("Welcome back!");
      router.push(next);
    } catch (err: unknown) {
      let msg = "Could not sign in";
      if (err && typeof err === "object" && "code" in err) {
        const code = String((err as { code: string }).code);
        if (code.includes("api-key-not-valid")) {
          msg = "Firebase API key invalid. Check .env.local and restart dev server";
        } else if (
          code === "auth/invalid-credential" ||
          code === "auth/wrong-password" ||
          code === "auth/user-not-found"
        ) {
          msg = "Wrong email or password";
        } else {
          msg = code.replace("auth/", "").replace(/-/g, " ");
        }
      }
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const onGoogle = async () => {
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
      toast.success("Welcome back!");
      router.push(next);
    } catch (err: unknown) {
      let msg = "Google sign-in failed";
      if (err && typeof err === "object" && "code" in err) {
        const code = String((err as { code: string }).code);
        if (code.includes("popup-closed")) msg = "Popup closed — try again";
        else msg = code.replace("auth/", "").replace(/-/g, " ");
      }
      toast.error(msg);
    } finally {
      setGoogleLoading(false);
    }
  };

  const formCard = (
    <div className="w-full max-w-md animate-fade-up">
      <div className="mb-8 text-center lg:text-left">
        <Logo className="justify-center lg:justify-start" size="lg" />
        <h1 className="mt-5 font-display text-3xl font-semibold tracking-tight text-white">
          Welcome back
        </h1>
        <p className="mt-2 text-sm text-white/70">Sign in to order from Sweet Mandy</p>
      </div>

      <div className="space-y-4 rounded-3xl border border-white/10 bg-[#1a0c0e]/85 p-6 shadow-soft backdrop-blur-xl">
        <Button
          type="button"
          variant="outline"
          className="h-11 w-full rounded-full border-white/15 bg-white/5 text-white hover:bg-white/10"
          disabled={googleLoading || loading}
          onClick={onGoogle}
        >
          {googleLoading ? "Opening Google…" : "Continue with Google"}
        </Button>

        <div className="flex items-center gap-3 text-xs text-white/50">
          <span className="h-px flex-1 bg-white/10" />
          or email
          <span className="h-px flex-1 bg-white/10" />
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-white/90">Email</label>
            <Input
              className="mt-1.5 h-11 rounded-xl border-white/10 bg-white/5 text-white placeholder:text-white/40"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              autoComplete="email"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-white/90">Password</label>
            <Input
              className="mt-1.5 h-11 rounded-xl border-white/10 bg-white/5 text-white placeholder:text-white/40"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>
          <Button type="submit" className="h-11 w-full rounded-full shadow-glow" disabled={loading}>
            {loading ? "Signing in…" : "Sign in with email"}
          </Button>
        </form>
      </div>

      <p className="mt-6 text-center text-sm text-white/60 lg:text-left">
        New here?{" "}
        <Link href="/signup" className="font-semibold text-primary hover:underline">
          Create account with Google
        </Link>
      </p>
    </div>
  );

  return (
    <div className="relative min-h-[100dvh] w-full lg:grid lg:min-h-[100dvh] lg:grid-cols-2">
      {/* Desktop: left image panel */}
      <div className="relative hidden lg:block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={LOGIN_HERO}
          alt="Sweet Mandy Food & Bakery"
          className="absolute inset-0 size-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0a0406]/40" />
      </div>

      {/* Mobile background image + form side */}
      <div className="relative flex min-h-[100dvh] items-end justify-center px-4 pb-10 pt-24 sm:items-center sm:py-12 lg:items-center lg:bg-background lg:px-10">
        {/* Mobile only: full-bleed background */}
        <div className="absolute inset-0 lg:hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={LOGIN_HERO}
            alt=""
            className="size-full object-cover object-top"
          />
          {/* Dim lower half into wine/dark site colour */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0406] via-[#0a0406]/92 to-[#0a0406]/35" />
        </div>

        <div className="relative z-10 w-full flex justify-center lg:justify-start">
          {formCard}
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-16 text-center text-muted-foreground">Loading…</div>}>
      <LoginForm />
    </Suspense>
  );
}