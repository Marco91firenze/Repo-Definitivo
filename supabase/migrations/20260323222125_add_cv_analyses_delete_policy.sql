/*
  # Add DELETE policy for cv_analyses table

  1. Changes
    - Add DELETE policy to allow companies to delete their own CV analyses
    - Policy checks that the user owns the company through the cvs table relationship

  2. Security
    - Users can only delete analyses for CVs that belong to their company
    - Maintains data isolation between companies
*/

CREATE POLICY "Companies can delete own analyses"
  ON cv_analyses
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM cvs
      WHERE cvs.id = cv_analyses.cv_id
      AND cvs.company_id = auth.uid()
    )
  );
