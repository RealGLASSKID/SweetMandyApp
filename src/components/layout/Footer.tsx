import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { BUSINESS } from "@/types";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-white/5 bg-secondary/20">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo size="sm" />
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {BUSINESS.tagline}. Take Away or Delivery on Lagos Mainland.
          </p>
        </div>
        <div>
          <h3 className="font-display text-sm font-semibold">Order</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link href="/menu" className="transition-colors hover:text-primary">
                Menu
              </Link>
            </li>
            <li>
              <Link href="/cart" className="transition-colors hover:text-primary">
                Cart
              </Link>
            </li>
            <li>
              <Link href="/account/orders" className="transition-colors hover:text-primary">
                My orders
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="font-display text-sm font-semibold">Company</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link href="/about" className="transition-colors hover:text-primary">
                About
              </Link>
            </li>
            <li>
              <Link href="/help" className="transition-colors hover:text-primary">
                Help
              </Link>
            </li>
            <li>
              <Link href="/contact" className="transition-colors hover:text-primary">
                Contact
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="font-display text-sm font-semibold">Contact</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link href="/contact" className="transition-colors hover:text-primary">
                {BUSINESS.phone}
              </Link>
            </li>
            <li className="leading-snug">{BUSINESS.address}</li>
            <li>{BUSINESS.hours}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/5 py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Sweet Mandy Food &amp; Bakery · Ijegun, Lagos
      </div>
    </footer>
  );
}