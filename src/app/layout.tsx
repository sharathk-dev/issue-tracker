import { QueryProvider } from '@/components/providers/query-providers';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Footer } from './footer';
import './globals.css';
import { Navbar } from './navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Issue Tracker',
  description: 'A modern issue tracking application',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </QueryProvider>
      </body>
    </html>
  );
}
