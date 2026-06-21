import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { generateOrganizationSchema } from '@/lib/schema';

export const metadata: Metadata = {
  title: 'Environmental Managers Association of BC',
  description:
    'Professional network for environmental managers in British Columbia. Advancing environmental due diligence and excellence.',
  openGraph: {
    title: 'Environmental Managers Association of BC',
    description:
      'Professional network for environmental managers in British Columbia. Advancing environmental due diligence and excellence.',
    type: 'website',
    url: process.env.NEXT_PUBLIC_SITE_URL,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Environmental Managers Association of BC',
    description: 'Professional network for environmental managers in BC',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateOrganizationSchema()),
          }}
        />
      </head>
      <body className="bg-white text-gray-900">
        <Header />
        <div className="min-h-[calc(100vh-200px)]">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
