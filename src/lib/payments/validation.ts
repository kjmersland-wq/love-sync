import { getCloudflareContext } from '@opennextjs/cloudflare';

export interface StripeConfigStatus {
  isValid: boolean;
  missingKeys: string[];
  values: {
    secretKey: string;
    publishableKey: string;
    webhookSecret: string;
    monthlyPriceId: string;
    yearlyPriceId: string;
  };
}

export function validateStripeConfig(): StripeConfigStatus {
  let env: Record<string, any> = {};
  
  try {
    const context = getCloudflareContext();
    if (context && context.env) {
      env = { ...process.env, ...context.env };
    } else {
      env = process.env;
    }
  } catch (e) {
    env = process.env;
  }

  const getVal = (key: string): string => {
    return (
      env[key] || 
      env[`NEXT_PUBLIC_${key}`] || 
      ''
    ).trim();
  };

  const secretKey = getVal('STRIPE_SECRET_KEY');
  const publishableKey = getVal('STRIPE_PUBLISHABLE_KEY') || getVal('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY');
  const webhookSecret = getVal('STRIPE_WEBHOOK_SECRET');
  const monthlyPriceId = getVal('STRIPE_MONTHLY_PRICE_ID');
  const yearlyPriceId = getVal('STRIPE_YEARLY_PRICE_ID');

  const requiredMapping = {
    STRIPE_SECRET_KEY: secretKey,
    STRIPE_PUBLISHABLE_KEY: publishableKey,
    STRIPE_WEBHOOK_SECRET: webhookSecret,
    STRIPE_MONTHLY_PRICE_ID: monthlyPriceId,
    STRIPE_YEARLY_PRICE_ID: yearlyPriceId,
  };

  const missingKeys = Object.entries(requiredMapping)
    .filter(([_, val]) => !val)
    .map(([key]) => key);

  return {
    isValid: missingKeys.length === 0,
    missingKeys,
    values: {
      secretKey,
      publishableKey,
      webhookSecret,
      monthlyPriceId,
      yearlyPriceId
    }
  };
}
