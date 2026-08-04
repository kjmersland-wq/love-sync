'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useI18n } from '../../../lib/i18n/I18nContext';
import { faqData } from '../../../lib/i18n/helpData';
import { HelpCircle, ChevronDown, Search, ArrowLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FaqClientProps {
  locale: string;
}

export default function FaqClient({ locale }: FaqClientProps) {
  const { locale: activeLocale } = useI18n();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const currentLang = (activeLocale || 'en') as keyof typeof faqData[0]['question'];

  // Categories list
  const categories = ['General', 'Billing', 'Privacy'];

  // Filter FAQ based on category and search
  const filteredFAQ = faqData.filter((faq) => {
    const question = (faq.question[currentLang] || faq.question['en'] || '').toLowerCase();
    const answer = (faq.answer[currentLang] || faq.answer['en'] || '').toLowerCase();
    
    const matchesSearch = question.includes(searchQuery.toLowerCase()) || answer.includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory ? faq.category === selectedCategory : true;
    
    return matchesSearch && matchesCategory;
  });

  const getLocalizedQuestion = (faq: typeof faqData[0]) => {
    return faq.question[currentLang] || faq.question['en'] || '';
  };

  const getLocalizedAnswer = (faq: typeof faqData[0]) => {
    return faq.answer[currentLang] || faq.answer['en'] || '';
  };

  const toggleAccordion = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 bg-background min-h-screen space-y-12">
      
      {/* Back to Home Navigation */}
      <div className="flex items-center justify-between">
        <Link 
          href={`/${locale}`}
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors font-medium"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to home</span>
        </Link>
        <Link 
          href={`/${locale}/help`}
          className="inline-flex items-center gap-1 text-xs text-red-500 font-semibold hover:underline"
        >
          <span>Open Help Center</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Header */}
      <div className="space-y-4 text-center max-w-xl mx-auto">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500 shadow-inner">
          <HelpCircle className="h-5 w-5" />
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          Frequently Asked Questions
        </h1>
        <p className="text-muted-foreground font-light text-xs sm:text-sm">
          Quick answers to common questions about Love Sync premium subscriptions, matching factors, and safety audits.
        </p>
      </div>

      {/* Search Input */}
      <div className="max-w-xl mx-auto relative group">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-muted-foreground/60 group-focus-within:text-foreground transition-colors">
          <Search className="h-4 w-4" />
        </div>
        <input
          type="text"
          placeholder="Search FAQs..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setOpenIndex(null); // Close active accordion
          }}
          className="w-full bg-card border border-border/80 pl-11 pr-4 py-3.5 text-xs rounded-2xl focus:outline-none focus:border-foreground focus:ring-1 focus:ring-foreground transition-all shadow-sm"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex justify-center gap-3 border-b border-border/20 pb-6">
        <button
          onClick={() => { setSelectedCategory(null); setOpenIndex(null); }}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
            selectedCategory === null 
              ? 'bg-foreground text-background shadow-md' 
              : 'border border-border/60 text-muted-foreground hover:text-foreground bg-card/45'
          }`}
        >
          All Categories
        </button>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => { setSelectedCategory(cat); setOpenIndex(null); }}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              selectedCategory === cat 
                ? 'bg-foreground text-background shadow-md' 
                : 'border border-border/60 text-muted-foreground hover:text-foreground bg-card/45'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Accordion List */}
      <div className="space-y-4 max-w-3xl mx-auto">
        {filteredFAQ.length === 0 ? (
          <div className="text-center py-12 bg-card/20 rounded-2xl border border-dashed border-border/60 text-xs text-muted-foreground font-light">
            No matching questions found. Try search query overrides.
          </div>
        ) : (
          filteredFAQ.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div 
                key={idx}
                className="bg-card border border-border/50 rounded-2xl overflow-hidden hover:border-border transition-colors shadow-sm"
              >
                <button
                  onClick={() => toggleAccordion(idx)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                >
                  <span className="font-serif text-sm sm:text-base font-bold text-foreground pr-4">
                    {getLocalizedQuestion(faq)}
                  </span>
                  <ChevronDown className={`h-4 w-4 text-muted-foreground shrink-0 transition-transform duration-300 ${
                    isOpen ? 'rotate-180 text-foreground' : 'rotate-0'
                  }`} />
                </button>
                
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-1 text-xs text-muted-foreground font-light leading-relaxed border-t border-border/30 bg-secondary/15">
                        {getLocalizedAnswer(faq)}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
