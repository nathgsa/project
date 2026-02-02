// app/dashboard/page.tsx
import { lusitana } from "@/app/ui/fonts";
import Clock from "@/app/ui/dashboard/clock";
import Calendar from "@/app/ui/dashboard/calendar";
import Calculator from "@/app/ui/dashboard/calculator";
import { Suspense } from "react";
import DashboardGuard from "@/app/ui/dashboard/dashboard-guard";
import { auth } from "@/app/lib/auth"; // server-side auth
import AddRemoveUsers from "@/app/components/AddRemoveUsers";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DashboardPage() {
  const session = await auth(); // server-side fetch session from JWT
  const isAdmin = session?.user?.role === "admin";
  return (
    <DashboardGuard>
      <main>
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg p-6 shadow">
          <h1 className={`${lusitana.className} text-2xl md:text-3xl font-semibold`}>
            Dashboard
          </h1>
          <p className="mt-1 text-sm md:text-base opacity-90">
            Welcome back, {session?.user?.name}
          </p>

          {/* Role badge */}
          <span className="inline-block mt-3 px-3 py-1 text-xs font-medium rounded-full bg-white/20">
            Role: {session?.user?.role ?? "member"}
          </span>
        </div>

        {isAdmin && (
          <div className="bg-gray-100 p-4 my-4 rounded shadow-md">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  Admin Panel
                </h2>
                <p className="text-sm text-gray-500">
                  Manage members and access permissions
                </p>
              </div>

              <span className="px-3 py-1 text-xs font-semibold text-red-600 bg-red-100 rounded-full">
                Admin Only
              </span>
            </div>
            <AddRemoveUsers />
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 center">
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
