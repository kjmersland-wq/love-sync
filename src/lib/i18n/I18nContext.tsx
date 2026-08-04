'use client';

import React, { createContext, useContext, useTransition } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { en, no, pl, de, fr, es, it } from './translations';
import { getLocalizedUrl, Locale } from './i18n';

type TranslationsDictionary = typeof en;

interface I18nContextType {
  locale: Locale;
  t: (key: string, variables?: { [key: string]: string | number }) => any;
  changeLanguage: (newLocale: Locale) => void;
  isPending: boolean;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ locale: string; children: React.ReactNode }> = ({
  locale,
  children,
}) => {
  const router = useRouter();
  const pathname = usePathname() || '';
  const [isPending, startTransition] = useTransition();

  const activeLocale = (['en', 'no', 'pl', 'de', 'fr', 'es', 'it'].includes(locale) ? locale : 'en') as Locale;

  // Translation resolver helper
  const t = (key: string, variables?: { [key: string]: string | number }): any => {
    const dictionaries = { en, no, pl, de, fr, es, it };
    const dictionary = dictionaries[activeLocale] || en;
    const fallbackDictionary = en;

    const keys = key.split('.');
    
    // Resolve translation path in active dictionary
    let value: any = dictionary;
    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        value = undefined;
        break;
      }
    }

    // Try fallback to English dictionary if undefined
    if (value === undefined) {
      value = fallbackDictionary;
      for (const k of keys) {
        if (value && typeof value === 'object') {
          value = value[k];
        } else {
          value = undefined;
          break;
        }
      }
    }

    if (value === undefined) {
      return key;
    }

    if (Array.isArray(value)) {
      return value;
    }

    if (typeof value !== 'string') {
      return key;
    }

    // Replace variables (e.g. {name} or {count})
    if (variables) {
      let result = value;
      for (const [varName, varVal] of Object.entries(variables)) {
        result = result.replace(new RegExp(`{${varName}}`, 'g'), String(varVal));
      }
      return result;
    }

    return value;
  };

  const changeLanguage = (newLocale: Locale) => {
    if (newLocale === activeLocale) return;
    
    startTransition(() => {
      // Get translated target path (e.g. /no/polen/warszawa <=> /en/poland/warsaw)
      const targetUrl = getLocalizedUrl(newLocale, pathname);
      router.push(targetUrl);
    });
  };

  return (
    <I18nContext.Provider value={{ locale: activeLocale, t, changeLanguage, isPending }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};
