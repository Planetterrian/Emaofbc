import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Environmental Managers Association of BC',
  description: 'Professional network for environmental managers in British Columbia',
  openGraph: {
    title: 'Environmental Managers Association of BC',
    description: 'Professional network for environmental managers in British Columbia',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900">
        {children}
      </body>
    </html>
  );
}
