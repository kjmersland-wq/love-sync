'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Heart, Mail, ExternalLink, Globe } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useI18n } from '../lib/i18n/I18nContext';

export default function Footer() {
  const pathname = usePathname() || '';
  const { triggerModal } = useApp();
  const { t } = useI18n();

  // Pathname pattern matches locale prefix (e.g. /en/login, /no/onboarding)
  const isAuthOrOnboarding = pathname.match(
    /\/[a-z]{2}\/(login|register|forgot-password|verify-email|onboarding)/
  ) || pathname.match(/\/(login|register|forgot-password|verify-email|onboarding)/);

  if (isAuthOrOnboarding) {
    return null;
  }

  // Extract locale for link prefixes
  const localeMatch = pathname.match(/^\/([a-z]{2})/);
  const locale = localeMatch ? localeMatch[1] : 'en';

  return (
    <footer className="w-full bg-background border-t border-border/10 py-16 px-4 sm:px-6 lg:px-8 text-foreground relative overflow-hidden">
      
      {/* Subtle layout boundary */}
      <div className="max-w-7xl mx-auto flex flex-col items-center space-y-12">
        
        {/* Logo and Tagline */}
        <div className="flex flex-col items-center space-y-3">
          <Link href={`/${locale}`} className="inline-flex items-center gap-2 font-serif text-lg font-bold tracking-tight text-foreground group">
            <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10 text-red-500 transition-all group-hover:scale-105">
              <Heart className="h-4 w-4 fill-red-500/20" />
            </div>
            <span className="font-sans font-semibold tracking-wide">
              Love <span className="font-light text-muted-foreground transition-colors group-hover:text-foreground">Sync</span>
            </span>
          </Link>
          <p className="text-[10px] text-muted-foreground/80 font-light max-w-xs text-center leading-relaxed">
            The premium serious relationship platform built on explicit weights, zero sorting algorithms, and full data subtraction.
          </p>
        </div>

        {/* Footer Navigation Link Lists */}
        <nav className="flex flex-wrap justify-center items-center gap-y-4 gap-x-8 text-xs font-medium text-muted-foreground">
          <Link href={`/${locale}/help`} className="hover:text-foreground transition-colors">Help Center</Link>
          <Link href={`/${locale}/faq`} className="hover:text-foreground transition-colors">FAQ</Link>
          <Link href={`/${locale}/help#safety`} className="hover:text-foreground transition-colors">Trust & Safety</Link>
          <a 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              triggerModal(
                t('policies.privacyTitle'),
                t('policies.privacyBody'),
                "success"
              );
            }} 
            className="hover:text-foreground transition-colors"
          >
            Privacy Policy
          </a>
          <a 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              triggerModal(
                t('policies.termsTitle'),
                t('policies.termsBody'),
                "info"
              );
            }} 
            className="hover:text-foreground transition-colors"
          >
            Terms of Service
          </a>
          <a 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              triggerModal(
                t('policies.cookiesTitle'),
                t('policies.cookiesBody'),
                "info"
              );
            }} 
            className="hover:text-foreground transition-colors"
          >
            Cookie Policy
          </a>
          <Link href={`/${locale}/help#contact`} className="hover:text-foreground transition-colors">Contact</Link>
        </nav>

        {/* Attribution, Company Info and Contact Links */}
        <div className="w-full border-t border-border/5 pt-8 flex flex-col items-center space-y-4 text-center">
          
          {/* Professional Operating Company attribution */}
          <div className="space-y-1">
            <p className="text-[10px] font-mono tracking-widest text-muted-foreground/50 uppercase">
              OPERATED & OPERATIONAL
            </p>
            <p className="text-xs font-semibold text-foreground/90 font-serif">
              KM TECH LABS
            </p>
            <p className="text-[10px] text-muted-foreground font-light">
              Kristiansand, Norway
            </p>
          </div>

          {/* Attributed links */}
          <div className="flex items-center gap-4 text-[10px] font-medium text-muted-foreground">
            <a 
              href="https://kmtechlabs.no" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center gap-1 hover:text-foreground transition-colors border-b border-transparent hover:border-foreground/30 pb-0.5"
            >
              <Globe className="h-3 w-3" />
              <span>kmtechlabs.no</span>
              <ExternalLink className="h-2 w-2" />
            </a>
            <span className="w-1 h-1 rounded-full bg-border/40" />
            <a 
              href="mailto:operations@kmtechlabs.no" 
              className="inline-flex items-center gap-1 hover:text-foreground transition-colors border-b border-transparent hover:border-foreground/30 pb-0.5"
            >
              <Mail className="h-3 w-3" />
              <span>operations@kmtechlabs.no</span>
            </a>
          </div>

          {/* Copyright notice */}
          <p className="text-[10px] text-muted-foreground/60 font-light pt-2">
            &copy; 2026 Love Sync. All rights reserved.
          </p>

        </div>

      </div>

    </footer>
  );
}
