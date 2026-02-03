// app/dashboard/page.tsx
"use client";

import { lusitana } from "@/app/ui/fonts";
import Clock from "@/app/ui/dashboard/clock";
import Calendar from "@/app/ui/dashboard/calendar";
import Calculator from "@/app/ui/dashboard/calculator";
import { Suspense } from "react";
import DashboardGuard from "@/app/ui/dashboard/dashboard-guard";
import { useSession } from "next-auth/react";
import AddRemoveUsers from "@/app/components/AddRemoveUsers";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const loading = status === "loading";

  return (
    <DashboardGuard>
      <main className="p-4">
        <div className="bg-blue-100 rounded-[5px] p-4">
          <h1 className={`${lusitana.className} mb-2 text-xl md:text-2xl`}>
            Dashboard
          </h1>
          <p className="mb-6 text-gray-600 text-sm md:text-base">
            Welcome back, {loading ? "..." : session?.user?.name}!
          </p>
          {/* Role badge */}
          <span className="inline-block mt-3 px-3 py-1 text-xs font-medium rounded-full bg-white/20">
            Role: {session?.user?.role ?? "member"}
          </span>
        </div>

        {/* Admin Panel */}
        {session?.user?.role === "admin" && (
          <div className="bg-gray-50 rounded-xl p-4 my-4 shadow-sm">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  Admin Panel
                </h2>
                <p className="text-sm text-gray-500">
                  Add members
                </p>
              </div>
            <AddRemoveUsers />
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <Suspense>
            <Clock />
            <Calendar />
            <Calculator />
          </Suspense>
        </div>
      </main>
    </DashboardGuard>
  );
}
