import { countrySlugs, citySlugs, neighborhoodSlugs } from "./slugMap";

export const locales = ["en", "no", "pl", "de", "fr", "es", "it"];
export const defaultLocale = "en";

export type Locale = "en" | "no" | "pl" | "de" | "fr" | "es" | "it";

// 1. Get canonical ID from localized URL slug
export function getCanonicalSlug(
  type: "country" | "city" | "neighborhood",
  slug: string,
  locale: string
): string {
  const map =
    type === "country"
      ? countrySlugs
      : type === "city"
      ? citySlugs
      : neighborhoodSlugs;

  const lowercaseSlug = slug.toLowerCase();

  // Find canonical ID where translated slug matches
  for (const [canonicalId, translations] of Object.entries(map)) {
    if (translations[locale]?.toLowerCase() === lowercaseSlug) {
      return canonicalId;
    }
  }

  // Fallback if not found: try matching canonicalId directly
  if (map[lowercaseSlug]) {
    return lowercaseSlug;
  }

  // Double fallback check in other locales (in case user pasted an EN URL in NO page)
  for (const [canonicalId, translations] of Object.entries(map)) {
    for (const val of Object.values(translations)) {
      if (val.toLowerCase() === lowercaseSlug) {
        return canonicalId;
      }
    }
  }

  return slug;
}

// 2. Get localized URL slug from canonical ID
export function getLocalizedSlug(
  type: "country" | "city" | "neighborhood",
  canonicalId: string,
  locale: string
): string {
  const map =
    type === "country"
      ? countrySlugs
      : type === "city"
      ? citySlugs
      : neighborhoodSlugs;

  const key = canonicalId.toLowerCase();
  if (map[key] && map[key][locale]) {
    return map[key][locale];
  }

  return canonicalId;
}

// 3. Localize entire path (for switching language selector)
export function getLocalizedUrl(targetLocale: string, currentPathname: string): string {
  if (!currentPathname) return `/${targetLocale}`;

  // Split paths
  const segments = currentPathname.split("/").filter(Boolean);
  if (segments.length === 0) return `/${targetLocale}`;

  // Check if first segment is a locale
  let currentLocale = defaultLocale;
  let pageSegments = [...segments];

  if (locales.includes(segments[0])) {
    currentLocale = segments[0];
    pageSegments = segments.slice(1);
  }

  // Translate page segments
  const translatedSegments: string[] = [];

  if (pageSegments.length > 0) {
    // Segment 1: Country slug
    const countryCanonical = getCanonicalSlug("country", pageSegments[0], currentLocale);
    translatedSegments.push(getLocalizedSlug("country", countryCanonical, targetLocale));
  }

  if (pageSegments.length > 1) {
    // Segment 2: City slug
    const cityCanonical = getCanonicalSlug("city", pageSegments[1], currentLocale);
    translatedSegments.push(getLocalizedSlug("city", cityCanonical, targetLocale));
  }

  if (pageSegments.length > 2) {
    // Segment 3: Neighborhood slug
    const neighCanonical = getCanonicalSlug("neighborhood", pageSegments[2], currentLocale);
    translatedSegments.push(getLocalizedSlug("neighborhood", neighCanonical, targetLocale));
  }

  // Handle properties / property details pages
  if (pageSegments.length > 0 && (pageSegments[0] === "properties" || pageSegments[0] === "compare" || pageSegments[0] === "dashboard" || pageSegments[0] === "admin" || pageSegments[0] === "property")) {
    // These paths don't translate slugs except for locale prefix
    return `/${targetLocale}/${pageSegments.join("/")}`;
  }

  return `/${targetLocale}/${translatedSegments.join("/")}`;
}

// 4. Format dates by locale
export function formatDate(dateString: string, locale: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    const formatMap: { [key: string]: string } = {
      en: "en-US",
      no: "no-NO",
      pl: "pl-PL",
      de: "de-DE",
      fr: "fr-FR",
      es: "es-ES",
      it: "it-IT"
    };

    const code = formatMap[locale] || "en-US";
    return date.toLocaleDateString(code, { year: "numeric", month: "long", day: "numeric" });
  } catch (e) {
    return dateString;
  }
}

// 5. Localized currency formatting helper
export function formatCurrencyWithLocale(
  amount: number,
  currency: string,
  locale: string
): string {
  const formatterMap: { [key: string]: string } = {
    en: "en-US",
    no: "no-NO",
    pl: "pl-PL",
    de: "de-DE",
    fr: "fr-FR",
    es: "es-ES",
    it: "it-IT"
  };

  const code = formatterMap[locale] || "en-US";
  
  try {
    return new Intl.NumberFormat(code, {
      style: "currency",
      currency: currency,
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
    }).format(amount);
  } catch (e) {
    return `${amount} ${currency}`;
  }
}
