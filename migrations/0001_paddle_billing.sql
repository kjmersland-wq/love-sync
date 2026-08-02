-- Migration to add Paddle billing columns to users table in Cloudflare D1
ALTER TABLE users ADD COLUMN paddle_customer_id TEXT;
ALTER TABLE users ADD COLUMN paddle_subscription_id TEXT;
ALTER TABLE users ADD COLUMN paddle_billing_status TEXT;
ALTER TABLE users ADD COLUMN paddle_renewal_date TEXT;
ALTER TABLE users ADD COLUMN paddle_plan_id TEXT;
