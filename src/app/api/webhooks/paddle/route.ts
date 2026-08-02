import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { verifyPaddleWebhook } from "../../../../lib/payments/crypto";
import { db } from "../../../../lib/db";

export const runtime = "edge";

export async function POST(request: Request) {
  try {
    const { env } = getCloudflareContext();
    const webhookSecret = env.PADDLE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error("[Paddle Webhook Error] PADDLE_WEBHOOK_SECRET is not configured.");
      return NextResponse.json({ error: "Configuration error" }, { status: 500 });
    }

    // Get raw headers and body for signature verification
    const headers: Record<string, string> = {};
    request.headers.forEach((value, key) => {
      headers[key] = value;
    });

    const rawBody = await request.text();

    // Verify webhook signature using Web Crypto (Cloudflare Worker native)
    const isSignatureValid = await verifyPaddleWebhook(headers, rawBody, webhookSecret);
    if (!isSignatureValid) {
      console.warn("[Paddle Webhook Warning] Invalid signature signature check failed.");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);
    const eventId = payload.event_id;
    const eventType = payload.event_type;
    const data = payload.data || {};

    // 1. Idempotency Check
    const alreadyProcessed = await db.hasProcessedEvent(eventId, "paddle");
    if (alreadyProcessed) {
      console.log(`[Paddle Webhook Idempotency] Event ${eventId} already processed.`);
      return NextResponse.json({ message: "Event already processed" }, { status: 200 });
    }

    const userId = data.custom_data?.userId || "unknown_user";
    if (userId === "unknown_user" && data.customer_id) {
      // Fallback or skip if user is not known
      console.warn(`[Paddle Webhook Warning] Received event without userId custom_data for customer ${data.customer_id}.`);
    }

    console.log(`[Paddle Webhook] Processing event ${eventId} of type ${eventType} for user ${userId}`);

    // 2. Dispatch events
    switch (eventType) {
      case "transaction.completed": {
        // Create an invoice record
        const invoiceId = data.id || `inv_${Math.random().toString(36).substring(2, 8)}`;
        const amount = data.details?.totals?.grand_total 
          ? parseFloat(data.details.totals.grand_total) / 100 
          : 14.99;
        const currency = data.currency_code || "USD";

        if (userId !== "unknown_user") {
          await db.createInvoice({
            id: invoiceId,
            userId,
            amount,
            currency,
            status: "paid",
            pdfUrl: data.checkout?.url || undefined,
            provider: "paddle"
          });
        }
        break;
      }

      case "subscription.created":
      case "subscription.updated":
      case "subscription.resumed": {
        const subStatus = data.status; // 'active', 'paused', 'past_due', 'trialing', 'canceled'
        const renewalDate = data.current_billing_period?.end || null;
        const planId = data.items?.[0]?.price?.id || null;
        const customerId = data.customer_id || null;
        const subscriptionId = data.id || null;

        // Upgrade status rules
        const isPremium = subStatus === "active" || subStatus === "trialing";
        const subscriptionState = isPremium ? "Premium" : "Free";

        if (userId !== "unknown_user") {
          await db.updateUserSubscription(userId, {
            subscription: subscriptionState,
            paddleCustomerId: customerId,
            paddleSubscriptionId: subscriptionId,
            paddleBillingStatus: subStatus,
            paddleRenewalDate: renewalDate,
            paddlePlanId: planId
          });
          console.log(`[Paddle Webhook Success] Updated user ${userId} to ${subscriptionState} (status: ${subStatus})`);
        }
        break;
      }

      case "subscription.canceled":
      case "subscription.past_due": {
        const subStatus = data.status;
        const customerId = data.customer_id || null;
        const subscriptionId = data.id || null;
        const planId = data.items?.[0]?.price?.id || null;

        // If subscription is past due or cancelled, immediately downgrade or set status
        // In some setups past_due might have a grace period, here we immediately set to Free to enforce billing
        if (userId !== "unknown_user") {
          await db.updateUserSubscription(userId, {
            subscription: "Free",
            paddleCustomerId: customerId,
            paddleSubscriptionId: subscriptionId,
            paddleBillingStatus: subStatus,
            paddleRenewalDate: null,
            paddlePlanId: planId
          });
          console.log(`[Paddle Webhook Downgrade] Downgraded user ${userId} to Free (status: ${subStatus})`);
        }
        break;
      }

      default:
        console.log(`[Paddle Webhook Info] Unhandled event type: ${eventType}`);
        break;
    }

    // 3. Log event as processed to guarantee idempotency
    await db.logProcessedEvent(eventId, "paddle");

    return NextResponse.json({ success: true, eventId });
  } catch (error: any) {
    console.error(`[Paddle Webhook Critical Error] ${error.message}`);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
