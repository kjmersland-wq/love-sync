-- Migration: 0005_drop_paddle.sql
-- Description: Drop legacy Paddle billing columns from users table in Cloudflare D1

ALTER TABLE users DROP COLUMN paddle_customer_id;
ALTER TABLE users DROP COLUMN paddle_subscription_id;
ALTER TABLE users DROP COLUMN paddle_billing_status;
ALTER TABLE users DROP COLUMN paddle_renewal_date;
ALTER TABLE users DROP COLUMN paddle_plan_id;
