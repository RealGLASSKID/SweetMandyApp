/**
 * API layer for Sweet Mandy
 * Currently uses mock data. Swap implementations with Firebase / Paystack later.
 */

import type { Category, Food, Order, User } from "@/types";
import { categories, foods, mockOrders, mockUser } from "@/data/mock";
import { mockResponse } from "./http";

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

/** GET /categories */
export function fetchCategories(): Promise<Category[]> {
  return mockResponse(categories, 150);
}

/** GET /foods */
export function fetchFoods(query: FoodQuery = {}): Promise<Food[]> {
  let list = [...foods];
  if (query.search) {
    const q = query.search.toLowerCase();
    list = list.filter(
      (f) =>
        f.name.toLowerCase().includes(q) ||
        f.description.toLowerCase().includes(q) ||
        f.categoryName.toLowerCase().includes(q),
    );
  }
  if (query.categoryId) list = list.filter((f) => f.categoryId === query.categoryId);
  switch (query.sort) {
    case "price_asc":
      list.sort((a, b) => a.price - b.price);
      break;
    case "price_desc":
      list.sort((a, b) => b.price - a.price);
      break;
    default:
      list.sort((a, b) => Number(b.popular ?? false) - Number(a.popular ?? false));
  }
  return mockResponse(list);
}

/** GET /foods/:id */
export function fetchFood(id: string): Promise<Food | null> {
  return mockResponse(foods.find((f) => f.id === id) ?? null);
}

/** GET /orders */
export function fetchOrders(): Promise<Order[]> {
  return mockResponse(mockOrders);
}

/** GET /orders/:id */
export function fetchOrder(id: string): Promise<Order | null> {
  return mockResponse(mockOrders.find((o) => o.id === id || o.orderNumber === id) ?? null);
}

/** GET /me */
export function fetchCurrentUser(): Promise<User> {
  return mockResponse(mockUser);
}

/** POST /orders */
export function createOrder(payload: CreateOrderPayload): Promise<Order> {
  const orderItems = payload.items.map((item) => {
    const food = foods.find((f) => f.id === item.foodId)!;
    return {
      foodId: item.foodId,
      name: food.name,
      imageUrl: food.imageUrl,
      quantity: item.quantity,
      unitPrice: food.price,
      addons: item.addons ?? [],
      specialInstructions: item.specialInstructions,
    };
  });
  const subtotal = orderItems.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
  const deliveryFee = payload.orderType === "delivery" ? 1000 : 0;
  const order: Order = {
    id: `ord-${Date.now()}`,
    orderNumber: `SM-${Math.floor(1000 + Math.random() * 9000)}`,
    userId: mockUser.id,
    customerName: payload.customerName,
    customerPhone: payload.customerPhone,
    items: orderItems,
    subtotal,
    deliveryFee,
    total: subtotal,
    orderType: payload.orderType,
    status: "placed",
    statusHistory: [{ status: "placed", label: "Order placed", timestamp: new Date().toISOString() }],
    paymentMethod: payload.orderType === "delivery" ? "paystack" : "cash",
    paymentState: payload.orderType === "delivery" ? "processing" : "idle",
    deliveryAddress: payload.deliveryAddress,
    deliveryArea: payload.deliveryArea,
    specialNotes: payload.specialNotes,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  return mockResponse(order, 400);
}
