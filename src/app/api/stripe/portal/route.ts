import { NextResponse } from "next/server";
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

    const returnUrl = new URL(request.url).origin + "/pricing";

    const portalUrl = await paymentService.createPortalSession(userId, returnUrl);

    return NextResponse.json({
      success: true,
      url: portalUrl
    });
  } catch (error: any) {
    console.error("[Stripe Portal API Error]:", error);
    return NextResponse.json({
      success: false,
      error: "Failed to create portal session",
      details: error.message
    });
  }
}
