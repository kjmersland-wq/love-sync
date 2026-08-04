import React from 'react';
import HelpClient from './HelpClient';

export const runtime = "edge";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  const titles = {
    en: "Love Sync Help Center — Support, Relocation & Verification Guides",
    no: "Love Sync hjelpesenter — Støtte-, flytte- og verifiseringsveiledninger",
    pl: "Centrum pomocy Love Sync — Wsparcie, relokacja i weryfikacja",
    de: "Love Sync Hilfe-Center — Support, Umzug & Verifizierungs-Leitfäden",
    fr: "Centre d'aide Love Sync — Support, Relogement et Guides de Vérification",
    es: "Centro de Ayuda de Love Sync — Guías de Soporte, Reubicación y Verificación",
    it: "Centro Assistenza Love Sync — Supporto, Relocation e Guide di Verifica",
  };

  const descriptions = {
    en: "Access our help guides on account setup, identity verification, premium matching, translation features, and relocation checklist tools.",
    no: "Få tilgang til våre hjelpeveiledninger om kontooppsett, identitetsverifisering, premium matching, oversettelsesfunksjoner og flytteverktøy.",
    pl: "Uzyskaj dostęp do poradników dotyczących konfiguracji konta, weryfikacji tożsamości, dopasowania premium, tłumaczeń i narzędzi relokacji.",
    de: "Greifen Sie auf unsere Hilfestellungen zu Kontoeinrichtung, Identitätsprüfung, Premium-Matching, Übersetzung und Umzugstools zu.",
    fr: "Accédez à nos guides d'aide sur la configuration du compte, la vérification, le matching premium, la traduction et la relocalisation.",
    es: "Acceda a nuestras guías de ayuda sobre configuración de cuentas, verificación de identidad, emparejamiento premium y herramientas de reubicación.",
    it: "Accedi alle nostre guide su configurazione dell'account, verifica dell'identità, matching premium, traduzione e strumenti di relocation.",
  };

  return {
    title: titles[locale as keyof typeof titles] || titles.en,
    description: descriptions[locale as keyof typeof descriptions] || descriptions.en,
    alternates: {
      canonical: `https://www.love-sync.com/${locale}/help`,
      languages: {
        en: "/en/help",
        no: "/no/help",
        pl: "/pl/help",
        de: "/de/help",
        fr: "/fr/help",
        es: "/es/help",
        it: "/it/help",
      },
    },
  };
}

export default async function Page({ params }: PageProps) {
  return <HelpClient params={params} />;
}
