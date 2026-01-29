import { lusitana } from '@/app/ui/fonts';
import Clock from '@/app/ui/dashboard/clock';
import Calendar from '@/app/ui/dashboard/calendar';
import Calculator from '@/app/ui/dashboard/calculator';
import { Suspense } from 'react';
import { Metadata } from 'next';
// import DashboardGuard from '@/app/ui/dashboard/dashboard-gaurd';

export const metadata: Metadata = {
  title: 'Dashboard',
  // headers: {
  //   'Cache-Control': 'no-store', // prevent browser cache
  // },
};

export default function DashboardPage() {
  return (
    //<DashboardGuard>
      <main>
        <div className="bg-blue-100 rounded-[5px] p-4">
          <h1 className={`${lusitana.className} mb-2 text-xl md:text-2xl`}>Dashboard</h1>
          <p className="mb-6 text-gray-600 text-sm md:text-base">
            Welcome back!
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 center">
          <Suspense>
            <Clock />
            <Calendar />
            <Calculator />
          </Suspense>
        </div>
      </main>
    //</DashboardGuard>
  );
}
