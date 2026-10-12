import type { Category, Food, Order, Rider, User } from "@/types";

const img = {
  hero: "/assets/hero.jpg",
  meals: "/assets/cat-meals.jpg",
  chops: "/assets/cat-small-chops.jpg",
  bread: "/assets/cat-breads-pastries.jpg",
  ice: "/assets/cat-ice-cream.jpg",
  drinks: "/assets/cat-soft-drinks.jpg",
  jollof: "/assets/food-jollof.jpg",
  chicken: "/assets/food-chicken.jpg",
  smallChops: "/assets/food-smallchops.jpg",
  pastry: "/assets/food-pastry.jpg",
  pasta: "/assets/food-pasta.jpg",
  burger: "/assets/food-burger.jpg",
};

export const categories: Category[] = [
  { id: "cat-meals", name: "Meals", slug: "meals", emoji: "🍚", itemCount: 6 },
  { id: "cat-soups", name: "Soups & Swallow", slug: "soups", emoji: "🥣", itemCount: 4 },
  { id: "cat-smallchops", name: "Small Chops", slug: "small-chops", emoji: "🥟", itemCount: 5 },
  { id: "cat-bakery", name: "Bread & Pastries", slug: "bakery", emoji: "🥐", itemCount: 6 },
  { id: "cat-icecream", name: "Ice Cream", slug: "ice-cream", emoji: "🍦", itemCount: 3 },
  { id: "cat-drinks", name: "Soft Drinks", slug: "drinks", emoji: "🥤", itemCount: 6 },
];

export const categoryImages: Record<string, string> = {
  meals: img.meals,
  soups: img.meals,
  "small-chops": img.chops,
  bakery: img.bread,
  "ice-cream": img.ice,
  drinks: img.drinks,
};

export const foods: Food[] = [
  { id: "f-jollof", name: "Party Jollof Rice", description: "Smoky party-style jollof rice with chicken or beef. Perfect for takeaway or delivery.", imageUrl: img.jollof, price: 2500, categoryId: "cat-meals", categoryName: "Meals", rating: 4.9, reviewCount: 186, available: true, popular: true },
  { id: "f-fried-rice", name: "Fried Rice", description: "Colorful Nigerian fried rice with mixed vegetables and protein of your choice.", imageUrl: img.pasta, price: 2300, categoryId: "cat-meals", categoryName: "Meals", rating: 4.7, reviewCount: 142, available: true, popular: true },
  { id: "f-chicken", name: "Peppered Chicken", description: "Spicy grilled chicken with our signature pepper sauce.", imageUrl: img.chicken, price: 2800, categoryId: "cat-meals", categoryName: "Meals", rating: 4.8, reviewCount: 98, available: true, popular: true },
  { id: "f-semo", name: "Semovita & Soup", description: "Smooth semovita served with your choice of egusi, okro or vegetable soup.", imageUrl: img.meals, price: 2000, categoryId: "cat-soups", categoryName: "Soups & Swallow", rating: 4.6, reviewCount: 74, available: true },
  { id: "f-smallchops", name: "Small Chops Platter", description: "Assorted spring rolls, puff-puff, samosa and chicken wings. Great for sharing.", imageUrl: img.smallChops, price: 3500, categoryId: "cat-smallchops", categoryName: "Small Chops", rating: 4.9, reviewCount: 210, available: true, popular: true },
  { id: "f-pastry", name: "Fresh Bread & Pastries", description: "Soft bread, meat pie, chicken pie and sausage roll baked daily.", imageUrl: img.pastry, price: 800, categoryId: "cat-bakery", categoryName: "Bread & Pastries", rating: 4.8, reviewCount: 320, available: true, popular: true },
  { id: "f-icecream", name: "Ice Cream Cup", description: "Creamy ice cream in popular flavours. Perfect after your meal.", imageUrl: img.ice, price: 1200, categoryId: "cat-icecream", categoryName: "Ice Cream", rating: 4.7, reviewCount: 88, available: true },
  { id: "f-drinks", name: "Soft Drinks", description: "Coke, Fanta, Sprite, Malt and bottled water. Chilled and ready.", imageUrl: img.drinks, price: 500, categoryId: "cat-drinks", categoryName: "Soft Drinks", rating: 4.5, reviewCount: 56, available: true },
];

export const mockUser: User = {
  id: "u-demo", fullName: "Demo Customer", email: "customer@sweetmandy.ng", phone: "0803 000 0000", role: "customer",
  deliveryLocations: [{ id: "loc-1", label: "Home", addressLine: "Ijegun Last Bus Stop area", area: "Mainland", isDefault: true }],
  favoriteFoodIds: ["f-jollof", "f-smallchops"], notifications: { orderUpdates: true, promotions: true },
};

export const mockRiders: Rider[] = [
  { id: "r-1", fullName: "Tunde Adebayo", phone: "0801 111 2222", email: "tunde@sweetmandy.ng", status: "available", deliveriesToday: 7 },
  { id: "r-2", fullName: "Chidi Okoro", phone: "0802 333 4444", email: "chidi@sweetmandy.ng", status: "busy", currentOrderId: "ord-demo-1", deliveriesToday: 5 },
];

export const mockOrders: Order[] = [{
  id: "ord-demo-1", orderNumber: "SM-1001", userId: "u-demo", customerName: "Demo Customer", customerPhone: "0803 000 0000",
  items: [{ foodId: "f-jollof", name: "Party Jollof Rice", imageUrl: img.jollof, quantity: 2, unitPrice: 2500, addons: [] }],
  subtotal: 5000, deliveryFee: 1000, total: 5000, orderType: "delivery", status: "out_for_delivery",
  statusHistory: [
    { status: "placed", label: "Order placed", timestamp: "2026-10-05T10:00:00Z" },
    { status: "confirmed", label: "Confirmed", timestamp: "2026-10-05T10:05:00Z" },
    { status: "preparing", label: "Preparing", timestamp: "2026-10-05T10:15:00Z" },
    { status: "out_for_delivery", label: "Out for delivery", timestamp: "2026-10-05T10:40:00Z" },
  ],
  paymentMethod: "paystack", paymentState: "successful",
  deliveryAddress: "Ijegun Last Bus Stop, near the bakery", deliveryArea: "Mainland",
  riderId: "r-2", riderName: "Chidi Okoro",
  createdAt: "2026-10-05T10:00:00Z", updatedAt: "2026-10-05T10:40:00Z",
}];

export const MAINLAND_AREAS = ["Ijegun", "Ikotun", "Egbe", "Isheri", "Ikeja", "Agege", "Mushin", "Surulere", "Yaba", "Ojuelegba", "Other Mainland"];
export const HERO_IMAGE = img.hero;
