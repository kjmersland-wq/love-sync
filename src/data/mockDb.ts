export interface VerificationStatus {
  email: boolean;
  phone: boolean;
  photo: boolean;
  id: boolean;
}

export interface CompatibilityCategories {
  familyGoals: number; // 0-100
  lifestyle: number;   // 0-100
  personality: number; // 0-100
  values: number;      // 0-100
  interests: number;   // 0-100
  distance: number;    // 0-100 (closer is higher score)
  age: number;         // 0-100 (aligned age is higher score)
}

export interface ProfileDetails {
  introduction: string;
  lifestyleText: string;
  valuesText: string;
  goalsText: string;
  interestsText: string;
  relationshipExpectations: string;
}

export interface RelationshipProfile {
  id: string;
  name: string;
  age: number;
  gender: string;
  occupation: string;
  education: string;
  languages: string[];
  location: string;
  country: string;
  distanceKm: number;
  image: string; // SVG inline data or custom CSS gradient selector
  verification: VerificationStatus;
  categories: CompatibilityCategories;
  details: ProfileDetails;
  whyMatchEn: string;
  whyMatchNo: string;
  whyMatchPl: string;
}

export interface SystemReport {
  id: string;
  user: string;
  reporter: string;
  reason: string;
  timestamp: string;
  status: 'Pending' | 'Resolved';
}

export interface VerificationRequest {
  id: string;
  name: string;
  type: 'Photo' | 'ID';
  status: 'Pending' | 'Approved' | 'Rejected';
  timestamp: string;
}

// Minimalist, premium SVG avatars using gradients
export const avatarSVGs = {
  sofia: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="gSofia" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#fda4af"/><stop offset="100%" stop-color="#f43f5e"/></linearGradient></defs><rect width="100" height="100" rx="30" fill="url(#gSofia)"/><circle cx="50" cy="40" r="18" fill="#ffffff" opacity="0.9"/><path d="M25 78 C25 60, 75 60, 75 78" fill="#ffffff" opacity="0.9"/></svg>`,
  magnus: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="gMagnus" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#93c5fd"/><stop offset="100%" stop-color="#2563eb"/></linearGradient></defs><rect width="100" height="100" rx="30" fill="url(#gMagnus)"/><circle cx="50" cy="38" r="16" fill="#ffffff" opacity="0.9"/><path d="M28 75 C28 58, 72 58, 72 75" fill="#ffffff" opacity="0.9"/></svg>`,
  elena: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="gElena" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#d8b4fe"/><stop offset="100%" stop-color="#7c3aed"/></linearGradient></defs><rect width="100" height="100" rx="30" fill="url(#gElena)"/><circle cx="50" cy="42" r="17" fill="#ffffff" opacity="0.9"/><path d="M26 80 C26 62, 74 62, 74 80" fill="#ffffff" opacity="0.9"/></svg>`,
  liam: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="gLiam" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#86efac"/><stop offset="100%" stop-color="#059669"/></linearGradient></defs><rect width="100" height="100" rx="30" fill="url(#gLiam)"/><circle cx="50" cy="38" r="15" fill="#ffffff" opacity="0.9"/><path d="M30 74 C30 56, 70 56, 70 74" fill="#ffffff" opacity="0.9"/></svg>`,
  chloe: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="gChloe" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#fde047"/><stop offset="100%" stop-color="#eab308"/></linearGradient></defs><rect width="100" height="100" rx="30" fill="url(#gChloe)"/><circle cx="50" cy="40" r="18" fill="#ffffff" opacity="0.9"/><path d="M24 77 C24 59, 76 59, 76 77" fill="#ffffff" opacity="0.9"/></svg>`,
  matteo: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="gMatteo" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#fdba74"/><stop offset="100%" stop-color="#ea580c"/></linearGradient></defs><rect width="100" height="100" rx="30" fill="url(#gMatteo)"/><circle cx="50" cy="37" r="16" fill="#ffffff" opacity="0.9"/><path d="M27 75 C27 58, 73 58, 73 75" fill="#ffffff" opacity="0.9"/></svg>`,
  astrid: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="gAstrid" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#a5f3fc"/><stop offset="100%" stop-color="#0891b2"/></linearGradient></defs><rect width="100" height="100" rx="30" fill="url(#gAstrid)"/><circle cx="50" cy="39" r="17" fill="#ffffff" opacity="0.9"/><path d="M25 76 C25 58, 75 58, 75 76" fill="#ffffff" opacity="0.9"/></svg>`,
  user: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="gUser" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#e2e8f0"/><stop offset="100%" stop-color="#64748b"/></linearGradient></defs><rect width="100" height="100" rx="30" fill="url(#gUser)"/><circle cx="50" cy="38" r="17" fill="#ffffff" opacity="0.9"/><path d="M26 77 C26 60, 74 60, 74 77" fill="#ffffff" opacity="0.9"/></svg>`
};

