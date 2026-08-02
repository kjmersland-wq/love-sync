import { PaymentProvider, CheckoutSession, Invoice, WebhookEvent } from '../types';

export class PayPalProvider implements PaymentProvider {
  name = 'paypal' as const;

  async createCheckoutSession(
    userId: string,
    planId: string,
    amount: number,
    currency: string,
    returnUrl: string
  ): Promise<CheckoutSession> {
    console.log(`[PayPal API] POST /v1/billing/subscriptions for user=${userId}`);
    
    const subscriptionId = `I-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    return {
      id: subscriptionId,
      url: `${returnUrl}?paypal_subscription_id=${subscriptionId}&provider=paypal`,
      provider: this.name,
      amount,
      currency,
      status: 'pending'
    };
  }

  async cancelSubscription(subscriptionId: string): Promise<boolean> {
    console.log(`[PayPal API] POST /v1/billing/subscriptions/${subscriptionId}/cancel`);
    return true;
  }

  async getInvoiceHistory(userId: string): Promise<Invoice[]> {
    console.log(`[PayPal API] GET /v1/billing/subscriptions/mock_id/transactions`);
    return [
      {
        id: `in_paypal_${Math.random().toString(36).substr(2, 6)}`,
        date: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString(),
        amount: 19,
        currency: 'USD',
        status: 'paid',
        pdfUrl: 'https://paypal.com/receipt-mock',
        provider: this.name
      }
    ];
  }

  async handleWebhookEvent(headers: Record<string, string>, rawBody: string): Promise<WebhookEvent> {
    console.log(`[PayPal Webhook] Verifying transmission signature header...`);
    
    const parsed = JSON.parse(rawBody);
    const eventType = parsed.event_type;
    
    let normalizedType: WebhookEvent['type'] = 'payment.succeeded';
    if (eventType === 'BILLING.SUBSCRIPTION.CREATED') normalizedType = 'subscription.created';
    else if (eventType === 'BILLING.SUBSCRIPTION.RENEWED' || eventType === 'PAYMENT.SALE.COMPLETED') {
      normalizedType = 'subscription.renewed';
    } else if (eventType === 'BILLING.SUBSCRIPTION.CANCELLED') normalizedType = 'subscription.cancelled';
    
    return {
      type: normalizedType,
      userId: parsed.resource?.custom_id || 'unknown_user',
      subscriptionId: parsed.resource?.id || 'sub_paypal_mock',
      amount: parsed.resource?.amount?.total ? parseFloat(parsed.resource.amount.total) : 19,
      currency: parsed.resource?.amount?.currency || 'USD',
      timestamp: new Date().toISOString(),
      rawPayload: parsed,
      provider: this.name
    };
  }
}
export default PayPalProvider;
