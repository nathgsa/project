// app/page.tsx
import AppLogo from '@/app/ui/app-logo';
// import { ArrowRightIcon } from '@heroicons/react/24/outline';
import GoogleLogo from '@/app/ui/google-logo';
import { getCurrentUser } from '@/app/lib/auth';
import { redirect } from 'next/navigation';

export default async function Page() {
  const user = await getCurrentUser();
  
  // If user is already logged in, redirect to dashboard
  if (user) {
    redirect('/dashboard');
  }

  return (
    <main className="flex min-h-screen flex-col p-6">
      <div className="flex h-20 shrink-0 items-end rounded-lg bg-blue-900 p-4 md:h-52">
        <AppLogo />
      </div>

      <div className="mt-4 flex grow flex-col gap-4 md:flex-row">
        <div className="flex flex-col justify-center gap-6 rounded-lg bg-gray-50 px-6 py-10 md:w-2/5 md:px-20">
          <p className="text-xl text-gray-800 md:text-3xl md:leading-normal">
            <strong>Welcome to myApp.</strong>
          </p>
          
          <p className="text-gray-600">
            Sign in with your Google account to access the dashboard.
          </p>

          {/* GOOGLE SIGN IN BUTTON */}
          <a
            href="/api/auth/signin/google"
            className="flex items-center justify-center gap-3 self-start rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 md:text-base"
          >
            <GoogleLogo className="h-5 w-5" />
            <span>Continue with Google</span>
          </a>
        </div>

        <div className="flex items-center justify-center p-6 md:w-3/5 md:px-28 md:py-12">
          {/* Hero Image (optional) */}
        </div>
      </div>
    </main>
  );
}