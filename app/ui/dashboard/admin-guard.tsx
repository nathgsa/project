import { auth } from '@/app/lib/auth';
import { redirect } from 'next/navigation';

export default async function AdminGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session || session.user.role !== 'admin') {
    redirect('/dashboard');
  }

  return <>{children}</>;
}
