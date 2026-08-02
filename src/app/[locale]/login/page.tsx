'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useI18n } from '../../../lib/i18n/I18nContext';
import AuthLayout from '../../../components/AuthLayout';
import { Mail, Lock, ShieldCheck, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default function Login({ params }: PageProps) {
  const { locale } = use(params);
  const router = useRouter();
  const { t } = useI18n();

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // States
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!password) {
      setErrorMsg('Password is required.');
      return;
    }

    setLoading(true);
    
    setTimeout(() => {
      setLoading(false);
      router.push(`/${locale}/dashboard`);
    }, 1500);
  };

  return (
    <AuthLayout
      locale={locale}
      title="Welcome back."
      subtitle="Sign in to manage your compatibility weights, browse verified members, and connect safely on our ad-free network."
      imageUrl="/couple_warm_sunset.png"
      imageCaption="VALUED CONNECTIONS — BUILT ON COMPATIBILITY"
      trustText="Session data is secured using end-to-end encryption hashes."
      helpLink={`/${locale}/help`}
      helpText="Need help signing in?"
    >
      <AnimatePresence mode="wait">
        {errorMsg && (
          <motion.div 
            className="bg-red-500/5 border border-red-500/20 rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-red-500"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            role="alert"
          >
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* Email Address */}
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
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center pl-1">
            <label htmlFor="password" className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground font-medium">
              Password
            </label>
            <Link 
              href={`/${locale}/forgot-password`}
              className="text-[10px] text-muted-foreground hover:text-foreground underline font-light"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative group">
            <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-muted-foreground/60 group-focus-within:text-foreground transition-colors">
              <Lock className="h-4 w-4" />
            </div>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-secondary/35 border border-border/50 rounded-xl pl-10 pr-4 py-3 text-xs focus:outline-none focus:border-foreground focus:ring-1 focus:ring-foreground transition-all font-light"
            />
          </div>
        </div>

        {/* Turnstile block */}
        <div className="bg-secondary/20 rounded-xl p-3.5 border border-border/20 flex items-center justify-between text-[10px] text-muted-foreground">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-green-500" />
            <span>Protected by Cloudflare Turnstile</span>
          </div>
          <span className="font-mono text-green-500 font-bold uppercase tracking-wider">Secured</span>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 py-3.5 rounded-xl bg-foreground text-background font-semibold text-xs hover:bg-foreground/90 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow"
        >
          {loading ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              <span>Signing in...</span>
            </>
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>

      </form>

      <div className="pt-2 text-center text-xs text-muted-foreground font-light">
        Don't have an account?{' '}
        <Link href={`/${locale}/register`} className="font-semibold text-foreground hover:underline">
          Sign up
        </Link>
      </div>
    </AuthLayout>
  );
}
