"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useOrder } from "@/hooks/useCatalogue";
import { formatNaira, formatDate, formatTime } from "@/lib/format";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = use(params);
  const { data: order, isLoading } = useOrder(orderId);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-lg px-4 py-8">
        <Skeleton className="h-40 w-full rounded-2xl" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-16 text-center">
        <p className="text-muted-foreground">Order not found.</p>
        <Link href="/account/orders" className="mt-2 inline-block text-primary">
          My orders
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <Link
        href="/account/orders"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> My orders
      </Link>

      <div className="mt-4 rounded-2xl border border-border bg-card p-5 shadow-soft">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-display text-xl font-bold">{order.orderNumber}</h1>
            <p className="text-sm text-muted-foreground">
              {formatDate(order.createdAt)} · {formatTime(order.createdAt)}
            </p>
          </div>
          <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold capitalize text-primary">
            {order.status.replace(/_/g, " ")}
          </span>
        </div>

        <p className="mt-3 text-sm">
          <span className="text-muted-foreground">Type:</span>{" "}
          {order.orderType === "delivery" ? "Delivery" : "Take Away"}
        </p>
        {order.deliveryAddress && (
          <p className="mt-1 text-sm">
            <span className="text-muted-foreground">Address:</span> {order.deliveryAddress}
          </p>
        )}
        {order.riderName && (
          <p className="mt-1 text-sm">
            <span className="text-muted-foreground">Rider:</span> {order.riderName}
          </p>
        )}

        <ul className="mt-4 space-y-2 border-t border-border pt-4">
          {order.items.map((item, idx) => (
            <li key={idx} className="flex justify-between text-sm">
              <span>
                {item.quantity}× {item.name}
              </span>
              <span className="font-medium">{formatNaira(item.unitPrice * item.quantity)}</span>
            </li>
          ))}
        </ul>

        <div className="mt-4 space-y-1 border-t border-border pt-4 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Food total</span>
            <span className="font-semibold">{formatNaira(order.total)}</span>
          </div>
          {order.orderType === "delivery" && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Delivery fee (cash to rider)</span>
              <span className="font-semibold">{formatNaira(order.deliveryFee)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Status timeline */}
      <div className="mt-6">
        <h2 className="font-semibold">Status</h2>
        <ol className="mt-3 space-y-3">
          {order.statusHistory.map((ev, i) => (
            <li key={i} className="flex gap-3">
              <span
                className={cn(
                  "mt-1 size-2.5 shrink-0 rounded-full",
                  ev.timestamp ? "bg-primary" : "bg-muted",
                )}
              />
              <div>
                <p className="text-sm font-medium">{ev.label}</p>
                {ev.timestamp && (
                  <p className="text-xs text-muted-foreground">
                    {formatDate(ev.timestamp)} {formatTime(ev.timestamp)}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
