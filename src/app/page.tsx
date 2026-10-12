"use client";

import Link from "next/link";
import {
  ArrowRight,
  Bike,
  MapPin,
  Phone,
  Clock,
  Sparkles,
  ShoppingBag,
  Shield,
  Smartphone,
  CreditCard,
  Store,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FoodCard } from "@/components/food/FoodCard";
import { categories, foods, categoryImages } from "@/data/mock";
import { BUSINESS } from "@/types";
import { formatNaira } from "@/lib/format";

const HERO_BG = "/assets/cat-breads-pastries.jpg";

function PhoneMockup() {
  const previewFoods = foods.filter((f) => f.popular).slice(0, 5);

  return (
    <div className="relative mx-auto w-[min(100%,280px)]">
      {/* Phone frame */}
      <div className="relative overflow-hidden rounded-[2.25rem] border-[3px] border-white/20 bg-[#0c0608] shadow-[0_25px_80px_-12px_rgba(0,0,0,0.7)] ring-1 ring-white/10">
        {/* Status bar */}
        <div className="flex items-center justify-between px-5 pt-3 pb-1 text-[10px] text-white/70">
          <span>9:41</span>
          <div className="h-4 w-20 rounded-full bg-black/40" />
          <span className="flex gap-0.5">
            <span className="inline-block size-1.5 rounded-full bg-white/50" />
            <span className="inline-block size-1.5 rounded-full bg-white/50" />
            <span className="inline-block size-1.5 rounded-full bg-white/80" />
          </span>
        </div>

        {/* App header */}
        <div className="flex items-center justify-between border-b border-white/5 px-4 py-2.5">
          <span className="font-display text-sm font-semibold text-white">
            Sweet <span className="text-primary">Mandy</span>
          </span>
          <ShoppingBag className="size-4 text-white/80" />
        </div>

        {/* Hero strip in phone */}
        <div className="relative h-24 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={HERO_BG} alt="" className="size-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0608] via-[#0c0608]/50 to-transparent" />
          <p className="absolute bottom-2 left-3 font-display text-sm font-semibold text-white">
            Order fresh today
          </p>
        </div>

        {/* Menu list */}
        <div className="max-h-[280px] space-y-0 overflow-hidden px-2 pb-3 pt-1">
          <p className="px-2 pb-1.5 text-[10px] font-medium uppercase tracking-wider text-white/40">
            Popular
          </p>
          {previewFoods.map((f) => (
            <div
              key={f.id}
              className="flex items-center gap-2.5 rounded-xl px-2 py-2 transition hover:bg-white/5"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={f.imageUrl}
                alt=""
                className="size-11 shrink-0 rounded-lg object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium text-white">{f.name}</p>
                <p className="text-[10px] text-white/45">{f.categoryName}</p>
              </div>
              <span className="shrink-0 text-[11px] font-semibold text-primary">
                {formatNaira(f.price)}
              </span>
            </div>
          ))}
        </div>

        {/* Bottom CTA in phone */}
        <div className="border-t border-white/5 px-3 py-3">
          <div className="flex items-center justify-center rounded-full bg-primary py-2.5 text-xs font-bold text-primary-foreground shadow-[0_0_24px_-4px_oklch(0.72_0.17_55)]">
            Order Now
          </div>
        </div>
      </div>

      {/* Soft glow behind phone */}
      <div className="pointer-events-none absolute -inset-8 -z-10 rounded-full bg-primary/15 blur-3xl" />
    </div>
  );
}

