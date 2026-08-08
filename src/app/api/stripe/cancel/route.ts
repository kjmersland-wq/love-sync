import { NextResponse } from "next/server";
import { paymentService } from "../../../../lib/payments/paymentService";
import { db } from "../../../../lib/db";

export async function POST(request: Request) {
  try {
    const userIdCookie = request.headers.get("Cookie")
      ?.split(";")
      .find((c) => c.trim().startsWith("ls_user_id="));
    
    const userId = userIdCookie ? userIdCookie.split("=")[1].trim() : null;

    if (!userId) {
      return NextResponse.json({
        success: false,
        error: "Unauthorized user",
        details: "No user session cookie found."
      });
    }

    const userProfile = await db.getUser(userId);
    const subId = userProfile?.stripe_subscription_id;

    if (!subId) {
      return NextResponse.json({
        success: false,
        error: "No active subscription found",
        details: "User does not have an active Stripe subscription."
      });
    }

    const success = await paymentService.cancelSubscription(subId);

    if (success) {
      // Local database update: set status to canceled but keep subscription active until renewal date
      await db.updateUserSubscription(userId, {
        subscription: "Premium",
        stripeCustomerId: userProfile.stripe_customer_id,
        stripeSubscriptionId: subId,
        stripeBillingStatus: "canceled",
        stripeRenewalDate: userProfile.stripe_renewal_date,
        stripePlanId: userProfile.stripe_plan_id
      });

      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({
        success: false,
        error: "Cancellation failed",
        details: "Stripe API returned failure status."
      });
    }
  } catch (error: any) {
    console.error("[Stripe Cancel API Error]:", error);
    return NextResponse.json({
      success: false,
      error: "Failed to cancel subscription",
      details: error.message
    });
  }
}
