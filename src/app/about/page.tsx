import { BUSINESS } from "@/types";
import { MapPin, Phone, Clock, Bike } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-display text-3xl font-bold">About Sweet Mandy</h1>
      <p className="mt-4 text-muted-foreground">
        Sweet Mandy (Sweet Mandy Bakery&apos;s) is a bakery and restaurant in Ijegun, Lagos.
        We serve delicious meals, small chops, fresh bread, ice cream and soft drinks —
        for dine-in, Take Away, or delivery on Lagos Mainland.
      </p>

      <div className="mt-8 space-y-4 rounded-2xl border border-border bg-card p-6">
        <p className="flex items-start gap-3 text-sm">
          <MapPin className="mt-0.5 size-5 shrink-0 text-primary" />
          {BUSINESS.address}
        </p>
        <p className="flex items-center gap-3 text-sm">
          <Phone className="size-5 text-primary" />
          {BUSINESS.phone}
        </p>
        <p className="flex items-center gap-3 text-sm">
          <Clock className="size-5 text-primary" />
          {BUSINESS.hours}
        </p>
        <p className="flex items-center gap-3 text-sm">
          <Bike className="size-5 text-primary" />
          {BUSINESS.deliveryZone}
        </p>
      </div>
    </div>
  );
}
