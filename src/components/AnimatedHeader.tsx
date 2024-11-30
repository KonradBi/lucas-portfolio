'use client';

import { motion } from 'framer-motion';

interface AnimatedHeaderProps {
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  size?: 'normal' | 'large';
  disableLetterAnimation?: boolean;
}

const letterAnimation = {
  initial: {
    opacity: 0,
    y: 20,
    rotateX: 90,
    filter: "blur(10px)"
  },
  animate: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    filter: "blur(0px)"
  }
};

const containerAnimation = {
  animate: {
    transition: {
      staggerChildren: 0.035,
      delayChildren: 0.2,
    }
  }
};

export default function AnimatedHeader({ 
  title, 
  subtitle, 
  align = 'left',
  size = 'normal',
  disableLetterAnimation = false
}: AnimatedHeaderProps) {
  return (
    <div className={`space-y-6 ${align === 'center' ? 'text-center' : ''}`}>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative space-y-4">
          <div className="relative">
            <div className="absolute -inset-1 blur-xl opacity-20 bg-gradient-to-r from-blue-500 to-purple-500" />
            <h2 className={`relative text-white font-light transform-gpu transition-transform duration-1000 hover:scale-105 ${
              size === 'large' ? 'text-4xl md:text-5xl' : 'text-4xl'
            }`}>
              {disableLetterAnimation ? (
                title
              ) : (
                <motion.span
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true, margin: '-100px' }}
                  variants={containerAnimation}
                  style={{ display: 'inline-block', perspective: '1000px' }}
                  aria-label={title}
                >
                  {title.split('').map((char, index) => (
                    <motion.span
                      key={index}
                      variants={letterAnimation}
                      transition={{
                        duration: 0.5,
                        ease: [0.215, 0.610, 0.355, 1.000],
                        opacity: { duration: 0.15 }
                      }}
                      style={{ 
                        display: 'inline-block',
                        transformOrigin: 'bottom',
                        whiteSpace: 'pre'
                      }}
                    >
                      {char === ' ' ? '\u00A0' : char}
                    </motion.span>
                  ))}
                </motion.span>
              )}
            </h2>
          </div>

          <div className="h-[1px] w-16 bg-white/20" />

          {subtitle && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ 
                duration: 0.6,
                delay: 0.5,
                ease: [0.215, 0.610, 0.355, 1.000]
              }}
            >
              <p className="text-blue-300/70 italic tracking-wide">
                {subtitle}
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
} 