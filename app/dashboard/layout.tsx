// app/dashboard/layout.tsx
import SideNav from '@/app/ui/dashboard/sidenav';
import { getCurrentUser } from '@/app/lib/auth';
import { redirect } from 'next/navigation';

export default async function Layout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  
  // Redirect to login if not authenticated
  if (!user) {
    redirect('/login');
  }

  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav user={user} />
      </div>
      <div className="grow p-6 md:overflow-y-auto md:p-12">{children}</div>
    </div>
  );
}