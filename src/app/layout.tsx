import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ChatProvider } from '@/contexts/chat-context';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Finder',
  description:
    'Ask about anything you want to know and get and answer instantly.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' className='dark'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <main className='min-h-screen text-primary selection:text-purple-400 selection:bg-purple-300/10'>
          <ChatProvider>{children}</ChatProvider>
        </main>
      </body>
    </html>
  );
}
