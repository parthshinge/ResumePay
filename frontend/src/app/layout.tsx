import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { WalletProvider } from '../components/WalletProvider';
import { validateFrontendEnv } from '../lib/env';

// Validate environment variables on build/start
try {
  validateFrontendEnv();
  console.log('✅ Frontend environment variables validated successfully');
} catch (error) {
  console.error('❌ Frontend environment validation failed:');
  console.error(error instanceof Error ? error.message : error);
  // In development, throw to alert the developer
  // In production, we'll handle it gracefully
  if (process.env.NODE_ENV === 'development') {
    throw error;
  }
}

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ResumePay AI - Pay-per-Resume Review on Base',
  description: 'Private, pay-per-use AI resume review platform on Base chain using b402 SDK',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WalletProvider>
          {children}
        </WalletProvider>
      </body>
    </html>
  );
}
