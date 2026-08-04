declare global {
  interface CloudflareEnv {
    DB: any;
    PADDLE_API_KEY: string;
    PADDLE_CLIENT_TOKEN: string;
    PADDLE_WEBHOOK_SECRET: string;
    PADDLE_PRODUCT_ID: string;
    PADDLE_ENVIRONMENT: string;
    NEXT_PUBLIC_PADDLE_ENVIRONMENT: string;
    ADMIN_SECRET: string;
  }
}

export {};
