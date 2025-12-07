import React from 'react';
import { HeroSection } from '@/components/landing/HeroSection';
import { ModulesSection } from '@/components/landing/ModulesSection';

export default function Home() {
  return (
    <div className="bg-white">
      <HeroSection />
      <ModulesSection />
    </div>
  );
}
