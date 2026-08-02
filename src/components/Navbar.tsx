'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '../context/AppContext';
import { useI18n } from '../lib/i18n/I18nContext';
import { Select } from './ui/Select';
import { Sun, Moon, Menu, X, Heart, MessageSquare, ShieldCheck, CreditCard, Settings, Sparkles, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar: React.FC = () => {
  const {
    userProfile,
    theme,
    toggleTheme,
    chatThreads
  } = useApp();

  const { locale, t, changeLanguage } = useI18n();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [billingLoading, setBillingLoading] = useState(false);

  const handleManageBilling = async () => {
    setBillingLoading(true);
    try {
      const res = await fetch("/api/paddle/portal");
      const data = await res.json();
      if (data.success && data.portalUrl) {
        window.open(data.portalUrl, "_blank");
      } else {
        window.location.href = `/${locale}/pricing`;
      }
    } catch (e) {
      window.location.href = `/${locale}/pricing`;
    } finally {
      setBillingLoading(false);
    }
  };

  // Unread messages count
  const unreadCount = Object.values(chatThreads).reduce((acc, thread) => {
    return acc + thread.filter(m => m.senderId !== 'user' && !m.read).length;
  }, 0);

  const navLinks = [
    { name: t('nav.exploreMatches'), href: `/${locale}/dashboard`, icon: Heart },
    { name: t('nav.messages'), href: `/${locale}/messages`, icon: MessageSquare, badge: unreadCount > 0 ? unreadCount : undefined },
    { name: t('nav.pricing'), href: `/${locale}/pricing`, icon: CreditCard }
  ];

  const languageOptions = [
    { value: 'en', label: '🇬🇧 English' },
    { value: 'no', label: '🇳🇴 Norsk' },
    { value: 'pl', label: '🇵🇱 Polski' },
    { value: 'de', label: '🇩🇪 Deutsch' },
    { value: 'fr', label: '🇫🇷 Français' },
    { value: 'es', label: '🇪🇸 Español' },
    { value: 'it', label: '🇮🇹 Italiano' }
  ];

  const isLinkActive = (href: string) => {
    if (pathname === href) return true;
    const pathNoLocale = pathname.replace(/^\/[a-z]{2}/, '') || '/';
    const hrefNoLocale = href.replace(/^\/[a-z]{2}/, '') || '/';
    return pathNoLocale === hrefNoLocale;
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand logo */}
        <Link href={`/${locale}`} className="flex items-center gap-2 font-serif text-xl font-bold tracking-tight text-foreground group">
          <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10 text-red-500 transition-all group-hover:scale-105">
            <Heart className="h-4 w-4 fill-red-500/20" />
            <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-amber-500" />
          </div>
          <span className="font-sans font-semibold tracking-wide">Love <span className="font-light text-muted-foreground transition-colors group-hover:text-foreground">Sync</span></span>
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => {
            const isActive = isLinkActive(link.href);
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`relative flex items-center gap-1.5 text-sm font-medium transition-colors duration-200 hover:text-foreground py-1.5 ${
                  isActive ? 'text-foreground font-semibold' : 'text-muted-foreground'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{link.name}</span>
                {link.badge && (
                  <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white animate-pulse">
                    {link.badge}
                  </span>
                )}
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute -bottom-[21px] left-0 h-[2px] w-full bg-foreground"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Preferences */}
        <div className="hidden md:flex items-center gap-3">
          {/* Language Selector */}
          <Select
            options={languageOptions}
            value={locale}
            onChange={(val) => changeLanguage(val as any)}
            className="w-32 bg-background/50 border-border/60 hover:bg-secondary/40 transition-colors"
          />

          {/* Membership Badge */}
          <Link 
            href={`/${locale}/pricing`}
            className={`text-xs font-semibold px-2.5 py-1 rounded-full border transition-all ${
              userProfile.subscription === 'Premium' 
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-500 hover:bg-amber-500/20'
                : 'bg-muted border-border text-muted-foreground hover:bg-secondary'
            }`}
          >
            {userProfile.subscription === 'Premium' ? 'Premium' : 'Free Tier'}
          </Link>

          {/* Manage Billing (Premium only) */}
          {userProfile.subscription === 'Premium' && (
            <button
              onClick={handleManageBilling}
              disabled={billingLoading}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background/50 text-foreground transition-all duration-200 hover:bg-secondary/80 hover:scale-105 disabled:opacity-50"
              title="Manage Billing"
            >
              {billingLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Settings className="h-4.5 w-4.5" />}
            </button>
          )}

          {/* Theme Toggler */}
          <button
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background/50 text-foreground transition-all duration-200 hover:bg-secondary/80 hover:scale-105"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <Moon className="h-4.5 w-4.5" /> : <Sun className="h-4.5 w-4.5" />}
          </button>
        </div>

        {/* Mobile menu toggle */}
        <div className="flex items-center gap-2 md:hidden">
          {/* Quick theme toggle */}
          <button
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background/50 text-foreground"
          >
            {theme === 'light' ? <Moon className="h-4.5 w-4.5" /> : <Sun className="h-4.5 w-4.5" />}
          </button>

          {/* Hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background/50 text-foreground"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile navigation drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="border-t border-border bg-background/95 backdrop-blur-lg md:hidden overflow-hidden"
          >
            <div className="space-y-4 px-4 py-6">
              {/* Navigation Links */}
              <div className="grid grid-cols-2 gap-3">
                {navLinks.map((link) => {
                  const isActive = isLinkActive(link.href);
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`relative flex flex-col items-center justify-center gap-2 rounded-xl border p-4 text-center transition-all ${
                        isActive
                          ? 'border-foreground bg-secondary text-foreground font-semibold'
                          : 'border-border bg-background/50 text-muted-foreground'
                      }`}
                    >
                      <Icon className="h-5 w-5 text-muted-foreground" />
                      <span className="text-xs">{link.name}</span>
                      {link.badge && (
                        <span className="absolute top-2 right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[8px] font-bold text-white animate-pulse">
                          {link.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>

              {/* Preferences Form */}
              <div className="border-t border-border pt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">{t('nav.themeLight')} / {t('nav.themeDark')}</span>
                  <button 
                    onClick={toggleTheme}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-border bg-background"
                  >
                    {theme === 'light' ? t('nav.themeDark') : t('nav.themeLight')}
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">Language</span>
                  <Select
                    options={languageOptions}
                    value={locale}
                    onChange={(val) => {
                      changeLanguage(val as any);
                      setMobileMenuOpen(false);
                    }}
                    className="w-44"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">Membership</span>
                  <Link
                    href={`/${locale}/pricing`}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${
                      userProfile.subscription === 'Premium'
                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-500'
                        : 'bg-muted border-border text-muted-foreground'
                    }`}
                  >
                    {userProfile.subscription === 'Premium' ? 'Premium Member' : 'Upgrade Account'}
                  </Link>
                </div>
                {userProfile.subscription === 'Premium' && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">Billing Details</span>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        handleManageBilling();
                      }}
                      disabled={billingLoading}
                      className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-border bg-background flex items-center gap-1.5 disabled:opacity-50"
                    >
                      {billingLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Settings className="h-3 w-3" />}
                      <span>Manage Billing</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
