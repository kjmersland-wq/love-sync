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
    chatThreads,
    triggerModal
  } = useApp();

  const { locale, t, changeLanguage } = useI18n();
  const pathname = usePathname() || '';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [billingLoading, setBillingLoading] = useState(false);

  const handleLogout = () => {
    document.cookie = "ls_user_id=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax; Secure";
    triggerModal("Logged Out Successfully", "Your secure session has been terminated.", "success");
    setMobileMenuOpen(false);
    setTimeout(() => {
      window.location.href = `/${locale}`;
    }, 1200);
  };

  const handleAccountDetails = () => {
    setMobileMenuOpen(false);
    triggerModal(
      t('policies.accountTitle'),
      `${t('policies.accountBody')} | Profile Owner: ${userProfile.name || "Alex"}. Age: ${userProfile.age || 30}. Location: ${userProfile.location || "Oslo, Norway"}.`,
      "info"
    );
  };

  const handlePrivacyCheck = () => {
    setMobileMenuOpen(false);
    triggerModal(
      t('policies.privacyTitle'),
      t('policies.privacyBody'),
      "success"
    );
  };

  const handleManageBilling = async () => {
    setBillingLoading(true);
    try {
      const res = await fetch("/api/paddle/portal");
      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }
      let data;
      try {
        data = await res.json();
      } catch (e) {
        throw new Error("Invalid JSON");
      }
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
    { value: 'en', label: '🇬🇧 EN' },
    { value: 'no', label: '🇳🇴 NO' },
    { value: 'pl', label: '🇵🇱 PL' },
    { value: 'de', label: '🇩🇪 DE' },
    { value: 'fr', label: '🇫🇷 FR' },
    { value: 'es', label: '🇪🇸 ES' },
    { value: 'it', label: '🇮🇹 IT' }
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

        {/* Responsive Preferences & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Selector (Always visible in top bar, compact on mobile) */}
          <Select
            options={languageOptions}
            value={locale}
            onChange={(val) => changeLanguage(val as any)}
            className="w-[74px] sm:w-[84px] bg-background/50 border-border/60 hover:bg-secondary/40 transition-colors"
          />

          {/* Membership Badge (Tablet & Desktop only) */}
          <Link 
            href={`/${locale}/pricing`}
            className={`hidden sm:inline-block text-xs font-semibold px-2.5 py-1 rounded-full border transition-all ${
              userProfile.subscription === 'Premium' 
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-500 hover:bg-amber-500/20'
                : 'bg-muted border-border text-muted-foreground hover:bg-secondary'
            }`}
          >
            {userProfile.subscription === 'Premium' ? 'Premium' : 'Not Subscribed'}
          </Link>

          {/* Manage Billing (Premium only, hidden on small screens) */}
          {userProfile.subscription === 'Premium' && (
            <button
              onClick={handleManageBilling}
              disabled={billingLoading}
              className="hidden sm:flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background/50 text-foreground transition-all duration-200 hover:bg-secondary/80 hover:scale-105 disabled:opacity-50"
              title="Manage Billing"
            >
              {billingLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Settings className="h-4.5 w-4.5" />}
            </button>
          )}

          {/* Theme Toggler (Always visible in top bar) */}
          <button
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background/50 text-foreground transition-all duration-200 hover:bg-secondary/80 hover:scale-105"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <Moon className="h-4.5 w-4.5" /> : <Sun className="h-4.5 w-4.5" />}
          </button>

          {/* Hamburger Menu Toggle (Mobile/Tablet only) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background/50 text-foreground md:hidden"
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
                {/* Home */}
                <Link
                  href={`/${locale}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex flex-col items-center justify-center gap-2 rounded-xl border border-border bg-background/50 p-4 text-center text-muted-foreground hover:text-foreground hover:border-foreground transition-all"
                >
                  <Heart className="h-5 w-5 text-red-500 fill-red-500/20" />
                  <span className="text-xs font-semibold">Home</span>
                </Link>

                {/* Explore Matches */}
                <Link
                  href={`/${locale}/dashboard`}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`relative flex flex-col items-center justify-center gap-2 rounded-xl border p-4 text-center transition-all ${
                    isLinkActive(`/${locale}/dashboard`)
                      ? 'border-foreground bg-secondary text-foreground font-semibold'
                      : 'border-border bg-background/50 text-muted-foreground'
                  }`}
                >
                  <Heart className="h-5 w-5" />
                  <span className="text-xs font-semibold">{t('nav.exploreMatches')}</span>
                </Link>

                {/* Messages */}
                <Link
                  href={`/${locale}/messages`}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`relative flex flex-col items-center justify-center gap-2 rounded-xl border p-4 text-center transition-all ${
                    isLinkActive(`/${locale}/messages`)
                      ? 'border-foreground bg-secondary text-foreground font-semibold'
                      : 'border-border bg-background/50 text-muted-foreground'
                  }`}
                >
                  <MessageSquare className="h-5 w-5" />
                  <span className="text-xs font-semibold">{t('nav.messages')}</span>
                  {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[8px] font-bold text-white animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </Link>

                {/* Premium (Pricing) */}
                <Link
                  href={`/${locale}/pricing`}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`relative flex flex-col items-center justify-center gap-2 rounded-xl border p-4 text-center transition-all ${
                    isLinkActive(`/${locale}/pricing`)
                      ? 'border-foreground bg-secondary text-foreground font-semibold'
                      : 'border-border bg-background/50 text-muted-foreground'
                  }`}
                >
                  <CreditCard className="h-5 w-5" />
                  <span className="text-xs font-semibold">Premium</span>
                </Link>

                {/* Help */}
                <Link
                  href={`/${locale}/help`}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`relative flex flex-col items-center justify-center gap-2 rounded-xl border p-4 text-center transition-all ${
                    isLinkActive(`/${locale}/help`)
                      ? 'border-foreground bg-secondary text-foreground font-semibold'
                      : 'border-border bg-background/50 text-muted-foreground'
                  }`}
                >
                  <Settings className="h-5 w-5" />
                  <span className="text-xs font-semibold">Help Center</span>
                </Link>

                {/* Account Details trigger */}
                <button
                  onClick={handleAccountDetails}
                  className="flex flex-col items-center justify-center gap-2 rounded-xl border border-border bg-background/50 p-4 text-center text-muted-foreground hover:text-foreground transition-all"
                >
                  <ShieldCheck className="h-5 w-5 text-amber-500" />
                  <span className="text-xs font-semibold">Account</span>
                </button>
              </div>

              {/* Preferences Form */}
              <div className="border-t border-border pt-4 space-y-4">
                {/* Theme toggle */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted-foreground">Light / Dark</span>
                  <button 
                    onClick={toggleTheme}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-border bg-background hover:bg-secondary transition-colors"
                  >
                    {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
                  </button>
                </div>

                {/* Language Select (Premium wrapping pills for mobile UX) */}
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-semibold text-muted-foreground">Language</span>
                  <div className="flex flex-wrap gap-2">
                    {languageOptions.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => {
                          changeLanguage(opt.value as any);
                          setMobileMenuOpen(false);
                        }}
                        className={`py-1.5 px-3 text-xs font-semibold rounded-xl border transition-all ${
                          locale === opt.value
                            ? 'border-amber-500 bg-amber-500/10 text-amber-500'
                            : 'border-border bg-background hover:bg-secondary text-foreground'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* GDPR & Privacy */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted-foreground">Privacy & GDPR</span>
                  <button 
                    onClick={handlePrivacyCheck}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-border bg-background hover:bg-secondary transition-colors"
                  >
                    Check Compliance
                  </button>
                </div>

                {/* Billing details (if premium) */}
                {userProfile.subscription === 'Premium' && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-muted-foreground">Billing Details</span>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        handleManageBilling();
                      }}
                      disabled={billingLoading}
                      className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-border bg-background flex items-center gap-1.5 disabled:opacity-50 hover:bg-secondary transition-colors"
                    >
                      {billingLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Settings className="h-3 w-3" />}
                      <span>Manage Billing</span>
                    </button>
                  </div>
                )}

                {/* Logout Button */}
                <div className="border-t border-border/40 pt-4">
                  <button
                    onClick={handleLogout}
                    className="w-full py-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-500 font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-2"
                  >
                    Log Out Session
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
