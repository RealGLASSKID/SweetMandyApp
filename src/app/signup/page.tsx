"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brand/Logo";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export default function SignupPage() {
  const router = useRouter();
  const { signInWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);

  const onGoogle = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      toast.success("Welcome to Sweet Mandy!");
      router.push("/menu");
    } catch (err: unknown) {
      let msg = "Google sign-in failed";
      if (err && typeof err === "object" && "code" in err) {
        const code = String((err as { code: string }).code);
        if (code.includes("popup-closed")) msg = "Popup closed — try again";
        else if (code.includes("api-key")) msg = "Invalid Firebase API key — check .env.local";
        else msg = code.replace("auth/", "").replace(/-/g, " ");
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
        <h1 className="mt-5 font-display text-3xl font-semibold tracking-tight">Create account</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Sign up with Google only — fast and secure
        </p>
      </div>

      <div className="rounded-3xl glass p-6 shadow-soft animate-scale-in">
        <Button
          type="button"
          className="h-12 w-full rounded-full shadow-glow"
          disabled={loading}
          onClick={onGoogle}
        >
          {loading ? "Opening Google…" : "Continue with Google"}
        </Button>
        <p className="mt-4 text-center text-xs text-muted-foreground">
          We use your Google name and photo on your Sweet Mandy profile.
        </p>
      </div>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}