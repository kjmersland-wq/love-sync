'use client';

import React, { useState, useEffect, Suspense, use } from 'react';
import { useSearchParams } from 'next/navigation';
import { db } from '../../../lib/db';
import { useApp } from '../../../context/AppContext';
import { useI18n } from '../../../lib/i18n/I18nContext';
import { City, Property, cities, countries } from '../../../data/mockDb';
import Select from '../../../components/ui/Select';
import { 
  GitCompare, MapPin, Shield, HeartPulse, Sun, Footprints, Train, 
  Trees, Landmark, DollarSign, Star, Trash2, BedDouble, Bath, 
  Maximize2, BatteryCharging, ShieldCheck, ArrowRight, Eye, Sparkles 
} from 'lucide-react';
import Link from 'next/link';
import { PremiumLockOverlay } from '../../../components/relationship/PremiumLockOverlay';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default function ComparePortalPage({ params }: PageProps) {
  const { locale } = use(params);

  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" />
      </div>
    }>
      <ComparePortal locale={locale} />
    </Suspense>
  );
}

function ComparePortal({ locale }: { locale: string }) {
  const searchParams = useSearchParams();
  const { t } = useI18n();
  const { 
    formatPrice, 
    comparedProperties, 
    toggleCompareProperty,
    comparedCities,
    toggleCompareCity,
    calculatePropertyMatchScore,
    userProfile
  } = useApp();

  if (userProfile.subscription !== 'Premium') {
    return <PremiumLockOverlay featureKey="relocation" />;
  }

  const [activeTab, setActiveTab] = useState<'properties' | 'cities'>('properties');
  
  // Property comparison state
  const [propertiesList, setPropertiesList] = useState<Property[]>([]);
  
  // City comparison state
  const [selectedCitySlugs, setSelectedCitySlugs] = useState<string[]>([]);
  const [comparedCitiesList, setComparedCitiesList] = useState<City[]>([]);

  // Load properties for comparison
  useEffect(() => {
    const fetchProperties = async () => {
      const list: Property[] = [];
      for (const id of comparedProperties) {
        const p = await db.getProperty(id);
        if (p) list.push(p);
      }
      setPropertiesList(list);
    };
    fetchProperties();
  }, [comparedProperties]);

  // Load cities from query params or context
  useEffect(() => {
    const c1 = searchParams?.get('c1');
    const c2 = searchParams?.get('c2');
    const c3 = searchParams?.get('c3');

    const initialSlugs: string[] = [];
    if (c1) initialSlugs.push(c1);
    if (c2) initialSlugs.push(c2);
    if (c3) initialSlugs.push(c3);

    if (initialSlugs.length === 0) {
      if (comparedCities.length > 0) {
        initialSlugs.push(...comparedCities);
      } else {
        initialSlugs.push('valencia', 'warsaw');
      }
    }

    setSelectedCitySlugs(initialSlugs);
  }, [searchParams, comparedCities]);

  // Sync cities list
  useEffect(() => {
    const loadCities = async () => {
      const list: City[] = [];
      for (const slug of selectedCitySlugs) {
        const c = await db.getCity(slug);
        if (c) list.push(c);
      }
      setComparedCitiesList(list);
    };
    loadCities();
  }, [selectedCitySlugs]);

  const handleCitySelect = (index: number, slug: string) => {
    setSelectedCitySlugs(prev => {
      const updated = [...prev];
      if (slug === 'none') {
        updated.splice(index, 1);
      } else {
        updated[index] = slug;
      }
      return updated;
    });
  };

  const addCityColumn = () => {
    if (selectedCitySlugs.length >= 3) return;
    const nextCity = cities.find(c => !selectedCitySlugs.includes(c.slug));
    if (nextCity) {
      setSelectedCitySlugs(prev => [...prev, nextCity.slug]);
    }
  };

  const removeCityColumn = (index: number) => {
    setSelectedCitySlugs(prev => prev.filter((_, i) => i !== index));
  };

  const selectOptions = [
    { value: 'none', label: `-- ${t('comparePage.clearAll')} --` },
    ...cities.map(c => ({ value: c.slug, label: `${t(`cities.${c.id}.name`, { defaultValue: c.name })} (${t(`countries.${c.country}.name`, { defaultValue: c.country.toUpperCase() })})` }))
  ];

  const cityComparisonRows = [
    { name: t('propertyDetails.country'), getValue: (c: City) => t(`countries.${c.country}.name`, { defaultValue: c.country.toUpperCase() }), icon: MapPin },
    { name: t('cityPortal.qualityScore'), getValue: (c: City) => `${c.retirementScore}/100`, icon: Star, highlight: true },
    { name: t('citiesSection.safety'), getValue: (c: City) => `${c.safety}/100`, icon: Shield },
    { name: t('citiesSection.healthcare'), getValue: (c: City) => `${c.healthcare}/100`, icon: HeartPulse },
    { name: t('countriesSection.climateLabel'), getValue: (c: City) => `${c.climate}/100`, icon: Sun },
    { name: t('cityPortal.walkability'), getValue: (c: City) => `${c.walkability}/100`, icon: Footprints },
    { name: t('comparePage.features.transit'), getValue: (c: City) => `${c.transit}/100`, icon: Train },
    { name: t('cityPortal.greenSpaces'), getValue: (c: City) => `${c.greenery}/100`, icon: Trees },
    { name: t('cityPortal.costIndexLabel'), getValue: (c: City) => `${c.costIndex}%`, icon: DollarSign },
    { name: t('countriesSection.taxLabel'), getValue: (c: City) => `${c.taxScore}/100`, icon: Landmark }
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-10 animate-fade-in bg-background">
      
      {/* Title Header */}
      <div className="border-b border-border pb-6 space-y-3">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight flex items-center gap-2">
          <GitCompare className="h-6 w-6 text-accent" />
          <span>{t('comparePage.title')}</span>
        </h1>
        <p className="text-muted-foreground text-xs font-light">
          {t('comparePage.subtitle')}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border gap-6">
        <button
          onClick={() => setActiveTab('properties')}
          className={`py-3 text-sm font-bold border-b-2 transition-all relative ${
            activeTab === 'properties' 
              ? 'border-accent text-accent' 
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          {t('propertiesPage.compareMaxLabel', { count: propertiesList.length })}
        </button>
        <button
          onClick={() => setActiveTab('cities')}
          className={`py-3 text-sm font-bold border-b-2 transition-all relative ${
            activeTab === 'cities' 
              ? 'border-accent text-accent' 
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          {t('comparePage.compareCities')}
        </button>
      </div>

      {/* TAB 1: PROPERTIES COMPARISON */}
      {activeTab === 'properties' && (
        <div className="space-y-6">
          {propertiesList.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-16 text-center border border-dashed border-border rounded-3xl bg-secondary/15">
              <GitCompare className="h-12 w-12 text-accent mb-4 animate-pulse-slow" />
              <h3 className="font-serif text-xl font-bold">{t('neighborhoodPortal.noListingsTitle')}</h3>
              <p className="text-muted-foreground text-xs font-light max-w-sm mt-1 mb-6">
                {t('comparePage.noProperties')}
              </p>
              <Link
                href={`/${locale}/properties`}
                className="flex h-11 items-center justify-center rounded-xl bg-accent px-6 text-sm font-semibold text-white hover:scale-102 transition-transform"
              >
                {t('nav.search')}
              </Link>
            </div>
          ) : (
            <div className="w-full overflow-x-auto pb-4">
              <table className="w-full min-w-[1000px] border-collapse bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
                <thead>
                  <tr className="border-b border-border bg-secondary/25 text-left text-xs font-bold text-muted-foreground">
                    <th className="p-4 w-44">{t('comparePage.features.type')}</th>
                    {propertiesList.map(prop => (
                      <th key={prop.id} className="p-4 w-60 border-l border-border relative">
                        <button
                          onClick={() => toggleCompareProperty(prop.id)}
                          className="absolute top-2 right-2 text-muted-foreground hover:text-accent p-1 rounded"
                          title="Remove property"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                        
                        <div className="space-y-2.5 pt-2">
                          <img 
                            src={prop.image} 
                            alt={prop.title} 
                            className="h-28 w-full object-cover rounded-lg border border-border"
                          />
                          <h4 className="font-serif font-bold text-foreground line-clamp-1 leading-tight">{prop.title}</h4>
                          <span className="text-[10px] text-accent block font-mono">{prop.neighborhood}, {t(`cities.${prop.city}.name`, { defaultValue: prop.city }).toUpperCase()}</span>
                        </div>
                      </th>
                    ))}
                    {Array.from({ length: 5 - propertiesList.length }).map((_, idx) => (
                      <th key={idx} className="p-4 border-l border-border bg-secondary/5">
                        <Link 
                          href={`/${locale}/properties`}
                          className="flex flex-col items-center justify-center h-44 text-muted-foreground hover:text-accent transition-all group"
                        >
                          <span className="text-xs font-bold">{t('propertiesPage.addListing')}</span>
                          <span className="text-[9px] font-light mt-0.5 opacity-75">{t('propertiesPage.compareUpTo5')}</span>
                        </Link>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-xs text-foreground font-medium">
                  {/* Match Score */}
                  <tr className="bg-accent/5">
                    <td className="p-4 font-bold text-accent">{t('propertiesPage.propertyMatchScore')}</td>
                    {propertiesList.map(p => (
                      <td key={p.id} className="p-4 border-l border-border font-black text-accent text-sm font-mono">
                        {calculatePropertyMatchScore(p)}%
                      </td>
                    ))}
                    {Array.from({ length: 5 - propertiesList.length }).map((_, i) => <td key={i} className="p-4 border-l border-border bg-secondary/5" />)}
                  </tr>

                  {/* Price Grid */}
                  <tr>
                    <td className="p-4 text-muted-foreground font-bold uppercase text-[9px] tracking-wider">EUR {t('comparePage.features.price')}</td>
                    {propertiesList.map(p => {
                      const eurPrice = p.currency === 'PLN' ? p.price * 0.23 : p.price;
                      return (
                        <td key={p.id} className="p-4 border-l border-border font-bold text-foreground">
                          {formatPrice(eurPrice, 'EUR')}
                        </td>
                      );
                    })}
                    {Array.from({ length: 5 - propertiesList.length }).map((_, i) => <td key={i} className="p-4 border-l border-border bg-secondary/5" />)}
                  </tr>
                  
                  <tr>
                    <td className="p-4 text-muted-foreground font-bold uppercase text-[9px] tracking-wider">{t('propertyDetails.localPrice')}</td>
                    {propertiesList.map(p => (
                      <td key={p.id} className="p-4 border-l border-border">
                        {formatPrice(p.price, p.currency)}
                      </td>
                    ))}
                    {Array.from({ length: 5 - propertiesList.length }).map((_, i) => <td key={i} className="p-4 border-l border-border bg-secondary/5" />)}
                  </tr>

                  <tr>
                    <td className="p-4 text-muted-foreground font-bold uppercase text-[9px] tracking-wider">{t('comparePage.features.size')} & {t('comparePage.features.bedBath')}</td>
                    {propertiesList.map(p => (
                      <td key={p.id} className="p-4 border-l border-border">
                        {t('propertiesPage.sizeLabel', { count: p.size })} | {t('propertiesPage.bedLabel', { count: p.bedrooms })} / {t('propertiesPage.bathLabel', { count: p.bathrooms })}
                      </td>
                    ))}
                    {Array.from({ length: 5 - propertiesList.length }).map((_, i) => <td key={i} className="p-4 border-l border-border bg-secondary/5" />)}
                  </tr>

                  <tr>
                    <td className="p-4 text-muted-foreground font-bold uppercase text-[9px] tracking-wider">{t('propertiesPage.filterFloor')} & {t('comparePage.features.elevator')}</td>
                    {propertiesList.map(p => (
                      <td key={p.id} className="p-4 border-l border-border">
                        {t('propertiesPage.floorLabel', { count: p.floor === 0 ? t('propertiesPage.groundFloor') : p.floor })} | {p.hasElevator ? t('propertiesPage.elevatorLabel') : t('propertiesPage.stairsOnly')}
                      </td>
                    ))}
                    {Array.from({ length: 5 - propertiesList.length }).map((_, i) => <td key={i} className="p-4 border-l border-border bg-secondary/5" />)}
                  </tr>

                  <tr>
                    <td className="p-4 text-muted-foreground font-bold uppercase text-[9px] tracking-wider">{t('comparePage.features.evCharging')} & {t('propertiesPage.garageLabel')}</td>
                    {propertiesList.map(p => (
                      <td key={p.id} className="p-4 border-l border-border">
                        <div className="flex flex-col gap-1">
                          <span>{t('propertiesPage.garageLabel')}: {p.parking ? t('common.yes') : t('common.no')}</span>
                          <span>EV: {p.evReady ? t('propertiesPage.evReadyLabel2') : t('common.no')}</span>
                        </div>
                      </td>
                    ))}
                    {Array.from({ length: 5 - propertiesList.length }).map((_, i) => <td key={i} className="p-4 border-l border-border bg-secondary/5" />)}
                  </tr>

                  <tr>
                    <td className="p-4 text-muted-foreground font-bold uppercase text-[9px] tracking-wider">{t('propertyDetails.commuteLabel')}</td>
                    {propertiesList.map(p => (
                      <td key={p.id} className="p-4 border-l border-border">
                        {p.commuteTimeTrainMin} min {t('common.publicTransit')} ({t('common.center')})
                      </td>
                    ))}
                    {Array.from({ length: 5 - propertiesList.length }).map((_, i) => <td key={i} className="p-4 border-l border-border bg-secondary/5" />)}
                  </tr>

                  <tr>
                    <td className="p-4 text-muted-foreground font-bold uppercase text-[9px] tracking-wider">{t('comparePage.features.epc')} & {t('comparePage.features.noise')}</td>
                    {propertiesList.map(p => (
                      <td key={p.id} className="p-4 border-l border-border">
                        {t('neighborhoodPortal.epcLabel')}: {p.epcRating} | {t('cityPortal.noiseLevel')}: {p.noiseRating}
                      </td>
                    ))}
                    {Array.from({ length: 5 - propertiesList.length }).map((_, i) => <td key={i} className="p-4 border-l border-border bg-secondary/5" />)}
                  </tr>

                  <tr>
                    <td className="p-4 text-muted-foreground font-bold uppercase text-[9px] tracking-wider">{t('propertyDetails.listingDate')}</td>
                    {propertiesList.map(p => (
                      <td key={p.id} className="p-4 border-l border-border font-mono">
                        {p.daysOnMarket} {t('common.days')} ({p.provider})
                      </td>
                    ))}
                    {Array.from({ length: 5 - propertiesList.length }).map((_, i) => <td key={i} className="p-4 border-l border-border bg-secondary/5" />)}
                  </tr>

                  <tr>
                    <td className="p-4 text-muted-foreground font-bold uppercase text-[9px] tracking-wider">{t('propertyDetails.sellerInfo')}</td>
                    {propertiesList.map(p => (
                      <td key={p.id} className="p-4 border-l border-border">
                        {p.isAgency ? `${t('propertyDetails.realEstateAgency')} (${p.agencyName})` : t('propertyDetails.privateSeller')}
                      </td>
                    ))}
                    {Array.from({ length: 5 - propertiesList.length }).map((_, i) => <td key={i} className="p-4 border-l border-border bg-secondary/5" />)}
                  </tr>

                  {/* Actions Row */}
                  <tr>
                    <td className="p-4 text-muted-foreground font-bold uppercase text-[9px] tracking-wider">{t('adminPage.actions')}</td>
                    {propertiesList.map(p => (
                      <td key={p.id} className="p-4 border-l border-border">
                        <Link 
                          href={`/${locale}/property/${p.id}`}
                          className="flex h-9 w-full items-center justify-center rounded-lg bg-accent text-[10px] font-bold text-white text-center hover:bg-accent/85"
                        >
                          {t('neighborhoodPortal.openListing')}
                        </Link>
                      </td>
                    ))}
                    {Array.from({ length: 5 - propertiesList.length }).map((_, i) => <td key={i} className="p-4 border-l border-border bg-secondary/5" />)}
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: CITIES COMPARISON */}
      {activeTab === 'cities' && (
        <div className="space-y-6">
          {/* Selections headers row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
            <div className="hidden md:block font-serif text-lg font-bold text-muted-foreground">
              {t('comparePage.compareCities')}
            </div>
            
            {/* City selectors */}
            {selectedCitySlugs.map((slug, idx) => (
              <div key={idx} className="bg-card border border-border rounded-xl p-4 space-y-3 relative">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">{t('searchForm.cityLabel')} {idx + 1}</span>
                  {selectedCitySlugs.length > 1 && (
                    <button 
                      onClick={() => removeCityColumn(idx)}
                      className="text-muted-foreground hover:text-accent p-1 transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
                <Select
                  options={selectOptions.filter(opt => opt.value !== 'none' || selectedCitySlugs.length > 1)}
                  value={slug}
                  onChange={(val) => handleCitySelect(idx, val)}
                  className="w-full"
                />
              </div>
            ))}

            {selectedCitySlugs.length < 3 && (
              <button 
                onClick={addCityColumn}
                className="flex flex-col items-center justify-center border border-dashed border-border rounded-xl p-6 h-[88px] text-muted-foreground hover:border-accent hover:text-accent transition-all group"
              >
                <span className="text-xs font-semibold">{t('propertiesPage.addCity')}</span>
                <span className="text-[9px] font-light mt-0.5 opacity-75">{t('comparePage.citiesSub')}</span>
              </button>
            )}
          </div>

          {/* Comparison table grid */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
            {/* Mobile View */}
            <div className="block md:hidden p-4 space-y-6 divide-y divide-border">
              {comparedCitiesList.map((city) => (
                <div key={city.slug} className="space-y-4 pt-4 first:pt-0">
                  <div className="flex items-center gap-2 border-b border-border pb-2">
                    <span className="text-lg font-bold text-foreground font-serif">{t(`cities.${city.id}.name`, { defaultValue: city.name })}</span>
                    <span className="text-[10px] uppercase font-bold text-accent bg-accent/10 px-2 py-0.5 rounded-full">
                      {t(`countries.${city.country}.name`, { defaultValue: city.country.toUpperCase() })}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    {cityComparisonRows.map((row) => (
                      <div key={row.name} className="space-y-0.5">
                        <span className="text-muted-foreground">{row.name}</span>
                        <span className="block font-semibold text-foreground">{row.getValue(city)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop grid list */}
            <div className="hidden md:block">
              {cityComparisonRows.map((row, idx) => {
                const RowIcon = row.icon;
                return (
                  <div 
                    key={row.name} 
                    className={`grid grid-cols-4 gap-6 items-center px-6 py-4 border-b border-border/50 last:border-0 hover:bg-secondary/15 transition-colors ${
                      row.highlight ? 'bg-accent/5 font-semibold' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2 text-sm text-foreground font-semibold">
                      <RowIcon className="h-4 w-4 text-accent" />
                      <span>{row.name}</span>
                    </div>

                    {comparedCitiesList.map((city) => (
                      <div 
                        key={city.slug} 
                        className={`text-sm text-foreground ${
                          row.highlight ? 'text-accent font-bold text-base' : ''
                        }`}
                      >
                        {row.getValue(city)}
                      </div>
                    ))}

                    {Array.from({ length: 3 - comparedCitiesList.length }).map((_, i) => (
                      <div key={i} className="text-stone-500 text-xs italic">--</div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
