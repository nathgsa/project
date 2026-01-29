// app/login/page.tsx
import AppLogo from '@/app/ui/app-logo';
import LoginForm from '@/app/ui/login-form';
import { Suspense } from 'react';
import { Metadata } from 'next';
import { auth } from '@/app/lib/auth';
import { redirect } from 'next/navigation';
// import { getCurrentUser } from '@/app/lib/auth';
// import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Login',
};

export default async function LoginPage() {
  const session = await auth();

  if (session) {
    redirect('/dashboard');
  }

  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
        <div className="flex h-20 w-full items-end rounded-lg bg-blue-900 p-3 md:h-36">
          <div className="w-32 text-white md:w-36">
            <AppLogo />
          </div>
        </div>
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}