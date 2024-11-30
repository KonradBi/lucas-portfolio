'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface Props {
  title: string;
  subtitle?: string;
  align?: 'left' | 'center' | 'right';
  size?: 'normal' | 'large';
}

export default function AnimatedHeader({ title, subtitle, align = 'left', size = 'normal' }: Props) {
  const containerClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  }[align];

  const lineClass = {
    left: 'mr-auto',
    center: 'mx-auto',
    right: 'ml-auto'
  }[align];

  const titleClass = size === 'large' ? 'text-4xl md:text-5xl' : 'text-3xl';

  return (
    <div className={containerClass}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <h2 className={`${titleClass} font-light tracking-wide text-white/90`}>
          {title}
        </h2>
        {subtitle && (
          <p className="mt-2 text-white/50">
            {subtitle}
          </p>
        )}
        <motion.div
          className={`h-px w-24 bg-gradient-to-r from-white/10 via-white/20 to-white/10 mt-6 ${lineClass}`}
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ 
            duration: 0.8, 
            delay: 0.2,
            ease: [0.22, 1, 0.36, 1]
          }}
        />
      </motion.div>
    </div>
  );
} 