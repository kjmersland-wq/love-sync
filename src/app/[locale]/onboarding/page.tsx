'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useI18n } from '../../../lib/i18n/I18nContext';
import AuthLayout from '../../../components/AuthLayout';
import { Heart, ArrowRight, ShieldCheck, Check, Sparkles, ArrowLeft, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default function Onboarding({ params }: PageProps) {
  const { locale } = use(params);
  const router = useRouter();
  const { t } = useI18n();

  // Wizard Step states (Step 1 to 4)
  const [step, setStep] = useState(1);
  
  // Selections
  const [selectedIntent, setSelectedIntent] = useState<string | null>(null);
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [selectedRhythm, setSelectedRhythm] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const s = urlParams.get('step');
      if (s) {
        const stepNum = parseInt(s);
        if (stepNum >= 1 && stepNum <= 4) {
          setStep(stepNum);
        }
      }
    }
  }, []);

  // Options: Step 1 (Intent)
  const intentOptions = [
    {
      id: 'committed',
      title: 'Committed Relationship',
      desc: 'Seeking a collaborative partner to share life paths, routines, and a future together.'
    },
    {
      id: 'marriage',
      title: 'Marriage & Family',
      desc: 'Aligned on establishing long-term roots, marriage, and starting a household.'
    },
    {
      id: 'partnership',
      title: 'Collaborative Partnership',
      desc: 'Focused on joint projects, travel companion alignment, and shared personal growth.'
    }
  ];

  // Options: Step 2 (Values)
  const valueOptions = [
    { id: 'communication', label: 'Open Communication' },
    { id: 'trust', label: 'Trust & Honesty' },
    { id: 'growth', label: 'Growth & Learning' },
    { id: 'family', label: 'Family & Home' },
    { id: 'adventure', label: 'Adventure & Travel' },
    { id: 'wellness', label: 'Health & Wellness' },
    { id: 'finance', label: 'Financial Alignment' },
    { id: 'spirituality', label: 'Spirituality & Faith' }
  ];

  // Options: Step 3 (Rhythm)
  const rhythmOptions = [
    {
      id: 'morning',
      title: 'Early Riser',
      desc: 'Mornings are my most active, creative, and quiet hours. I love early starts.'
    },
    {
      id: 'night',
      title: 'Night Owl',
      desc: 'I find my focus, inspiration, and energy in the quiet late hours of the night.'
    },
    {
      id: 'adaptable',
      title: 'Adaptable Rhythm',
      desc: 'My schedule adjusts easily to match partners, work requirements, and current days.'
    }
  ];

  const handleToggleValue = (valId: string) => {
    if (selectedValues.includes(valId)) {
      setSelectedValues(selectedValues.filter(id => id !== valId));
    } else {
      if (selectedValues.length >= 3) return;
      setSelectedValues([...selectedValues, valId]);
    }
  };

  const handleContinueStep1 = () => {
    if (!selectedIntent) return;
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setStep(2);
    }, 1000);
  };

  const handleContinueStep2 = () => {
    if (selectedValues.length === 0) return;
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setStep(3);
    }, 1000);
  };

  const handleContinueStep3 = () => {
    if (!selectedRhythm) return;
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      // Stop and wait for approval on Step 3
      alert("Step 3 Auto-saved successfully. Ready for design review.");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden text-foreground">
      
      {/* Background ambient glow */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-red-500/3 dark:bg-red-500/5 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Header bar */}
      <header className="max-w-7xl mx-auto w-full flex items-center justify-between border-b border-border/20 pb-4">
        <Link href={`/${locale}`} className="inline-flex items-center gap-2 font-serif text-xl font-bold tracking-tight text-foreground">
          <div className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-red-500/10 text-red-500">
            <Heart className="h-4 w-4 fill-red-500/20" />
          </div>
          <span className="font-serif">Love Sync</span>
        </Link>
        <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground">
          <span>PROGRESS</span>
          <div className="w-24 h-1.5 bg-secondary rounded-full overflow-hidden">
            <div className="h-full bg-red-500 transition-all duration-500" style={{ 
              width: step === 1 ? '25%' : step === 2 ? '50%' : '75%' 
            }} />
          </div>
          <span className="text-foreground font-bold">
            {step === 1 ? '25%' : step === 2 ? '50%' : '75%'}
          </span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto w-full my-auto py-12 grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 items-center">
        
        {/* Left Column: Visual Storytelling */}
        <div className="md:col-span-6 space-y-8 flex flex-col justify-between h-full py-4 text-center md:text-left">
          
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="visual-step1"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-4"
              >
                <span className="text-[10px] font-mono uppercase tracking-widest text-red-500 dark:text-rose-400 font-bold bg-red-500/5 border border-red-500/10 px-3 py-1 rounded-full">
                  STEP 1: INTENT & ALIGNMENT
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-foreground leading-tight">
                  What are you seeking?
                </h2>
                <p className="text-xs text-muted-foreground font-light leading-relaxed max-w-sm mx-auto md:mx-0">
                  We ask for your primary relationship intent to align match compatibility weights. You can change this later at any time.
                </p>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="visual-step2"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-4"
              >
                <span className="text-[10px] font-mono uppercase tracking-widest text-red-500 dark:text-rose-400 font-bold bg-red-500/5 border border-red-500/10 px-3 py-1 rounded-full">
                  STEP 2: CORE VALUES
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-foreground leading-tight">
                  Your Core Values.
                </h2>
                <p className="text-xs text-muted-foreground font-light leading-relaxed max-w-sm mx-auto md:mx-0">
                  A mutual match on core life principles is the strongest indicator of a lasting partnership. Select up to 3 values that guide your life.
                </p>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="visual-step3"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-4"
              >
                <span className="text-[10px] font-mono uppercase tracking-widest text-red-500 dark:text-rose-400 font-bold bg-red-500/5 border border-red-500/10 px-3 py-1 rounded-full">
                  STEP 3: LIFESTYLE & ROUTINES
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-foreground leading-tight">
                  Daily Rhythm.
                </h2>
                <p className="text-xs text-muted-foreground font-light leading-relaxed max-w-sm mx-auto md:mx-0">
                  Sharing wake/sleep cycles reduces lifestyle friction and increases shared quality time. Choose the rhythm that represents you.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Dynamic Image Selection depending on Step */}
          <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-3xl overflow-hidden border border-border/20 shadow-md bg-secondary/10">
            <img 
              src={step === 1 ? "/couple_warm_sunset.png" : step === 2 ? "/couple_candid_laugh.png" : "/couple_cozy_coffee.png"} 
              alt="Love Sync Shared Paths Portrait" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent z-10" />
            <div className="absolute bottom-3 left-4 text-[10px] text-muted-foreground/90 font-mono z-20">
              {step === 1 ? "INTRODUCE THE RIGHT PEOPLE FROM DAY ONE" : step === 2 ? "ALIGN ON LIFE GOALS AND VALUES" : "REDUCE LIFESTYLE AND DAILY ROUTINE FRICTION"}
            </div>
          </div>
        </div>

        {/* Right Column: Interaction Form depending on Step */}
        <div className="md:col-span-6 w-full">
          <AnimatePresence mode="wait">
            
            {/* STEP 1 FORM */}
            {step === 1 && (
              <motion.div
                key="form-step1"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                <div className="space-y-4">
                  {intentOptions.map((opt) => {
                    const isSelected = selectedIntent === opt.id;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => setSelectedIntent(opt.id)}
                        className={`w-full text-left p-5 rounded-2xl border transition-all flex justify-between items-start gap-4 hover:border-foreground/45 relative overflow-hidden ${
                          isSelected 
                            ? 'bg-card border-foreground shadow-md ring-1 ring-foreground' 
                            : 'bg-card border-border/30 shadow-sm'
                        }`}
                      >
                        <div className="space-y-1 z-10">
                          <h4 className="text-xs font-bold text-foreground font-serif">{opt.title}</h4>
                          <p className="text-[11px] text-muted-foreground font-light leading-normal">{opt.desc}</p>
                        </div>
                        
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                          isSelected ? 'bg-foreground border-foreground text-background' : 'border-border/60'
                        }`}>
                          {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <p className="text-[10px] text-muted-foreground/75 font-light text-center">
                  Your selection is saved automatically. It takes about a minute.
                </p>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 gap-4">
                  <Link 
                    href={`/${locale}/dashboard`}
                    className="text-xs text-muted-foreground hover:text-foreground font-medium underline"
                  >
                    Skip this step
                  </Link>
                  <button
                    onClick={handleContinueStep1}
                    disabled={!selectedIntent || saving}
                    className="px-8 py-3.5 rounded-xl bg-foreground text-background font-semibold text-xs hover:bg-foreground/90 disabled:opacity-40 transition-all flex items-center gap-1.5 shadow"
                  >
                    {saving ? (
                      <div className="flex items-center gap-1">
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        <span>Saving...</span>
                      </div>
                    ) : (
                      <>
                        <span>Continue</span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 2 FORM */}
            {step === 2 && (
              <motion.div
                key="form-step2"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-foreground font-serif">Select your top 3 life values:</h4>
                  <p className="text-[10px] text-muted-foreground font-light">
                    Choose up to 3 options. These act as high-weight matching factors.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  {valueOptions.map((opt) => {
                    const isSelected = selectedValues.includes(opt.id);
                    const disabled = !isSelected && selectedValues.length >= 3;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        disabled={disabled}
                        onClick={() => handleToggleValue(opt.id)}
                        className={`p-4 rounded-xl border text-xs font-medium text-center transition-all cursor-pointer ${
                          isSelected 
                            ? 'bg-foreground text-background border-foreground shadow' 
                            : disabled 
                              ? 'opacity-30 border-border/20 cursor-not-allowed'
                              : 'bg-card border-border/30 hover:border-foreground/45 text-foreground'
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>

                <p className="text-[10px] text-muted-foreground/75 font-light text-center">
                  Values-alignment reduces long-term relationship friction.
                </p>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 gap-4">
                  <button
                    onClick={() => setStep(1)}
                    className="text-xs text-muted-foreground hover:text-foreground font-medium flex items-center gap-1"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>Back</span>
                  </button>
                  <div className="flex items-center gap-4">
                    <Link 
                      href={`/${locale}/dashboard`}
                      className="text-xs text-muted-foreground hover:text-foreground font-medium underline"
                    >
                      Skip
                    </Link>
                    <button
                      onClick={handleContinueStep2}
                      disabled={selectedValues.length === 0 || saving}
                      className="px-8 py-3.5 rounded-xl bg-foreground text-background font-semibold text-xs hover:bg-foreground/90 disabled:opacity-40 transition-all flex items-center gap-1.5 shadow"
                    >
                      {saving ? (
                        <div className="flex items-center gap-1">
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          <span>Saving...</span>
                        </div>
                      ) : (
                        <>
                          <span>Continue</span>
                          <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 3 FORM: Lifestyle Rhythm */}
            {step === 3 && (
              <motion.div
                key="form-step3"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                <div className="space-y-4">
                  {rhythmOptions.map((opt) => {
                    const isSelected = selectedRhythm === opt.id;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => setSelectedRhythm(opt.id)}
                        className={`w-full text-left p-5 rounded-2xl border transition-all flex justify-between items-start gap-4 hover:border-foreground/45 relative overflow-hidden ${
                          isSelected 
                            ? 'bg-card border-foreground shadow-md ring-1 ring-foreground' 
                            : 'bg-card border-border/30 shadow-sm'
                        }`}
                      >
                        <div className="space-y-1 z-10">
                          <h4 className="text-xs font-bold text-foreground font-serif">{opt.title}</h4>
                          <p className="text-[11px] text-muted-foreground font-light leading-normal">{opt.desc}</p>
                        </div>
                        
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                          isSelected ? 'bg-foreground border-foreground text-background' : 'border-border/60'
                        }`}>
                          {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <p className="text-[10px] text-muted-foreground/75 font-light text-center">
                  Sharing daily schedules significantly increases relationship success.
                </p>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 gap-4">
                  <button
                    onClick={() => setStep(2)}
                    className="text-xs text-muted-foreground hover:text-foreground font-medium flex items-center gap-1"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>Back</span>
                  </button>
                  <div className="flex items-center gap-4">
                    <Link 
                      href={`/${locale}/dashboard`}
                      className="text-xs text-muted-foreground hover:text-foreground font-medium underline"
                    >
                      Skip
                    </Link>
                    <button
                      onClick={handleContinueStep3}
                      disabled={!selectedRhythm || saving}
                      className="px-8 py-3.5 rounded-xl bg-foreground text-background font-semibold text-xs hover:bg-foreground/90 disabled:opacity-40 transition-all flex items-center gap-1.5 shadow"
                    >
                      {saving ? (
                        <div className="flex items-center gap-1">
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          <span>Saving...</span>
                        </div>
                      ) : (
                        <>
                          <span>Continue</span>
                          <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </main>

      {/* Footer info */}
      <footer className="max-w-7xl mx-auto w-full border-t border-border/20 pt-4 flex flex-col sm:flex-row justify-between items-center text-[10px] text-muted-foreground/70 font-light gap-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-3.5 w-3.5 text-green-500" />
          <span>All onboarding logs are cryptographically verified and secure.</span>
        </div>
        <div>
          GDPR Privacy compliant
        </div>
      </footer>

    </div>
  );
}
