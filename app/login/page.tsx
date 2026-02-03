'use client';

import { Suspense } from 'react';
import AppLogo from '@/app/ui/app-logo';
import LoginForm from '@/app/ui/login-form';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-4 bg-gray-50">
      <div className="flex w-full max-w-[400px] flex-col items-center justify-center space-y-6">
        
        {/* Logo */}
        <div className="flex items-center justify-center">
          <AppLogo showText={false} size={250} />
        </div>
<br><br><br><br><br><br><br><br>
        {/* Login form */}
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}