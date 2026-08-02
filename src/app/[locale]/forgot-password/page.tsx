'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { useI18n } from '../../../lib/i18n/I18nContext';
import AuthLayout from '../../../components/AuthLayout';
import { Mail, ShieldCheck, ArrowRight, ArrowLeft, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default function ForgotPassword({ params }: PageProps) {
  const { locale } = use(params);
  const { t } = useI18n();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1500);
  };

  return (
    <AuthLayout
      locale={locale}
      title="Reset password."
      subtitle="Enter your registered email address below, and we will send you secure recovery instructions. We help you connect safely."
      imageUrl="/couple_candid_laugh.png"
      imageCaption="VALUED CONNECTIONS — BUILT ON COMPATIBILITY"
      trustText="Account security protocols are enforced on all recovery traffic."
      helpLink={`/${locale}/login`}
      helpText="Return to sign in"
    >
      <AnimatePresence mode="wait">
        {!success ? (
          <motion.div
            key="form-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {errorMsg && (
              <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-red-500" role="alert">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="email" className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground font-medium">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-muted-foreground/60 group-focus-within:text-foreground transition-colors">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-secondary/35 border border-border/50 rounded-xl pl-10 pr-4 py-3 text-xs focus:outline-none focus:border-foreground focus:ring-1 focus:ring-foreground transition-all font-light"
                  />
                </div>
                <p className="text-[10px] text-muted-foreground/75 font-light pl-1">
                  We'll send a single link to securely reset your credentials. It only takes about a minute.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3.5 rounded-xl bg-foreground text-background font-semibold text-xs hover:bg-foreground/90 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Sending Link...</span>
                  </>
                ) : (
                  <>
                    <span>Send Reset Link</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="success-view"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-4 space-y-5"
          >
            <div className="w-12 h-12 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle className="h-6 w-6" />
            </div>
            <div className="space-y-2">
              <h3 className="font-serif text-lg font-bold text-foreground">Secure link sent</h3>
              <p className="text-xs text-muted-foreground font-light leading-relaxed max-w-xs mx-auto">
                We have sent recovery instructions to <span className="font-medium text-foreground">{email}</span>. Click the link inside the message to finalize resets.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="pt-2 text-center text-xs text-muted-foreground font-light">
        Back to{' '}
        <Link href={`/${locale}/login`} className="font-semibold text-foreground hover:underline">
          Sign in
        </Link>
      </div>
    </AuthLayout>
  );
}
