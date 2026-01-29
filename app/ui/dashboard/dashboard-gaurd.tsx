'use client';

import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardGuard({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login'); // force redirect to login
    }
  }, [status, router]);

  if (status === 'loading') return null; // optional: show a loading screen

  return <>{children}</>;
}
