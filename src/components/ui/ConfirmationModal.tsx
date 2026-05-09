'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  type?: 'danger' | 'warning' | 'info';
}

export default function ConfirmationModal({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  isLoading = false,
  type = 'danger'
}: ConfirmationModalProps) {
  
  const getColors = () => {
    switch (type) {
      case 'danger': return { icon: 'var(--accent-red)', btn: 'var(--accent-red)', bg: 'rgba(239, 68, 68, 0.1)' };
      case 'warning': return { icon: 'var(--accent-amber)', btn: 'var(--accent-amber)', bg: 'rgba(245, 158, 11, 0.1)' };
      default: return { icon: 'var(--accent-purple)', btn: 'var(--accent-purple)', bg: 'rgba(139, 92, 246, 0.1)' };
    }
  };

  const colors = getColors();

  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
          />
          
          {/* Modal Content */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            style={{ 
              position: 'relative', 
              width: '100%', 
              maxWidth: '440px', 
              background: 'var(--bg-card)', 
              border: '1px solid var(--border-primary)', 
              borderRadius: '24px', 
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
              overflow: 'hidden'
            }}
          >
            <div style={{ padding: '32px 24px', textAlign: 'center' }}>
              <div style={{ 
                width: '64px', 
                height: '64px', 
                borderRadius: '20px', 
                background: colors.bg, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                margin: '0 auto 24px',
                color: colors.icon
              }}>
                <AlertTriangle size={32} />
              </div>
              
              <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px' }}>{title}</h3>
              <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '32px' }}>{message}</p>
              
              <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                  onClick={onCancel}
                  disabled={isLoading}
                  style={{ 
                    flex: 1, 
                    padding: '12px', 
                    borderRadius: '12px', 
                    background: 'var(--bg-secondary)', 
                    border: '1px solid var(--border-primary)', 
                    color: 'var(--text-primary)', 
                    fontSize: '14px', 
                    fontWeight: 600, 
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  className="hover-bg-glass"
                >
                  {cancelLabel}
                </button>
                <button 
                  onClick={onConfirm}
                  disabled={isLoading}
                  style={{ 
                    flex: 1, 
                    padding: '12px', 
                    borderRadius: '12px', 
                    background: colors.btn, 
                    border: 'none', 
                    color: 'white', 
                    fontSize: '14px', 
                    fontWeight: 700, 
                    cursor: 'pointer',
                    opacity: isLoading ? 0.7 : 1,
                    boxShadow: `0 4px 12px ${colors.bg}`
                  }}
                >
                  {isLoading ? 'Processing...' : confirmLabel}
                </button>
              </div>
            </div>
            
            <button 
              onClick={onCancel}
              style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', padding: '4px' }}
            >
              <X size={20} />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
