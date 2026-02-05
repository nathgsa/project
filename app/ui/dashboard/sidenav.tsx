"use client";

import Link from "next/link";
import NavLinks from "./nav-links";
import AppLogo from "../app-logo";
import { PowerIcon } from "@heroicons/react/24/outline";
import { signOut } from "next-auth/react";

export default function SideNav() {
  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2 bg-gray-100">

      {/* Logo */}
      <Link
        href="/dashboard"
        className="flex h-20 w-full md:h-40 items-center justify-center mb-4"
      >
        <AppLogo showText={false} size={250} />
      </Link>

      {/* Nav container */}
      <div className="flex flex-1 flex-col">

        {/* Nav links – FORCE COLUMN */}
        <div className="flex flex-col gap-2 w-full">
          <NavLinks />
        </div>

        {/* Flexible spacer */}
        <div className="flex-1" />

        {/* Sign out button */}
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex h-[48px] items-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600"
        >
          <PowerIcon className="w-6" />
          <span className="hidden md:block">Sign Out</span>
        </button>

      </div>
    </div>
  );
}
