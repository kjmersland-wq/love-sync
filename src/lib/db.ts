// Stubs for legacy real estate data models to prevent Turbopack compilation errors
export interface Country { id: string; name: string; slug: string; }
export interface Neighborhood { id: string; name: string; slug: string; }
export interface City { id: string; name: string; slug: string; country: string; neighborhoods: Neighborhood[]; }
export interface Property { id: string; name: string; slug: string; price: number; bedrooms: number; type: string; city: string; neighborhood: string; evReady: boolean; parking: boolean; noiseRating: string; amenities: string[]; }

export const countries: Country[] = [];
export const cities: City[] = [];
export const properties: Property[] = [];

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
  }
};
