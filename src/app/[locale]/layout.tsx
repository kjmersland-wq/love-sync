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
    en: "Next Place Living — Premium Relocation & Property Discovery",
    no: "Next Place Living — Premium Relokalisering & Eiendomssøk",
    pl: "Next Place Living — Ekskluzywne Przeprowadzki i Nieruchomości",
  };

  const descriptions = {
    en: "Discover countries, compare cost of living, explore neighborhood safety ratings, and find your dream home. Voted #1 expat relocation planner.",
    no: "Oppdag land, sammenlign levekostnader, utforsk nabolagssikkerhet og finn ditt drømmehjem. Kåret til #1 flytteplanlegger.",
    pl: "Odkryj kraje, porównaj koszty życia, sprawdź bezpieczeństwo dzielnic i znajdź wymarzony dom. Wybrany jako #1 planer przeprowadzek.",
  };

  return {
    title: titles[locale as keyof typeof titles] || titles.en,
    description: descriptions[locale as keyof typeof descriptions] || descriptions.en,
    icons: {
      icon: "/favicon.ico",
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
