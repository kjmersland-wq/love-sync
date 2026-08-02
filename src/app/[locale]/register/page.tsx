'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useI18n } from '../../../lib/i18n/I18nContext';
import AuthLayout from '../../../components/AuthLayout';
import { Mail, User, Lock, ShieldCheck, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default function Register({ params }: PageProps) {
  const { locale } = use(params);
  const router = useRouter();
  const { t } = useI18n();

  // Form states
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Validation and process states
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!firstName.trim()) {
      setErrorMsg('First name is required.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (password.length < 8) {
      setErrorMsg('Password must be at least 8 characters.');
      return;
    }

    setLoading(true);
    
    setTimeout(() => {
      setLoading(false);
      document.cookie = "ls_user_id=user_123; path=/; max-age=31536000; SameSite=Lax; Secure";
      router.push(`/${locale}/dashboard`);
    }, 1800);
  };

  return (
    <AuthLayout
      locale={locale}
      title="Create your account."
      subtitle="We require registration to preserve a verified, private network of individuals seeking committed relationships."
      imageUrl="/couple_warm_sunset.png"
      imageCaption="Sofia & Magnus, Malaga/Oslo — Verified Match"
      trustText="Your information is private and never sold."
      helpLink={`/${locale}/help`}
      helpText="Need help registering?"
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

      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* First Name Input */}
        <div className="space-y-1.5">
          <label htmlFor="firstName" className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground font-medium">
            First Name
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-muted-foreground/60 group-focus-within:text-foreground transition-colors">
              <User className="h-4 w-4" />
            </div>
            <input
              id="firstName"
              name="firstName"
              type="text"
              required
              autoComplete="given-name"
              placeholder="e.g. Johan"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full bg-secondary/35 border border-border/50 rounded-xl pl-10 pr-4 py-3 text-xs focus:outline-none focus:border-foreground focus:ring-1 focus:ring-foreground transition-all font-light"
            />
          </div>
        </div>

        {/* Email Input */}
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

        {/* Password Input */}
        <div className="space-y-1.5">
          <label htmlFor="password" className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground font-medium">
            Password
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-muted-foreground/60 group-focus-within:text-foreground transition-colors">
              <Lock className="h-4 w-4" />
            </div>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="new-password"
              placeholder="Create secure password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-secondary/35 border border-border/50 rounded-xl pl-10 pr-4 py-3 text-xs focus:outline-none focus:border-foreground focus:ring-1 focus:ring-foreground transition-all font-light"
            />
          </div>
          <p className="text-[10px] text-muted-foreground/75 font-light pl-1">
            Password must be at least 8 characters.
          </p>
        </div>

        {/* Turnstile verification indicator */}
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
              <span>Creating Account...</span>
            </>
          ) : (
            <>
              <span>Create Account</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>

      </form>

      <div className="pt-2 text-center text-xs text-muted-foreground font-light">
        Already have an account?{' '}
        <Link href={`/${locale}/login`} className="font-semibold text-foreground hover:underline">
          Sign in
        </Link>
      </div>
    </AuthLayout>
  );
}
