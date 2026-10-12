"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart, DEFAULT_DELIVERY_FEE } from "@/context/CartContext";
import { useCreateOrder, useCurrentUser } from "@/hooks/useCatalogue";
import { MAINLAND_AREAS } from "@/data/mock";
import { formatNaira } from "@/lib/format";
import { toast } from "sonner";

export default function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const user = useCurrentUser();
  const createOrder = useCreateOrder();
  const router = useRouter();
  const [orderType, setOrderType] = useState<"takeaway" | "delivery">("takeaway");
  const [address, setAddress] = useState("");
  const [area, setArea] = useState("Ijegun");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");

  const fee = orderType === "delivery" ? DEFAULT_DELIVERY_FEE : 0;
  const payAmount = subtotal;

  if (items.length === 0) {
    return (
      <div className="p-16 text-center">
        <p className="text-muted-foreground">Cart is empty.</p>
        <Link href="/menu" className="mt-2 inline-block text-primary">
          Browse menu
        </Link>
      </div>
    );
  }

  const placeOrder = async () => {
    const customerName = name || user.data?.fullName || "Customer";
    const customerPhone = phone || user.data?.phone || "";
    if (!customerPhone) {
      toast.error("Please enter your phone number");
      return;
    }
    if (orderType === "delivery" && !address) {
      toast.error("Please enter delivery address");
      return;
    }

    try {
      const order = await createOrder.mutateAsync({
        items: items.map((i) => ({
          foodId: i.foodId,
          quantity: i.quantity,
          addons: i.addons,
          specialInstructions: i.specialInstructions,
        })),
        orderType,
        deliveryAddress: orderType === "delivery" ? address : undefined,
        deliveryArea: orderType === "delivery" ? area : undefined,
        customerName,
        customerPhone,
      });

      if (orderType === "delivery") {
        // Paystack integration point — food payment only
        toast.success(
          `Order ${order.orderNumber} placed. Pay ₦${payAmount.toLocaleString()} via Paystack (demo). Delivery fee ₦${fee.toLocaleString()} paid to rider on arrival.`,
        );
      } else {
        toast.success(
          `Take Away booking ${order.orderNumber} confirmed. Pay at the restaurant when you collect.`,
        );
      }
      clear();
      router.push(`/orders/${order.id}`);
    } catch {
      toast.error("Could not place order. Try again.");
    }
  };

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <h1 className="font-display text-2xl font-extrabold">Checkout</h1>

      {/* Order type */}
      <div className="mt-6 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setOrderType("takeaway")}
          className={`rounded-2xl border p-4 text-left transition ${
            orderType === "takeaway"
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/40"
          }`}
        >
          <p className="font-semibold">Take Away</p>
          <p className="mt-1 text-xs text-muted-foreground">Collect & pay at restaurant</p>
        </button>
        <button
          type="button"
          onClick={() => setOrderType("delivery")}
          className={`rounded-2xl border p-4 text-left transition ${
            orderType === "delivery"
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/40"
          }`}
        >
          <p className="font-semibold">Delivery</p>
          <p className="mt-1 text-xs text-muted-foreground">Mainland only · Paystack</p>
        </button>
      </div>

      <div className="mt-6 space-y-4">
        <div>
          <label className="text-sm font-medium">Full name</label>
          <Input
            className="mt-1.5"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={user.data?.fullName || "Your name"}
          />
        </div>
        <div>
          <label className="text-sm font-medium">Phone</label>
          <Input
            className="mt-1.5"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="0803 000 0000"
          />
        </div>

        {orderType === "delivery" && (
          <>
            <div>
              <label className="text-sm font-medium">Mainland area</label>
              <select
                className="mt-1.5 h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                value={area}
                onChange={(e) => setArea(e.target.value)}
              >
                {MAINLAND_AREAS.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Delivery address</label>
              <Input
                className="mt-1.5"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Street, landmark, house description"
              />
            </div>
          </>
        )}
      </div>

      <div className="mt-6 space-y-2 rounded-2xl border border-border bg-card p-5">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Food total</span>
          <span className="font-semibold">{formatNaira(payAmount)}</span>
        </div>
        {orderType === "delivery" && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Delivery fee (cash to rider)</span>
            <span className="font-semibold">{formatNaira(fee)}</span>
          </div>
        )}
        <p className="pt-2 text-xs text-muted-foreground">
          {orderType === "delivery"
            ? "You pay food online via Paystack. Delivery fee is paid to the rider when you receive your order."
            : "No online payment. Pay at Sweet Mandy when you collect."}
        </p>
      </div>

      <Button
        size="lg"
        className="mt-6 w-full rounded-full"
        onClick={placeOrder}
        disabled={createOrder.isPending}
      >
        {createOrder.isPending
          ? "Placing order..."
          : orderType === "delivery"
            ? `Pay ${formatNaira(payAmount)} & order`
            : "Book Take Away"}
      </Button>
    </div>
  );
}
