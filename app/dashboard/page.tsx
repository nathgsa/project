// app/dashboard/page.tsx
import { lusitana } from '@/app/ui/fonts';
import Clock from '@/app/ui/dashboard/clock';
import Calendar from '@/app/ui/dashboard/calendar';
import Calculator from '@/app/ui/dashboard/calculator';
import { Suspense } from 'react';
import DashboardGuard from '@/app/ui/dashboard/dashboard-gaurd';
import { auth } from "@/app/lib/auth"; // ✅ USE THIS
import AddRemoveUsers from "@/app/components/AddRemoveUsers";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function DashboardPage() {
  const session = await auth(); // ✅ NO getServerSession

  return (
    <DashboardGuard>
      <main>
        <div className="bg-blue-100 rounded-[5px] p-4">
          <h1 className={`${lusitana.className} mb-2 text-xl md:text-2xl`}>
            Dashboard
          </h1>
          <p className="mb-6 text-gray-600 text-sm md:text-base">
            Welcome back, {session?.user?.name}!
          </p>
        </div>

        {session?.user?.role === "admin" && (
          <div className="bg-gray-100 p-4 my-4 rounded">
            <h2 className="text-lg font-semibold mb-2">Admin Panel</h2>
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
