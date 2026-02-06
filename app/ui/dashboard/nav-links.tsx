'use client';

import {
  HomeIcon,
  CalculatorIcon,
  ClipboardIcon,
  PrinterIcon,
  ArrowsRightLeftIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

// Map of links to display in the side navigation
const links = [
  { name: 'Home', href: '/dashboard', icon: HomeIcon },
  { name: 'EWT', href: '/dashboard/ewt', icon: CalculatorIcon },
  { name: 'Outs', href: '/dashboard/outs', icon: ClipboardIcon },
  { name: 'Large Formats', href: '/dashboard/printingtools', icon: PrinterIcon },
  { name: 'Roll to Sheet', href: '/dashboard/rolltosheet', icon: ArrowsRightLeftIcon }
];

// Add a prop type for mobile toggle
interface NavLinksProps {
  onLinkClick?: () => void;
}

export default function NavLinks({ onLinkClick }: NavLinksProps) {
  const pathname = usePathname();
  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            onClick={onLinkClick} // <--- closes sidebar on mobile
            className={clsx(
              'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3',
              {
                'bg-sky-100 text-blue-600': pathname === link.href,
              },
            )}
          >
            <LinkIcon className="w-6" />
            <p className="block text-sm md:text-base">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
