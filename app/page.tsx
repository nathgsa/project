"use client"

import AppLogo from '@/app/ui/app-logo';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import Particles from "@/app/components/Particles";

export default function Page() {
  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-gradient-to-b from-blue-600 via-blue-500 to-blue-400">
      
      {/* Floating particles */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Particles />
      </div>

      {/* Page content */}
      <div className="relative z-10 flex flex-col p-6">
        <div className="flex h-20 shrink-0 items-end rounded-lg p-4 md:h-52">
          <AppLogo />
        </div>
        <div className="mt-4 flex grow flex-col gap-4 md:flex-row">
          <div className="flex flex-col justify-center gap-6 rounded-lg bg-white/20 backdrop-blur-sm px-6 py-10 md:w-2/5 md:px-20">
            <p className="text-xl text-gray-100 md:text-3xl md:leading-normal">
              <strong>Welcome to myApp.</strong> {' '}
            </p>
            <Link
              href="/login"
              className="flex items-center gap-5 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
            >
              <span>Log in</span> <ArrowRightIcon className="w-5 md:w-6" />
            </Link>
          </div>
          <div className="flex items-center justify-center p-6 md:w-3/5 md:px-28 md:py-12">
            {/* Hero image placeholder */}
          </div>
        </div>
      </div>

    </main>
  );
}
