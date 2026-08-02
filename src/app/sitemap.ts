import type { MetadataRoute } from "next";

const locales = ["en", "no", "pl", "de", "fr", "es", "it"];
const routes = ["", "properties", "pricing", "compare", "faq", "help"];

export default function sitemap(): MetadataRoute.Sitemap {
  const sitemapItems: MetadataRoute.Sitemap = [];

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

  return sitemapItems;
}
