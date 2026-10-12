"use client";

import { Skeleton } from "@/components/ui/skeleton";

const customers = [
  { id: "u1", name: "Ada Okafor", email: "ada@email.com", phone: "0803 111 2222", area: "Ijegun", orders: 12 },
  { id: "u2", name: "Chidi Nwosu", email: "chidi@email.com", phone: "0802 333 4444", area: "Ikotun", orders: 8 },
  { id: "u3", name: "Fatima Bello", email: "fatima@email.com", phone: "0801 555 6666", area: "Egbe", orders: 5 },
  { id: "u4", name: "Tunde Bakare", email: "tunde@email.com", phone: "0805 777 8888", area: "Ikeja", orders: 21 },
  { id: "u5", name: "Ngozi Eze", email: "ngozi@email.com", phone: "0806 999 0000", area: "Surulere", orders: 3 },
];

export default function AdminCustomersPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold">Customers</h1>
      <p className="text-sm text-muted-foreground">Registered customers (demo data)</p>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead className="border-b border-border bg-muted/50 text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Area</th>
              <th className="px-4 py-3">Orders</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {customers.map((c) => (
              <tr key={c.id} className="hover:bg-muted/30">
                <td className="px-4 py-3 font-medium">{c.name}</td>
                <td className="px-4 py-3">
                  <p>{c.email}</p>
                  <p className="text-xs text-muted-foreground">{c.phone}</p>
                </td>
                <td className="px-4 py-3">{c.area}</td>
                <td className="px-4 py-3 font-semibold">{c.orders}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
