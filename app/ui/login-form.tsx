'use client';

import { lusitana } from '@/app/ui/fonts';
import { AtSymbolIcon } from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { Button } from '@/app/ui/button';
import { signIn } from 'next-auth/react';

export default function LoginForm() {
  const handleGoogleSignIn = async () => {
    await signIn("google", {
      callbackUrl: "/dashboard",
      prompt: "select_account", // <-- forces Google account chooser
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
        <h1 className={`${lusitana.className} mb-3 text-2xl`}>Sign in to continue</h1>
        <p className="mb-6 text-sm text-gray-600">
          Only whitelisted Google accounts are allowed.
        </p>

        <Button onClick={handleGoogleSignIn} className="w-full">
          <AtSymbolIcon className="mr-2 h-5 w-5" />
          Continue with Google
          <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
        </Button>
      </div>
    </div>
  );
}
