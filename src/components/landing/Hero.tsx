'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Eye, Shield } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import styles from '@/styles/warm-theme.module.css';

const words = ['real-time', 'AI-powered', 'intelligent', 'webcam-based'];

function CyclingWord() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={words[index]}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="inline-block text-warmCoral"
      >
        {words[index]}
      </motion.span>
    </AnimatePresence>
  );
}

export default function Hero() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="flex min-h-screen flex-col items-center justify-center px-4 bg-warmBeige text-warmBrown relative overflow-hidden"
    >
      {/* Background texture overlay */}
      <div className={`absolute inset-0 ${styles.bgTexture} z-0 pointer-events-none mix-blend-multiply`} />

      {/* Animated gradient blobs */}
      <div className={`absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-[#E8DCC4] rounded-full blur-[100px] opacity-60 pointer-events-none ${styles.animateFloat}`} />
      <div className={`absolute bottom-[-10%] right-[-5%] w-[700px] h-[700px] bg-[#D8E2DC] rounded-full blur-[120px] opacity-60 pointer-events-none ${styles.animateFloatDelayed}`} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#F2E8DE] rounded-full blur-[80px] opacity-40 pointer-events-none" />

      <div className="mx-auto max-w-4xl text-center relative z-10">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className={`mb-8 inline-flex items-center gap-2 rounded-full border border-warmBorder ${styles.glassOrganic} px-4 py-1.5 text-sm text-warmBrownMuted`}
        >
          <Eye className="h-4 w-4 text-warmCoral" />
          Built for Hacklahoma 2026
        </motion.div>

        {/* Heading */}
        <h1 className={`mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl font-serif ${styles.heroTitle}`}>
          Stay focused with{' '}
          <CyclingWord />{' '}
          coaching
        </h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="mx-auto mb-4 max-w-2xl text-lg text-warmBrownMuted sm:text-xl"
        >
          AI-powered focus detection that runs entirely in your browser.
          Your video never leaves your device.
        </motion.p>

        {/* Privacy badges */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="mb-10 flex flex-wrap items-center justify-center gap-4 text-sm text-warmBrownMuted"
        >
          <span className="flex items-center gap-1.5">
            <Shield className="h-4 w-4 text-warmGreen" />
            No recording
          </span>
          <span className="flex items-center gap-1.5">
            <Shield className="h-4 w-4 text-warmGreen" />
            Browser-based
          </span>
          <span className="flex items-center gap-1.5">
            <Shield className="h-4 w-4 text-warmGreen" />
            Instant feedback
          </span>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          <div className="relative inline-block">
            <div className={`absolute -inset-1 rounded-full ${styles.animateGradientSweep} opacity-40 blur-md`} />
            <Link href="/session">
              <Button size="lg" className="relative gap-2 bg-warmCoral hover:bg-warmCoralLight text-warmBeige">
                Start Focus Session
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
