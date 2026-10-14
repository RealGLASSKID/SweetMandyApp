import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Context, ReactNode } from "react";
import type { CartItem, Food, FoodAddon } from "@/types";

const STORAGE_KEY = "sweetmandy.cart.v1";

/** Delivery fee is paid in cash to the rider on arrival. Food is paid by bank transfer. */
export const DEFAULT_DELIVERY_FEE = 1000;

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  deliveryFee: number;
  total: number; // food total only (bank transfer)
  addItem: (
    food: Food,
    options?: { quantity?: number; addons?: FoodAddon[]; specialInstructions?: string },
  ) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clear: () => void;
  quantityOfFood: (foodId: string) => number;
}

const CONTEXT_KEY = Symbol.for("sweetmandy.cart.context");
type GlobalWithCart = typeof globalThis & {
  [CONTEXT_KEY]?: Context<CartContextValue | null>;
};
const globalScope = globalThis as GlobalWithCart;
const CartContext: Context<CartContextValue | null> =
  globalScope[CONTEXT_KEY] ??
  (globalScope[CONTEXT_KEY] = createContext<CartContextValue | null>(null));

function lineKey(foodId: string, addons: FoodAddon[], note?: string) {
  return [foodId, addons.map((a) => a.id).sort().join("+"), note ?? ""].join("|");
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw) as CartItem[]);
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const addItem = useCallback<CartContextValue["addItem"]>((food, options) => {
    const addons = options?.addons ?? [];
    const quantity = options?.quantity ?? 1;
    const id = lineKey(food.id, addons, options?.specialInstructions);
    setItems((prev) => {
      const existing = prev.find((i) => i.id === id);
      if (existing) {
        return prev.map((i) => (i.id === id ? { ...i, quantity: i.quantity + quantity } : i));
      }
      return [
        ...prev,
        {
          id,
          foodId: food.id,
          name: food.name,
          imageUrl: food.imageUrl,
          unitPrice: food.price + addons.reduce((s, a) => s + a.price, 0),
          quantity,
          addons,
          ...(options?.specialInstructions
            ? { specialInstructions: options.specialInstructions }
            : {}),
        },
      ];
    });
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    setItems((prev) =>
      quantity <= 0
        ? prev.filter((i) => i.id !== id)
        : prev.map((i) => (i.id === id ? { ...i, quantity } : i)),
    );
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<CartContextValue>(() => {
    const subtotal = items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
    const deliveryFee = items.length ? DEFAULT_DELIVERY_FEE : 0;
    return {
      items,
      itemCount: items.reduce((s, i) => s + i.quantity, 0),
      subtotal,
      deliveryFee,
      total: subtotal, // bank transfer charges food only
      addItem,
      updateQuantity,
      removeItem,
      clear,
      quantityOfFood: (foodId: string) =>
        items.filter((i) => i.foodId === foodId).reduce((s, i) => s + i.quantity, 0),
    };
  }, [items, addItem, updateQuantity, removeItem, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
