'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Hide navbar and footer on signup pages (they are fullscreen experiences with their own header)
  const isSignupPage = pathname?.startsWith('/signup/');

  return (
    <>
      {!isSignupPage && <Navbar />}
      <main className="min-h-screen">
        {children}
      </main>
      {!isSignupPage && <Footer />}
    </>
  );
}
