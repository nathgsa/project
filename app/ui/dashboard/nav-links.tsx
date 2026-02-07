'use client';

import {
  HomeIcon,
  CalculatorIcon,
  ClipboardIcon,
  PrinterIcon,
  ArrowsRightLeftIcon,
  ReceiptPercentIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

// Map of links to display in the side navigation
const links = [
  { name: 'Home', href: '/dashboard', icon: HomeIcon, bgImage: '/home-bg.jpg' },
  { name: 'EWT', href: '/dashboard/ewt', icon: CalculatorIcon, bgImage: '/calculator-bg.jpg' },
  { name: 'Outs', href: '/dashboard/outs', icon: ClipboardIcon, bgImage: '/cut-bg.jpg' },
  { name: 'Large Formats', href: '/dashboard/printingtools', icon: PrinterIcon, bgImage: '/paper-bg.jpg' },
  { name: 'Roll to Sheet', href: '/dashboard/rolltosheet', icon: ArrowsRightLeftIcon, bgImage: '/weight-bg.png' },
  { name: 'Reciept', href: '/dashboard/reciept', icon: ReceiptPercentIcon, bgImage: '/reciept-bg.jpg' },
];

interface NavLinksProps {
  onLinkClick?: () => void;
}

export default function NavLinks({ onLinkClick }: NavLinksProps) {
  const pathname = usePathname();

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        const isActive = pathname === link.href;

        return (
          <Link
            key={link.name}
            href={link.href}
            onClick={onLinkClick}
            className={clsx(
              'flex h-[48px] grow gap-2 items-center rounded-md p-3 text-sm font-medium md:flex-none md:justify-start md:p-2 md:px-3 relative overflow-hidden group',
              {
                'bg-sky-100 text-blue-600': isActive,
                'text-white': !isActive,
              }
            )}
            style={{
              backgroundImage: `url(${link.bgImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {/* Overlay for readability */}
            <div
              className={clsx(
                'absolute inset-0 rounded-md transition-colors',
                isActive ? 'bg-blue-200/50' : 'bg-black/30 group-hover:bg-black/40'
              )}
            />

            {/* Icon and text */}
            <LinkIcon className="w-6 relative z-10" />
            <p className="block text-sm md:text-base relative z-10">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
