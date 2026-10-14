"use client";

import Link from "next/link";
import { useOrders } from "@/hooks/useCatalogue";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { formatNaira, formatDate, formatTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import { adminConfirmPayment, adminRejectPayment } from "@/services/api";
import { toast } from "sonner";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/hooks/useCatalogue";

const statusColor: Record<string, string> = {
  placed: "bg-accent text-accent-foreground",
  confirmed: "bg-secondary",
  preparing: "bg-warning/20",
  ready: "bg-primary/15 text-primary",
  out_for_delivery: "bg-primary/15 text-primary",
  delivered: "bg-success/20 text-success",
  collected: "bg-success/20 text-success",
  cancelled: "bg-destructive/20 text-destructive",
};

const payColor: Record<string, string> = {
  not_required: "bg-muted text-muted-foreground",
  pending: "bg-warning/20 text-warning",
  awaiting_confirmation: "bg-primary/20 text-primary",
  confirmed: "bg-success/20 text-success",
  rejected: "bg-destructive/20 text-destructive",
};

export default function AdminOrdersPage() {
  const orders = useOrders();
  const qc = useQueryClient();
  const [busy, setBusy] = useState<string | null>(null);

  const refresh = () => qc.invalidateQueries({ queryKey: queryKeys.orders });

  const confirm = async (id: string) => {
    setBusy(id);
    try {
      await adminConfirmPayment(id);
      toast.success("Payment confirmed — order can be prepared");
      refresh();
    } catch {
      toast.error("Failed to confirm");
    } finally {
      setBusy(null);
    }
  };

  const reject = async (id: string) => {
    setBusy(id);
    try {
      await adminRejectPayment(id);
      toast.success("Payment rejected");
      refresh();
    } catch {
      toast.error("Failed to reject");
    } finally {
      setBusy(null);
    }
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold">Orders</h1>
      <p className="text-sm text-muted-foreground">
        New orders and payment proofs appear here. Confirm transfer before preparing delivery orders.
      </p>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-border">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-border bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Payment</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Proof</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {orders.isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={8} className="p-4">
                      <Skeleton className="h-6 w-full" />
                    </td>
                  </tr>
                ))
              : (orders.data ?? []).map((o) => (
                  <tr key={o.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <p className="font-medium text-primary">{o.orderNumber}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {formatDate(o.createdAt)} {formatTime(o.createdAt)}
                      </p>
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
                          payColor[o.paymentState] ?? "bg-muted",
                        )}
                      >
                        {o.paymentState.replace(/_/g, " ")}
                      </span>
                    </td>
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
                    <td className="px-4 py-3">
                      {o.paymentProofUrl ? (
                        <a
                          href={o.paymentProofUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs font-medium text-primary hover:underline"
                        >
                          View
                        </a>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {o.orderType === "delivery" &&
                        o.paymentState !== "confirmed" &&
                        o.paymentState !== "not_required" && (
                          <div className="flex flex-col gap-1">
                            <Button
                              size="sm"
                              className="h-8 rounded-full text-xs"
                              disabled={busy === o.id}
                              onClick={() => confirm(o.id)}
                            >
                              Confirm pay
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 rounded-full text-xs"
                              disabled={busy === o.id}
                              onClick={() => reject(o.id)}
                            >
                              Reject
                            </Button>
                          </div>
                        )}
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
