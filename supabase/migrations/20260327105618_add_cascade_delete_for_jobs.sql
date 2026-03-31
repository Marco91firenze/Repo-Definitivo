/*
  # Add Cascade Delete for Jobs

  1. Changes
    - Drop and recreate foreign key constraints on cvs and cv_analyses tables
    - Add CASCADE DELETE so that deleting a job automatically deletes:
      - All CVs associated with that job
      - All CV analyses associated with that job
    - This ensures data integrity when jobs are removed

  2. Security
    - No changes to RLS policies
    - Existing policies remain in effect
*/

-- Drop existing foreign key constraints
ALTER TABLE IF EXISTS cvs DROP CONSTRAINT IF EXISTS cvs_job_id_fkey;
ALTER TABLE IF EXISTS cv_analyses DROP CONSTRAINT IF EXISTS cv_analyses_job_id_fkey;

-- Recreate constraints with CASCADE DELETE
ALTER TABLE cvs
  ADD CONSTRAINT cvs_job_id_fkey
  FOREIGN KEY (job_id)
  REFERENCES jobs(id)
  ON DELETE CASCADE;

ALTER TABLE cv_analyses
  ADD CONSTRAINT cv_analyses_job_id_fkey
  FOREIGN KEY (job_id)
  REFERENCES jobs(id)
  ON DELETE CASCADE;

-- Also ensure cv_analyses cascades when a CV is deleted
ALTER TABLE IF EXISTS cv_analyses DROP CONSTRAINT IF EXISTS cv_analyses_cv_id_fkey;

ALTER TABLE cv_analyses
  ADD CONSTRAINT cv_analyses_cv_id_fkey
  FOREIGN KEY (cv_id)
  REFERENCES cvs(id)
  ON DELETE CASCADE;
