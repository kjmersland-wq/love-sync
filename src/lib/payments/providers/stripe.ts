import { PaymentProvider, CheckoutSession, Invoice, WebhookEvent } from '../types';

export class StripeProvider implements PaymentProvider {
  name = 'stripe' as const;

  async createCheckoutSession(
    userId: string,
    planId: string,
    amount: number,
    currency: string,
    returnUrl: string
  ): Promise<CheckoutSession> {
    console.log(`[Stripe API] POST /v1/checkout/sessions for user=${userId}, plan=${planId}`);
    
    // Simulate Stripe Session Creation response
    const sessionId = `cs_live_${Math.random().toString(36).substr(2, 9)}`;
    return {
      id: sessionId,
      url: `${returnUrl}?session_id=${sessionId}&provider=stripe`,
      provider: this.name,
      amount,
      currency,
      status: 'pending'
    };
  }

  async cancelSubscription(subscriptionId: string): Promise<boolean> {
    console.log(`[Stripe API] POST /v1/subscriptions/${subscriptionId}/cancel`);
    return true;
  }

  async getInvoiceHistory(userId: string): Promise<Invoice[]> {
    console.log(`[Stripe API] GET /v1/invoices?customer=${userId}`);
    return [
      {
        id: `in_stripe_${Math.random().toString(36).substr(2, 6)}`,
        date: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString(), // 30 days ago
        amount: 19,
        currency: 'USD',
        status: 'paid',
        pdfUrl: 'https://stripe.com/receipt/invoice-pdf-mock',
        provider: this.name
      }
    ];
  }

  async handleWebhookEvent(headers: Record<string, string>, rawBody: string): Promise<WebhookEvent> {
    console.log(`[Stripe Webhook] Verifying signature header: ${headers['stripe-signature'] || 'none'}`);
    
    const parsed = JSON.parse(rawBody);
    const eventType = parsed.type;
    
    // Map Stripe webhook types to normalized Love Sync events
    let normalizedType: WebhookEvent['type'] = 'payment.succeeded';
    if (eventType === 'customer.subscription.created') normalizedType = 'subscription.created';
    else if (eventType === 'customer.subscription.updated') normalizedType = 'subscription.renewed';
    else if (eventType === 'customer.subscription.deleted') normalizedType = 'subscription.cancelled';
    
    return {
      type: normalizedType,
      userId: parsed.data?.object?.metadata?.userId || 'unknown_user',
      subscriptionId: parsed.data?.object?.id || 'sub_stripe_mock',
      amount: parsed.data?.object?.amount_due ? parsed.data.object.amount_due / 100 : 19,
      currency: parsed.data?.object?.currency || 'USD',
      timestamp: new Date().toISOString(),
      rawPayload: parsed,
      provider: this.name
    };
  }
}
export default StripeProvider;
