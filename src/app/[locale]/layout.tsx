import type { Metadata } from "next";
import { Outfit, Cormorant_Garamond } from "next/font/google";
import { AppProvider } from "../../context/AppContext";
import { I18nProvider } from "../../lib/i18n/I18nContext";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  
  const titles = {
    en: "Love Sync — Premium International Connections",
    no: "Love Sync — Premium internasjonale forbindelser",
    pl: "Love Sync — Elitarne znajomości międzynarodowe",
    de: "Love Sync — Premium Internationale Beziehungen",
    fr: "Love Sync — Connexions Internationales Premium",
    es: "Love Sync — Conexiones Internacionales Premium",
    it: "Love Sync — Connessioni Internazionali Premium",
  };

  const descriptions = {
    en: "Connect across borders, match by values and lifestyle, and translate messages in real-time. Premium relationship discovery.",
    no: "Koble sammen på tvers av grenser, match basert på verdier og livsstil, og oversett meldinger i sanntid. Førsteklasses relasjonsplanlegger.",
    pl: "Nawiąż relacje ponad granicami, dopasuj się pod kątem wartości i stylu życia oraz tłumacz wiadomości w czasie rzeczywistym.",
    de: "Verbinden Sie sich über Grenzen hinweg, matchen Sie nach Werten und Lebensstil und übersetzen Sie Nachrichten in Echtzeit.",
    fr: "Connectez-vous au-delà des frontières, matchez selon vos valeurs et votre style de vie, et traduisez les messages en temps réel.",
    es: "Conéctese a través de las fronteras, empareje por valores y estilo de vida, y traduzca mensajes en tiempo real.",
    it: "Connettiti oltre i confini, trova l'intesa ideale in base a valori e stile di vita, e traduci i messaggi in tempo reale.",
  };

  return {
    metadataBase: new URL("https://www.love-sync.com"),
    title: titles[locale as keyof typeof titles] || titles.en,
    description: descriptions[locale as keyof typeof descriptions] || descriptions.en,
    keywords: ["international relationship", "compatibility matching", "expat dating", "cross-border relationships", "relocation planning"],
    manifest: "/site.webmanifest",
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: "Love Sync",
    },
    icons: {
      icon: [
        { url: "/favicon.ico" },
        { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
        { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
        { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" }
      ],
      apple: [
        { url: "/apple-touch-icon.png" },
        { url: "/apple-touch-icon-180.png", sizes: "180x180", type: "image/png" }
      ],
      other: [
        { rel: "mask-icon", url: "/mask-icon.svg", color: "#09090b" }
      ]
    },
    alternates: {
      canonical: `/${locale}`,
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
    openGraph: {
      title: titles[locale as keyof typeof titles] || titles.en,
      description: descriptions[locale as keyof typeof descriptions] || descriptions.en,
      url: `https://www.love-sync.com/${locale}`,
      siteName: "Love Sync",
      locale: locale,
      type: "website",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: "Love-Sync Premium International Relationships"
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: titles[locale as keyof typeof titles] || titles.en,
      description: descriptions[locale as keyof typeof descriptions] || descriptions.en,
      images: ["/twitter-image.png"],
    }
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { locale } = await params;
  
  return (
    <html
      lang={locale}
      className={`${outfit.variable} ${cormorant.variable} h-full antialiased dark`}
      style={{ colorScheme: "dark" }}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <AppProvider>
          <I18nProvider locale={locale}>
            <Navbar />
            <main className="flex-1 flex flex-col">{children}</main>
            <Footer />
          </I18nProvider>
        </AppProvider>
      </body>
    </html>
  );
}
