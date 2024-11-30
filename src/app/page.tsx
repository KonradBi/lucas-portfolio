'use client';

import dynamic from 'next/dynamic';
import HeroSection from '@/components/HeroSection';
import Gallery from '@/components/Gallery';
import About from '@/components/About';
import Contact from '@/components/Contact';

const WorldMap = dynamic(() => import('@/components/WorldMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[800px] bg-black/90 flex items-center justify-center">
      <div className="text-white/50">Loading Globe...</div>
    </div>
  )
});

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