export const mockProfiles: RelationshipProfile[] = [
  {
    id: "sofia",
    name: "Sofia",
    age: 28,
    gender: "Female",
    occupation: "Architect & Spatial Designer",
    education: "Master of Architecture (ETSAM)",
    languages: ["Spanish", "English", "Italian"],
    location: "Malaga, Spain",
    country: "Spain",
    distanceKm: 14,
    image: avatarSVGs.sofia,
    verification: { email: true, phone: true, photo: true, id: true },
    categories: {
      familyGoals: 85,
      lifestyle: 90,
      personality: 75,
      values: 88,
      interests: 92,
      distance: 95,
      age: 98
    },
    details: {
      introduction: "Passionate about creating clean, light-filled spaces. Outside of work, I practice yoga, sketch historical alleys, and love ocean sailing.",
      lifestyleText: "Early riser, non-smoker, cycles everywhere. Enjoys clean eating, weekend trips, and values getting 8 hours of sleep.",
      valuesText: "Honesty and constant self-development. I appreciate deep conversations and emotional vulnerability.",
      goalsText: "Looking to establish a long-term, supportive connection, open to marriage and raising kids in a creative environment.",
      interestsText: "Design, outdoor drawing, hiking, coastal sailing, and exploring local farm-to-table restaurants.",
      relationshipExpectations: "Mutual growth, respect for personal space, and active communication."
    },
    whyMatchEn: "You both share a deep appreciation for active lifestyles, outdoor activities, and prioritize clear, direct communication.",
    whyMatchNo: "Dere deler begge en stor glede for en aktiv livsstil, utendørsaktiviteter, og prioriterer klar og direkte kommunikasjon.",
    whyMatchPl: "Oboje cenicie aktywny styl życia, spędzanie czasu na świeżym powietrzu oraz jasną i bezpośrednią komunikację."
  },
  {
    id: "magnus",
    name: "Magnus",
    age: 32,
    gender: "Male",
    occupation: "Marine Biologist",
    education: "PhD in Marine Ecology (NTNU)",
    languages: ["Norwegian", "English", "German"],
    location: "Oslo, Norway",
    country: "Norway",
    distanceKm: 85,
    image: avatarSVGs.magnus,
    verification: { email: true, phone: true, photo: true, id: false },
    categories: {
      familyGoals: 95,
      lifestyle: 82,
      personality: 85,
      values: 92,
      interests: 80,
      distance: 70,
      age: 90
    },
    details: {
      introduction: "Ocean researcher who finds peace in quiet fjords. Spending my winters cross-country skiing and summers navigating the archipelago.",
      lifestyleText: "Active athlete, occasional craft beer enthusiast. Enjoys preparing homemade seafood and reads scientific journals before bed.",
      valuesText: "Loyalty, ecological responsibility, and Scandinavian minimalism. Quiet honesty over loud statements.",
      goalsText: "Wants to build a stable home base. Marriage-oriented, loves kids, plans to build an eco-friendly cabin.",
      interestsText: "Sailing, diving, skiing, acoustic guitar, historical biographies, and woodworking.",
      relationshipExpectations: "A steady, trust-based partner who values nature, silence, and deep loyalty."
    },
    whyMatchEn: "Your family goals and core values align perfectly. You both seek a slow-paced, trust-filled partnership.",
    whyMatchNo: "Dine familiemål og kjerneverdier stemmer perfekt overens. Begge søker et rolig, tillitsbasert partnerskap.",
    whyMatchPl: "Wasze cele rodzinne i kluczowe wartości są w pełni zgodne. Oboje szukacie spokojnego związku opartego na zaufaniu."
  },
  {
    id: "elena",
    name: "Elena",
    age: 31,
    gender: "Female",
    occupation: "Senior UX Researcher",
    education: "MSc in Cognitive Science (UW)",
    languages: ["Polish", "English", "French"],
    location: "Warsaw, Poland",
    country: "Poland",
    distanceKm: 320,
    image: avatarSVGs.elena,
    verification: { email: true, phone: true, photo: false, id: false },
    categories: {
      familyGoals: 70,
      lifestyle: 85,
      personality: 90,
      values: 80,
      interests: 88,
      distance: 50,
      age: 95
    },
    details: {
      introduction: "Curious mind studying human behaviors. Lover of cinema, mid-century furniture, and exploring new culinary spots in Praga-Północ.",
      lifestyleText: "Enjoys lively social settings, drinking specialty coffee, and maintains a strict fitness routine. Introverted explorer.",
      valuesText: "Intellectual honesty, open-mindedness, and emotional independence.",
      goalsText: "Looking to co-create a modern, equal relationship. Undecided on kids, open to exploring relocation options.",
      interestsText: "Alternative cinema, modern art, interior styling, indoor bouldering, and French literature.",
      relationshipExpectations: "Equal partnership, stimulating debates, and continuous mutual inspiration."
    },
    whyMatchEn: "You both balance social appreciation with an analytical mindset, showing high compatibility in personality traits.",
    whyMatchNo: "Dere balanserer begge det sosiale med et analytisk tankesett, og viser høy personlighetskompatibilitet.",
    whyMatchPl: "Oboje łączycie życie towarzyskie z analitycznym umysłem, wykazując wysoką zgodność cech osobowości."
  },
  {
    id: "liam",
    name: "Liam",
    age: 29,
    gender: "Male",
    occupation: "Machine Learning Engineer",
    education: "BSc in Computer Science (TUM)",
    languages: ["German", "English"],
    location: "Munich, Germany",
    country: "Germany",
    distanceKm: 520,
    image: avatarSVGs.liam,
    verification: { email: true, phone: false, photo: true, id: true },
    categories: {
      familyGoals: 60,
      lifestyle: 95,
      personality: 70,
      values: 85,
      interests: 90,
      distance: 40,
      age: 96
    },
    details: {
      introduction: "Tech enthusiast who enjoys tinkering with robotics, drinking espresso, and going for long runs in English Garden.",
      lifestyleText: "Structured routines, vegan diet, strictly non-smoker. Likes to spend evenings playing cooperative puzzle games or reading sci-fi.",
      valuesText: "Transparency, ecological awareness, and logical problem solving.",
      goalsText: "Seeking a partner to travel the world with, co-work, and establish a modern lifestyle. No immediate desire for kids.",
      interestsText: "Gaming, programming, bouldering, specialty coffee, cycling, and electronic music production.",
      relationshipExpectations: "Clear communication, shared creative interests, and flat hierarchies in relation choices."
    },
    whyMatchEn: "You share an interest in technology, structured routines, and vegan/vegetarian lifestyle factors.",
    whyMatchNo: "Dere deler en interesse for teknologi, strukturerte rutiner og vegansk/vegetarisk livsstil.",
    whyMatchPl: "Dzielicie pasję do technologii, ustrukturyzowanych nawyków oraz wegańskiego/wegetariańskiego stylu życia."
  },
  {
    id: "chloe",
    name: "Chloe",
    age: 27,
    gender: "Female",
    occupation: "Art Gallery Curator",
    education: "MA in Art History (Sorbonne)",
    languages: ["French", "English", "Spanish"],
    location: "Paris, France",
    country: "France",
    distanceKm: 850,
    image: avatarSVGs.chloe,
    verification: { email: true, phone: true, photo: true, id: true },
    categories: {
      familyGoals: 50,
      lifestyle: 75,
      personality: 88,
      values: 90,
      interests: 95,
      distance: 30,
      age: 94
    },
    details: {
      introduction: "Surrounded by modern paintings and historical sculptures. I spend my days setting up exhibitions and nights attending gallery openings.",
      lifestyleText: "Night owl, enjoys fine dining and Parisian coffee shops. Practices pilates and spends summers in Southern France.",
      valuesText: "Creative expression, freedom, absolute loyalty, and elegant presentation.",
      goalsText: "Looking for a lifelong muse and equal partner to explore cultural hubs worldwide.",
      interestsText: "Photography, visiting museums, fashion, classical concerts, and collecting vintage vinyls.",
      relationshipExpectations: "Inspiring conversations, emotional support, and shared wanderlust."
    },
    whyMatchEn: "Highly compatible in values and artistic interests. You both view life through a creative lens.",
    whyMatchNo: "Svært kompatibel i verdier og kunstneriske interesser. Begge ser livet gjennom en kreativ linse.",
    whyMatchPl: "Wysoka zgodność w kwestii wartości i zainteresowań artystycznych. Oboje patrzycie na świat przez pryzmat kreatywności."
  },
  {
    id: "matteo",
    name: "Matteo",
    age: 34,
    gender: "Male",
    occupation: "Michelin Restaurant Chef",
    education: "Culinary Arts Institute of Italy",
    languages: ["Italian", "French", "English"],
    location: "Rome, Italy",
    country: "Italy",
    distanceKm: 1200,
    image: avatarSVGs.matteo,
    verification: { email: true, phone: true, photo: false, id: false },
    categories: {
      familyGoals: 98,
      lifestyle: 80,
      personality: 78,
      values: 95,
      interests: 85,
      distance: 25,
      age: 82
    },
    details: {
      introduction: "Food is my language of love. I express myself through crafting menus and hosting long Sunday dinners with family.",
      lifestyleText: "Early nights, busy weekend schedules, loves cooking with fresh ingredients. Passionate hiker.",
      valuesText: "Loyalty, strong family foundations, respect for tradition, and deep integrity.",
      goalsText: "Wants a large family, traditional marriage, and to open a cozy countryside bed & breakfast.",
      interestsText: "Cooking, organic gardening, local wines, hiking in the Dolomites, and restoring vintage vespas.",
      relationshipExpectations: "Warmth, willingness to build a family unit, and appreciation for home-cooked meals."
    },
    whyMatchEn: "A strong match on family expectations and loyalty values. Excellent compatibility for building a home together.",
    whyMatchNo: "Sterk match på familieforventninger og lojalitet. Utmerket kompatibilitet for å bygge et hjem sammen.",
    whyMatchPl: "Silne dopasowanie w obszarze oczekiwań rodzinnych i lojalności. Znakomity punkt wyjścia do budowy wspólnego domu."
  },
  {
    id: "astrid",
    name: "Astrid",
    age: 30,
    gender: "Female",
    occupation: "Green Energy Project Lead",
    education: "MSc in Sustainable Energy (DTU)",
    languages: ["Danish", "English", "Norwegian"],
    location: "Copenhagen, Denmark",
    country: "Denmark",
    distanceKm: 420,
    image: avatarSVGs.astrid,
    verification: { email: true, phone: true, photo: true, id: true },
    categories: {
      familyGoals: 80,
      lifestyle: 92,
      personality: 85,
      values: 90,
      interests: 84,
      distance: 60,
      age: 95
    },
    details: {
      introduction: "Working towards a carbon-neutral planet. Love to spend my weekends cycling along the Danish coastline or ocean swimming.",
      lifestyleText: "Active and balanced, early riser, cycles to work. Vegetarian, enjoys home brewing kombucha and quiet nights reading.",
      valuesText: "Sustainability, egalitarian relationship model, transparency, and social justice.",
      goalsText: "Looking to co-create a slow-paced, low-impact lifestyle. Wants a close-knit family environment.",
      interestsText: "Cycling, swimming, sustainable fashion, reading, climate science, and baking sourdough bread.",
      relationshipExpectations: "Honest communication, shared environmental ethics, and support for career ambitions."
    },
    whyMatchEn: "You both value sustainability, active commutes, and share a high alignment on personal lifestyle parameters.",
    whyMatchNo: "Dere verdsetter begge bærekraft, en aktiv hverdag og har høy grad av livsstilskompatibilitet.",
    whyMatchPl: "Oboje cenicie zrównoważony rozwój, aktywność fizyczną oraz wykazujecie dużą zgodność w nawykach życiowych."
  }
];

