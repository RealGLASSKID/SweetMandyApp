import {
  collection,
  addDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  orderBy,
  where,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db, auth } from "@/lib/firebase/config";
import { categories as mockCategories, foods as mockFoods, mockOrders, mockUser } from "@/data/mock";
import type { Category, Food, Order, OrderItem, OrderStatus, PaymentState, User } from "@/types";

export type FoodQuery = {
  search?: string;
  categoryId?: string;
  sort?: "popular" | "price_asc" | "price_desc";
};

export type CreateOrderPayload = {
  items: {
    foodId: string;
    quantity: number;
    addons?: { id: string; name: string; price: number }[];
    specialInstructions?: string;
  }[];
  orderType: "takeaway" | "delivery";
  deliveryAddress?: string;
  deliveryArea?: string;
  customerName: string;
  customerPhone: string;
  specialNotes?: string;
};

function orderNumber() {
  return `SM-${Date.now().toString().slice(-6)}`;
}

function mapOrder(id: string, data: Record<string, unknown>): Order {
  const created = data.createdAt;
  const updated = data.updatedAt;
  const toIso = (v: unknown) => {
    if (v && typeof v === "object" && "toDate" in v) return (v as Timestamp).toDate().toISOString();
    if (typeof v === "string") return v;
    return new Date().toISOString();
  };
  return {
    id,
    orderNumber: String(data.orderNumber ?? id),
    userId: String(data.userId ?? ""),
    customerName: String(data.customerName ?? ""),
    customerPhone: String(data.customerPhone ?? ""),
    items: (data.items as OrderItem[]) ?? [],
    subtotal: Number(data.subtotal ?? 0),
    deliveryFee: Number(data.deliveryFee ?? 0),
    total: Number(data.total ?? 0),
    orderType: (data.orderType as Order["orderType"]) ?? "takeaway",
    status: (data.status as OrderStatus) ?? "placed",
    statusHistory: (data.statusHistory as Order["statusHistory"]) ?? [],
    paymentMethod: (data.paymentMethod as Order["paymentMethod"]) ?? "bank_transfer",
    paymentState: (data.paymentState as PaymentState) ?? "pending",
    deliveryAddress: data.deliveryAddress as string | undefined,
    deliveryArea: data.deliveryArea as string | undefined,
    riderId: data.riderId as string | undefined,
    riderName: data.riderName as string | undefined,
    specialNotes: data.specialNotes as string | undefined,
    paymentProofUrl: data.paymentProofUrl as string | undefined,
    paymentConfirmedAt: data.paymentConfirmedAt as string | undefined,
    paymentNote: data.paymentNote as string | undefined,
    createdAt: toIso(created),
    updatedAt: toIso(updated),
  };
}

export async function fetchCategories(): Promise<Category[]> {
  return mockCategories;
}

export async function fetchFoods(queryParams: FoodQuery = {}): Promise<Food[]> {
  let list = [...mockFoods];
  if (queryParams.categoryId) list = list.filter((f) => f.categoryId === queryParams.categoryId);
  if (queryParams.search) {
    const q = queryParams.search.toLowerCase();
    list = list.filter(
      (f) => f.name.toLowerCase().includes(q) || f.description.toLowerCase().includes(q),
    );
  }
  if (queryParams.sort === "price_asc") list.sort((a, b) => a.price - b.price);
  if (queryParams.sort === "price_desc") list.sort((a, b) => b.price - a.price);
  if (queryParams.sort === "popular") list.sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));
  return list;
}

export async function fetchFood(id: string): Promise<Food | null> {
  return mockFoods.find((f) => f.id === id) ?? null;
}

export async function fetchCurrentUser(): Promise<User | null> {
  const u = auth.currentUser;
  if (!u) return null;
  try {
    const snap = await getDoc(doc(db, "users", u.uid));
    if (snap.exists()) {
      const d = snap.data();
      return {
        id: u.uid,
        fullName: d.fullName || u.displayName || "Customer",
        email: d.email || u.email || "",
        phone: d.phone || "",
        role: d.role || "customer",
        deliveryLocations: d.deliveryLocations || [],
        favoriteFoodIds: d.favoriteFoodIds || [],
        notifications: d.notifications || { orderUpdates: true, promotions: true },
      };
    }
  } catch {
    /* fall through */
  }
  return {
    ...mockUser,
    id: u.uid,
    email: u.email || mockUser.email,
    fullName: u.displayName || mockUser.fullName,
  };
}

export async function fetchOrders(): Promise<Order[]> {
  try {
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => mapOrder(d.id, d.data() as Record<string, unknown>));
  } catch (e) {
    console.warn("[orders] Firestore read failed, using mock", e);
    return mockOrders;
  }
}

export async function fetchOrder(id: string): Promise<Order | null> {
  try {
    const snap = await getDoc(doc(db, "orders", id));
    if (!snap.exists()) return null;
    return mapOrder(snap.id, snap.data() as Record<string, unknown>);
  } catch {
    return mockOrders.find((o) => o.id === id) ?? null;
  }
}

