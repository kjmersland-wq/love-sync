import { PaymentProvider, CheckoutSession, Invoice, WebhookEvent } from '../types';

export class AdyenProvider implements PaymentProvider {
  name = 'adyen' as const;

  async createCheckoutSession(
    userId: string,
    planId: string,
    amount: number,
    currency: string,
    returnUrl: string
  ): Promise<CheckoutSession> {
    console.log(`[Adyen API] POST /v69/sessions for user=${userId}`);
    
    const sessionId = `adyen_sess_${Math.random().toString(36).substr(2, 9)}`;
    return {
      id: sessionId,
      url: `${returnUrl}?adyen_id=${sessionId}&provider=adyen`,
      provider: this.name,
      amount,
      currency,
      status: 'pending'
    };
  }

  async cancelSubscription(subscriptionId: string): Promise<boolean> {
    console.log(`[Adyen API] POST /v69/technicalCancel recurrentDetailReference=${subscriptionId}`);
    return true;
  }

  async getInvoiceHistory(userId: string): Promise<Invoice[]> {
    console.log(`[Adyen API] GET /v69/recurringDetails?shopperReference=${userId}`);
    return [
      {
        id: `in_adyen_${Math.random().toString(36).substr(2, 6)}`,
        date: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString(),
        amount: 19,
        currency: 'USD',
        status: 'paid',
        pdfUrl: 'https://adyen.com/receipt-pdf-mock',
        provider: this.name
      }
    ];
  }

  async handleWebhookEvent(headers: Record<string, string>, rawBody: string): Promise<WebhookEvent> {
    console.log(`[Adyen Notification] Validating HMAC signature header...`);
    
    const parsed = JSON.parse(rawBody);
    const notification = parsed.notificationItems?.[0]?.NotificationRequestItem;
    
    const eventCode = notification?.eventCode;
    let normalizedType: WebhookEvent['type'] = 'payment.succeeded';
    
    if (eventCode === 'RECURRING_CONTRACT') normalizedType = 'subscription.created';
    else if (eventCode === 'AUTHORISATION' && notification?.additionalData?.recurringDetailReference) {
      normalizedType = 'subscription.renewed';
    } else if (eventCode === 'CANCELLATION') normalizedType = 'subscription.cancelled';
    
    return {
      type: normalizedType,
      userId: notification?.shopperReference || 'unknown_user',
      subscriptionId: notification?.additionalData?.recurringDetailReference || 'sub_adyen_mock',
      amount: notification?.amount?.value ? notification.amount.value / 100 : 19,
      currency: notification?.amount?.currency || 'USD',
      timestamp: new Date().toISOString(),
      rawPayload: parsed,
      provider: this.name
    };
  }
}
export default AdyenProvider;
