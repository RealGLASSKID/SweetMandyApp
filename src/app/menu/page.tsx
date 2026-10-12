"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { FoodCard } from "@/components/food/FoodCard";
import { categories, foods } from "@/data/mock";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

function MenuContent() {
  const searchParams = useSearchParams();
  const initialCat = searchParams.get("category") || "";
  const initialQ = searchParams.get("q") || "";
  const [activeCat, setActiveCat] = useState(initialCat);
  const [q, setQ] = useState(initialQ);

  const filtered = useMemo(() => {
    return foods.filter((f) => {
      const cat = categories.find((c) => c.slug === activeCat);
      const matchCat = !activeCat || (cat && f.categoryId === cat.id);
      const matchQ =
        !q ||
        f.name.toLowerCase().includes(q.toLowerCase()) ||
        f.description.toLowerCase().includes(q.toLowerCase());
      return matchCat && matchQ && f.available;
    });
  }, [activeCat, q]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="font-display text-3xl font-bold">Menu</h1>
      <p className="mt-1 text-sm text-muted-foreground">Take Away or Delivery · Lagos Mainland</p>

      <div className="mt-6">
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search menu..."
          className="h-11 max-w-md rounded-full"
        />
      </div>

      <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveCat("")}
          className={cn(
            "shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition",
            !activeCat
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border hover:border-primary/40",
          )}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCat(cat.slug)}
            className={cn(
              "shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition",
              activeCat === cat.slug
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border hover:border-primary/40",
            )}
          >
            {cat.emoji} {cat.name}
          </button>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((food) => (
          <FoodCard key={food.id} food={food} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="mt-12 text-center text-muted-foreground">No items match your search.</p>
      )}
    </div>
  );
}

export default function MenuPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-6xl px-4 py-16 text-center text-muted-foreground">
          Loading menu...
        </div>
      }
    >
      <MenuContent />
    </Suspense>
  );
}
