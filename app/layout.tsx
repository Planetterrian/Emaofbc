import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SkipLink } from '@/components/SkipLink';
import { generateOrganizationSchema } from '@/lib/schema';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://emaofbc.com';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Environmental Managers Association of BC',
  description:
    'The premier professional network for environmental managers in British Columbia — advancing environmental due diligence, education, and excellence.',
  alternates: { canonical: siteUrl },
  openGraph: {
    title: 'Environmental Managers Association of BC',
    description:
      'The premier professional network for environmental managers in British Columbia — advancing environmental due diligence, education, and excellence.',
    type: 'website',
    url: siteUrl,
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'EMA of BC' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Environmental Managers Association of BC',
    description: 'Professional network for environmental managers in BC',
    images: ['/opengraph-image'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jakarta.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateOrganizationSchema()),
          }}
        />
      </head>
      <body className="bg-canvas text-ink antialiased">
        <SkipLink />
        <Header />
        <main id="main-content" className="min-h-[calc(100vh-200px)]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
