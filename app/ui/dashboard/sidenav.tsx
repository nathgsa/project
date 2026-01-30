'use client';

import Link from 'next/link';
import NavLinks from './nav-links';
import AppLogo from '../app-logo';
import { PowerIcon } from '@heroicons/react/24/outline';

export default function SideNav() {
  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      <Link
        className="mb-2 flex h-20 items-end justify-start rounded-md bg-blue-600 p-4 md:h-40"
        href="/dashboard"
      >
        <div className="w-32 text-white md:w-40">
          <AppLogo />
        </div>
      </Link>

      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks />

        <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block" />

        {/* ✅ RELIABLE SIGN OUT */}
        <form action="/api/auth/signout" method="POST">
          <input type="hidden" name="callbackUrl" value="/login" />

          <button
            type="submit"
            className="flex h-[48px] w-full items-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600"
          >
            <PowerIcon className="w-6" />
            <span className="hidden md:block">Sign Out</span>
            
          </button>
        </form>
      </div>
    </div>
  );
}
