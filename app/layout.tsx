import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Infinity Mind',
  description: 'AI-powered cognitive performance and study optimization platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} antialiased h-screen w-screen overflow-hidden bg-slate-950 text-slate-50`}>
        {/* Electron drag region for frameless window */}
        <div className="h-8 w-full absolute top-0 left-0 z-50 drag-region" style={{ WebkitAppRegion: 'drag' } as any} />
        {children}
      </body>
    </html>
  );
}
