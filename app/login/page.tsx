'use client';

import { Suspense } from 'react';
import AppLogo from '@/app/ui/app-logo';
import LoginForm from '@/app/ui/login-form';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-4 bg-gray-50">
      <div className="flex w-full flex-col items-center justify-center space-y-6">
        
        {/* Logo */}
        <div className="flex items-center justify-center space-y-6">
          <AppLogo showText={false} size={500} />
        </div>

        {/* Login form */}
        <div className="flex w-full justify-center">
          <div className="w-full max-w-md"> 
            <Suspense>
              <LoginForm />
            </Suspense>
          </div>
        </div>
        
      </div>
    </main>
  );
}