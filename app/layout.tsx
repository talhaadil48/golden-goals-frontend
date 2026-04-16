import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'Golden Goals – School Scheduling',
  description: 'Admin-driven school scheduling and booking system for Golden Goals.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen" style={{ background: '#F7F9F9', color: '#1F2A2E' }}>
        {children}
      </body>
    </html>
  );
}
