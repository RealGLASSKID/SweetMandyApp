"use client";

import { MapPin, Phone, Clock, Bike } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BUSINESS } from "@/types";

export default function ContactPage() {
  const tel = BUSINESS.phone.replace(/\s/g, "");

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 animate-fade-up sm:py-14">
      <p className="text-xs font-semibold uppercase tracking-widest text-primary">Get in touch</p>
      <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
        Contact Sweet Mandy
      </h1>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
        Questions about orders, Take Away, or Mainland delivery? Call us or visit the shop in Ijegun.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl glass p-5 shadow-soft">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <Phone className="size-5" />
          </div>
          <h2 className="mt-3 font-display text-lg font-semibold">Phone</h2>
          <p className="mt-1 text-sm text-muted-foreground">Call or WhatsApp for orders</p>
          <a href={`tel:${tel}`} className="mt-2 inline-block font-semibold text-primary hover:underline">
            {BUSINESS.phone}
          </a>
        </div>

        <div className="rounded-2xl glass p-5 shadow-soft">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <MapPin className="size-5" />
          </div>
          <h2 className="mt-3 font-display text-lg font-semibold">Location</h2>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{BUSINESS.address}</p>
        </div>

        <div className="rounded-2xl glass p-5 shadow-soft">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <Clock className="size-5" />
          </div>
          <h2 className="mt-3 font-display text-lg font-semibold">Hours</h2>
          <p className="mt-1 text-sm text-muted-foreground">{BUSINESS.hours}</p>
        </div>

        <div className="rounded-2xl glass p-5 shadow-soft">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <Bike className="size-5" />
          </div>
          <h2 className="mt-3 font-display text-lg font-semibold">Delivery</h2>
          <p className="mt-1 text-sm text-muted-foreground">{BUSINESS.deliveryZone}</p>
        </div>
      </div>

      <div className="mt-8 rounded-3xl border border-white/10 glass p-6 shadow-soft">
        <h2 className="font-display text-xl font-semibold">Prefer to message?</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Reach us by phone for the fastest reply. For online orders, use the menu in the app.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Button asChild className="rounded-full shadow-glow">
            <a href={`tel:${tel}`}>
              <Phone className="size-4" /> Call {BUSINESS.phone}
            </a>
          </Button>
          <Button asChild variant="outline" className="rounded-full border-white/15 bg-white/5">
            <a href={`https://wa.me/2348035418887${tel.replace(/^0/, "")}`} target="_blank" rel="noreferrer">
              WhatsApp
            </a>
          </Button>
          <Button asChild variant="outline" className="rounded-full border-white/15 bg-white/5">
            <a href="/menu">Order online</a>
          </Button>
        </div>
      </div>
    </div>
  );
}