import { useMutation, useQuery } from "@tanstack/react-query";
import * as api from "@/services/api";
import type { CreateOrderPayload } from "@/services/api";

export type FoodQuery = {
  search?: string;
  categoryId?: string;
  sort?: "popular" | "price_asc" | "price_desc";
};

export const queryKeys = {
  categories: ["categories"] as const,
  foods: (query: FoodQuery) => ["foods", query] as const,
  food: (id: string) => ["food", id] as const,
  orders: ["orders"] as const,
  order: (id: string) => ["order", id] as const,
  me: ["me"] as const,
};

export const useCategories = () =>
  useQuery({ queryKey: queryKeys.categories, queryFn: api.fetchCategories });

export const useFoods = (query: FoodQuery = {}) =>
  useQuery({ queryKey: queryKeys.foods(query), queryFn: () => api.fetchFoods(query) });

export const useFood = (id: string) =>
  useQuery({ queryKey: queryKeys.food(id), queryFn: () => api.fetchFood(id), enabled: !!id });

export const useOrders = () => useQuery({ queryKey: queryKeys.orders, queryFn: api.fetchOrders });

export const useOrder = (id: string) =>
  useQuery({ queryKey: queryKeys.order(id), queryFn: () => api.fetchOrder(id), enabled: !!id });

export const useCurrentUser = () =>
  useQuery({ queryKey: queryKeys.me, queryFn: api.fetchCurrentUser });

export const useCreateOrder = () =>
  useMutation({ mutationFn: (payload: CreateOrderPayload) => api.createOrder(payload) });
