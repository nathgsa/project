// app/ui/login-form.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Button } from '@/app/ui/button';
import { AtSymbolIcon } from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/20/solid';

export default function LoginForm() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const handleGoogleSignIn = async () => {
    await signIn("google", {
      callbackUrl: "/dashboard",
      prompt: "select_account",
    });
  };

  return (
    <div className="space-y-4">
      {error === "AccessDenied" && (
        <p className="text-sm text-red-600 text-center">
          Your Google account is not authorized to access this app.
        </p>
      )}

      <Button onClick={handleGoogleSignIn} className="w-full">
        <AtSymbolIcon className="mr-2 h-5 w-5" />
        Continue with Google
        <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
      </Button>
    </div>
  );
}
