import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { db } from "../../../../lib/db";
import { paymentService } from "../../../../lib/payments/paymentService";

export const runtime = "edge";

export async function GET(request: Request) {
  try {
    const { env } = getCloudflareContext();
    const userIdCookie = request.headers.get("Cookie")
      ?.split(";")
      .find((c) => c.trim().startsWith("ls_user_id="));
    
    const userId = userIdCookie ? userIdCookie.split("=")[1].trim() : null;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized user" }, { status: 401 });
    }

    // Get user details from D1
    const user = await db.getUser(userId);
    if (!user || !user.paddle_subscription_id) {
      return NextResponse.json({ error: "No active subscription found for user" }, { status: 404 });
    }

    // Retrieve management URLs dynamically using Paddle API
    const managementUrls = await paymentService.getSubscriptionManagementUrls(
      user.paddle_subscription_id,
      "paddle"
    );

    if (!managementUrls) {
      return NextResponse.json({ error: "Failed to retrieve customer portal links from Paddle" }, { status: 502 });
    }

    return NextResponse.json({
      portalUrl: managementUrls.updatePaymentMethod,
      cancelUrl: managementUrls.cancel
    });
  } catch (error: any) {
    console.error("[Paddle Portal API Error]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
