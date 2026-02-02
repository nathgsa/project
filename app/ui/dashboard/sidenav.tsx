'use client';

import Link from "next/link";
import NavLinks from "./nav-links";
import AppLogo from "../app-logo";
import { PowerIcon } from "@heroicons/react/24/outline";
import { signOut } from "next-auth/react";

export default function SideNav() {
  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2 bg-sky-200">
      <br />
      <Link
        className="flex h-20 w-full md:h-40 items-center justify-center"
        href="/dashboard"
      >
        <div className="flex w-full h-full items-center justify-center">
          <AppLogo showText={false} size={250} />
        </div>
      </Link>
      <br />

      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks />

        <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block" />

        {/* ✅ Sign Out using next-auth */}
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
