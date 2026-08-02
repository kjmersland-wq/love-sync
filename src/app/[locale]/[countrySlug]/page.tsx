'use client';

import React, { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { db } from '../../../lib/db';
import { useI18n } from '../../../lib/i18n/I18nContext';
import { getCanonicalSlug, getLocalizedSlug } from '../../../lib/i18n/i18n';
import { Country, City } from '../../../data/mockDb';
import Map from '../../../components/Map';
import { Shield, HeartPulse, Landmark, BookOpen, Sun, ChevronRight } from 'lucide-react';

interface PageProps {
  params: Promise<{ locale: string; countrySlug: string }>;
}

export default function CountryPortal({ params }: PageProps) {
  const { locale, t } = useI18n();
  const { countrySlug } = use(params);
  
  const [country, setCountry] = useState<Country | null>(null);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);

  const canonicalCountryId = getCanonicalSlug('country', countrySlug, locale);

  useEffect(() => {
    const loadCountryData = async () => {
      setLoading(true);
      const c = await db.getCountry(canonicalCountryId);
      if (c) {
        setCountry(c);
        const ct = await db.getCities(canonicalCountryId);
        setCities(ct);
      }
      setLoading(false);
    };
    loadCountryData();
  }, [canonicalCountryId]);

  if (loading) {
    return (
      <div className="flex h-[70vh] w-full items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" />
          <span className="text-sm text-muted-foreground">Loading country portal...</span>
        </div>
      </div>
    );
  }

  if (!country) {
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

  // Localize text fields from translations if present, else fallback
  const cName = t(`countries.${country.id}.name`, { defaultValue: country.name });
  const countryName = cName === `countries.${country.id}.name` ? country.name : cName;

  const cDesc = t(`countries.${country.id}.description`, { defaultValue: country.description });
  const countryDescription = cDesc === `countries.${country.id}.description` ? country.description : cDesc;

  const visaText = t(`countries.${country.id}.visaGuideline`, { defaultValue: country.visaGuideline });
  const residencyText = t(`countries.${country.id}.residencyGuideline`, { defaultValue: country.residencyGuideline });
  const taxText = t(`countries.${country.id}.taxPolicy`, { defaultValue: country.taxPolicy });
  const climateText = t(`countries.${country.id}.climateOverview`, { defaultValue: country.climateOverview });

  // Calculate center of cities for the map
  const mapCenter: [number, number] = cities.length > 0 
    ? [
        cities.reduce((sum, c) => sum + c.coordinates[0], 0) / cities.length,
        cities.reduce((sum, c) => sum + c.coordinates[1], 0) / cities.length
      ]
    : [40.4168, -3.7038]; // default Spain center

  const mapMarkers = cities.map(c => {
    const lCityName = t(`cities.${c.id}.name`, { defaultValue: c.name });
    const cityNameTranslated = lCityName === `cities.${c.id}.name` ? c.name : lCityName;
    return {
      id: c.id,
      position: c.coordinates,
      title: cityNameTranslated,
      priceText: `Retirement Score: ${c.retirementScore}/100`,
      link: `/${locale}/${getLocalizedSlug('country', country.slug, locale)}/${getLocalizedSlug('city', c.slug, locale)}`
    };
  });

  return (
    <div className="w-full pb-20">
      {/* Header Banner */}
      <section className="relative h-[45vh] w-full flex items-end bg-black">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-55 mix-blend-luminosity animate-fade-in"
          style={{ backgroundImage: `url('${country.image}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        
        <div className="relative z-10 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 pb-12">
          <span className="text-xs font-semibold uppercase tracking-widest text-accent mb-2 block">
            {t('countriesSection.explorePortal')}
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-black text-white">
            {t('countriesSection.explorePortal')}: {countryName}
          </h1>
        </div>
      </section>

      {/* Relocation Guidelines */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-12 grid grid-cols-1 gap-12 lg:grid-cols-3">
        {/* Left 2 Cols: Guides & City List */}
        <div className="lg:col-span-2 space-y-12">
          {/* Guide Sections */}
          <section className="bg-card border border-border rounded-2xl p-6 sm:p-8 space-y-6">
            <h2 className="font-serif text-2xl font-bold mb-4 border-b border-border pb-3">{t('countriesSection.explorePortal')} {t('common.guidelines')}</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 font-semibold text-foreground">
                  <BookOpen className="h-4 w-4 text-accent" />
                  <span>{t('countriesSection.visaLabel')}</span>
                </div>
                <p className="text-muted-foreground text-sm font-light leading-relaxed text-stone-600 dark:text-stone-300">
                  {visaText === `countries.${country.id}.visaGuideline` ? country.visaGuideline : visaText}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 font-semibold text-foreground">
                  <Landmark className="h-4 w-4 text-accent" />
                  <span>{t('countriesSection.residencyLabel')}</span>
                </div>
                <p className="text-muted-foreground text-sm font-light leading-relaxed text-stone-600 dark:text-stone-300">
                  {residencyText === `countries.${country.id}.residencyGuideline` ? country.residencyGuideline : residencyText}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 font-semibold text-foreground">
                  <Shield className="h-4 w-4 text-accent" />
                  <span>{t('countriesSection.taxLabel')}</span>
                </div>
                <p className="text-muted-foreground text-sm font-light leading-relaxed text-stone-600 dark:text-stone-300">
                  {taxText === `countries.${country.id}.taxPolicy` ? country.taxPolicy : taxText}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 font-semibold text-foreground">
                  <Sun className="h-4 w-4 text-accent" />
                  <span>{t('countriesSection.climateLabel')}</span>
                </div>
                <p className="text-muted-foreground text-sm font-light leading-relaxed text-stone-600 dark:text-stone-300">
                  {climateText === `countries.${country.id}.climateOverview` ? country.climateOverview : climateText}
                </p>
              </div>

            </div>
          </section>

          {/* Cities Grid */}
          <section className="space-y-6">
            <h2 className="font-serif text-2xl font-bold border-b border-border pb-3">{t('citiesSection.title')} in {countryName}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {cities.map((city) => {
                const lCityName = t(`cities.${city.id}.name`, { defaultValue: city.name });
                const cityNameTranslated = lCityName === `cities.${city.id}.name` ? city.name : lCityName;
                const lCityDesc = t(`cities.${city.id}.description`, { defaultValue: city.description });
                const cityDescTranslated = lCityDesc === `cities.${city.id}.description` ? city.description : lCityDesc;

                return (
                  <div 
                    key={city.id}
                    className="group rounded-2xl border border-border bg-card overflow-hidden hover:shadow-md transition-all flex flex-col"
                  >
                    <div className="h-48 w-full overflow-hidden relative">
                      <img 
                        src={city.image} 
                        alt={city.name} 
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-103"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <span className="absolute bottom-3 left-3 text-white font-serif text-xl font-bold">{cityNameTranslated}</span>
                    </div>
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <p className="text-muted-foreground text-xs font-light leading-relaxed line-clamp-2 text-stone-600 dark:text-stone-300">
                        {cityDescTranslated}
                      </p>
                      <div className="grid grid-cols-3 gap-1 py-1.5 border-y border-border text-center text-[11px] font-medium text-muted-foreground">
                        <div>
                          <span className="block text-[8px] uppercase tracking-wider">{t('citiesSection.safety')}</span>
                          <span className="text-foreground font-semibold">{city.safety}</span>
                        </div>
                        <div>
                          <span className="block text-[8px] uppercase tracking-wider">{t('common.retirement')}</span>
                          <span className="text-foreground font-semibold">{city.retirementScore}</span>
                        </div>
                        <div>
                          <span className="block text-[8px] uppercase tracking-wider">{t('citiesSection.cost')}</span>
                          <span className="text-foreground font-semibold">{city.costIndex}%</span>
                        </div>
                      </div>
                      <div className="flex justify-end pt-1">
                        <Link 
                          href={`/${locale}/${getLocalizedSlug('country', country.slug, locale)}/${getLocalizedSlug('city', city.slug, locale)}`}
                          className="flex items-center gap-0.5 text-xs font-semibold text-accent"
                        >
                          <span>{t('citiesSection.exploreNeighborhoods')}</span>
                          <ChevronRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* Right 1 Col: Quick Info & Interactive Map */}
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
            <h3 className="font-serif text-lg font-bold">{t('common.quickFacts')}</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b border-border/60 pb-2">
                <span className="text-muted-foreground">{t('common.officialLanguage')}</span>
                <span className="font-semibold">{country.language}</span>
              </div>
              <div className="flex justify-between border-b border-border/60 pb-2">
                <span className="text-muted-foreground">{t('common.currency')}</span>
                <span className="font-semibold">{country.currency}</span>
              </div>
              <div className="flex justify-between border-b border-border/60 pb-2">
                <span className="text-muted-foreground">{t('common.exchangeRate')}</span>
                <span className="font-semibold">1 {country.currency} = {country.exchangeRateToEur} EUR</span>
              </div>
              <div className="flex justify-between pb-1">
                <span className="text-muted-foreground">{t('common.schengenZone')}</span>
                <span className="font-semibold">{t('common.yes')}</span>
              </div>
            </div>
          </div>

          {/* Interactive Map */}
          <div className="h-[350px] w-full rounded-2xl overflow-hidden border border-border">
            <Map 
              center={mapCenter} 
              zoom={5} 
              markers={mapMarkers} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
