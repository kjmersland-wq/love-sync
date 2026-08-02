'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { useI18n } from '../../../lib/i18n/I18nContext';
import { helpCategories, helpArticles, HelpArticle, HelpCategory } from '../../../lib/i18n/helpData';
import { Sparkles, Heart, ShieldCheck, Search, HelpCircle, ChevronRight, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const iconMap: Record<string, React.ComponentType<any>> = {
  Sparkles,
  Heart,
  ShieldCheck
};

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default function HelpCenter({ params }: PageProps) {
  const { locale } = use(params);
  const { locale: activeLocale, t } = useI18n();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const currentLang = (activeLocale || 'en') as string;

  // Filter articles based on category and search query
  const filteredArticles = helpArticles.filter(art => {
    const title = (art.title[currentLang] || art.title['en'] || '').toLowerCase();
    const content = (art.content[currentLang] || art.content['en'] || '').toLowerCase();
    const matchesSearch = title.includes(searchQuery.toLowerCase()) || content.includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory ? art.categoryId === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  const getLocalizedCategoryTitle = (cat: HelpCategory) => {
    return cat.title[currentLang] || cat.title['en'] || cat.id;
  };

  const getLocalizedCategoryDesc = (cat: HelpCategory) => {
    return cat.description[currentLang] || cat.description['en'] || '';
  };

  const getLocalizedArticleTitle = (art: HelpArticle) => {
    return art.title[currentLang] || art.title['en'] || art.id;
  };

  const getLocalizedArticleContent = (art: HelpArticle) => {
    return art.content[currentLang] || art.content['en'] || '';
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
          href={`/${locale}/faq`}
          className="inline-flex items-center gap-1 text-xs text-red-500 font-semibold hover:underline"
        >
          <span>View complete FAQ</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Header */}
      <div className="space-y-4 text-center max-w-xl mx-auto">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-red-500/10 text-red-500 shadow-inner">
          <HelpCircle className="h-5 w-5" />
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          How can we help you?
        </h1>
        <p className="text-muted-foreground font-light text-xs sm:text-sm">
          Search our knowledge base or browse support categories to manage your Love Sync premium experience.
        </p>
      </div>

      {/* Interactive Search Bar */}
      <div className="max-w-xl mx-auto relative group">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-muted-foreground/60 group-focus-within:text-foreground transition-colors">
          <Search className="h-4 w-4" />
        </div>
        <input
          type="text"
          placeholder="Search articles (e.g. ID verification, subscription cancellation, weights...)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-card border border-border/80 pl-11 pr-4 py-3.5 text-xs rounded-2xl focus:outline-none focus:border-foreground focus:ring-1 focus:ring-foreground transition-all shadow-sm"
        />
      </div>

      {/* Categories Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {helpCategories.map(cat => {
          const Icon = iconMap[cat.icon] || HelpCircle;
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(isSelected ? null : cat.id)}
              className={`p-6 rounded-2xl border text-left flex flex-col justify-between gap-4 transition-all shadow-sm ${
                isSelected 
                  ? 'border-foreground bg-secondary/30 scale-[1.01]' 
                  : 'border-border/60 bg-card/50 hover:bg-secondary/15 hover:border-border'
              }`}
            >
              <div className={`p-2.5 rounded-xl inline-flex w-fit ${isSelected ? 'bg-foreground text-background' : 'bg-secondary text-foreground'}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider font-mono">
                  {getLocalizedCategoryTitle(cat)}
                </h3>
                <p className="text-[11px] text-muted-foreground font-light leading-relaxed">
                  {getLocalizedCategoryDesc(cat)}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Help Articles List */}
      <div className="space-y-6">
        <div className="border-b border-border/40 pb-3 flex justify-between items-center">
          <h2 className="font-serif text-lg font-bold text-foreground">
            {selectedCategory ? 'Category Articles' : 'Suggested Documentation'}
          </h2>
          <span className="text-[10px] text-muted-foreground font-mono">
            {filteredArticles.length} ARTICLES
          </span>
        </div>

        {filteredArticles.length === 0 ? (
          <div className="text-center py-12 bg-card/20 rounded-2xl border border-dashed border-border/60 text-xs text-muted-foreground font-light">
            No articles match your query. Try resetting filters or using simpler keywords.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredArticles.map((art, idx) => (
              <motion.div
                key={art.id}
                className="bg-card border border-border/50 rounded-2xl p-6 space-y-3 hover:border-border transition-colors shadow-sm"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <h3 className="font-serif text-base font-bold text-foreground">
                  {getLocalizedArticleTitle(art)}
                </h3>
                <p className="text-xs text-muted-foreground font-light leading-relaxed">
                  {getLocalizedArticleContent(art)}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Support footer */}
      <div className="bg-secondary/20 rounded-2xl border border-border/40 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div className="space-y-1">
          <h4 className="text-xs font-bold text-foreground">Still need help?</h4>
          <p className="text-[11px] text-muted-foreground font-light">
            Our premium member support desk responds to queries within 2 hours.
          </p>
        </div>
        <Link 
          href={`/${locale}`}
          onClick={(e) => { e.preventDefault(); alert("Support request simulated. Under v1.0 philosophy, direct inquiries can be routed to support@love-sync.com."); }}
          className="px-4 py-2 bg-foreground text-background text-xs font-semibold rounded-xl hover:bg-foreground/90 transition-colors shadow"
        >
          Contact Support
        </Link>
      </div>
      
    </div>
  );
}
