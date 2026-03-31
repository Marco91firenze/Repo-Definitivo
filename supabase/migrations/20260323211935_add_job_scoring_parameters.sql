/*
  # Add custom scoring parameters to jobs

  1. Changes
    - Add `scoring_parameters` JSONB column to jobs table to store:
      - Custom parameter names (4 parameters)
      - Maximum scores for each parameter
      - Requirements/criteria for each parameter
    - Set default value to maintain backward compatibility
  
  2. Security
    - No RLS changes needed (inherits from jobs table)
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'jobs' AND column_name = 'scoring_parameters'
  ) THEN
    ALTER TABLE jobs ADD COLUMN scoring_parameters JSONB DEFAULT jsonb_build_object(
      'param1', jsonb_build_object('name', 'Experience', 'max_score', 40, 'requirement', ''),
      'param2', jsonb_build_object('name', 'Skills', 'max_score', 30, 'requirement', ''),
      'param3', jsonb_build_object('name', 'Location', 'max_score', 15, 'requirement', ''),
      'param4', jsonb_build_object('name', 'English', 'max_score', 15, 'requirement', '')
    );
  END IF;
END $$;