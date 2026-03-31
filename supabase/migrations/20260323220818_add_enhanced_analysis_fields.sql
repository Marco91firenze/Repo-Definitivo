/*
  # Enhanced CV Analysis Fields

  ## Overview
  Adds fields to support more accurate CV analysis including reasoning transparency,
  experience quality assessment, and structured insights.

  ## Changes to cv_analyses table
  
  1. New Analysis Fields
    - `reasoning_chain` (jsonb): Stores the AI's reasoning process for transparency
    - `key_strengths` (text[]): Array of identified key strengths relevant to the role
    - `gaps` (text[]): Array of identified skill/experience gaps
    - `risk_factors` (text[]): Array of potential concerns or red flags
    - `recommendation` (text): Hiring recommendation (strong_yes/yes/maybe/no/strong_no)
    - `recommendation_reasoning` (text): Detailed reasoning for recommendation
    - `experience_quality_score` (integer): Quality assessment of experience (0-100)
    - `skill_relevance_score` (integer): How relevant skills are to role (0-100)
    - `confidence_level` (integer): AI confidence in assessment (0-100)
    
  2. Enhanced Skill Breakdown
    - `skill_evidence` (jsonb): Evidence from CV supporting each skill assessment
    - `skill_variations_matched` (jsonb): Tracks skill variations found (React vs ReactJS)
*/

-- Add new columns to cv_analyses table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'cv_analyses' AND column_name = 'reasoning_chain'
  ) THEN
    ALTER TABLE cv_analyses ADD COLUMN reasoning_chain jsonb DEFAULT '{}'::jsonb;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'cv_analyses' AND column_name = 'key_strengths'
  ) THEN
    ALTER TABLE cv_analyses ADD COLUMN key_strengths text[] DEFAULT ARRAY[]::text[];
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'cv_analyses' AND column_name = 'gaps'
  ) THEN
    ALTER TABLE cv_analyses ADD COLUMN gaps text[] DEFAULT ARRAY[]::text[];
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'cv_analyses' AND column_name = 'risk_factors'
  ) THEN
    ALTER TABLE cv_analyses ADD COLUMN risk_factors text[] DEFAULT ARRAY[]::text[];
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'cv_analyses' AND column_name = 'recommendation'
  ) THEN
    ALTER TABLE cv_analyses ADD COLUMN recommendation text DEFAULT 'maybe';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'cv_analyses' AND column_name = 'recommendation_reasoning'
  ) THEN
    ALTER TABLE cv_analyses ADD COLUMN recommendation_reasoning text DEFAULT '';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'cv_analyses' AND column_name = 'experience_quality_score'
  ) THEN
    ALTER TABLE cv_analyses ADD COLUMN experience_quality_score integer DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'cv_analyses' AND column_name = 'skill_relevance_score'
  ) THEN
    ALTER TABLE cv_analyses ADD COLUMN skill_relevance_score integer DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'cv_analyses' AND column_name = 'confidence_level'
  ) THEN
    ALTER TABLE cv_analyses ADD COLUMN confidence_level integer DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'cv_analyses' AND column_name = 'skill_evidence'
  ) THEN
    ALTER TABLE cv_analyses ADD COLUMN skill_evidence jsonb DEFAULT '{}'::jsonb;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'cv_analyses' AND column_name = 'skill_variations_matched'
  ) THEN
    ALTER TABLE cv_analyses ADD COLUMN skill_variations_matched jsonb DEFAULT '{}'::jsonb;
  END IF;
END $$;

-- Add constraints for recommendation values
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'cv_analyses_recommendation_check'
  ) THEN
    ALTER TABLE cv_analyses ADD CONSTRAINT cv_analyses_recommendation_check 
      CHECK (recommendation IN ('strong_yes', 'yes', 'maybe', 'no', 'strong_no'));
  END IF;
END $$;

-- Add constraints for score ranges
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'cv_analyses_experience_quality_score_check'
  ) THEN
    ALTER TABLE cv_analyses ADD CONSTRAINT cv_analyses_experience_quality_score_check 
      CHECK (experience_quality_score >= 0 AND experience_quality_score <= 100);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'cv_analyses_skill_relevance_score_check'
  ) THEN
    ALTER TABLE cv_analyses ADD CONSTRAINT cv_analyses_skill_relevance_score_check 
      CHECK (skill_relevance_score >= 0 AND skill_relevance_score <= 100);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'cv_analyses_confidence_level_check'
  ) THEN
    ALTER TABLE cv_analyses ADD CONSTRAINT cv_analyses_confidence_level_check 
      CHECK (confidence_level >= 0 AND confidence_level <= 100);
  END IF;
END $$;