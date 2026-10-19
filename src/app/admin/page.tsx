"use client";

import { ShoppingBag, Banknote, TrendingUp, Clock, UtensilsCrossed } from "lucide-react";
import { useOrders, useFoods } from "@/hooks/useCatalogue";
import { formatNaira } from "@/lib/format";
import Link from "next/link";

export default function AdminOverviewPage() {
  const orders = useOrders();
  const foods = useFoods();

  const orderList = orders.data ?? [];
  const revenue = orderList.reduce((s, o) => s + (o.total ?? 0), 0);
  const pending = orderList.filter(
    (o) => !["delivered", "collected", "cancelled"].includes(o.status),
  ).length;

  const stats = [
    { label: "Total orders", value: orderList.length, icon: ShoppingBag, href: "/admin/orders" },
    { label: "Menu items", value: foods.data?.length ?? 0, icon: UtensilsCrossed, href: "/admin/foods" },
    { label: "Revenue", value: formatNaira(revenue), icon: Banknote, href: "/admin/orders" },
    { label: "Active orders", value: pending, icon: TrendingUp, href: "/admin/orders" },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-extrabold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Sweet Mandy operations overview</p>
        </div>
        <span className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          <Clock className="size-3.5" /> {pending} active orders
        </span>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, href }) => (
          <Link
            key={label}
            href={href}
            className="rounded-2xl border border-border bg-card p-5 shadow-soft transition-shadow hover:shadow-lift"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{label}</p>
              <span className="rounded-lg bg-primary/10 p-2 text-primary">
                <Icon className="size-4" />
              </span>
            </div>
            <p className="mt-3 font-display text-2xl font-extrabold">{value}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8">
        <section className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold">Recent orders</h2>
            <Link href="/admin/orders" className="text-sm text-primary">
              View all
            </Link>
          </div>
          <ul className="mt-4 space-y-3">
            {orderList.slice(0, 5).map((o) => (
              <li
                key={o.id}
                className="flex items-center justify-between rounded-xl border border-border px-3 py-2.5"
              >
                <div>
                  <p className="font-medium">{o.orderNumber}</p>
                  <p className="text-xs text-muted-foreground">
                    {o.customerName} · {o.orderType === "delivery" ? "Delivery" : "Take Away"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-primary">{formatNaira(o.total)}</p>
                  <p className="text-xs capitalize text-muted-foreground">
                    {o.status.replace(/_/g, " ")}
                  </p>
                </div>
              </li>
            ))}
            {orderList.length === 0 && (
              <p className="py-6 text-center text-sm text-muted-foreground">No orders yet</p>
            )}
          </ul>
        </section>
      </div>
    </div>
  );
}