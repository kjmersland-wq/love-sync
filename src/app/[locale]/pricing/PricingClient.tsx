'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '../../../context/AppContext';
import { useI18n } from '../../../lib/i18n/I18nContext';
import { 
  CreditCard, ShieldCheck, Heart, Sparkles, CheckCircle2, 
  Lock, ArrowRight, Loader2, FileText, ExternalLink, 
  AlertCircle, RefreshCw 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { initializePaddle, Paddle } from "@paddle/paddle-js";

export default function PricingClient() {
  const router = useRouter();
  const { locale, t } = useI18n();
  const { 
    userProfile, 
    upgradeSubscription, 
    cancelActiveSubscription, 
    activePaymentProvider, 
    invoices,
    triggerModal
  } = useApp();

  const [loading, setLoading] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [paddle, setPaddle] = useState<Paddle | null>(null);
  const [missingConfigKeys, setMissingConfigKeys] = useState<string[]>([]);
  const [priceIds, setPriceIds] = useState<{ monthly: string; yearly: string }>({ monthly: '', yearly: '' });

  // Card input states
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [selectedBank, setSelectedBank] = useState('iDEAL');

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await fetch('/api/paddle/config');
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setPriceIds({
              monthly: data.monthlyPriceId || '',
              yearly: data.yearlyPriceId || ''
            });

            const missingKeysList = [];
            if (!data.clientToken) missingKeysList.push('PADDLE_CLIENT_TOKEN');
            if (!data.monthlyPriceId) missingKeysList.push('PADDLE_MONTHLY_PRICE_ID');
            if (!data.yearlyPriceId) missingKeysList.push('PADDLE_YEARLY_PRICE_ID');
            setMissingConfigKeys(missingKeysList);

            if (data.clientToken) {
              const paddleInstance = await initializePaddle({
                environment: data.environment || 'sandbox',
                token: data.clientToken,
              });
              if (paddleInstance) setPaddle(paddleInstance);
            }
          }
        }
      } catch (e) {
        console.error("Failed to fetch Paddle configuration:", e);
      }
    };
    fetchConfig();
  }, []);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const planId = billingCycle === 'monthly' ? priceIds.monthly : priceIds.yearly;
      const amount = billingCycle === 'monthly' ? 14.99 : 119.00;

      if (!planId) {
        throw new Error("Billing plan price ID is not configured on the server.");
      }

      const { transactionId, checkoutUrl } = await upgradeSubscription(planId, amount);
      
      if (paddle && transactionId) {
        setLoading(false);
        paddle.Checkout.open({
          settings: {
            displayMode: "overlay",
            theme: "dark",
            locale: ["pl", "de", "fr", "es", "it"].includes(locale) ? locale : "en"
          },
          transactionId: transactionId
        });
      } else {
        // Fallback to hosted checkout redirect
        window.location.href = checkoutUrl;
      }
    } catch (err) {
      setLoading(false);
      triggerModal("Checkout Initialization Failed", (err as Error).message, "error");
    }
  };

  const handleManageSubscription = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/paddle/portal");
      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }
      let data;
      try {
        data = await res.json();
      } catch (e) {
        throw new Error("Invalid response format from billing server");
      }
      setLoading(false);
      if (data.success && data.portalUrl) {
        window.open(data.portalUrl, "_blank");
      } else {
        triggerModal("Billing Portal Error", data.error || "Failed to load subscription portal", "error");
      }
    } catch (err) {
      setLoading(false);
      triggerModal("Redirection Error", "Could not load cross-border billing portal: " + (err as Error).message, "error");
    }
  };

  const handleCancelSubscription = async () => {
    setLoading(true);
    try {
      await cancelActiveSubscription();
      triggerModal("Subscription Cancelled", "Your premium membership has been cancelled successfully.", "success");
    } catch (err) {
      triggerModal("Cancellation Error", (err as Error).message, "error");
    }
    setLoading(false);
    setShowCancelModal(false);
  };

  const getProviderBrandName = (): string => {
    switch (activePaymentProvider) {
      case 'stripe': return 'Stripe API Gateway';
      case 'paddle': return 'Paddle Merchant Platform';
      case 'adyen': return 'Adyen International';
      case 'mollie': return 'Mollie Local Payments';
      case 'paypal': return 'PayPal Smart Buttons';
      case 'checkout': return 'Checkout.com';
      default: return 'Payment Provider';
    }
  };

  const getProviderIconColor = (): string => {
    switch (activePaymentProvider) {
      case 'stripe': return 'text-indigo-500';
      case 'paypal': return 'text-blue-500';
      case 'mollie': return 'text-amber-600';
      case 'paddle': return 'text-green-500';
      default: return 'text-rose-500';
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 bg-background min-h-screen">
      
      {missingConfigKeys.length > 0 && (
        <div className="mb-8 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-xs text-red-500 font-semibold flex flex-col gap-1.5 shadow-sm max-w-xl mx-auto text-left">
          <div className="font-bold flex items-center gap-1">
            <AlertCircle className="h-4 w-4" />
            <span>Developer Configuration Alert: Missing Required Paddle Key(s)</span>
          </div>
          <p className="text-red-400 font-light leading-relaxed">
            The following environment variables are missing from process.env or Cloudflare context: {missingConfigKeys.join(', ')}. Please register them.
          </p>
        </div>
      )}

      {/* Title */}
      <div className="text-center space-y-4 mb-10">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500 shadow-inner">
          <Sparkles className="h-6 w-6 animate-pulse" />
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-foreground">{t('pricing.title')}</h1>
        <p className="text-muted-foreground font-light text-sm max-w-md mx-auto">{t('pricing.subtitle')}</p>
      </div>

      {/* Billing Cycle Toggle */}
      <div className="flex justify-center items-center gap-3 mb-12 text-xs">
        <span className={`font-medium transition-colors ${billingCycle === 'monthly' ? 'text-foreground' : 'text-muted-foreground'}`}>
          Billed Monthly
        </span>
        <button
          type="button"
          onClick={() => setBillingCycle(prev => prev === 'monthly' ? 'yearly' : 'monthly')}
          className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-secondary/80 transition-colors duration-200 ease-in-out focus:outline-none"
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-foreground shadow ring-0 transition duration-200 ease-in-out ${
              billingCycle === 'yearly' ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
        <span className={`font-medium transition-colors ${billingCycle === 'yearly' ? 'text-foreground' : 'text-muted-foreground'} flex items-center gap-1.5`}>
          Billed Annually
          <span className="px-2 py-0.5 text-[9px] bg-red-500/10 text-red-500 font-bold rounded-full">
            Save 36%
          </span>
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start max-w-5xl mx-auto mb-16">
        
        {/* Left Side: Subscription Tier Card */}
        <div className="md:col-span-6 bg-card border border-border/70 rounded-3xl p-6 sm:p-8 shadow-lg flex flex-col justify-between h-full relative overflow-hidden glass">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl" />
          
          <div className="space-y-6 relative z-10">
            <div className="flex justify-between items-center border-b border-border/40 pb-4">
              <div>
                <h3 className="font-serif text-xl font-bold text-foreground">Love Sync Premium</h3>
                <p className="text-[10px] text-muted-foreground font-mono mt-0.5">SaaS MEMBERSHIP</p>
              </div>
              <Heart className="h-5 w-5 text-red-500 fill-red-500/10" />
            </div>

            {/* Price */}
            <div className="space-y-1">
              <span className="text-4xl font-extrabold tracking-tight text-foreground font-serif">
                {billingCycle === 'monthly' ? t('pricing.priceText') : t('pricing.priceTextYearly')}
              </span>
              <p className="text-xs text-muted-foreground font-light">
                {billingCycle === 'monthly' ? t('pricing.priceSubText') : t('pricing.priceSubTextYearly')}
              </p>
            </div>

            {/* Features Checklist */}
            <ul className="space-y-3.5 text-xs text-muted-foreground font-light">
              {t('pricing.featuresList', { returnObjects: true } as any) && 
                (t('pricing.featuresList', { returnObjects: true } as any) as unknown as string[]).map((feature, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))
              }
            </ul>
          </div>
        </div>

        {/* Right Side: Provider-Agnostic Checkout Form */}
        <div className="md:col-span-6 bg-card border border-border/70 rounded-3xl p-6 shadow-md relative overflow-hidden">
          
          {/* Header showing active provider details */}
          <div className="flex items-center justify-between border-b border-border/40 pb-4 mb-6">
            <div className="flex items-center gap-2">
              <CreditCard className={`h-4 w-4 ${getProviderIconColor()}`} />
              <h2 className="text-xs font-semibold text-foreground uppercase tracking-wider font-mono">
                {getProviderBrandName()}
              </h2>
            </div>
            <div className="text-[10px] px-2 py-0.5 bg-secondary text-muted-foreground font-mono rounded border border-border/40">
              Active Gateway
            </div>
          </div>

          {userProfile.subscription === 'Premium' ? (
            <div className="text-center p-8 space-y-4">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10 text-green-500 shadow-inner">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-sm font-semibold text-foreground">You are a Premium Member</h3>
              <p className="text-xs text-muted-foreground font-light max-w-xs mx-auto">
                Payment details managed securely by {getProviderBrandName()}. Invoices and billing statements can be downloaded in the registry log below.
              </p>
              <div className="pt-4 flex flex-col gap-2">
                <button
                  onClick={() => router.push(`/${locale}/dashboard`)}
                  className="w-full py-2.5 rounded-xl border border-border bg-secondary/35 text-foreground text-xs font-semibold hover:bg-secondary/60 transition-colors shadow"
                >
                  Go to Dashboard
                </button>
                <button
                  onClick={handleManageSubscription}
                  disabled={loading}
                  className="w-full py-2.5 rounded-xl bg-foreground text-background text-xs font-semibold hover:bg-foreground/90 transition-colors shadow flex items-center justify-center gap-1.5"
                >
                  {loading && <Loader2 className="h-3 w-3 animate-spin" />}
                  <span>Manage Billing & Payment Details</span>
                </button>
                <button
                  onClick={() => setShowCancelModal(true)}
                  className="w-full py-2.5 rounded-xl border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-xs font-semibold text-red-500 transition-colors"
                >
                  Cancel Subscription
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleCheckout} className="space-y-4">
              
              {/* Conditional UIs based on Active Provider */}
              
              {activePaymentProvider === 'paddle' ? (
                /* Paddle Merchant of Record Overlay Checkout */
                <div className="space-y-4 py-2">
                  <div className="bg-green-500/5 dark:bg-green-500/10 border border-green-500/20 rounded-xl p-4 space-y-2 text-xs leading-relaxed font-light">
                    <div className="flex items-center gap-1.5 font-semibold text-green-500">
                      <ShieldCheck className="h-4 w-4" />
                      <span>Paddle Merchant of Record Secure Billing</span>
                    </div>
                    <p className="text-muted-foreground">
                      Paddle handles global taxes, compliance, and multi-currency billing out of the box, ensuring secure checkout and direct digital receipt generation.
                    </p>
                  </div>
                  
                  {/* Localized Price Calculator Mock */}
                  <div className="bg-secondary/20 p-4 rounded-xl border border-border/40 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Base Subscription</span>
                      <span className="font-mono text-foreground">
                        {billingCycle === 'monthly' ? '$19.00 USD' : '$144.00 USD'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Localized VAT (Norway 25%)</span>
                      <span className="font-mono text-foreground">
                        {billingCycle === 'monthly' ? '$4.75 USD' : '$36.00 USD'}
                      </span>
                    </div>
                    <div className="border-t border-border/40 pt-2 flex justify-between font-semibold">
                      <span>Total Amount</span>
                      <span className="font-mono text-foreground">
                        {billingCycle === 'monthly' ? '$23.75 USD' : '$180.00 USD'}
                      </span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl bg-foreground text-background font-semibold text-xs hover:bg-foreground/90 disabled:opacity-50 transition-colors flex items-center justify-center gap-2 shadow"
                  >
                    {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ExternalLink className="h-4 w-4" />}
                    <span>Open Paddle checkout overlay</span>
                  </button>
                </div>
              ) : activePaymentProvider === 'paypal' ? (
                /* PayPal Smart Buttons Mock */
                <div className="space-y-4 py-4">
                  <div className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-600 dark:text-yellow-500 rounded-xl p-4 flex gap-3 text-xs leading-relaxed font-light">
                    <AlertCircle className="h-4.5 w-4.5 shrink-0" />
                    <p>Click below to log in to your PayPal account and complete subscription authorization.</p>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#ffc439] hover:bg-[#f4b82e] text-[#111] font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors shadow"
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin text-[#111]" />
                    ) : (
                      <span className="italic font-bold text-sm">PayPal Checkout</span>
                    )}
                  </button>
                </div>
              ) : activePaymentProvider === 'mollie' ? (
                /* Mollie Bank/IDEAL Selector Mock */
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Select Local Payment Method</label>
                    <select
                      value={selectedBank}
                      onChange={(e) => setSelectedBank(e.target.value)}
                      className="w-full bg-background border border-border px-3 py-2.5 text-xs rounded-xl focus:outline-none focus:border-foreground"
                    >
                      <option value="iDEAL">iDEAL (Netherlands)</option>
                      <option value="Bancontact">Bancontact (Belgium)</option>
                      <option value="Sofort">SOFORT Banking (Germany/Austria)</option>
                      <option value="CreditCard">Credit Card</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl bg-foreground text-background font-semibold text-xs hover:bg-foreground/90 disabled:opacity-50 transition-colors flex items-center justify-center gap-2 shadow"
                  >
                    {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
                    <span>Pay with {selectedBank}</span>
                  </button>
                </div>
              ) : (
                /* Card Input forms for Stripe, Paddle, Adyen, Checkout.com */
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Card Number</label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        placeholder="4242 4242 4242 4242"
                        maxLength={19}
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim())}
                        className="w-full bg-background border border-border pl-10 pr-4 py-2.5 text-xs rounded-xl focus:outline-none focus:border-foreground"
                      />
                      <CreditCard className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground/60" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">Expiration Date</label>
                      <input
                        type="text"
                        required
                        placeholder="MM / YY"
                        maxLength={7}
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full bg-background border border-border px-4 py-2.5 text-xs rounded-xl focus:outline-none focus:border-foreground text-center"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">CVC</label>
                      <input
                        type="text"
                        required
                        placeholder="123"
                        maxLength={4}
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        className="w-full bg-background border border-border px-4 py-2.5 text-xs rounded-xl focus:outline-none focus:border-foreground text-center"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-3 bg-secondary/15 rounded-xl border border-border/40 text-[10px] text-muted-foreground font-light leading-relaxed">
                    <Lock className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span>Card processing is isolated. Payment fields are loaded securely from the {getProviderBrandName()} CDN.</span>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl bg-foreground text-background font-semibold text-xs hover:bg-foreground/90 disabled:opacity-50 transition-colors flex items-center justify-center gap-2 shadow"
                  >
                    {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
                    <span>{t('pricing.ctaSubscribe')}</span>
                  </button>
                </div>
              )}

            </form>
          )}

        </div>

      </div>

      {/* Invoice History Log */}
      {invoices.length > 0 && (
        <div className="bg-card border border-border/60 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4 max-w-4xl mx-auto">
          <div className="flex items-center gap-2 border-b border-border/40 pb-3">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-xs font-semibold text-foreground uppercase tracking-wider font-mono">Invoice Billing History</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-muted-foreground">
              <thead className="text-[10px] text-foreground uppercase tracking-wider border-b border-border/30">
                <tr>
                  <th className="px-4 py-2 font-mono">Invoice ID</th>
                  <th className="px-4 py-2 font-mono">Date</th>
                  <th className="px-4 py-2 font-mono">Billing Gateway</th>
                  <th className="px-4 py-2 font-mono">Amount</th>
                  <th className="px-4 py-2 font-mono">Status</th>
                  <th className="px-4 py-2 text-right">Document</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/10">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-secondary/10 transition-colors">
                    <td className="px-4 py-3 font-semibold text-foreground font-mono">{inv.id}</td>
                    <td className="px-4 py-3">{new Date(inv.date).toLocaleDateString()}</td>
                    <td className="px-4 py-3 font-mono text-[10px] uppercase">{inv.provider}</td>
                    <td className="px-4 py-3 font-bold text-foreground font-mono">${inv.amount.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-green-500/10 text-green-500 border border-green-500/20">
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          triggerModal(
                            "Secure PDF Receipt Download",
                            `Retrieving transaction receipt ${inv.id}.pdf securely from Cloudflare R2 storage container...`,
                            "success"
                          );
                        }}
                        className="inline-flex items-center gap-1 hover:text-foreground hover:underline font-semibold font-mono"
                      >
                        <span>PDF Receipt</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Subscription Cancellation Modal Dialog */}
      <AnimatePresence>
        {showCancelModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-sm bg-card border border-border/80 rounded-3xl shadow-2xl p-6 text-center space-y-4"
            >
              <div className="mx-auto h-12 w-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center">
                <AlertCircle className="h-6 w-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-foreground">Cancel Premium Membership?</h3>
              <p className="text-xs text-muted-foreground font-light leading-relaxed">
                Are you sure you want to cancel your subscription? You will lose access to matching categories weight overrides, identity verifications and chat translations instantly.
              </p>
              <div className="pt-2 flex gap-3">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="flex-1 py-2 rounded-xl border border-border hover:bg-secondary text-xs font-semibold text-foreground transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCancelSubscription}
                  disabled={loading}
                  className="flex-1 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-xs font-semibold text-white transition-colors flex items-center justify-center gap-1"
                >
                  {loading && <Loader2 className="h-3 w-3 animate-spin" />}
                  <span>Confirm Cancel</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
