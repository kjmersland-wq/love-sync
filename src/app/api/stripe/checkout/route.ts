import { NextResponse } from "next/server";
import { paymentService } from "../../../../lib/payments/paymentService";

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

    const body = await request.json().catch(() => ({}));
    const { planId, amount } = body;

    if (!planId) {
      return NextResponse.json({
        success: false,
        error: "planId is required",
        details: "Missing price/plan ID in checkout request."
      });
    }

    const returnUrl = new URL(request.url).origin + "/pricing";

    const session = await paymentService.createCheckoutSession(
      userId,
      planId,
      amount || 14.99,
      "USD",
      returnUrl
    );

    return NextResponse.json({
      success: true,
      transactionId: session.id,
      checkoutUrl: session.url
    });
  } catch (error: any) {
    console.error("[Stripe Checkout API Error]:", error);
    return NextResponse.json({
      success: false,
      error: "Failed to create checkout session",
      details: error.message
    });
  }
}
