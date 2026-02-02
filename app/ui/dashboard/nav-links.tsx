'use client';

import {
  HomeIcon,
  CalculatorIcon,
  ClipboardIcon,
  PrinterIcon,
  ArrowsRightLeftIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import clsx from 'clsx';

export default function NavLinks() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const memberLinks = [
    { name: 'Home', href: '/dashboard', icon: HomeIcon },
    { name: 'EWT', href: '/dashboard/ewt', icon: CalculatorIcon },
    { name: 'Outs', href: '/dashboard/outs', icon: ClipboardIcon },
    { name: 'Large Formats', href: '/dashboard/printingtools', icon: PrinterIcon },
    { name: 'Roll to Sheet', href: '/dashboard/rolltosheet', icon: ArrowsRightLeftIcon },
  ];

  const adminLinks = [
    { name: 'Admin', href: '/dashboard/admin', icon: ShieldCheckIcon },
  ];

  const links = session?.user?.role === 'admin' ? [...memberLinks, ...adminLinks] : memberLinks;

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        const isActive = pathname.startsWith(link.href);

        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3',
              {
                'bg-sky-100 text-blue-600': isActive,
              },
            )}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
