import React from 'react';
import HomeClient from './pageClient';


interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  const titles = {
    en: "Love Sync — International Dating & Serious Relationship Platform",
    no: "Love Sync — Internasjonal dating- og relasjonsplattform",
    pl: "Love Sync — Międzynarodowy portal randkowy i relacyjny",
    de: "Love Sync — Internationale Dating- und Beziehungsplattform",
    fr: "Love Sync — Plateforme de Rencontre Internationale & Relations Durables",
    es: "Love Sync — Plataforma de Citas Internacionales y Relaciones Serias",
    it: "Love Sync — Piattaforma di Incontri Internazionali e Relazioni Serie",
  };

  const descriptions = {
    en: "Find serious, long-term international relationships. Verify identities, translate chats instantly, analyze compatibility, and plan relocation securely.",
    no: "Finn seriøse, langvarige internasjonale forhold. Verifiser identiteter, oversett chatter umiddelbart, analyser kompatibilitet og planlegg flytting.",
    pl: "Znajdź poważne, długoterminowe relacje międzynarodowe. Weryfikuj tożsamość, tłumacz czaty, analizuj dopasowanie i planuj relokację.",
    de: "Finden Sie ernsthafte, langfristige internationale Beziehungen. Verifizieren Sie Identitäten, übersetzen Sie Chats, analysieren Sie Kompatibilität.",
    fr: "Trouvez des relations internationales durables. Vérifiez les identités, traduisez les chats, analysez la compatibilité et planifiez le déménagement.",
    es: "Encuentre relaciones internacionales serias y duraderas. Verifique identidades, traduzca chats al instante, analice compatibilidad.",
    it: "Trova relazioni internazionali serie e a lungo termine. Verifica le identità, traduci le chat istantaneamente, analizza la compatibilità.",
  };

  return {
    title: titles[locale as keyof typeof titles] || titles.en,
    description: descriptions[locale as keyof typeof descriptions] || descriptions.en,
    alternates: {
      canonical: `https://www.love-sync.com/${locale}`,
      languages: {
        en: "/en",
        no: "/no",
        pl: "/pl",
        de: "/de",
        fr: "/fr",
        es: "/es",
        it: "/it",
      },
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { locale } = await params;

  // WebSite and Organization JSON-LD schemas
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Love Sync",
    "url": `https://www.love-sync.com/${locale}`,
    "potentialAction": {
      "@type": "SearchAction",
      "target": `https://www.love-sync.com/${locale}/properties?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Love Sync",
    "url": "https://www.love-sync.com",
    "logo": "https://www.love-sync.com/apple-touch-icon.png",
    "sameAs": [
      "https://twitter.com/lovesyncapp",
      "https://www.facebook.com/lovesyncapp"
    ],
    "description": "World's premium international relationship platform designed for long-term values-based matches."
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <HomeClient params={params} />
    </>
  );
}
