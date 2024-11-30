'use client';

import React, { useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';

interface NavItem {
  id: string;
  label: string;
  color: string;
}

const navItems: NavItem[] = [
  { id: 'home', label: 'Home', color: '#E74C3C' },
  { id: 'about', label: 'About', color: '#3498DB' },
  { id: 'work', label: 'Work', color: '#2ECC71' }
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const orbsRef = useRef<HTMLDivElement>(null);

  const handleMenuClick = () => {
    setIsOpen(!isOpen);
  };

  const handleOrbClick = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (!menuRef.current || !orbsRef.current) return;

    const menu = menuRef.current;
    const orbs = orbsRef.current;

    if (isOpen) {
      // Menu animation
      gsap.to(menu, {
        scale: 1.1,
        duration: 0.3,
        ease: 'power2.out'
      });

      // Orbs container animation
      gsap.fromTo(orbs,
        {
          opacity: 0,
          x: -50,
          scale: 0.8
        },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 0.5,
          ease: 'back.out(1.7)'
        }
      );

      // Animate each orb individually
      const orbElements = orbs.children;
      Array.from(orbElements).forEach((orb, index) => {
        gsap.fromTo(orb,
          {
            opacity: 0,
            x: -30,
            scale: 0
          },
          {
            opacity: 1,
            x: 0,
            scale: 1,
            duration: 0.4,
            delay: 0.1 * index,
            ease: 'back.out(2)'
          }
        );
      });
    } else {
      // Collapse animation
      gsap.to(menu, {
        scale: 1,
        duration: 0.3,
        ease: 'power2.in'
      });

      gsap.to(orbs, {
        opacity: 0,
        x: -30,
        scale: 0.8,
        duration: 0.3,
        ease: 'power2.in'
      });
    }
  }, [isOpen]);

  return (
    <nav className="fixed left-8 top-1/2 -translate-y-1/2 z-50">
      {/* Hamburger Menu */}
      <div
        ref={menuRef}
        className="cursor-pointer p-4 bg-black/20 backdrop-blur-lg rounded-lg hover:bg-black/30 transition-colors duration-300"
        onClick={handleMenuClick}
      >
        <div className={`w-6 h-0.5 bg-white mb-2 transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-2.5' : ''}`} />
        <div className={`w-6 h-0.5 bg-white mb-2 transition-opacity duration-300 ${isOpen ? 'opacity-0' : ''}`} />
        <div className={`w-6 h-0.5 bg-white transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-2.5' : ''}`} />
      </div>

      {/* Navigation Orbs */}
      <div
        ref={orbsRef}
        className="mt-8 space-y-6"
      >
        {navItems.map(({ id, label, color }) => (
          <div
            key={id}
            className="relative group"
            onClick={() => handleOrbClick(id)}
          >
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/20 backdrop-blur-lg rounded-full scale-0 group-hover:scale-100 transition-transform duration-300" />
            <div
              className="relative z-10 w-4 h-4 rounded-full cursor-pointer transition-transform duration-300 group-hover:scale-125 group-hover:shadow-lg"
              style={{ background: color, boxShadow: `0 0 20px ${color}40` }}
            />
            <div
              className="absolute left-14 top-1/2 -translate-y-1/2 px-4 py-2 rounded-lg text-sm text-white whitespace-nowrap opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
              style={{ background: color }}
            >
              {label}
            </div>
          </div>
        ))}
      </div>
    </nav>
  );
} 