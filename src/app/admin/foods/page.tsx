"use client";

import { useState } from "react";
import { useFoods, useCategories, queryKeys } from "@/hooks/useCatalogue";
import { formatNaira } from "@/lib/format";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { uploadToCloudinary } from "@/lib/cloudinary";

export default function AdminFoodsPage() {
  const foods = useFoods();
  const cats = useCategories();
  const qc = useQueryClient();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const list = (foods.data ?? []).filter(
    (f) =>
      !q ||
      f.name.toLowerCase().includes(q.toLowerCase()) ||
      f.categoryName.toLowerCase().includes(q.toLowerCase()),
  );

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const cat = (cats.data ?? []).find((c) => c.id === categoryId);
    if (!name || !price) {
      toast.error("Name and price required");
      return;
    }
    setSaving(true);
    try {
      let imageUrl = "/assets/cat-meals.jpg";
      if (file) imageUrl = await uploadToCloudinary(file);
      await addDoc(collection(db, "products"), {
        name: name.trim(),
        description: description.trim(),
        price: Number(price),
        categoryId: categoryId || "cat-meals",
        categoryName: cat?.name || "Meals",
        imageUrl,
        available: true,
        popular: false,
        rating: 5,
        reviewCount: 0,
        createdAt: serverTimestamp(),
      });
      toast.success("Product added to Firestore");
      setOpen(false);
      setName("");
      setPrice("");
      setDescription("");
      setFile(null);
      qc.invalidateQueries({ queryKey: queryKeys.foods({}) });
    } catch (err) {
      console.error(err);
      toast.error("Could not save — check Firebase rules & Cloudinary");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-extrabold">Menu items</h1>
          <p className="text-sm text-muted-foreground">Add meals, drinks, small chops, bread…</p>
        </div>
        <Button className="rounded-full" onClick={() => setOpen((v) => !v)}>
          {open ? "Close" : "Add product"}
        </Button>
      </div>

      {open && (
        <form onSubmit={save} className="mt-4 space-y-3 rounded-2xl border border-border bg-card p-5">
          <Input placeholder="Name (e.g. Party Jollof)" value={name} onChange={(e) => setName(e.target.value)} required />
          <Input placeholder="Price (naira)" type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
          <select
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value="">Select category</option>
            {(cats.data ?? []).map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <Input placeholder="Short description" value={description} onChange={(e) => setDescription(e.target.value)} />
          <Input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
          <Button type="submit" className="rounded-full" disabled={saving}>
            {saving ? "Saving…" : "Save product"}
          </Button>
        </form>
      )}

      <Input
        className="mt-4 max-w-sm"
        placeholder="Search…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />

      <div className="mt-4 overflow-x-auto rounded-2xl border border-border">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead className="border-b bg-muted/40 text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Item</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {foods.isLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={4} className="p-4">
                      <Skeleton className="h-6 w-full" />
                    </td>
                  </tr>
                ))
              : list.map((f) => (
                  <tr key={f.id}>
                    <td className="px-4 py-3 font-medium">{f.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{f.categoryName}</td>
                    <td className="px-4 py-3">{formatNaira(f.price)}</td>
                    <td className="px-4 py-3">{f.available ? "Available" : "Off"}</td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        List shows mock + any Firestore products once you wire fetchFoods to Firestore.
      </p>
    </div>
  );
}
