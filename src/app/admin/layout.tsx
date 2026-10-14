"use client";

import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { RequireAuth } from "@/components/auth/RequireAuth";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth roles={["admin"]}>
      <div className="flex min-h-[calc(100vh-4rem)] flex-col lg:flex-row">
        <AdminSidebar />
        <div className="flex-1 overflow-auto bg-muted/30">
          <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">{children}</div>
        </div>
      </div>
    </RequireAuth>
  );
}
