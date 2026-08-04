import React, { use } from 'react';
import FaqClient from './FaqClient';
import { faqData } from '../../../lib/i18n/helpData';

export const runtime = "edge";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  const titles = {
    en: "Love Sync FAQ — Subscriptions, Matching & Safety Questions",
    no: "Love Sync FAQ — Spørsmål om abonnement, matching og sikkerhet",
    pl: "Love Sync FAQ — Subskrypcje, dopasowania i bezpieczeństwo",
    de: "Love Sync FAQ — Abonnements, Matching & Sicherheitsfragen",
    fr: "Love Sync FAQ — Questions sur les Abonnements, le Matching et la Sécurité",
    es: "Love Sync FAQ — Preguntas sobre Suscripciones, Emparejamiento y Seguridad",
    it: "Love Sync FAQ — Domande su Abbonamenti, Matching e Sicurezza",
  };

  const descriptions = {
    en: "Find answers to frequently asked questions about Love Sync premium subscriptions, our values-based compatibility matching engine, and identity verification safety policies.",
    no: "Finn svar på ofte stilte spørsmål om Love Sync premium-abonnementer, vår verdbaserte kompatibilitetsmotor og retningslinjer for identitetsverifisering.",
    pl: "Znajdź odpowiedzi na najczęściej zadawane pytania dotyczące subskrypcji premium, silnika dopasowania opartego na wartościach oraz zasad weryfikacji tożsamości.",
    de: "Finden Sie Antworten auf häufig gestellte Fragen zu Love Sync Premium-Abonnements, unserer wertebasierten Kompatibilitäts-Engine und Sicherheitsrichtlinien zur Identitätsprüfung.",
    fr: "Retrouvez les réponses aux questions fréquemment posées sur les abonnements premium Love Sync, notre moteur de matching basé sur les valeurs et nos politiques de sécurité.",
    es: "Encuentre respuestas a las preguntas más frecuentes sobre las suscripciones premium de Love Sync, nuestro motor de emparejamiento basado en valores y las políticas de verificación.",
    it: "Trova risposte alle domande più frequenti sugli abbonamenti premium di Love Sync, sul nostro motore di matching basato sui valori e sulle politiche di sicurezza.",
  };

  return {
    title: titles[locale as keyof typeof titles] || titles.en,
    description: descriptions[locale as keyof typeof descriptions] || descriptions.en,
    alternates: {
      canonical: `https://www.love-sync.com/${locale}/faq`,
      languages: {
        en: "/en/faq",
        no: "/no/faq",
        pl: "/pl/faq",
        de: "/de/faq",
        fr: "/fr/faq",
        es: "/es/faq",
        it: "/it/faq",
      },
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { locale } = await params;

  // Build JSON-LD FAQ schema dynamically
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqData.map((faq) => {
      const q = faq.question[locale as keyof typeof faq.question] || faq.question['en'] || '';
      const a = faq.answer[locale as keyof typeof faq.answer] || faq.answer['en'] || '';
      return {
        "@type": "Question",
        "name": q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": a
        }
      };
    })
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <FaqClient locale={locale} />
    </>
  );
}
