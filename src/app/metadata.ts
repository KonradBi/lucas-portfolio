import type { Metadata } from 'next';

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