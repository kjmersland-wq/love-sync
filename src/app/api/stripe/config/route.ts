import { NextResponse } from "next/server";
import { validateStripeConfig } from "../../../../lib/payments/validation";

export async function GET() {
  try {
    const config = validateStripeConfig();
    return NextResponse.json({
      success: true,
      publishableKey: config.values.publishableKey,
      monthlyPriceId: config.values.monthlyPriceId,
      yearlyPriceId: config.values.yearlyPriceId
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
