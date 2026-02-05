// app/dashboard/layout.tsx
import SideNav from '@/app/ui/dashboard/sidenav';

export default async function Layout({ children }: { children: React.ReactNode }) {

  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav/>
      </div>
      <div className="grow p-0 md:overflow-y-auto">{children}</div>
    </div>
  );
}