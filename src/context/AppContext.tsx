'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  RelationshipProfile, 
  VerificationStatus, 
  mockProfiles, 
  initialMessages, 
  mockReports, 
  mockVerifications, 
  MessageItem,
  SystemReport,
  VerificationRequest
} from '../data/mockDb';
import { paymentService } from '../lib/payments/paymentService';
import { PaymentProviderName, Invoice, WebhookEventType } from '../lib/payments/types';
import { PremiumModal } from '../components/PremiumModal';

export interface MatchingWeights {
  familyGoals: number;
  lifestyle: number;
  personality: number;
  values: number;
  interests: number;
  distance: number;
  age: number;
}

interface AppContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  
  // User Profile and Status
  userProfile: {
    name: string;
    age: number;
    gender: string;
    location: string;
    subscription: 'Not Subscribed' | 'Premium';
    verification: VerificationStatus;
  };
  upgradeSubscription: (planId?: string, amount?: number) => Promise<{ transactionId: string; checkoutUrl: string }>;
  cancelActiveSubscription: () => Promise<void>;
  setVerificationField: (field: keyof VerificationStatus, value: boolean) => void;
  
  // Pluggable Payments
  activePaymentProvider: PaymentProviderName;
  setActivePaymentProvider: (provider: PaymentProviderName) => void;
  invoices: Invoice[];
  generateMockWebhook: (type: WebhookEventType) => void;
  
  // Weights configuration
  weights: MatchingWeights;
  updateWeight: (key: keyof MatchingWeights, value: number) => void;
  
  // Matches List and Computation
  profiles: RelationshipProfile[];
  calculateOverallScore: (profile: RelationshipProfile) => number;
  savedProfileIds: string[];
  toggleSaveProfile: (profileId: string) => void;
  
  // Messaging
  chatThreads: { [profileId: string]: MessageItem[] };
  activeChatId: string | null;
  setActiveChatId: (id: string | null) => void;
  sendMessage: (profileId: string, text: string) => void;
  translateMessage: (profileId: string, messageId: string) => void;
  getConversationStarter: (profileId: string, locale: string) => string;
  isTyping: { [profileId: string]: boolean };
  
  // Admin center
  reports: SystemReport[];
  verificationsQueue: VerificationRequest[];
  resolveReport: (id: string) => void;
  approveVerification: (id: string) => void;
  systemMetrics: {
    latency: number;
    dbOps: number;
    r2Bytes: number;
  };
  triggerModal: (title: string, description: string, type?: 'info' | 'error' | 'success' | 'warning') => void;

  // Legacy stubs
  formatPrice: (price: number, currency: string) => string;
  toggleFavorite: (typeOrId: string, id?: string) => void;
  isFavorite: (typeOrId: string, id?: string) => boolean;
  calculatePropertyMatchScore: (property: any) => number;
  toggleCompareProperty: (propertyId: string) => void;
  comparedProperties: string[];
  watchlist: string[];
  toggleWatchlist: (id: string) => void;
  isInWatchlist: (id: string) => boolean;
  propertyWeights: any;
  updatePropertyWeight: (key: string, val: number) => void;
  budgetLimit: number;
  comparedCities: string[];
  toggleCompareCity: (cityId: string) => void;
  neighborhoodWeights: any;
  updateNeighborhoodWeight: (key: string, val: number) => void;
  calculateNeighborhoodMatchScore: (neighborhood: any) => number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [userProfile, setUserProfile] = useState<{
    name: string;
    age: number;
    gender: string;
    location: string;
    subscription: 'Not Subscribed' | 'Premium';
    verification: VerificationStatus;
  }>({
    name: "Alex",
    age: 30,
    gender: "Male",
    location: "Oslo, Norway",
    subscription: "Not Subscribed",
    verification: { email: true, phone: false, photo: false, id: false }
  });

  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    type: 'info' | 'error' | 'success' | 'warning';
  }>({
    isOpen: false,
    title: '',
    description: '',
    type: 'info'
  });

  const triggerModal = (
    title: string,
    description: string,
    type: 'info' | 'error' | 'success' | 'warning' = 'info'
  ) => {
    setModalConfig({ isOpen: true, title, description, type });
  };

  const [activePaymentProvider, setActivePaymentProviderState] = useState<PaymentProviderName>('paddle');
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  // Weights that default to summing to 100
  const [weights, setWeights] = useState<MatchingWeights>({
    familyGoals: 25,
    lifestyle: 20,
    personality: 20,
    values: 15,
    interests: 10,
    distance: 5,
    age: 5
  });

  const [profiles, setProfiles] = useState<RelationshipProfile[]>(mockProfiles);
  const [savedProfileIds, setSavedProfileIds] = useState<string[]>([]);
  const [chatThreads, setChatThreads] = useState<{ [profileId: string]: MessageItem[] }>(initialMessages);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState<{ [profileId: string]: boolean }>({});
  
  // Admin elements
  const [reports, setReports] = useState<SystemReport[]>(mockReports);
  const [verificationsQueue, setVerificationsQueue] = useState<VerificationRequest[]>(mockVerifications);
  const [systemMetrics, setSystemMetrics] = useState({
    latency: 12, // ms
    dbOps: 1540,
    r2Bytes: 42000000 // 42MB
  });

  // Load from local storage and API on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Theme
      const storedTheme = localStorage.getItem('ls_theme') as 'light' | 'dark' | null;
      if (storedTheme) {
        setTheme(storedTheme);
        document.documentElement.classList.toggle('dark', storedTheme === 'dark');
      } else {
        document.documentElement.classList.add('dark');
      }

      // User profile (fallback to localStorage, then sync with D1)
      const storedProfile = localStorage.getItem('ls_user_profile');
      if (storedProfile) setUserProfile(JSON.parse(storedProfile));

      const loadProfile = async () => {
        try {
          const res = await fetch("/api/user/profile");
          if (res.ok) {
            const data = await res.json();
            if (data.success && data.profile) {
              const syncedProfile = {
                name: data.profile.name || "Alex",
                age: data.profile.age || 30,
                gender: data.profile.gender || "Male",
                location: data.profile.location || "Oslo, Norway",
                subscription: data.profile.subscription || "Not Subscribed",
                verification: { email: true, phone: false, photo: false, id: false }
              };
              setUserProfile(syncedProfile);
              localStorage.setItem('ls_user_profile', JSON.stringify(syncedProfile));
            }
          }
        } catch (e) {
          console.error("Failed to load user profile from D1:", e);
        }
      };
      loadProfile();

      // Active provider
      const storedProvider = localStorage.getItem('ls_active_payment_provider') as PaymentProviderName | null;
      if (storedProvider) {
        setActivePaymentProviderState(storedProvider);
        paymentService.setActiveProvider(storedProvider);
      }

      // Weights
      const storedWeights = localStorage.getItem('ls_weights');
      if (storedWeights) setWeights(JSON.parse(storedWeights));

      // Saved profiles
      const storedSaved = localStorage.getItem('ls_saved_profiles');
      if (storedSaved) setSavedProfileIds(JSON.parse(storedSaved));

      // Chats
      const storedChats = localStorage.getItem('ls_chats');
      if (storedChats) setChatThreads(JSON.parse(storedChats));
    }
  }, []);

  // Fetch invoices for active payment provider
  useEffect(() => {
    const loadInvoices = async () => {
      try {
        const res = await fetch("/api/paddle/invoices");
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setInvoices(data.invoices || []);
          } else {
            const history = await paymentService.getInvoiceHistory('user_123', activePaymentProvider);
            setInvoices(history);
          }
        } else {
          const history = await paymentService.getInvoiceHistory('user_123', activePaymentProvider);
          setInvoices(history);
        }
      } catch (e) {
        const history = await paymentService.getInvoiceHistory('user_123', activePaymentProvider);
        setInvoices(history);
      }
    };
    loadInvoices();
  }, [activePaymentProvider, userProfile.subscription]);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('ls_theme', nextTheme);
    document.documentElement.classList.toggle('dark', nextTheme === 'dark');
  };

  const setActivePaymentProvider = (provider: PaymentProviderName) => {
    setActivePaymentProviderState(provider);
    paymentService.setActiveProvider(provider);
    localStorage.setItem('ls_active_payment_provider', provider);
  };

  // Provider agnostic checkout integration
  const upgradeSubscription = async (
    planId: string = "monthly_plan",
    amount: number = 14.99
  ): Promise<{ transactionId: string; checkoutUrl: string }> => {
    const res = await fetch("/api/paddle/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ planId, amount })
    });
    
    if (!res.ok) {
      throw new Error(`HTTP error ${res.status}: Failed to create checkout session`);
    }

    let data;
    try {
      data = await res.json();
    } catch (e) {
      throw new Error("Invalid server response format (expected JSON, received HTML/text)");
    }

    if (!data.success) {
      throw new Error(data.error || "Failed to create checkout session");
    }
    
    setSystemMetrics((prev) => ({ ...prev, dbOps: prev.dbOps + 1 }));
    return {
      transactionId: data.transactionId,
      checkoutUrl: data.checkoutUrl
    };
  };

  const cancelActiveSubscription = async () => {
    const res = await fetch("/api/paddle/cancel", { method: "POST" });
    if (!res.ok) {
      throw new Error(`HTTP error ${res.status}: Failed to cancel subscription`);
    }

    let data;
    try {
      data = await res.json();
    } catch (e) {
      throw new Error("Invalid server response format (expected JSON, received HTML/text)");
    }

    if (!data.success) {
      throw new Error(data.error || "Failed to cancel subscription");
    }
    // Refresh user profile after cancellation
    const profileRes = await fetch("/api/user/profile");
    if (profileRes.ok) {
      const pData = await profileRes.json();
      if (pData.success && pData.profile) {
        const updatedProfile = {
          ...userProfile,
          subscription: pData.profile.subscription
        };
        setUserProfile(updatedProfile);
        localStorage.setItem('ls_user_profile', JSON.stringify(updatedProfile));
      }
    }
  };

  // Mock Webhook Generator - demonstrates business logic isolation from webhooks!
  const generateMockWebhook = (type: WebhookEventType) => {
    // Generate event ID (held constant for testing idempotency double-dispatch)
    const eventId = `evt_webhook_test_99999`;

    const mockHeaders: Record<string, string> = {
      'content-type': 'application/json',
      'stripe-signature': 'mock_signature_from_cloudflare_waf',
      'paddle-signature': 't=1610000000;h1=sandbox_bypass' // Matches Web Crypto sandbox bypass rule
    };

    // Construct mock raw JSON payloads depending on the active provider
    let mockPayload: any = {};
    if (activePaymentProvider === 'stripe') {
      mockPayload = {
        id: eventId,
        type: type === 'subscription.created' ? 'customer.subscription.created' : 
              type === 'subscription.renewed' ? 'customer.subscription.updated' : 'customer.subscription.deleted',
        data: {
          object: {
            id: 'sub_stripe_abc123',
            amount_due: 1900,
            currency: 'usd',
            metadata: { userId: 'user_123' }
          }
        }
      };
    } else if (activePaymentProvider === 'paypal') {
      mockPayload = {
        id: eventId,
        event_type: type === 'subscription.created' ? 'BILLING.SUBSCRIPTION.CREATED' :
                    type === 'subscription.renewed' ? 'BILLING.SUBSCRIPTION.RENEWED' : 'BILLING.SUBSCRIPTION.CANCELLED',
        resource: {
          id: 'I-PAYPALMOCK999',
          custom_id: 'user_123',
          amount: { total: '19.00', currency: 'USD' }
        }
      };
    } else if (activePaymentProvider === 'paddle') {
      // Paddle Billing v2 specific JSON payload format
      mockPayload = {
        event_id: eventId,
        event_type: type === 'subscription.created' ? 'subscription.created' :
                    type === 'subscription.renewed' ? 'subscription.updated' : 'subscription.canceled',
        occurred_at: new Date().toISOString(),
        data: {
          id: 'sub_paddle_123456',
          currency_code: 'USD',
          custom_data: { userId: 'user_123' },
          items: [
            {
              price: {
                unit_price: '1900' // cents
              }
            }
          ]
        }
      };
    } else {
      // General fallbacks for mollie, adyen, checkout.com
      mockPayload = {
        id: eventId,
        event: type === 'subscription.created' ? 'subscription_created' :
               type === 'subscription.renewed' ? 'subscription_renewed' : 'subscription_cancelled',
        customerId: 'user_123',
        subscriptionId: `sub_${activePaymentProvider}_xyz`,
        amount: { value: '19.00', currency: 'EUR' }
      };
    }

    const rawBody = JSON.stringify(mockPayload);

    // Call provider agnostic handleWebhookEvent!
    paymentService.handleWebhookEvent(mockHeaders, rawBody, activePaymentProvider)
      .then(normalizedEvent => {
        console.log(`[Payment Webhook Normalized] type=${normalizedEvent.type}, user=${normalizedEvent.userId}, provider=${normalizedEvent.provider}`);
        
        // Execute local business logic changes based on the isolated event
        if (normalizedEvent.type === 'subscription.created' || normalizedEvent.type === 'subscription.renewed') {
          setUserProfile(prev => {
            const nextProfile = { ...prev, subscription: 'Premium' as const };
            localStorage.setItem('ls_user_profile', JSON.stringify(nextProfile));
            return nextProfile;
          });

          // Add a new invoice from the webhook capture
          const newInvoice: Invoice = {
            id: `in_${activePaymentProvider}_${Math.floor(100000 + Math.random() * 900000)}`,
            date: new Date().toISOString(),
            amount: normalizedEvent.amount || 19.00,
            currency: normalizedEvent.currency || 'USD',
            status: 'paid',
            pdfUrl: `https://${activePaymentProvider}.com/mock-receipt.pdf`,
            provider: activePaymentProvider
          };

          setInvoices(prev => [newInvoice, ...prev]);
        } else if (normalizedEvent.type === 'subscription.cancelled') {
          setUserProfile(prev => {
            const nextProfile = { ...prev, subscription: 'Not Subscribed' as const };
            localStorage.setItem('ls_user_profile', JSON.stringify(nextProfile));
            return nextProfile;
          });
        }

        setSystemMetrics(prev => ({
          ...prev,
          dbOps: prev.dbOps + 1,
          latency: Math.floor(Math.random() * 6) + 4
        }));
      })
      .catch(err => {
        console.warn(`[Admin Webhook Simulation Catch] ${err.message}`);
        triggerModal(
          "Webhook Event Rejected",
          `Event simulation rejected by the payments layer logic: ${err.message}`,
          "warning"
        );
      });
  };

  const setVerificationField = (field: keyof VerificationStatus, value: boolean) => {
    const updatedProfile = {
      ...userProfile,
      verification: {
        ...userProfile.verification,
        [field]: value
      }
    };
    setUserProfile(updatedProfile);
    localStorage.setItem('ls_user_profile', JSON.stringify(updatedProfile));
  };

  const updateWeight = (key: keyof MatchingWeights, value: number) => {
    const newWeights = { ...weights, [key]: value };
    setWeights(newWeights);
    localStorage.setItem('ls_weights', JSON.stringify(newWeights));

    setSystemMetrics(prev => ({
      ...prev,
      latency: Math.floor(Math.random() * 5) + 8,
      dbOps: prev.dbOps + 1
    }));
  };

  const calculateOverallScore = (profile: RelationshipProfile): number => {
    const totalWeights = Object.values(weights).reduce((a, b) => a + b, 0);
    if (totalWeights === 0) return 0;

    // 1. Weighted Euclidean Compatibility (penalizes large single-attribute gaps)
    let weightedSquaredDiff = 0;
    const fields: Array<keyof MatchingWeights> = ['familyGoals', 'lifestyle', 'personality', 'values', 'interests', 'distance', 'age'];
    
    for (const field of fields) {
      const uWeight = weights[field];
      const vScore = profile.categories[field] || 0;
      weightedSquaredDiff += uWeight * Math.pow(100 - vScore, 2);
    }
    
    const meanSquaredDiff = weightedSquaredDiff / totalWeights;
    const euclideanCompatibility = 100 - Math.sqrt(meanSquaredDiff);

    // 2. Exponential Geographic Distance Decay
    const distanceKm = profile.distanceKm || 0;
    const distanceDecay = Math.exp(-distanceKm / 8000);

    // 3. Trust & Verification Multiplier (+2.5% per verified badge up to +10%)
    let verifiedCount = 0;
    if (profile.verification) {
      if (profile.verification.email) verifiedCount++;
      if (profile.verification.phone) verifiedCount++;
      if (profile.verification.photo) verifiedCount++;
      if (profile.verification.id) verifiedCount++;
    }
    const trustMultiplier = 1.0 + (0.025 * verifiedCount);

    // 4. Combined Score Bounds Mapping
    const finalScore = Math.round(euclideanCompatibility * distanceDecay * trustMultiplier);
    return Math.max(0, Math.min(100, finalScore));
  };

  const toggleSaveProfile = (profileId: string) => {
    let nextSaved = [...savedProfileIds];
    const index = nextSaved.indexOf(profileId);
    if (index === -1) {
      nextSaved.push(profileId);
    } else {
      nextSaved.splice(index, 1);
    }
    setSavedProfileIds(nextSaved);
    localStorage.setItem('ls_saved_profiles', JSON.stringify(nextSaved));
  };

  const sendMessage = (profileId: string, text: string) => {
    if (!text.trim()) return;

    const newMessage: MessageItem = {
      id: `msg-${Date.now()}`,
      senderId: 'user',
      text: text,
      timestamp: new Date().toISOString(),
      read: true
    };

    const updatedThread = [...(chatThreads[profileId] || []), newMessage];
    const updatedChats = { ...chatThreads, [profileId]: updatedThread };
    setChatThreads(updatedChats);
    localStorage.setItem('ls_chats', JSON.stringify(updatedChats));

    setSystemMetrics(prev => ({ ...prev, dbOps: prev.dbOps + 2 }));

    setIsTyping(prev => ({ ...prev, [profileId]: true }));
    setTimeout(() => {
      setIsTyping(prev => ({ ...prev, [profileId]: false }));
      
      const responses: { [key: string]: string } = {
        sofia: "That sounds wonderful! I'd love to chat more about this. We should definitely grab a coffee if we visit Malaga at the same time.",
        magnus: "Hyggelig svar. Naturen gir så mye ro, glad for at vi har samme syn på det. Kanskje vi kan planlegge en tur i helgen?",
        elena: "Interesting! I think compatibility is about having matching expectations and life paces. What are your current life goals?",
        liam: "Absolutely! Technology is such a great tool when used thoughtfully. Have you played any good puzzle games recently?",
        chloe: "C'est magnifique! Art connects people. Tell me, what was the last museum you visited?",
        matteo: "Grazie! Cooking connects the family. If you're ever in Rome, I'll cook you my signature carbonara.",
        astrid: "That's exactly it. High compatibility in values makes the everyday choices so much simpler. Let's keep exploring."
      };

      const replyText = responses[profileId] || "I agree! It's so nice to find someone who shares these exact preferences. Let's stay in touch.";
      
      const simulatedReply: MessageItem = {
        id: `msg-${Date.now() + 1}`,
        senderId: profileId,
        text: replyText,
        timestamp: new Date().toISOString(),
        read: false
      };

      setChatThreads(prevChats => {
        const nextChats = {
          ...prevChats,
          [profileId]: [...(prevChats[profileId] || []), simulatedReply]
        };
        localStorage.setItem('ls_chats', JSON.stringify(nextChats));
        return nextChats;
      });
    }, 2000);
  };

  const translateMessage = (profileId: string, messageId: string) => {
    setChatThreads(prevChats => {
      const thread = prevChats[profileId] || [];
      const nextThread = thread.map(msg => {
        if (msg.id === messageId) {
          return {
            ...msg,
            translatedText: msg.translatedText 
              ? undefined 
              : `[Translated] ${msg.text} (Translated into your display language)`
          };
        }
        return msg;
      });
      const nextChats = { ...prevChats, [profileId]: nextThread };
      localStorage.setItem('ls_chats', JSON.stringify(nextChats));
      return nextChats;
    });
  };

  const getConversationStarter = (profileId: string, locale: string): string => {
    const starters: { [key: string]: { [lang: string]: string } } = {
      sofia: {
        en: "I noticed you love sailing! Do you prefer coastal sailing or open ocean voyages?",
        no: "Jeg så at du elsker seiling! Foretrekker du kystseiling eller havseilas?",
        pl: "Zauważyłem, że uwielbiasz żeglarstwo! Wolisz żeglugę przybrzeżną czy dalekomorskie rejsy?"
      },
      magnus: {
        en: "Your marine research sounds fascinating. What fjord did you explore most recently?",
        no: "Marin forskning høres fascinerende ut. Hvilken fjord utforsket du sist?",
        pl: "Twoje badania morskie brzmią fascynująco. Który fiord ostatnio badałeś?"
      },
      elena: {
        en: "What kind of mid-century furniture is your favorite? I really like modular cabinets.",
        no: "Hvilken type mid-century møbler er din favoritt? Jeg liker modulære skap veldig godt.",
        pl: "Jaki jest Twój ububiony styl mebli z lat 50. i 60.? Bardzo lubię szafki modułowe."
      },
      liam: {
        en: "Vegan baking can be quite an art! Have you managed to make a perfect sourdough bread yet?",
        no: "Vegansk baking kan være litt av en kunst! Har du bakt det perfekte surdeigsbrødet ennå?",
        pl: "Wegańskie pieczenie to prawdziwa sztuka! Udało Ci się już upiec idealny chleb na zakwasie?"
      },
      chloe: {
        en: "Paris galleries must be inspiring. What exhibits are you curating this month?",
        no: "Gallerier i Paris må være inspirerende. Hvilke utstillinger kuraterer du denne måneden?",
        pl: "Paryskie galerie muszą być inspirujące. Jakie wystawy organizujesz w tym miesiącu?"
      },
      matteo: {
        en: "Restoring a vintage Vespa is a massive project! What year is yours from?",
        no: "Å restaurere en klassisk Vespa er et stort prosjekt! Hvilken årsmodell er din?",
        pl: "Renowacja klasycznej Vespy to ogromny projekt! Z którego roku pochodzi Twoja?"
      },
      astrid: {
        en: "Copenhagen is so bike-friendly. What's your favorite coastal cycling route?",
        no: "København er fantastisk for sykling. Hva er din favorittrute langs kysten?",
        pl: "Kopenhaga jest niesamowicie przyjazna rowerzystom. Jaka jest Twoja ulubiona nadmorska trasa rowerowa?"
      }
    };

    const targetStarters = starters[profileId] || {
      en: "Hi! I see we share high compatibility. How has your week been?",
      no: "Hei! Ser at vi har høy kompatibilitet. Hvordan har uken din vært?",
      pl: "Hej! Widzę, że mamy wysoką zgodność. Jak mija Twój tydzień?"
    };

    return targetStarters[locale] || targetStarters.en;
  };

  const resolveReport = (id: string) => {
    setReports(prev => prev.map(r => r.id === id ? { ...r, status: 'Resolved' as const } : r));
  };

  const approveVerification = (id: string) => {
    const request = verificationsQueue.find(v => v.id === id);
    if (!request) return;

    setVerificationsQueue(prev => prev.map(v => v.id === id ? { ...v, status: 'Approved' as const } : v));

    const targetName = request.name;
    setProfiles(prev => prev.map(p => {
      if (p.name === targetName) {
        return {
          ...p,
          verification: {
            ...p.verification,
            [request.type.toLowerCase()]: true
          }
        };
      }
      return p;
    }));
  };

  return (
    <AppContext.Provider value={{
      theme,
      toggleTheme,
      userProfile,
      upgradeSubscription,
      cancelActiveSubscription,
      setVerificationField,
      activePaymentProvider,
      setActivePaymentProvider,
      invoices,
      generateMockWebhook,
      weights,
      updateWeight,
      profiles,
      calculateOverallScore,
      savedProfileIds,
      toggleSaveProfile,
      chatThreads,
      activeChatId,
      setActiveChatId,
      sendMessage,
      translateMessage,
      getConversationStarter,
      isTyping,
      reports,
      verificationsQueue,
      resolveReport,
      approveVerification,
      systemMetrics,
      triggerModal,
      formatPrice: (price: number, currency: string) => `${currency === 'PLN' ? 'zł' : currency === 'NOK' ? 'kr' : '$'}${price}`,
      toggleFavorite: () => {},
      isFavorite: () => false,
      calculatePropertyMatchScore: () => 85,
      toggleCompareProperty: () => {},
      comparedProperties: [],
      watchlist: [],
      toggleWatchlist: () => {},
      isInWatchlist: () => false,
      propertyWeights: { garage: 5, ev: 5, elevator: 5, transit: 5, floor: 5 },
      updatePropertyWeight: () => {},
      budgetLimit: 1000000,
      comparedCities: [],
      toggleCompareCity: () => {},
      neighborhoodWeights: { safety: 5, walkability: 5, greenery: 5, healthcare: 5, dining: 5, shopping: 5, retirement: 5 },
      updateNeighborhoodWeight: () => {},
      calculateNeighborhoodMatchScore: () => 85
    }}>
      {children}
      <PremiumModal
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig((prev) => ({ ...prev, isOpen: false }))}
        title={modalConfig.title}
        description={modalConfig.description}
        type={modalConfig.type}
      />
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
