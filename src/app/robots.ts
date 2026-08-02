import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/*/admin",
        "/*/dashboard",
        "/*/messages",
        "/*/onboarding",
        "/*/forgot-password",
        "/*/register",
        "/*/login",
        "/*/verify",
        "/*/verify-email",
      ],
    },
    sitemap: "https://www.love-sync.com/sitemap.xml",
  };
}
