"use client";

import Link from "next/link";
import { ArrowRight, Bike, MapPin, Phone, Clock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FoodCard } from "@/components/food/FoodCard";
import { categories, foods, categoryImages, HERO_IMAGE } from "@/data/mock";
import { BUSINESS } from "@/types";

export default function HomePage() {
  const popular = foods.filter((f) => f.popular);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-background pointer-events-none" />
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-10 sm:py-14 lg:grid-cols-2 lg:py-16">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <Sparkles className="size-3.5" /> Bakery · Restaurant · Ijegun
            </span>
            <h1 className="mt-4 font-display text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
              Fresh from our{" "}
              <span className="italic text-primary">oven</span>
              <br />
              to your table
            </h1>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
              Jollof, fried rice, soups &amp; swallow, small chops, bread, ice cream and drinks —
              made daily at Sweet Mandy. Take Away or Mainland delivery.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-full px-7 shadow-glow">
                <Link href="/menu">
                  Order now <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full border-white/15 bg-white/5 px-7 hover:bg-white/10">
                <a href={`tel:${BUSINESS.phone.replace(/\s/g, "")}`}>Call us</a>
              </Button>
            </div>
            <div className="mt-6 flex flex-wrap gap-4 text-xs text-muted-foreground sm:text-sm">
              <span className="flex items-center gap-1.5">
                <Clock className="size-3.5 text-primary" /> {BUSINESS.hours}
              </span>
              <span className="flex items-center gap-1.5">
                <Bike className="size-3.5 text-primary" /> Mainland delivery
              </span>
            </div>
          </div>
          <div className="relative animate-scale-in overflow-hidden rounded-[1.75rem] shadow-glow">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={HERO_IMAGE}
              alt="Sweet Mandy bakery"
              className="aspect-[4/3] w-full object-cover"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-6xl px-4 pb-6">
        <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
          What are you craving?
        </h2>
        <div className="stagger mt-5 grid grid-cols-3 gap-3 sm:grid-cols-6">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/menu?category=${c.slug}`}
              className="group animate-fade-up text-center"
            >
              <div className="overflow-hidden rounded-2xl border border-white/5 shadow-soft transition-transform duration-300 group-hover:scale-[1.04] group-active:scale-[0.98]">
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

      {/* Popular */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex items-end justify-between gap-3">
          <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
            Popular today
          </h2>
          <Link href="/menu" className="text-sm font-medium text-primary hover:underline">
            Full menu →
          </Link>
        </div>
        <div className="stagger mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
          {popular.map((food) => (
            <div key={food.id} className="animate-fade-up">
              <FoodCard food={food} />
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="border-y border-white/5 bg-secondary/30 py-12">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center font-display text-2xl font-semibold tracking-tight sm:text-3xl">
            How it works
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              { n: "01", t: "Browse the menu", d: "Meals, small chops, bread, ice cream and drinks." },
              { n: "02", t: "Take Away or Delivery", d: "Collect in store, or Mainland delivery. Food paid via Paystack." },
              { n: "03", t: "Enjoy", d: "Delivery fee to the rider on arrival. Take Away pays at the shop." },
            ].map((s) => (
              <div
                key={s.n}
                className="rounded-2xl glass p-5 text-center transition-transform duration-300 hover:-translate-y-1"
              >
                <p className="font-display text-2xl font-semibold text-primary">{s.n}</p>
                <h3 className="mt-2 font-semibold">{s.t}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Visit */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="rounded-3xl glass p-6 shadow-soft sm:p-8">
          <h2 className="font-display text-xl font-semibold tracking-tight sm:text-2xl">Visit us</h2>
          <div className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            <p className="flex items-start gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0 text-primary" /> {BUSINESS.address}
            </p>
            <p className="flex items-center gap-2">
              <Phone className="size-4 text-primary" /> {BUSINESS.phone}
            </p>
            <p className="flex items-center gap-2">
              <Clock className="size-4 text-primary" /> {BUSINESS.hours}
            </p>
            <p className="flex items-center gap-2">
              <Bike className="size-4 text-primary" /> {BUSINESS.deliveryZone}
            </p>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild className="rounded-full shadow-glow">
              <Link href="/menu">Order now</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full border-white/15 bg-white/5">
              <a href={`tel:${BUSINESS.phone.replace(/\s/g, "")}`}>Call us</a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
