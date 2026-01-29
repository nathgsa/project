// app/layout.tsx
import '@/app/style/global.css';
import { inter } from '@/app/ui/fonts';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | myApp',
    default: 'myApp',
  },
  description: 'My APP Dashboard built with App Router.',
  metadataBase: new URL('https://project-beta-nine-97.vercel.app'),
};

// Force dynamic rendering + no cache globally
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
