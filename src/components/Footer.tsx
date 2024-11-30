'use client';

export default function Footer() {
  return (
    <footer className="w-full bg-[#010208] py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 flex justify-center items-center">
        <div className="text-white/40 text-sm">
          © {new Date().getFullYear()} LVDV
        </div>
      </div>
    </footer>
  );
} 