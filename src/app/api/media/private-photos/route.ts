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

    const hasContact = await db.hasEstablishedContact(userId, partnerId);
    if (!hasContact) {
      return NextResponse.json({ success: false, error: "established_contact_required", message: "You must establish contact by sending a message before exchanging private photos." });
    }

    const perm = await db.getPrivatePhotoPermission(partnerId, userId);
    return NextResponse.json({
      success: true,
      status: perm ? perm.status : 'none',
      expiresAt: perm ? perm.expires_at : null
    });
  } catch (error: any) {
    console.error("[Private Photos GET Error]", error);
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

    const { action, partnerId, expiresHours } = await request.json();

    if (!partnerId || !action) {
      return NextResponse.json({ success: false, error: "partnerId and action parameters required" });
    }

    const hasContact = await db.hasEstablishedContact(userId, partnerId);
    if (!hasContact) {
      return NextResponse.json({ success: false, error: "established_contact_required", message: "You must establish contact by sending a message before exchanging private photos." });
    }

    let status = 'none';
    let expiresAt = null;

    if (action === 'request') {
      status = 'requested';
    } else if (action === 'approve') {
      status = 'approved';
      if (expiresHours) {
        expiresAt = new Date(Date.now() + 3600000 * expiresHours).toISOString();
      }
    } else if (action === 'revoke') {
      status = 'revoked';
    }

    await db.updatePrivatePhotoPermission(partnerId, userId, status, expiresAt || undefined);

    return NextResponse.json({
      success: true,
      status,
      expiresAt,
      message: `Private photo action '${action}' completed successfully.`
    });
  } catch (error: any) {
    console.error("[Private Photos POST Error]", error);
    return NextResponse.json({ success: false, error: error.message });
  }
}
