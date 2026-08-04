'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface AuthLayoutProps {
  locale: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  imageCaption: string;
  trustText: string;
  helpLink?: string;
  helpText?: string;
  children: React.ReactNode;
}

export default function AuthLayout({
  locale,
  title,
  subtitle,
  imageUrl,
  imageCaption,
  trustText,
  helpLink,
  helpText,
  children
}: AuthLayoutProps) {
  const { triggerModal } = useApp();
  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-16 sm:px-6 lg:px-8 relative overflow-hidden text-foreground">
      
      {/* Shared Background ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-red-500/3 dark:bg-red-500/5 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 items-center">
        
        {/* Left Column: Visual storytelling and Brand context */}
        <div className="md:col-span-6 space-y-8 flex flex-col justify-between h-full py-4 text-center md:text-left">
          <div className="space-y-6">
            <Link href={`/${locale}`} className="inline-flex items-center gap-2 font-serif text-xl font-bold tracking-tight text-foreground group justify-center md:justify-start">
              <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-red-500/10 text-red-500 transition-all group-hover:scale-105">
                <Heart className="h-4.5 w-4.5 fill-red-500/20" />
              </div>
              <span className="font-serif">Love Sync</span>
            </Link>
            
            <div className="space-y-3">
              <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-foreground leading-tight">
                {title}
              </h1>
              <p className="text-xs text-muted-foreground font-light leading-relaxed max-w-sm mx-auto md:mx-0">
                {subtitle}
              </p>
            </div>
          </div>

          {/* Editorial Image container */}
          <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden border border-border/20 shadow-md bg-secondary/10 group">
            <img 
              src={imageUrl} 
              alt={imageCaption} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent z-10" />
            <div className="absolute bottom-3 left-4 text-[10px] text-muted-foreground/90 font-mono z-20 uppercase tracking-wider">
              {imageCaption}
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-center md:justify-start gap-2.5 text-xs text-muted-foreground font-light">
              <ShieldCheck className="h-4 w-4 text-green-500 shrink-0" />
              <span>{trustText}</span>
            </div>
          </div>

          {/* Footer Policies */}
          <div className="text-[10px] text-muted-foreground/80 font-light flex gap-4 border-t border-border/20 pt-6 justify-center md:justify-start">
            {helpLink && helpText ? (
              <Link href={helpLink} className="hover:text-foreground transition-colors underline">{helpText}</Link>
            ) : (
              <Link href={`/${locale}/help`} className="hover:text-foreground transition-colors underline">Need assistance?</Link>
            )}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                triggerModal(
                  "GDPR & Data Protection Status",
                  "Love-Sync complies fully with GDPR regulations. All user databases, media, and chat content are encrypted. We maintain zero tracking scripts or cookie networks.",
                  "success"
                );
              }}
              className="hover:text-foreground transition-colors underline"
            >
              Privacy & GDPR
            </a>
          </div>
        </div>

        {/* Right Column: Dynamic Form Container */}
        <div className="md:col-span-6 w-full">
          <div className="bg-card border border-border/20 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 glass">
            {children}
          </div>
        </div>

      </div>

    </div>
  );
}
