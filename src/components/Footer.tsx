'use client';

import { useEffect, useState } from 'react';

export default function Footer() {
  const [year, setYear] = useState('');

  useEffect(() => {
    setYear(new Date().getFullYear().toString());
  }, []);

  return (
    <footer className="w-full bg-[#010208] py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 flex justify-center items-center">
        <div className="text-white/40 text-sm">
          © {year} LVDV
        </div>
      </div>
    </footer>
  );
} 