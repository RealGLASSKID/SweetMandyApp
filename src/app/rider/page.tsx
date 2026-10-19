"use client";

import { useCallback, useEffect, useState } from "react";
import { Bike, MapPin, Phone, Package, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { useAuth } from "@/context/AuthContext";
import { fetchOrders, updateOrderStatus } from "@/services/api";
import type { Order } from "@/types";
import { formatNaira } from "@/lib/format";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

function RiderInner() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const all = await fetchOrders();
      const list = Array.isArray(all) ? all : [];
      setOrders(
        list.filter(
          (o) =>
            o.orderType === "delivery" &&
            (o.paymentState === "confirmed" || o.paymentState === "not_required") &&
            !["delivered", "cancelled", "collected"].includes(o.status),
        ),
      );
    } catch (e) {
      console.error(e);
      toast.error("Could not load orders");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const markDelivered = async (id: string) => {
    try {
      await updateOrderStatus(id, "delivered", "Delivered");
      toast.success("Marked delivered");
      load();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed");
    }
  };

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <div className="flex items-center gap-3">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/15 text-primary">
          <Bike className="size-6" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-semibold">Rider</h1>
          <p className="text-sm text-muted-foreground">{user?.displayName || user?.email}</p>
        </div>
      </div>

      <p className="mt-4 text-sm text-muted-foreground">
        Mainland deliveries with confirmed payment. Call the customer if needed.
      </p>

      {loading && <p className="mt-8 text-center text-sm text-muted-foreground">Loading…</p>}

      <div className="mt-6 space-y-3">
        {orders.map((order) => (
          <article key={order.id} className="rounded-2xl border border-border bg-card p-4 shadow-soft">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-semibold">{order.orderNumber}</p>
                <p className="text-sm">{order.customerName}</p>
              </div>
              <span className={cn("rounded-full bg-primary/15 px-2.5 py-0.5 text-[11px] font-bold capitalize text-primary")}>
                {order.status.replace(/_/g, " ")}
              </span>
            </div>
            <div className="mt-3 space-y-1.5 text-sm text-muted-foreground">
              <p className="flex items-center gap-2">
                <Phone className="size-3.5 text-primary" />
                <a href={`tel:${order.customerPhone}`} className="text-foreground hover:underline">
                  {order.customerPhone}
                </a>
              </p>
              <p className="flex items-start gap-2">
                <MapPin className="mt-0.5 size-3.5 shrink-0 text-primary" />
                {order.deliveryAddress || "—"} {order.deliveryArea ? `(${order.deliveryArea})` : ""}
              </p>
              <p className="flex items-center gap-2">
                <Package className="size-3.5 text-primary" />
                {(order.items || []).map((i) => `${i.quantity}× ${i.name}`).join(", ") || "Items"}
              </p>
              <p className="text-xs">
                Food {formatNaira(order.total ?? order.subtotal ?? 0)} paid · Collect delivery fee in cash
              </p>
            </div>
            <Button className="mt-4 w-full rounded-full" onClick={() => markDelivered(order.id)}>
              <CheckCircle2 className="size-4" /> Mark delivered
            </Button>
          </article>
        ))}
        {!loading && orders.length === 0 && (
          <p className="py-12 text-center text-sm text-muted-foreground">No active deliveries</p>
        )}
      </div>
    </div>
  );
}

export default function RiderPage() {
  return (
    <RequireAuth roles={["rider", "admin"]}>
      <RiderInner />
    </RequireAuth>
  );
}