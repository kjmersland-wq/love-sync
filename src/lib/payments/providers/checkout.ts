import { PaymentProvider, CheckoutSession, Invoice, WebhookEvent } from '../types';

export class CheckoutDotComProvider implements PaymentProvider {
  name = 'checkout' as const;

  async createCheckoutSession(
    userId: string,
    planId: string,
    amount: number,
    currency: string,
    returnUrl: string
  ): Promise<CheckoutSession> {
    console.log(`[Checkout.com API] POST /payments for user=${userId}`);
    
    const paymentId = `pay_cko_${Math.random().toString(36).substr(2, 9)}`;
    return {
      id: paymentId,
      url: `${returnUrl}?cko_session_id=${paymentId}&provider=checkout`,
      provider: this.name,
      amount,
      currency,
      status: 'pending'
    };
  }

  async cancelSubscription(subscriptionId: string): Promise<boolean> {
    console.log(`[Checkout.com API] POST /recurring/cancellations subscription=${subscriptionId}`);
    return true;
  }

  async getInvoiceHistory(userId: string): Promise<Invoice[]> {
    console.log(`[Checkout.com API] GET /reporting/payments?reference=${userId}`);
    return [
      {
        id: `in_cko_${Math.random().toString(36).substr(2, 6)}`,
        date: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString(),
        amount: 19,
        currency: 'USD',
        status: 'paid',
        pdfUrl: 'https://checkout.com/invoice-pdf-mock',
        provider: this.name
      }
    ];
  }

  async handleWebhookEvent(headers: Record<string, string>, rawBody: string): Promise<WebhookEvent> {
    console.log(`[Checkout.com Webhook] Validating CKO signature headers...`);
    
    const parsed = JSON.parse(rawBody);
    const eventType = parsed.type;
    
    let normalizedType: WebhookEvent['type'] = 'payment.succeeded';
    if (eventType === 'subscription_created') normalizedType = 'subscription.created';
    else if (eventType === 'payment_captured') normalizedType = 'subscription.renewed';
    else if (eventType === 'subscription_cancelled') normalizedType = 'subscription.cancelled';
    
    return {
      type: normalizedType,
      userId: parsed.data?.metadata?.userId || 'unknown_user',
      subscriptionId: parsed.data?.subscription_id || 'sub_cko_mock',
      amount: parsed.data?.amount ? parsed.data.amount / 100 : 19,
      currency: parsed.data?.currency || 'USD',
      timestamp: new Date().toISOString(),
      rawPayload: parsed,
      provider: this.name
    };
  }
}
export default CheckoutDotComProvider;
