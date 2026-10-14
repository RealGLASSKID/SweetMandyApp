"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase/config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import type { UserRole } from "@/types";

export default function AdminStaffPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("rider");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error("Password at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      // Note: creating users while logged in as admin may switch session on client SDK.
      // For production use a Cloud Function / Admin SDK. This works for setup with care.
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
      await updateProfile(cred.user, { displayName: fullName.trim() });
      await setDoc(doc(db, "users", cred.user.uid), {
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        role,
        createdAt: serverTimestamp(),
        createdBy: "admin",
      });
      toast.success(`${role} account created for ${email}. Ask them to sign in on /login.`);
      setFullName("");
      setEmail("");
      setPhone("");
      setPassword("");
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "code" in err
          ? String((err as { code: string }).code).replace("auth/", "").replace(/-/g, " ")
          : "Could not create account";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg">
      <h1 className="font-display text-2xl font-extrabold">Staff & riders</h1>
      <p className="text-sm text-muted-foreground">
        Register riders and staff with email + password. They sign in on the normal login page.
        Riders open <strong>/rider</strong>. Admins open <strong>/admin</strong>.
      </p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4 rounded-2xl border border-border bg-card p-6">
        <div>
          <label className="text-sm font-medium">Role</label>
          <select
            className="mt-1.5 flex h-11 w-full rounded-xl border border-input bg-background px-3 text-sm"
            value={role}
            onChange={(e) => setRole(e.target.value as UserRole)}
          >
            <option value="rider">Rider</option>
            <option value="admin">Admin / staff</option>
            <option value="customer">Customer</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-medium">Full name</label>
          <Input className="mt-1.5" required value={fullName} onChange={(e) => setFullName(e.target.value)} />
        </div>
        <div>
          <label className="text-sm font-medium">Email (Gmail / any)</label>
          <Input className="mt-1.5" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label className="text-sm font-medium">Phone</label>
          <Input className="mt-1.5" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <div>
          <label className="text-sm font-medium">Password</label>
          <Input
            className="mt-1.5"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Min 6 characters"
          />
        </div>
        <Button type="submit" className="w-full rounded-full" disabled={loading}>
          {loading ? "Creating…" : "Create account"}
        </Button>
        <p className="text-xs text-muted-foreground">
          Tip: after creating a rider, sign back in with your admin account if the session switched.
        </p>
      </form>
    </div>
  );
}
