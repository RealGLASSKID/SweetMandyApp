"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/brand/Logo";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export default function SignupPage() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      await signUp({
        email: email.trim(),
        password,
        fullName: fullName.trim(),
        phone: phone.trim(),
      });
      toast.success("Account created — welcome to Sweet Mandy!");
      router.push("/menu");
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "code" in err
          ? String((err as { code: string }).code).replace("auth/", "").replace(/-/g, " ")
          : "Could not create account";
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
        <p className="mt-2 text-sm text-muted-foreground">Join Sweet Mandy for Take Away & Delivery</p>
      </div>
      <form onSubmit={onSubmit} className="space-y-4 rounded-3xl glass p-6 shadow-soft animate-scale-in">
        <div>
          <label className="text-sm font-medium">Full name</label>
          <Input
            className="mt-1.5 h-11 rounded-xl bg-white/5 border-white/10"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Your name"
            autoComplete="name"
          />
        </div>
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
          <label className="text-sm font-medium">Phone</label>
          <Input
            className="mt-1.5 h-11 rounded-xl bg-white/5 border-white/10"
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="0803 000 0000"
            autoComplete="tel"
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
            placeholder="At least 6 characters"
            autoComplete="new-password"
          />
        </div>
        <Button type="submit" className="h-11 w-full rounded-full shadow-glow" disabled={loading}>
          {loading ? "Creating…" : "Create account"}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
