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

  // Hide navbar on signup pages (they have their own header)
  const hideNavbar = pathname?.startsWith('/signup/');

  return (
    <>
      {!hideNavbar && <Navbar />}
      <main className="min-h-screen">
        {children}
      </main>
      <Footer />
    </>
  );
}
