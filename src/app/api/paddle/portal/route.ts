import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { db } from "../../../../lib/db";
import { paymentService } from "../../../../lib/payments/paymentService";



export async function GET(request: Request) {
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

    // Get user details from D1
    const user = await db.getUser(userId);
    if (!user || !user.paddle_subscription_id) {
      return NextResponse.json({
        success: false,
        error: "Subscription not found",
        details: "No active subscription details registered in database."
      });
    }

    // Retrieve management URLs dynamically using Paddle API
    const managementUrls = await paymentService.getSubscriptionManagementUrls(
      user.paddle_subscription_id,
      "paddle"
    );

    if (!managementUrls) {
      return NextResponse.json({
        success: false,
        error: "Portal lookup failed",
        details: "Failed to retrieve customer portal links from Paddle."
      });
    }

    return NextResponse.json({
      success: true,
      portalUrl: managementUrls.updatePaymentMethod,
      cancelUrl: managementUrls.cancel
    });
  } catch (error: any) {
    console.error("[Paddle Portal API Error] Real server error:", error);
    return NextResponse.json({
      success: false,
      error: "Internal server error during portal retrieval",
      details: error.message
    });
  }
}
