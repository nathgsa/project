'use client';

import { Suspense } from 'react';
import AppLogo from '@/app/ui/app-logo';
import LoginForm from '@/app/ui/login-form';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen justify-center bg-gray-50">
      <div className="flex w-full flex-col items-center pt-16 space-y-6">
        
        {/* Logo */}
        <div className="flex items-center justify-center">
          <AppLogo showText={false} size={450} />
        </div>

        {/* Login form */}
        <div className="w-full max-w-xs">
          <Suspense>
            <LoginForm />
          </Suspense>
        </div>

      </div>
    </main>
  );
}
