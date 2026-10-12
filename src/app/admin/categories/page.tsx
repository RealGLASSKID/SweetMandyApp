"use client";

import { useCategories } from "@/hooks/useCatalogue";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export default function AdminCategoriesPage() {
  const categories = useCategories();

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-extrabold">Categories</h1>
          <p className="text-sm text-muted-foreground">Menu categories for Sweet Mandy</p>
        </div>
        <Button className="rounded-full" disabled>
          Add category
        </Button>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {categories.isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-20 rounded-2xl" />
            ))
          : (categories.data ?? []).map((c) => (
              <div
                key={c.id}
                className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4"
              >
                <span className="text-2xl">{c.emoji}</span>
                <div>
                  <p className="font-semibold">{c.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {c.itemCount ?? 0} items · /{c.slug}
                  </p>
                </div>
              </div>
            ))}
      </div>
    </div>
  );
}
