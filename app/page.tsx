import AppLogo from '@/app/ui/app-logo';
import Image from 'next/image';
import { signIn } from 'next-auth/react';

export default function Page() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-6">
      <div className="grid w-full max-w-5xl grid-cols-1 overflow-hidden rounded-2xl bg-gray-50 shadow-sm md:grid-cols-2">
        <div className="flex flex-col items-center justify-center">
          <AppLogo showText={false} size={300} />
        </div>

        {/* LEFT — SIGN IN */}
        <div className="flex flex-col items-center justify-center gap-6 px-8 py-16">
          <h2 className="text-xl font-semibold text-gray-900">
            Sign in to continue
          </h2>

          <button
            onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
            className="flex w-full max-w-xs items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
          >
            <Image
              src="/google.svg"
              alt="Google"
              width={20}
              height={20}
            />
            Sign in with Google
          </button>

          <p className="text-center text-xs text-gray-500 max-w-xs">
            Only authorized Google accounts can access this application.
          </p>
        </div>

        {/* RIGHT — BRANDING */}
        <div className="flex flex-col items-center justify-center gap-6 bg-white px-10 py-16 text-center">
          <AppLogo showText={false} size={140} />

          <h1 className="text-2xl font-semibold text-gray-900 md:text-3xl">
            Optima Typographics Calculators
          </h1>

          <p className="max-w-md text-sm text-gray-600 md:text-base">
            Easy-to-use calculators designed to support
            professional typographic and printing workflows.
          </p>
        </div>
      </div>
    </main>
  );
}
