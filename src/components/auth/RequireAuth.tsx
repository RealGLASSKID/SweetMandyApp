"use client";

import { useEffect, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import type { UserRole } from "@/types";

type Props = {
  children: ReactNode;
  roles?: UserRole[];
  soft?: boolean;
};

export function RequireAuth({ children, roles, soft }: Props) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading || soft) return;
    if (!user) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }
    if (roles && roles.length > 0 && !roles.includes(user.role)) {
      router.replace("/");
    }
  }, [user, loading, roles, router, pathname, soft]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-sm text-muted-foreground">
        Checking access…
      </div>
    );
  }

  if (!user) {
    if (!soft) return null;
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center animate-fade-up">
        <h1 className="font-display text-2xl font-semibold">Sign in required</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Create an account or sign in to continue.
        </p>
        <div className="mt-6 flex justify-center gap-2">
          <Button asChild className="rounded-full shadow-glow">
            <Link href={`/login?next=${encodeURIComponent(pathname)}`}>Sign in</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full border-white/15">
            <Link href="/signup">Create account</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (roles && roles.length > 0 && !roles.includes(user.role)) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <h1 className="font-display text-2xl font-semibold">Access denied</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          You don&apos;t have permission to view this page.
        </p>
        <Button asChild className="mt-6 rounded-full">
          <Link href="/">Go home</Link>
        </Button>
      </div>
    );
  }

  return <>{children}</>;
}
