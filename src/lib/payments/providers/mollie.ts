import { PaymentProvider, CheckoutSession, Invoice, WebhookEvent } from '../types';

export class MollieProvider implements PaymentProvider {
  name = 'mollie' as const;

  async createCheckoutSession(
    userId: string,
    planId: string,
    amount: number,
    currency: string,
    returnUrl: string
  ): Promise<CheckoutSession> {
    console.log(`[Mollie API] POST /v2/payments for customer=${userId}`);
    
    const paymentId = `tr_${Math.random().toString(36).substr(2, 9)}`;
    return {
      id: paymentId,
      url: `${returnUrl}?mollie_payment_id=${paymentId}&provider=mollie`,
      provider: this.name,
      amount,
      currency,
      status: 'pending'
    };
  }

  async cancelSubscription(subscriptionId: string): Promise<boolean> {
    console.log(`[Mollie API] DELETE /v2/customers/cst_mock/subscriptions/${subscriptionId}`);
    return true;
  }

  async getInvoiceHistory(userId: string): Promise<Invoice[]> {
    console.log(`[Mollie API] GET /v2/payments?customerId=${userId}`);
    return [
      {
        id: `in_mollie_${Math.random().toString(36).substr(2, 6)}`,
        date: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString(),
        amount: 19,
        currency: 'EUR',
        status: 'paid',
        pdfUrl: 'https://mollie.com/receipt-pdf-mock',
        provider: this.name
      }
    ];
  }

  async handleWebhookEvent(headers: Record<string, string>, rawBody: string): Promise<WebhookEvent> {
    // Mollie webhooks typically only send an ID, and we fetch the actual details via API.
    // In our mock event, we'll parse the simulated body containing the full payload.
    console.log(`[Mollie Webhook] Processing body ID query...`);
    
    const parsed = JSON.parse(rawBody);
    const eventType = parsed.event;
    
    let normalizedType: WebhookEvent['type'] = 'payment.succeeded';
    if (eventType === 'subscription_created') normalizedType = 'subscription.created';
    else if (eventType === 'subscription_renewed') normalizedType = 'subscription.renewed';
    else if (eventType === 'subscription_cancelled') normalizedType = 'subscription.cancelled';
    
    return {
      type: normalizedType,
      userId: parsed.customerId || 'unknown_user',
      subscriptionId: parsed.subscriptionId || 'sub_mollie_mock',
      amount: parsed.amount ? parseFloat(parsed.amount.value) : 19,
      currency: parsed.amount ? parsed.amount.currency : 'EUR',
      timestamp: new Date().toISOString(),
      rawPayload: parsed,
      provider: this.name
    };
  }
}
export default MollieProvider;
