import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
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

    const { planId, amount } = await payloadJson(request);

    if (!planId) {
      return NextResponse.json({ error: "planId is required" }, { status: 400 });
    }

    const returnUrl = new URL(request.url).origin + "/pricing";

    // Generate secure transaction session
    const session = await paymentService.createCheckoutSession(
      userId,
      planId,
      amount || 14.99,
      "USD",
      returnUrl,
      "paddle"
    );

    return NextResponse.json({
      transactionId: session.id,
      checkoutUrl: session.url
    });
  } catch (error: any) {
    console.error("[Paddle Checkout API Error]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

async function payloadJson(request: Request) {
  try {
    return await request.json();
  } catch (e) {
    return {};
  }
}
