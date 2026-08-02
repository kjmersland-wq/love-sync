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
      return NextResponse.json({ error: "Unauthorized user" }, { status: 401 });
    }

    // Retrieve invoices from D1
    const invoices = await db.getInvoices(userId);

    return NextResponse.json({ invoices });
  } catch (error: any) {
    console.error("[Paddle Invoices API Error]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
