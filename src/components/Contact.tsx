'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import AnimatedHeader from './AnimatedHeader';

interface FormData {
  message: string;
  contact: string;
}

const formAnimation = {
  hidden: { opacity: 0, y: 20 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      delay: custom * 0.2,
      ease: [0.22, 1, 0.36, 1]
    }
  })
};

export default function Contact() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    message: '',
    contact: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      setIsSubmitted(true);
      setFormData({ message: '', contact: '' });
    } catch (err) {
      setError('Failed to send message. Please try again later.');
      console.error('Submission error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-black/90 py-32">
      <div className="max-w-4xl mx-auto px-8">
        <motion.div 
          className="space-y-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {/* Header */}
          <div className="text-center">
            <AnimatedHeader 
              title="Get in Touch" 
              subtitle="Share your vision and start a conversation"
              align="center"
            />
          </div>

          {/* Form */}
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-6">
                <motion.div 
                  className="relative group"
                  variants={formAnimation}
                  custom={1}
                >
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Your message..."
                    className="w-full h-48 bg-white/5 border border-white/10 rounded-lg px-6 py-4 text-white/70 focus:outline-none focus:border-blue-500/50 transition-colors duration-300 placeholder:text-white/30"
                    required
                    disabled={isLoading}
                  />
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                </motion.div>

                <motion.div 
                  className="relative group"
                  variants={formAnimation}
                  custom={2}
                >
                  <input
                    type="text"
                    value={formData.contact}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                    placeholder="Your email or preferred contact method"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-6 py-4 text-white/70 focus:outline-none focus:border-blue-500/50 transition-colors duration-300 placeholder:text-white/30"
                    required
                    disabled={isLoading}
                  />
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                </motion.div>
              </div>

              {error && (
                <motion.div 
                  className="text-red-400 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {error}
                </motion.div>
              )}

              <motion.div 
                className="flex justify-center"
                variants={formAnimation}
                custom={3}
              >
                <button
                  type="submit"
                  disabled={isLoading}
                  className="relative px-12 py-4 text-sm tracking-wider uppercase text-white overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="relative z-10">
                    {isLoading ? 'Sending...' : 'Send'}
                  </span>
                  <div className="absolute inset-0 border border-white/10 group-hover:border-white/20 transition-colors duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-blue-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                </button>
              </motion.div>
            </form>
          ) : (
            <motion.div 
              className="text-center space-y-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <motion.div 
                className="text-2xl font-light text-white"
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                Message Sent
              </motion.div>
              <motion.p 
                className="text-blue-300/70 italic"
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                Thank you for reaching out. We will get back to you soon.
              </motion.p>
            </motion.div>
          )}

          {/* Footer Quote */}
          <motion.div 
            className="text-center"
            variants={formAnimation}
            custom={4}
          >
            <div className="inline-block p-6 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
              <motion.p 
                className="text-white/60 italic"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                "True art finds its guardian through intention, not transaction. Each piece awaits its destined protector."
              </motion.p>
              <motion.p 
                className="text-white/40 text-sm mt-2"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.8 }}
              >
                — Lukas Vandeverre
              </motion.p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
} 