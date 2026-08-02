'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp, MatchingWeights } from '../../../context/AppContext';
import { useI18n } from '../../../lib/i18n/I18nContext';
import { RelationshipProfile } from '../../../data/mockDb';
import { Slider } from '../../../components/ui/Slider';
import { Select } from '../../../components/ui/Select';
import { 
  Heart, Shield, Mail, Phone, Camera, CheckSquare, 
  MapPin, SlidersHorizontal, User, MessageSquare, 
  X, Check, Info, Sparkles, Star 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Dashboard() {
  const router = useRouter();
  const { locale, t } = useI18n();
  const { 
    profiles, 
    weights, 
    updateWeight, 
    calculateOverallScore, 
    savedProfileIds, 
    toggleSaveProfile,
    setActiveChatId,
    userProfile
  } = useApp();

  // Filters
  const [selectedGender, setSelectedGender] = useState<string>('All');
  const [ageRange, setAgeRange] = useState<[number, number]>([20, 45]);
  const [maxDistance, setMaxDistance] = useState<number>(1500);
  const [onlyVerified, setOnlyVerified] = useState<boolean>(false);

  // Selected profile for Detail Modal
  const [selectedProfile, setSelectedProfile] = useState<RelationshipProfile | null>(null);

  // Computed and filtered matches list
  const [matches, setMatches] = useState<RelationshipProfile[]>([]);

  // Category labels translator helper
  const getCategoryLabel = (key: keyof MatchingWeights): string => {
    switch (key) {
      case 'familyGoals': return t('dashboard.categories.familyGoals');
      case 'lifestyle': return t('dashboard.categories.lifestyle');
      case 'personality': return t('dashboard.categories.personality');
      case 'values': return t('dashboard.categories.values');
      case 'interests': return t('dashboard.categories.interests');
      case 'distance': return t('dashboard.categories.distance');
      case 'age': return t('dashboard.categories.age');
      default: return String(key);
    }
  };

  // Recalculate matches on weights or filters change
  useEffect(() => {
    let result = profiles.map(profile => ({
      ...profile,
      computedScore: calculateOverallScore(profile)
    }));

    // Filter by Gender
    if (selectedGender !== 'All') {
      result = result.filter(p => p.gender.toLowerCase() === selectedGender.toLowerCase());
    }

    // Filter by Age
    result = result.filter(p => p.age >= ageRange[0] && p.age <= ageRange[1]);

    // Filter by Distance
    result = result.filter(p => p.distanceKm <= maxDistance);

    // Filter by Verified Badge
    if (onlyVerified) {
      result = result.filter(p => p.verification.email && p.verification.phone && p.verification.photo);
    }

    // Sort by computed compatibility score descending
    result.sort((a, b) => b.computedScore - a.computedScore);

    setMatches(result);
  }, [profiles, weights, selectedGender, ageRange, maxDistance, onlyVerified]);

  const handleOpenChat = (profileId: string) => {
    setActiveChatId(profileId);
    router.push(`/${locale}/messages`);
  };

  const genderOptions = [
    { value: 'All', label: 'All Genders' },
    { value: 'Female', label: 'Female' },
    { value: 'Male', label: 'Male' }
  ];

  // Total weight sum for visual verification
  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 bg-background min-h-screen">
      
      {/* Header Info */}
      <div className="border-b border-border/40 pb-6 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground">{t('dashboard.title')}</h1>
          <p className="text-muted-foreground font-light text-sm mt-1">{t('dashboard.subtitle')}</p>
        </div>
        <div className="flex items-center gap-2 bg-secondary/40 border border-border/50 rounded-xl px-4 py-2 text-xs font-mono">
          <span className="text-muted-foreground">{t('dashboard.weightTotal')}:</span>
          <span className={`font-bold ${totalWeight === 100 ? 'text-green-500' : 'text-amber-500'}`}>
            {totalWeight}%
          </span>
          {totalWeight !== 100 && (
            <span className="text-muted-foreground">(Weights normalize dynamically)</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Sliders & Filter Panel */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Sliders Configuration */}
          <div className="bg-card border border-border/60 rounded-2xl p-6 shadow-sm space-y-6">
            <div className="flex items-center gap-2 border-b border-border/40 pb-3">
              <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold text-foreground">{t('dashboard.weightConfig')}</h2>
            </div>

            <div className="space-y-5">
              {(Object.keys(weights) as Array<keyof MatchingWeights>).map((key) => {
                const val = weights[key];
                return (
                  <div key={key} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-foreground">{getCategoryLabel(key)}</span>
                      <span className="text-muted-foreground font-mono">{val}%</span>
                    </div>
                    <Slider
                      min={0}
                      max={50}
                      step={1}
                      value={val}
                      onChange={(newVal) => updateWeight(key, newVal)}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Core Filters Panel */}
          <div className="bg-card border border-border/60 rounded-2xl p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-2 border-b border-border/40 pb-3">
              <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold text-foreground">{t('dashboard.filterTitle')}</h2>
            </div>

            {/* Gender Filter */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">Preferred Gender</label>
              <Select
                options={genderOptions}
                value={selectedGender}
                onChange={setSelectedGender}
                className="w-full bg-background border-border"
              />
            </div>

            {/* Age Range Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-muted-foreground">{t('dashboard.ageRange')}</span>
                <span className="text-foreground font-mono">{ageRange[0]} - {ageRange[1]} yrs</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] text-muted-foreground font-mono">Min Age</span>
                  <Slider 
                    min={18} 
                    max={60} 
                    value={ageRange[0]} 
                    onChange={(val) => setAgeRange([Math.min(val, ageRange[1] - 1), ageRange[1]])} 
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-muted-foreground font-mono">Max Age</span>
                  <Slider 
                    min={18} 
                    max={60} 
                    value={ageRange[1]} 
                    onChange={(val) => setAgeRange([ageRange[0], Math.max(val, ageRange[0] + 1)])} 
                  />
                </div>
              </div>
            </div>

            {/* Distance Filter */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-muted-foreground">Max Distance</span>
                <span className="text-foreground font-mono">{maxDistance} km</span>
              </div>
              <Slider 
                min={10} 
                max={3000} 
                step={50} 
                value={maxDistance} 
                onChange={setMaxDistance} 
              />
            </div>

            {/* Verified Only Check */}
            <div className="flex items-center justify-between pt-2">
              <label htmlFor="verified-switch" className="text-xs font-semibold text-muted-foreground cursor-pointer">
                Verified Accounts Only
              </label>
              <input
                id="verified-switch"
                type="checkbox"
                checked={onlyVerified}
                onChange={(e) => setOnlyVerified(e.target.checked)}
                className="h-4 w-4 rounded border-border text-foreground focus:ring-foreground accent-foreground"
              />
            </div>
          </div>

        </div>

        {/* Right Side: Profiles List */}
        <div className="lg:col-span-8">
          
          <h2 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider font-mono">
            {t('dashboard.matchesFound')} ({matches.length})
          </h2>

          {matches.length === 0 ? (
            <div className="bg-card border border-border/50 rounded-2xl p-12 text-center text-muted-foreground font-light">
              <Info className="h-8 w-8 mx-auto text-muted-foreground/60 mb-3" />
              <p>{t('dashboard.noMatches')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <AnimatePresence mode="popLayout">
                {matches.map((profile) => {
                  const score = (profile as any).computedScore;
                  const isSaved = savedProfileIds.includes(profile.id);
                  return (
                    <motion.div
                      key={profile.id}
                      layout
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      className="bg-card border border-border/60 hover:border-foreground/30 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group relative"
                    >
                      {/* Avatar & Score */}
                      <div className="relative pt-6 px-6 flex items-center justify-between">
                        {/* Profile Image (SVG) */}
                        <div 
                          className="w-14 h-14 rounded-2xl overflow-hidden shadow-inner flex items-center justify-center p-0.5 border border-border"
                          dangerouslySetInnerHTML={{ __html: profile.image }}
                        />
                        
                        {/* Overall compatibility percentage */}
                        <div className="text-right">
                          <div className="text-xs text-muted-foreground font-mono">{t('dashboard.matchLabel')}</div>
                          <div className="text-2xl font-bold font-serif text-red-500">{score}%</div>
                        </div>
                      </div>

                      {/* Header details */}
                      <div className="px-6 pt-4 pb-2 flex-grow">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg text-foreground">{profile.name}</h3>
                          <span className="text-muted-foreground font-light">{profile.age}</span>
                          
                          {/* Verification Badge */}
                          {profile.verification.photo && (
                            <div className="relative flex h-5 w-5 items-center justify-center rounded-full bg-blue-500/10 text-blue-500" title="Identity Verified">
                              <Shield className="h-3 w-3 fill-current" />
                            </div>
                          )}
                        </div>
                        
                        <p className="text-xs text-muted-foreground font-light mt-1 flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span>{profile.location} ({profile.distanceKm} km)</span>
                        </p>

                        <p className="text-xs font-medium text-foreground mt-2 font-mono">{profile.occupation}</p>

                        <p className="text-xs text-muted-foreground font-light line-clamp-2 mt-2 leading-relaxed">
                          {profile.details.introduction}
                        </p>
                      </div>

                      {/* Card Footer Actions */}
                      <div className="border-t border-border/40 p-4 bg-secondary/20 flex gap-2">
                        <button
                          onClick={() => setSelectedProfile(profile)}
                          className="flex-1 text-center py-2 text-xs font-semibold rounded-lg border border-border bg-background hover:bg-secondary transition-colors text-foreground"
                        >
                          {t('dashboard.viewProfile')}
                        </button>
                        
                        <button
                          onClick={() => handleOpenChat(profile.id)}
                          className="px-3.5 py-2 rounded-lg bg-foreground text-background hover:bg-foreground/90 transition-all flex items-center justify-center"
                          title={t('dashboard.chatNow')}
                        >
                          <MessageSquare className="h-3.5 w-3.5" />
                        </button>
                        
                        <button
                          onClick={() => toggleSaveProfile(profile.id)}
                          className={`px-3.5 py-2 rounded-lg border transition-colors flex items-center justify-center ${
                            isSaved 
                              ? 'bg-red-500/10 border-red-500/30 text-red-500'
                              : 'border-border bg-background hover:bg-secondary text-muted-foreground'
                          }`}
                          title="Save profile"
                        >
                          <Heart className={`h-3.5 w-3.5 ${isSaved ? 'fill-current' : ''}`} />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}

        </div>

      </div>

      {/* Profile Details Drawer / Modal Dialog */}
      <AnimatePresence>
        {selectedProfile && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            
            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-2xl bg-card border border-border/80 rounded-3xl shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto glass"
            >
              {/* Close Button */}
              <button 
                onClick={() => setSelectedProfile(null)}
                className="absolute top-6 right-6 p-2 rounded-lg border border-border hover:bg-secondary text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Grid Layout */}
              <div className="space-y-6">
                
                {/* Header Profile card */}
                <div className="flex items-center gap-4 border-b border-border/40 pb-6 pr-10">
                  <div 
                    className="w-16 h-16 rounded-2xl border border-border shadow-inner p-1 flex items-center justify-center bg-background"
                    dangerouslySetInnerHTML={{ __html: selectedProfile.image }}
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-serif text-2xl font-bold text-foreground">{selectedProfile.name}</h2>
                      <span className="text-muted-foreground text-lg">{selectedProfile.age}</span>
                      
                      {selectedProfile.verification.photo && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 text-[10px] font-semibold border border-blue-500/20">
                          <Shield className="h-2.5 w-2.5 fill-current" />
                          <span>{t('profile.verifiedBadge')}</span>
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <MapPin className="h-3 w-3" />
                      <span>{selectedProfile.location} &bull; {selectedProfile.distanceKm} km away</span>
                    </p>
                    <p className="text-xs font-semibold text-foreground font-mono mt-1.5">{selectedProfile.occupation} &bull; {selectedProfile.education}</p>
                  </div>
                </div>

                {/* Compatibility Score Explanation Box */}
                <div className="bg-red-500/5 dark:bg-red-500/10 border border-red-500/20 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Heart className="h-4.5 w-4.5 text-red-500 fill-red-500/25" />
                      <h3 className="text-sm font-semibold text-foreground">{t('dashboard.whyMatch')}</h3>
                    </div>
                    <div className="text-lg font-bold text-red-500 font-mono">
                      {calculateOverallScore(selectedProfile)}% Match
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed font-light">
                    {locale === 'no' 
                      ? selectedProfile.whyMatchNo 
                      : locale === 'pl' 
                      ? selectedProfile.whyMatchPl 
                      : selectedProfile.whyMatchEn
                    }
                  </p>

                  {/* Compatibility Categories breakdown */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-red-500/10 text-center">
                    <div className="space-y-1">
                      <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{t('dashboard.categories.familyGoals')}</div>
                      <div className="text-sm font-semibold text-foreground font-mono">{selectedProfile.categories.familyGoals}%</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{t('dashboard.categories.lifestyle')}</div>
                      <div className="text-sm font-semibold text-foreground font-mono">{selectedProfile.categories.lifestyle}%</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{t('dashboard.categories.personality')}</div>
                      <div className="text-sm font-semibold text-foreground font-mono">{selectedProfile.categories.personality}%</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{t('dashboard.categories.values')}</div>
                      <div className="text-sm font-semibold text-foreground font-mono">{selectedProfile.categories.values}%</div>
                    </div>
                  </div>
                </div>

                {/* Details Sections */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs leading-relaxed">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-foreground uppercase tracking-wider font-mono">{t('profile.introduction')}</h4>
                    <p className="text-muted-foreground font-light">{selectedProfile.details.introduction}</p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-foreground uppercase tracking-wider font-mono">{t('profile.lifestyle')}</h4>
                    <p className="text-muted-foreground font-light">{selectedProfile.details.lifestyleText}</p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-foreground uppercase tracking-wider font-mono">{t('profile.values')}</h4>
                    <p className="text-muted-foreground font-light">{selectedProfile.details.valuesText}</p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-foreground uppercase tracking-wider font-mono">{t('profile.goals')}</h4>
                    <p className="text-muted-foreground font-light">{selectedProfile.details.goalsText}</p>
                  </div>

                  <div className="space-y-2 sm:col-span-2 border-t border-border/40 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-foreground uppercase tracking-wider font-mono">Languages</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedProfile.languages.map(lang => (
                          <span key={lang} className="px-2 py-0.5 rounded bg-secondary text-foreground text-[10px] font-medium border border-border/40">
                            {lang}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-semibold text-foreground uppercase tracking-wider font-mono">Relationship Expectations</h4>
                      <p className="text-muted-foreground font-light">{selectedProfile.details.relationshipExpectations}</p>
                    </div>
                  </div>
                </div>

                {/* Verification Checkmarks */}
                <div className="border-t border-border/40 pt-4 space-y-2">
                  <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider font-mono">{t('profile.verifiedStatus')}</h4>
                  <div className="flex flex-wrap gap-4 text-xs">
                    <div className="flex items-center gap-1.5">
                      <Check className={`h-4 w-4 ${selectedProfile.verification.email ? 'text-green-500' : 'text-muted-foreground/40'}`} />
                      <span className={selectedProfile.verification.email ? 'text-foreground' : 'text-muted-foreground'}>{t('profile.verifiedBadges.email')}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Check className={`h-4 w-4 ${selectedProfile.verification.phone ? 'text-green-500' : 'text-muted-foreground/40'}`} />
                      <span className={selectedProfile.verification.phone ? 'text-foreground' : 'text-muted-foreground'}>{t('profile.verifiedBadges.phone')}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Check className={`h-4 w-4 ${selectedProfile.verification.photo ? 'text-green-500' : 'text-muted-foreground/40'}`} />
                      <span className={selectedProfile.verification.photo ? 'text-foreground' : 'text-muted-foreground'}>{t('profile.verifiedBadges.photo')}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Check className={`h-4 w-4 ${selectedProfile.verification.id ? 'text-green-500' : 'text-muted-foreground/40'}`} />
                      <span className={selectedProfile.verification.id ? 'text-foreground' : 'text-muted-foreground'}>{t('profile.verifiedBadges.id')}</span>
                    </div>
                  </div>
                </div>

                {/* Footer Drawer Action buttons */}
                <div className="border-t border-border/40 pt-6 flex gap-3">
                  <button
                    onClick={() => handleOpenChat(selectedProfile.id)}
                    className="flex-1 py-3 px-4 bg-foreground text-background hover:bg-foreground/90 transition-all font-semibold rounded-xl text-center flex items-center justify-center gap-2 shadow-lg"
                  >
                    <MessageSquare className="h-4.5 w-4.5" />
                    <span>{t('dashboard.chatNow')}</span>
                  </button>

                  <button
                    onClick={() => {
                      toggleSaveProfile(selectedProfile.id);
                    }}
                    className={`px-4 py-3 rounded-xl border transition-colors flex items-center justify-center ${
                      savedProfileIds.includes(selectedProfile.id)
                        ? 'bg-red-500/10 border-red-500/30 text-red-500'
                        : 'border-border bg-background hover:bg-secondary text-muted-foreground'
                    }`}
                  >
                    <Heart className={`h-4.5 w-4.5 ${savedProfileIds.includes(selectedProfile.id) ? 'fill-current' : ''}`} />
                  </button>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
