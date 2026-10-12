"use client";

import { useState } from "react";
import { Bike, MapPin, Phone, Package, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { mockOrders, mockRiders } from "@/data/mock";
import { cn } from "@/lib/utils";

export default function RiderDashboard() {
  const rider = mockRiders[1]; // demo busy rider
  const [orders, setOrders] = useState(mockOrders.filter((o) => o.orderType === "delivery"));

  const markDelivered = (id: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === id
          ? {
              ...o,
              status: "delivered" as const,
              statusHistory: [
                ...o.statusHistory,
                { status: "delivered" as const, label: "Delivered", timestamp: new Date().toISOString() },
              ],
            }
          : o
      )
    );
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="flex items-center gap-3">
        <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Bike className="size-6" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold">Rider Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            {rider.fullName} · {rider.status} · {rider.deliveriesToday} deliveries today
          </p>
        </div>
      </div>

      <div className="mt-8 space-y-4">
        <h2 className="font-semibold">Active & recent orders</h2>
        {orders.length === 0 && (
          <p className="rounded-2xl border border-dashed border-border p-8 text-center text-muted-foreground">
            No delivery orders right now.
          </p>
        )}
        {orders.map((order) => (
          <div
            key={order.id}
            className={cn(
              "rounded-2xl border border-border bg-card p-5 shadow-soft",
              order.status === "delivered" && "opacity-60"
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold">{order.orderNumber}</p>
                <p className="text-sm text-muted-foreground">{order.customerName}</p>
              </div>
              <span
                className={cn(
                  "rounded-full px-2.5 py-0.5 text-xs font-medium",
                  order.status === "out_for_delivery"
                    ? "bg-warning/20 text-warning-foreground"
                    : order.status === "delivered"
                    ? "bg-success/20 text-success"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {order.status.replace(/_/g, " ")}
              </span>
            </div>

            <div className="mt-4 space-y-2 text-sm">
              <p className="flex items-center gap-2">
                <Phone className="size-4 text-primary" />
                <a href={`tel:${order.customerPhone}`} className="font-medium text-primary hover:underline">
                  {order.customerPhone}
                </a>
              </p>
              <p className="flex items-start gap-2">
                <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
                <span>{order.deliveryAddress}</span>
              </p>
              <p className="flex items-center gap-2">
                <Package className="size-4 text-primary" />
                {order.items.map((i) => `${i.quantity}× ${i.name}`).join(", ")}
              </p>
              <p className="text-muted-foreground">
                Food paid (Paystack) · Delivery fee ₦{order.deliveryFee.toLocaleString()} — collect from customer
              </p>
            </div>

            {order.status === "out_for_delivery" && (
              <Button className="mt-4 w-full" onClick={() => markDelivered(order.id)}>
                <CheckCircle2 className="size-4" /> Mark as delivered
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
