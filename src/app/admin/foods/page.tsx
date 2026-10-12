"use client";

import { useState } from "react";
import { useFoods } from "@/hooks/useCatalogue";
import { formatNaira } from "@/lib/format";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AdminFoodsPage() {
  const foods = useFoods();
  const [q, setQ] = useState("");
  const list = (foods.data ?? []).filter(
    (f) =>
      !q ||
      f.name.toLowerCase().includes(q.toLowerCase()) ||
      f.categoryName.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-extrabold">Menu items</h1>
          <p className="text-sm text-muted-foreground">Sweet Mandy catalogue</p>
        </div>
        <Button className="rounded-full" disabled>
          Add item
        </Button>
      </div>

      <Input
        className="mt-4 max-w-sm"
        placeholder="Search menu..."
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />

      <div className="mt-6 overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead className="border-b border-border bg-muted/50 text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Item</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {foods.isLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={5} className="p-4">
                      <Skeleton className="h-6 w-full" />
                    </td>
                  </tr>
                ))
              : list.map((f) => (
                  <tr key={f.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={f.imageUrl} alt="" className="size-10 rounded-lg object-cover" />
                        <span className="font-medium">{f.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{f.categoryName}</td>
                    <td className="px-4 py-3 font-semibold">{formatNaira(f.price)}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                          f.available ? "bg-success/20 text-success" : "bg-muted"
                        }`}
                      >
                        {f.available ? "Available" : "Unavailable"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button size="sm" variant="ghost" disabled>
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
