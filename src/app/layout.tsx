import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import './globals.css';

import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { PopupWidget } from '@/components/PopupWidget';
import FcmClient from '@/components/FcmClient';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'B-Push',
  description: 'next app for B-Push',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang='en'
      suppressHydrationWarning
    >
      <body className={inter.className}>
        <FcmClient />
        <ThemeProvider attribute='class'>
          <Navbar />
          <div>{children}</div>
          <Footer />
          <PopupWidget />
        </ThemeProvider>
      </body>
    </html>
  );
}
