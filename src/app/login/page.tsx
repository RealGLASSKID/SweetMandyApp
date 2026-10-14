"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/brand/Logo";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/menu";
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

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
        if (code.includes("api-key-not-valid") || code === "auth/api-key-not-valid") {
          msg =
            "Firebase API key invalid. Check NEXT_PUBLIC_FIREBASE_API_KEY in .env.local and restart npm run dev";
        } else if (
          code === "auth/invalid-credential" ||
          code === "auth/wrong-password" ||
          code === "auth/user-not-found"
        ) {
          msg = "Wrong email or password";
        } else if (code === "auth/too-many-requests") {
          msg = "Too many attempts. Try again later";
        } else {
          msg = code.replace("auth/", "").replace(/-/g, " ");
        }
      }
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[75vh] max-w-md flex-col justify-center px-4 py-12 animate-fade-up">
      <div className="mb-8 text-center">
        <Logo className="justify-center" size="lg" />
        <h1 className="mt-5 font-display text-3xl font-semibold tracking-tight">Welcome back</h1>
        <p className="mt-2 text-sm text-muted-foreground">Sign in to order from Sweet Mandy</p>
      </div>
      <form onSubmit={onSubmit} className="space-y-4 rounded-3xl glass p-6 shadow-soft animate-scale-in">
        <div>
          <label className="text-sm font-medium">Email</label>
          <Input
            className="mt-1.5 h-11 rounded-xl bg-white/5 border-white/10"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            autoComplete="email"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Password</label>
          <Input
            className="mt-1.5 h-11 rounded-xl bg-white/5 border-white/10"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
          />
        </div>
        <Button type="submit" className="h-11 w-full rounded-full shadow-glow" disabled={loading}>
          {loading ? "Signing in…" : "Sign in"}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        New here?{" "}
        <Link href="/signup" className="font-semibold text-primary hover:underline">
          Create account
        </Link>
      </p>
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