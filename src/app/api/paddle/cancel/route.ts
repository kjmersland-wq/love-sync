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
      return NextResponse.json({
        success: false,
        error: "Unauthorized user",
        details: "No user session cookie found."
      });
    }

    // Get user subscription details from D1
    const user = await db.getUser(userId);
    if (!user || !user.paddle_subscription_id) {
      return NextResponse.json({
        success: false,
        error: "Subscription not found",
        details: "No active subscription details registered in database."
      });
    }

    // Call cancel API
    const success = await paymentService.cancelSubscription(
      user.paddle_subscription_id,
      "paddle"
    );

    if (!success) {
      return NextResponse.json({
        success: false,
        error: "Cancellation failed",
        details: "Failed to request subscription cancellation on Paddle."
      });
    }

    // Immediately update D1 record status to show cancelled/pending cancellation
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
    console.error("[Paddle Cancel API Error] Real server error:", error);
    return NextResponse.json({
      success: false,
      error: "Internal server error during cancellation",
      details: error.message
    });
  }
}
