"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { formatNaira } from "@/lib/format";
import type { Food } from "@/types";
import { toast } from "sonner";

export function FoodCard({ food }: { food: Food }) {
  const { addItem } = useCart();
  const { user, loading } = useAuth();
  const router = useRouter();

  const handleAdd = () => {
    if (loading) return;
    if (!user) {
      toast.error("Sign in to add items to your cart");
      router.push("/login?next=/menu");
      return;
    }
    addItem(food);
    toast.success(`${food.name} added to cart`);
  };

  return (
    <article className="group overflow-hidden rounded-2xl border border-white/6 bg-card shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-glow">
      <Link href={`/food/${food.id}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={food.imageUrl}
            alt={food.name}
            loading="lazy"
            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {food.popular && (
            <span className="absolute left-2 top-2 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground shadow-glow">
              Popular
            </span>
          )}
        </div>
      </Link>
      <div className="space-y-2 p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <Link href={`/food/${food.id}`}>
              <h3 className="truncate font-display text-sm font-semibold transition-colors hover:text-primary">
                {food.name}
              </h3>
            </Link>
            <p className="truncate text-xs text-muted-foreground">{food.categoryName}</p>
          </div>
          <span className="flex shrink-0 items-center gap-0.5 text-xs font-semibold">
            <Star className="size-3 fill-warning text-warning" />
            {food.rating}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-display text-sm font-semibold text-primary">{formatNaira(food.price)}</span>
          <Button
            size="icon"
            className="size-8 rounded-full shadow-glow"
            disabled={!food.available}
            onClick={handleAdd}
          >
            <Plus className="size-4" />
          </Button>
        </div>
      </div>
    </article>
  );
}