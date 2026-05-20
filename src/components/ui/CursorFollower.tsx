'use client';
import { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

export function CursorFollower() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 250 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 16);
      cursorY.set(e.clientY - 16);
    };

    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, [cursorX, cursorY]);

  return (
    <motion.div
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        backgroundColor: 'var(--accent-purple)',
        opacity: 0.15,
        pointerEvents: 'none',
        zIndex: 9999,
        translateX: cursorXSpring,
        translateY: cursorYSpring,
        filter: 'blur(4px)',
      }}
    />
  );
}
