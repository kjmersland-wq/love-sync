import { PaymentProvider, PaymentProviderName, CheckoutSession, Invoice, WebhookEvent } from './types';
import { StripeProvider } from './providers/stripe';
import { PaddleProvider } from './providers/paddle';
import { AdyenProvider } from './providers/adyen';
import { MollieProvider } from './providers/mollie';
import { PayPalProvider } from './providers/paypal';
import { CheckoutDotComProvider } from './providers/checkout';

// Production Logger interface
export const PaymentLogger = {
  info: (msg: string, meta?: any) => {
    console.log(`[Payment Service INFO] ${msg}`, meta ? JSON.stringify(meta) : '');
  },
  warn: (msg: string, meta?: any) => {
    console.warn(`[Payment Service WARN] ${msg}`, meta ? JSON.stringify(meta) : '');
  },
  error: (msg: string, err?: any) => {
    console.error(`[Payment Service ERROR] ${msg}`, err || '');
  }
};

export class PaymentService {
  private static instance: PaymentService;
  private providers = new Map<PaymentProviderName, PaymentProvider>();
  private activeProviderName: PaymentProviderName = 'paddle';
  
  // Idempotency cache (Double billing prevention)
  private processedEvents = new Set<string>();

  private constructor() {
    this.registerProvider(new StripeProvider());
    this.registerProvider(new PaddleProvider());
    this.registerProvider(new AdyenProvider());
    this.registerProvider(new MollieProvider());
    this.registerProvider(new PayPalProvider());
    this.registerProvider(new CheckoutDotComProvider());

    const envProvider = process.env.NEXT_PUBLIC_ACTIVE_PAYMENT_PROVIDER as PaymentProviderName;
    if (envProvider && this.providers.has(envProvider)) {
      this.activeProviderName = envProvider;
    }
    
    PaymentLogger.info(`Initialized Payment Service. Default active gateway: ${this.activeProviderName}`);
  }

  public static getInstance(): PaymentService {
    if (!PaymentService.instance) {
      PaymentService.instance = new PaymentService();
    }
    return PaymentService.instance;
  }

  public registerProvider(provider: PaymentProvider): void {
    this.providers.set(provider.name, provider);
  }

  public getActiveProviderName(): PaymentProviderName {
    return this.activeProviderName;
  }

  public setActiveProvider(name: PaymentProviderName): void {
    if (!this.providers.has(name)) {
      PaymentLogger.error(`Failed to switch provider: '${name}' is not registered.`);
      throw new Error(`Payment provider '${name}' is not registered.`);
    }
    this.activeProviderName = name;
    PaymentLogger.info(`Active payment gateway switched to: ${name}`);
  }

  private getProvider(name?: PaymentProviderName): PaymentProvider {
    const targetName = name || this.activeProviderName;
    const provider = this.providers.get(targetName);
    if (!provider) {
      PaymentLogger.error(`Payment provider lookup failed: '${targetName}' not found.`);
      throw new Error(`Payment provider '${targetName}' not found.`);
    }
    return provider;
  }

  // --- Provider Agnostic Methods ---

  public async createCheckoutSession(
    userId: string,
    planId: string,
    amount: number,
    currency: string,
    returnUrl: string,
    providerOverride?: PaymentProviderName
  ): Promise<CheckoutSession> {
    const startTime = Date.now();
    const provider = this.getProvider(providerOverride);
    
    PaymentLogger.info(`Initiating checkout session for user=${userId}, plan=${planId}, provider=${provider.name}`);
    
    try {
      const session = await provider.createCheckoutSession(userId, planId, amount, currency, returnUrl);
      PaymentLogger.info(`Checkout session created successfully in ${Date.now() - startTime}ms`, { sessionId: session.id });
      return session;
    } catch (err) {
      PaymentLogger.error(`Checkout session creation failed for user=${userId}`, err);
      throw err;
    }
  }

  public async cancelSubscription(
    subscriptionId: string,
    providerOverride?: PaymentProviderName
  ): Promise<boolean> {
    const provider = this.getProvider(providerOverride);
    PaymentLogger.info(`Cancelling subscription: ${subscriptionId}, provider=${provider.name}`);
    
    try {
      const res = await provider.cancelSubscription(subscriptionId);
      PaymentLogger.info(`Subscription ${subscriptionId} cancellation complete. Status: ${res}`);
      return res;
    } catch (err) {
      PaymentLogger.error(`Subscription cancellation failed: ${subscriptionId}`, err);
      throw err;
    }
  }

  public async getInvoiceHistory(
    userId: string,
    providerOverride?: PaymentProviderName
  ): Promise<Invoice[]> {
    const provider = this.getProvider(providerOverride);
    try {
      return await provider.getInvoiceHistory(userId);
    } catch (err) {
      PaymentLogger.error(`Invoice history query failed for user=${userId}`, err);
      return [];
    }
  }

  /**
   * Handles incoming webhooks, implementing strict signature checks and idempotency filters.
   */
  public async handleWebhookEvent(
    headers: Record<string, string>,
    rawBody: string,
    providerOverride?: PaymentProviderName
  ): Promise<WebhookEvent> {
    const provider = this.getProvider(providerOverride);
    
    // Parse event ID from payload to verify idempotency (deduplication)
    let eventId = `evt_mock_${Math.random().toString(36).substr(2, 6)}`;
    try {
      const parsed = JSON.parse(rawBody);
      // Paddle Billing v2 event ID resides in 'event_id'
      if (parsed.event_id) eventId = parsed.event_id;
      else if (parsed.id) eventId = parsed.id;
    } catch (e) {
      PaymentLogger.warn('Failed to parse webhook JSON body for eventId mapping.');
    }

    // Idempotency check: Ignore duplicate webhook deliveries
    if (this.processedEvents.has(eventId)) {
      PaymentLogger.warn(`[Idempotency Guard] Duplicate event ignored. eventId=${eventId}`);
      throw new Error(`[Idempotency Skip] Event ${eventId} was already processed.`);
    }

    PaymentLogger.info(`Processing incoming webhook from ${provider.name}. eventId=${eventId}`);
    
    try {
      const normalizedEvent = await provider.handleWebhookEvent(headers, rawBody);
      
      // Register event ID as processed
      this.processedEvents.add(eventId);
      
      PaymentLogger.info(`Webhook event normalized and processed. eventId=${eventId}, type=${normalizedEvent.type}`);
      return normalizedEvent;
    } catch (err) {
      PaymentLogger.error(`Webhook processing failed. eventId=${eventId}, provider=${provider.name}`, err);
      throw err;
    }
  }
}

export const paymentService = PaymentService.getInstance();
export default paymentService;
