'use client';

import { signIn } from 'next-auth/react';
import { Button } from '@/app/ui/button';
import Image from 'next/image';
import GoogleIcon from '@/public/google.svg';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { useSearchParams } from 'next/navigation';

export default function LoginForm() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const handleGoogleSignIn = () => {
    // ⚠️ signIn always redirects — no await, no try/catch
    signIn("google", {
      callbackUrl: "/dashboard",
    });
  };

  return (
    <div className="space-y-4">
      {error && (
        <p className="text-sm text-red-600 text-center">
          {error === "AccessDenied"
            ? "Your Google account is not authorized."
            : "Login failed. Please try again."}
        </p>
      )}

      <Button
        type="button"
        onClick={handleGoogleSignIn}
        className="w-full flex items-center justify-center gap-2"
      >
        <Image src={GoogleIcon} alt="Google" width={20} height={20} />
        Continue with Google
        <ArrowRightIcon className="ml-auto h-5 w-5 text-black" />
      </Button>
    </div>
  );
}
