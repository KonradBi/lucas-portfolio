'use client';

import HeroSection from '@/components/HeroSection';
import Gallery from '@/components/Gallery';
import About from '@/components/About';
import WorldMap from '@/components/WorldMap';
import Contact from '@/components/Contact';

export default function Home() {
  return (
    <main className="relative">
      <HeroSection />
      <Gallery />
      <WorldMap />
      <About />
      <Contact />
    </main>
  );
}
