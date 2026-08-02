import { PaymentProvider, CheckoutSession, Invoice, WebhookEvent } from '../types';
import { verifyPaddleWebhook } from '../crypto';

export class PaddleProvider implements PaymentProvider {
  name = 'paddle' as const;

  // Retrieve Paddle client secret binding at runtime
  private getWebhookSecret(): string {
    return process.env.PADDLE_WEBHOOK_SECRET || 'pdl_webhook_sec_mock_12345';
  }

  async createCheckoutSession(
    userId: string,
    planId: string,
    amount: number,
    currency: string,
    returnUrl: string
  ): Promise<CheckoutSession> {
    console.log(`[Paddle Billing v2 API] POST /checkout-sessions for user=${userId}, plan=${planId}`);
    
    // Simulate Paddle Billing v2 transaction structure
    const transactionId = `txn_${Math.random().toString(36).substr(2, 9)}`;
    const paylink = `${returnUrl}?paddle_txn_id=${transactionId}&provider=paddle`;
    
    return {
      id: transactionId,
      url: paylink,
      provider: this.name,
      amount,
      currency,
      status: 'pending'
    };
  }

  async cancelSubscription(subscriptionId: string): Promise<boolean> {
    console.log(`[Paddle Billing v2 API] POST /subscriptions/${subscriptionId}/cancel`);
    return true;
  }

  async getInvoiceHistory(userId: string): Promise<Invoice[]> {
    console.log(`[Paddle Billing v2 API] GET /transactions?customer_id=${userId}&status=paid`);
    
    // Conforms to Paddle Billing v2 transactional billing invoice model
    return [
      {
        id: `inv_paddle_${Math.random().toString(36).substr(2, 6)}`,
        date: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString(),
        amount: 19.00,
        currency: 'USD',
        status: 'paid',
        pdfUrl: 'https://paddle.com/receipt-pdf-mock',
        provider: this.name
      }
    ];
  }

  async handleWebhookEvent(headers: Record<string, string>, rawBody: string): Promise<WebhookEvent> {
    const secret = this.getWebhookSecret();
    
    // Run the Web Crypto signature validation
    const isValid = await verifyPaddleWebhook(headers, rawBody, secret);
    if (!isValid) {
      throw new Error('[Paddle Provider Error] Security alert: Webhook signature verification failed.');
    }

    console.log('[Paddle Provider] Webhook signature verified successfully via Web Crypto.');

    const parsed = JSON.parse(rawBody);
    const eventType = parsed.event_type;
    const data = parsed.data || {};
    
    let normalizedType: WebhookEvent['type'] = 'payment.succeeded';
    
    // Conforming to Paddle Billing v2 webhook event types
    if (eventType === 'subscription.created') {
      normalizedType = 'subscription.created';
    } else if (eventType === 'subscription.updated') {
      normalizedType = 'subscription.renewed';
    } else if (eventType === 'subscription.canceled') {
      normalizedType = 'subscription.cancelled';
    }
    
    return {
      type: normalizedType,
      userId: data.custom_data?.userId || 'unknown_user',
      subscriptionId: data.id || 'sub_paddle_mock',
      amount: data.items?.[0]?.price?.unit_price ? parseFloat(data.items[0].price.unit_price) / 100 : 19.00,
      currency: data.currency_code || 'USD',
      timestamp: parsed.occurred_at || new Date().toISOString(),
      rawPayload: parsed,
      provider: this.name
    };
  }
}
export default PaddleProvider;
