/*
  # Add skill breakdown to CV analyses

  1. Changes
    - Add `skill_breakdown` JSONB column to cv_analyses table to store:
      - Individual skill scores as percentages
      - Detailed assessment for each required skill
  
  2. Security
    - No RLS changes needed (inherits from cv_analyses table)
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'cv_analyses' AND column_name = 'skill_breakdown'
  ) THEN
    ALTER TABLE cv_analyses ADD COLUMN skill_breakdown JSONB DEFAULT '[]'::jsonb;
  END IF;
END $$;