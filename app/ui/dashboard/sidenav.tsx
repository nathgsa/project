'use client';

import Link from 'next/link';
import NavLinks from './nav-links';
import AppLogo from '../app-logo';
import { PowerIcon } from '@heroicons/react/24/outline';
import { signOut } from '@/app/lib/auth';
import { useRouter } from 'next/navigation';

export default function SideNav() {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({
      redirectTo: '/login',
    });

    // hard refresh to kill cached auth state
    router.replace('/login');
    router.refresh();
  };

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

      <div className="flex grow flex-row justify-between md:flex-col">
        <NavLinks />

        <button
          onClick={handleSignOut}
          className="flex h-[48px] w-full items-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600"
        >
          <PowerIcon className="w-6" />
          <span className="hidden md:block">Sign Out</span>
        </button>
      </div>
    </div>
  );
}
