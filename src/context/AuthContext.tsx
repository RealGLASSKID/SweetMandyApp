"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  GoogleAuthProvider,
  signInWithPopup,
  type User as FbUser,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase/config";
import type { UserRole } from "@/types";

export type AuthUser = {
  uid: string;
  email: string | null;
  displayName: string | null;
  phone?: string;
  photoURL?: string | null;
  role: UserRole;
};

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function isBootstrapAdmin(email: string | null | undefined): boolean {
  if (!email) return false;
  const raw = process.env.NEXT_PUBLIC_ADMIN_EMAILS || "";
  const list = raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return list.includes(email.trim().toLowerCase());
}

async function upsertUserProfile(fbUser: FbUser): Promise<AuthUser> {
  const ref = doc(db, "users", fbUser.uid);
  let existing: Record<string, unknown> | undefined;
  try {
    const snap = await getDoc(ref);
    existing = snap.exists() ? (snap.data() as Record<string, unknown>) : undefined;
  } catch (e) {
    console.warn("[auth] read users failed", e);
  }

  let role: UserRole = (existing?.role as UserRole) || "customer";
  if (isBootstrapAdmin(fbUser.email)) role = "admin";

  const payload = {
    email: fbUser.email,
    fullName: fbUser.displayName || existing?.fullName || "",
    photoURL: fbUser.photoURL || existing?.photoURL || null,
    phone: existing?.phone || "",
    role,
    provider: fbUser.providerData?.[0]?.providerId || "password",
    updatedAt: serverTimestamp(),
    ...(existing ? {} : { createdAt: serverTimestamp() }),
  };

  try {
    await setDoc(ref, payload, { merge: true });
  } catch (e) {
    console.warn("[auth] write users failed", e);
  }

  return {
    uid: fbUser.uid,
    email: fbUser.email,
    displayName: fbUser.displayName || (existing?.fullName as string) || null,
    phone: (payload.phone as string) || undefined,
    photoURL: fbUser.photoURL || (existing?.photoURL as string) || null,
    role,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      try {
        if (fbUser) {
          setUser(await upsertUserProfile(fbUser));
        } else {
          setUser(null);
        }
      } catch {
        if (fbUser) {
          setUser({
            uid: fbUser.uid,
            email: fbUser.email,
            displayName: fbUser.displayName,
            photoURL: fbUser.photoURL,
            role: isBootstrapAdmin(fbUser.email) ? "admin" : "customer",
          });
        } else {
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    });
    return () => unsub();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      async signIn(email, password) {
        await signInWithEmailAndPassword(auth, email, password);
      },
      async signInWithGoogle() {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: "select_account" });
        await signInWithPopup(auth, provider);
      },
      async signOut() {
        await fbSignOut(auth);
      },
    }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}