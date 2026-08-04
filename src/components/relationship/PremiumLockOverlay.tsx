'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useI18n } from '../../lib/i18n/I18nContext';
import { Shield, Sparkles, Heart, MessageSquare, Compass, ArrowLeft } from 'lucide-react';

interface PremiumLockOverlayProps {
  featureKey: string;
}

export const PremiumLockOverlay: React.FC<PremiumLockOverlayProps> = ({ featureKey }) => {
  const router = useRouter();
  const { locale, t } = useI18n();

  const handleGoToPricing = () => {
    router.push(`/${locale}/pricing`);
  };

  const handleGoBack = () => {
    router.push(`/${locale}/dashboard`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md px-4">
      <div className="relative max-w-md w-full bg-card/40 border border-amber-500/20 rounded-3xl p-8 shadow-2xl glass text-center space-y-6 overflow-hidden">
        {/* Shimmer Gold Effect */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl" />
        
        {/* Lock / Heart Icon Wrapper */}
        <div className="mx-auto w-16 h-16 bg-amber-500/10 border border-amber-500/25 rounded-2xl flex items-center justify-center relative shadow-inner animate-pulse">
          <Shield className="h-8 w-8 text-amber-500" />
          <div className="absolute -bottom-1 -right-1 bg-foreground text-background rounded-full p-1 border border-border">
            <Heart className="h-3 w-3 fill-current" />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="font-serif text-2xl font-bold text-foreground">
            {locale === 'no' ? 'Premium-tilgang påkrevd' : locale === 'pl' ? 'Wymagane konto Premium' : 'Premium Access Required'}
          </h2>
          <p className="text-xs text-muted-foreground font-light leading-relaxed max-w-sm mx-auto">
            {locale === 'no' 
              ? 'Denne funksjonen er forbeholdt våre premium-medlemmer for å sikre høy kvalitet, trygghet og pålitelighet.'
              : locale === 'pl'
              ? 'Ta funkcja jest zarezerwowana dla członków premium, aby zapewnić najwyższą jakość i bezpieczeństwo.'
              : 'This feature is reserved for premium members to ensure maximum match quality, verification standards, and safety.'}
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="bg-secondary/15 rounded-2xl p-4 border border-border/40 text-left text-xs space-y-3.5 max-w-sm mx-auto">
          <div className="flex gap-2.5 items-start">
            <MessageSquare className="h-4.5 w-4.5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-foreground block">
                {locale === 'no' ? 'Ubegrenset meldinger og oversettelse' : locale === 'pl' ? 'Nielimitowane wiadomości i tłumaczenie' : 'Unlimited Chat & AI Translation'}
              </span>
              <span className="text-[10px] text-muted-foreground font-light">
                {locale === 'no' ? 'Kommuniser på tvers av språk uten AI-kostnader.' : locale === 'pl' ? 'Rozmawiaj bez barier językowych.' : 'Communicate across languages seamlessly.'}
              </span>
            </div>
          </div>
          
          <div className="flex gap-2.5 items-start">
            <Compass className="h-4.5 w-4.5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-foreground block">
                {locale === 'no' ? 'Relocation-portaler og nabolagsmatching' : locale === 'pl' ? 'Portale relokacji i dopasowanie dzielnic' : 'Relocation Portals & Dynamic Neighborhoods'}
              </span>
              <span className="text-[10px] text-muted-foreground font-light">
                {locale === 'no' ? 'Planlegg flytting, sammenlign levekostnader og boligmarked.' : locale === 'pl' ? 'Planuj przeprowadzkę i sprawdzaj rynek mieszkaniowy.' : 'Plan your transition, view listings, and calculate living costs.'}
              </span>
            </div>
          </div>

          <div className="flex gap-2.5 items-start">
            <Sparkles className="h-4.5 w-4.5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-foreground block">
                {locale === 'no' ? 'Avansert kompatibilitetsanalyse' : locale === 'pl' ? 'Zaawansowana analiza dopasowania' : 'Advanced Matching & Coach'}
              </span>
              <span className="text-[10px] text-muted-foreground font-light">
                {locale === 'no' ? 'Finjuster vekting og få personlige etablerings-tips.' : locale === 'pl' ? 'Dostosuj filtry i uzyskaj porady relokacyjne.' : 'Fine-tune weights and receive mathematical timeline coach reports.'}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col gap-2 max-w-sm mx-auto">
          <button
            onClick={handleGoToPricing}
            className="w-full py-3 bg-amber-500 text-white font-semibold rounded-2xl text-sm hover:bg-amber-600 transition-colors shadow-lg shadow-amber-500/10 flex items-center justify-center gap-1.5"
          >
            <Sparkles className="h-4 w-4 fill-current" />
            <span>
              {locale === 'no' ? 'Oppgrader til Premium' : locale === 'pl' ? 'Ulepsz do Premium' : 'Upgrade to Premium'}
            </span>
          </button>
          
          <button
            onClick={handleGoBack}
            className="w-full py-3 bg-secondary/20 text-foreground font-semibold rounded-2xl text-xs hover:bg-secondary/30 transition-colors flex items-center justify-center gap-1"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>
              {locale === 'no' ? 'Tilbake til profiler' : locale === 'pl' ? 'Powrót do profili' : 'Back to Profiles'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
