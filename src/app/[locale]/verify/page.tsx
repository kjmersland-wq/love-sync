'use client';

import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { useI18n } from '../../../lib/i18n/I18nContext';
import { ShieldCheck, Mail, Phone, Camera, CheckSquare, Check, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Verify() {
  const { locale, t } = useI18n();
  const { userProfile, setVerificationField } = useApp();

  const [step, setStep] = useState<'options' | 'phone' | 'photo' | 'id'>('options');
  
  // Phone verification state
  const [phoneNumber, setPhoneNumber] = useState('');
  const [smsCode, setSmsCode] = useState('');
  const [phoneSubmitted, setPhoneSubmitted] = useState(false);

  // Loading animations status
  const [verifying, setVerifying] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const startPhoneVerification = () => {
    setStep('phone');
    setPhoneSubmitted(false);
    setSmsCode('');
  };

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPhoneSubmitted(true);
  };

  const handlePhoneConfirmCode = (e: React.FormEvent) => {
    e.preventDefault();
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      setVerificationField('phone', true);
      setStep('options');
    }, 1500);
  };

  const startPhotoVerification = () => {
    setStep('photo');
  };

  const handleCapturePhoto = () => {
    setVerifying(true);
    // Simulating biometrics checks in cloudflare workers
    setTimeout(() => {
      setVerifying(false);
      setVerificationField('photo', true);
      setStep('options');
    }, 2000);
  };

  const startIdVerification = () => {
    setStep('id');
    setUploadProgress(0);
  };

  const handleUploadId = () => {
    setVerifying(true);
    let current = 0;
    const interval = setInterval(() => {
      current += 20;
      setUploadProgress(current);
      if (current >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setVerifying(false);
          setVerificationField('id', true);
          setStep('options');
        }, 800);
      }
    }, 300);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 bg-background min-h-screen">
      
      {/* Title */}
      <div className="text-center space-y-4 mb-12">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500 shadow-inner">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground">{t('verify.title')}</h1>
        <p className="text-muted-foreground font-light text-sm max-w-md mx-auto">{t('verify.subtitle')}</p>
      </div>

      {/* Main Wizard */}
      <div className="bg-card border border-border/60 rounded-3xl p-6 sm:p-8 shadow-lg glass">
        
        {step === 'options' && (
          <div className="space-y-6">
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider font-mono border-b border-border/40 pb-3">Verification Checklist</h2>

            <div className="space-y-4">
              {/* Email (Pre-verified) */}
              <div className="flex items-center justify-between p-4 bg-secondary/20 border border-border/40 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-green-500/10 text-green-500 flex items-center justify-center">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">{t('verify.emailLabel')}</h3>
                    <p className="text-[11px] text-muted-foreground font-light">Your registered email address is verified.</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-500 text-xs font-semibold">
                  <Check className="h-3 w-3" />
                  <span>{t('verify.buttonCompleted')}</span>
                </div>
              </div>

              {/* Phone Verification */}
              <div className="flex items-center justify-between p-4 bg-secondary/10 border border-border/40 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className={`h-9 w-9 rounded-xl flex items-center justify-center ${userProfile.verification.phone ? 'bg-green-500/10 text-green-500' : 'bg-blue-500/10 text-blue-500'}`}>
                    <Phone className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">{t('verify.phoneLabel')}</h3>
                    <p className="text-[11px] text-muted-foreground font-light">SMS matching prevents scam registrations.</p>
                  </div>
                </div>
                {userProfile.verification.phone ? (
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-500 text-xs font-semibold">
                    <Check className="h-3 w-3" />
                    <span>{t('verify.buttonCompleted')}</span>
                  </div>
                ) : (
                  <button
                    onClick={startPhoneVerification}
                    className="px-4 py-1.5 rounded-xl bg-foreground text-background text-xs font-semibold hover:bg-foreground/90 transition-all flex items-center gap-1"
                  >
                    <span>{t('verify.buttonVerify')}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {/* Photo Verification */}
              <div className="flex items-center justify-between p-4 bg-secondary/10 border border-border/40 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className={`h-9 w-9 rounded-xl flex items-center justify-center ${userProfile.verification.photo ? 'bg-green-500/10 text-green-500' : 'bg-blue-500/10 text-blue-500'}`}>
                    <Camera className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">{t('verify.photoLabel')}</h3>
                    <p className="text-[11px] text-muted-foreground font-light">Take a real-time biometric selfie matching your face.</p>
                  </div>
                </div>
                {userProfile.verification.photo ? (
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-500 text-xs font-semibold">
                    <Check className="h-3 w-3" />
                    <span>{t('verify.buttonCompleted')}</span>
                  </div>
                ) : (
                  <button
                    onClick={startPhotoVerification}
                    className="px-4 py-1.5 rounded-xl bg-foreground text-background text-xs font-semibold hover:bg-foreground/90 transition-all flex items-center gap-1"
                  >
                    <span>{t('verify.buttonVerify')}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {/* Government ID Verification */}
              <div className="flex items-center justify-between p-4 bg-secondary/10 border border-border/40 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className={`h-9 w-9 rounded-xl flex items-center justify-center ${userProfile.verification.id ? 'bg-green-500/10 text-green-500' : 'bg-blue-500/10 text-blue-500'}`}>
                    <CheckSquare className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">{t('verify.idLabel')}</h3>
                    <p className="text-[11px] text-muted-foreground font-light">Secure scanning of national ID/Passport copy.</p>
                  </div>
                </div>
                {userProfile.verification.id ? (
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-500 text-xs font-semibold">
                    <Check className="h-3 w-3" />
                    <span>{t('verify.buttonCompleted')}</span>
                  </div>
                ) : (
                  <button
                    onClick={startIdVerification}
                    className="px-4 py-1.5 rounded-xl bg-foreground text-background text-xs font-semibold hover:bg-foreground/90 transition-all flex items-center gap-1"
                  >
                    <span>{t('verify.buttonVerify')}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Verification complete summary badge */}
            {userProfile.verification.email && userProfile.verification.phone && userProfile.verification.photo && userProfile.verification.id && (
              <div className="mt-8 p-4 bg-green-500/5 dark:bg-green-500/10 border border-green-500/20 rounded-2xl text-center space-y-2">
                <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-green-500/10 text-green-500 animate-bounce">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-semibold text-foreground">{t('verify.successMsg')}</h3>
                <p className="text-xs text-muted-foreground font-light">You are now a fully verified Love Sync member. Your trust badge is displayed to high-compatibility matches.</p>
              </div>
            )}
          </div>
        )}

        {/* Step: Phone SMS Code */}
        {step === 'phone' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-border/40 pb-3">
              <h2 className="text-sm font-semibold text-foreground">{t('verify.phoneLabel')}</h2>
              <button onClick={() => setStep('options')} className="text-xs text-muted-foreground hover:text-foreground">Cancel</button>
            </div>

            {!phoneSubmitted ? (
              <form onSubmit={handlePhoneSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Mobile Phone Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="+47 900 00 000"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full bg-background border border-border px-4 py-2.5 text-xs rounded-xl focus:outline-none focus:border-foreground"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-foreground text-background text-xs font-semibold hover:bg-foreground/90 transition-colors"
                >
                  Send Verification SMS
                </button>
              </form>
            ) : (
              <form onSubmit={handlePhoneConfirmCode} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Enter 6-Digit Code sent to {phoneNumber}</label>
                  <input
                    type="text"
                    required
                    placeholder="123456"
                    maxLength={6}
                    value={smsCode}
                    onChange={(e) => setSmsCode(e.target.value)}
                    className="w-full bg-background border border-border px-4 py-2.5 text-xs rounded-xl focus:outline-none focus:border-foreground text-center tracking-widest font-mono font-bold text-lg"
                  />
                </div>
                <button
                  type="submit"
                  disabled={verifying}
                  className="w-full py-2.5 rounded-xl bg-foreground text-background text-xs font-semibold hover:bg-foreground/90 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                >
                  {verifying && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  <span>Confirm SMS Code</span>
                </button>
              </form>
            )}
          </div>
        )}

        {/* Step: Photo Biometric */}
        {step === 'photo' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-border/40 pb-3">
              <h2 className="text-sm font-semibold text-foreground">{t('verify.photoLabel')}</h2>
              <button onClick={() => setStep('options')} className="text-xs text-muted-foreground hover:text-foreground">Cancel</button>
            </div>

            {/* Webcam Mock Area */}
            <div className="relative w-full aspect-video rounded-2xl bg-secondary flex flex-col items-center justify-center border border-border overflow-hidden p-6 text-center text-muted-foreground">
              {verifying ? (
                <div className="space-y-4">
                  <Loader2 className="h-8 w-8 text-foreground animate-spin mx-auto" />
                  <p className="text-xs text-foreground font-mono">Running Turnstile biometrics validator...</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <Camera className="h-8 w-8 text-muted-foreground/60 mx-auto" />
                  <p className="text-xs font-mono">{t('verify.cameraMock')}</p>
                  <p className="text-[10px] text-muted-foreground max-w-xs mx-auto">Please ensure your face is fully lit and fits within the frame.</p>
                </div>
              )}
            </div>

            <button
              onClick={handleCapturePhoto}
              disabled={verifying}
              className="w-full py-3 rounded-xl bg-foreground text-background text-xs font-semibold hover:bg-foreground/90 disabled:opacity-50 transition-colors flex items-center justify-center gap-2 shadow"
            >
              {verifying ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Camera className="h-4 w-4" />}
              <span>{t('verify.photoCapture')}</span>
            </button>
          </div>
        )}

        {/* Step: Government ID File Picker */}
        {step === 'id' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-border/40 pb-3">
              <h2 className="text-sm font-semibold text-foreground">{t('verify.idLabel')}</h2>
              <button onClick={() => setStep('options')} className="text-xs text-muted-foreground hover:text-foreground">Cancel</button>
            </div>

            <div className="space-y-4">
              <div className="border border-dashed border-border/60 rounded-2xl p-8 text-center bg-secondary/15 flex flex-col items-center justify-center space-y-3">
                <CheckSquare className="h-8 w-8 text-muted-foreground/60" />
                <p className="text-xs text-foreground font-medium">Select passport, drivers license or identity card copy</p>
                <p className="text-[10px] text-muted-foreground">PDF, JPEG, or PNG formats up to 5MB are encrypted and stored inside private Cloudflare R2 buckets.</p>
              </div>

              {verifying ? (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold font-mono">
                    <span className="text-muted-foreground">Uploading ID...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-foreground rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleUploadId}
                  className="w-full py-2.5 rounded-xl bg-foreground text-background text-xs font-semibold hover:bg-foreground/90 transition-colors"
                >
                  {t('verify.idUpload')}
                </button>
              )}
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
