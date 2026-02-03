// app/ui/dashboard/sidenav.tsx
"use client";

import Link from "next/link";
import NavLinks from "./nav-links";
import AppLogo from "../app-logo";
import { PowerIcon } from "@heroicons/react/24/outline";
import { signOut } from "next-auth/react";

export default function SideNav() {
  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2 bg-sky-200">
      <Link
        href="/dashboard"
        className="flex h-20 w-full md:h-40 items-center justify-center mb-4"
      >
        <AppLogo showText={false} size={250} />
      </Link>

      {/* Main nav container */}
      <div className="flex grow flex-col justify-between space-y-2">
        
        <div className="flex flex-col">
          <NavLinks />
        </div>

        {/* Sign out stays bottom */}
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex h-[48px] w-full items-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600"
        >
          <PowerIcon className="w-6" />
          <span className="hidden md:block">Sign Out</span>
        </button>
      </div>
    </div>
  );
}
