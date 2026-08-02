'use client';

import React, { use, useState } from 'react';
import Link from 'next/link';
import { useI18n } from '../../lib/i18n/I18nContext';
import { avatarSVGs } from '../../data/mockDb';
import { faqData } from '../../lib/i18n/helpData';
import { 
  Heart, ShieldCheck, Sparkles, Star, ArrowRight, 
  Sliders, ChevronDown, Check, Lock, CheckCircle2,
  Compass, Shield, UserCheck, Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default function Home({ params }: PageProps) {
  const { locale, t } = useI18n();
  const { locale: localeParam } = use(params);

  // Live weights simulator states
  const [weights, setWeights] = useState({
    familyGoals: 85,
    lifestyle: 75,
    values: 90,
    interests: 60
  });

  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Dynamic compatibility calculation
  const simulatedScore = Math.round(
    (weights.familyGoals * 0.35) + 
    (weights.lifestyle * 0.25) + 
    (weights.values * 0.30) + 
    (weights.interests * 0.10)
  );

  // Framer Motion spring presets
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] }
  };

  const stagger = {
    animate: { transition: { staggerChildren: 0.15 } }
  };

  return (
    <div className="flex flex-col bg-background min-h-screen relative overflow-hidden text-foreground">
      
      {/* Background Ambient Warm Glow */}
      <div className="absolute top-0 left-1/4 w-[700px] h-[700px] bg-red-500/3 dark:bg-red-500/5 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-[1000px] right-1/4 w-[500px] h-[500px] bg-amber-500/3 dark:bg-amber-500/3 rounded-full blur-[130px] pointer-events-none -z-10" />

      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-24 md:pt-40 md:pb-36 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-16 items-center">
          
          {/* Left Hero: Brand & Text Values */}
          <motion.div 
            className="lg:col-span-7 space-y-8 text-center lg:text-left"
            initial="initial"
            animate="animate"
            variants={stagger}
          >
            <motion.div 
              className="inline-flex items-center gap-1.5 rounded-full border border-red-500/15 bg-red-500/5 px-3.5 py-1.5 text-xs font-medium text-red-500 dark:text-rose-400/90 tracking-wide"
              variants={fadeInUp}
            >
              <Heart className="h-3 w-3 fill-current animate-pulse" />
              <span>A Trusted Space for Long-Term Relationships</span>
            </motion.div>

            <motion.h1 
              className="font-serif text-4xl sm:text-5xl md:text-6.5xl font-bold tracking-tight text-foreground leading-[1.08] lg:max-w-2xl"
              variants={fadeInUp}
            >
              Find the Person Who Shares Your Path.
            </motion.h1>

            <motion.p 
              className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 font-light leading-relaxed"
              variants={fadeInUp}
            >
              Love Sync is a premium, ad-free relationship platform designed for individuals seeking depth, trust, and a shared future. We calculate compatibility using transparent, values-based weights.
            </motion.p>

            <motion.div 
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2"
              variants={fadeInUp}
            >
              <Link 
                href={`/${locale}/dashboard`}
                className="w-full sm:w-auto px-8 py-4.5 rounded-xl bg-foreground text-background font-semibold hover:bg-foreground/90 transition-all flex items-center justify-center gap-2 group shadow-sm active:scale-98"
              >
                <span>{t('landing.ctaStart')}</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <a 
                href="#how-it-works"
                className="w-full sm:w-auto px-8 py-4.5 rounded-xl border border-border bg-background/30 text-foreground font-semibold hover:bg-secondary/80 transition-all text-center active:scale-98"
              >
                {t('landing.ctaLearn')}
              </a>
            </motion.div>

            {/* Premium Trust Badges */}
            <motion.div 
              className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-4 text-xs text-muted-foreground/80 font-light"
              variants={fadeInUp}
            >
              <div className="flex items-center gap-1.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3 w-3 fill-amber-500 text-amber-500" />
                ))}
                <span className="font-semibold text-foreground ml-1">5.0 Rating</span>
              </div>
              <span className="text-border/40 hidden sm:inline">|</span>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-green-500" />
                <span>100% Private Network</span>
              </div>
              <span className="text-border/40 hidden sm:inline">|</span>
              <span>Manual ID Verification Desk</span>
            </motion.div>
          </motion.div>

          {/* Right Hero: Authentic photography of real couple (with Sofia & Magnus overlay metadata) */}
          <div className="lg:col-span-5 relative w-full flex items-center justify-center">
            <div className="relative w-80 sm:w-[360px] aspect-[4/5] rounded-[32px] overflow-hidden border border-border/20 shadow-2xl bg-secondary/10 group">
              
              {/* Actual couple image generated */}
              <img 
                src="/couple_warm_sunset.png" 
                alt="Love Sync Verified Couple Portrait" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-103"
              />

              {/* Muted dark vignette overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-transparent to-transparent z-10" />

              {/* Floating verified match badge overlay */}
              <div className="absolute bottom-5 inset-x-5 bg-background/90 border border-border/20 p-4 rounded-2xl backdrop-blur-md z-20 shadow-lg space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] text-muted-foreground font-mono tracking-wider">COMPATIBILITY PROFILE</span>
                  </div>
                  <span className="text-[10px] text-green-500 bg-green-500/10 px-1.5 py-0.2 rounded font-bold">ID VERIFIED</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5 text-left">
                    <h4 className="text-xs font-bold text-foreground">Sofia & Magnus</h4>
                    <p className="text-[10px] text-muted-foreground font-light">Malaga / Oslo Match</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-extrabold text-foreground">94%</span>
                    <p className="text-[8px] text-muted-foreground font-mono tracking-wide">MATCH RATE</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* --- TRUST PARTNERS BADGES --- */}
      <section className="bg-secondary/10 border-y border-border/20 py-8 px-4 text-center">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-center items-center gap-8 md:gap-16">
          <div className="text-[10px] font-mono tracking-wider text-muted-foreground/80 uppercase">VERIFIED STANDARDS</div>
          <div className="font-serif text-sm font-medium tracking-tight text-muted-foreground/50">Oslo Tech Review</div>
          <div className="font-serif text-sm font-medium tracking-tight text-muted-foreground/50">Linear Design Weekly</div>
          <div className="font-serif text-sm font-medium tracking-tight text-muted-foreground/50">Stripe Billing Partner</div>
          <div className="font-serif text-sm font-medium tracking-tight text-muted-foreground/50">GDPR Compliance Audit</div>
        </div>
      </section>

      {/* --- COMPATIBILITY FLOW DIAGRAM & SIMULATOR --- */}
      <section className="py-28 px-4 sm:px-6 lg:px-8 border-b border-border/20 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Left: Custom diagram illustration explaining the deterministic algorithm */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-red-500/10 text-red-500">
              <Compass className="h-4.5 w-4.5" />
            </div>
            <h2 className="font-serif text-3xl font-bold tracking-tight text-foreground leading-tight">
              Deterministic Matching.
            </h2>
            <p className="text-xs text-muted-foreground font-light leading-relaxed">
              We never use opaque AI models or hidden sorting systems. The Love Sync algorithm matches users instantly based on explicit weights you control.
            </p>

            {/* Custom SVG flow chart illustration */}
            <div className="border border-border/20 bg-secondary/15 rounded-2xl p-5 space-y-4">
              <span className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider block">ALGORITHM PIPELINE</span>
              
              <div className="flex items-center gap-3 text-xs">
                <div className="w-8 h-8 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center shrink-0 border border-red-500/10">
                  <Shield className="h-4 w-4" />
                </div>
                <div className="space-y-0.5">
                  <span className="font-semibold text-foreground block">1. Verification Desk</span>
                  <span className="text-[10px] text-muted-foreground font-light">Confirms real identity via manual photo match.</span>
                </div>
              </div>

              <div className="w-[1px] h-4 bg-border/40 ml-4" />

              <div className="flex items-center gap-3 text-xs">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0 border border-amber-500/10">
                  <Layers className="h-4 w-4" />
                </div>
                <div className="space-y-0.5">
                  <span className="font-semibold text-foreground block">2. Values Calibration</span>
                  <span className="text-[10px] text-muted-foreground font-light">Weights are explicitly cross-referenced against routines.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Sliders Interface */}
          <div className="lg:col-span-7 bg-card border border-border/20 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 relative overflow-hidden glass">
            
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-foreground font-medium">Family Goals weight</span>
                  <span className="text-muted-foreground font-mono">{weights.familyGoals}%</span>
                </div>
                <input 
                  type="range" min="0" max="100" 
                  value={weights.familyGoals}
                  onChange={(e) => setWeights({ ...weights, familyGoals: parseInt(e.target.value) })}
                  className="w-full accent-foreground bg-secondary h-1 rounded-lg cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-foreground font-medium">Lifestyle & Routines weight</span>
                  <span className="text-muted-foreground font-mono">{weights.lifestyle}%</span>
                </div>
                <input 
                  type="range" min="0" max="100" 
                  value={weights.lifestyle}
                  onChange={(e) => setWeights({ ...weights, lifestyle: parseInt(e.target.value) })}
                  className="w-full accent-foreground bg-secondary h-1 rounded-lg cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-foreground font-medium">Shared Values weight</span>
                  <span className="text-muted-foreground font-mono">{weights.values}%</span>
                </div>
                <input 
                  type="range" min="0" max="100" 
                  value={weights.values}
                  onChange={(e) => setWeights({ ...weights, values: parseInt(e.target.value) })}
                  className="w-full accent-foreground bg-secondary h-1 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            {/* Simulated matching output */}
            <div className="bg-secondary/30 p-4 rounded-xl border border-border/20 flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[9px] text-muted-foreground font-mono uppercase tracking-wider">Calculated Compatibility</span>
                <p className="text-xs text-foreground font-light">Interactive matching score</p>
              </div>
              <div className="font-serif text-3xl font-extrabold text-foreground">
                {simulatedScore}%
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* --- HOW IT WORKS STEP LIST --- */}
      <section id="how-it-works" className="py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-20">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            {t('landing.howItWorks')}
          </h2>
          <p className="text-muted-foreground font-light text-xs sm:text-sm">
            {t('landing.howItWorksSub')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="border-l border-border/30 pl-6 space-y-2.5">
            <div className="font-mono text-[10px] text-muted-foreground font-semibold">01</div>
            <h3 className="text-sm font-bold text-foreground">{t('landing.step1Title')}</h3>
            <p className="text-xs text-muted-foreground font-light leading-relaxed">{t('landing.step1Text')}</p>
          </div>

          <div className="border-l border-border/30 pl-6 space-y-2.5">
            <div className="font-mono text-[10px] text-muted-foreground font-semibold">02</div>
            <h3 className="text-sm font-bold text-foreground">{t('landing.step2Title')}</h3>
            <p className="text-xs text-muted-foreground font-light leading-relaxed">{t('landing.step2Text')}</p>
          </div>

          <div className="border-l border-border/30 pl-6 space-y-2.5">
            <div className="font-mono text-[10px] text-muted-foreground font-semibold">03</div>
            <h3 className="text-sm font-bold text-foreground">{t('landing.step3Title')}</h3>
            <p className="text-xs text-muted-foreground font-light leading-relaxed">{t('landing.step3Text')}</p>
          </div>

          <div className="border-l border-border/30 pl-6 space-y-2.5">
            <div className="font-mono text-[10px] text-muted-foreground font-semibold">04</div>
            <h3 className="text-sm font-bold text-foreground">{t('landing.step4Title')}</h3>
            <p className="text-xs text-muted-foreground font-light leading-relaxed">{t('landing.step4Text')}</p>
          </div>
        </div>
      </section>

      {/* --- PREMIUM PRICING CARD --- */}
      <section className="bg-secondary/15 py-28 px-4 sm:px-6 lg:px-8 border-y border-border/20">
        <div className="mx-auto max-w-xl space-y-12">
          
          <div className="text-center space-y-4">
            <h2 className="font-serif text-3xl font-bold tracking-tight text-foreground">
              Simple Premium Subscriptions
            </h2>
            <p className="text-muted-foreground font-light text-xs sm:text-sm">
              No free accounts or advertisements. Cancel at any time with one click.
            </p>

            {/* Toggle switch */}
            <div className="flex justify-center items-center gap-3 pt-2 text-xs">
              <span className={`font-medium transition-colors ${billingCycle === 'monthly' ? 'text-foreground' : 'text-muted-foreground'}`}>
                Monthly
              </span>
              <button
                type="button"
                onClick={() => setBillingCycle(prev => prev === 'monthly' ? 'yearly' : 'monthly')}
                className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border border-transparent bg-secondary/80 transition-colors duration-250 ease-in-out focus:outline-none"
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-foreground shadow ring-0 transition duration-250 ease-in-out ${
                    billingCycle === 'yearly' ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
              <span className={`font-medium transition-colors ${billingCycle === 'yearly' ? 'text-foreground' : 'text-muted-foreground'} flex items-center gap-1.5`}>
                Annually
                <span className="px-2 py-0.5 text-[9px] bg-red-500/10 text-red-500 font-bold rounded-full">
                  Save 36%
                </span>
              </span>
            </div>
          </div>

          {/* Centered Subscription Card */}
          <div className="bg-card border border-border/20 rounded-3xl p-8 shadow-lg space-y-6">
            <div className="flex justify-between items-baseline border-b border-border/20 pb-4">
              <div>
                <h3 className="font-serif text-lg font-bold text-foreground">Love Sync Premium</h3>
                <p className="text-[9px] text-muted-foreground font-mono uppercase tracking-wider mt-0.5">FULL ACCESS</p>
              </div>
              <div className="text-right">
                <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground font-serif">
                  {billingCycle === 'monthly' ? '$19 / mo' : '$144 / yr'}
                </span>
                <p className="text-[10px] text-muted-foreground font-light">
                  {billingCycle === 'monthly' ? 'Billed monthly' : 'Billed annually'}
                </p>
              </div>
            </div>

            {/* Checklist */}
            <ul className="space-y-3 text-xs text-muted-foreground font-light">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500 shrink-0" />
                <span>Deterministic Compatibility Engine</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500 shrink-0" />
                <span>Government ID & Photo Identity Verification</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500 shrink-0" />
                <span>Secure Chat & Messages translations</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500 shrink-0" />
                <span>100% Ad-Free, private, and GDPR compliant</span>
              </li>
            </ul>

            <Link
              href={`/${locale}/pricing`}
              className="w-full py-3.5 rounded-xl bg-foreground text-background font-semibold text-xs text-center hover:bg-foreground/90 transition-colors shadow flex items-center justify-center gap-1.5"
            >
              <Lock className="h-3.5 w-3.5" />
              <span>Go to Secure Checkout</span>
            </Link>
          </div>

        </div>
      </section>

      {/* --- EMBEDDED FAQ ACCORDIONS --- */}
      <section className="py-28 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        <div className="text-center space-y-4 mb-20">
          <h2 className="font-serif text-3xl font-bold tracking-tight text-foreground">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground font-light text-xs sm:text-sm">
            Quick answers regarding billing, privacy, and our matching algorithm.
          </p>
        </div>

        <div className="space-y-4 max-w-xl mx-auto">
          {faqData.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            const question = faq.question[localeParam] || faq.question['en'] || '';
            const answer = faq.answer[localeParam] || faq.answer['en'] || '';
            return (
              <div 
                key={idx}
                className="bg-card border border-border/20 rounded-2xl overflow-hidden hover:border-border transition-colors shadow-sm"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left focus:outline-none"
                >
                  <span className="font-serif text-xs sm:text-sm font-bold text-foreground">
                    {question}
                  </span>
                  <ChevronDown className={`h-4 w-4 text-muted-foreground shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-foreground' : 'rotate-0'
                  }`} />
                </button>
                
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.2, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-4 pt-1 text-xs text-muted-foreground font-light leading-relaxed border-t border-border/30 bg-secondary/15">
                        {answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        <div className="text-center pt-4">
          <Link 
            href={`/${locale}/faq`}
            className="text-xs text-red-500 font-semibold hover:underline flex items-center justify-center gap-1.5"
          >
            <span>View all frequently asked questions</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>


    </div>
  );
}
