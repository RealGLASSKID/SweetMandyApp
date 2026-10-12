import Link from "next/link";
import { BUSINESS } from "@/types";

const faqs = [
  {
    q: "Where do you deliver?",
    a: "Lagos Mainland only for now (Ijegun, Ikotun, Egbe, Ikeja, Agege, Mushin, Surulere, Yaba and other Mainland areas). Island delivery is coming later.",
  },
  {
    q: "How does Take Away work?",
    a: "Browse the menu, add items to cart, choose Take Away, and collect at the restaurant. You pay when you pick up your order.",
  },
  {
    q: "How does Delivery work?",
    a: "Sign in, place your order, and pay for the food online with Paystack. The delivery fee is paid in cash to the rider when your order arrives.",
  },
  {
    q: "What payment methods do you accept?",
    a: "Delivery: Paystack (card, bank transfer, USSD). Take Away: pay at the counter when you collect.",
  },
  {
    q: "What are your opening hours?",
    a: BUSINESS.hours,
  },
];

export default function HelpPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="font-display text-3xl font-bold">Help</h1>
      <p className="mt-2 text-muted-foreground">Quick answers for Sweet Mandy customers</p>

      <div className="mt-8 space-y-4">
        {faqs.map((f) => (
          <div key={f.q} className="rounded-2xl border border-border bg-card p-5">
            <h2 className="font-semibold">{f.q}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{f.a}</p>
          </div>
        ))}
      </div>

      <p className="mt-10 text-sm text-muted-foreground">
        Still need help?{" "}
        <Link href="/login" className="text-primary">
          Sign in
        </Link>{" "}
        or call {BUSINESS.phone}.
      </p>
    </div>
  );
}
