import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { db } from "../../../../lib/db";

export const runtime = "edge";

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

    // Retrieve user from D1
    const user = await db.getUser(userId);
    if (!user) {
      return NextResponse.json({
        success: false,
        error: "User not found",
        details: `No record found for user with ID ${userId}`
      });
    }

    return NextResponse.json({
      success: true,
      profile: {
        id: user.id,
        email: user.email,
        name: user.name,
        subscription: user.subscription === 'Free' ? 'Not Subscribed' : user.subscription, // 'Not Subscribed' or 'Premium'
        paddleCustomerId: user.paddle_customer_id,
        paddleSubscriptionId: user.paddle_subscription_id,
        paddleBillingStatus: user.paddle_billing_status,
        paddleRenewalDate: user.paddle_renewal_date,
        paddlePlanId: user.paddle_plan_id
      }
    });
  } catch (error: any) {
    console.error("[User Profile API Error] Real server error:", error);
    return NextResponse.json({
      success: false,
      error: "Internal server error during user profile query",
      details: error.message
    });
  }
}
