'use client';

import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardGuard({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login'); // force redirect if session expired or user is signed out
    }
  }, [status, router]);

  if (status === 'loading') return null; // optional loading state

  return <>{children}</>;
}
