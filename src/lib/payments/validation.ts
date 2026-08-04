import { getCloudflareContext } from '@opennextjs/cloudflare';

export interface PaddleConfigStatus {
  isValid: boolean;
  missingKeys: string[];
  values: {
    apiKey: string;
    clientToken: string;
    webhookSecret: string;
    productId: string;
    monthlyPriceId: string;
    yearlyPriceId: string;
    environment: 'sandbox' | 'production';
  };
}

export function validatePaddleConfig(): PaddleConfigStatus {
  let env: Record<string, any> = {};
  
  // 1. Gather all environment variables across Cloudflare Context and process.env
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

  // 2. Map possible variable names to support both NEXT_PUBLIC_ prefixes and standard naming
  const getVal = (key: string): string => {
    return (
      env[key] || 
      env[`NEXT_PUBLIC_${key}`] || 
      env[key.replace('_ID', '')] || 
      env[`NEXT_PUBLIC_${key.replace('_ID', '')}`] ||
      ''
    ).trim();
  };

  const apiKey = getVal('PADDLE_API_KEY');
  const clientToken = getVal('PADDLE_CLIENT_TOKEN');
  const webhookSecret = getVal('PADDLE_WEBHOOK_SECRET');
  
  // Product & Price IDs
  const productId = getVal('PADDLE_PRODUCT_ID') || getVal('PADDLE_PRODUCT');
  const monthlyPriceId = getVal('PADDLE_MONTHLY_PRICE_ID') || getVal('PADDLE_PRICE_MONTHLY_ID') || getVal('PADDLE_PRICE_MONTHLY') || getVal('PADDLE_MONTHLY_PRICE');
  const yearlyPriceId = getVal('PADDLE_YEARLY_PRICE_ID') || getVal('PADDLE_PRICE_YEARLY_ID') || getVal('PADDLE_PRICE_YEARLY') || getVal('PADDLE_YEARLY_PRICE');
  
  // Environment
  const environmentVal = getVal('PADDLE_ENVIRONMENT') || 'sandbox';
  const environment: 'sandbox' | 'production' = 
    environmentVal.toLowerCase() === 'production' ? 'production' : 'sandbox';

  const requiredMapping = {
    PADDLE_API_KEY: apiKey,
    PADDLE_CLIENT_TOKEN: clientToken,
    PADDLE_WEBHOOK_SECRET: webhookSecret,
    PADDLE_PRODUCT_ID: productId,
    PADDLE_MONTHLY_PRICE_ID: monthlyPriceId,
    PADDLE_YEARLY_PRICE_ID: yearlyPriceId,
    PADDLE_ENVIRONMENT: environmentVal
  };

  const missingKeys = Object.entries(requiredMapping)
    .filter(([_, val]) => !val)
    .map(([key]) => key);

  return {
    isValid: missingKeys.length === 0,
    missingKeys,
    values: {
      apiKey,
      clientToken,
      webhookSecret,
      productId,
      monthlyPriceId,
      yearlyPriceId,
      environment
    }
  };
}
