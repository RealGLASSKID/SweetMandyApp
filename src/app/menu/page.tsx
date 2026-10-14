"use client";

import { Suspense, useMemo, useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { FoodCard } from "@/components/food/FoodCard";
import { categories, foods, categoryImages } from "@/data/mock";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

function CategoryCarousel({
  activeCat,
  onSelect,
}: {
  activeCat: string;
  onSelect: (slug: string) => void;
}) {
  const scroller = useRef<HTMLDivElement>(null);

  const scroll = (dir: number) => {
    scroller.current?.scrollBy({ left: dir * 200, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => scroll(-1)}
        className="absolute left-0 top-1/2 z-10 hidden size-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-card/90 shadow-soft sm:flex"
        aria-label="Previous"
      >
        <ChevronLeft className="size-4" />
      </button>
      <button
        type="button"
        onClick={() => scroll(1)}
        className="absolute right-0 top-1/2 z-10 hidden size-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-card/90 shadow-soft sm:flex"
        aria-label="Next"
      >
        <ChevronRight className="size-4" />
      </button>

      <div
        ref={scroller}
        className="flex gap-3 overflow-x-auto scroll-smooth px-1 pb-2 scrollbar-none sm:px-10"
        style={{ scrollbarWidth: "none" }}
      >
        <button
          type="button"
          onClick={() => onSelect("")}
          className={cn(
            "w-[100px] shrink-0 text-center transition-transform active:scale-95 sm:w-[120px]",
            !activeCat && "scale-[1.02]",
          )}
        >
          <div
            className={cn(
              "overflow-hidden rounded-2xl border-2 transition",
              !activeCat ? "border-primary shadow-glow" : "border-white/10",
            )}
          >
            <div className="flex aspect-square items-center justify-center bg-secondary text-2xl">🍽️</div>
          </div>
          <p className={cn("mt-2 text-xs font-medium", !activeCat && "text-primary")}>All</p>
        </button>

        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelect(cat.slug)}
            className={cn(
              "w-[100px] shrink-0 text-center transition-transform active:scale-95 sm:w-[120px]",
              activeCat === cat.slug && "scale-[1.02]",
            )}
          >
            <div
              className={cn(
                "overflow-hidden rounded-2xl border-2 transition",
                activeCat === cat.slug ? "border-primary shadow-glow" : "border-white/10",
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={categoryImages[cat.slug] || "/assets/cat-meals.jpg"}
                alt={cat.name}
                className="aspect-square w-full object-cover"
              />
            </div>
            <p className={cn("mt-2 text-xs font-medium", activeCat === cat.slug && "text-primary")}>
              {cat.emoji} {cat.name}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}

function MenuContent() {
  const searchParams = useSearchParams();
  const initialCat = searchParams.get("category") || "";
  const initialQ = searchParams.get("q") || "";
  const [activeCat, setActiveCat] = useState(initialCat);
  const [q, setQ] = useState(initialQ);

  useEffect(() => {
    setActiveCat(searchParams.get("category") || "");
  }, [searchParams]);

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
      <h1 className="font-display text-3xl font-semibold tracking-tight">Menu</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Meals · Small chops · Bread · Ice cream · Drinks · Take Away or Delivery
      </p>

      <div className="mt-6">
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search menu..."
          className="h-11 max-w-md rounded-full border-white/10 bg-white/5"
        />
      </div>

      <div className="mt-6">
        <CategoryCarousel activeCat={activeCat} onSelect={setActiveCat} />
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
