'use client';

import { Suspense } from 'react';
import AppLogo from '@/app/ui/app-logo';
import LoginForm from '@/app/ui/login-form';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-4 bg-gray-50">
      <div className="flex w-full max-w-[800px] flex-col items-center justify-center space-y-4 -mt-10">
        
        {/* Logo */}
        <div className="flex items-center justify-center -mb-2 space-y-4">
          <AppLogo showText={false} size={280} />
        </div>

        {/* Login form */}
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
