// Stubs for legacy real estate data models to prevent Turbopack compilation errors
import { getCloudflareContext } from "@opennextjs/cloudflare";

export interface Country {
  id: string;
  name: string;
  slug: string;
  description: string;
  visaGuideline: string;
  residencyGuideline: string;
  taxPolicy: string;
  climateOverview: string;
  image: string;
  language: string;
  currency: string;
  exchangeRateToEur: number;
}
export interface Neighborhood {
  id: string;
  name: string;
  slug: string;
  coordinates: any;
  safetyIndex: number;
  walkabilityIndex: number;
  greenSpacesIndex: number;
  healthcareIndex: number;
  diningIndex: number;
  shoppingIndex: number;
  retirementIndex: number;
  description: string;
  image: string;
  noiseLevel: string;
  costRating: string;
  evCharging: string;
  lifestyleProfile: string[];
}
export interface City {
  id: string;
  name: string;
  slug: string;
  country: string;
  neighborhoods: Neighborhood[];
  coordinates: any;
  retirementScore: number;
  description: string;
  image: string;
  safety: number;
  costIndex: number;
  healthcare: number;
  climate: number;
  walkability: number;
  transit: number;
  greenery: number;
  taxScore: number;
}
export interface Property {
  id: string;
  name: string;
  slug: string;
  price: number;
  bedrooms: number;
  type: string;
  city: string;
  neighborhood: string;
  evReady: boolean;
  parking: boolean;
  noiseRating: string;
  amenities: string[];
  title: string;
  image: string;
  exactAddress: string;
  bathrooms: number;
  size: number;
  epcRating: string;
  description: string;
  currency: string;
  coordinates: any;
  commuteTimes: any;
  evChargingStations: any;
  listedDate: string;
  provider: string;
  priceHistory: any;
  daysOnMarket: number;
  estMarketValuePerSqm: number;
  isAgency: boolean;
  agencyLogo: string;
  agencyName: string;
  agencyContact: string;
  agencyWebsite: string;
  images: string[];
  featured: boolean;
  floor: number;
  hasElevator: boolean;
  commuteTimeTrainMin: number;
}

export const countries: Country[] = [];
export const cities: City[] = [];
export const properties: Property[] = [];

export function getD1(): any {
  try {
    const context = getCloudflareContext();
    if (context && context.env && context.env.DB) {
      return context.env.DB;
    }
  } catch (e) {
    // Suppress warning during static building / SSR outside Workers
  }
  return null;
}

const isBrowser = typeof window !== 'undefined';

const mockStore: {
  favorites: { cities: string[]; properties: string[]; neighborhoods: string[] };
  relocationPlans: any[];
} = {
  favorites: { cities: [], properties: [], neighborhoods: [] },
  relocationPlans: []
};

// Local storage list helpers
const getStoredCountries = (): Country[] => {
  if (!isBrowser) return countries;
  const stored = localStorage.getItem('npl_db_countries');
  if (stored) return JSON.parse(stored);
  localStorage.setItem('npl_db_countries', JSON.stringify(countries));
  return countries;
};

const getStoredCities = (): City[] => {
  if (!isBrowser) return cities;
  const stored = localStorage.getItem('npl_db_cities');
  if (stored) return JSON.parse(stored);
  localStorage.setItem('npl_db_cities', JSON.stringify(cities));
  return cities;
};

const getStoredProperties = (): Property[] => {
  if (!isBrowser) return properties;
  const stored = localStorage.getItem('npl_db_properties');
  if (stored) return JSON.parse(stored);
  localStorage.setItem('npl_db_properties', JSON.stringify(properties));
  return properties;
};