// Initial mock chat messages
export interface MessageItem {
  id: string;
  senderId: 'user' | string;
  text: string;
  translatedText?: string;
  timestamp: string;
  read: boolean;
}

export const initialMessages: { [profileId: string]: MessageItem[] } = {
  sofia: [
    { id: "m1", senderId: "sofia", text: "Hola! I saw that we matched with 92% compatibility. I love your perspective on clean design and quiet travel.", timestamp: "2026-08-01T10:15:00Z", read: true },
    { id: "m2", senderId: "user", text: "Hi Sofia! Thank you. I was really impressed by your spatial design portfolio. Where do you usually go sailing?", timestamp: "2026-08-01T10:30:00Z", read: true },
    { id: "m3", senderId: "sofia", text: "Usually around the bay of Malaga and occasionally towards Nerja. The wind here is perfect during the afternoon. Do you have any sailing experience?", timestamp: "2026-08-01T10:45:00Z", read: false }
  ],
  magnus: [
    { id: "m4", senderId: "magnus", text: "Hei, hyggelig å matche med deg. Ser at du også setter pris på skogens ro og skiturer om vinteren.", timestamp: "2026-07-31T18:00:00Z", read: true, translatedText: "Hi, nice to match with you. I see you also appreciate the forest's silence and ski trips in the winter." }
  ],
  elena: []
};

