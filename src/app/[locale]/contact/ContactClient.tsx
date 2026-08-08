'use client';

import React, { useState } from 'react';
import {
  Mail, User, Phone, Building2, MessageSquare, Send,
  CheckCircle2, AlertCircle, Loader2, ShieldCheck, Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import TurnstileWidget from '../../../components/TurnstileWidget';
import { useI18n } from '../../../lib/i18n/I18nContext';

type InquiryType = 'general' | 'support' | 'partnership' | 'business' | 'pricing' | 'other';

const INQUIRY_OPTIONS: { value: InquiryType; label: string }[] = [
  { value: 'general', label: 'General Inquiry' },
  { value: 'support', label: 'Support' },
  { value: 'partnership', label: 'Partnership' },
  { value: 'business', label: 'Business Inquiry' },
  { value: 'pricing', label: 'Pricing' },
  { value: 'other', label: 'Other' },
];

interface FormState {
  name: string;
  email: string;
  phone: string;
  company: string;
  inquiryType: InquiryType;
  message: string;
  consent: boolean;
  website: string; // honeypot - kept empty by real users
}

const INITIAL_STATE: FormState = {
  name: '',
  email: '',
  phone: '',
  company: '',
  inquiryType: 'general',
  message: '',
  consent: false,
  website: '',
};

export default function ContactClient() {
  const { t } = useI18n();
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  const updateField = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validateClientSide = (): boolean => {
    const errors: Record<string, string> = {};

    if (form.name.trim().length < 2) {
      errors.name = 'Please enter your full name.';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      errors.email = 'Please enter a valid email address.';
    }
    if (form.phone.trim().length > 0 && form.phone.trim().length > 40) {
      errors.phone = 'Please enter a valid phone number.';
    }
    if (form.message.trim().length < 10) {
      errors.message = 'Please write at least 10 characters so we can help.';
    }
    if (form.message.trim().length > 4000) {
      errors.message = 'Message is too long (4000 characters max).';
    }
    if (!form.consent) {
      errors.consent = 'Please confirm you agree to be contacted about this inquiry.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validateClientSide()) {
      return;
    }

    setStatus('submitting');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim() || undefined,
          company: form.company.trim() || undefined,
          inquiryType: form.inquiryType,
          message: form.message.trim(),
          consent: form.consent,
          website: form.website,
          turnstileToken: turnstileToken || undefined,
        }),
      });

      let data: any = null;
      try {
        data = await res.json();
      } catch (e) {
        throw new Error('Unexpected response from server. Please try again.');
      }

      if (!res.ok || !data?.success) {
        if (data?.fieldErrors) {
          setFieldErrors(data.fieldErrors);
        }
        throw new Error(data?.details || data?.error || 'Failed to send your message.');
      }

      setStatus('success');
    } catch (err) {
      setStatus('error');
      setSubmitError((err as Error).message);
    }
  };

  const handleSendAnother = () => {
    setForm(INITIAL_STATE);
    setFieldErrors({});
    setSubmitError(null);
    setTurnstileToken(null);
    setStatus('idle');
  };

  const inputClasses = (hasError: boolean) =>
    `w-full bg-secondary/35 border rounded-xl pl-10 pr-4 py-3 text-xs focus:outline-none focus:ring-1 transition-all font-light ${
      hasError
        ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500'
        : 'border-border/50 focus:border-foreground focus:ring-foreground'
    }`;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 bg-background min-h-screen">

      {/* Title */}
      <div className="text-center space-y-4 mb-10">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-500 shadow-inner">
          <Sparkles className="h-6 w-6" />
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          {t('contact.title')}
        </h1>
        <p className="text-muted-foreground font-light text-sm max-w-md mx-auto">
          {t('contact.subtitle')}
        </p>
      </div>

      <div className="bg-card border border-border/70 rounded-3xl p-6 sm:p-8 shadow-lg relative overflow-hidden glass">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />

        <AnimatePresence mode="wait">
          {status === 'success' ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center py-8 space-y-4 relative z-10"
            >
              <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 shadow-inner">
                <CheckCircle2 className="h-7 w-7" />
              </div>
              <h2 className="font-serif text-xl font-bold text-foreground">Message sent successfully</h2>
              <p className="text-xs text-muted-foreground font-light max-w-sm mx-auto leading-relaxed">
                Thank you for reaching out. Our team typically responds within 1-2 business days. We've noted your inquiry and will follow up at the email address you provided.
              </p>
              <button
                onClick={handleSendAnother}
                className="mt-2 px-5 py-2.5 rounded-xl border border-border bg-secondary/35 text-foreground text-xs font-semibold hover:bg-secondary/60 transition-colors shadow"
              >
                Send another message
              </button>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit}
              className="space-y-6 relative z-10"
              noValidate
            >
              <AnimatePresence>
                {status === 'error' && submitError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-red-500/5 border border-red-500/20 rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-red-500"
                    role="alert"
                  >
                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>{submitError}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Honeypot field - visually hidden, real users never see or fill this */}
              <div className="absolute -left-[9999px] top-0" aria-hidden="true">
                <label htmlFor="website">Leave this field empty</label>
                <input
                  id="website"
                  name="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={form.website}
                  onChange={(e) => updateField('website', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Name */}
                <div className="space-y-1.5">
                  <label htmlFor="name" className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground font-medium">
                    Full Name
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-muted-foreground/60 group-focus-within:text-foreground transition-colors">
                      <User className="h-4 w-4" />
                    </div>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      autoComplete="name"
                      placeholder="Jane Doe"
                      value={form.name}
                      onChange={(e) => updateField('name', e.target.value)}
                      className={inputClasses(!!fieldErrors.name)}
                      aria-invalid={!!fieldErrors.name}
                      aria-describedby={fieldErrors.name ? 'name-error' : undefined}
                    />
                  </div>
                  {fieldErrors.name && (
                    <p id="name-error" className="text-[10px] text-red-500 font-light pl-1">{fieldErrors.name}</p>
                  )}
                </div>

                {/* Email */}
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
                      value={form.email}
                      onChange={(e) => updateField('email', e.target.value)}
                      className={inputClasses(!!fieldErrors.email)}
                      aria-invalid={!!fieldErrors.email}
                      aria-describedby={fieldErrors.email ? 'email-error' : undefined}
                    />
                  </div>
                  {fieldErrors.email && (
                    <p id="email-error" className="text-[10px] text-red-500 font-light pl-1">{fieldErrors.email}</p>
                  )}
                </div>

                {/* Phone (optional) */}
                <div className="space-y-1.5">
                  <label htmlFor="phone" className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground font-medium">
                    Phone <span className="text-muted-foreground/50 normal-case">(optional)</span>
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-muted-foreground/60 group-focus-within:text-foreground transition-colors">
                      <Phone className="h-4 w-4" />
                    </div>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      placeholder="+1 555 000 0000"
                      value={form.phone}
                      onChange={(e) => updateField('phone', e.target.value)}
                      className={inputClasses(!!fieldErrors.phone)}
                      aria-invalid={!!fieldErrors.phone}
                    />
                  </div>
                  {fieldErrors.phone && (
                    <p className="text-[10px] text-red-500 font-light pl-1">{fieldErrors.phone}</p>
                  )}
                </div>

                {/* Company (optional) */}
                <div className="space-y-1.5">
                  <label htmlFor="company" className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground font-medium">
                    Company <span className="text-muted-foreground/50 normal-case">(optional)</span>
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-muted-foreground/60 group-focus-within:text-foreground transition-colors">
                      <Building2 className="h-4 w-4" />
                    </div>
                    <input
                      id="company"
                      name="company"
                      type="text"
                      autoComplete="organization"
                      placeholder="Acme Inc."
                      value={form.company}
                      onChange={(e) => updateField('company', e.target.value)}
                      className={inputClasses(!!fieldErrors.company)}
                      aria-invalid={!!fieldErrors.company}
                    />
                  </div>
                  {fieldErrors.company && (
                    <p className="text-[10px] text-red-500 font-light pl-1">{fieldErrors.company}</p>
                  )}
                </div>
              </div>

              {/* Inquiry type */}
              <div className="space-y-1.5">
                <label htmlFor="inquiryType" className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground font-medium">
                  Inquiry Type
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {INQUIRY_OPTIONS.map((opt) => {
                    const isActive = form.inquiryType === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => updateField('inquiryType', opt.value)}
                        aria-pressed={isActive}
                        className={`py-2.5 px-3 rounded-xl border text-[11px] font-semibold transition-all ${
                          isActive
                            ? 'bg-foreground border-foreground text-background shadow'
                            : 'bg-background border-border text-muted-foreground hover:bg-secondary/40'
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Message */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between pl-1">
                  <label htmlFor="message" className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground font-medium">
                    Message
                  </label>
                  <span className="text-[10px] text-muted-foreground/60 font-mono">{form.message.length}/4000</span>
                </div>
                <div className="relative group">
                  <div className="absolute top-3.5 left-3.5 pointer-events-none text-muted-foreground/60 group-focus-within:text-foreground transition-colors">
                    <MessageSquare className="h-4 w-4" />
                  </div>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    maxLength={4000}
                    placeholder="Tell us how we can help..."
                    value={form.message}
                    onChange={(e) => updateField('message', e.target.value)}
                    className={`${inputClasses(!!fieldErrors.message)} pt-3 resize-none`}
                    aria-invalid={!!fieldErrors.message}
                    aria-describedby={fieldErrors.message ? 'message-error' : undefined}
                  />
                </div>
                {fieldErrors.message && (
                  <p id="message-error" className="text-[10px] text-red-500 font-light pl-1">{fieldErrors.message}</p>
                )}
              </div>

              {/* Consent */}
              <div className="space-y-1.5">
                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={form.consent}
                    onChange={(e) => updateField('consent', e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-border/60 accent-foreground shrink-0"
                    aria-invalid={!!fieldErrors.consent}
                  />
                  <span className="text-[11px] text-muted-foreground font-light leading-relaxed">
                    I agree to be contacted by Love Sync regarding this inquiry and understand my information will be handled in accordance with the Privacy Policy.
                  </span>
                </label>
                {fieldErrors.consent && (
                  <p className="text-[10px] text-red-500 font-light pl-1">{fieldErrors.consent}</p>
                )}
              </div>

              {/* Spam protection */}
              <div className="space-y-2">
                <TurnstileWidget onVerify={setTurnstileToken} />
                <div className="bg-secondary/20 rounded-xl p-3.5 border border-border/20 flex items-center justify-between text-[10px] text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-green-500" />
                    <span>Protected against spam and abuse</span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 to-indigo-600 hover:from-rose-600 hover:to-indigo-700 text-white font-bold text-xs disabled:opacity-50 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg"
              >
                {status === 'submitting' ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
