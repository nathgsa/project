// app/layout.tsx
import '@/app/style/global.css';
import { inter } from '@/app/ui/fonts';
import { Metadata } from 'next';
import { SessionProvider } from 'next-auth/react';

export const metadata: Metadata = {
  title: {
    template: '%s | OTCal',
    default: 'OTCal',
  },
  description: 'My OTCal built with App Router.',
  metadataBase: new URL('https://project-beta-nine-97.vercel.app'),
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
