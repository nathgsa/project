// app/dashboard/page.tsx
"use client";

import { lusitana } from "@/app/ui/fonts";
import { Suspense } from "react";
import DashboardGuard from "@/app/ui/dashboard/dashboard-guard";
import { useSession } from "next-auth/react";
import AddRemoveUsers from "@/app/components/AddRemoveUsers";
import Link from "next/link";
import Image from "next/image";


export default function DashboardPage() {
  const { data: session, status } = useSession();
  const loading = status === "loading";

  // Dashboard cards info with background images (no solid bg colors)
  const dashboardCards = [
  {
    name: "EWT",
    href: "/dashboard/ewt",
    image: "/calculator-bg.jpg", // just the path
  },
  {
    name: "Outs",
    href: "/dashboard/outs",
    image: "/cut-bg.jpg",
  },
  {
    name: "Large Format",
    href: "/dashboard/printingtools",
    image: "/paper-bg.jpg",
  },
  {
    name: "Roll to Sheet",
    href: "/dashboard/rolltosheet",
    image: "/wieght-bg.png",
  },
  {
    name: "Reciept",
    href: "/dashboard/reciept",
    image: "/reciept-bg.jpg",
  },
];


  return (
    <DashboardGuard>
      <main className="p-4">
        <div className="shadow rounded-[5px] p-4 pt-12">
          <h1 className={`${lusitana.className} mb-2 text-xl md:text-2xl`}>
            Dashboard
          </h1>
          <p className="mb-6 text-gray-600 text-sm md:text-base">
            Welcome back, {loading ? "..." : session?.user?.name}!
          </p>
          {/* Role badge */}
          <span className="inline-block mt-3 px-3 py-1 text-xs font-medium rounded-full bg-white/20">
            Role: {session?.user?.role === "member" ? "User" : session?.user?.role ?? "User"}
          </span>
        </div>

        {/* Admin Panel (unchanged) */}
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
        
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-5 mt-6">
          <Suspense>
            {dashboardCards.map((card, index) => (
              <Link
                key={card.name}
                href={card.href}
                className="group relative h-44 rounded-xl overflow-hidden shadow-lg transition-transform hover:scale-105"
              >
                {/* IMAGE */}
                <Image
                  src={card.image}
                  alt={card.name}
                  fill
                  priority={index === 0}
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className="object-cover"
                />

                {/* OVERLAY */}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/55 transition-colors z-10" />

                {/* TEXT */}
                <div className="absolute inset-0 z-20 flex items-center justify-center">
                  <span className="text-white text-xl font-semibold tracking-wide">
                    {card.name}
                  </span>
                </div>
              </Link>
            ))}
          </Suspense>
        </div>

      </main>
    </DashboardGuard>
  );
}