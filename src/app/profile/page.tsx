"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export default function ProfilePage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  if (loading) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center text-muted-foreground animate-pulse-soft">
        Loading…
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center animate-fade-up">
        <h1 className="font-display text-2xl font-semibold">Account</h1>
        <p className="mt-2 text-sm text-muted-foreground">Sign in to view your profile and orders</p>
        <Button asChild className="mt-6 rounded-full shadow-glow">
          <Link href="/login">Sign in</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-10 animate-fade-up">
      <div className="rounded-3xl glass p-6 shadow-soft">
        <div className="flex size-14 items-center justify-center rounded-full bg-primary/20 font-display text-2xl font-semibold text-primary">
          {(user.displayName || user.email || "U").charAt(0).toUpperCase()}
        </div>
        <h1 className="mt-4 font-display text-2xl font-semibold tracking-tight">
          {user.displayName || "Customer"}
        </h1>
        <p className="text-sm text-muted-foreground">{user.email}</p>
        {user.phone && <p className="text-sm text-muted-foreground">{user.phone}</p>}
        <p className="mt-1 text-xs capitalize text-primary">{user.role}</p>
      </div>

      <div className="mt-4 space-y-2">
        <Button asChild variant="outline" className="h-12 w-full justify-start rounded-2xl border-white/10 bg-white/5">
          <Link href="/account/orders">My orders</Link>
        </Button>
        <Button asChild variant="outline" className="h-12 w-full justify-start rounded-2xl border-white/10 bg-white/5">
          <Link href="/menu">Browse menu</Link>
        </Button>
        <Button
          variant="outline"
          className="h-12 w-full justify-start rounded-2xl border-white/10 bg-white/5 text-destructive"
          onClick={async () => {
            await signOut();
            toast.success("Signed out");
            router.push("/");
          }}
        >
          Sign out
        </Button>
      </div>
    </div>
  );
}
