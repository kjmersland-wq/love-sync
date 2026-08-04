'use client';

import React, { useState, useEffect, Suspense, use } from 'react';
import { useSearchParams } from 'next/navigation';
import { db } from '../../../lib/db';
import { useApp } from '../../../context/AppContext';
import { useI18n } from '../../../lib/i18n/I18nContext';
import { Property, cities } from '../../../data/mockDb';
import Map from '../../../components/Map';
import { DualSlider } from '../../../components/ui/Slider';
import Select from '../../../components/ui/Select';
import { Search, MapPin, BedDouble, Bath, Maximize2, Heart, ShieldAlert, List, Map as MapIcon, SlidersHorizontal, BatteryCharging, Star, GitCompare, RefreshCw, Eye } from 'lucide-react';
import Link from 'next/link';
import { PremiumLockOverlay } from '../../../components/relationship/PremiumLockOverlay';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default function PropertiesSearchPage({ params }: PageProps) {
  const { locale } = use(params);

  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" />
      </div>
    }>
      <PropertiesSearch locale={locale} />
    </Suspense>
  );
}

function PropertiesSearch({ locale }: { locale: string }) {
  const searchParams = useSearchParams();
  const { t } = useI18n();
  const { 
    formatPrice, 
    toggleFavorite, 
    isFavorite,
    calculatePropertyMatchScore,
    toggleCompareProperty,
    comparedProperties,
    watchlist,
    toggleWatchlist,
    isInWatchlist,
    userProfile
  } = useApp();

  if (userProfile.subscription !== 'Premium') {
    return <PremiumLockOverlay featureKey="relocation" />;
  }

  // Load URL queries if any
  const initialCity = searchParams?.get('city') || 'all';
  const initialNeighborhood = searchParams?.get('neighborhood') || '';
  const initialMaxPrice = searchParams?.get('maxPrice') ? Number(searchParams.get('maxPrice')) : 2500000;

  // Filter States
  const [cityFilter, setCityFilter] = useState<string>(initialCity);
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(initialMaxPrice);
  const [bedroomsFilter, setBedroomsFilter] = useState<number>(0);
  const [evReadyFilter, setEvReadyFilter] = useState<boolean>(false);
  const [parkingFilter, setParkingFilter] = useState<boolean>(false);
  const [floorFilter, setFloorFilter] = useState<string>('all'); // 'all', '0', '1+', '3+'
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [onlyFeatured, setOnlyFeatured] = useState<boolean>(false);
  
  // Map bounds states for bounding search
  const [currentBounds, setCurrentBounds] = useState<{ sw: [number, number]; ne: [number, number] } | null>(null);
  const [appliedBounds, setAppliedBounds] = useState<{ sw: [number, number]; ne: [number, number] } | null>(null);
  const [hasMovedMap, setHasMovedMap] = useState<boolean>(false);

  // View States
  const [propertiesList, setPropertiesList] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [mobileView, setMobileView] = useState<'grid' | 'map'>('grid');
  const [showFiltersMobile, setShowFiltersMobile] = useState<boolean>(false);

  // Load properties
  useEffect(() => {
    const fetchAll = async () => {
      const p = await db.getProperties();
      setPropertiesList(p);
    };
    fetchAll();
  }, []);

  // Filter logic
  useEffect(() => {
    let results = [...propertiesList];

    // Bounding Box filter
    if (appliedBounds) {
      results = results.filter(p => {
        const [lat, lng] = p.coordinates;
        const { sw, ne } = appliedBounds;
        return lat >= sw[0] && lat <= ne[0] && lng >= sw[1] && lng <= ne[1];
      });
    }

    if (cityFilter !== 'all') {
      results = results.filter(p => p.city === cityFilter);
    }
    if (initialNeighborhood) {
      results = results.filter(p => p.neighborhood.toLowerCase() === initialNeighborhood.toLowerCase());
    }
    if (typeFilter !== 'All') {
      results = results.filter(p => p.type === typeFilter);
    }
    
    // Price filter
    results = results.filter(p => {
      // Convert property price to EUR for standard pricing sliders
      const propertyPriceInEur = p.currency === 'PLN' ? p.price * 0.23 : p.price;
      return propertyPriceInEur >= minPrice && propertyPriceInEur <= maxPrice;
    });

    if (bedroomsFilter > 0) {
      results = results.filter(p => p.bedrooms >= bedroomsFilter);
    }
    if (evReadyFilter) {
      results = results.filter(p => p.evReady);
    }
    if (parkingFilter) {
      results = results.filter(p => p.parking);
    }
    if (onlyFeatured) {
      results = results.filter(p => p.featured);
    }

    // Floor filter
    if (floorFilter !== 'all') {
      if (floorFilter === '0') {
        results = results.filter(p => p.floor === 0);
      } else if (floorFilter === '1') {
        results = results.filter(p => p.floor >= 1);
      } else if (floorFilter === '3') {
        results = results.filter(p => p.floor >= 3);
      }
    }

    if (selectedAmenities.length > 0) {
      results = results.filter(p =>
        selectedAmenities.every(amenity => p.amenities.includes(amenity))
      );
    }

    // Sort by Match Score descending, and featured properties first
    results.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return calculatePropertyMatchScore(b) - calculatePropertyMatchScore(a);
    });

    setFilteredProperties(results);
  }, [
    propertiesList, 
    cityFilter, 
    typeFilter, 
    minPrice, 
    maxPrice, 
    bedroomsFilter, 
    evReadyFilter, 
    parkingFilter, 
    floorFilter,
    selectedAmenities, 
    onlyFeatured,
    appliedBounds,
    initialNeighborhood
  ]);

  const handleMapBoundsChange = (bounds: { sw: [number, number]; ne: [number, number] }) => {
    setCurrentBounds(bounds);
    setHasMovedMap(true);
  };

  const applyMapBoundsSearch = () => {
    if (currentBounds) {
      setAppliedBounds(currentBounds);
      setHasMovedMap(false);
    }
  };

  const clearMapBoundsSearch = () => {
    setAppliedBounds(null);
    setHasMovedMap(false);
  };

  // Setup options
  const cityOptions = [
    { value: 'all', label: t('searchForm.allCities') },
    ...cities.map(c => ({ value: c.slug, label: t(`cities.${c.id}.name`, { defaultValue: c.name }) }))
  ];

  const typeOptions = [
    { value: 'All', label: t('propertiesPage.all') },
    { value: 'Apartment', label: t('propertiesPage.apartment') },
    { value: 'Villa', label: t('propertiesPage.villa') },
    { value: 'Penthouse', label: t('propertiesPage.penthouse') }
  ];

  const floorOptions = [
    { value: 'all', label: t('propertiesPage.all') },
    { value: '0', label: t('propertiesPage.floorLabel', { count: 0 }) },
    { value: '1', label: '1+' },
    { value: '3', label: '3+' }
  ];

  // Map settings
  const mapCenter: [number, number] = filteredProperties.length > 0
    ? [
        filteredProperties.reduce((sum, p) => sum + p.coordinates[0], 0) / filteredProperties.length,
        filteredProperties.reduce((sum, p) => sum + p.coordinates[1], 0) / filteredProperties.length
      ]
    : [52.2297, 21.0122]; // Warsaw center fallback

  const mapMarkers = filteredProperties.map(p => ({
    id: p.id,
    position: p.coordinates,
    title: p.title,
    priceText: `${formatPrice(p.price, p.currency)} | Match: ${calculatePropertyMatchScore(p)}%`,
    link: `/${locale}/property/${p.id}`
  }));

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-64px)] overflow-hidden relative animate-fade-in">
      {/* Top Filter Bar (Desktop) */}
      <div className="hidden lg:flex w-full items-center justify-between border-b border-border bg-card/60 px-6 py-3 backdrop-blur-md z-30 gap-4">
        <div className="flex items-center gap-3 flex-1 flex-wrap">
          <Select
            options={cityOptions}
            value={cityFilter}
            onChange={setCityFilter}
            className="w-36"
          />
          
          <Select
            options={typeOptions}
            value={typeFilter}
            onChange={setTypeFilter}
            className="w-36"
          />

          <Select
            options={floorOptions}
            value={floorFilter}
            onChange={setFloorFilter}
            className="w-40"
          />

          {/* Rooms */}
          <div className="flex items-center gap-1 border border-border rounded-lg px-2 bg-background/50 h-11">
            <span className="text-[10px] uppercase font-bold text-muted-foreground px-1">{t('propertiesPage.filterMinBeds')}:</span>
            {[0, 1, 2, 3, 4].map(num => (
              <button
                key={num}
                onClick={() => setBedroomsFilter(num)}
                className={`h-7 px-2.5 rounded-md text-xs font-semibold transition-all ${
                  bedroomsFilter === num
                    ? 'bg-accent text-white'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}
              >
                {num === 0 ? t('propertiesPage.all') : `${num}+`}
              </button>
            ))}
          </div>

          {/* Toggles */}
          <button
            onClick={() => setEvReadyFilter(!evReadyFilter)}
            className={`flex items-center gap-1.5 border rounded-lg px-3 h-11 text-xs font-semibold transition-all ${
              evReadyFilter
                ? 'border-accent bg-accent/10 text-accent'
                : 'border-border bg-background/50 text-muted-foreground hover:bg-secondary'
            }`}
          >
            <BatteryCharging className="h-4 w-4" />
            <span>{t('propertiesPage.evReadyLabel')}</span>
          </button>
          
          <button
            onClick={() => setParkingFilter(!parkingFilter)}
            className={`flex items-center gap-1.5 border rounded-lg px-3 h-11 text-xs font-semibold transition-all ${
              parkingFilter
                ? 'border-accent bg-accent/10 text-accent'
                : 'border-border bg-background/50 text-muted-foreground hover:bg-secondary'
            }`}
          >
            <span>{t('propertiesPage.garageLabel')}</span>
          </button>

          <button
            onClick={() => setOnlyFeatured(!onlyFeatured)}
            className={`flex items-center gap-1.5 border rounded-lg px-3 h-11 text-xs font-semibold transition-all ${
              onlyFeatured
                ? 'border-amber-500 bg-amber-500/10 text-amber-500'
                : 'border-border bg-background/50 text-muted-foreground hover:bg-secondary'
            }`}
          >
            <Star className="h-3.5 w-3.5" />
            <span>{t('founderStory.badge')}</span>
          </button>
        </div>

        {/* Price Slider */}
        <div className="flex items-center gap-4 w-72 pl-4">
          <div className="flex-1 space-y-1">
            <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase">
              <span>{t('searchForm.budgetLabel')} (EUR)</span>
              <span className="text-accent">{formatPrice(minPrice, 'EUR')} - {formatPrice(maxPrice, 'EUR')}</span>
            </div>
            <div className="pt-2">
              <DualSlider
                min={0}
                max={2500000}
                step={50000}
                minValue={minPrice}
                maxValue={maxPrice}
                onChange={(min: number, max: number) => {
                  setMinPrice(min);
                  setMaxPrice(max);
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Split Pane Panel */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Left Pane: Results grid */}
        <div className={`w-full lg:w-[60%] flex flex-col overflow-y-auto p-4 sm:p-6 space-y-6 ${
          mobileView === 'map' ? 'hidden lg:flex' : 'flex'
        }`}>
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-serif text-2xl font-bold">{t('propertiesPage.title')}</h1>
              <p className="text-xs text-muted-foreground mt-0.5">{t('propertiesPage.propertiesFound', { count: filteredProperties.length })}</p>
            </div>
            <button 
              onClick={() => setShowFiltersMobile(!showFiltersMobile)}
              className="lg:hidden flex items-center gap-1.5 border border-border bg-card rounded-lg px-3 py-1.5 text-xs font-semibold"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span>{t('common.filters')}</span>
            </button>
          </div>

          {/* Bounding box indicator banner in listings */}
          {appliedBounds && (
            <div className="flex items-center justify-between bg-accent/5 border border-accent/25 rounded-xl px-4 py-2 text-xs text-accent">
              <span>{t('propertiesPage.mapBoundsActive', { count: filteredProperties.length })}</span>
              <button onClick={clearMapBoundsSearch} className="font-bold underline hover:text-accent/80">
                {t('propertiesPage.clearAreaLimit')}
              </button>
            </div>
          )}

          {/* Mobile filters panel */}
          {showFiltersMobile && (
            <div className="lg:hidden border border-border bg-card rounded-xl p-4 space-y-4 shadow-md">
              <div className="grid grid-cols-2 gap-3">
                <Select options={cityOptions} value={cityFilter} onChange={setCityFilter} className="w-full" />
                <Select options={typeOptions} value={typeFilter} onChange={setTypeFilter} className="w-full" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Select options={floorOptions} value={floorFilter} onChange={setFloorFilter} className="w-full" />
                <button
                  onClick={() => setEvReadyFilter(!evReadyFilter)}
                  className={`flex items-center justify-center gap-1 border rounded-lg px-3 h-11 text-xs font-semibold ${
                    evReadyFilter ? 'border-accent bg-accent/10 text-accent' : 'border-border bg-background/50 text-muted-foreground'
                  }`}
                >
                  {t('propertiesPage.evReadyLabel')}
                </button>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase">
                  <span>{t('searchForm.budgetLabel')} (EUR)</span>
                  <span className="text-accent">{formatPrice(minPrice, 'EUR')} - {formatPrice(maxPrice, 'EUR')}</span>
                </div>
                <div className="pt-1.5 px-1">
                  <DualSlider
                    min={0}
                    max={2500000}
                    step={50000}
                    minValue={minPrice}
                    maxValue={maxPrice}
                    onChange={(min: number, max: number) => {
                      setMinPrice(min);
                      setMaxPrice(max);
                    }}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 border-t border-border pt-3">
                <button 
                  onClick={() => setShowFiltersMobile(false)}
                  className="bg-accent px-4 py-1.5 text-xs font-semibold text-white rounded-lg"
                >
                  {t('common.applyFilters')}
                </button>
              </div>
            </div>
          )}

          {/* Properties Grid */}
          {filteredProperties.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {filteredProperties.map((prop) => {
                const isFav = isFavorite('properties', prop.id);
                const isWatch = isInWatchlist(prop.id);
                const isCompared = comparedProperties.includes(prop.id);
                const score = calculatePropertyMatchScore(prop);
                
                // Color score pill
                let scoreColor = 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
                if (score < 50) {
                  scoreColor = 'bg-rose-500/10 text-rose-500 border-rose-500/20';
                } else if (score < 80) {
                  scoreColor = 'bg-amber-500/10 text-amber-500 border-amber-500/20';
                }

                return (
                  <div
                    key={prop.id}
                    className={`group rounded-2xl border overflow-hidden hover:shadow-lg transition-all flex flex-col h-full relative ${
                      prop.featured 
                        ? 'border-amber-500/50 bg-gradient-to-b from-amber-500/[0.02] to-card' 
                        : 'border-border bg-card'
                    }`}
                  >
                    {/* Image */}
                    <div className="h-48 w-full overflow-hidden relative">
                      <img
                        src={prop.image}
                        alt={prop.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-103"
                      />
                      
                      {/* Floating badging */}
                      <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
                        {prop.featured && (
                          <span className="flex items-center gap-1 text-[9px] font-black text-amber-950 bg-amber-500 border border-amber-400 px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                            <Star className="h-2.5 w-2.5 fill-amber-950" />
                            <span>{t('propertiesPage.featuredListingBadge')}</span>
                          </span>
                        )}
                        <span className={`text-[10px] font-mono font-bold border px-2 py-0.5 rounded-full backdrop-blur-md shadow-sm ${scoreColor}`}>
                          {t('propertiesPage.propertyMatchScore')}: {score}%
                        </span>
                      </div>

                      {/* Right top overlays */}
                      <div className="absolute top-3 right-3 flex flex-col gap-2">
                        <button
                          onClick={() => toggleFavorite('properties', prop.id)}
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-black/60 border border-white/10 text-white backdrop-blur-sm transition-colors hover:bg-black/85"
                          title={t('common.saveFavorite')}
                        >
                          <Heart className={`h-4 w-4 ${isFav ? 'fill-accent text-accent' : ''}`} />
                        </button>
                        <button
                          onClick={() => toggleWatchlist(prop.id)}
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-black/60 border border-white/10 text-white backdrop-blur-sm transition-colors hover:bg-black/85"
                          title={t('common.watchlist')}
                        >
                          <Eye className={`h-4 w-4 ${isWatch ? 'text-amber-500 fill-amber-500' : ''}`} />
                        </button>
                      </div>

                      <span className="absolute bottom-3 left-3 text-[10px] font-bold text-white bg-black/60 border border-white/10 px-2 py-0.5 rounded backdrop-blur-sm">
                        {t('propertiesPage.floorLabel', { count: prop.floor })}
                      </span>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between gap-1 text-[10px] font-bold text-accent uppercase tracking-wide">
                          <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {prop.neighborhood}, {prop.city.toUpperCase()}</span>
                          <span className="text-[9px] text-muted-foreground font-light">{prop.isAgency ? t('propertyDetails.realEstateAgency') : t('propertyDetails.privateSeller')}</span>
                        </div>
                        <h3 className="font-serif text-lg font-bold text-foreground leading-tight line-clamp-1">
                          {prop.title}
                        </h3>
                      </div>

                      {/* Property stats row */}
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <BedDouble className="h-3.5 w-3.5 text-accent" />
                          <span>{t('propertiesPage.bedLabel', { count: prop.bedrooms })}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Bath className="h-3.5 w-3.5 text-accent" />
                          <span>{t('propertiesPage.bathLabel', { count: prop.bathrooms })}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Maximize2 className="h-3.5 w-3.5 text-accent" />
                          <span>{t('propertiesPage.sizeLabel', { count: prop.size })}</span>
                        </div>
                      </div>

                      <div className="border-t border-border pt-4 flex items-center justify-between gap-2">
                        <span className="font-serif text-lg font-bold text-foreground">
                          {formatPrice(prop.price, prop.currency)}
                        </span>
                        
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => toggleCompareProperty(prop.id)}
                            className={`flex h-8 items-center gap-1 px-2.5 rounded-lg border text-[10px] font-bold transition-all ${
                              isCompared
                                ? 'border-accent bg-accent/10 text-accent'
                                : 'border-border bg-transparent text-muted-foreground hover:text-foreground hover:bg-secondary/45'
                            }`}
                          >
                            <GitCompare className="h-3 w-3" />
                            <span>{isCompared ? t('cityPortal.compared') : t('cityPortal.compare')}</span>
                          </button>

                          <Link
                            href={`/${locale}/property/${prop.id}`}
                            className="flex items-center gap-0.5 text-xs font-bold text-accent hover:underline"
                          >
                            <span>{t('neighborhoodPortal.openListing')}</span>
                            <span>&#8594;</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-border bg-secondary/10">
              <ShieldAlert className="h-10 w-10 text-accent mb-3 animate-pulse" />
              <h3 className="font-serif text-lg font-bold">{t('neighborhoodPortal.noListingsTitle')}</h3>
              <p className="text-muted-foreground text-xs font-light max-w-sm mt-1">
                {t('neighborhoodPortal.noListingsSub')}
              </p>
            </div>
          )}
        </div>

        {/* Right Pane: Interactive Map */}
        <div className={`w-full lg:w-[40%] border-l border-border h-full relative ${
          mobileView === 'grid' ? 'hidden lg:block' : 'block'
        }`}>
          {/* Floating Map Area Search Action Buttons */}
          {hasMovedMap && currentBounds && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
              <button
                onClick={applyMapBoundsSearch}
                className="flex items-center gap-1.5 rounded-full bg-accent px-5 py-2 text-xs font-bold text-white shadow-xl hover:bg-accent/80 hover:scale-103 active:scale-97 transition-all border border-accent/20"
              >
                <RefreshCw className="h-3.5 w-3.5 animate-spin-slow" />
                <span>{t('propertiesPage.searchInThisArea')}</span>
              </button>
            </div>
          )}

          {appliedBounds && (
            <div className="absolute bottom-4 left-4 z-20">
              <button
                onClick={clearMapBoundsSearch}
                className="rounded-full bg-black/85 backdrop-blur-md px-4 py-2 text-[10px] font-bold text-white shadow-lg border border-white/10 hover:bg-black transition-colors"
              >
                {t('propertiesPage.resetAreaFilter')}
              </button>
            </div>
          )}

          <Map
            center={mapCenter}
            zoom={12}
            markers={mapMarkers}
            onBoundsChange={handleMapBoundsChange}
          />
        </div>
      </div>

      {/* Floating Toggle view button (Mobile only) */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 lg:hidden z-30">
        <button
          onClick={() => setMobileView(mobileView === 'grid' ? 'map' : 'grid')}
          className="flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-semibold text-white shadow-xl hover:scale-105 active:scale-95 transition-all text-xs"
        >
          {mobileView === 'grid' ? (
            <>
              <MapIcon className="h-4 w-4" />
              <span>{t('propertiesPage.showMapView')}</span>
            </>
          ) : (
            <>
              <List className="h-4 w-4" />
              <span>{t('propertiesPage.showListings')}</span>
            </>
          )}
        </button>
      </div>

      {/* Floating Side-by-side Compare Properties Drawer (max 5) */}
      {comparedProperties.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 lg:left-[auto] lg:right-6 lg:bottom-6 bg-card border border-border border-b-0 lg:border-b rounded-t-2xl lg:rounded-2xl shadow-2xl z-40 p-4 w-full lg:w-96 space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1.5">
              <GitCompare className="h-4 w-4 text-accent animate-pulse-slow" />
              <span className="text-xs font-bold text-foreground">{t('comparePage.title')}</span>
            </div>
            <span className="font-mono text-[10px] font-bold text-accent bg-accent/10 px-2 py-0.5 rounded">
              {comparedProperties.length} / 5
            </span>
          </div>
          
          <div className="text-[10px] text-muted-foreground font-light">
            {t('propertiesPage.compareMaxLabel', { count: comparedProperties.length })}
          </div>
          
          <div className="flex gap-2">
            <Link
              href={`/${locale}/compare`}
              className="flex-1 flex h-9 items-center justify-center rounded-lg bg-accent text-[11px] font-bold text-white hover:bg-accent/80 transition-colors text-center"
            >
              {t('propertiesPage.compareButton')}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
