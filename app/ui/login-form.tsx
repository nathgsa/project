'use client';

import { useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Button } from '@/app/ui/button';
import Image from 'next/image'; // ✅ Import Next.js Image
import GoogleIcon from '@/public/google.svg'; // SVG file in /public
import { ArrowRightIcon } from '@heroicons/react/20/solid';

export default function LoginForm() {

  const handleGoogleSignIn = async () => {
    await signIn("google", {
      callbackUrl: "/dashboard",
      prompt: "select_account",
    });
  };



  return (
    // <div className="space-y-4">
    //   {error && (
    //     <p className="text-sm text-red-600 text-center">
    //       {error === "AccessDenied"
    //         ? "Your Google account is not authorized."
    //         : "Login failed. Please try again."}
    //     </p>
    //   )}

      <Button onClick={handleGoogleSignIn} className="w-full flex items-center justify-center gap-2">
        {/* Use Next.js Image for SVG */}
        <Image src={GoogleIcon} alt="Google" width={20} height={20} />
        Continue with Google
        <ArrowRightIcon className="ml-auto h-5 w-5 text-black" />
      </Button>
    // </div>
  );
}