export const db = {
  // --- Countries ---
  async getCountries(): Promise<Country[]> {
    return new Promise((resolve) => {
      resolve(getStoredCountries());
    });
  },

  async getCountry(slug: string): Promise<Country | null> {
    return new Promise((resolve) => {
      const list = getStoredCountries();
      const country = list.find(c => c.slug === slug);
      resolve(country || null);
    });
  },

  async saveCountry(country: Country): Promise<Country[]> {
    const list = getStoredCountries();
    const existingIndex = list.findIndex(c => c.id === country.id);
    if (existingIndex !== -1) {
      list[existingIndex] = country;
    } else {
      list.push(country);
    }
    if (isBrowser) {
      localStorage.setItem('npl_db_countries', JSON.stringify(list));
    }
    return list;
  },

  async deleteCountry(id: string): Promise<Country[]> {
    const list = getStoredCountries().filter(c => c.id !== id);
    if (isBrowser) {
      localStorage.setItem('npl_db_countries', JSON.stringify(list));
    }
    return list;
  },

  // --- Cities ---
  async getCities(countrySlug?: string): Promise<City[]> {
    return new Promise((resolve) => {
      const list = getStoredCities();
      if (countrySlug) {
        resolve(list.filter(c => c.country === countrySlug));
      } else {
        resolve(list);
      }
    });
  },

  async getCity(slug: string): Promise<City | null> {
    return new Promise((resolve) => {
      const list = getStoredCities();
      const city = list.find(c => c.slug === slug);
      resolve(city || null);
    });
  },

  async saveCity(city: City): Promise<City[]> {
    const list = getStoredCities();
    const existingIndex = list.findIndex(c => c.id === city.id);
    if (existingIndex !== -1) {
      list[existingIndex] = city;
    } else {
      list.push(city);
    }
    if (isBrowser) {
      localStorage.setItem('npl_db_cities', JSON.stringify(list));
    }
    return list;
  },

  async deleteCity(id: string): Promise<City[]> {
    const list = getStoredCities().filter(c => c.id !== id);
    if (isBrowser) {
      localStorage.setItem('npl_db_cities', JSON.stringify(list));
    }
    return list;
  },

  // --- Neighborhoods ---
  async getNeighborhoods(citySlug: string): Promise<Neighborhood[]> {
    return new Promise((resolve) => {
      const list = getStoredCities();
      const city = list.find(c => c.slug === citySlug);
      resolve(city ? city.neighborhoods : []);
    });
  },

  // --- Properties ---
  async getProperties(filters?: {
    city?: string;
    neighborhood?: string;
    minPrice?: number;
    maxPrice?: number;
    bedrooms?: number;
    type?: string;
    amenities?: string[];
    evReady?: boolean;
    parking?: boolean;
    noiseRating?: string;
  }): Promise<Property[]> {
    return new Promise((resolve) => {
      let results = getStoredProperties();

      if (filters) {
        if (filters.city) {
          results = results.filter(p => p.city === filters.city);
        }
        if (filters.neighborhood) {
          results = results.filter(p => p.neighborhood.toLowerCase() === filters.neighborhood?.toLowerCase());
        }
        if (filters.minPrice !== undefined) {
          results = results.filter(p => p.price >= (filters.minPrice || 0));
        }
        if (filters.maxPrice !== undefined) {
          results = results.filter(p => p.price <= (filters.maxPrice || Infinity));
        }
        if (filters.bedrooms !== undefined && filters.bedrooms > 0) {
          results = results.filter(p => p.bedrooms >= (filters.bedrooms || 0));
        }
        if (filters.type && filters.type !== 'All') {
          results = results.filter(p => p.type === filters.type);
        }
        if (filters.evReady) {
          results = results.filter(p => p.evReady);
        }
        if (filters.parking) {
          results = results.filter(p => p.parking);
        }
        if (filters.noiseRating && filters.noiseRating !== 'All') {
          results = results.filter(p => p.noiseRating === filters.noiseRating);
        }
        if (filters.amenities && filters.amenities.length > 0) {
          results = results.filter(p =>
            filters.amenities!.every(amenity => p.amenities.includes(amenity))
          );
        }
      }

      resolve(results);
    });
  },

  async getProperty(id: string): Promise<Property | null> {
    return new Promise((resolve) => {
      const list = getStoredProperties();
      const property = list.find(p => p.id === id);
      resolve(property || null);
    });
  },

  async saveProperty(property: Property): Promise<Property[]> {
    const list = getStoredProperties();
    const existingIndex = list.findIndex(p => p.id === property.id);
    if (existingIndex !== -1) {
      list[existingIndex] = property;
    } else {
      list.push(property);
    }
    if (isBrowser) {
      localStorage.setItem('npl_db_properties', JSON.stringify(list));
    }
    return list;
  },

  async deleteProperty(id: string): Promise<Property[]> {
    const list = getStoredProperties().filter(p => p.id !== id);
    if (isBrowser) {
      localStorage.setItem('npl_db_properties', JSON.stringify(list));
    }
    return list;
  },

  // --- Favorites (LocalStorage fallback) ---
  getFavorites(): { cities: string[]; properties: string[]; neighborhoods: string[] } {
    if (!isBrowser) return mockStore.favorites;
    
    try {
      const stored = localStorage.getItem('npl_favorites');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error reading favorites from localStorage', e);
    }
    
    const initial = { cities: [], properties: [], neighborhoods: [] };
    this.saveFavoritesToStorage(initial);
    return initial;
  },

  toggleFavorite(type: 'cities' | 'properties' | 'neighborhoods', id: string): boolean {
    const favorites = this.getFavorites();
    const index = favorites[type].indexOf(id);
    let isAdded = false;

    if (index === -1) {
      favorites[type].push(id);
      isAdded = true;
    } else {
      favorites[type].splice(index, 1);
    }

    this.saveFavoritesToStorage(favorites);
    return isAdded;
  },

  saveFavoritesToStorage(favorites: { cities: string[]; properties: string[]; neighborhoods: string[] }) {
    if (!isBrowser) {
      mockStore.favorites = favorites;
      return;
    }
    try {
      localStorage.setItem('npl_favorites', JSON.stringify(favorites));
    } catch (e) {
      console.error('Error writing favorites to localStorage', e);
    }
  },

  // --- Relocation Plans (LocalStorage fallback) ---
  getRelocationPlans(): any[] {
    if (!isBrowser) return mockStore.relocationPlans;
    
    try {
      const stored = localStorage.getItem('npl_relocation_plans');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error reading plans from localStorage', e);
    }
    
    return [];
  },

  saveRelocationPlan(plan: any): any[] {
    const plans = this.getRelocationPlans();
    const existingIndex = plans.findIndex(p => p.citySlug === plan.citySlug);
    if (existingIndex !== -1) {
      plans[existingIndex] = { ...plans[existingIndex], ...plan, updatedAt: new Date().toISOString() };
    } else {
      plans.push({
        id: `plan-${Date.now()}`,
        ...plan,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }

    if (isBrowser) {
      try {
        localStorage.setItem('npl_relocation_plans', JSON.stringify(plans));
      } catch (e) {
        console.error('Error writing plans to localStorage', e);
      }
    } else {
      mockStore.relocationPlans = plans;
    }

    return plans;
  },

  deleteRelocationPlan(citySlug: string): any[] {
    const plans = this.getRelocationPlans();
    const filtered = plans.filter(p => p.citySlug !== citySlug);

    if (isBrowser) {
      try {
        localStorage.setItem('npl_relocation_plans', JSON.stringify(filtered));
      } catch (e) {
        console.error('Error writing plans to localStorage', e);
      }
    } else {
      mockStore.relocationPlans = filtered;
    }

    return filtered;
  },

  // --- Users & Stripe Billing (D1 with mock/localStorage fallback) ---
  async getUser(id: string): Promise<any | null> {
    const d1 = getD1();
    if (d1) {
      return await d1.prepare("SELECT * FROM users WHERE id = ?").bind(id).first();
    }
    // Browser local storage fallback
    if (isBrowser) {
      const stored = localStorage.getItem('ls_user_profile');
      if (stored) {
        const parsed = JSON.parse(stored);
        return { id, ...parsed };
      }
    }
    return {
      id,
      email: "alex@example.com",
      name: "Alex",
      subscription: "Not Subscribed"
    };
  },

  async updateUserSubscription(
    id: string,
    data: {
      subscription: "Not Subscribed" | "Premium";
      stripeCustomerId: string | null;
      stripeSubscriptionId: string | null;
      stripeBillingStatus: string | null;
      stripeRenewalDate: string | null;
      stripePlanId: string | null;
      transactionId?: string | null;
    }
  ): Promise<void> {
    const d1 = getD1();
    if (d1) {
      // 1. Update user table
      await d1.prepare(
        "UPDATE users SET subscription = ?, stripe_customer_id = ?, stripe_subscription_id = ?, stripe_billing_status = ?, stripe_renewal_date = ?, stripe_plan_id = ? WHERE id = ?"
      ).bind(
        data.subscription,
        data.stripeCustomerId,
        data.stripeSubscriptionId,
        data.stripeBillingStatus,
        data.stripeRenewalDate,
        data.stripePlanId,
        id
      ).run();

      // 2. Upsert into subscriptions history table
      if (data.stripeSubscriptionId) {
        try {
          // Resolved locally (rather than importing the Stripe config validator) so this
          // server-only lookup never pulls Stripe secret env var names into client bundles
          // that import db.ts for its localStorage-backed helpers.
          let billingEnv: Record<string, any> = process.env;
          try {
            const context = getCloudflareContext();
            if (context && context.env) {
              billingEnv = { ...process.env, ...context.env };
            }
          } catch (e) {
            // Suppress warning during static building / SSR outside Workers
          }
          const yearlyPriceId = (billingEnv.STRIPE_YEARLY_PRICE_ID || billingEnv.NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID || "").toString().trim();
          const billingPeriod = data.stripePlanId === yearlyPriceId ? "yearly" : "monthly";
          const cancelledAt = (data.stripeBillingStatus === "canceled" || data.stripeBillingStatus === "cancelled" || data.stripeBillingStatus === "unpaid")
            ? new Date().toISOString()
            : null;

          await d1.prepare(`
            INSERT INTO subscriptions (
              subscription_id, user_id, customer_id, transaction_id, product_id, price_id, 
              status, billing_period, renewal_date, cancelled_at, updated_at
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
            ON CONFLICT(subscription_id) DO UPDATE SET
              status = excluded.status,
              renewal_date = excluded.renewal_date,
              cancelled_at = excluded.cancelled_at,
              updated_at = CURRENT_TIMESTAMP
          `).bind(
            data.stripeSubscriptionId,
            id,
            data.stripeCustomerId || "",
            data.transactionId || null,
            "love_sync_premium",
            data.stripePlanId || "",
            data.stripeBillingStatus || "active",
            billingPeriod,
            data.stripeRenewalDate,
            cancelledAt
          ).run();
        } catch (err) {
          console.error("[updateUserSubscription Subscriptions DB Error]", err);
        }
      }
    }
    // Update local storage for client preview synchronization
    if (isBrowser) {
      const stored = localStorage.getItem('ls_user_profile');
      const profile = stored ? JSON.parse(stored) : {};
      const updated = {
        ...profile,
        subscription: data.subscription,
        stripeCustomerId: data.stripeCustomerId,
        stripeSubscriptionId: data.stripeSubscriptionId,
        stripeBillingStatus: data.stripeBillingStatus,
        stripeRenewalDate: data.stripeRenewalDate,
        stripePlanId: data.stripePlanId
      };
      localStorage.setItem('ls_user_profile', JSON.stringify(updated));
    }
  },

  async hasProcessedEvent(eventId: string, provider: string): Promise<boolean> {
    const d1 = getD1();
    if (d1) {
      const result = await d1.prepare(
        "SELECT 1 FROM processed_payment_events WHERE event_id = ? AND provider = ?"
      ).bind(eventId, provider).first();
      return !!result;
    }
    return false;
  },

  async logProcessedEvent(eventId: string, provider: string): Promise<void> {
    const d1 = getD1();
    if (d1) {
      await d1.prepare(
        "INSERT INTO processed_payment_events (event_id, provider) VALUES (?, ?)"
      ).bind(eventId, provider).run();
    }
  },

  async createInvoice(invoice: {
    id: string;
    userId: string;
    amount: number;
    currency: string;
    status: string;
    pdfUrl?: string;
    provider: string;
  }): Promise<void> {
    const d1 = getD1();
    if (d1) {
      await d1.prepare(
        "INSERT INTO invoices (id, user_id, amount, currency, status, pdf_url, provider) VALUES (?, ?, ?, ?, ?, ?, ?)"
      ).bind(
        invoice.id,
        invoice.userId,
        invoice.amount,
        invoice.currency,
        invoice.status,
        invoice.pdfUrl || null,
        invoice.provider
      ).run();
    }
  },

  async getInvoices(userId: string): Promise<any[]> {
    const d1 = getD1();
    if (d1) {
      const { results } = await d1.prepare(
        "SELECT * FROM invoices WHERE user_id = ? ORDER BY date DESC"
      ).bind(userId).all();
      return results;
    }
    return [];
  },

  // --- Relationship Journeys ---
  async getRelationshipJourney(userId: string, partnerId: string): Promise<any> {
    const d1 = getD1();
    if (d1) {
      const row = await d1.prepare(
        "SELECT * FROM relationship_journeys WHERE (user_id = ? AND partner_id = ?) OR (user_id = ? AND partner_id = ?)"
      ).bind(userId, partnerId, partnerId, userId).first();
      if (row) {
        return {
          ...row,
          visa_checklist: row.visa_checklist_json ? JSON.parse(row.visa_checklist_json) : [],
          moving_checklist: row.moving_checklist_json ? JSON.parse(row.moving_checklist_json) : [],
          budget: row.budget_json ? JSON.parse(row.budget_json) : [],
          calendar: row.calendar_json ? JSON.parse(row.calendar_json) : [],
          housing_search: row.housing_search_json ? JSON.parse(row.housing_search_json) : [],
          documents: row.documents_json ? JSON.parse(row.documents_json) : []
        };
      }
    }

    // Mock data fallback for preview and local development
    const mockJourney = {
      id: `j_${userId}_${partnerId}`,
      user_id: userId,
      partner_id: partnerId,
      stage: 'Relocation Planning',
      progress_percent: 70,
      visa_checklist: [
        { id: 'v1', task: 'Check visa requirements for Norway/EU', done: true },
        { id: 'v2', task: 'Collect official birth certificate & apostille', done: true },
        { id: 'v3', task: 'Obtain certified police background certificate', done: false },
        { id: 'v4', task: 'Submit visa registration fee ($160)', done: true },
        { id: 'v5', task: 'Schedule interview appointment at Embassy', done: false }
      ],
      moving_checklist: [
        { id: 'm1', task: 'Get international shipping quotes', done: true },
        { id: 'm2', task: 'Donate or sell excess furniture', done: false },
        { id: 'm3', task: 'Notify local tax office of relocation', done: false },
        { id: 'm4', task: 'Pack core luggage & document files', done: false }
      ],
      budget: [
        { id: 'b1', item: 'Visa Application Fee', category: 'Government', amount: 160, currency: 'USD', paid: true },
        { id: 'b2', item: 'Movers Relocation Quote', category: 'Logistics', amount: 1200, currency: 'USD', paid: false },
        { id: 'b3', item: 'Translation & Apostille Services', category: 'Legal', amount: 240, currency: 'USD', paid: true },
        { id: 'b4', item: 'Flight Tickets', category: 'Travel', amount: 650, currency: 'USD', paid: false }
      ],
      calendar: [
        { id: 'c1', title: 'Video Chat (Visa Q&A)', date: '2026-08-05', time: '19:00' },
        { id: 'c2', title: 'Submit Visa File', date: '2026-08-12', time: '10:00' },
        { id: 'c3', title: 'Embassy Appointment', date: '2026-08-20', time: '09:00' }
      ],
      housing_search: [
        { id: 'h1', title: 'Cozy flat in Majorstuen, Oslo', rent: 14000, currency: 'NOK', rating: 4.8, notes: 'EV chargers and quiet street.' },
        { id: 'h2', title: 'Apartment near Grunerlokka, Oslo', rent: 16500, currency: 'NOK', rating: 4.5, notes: 'Spacious but higher noise rating.' }
      ],
      documents: [
        { id: 'd1', name: 'Valid Passport copy', status: 'approved' },
        { id: 'd2', name: 'Background Check certificate', status: 'pending' },
        { id: 'd3', name: 'Proof of Financial Maintenance', status: 'uploaded' }
      ]
    };
    return mockJourney;
  },

  async saveRelationshipJourney(userId: string, partnerId: string, journey: any): Promise<void> {
    const d1 = getD1();
    const id = journey.id || `j_${userId}_${partnerId}`;
    if (d1) {
      await d1.prepare(
        "INSERT INTO relationship_journeys (id, user_id, partner_id, stage, progress_percent, visa_checklist_json, moving_checklist_json, budget_json, calendar_json, housing_search_json, documents_json) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) " +
        "ON CONFLICT(id) DO UPDATE SET stage = excluded.stage, progress_percent = excluded.progress_percent, visa_checklist_json = excluded.visa_checklist_json, moving_checklist_json = excluded.moving_checklist_json, budget_json = excluded.budget_json, calendar_json = excluded.calendar_json, housing_search_json = excluded.housing_search_json, documents_json = excluded.documents_json, updated_at = CURRENT_TIMESTAMP"
      ).bind(
        id,
        journey.user_id || userId,
        journey.partner_id || partnerId,
        journey.stage || 'Discovery',
        journey.progress_percent || 0,
        journey.visa_checklist ? JSON.stringify(journey.visa_checklist) : '[]',
        journey.moving_checklist ? JSON.stringify(journey.moving_checklist) : '[]',
        journey.budget ? JSON.stringify(journey.budget) : '[]',
        journey.calendar ? JSON.stringify(journey.calendar) : '[]',
        journey.housing_search ? JSON.stringify(journey.housing_search) : '[]',
        journey.documents ? JSON.stringify(journey.documents) : '[]'
      ).run();
    }
  },

  // --- Private Photo Permissions ---
  async getPrivatePhotoPermission(ownerId: string, requesterId: string): Promise<any> {
    const d1 = getD1();
    if (d1) {
      return await d1.prepare(
        "SELECT * FROM private_photo_permissions WHERE owner_id = ? AND requester_id = ?"
      ).bind(ownerId, requesterId).first();
    }
    return {
      owner_id: ownerId,
      requester_id: requesterId,
      status: 'approved',
      expires_at: new Date(Date.now() + 86400000 * 7).toISOString()
    };
  },

  async hasEstablishedContact(userId: string, partnerId: string): Promise<boolean> {
    const d1 = getD1();
    if (d1) {
      const result = await d1.prepare(
        "SELECT 1 FROM messages WHERE (sender_id = ? AND recipient_id = ?) OR (sender_id = ? AND recipient_id = ?) LIMIT 1"
      ).bind(userId, partnerId, partnerId, userId).first();
      return !!result;
    }
    return true;
  },

  async updatePrivatePhotoPermission(ownerId: string, requesterId: string, status: string, expiresAt?: string): Promise<void> {
    const d1 = getD1();
    const id = `perm_${ownerId}_${requesterId}`;
    if (d1) {
      await d1.prepare(
        "INSERT INTO private_photo_permissions (id, owner_id, requester_id, status, expires_at) VALUES (?, ?, ?, ?, ?) " +
        "ON CONFLICT(id) DO UPDATE SET status = excluded.status, expires_at = excluded.expires_at"
      ).bind(id, ownerId, requesterId, status, expiresAt || null).run();
    }
  },

  // --- Video Introductions ---
  async getVideoIntroduction(userId: string): Promise<any | null> {
    const d1 = getD1();
    if (d1) {
      return await d1.prepare("SELECT * FROM video_introductions WHERE user_id = ?").bind(userId).first();
    }
    return {
      user_id: userId,
      video_url: '/mock_video_intro.mp4',
      caption: 'Hi there! Looking to connect and plan a future together.',
      duration_seconds: 45
    };
  },

  async saveVideoIntroduction(userId: string, videoUrl: string, caption: string): Promise<void> {
    const d1 = getD1();
    if (d1) {
      await d1.prepare(
        "INSERT INTO video_introductions (user_id, video_url, caption, duration_seconds) VALUES (?, ?, ?, 30) " +
        "ON CONFLICT(user_id) DO UPDATE SET video_url = excluded.video_url, caption = excluded.caption"
      ).bind(userId, videoUrl, caption).run();
    }
  },

  // --- Voice Introductions ---
  async getVoiceIntroduction(userId: string): Promise<any | null> {
    const d1 = getD1();
    if (d1) {
      return await d1.prepare("SELECT * FROM voice_introductions WHERE user_id = ?").bind(userId).first();
    }
    return {
      user_id: userId,
      voice_url: '/mock_voice_intro.mp3',
      transcript: 'Hello, looking forward to starting this journey with you!',
      duration_seconds: 15
    };
  },

  async saveVoiceIntroduction(userId: string, voiceUrl: string, transcript: string): Promise<void> {
    const d1 = getD1();
    if (d1) {
      await d1.prepare(
        "INSERT INTO voice_introductions (user_id, voice_url, transcript, duration_seconds) VALUES (?, ?, ?, 15) " +
        "ON CONFLICT(user_id) DO UPDATE SET voice_url = excluded.voice_url, transcript = excluded.transcript"
      ).bind(userId, voiceUrl, transcript).run();
    }
  },

  // --- Professional Verification ---
  async getProfessionalVerification(userId: string): Promise<any | null> {
    const d1 = getD1();
    if (d1) {
      return await d1.prepare("SELECT * FROM professional_verifications WHERE user_id = ?").bind(userId).first();
    }
    return {
      user_id: userId,
      verification_type: 'Income & Identity Check',
      status: 'verified',
      verified_by: 'Sherlock Compliance Inc',
      details: JSON.stringify({ verifiedIncome: '$120k/yr', degreeChecked: 'M.Sc. Computer Science' }),
      verified_at: new Date().toISOString()
    };
  },

  async saveProfessionalVerification(userId: string, verificationType: string, status: string, details: string): Promise<void> {
    const d1 = getD1();
    if (d1) {
      await d1.prepare(
        "INSERT INTO professional_verifications (user_id, verification_type, status, details, verified_at) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP) " +
        "ON CONFLICT(user_id) DO UPDATE SET verification_type = excluded.verification_type, status = excluded.status, details = excluded.details"
      ).bind(userId, verificationType, status, details).run();
    }
  },

  async isUserPremium(userId: string): Promise<boolean> {
    const user = await this.getUser(userId);
    if (!user || user.subscription !== "Premium") {
      return false;
    }
    if (user.stripe_renewal_date) {
      const renewalDate = new Date(user.stripe_renewal_date);
      if (renewalDate.getTime() <= Date.now()) {
        return false;
      }
    }
    return true;
  },

  async isDemoMode(): Promise<boolean> {
    const envVal = process.env.DEMO_MODE || process.env.NEXT_PUBLIC_DEMO_MODE;
    if (envVal !== undefined) {
      return envVal === 'true';
    }
    const d1 = getD1();
    if (d1) {
      try {
        const res = await d1.prepare("SELECT COUNT(*) as count FROM users").first() as { count: number } | null;
        if (res && res.count > 5) {
          return false;
        }
      } catch (e) {
        console.error("[isDemoMode DB check failed]", e);
      }
    }
    return true;
  }
};
