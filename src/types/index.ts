/**
 * Domain types for Sweet Mandy Bakery & Restaurant
 */

export interface Category {
  id: string;
  name: string;
  slug: string;
  emoji: string;
  itemCount?: number;
}

export interface FoodAddon {
  id: string;
  name: string;
  price: number;
}

export interface Food {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  categoryId: string;
  categoryName: string;
  rating: number;
  reviewCount: number;
  available: boolean;
  popular?: boolean;
  addons?: FoodAddon[];
}

export interface CartItem {
  id: string;
  foodId: string;
  name: string;
  imageUrl: string;
  unitPrice: number;
  quantity: number;
  addons: FoodAddon[];
  specialInstructions?: string;
}

export type UserRole = "customer" | "rider" | "admin";

export interface DeliveryLocation {
  id: string;
  label: string;
  addressLine: string;
  area: string;
  isDefault?: boolean;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  role: UserRole;
  deliveryLocations: DeliveryLocation[];
  favoriteFoodIds: string[];
  notifications: {
    orderUpdates: boolean;
    promotions: boolean;
  };
}

export type OrderType = "takeaway" | "delivery";

export type OrderStatus =
  | "placed"
  | "confirmed"
  | "preparing"
  | "ready"
  | "out_for_delivery"
  | "delivered"
  | "collected"
  | "cancelled";

export interface OrderItem {
  foodId: string;
  name: string;
  imageUrl: string;
  quantity: number;
  unitPrice: number;
  addons: FoodAddon[];
  specialInstructions?: string;
}

export interface OrderStatusEvent {
  status: OrderStatus;
  label: string;
  timestamp: string | null;
}

export type PaymentMethod = "bank_transfer" | "pay_at_shop";
/** pending = awaiting transfer proof; awaiting_confirmation = user submitted; confirmed = admin/user confirmed; rejected */
export type PaymentState =
  | "not_required"
  | "pending"
  | "awaiting_confirmation"
  | "confirmed"
  | "rejected";

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  customerName: string;
  customerPhone: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  orderType: OrderType;
  status: OrderStatus;
  statusHistory: OrderStatusEvent[];
  paymentMethod: PaymentMethod;
  paymentState: PaymentState;
  deliveryAddress?: string;
  deliveryArea?: string;
  riderId?: string;
  riderName?: string;
  specialNotes?: string;
  paymentProofUrl?: string;
  paymentConfirmedAt?: string;
  paymentNote?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Rider {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  status: "available" | "busy" | "offline";
  currentOrderId?: string;
  deliveriesToday: number;
}

export interface AppMessage {
  id: string;
  userId: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
  type: "order" | "promo" | "system";
}

export const BUSINESS = {
  name: "Sweet Mandy",
  fullName: "Sweet Mandy Bakery's",
  tagline: "Fresh bakery & delicious meals in Lagos",
  address: "G794+4M7, Ijegun Last Bus Stop, Ijegun, Lagos",
  phone: "0803 541 8887",
  hours: "Open · Closes 9:30 pm",
  deliveryZone: "Lagos Mainland only (Island coming soon)",
} as const;


/** Sweet Mandy bank transfer details — update to real account */
export const BANK = {
  bankName: "Access Bank",
  accountName: "Sweet Mandy Bakery's",
  accountNumber: "0123456789",
  /** Amount for food only; delivery fee is cash to rider */
} as const;
