"use client";

import Link from "next/link";
import { useOrders } from "@/hooks/useCatalogue";
import { formatNaira, formatDate, formatTime } from "@/lib/format";
import { Skeleton } from "@/components/ui/skeleton";
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

export default function AdminOrdersPage() {
  const orders = useOrders();

  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold">Orders</h1>
      <p className="text-sm text-muted-foreground">All Take Away and Delivery orders</p>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead className="border-b border-border bg-muted/50 text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {orders.isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={6} className="p-4">
                      <Skeleton className="h-6 w-full" />
                    </td>
                  </tr>
                ))
              : (orders.data ?? []).map((o) => (
                  <tr key={o.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <Link href={`/orders/${o.id}`} className="font-medium text-primary hover:underline">
                        {o.orderNumber}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium">{o.customerName}</p>
                      <p className="text-xs text-muted-foreground">{o.customerPhone}</p>
                    </td>
                    <td className="px-4 py-3 capitalize">
                      {o.orderType === "delivery" ? "Delivery" : "Take Away"}
                    </td>
                    <td className="px-4 py-3 font-semibold">{formatNaira(o.total)}</td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-0.5 text-[11px] font-bold capitalize",
                          statusColor[o.status] ?? "bg-muted",
                        )}
                      >
                        {o.status.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {formatDate(o.createdAt)} {formatTime(o.createdAt)}
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
        {!orders.isLoading && (orders.data?.length ?? 0) === 0 && (
          <p className="py-12 text-center text-muted-foreground">No orders yet</p>
        )}
      </div>
    </div>
  );
}
