"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Star } from "lucide-react";
import { useFood } from "@/hooks/useCatalogue";
import { useCart } from "@/context/CartContext";
import { formatNaira } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export default function FoodDetailPage({
  params,
}: {
  params: Promise<{ foodId: string }>;
}) {
  const { foodId } = use(params);
  const { data: food, isLoading } = useFood(foodId);
  const { addItem } = useCart();

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <Skeleton className="aspect-[16/9] w-full rounded-3xl" />
        <Skeleton className="mt-6 h-8 w-1/2" />
      </div>
    );
  }

  if (!food) {
    return (
      <div className="p-16 text-center">
        <p className="text-muted-foreground">Item not found.</p>
        <Link href="/menu" className="mt-2 inline-block text-primary">
          Back to menu
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link
        href="/menu"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Menu
      </Link>

      <div className="mt-4 overflow-hidden rounded-3xl border border-border">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={food.imageUrl} alt={food.name} className="aspect-[16/9] w-full object-cover" />
      </div>

      <div className="mt-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-extrabold sm:text-3xl">{food.name}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{food.categoryName}</p>
          </div>
          <span className="flex items-center gap-1 text-sm font-semibold">
            <Star className="size-4 fill-warning text-warning" />
            {food.rating}
            <span className="text-muted-foreground">({food.reviewCount})</span>
          </span>
        </div>

        <p className="mt-4 text-muted-foreground">{food.description}</p>
        <p className="mt-4 font-display text-2xl font-bold text-primary">
          {formatNaira(food.price)}
        </p>

        <Button
          size="lg"
          className="mt-6 w-full rounded-full sm:w-auto"
          disabled={!food.available}
          onClick={() => {
            addItem(food);
            toast.success(`${food.name} added to cart`);
          }}
        >
          <Plus className="size-4" /> Add to cart
        </Button>
      </div>
    </div>
  );
}
