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
    const targetUserId = searchParams.get("userId") || userId;

    const verification = await db.getProfessionalVerification(targetUserId);
    return NextResponse.json({ success: true, verification });
  } catch (error: any) {
    console.error("[Verification GET Error]", error);
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

    const { verificationType, status, details } = await request.json();

    if (!verificationType || !status) {
      return NextResponse.json({ success: false, error: "verificationType and status parameters required" });
    }

    await db.saveProfessionalVerification(userId, verificationType, status, details || "");
    return NextResponse.json({ success: true, message: "Professional verification saved successfully." });
  } catch (error: any) {
    console.error("[Verification POST Error]", error);
    return NextResponse.json({ success: false, error: error.message });
  }
}
