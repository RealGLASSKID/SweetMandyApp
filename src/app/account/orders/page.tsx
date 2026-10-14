"use client";
import { RequireAuth } from "@/components/auth/RequireAuth";
import Link from "next/link";
import { Receipt } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useOrders } from "@/hooks/useCatalogue";
import { formatNaira, formatDate, formatTime } from "@/lib/format";
import { cn } from "@/lib/utils";

const statusColor: Record<string, string> = {
  placed: "bg-accent text-accent-foreground",
  confirmed: "bg-secondary",
  preparing: "bg-warning/20",
  ready: "bg-primary/15 text-primary",
  out_for_delivery: "bg-primary/15 text-primary",
  delivered: "bg-success/20 text-success",
  collected: "bg-success/20 text-success",
  cancelled: "bg-destructive/15 text-destructive",
};

function AccountOrdersInner() {
  const orders = useOrders();

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-extrabold">My orders</h1>
          <p className="text-sm text-muted-foreground">Your Sweet Mandy orders</p>
        </div>
        <Link href="/menu" className="text-sm font-medium text-primary hover:underline">
          Order food
        </Link>
      </div>

      <div className="mt-6 space-y-3">
        {orders.isLoading
          ? Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-2xl" />
            ))
          : orders.data?.map((o) => (
              <Link
                key={o.id}
                href={`/orders/${o.id}`}
                className="block rounded-2xl border border-border bg-card p-4 shadow-soft transition-shadow hover:shadow-lift"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{o.orderNumber}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(o.createdAt)} · {formatTime(o.createdAt)} ·{" "}
                      {o.orderType === "delivery" ? "Delivery" : "Take Away"}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
                      {o.items.map((i) => `${i.quantity}× ${i.name}`).join(", ")}
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-0.5 text-[11px] font-bold capitalize",
                        statusColor[o.status] ?? "bg-muted",
                      )}
                    >
                      {o.status.replace(/_/g, " ")}
                    </span>
                    <p className="mt-2 font-bold text-primary">{formatNaira(o.total)}</p>
                  </div>
                </div>
              </Link>
            ))}

        {!orders.isLoading && orders.data?.length === 0 && (
          <div className="py-16 text-center">
            <Receipt className="mx-auto size-10 text-muted-foreground" />
            <p className="mt-3 text-muted-foreground">No orders yet.</p>
            <Link href="/menu" className="mt-2 inline-block text-primary">
              Order something
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}


export default function AccountOrdersPage() {
  return (
    <RequireAuth soft>
      <AccountOrdersInner />
    </RequireAuth>
  );
}
