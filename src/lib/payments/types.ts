export type PaymentProviderName = 'stripe';

export interface CheckoutSession {
  id: string;
  url: string;
  provider: PaymentProviderName;
  amount: number;
  currency: string;
  status: 'pending' | 'success' | 'failed';
}

export interface Invoice {
  id: string;
  date: string;
  amount: number;
  currency: string;
  status: 'paid' | 'open' | 'void';
  pdfUrl?: string;
  provider: PaymentProviderName;
}

export type WebhookEventType = 
  | 'subscription.created' 
  | 'subscription.renewed' 
  | 'subscription.cancelled' 
  | 'payment.succeeded' 
  | 'payment.failed';

export interface WebhookEvent {
  type: WebhookEventType;
  userId: string;
  subscriptionId?: string;
  amount?: number;
  currency?: string;
  timestamp: string;
  rawPayload: any;
  provider: PaymentProviderName;
}

export interface PaymentProvider {
  name: PaymentProviderName;
  
  createCheckoutSession(
    userId: string, 
    planId: string, 
    amount: number, 
    currency: string, 
    returnUrl: string
  ): Promise<CheckoutSession>;
  
  cancelSubscription(subscriptionId: string): Promise<boolean>;
  
  getInvoiceHistory(userId: string): Promise<Invoice[]>;
  
  handleWebhookEvent(headers: Record<string, string>, rawBody: string): Promise<WebhookEvent>;

  createPortalSession?(userId: string, returnUrl: string): Promise<string>;
}
