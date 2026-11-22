import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'How In थंडीत | Winter Smog & Air Pollution Family Guide',
  description:
    'A GenAI-powered assistant helping Indian families and communities navigate severe winter smog with low-cost, practical household hacks.',
  keywords: ['AQI', 'Air Quality', 'Winter Smog', 'Delhi Smog', 'Pune AQI', 'PM2.5', 'Family Air Protection'],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#0284c7',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased flex flex-col">
        {children}
      </body>
    </html>
  );
}
