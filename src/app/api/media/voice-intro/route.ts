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

    const voiceIntro = await db.getVoiceIntroduction(targetUserId);
    return NextResponse.json({ success: true, voiceIntro });
  } catch (error: any) {
    console.error("[Voice Intro GET Error]", error);
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

    const { voiceUrl, transcript } = await request.json();

    if (!voiceUrl) {
      return NextResponse.json({ success: false, error: "voiceUrl is required" });
    }

    await db.saveVoiceIntroduction(userId, voiceUrl, transcript || "");
    return NextResponse.json({ success: true, message: "Voice introduction saved successfully." });
  } catch (error: any) {
    console.error("[Voice Intro POST Error]", error);
    return NextResponse.json({ success: false, error: error.message });
  }
}
