import { PaymentProvider, CheckoutSession, Invoice, WebhookEvent } from '../types';
import { verifyPaddleWebhook } from '../crypto';
import { getCloudflareContext } from '@opennextjs/cloudflare';

function getPaddleConfig() {
  try {
    const context = getCloudflareContext();
    if (context && context.env) {
      return {
        apiKey: context.env.PADDLE_API_KEY || process.env.PADDLE_API_KEY || '',
        environment: context.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT || process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT || 'sandbox'
      };
    }
  } catch (e) {
    // Outside worker context
  }
  return {
    apiKey: process.env.PADDLE_API_KEY || '',
    environment: process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT || 'sandbox'
  };
}

export class PaddleProvider implements PaymentProvider {
  name = 'paddle' as const;

  private getWebhookSecret(): string {
    try {
      const context = getCloudflareContext();
      if (context && context.env && context.env.PADDLE_WEBHOOK_SECRET) {
        return context.env.PADDLE_WEBHOOK_SECRET;
      }
    } catch (e) {}
    return process.env.PADDLE_WEBHOOK_SECRET || 'pdl_webhook_sec_mock_12345';
  }

  private getBaseUrl(environment: string): string {
    return environment === 'sandbox' ? 'https://sandbox-api.paddle.com' : 'https://api.paddle.com';
  }

  async createCheckoutSession(
    userId: string,
    planId: string,
    amount: number,
    currency: string,
    returnUrl: string
  ): Promise<CheckoutSession> {
    const { apiKey, environment } = getPaddleConfig();
    if (!apiKey) {
      throw new Error('[Paddle Provider] PADDLE_API_KEY is not configured');
    }

    const baseUrl = this.getBaseUrl(environment);

    console.log(`[Paddle Billing API] Creating transaction for user=${userId}, priceId=${planId}`);

    // Create a transaction on Paddle Billing API to link userId custom_data securely
    const response = await fetch(`${baseUrl}/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        items: [
          {
            price_id: planId,
            quantity: 1
          }
        ],
        custom_data: {
          userId
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`[Paddle Billing API Error] Failed to create transaction: ${errorText}`);
    }

    const resData = await response.json();
    const transactionId = resData.data.id;
    const checkoutUrl = resData.data.checkout?.url || `${returnUrl}?paddle_txn_id=${transactionId}&provider=paddle`;

    return {
      id: transactionId,
      url: checkoutUrl,
      provider: this.name,
      amount,
      currency,
      status: 'pending'
    };
  }

  async cancelSubscription(subscriptionId: string): Promise<boolean> {
    const { apiKey, environment } = getPaddleConfig();
    if (!apiKey) {
      throw new Error('[Paddle Provider] PADDLE_API_KEY is not configured');
    }

    const baseUrl = this.getBaseUrl(environment);
    console.log(`[Paddle Billing API] Canceling subscription: ${subscriptionId}`);

    const response = await fetch(`${baseUrl}/subscriptions/${subscriptionId}/cancel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        effective_from: 'next_billing_period'
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[Paddle Billing API Error] Failed to cancel subscription: ${errorText}`);
      return false;
    }

    return true;
  }

  async getSubscriptionManagementUrls(subscriptionId: string): Promise<{ updatePaymentMethod: string; cancel: string } | null> {
    const { apiKey, environment } = getPaddleConfig();
    if (!apiKey) return null;

    const baseUrl = this.getBaseUrl(environment);

    const response = await fetch(`${baseUrl}/subscriptions/${subscriptionId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    });

    if (!response.ok) {
      return null;
    }

    const resData = await response.json();
    const managementUrls = resData.data.management_urls;
    return {
      updatePaymentMethod: managementUrls?.update_payment_method || '',
      cancel: managementUrls?.cancel || ''
    };
  }

  async getInvoiceHistory(userId: string): Promise<Invoice[]> {
    const { apiKey, environment } = getPaddleConfig();
    if (!apiKey) {
      // Return fallback invoices from local storage or empty
      return [];
    }

    const baseUrl = this.getBaseUrl(environment);
    // Find transactions with paid status and matching custom data
    const response = await fetch(`${baseUrl}/transactions?status=billed,completed`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    });

    if (!response.ok) {
      return [];
    }

    const resData = await response.json();
    const transactions = resData.data || [];

    // Filter transactions by custom_data.userId since Paddle Billing API list does not support deep filtering on custom_data
    const userTransactions = transactions.filter((tx: any) => tx.custom_data?.userId === userId);

    return userTransactions.map((tx: any) => {
      const amount = tx.details?.totals?.grand_total ? parseFloat(tx.details.totals.grand_total) / 100 : 14.99;
      return {
        id: tx.id,
        date: tx.billed_at || tx.created_at,
        amount,
        currency: tx.currency_code || 'USD',
        status: tx.status === 'completed' ? 'paid' : 'open',
        pdfUrl: tx.checkout?.url || null,
        provider: this.name
      };
    });
  }

  async handleWebhookEvent(headers: Record<string, string>, rawBody: string): Promise<WebhookEvent> {
    const secret = this.getWebhookSecret();
    
    // Run the Web Crypto signature validation
    const isValid = await verifyPaddleWebhook(headers, rawBody, secret);
    if (!isValid) {
      throw new Error('[Paddle Provider Error] Security alert: Webhook signature verification failed.');
    }

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
    
    const amount = data.details?.totals?.grand_total 
      ? parseFloat(data.details.totals.grand_total) / 100 
      : 14.99;

    return {
      type: normalizedType,
      userId: data.custom_data?.userId || 'unknown_user',
      subscriptionId: data.id || 'sub_paddle_mock',
      amount,
      currency: data.currency_code || 'USD',
      timestamp: parsed.occurred_at || new Date().toISOString(),
      rawPayload: parsed,
      provider: this.name
    };
  }
}
export default PaddleProvider;
