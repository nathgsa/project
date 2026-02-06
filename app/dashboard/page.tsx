// app/dashboard/page.tsx
"use client";

import { lusitana } from "@/app/ui/fonts";
import { Suspense } from "react";
import DashboardGuard from "@/app/ui/dashboard/dashboard-guard";
import { useSession } from "next-auth/react";
import AddRemoveUsers from "@/app/components/AddRemoveUsers";
import Link from "next/link";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const loading = status === "loading";

  // Dashboard cards info with background images
  const dashboardCards = [
    {
      name: "EWT",
      href: "/dashboard/ewt",
      color: "bg-indigo-400",
      backgroundImage: "url('/images/calculator-bg.jpg')", // replace with your actual image path
    },
    {
      name: "Outs",
      href: "/dashboard/outs",
      color: "bg-green-400",
      backgroundImage: "url('/images/cut-paper.jpg')",
    },
    {
      name: "Large Format",
      href: "/dashboard/printingtools",
      color: "bg-yellow-400",
      backgroundImage: "url('/images/paper.jpg')",
    },
    {
      name: "Roll to Sheet",
      href: "/dashboard/rolltosheet",
      color: "bg-pink-400",
      backgroundImage: "url('/images/weight.jpg')",
    },
  ];

  return (
    <DashboardGuard>
      <main className="p-4">
        <div className="shadow rounded-[5px] p-4">
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
        
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4 mt-6">
          <Suspense>
            {dashboardCards.map((card) => (
              <Link
                key={card.name}
                href={card.href}
                className={`${card.color} hover:scale-105 transition-transform rounded-lg p-6 flex items-center justify-center text-white font-semibold text-lg shadow-lg`}
                style={{
                  backgroundImage: card.backgroundImage,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                {/* Optional overlay for better text visibility */}
                <div className="bg-black bg-opacity-50 p-2 rounded">
                  {card.name}
                </div>
              </Link>
            ))}
          </Suspense>
        </div>
      </main>
    </DashboardGuard>
  );
}