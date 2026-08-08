import Stripe from 'stripe';
import { PaymentProvider, CheckoutSession, Invoice, WebhookEvent } from '../types';
import { validateStripeConfig } from '../validation';
import { db } from '../../db';

function getInvoiceSubscriptionId(inv: Stripe.Invoice): string | undefined {
  const sub = inv.parent?.subscription_details?.subscription;
  return typeof sub === 'string' ? sub : sub?.id;
}

function getInvoiceUserId(inv: Stripe.Invoice): string | undefined {
  return inv.parent?.subscription_details?.metadata?.userId || inv.metadata?.userId || undefined;
}

function getStripeInstance() {
  const status = validateStripeConfig();
  if (!status.isValid) {
    throw new Error(`[Stripe Config Validation Error] Missing required keys: ${status.missingKeys.join(', ')}`);
  }
  return new Stripe(status.values.secretKey, {
    apiVersion: '2026-07-29.dahlia',
    httpClient: Stripe.createFetchHttpClient(),
  });
}

export class StripeProvider implements PaymentProvider {
  name = 'stripe' as const;

  async createCheckoutSession(
    userId: string,
    planId: string,
    amount: number,
    currency: string,
    returnUrl: string
  ): Promise<CheckoutSession> {
    console.log(`[Stripe API] Creating checkout session for user=${userId}, priceId=${planId}`);
    const stripe = getStripeInstance();

    // Parse origin and locale from returnUrl
    const urlObj = new URL(returnUrl);
    const origin = urlObj.origin;
    const pathSegments = urlObj.pathname.split('/').filter(Boolean);
    const locales = ['en', 'no', 'pl', 'de', 'fr', 'es', 'it'];
    const locale = locales.includes(pathSegments[0]) ? pathSegments[0] : 'en';

    const successUrl = `${origin}/${locale}/premium/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${origin}/${locale}/premium/cancel`;

    // Fetch user profile to prefill email if available
    const userProfile = await db.getUser(userId);
    const customerEmail = userProfile?.email;

    // Check if the user already has a Stripe customer ID saved
    const customerId = userProfile?.stripe_customer_id || undefined;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer: customerId,
      customer_email: customerId ? undefined : customerEmail,
      line_items: [
        {
          price: planId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        userId,
      },
      subscription_data: {
        metadata: {
          userId,
        },
      },
    });

    return {
      id: session.id,
      url: session.url || '',
      provider: this.name,
      amount,
      currency,
      status: 'pending',
    };
  }

  async cancelSubscription(subscriptionId: string): Promise<boolean> {
    console.log(`[Stripe API] Cancelling subscription: ${subscriptionId}`);
    const stripe = getStripeInstance();
    try {
      await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: true,
      });
      return true;
    } catch (err) {
      console.error(`[Stripe API Error] Failed to cancel subscription ${subscriptionId}:`, err);
      return false;
    }
  }

  async getInvoiceHistory(userId: string): Promise<Invoice[]> {
    console.log(`[Stripe API] Fetching invoice history for user=${userId}`);
    const stripe = getStripeInstance();
    try {
      const user = await db.getUser(userId);
      const customerId = user?.stripe_customer_id;
      if (!customerId) {
        return [];
      }

      const invoices = await stripe.invoices.list({
        customer: customerId,
        limit: 50,
      });

      return invoices.data.map((inv) => ({
        id: inv.id || '',
        date: new Date((inv.created || Date.now() / 1000) * 1000).toISOString(),
        amount: inv.amount_paid ? inv.amount_paid / 100 : 0,
        currency: (inv.currency || 'usd').toUpperCase(),
        status: inv.status === 'paid' ? 'paid' : inv.status === 'void' ? 'void' : 'open',
        pdfUrl: inv.invoice_pdf || undefined,
        provider: this.name,
      }));
    } catch (err) {
      console.error(`[Stripe API Error] Failed to get invoice history for user=${userId}:`, err);
      return [];
    }
  }

  async handleWebhookEvent(headers: Record<string, string>, rawBody: string): Promise<WebhookEvent> {
    console.log('[Stripe Webhook] Constructing and verifying event signature');
    const status = validateStripeConfig();
    const stripe = getStripeInstance();

    const signature = headers['stripe-signature'];
    if (!signature) {
      throw new Error('Missing stripe-signature header');
    }

    const event = await stripe.webhooks.constructEventAsync(
      rawBody,
      signature,
      status.values.webhookSecret
    );

    const eventType = event.type;
    console.log(`[Stripe Webhook] Event verified successfully. Type: ${eventType}`);

    let normalizedType: WebhookEvent['type'] = 'payment.succeeded';
    let userId = 'unknown_user';
    let subscriptionId: string | undefined;
    let amount: number | undefined;
    let currency: string | undefined;

    if (eventType === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      normalizedType = 'subscription.created';
      userId = session.metadata?.userId || 'unknown_user';
      subscriptionId = session.subscription as string;
      amount = session.amount_total ? session.amount_total / 100 : 0;
      currency = (session.currency || 'usd').toUpperCase();
    } else if (eventType === 'customer.subscription.created') {
      const sub = event.data.object as Stripe.Subscription;
      normalizedType = 'subscription.created';
      userId = sub.metadata?.userId || 'unknown_user';
      subscriptionId = sub.id;
    } else if (eventType === 'customer.subscription.updated') {
      const sub = event.data.object as Stripe.Subscription;
      normalizedType = 'subscription.renewed';
      userId = sub.metadata?.userId || 'unknown_user';
      subscriptionId = sub.id;
    } else if (eventType === 'customer.subscription.deleted') {
      const sub = event.data.object as Stripe.Subscription;
      normalizedType = 'subscription.cancelled';
      userId = sub.metadata?.userId || 'unknown_user';
      subscriptionId = sub.id;
    } else if (eventType === 'invoice.paid') {
      const inv = event.data.object as Stripe.Invoice;
      normalizedType = 'payment.succeeded';
      userId = getInvoiceUserId(inv) || 'unknown_user';
      subscriptionId = getInvoiceSubscriptionId(inv);
      amount = inv.amount_paid ? inv.amount_paid / 100 : 0;
      currency = (inv.currency || 'usd').toUpperCase();
    } else if (eventType === 'invoice.payment_failed') {
      const inv = event.data.object as Stripe.Invoice;
      normalizedType = 'payment.failed';
      userId = getInvoiceUserId(inv) || 'unknown_user';
      subscriptionId = getInvoiceSubscriptionId(inv);
      amount = inv.amount_due ? inv.amount_due / 100 : 0;
      currency = (inv.currency || 'usd').toUpperCase();
    }

    return {
      type: normalizedType,
      userId,
      subscriptionId,
      amount,
      currency,
      timestamp: new Date().toISOString(),
      rawPayload: event,
      provider: this.name,
    };
  }

  async createPortalSession(userId: string, returnUrl: string): Promise<string> {
    console.log(`[Stripe API] Creating customer portal session for user=${userId}`);
    const stripe = getStripeInstance();
    const userProfile = await db.getUser(userId);
    const customerId = userProfile?.stripe_customer_id;

    if (!customerId) {
      throw new Error(`User ${userId} does not have a Stripe Customer ID registered.`);
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });

    return session.url;
  }
}

export default StripeProvider;
