"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BUSINESS } from "@/types";
import { toast } from "sonner";

export default function AdminSettingsPage() {
  const [name, setName] = useState<string>(BUSINESS.name);
  const [phone, setPhone] = useState<string>(BUSINESS.phone);
  const [address, setAddress] = useState<string>(BUSINESS.address);
  const [hours, setHours] = useState<string>(BUSINESS.hours);
  const [accepting, setAccepting] = useState(true);

  return (
    <div className="max-w-xl">
      <h1 className="font-display text-2xl font-extrabold">Settings</h1>
      <p className="text-sm text-muted-foreground">Business details for Sweet Mandy</p>

      <div className="mt-6 space-y-5 rounded-2xl border border-border bg-card p-6">
        <div>
          <label className="text-sm font-medium">Business name</label>
          <Input className="mt-1.5" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label className="text-sm font-medium">Phone</label>
          <Input className="mt-1.5" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <div>
          <label className="text-sm font-medium">Address</label>
          <Input className="mt-1.5" value={address} onChange={(e) => setAddress(e.target.value)} />
        </div>
        <div>
          <label className="text-sm font-medium">Hours</label>
          <Input className="mt-1.5" value={hours} onChange={(e) => setHours(e.target.value)} />
        </div>
        <div className="flex items-center justify-between rounded-xl border border-border p-4">
          <div>
            <p className="font-medium">Accepting orders</p>
            <p className="text-xs text-muted-foreground">Pause Take Away & Delivery when closed</p>
          </div>
          <button
            type="button"
            onClick={() => setAccepting((v) => !v)}
            className={`relative h-6 w-11 rounded-full transition ${accepting ? "bg-primary" : "bg-muted"}`}
          >
            <span
              className={`absolute top-0.5 size-5 rounded-full bg-white shadow transition ${
                accepting ? "left-5" : "left-0.5"
              }`}
            />
          </button>
        </div>
        <Button
          className="w-full rounded-full"
          onClick={() => toast.success("Settings saved (demo — connect Firebase later)")}
        >
          Save changes
        </Button>
      </div>
    </div>
  );
}
