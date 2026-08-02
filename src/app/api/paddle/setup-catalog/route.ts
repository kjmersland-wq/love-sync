import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export const runtime = "edge";

export async function POST(request: Request) {
  try {
    const { env } = getCloudflareContext();
    const paddleApiKey = env.PADDLE_API_KEY;
    const paddleEnv = env.NEXT_PUBLIC_PADDLE_ENVIRONMENT || "sandbox";
    const adminSecret = env.ADMIN_SECRET || "ls_admin_setup_secret_987";

    const authHeader = request.headers.get("Authorization");
    if (!authHeader || authHeader !== `Bearer ${adminSecret}`) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    if (!paddleApiKey) {
      return NextResponse.json({ error: "PADDLE_API_KEY environment variable is not set" }, { status: 400 });
    }

    const baseUrl = paddleEnv === "sandbox" ? "https://sandbox-api.paddle.com" : "https://api.paddle.com";

    // 1. Create Product
    const productResponse = await fetch(`${baseUrl}/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${paddleApiKey}`
      },
      body: JSON.stringify({
        name: "Love Sync Premium",
        tax_category: "standard",
        description: "Unlock premium international connections, real-time translations, safety ratings, and compatibility overrides."
      })
    });

    if (!productResponse.ok) {
      const errText = await productResponse.text();
      return NextResponse.json({ error: `Failed to create product: ${errText}` }, { status: productResponse.status });
    }

    const productData = await productResponse.json();
    const productId = productData.data.id;

    // 2. Create Monthly Price
    const monthlyPriceResponse = await fetch(`${baseUrl}/prices`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${paddleApiKey}`
      },
      body: JSON.stringify({
        product_id: productId,
        description: "Premium Monthly Subscription",
        name: "Premium Monthly",
        billing_cycle: {
          interval: "month",
          frequency: 1
        },
        trial_period: {
          interval: "day",
          frequency: 7
        },
        unit_price: {
          amount: "1499",
          currency_code: "USD"
        },
        unit_price_overrides: [
          {
            country_codes: ["NO"],
            unit_price: {
              amount: "14900",
              currency_code: "NOK"
            }
          },
          {
            country_codes: ["AT", "BE", "CY", "EE", "FI", "FR", "DE", "GR", "IE", "IT", "LV", "LT", "LU", "MT", "NL", "PT", "SK", "SI", "ES"],
            unit_price: {
              amount: "1499",
              currency_code: "EUR"
            }
          }
        ]
      })
    });

    if (!monthlyPriceResponse.ok) {
      const errText = await monthlyPriceResponse.text();
      return NextResponse.json({ error: `Failed to create monthly price: ${errText}` }, { status: monthlyPriceResponse.status });
    }

    const monthlyPriceData = await monthlyPriceResponse.json();
    const monthlyPriceId = monthlyPriceData.data.id;

    // 3. Create Yearly Price
    const yearlyPriceResponse = await fetch(`${baseUrl}/prices`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${paddleApiKey}`
      },
      body: JSON.stringify({
        product_id: productId,
        description: "Premium Yearly Subscription",
        name: "Premium Yearly",
        billing_cycle: {
          interval: "year",
          frequency: 1
        },
        trial_period: {
          interval: "day",
          frequency: 7
        },
        unit_price: {
          amount: "11900",
          currency_code: "USD"
        },
        unit_price_overrides: [
          {
            country_codes: ["NO"],
            unit_price: {
              amount: "119000",
              currency_code: "NOK"
            }
          },
          {
            country_codes: ["AT", "BE", "CY", "EE", "FI", "FR", "DE", "GR", "IE", "IT", "LV", "LT", "LU", "MT", "NL", "PT", "SK", "SI", "ES"],
            unit_price: {
              amount: "11900",
              currency_code: "EUR"
            }
          }
        ]
      })
    });

    if (!yearlyPriceResponse.ok) {
      const errText = await yearlyPriceResponse.text();
      return NextResponse.json({ error: `Failed to create yearly price: ${errText}` }, { status: yearlyPriceResponse.status });
    }

    const yearlyPriceData = await yearlyPriceResponse.json();
    const yearlyPriceId = yearlyPriceData.data.id;

    return NextResponse.json({
      message: "Paddle Billing Catalog setup completed successfully.",
      productId,
      monthlyPriceId,
      yearlyPriceId
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
