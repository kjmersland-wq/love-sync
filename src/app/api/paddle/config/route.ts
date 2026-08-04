import { NextResponse } from "next/server";
import { validatePaddleConfig } from "../../../../lib/payments/validation";

export const runtime = "edge";

export async function GET() {
  try {
    const config = validatePaddleConfig();
    return NextResponse.json({
      success: true,
      clientToken: config.values.clientToken,
      environment: config.values.environment,
      monthlyPriceId: config.values.monthlyPriceId,
      yearlyPriceId: config.values.yearlyPriceId
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
