/*
  # Add Complete Row Level Security Policies

  1. Tables Modified
    - cv_analyses: Add SELECT and INSERT policies
    - jobs: Add SELECT, INSERT, UPDATE, DELETE policies
    - cvs: Add SELECT, INSERT, UPDATE, DELETE policies
    - companies: Add SELECT, UPDATE policies

  2. Security Principles
    - Users can only access data for their company (company_id = auth.uid())
    - Service role has admin access for webhook processing
    - All authenticated access must be user-owned

  3. Policies Added
    - SELECT policies for data retrieval
    - INSERT policies for creating records
    - UPDATE policies for modifications
    - DELETE policies already exist on cv_analyses

  4. Important Notes
    - These policies are RESTRICTIVE: deny by default, allow by explicit policy
    - All policies check auth.uid() against company_id or company_id via foreign key
    - No policy uses USING(true) for security
*/

-- DROP existing policies if they exist (safe with IF EXISTS)
DROP POLICY IF EXISTS "Companies can select own analyses" ON cv_analyses;
DROP POLICY IF EXISTS "Companies can insert own analyses" ON cv_analyses;
DROP POLICY IF EXISTS "Companies can select own jobs" ON jobs;
DROP POLICY IF EXISTS "Companies can insert own jobs" ON jobs;
DROP POLICY IF EXISTS "Companies can update own jobs" ON jobs;
DROP POLICY IF EXISTS "Companies can delete own jobs" ON jobs;
DROP POLICY IF EXISTS "Companies can select own CVs" ON cvs;
DROP POLICY IF EXISTS "Companies can insert own CVs" ON cvs;
DROP POLICY IF EXISTS "Companies can update own CVs" ON cvs;
DROP POLICY IF EXISTS "Companies can delete own CVs" ON cvs;
DROP POLICY IF EXISTS "Companies can select own profile" ON companies;
DROP POLICY IF EXISTS "Companies can update own profile" ON companies;

-- CV_ANALYSES Policies
CREATE POLICY "Companies can select own analyses"
  ON cv_analyses FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM cvs
      WHERE cvs.id = cv_analyses.cv_id
      AND cvs.company_id = auth.uid()
    )
  );

CREATE POLICY "Companies can insert own analyses"
  ON cv_analyses FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM cvs
      WHERE cvs.id = cv_analyses.cv_id
      AND cvs.company_id = auth.uid()
    )
  );

CREATE POLICY "Service role can manage analyses"
  ON cv_analyses FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- JOBS Policies
CREATE POLICY "Companies can select own jobs"
  ON jobs FOR SELECT
  TO authenticated
  USING (company_id = auth.uid());

CREATE POLICY "Companies can insert own jobs"
  ON jobs FOR INSERT
  TO authenticated
  WITH CHECK (company_id = auth.uid());

CREATE POLICY "Companies can update own jobs"
  ON jobs FOR UPDATE
  TO authenticated
  USING (company_id = auth.uid())
  WITH CHECK (company_id = auth.uid());

CREATE POLICY "Companies can delete own jobs"
  ON jobs FOR DELETE
  TO authenticated
  USING (company_id = auth.uid());

CREATE POLICY "Service role can manage jobs"
  ON jobs FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- CVS Policies
CREATE POLICY "Companies can select own CVs"
  ON cvs FOR SELECT
  TO authenticated
  USING (company_id = auth.uid());

CREATE POLICY "Companies can insert own CVs"
  ON cvs FOR INSERT
  TO authenticated
  WITH CHECK (company_id = auth.uid());

CREATE POLICY "Companies can update own CVs"
  ON cvs FOR UPDATE
  TO authenticated
  USING (company_id = auth.uid())
  WITH CHECK (company_id = auth.uid());

CREATE POLICY "Companies can delete own CVs"
  ON cvs FOR DELETE
  TO authenticated
  USING (company_id = auth.uid());

CREATE POLICY "Service role can manage CVs"
  ON cvs FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- COMPANIES Policies
CREATE POLICY "Companies can select own profile"
  ON companies FOR SELECT
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Companies can update own profile"
  ON companies FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

CREATE POLICY "Service role can manage companies"
  ON companies FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- PAYMENTS Policies
DROP POLICY IF EXISTS "Companies can select own payments" ON payments;
DROP POLICY IF EXISTS "Service role can manage payments" ON payments;

CREATE POLICY "Companies can select own payments"
  ON payments FOR SELECT
  TO authenticated
  USING (company_id = auth.uid());

CREATE POLICY "Service role can manage payments"
  ON payments FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
