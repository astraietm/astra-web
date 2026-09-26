import type { Metadata, Viewport } from 'next';
import './globals.css';
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
