'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Check, ShieldCheck, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface TurnstileWidgetProps {
  onVerify: (token: string) => void;
  sitekey?: string;
  className?: string;
}

export const TurnstileWidget: React.FC<TurnstileWidgetProps> = ({
  onVerify,
  sitekey = process.env.NEXT_PUBLIC_TURNSTILE_SITEKEY,
  className = ''
}) => {
  const [status, setStatus] = useState<'idle' | 'verifying' | 'verified'>('idle');
  const widgetRef = useRef<HTMLDivElement>(null);

  // Load Cloudflare Turnstile if sitekey is provided
  useEffect(() => {
    if (!sitekey) return;

    // Declare global turnstile interface
    const windowWithTurnstile = window as any;

    const onloadCallback = () => {
      if (windowWithTurnstile.turnstile && widgetRef.current) {
        windowWithTurnstile.turnstile.render(widgetRef.current, {
          sitekey: sitekey,
          callback: (token: string) => {
            setStatus('verified');
            onVerify(token);
          },
          'expired-callback': () => {
            setStatus('idle');
          },
          'error-callback': () => {
            setStatus('idle');
          }
        });
      }
    };

    if (!windowWithTurnstile.turnstile) {
      const script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onloadTurnstileCallback';
      script.async = true;
      script.defer = true;
      windowWithTurnstile.onloadTurnstileCallback = onloadCallback;
      document.body.appendChild(script);
      
      return () => {
        document.body.removeChild(script);
        delete windowWithTurnstile.onloadTurnstileCallback;
      };
    } else {
      onloadCallback();
    }
  }, [sitekey, onVerify]);

  // Fallback interactive verification for local testing
  const handleLocalVerify = () => {
    if (sitekey) return; // Real Turnstile is handling it
    if (status !== 'idle') return;

    setStatus('verifying');
    setTimeout(() => {
      setStatus('verified');
      onVerify('mock-cf-turnstile-token');
    }, 1500);
  };

  if (sitekey) {
    return (
      <div className={`flex justify-center my-3 ${className}`}>
        <div ref={widgetRef} />
      </div>
    );
  }

  // Beautiful local fallback UI
  return (
    <div className={`my-3 flex justify-center ${className}`}>
      <button
        type="button"
        onClick={handleLocalVerify}
        disabled={status !== 'idle'}
        className={`flex h-11 w-full max-w-sm items-center justify-between rounded-lg border px-4 py-2 text-sm font-medium transition-all duration-300 ${
          status === 'verified'
            ? 'border-emerald-500 bg-emerald-50/10 text-emerald-500 dark:border-emerald-500/30'
            : 'border-border bg-background/50 text-foreground hover:bg-secondary/50'
        }`}
      >
        <div className="flex items-center gap-3">
          {status === 'idle' && (
            <div className="h-4 w-4 rounded border border-accent flex items-center justify-center cursor-pointer" />
          )}
          {status === 'verifying' && (
            <Loader2 className="h-4 w-4 animate-spin text-accent" />
          )}
          {status === 'verified' && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            >
              <Check className="h-4 w-4 text-emerald-500" />
            </motion.div>
          )}
          <span>
            {status === 'idle' && 'Verify you are human'}
            {status === 'verifying' && 'Verifying security...'}
            {status === 'verified' && 'Verification successful'}
          </span>
        </div>
        
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>Cloudflare Turnstile</span>
        </div>
      </button>
    </div>
  );
};
export default TurnstileWidget;
