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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}

// export const dynamic = 'force-dynamic';
// export const revalidate = 0;

// export const headers = {
//   'Cache-Control': 'no-store',
// };
