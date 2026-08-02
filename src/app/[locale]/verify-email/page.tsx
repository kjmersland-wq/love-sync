'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { useI18n } from '../../../lib/i18n/I18nContext';
import AuthLayout from '../../../components/AuthLayout';
import { Mail, RefreshCw, ArrowLeft, Loader2, CheckCircle2, ShieldCheck, Edit2, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default function VerifyEmail({ params }: PageProps) {
  const { locale } = use(params);
  const { t } = useI18n();

  // Email state
  const [emailAddress, setEmailAddress] = useState('user@example.com');
  const [showEdit, setShowEdit] = useState(false);
  const [newEmail, setNewEmail] = useState('');

  // Statuses
  const [resending, setResending] = useState(false);
  const [sentNotice, setSentNotice] = useState(false);

  const handleResend = () => {
    setResending(true);
    setSentNotice(false);

    setTimeout(() => {
      setResending(false);
      setSentNotice(true);
    }, 1500);
  };

  const handleSaveEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (newEmail.trim() && newEmail.includes('@')) {
      setEmailAddress(newEmail);
      setShowEdit(false);
      setSentNotice(false);
      // Simulate sending new email
      handleResend();
    }
  };

  return (
    <AuthLayout
      locale={locale}
      title="Verify your email."
      subtitle="We have sent a secure activation link to your email address. Please validate your inbox to activate your account and join our private, verified community."
      imageUrl="/couple_cozy_coffee.png"
      imageCaption="DELIBERATE COMPATIBILITY — VERIFIED NETWORK"
      trustText="Verification ensures only real, manual signups connect."
      helpLink={`/${locale}/help`}
      helpText="Did not receive it?"
    >
      <div className="text-center space-y-6">
        
        {/* Minimalist Envelope stamp */}
        <div className="relative flex items-center justify-center w-20 h-20 mx-auto rounded-full bg-red-500/10 text-red-500 shadow-inner">
          <Mail className="h-9 w-9" />
          <div className="absolute -bottom-1 -right-1 bg-background border border-border/40 p-1.5 rounded-full shadow-md">
            <Heart className="h-3 w-3 fill-red-500 text-red-500" />
          </div>
        </div>

        {/* Dynamic Target Email info with Typo-Fixer */}
        <div className="space-y-3">
          <h3 className="font-serif text-lg font-bold text-foreground">Awaiting email validation</h3>
          
          {!showEdit ? (
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground font-light">
              <span>Sent to: <span className="font-medium text-foreground">{emailAddress}</span></span>
              <button 
                onClick={() => { setShowEdit(true); setNewEmail(emailAddress); }}
                className="p-1 text-muted-foreground hover:text-foreground hover:bg-secondary/40 rounded transition-colors"
                title="Change email address"
              >
                <Edit2 className="h-3 w-3" />
              </button>
            </div>
          ) : (
            <form onSubmit={handleSaveEmail} className="flex items-center justify-center gap-2 max-w-xs mx-auto">
              <input
                type="email"
                required
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="bg-secondary/35 border border-border/50 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-foreground"
              />
              <button 
                type="submit"
                className="p-1.5 bg-foreground text-background rounded-lg hover:opacity-90 transition-opacity"
              >
                <Check className="h-3.5 w-3.5" />
              </button>
            </form>
          )}

          <p className="text-[11px] text-muted-foreground/75 font-light leading-relaxed max-w-xs mx-auto">
            Please check your inbox. If you do not see the message within a minute, make sure to inspect your <span className="font-medium text-foreground">spam or junk folder</span>.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {sentNotice && (
            <motion.div 
              className="bg-green-500/5 border border-green-500/20 rounded-xl p-3 flex items-center justify-center gap-2 text-xs text-green-500"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
            >
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>Verification email resent successfully.</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-3 pt-2">
          <button
            onClick={handleResend}
            disabled={resending || showEdit}
            className="w-full py-3.5 rounded-xl border border-border bg-background/50 text-xs font-semibold hover:bg-secondary transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {resending ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Resending Link...</span>
              </>
            ) : (
              <>
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Resend verification email</span>
              </>
            )}
          </button>
        </div>

        <div className="pt-2 text-center text-xs text-muted-foreground font-light border-t border-border/20">
          Back to{' '}
          <Link href={`/${locale}/login`} className="font-semibold text-foreground hover:underline">
            Sign in
          </Link>
        </div>

      </div>
    </AuthLayout>
  );
}
