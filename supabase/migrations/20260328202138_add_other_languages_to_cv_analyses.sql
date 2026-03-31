/*
  # Add Other Languages Column

  1. Changes
    - Add `other_languages` text column to cv_analyses table
    - This will store languages other than English that the candidate speaks
    - Format: "Spanish (Fluent), French (Intermediate)" or similar

  2. Notes
    - No RLS changes needed
    - Existing policies remain in effect
*/

-- Add other_languages column to cv_analyses
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'cv_analyses' AND column_name = 'other_languages'
  ) THEN
    ALTER TABLE cv_analyses ADD COLUMN other_languages text DEFAULT '';
  END IF;
END $$;
