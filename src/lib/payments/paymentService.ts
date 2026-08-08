import { PaymentProvider, PaymentProviderName, CheckoutSession, Invoice, WebhookEvent } from './types';
import { StripeProvider } from './providers/stripe';

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
  private provider: PaymentProvider;
  
  private processedEvents = new Set<string>();

  private constructor() {
    this.provider = new StripeProvider();
    PaymentLogger.info('Initialized Stripe Payment Service.');
  }

  public static getInstance(): PaymentService {
    if (!PaymentService.instance) {
      PaymentService.instance = new PaymentService();
    }
    return PaymentService.instance;
  }

  public getActiveProviderName(): PaymentProviderName {
    return 'stripe';
  }

  public async createCheckoutSession(
    userId: string,
    planId: string,
    amount: number,
    currency: string,
    returnUrl: string
  ): Promise<CheckoutSession> {
    const startTime = Date.now();
    PaymentLogger.info(`Initiating checkout session for user=${userId}, plan=${planId}, provider=stripe`);
    
    try {
      const session = await this.provider.createCheckoutSession(userId, planId, amount, currency, returnUrl);
      PaymentLogger.info(`Checkout session created successfully in ${Date.now() - startTime}ms`, { sessionId: session.id });
      return session;
    } catch (err) {
      PaymentLogger.error(`Checkout session creation failed for user=${userId}`, err);
      throw err;
    }
  }

  public async cancelSubscription(subscriptionId: string): Promise<boolean> {
    PaymentLogger.info(`Cancelling subscription: ${subscriptionId}, provider=stripe`);
    try {
      const res = await this.provider.cancelSubscription(subscriptionId);
      PaymentLogger.info(`Subscription ${subscriptionId} cancellation complete. Status: ${res}`);
      return res;
    } catch (err) {
      PaymentLogger.error(`Subscription cancellation failed: ${subscriptionId}`, err);
      throw err;
    }
  }

  public async getInvoiceHistory(userId: string): Promise<Invoice[]> {
    try {
      return await this.provider.getInvoiceHistory(userId);
    } catch (err) {
      PaymentLogger.error(`Invoice history query failed for user=${userId}`, err);
      return [];
    }
  }

  public async createPortalSession(userId: string, returnUrl: string): Promise<string> {
    PaymentLogger.info(`Generating billing portal session for user=${userId}`);
    const stripeProvider = this.provider as StripeProvider;
    return await stripeProvider.createPortalSession(userId, returnUrl);
  }

  public async handleWebhookEvent(
    headers: Record<string, string>,
    rawBody: string
  ): Promise<WebhookEvent> {
    let eventId = `evt_mock_${Math.random().toString(36).substr(2, 6)}`;
    try {
      const parsed = JSON.parse(rawBody);
      if (parsed.id) eventId = parsed.id;
    } catch (e) {
      PaymentLogger.warn('Failed to parse webhook JSON body for eventId mapping.');
    }

    if (this.processedEvents.has(eventId)) {
      PaymentLogger.warn(`[Idempotency Guard] Duplicate event ignored. eventId=${eventId}`);
      throw new Error(`[Idempotency Skip] Event ${eventId} was already processed.`);
    }

    PaymentLogger.info(`Processing incoming Stripe webhook. eventId=${eventId}`);
    
    try {
      const normalizedEvent = await this.provider.handleWebhookEvent(headers, rawBody);
      this.processedEvents.add(eventId);
      PaymentLogger.info(`Webhook event normalized and processed. eventId=${eventId}, type=${normalizedEvent.type}`);
      return normalizedEvent;
    } catch (err) {
      PaymentLogger.error(`Webhook processing failed. eventId=${eventId}`, err);
      throw err;
    }
  }
}

export const paymentService = PaymentService.getInstance();
export default paymentService;
