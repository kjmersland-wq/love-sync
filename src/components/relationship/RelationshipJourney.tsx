'use client';

import React, { useState, useEffect } from 'react';
import { useI18n } from '../../lib/i18n/I18nContext';
import { RelationshipProfile } from '../../data/mockDb';
import { Compass, Heart, MessageSquare, Video, MapPin, Award, Sparkles, Loader2, Play } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

interface RelationshipJourneyProps {
  activeProfile: RelationshipProfile;
  locale: string;
}

export const RelationshipJourney: React.FC<RelationshipJourneyProps> = ({ activeProfile, locale }) => {
  const { t } = useI18n();
  const [stage, setStage] = useState<string>('Relocation Planning');
  const [loading, setLoading] = useState(false);
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);

  const stages = [
    { key: 'discovery', icon: Compass, label: t('relationshipPlatform.journeyStages.discovery') },
    { key: 'firstMatch', icon: Heart, label: t('relationshipPlatform.journeyStages.firstMatch') },
    { key: 'firstConv', icon: MessageSquare, label: t('relationshipPlatform.journeyStages.firstConv') },
    { key: 'videoCall', icon: Video, label: t('relationshipPlatform.journeyStages.videoCall') },
    { key: 'firstMeeting', icon: MapPin, label: t('relationshipPlatform.journeyStages.firstMeeting') },
    { key: 'relationship', icon: Heart, label: t('relationshipPlatform.journeyStages.relationship') },
    { key: 'visiting', icon: MapPin, label: t('relationshipPlatform.journeyStages.visiting') },
    { key: 'relocation', icon: MapPin, label: t('relationshipPlatform.journeyStages.relocation') },
    { key: 'engagement', icon: Award, label: t('relationshipPlatform.journeyStages.engagement') },
    { key: 'marriage', icon: Award, label: t('relationshipPlatform.journeyStages.marriage') }
  ];

  useEffect(() => {
    // Fetch active journey from API
    const fetchJourney = async () => {
      try {
        const res = await fetch(`/api/relationship/journey?partnerId=${activeProfile.id}`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.journey) {
            setStage(data.journey.stage || 'Relocation Planning');
          }
        }
      } catch (e) {
        console.error("Failed to load journey stage", e);
      }
    };
    fetchJourney();
  }, [activeProfile.id]);

  const handleStageChange = async (newStage: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/relationship/journey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          partnerId: activeProfile.id,
          journey: { stage: newStage, progress_percent: getProgressPercent(newStage) }
        })
      });
      if (res.ok) {
        setStage(newStage);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const getProgressPercent = (s: string): number => {
    const idx = stages.findIndex(st => st.label === s || st.key === s);
    return idx === -1 ? 10 : Math.round(((idx + 1) / stages.length) * 100);
  };

  const handleAskCoach = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuery.trim()) return;
    setLoading(true);
    
    setTimeout(() => {
      const q = aiQuery.toLowerCase();
      let response = '';

      if (q.includes('visa') || q.includes('visum') || q.includes('relocat') || q.includes('flytt')) {
        response = locale === 'no'
          ? `[Algoritmisk sjekkliste] For flytting til ${activeProfile.location}: Det anbefales å starte dokumentinnsamling med en gang. Ved nåværende trinn (${stage}) bør dere fokusere på bevis for forholdets ekthet (bilder, chatlogger og felles reiser) som kreves av utlendingsmyndighetene.`
          : locale === 'pl'
          ? `[Algorytm Relokacji] Dla przeprowadzki do ${activeProfile.location}: Zaleca się natychmiastowe rozpoczęcie gromadzenia dokumentów. Na obecnym etapie (${stage}) skupcie się na dowodach autentyczności związku wymaganych przez urząd imigracyjny.`
          : `[Algorithmic Relocation Check] For relocating to ${activeProfile.location}: It is highly recommended to compile legal evidence of your relationship. At your current stage (${stage}), focus on cataloging communications, travel logs, and joint plans required for verification.`;
      } else if (q.includes('money') || q.includes('budget') || q.includes('økonomi') || q.includes('penger')) {
        response = locale === 'no'
          ? `[Budsjett-analyse] Siden dere er i ${stage}-fasen, bør dere sette opp et felles reise- og etableringsbudsjett. Statistiske data viser at par som fordeler reisekostnader tidlig, har 40% lavere konfliktnivå under flytteprosessen.`
          : locale === 'pl'
          ? `[Analiza Budżetu] Ponieważ jesteście na etapie: ${stage}, zalecamy stworzenie wspólnego budżetu podróży i osiedlenia. Statystyki wykazują, że wczesne planowanie wydatków obniża poziom stresu o 40%.`
          : `[Algorithmic Budgeting Guide] As you are at the ${stage} stage, setting up a shared travel and relocation budget is highly recommended. Data shows couples who align on travel splits early report 40% higher satisfaction rates during moving.`;
      } else if (q.includes('language') || q.includes('språk') || q.includes('talk') || q.includes('snakk')) {
        response = locale === 'no'
          ? `[Språk-kompatibilitet] ${activeProfile.name} snakker: ${activeProfile.languages.join(', ')}. Å lære grunnleggende fraser på hverandres språk øker den gjensidige forståelsen og forenkler integreringen i mottakerlandet.`
          : locale === 'pl'
          ? `[Analiza Językowa] ${activeProfile.name} mówi w językach: ${activeProfile.languages.join(', ')}. Nauka podstawowych zwrotów zwiększa wzajemne zrozumienie i ułatwia asymilację.`
          : `[Language Compatibility Check] ${activeProfile.name} speaks: ${activeProfile.languages.join(', ')}. Learning key conversational phrases in each other's native tongue reduces initial culture shock and accelerates relocation integration.`;
      } else {
        response = locale === 'no'
          ? `[Algoritmisk kompatibilitetsanalyse] Evaluering av profilene deres viser en solid match på ${Math.round(activeProfile.categories.values)}% for kjerneverdier, og ${Math.round(activeProfile.categories.lifestyle)}% for livsstil. Fokusér på å styrke kommunikasjonen for å utligne avstanden på ${activeProfile.distanceKm} km.`
          : locale === 'pl'
          ? `[Algorytmiczna Analiza Kompatybilności] Profil wykazuje dopasowanie na poziomie ${Math.round(activeProfile.categories.values)}% w kwestii wartości oraz ${Math.round(activeProfile.categories.lifestyle)}% w stylu życia. Skupcie się na komunikacji, aby zniwelować dystans ${activeProfile.distanceKm} km.`
          : `[Algorithmic Match Breakdown] Evaluated compatibility indicates a strong ${Math.round(activeProfile.categories.values)}% match in core values, and ${Math.round(activeProfile.categories.lifestyle)}% in lifestyle. Focus on regular video calls to bridge the geographical distance of ${activeProfile.distanceKm} km.`;
      }

      setAiResponse(response);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="flex-grow overflow-y-auto p-6 space-y-6">
      <div className="flex justify-between items-center border-b border-border/40 pb-4">
        <div>
          <h2 className="font-serif text-lg font-bold text-foreground">{t('relationshipPlatform.journeyTitle')}</h2>
          <p className="text-xs text-muted-foreground font-light">{t('relationshipPlatform.journeySubtitle')}</p>
        </div>
        <div className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-full text-xs font-mono">
          Stage: {stage} ({getProgressPercent(stage)}%)
        </div>
      </div>

      {/* Visual Timeline of Stages */}
      <div className="bg-secondary/15 rounded-2xl p-4 border border-border/40 overflow-x-auto">
        <div className="flex items-center gap-6 min-w-[900px] py-2">
          {stages.map((st, i) => {
            const Icon = st.icon;
            const isCompleted = stages.findIndex(s => s.label === stage) >= i;
            const isActive = stage === st.label || stage === st.key;
            return (
              <button
                key={st.key}
                disabled={loading}
                onClick={() => handleStageChange(st.label)}
                className="flex flex-col items-center gap-1.5 shrink-0 group focus:outline-none"
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all ${
                  isActive 
                    ? 'bg-amber-500 border-amber-600 text-white scale-110 shadow-lg' 
                    : isCompleted 
                    ? 'bg-green-500/15 border-green-500/30 text-green-500' 
                    : 'bg-background border-border text-muted-foreground group-hover:border-foreground/30'
                }`}>
                  {loading && isActive ? <Loader2 className="h-4.5 w-4.5 animate-spin" /> : <Icon className="h-4.5 w-4.5" />}
                </div>
                <span className={`text-[10px] font-mono tracking-tight ${
                  isActive ? 'text-amber-500 font-bold' : 'text-muted-foreground'
                }`}>{st.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Compatibility Coach */}
      <div className="bg-card border border-border/60 rounded-3xl p-6 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl" />
        <div className="flex items-center justify-between border-b border-border/40 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-500" />
            <h3 className="text-sm font-semibold text-foreground">{t('relationshipPlatform.aiCoach')}</h3>
          </div>
          <span className="text-[9px] font-mono text-amber-500 bg-amber-500/5 border border-amber-500/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
            Deterministic Algorithm
          </span>
        </div>

        <form onSubmit={handleAskCoach} className="space-y-4">
          <p className="text-xs text-muted-foreground font-light leading-relaxed">
            {locale === 'no' 
              ? 'Få råd om relasjonsdynamikk, kulturforskjeller og praktiske relocation-tips fra vår deterministiske regel-motor.'
              : locale === 'pl'
              ? 'Uzyskaj porady dotyczące dynamiki relacji, różnic kulturowych i praktycznych wskazówek relokacyjnych z naszego silnika reguł.'
              : 'Get advice on relationship dynamics, cultural differences, and relocation planning from our deterministic rule-based engine.'}
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={aiQuery}
              onChange={(e) => setAiQuery(e.target.value)}
              placeholder="e.g. How should we handle relocation budget discussions?"
              className="flex-grow bg-background border border-border px-4 py-2.5 text-xs rounded-xl focus:outline-none focus:border-foreground"
            />
            <button
              type="submit"
              disabled={loading || !aiQuery.trim()}
              className="px-4 py-2.5 bg-foreground text-background font-semibold rounded-xl text-xs hover:bg-foreground/90 disabled:opacity-40 flex items-center gap-1.5 shadow"
            >
              {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5" />}
              <span>Ask</span>
            </button>
          </div>
        </form>

        <AnimatePresence>
          {aiResponse && (
            <div className="mt-4 bg-secondary/20 rounded-xl p-4 border border-border/40 text-xs text-foreground leading-relaxed">
              <p className="font-light">{aiResponse}</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
