import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { db } from "../../../../lib/db";



export async function GET(request: Request) {
  try {
    const userIdCookie = request.headers.get("Cookie")
      ?.split(";")
      .find((c) => c.trim().startsWith("ls_user_id="));
    const userId = userIdCookie ? userIdCookie.split("=")[1].trim() : null;

    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized user" });
    }

    const isPremium = await db.isUserPremium(userId);
    if (!isPremium) {
      return NextResponse.json({ success: false, error: "Premium subscription required", requiresSubscription: true });
    }

    const { searchParams } = new URL(request.url);
    const partnerId = searchParams.get("partnerId");

    if (!partnerId) {
      return NextResponse.json({ success: false, error: "partnerId parameter required" });
    }

    const journey = await db.getRelationshipJourney(userId, partnerId);
    return NextResponse.json({ success: true, journey });
  } catch (error: any) {
    console.error("[Relationship Journey GET Error]", error);
    return NextResponse.json({ success: false, error: error.message });
  }
}

export async function POST(request: Request) {
  try {
    const userIdCookie = request.headers.get("Cookie")
      ?.split(";")
      .find((c) => c.trim().startsWith("ls_user_id="));
    const userId = userIdCookie ? userIdCookie.split("=")[1].trim() : null;

    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized user" });
    }

    const isPremium = await db.isUserPremium(userId);
    if (!isPremium) {
      return NextResponse.json({ success: false, error: "Premium subscription required", requiresSubscription: true });
    }

    const body = await request.json();
    const { partnerId, journey } = body;

    if (!partnerId || !journey) {
      return NextResponse.json({ success: false, error: "partnerId and journey data required" });
    }

    await db.saveRelationshipJourney(userId, partnerId, journey);
    return NextResponse.json({ success: true, message: "Relationship journey updated successfully." });
  } catch (error: any) {
    console.error("[Relationship Journey POST Error]", error);
    return NextResponse.json({ success: false, error: error.message });
  }
}
