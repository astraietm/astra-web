import type { Metadata, Viewport } from 'next';
import './globals.css';
import 'lenis/dist/lenis.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Providers } from '@/lib/providers';

export const metadata: Metadata = {
  title: 'ASTRA 2026 — Department of Cyber Security | KMCT Institute of Emerging Technology and Management, Calicut, Kerala',
  description:
    'ASTRA 2026 is the Flagship National Cyber Security Symposium & 24H National CTF hosted by the Department of Cyber Security, KMCT Institute of Emerging Technology and Management, Calicut, Kerala on October 6 & 7, 2026.',
  keywords: [
    'ASTRA 2026',
    'ASTRA Cyber Security',
    'Department of Cyber Security',
    'KMCT Institute of Emerging Technology and Management',
    'KMCT Calicut Kerala',
    'National CTF 2026',
    'Ethical Hacking Symposium',
    'October 6 7 2026 Kerala',
  ],
  authors: [{ name: 'Department of Cyber Security, KMCT' }],
  creator: 'KMCT Institute of Emerging Technology and Management',
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://astra.kmct.edu.in',
    title: 'ASTRA 2026 — Department of Cyber Security | KMCT Calicut, Kerala (Oct 6 & 7)',
    description:
      'The Flagship National Cyber Security Symposium & 24H National CTF WarGames hosted by KMCT Institute of Emerging Technology and Management, Calicut on October 6 & 7, 2026.',
    siteName: 'ASTRA 2026 — KMCT Cyber Security',
  },
};

export const viewport: Viewport = {
  themeColor: '#F79CFF',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Anton&family=Bebas+Neue&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500;700&family=Pixelify+Sans:wght@400;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://api.fontshare.com/v2/css?f[]=general-sans@200,300,400,500,600,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-graph-paper text-foreground antialiased flex flex-col justify-between selection:bg-th-pink selection:text-black">
        <Providers>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
