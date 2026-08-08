import { NextResponse } from "next/server";
import { db } from "../../../../lib/db";

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

    const invoices = await db.getInvoices(userId);

    return NextResponse.json({
      success: true,
      invoices
    });
  } catch (error: any) {
    console.error("[Stripe Invoices API Error]:", error);
    return NextResponse.json({
      success: false,
      error: "Internal server error during invoice query",
      details: error.message
    });
  }
}
