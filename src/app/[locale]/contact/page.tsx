import ContactClient from './ContactClient';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  const titles: Record<string, string> = {
    en: "Contact Love Sync — Get in Touch",
    no: "Kontakt Love Sync — Ta kontakt",
    pl: "Kontakt z Love Sync — Napisz do nas",
    de: "Love Sync kontaktieren",
    fr: "Contactez Love Sync",
    es: "Contacta con Love Sync",
    it: "Contatta Love Sync",
  };

  const descriptions: Record<string, string> = {
    en: "Questions about Love Sync Premium, partnerships, or support? Send us a message and our team will get back to you shortly.",
    no: "Spørsmål om Love Sync Premium, samarbeid eller support? Send oss en melding, så svarer vi deg raskt.",
    pl: "Masz pytania dotyczące Love Sync Premium, współpracy lub wsparcia? Napisz do nas, a szybko odpowiemy.",
    de: "Fragen zu Love Sync Premium, Partnerschaften oder Support? Senden Sie uns eine Nachricht.",
    fr: "Des questions sur Love Sync Premium, un partenariat ou le support ? Envoyez-nous un message.",
    es: "¿Preguntas sobre Love Sync Premium, asociaciones o soporte? Envíanos un mensaje.",
    it: "Domande su Love Sync Premium, partnership o supporto? Inviaci un messaggio.",
  };

  return {
    title: titles[locale] || titles.en,
    description: descriptions[locale] || descriptions.en,
    alternates: {
      canonical: `https://www.love-sync.com/${locale}/contact`,
      languages: {
        en: "/en/contact",
        no: "/no/contact",
        pl: "/pl/contact",
        de: "/de/contact",
        fr: "/fr/contact",
        es: "/es/contact",
        it: "/it/contact",
      },
    },
  };
}

export default async function Page({ params }: PageProps) {
  await params;
  return <ContactClient />;
}
