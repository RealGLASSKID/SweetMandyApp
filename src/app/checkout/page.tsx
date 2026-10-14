"use client";

import { RequireAuth } from "@/components/auth/RequireAuth";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, Copy, Upload, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart, DEFAULT_DELIVERY_FEE } from "@/context/CartContext";
import { useCreateOrder, useCurrentUser } from "@/hooks/useCatalogue";
import { MAINLAND_AREAS } from "@/data/mock";
import { formatNaira } from "@/lib/format";
import { BANK } from "@/types";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { submitPaymentProof, customerConfirmPayment } from "@/services/api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Step = "details" | "payment" | "done";

function CheckoutPageInner() {
  const { items, subtotal, clear } = useCart();
  const user = useCurrentUser();
  const createOrder = useCreateOrder();
  const router = useRouter();

  const [step, setStep] = useState<Step>("details");
  const [orderType, setOrderType] = useState<"takeaway" | "delivery">("takeaway");
  const [address, setAddress] = useState("");
  const [area, setArea] = useState("Ijegun");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [orderId, setOrderId] = useState<string | null>(null);
  const [orderNumber, setOrderNumber] = useState("");
  const [proofUrl, setProofUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const fee = orderType === "delivery" ? DEFAULT_DELIVERY_FEE : 0;
  const payAmount = subtotal; // food only — delivery fee cash to rider

  const copyText = async (label: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(label);
      toast.success(`${label} copied`);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      toast.error("Could not copy");
    }
  };

  if (items.length === 0 && step === "details") {
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

      setOrderId(order.id);
      setOrderNumber(order.orderNumber);
      clear();

      if (orderType === "delivery") {
        setStep("payment");
        toast.success(`Order ${order.orderNumber} placed — complete bank transfer below`);
      } else {
        setStep("done");
        toast.success(`Order ${order.orderNumber} booked. Pay at Sweet Mandy when you collect.`);
      }
    } catch {
      toast.error("Could not place order. Check Firebase connection.");
    }
  };

  const onUpload = async (file: File | null) => {
    if (!file || !orderId) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image screenshot");
      return;
    }
    setUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      setProofUrl(url);
      await submitPaymentProof(orderId, url);
      toast.success("Screenshot uploaded — waiting for confirmation");
    } catch (e) {
      console.error(e);
      toast.error("Upload failed. Check Cloudinary env keys.");
    } finally {
      setUploading(false);
    }
  };

  const onConfirmPayment = async () => {
    if (!orderId) return;
    if (!proofUrl) {
      toast.error("Please upload your payment screenshot first");
      return;
    }
    setConfirming(true);
    try {
      await customerConfirmPayment(orderId);
      setStep("done");
      toast.success("Payment marked as sent. Admin will verify before preparing your order.");
    } catch {
      toast.error("Could not confirm. Try again.");
    } finally {
      setConfirming(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg px-4 py-8 animate-fade-up">
      <h1 className="font-display text-3xl font-semibold tracking-tight">Checkout</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Take Away or Mainland delivery
      </p>

      {step === "details" && (
        <div className="mt-6 space-y-5">
          {/* Order type */}
          <div className="grid grid-cols-2 gap-2">
            {(["takeaway", "delivery"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setOrderType(t)}
                className={cn(
                  "rounded-2xl border px-4 py-3 text-sm font-medium transition",
                  orderType === t
                    ? "border-primary bg-primary/15 text-primary"
                    : "border-white/10 hover:bg-white/5",
                )}
              >
                {t === "takeaway" ? "Take Away" : "Delivery"}
              </button>
            ))}
          </div>

          <div className="rounded-2xl glass p-4 space-y-3">
            <div>
              <label className="text-sm font-medium">Full name</label>
              <Input
                className="mt-1.5 h-11 rounded-xl bg-white/5 border-white/10"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={user.data?.fullName || "Your name"}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Phone</label>
              <Input
                className="mt-1.5 h-11 rounded-xl bg-white/5 border-white/10"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={user.data?.phone || "0803 000 0000"}
                required
              />
            </div>
            {orderType === "delivery" && (
              <>
                <div>
                  <label className="text-sm font-medium">Mainland area</label>
                  <select
                    className="mt-1.5 flex h-11 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                  >
                    {MAINLAND_AREAS.map((a) => (
                      <option key={a} value={a} className="bg-card">
                        {a}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Delivery address</label>
                  <Input
                    className="mt-1.5 h-11 rounded-xl bg-white/5 border-white/10"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Street, landmark…"
                  />
                </div>
              </>
            )}
          </div>

          <div className="rounded-2xl glass p-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Food subtotal</span>
              <span className="font-semibold">{formatNaira(subtotal)}</span>
            </div>
            {orderType === "delivery" && (
              <div className="mt-2 flex justify-between text-muted-foreground">
                <span>Delivery fee</span>
                <span>{formatNaira(fee)} (cash to rider)</span>
              </div>
            )}
            <div className="mt-3 flex justify-between border-t border-white/10 pt-3 font-display text-lg font-semibold">
              <span>Pay now</span>
              <span className="text-primary">
                {orderType === "delivery" ? formatNaira(payAmount) : "Pay at shop"}
              </span>
            </div>
          </div>

          <Button
            className="h-12 w-full rounded-full shadow-glow"
            onClick={placeOrder}
            disabled={createOrder.isPending}
          >
            {createOrder.isPending
              ? "Placing order…"
              : orderType === "delivery"
                ? "Place order & pay by transfer"
                : "Book Take Away"}
          </Button>
        </div>
      )}

      {step === "payment" && (
        <div className="mt-6 space-y-5 animate-scale-in">
          <div className="rounded-2xl border border-primary/30 bg-primary/10 p-4 text-sm">
            <p className="font-semibold text-primary">Order {orderNumber}</p>
            <p className="mt-1 text-muted-foreground">
              Transfer <strong className="text-foreground">{formatNaira(payAmount)}</strong> for food.
              Delivery fee is paid in cash to the rider when your order arrives.
            </p>
          </div>

          {/* Bank details */}
          <div className="rounded-2xl glass p-5">
            <div className="flex items-center gap-2 font-semibold">
              <Building2 className="size-5 text-primary" />
              Bank transfer
            </div>
            <div className="mt-4 space-y-3 text-sm">
              {(
                [
                  ["Bank", BANK.bankName],
                  ["Account name", BANK.accountName],
                  ["Account number", BANK.accountNumber],
                  ["Amount", formatNaira(payAmount)],
                ] as const
              ).map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-center justify-between gap-3 rounded-xl border border-white/8 bg-white/5 px-3 py-2.5"
                >
                  <div className="min-w-0">
                    <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</p>
                    <p className="truncate font-semibold">{value}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyText(label, value)}
                    className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary transition hover:bg-primary/25"
                    aria-label={`Copy ${label}`}
                  >
                    {copied === label ? <Check className="size-4" /> : <Copy className="size-4" />}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Upload screenshot */}
          <div className="rounded-2xl glass p-5">
            <p className="font-semibold">Upload payment screenshot</p>
            <p className="mt-1 text-xs text-muted-foreground">
              After you transfer, upload a clear screenshot of the receipt.
            </p>
            <label className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-white/20 bg-white/5 px-4 py-8 transition hover:border-primary/40 hover:bg-primary/5">
              <Upload className="size-8 text-primary" />
              <span className="mt-2 text-sm font-medium">
                {uploading ? "Uploading…" : proofUrl ? "Replace screenshot" : "Tap to upload"}
              </span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={uploading}
                onChange={(e) => onUpload(e.target.files?.[0] ?? null)}
              />
            </label>
            {proofUrl && (
              <div className="mt-3 overflow-hidden rounded-xl border border-white/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={proofUrl} alt="Payment proof" className="max-h-48 w-full object-contain bg-black/40" />
              </div>
            )}
          </div>

          <Button
            className="h-12 w-full rounded-full shadow-glow"
            disabled={!proofUrl || confirming}
            onClick={onConfirmPayment}
          >
            {confirming ? "Saving…" : "I have paid — confirm payment"}
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            Your order is prepared only after payment is verified by Sweet Mandy.
          </p>
        </div>
      )}

      {step === "done" && (
        <div className="mt-8 text-center animate-fade-up">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-success/20 text-success">
            <Check className="size-8" />
          </div>
          <h2 className="mt-4 font-display text-2xl font-semibold">Thank you!</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Order <strong className="text-foreground">{orderNumber}</strong> received.
            {orderType === "delivery"
              ? " We’ll verify your transfer and start preparing."
              : " Pay at the shop when you collect."}
          </p>
          <div className="mt-6 flex flex-col gap-2">
            <Button asChild className="rounded-full">
              <Link href="/account/orders">View my orders</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full border-white/15">
              <Link href="/menu">Back to menu</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}


export default function CheckoutPage() {
  return (
    <RequireAuth soft>
      <CheckoutPageInner />
    </RequireAuth>
  );
}