export default function HomePage() {
  const popular = foods.filter((f) => f.popular);

  return (
    <div>
      {/* ── HERO with background image ── */}
      <section className="relative min-h-[88vh] overflow-hidden sm:min-h-[80vh]">
        {/* Background image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={HERO_BG}
          alt=""
          className="absolute inset-0 size-full object-cover"
        />
        {/* Dark overlays for text readability */}
        <div className="absolute inset-0 bg-[#0a0406]/75" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent" />

        <div className="relative mx-auto flex min-h-[88vh] max-w-6xl flex-col justify-end px-4 pb-14 pt-28 sm:min-h-[80vh] sm:justify-center sm:pb-20 sm:pt-24">
          <div className="max-w-xl animate-fade-up">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/15 px-3 py-1 text-xs font-semibold text-primary backdrop-blur-sm">
              <Sparkles className="size-3.5" /> Bakery · Restaurant · Ijegun, Lagos
            </span>
            <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
              Fresh from our{" "}
              <span className="italic text-primary">oven</span>
              <br />
              to your table
            </h1>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-white/75 sm:text-base">
              Jollof, fried rice, soups &amp; swallow, small chops, bread, ice cream and drinks —
              made daily at Sweet Mandy. Book Take Away or get Mainland delivery.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-full px-8 shadow-glow">
                <Link href="/menu">
                  Order now <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full border-white/25 bg-white/10 px-8 text-white backdrop-blur-sm hover:bg-white/15 hover:text-white"
              >
                <a href={`tel:${BUSINESS.phone.replace(/\s/g, "")}`}>
                  <Phone className="size-4" /> Call us
                </a>
              </Button>
            </div>
            <div className="mt-8 flex flex-wrap gap-5 text-xs text-white/60 sm:text-sm">
              <span className="flex items-center gap-1.5">
                <Clock className="size-3.5 text-primary" /> {BUSINESS.hours}
              </span>
              <span className="flex items-center gap-1.5">
                <Bike className="size-3.5 text-primary" /> Mainland delivery
              </span>
              <span className="flex items-center gap-1.5">
                <Store className="size-3.5 text-primary" /> Take Away
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Mobile app showcase (GloriaFood style) ── */}
      <section className="relative overflow-hidden border-b border-white/5 py-16 sm:py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 lg:grid-cols-2">
          <div className="animate-fade-up order-2 lg:order-1">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              Your own ordering app
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Order on the go —{" "}
              <span className="italic text-primary">like a real app</span>
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
              Sweet Mandy is a Progressive Web App. Customers can install it on their phone,
              browse the full menu, add to cart, and choose Take Away or Mainland delivery —
              without needing the Play Store or App Store.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
              {[
                { icon: Smartphone, t: "Install on Android & iPhone home screen" },
                { icon: ShoppingBag, t: "Full menu, cart & order tracking" },
                { icon: CreditCard, t: "Pay food online with Paystack (delivery)" },
                { icon: Bike, t: "Riders deliver on Lagos Mainland only" },
              ].map(({ icon: Icon, t }) => (
                <li key={t} className="flex items-center gap-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
                    <Icon className="size-4" />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
            <Button asChild className="mt-8 rounded-full px-6 shadow-glow">
              <Link href="/menu">
                Try the menu <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
          <div className="order-1 flex justify-center lg:order-2">
            <PhoneMockup />
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">Menu</p>
            <h2 className="mt-1 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
              What are you craving?
            </h2>
          </div>
          <Link href="/menu" className="text-sm font-medium text-primary hover:underline">
            See all →
          </Link>
        </div>
        <div className="stagger mt-6 grid grid-cols-3 gap-3 sm:grid-cols-6">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/menu?category=${c.slug}`}
              className="group animate-fade-up text-center"
            >
              <div className="overflow-hidden rounded-2xl border border-white/8 shadow-soft transition-transform duration-300 group-hover:scale-[1.04] group-active:scale-[0.98]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={categoryImages[c.slug] || "/assets/cat-meals.jpg"}
                  alt={c.name}
                  loading="lazy"
                  className="aspect-square w-full object-cover transition duration-500 group-hover:brightness-110"
                />
              </div>
              <p className="mt-2 text-xs font-medium sm:text-sm">{c.name}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Popular ── */}
      <section className="mx-auto max-w-6xl px-4 pb-12 sm:pb-16">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">Favourites</p>
            <h2 className="mt-1 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
              Popular today
            </h2>
          </div>
          <Link href="/menu" className="text-sm font-medium text-primary hover:underline">
            Full menu →
          </Link>
        </div>
        <div className="stagger mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          {popular.map((food) => (
            <div key={food.id} className="animate-fade-up">
              <FoodCard food={food} />
            </div>
          ))}
        </div>
      </section>

      {/* ── Why Sweet Mandy ── */}
      <section className="border-y border-white/5 bg-secondary/25 py-14 sm:py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">Why us</p>
            <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
              Built for real customers
            </h2>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Store,
                t: "Take Away",
                d: "Book online, pay at the shop when you collect.",
              },
              {
                icon: Bike,
                t: "Mainland delivery",
                d: "Food paid via Paystack. Delivery fee to the rider on arrival.",
              },
              {
                icon: CreditCard,
                t: "Secure payments",
                d: "Paystack for delivery orders. Safe and familiar in Nigeria.",
              },
              {
                icon: Shield,
                t: "Your own brand",
                d: "Not a third-party portal — order direct from Sweet Mandy.",
              },
            ].map(({ icon: Icon, t, d }) => (
              <div
                key={t}
                className="rounded-2xl glass p-5 transition-transform duration-300 hover:-translate-y-1"
              >
                <span className="flex size-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
                  <Icon className="size-5" />
                </span>
                <h3 className="mt-3 font-display text-lg font-semibold">{t}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:py-16">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">Simple steps</p>
          <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
            How it works
          </h2>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {[
            { n: "01", t: "Browse the menu", d: "Meals, small chops, bread, ice cream and drinks with clear prices." },
            { n: "02", t: "Take Away or Delivery", d: "Collect in store, or Mainland delivery with Paystack for food." },
            { n: "03", t: "Enjoy", d: "Delivery fee paid to the rider on arrival. Take Away pays at the shop." },
          ].map((s) => (
            <div
              key={s.n}
              className="rounded-2xl glass p-6 text-center transition-transform duration-300 hover:-translate-y-1"
            >
              <p className="font-display text-3xl font-semibold text-primary">{s.n}</p>
              <h3 className="mt-3 font-semibold">{s.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Trust strip ── */}
      <section className="border-y border-white/5 bg-secondary/20 py-8">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-8 px-4 text-center sm:gap-14">
          {[
            { v: "Daily", l: "Fresh baking" },
            { v: "Mainland", l: "Delivery zone" },
            { v: "PWA", l: "Install on phone" },
            { v: "Paystack", l: "Secure checkout" },
          ].map((s) => (
            <div key={s.l}>
              <p className="font-display text-xl font-semibold text-primary sm:text-2xl">{s.v}</p>
              <p className="text-xs text-muted-foreground sm:text-sm">{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Visit / contact ── */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:py-16">
        <div className="overflow-hidden rounded-3xl border border-white/8 glass shadow-soft">
          <div className="grid lg:grid-cols-2">
            <div className="p-6 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-widest text-primary">Visit us</p>
              <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight">
                Sweet Mandy Bakery&apos;s
              </h2>
              <div className="mt-5 space-y-3 text-sm text-muted-foreground">
                <p className="flex items-start gap-2.5">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
                  {BUSINESS.address}
                </p>
                <p className="flex items-center gap-2.5">
                  <Phone className="size-4 text-primary" />
                  {BUSINESS.phone}
                </p>
                <p className="flex items-center gap-2.5">
                  <Clock className="size-4 text-primary" />
                  {BUSINESS.hours}
                </p>
                <p className="flex items-center gap-2.5">
                  <Bike className="size-4 text-primary" />
                  {BUSINESS.deliveryZone}
                </p>
              </div>
              <div className="mt-7 flex flex-wrap gap-3">
                <Button asChild className="rounded-full shadow-glow">
                  <Link href="/menu">Order now</Link>
                </Button>
                <Button asChild variant="outline" className="rounded-full border-white/15 bg-white/5">
                  <a href={`tel:${BUSINESS.phone.replace(/\s/g, "")}`}>Call us</a>
                </Button>
              </div>
            </div>
            <div className="relative hidden min-h-[220px] lg:block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/hero.jpg"
                alt="Sweet Mandy"
                className="absolute inset-0 size-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-transparent to-card/40" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
