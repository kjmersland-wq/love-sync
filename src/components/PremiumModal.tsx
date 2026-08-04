'use client';

import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  type?: 'info' | 'error' | 'success' | 'warning';
}

export const PremiumModal: React.FC<PremiumModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  type = 'info',
}) => {
  const modalRef = useRef<HTMLDivElement | null>(null);

  // Close on ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  // Click outside to close
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  const getBorderColor = () => {
    if (type === 'error') return 'border-red-500/30';
    if (type === 'success') return 'border-green-500/30';
    if (type === 'warning') return 'border-amber-500/30';
    return 'border-amber-500/20';
  };

  const getTypeIconColor = () => {
    if (type === 'error') return 'text-red-500';
    if (type === 'success') return 'text-green-500';
    if (type === 'warning') return 'text-amber-500';
    return 'text-amber-500';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          onClick={handleBackdropClick}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 select-none"
          role="dialog"
          aria-modal="true"
        >
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={`w-full max-w-md bg-zinc-950/80 backdrop-blur-xl border ${getBorderColor()} rounded-3xl p-6 shadow-2xl relative overflow-hidden`}
          >
            {/* Ambient luxury glow */}
            <div className="absolute -top-12 -left-12 w-28 h-28 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-12 -right-12 w-28 h-28 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-xl border border-border/40 hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Close modal"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className={`p-2 rounded-xl bg-secondary/80 ${getTypeIconColor()}`}>
                  <Sparkles className="h-5 w-5" />
                </div>
                <h3 className="font-serif text-base font-bold text-foreground pr-8">
                  {title}
                </h3>
              </div>

              <p className="text-xs text-muted-foreground font-light leading-relaxed">
                {description}
              </p>

              <div className="pt-2">
                <button
                  onClick={onClose}
                  className="w-full py-2.5 bg-foreground text-background font-semibold rounded-xl text-xs hover:bg-foreground/90 transition-colors shadow"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
