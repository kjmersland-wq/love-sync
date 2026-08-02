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
  };

  const descriptions = {
    en: "Connect across borders, match by values and lifestyle, and translate messages in real-time. Premium relationship discovery.",
    no: "Koble sammen på tvers av grenser, match basert på verdier og livsstil, og oversett meldinger i sanntid. Førsteklasses relasjonsplanlegger.",
    pl: "Nawiąż relacje ponad granicami, dopasuj się pod kątem wartości i stylu życia oraz tłumacz wiadomości w czasie rzeczywistym.",
  };

  return {
    metadataBase: new URL("https://www.love-sync.com"),
    title: titles[locale as keyof typeof titles] || titles.en,
    description: descriptions[locale as keyof typeof descriptions] || descriptions.en,
    icons: {
      icon: "/favicon.ico",
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
    },
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
