"use client";

import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatNaira } from "@/lib/format";
import { Button } from "@/components/ui/button";

export default function CartPage() {
  const { items, itemCount, subtotal, deliveryFee, updateQuantity, removeItem } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <ShoppingBag className="mx-auto size-12 text-muted-foreground" />
        <h1 className="mt-4 font-display text-2xl font-bold">Your cart is empty</h1>
        <p className="mt-2 text-sm text-muted-foreground">Add meals, small chops or drinks from the menu.</p>
        <Button asChild className="mt-6 rounded-full">
          <Link href="/menu">Browse menu</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="font-display text-2xl font-extrabold">Cart ({itemCount})</h1>

      <ul className="mt-6 space-y-3">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex gap-3 rounded-2xl border border-border bg-card p-3 shadow-soft"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.imageUrl}
              alt={item.name}
              className="size-20 shrink-0 rounded-xl object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="font-semibold leading-tight">{item.name}</p>
              <p className="mt-1 text-sm font-bold text-primary">
                {formatNaira(item.unitPrice)}
              </p>
              <div className="mt-2 flex items-center gap-2">
                <Button
                  size="icon"
                  variant="outline"
                  className="size-8 rounded-full"
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                >
                  <Minus className="size-3.5" />
                </Button>
                <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
                <Button
                  size="icon"
                  variant="outline"
                  className="size-8 rounded-full"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                >
                  <Plus className="size-3.5" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="ml-auto size-8 text-destructive"
                  onClick={() => removeItem(item.id)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-6 space-y-2 rounded-2xl border border-border bg-card p-5">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal (food)</span>
          <span className="font-semibold">{formatNaira(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Delivery fee (paid to rider)</span>
          <span className="font-semibold">{formatNaira(deliveryFee)}</span>
        </div>
        <p className="text-xs text-muted-foreground">
          For Delivery: food is paid online via Paystack. Delivery fee is cash to the rider on arrival.
        </p>
      </div>

      <Button asChild size="lg" className="mt-6 w-full rounded-full">
        <Link href="/checkout">Proceed to checkout</Link>
      </Button>
    </div>
  );
}
