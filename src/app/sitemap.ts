import type { MetadataRoute } from "next";
import { countrySlugs, citySlugs, neighborhoodSlugs } from "../lib/i18n/slugMap";
import { getLocalizedSlug } from "../lib/i18n/i18n";

const locales = ["en", "no", "pl", "de", "fr", "es", "it"];
const routes = ["", "properties", "pricing", "compare", "faq", "help"];

export default function sitemap(): MetadataRoute.Sitemap {
  const sitemapItems: MetadataRoute.Sitemap = [];

  // A. Static routes for each locale
  for (const locale of locales) {
    for (const route of routes) {
      const path = route ? `${locale}/${route}` : locale;
      sitemapItems.push({
        url: `https://www.love-sync.com/${path}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: route === "" ? 1.0 : route === "faq" || route === "help" ? 0.5 : 0.8,
      });
    }
  }

  // B. Dynamic country portals for each locale
  for (const locale of locales) {
    for (const countryCanonical of Object.keys(countrySlugs)) {
      const countrySlug = getLocalizedSlug("country", countryCanonical, locale);
      sitemapItems.push({
        url: `https://www.love-sync.com/${locale}/${countrySlug}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }
  }

  // C. Dynamic city portals for each locale
  const cityToCountry: Record<string, string> = {
    valencia: "spain",
    malaga: "spain",
    madrid: "spain",
    warsaw: "poland",
    krakow: "poland",
    gdansk: "poland",
    wroclaw: "poland",
    lisbon: "portugal",
  };

  for (const locale of locales) {
    for (const [cityCanonical, countryCanonical] of Object.entries(cityToCountry)) {
      const countrySlug = getLocalizedSlug("country", countryCanonical, locale);
      const citySlug = getLocalizedSlug("city", cityCanonical, locale);
      sitemapItems.push({
        url: `https://www.love-sync.com/${locale}/${countrySlug}/${citySlug}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.6,
      });
    }
  }

  // D. Dynamic neighborhood portals for each locale
  const neighborhoodToCity: Record<string, string> = {
    ruzafa: "valencia",
    "el-carmen": "valencia",
    patraix: "valencia",
    "el-limonar": "malaga",
    "la-malagueta": "malaga",
    salamanca: "madrid",
    chueca: "madrid",
    mokotow: "warsaw",
    "srodmiescie-warsaw": "warsaw",
    wilanow: "warsaw",
    "stare-miasto-krakow": "krakow",
    kazimierz: "krakow",
    oliwa: "gdansk",
    wrzeszcz: "gdansk",
    nadodrze: "wroclaw",
    krzyki: "wroclaw",
    alfama: "lisbon",
    "parque-das-nacoes": "lisbon",
  };

  for (const locale of locales) {
    for (const [nhCanonical, cityCanonical] of Object.entries(neighborhoodToCity)) {
      const countryCanonical = cityToCountry[cityCanonical];
      if (!countryCanonical) continue;
      
      const countrySlug = getLocalizedSlug("country", countryCanonical, locale);
      const citySlug = getLocalizedSlug("city", cityCanonical, locale);
      const nhSlug = getLocalizedSlug("neighborhood", nhCanonical, locale);

      sitemapItems.push({
        url: `https://www.love-sync.com/${locale}/${countrySlug}/${citySlug}/${nhSlug}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.5,
      });
    }
  }

  return sitemapItems;
}
