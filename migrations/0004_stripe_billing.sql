-- Migration: 0004_stripe_billing.sql
-- Description: Add Stripe billing columns to users table in Cloudflare D1

ALTER TABLE users ADD COLUMN stripe_customer_id TEXT;
ALTER TABLE users ADD COLUMN stripe_subscription_id TEXT;
ALTER TABLE users ADD COLUMN stripe_billing_status TEXT;
ALTER TABLE users ADD COLUMN stripe_renewal_date TEXT;
ALTER TABLE users ADD COLUMN stripe_plan_id TEXT;
