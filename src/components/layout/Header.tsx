"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ShoppingBag, X, User } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { Logo } from "@/components/brand/Logo";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/menu", label: "Menu" },
  { href: "/help", label: "Help" },
] as const;

export function Header() {
  const { itemCount } = useCart();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (pathname.startsWith("/admin") || pathname.startsWith("/rider")) return null;

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");
  const isHome = pathname === "/";

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled || !isHome || open
          ? "glass-strong shadow-soft"
          : "bg-transparent border-transparent",
      )}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4 sm:h-16">
        <Link href="/" className="shrink-0 transition-opacity hover:opacity-90" onClick={() => setOpen(false)}>
          <Logo size="md" />
        </Link>

        <nav className="ml-4 hidden items-center gap-0.5 md:flex">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition-all duration-200",
                isActive(l.href)
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:bg-white/8 hover:text-foreground",
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          <Link
            href="/cart"
            className="relative flex size-10 items-center justify-center rounded-full transition-all hover:bg-white/8 active:scale-95"
            aria-label="Cart"
          >
            <ShoppingBag className="size-5" />
            {itemCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex size-4.5 min-w-4.5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground shadow-glow animate-scale-in">
                {itemCount > 9 ? "9+" : itemCount}
              </span>
            )}
          </Link>

          <Link
            href={user ? "/profile" : "/login"}
            className="hidden size-10 items-center justify-center rounded-full transition-all hover:bg-white/8 sm:flex"
            aria-label="Account"
          >
            <User className="size-5" />
          </Link>

          {!user && (
            <Button asChild size="sm" className="hidden rounded-full px-4 shadow-glow sm:inline-flex">
              <Link href="/login">Sign in</Link>
            </Button>
          )}

          <button
            type="button"
            className="flex size-10 items-center justify-center rounded-full transition-all hover:bg-white/8 md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      <div
        className={cn(
          "overflow-hidden border-t border-white/5 transition-all duration-300 ease-out md:hidden",
          open ? "max-h-72 opacity-100" : "max-h-0 opacity-0 border-transparent",
        )}
      >
        <nav className="flex flex-col gap-1 px-4 py-3">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={cn(
                "rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                isActive(l.href) ? "bg-primary/15 text-primary" : "text-foreground/90 hover:bg-white/5",
              )}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href={user ? "/profile" : "/login"}
            onClick={() => setOpen(false)}
            className="rounded-xl px-4 py-3 text-sm font-medium text-foreground/90 hover:bg-white/5"
          >
            {user ? "My account" : "Sign in"}
          </Link>
        </nav>
      </div>
    </header>
  );
}
