'use client';
import { motion } from 'framer-motion';

export function AnimatedBeam({ delay = 0 }) {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      <motion.div
        initial={{ top: '-10%', left: '0%', opacity: 0 }}
        animate={{ 
          top: ['-10%', '110%'],
          left: ['0%', '100%'],
          opacity: [0, 1, 1, 0]
        }}
        transition={{ 
          duration: 3, 
          repeat: Infinity, 
          ease: "linear",
          delay: delay
        }}
        style={{ 
          position: 'absolute', 
          width: '2px', 
          height: '150px', 
          background: 'linear-gradient(to bottom, transparent, var(--accent-purple), transparent)',
          filter: 'blur(2px)',
          transform: 'rotate(-45deg)'
        }}
      />
    </div>
  );
}
