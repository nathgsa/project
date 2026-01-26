import Link from 'next/link';
import NavLinks from './nav-links';
import AppLogo from '../app-logo';
import { PowerIcon } from '@heroicons/react/24/outline';
import { getCurrentUser, signOut } from '@/app/lib/auth';

export default async function SideNav() {
  const user = await getCurrentUser(); // server-side fetch

  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      <Link
        className="mb-2 flex h-20 items-end justify-start rounded-md bg-blue-900 p-4 md:h-40"
        href="/"
      >
        <div className="w-32 text-white md:w-40">
          <AppLogo />
        </div>
      </Link>

      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks />

        {user && (
          <div className="hidden md:flex md:flex-col md:items-center md:space-y-2 md:rounded-md md:bg-gray-50 md:p-3">
            <img
              src={user.image || '/default-avatar.png'}
              alt={user.name || 'User'}
              className="h-12 w-12 rounded-full object-cover"
            />
            <span className="text-sm font-medium text-gray-700">
              {user.name}
            </span>
          </div>
        )}

        <form
          action={async () => {
            'use server';
            await signOut({ redirectTo: '/' });
          }}
        >
          <button className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3">
            <PowerIcon className="w-6" />
            <div className="hidden md:block">Sign Out</div>
          </button>
        </form>
      </div>
    </div>
  );
}
