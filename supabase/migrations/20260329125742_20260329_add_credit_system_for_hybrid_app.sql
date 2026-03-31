/*
  # Add Credit System for Hybrid Local/Cloud Architecture

  1. New Tables
    - `credit_packages` - Define available credit packages (100 CVs €50, 1000 CVs €300)
    - `credit_purchases` - Track user credit purchases

  2. Changes to `companies` table
    - Add `free_cvs_remaining` (initialized to 10)
    - Add `total_credits_purchased` for paid batches
    - Add `total_cvs_processed` for usage tracking
    - Add `app_version` to track desktop app version

  3. Security
    - Enable RLS on new tables
    - Add policies for authenticated users to view own purchases
    - Restrict credit updates to service role only

  4. Important Notes
    - Free CVs: 10 per account on signup
    - Paid packages: 100 CVs €50 or 1000 CVs €300
    - All CV content remains on local machine - only usage counts synced
    - Desktop app calls Stripe directly for payments
*/

-- Create credit_packages table
CREATE TABLE IF NOT EXISTS credit_packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  package_name text NOT NULL UNIQUE,
  cv_count integer NOT NULL,
  price_eur decimal(10, 2) NOT NULL,
  stripe_price_id text,
  created_at timestamptz DEFAULT now()
);

INSERT INTO credit_packages (package_name, cv_count, price_eur)
VALUES 
  ('batch_100', 100, 50.00),
  ('batch_1000', 1000, 300.00)
ON CONFLICT (package_name) DO NOTHING;

-- Create credit_purchases table
CREATE TABLE IF NOT EXISTS credit_purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  package_id uuid NOT NULL REFERENCES credit_packages(id),
  cvs_purchased integer NOT NULL,
  price_eur decimal(10, 2) NOT NULL,
  stripe_payment_id text,
  status text DEFAULT 'pending', -- pending, completed, failed
  purchased_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

-- Add columns to companies if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'companies' AND column_name = 'free_cvs_remaining'
  ) THEN
    ALTER TABLE companies ADD COLUMN free_cvs_remaining integer DEFAULT 10;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'companies' AND column_name = 'total_credits_purchased'
  ) THEN
    ALTER TABLE companies ADD COLUMN total_credits_purchased integer DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'companies' AND column_name = 'total_cvs_processed'
  ) THEN
    ALTER TABLE companies ADD COLUMN total_cvs_processed integer DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'companies' AND column_name = 'app_version'
  ) THEN
    ALTER TABLE companies ADD COLUMN app_version text DEFAULT '1.0.0';
  END IF;
END $$;

-- Enable RLS
ALTER TABLE credit_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_purchases ENABLE ROW LEVEL SECURITY;

-- Create indices
CREATE INDEX IF NOT EXISTS idx_credit_purchases_company_id ON credit_purchases(company_id);
CREATE INDEX IF NOT EXISTS idx_credit_purchases_status ON credit_purchases(status);
CREATE INDEX IF NOT EXISTS idx_credit_purchases_purchased_at ON credit_purchases(purchased_at);

-- RLS Policies for credit_packages (public read)
CREATE POLICY "Anyone can view credit packages"
  ON credit_packages FOR SELECT
  USING (true);

-- RLS Policies for credit_purchases
CREATE POLICY "Users can view own purchases"
  ON credit_purchases FOR SELECT
  TO authenticated
  USING (company_id = auth.uid());

CREATE POLICY "Users can insert own purchases"
  ON credit_purchases FOR INSERT
  TO authenticated
  WITH CHECK (company_id = auth.uid());

-- Service role can update purchases (for Stripe webhook)
CREATE POLICY "Service role can update purchases"
  ON credit_purchases FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);
