'use client';
import { motion } from 'framer-motion';
import { Bot, Zap, BrainCircuit, Cpu, Rocket, Sparkles, MessageCircle, Database } from 'lucide-react';

const icons = [
  { Icon: Bot, top: '15%', left: '5%', size: 40, delay: 0 },
  { Icon: BrainCircuit, top: '45%', left: '85%', size: 50, delay: 2 },
  { Icon: Zap, top: '75%', left: '10%', size: 30, delay: 1 },
  { Icon: Cpu, top: '25%', left: '90%', size: 45, delay: 3 },
  { Icon: Rocket, top: '65%', left: '5%', size: 35, delay: 1.5 },
  { Icon: Sparkles, top: '10%', left: '80%', size: 25, delay: 4 },
  { Icon: MessageCircle, top: '85%', left: '75%', size: 40, delay: 2.5 },
  { Icon: Database, top: '35%', left: '15%', size: 30, delay: 0.5 },
];

export function FloatingBackgroundIcons() {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0, opacity: 0.05, overflow: 'hidden' }}>
      {icons.map((item, i) => (
        <motion.div
          key={i}
          initial={{ y: 0, opacity: 0 }}
          animate={{ 
            y: [0, -30, 0],
            x: [0, 15, 0],
            opacity: [0, 1, 0.5, 1, 0],
            rotate: [0, 10, -10, 0]
          }}
          transition={{ 
            duration: 10 + Math.random() * 5, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: item.delay
          }}
          style={{ 
            position: 'absolute', 
            top: item.top, 
            left: item.left,
            color: 'var(--text-primary)'
          }}
        >
          <item.Icon size={item.size} strokeWidth={1} />
        </motion.div>
      ))}
    </div>
  );
}