export async function createOrder(payload: CreateOrderPayload): Promise<Order> {
  const foodMap = Object.fromEntries(mockFoods.map((f) => [f.id, f]));
  const items: OrderItem[] = payload.items.map((i) => {
    const food = foodMap[i.foodId];
    return {
      foodId: i.foodId,
      name: food?.name ?? "Item",
      imageUrl: food?.imageUrl ?? "",
      quantity: i.quantity,
      unitPrice: food?.price ?? 0,
      addons: (i.addons as OrderItem["addons"]) ?? [],
      specialInstructions: i.specialInstructions,
    };
  });
  const subtotal = items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
  const deliveryFee = 0; // cash to rider — not charged online
  const isDelivery = payload.orderType === "delivery";
  const now = new Date().toISOString();
  const uid = auth.currentUser?.uid || "guest";

  const base = {
    orderNumber: orderNumber(),
    userId: uid,
    customerName: payload.customerName,
    customerPhone: payload.customerPhone,
    items,
    subtotal,
    deliveryFee,
    total: subtotal,
    orderType: payload.orderType,
    status: "placed" as OrderStatus,
    statusHistory: [{ status: "placed" as OrderStatus, label: "Order placed", timestamp: now }],
    paymentMethod: isDelivery ? ("bank_transfer" as const) : ("pay_at_shop" as const),
    paymentState: isDelivery ? ("pending" as PaymentState) : ("not_required" as PaymentState),
    deliveryAddress: payload.deliveryAddress,
    deliveryArea: payload.deliveryArea,
    specialNotes: payload.specialNotes,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    adminNotified: true,
  };

  try {
    const ref = await addDoc(collection(db, "orders"), base);
    // Admin notification doc
    await addDoc(collection(db, "admin_notifications"), {
      type: "new_order",
      orderId: ref.id,
      orderNumber: base.orderNumber,
      customerName: payload.customerName,
      customerPhone: payload.customerPhone,
      orderType: payload.orderType,
      total: subtotal,
      paymentState: base.paymentState,
      read: false,
      createdAt: serverTimestamp(),
    });
    return mapOrder(ref.id, { ...base, createdAt: now, updatedAt: now });
  } catch (e) {
    console.warn("[orders] Firestore write failed — demo order", e);
    return mapOrder(`local-${Date.now()}`, { ...base, createdAt: now, updatedAt: now });
  }
}

export async function submitPaymentProof(
  orderId: string,
  proofUrl: string,
): Promise<void> {
  const now = new Date().toISOString();
  try {
    await updateDoc(doc(db, "orders", orderId), {
      paymentProofUrl: proofUrl,
      paymentState: "awaiting_confirmation",
      updatedAt: serverTimestamp(),
    });
    await addDoc(collection(db, "admin_notifications"), {
      type: "payment_proof",
      orderId,
      message: "Customer uploaded payment screenshot",
      read: false,
      createdAt: serverTimestamp(),
    });
  } catch (e) {
    console.warn("[payment] submit proof failed", e);
    throw e;
  }
}

/** Customer marks "I have paid" — still needs admin verification for fulfillment */
export async function customerConfirmPayment(orderId: string): Promise<void> {
  try {
    await updateDoc(doc(db, "orders", orderId), {
      paymentState: "awaiting_confirmation",
      paymentNote: "Customer confirmed transfer sent",
      updatedAt: serverTimestamp(),
    });
  } catch (e) {
    console.warn(e);
    throw e;
  }
}

/** Admin confirms payment — order can proceed */
export async function adminConfirmPayment(orderId: string): Promise<void> {
  const now = new Date().toISOString();
  await updateDoc(doc(db, "orders", orderId), {
    paymentState: "confirmed",
    paymentConfirmedAt: now,
    status: "confirmed",
    updatedAt: serverTimestamp(),
  });
}

export async function adminRejectPayment(orderId: string, note?: string): Promise<void> {
  await updateDoc(doc(db, "orders", orderId), {
    paymentState: "rejected",
    paymentNote: note || "Payment not verified",
    updatedAt: serverTimestamp(),
  });
}

export async function updateOrderStatus(orderId: string, status: OrderStatus, label: string) {
  const order = await fetchOrder(orderId);
  if (!order) throw new Error("Order not found");
  // Block progress if delivery and payment not confirmed
  if (
    order.orderType === "delivery" &&
    order.paymentState !== "confirmed" &&
    status !== "cancelled" &&
    status !== "placed"
  ) {
    throw new Error("Payment must be confirmed before preparing this order");
  }
  const history = [
    ...order.statusHistory,
    { status, label, timestamp: new Date().toISOString() },
  ];
  await updateDoc(doc(db, "orders", orderId), {
    status,
    statusHistory: history,
    updatedAt: serverTimestamp(),
  });
}
