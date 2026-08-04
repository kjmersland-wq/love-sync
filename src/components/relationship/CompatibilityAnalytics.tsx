'use client';

import React, { useState, useEffect } from 'react';
import { useI18n } from '../../lib/i18n/I18nContext';
import { RelationshipProfile } from '../../data/mockDb';
import { ShieldCheck, Compass, Users, Clock, Globe, BookOpen, CheckCircle, Award } from 'lucide-react';
import { calculateTrustScore, calculateProfileCompleteness } from '../../lib/algorithms/compatibility';

interface CompatibilityAnalyticsProps {
  activeProfile: RelationshipProfile;
  locale: string;
}

export const CompatibilityAnalytics: React.FC<CompatibilityAnalyticsProps> = ({ activeProfile, locale }) => {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState<'compat' | 'trust' | 'expat'>('compat');
  const [partnerTime, setPartnerTime] = useState<string>('');
  const [myTime, setMyTime] = useState<string>('');

  useEffect(() => {
    // Simulated live time zones
    const updateClocks = () => {
      const now = new Date();
      setMyTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      
      // Simulate partner offset time (e.g. +6 hours for expat partner)
      const offsetDate = new Date(now.getTime() + 3600000 * 6);
      setPartnerTime(offsetDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateClocks();
    const interval = setInterval(updateClocks, 30000);
    return () => clearInterval(interval);
  }, []);

  const trustLogs = [
    { label: t('profile.verifiedBadges.email'), done: true, date: '2026-04-10' },
    { label: t('profile.verifiedBadges.phone'), done: true, date: '2026-04-12' },
    { label: t('profile.verifiedBadges.photo'), done: true, date: '2026-04-15' },
    { label: t('profile.verifiedBadges.id'), done: activeProfile.verification.id, date: '2026-04-20' },
    { label: 'Video Verified Identity', done: true, date: '2026-04-21' },
    { label: 'Degree & Background Checked', done: true, date: '2026-04-22' }
  ];

  return (
    <div className="flex-grow overflow-y-auto p-6 space-y-6">
      <div className="flex justify-between items-center border-b border-border/40 pb-4">
        <div>
          <h2 className="font-serif text-lg font-bold text-foreground">Compatibility & Trust Analytics</h2>
          <p className="text-xs text-muted-foreground font-light">Verify background records, cultural fit and time coordination details.</p>
        </div>
      </div>

      {/* Analytics Tabs */}
      <div className="flex border-b border-border/40 gap-4 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('compat')}
          className={`pb-2 transition-all flex items-center gap-1.5 ${activeTab === 'compat' ? 'border-b-2 border-foreground text-foreground' : 'text-muted-foreground'}`}
        >
          <Compass className="h-4 w-4" />
          <span>{t('relationshipPlatform.relocationComp')}</span>
        </button>
        <button
          onClick={() => setActiveTab('trust')}
          className={`pb-2 transition-all flex items-center gap-1.5 ${activeTab === 'trust' ? 'border-b-2 border-foreground text-foreground' : 'text-muted-foreground'}`}
        >
          <ShieldCheck className="h-4 w-4" />
          <span>{t('relationshipPlatform.trustTimeline')}</span>
        </button>
        <button
          onClick={() => setActiveTab('expat')}
          className={`pb-2 transition-all flex items-center gap-1.5 ${activeTab === 'expat' ? 'border-b-2 border-foreground text-foreground' : 'text-muted-foreground'}`}
        >
          <Users className="h-4 w-4" />
          <span>Expat & Community Resources</span>
        </button>
      </div>

      <div className="space-y-6">
        {activeTab === 'compat' && (
          <div className="space-y-6">
            {/* Relocation spec cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Readiness score card */}
              <div className="bg-card border border-border/60 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-bold text-muted-foreground uppercase font-mono tracking-wider">{t('relationshipPlatform.readinessScore')}</h3>
                  <div className="text-4xl font-serif font-extrabold text-foreground mt-3">
                    {calculateTrustScore(activeProfile as any)}%
                  </div>
                  <p className="text-[11px] text-muted-foreground font-light leading-relaxed mt-2">
                    Profile Completeness: {calculateProfileCompleteness(activeProfile as any)}%. Verified badges, background certifications, and mutual activity indicators are calculated deterministically.
                  </p>
                </div>
              </div>

              {/* Time zone assistant card */}
              <div className="bg-card border border-border/60 rounded-3xl p-6 shadow-sm">
                <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground uppercase font-mono tracking-wider">
                  <Clock className="h-4 w-4 text-amber-500" />
                  <span>{t('relationshipPlatform.timeZoneAssistant')}</span>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <div className="text-center">
                    <span className="text-[10px] text-muted-foreground">My Time</span>
                    <div className="text-xl font-bold font-mono text-foreground mt-1">{myTime}</div>
                  </div>
                  <div className="w-12 h-px bg-border/80 border-dashed" />
                  <div className="text-center">
                    <span className="text-[10px] text-muted-foreground">{activeProfile.name}'s Time</span>
                    <div className="text-xl font-bold font-mono text-foreground mt-1">{partnerTime}</div>
                  </div>
                </div>
                <span className="text-[10px] text-muted-foreground block text-center mt-3 font-mono">6 Hours Time Difference</span>
              </div>
            </div>

            {/* Cultural guide card */}
            <div className="bg-secondary/15 rounded-3xl p-6 border border-border/40 space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground uppercase font-mono tracking-wider">
                <BookOpen className="h-4 w-4 text-red-500" />
                <span>{t('relationshipPlatform.culturalGuide')}</span>
              </div>
              <p className="text-xs text-foreground font-light leading-relaxed">
                Norway and Poland match beautifully in values. Norwegians value work-life balance and friluftsliv (outdoor life), while Polish cultural norms emphasize strong family structures and professional dedication.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'trust' && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-muted-foreground uppercase font-mono tracking-wider">{t('relationshipPlatform.professionalVerification')}</h3>
            <div className="space-y-3">
              {trustLogs.map((log) => (
                <div key={log.label} className="bg-secondary/15 rounded-xl p-3.5 border border-border/40 flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle className={`h-4 w-4 ${log.done ? 'text-green-500' : 'text-muted-foreground/30'}`} />
                    <span className="text-foreground">{log.label}</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground font-mono">{log.date}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'expat' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-card border border-border/50 rounded-2xl p-5 space-y-2">
                <Globe className="h-5 w-5 text-blue-500" />
                <h4 className="font-semibold text-foreground">{t('relationshipPlatform.countryProfiles')}</h4>
                <p className="text-[11px] text-muted-foreground font-light leading-relaxed">
                  Understand living costs, health systems, and tax codes in Norway for expats relocating from Poland.
                </p>
                <button className="pt-2 text-[10px] font-bold text-amber-500 hover:underline">Explore Country Profile</button>
              </div>

              <div className="bg-card border border-border/50 rounded-2xl p-5 space-y-2">
                <Users className="h-5 w-5 text-amber-500" />
                <h4 className="font-semibold text-foreground">{t('relationshipPlatform.expatCommunity')}</h4>
                <p className="text-[11px] text-muted-foreground font-light leading-relaxed">
                  Connect with expat community networks and verified guides to make your transition seamless.
                </p>
                <button className="pt-2 text-[10px] font-bold text-amber-500 hover:underline">Browse Forums</button>
              </div>
            </div>

            {/* Ambassador Program & Success Stories */}
            <div className="bg-secondary/10 rounded-2xl p-5 border border-border/40 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="space-y-1.5">
                <div className="flex items-center gap-1">
                  <Award className="h-4 w-4 text-amber-500" />
                  <h4 className="font-semibold text-foreground">{t('relationshipPlatform.ambassadorProgram')}</h4>
                </div>
                <p className="text-muted-foreground font-light leading-relaxed text-[11px]">
                  Contact regional expat ambassadors who successfully relocated using Love-Sync. Get real answers.
                </p>
              </div>

              <div className="space-y-1.5">
                <h4 className="font-semibold text-foreground">Success Stories</h4>
                <p className="text-muted-foreground font-light leading-relaxed text-[11px] italic">
                  "We matched between Gdansk and Oslo. Navigating the visa with Love-Sync partners made us confident." - Maria & Henrik
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
