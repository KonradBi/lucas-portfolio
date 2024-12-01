import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import Contact from '@/components/Contact';

// Dynamische Imports für Komponenten mit Three.js
const HeroSection = dynamic(() => import('@/components/HeroSection'), { ssr: false });
const Gallery = dynamic(() => import('@/components/Gallery'), { ssr: false });
const WorldMap = dynamic(() => import('@/components/WorldMap'), { ssr: false });
const About = dynamic(() => import('@/components/About'), { ssr: false });

export const metadata: Metadata = {
  title: 'Lukas Vandeverre | Contemporary Artist',
  description: 'Experience the ethereal artworks of Lukas Vandeverre. Explore limited edition prints and original pieces that transcend traditional boundaries of contemporary art.',
  keywords: [
    'Lukas Vandeverre',
    'LVDV',
    'contemporary art',
    'fine art',
    'art collector',
    'limited edition prints',
    'art gallery',
    'modern artist',
    'art collection',
    'museum quality prints',
    'contemporary artist',
    'art investment',
    'original artwork'
  ],
  openGraph: {
    title: 'Lukas Vandeverre | Contemporary Artist',
    description: 'Experience the ethereal artworks of Lukas Vandeverre. Explore limited edition prints and original pieces that transcend traditional boundaries of contemporary art.',
    url: 'https://lvdv.art',
    siteName: 'Lukas Vandeverre',
    images: [
      {
        url: '/images/social-preview.jpg',
        width: 1200,
        height: 630,
        alt: 'LVDV Artwork Preview'
      }
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lukas Vandeverre | Contemporary Artist',
    description: 'Experience the ethereal artworks of Lukas Vandeverre. Explore limited edition prints and original pieces.',
    images: ['/images/social-preview.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://lvdv.art',
  },
};

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
