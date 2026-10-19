"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingBag, UtensilsCrossed, User, type LucideIcon } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
};

export function BottomNav() {
  const { itemCount } = useCart();
  const { user } = useAuth();
  const pathname = usePathname();

  if (
    pathname === "/welcome" ||
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/rider")
  ) {
    return null;
  }

  const items: NavItem[] = [
    { href: "/", label: "Home", icon: Home, exact: true },
    { href: "/menu", label: "Menu", icon: UtensilsCrossed },
    { href: "/cart", label: "Cart", icon: ShoppingBag },
    { href: user ? "/profile" : "/login", label: "Account", icon: User },
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 px-3 pb-[max(0.5rem,env(safe-area-inset-bottom))] md:hidden">
      <ul className="mx-auto flex max-w-md items-stretch justify-between gap-1 rounded-2xl glass-strong px-1 py-1.5 shadow-soft">
        {items.map(({ href, label, icon: Icon, exact }) => {
          const active = exact
            ? pathname === href
            : pathname === href || pathname.startsWith(href + "/");
          return (
            <li key={href + label} className="flex-1">
              <Link
                href={href}
                className={cn(
                  "relative flex flex-col items-center gap-0.5 rounded-xl py-2 text-[10px] font-medium transition-all duration-200 active:scale-95",
                  active
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className={cn("size-5 transition-transform", active && "scale-110")} strokeWidth={active ? 2.25 : 1.75} />
                {label}
                {href === "/cart" && itemCount > 0 && (
                  <span className="absolute right-[18%] top-1 flex size-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
                    {itemCount > 9 ? "9+" : itemCount}
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
