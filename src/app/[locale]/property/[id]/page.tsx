'use client';

import React, { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { db } from '../../../../lib/db';
import { useApp } from '../../../../context/AppContext';
import { useI18n } from '../../../../lib/i18n/I18nContext';
import { Property, exchangeRates, currencySymbols, Neighborhood } from '../../../../data/mockDb';
import TurnstileWidget from '../../../../components/TurnstileWidget';
import GalleryModal from '../../../../components/GalleryModal';
import ShareWidget from '../../../../components/ShareWidget';
import Map from '../../../../components/Map';
import Slider from '../../../../components/ui/Slider';
import { 
  ArrowLeft, BedDouble, Bath, Maximize2, ShieldCheck, Heart, Sparkles, 
  BatteryCharging, Train, Volume2, ShieldAlert, CheckCircle2, MapPin, 
  Calendar, Clock, Landmark, Building, ExternalLink, Eye, ChevronRight,
  TrendingDown, Globe, Car, Info, InfoIcon, GitCompare
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PremiumLockOverlay } from '../../../../components/relationship/PremiumLockOverlay';

interface PageProps {
  params: Promise<{ locale: string; id: string }>;
}

export default function PropertyDetailsPage({ params }: PageProps) {
  const { locale, t } = useI18n();
  const { id } = use(params);
  
  const { 
    formatPrice, 
    toggleFavorite, 
    isFavorite, 
    watchlist,
    toggleWatchlist,
    isInWatchlist,
    propertyWeights,
    updatePropertyWeight,
    calculatePropertyMatchScore,
    toggleCompareProperty,
    comparedProperties,
    budgetLimit,
    userProfile
  } = useApp();

  if (userProfile.subscription !== 'Premium') {
    return <PremiumLockOverlay featureKey="relocation" />;
  }

  const [property, setProperty] = useState<Property | null>(null);
  const [neighborhood, setNeighborhood] = useState<Neighborhood | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Gallery states
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [galleryStartIndex, setGalleryStartIndex] = useState(0);

  // Nearby Map Services Filters
  const [showMetro, setShowMetro] = useState(true);
  const [showTram, setShowTram] = useState(true);
  const [showBus, setShowBus] = useState(true);
  const [showGrocery, setShowGrocery] = useState(true);
  const [showHealthcare, setShowHealthcare] = useState(true);
  const [showPharmacy, setShowPharmacy] = useState(true);
  const [showMalls, setShowMalls] = useState(true);
  const [showParks, setShowParks] = useState(true);
  const [showEvMarkers, setShowEvMarkers] = useState(true);

  // Mortgage calculator state
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(20);
  const [loanTermYears, setLoanTermYears] = useState<number>(25);
  const [interestRate, setInterestRate] = useState<number>(4.2);

  // Contact form state
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    if (t) {
      setFormMessage(t('propertyDetails.defaultInquiryMessage'));
    }
  }, [t]);

  useEffect(() => {
    const loadPropertyData = async () => {
      setLoading(true);
      const p = await db.getProperty(id);
      if (p) {
        setProperty(p);
        const city = await db.getCity(p.city);
        if (city) {
          const n = city.neighborhoods.find(nh => nh.name.toLowerCase() === p.neighborhood.toLowerCase());
          if (n) setNeighborhood(n);
        }
      }
      setLoading(false);
    };
    loadPropertyData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-[70vh] w-full items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" />
          <span className="text-sm text-muted-foreground">{t('loading.property')}</span>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <h1 className="font-serif text-3xl font-bold">{t('errors.notFound')}</h1>
        <p className="text-muted-foreground mt-2">{t('errors.notFoundSub')}</p>
        <Link href={`/${locale}/properties`} className="mt-6 inline-block text-accent font-semibold hover:underline">
          {t('errors.returnHome')}
        </Link>
      </div>
    );
  }

  const isFav = isFavorite('properties', property.id);
  const isWatch = isInWatchlist(property.id);
  const isCompared = comparedProperties.includes(property.id);

  // Mortgage calculations
  const totalAmount = property.price;
  const downPaymentAmount = (totalAmount * downPaymentPercent) / 100;
  const loanPrincipal = totalAmount - downPaymentAmount;
  const monthlyRate = (interestRate / 100) / 12;
  const totalMonths = loanTermYears * 12;
  const monthlyMortgagePayment = monthlyRate > 0 
    ? (loanPrincipal * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths))) / (Math.pow(1 + monthlyRate, totalMonths) - 1)
    : loanPrincipal / totalMonths;

  // Running utilities estimation
  const estUtilitiesNok = Math.round((property.size * 18) + 1200);
  const estUtilitiesLocal = property.currency === 'EUR' 
    ? estUtilitiesNok / 11.5 
    : estUtilitiesNok / 2.7;

  // Dynamic nearby services markers generation based on property coordinates
  const [lat, lng] = property.coordinates;
  
  const serviceMarkers: any[] = [
    // The property itself
    {
      id: 'property-main',
      position: [lat, lng],
      title: property.title,
      priceText: formatPrice(property.price, property.currency),
      type: 'property'
    }
  ];

  if (showMetro) {
    serviceMarkers.push({
      id: 'metro-1', position: [lat + 0.0015, lng - 0.0012],
      title: `${property.neighborhood} Metro Link`, type: 'metro'
    });
  }
  if (showTram) {
    serviceMarkers.push({
      id: 'tram-1', position: [lat - 0.0022, lng + 0.002],
      title: `${property.neighborhood} Tram Line 4`, type: 'tram'
    });
  }
  if (showBus) {
    serviceMarkers.push({
      id: 'bus-1', position: [lat + 0.0008, lng + 0.0015],
      title: 'Avenue Bus Stop', type: 'bus'
    }, {
      id: 'bus-2', position: [lat - 0.001, lng - 0.002],
      title: 'Plaza Bus Stop', type: 'bus'
    });
  }
  if (showGrocery) {
    serviceMarkers.push({
      id: 'grocery-1', position: [lat - 0.0012, lng - 0.0018],
      title: 'Mercado / Supermarket', type: 'grocery'
    });
  }
  if (showHealthcare) {
    serviceMarkers.push({
      id: 'healthcare-1', position: [lat + 0.0035, lng + 0.0025],
      title: 'Regional Clinic & Medical Center', type: 'healthcare'
    });
  }
  if (showPharmacy) {
    serviceMarkers.push({
      id: 'pharmacy-1', position: [lat - 0.0008, lng + 0.0009],
      title: '24/7 Local Pharmacy', type: 'pharmacy'
    });
  }
  if (showMalls) {
    serviceMarkers.push({
      id: 'mall-1', position: [lat + 0.0048, lng - 0.0035],
      title: 'District Shopping Arcade', type: 'mall'
    });
  }
  if (showParks) {
    serviceMarkers.push({
      id: 'park-1', position: [lat - 0.0025, lng - 0.0015],
      title: 'Central Green Park & Plaza', type: 'park'
    });
  }
  if (showEvMarkers) {
    property.evChargingStations.forEach((station: any, index: number) => {
      // Offset slightly for display
      const offsetLat = lat + (index === 0 ? 0.0015 : -0.002);
      const offsetLng = lng + (index === 0 ? -0.0018 : 0.0022);
      serviceMarkers.push({
        id: `ev-${index}`,
        position: [offsetLat, offsetLng],
        title: `${station.name} (${station.powerKw}kW)`,
        priceText: `${station.operator} | ${station.connector}`,
        type: 'ev'
      });
    });
  }

  // Convert property price to international currencies simultaneously
  const convertPrice = (targetCurrency: string): string => {
    const amountInEur = property.price / exchangeRates[property.currency];
    const converted = amountInEur * exchangeRates[targetCurrency];
    const symbol = currencySymbols[targetCurrency] || targetCurrency;
    
    // Formatting standard
    const rounded = Math.round(converted);
    if (['NOK', 'SEK'].includes(targetCurrency)) {
      return rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' ' + symbol;
    }
    return symbol + rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const handleVerify = (token: string) => {
    if (token) setIsVerified(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isVerified) return;
    setFormSubmitted(true);
  };

  const openPhotoGallery = (index: number) => {
    setGalleryStartIndex(index);
    setIsGalleryOpen(true);
  };

  const lCityName = t(`cities.${property.city}.name`, { defaultValue: property.city });
  const cityName = lCityName === `cities.${property.city}.name` ? property.city : lCityName;

  return (
    <div className="w-full pb-20 animate-fade-in bg-background">
      {/* Top action row */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Link 
          href={`/${locale}/properties`} 
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{t('propertyDetails.backToProperties')}</span>
        </Link>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => toggleCompareProperty(property.id)}
            className={`flex-1 sm:flex-initial flex h-10 items-center justify-center gap-2 rounded-xl border px-4 text-xs font-semibold transition-colors ${
              isCompared
                ? 'border-accent bg-accent/10 text-accent'
                : 'border-border bg-card hover:bg-secondary'
            }`}
          >
            <GitCompare className="h-4 w-4" />
            <span>{isCompared ? t('propertyDetails.comparingListing') : t('propertyDetails.compareLabel')}</span>
          </button>
          
          <button
            onClick={() => toggleWatchlist(property.id)}
            className={`flex-1 sm:flex-initial flex h-10 items-center justify-center gap-2 rounded-xl border px-4 text-xs font-semibold transition-colors ${
              isWatch
                ? 'border-amber-500 bg-amber-500/10 text-amber-500'
                : 'border-border bg-card hover:bg-secondary'
            }`}
          >
            <Eye className="h-4 w-4" />
            <span>{isWatch ? t('propertyDetails.savedLabel') : t('propertyDetails.saveLabel')}</span>
          </button>
          
          <ShareWidget title={property.title} />
        </div>
      </section>

      {/* Photo Grid Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[480px] rounded-2xl overflow-hidden border border-border bg-black/10">
          {/* Main big image */}
          <div 
            onClick={() => openPhotoGallery(0)}
            className="md:col-span-2 h-full overflow-hidden relative cursor-pointer group"
          >
            <img 
              src={property.image} 
              alt={property.title} 
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-102"
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
          </div>
          
          {/* Side columns */}
          <div className="hidden md:flex flex-col gap-4 h-full">
            {property.images.slice(1, 3).map((img, idx) => (
              <div 
                key={idx} 
                onClick={() => openPhotoGallery(idx + 1)}
                className="h-1/2 overflow-hidden relative cursor-pointer group"
              >
                <img 
                  src={img} 
                  alt={`${property.title} ${idx + 2}`} 
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-102"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
              </div>
            ))}
          </div>

          <div className="hidden md:flex flex-col gap-4 h-full relative">
            {property.images.slice(3, 5).map((img, idx) => (
              <div 
                key={idx} 
                onClick={() => openPhotoGallery(idx + 3)}
                className="h-1/2 overflow-hidden relative cursor-pointer group"
              >
                <img 
                  src={img} 
                  alt={`${property.title} ${idx + 4}`} 
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-102"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
              </div>
            ))}
            
            {/* "View all photos" button overlay */}
            <button
              onClick={() => openPhotoGallery(0)}
              className="absolute bottom-4 right-4 bg-black/75 hover:bg-black border border-white/20 text-white font-semibold text-xs rounded-xl px-4 py-2.5 shadow-lg backdrop-blur-md transition-all hover:scale-102"
            >
              {t('propertyDetails.unlimitedPhotos', { count: property.images.length })}
            </button>
          </div>
        </div>
      </section>

      {/* Main details grid */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-10 grid grid-cols-1 gap-12 lg:grid-cols-3">
        
        {/* Left 2 columns: overview and details */}
        <div className="lg:col-span-2 space-y-12">
          
          {/* Headline Specs & Address */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-border pb-6">
              <div className="space-y-1.5">
                <span className="text-xs font-semibold uppercase tracking-widest text-accent flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {property.neighborhood}, {cityName.toUpperCase()}
                </span>
                <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground tracking-tight leading-tight">
                  {property.title}
                </h1>
                {property.exactAddress && (
                  <p className="text-xs text-muted-foreground font-light pt-0.5">
                    {t('propertyDetails.exactAddress')}: <span className="font-semibold text-foreground">{property.exactAddress}</span>
                  </p>
                )}
              </div>
              
              <div className="flex flex-col items-start sm:items-end">
                <span className="font-serif text-3xl font-black text-foreground">
                  {formatPrice(property.price, property.currency)}
                </span>
                <span className="text-[10px] text-muted-foreground font-mono">
                  {property.currency !== 'EUR' ? `Original: ${property.price.toLocaleString()} ${property.currency}` : ''}
                </span>
              </div>
            </div>

            {/* Spec Icons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2.5 bg-secondary/20 border border-border/40 rounded-xl p-3">
                <BedDouble className="h-4.5 w-4.5 text-accent" />
                <div className="flex flex-col">
                  <span className="text-[9px] uppercase font-bold text-muted-foreground leading-none mb-0.5">{t('propertiesPage.filterMinBeds')}</span>
                  <span className="text-xs font-bold text-foreground leading-none">{t('propertiesPage.bedLabel', { count: property.bedrooms })}</span>
                </div>
              </div>
              <div className="flex items-center gap-2.5 bg-secondary/20 border border-border/40 rounded-xl p-3">
                <Bath className="h-4.5 w-4.5 text-accent" />
                <div className="flex flex-col">
                  <span className="text-[9px] uppercase font-bold text-muted-foreground leading-none mb-0.5">{t('comparePage.features.bedBath').split('/')[1].trim()}</span>
                  <span className="text-xs font-bold text-foreground leading-none">{t('propertiesPage.bathLabel', { count: property.bathrooms })}</span>
                </div>
              </div>
              <div className="flex items-center gap-2.5 bg-secondary/20 border border-border/40 rounded-xl p-3">
                <Maximize2 className="h-4.5 w-4.5 text-accent" />
                <div className="flex flex-col">
                  <span className="text-[9px] uppercase font-bold text-muted-foreground leading-none mb-0.5">{t('comparePage.features.size')}</span>
                  <span className="text-xs font-bold text-foreground leading-none">{t('propertiesPage.sizeLabel', { count: property.size })}</span>
                </div>
              </div>
              <div className="flex items-center gap-2.5 bg-secondary/20 border border-border/40 rounded-xl p-3">
                <Sparkles className="h-4.5 w-4.5 text-accent" />
                <div className="flex flex-col">
                  <span className="text-[9px] uppercase font-bold text-muted-foreground leading-none mb-0.5">{t('propertiesPage.filterEpc')}</span>
                  <span className="text-xs font-bold text-foreground leading-none">{t('neighborhoodPortal.epcLabel')} {property.epcRating}</span>
                </div>
              </div>
            </div>
          </div>

          {/* International Buyer Mode pricing matrix */}
          <section className="bg-card border border-border rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-1.5 border-b border-border pb-3">
              <Globe className="h-4 w-4 text-accent" />
              <h3 className="font-serif text-lg font-bold">{t('propertyDetails.pricingGrid')}</h3>
            </div>
            <p className="text-xs text-muted-foreground font-light mb-4">
              {t('propertyDetails.pricingGridSub')}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-center">
              <div className="border border-border/60 rounded-xl p-3 bg-secondary/10">
                <span className="block text-[8px] uppercase tracking-wider text-muted-foreground font-bold mb-1">{t('propertyDetails.localPrice')}</span>
                <span className="font-mono text-sm font-bold text-foreground">{property.price.toLocaleString()} {property.currency}</span>
              </div>
              <div className="border border-border/60 rounded-xl p-3 bg-secondary/10">
                <span className="block text-[8px] uppercase tracking-wider text-muted-foreground font-bold mb-1">{t('propertyDetails.euro')}</span>
                <span className="font-mono text-sm font-bold text-accent">{convertPrice('EUR')}</span>
              </div>
              <div className="border border-border/60 rounded-xl p-3 bg-secondary/10">
                <span className="block text-[8px] uppercase tracking-wider text-muted-foreground font-bold mb-1">{t('propertyDetails.usd')}</span>
                <span className="font-mono text-sm font-bold text-foreground">{convertPrice('USD')}</span>
              </div>
              <div className="border border-border/60 rounded-xl p-3 bg-secondary/10">
                <span className="block text-[8px] uppercase tracking-wider text-muted-foreground font-bold mb-1">{t('propertyDetails.gbp')}</span>
                <span className="font-mono text-sm font-bold text-foreground">{convertPrice('GBP')}</span>
              </div>
              <div className="border border-border/60 rounded-xl p-3 bg-secondary/10 col-span-2 sm:col-span-1">
                <span className="block text-[8px] uppercase tracking-wider text-muted-foreground font-bold mb-1">{t('propertyDetails.nok')}</span>
                <span className="font-mono text-sm font-bold text-foreground">{convertPrice('NOK')}</span>
              </div>
            </div>
          </section>

          {/* Description */}
          <div className="space-y-4">
            <h3 className="font-serif text-xl font-bold">{t('propertyDetails.aboutListing')}</h3>
            <p className="text-muted-foreground text-sm font-light leading-relaxed">
              {property.description}
            </p>
          </div>

          {/* Real-time Match Scores Adjuster Panel */}
          <section className="bg-card border border-border rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-border pb-4 gap-4">
              <div>
                <h3 className="font-serif text-xl font-bold">{t('propertiesPage.propertyMatchScore')}</h3>
                <p className="text-xs text-muted-foreground font-light">{t('propertyDetails.weightsSub')}</p>
              </div>
              <div className="flex items-center gap-3 bg-accent/5 border border-accent/20 rounded-xl px-4 py-2">
                <span className="text-[10px] font-bold uppercase text-muted-foreground leading-none">{t('propertyDetails.yourMatch')}</span>
                <span className="font-mono text-3xl font-black text-accent leading-none">{calculatePropertyMatchScore(property)}%</span>
              </div>
            </div>

            {/* Weights sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-muted-foreground">{t('propertyDetails.priceWeight')}</span>
                  <span className="font-semibold text-accent">{propertyWeights.price}/10</span>
                </div>
                <Slider min={0} max={10} step={1} value={propertyWeights.price} onChange={(val) => updatePropertyWeight('price', val)} />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-muted-foreground">{t('propertyDetails.garageWeight')}</span>
                  <span className="font-semibold text-accent">{propertyWeights.garage}/10</span>
                </div>
                <Slider min={0} max={10} step={1} value={propertyWeights.garage} onChange={(val) => updatePropertyWeight('garage', val)} />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-muted-foreground">{t('propertyDetails.evWeight')}</span>
                  <span className="font-semibold text-accent">{propertyWeights.ev}/10</span>
                </div>
                <Slider min={0} max={10} step={1} value={propertyWeights.ev} onChange={(val) => updatePropertyWeight('ev', val)} />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-muted-foreground">{t('propertyDetails.elevatorWeight')}</span>
                  <span className="font-semibold text-accent">{propertyWeights.elevator}/10</span>
                </div>
                <Slider min={0} max={10} step={1} value={propertyWeights.elevator} onChange={(val) => updatePropertyWeight('elevator', val)} />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-muted-foreground">{t('propertyDetails.transitWeight')}</span>
                  <span className="font-semibold text-accent">{propertyWeights.transit}/10</span>
                </div>
                <Slider min={0} max={10} step={1} value={propertyWeights.transit} onChange={(val) => updatePropertyWeight('transit', val)} />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-muted-foreground">{t('propertyDetails.floorWeight')}</span>
                  <span className="font-semibold text-accent">{propertyWeights.floor}/10</span>
                </div>
                <Slider min={0} max={10} step={1} value={propertyWeights.floor} onChange={(val) => updatePropertyWeight('floor', val)} />
              </div>
            </div>
            
            {budgetLimit < (property.currency === 'PLN' ? property.price * 0.23 : property.price) && (
              <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/25 rounded-xl p-3 text-xs text-amber-600">
                <InfoIcon className="h-4 w-4 flex-shrink-0" />
                <span>{t('propertyDetails.budgetNote', { budget: formatPrice(budgetLimit, 'EUR') })}</span>
              </div>
            )}
          </section>

          {/* Interactive Map with nearby services toggles */}
          <section className="space-y-6">
            <div className="border-b border-border pb-4">
              <h3 className="font-serif text-2xl font-bold">{t('propertyDetails.interactiveMap')}</h3>
              <p className="text-muted-foreground text-xs font-light mt-0.5">{t('propertyDetails.mapSub')}</p>
            </div>

            {/* Map filters dashboard */}
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 bg-secondary/20 border border-border/40 rounded-2xl p-4 text-xs font-semibold">
              <button 
                onClick={() => setShowMetro(!showMetro)}
                className={`py-2 rounded-lg border text-center transition-all ${showMetro ? 'bg-blue-600/10 border-blue-500 text-blue-600' : 'bg-transparent border-border/60 text-muted-foreground'}`}
              >
                🚇 {t('propertyDetails.metro')}
              </button>
              <button 
                onClick={() => setShowTram(!showTram)}
                className={`py-2 rounded-lg border text-center transition-all ${showTram ? 'bg-cyan-600/10 border-cyan-500 text-cyan-600' : 'bg-transparent border-border/60 text-muted-foreground'}`}
              >
                🚋 {t('propertyDetails.tram')}
              </button>
              <button 
                onClick={() => setShowBus(!showBus)}
                className={`py-2 rounded-lg border text-center transition-all ${showBus ? 'bg-indigo-600/10 border-indigo-500 text-indigo-600' : 'bg-transparent border-border/60 text-muted-foreground'}`}
              >
                🚌 {t('propertyDetails.bus')}
              </button>
              <button 
                onClick={() => setShowGrocery(!showGrocery)}
                className={`py-2 rounded-lg border text-center transition-all ${showGrocery ? 'bg-amber-600/10 border-amber-500 text-amber-600' : 'bg-transparent border-border/60 text-muted-foreground'}`}
              >
                🛒 {t('propertyDetails.groceries')}
              </button>
              <button 
                onClick={() => setShowHealthcare(!showHealthcare)}
                className={`py-2 rounded-lg border text-center transition-all ${showHealthcare ? 'bg-rose-600/10 border-rose-500 text-rose-600' : 'bg-transparent border-border/60 text-muted-foreground'}`}
              >
                🏥 {t('propertyDetails.healthcare')}
              </button>
              <button 
                onClick={() => setShowPharmacy(!showPharmacy)}
                className={`py-2 rounded-lg border text-center transition-all ${showPharmacy ? 'bg-teal-600/10 border-teal-500 text-teal-600' : 'bg-transparent border-border/60 text-muted-foreground'}`}
              >
                💊 {t('propertyDetails.pharmacy')}
              </button>
              <button 
                onClick={() => setShowMalls(!showMalls)}
                className={`py-2 rounded-lg border text-center transition-all ${showMalls ? 'bg-purple-600/10 border-purple-500 text-purple-600' : 'bg-transparent border-border/60 text-muted-foreground'}`}
              >
                🛍️ {t('propertyDetails.malls')}
              </button>
              <button 
                onClick={() => setShowParks(!showParks)}
                className={`py-2 rounded-lg border text-center transition-all ${showParks ? 'bg-emerald-600/10 border-emerald-500 text-emerald-600' : 'bg-transparent border-border/60 text-muted-foreground'}`}
              >
                🌳 {t('propertyDetails.parks')}
              </button>
              <button 
                onClick={() => setShowEvMarkers(!showEvMarkers)}
                className={`py-2 rounded-lg border text-center transition-all ${showEvMarkers ? 'bg-green-600/10 border-green-500 text-green-600' : 'bg-transparent border-border/60 text-muted-foreground'}`}
              >
                ⚡ {t('propertyDetails.evHubs')}
              </button>
            </div>

            {/* Map Container */}
            <div className="h-[400px] w-full rounded-2xl overflow-hidden border border-border">
              <Map
                center={property.coordinates}
                zoom={14}
                markers={serviceMarkers}
              />
            </div>
          </section>

          {/* Commute Analyzer Dashboard */}
          <section className="bg-secondary/20 border border-border rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="border-b border-border pb-4">
              <h3 className="font-serif text-xl font-bold">{t('propertyDetails.commuteLabel')}</h3>
              <p className="text-muted-foreground text-xs font-light">{t('propertyDetails.commuteSub')}</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              <div className="space-y-3">
                <span className="text-[10px] uppercase font-bold text-accent tracking-wider block">{t('propertyDetails.centerLabel')}</span>
                <div className="space-y-1.5 text-xs text-muted-foreground font-medium">
                  <div className="flex justify-between">
                    <span>🚗 {t('propertyDetails.carLabel')}</span>
                    <span className="text-foreground">{property.commuteTimes.center.car} min</span>
                  </div>
                  <div className="flex justify-between">
                    <span>🚇 {t('propertyDetails.transitLabel')}</span>
                    <span className="text-foreground">{property.commuteTimes.center.transit} min</span>
                  </div>
                  <div className="flex justify-between">
                    <span>🚶 {t('propertyDetails.walkLabel')}</span>
                    <span className="text-foreground">{property.commuteTimes.center.walk} min</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <span className="text-[10px] uppercase font-bold text-accent tracking-wider block">{t('propertyDetails.airportLabel')}</span>
                <div className="space-y-1.5 text-xs text-muted-foreground font-medium">
                  <div className="flex justify-between">
                    <span>🚗 {t('propertyDetails.carLabel')}</span>
                    <span className="text-foreground">{property.commuteTimes.airport.car} min</span>
                  </div>
                  <div className="flex justify-between">
                    <span>🚇 {t('propertyDetails.transitLabel')}</span>
                    <span className="text-foreground">{property.commuteTimes.airport.transit} min</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <span className="text-[10px] uppercase font-bold text-accent tracking-wider block">{t('propertyDetails.hospitalLabel')}</span>
                <div className="space-y-1.5 text-xs text-muted-foreground font-medium">
                  <div className="flex justify-between">
                    <span>🚗 {t('propertyDetails.carLabel')}</span>
                    <span className="text-foreground">{property.commuteTimes.hospital.car} min</span>
                  </div>
                  <div className="flex justify-between">
                    <span>🚶 {t('propertyDetails.walkLabel')}</span>
                    <span className="text-foreground">{property.commuteTimes.hospital.walk} min</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <span className="text-[10px] uppercase font-bold text-accent tracking-wider block">{t('propertyDetails.mallLabel')}</span>
                <div className="space-y-1.5 text-xs text-muted-foreground font-medium">
                  <div className="flex justify-between">
                    <span>🚗 {t('propertyDetails.carLabel')}</span>
                    <span className="text-foreground">{property.commuteTimes.mall.car} min</span>
                  </div>
                  <div className="flex justify-between">
                    <span>🚇 {t('propertyDetails.transitLabel')}</span>
                    <span className="text-foreground">{property.commuteTimes.mall.transit} min</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* EV Charger overlay */}
          <section className="bg-card border border-border rounded-2xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-1.5 border-b border-border pb-3">
              <BatteryCharging className="h-4.5 w-4.5 text-accent" />
              <h3 className="font-serif text-lg font-bold">{t('propertyDetails.evChargingHeading')}</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {property.evChargingStations.map((station: any, idx: number) => (
                <div key={idx} className="border border-border/60 bg-secondary/10 rounded-xl p-4 space-y-2 text-xs">
                  <div className="flex justify-between font-bold">
                    <span className="text-foreground">{station.name}</span>
                    <span className="text-accent">{station.powerKw} kW</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>{t('propertyDetails.chargingOperator')}: {station.operator}</span>
                    <span>{t('propertyDetails.chargingDistance')}: {station.distanceM}m</span>
                  </div>
                  <div className="text-[10px] font-mono text-stone-400">
                    {t('propertyDetails.chargingConnector')}: {station.connector}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Timeline and History */}
          <section className="bg-card border border-border rounded-2xl p-6 sm:p-8 space-y-6">
            <h3 className="font-serif text-xl font-bold border-b border-border pb-3">{t('propertyDetails.timelineHeading')}</h3>
            
            <div className="relative border-l-2 border-border/80 pl-6 ml-2 space-y-6 text-xs">
              {/* Listed event */}
              <div className="relative">
                <span className="absolute -left-[31px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[9px] font-bold text-white">L</span>
                <div className="space-y-1">
                  <span className="font-mono text-muted-foreground">{property.listedDate}</span>
                  <div className="font-semibold text-foreground">{t('propertyDetails.eventListed')}</div>
                  <div className="text-muted-foreground font-light">{t('propertyDetails.eventListedDesc', { provider: property.provider })}</div>
                </div>
              </div>

              {/* Price drops if any */}
              {property.priceHistory.filter((h: any) => h.event !== 'Listed').map((hist: any, idx: number) => (
                <div key={idx} className="relative">
                  <span className="absolute -left-[31px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[9px] font-bold text-white">↓</span>
                  <div className="space-y-1">
                    <span className="font-mono text-muted-foreground">{hist.date}</span>
                    <div className="font-semibold text-foreground flex items-center gap-1">
                      <TrendingDown className="h-3.5 w-3.5 text-emerald-500" />
                      <span>{hist.event}</span>
                    </div>
                    <div className="text-muted-foreground font-light">
                      {t('propertyDetails.eventPriceDropDesc', {
                        oldPrice: formatPrice(property.priceHistory[idx].price, property.currency),
                        newPrice: formatPrice(hist.price, property.currency)
                      })}
                    </div>
                  </div>
                </div>
              ))}

              {/* Days on market */}
              <div className="relative">
                <span className="absolute -left-[31px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-secondary text-[9px] font-bold text-muted-foreground">T</span>
                <div className="space-y-1">
                  <span className="font-mono text-muted-foreground">{t('propertyDetails.eventToday')}</span>
                  <div className="font-semibold text-foreground">{t('propertyDetails.eventActiveStatus')}</div>
                  <div className="text-muted-foreground font-light">
                    {t('propertyDetails.eventActiveStatusDesc', {
                      days: property.daysOnMarket,
                      val: `${property.estMarketValuePerSqm.toLocaleString()} ${property.currency}`
                    })}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Mortgage Simulator */}
          <section className="bg-card border border-border rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="border-b border-border pb-4">
              <h3 className="font-serif text-2xl font-bold">{t('propertyDetails.costSimulator')}</h3>
              <p className="text-muted-foreground text-xs font-light mt-0.5">{t('propertyDetails.costSimulatorSub')}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Sliders */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-muted-foreground">{t('propertyDetails.downPayment')}</span>
                    <span className="font-semibold text-accent">{downPaymentPercent}% ({formatPrice(downPaymentAmount, property.currency)})</span>
                  </div>
                  <div className="pt-2">
                    <input 
                      type="range" min={10} max={60} step={5} value={downPaymentPercent} 
                      onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                      className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-border accent-accent outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-muted-foreground">{t('propertyDetails.loanTerm')}</span>
                    <span className="font-semibold text-accent">{loanTermYears} {t('propertyDetails.years')}</span>
                  </div>
                  <div className="pt-2">
                    <input 
                      type="range" min={15} max={30} step={5} value={loanTermYears} 
                      onChange={(e) => setLoanTermYears(Number(e.target.value))}
                      className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-border accent-accent outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Total calculations */}
              <div className="bg-secondary/30 rounded-xl p-5 space-y-4 text-sm">
                <div className="flex justify-between border-b border-border/60 pb-2">
                  <span className="text-muted-foreground">{t('propertyDetails.estMonthlyMortgage')} ({interestRate}%)</span>
                  <span className="font-semibold">{formatPrice(monthlyMortgagePayment, property.currency)}</span>
                </div>
                <div className="flex justify-between border-b border-border/60 pb-2">
                  <span className="text-muted-foreground">{t('propertyDetails.estMonthlyUtilities')}</span>
                  <span className="font-semibold">{formatPrice(estUtilitiesLocal, property.currency)}</span>
                </div>
                <div className="flex justify-between border-b border-border/60 pb-2">
                  <span className="text-muted-foreground">{t('propertyDetails.propertyTax')}</span>
                  <span className="font-semibold">{formatPrice(property.price * 0.001 / 12, property.currency)}</span>
                </div>
                
                <div className="flex justify-between pt-2 text-base font-bold text-foreground">
                  <span>{t('propertyDetails.estTotalPerMonth')}</span>
                  <span className="text-accent">
                    {formatPrice(monthlyMortgagePayment + estUtilitiesLocal + (property.price * 0.001 / 12), property.currency)}
                  </span>
                </div>
              </div>
            </div>
          </section>

        </div>

        {/* Right 1 Column: Agency vs Private Seller Info and Contact Consultant Form */}
        <div className="space-y-6">
          {/* Seller / Agency Panel */}
          <div className="bg-card border border-border rounded-2xl p-6 space-y-5 shadow-sm">
            <span className="text-[10px] uppercase font-extrabold tracking-widest text-muted-foreground block">{t('propertyDetails.listingSource')}</span>
            
            {property.isAgency ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <img 
                    src={property.agencyLogo || 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=120&q=80'} 
                    alt={property.agencyName} 
                    className="h-12 w-12 rounded-lg object-cover border border-border"
                  />
                  <div className="space-y-0.5">
                    <span className="text-[10px] uppercase font-bold text-accent">{t('propertyDetails.licensedAgency')}</span>
                    <h4 className="font-serif text-sm font-bold text-foreground leading-none">{property.agencyName}</h4>
                  </div>
                </div>

                <div className="border-t border-border pt-3 space-y-2.5 text-xs text-muted-foreground">
                  <div className="flex justify-between">
                    <span>{t('propertyDetails.contactDetails')}:</span>
                    <span className="font-semibold text-foreground">{property.agencyContact}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>{t('propertyDetails.website')}:</span>
                    <a 
                      href={property.agencyWebsite} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="font-semibold text-accent hover:underline flex items-center gap-1"
                    >
                      <span>{t('propertyDetails.visitSite')}</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center font-bold text-foreground">
                    PS
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] uppercase font-bold text-amber-600">{t('propertyDetails.ownerListed')}</span>
                    <h4 className="font-serif text-sm font-bold text-foreground leading-none">{t('propertyDetails.privateSeller')}</h4>
                  </div>
                </div>
                <div className="border-t border-border pt-3 text-xs text-muted-foreground leading-relaxed font-light">
                  {t('propertyDetails.privateSellerNote')}
                </div>
              </div>
            )}
          </div>

          {/* Contact form */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm sticky top-24">
            <h3 className="font-serif text-xl font-bold mb-4">{t('propertyDetails.requestConsultant')}</h3>
            
            <AnimatePresence mode="wait">
              {!formSubmitted ? (
                <motion.form 
                  key="contact-form"
                  onSubmit={handleFormSubmit} 
                  className="space-y-4"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground uppercase">{t('propertyDetails.yourName')}</label>
                    <input 
                      type="text" required value={formName} onChange={(e) => setFormName(e.target.value)}
                      className="h-10 w-full rounded-lg border border-border bg-background/50 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-accent"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground uppercase">{t('propertyDetails.emailAddress')}</label>
                    <input 
                      type="email" required value={formEmail} onChange={(e) => setFormEmail(e.target.value)}
                      className="h-10 w-full rounded-lg border border-border bg-background/50 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-accent"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground uppercase">{t('propertyDetails.inquiryMessage')}</label>
                    <textarea 
                      required rows={4} value={formMessage} onChange={(e) => setFormMessage(e.target.value)}
                      className="w-full rounded-lg border border-border bg-background/50 p-3 text-sm focus:outline-none focus:ring-1 focus:ring-accent"
                    />
                  </div>

                  {/* Cloudflare Turnstile */}
                  <TurnstileWidget onVerify={handleVerify} />

                  <button
                    type="submit"
                    disabled={!isVerified}
                    className={`h-11 w-full rounded-xl font-semibold text-white transition-all ${
                      isVerified 
                        ? 'bg-accent hover:bg-accent/85 hover:scale-[1.01]' 
                        : 'bg-stone-500 cursor-not-allowed opacity-50 font-normal text-muted-foreground'
                    }`}
                  >
                    {t('propertyDetails.sendInquiry')}
                  </button>
                </motion.form>
              ) : (
                <motion.div 
                  key="success-form"
                  className="text-center py-8 space-y-4"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                >
                  <div className="flex justify-center">
                    <CheckCircle2 className="h-16 w-16 text-emerald-500 animate-pulse-slow" />
                  </div>
                  <div className="space-y-1.5">
                    <h4 className="font-serif text-lg font-bold text-foreground">{t('propertyDetails.inquirySubmitted')}</h4>
                    <p className="text-xs text-muted-foreground font-light leading-relaxed max-w-[240px] mx-auto">
                      {t('propertyDetails.inquirySubmittedSub', { name: formName, email: formEmail })}
                    </p>
                  </div>
                  
                  <button
                    onClick={() => setFormSubmitted(false)}
                    className="inline-block text-xs font-semibold text-accent hover:underline pt-2"
                  >
                    {t('propertyDetails.submitAnotherInquiry')}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>

      {/* Fullscreen Swipe/Zoom Gallery Modal */}
      <GalleryModal
        isOpen={isGalleryOpen}
        images={property.images}
        initialIndex={galleryStartIndex}
        onClose={() => setIsGalleryOpen(false)}
      />
    </div>
  );
}
