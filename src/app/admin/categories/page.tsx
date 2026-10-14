"use client";

import { useState } from "react";
import { useCategories, queryKeys } from "@/hooks/useCatalogue";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { useQueryClient } from "@tanstack/react-query";
import { uploadToCloudinary } from "@/lib/cloudinary";

export default function AdminCategoriesPage() {
  const cats = useCategories();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("🍽️");
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    try {
      const slug = name.trim().toLowerCase().replace(/\s+/g, "-");
      let imageUrl = "/assets/cat-meals.jpg";
      if (file) imageUrl = await uploadToCloudinary(file);
      await addDoc(collection(db, "categories"), {
        name: name.trim(),
        slug,
        emoji,
        imageUrl,
        sort: 99,
        createdAt: serverTimestamp(),
      });
      toast.success("Category added");
      setOpen(false);
      setName("");
      setFile(null);
      qc.invalidateQueries({ queryKey: queryKeys.categories });
    } catch {
      toast.error("Could not save category");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-extrabold">Categories</h1>
          <p className="text-sm text-muted-foreground">Meals, drinks, small chops, bakery…</p>
        </div>
        <Button className="rounded-full" onClick={() => setOpen((v) => !v)}>
          {open ? "Close" : "Add category"}
        </Button>
      </div>

      {open && (
        <form onSubmit={save} className="mt-4 space-y-3 rounded-2xl border border-border bg-card p-5 max-w-md">
          <Input placeholder="Category name" value={name} onChange={(e) => setName(e.target.value)} required />
          <Input placeholder="Emoji" value={emoji} onChange={(e) => setEmoji(e.target.value)} />
          <Input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
          <Button type="submit" className="rounded-full" disabled={saving}>
            {saving ? "Saving…" : "Save category"}
          </Button>
        </form>
      )}

      <ul className="mt-6 space-y-2">
        {cats.isLoading
          ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-12 w-full rounded-xl" />)
          : (cats.data ?? []).map((c) => (
              <li
                key={c.id}
                className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3"
              >
                <span className="font-medium">
                  {c.emoji} {c.name}
                </span>
                <span className="text-xs text-muted-foreground">{c.slug}</span>
              </li>
            ))}
      </ul>
    </div>
  );
}
