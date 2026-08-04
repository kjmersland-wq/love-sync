import React from 'react';
import PricingClient from './PricingClient';

export const runtime = "edge";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  const titles = {
    en: "Love Sync Premium Matching — Pricing & Subscriptions",
    no: "Love Sync Premium Matching — Priser og abonnement",
    pl: "Love Sync Premium Matching — Ceny i subskrypcje",
    de: "Love Sync Premium Matching — Preise & Abonnements",
    fr: "Love Sync Premium Matching — Tarifs & Abonnements",
    es: "Love Sync Premium Matching — Precios y Suscripciones",
    it: "Love Sync Premium Matching — Prezzi e Abbonamenti",
  };

  const descriptions = {
    en: "Choose the perfect subscription plan for your relationship journey. Unlock AI compatibility, real-time message translation, and verified profile matching.",
    no: "Velg den perfekte abonnementsplanen for din relasjonsreise. Lås opp AI-kompatibilitet, meldingsskyoversettelse i sanntid og verifiserte profiler.",
    pl: "Wybierz idealny plan subskrypcji dla swojej drogi życiowej. Odblokuj analizy kompatybilności AI, tłumaczenie wiadomości i weryfikację profili.",
    de: "Wählen Sie den perfekten Abonnement-Plan für Ihre Beziehungsreise. Schalten Sie KI-Kompatibilität, Echtzeit-Übersetzung und verifizierte Profile frei.",
    fr: "Choisissez l'abonnement idéal pour votre parcours relationnel. Débloquez la compatibilité IA, la traduction en temps réel et la vérification des profils.",
    es: "Elija el plan de suscripción ideal para su relación. Desbloquee la compatibilidad de IA, la traducción de mensajes en tiempo real y perfiles verificados.",
    it: "Scegli l'abbonamento ideale per il tuo percorso di coppia. Sblocca la compatibilità IA, la traduzione dei messaggi in tempo real e profili verificati.",
  };

  return {
    title: titles[locale as keyof typeof titles] || titles.en,
    description: descriptions[locale as keyof typeof descriptions] || descriptions.en,
    alternates: {
      canonical: `https://www.love-sync.com/${locale}/pricing`,
      languages: {
        en: "/en/pricing",
        no: "/no/pricing",
        pl: "/pl/pricing",
        de: "/de/pricing",
        fr: "/fr/pricing",
        es: "/es/pricing",
        it: "/it/pricing",
      },
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { locale } = await params;

  // Pricing Product Schema
  const pricingSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Love Sync Premium Membership",
    "image": "https://www.love-sync.com/og-image.png",
    "description": "Unlock premium features like real-time AI Translation, AI Compatibility analysis, and verified international profiles.",
    "brand": {
      "@type": "Brand",
      "name": "Love Sync"
    },
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "USD",
      "lowPrice": "8.33",
      "highPrice": "14.99",
      "offerCount": "2",
      "offers": [
        {
          "@type": "Offer",
          "name": "Premium Monthly",
          "price": "14.99",
          "priceCurrency": "USD",
          "category": "Subscription"
        },
        {
          "@type": "Offer",
          "name": "Premium Yearly",
          "price": "99.99",
          "priceCurrency": "USD",
          "category": "Subscription"
        }
      ]
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pricingSchema) }}
      />
      <PricingClient />
    </>
  );
}