// Initial admin moderation reports
export const mockReports: SystemReport[] = [
  { id: "r1", user: "John Doe (Suspicious User)", reporter: "Emma Watson", reason: "Attempted to ask for phone number and cryptocurrency link within 3 messages.", timestamp: "2026-08-01T12:00:00Z", status: "Pending" },
  { id: "r2", user: "Bot492", reporter: "Sofia", reason: "Spamming copy-pasted web links.", timestamp: "2026-08-01T14:22:00Z", status: "Pending" }
];

// Initial verification queue
export const mockVerifications: VerificationRequest[] = [
  { id: "v1", name: "Sofia", type: "ID", status: "Pending", timestamp: "2026-08-01T11:45:00Z" },
  { id: "v2", name: "Matteo", type: "Photo", status: "Pending", timestamp: "2026-08-01T13:10:00Z" }
];

// Stub for legacy Next Place Living cost data
export const getCostComparisonData = (citySlug?: string) => [
  { name: 'Apartment Rent (1 Bed)', category: 'Housing', osloPriceNok: 15000, localPriceNok: 8000 },
  { name: 'Meal in Inexpensive Restaurant', category: 'Food', osloPriceNok: 220, localPriceNok: 100 },
  { name: 'Monthly Public Transport Pass', category: 'Transport', osloPriceNok: 850, localPriceNok: 350 }
];

export const properties: any[] = [];
export const cities: any[] = [];
export const countries: any[] = [];
export const exchangeRates: Record<string, number> = { USD: 1, EUR: 0.9, NOK: 10 };
export const currencySymbols: Record<string, string> = { USD: '$', EUR: '€', NOK: 'kr' };

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
