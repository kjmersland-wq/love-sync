'use client';

import React, { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { db } from '../../../../lib/db';
import { useApp } from '../../../../context/AppContext';
import { useI18n } from '../../../../lib/i18n/I18nContext';
import { getCanonicalSlug, getLocalizedSlug } from '../../../../lib/i18n/i18n';
import { City, Neighborhood, getCostComparisonData } from '../../../../data/mockDb';
import Map from '../../../../components/Map';
import { Shield, HeartPulse, Sun, MapPin, Star, GitCompare, Building, Trees, Footprints, Train, Volume2, DollarSign, ChevronRight } from 'lucide-react';
import { PremiumLockOverlay } from '../../../../components/relationship/PremiumLockOverlay';

interface PageProps {
  params: Promise<{ locale: string; countrySlug: string; citySlug: string }>;
}

export default function CityPortal({ params }: PageProps) {
  const { locale, t } = useI18n();
  const { countrySlug, citySlug } = use(params);
  
  const { 
    toggleFavorite, 
    isFavorite, 
    toggleCompareCity, 
    comparedCities, 
    formatPrice,
    calculateNeighborhoodMatchScore,
    userProfile
  } = useApp();

  if (userProfile.subscription !== 'Premium') {
    return <PremiumLockOverlay featureKey="relocation" />;
  }

  const [city, setCity] = useState<City | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'neighborhoods' | 'cost'>('overview');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<Neighborhood | null>(null);

  const canonicalCountryId = getCanonicalSlug('country', countrySlug, locale);
  const canonicalCityId = getCanonicalSlug('city', citySlug, locale);

  useEffect(() => {
    const loadCityData = async () => {
      setLoading(true);
      const c = await db.getCity(canonicalCityId);
      if (c) {
        setCity(c);
        if (c.neighborhoods.length > 0) {
          setSelectedNeighborhood(c.neighborhoods[0]);
        }
      }
      setLoading(false);
    };
    loadCityData();
  }, [canonicalCityId]);

  if (loading) {
    return (
      <div className="flex h-[70vh] w-full items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" />
          <span className="text-sm text-muted-foreground">{t('loading.city')}</span>
        </div>
      </div>
    );
  }

  if (!city) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <h1 className="font-serif text-3xl font-bold">{t('errors.notFound')}</h1>
        <p className="text-muted-foreground mt-2">{t('errors.notFoundSub')}</p>
        <Link href={`/${locale}`} className="mt-6 inline-block text-accent font-semibold hover:underline">
          {t('errors.returnHome')}
        </Link>
      </div>
    );
  }

  const costComparison = getCostComparisonData(city.slug);

  const isCityFavorite = isFavorite('cities', city.slug);
  const isCityCompared = comparedCities.includes(city.slug);

  // Localize text fields
  const lCityName = t(`cities.${city.id}.name`, { defaultValue: city.name });
  const cityName = lCityName === `cities.${city.id}.name` ? city.name : lCityName;

  const lCityDesc = t(`cities.${city.id}.description`, { defaultValue: city.description });
  const cityDescription = lCityDesc === `cities.${city.id}.description` ? city.description : lCityDesc;

  // Map markers for neighborhoods pointing to their respective neighborhood portal pages
  const mapMarkers = city.neighborhoods.map(n => {
    const lNeighName = t(`neighborhoods.${n.id}.name`, { defaultValue: n.name });
    const neighNameTranslated = lNeighName === `neighborhoods.${n.id}.name` ? n.name : lNeighName;
    return {
      id: n.id,
      position: n.coordinates,
      title: neighNameTranslated,
      priceText: `${t('cityPortal.safetyIndex')}: ${n.safetyIndex}/100 | ${t('cityPortal.matchScoreLabel')}: ${calculateNeighborhoodMatchScore(n)}%`,
      link: `/${locale}/${getLocalizedSlug('country', city.country, locale)}/${getLocalizedSlug('city', city.slug, locale)}/${getLocalizedSlug('neighborhood', n.id, locale)}`
    };
  });

  const metrics = [
    { name: t('citiesSection.safety'), value: city.safety, icon: Shield, color: 'text-emerald-500' },
    { name: t('citiesSection.healthcare'), value: city.healthcare, icon: HeartPulse, color: 'text-rose-500' },
    { name: t('common.climateComfort'), value: city.climate, icon: Sun, color: 'text-orange-500' },
    { name: t('cityPortal.walkability'), value: city.walkability, icon: Footprints, color: 'text-blue-500' },
    { name: t('common.publicTransit'), value: city.transit, icon: Train, color: 'text-indigo-500' },
    { name: t('cityPortal.greenSpaces'), value: city.greenery, icon: Trees, color: 'text-green-500' }
  ];

  return (
    <div className="w-full pb-20 animate-fade-in">
      {/* Immersive Header */}
      <section className="relative h-[50vh] w-full flex items-end bg-black">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-50 mix-blend-luminosity"
          style={{ backgroundImage: `url('${city.image}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/25 to-transparent" />
        
        <div className="relative z-10 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 pb-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-accent flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {t(`countries.${city.country}.name`, { defaultValue: city.country.toUpperCase() })}
            </span>
            <h1 className="font-serif text-4xl sm:text-6xl font-black text-white">
              {cityName}
            </h1>
          </div>
          
          {/* Action buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => toggleFavorite('cities', city.slug)}
              className={`flex h-11 items-center justify-center gap-2 rounded-xl border px-5 text-sm font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
                isCityFavorite
                  ? 'border-accent bg-accent text-white'
                  : 'border-border bg-black/40 text-foreground hover:bg-secondary/40 backdrop-blur-md'
              }`}
            >
              <Star className={`h-4.5 w-4.5 ${isCityFavorite ? 'fill-white' : ''}`} />
              <span>{isCityFavorite ? t('cityPortal.saved') : t('cityPortal.saveCity')}</span>
            </button>
            <button
              onClick={() => toggleCompareCity(city.slug)}
              className={`flex h-11 items-center justify-center gap-2 rounded-xl border px-5 text-sm font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
                isCityCompared
                  ? 'border-accent bg-accent/10 text-accent'
                  : 'border-border bg-black/40 text-foreground hover:bg-secondary/40 backdrop-blur-md'
              }`}
            >
              <GitCompare className="h-4.5 w-4.5" />
              <span>{isCityCompared ? t('cityPortal.compared') : t('cityPortal.compare')}</span>
            </button>
            <Link
              href={`/${locale}/properties?city=${city.slug}`}
              className="flex h-11 items-center justify-center gap-2 rounded-xl bg-accent px-6 text-sm font-semibold text-white transition-all duration-200 hover:bg-accent/80 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Building className="h-4.5 w-4.5" />
              <span>{t('cityPortal.viewProperties')}</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Tab navigation */}
      <div className="border-b border-border bg-card/40 sticky top-16 z-20 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex gap-8">
          {(['overview', 'neighborhoods', 'cost'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 text-sm font-semibold border-b-2 transition-all relative capitalize ${
                activeTab === tab 
                  ? 'border-accent text-accent' 
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab === 'overview' ? t('cityPortal.tabOverview') : tab === 'neighborhoods' ? t('cityPortal.tabNeighborhoods') : t('cityPortal.tabCost')}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-10">
        
        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            {/* Description & Metrics */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 space-y-4">
                <h2 className="font-serif text-2xl font-bold">{t('cityPortal.aboutCity', { name: cityName })}</h2>
                <p className="text-muted-foreground text-sm font-light leading-relaxed text-stone-600 dark:text-stone-300">
                  {cityDescription}
                </p>
              </div>

              {/* City Metrics grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                {metrics.map((metric) => {
                  const Icon = metric.icon;
                  return (
                    <div key={metric.name} className="bg-card border border-border rounded-2xl p-5 space-y-3 shadow-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{metric.name}</span>
                        <Icon className="h-5 w-5 text-accent" />
                      </div>
                      <div className="flex items-end gap-1.5">
                        <span className="text-2xl font-bold text-foreground">{metric.value}</span>
                        <span className="text-xs text-muted-foreground mb-1">/100</span>
                      </div>
                      {/* Metric bar */}
                      <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-accent rounded-full" 
                          style={{ width: `${metric.value}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Quality Score Gauge */}
            <div className="bg-card border border-border rounded-2xl p-8 flex flex-col items-center justify-center text-center space-y-6">
              <span className="text-xs font-semibold uppercase tracking-widest text-accent">{t('cityPortal.qualityScore')}</span>
              <div className="relative flex h-40 w-40 items-center justify-center rounded-full border-[6px] border-accent/20 bg-accent/5">
                <div className="text-center">
                  <span className="font-serif text-5xl font-black text-accent">{city.retirementScore}</span>
                  <p className="text-[9px] uppercase font-bold tracking-widest text-muted-foreground mt-0.5">{t('cityPortal.qualityScore')}</p>
                </div>
                {/* Micro outer decorative ring */}
                <div className="absolute inset-[-10px] rounded-full border border-dashed border-accent/20" />
              </div>
              <p className="text-muted-foreground text-xs font-light leading-relaxed max-w-[240px]">
                {t('cityPortal.qualityScoreSub')}
              </p>
            </div>
          </div>
        )}

        {/* Tab 2: Neighborhood Explorer */}
        {activeTab === 'neighborhoods' && (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 h-[70vh] min-h-[500px]">
            {/* Left Col: Neighborhood List */}
            <div className="lg:col-span-1 overflow-y-auto space-y-3 pr-2">
              <h3 className="font-serif text-xl font-bold mb-4">{t('cityPortal.selectNeighborhood')}</h3>
              {city.neighborhoods.map((n) => {
                const lNName = t(`neighborhoods.${n.id}.name`, { defaultValue: n.name });
                const nameT = lNName === `neighborhoods.${n.id}.name` ? n.name : lNName;
                const lNDesc = t(`neighborhoods.${n.id}.description`, { defaultValue: n.description });
                const descT = lNDesc === `neighborhoods.${n.id}.description` ? n.description : lNDesc;

                return (
                  <button
                    key={n.id}
                    onClick={() => setSelectedNeighborhood(n)}
                    className={`w-full text-left rounded-xl border p-4 transition-all duration-200 ${
                      selectedNeighborhood?.id === n.id
                        ? 'border-accent bg-accent/5 shadow-sm'
                        : 'border-border bg-card hover:bg-secondary/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-foreground">{nameT}</span>
                      <span className="text-[10px] uppercase font-bold text-accent bg-accent/10 px-2 py-0.5 rounded-full">
                        Match: {calculateNeighborhoodMatchScore(n)}%
                      </span>
                    </div>
                    <p className="text-muted-foreground text-xs font-light line-clamp-2 leading-relaxed text-stone-600 dark:text-stone-300">
                      {descT}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Middle Col: Selected Details */}
            <div className="lg:col-span-1 bg-card border border-border rounded-2xl p-6 overflow-y-auto flex flex-col justify-between">
              {selectedNeighborhood ? (
                <div className="space-y-6">
                  {(() => {
                    const lSelName = t(`neighborhoods.${selectedNeighborhood.id}.name`, { defaultValue: selectedNeighborhood.name });
                    const selNameTranslated = lSelName === `neighborhoods.${selectedNeighborhood.id}.name` ? selectedNeighborhood.name : lSelName;
                    const lSelDesc = t(`neighborhoods.${selectedNeighborhood.id}.description`, { defaultValue: selectedNeighborhood.description });
                    const selDescTranslated = lSelDesc === `neighborhoods.${selectedNeighborhood.id}.description` ? selectedNeighborhood.description : lSelDesc;

                    return (
                      <>
                        <div>
                          <div className="flex items-center justify-between">
                            <h3 className="font-serif text-2xl font-bold text-foreground mb-1">{selNameTranslated}</h3>
                            <div className="flex flex-col items-end">
                              <span className="text-[10px] font-bold text-muted-foreground uppercase">{t('cityPortal.matchScoreLabel')}</span>
                              <span className="text-lg font-black text-accent font-mono">{calculateNeighborhoodMatchScore(selectedNeighborhood)}%</span>
                            </div>
                          </div>
                          <p className="text-muted-foreground text-xs font-light leading-relaxed mt-2 text-stone-600 dark:text-stone-300">
                            {selDescTranslated}
                          </p>
                        </div>

                        {/* Neighborhood Specs */}
                        <div className="space-y-4">
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs font-medium">
                              <span className="text-muted-foreground flex items-center gap-1"><Shield className="h-3.5 w-3.5 text-accent" /> {t('cityPortal.safetyIndex')}</span>
                              <span className="text-foreground">{selectedNeighborhood.safetyIndex}/100</span>
                            </div>
                            <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                              <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${selectedNeighborhood.safetyIndex}%` }} />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <div className="flex justify-between text-xs font-medium">
                              <span className="text-muted-foreground flex items-center gap-1"><Footprints className="h-3.5 w-3.5 text-accent" /> {t('cityPortal.walkability')}</span>
                              <span className="text-foreground">{selectedNeighborhood.walkabilityIndex}/100</span>
                            </div>
                            <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                              <div className="h-full bg-blue-500 rounded-full" style={{ width: `${selectedNeighborhood.walkabilityIndex}%` }} />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <div className="flex justify-between text-xs font-medium">
                              <span className="text-muted-foreground flex items-center gap-1"><Trees className="h-3.5 w-3.5 text-accent" /> {t('cityPortal.greenSpaces')}</span>
                              <span className="text-foreground">{selectedNeighborhood.greenSpacesIndex}/100</span>
                            </div>
                            <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                              <div className="h-full bg-green-500 rounded-full" style={{ width: `${selectedNeighborhood.greenSpacesIndex}%` }} />
                            </div>
                          </div>
                        </div>

                        {/* Badges */}
                        <div className="border-t border-border pt-4 space-y-3">
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground flex items-center gap-1"><DollarSign className="h-3.5 w-3.5" /> {t('cityPortal.priceRating')}</span>
                            <span className="font-semibold text-foreground">{selectedNeighborhood.costRating}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground flex items-center gap-1"><Volume2 className="h-3.5 w-3.5" /> {t('cityPortal.noiseLevel')}</span>
                            <span className="font-semibold text-foreground">{selectedNeighborhood.noiseLevel}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground flex items-center gap-1"><Building className="h-3.5 w-3.5" /> {t('cityPortal.evCharging')}</span>
                            <span className="font-semibold text-foreground">{selectedNeighborhood.evCharging}</span>
                          </div>
                        </div>
                        
                        {/* Lifestyle tags */}
                        <div className="flex flex-wrap gap-1.5 pt-2">
                          {selectedNeighborhood.lifestyleProfile.map((tag: string) => (
                            <span key={tag} className="text-[10px] bg-secondary/80 text-muted-foreground px-2 py-1 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </>
                    );
                  })()}
                </div>
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground text-sm font-light">
                  {t('common.selectNeighborhoodPlaceholder')}
                </div>
              )}

              {selectedNeighborhood && (
                <div className="mt-6 flex flex-col gap-2">
                  <Link
                    href={`/${locale}/${getLocalizedSlug('country', city.country, locale)}/${getLocalizedSlug('city', city.slug, locale)}/${getLocalizedSlug('neighborhood', selectedNeighborhood.id, locale)}`}
                    className="flex h-11 w-full items-center justify-center rounded-xl bg-accent text-sm font-semibold text-white gap-1"
                  >
                    <span>{t('cityPortal.openPortal', { name: t(`neighborhoods.${selectedNeighborhood.id}.name`, { defaultValue: selectedNeighborhood.name }) })}</span>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href={`/${locale}/properties?city=${city.slug}&neighborhood=${selectedNeighborhood.name}`}
                    className="flex h-10 w-full items-center justify-center rounded-xl border border-border text-xs font-semibold text-foreground hover:bg-secondary/30"
                  >
                    {t('cityPortal.viewHomes', { name: t(`neighborhoods.${selectedNeighborhood.id}.name`, { defaultValue: selectedNeighborhood.name }) })}
                  </Link>
                </div>
              )}
            </div>

            {/* Right Col: Map */}
            <div className="lg:col-span-1 rounded-2xl overflow-hidden border border-border h-full">
              <Map
                center={selectedNeighborhood ? selectedNeighborhood.coordinates : city.coordinates}
                zoom={13}
                markers={mapMarkers}
              />
            </div>
          </div>
        )}

        {/* Tab 3: Cost of Living */}
        {activeTab === 'cost' && (
          <div className="space-y-8">
            <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 max-w-4xl mx-auto space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
                <div>
                  <h3 className="font-serif text-2xl font-bold">{t('cityPortal.costComparisonTitle', { name: cityName })}</h3>
                  <p className="text-muted-foreground text-xs font-light">{t('cityPortal.costComparisonSub')}</p>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-xs text-muted-foreground block">{t('cityPortal.costIndexLabel')}</span>
                  <span className="font-serif text-3xl font-black text-accent">{city.costIndex}%</span>
                </div>
              </div>

              {/* Cost items listing */}
              <div className="space-y-4">
                {costComparison.map((item: any) => {
                  const percentageDiff = Math.round(((item.osloPriceNok - item.localPriceNok) / item.osloPriceNok) * 100);
                  return (
                    <div key={item.name} className="grid grid-cols-1 md:grid-cols-3 items-center gap-4 py-3 border-b border-border/40 last:border-0 text-sm">
                      <div className="space-y-0.5">
                        <span className="font-medium text-foreground">{item.name}</span>
                        <span className="block text-[10px] text-muted-foreground uppercase">{item.category}</span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-xs font-medium md:col-span-2">
                        <div className="w-1/2 space-y-1">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">{t('cityPortal.norwayLabel')}</span>
                            <span className="font-semibold">{formatPrice(item.osloPriceNok, 'NOK')}</span>
                          </div>
                          <div className="h-1.5 w-full bg-stone-300 dark:bg-stone-800 rounded-full overflow-hidden">
                            <div className="h-full bg-stone-500 rounded-full w-full" />
                          </div>
                        </div>
                        
                        <div className="w-1/2 space-y-1">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">{cityName}:</span>
                            <span className="font-semibold text-accent">{formatPrice(item.localPriceNok, 'NOK')}</span>
                          </div>
                          <div className="h-1.5 w-full bg-stone-300 dark:bg-stone-800 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-accent rounded-full" 
                              style={{ width: `${(item.localPriceNok / item.osloPriceNok) * 100}%` }}
                            />
                          </div>
                        </div>

                        <span className="hidden md:inline-block w-24 text-right font-bold text-emerald-500 text-xs">
                          {t('cityPortal.cheaperText', { percentage: percentageDiff })}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
