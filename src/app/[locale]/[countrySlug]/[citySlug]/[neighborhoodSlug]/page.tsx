'use client';

import React, { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { db } from '../../../../../lib/db';
import { useApp } from '../../../../../context/AppContext';
import { useI18n } from '../../../../../lib/i18n/I18nContext';
import { getCanonicalSlug, getLocalizedSlug } from '../../../../../lib/i18n/i18n';
import { City, Neighborhood, Property, countries } from '../../../../../data/mockDb';
import Map from '../../../../../components/Map';
import Slider from '../../../../../components/ui/Slider';
import { Shield, HeartPulse, Trees, Footprints, Train, Volume2, DollarSign, Building, BedDouble, Bath, Maximize2, Heart, ArrowLeft, Sliders, MapPin } from 'lucide-react';

interface PageProps {
  params: Promise<{ locale: string; countrySlug: string; citySlug: string; neighborhoodSlug: string }>;
}

export default function NeighborhoodPortal({ params }: PageProps) {
  const { locale, t } = useI18n();
  const { countrySlug, citySlug, neighborhoodSlug } = use(params);
  
  const { 
    formatPrice, 
    toggleFavorite, 
    isFavorite,
    neighborhoodWeights,
    updateNeighborhoodWeight,
    calculateNeighborhoodMatchScore
  } = useApp();

  const [city, setCity] = useState<City | null>(null);
  const [neighborhood, setNeighborhood] = useState<Neighborhood | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  const canonicalCountryId = getCanonicalSlug('country', countrySlug, locale);
  const canonicalCityId = getCanonicalSlug('city', citySlug, locale);
  const canonicalNeighborhoodId = getCanonicalSlug('neighborhood', neighborhoodSlug, locale);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const c = await db.getCity(canonicalCityId);
      if (c) {
        setCity(c);
        const n = c.neighborhoods.find(nh => nh.id === canonicalNeighborhoodId);
        if (n) {
          setNeighborhood(n);
          const allProps = await db.getProperties({ city: canonicalCityId, neighborhood: n.name });
          setProperties(allProps);
        }
      }
      setLoading(false);
    };
    loadData();
  }, [canonicalCityId, canonicalNeighborhoodId]);

  if (loading) {
    return (
      <div className="flex h-[70vh] w-full items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" />
          <span className="text-sm text-muted-foreground">{t('loading.neighborhood')}</span>
        </div>
      </div>
    );
  }

  if (!city || !neighborhood) {
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

  const isNeighborhoodFav = isFavorite('neighborhoods', neighborhood.id);

  // Map markers
  const mapMarkers = [
    {
      id: neighborhood.id,
      position: neighborhood.coordinates,
      title: `${neighborhood.name} ${t('common.center')}`,
      priceText: `${t('cityPortal.matchScoreLabel')}: ${calculateNeighborhoodMatchScore(neighborhood)}%`
    },
    ...properties.map(p => ({
      id: p.id,
      position: p.coordinates,
      title: p.title,
      priceText: `${formatPrice(p.price, p.currency)}`,
      link: `/${locale}/property/${p.id}`
    }))
  ];

  const neighborhoodDetailsList = [
    { name: t('metrics.safety'), key: 'safety' as const, value: neighborhood.safetyIndex, icon: Shield, color: 'bg-emerald-500' },
    { name: t('metrics.transit'), key: 'transit' as const, value: neighborhood.walkabilityIndex, icon: Footprints, color: 'bg-blue-500' },
    { name: t('metrics.parks'), key: 'parks' as const, value: neighborhood.greenSpacesIndex, icon: Trees, color: 'bg-green-500' },
    { name: t('metrics.healthcare'), key: 'healthcare' as const, value: neighborhood.healthcareIndex, icon: HeartPulse, color: 'bg-rose-500' },
    { name: t('metrics.dining'), key: 'dining' as const, value: neighborhood.diningIndex, icon: Volume2, color: 'bg-purple-500' },
    { name: t('metrics.shopping'), key: 'shopping' as const, value: neighborhood.shoppingIndex, icon: DollarSign, color: 'bg-amber-500' },
    { name: t('metrics.retirement'), key: 'retirement' as const, value: neighborhood.retirementIndex, icon: Shield, color: 'bg-orange-500' }
  ];

  const lCityName = t(`cities.${city.id}.name`, { defaultValue: city.name });
  const cityName = lCityName === `cities.${city.id}.name` ? city.name : lCityName;

  const lNeighName = t(`neighborhoods.${neighborhood.id}.name`, { defaultValue: neighborhood.name });
  const neighName = lNeighName === `neighborhoods.${neighborhood.id}.name` ? neighborhood.name : lNeighName;

  const lNeighDesc = t(`neighborhoods.${neighborhood.id}.description`, { defaultValue: neighborhood.description });
  const neighDescription = lNeighDesc === `neighborhoods.${neighborhood.id}.description` ? neighborhood.description : lNeighDesc;

  return (
    <div className="w-full pb-20 animate-fade-in space-y-8">
      {/* Immersive Header */}
      <section className="relative h-[45vh] w-full flex items-end bg-black">
        {neighborhood.image && (
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 mix-blend-luminosity"
            style={{ backgroundImage: `url('${neighborhood.image}')` }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        
        <div className="relative z-10 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 pb-8 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-accent flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {cityName}, {t(`countries.${city.country}.name`, { defaultValue: city.country.toUpperCase() })}
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-black text-white leading-[1.15]">
              {t('neighborhoodPortal.title', { name: neighName })}
            </h1>
            <p className="text-stone-200/90 text-sm font-light max-w-2xl leading-relaxed mt-2">
              {neighDescription}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => toggleFavorite('neighborhoods', neighborhood.id)}
              className={`flex h-11 items-center justify-center gap-2 rounded-xl border px-5 text-sm font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
                isNeighborhoodFav
                  ? 'border-accent bg-accent text-white'
                  : 'border-border bg-black/40 text-foreground hover:bg-secondary/40 backdrop-blur-md'
              }`}
            >
              <Shield className={`h-4.5 w-4.5 ${isNeighborhoodFav ? 'fill-white' : ''}`} />
              <span>{isNeighborhoodFav ? t('neighborhoodPortal.saved') : t('neighborhoodPortal.save')}</span>
            </button>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Back navigation */}
        <div>
          <Link 
            href={`/${locale}/${getLocalizedSlug('country', city.country, locale)}/${getLocalizedSlug('city', city.slug, locale)}`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>{t('neighborhoodPortal.backToCity', { name: cityName })}</span>
          </Link>
        </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Stats and Properties */}
        <div className="lg:col-span-2 space-y-10">
          
          {/* Match Score Display & Weights Tuning */}
          <section className="bg-card border border-border rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border pb-4 gap-4">
              <div>
                <h2 className="font-serif text-xl font-bold">{t('neighborhoodPortal.matchScoreTitle')}</h2>
                <p className="text-muted-foreground text-xs font-light">{t('neighborhoodPortal.matchScoreSub')}</p>
              </div>
              <div className="flex items-center gap-3 bg-secondary/30 rounded-xl px-4 py-2 border border-border/40">
                <span className="text-[10px] uppercase font-bold text-muted-foreground">{t('common.suiteScore')}</span>
                <span className="font-mono text-3xl font-black text-accent">{calculateNeighborhoodMatchScore(neighborhood)}%</span>
              </div>
            </div>

            {/* Sliders Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              {neighborhoodDetailsList.map((metric) => (
                <div key={metric.key} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <metric.icon className="h-3.5 w-3.5 text-accent" />
                      {metric.name} ({metric.value}/100)
                    </span>
                    <span className="font-semibold text-accent">{neighborhoodWeights[metric.key]}/10</span>
                  </div>
                  <Slider
                    min={0}
                    max={10}
                    step={1}
                    value={neighborhoodWeights[metric.key]}
                    onChange={(val) => updateNeighborhoodWeight(metric.key, val)}
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Properties in this Neighborhood */}
          <section className="space-y-6">
            <div className="border-b border-border pb-4">
              <h2 className="font-serif text-2xl font-bold">{t('neighborhoodPortal.propertiesTitle', { name: neighName })}</h2>
              <p className="text-muted-foreground text-xs font-light mt-0.5">{t('neighborhoodPortal.propertiesSub')}</p>
            </div>

            {properties.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {properties.map((prop) => {
                  const isFav = isFavorite('properties', prop.id);
                  return (
                    <div
                      key={prop.id}
                      className="group rounded-2xl border border-border bg-card overflow-hidden hover:shadow-md transition-all flex flex-col h-full relative"
                    >
                      <div className="h-44 w-full overflow-hidden relative">
                        <img
                          src={prop.image}
                          alt={prop.title}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-103"
                        />
                        
                        <button
                          onClick={() => toggleFavorite('properties', prop.id)}
                          className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 border border-white/10 text-white backdrop-blur-sm transition-colors hover:bg-black/75"
                        >
                          <Heart className={`h-4 w-4 ${isFav ? 'fill-accent text-accent' : ''}`} />
                        </button>

                        <span className="absolute bottom-3 left-3 text-[10px] font-bold text-white bg-black/60 border border-white/10 px-2 py-0.5 rounded backdrop-blur-sm">
                          {t('neighborhoodPortal.epcLabel')}: <strong className="text-accent">{prop.epcRating}</strong>
                        </span>
                      </div>

                      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                        <div className="space-y-1">
                          <h3 className="font-serif text-base font-bold text-foreground leading-tight line-clamp-1">
                            {prop.title}
                          </h3>
                          <div className="flex items-center gap-3 text-[11px] text-muted-foreground pt-1">
                            <span className="flex items-center gap-1"><BedDouble className="h-3.5 w-3.5 text-accent" /> {t('propertiesPage.bedLabel', { count: prop.bedrooms })}</span>
                            <span className="flex items-center gap-1"><Bath className="h-3.5 w-3.5 text-accent" /> {t('propertiesPage.bathLabel', { count: prop.bathrooms })}</span>
                            <span className="flex items-center gap-1"><Maximize2 className="h-3.5 w-3.5 text-accent" /> {t('propertiesPage.sizeLabel', { count: prop.size })}</span>
                          </div>
                        </div>

                        <div className="border-t border-border pt-4 flex items-center justify-between">
                          <span className="font-serif font-bold text-foreground">
                            {formatPrice(prop.price, prop.currency)}
                          </span>
                          
                          <Link
                            href={`/${locale}/property/${prop.id}`}
                            className="flex items-center gap-0.5 text-xs font-bold text-accent"
                          >
                            <span>{t('neighborhoodPortal.openListing')}</span>
                            <span>&#8594;</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-border bg-secondary/10">
                <Building className="h-10 w-10 text-accent mb-3" />
                <h3 className="font-serif text-lg font-bold">{t('neighborhoodPortal.noListingsTitle')}</h3>
                <p className="text-muted-foreground text-xs font-light max-w-sm mt-1">
                  {t('neighborhoodPortal.noListingsSub')}
                </p>
              </div>
            )}
          </section>
        </div>

        {/* Right 1 Col: Quick Info & Neighborhood Map */}
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
            <h3 className="font-serif text-lg font-bold">{t('neighborhoodPortal.localInfrastructure')}</h3>
            
            <div className="space-y-3.5 text-xs">
              <div className="flex justify-between border-b border-border/50 pb-2">
                <span className="text-muted-foreground flex items-center gap-1"><Volume2 className="h-4 w-4 text-accent" /> {t('neighborhoodPortal.noiseLevel')}</span>
                <span className="font-semibold text-foreground">{neighborhood.noiseLevel}</span>
              </div>
              <div className="flex justify-between border-b border-border/50 pb-2">
                <span className="text-muted-foreground flex items-center gap-1"><DollarSign className="h-4 w-4 text-accent" /> {t('neighborhoodPortal.priceClass')}</span>
                <span className="font-semibold text-foreground">{neighborhood.costRating}</span>
              </div>
              <div className="flex justify-between border-b border-border/50 pb-2">
                <span className="text-muted-foreground flex items-center gap-1"><Building className="h-4 w-4 text-accent" /> {t('neighborhoodPortal.evDensity')}</span>
                <span className="font-semibold text-foreground">{neighborhood.evCharging}</span>
              </div>
              <div className="space-y-1.5 pt-1">
                <span className="text-muted-foreground block font-semibold uppercase text-[9px] tracking-wider">{t('neighborhoodPortal.lifestyleProfile')}</span>
                <div className="flex flex-wrap gap-1">
                  {neighborhood.lifestyleProfile.map(tag => (
                    <span key={tag} className="text-[10px] bg-secondary/80 text-muted-foreground px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="h-[400px] w-full rounded-2xl overflow-hidden border border-border">
            <Map
              center={neighborhood.coordinates}
              zoom={14}
              markers={mapMarkers}
            />
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
