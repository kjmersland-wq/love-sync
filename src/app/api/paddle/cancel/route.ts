import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { db } from "../../../../lib/db";
import { paymentService } from "../../../../lib/payments/paymentService";

export const runtime = "edge";

export async function POST(request: Request) {
  try {
    const userIdCookie = request.headers.get("Cookie")
      ?.split(";")
      .find((c) => c.trim().startsWith("ls_user_id="));
    
    const userId = userIdCookie ? userIdCookie.split("=")[1].trim() : null;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized user" }, { status: 401 });
    }

    // Get user subscription details from D1
    const user = await db.getUser(userId);
    if (!user || !user.paddle_subscription_id) {
      return NextResponse.json({ error: "No active subscription found for user" }, { status: 404 });
    }

    // Call cancel API
    const success = await paymentService.cancelSubscription(
      user.paddle_subscription_id,
      "paddle"
    );

    if (!success) {
      return NextResponse.json({ error: "Failed to cancel subscription on Paddle" }, { status: 502 });
    }

    // Immediately update D1 record status to show cancelled/pending cancellation
    // Note: The webhook will eventually finalize the status, but this provides instant UX feedback.
    await db.updateUserSubscription(userId, {
      subscription: "Premium", // Keep Premium active until current period end
      paddleCustomerId: user.paddle_customer_id,
      paddleSubscriptionId: user.paddle_subscription_id,
      paddleBillingStatus: "canceled", // Update status
      paddleRenewalDate: user.paddle_renewal_date,
      paddlePlanId: user.paddle_plan_id
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[Paddle Cancel API Error]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
