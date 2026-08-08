declare global {
  interface CloudflareEnv {
    DB: any;
    STRIPE_SECRET_KEY: string;
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: string;
    STRIPE_WEBHOOK_SECRET: string;
    STRIPE_MONTHLY_PRICE_ID: string;
    STRIPE_YEARLY_PRICE_ID: string;
    ADMIN_SECRET: string;
  }
}

export {};
