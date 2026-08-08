import { NextResponse } from "next/server";
import { paymentService } from "../../../../lib/payments/paymentService";
import { db } from "../../../../lib/db";
import Stripe from "stripe";

function getInvoiceSubscriptionId(inv: Stripe.Invoice): string | undefined {
  const sub = inv.parent?.subscription_details?.subscription;
  return typeof sub === "string" ? sub : sub?.id;
}

function getLineItemPriceId(inv: Stripe.Invoice): string | null {
  const price = inv.lines.data[0]?.pricing?.price_details?.price;
  return (typeof price === "string" ? price : price?.id) || null;
}

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const headers: Record<string, string> = {};
    request.headers.forEach((value, key) => {
      headers[key] = value;
    });

    // 1. Verify Stripe Webhook Signature & parse event
    const normalizedEvent = await paymentService.handleWebhookEvent(headers, rawBody);
    const stripeEvent = normalizedEvent.rawPayload as Stripe.Event;
    
    // Idempotency: prevent double processing
    const isProcessed = await db.hasProcessedEvent(stripeEvent.id, "stripe");
    if (isProcessed) {
      console.log(`[Stripe Webhook Guard] Event ${stripeEvent.id} already processed.`);
      return NextResponse.json({ success: true, message: "Duplicate event ignored." });
    }

    await db.logProcessedEvent(stripeEvent.id, "stripe");

    const stripeObj = stripeEvent.data.object as any;
    const userId = normalizedEvent.userId;

    console.log(`[Stripe Webhook Handler] Processing event=${stripeEvent.type} for user=${userId}`);

    // 2. Handle specific Stripe webhook events
    if (stripeEvent.type === "checkout.session.completed") {
      // User subscription activated via checkout
      const session = stripeObj as Stripe.Checkout.Session;
      const isPremium = session.payment_status === "paid" || session.status === "complete";
      
      // To get subscription billing status and renewal date, we write initial data.
      // The customer.subscription.created webhook will update this with precise dates.
      await db.updateUserSubscription(userId, {
        subscription: isPremium ? "Premium" : "Not Subscribed",
        stripeCustomerId: session.customer as string,
        stripeSubscriptionId: session.subscription as string,
        stripeBillingStatus: isPremium ? "active" : "incomplete",
        stripeRenewalDate: new Date(Date.now() + 31 * 24 * 3600 * 1000).toISOString(), // Temporary 31 days
        stripePlanId: session.line_items?.data?.[0]?.price?.id || null
      });

    } else if (
      stripeEvent.type === "customer.subscription.created" ||
      stripeEvent.type === "customer.subscription.updated"
    ) {
      const subscription = stripeObj as Stripe.Subscription;
      const status = subscription.status;
      const isPremium = ["active", "trialing"].includes(status);
      const currentPeriodEnd = subscription.items.data[0]?.current_period_end;
      const renewalDate = new Date((currentPeriodEnd || Date.now() / 1000) * 1000).toISOString();

      await db.updateUserSubscription(userId, {
        subscription: isPremium ? "Premium" : "Not Subscribed",
        stripeCustomerId: subscription.customer as string,
        stripeSubscriptionId: subscription.id,
        stripeBillingStatus: status,
        stripeRenewalDate: renewalDate,
        stripePlanId: subscription.items.data[0]?.price?.id || null
      });

    } else if (stripeEvent.type === "customer.subscription.deleted") {
      const subscription = stripeObj as Stripe.Subscription;
      
      await db.updateUserSubscription(userId, {
        subscription: "Not Subscribed",
        stripeCustomerId: subscription.customer as string,
        stripeSubscriptionId: subscription.id,
        stripeBillingStatus: "canceled",
        stripeRenewalDate: new Date().toISOString(), // Expired now
        stripePlanId: subscription.items.data[0]?.price?.id || null
      });

    } else if (stripeEvent.type === "invoice.paid") {
      const invoice = stripeObj as Stripe.Invoice;
      
      // Log Invoice inside database
      await db.createInvoice({
        id: invoice.id || `inv_stripe_${Math.random().toString(36).substr(2, 6)}`,
        userId: userId,
        amount: invoice.amount_paid ? invoice.amount_paid / 100 : 0,
        currency: (invoice.currency || "usd").toUpperCase(),
        status: "paid",
        pdfUrl: invoice.invoice_pdf || undefined,
        provider: "stripe"
      });

      // Automatically ensure user is premium
      const paidSubscriptionId = getInvoiceSubscriptionId(invoice);
      if (paidSubscriptionId) {
        await db.updateUserSubscription(userId, {
          subscription: "Premium",
          stripeCustomerId: invoice.customer as string,
          stripeSubscriptionId: paidSubscriptionId,
          stripeBillingStatus: "active",
          stripeRenewalDate: new Date(Date.now() + 31 * 24 * 3600 * 1000).toISOString(),
          stripePlanId: getLineItemPriceId(invoice)
        });
      }

    } else if (stripeEvent.type === "invoice.payment_failed") {
      const invoice = stripeObj as Stripe.Invoice;

      // Log Failed Invoice
      await db.createInvoice({
        id: invoice.id || `inv_stripe_${Math.random().toString(36).substr(2, 6)}`,
        userId: userId,
        amount: invoice.amount_due ? invoice.amount_due / 100 : 0,
        currency: (invoice.currency || "usd").toUpperCase(),
        status: "open", // unpaid/open
        pdfUrl: invoice.invoice_pdf || undefined,
        provider: "stripe"
      });

      // Set subscription status to past_due / unpaid
      const failedSubscriptionId = getInvoiceSubscriptionId(invoice);
      if (failedSubscriptionId) {
        await db.updateUserSubscription(userId, {
          subscription: "Not Subscribed",
          stripeCustomerId: invoice.customer as string,
          stripeSubscriptionId: failedSubscriptionId,
          stripeBillingStatus: "past_due",
          stripeRenewalDate: new Date().toISOString(), // Block premium access immediately
          stripePlanId: getLineItemPriceId(invoice)
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[Stripe Webhook Error]:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
