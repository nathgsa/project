import AppLogo from '@/app/ui/app-logo';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white px-6">
      
      {/* LOGO */}
      <div className="mb-10 flex items-center justify-center">
        <AppLogo showText={false} size={350} />
      </div>

      {/* CONTENT */}
      <div className="flex w-full max-w-2xl flex-col items-center gap-6 rounded-2xl bg-gray-50 px-8 py-12 text-center shadow-sm">
        
        <p className="text-2xl font-semibold text-gray-900 md:text-3xl">
          Welcome to
        </p>

        <h1 className="text-lg font-medium text-gray-700 md:text-xl">
          Optima Typographics Calculators
        </h1>

        <p className="max-w-md text-sm text-gray-600 md:text-base">
          Easy-to-use calculators built to support
          typographic precision and design workflows.
        </p>

        <Link
          href="/login"
          className="mt-4 inline-flex items-center gap-3 rounded-xl bg-blue-900 px-8 py-3 text-sm font-medium text-white transition hover:bg-blue-700 md:text-base"
        >
          Log in
          <ArrowRightIcon className="w-5" />
        </Link>
      </div>
    </main>
  );
}
